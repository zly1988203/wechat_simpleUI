var click_tap = isAndroid()?'tap':'click';
var _myIScrollsa;
function getRecordLocation(param){
    $.showLoading();
    $('#adrsResult .current .station-group').empty();
    $('#adrsResult .history').empty();
    $('#adrsResult .recommend .area-list').empty();
    $('#adrsResult .current .station-group').html('');
    $('#adrsResult .history').html('');
    $('#adrsResult .recommend .area-list').html('');
    var url = SERVER_URL_PREFIX+'/hail/innerCity/optimize/queryRegions';
    var dataObj = param;
    dataObj = genReqData(url, dataObj);
    dataObj['token']=$.cookie('token');
    var success_event = function (result) {
        $.hideLoading();
        if(result.code == 0){
            var data = result.data;
            var currList = data.currList;
            if(undefined!= currList && currList.length > 0){
                currList.forEach(function (curr,curr_index) {
                    var $currAdrs= ' <span class="loc_address" ' +
                        'data-regionId="'+curr.regionId+'"' +
                        'data-regionName="'+curr.regionName+'"' +
                        'data-cityAreaId="'+curr.cityAreaId+'"' +
                        'data-provinceAreaId="'+curr.provinceAreaId+'"' +
                        '>'+curr.regionName+'</span>'

                    $('#adrsResult .current .station-group').append($currAdrs);

                    if(undefined != curr.historyList && curr.historyList.length > 0){
                        curr.historyList.forEach(function (hisPlace,his_index) {
                            if(hisPlace.regionId == curr.regionId){
                                var $place = '<div class="place"' +
                                    'data-stationid="' +hisPlace.stationId+'"'+
                                    'data-latitude ="' +hisPlace.latitude +'"'+
                                    'data-longitude ="' +hisPlace.longitude +'"'+
                                    'data-regionName="'+curr.regionName+'"' +
                                    'data-address ="' +hisPlace.address +'"'+
                                    '><i class="icon-place"></i><span>'+hisPlace.address +'</span></div>';
                                $('#adrsResult .history').append($place)
                            }
                        })
                        $('#adrsResult .history').show();
                    }

                    if(undefined != curr.stationList && curr.stationList.length > 0){
                        curr.stationList.forEach(function (station,sta_index) {
                            if(station.regionId == curr.regionId){
                                // var $areaPlace = $('<div class="area-place">');
                                var $place = '<div class="place"' +
                                    'data-stationid="' +station.stationId+'"'+
                                    'data-longitude  ="' +station.gaodeLongitude  +'"'+
                                    'data-latitude ="' +station.gaodeLatitude +'"'+
                                    'data-regionName="'+curr.regionName+'"' +
                                    'data-address ="' +station.stationName +'"'+
                                    '><i class="icon-zan"></i><span>'+station.stationName  +'</span></div>';
                                // $areaPlace.append($place);
                                $('#adrsResult .history').append($place)
                            }
                        })
                        $('#adrsResult .history').show();
                    }

                })
                $('#adrsResult .current').show();
                $('#adrsResult .b-line').show();

            }else {
                $('#adrsResult .current').hide();
                $('#adrsResult .history').hide();
                $('#adrsResult .b-line').hide();
            }
            var openList = data.openMap;
            if(undefined != openList && openList.length > 0){
                openList.forEach(function (openAreaList,index) {
                    var $stationGroup =$('<div class="station-group">');
                    openAreaList.forEach(function(openArea,area_index){
                        if(area_index == 0 ){
                            var $subtitle ='<h5 class="subtitle"' +
                                'data-cityAreaId="'+openArea.cityAreaId+'"' +
                                'data-provinceAreaId="'+openArea.provinceAreaId+'"' +
                                '>'+openArea.cityName +'</h5>';
                        }

                        var $cityArea = '<span class="city-area"' +
                            'data-regionId="'+openArea.regionId+'"' +
                            'data-regionName="'+openArea.regionName+'"' +
                            'data-cityAreaId="'+openArea.cityAreaId+'"' +
                            'data-provinceAreaId="'+openArea.provinceAreaId+'"' +
                            '>'+openArea.regionName+'</span>';

                        var $areaPlace =$('<div class="area-place">');
                        if(undefined != openArea.historyList && openArea.historyList.length > 0){
                            openArea.historyList.forEach(function (hisPlace,his_index) {
                                if(hisPlace.regionId == openArea.regionId){
                                    var $place = '<div class="place"' +
                                        'data-stationid="' +hisPlace.stationId+'"'+
                                        'data-latitude ="' +hisPlace.latitude +'"'+
                                        'data-longitude ="' +hisPlace.longitude +'"'+
                                        'data-regionName="'+openArea.regionName+'"' +
                                        'data-address ="' +hisPlace.address +'"'+
                                        '><i class="icon-place"></i><span>'+hisPlace.address +'</span></div>';
                                    $areaPlace.append($place);
                                }
                            })
                        }

                        if(undefined != openArea.stationList && openArea.stationList.length > 0){
                            openArea.stationList.forEach(function (station,sta_index) {
                                if(station.regionId == openArea.regionId){
                                    var $place = '<div class="place"' +
                                        'data-stationid="' +station.stationId+'"'+
                                        'data-longitude  ="' +station.gaodeLongitude  +'"'+
                                        'data-latitude ="' +station.gaodeLatitude +'"'+
                                        'data-regionName="'+openArea.regionName+'"' +
                                        'data-address ="' +station.stationName +'"'+
                                        '><i class="icon-zan"></i><span>'+station.stationName  +'</span></div>';
                                    $areaPlace.append($place);
                                }
                            })
                        }

                        if($areaPlace.children('div').length > 0){
                            var $pDiv = $('<div class="hasChild"></div>');
                            $pDiv.append($cityArea);
                            $stationGroup.append($pDiv)
                            $stationGroup.append($areaPlace);
                        }else{
                            $stationGroup.append($cityArea);
                        }
                        $('#adrsResult .recommend .area-list').append($subtitle).append($stationGroup);
                    })
                })
                $('#adrsResult .recommend').show();
            }
            cityArea_event();
        }
        $('#search-address .wrapper').css('height', $(window).height() - 60);
        _myIScrollsa = new IScroll('#searchWrapper');
    }

    $.ajaxService({
        url:url,
        data:dataObj,
        success:success_event
    })
}

