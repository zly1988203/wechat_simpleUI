var _map,_isInitsa = false, _mapScroll, marker;
var flag = true;//区域内外
var tipMsg = '';
var clickEvent = isAndroid()?'tap':'click';

//title相关数据
var providerName = '';

//兼容安卓
function iScrollClick(){
    if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
    if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
    if (/Silk/i.test(navigator.userAgent)) return false;
    if (/Android/i.test(navigator.userAgent)) {
        var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
        return parseFloat(s[0]+s[3]) < 44 ? false : true
    }
}

var bindScroll = function() {
    if(_mapScroll) {
        _mapScroll.destroy();
    }
        _mapScroll = new IScroll('#mapWrapper', {
            click: true,
            scrollX: false,
            scrollY: true,
            mouseWheel: false,
            tap:true,
            preventDefaultException: { tagName: /^(P|B|H1|H2|DIV|A|INPUT|TEXTAREA|BUTTON|SELECT)$/ }
        });

};

//加载地图
var loadMaps = function(areaInfo) {
    $.showLoading();
    if(_map) return;
    bindScroll();
    _map = new AMap.Map('mapContainer', {
        resizeEnable: true,
        zoom:10,
        // center: [lng, lat]
    });

    var param = {
        regionId:areaInfo.regionId,
        stationType:areaInfo.stationType==='start'?1:2,
        href_url:areaInfo.url
    }
    var searchParam = {
        position : [],
        name:''
    }

    if( undefined != areaInfo.longitude){
        searchParam.position.push(areaInfo.longitude);
        searchParam.position.push(areaInfo.latitude);
        searchParam.name = areaInfo.name;
    }
    var logParam= '<p>searchParam1:--'+ areaInfo.longitude+'---'+areaInfo.latitude+"---"+areaInfo.name+'</p>';
    $('.market-content').append(logParam);

    var url = SERVER_URL_PREFIX +  '/innerCity/optimize/getRegionLineArea';
    var dataObj = param;
    dataObj = genReqData(url, dataObj);
    dataObj['token'] = $.cookie('token');
    $.ajaxService({
        url:url,
        data:dataObj,
        success:function (result) {
            $.hideLoading();
            if(null != result && result.code == 0){
                var data = result.data;
                if(undefined == data.areaList || data.areaList.length <= 0){
                    $.toast('未找到匹配的运营区域');
                    return;
                }
                // data.cityId = '361100';
                $('#cityCode').val(data.cityId);
                var logParam= '<p>cityCode:------------'+ data.cityId+'----------</p>';
                $('.market-content').append(logParam);

                if(data.type == 1){
                    loadPolygonByArea(data.areaList,searchParam);
                }else{
                    loadPolygonByLat(data.areaList,searchParam);
                }
            }else{
                $.alert(result.message);
            }
        }
    })

}

function loadPolygonByLat(areaList,searchParam){
    //搜索点作为初始点
    var position = searchParam.position;
    var polygons = [];
    areaList.forEach(function (itemArr,index) {
        var locationArr = itemArr.locations;
        var lng_latArr = [];
        if(undefined != locationArr && locationArr.length <=0 ){
            $.toast('获取运营区域失败。');
            return;
        }

        //第一个电子围栏的中心点作为初始点
        if(position.length <= 0 && undefined != itemArr.baryCenter && index == 0){
            position = [itemArr.baryCenter.lng,itemArr.baryCenter.lat];
        }
        
        locationArr.forEach(function (item,loca_index) {
            //第一个电子围栏的边界点作为初始点
            if(position.length <= 0 && loca_index == 0){
                position = [item.lng,item.lat];
            }
            lng_latArr.push([item.lng,item.lat]);
        })

        var polygon = new AMap.Polygon({
            map: _map,
            fillOpacity:0.2,
            fillColor: '#6392FE',
            strokeColor: '#6392FE',
            strokeWeight:2,    //线宽
            strokeStyle:"dashed",
            strokeDasharray:[10,5],
            path: lng_latArr
        });
        polygons.push(polygon);
    })

    marker = new AMap.Marker({
        map: _map,
        position: position,
        icon: new AMap.Icon({
            size: new AMap.Size(25, 33.5),
            imageSize: new AMap.Size(25, 33.5),
            image: '/res/images/newInnerCity/icon_marker.png'
        }),
    });

    _map.setFitView();
    //移动结束

    getPositionTips(polygons,searchParam);
    setTimeout(function () {
        //地图异步渲染有延迟，绑定事件需要延迟
        //移动地图，标注固定在中心点
        _map.on('mapmove', function() {
            marker.setPosition(_map.getCenter());
        });

        //回到原点
        $('#currLocation').on(clickEvent, function() {
            _map.panTo(position);
        })

        _map.on('moveend', function() {
            getPositionTips(polygons);
        });
        // searchMaps(searchParam);
    },500)
}

function loadPolygonByArea(areaList,searchParam) {
    var position = searchParam.position;
    var boundsList = [];
    var index = 0;
    if(undefined == areaList || areaList.length <= 0){
        $.toast('未找到匹配的运营区域');
        return;
    }
    //加载行政区划插件
    AMap.service('AMap.DistrictSearch', function() {
        var opts = {
            extensions: 'all',  //返回行政区边界坐标组等具体信息
            level: 'district',  //查询行政级别为 市
            showbiz:false
        };
        //实例化DistrictSearch
        district = new AMap.DistrictSearch(opts);

        for(var i = 0 ;i < areaList.length; i++){
            var item = areaList[i];
            // item.areaCode = '361103';
            //行政区查询
            district.search(item.areaCode, function(status, result) {
                index++ ;
                if(status === 'complete'){
                    var bounds = result.districtList[0].boundaries;
                    var center = result.districtList[0].center;
                    if(position.length <= 0 && index == 1){
                        position = [center.lng,center.lat];
                    }

                    if (bounds) {
                        boundsList.push(bounds);
                    }
                }else {
                    // markerPositon(searchParam,boundsList);
                }
                if(index == areaList.length){
                    markerPositon(searchParam,boundsList,position);
                }
            });

        }

    });
}

function markerPositon(searchParam,boundsList,position) {
    var polygons = [];
    for (var i = 0; i < boundsList.length; i++) {
        var bounds = boundsList[i];
        if(bounds.length > 1){
            for(var n = 0; n < bounds.length; n++){
                var polyPath = bounds[n];
                //生成行政区划polygon
                var polygon = new AMap.Polygon({
                    map: _map,
                    path: polyPath,
                    fillOpacity: 0.2,
                    fillColor: '#6392FE',
                    strokeColor: '#6392FE',
                    strokeWeight:2,    //线宽
                    // strokeColor:"#F00",
                    // strokeOpacity:0.4,
                    // strokeWeight:3,
                    strokeStyle:"dashed",
                    strokeDasharray:[10,5],
                });
                polygons.push(polygon);
            }
        }else {
            //生成行政区划polygon
            var polygon = new AMap.Polygon({
                map: _map,
                path: bounds,
                fillOpacity: 0.2,
                fillColor: '#6392FE',
                strokeColor: '#6392FE',
                strokeWeight:2,    //线宽
                strokeStyle:"dashed",
                strokeDasharray:[10,5],
            });
            polygons.push(polygon);
        }
    }

    marker = new AMap.Marker({
        map: _map,
        icon: new AMap.Icon({
            size: new AMap.Size(25, 33.5),
            imageSize: new AMap.Size(25, 33.5),
            image: '/res/images/newInnerCity/icon_marker.png'
        }),
        // position: [116.169465,39.932670],
    });
    if(position.length > 0){
        marker.setPosition(new AMap.LngLat(position[0],position[1]));
    }else{
        marker.setPosition(_map.getCenter());
    }
    _map.setFitView();
    getPositionTips(polygons,searchParam);
    setTimeout(function () {
        //移动地图，标注固定在中心点
        _map.on('mapmove', function() {
            marker.setPosition(_map.getCenter());
        });
        //回到原点
        $('#currLocation').on(clickEvent, function() {
            _map.panTo(position);
        })
        _map.on('moveend', function() {
            getPositionTips(polygons);
        });
    },500)
}

function getPositionTips(polygons,searchParam){
    var param = {
        polygons:polygons,
        position:'',
        name:''
    }

    if(undefined == searchParam || undefined == searchParam.position || searchParam.position.length <= 0){
        param.position = marker.getPosition();
    }else {
        param.position = searchParam.position;
        param.name = searchParam.name;
    }

    if(polygons.length > 0){
        for(var i=0; i<polygons.length;i++){
            flag =  polygons[i].contains(param.position);
            if(flag == true){
                break;
            }
        }
    }else {
        //不在区域内
        flag = false;
    }

    var content = flag?tipMsg:'不在运营区域内';
    marker.setLabel({
        content: '<div class="mark-label" id="makeCountdowns">'+content+'</div>',
        // offset:new AMap.Pixel(-20,-35)
    });
    var logParam= '<p>searchParam2:--'+ param.position[0]+"---"+param.position[1]+'---'+param.name+'</p>';
    $('.market-content').append(logParam);
    searchMaps(param);
}