function cityArea_event() {
    var e_tap = isAndroid()?'tap':'click';
    $('#adrsResult .recommend .city-area').on(e_tap,function () {
        var _this = $(this);
        var regionId = _this.data('regionid');
        var regionName = _this.data('regionname');
        var  cityAreaId = _this.data('cityareaid');
        var areaInfo = {
            regionId:regionId,
            regionName:regionName,
            url:$('#pageUrl').val(),
            stationType:$('#stationType').val()
        }
        window.sessionStorage.setItem('areaInfo',JSON.stringify(areaInfo));
        window.location.href='/hail/innerCity/areaLocation';
    })

    $('#adrsResult .current .loc_address').on(e_tap,function () {
        var _this = $(this);
        var regionId = _this.data('regionid');
        var regionName = _this.data('regionname');
        var  cityAreaId = _this.data('cityareaid');
        var areaInfo = {
            regionId:regionId,
            regionName:regionName,
            url:$('#pageUrl').val(),
            stationType:$('#stationType').val()
        }
        window.sessionStorage.setItem('areaInfo',JSON.stringify(areaInfo));
        window.location.href='/hail/innerCity/areaLocation';
    })


    $('#adrsResult .history .place').on(e_tap,function () {
        var _this = $(this);
        var stationId = _this.data('stationid');
        var latitude = _this.data('latitude');
        var longitude = _this.data('longitude');
        var address = _this.data('address');
        var regionName = _this.data('regionname');
        var data = {
            stationId : stationId,
            latitude : latitude,
            longitude : longitude,
            address : address,
            regionName : regionName,
        }
        $('#search-address').setPopupData(data);
        $('#search-address').closePopup(function() {
            if(_myIScrollsa) {
                _myIScrollsa.destroy();
                _myIScrollsa = null;
            }
            var startAddr = $('#startAddr').val();
            var endendAddr = $('#endAddr').val();
            if(startAddr && endendAddr){
                clearStartTime();
            }
        });

    })

    $('#adrsResult .recommend .place').on(e_tap,function () {
        var _this = $(this);
        var stationId = _this.data('stationid');
        var latitude = _this.data('latitude');
        var  longitude = _this.data('longitude');
        var  address = _this.data('address');
        var regionName = _this.data('regionname');
        var data = {
            stationId : stationId,
            latitude : latitude,
            longitude : longitude,
            address : address,
            regionName : regionName,
        }
        $('#search-address').setPopupData(data);
        $('#search-address').closePopup(function() {
            if(_myIScrollsa) {
                _myIScrollsa.destroy();
                _myIScrollsa = null;
            }
            var startAddr = $('#startAddr').val();
            var endendAddr = $('#endAddr').val();
            if(startAddr && endendAddr){
                clearStartTime();
            }
        });
    })
}