//查询地图周边
var searchMaps = function(searchParam) {
    var position = _map.getCenter();
    var keyword = '';
    if(undefined != searchParam){
        position = searchParam.position;
        keyword = searchParam.name;
    }

    var logParam= '<p>keyword:--'+ keyword+"-position[0]--"+position[0]+'---'+position[1]+'</p>';
    $('.market-content').append(logParam);

    var logParam2= '<p>keyword:--'+ keyword+"--position.lat-"+position.lat+'---'+position.lng+'</p>';
    $('.market-content').append(logParam2);

    AMap.service(["AMap.PlaceSearch"], function() {
        var placeSearch = new AMap.PlaceSearch({
            pageSize: 5,
            pageIndex: 1,
            city: $('#cityCode').val(),
            extensions:'all',
            type:'汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务' +
            '|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅' +
            '|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务' +
            '|公司企业|道路附属设施|地名地址信息|公共设施'
        });

        // placeSearch.clear();
        // $('#mapResult').html('');
        placeSearch.searchNearBy(keyword, position, 1000, function(status, result) {
            var logParam2= '<p>status:------------------'+ status+'----------------</p>';
            $('.market-content').append(logParam2);
            if(status == 'error' || status == 'no_data') {
                $('#mapResult').html('<p>没有搜索到地点</p>');
                return;
            }
            var list = result.poiList.pois;
            var strHtml = '';

            for(var i = 0; i < list.length; i++) {
                strHtml += '<li data-areacode="'+list[i].citycode+'" ' +
                    'data-name="' + list[i].name + '" data-address="' + list[i].address + '" ' +
                    'data-lat="' + list[i].location.lat + '" data-lng="' + list[i].location.lng + '" '+
                        (i == 0 && flag == true ? 'class="active"' : '') +'>' +
                    '<div class="sui-cell-map-result">' +
                    '<div class="left">' +
                    '<h1>' + list[i].name + '</h1>' +
                    '<p>' + list[i].address + '</p>' +
                    '</div>' +
                    '<div class="right">' +
                    '<button class="btn-ok">确定</button>' +
                    '</div>' +
                    '</div>' +
                    '</li>';
            }
            $('#mapResult').html(strHtml);
            _mapScroll.refresh();

            $('#mapResult li').on('tap', function(e) {
                // e.stopPropagation();
                $('#mapResult li').removeClass('active');
                var li = $(this);
                var lat = li.data('lat');
                var lng = li.data('lng');
                marker.setPosition(new AMap.LngLat(lng,lat));
                // getPositionTips(searchParam.polygons);
                var isContain = isInPolygons(searchParam.polygons);
                if(isContain == false){
                    li.removeClass('active');
                }else {
                    li.addClass('active');
                }
            });
            //点击确定返回
            btnClick_event();
        });
    });
}

function isInPolygons(polygons) {
    var position = marker.getPosition();

    if(polygons.length > 0){
        for(var i=0; i<polygons.length;i++){
            flag =  polygons[i].contains(position);
            if(flag == true){
                break;
            }
        }
    }else {
        //不在区域内
        flag = false;
    }

    var content = flag?tipMsg:'不在运营区域内';
    marker.setLabel({
        content: '<div class="mark-label" id="makeCountdowns">'+content+'</div>',
        // offset:new AMap.Pixel(-20,-35)
    });

    return flag;
}

var cpLock = true;
$('#textSearchMap').focus(function() {
    showSearchAddressPanel();
}).off('input').on({
    //解决input事件在输入中文时多次触发事件问题
    compositionstart: function () {//中文输入开始
        cpLock = false;
    },
    compositionend: function () {//中文输入结束
        cpLock = true;
    },
    input: function () {//input框中的值发生变化
        setTimeout(function(){
            if(cpLock){
                //输入关键词搜索地图
                var text = $.trim($('#textSearchMap').val());
                AMap.service(["AMap.PlaceSearch"], function() {
                    var placeSearchOptions = { //构造地点查询类
                        pageSize: 8,
                        pageIndex: 1,
                        city: $("#cityCode").val(), //城市
                        extensions:'all',
                        citylimit:true,
                        type:'汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|' +
                        '医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|' +
                        '交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施'
                    };

                    //地理位置搜索
                    placeSearch= new AMap.PlaceSearch(placeSearchOptions);
                    placeSearch.search(text, function(status, result) {
                        var list = [];
                        if(text.length <= 0) status = 'no_data';
                        if(status == 'complete') {
                            list = result.poiList.pois;
                        }

                        var strHtml = '';
                        for(var i = 0; i < list.length; i++) {
                            var name = list[i].name.replace(text, '<span class="imp-blue">' + text + '</span>');
                            var address = list[i].address.replace(text, '<span class="imp-blue">' + text + '</span>');
                            strHtml += '<li data-areacode="'+list[i].citycode+'"  data-name="' + list[i].name + '" data-address="' + list[i].address + '" data-lat="' + list[i].location.lat + '" data-lng="' + list[i].location.lng + '">'+
                                '<div class="sui-cell-map">'+
                                '<div class="address">' + name + '</div>'+
                                '<div class="city-area">' + address + '</div>'+
                                '</div>'+
                                '</li>';
                        }
                        $('#searchWrapper ul').html(strHtml);
                        //_myIScrollsa.refresh();
                        $('#searchWrapper li').off('tap').on('tap', function() {
                            var param = {
                                departLat:0,
                                departLng:0,
                                departAreaCode:0,
                                arriveLat:0,
                                arriveLng:0,
                                arriveAreaCode:0,
                                stationType:$('#stationType').val() === 'start'?1:2,
                                requestUrl:window.location.href,
                                lng:$(this).data('lng'),
                                lat:$(this).data('lat'),
                                name:$(this).data('name')
                            }
                            if($('#stationType').val() === 'start'){
                                param.departLat = $(this).data('lat');
                                param.departLng = $(this).data('lng');
                                param.departAreaCode = $(this).data('areacode');
                            }else {
                                param.arriveLat = $(this).data('lat');
                                param.arriveLng = $(this).data('lng');
                                param.arriveAreaCode = $(this).data('areacode');
                            }
                            loadAreaBylat(param);
                        });
                    });
                });
            }
        },0)
    }
});

function loadAreaBylat(param) {
    var url = SERVER_URL_PREFIX + '/innerCity/optimize/getLineAreaByLocation';
    var dataObj = param;
    dataObj = genReqData(url, dataObj);
    dataObj['token']=$.cookie('token');

    var areaInfo = JSON.parse(sessionStorage.getItem('areaInfo'));
    var locationHref = '/interCityIndex';
    if(null != areaInfo){
        $('#href_url').val(areaInfo.url);
        locationHref = areaInfo.url;
    }
    var success_event = function (result) {
        if(result.code == 0){
            var data = result.data
            var areaInfo = {
                regionId:data.regionId,
                regionName:data.regionName,
                url:locationHref,
                stationType:$('#stationType').val(),
                longitude: param.lng,
                latitude:param.lat,
                name:param.name
            }
            window.sessionStorage.setItem('areaInfo',JSON.stringify(areaInfo));
            window.location.href='/innerCity/areaLocation';
        }else{
            $.toast('对不起，找不到匹配的运营区域');
        }
    }

    $.ajaxService({
        url : url,
        data:dataObj,
        success:success_event,
    })
}


//显示搜索结果面板
var showSearchAddressPanel = function() {
    $('#searchWrapper').show();
    $('.map-panel').hide();
    $('#btnCancel').show();
    $('#backBtn').hide();
    if(_isInitsa) return;
    _isInitsa = true;


    //自定义滚动条
    var stY = 0, etY = 0;
    $('#searchWrapper').on('touchstart', function(e) {
        etY = $(this).scrollTop();
        stY = e.touches[0].pageY;
    });
    $('#searchWrapper').on('touchmove', function(event) {
        var scrollY = stY - event.touches[0].pageY;
        $(this).scrollTop(scrollY + etY);
    });
}

//隐藏搜索结果面板
var hideSearchAddressResult = function() {
    $('#searchWrapper').hide();
    $('.map-panel').show();
    $('#textSearchMap').val('');
    $('#btnCancel').hide();
    $('#backBtn').show();
    // if(dataParam){
    //     loadMaps(lineParam['arriveLng'],lineParam['arriveLat']);
    // }
    // _mapScroll.refresh();
}

//关闭地址查询
$('#btnCancel').on(clickEvent, function() {
    hideSearchAddressResult();
});