//初始化title
function initTitle() {
    setTimeout(function () {
        var userInfo = JSON.parse(localStorage.getItem("userInfo"));
        var title = '';
        if(null != userInfo){
            providerName = userInfo.providerName;
        }
        serviceNameObj = JSON.parse(localStorage.getItem("serviceNameObj"));
        if(null != serviceNameObj){
            currentServiceName = serviceNameObj.isInterCityOnlineTxt;
            if(!currentServiceName){
                currentServiceName = '城际网约车'
            }
        }
        if(providerName){
            title = currentServiceName + ' - ' + providerName;
        }else{
            title = currentServiceName;
        }
        $('title').html(title);
        $(document).attr("title",title);
    },800);
}

function searchAddressPopup(_this) {
    $('#sarchCancelbtn').hide();
    $('#search-address').popup('push', function() {
        var localLat = $('#startAddr').data('localLat');
        var localLng = $('#startAddr').data('localLng');
        var param = {
            departLat:'',
            departLng:'',
            departAreaCode:'',
            departTitle:'',
            arriveLat:'',
            arriveLng:'',
            arriveAreaCode:'',
            arriveTitle:'',
            stationType:'',
            localLat:localLat,
            localLng:localLng
        }
        if(_this.attr('id') == 'startAddr'){
            //记录出发地和目的地
            $('#stationType').val('start');
            param.departLat = undefined == _this.data('departLat') ? '' : _this.data('departLat');
            param.departLng = undefined == _this.data('departLng') ? '' : _this.data('departLng');
            param.departAreaCode = undefined == _this.data('departAreaCode') ? '0' : _this.data('departAreaCode');
            param.departTitle = undefined == _this.data('departAddress') ? '' : _this.data('departAddress');

            param.arriveLat = undefined ==  $('#endAddr').data('arriveLat') ? 0 : $('#endAddr').data('arriveLat');
            param.arriveLng = undefined ==  $('#endAddr').data('arriveLng') ? 0 : $('#endAddr').data('arriveLng');
            param.arriveAreaCode = undefined == $('#endAddr').data('arriveAreaCode') ? '0' : $('#endAddr').data('arriveAreaCode');
            param.arriveTitle = undefined == $('#endAddr').data('arriveAddress') ? '' : $('#endAddr').data('arriveAddress');
            param.stationType = 1;
            $('title').html('您在哪上车 - ' + providerName);
            $(document).attr("title",'您在哪上车 - ' + providerName);
            $('#searchWrapper .recommend .title').html('已开通区域')
        }else if(_this.attr('id')== 'endAddr'){
            $('#stationType').val('end');
            param.departLat = undefined == $('#startAddr').data('departLat') ? '' : $('#startAddr').data('departLat');
            param.departLng = undefined == $('#startAddr').data('departLng') ? '' : $('#startAddr').data('departLng');
            param.departAreaCode = undefined == $('#startAddr').data('departAreaCode') ? '0' : $('#startAddr').data('departAreaCode');
            param.departTitle = undefined == $('#startAddr').data('departAddress') ? '' : $('#startAddr').data('departAddress');

            param.arriveLat = undefined ==  _this.data('arriveLat') ? 0 : _this.data('arriveLat');
            param.arriveLng = undefined ==  _this.data('arriveLng') ? 0 : _this.data('arriveLng');
            param.arriveAreaCode = undefined == _this.data('arriveAreaCode') ? '0' : _this.data('arriveAreaCode');
            param.arriveTitle = undefined == _this.data('arriveAddress') ? '' : _this.data('arriveAddress');

            param.stationType = 2;
            $('title').html('您要去哪儿 - ' + providerName);
            $(document).attr("title",'您要去哪儿 - ' + providerName);
            $('#searchWrapper .recommend .title').html('可到达区域')
        }
        getRecordLocation(param);
        // setTimeout(function() {
        //     $('#search-address .wrapper').css('height', $(window).height() - 60);
        //     _myIScrollsa = new IScroll('#searchWrapper');
        // },500);
    }, function(data) {
        _this.val(data.regionName+" · "+data.address);
        getlocationAreaCode(data,_this,function (callCarInfo) {
            if(callCarInfo.departAreaCode !=null && callCarInfo.arriveAreaCode !=null){
                window.location.href = '/hail/innerCity/order/innerCityService';
            }
        });
        initTitle();
    });
}