//关闭地址查询
$('#backBtn').on(clickEvent, function() {
    window.location.href = $('#href_url').val()
});


$('#setCityButton').on(clickEvent,function () {
    $('#setCityHtml').toggle();
})

function btnClick_event() {
    //点击确定返回
    $('body').on('tap', '#mapResult li .btn-ok', function(e) {
        // $.showLoading("#mapResult button");
        e.stopPropagation();
        var li = $(this).closest('li');
        var callCarInfo = JSON.parse(window.sessionStorage.getItem('callCarInfo'));
        if($('#stationType').val() === 'start'){
            if(typeof callCarInfo != 'undefined' && null != callCarInfo){
                callCarInfo['departAreaCode'] = li.data('areacode');
                callCarInfo['departTitle'] = li.data('name');
                callCarInfo['departLat'] = li.data('lat');
                callCarInfo['departLng'] = li.data('lng');
                callCarInfo['departRegionName'] = $('#setCityHtml').html();
            }else{
                callCarInfo = {
                    departAreaCode:li.data('areacode'),
                    departTitle:li.data('name'),
                    departLat:li.data('lat'),
                    departLng:li.data('lng'),
                    departRegionName:$('#setCityHtml').html()
                }
            }
        }else{
            // $.showLoading("callCarInfo======"+callCarInfo);
            if(typeof callCarInfo != 'undefined' && null != callCarInfo){
                callCarInfo['arriveAreaCode'] = li.data('areacode');
                callCarInfo['arriveTitle'] = li.data('name');
                callCarInfo['arriveLat'] = li.data('lat');
                callCarInfo['arriveLng'] = li.data('lng');
                callCarInfo['arriveRegionName'] = $('#setCityHtml').html();
            }else{
                callCarInfo = {
                    arriveAreaCode:li.data('areacode'),
                    arriveTitle:li.data('name'),
                    arriveLat:li.data('lat'),
                    arriveLng:li.data('lng'),
                    arriveRegionName:$('#setCityHtml').html()
                }
            }
        }

        window.sessionStorage.setItem('callCarInfo',JSON.stringify(callCarInfo));
        /*var url = $('#href_url').val();
        window.location.href = url;*/
        
        setTimeout(function () {
            var url = $('#href_url').val();
            window.location.href = url + '?xxxxid='+(new Date()).getTime();
        }, 20);
        return false;
    });
}

$('#logInfo').on(clickEvent,function () {
    $('.market-rule-container').popup('modal')
})

$('#closePopup').on(clickEvent,function () {
    $('.market-rule-container').closePopup();
});

//初始化title
function initTitle(areaInfo) {
    setTimeout(function () {
        var userInfo = JSON.parse(localStorage.getItem("userInfo"));
        var title = '';
        if(null != userInfo){
            providerName = userInfo.providerName;
        }
        var tips = areaInfo.stationType === 'start'?'您在哪上车':'您要去哪儿';

        if(providerName){
            title = tips + ' - ' + providerName;
        }else{
            title = tips;
        }
        $('title').html(title);
        $(document).attr("title",title);
    },800);
}

var mo=function(e){e.preventDefault();};
function stopBodyMove(){
    $('.map-panel').css('overflow','hidden');
    document.body.style.overflow='hidden';
    document.addEventListener("touchmove",mo,false);//禁止页面滑动
}

$(function () {
    $('#setCityHtml').hide();
    $('#btnCancel').hide();
    var areaInfo = JSON.parse(sessionStorage.getItem('areaInfo'));
    if(null != areaInfo){
        var logInfo= '<p>areaInfo:--'+ areaInfo.regionName+'---'+areaInfo.regionId+"---"+areaInfo.url+'</p>';
        $('.market-content').append(logInfo);
        $('#setCityButton').html(areaInfo.regionName);
        $('#setCityHtml').html(areaInfo.regionName);
        $('#regionId').val(areaInfo.regionId);
        $('#stationType').val(areaInfo.stationType);
        $('#href_url').val(areaInfo.url);
        //直接默认不让滑动
        stopBodyMove();
        loadMaps(areaInfo);
        stopBodyMove();
        // loadPolygonByLat();
        tipMsg = areaInfo.stationType === 'start'?'从这里上车':'从这里下车';
        initTitle(areaInfo);
    }else{
        $.alert('页面出错，为您跳转到首页。',function () {
            //清空缓存
            window.sessionStorage.removeItem('callCarInfo');
            window.location.href = '/interCityIndex';
        })
    }
})