//关闭地址查询
$('#closePanelBtn').on(click_tap, function() {
    $('#search-address').closePopup(function() {
        if(_myIScrollsa) {
            _myIScrollsa.destroy();
            _myIScrollsa = null;
        }
    });
    $('#adrsResult .current').hide();
    $('#adrsResult .history').hide();
    $('#adrsResult .b-line').hide();
    $('#adrsResult .recommend').hide();

    $('#adrsResult .current .station-group').empty();
    $('#adrsResult .history').empty();
    $('#adrsResult .recommend .area-list').empty();
    $('#adrsResult .current .station-group').html('');
    $('#adrsResult .history').html('');
    $('#adrsResult .recommend .area-list').html('');
    initTitle();
});

var cpLock = true;
var  _isInitsa = false;
$('#textSearchMap').focus(function() {
    AMap.service(["AMap.PlaceSearch"], function() {
        var placeSearchOptions = { //构造地点查询类
            pageSize: 8,
            pageIndex: 1,
            city: window.sessionStorage.getItem('cityId'),
            extensions:'all',
            type:'汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|' +
            '医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|' +
            '交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施'
        };

        //地理位置搜索
        placeSearch= new AMap.PlaceSearch(placeSearchOptions);
    });

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
                        city: window.sessionStorage.getItem('cityId'),
                        extensions:'all',
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
                            strHtml += '<li data-areacode="'+list[i].citycode+'" data-name="' + list[i].name + '" data-address="' + list[i].address + '" data-lat="' + list[i].location.lat + '" data-lng="' + list[i].location.lng + '">'+
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
    var url = SERVER_URL_PREFIX + '/hail/innerCity/optimize/getLineAreaByLocation';
    var dataObj = param;
    dataObj = genReqData(url, dataObj);
    dataObj['token']=$.cookie('token');
    var success_event = function (result) {
        if(result.code == 0){
            var data = result.data
            var areaInfo = {
                regionId:data.regionId,
                regionName:data.regionName,
                url:$('#pageUrl').val(),
                stationType:$('#stationType').val(),
                longitude: param.lng,
                latitude:param.lat,
                name:param.name,
            }
            window.sessionStorage.setItem('areaInfo',JSON.stringify(areaInfo));
            window.location.href='/hail/innerCity/areaLocation';
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

function getlocationAreaCode(data,_this,callback) {
    var callCarInfo = JSON.parse(window.sessionStorage.getItem('callCarInfo'));
    if($('#stationType').val() === 'start'){
        _this.data('departAddress',data.address);
        _this.data('departLat',data.latitude);
        _this.data('departLng',data.longitude);
        _this.data('departAreaCode',data.stationId);
        _this.data('departRegionName',data.regionName);
        if(typeof callCarInfo != 'undefined' && null != callCarInfo){
            callCarInfo['departAreaCode'] = data.stationId;
            callCarInfo['departTitle'] = _this.data('departAddress');
            callCarInfo['departLat'] = _this.data('departLat');
            callCarInfo['departLng'] = _this.data('departLng');
            callCarInfo['departRegionName'] = _this.data('departRegionName');
        }else{
            callCarInfo = {
                departAreaCode:data.stationId,
                departTitle:_this.data('departAddress'),
                departLat:_this.data('departLat'),
                departLng:_this.data('departLng'),
                departRegionName:_this.data('departRegionName'),
            }
        }
    }else{
        _this.data('arriveAddress',data.address);
        _this.data('arriveLat',data.latitude);
        _this.data('arriveLng',data.longitude);
        _this.data('arriveAreaCode',data.stationId);
        _this.data('arriveRegionName',data.regionName);
        if(typeof callCarInfo != 'undefined' && null != callCarInfo){
            callCarInfo['arriveAreaCode'] = data.stationId;
            callCarInfo['arriveTitle'] = _this.data('arriveAddress');
            callCarInfo['arriveLat'] = _this.data('arriveLat');
            callCarInfo['arriveLng'] = _this.data('arriveLng');
            callCarInfo['arriveRegionName'] = _this.data('arriveRegionName');
        }else{
            callCarInfo = {
                arriveAreaCode:data.stationId,
                arriveTitle:_this.data('arriveAddress'),
                arriveLat:_this.data('arriveLat'),
                arriveLng:_this.data('arriveLng'),
                arriveRegionName:_this.data('arriveRegionName'),
            }
        }
    }
    window.sessionStorage.setItem('callCarInfo',JSON.stringify(callCarInfo));
    if(callback){
        callback(callCarInfo);
    }
}


//显示搜索结果面板
var showSearchAddressPanel = function() {
    $('#mapResult').show();
    $('#adrsResult').hide();
    $('#sarchCancelbtn').show();
    $('#closePanelBtn').hide();

    if(_isInitsa) return;
    _isInitsa = true;

    //自定义滚动条
    var stY = 0, etY = 0;
    $('#searchWrapper').on('touchstart', function() {
        etY = $(this).scrollTop();
        stY = event.touches[0].pageY;
    });
    $('#searchWrapper').on('touchmove', function(event) {
        var scrollY = stY - event.touches[0].pageY;
        $(this).scrollTop(scrollY + etY);
    });
}

//隐藏搜索结果面板
var hideSearchAddressResult = function() {
    $('#mapResult').hide();
    $('#adrsResult').show();
    $('#sarchCancelbtn').hide();
    $('#closePanelBtn').show();
    $('#textSearchMap').val('');
}

//清空叫车页面数据
function clearStartTime() {
    $('.startTime').data('date','');
    $('.startTime').data('time','');
    $('.startTime').val('');
    $('#amount').val('');
    $('.select-person-main .title .selected').data('value',0);
    $('.select-person-container .title-box .selected').html(0);
    $('.confirm-container .vehicle-switch-box').html('');
}