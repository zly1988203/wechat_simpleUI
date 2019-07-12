var clickEvent = isAndroid()?'tap':'click';
var businessTypes;
var stationType = 1; // 1查询出发地站点  2查询目的地站点
var cityBusInfo ={
    providerId : '',
    providerName : ''
}


function back(){
    pushHistory();
    window.addEventListener("popstate", function(e) {
        wx.closeWindow();
        pushHistory();
    }, false);
}

$("[data-href]").on("clickEvent",function(){
    location.href=$(this).data("href");
});


var lineParam={};//保存起止点的经纬度信息
lineParam["departLng"] = $('#departLng').val();
lineParam["departLat"] = $('#departLat').val();
lineParam["arriveLng"] = $('#arriveLng').val();
lineParam["arriveLat"] = $('#arriveLat').val();

lineParam["departCityId"] = $('#departCityId').val();
lineParam["arriveCityId"] = $('#arriveCityId').val();
lineParam["departCityName"] = $('#departCityName').val();
lineParam["arriveCityName"] = $('#arriveCityName').val();

lineParam["departAreaId"] = $('#departAreaId').val();
lineParam["arriveAreaId"] = $('#arriveAreaId').val();
lineParam["departAreaName"] = $('#departAreaName').val();
lineParam["arriveAreaName"] = $('#arriveAreaName').val();

$('#startAddr').val($('#startAddress').val());
$('#endAddr').val($('#endAddress').val());

var historyData = {}; // 保存搜索历史记录

function searchLine(){
    if (((lineParam["departLng"]!='' && lineParam["departLat"]!='') || lineParam["departAreaId"])
        && ((lineParam["arriveLng"]!='' && lineParam["arriveLat"]!='') || lineParam["arriveAreaId"])){
        // 进入搜索线路
        forwardSearch();
    }
}

//后台搜索高德地址后回调
var searchMapAddCallback=function searchAddressCallback(data){

    var cityCode = data.addressComponent.citycode;
    $('#setCityButton').html(data.cityName);
    $('.current-city span').html(data.cityName);
    $("#areaCode").val(cityCode);
    $("#currAreaCode").val(cityCode);

    var addressHtml = data.address+"#"+data.addressComponent.province+data.addressComponent.city+data.addressComponent.district+data.addressComponent.township+data.addressComponent.streetNumber.street+data.addressComponent.streetNumber.number+"#"+data.city;
    $('#currentAddressDetail').attr('data-address',addressHtml);
    $('#currentAddressDetail').attr('data-city',data.cityName);
    $('#currentAddressDetail').attr('data-area',data.areaName);
    $('#currentAddressDetail').attr('data-cityId',data.cityId);
    $('#currentAddressDetail').attr('data-areaId',data.areaId);
    $('#currentAddressDetail').html(data.address);
    $('.startAddr').val(data.city + ' · ' +data.address);
    $('.gather').show();
    $('#currentAddress').show();
}

//定位是否成功
var isLocation = false;
//根据gps获取地理位置
var getGpsCallback=function getAddressByGps(callbackData){
    if(callbackData['flag'] == false){
        isLocation = false;
        return;
    }
    var gpsData = callbackData['longitude']+","+callbackData['latitude'];
    $('#currentAddressDetail').attr('data-lng',callbackData['longitude']); //经度
    $('#currentAddressDetail').attr('data-lat',callbackData['latitude']); //纬度
    searchAddressByGps(gpsData,searchMapAddCallback);
}

function getElementToPageTop(el) {
    if(el.parentElement) {
        return getElementToPageTop(el.parentElement) + el.offsetTop
    }
    return el.offsetTop
}

function setFooterPosition() {
    $('footer').hide();
    setTimeout(function () {
        var body = document.documentElement.clientHeight;
        var heightTop = getElementToPageTop(document.getElementById('heightPoint'));
        if ((heightTop+170) >= body){
            $('footer').css({'position':'relative','margin-top': '2rem'});
        }else {
            $('footer').css({'position':'fixed'});
        }
        $('footer').show();
    },200)
}

function getAdList() {
    var succ_event = function (res) {
        if(res.code == 0){
            var adList = res.data.list;
            if(adList.length == 0){
                $('#swpBanner').hide(); // 隐藏行程
                return;
            }
            $('#swpBanner').show(); // 隐藏行程
            drawAdList(adList);
        }
    }
    
    var err_event = function (e) {
        
    }

    var param = {
        provider_id:cityBusInfo.providerId,
        position_code:'index-top',
        operator_id:$.cookie('token')
    }
    var url = "https://"+ adDomain + '/pub/ad/getAdList';
    $.ajaxService({
        url:url,
        data:param,
        success:succ_event,
        error:err_event,
    })

}
function  drawAdList(adList) {
    adList.forEach(function (item,index) {
        var slideHtml = '<div class="swiper-slide" data-id="'+item.id+'" data-href='+item.target_url+'>' +
            '<a class="vert-href" href="javascript:void(0)" data-href='+item.target_url+'>' +
            '<img width="100%" height="100%" src='+item.img_url+'>' +
            '</a>' +
            '</div>';
        $('#swpBanner .swiper-wrapper').append(slideHtml);
    })
    swAdList(adList);
}
function swAdList(adList){
    /** 轮播图*/
    var mySwiper = new Swiper('#swpBanner .swiper-container', {
        spaceBetween: 10,
        pagination: {
            el: '#swpBanner .swiper-pagination',
        },
    });

    if(adList.length == 1){
        $('#swpBanner .swiper-pagination').hide();
    }else {
        $('#swpBanner .swiper-pagination').show();
    }

    $('#swpBanner .swiper-container .swiper-slide').on('click mousedown', function(e) {
        var _this =$(this);
        var param = {
            id:_this.data('id'),
            operator_id:""
        }
        var adUrl = _this.data('href');
        adClicked(param);
        window.location = adUrl;
    })
}
function adClicked(param) {
    var succ_event = function (res) {

    }
    var url = "https://"+ adDomain + '/pub/ad/clicked';
    $.ajaxService({
        url:url,
        data:param,
        success:succ_event
    })
    
}

function getHotLineList() {
    var succ_event = function (res) {
        if(res.code == 0){
            var hotLineList = res.data.hotLineList;
            if(hotLineList.length == 0){
                $('#hotLine').hide(); // 隐藏行程
                return;
            }
            $('#hotLine').show(); // 隐藏行程
            drawHotLineList(hotLineList);

        }
        setFooterPosition();
    }

    var param = {
        lineType:1
    }

    var url = SERVER_URL_PREFIX +'/bus/getHotLine';
    $.ajaxService({
        url:url,
        data:param,
        success:succ_event
    })
}
function  drawHotLineList(hotLineList) {
    hotLineList.forEach(function (item,index) {
        var icon = '';
        if(item.haveSpeacial == 1){
            icon = '<span class="icon iconfont icon-Special_price_icon"></span>';
        }
        var lineHtml = '<div class="hotline" haveSpeacial="'+item.haveSpeacial+'" lineId="'+item.id+'" ' +
            '               lineName="'+item.lineName+'">' +icon+ item.lineName+''+
            '                    </div>';
        $('#hotLine .line-list').append(lineHtml);
    })

    var hotLineClickEvent = function () {
        $(".hotline").on(clickEvent,function() {
            // lineType 1.定制  2.通勤 3旅游'
            var lineId = $(this).attr("lineid");
            var lineName = $(this).attr('lineName');
            if (undefined != lineName && lineName != ''){
                window.location="/cityBus/lineListCityBus?lineId=" + lineId +"&searchType=1&lineName=" + lineName;
            }
        });
    }

    hotLineClickEvent();
}

function initPage(){
    localStorage.removeItem('selectedCoupon');
    sessionStorage.removeItem('localIdCardInfo');
    localStorage.removeItem('activeDay');
    //配置文件里面取值
    if(''!= USERINFO){
        var userInfo = JSON.parse(USERINFO);
        var providerInfo = userInfo.provider;
        cityBusInfo.providerId = providerInfo.providerId;
        cityBusInfo.providerName = providerInfo.providerName;
    }else {
        setTimeout(function () {
                var providerInfo = localStorage.getItem('providerInfo');
                cityBusInfo.providerId = providerInfo.providerId;
                cityBusInfo.providerName = providerInfo.providerName;
            }
            ,1000)
    }

    if('' != BUSINESSTYPE){
         businessTypes = JSON.parse(BUSINESSTYPE);
        $('title').html(businessTypes.commuteTxt+'-'+cityBusInfo.providerName);
    }else {
        setTimeout(function () {
                 businessTypes = localStorage.getItem('businessTypes');
                $('title').html(businessTypes.commuteTxt+'-'+cityBusInfo.providerName);
            }
            ,1000)
    }


    // 搜索
    searchLine();

    getBusinessTypes("busCity"); // 暂时用busCity

    querySchedule();    // 查询最近行程
    queryNearOrder();   // 查询最近订单
    getAdList();
    getHotLineList();

    // 自动定位
    AMap.plugin('AMap.Geocoder',function(){
        if(lineParam["departCityName"] == '') {
            var param = {
                businessName: businessTypes.busTxt,
                url:window.location.href,
            }
            shareCommon(param,getGpsCallback);
        }
    })

    // ================================= 选择地址相关 ===================================
    // 选择地址
    var _isInitsa = false, _myIScrollsa;
    $('.select-city-btn').on('click', function() {
        $('.searchResultNo').hide();
        var _this = $(this);
        checkCityIsOpen();
        $('#search-address .search-input input').val(''); // 初始化为空
        if(_this.attr('id') == 'startAddr'){
            $('#startCity').show();
            $('#endCity').hide();
            stationType = 1;
            // 设置title
            $('title').html("你从哪出发-"+cityBusInfo.providerName);
            $('#setCityButton .search-input input').attr('placeholder','搜索起点地址')
        }else{
            $('#startCity').hide();
            $('#endCity').show();
            stationType = 2;
            $('title').html("你想到哪儿-"+cityBusInfo.providerName);
            $('#setCityButton .search-input input').attr('placeholder','搜索终点地址')
            $('#currentAddress').hide();
        }

        getSearchRecord(); // 显示历史搜索
        getCityAndArea();//获取车企开通的城市区域


        $('#search-address').popup('push', function() {
            // setTimeout(function() {
            //     $('#search-address .wrapper').css('height', $(window).height() - 60);
            //     _myIScrollsa = new IScroll('#searchWrapper');
            // }, 300);
        }, function(data) {
            _this.val(data.name);
            if(_this.attr('id') == 'startAddr'){
                data.lng == undefined ? lineParam['departLng'] = 0 : lineParam['departLng'] = data.lng;
                data.lat == undefined ? lineParam['departLat'] = 0 : lineParam['departLat'] = data.lat;
                data.areaId == undefined ? lineParam['departAreaId'] = 0 : lineParam['departAreaId'] = data.areaId;
            }else if(_this.attr('id')== 'endAddr'){
                data.lng == undefined ? lineParam['arriveLng'] = 0 : lineParam['arriveLng'] = data.lng;
                data.lat == undefined ? lineParam['arriveLat'] = 0 : lineParam['arriveLat'] = data.lat;
                data.areaId == undefined ? lineParam['arriveAreaId'] = 0 : lineParam['arriveAreaId'] = data.areaId;
            }
            searchLine();
        });
    }).backtrack({
        cancel: '#search-address #closeBtn',
        event: 'click'
    });

    //关闭地址查询
    $('#search-address #closeBtn').on('click', function() {
        $('title').html(businessTypes.busTxt + '-'+cityBusInfo.providerName);
        $('#search-address').closePopup(function() {
            if(_myIScrollsa) {
                _isInitsa = false;
                _myIScrollsa.destroy();
                _myIScrollsa = null;
            }
        });
    });

    $(".hotline").on(clickEvent,function() {
        // lineType 1.定制  2.通勤 3旅游'
        var lineId = $(this).attr("lineid");
        var lineName = $(this).attr('lineName');
        if (undefined != lineName && lineName != ''){
            window.location="/cityBus/lineListCityBus?lineId=" + lineId + "&&token="+$.cookie("token") +
                "&&lng=" + lineParam.departLng + "&&lat=" + lineParam.departLat+
                "&lineName="+lineName+"&lineType=1";
        }
    });

    //关键词搜索结果 - new (动态生成HTML并绑定事件)
    var cpLock = true;
    $('#search-address .search-input input').focus(function() {
        showSearchAddressPanel();
    }).off('input').on({
        //解决input事件在输入中文时多次触发事件问题
        compositionstart: function () {//中文输入开始
            cpLock = false;
        },
        compositionend: function () {//中文输入结束
            cpLock = true;
        },
        input:function () {
            $(this).blur(function () {
                $(this).blur();
                cpLock = true;
            })
            setTimeout(function () {
                if(cpLock){
                    var searchLocation=$('.search-input input').val();
                    searchAddress(searchLocation);
                }
            },0);
        }
    });

    //显示搜索结果面板
    var showSearchAddressPanel = function() {
        $('#searchResult').html('');
        $('#searchResult').show();
        $('.gather').hide();

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

    //搜索地址
    function searchAddress(param){
        $('#search-address #closeBtn').hide();
        $('#search-address #cancelBtn').show();
        var gather = $('.gather');
        if($.trim(param) != '') {
            //内容不为空，隐藏下面的信息
            gather.hide();

            AMap.service(["AMap.PlaceSearch"], function() {
                var placeSearchOptions = { //构造地点查询类
                    pageSize: 10,
                    pageIndex: 1,
                    city: $("#areaCode").val(), //城市
                    extensions:'all',
                    type:'汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|' +
                    '医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|' +
                    '交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施'
                };

                //地理位置搜索
                var placeSearch= new AMap.PlaceSearch(placeSearchOptions);
                placeSearch.search(param, callback);
            });
            $('.searchResultNo').hide();
        } else {
            // gather.show();
            $(".searchResultNo").hide();
            $('#searchResult').html('');
        }
    }

    //关键字查询，您如果想修改结果展现效果，请参考页面：http://lbs.amap.com/fn/css-style/
    function callback(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            parseSearchResult(result.poiList.pois);
        }else{
            $('#searchResult').css("font-size","20px");
            $('#searchResult').hide();
            $('.searchResultNo').show();
        }
    }

    function parseSearchResult(result){
        var inputText = $('#search-address .search-input input').val();
        if($.trim(inputText) == ''){
            return false;
        }
        var strHtml = '';
        if(result.length>0){
            for(var i = 0; i < result.length; i++) {

                strHtml += '<li class="sui-border-b">' +
                    '<div class="sui-cell-map">' +
                    '<h1 data-areaId="'+result[i].adcode+
                    '" data-lng="'+result[i].location.lng+
                    '" data-lat="'+result[i].location.lat+
                    '">'+result[i].name+'</h1>' +
                    '<h2 data-city="'+result[i].cityname+
                    '" data-area="'+result[i].adname+'">'+result[i].pname+result[i].cityname+result[i].adname+result[i].address+'</h2>' +
                    '</div>' +
                    '</li>';
            }
            $('#searchResult').show().html(strHtml);

            // 给搜索文字特殊显示
            $('#searchResult').find('li').each(function () {
                var selfText = $(this).find('h1').text();
                var reg = new RegExp(inputText,"g")
                selfText = selfText.replace(reg,'<span style="color: #6392FE;">'+inputText+'</span>');
                $(this).find('h1').html(selfText);

                var selfText = $(this).find('h2').text();
                selfText = selfText.replace(reg,'<span style="color: #6392FE;">'+inputText+'</span>');
                $(this).find('h2').html(selfText);
            })
            //添加点击事件
            searchClickEvent();
            // 这句不能少，否则超出屏幕不能滚动。
            if(_myIScrollsa) _myIScrollsa.refresh();
        }
    }

    // ================================= 选择城市相关 ===================================
    // 打开选择城市
    var _myIScrollsc;
    var bindScrollsc = function(el) {
        if(_myIScrollsc) {
            _myIScrollsc.destroy();
            _myIScrollsc = null;
        }
        setTimeout(function() {
            _myIScrollsc = new IScroll(el + ' .wrapper');

            retrieveWord(function (el) {
                _myIScrollsc.scrollToElement(el.attr('href'));
            });

            // 这句不能少，否则超出屏幕不能滚动。
            if(_myIScrollsc) _myIScrollsc.refresh();
        }, 300);
    }


    $('#cityWrapper').each(function () {
        $(this).css('height', ($(window).height() - 10));
    });

    $('#setCityButton').on(clickEvent, function() {
        var _this = $(this);
        // $('title').html("你要去哪-"+cityBusInfo.providerName);
        clearCities();
        $('#select-Citys').popup('push', function() {
            initCity(function () {
                bindScrollsc('#select-Citys');
            });
        }, function(data) {
            _this.text(data);
        });
    });

    /* 字母快速检索 */
    function retrieveWord(callback) {
        var $city = $('.nav-city'),
            $city_li = $city.find('li');
        var city_h = 0;

        $city_li.each(function () {
            city_h += $(this).height();
        });

        $city.css('height', city_h);

        $('.nav-city a').on(clickEvent, function (e) {
            e.preventDefault();

            /*弹窗*/
            var text = $(this).text();
            $('.pop-special').text(text).fadeIn().css('opacity','0.6');
            setTimeout(function () {
                $('.pop-special').fadeOut();
            },1200);

            if(callback instanceof Function) {
                callback($(this));
            }
        });
    }

    // 关闭选择城市
    $('#select-Citys #closeCity').on('click', function() {
        if (stationType == 1){
            $('title').html("你从哪出发-"+cityBusInfo.providerName);
        }else if (stationType == 2){
            $('title').html("你想到哪儿-"+cityBusInfo.providerName);
        }
        $('#select-Citys').closePopup(function() {
            if(_myIScrollsc) {
                _myIScrollsc.destroy();
                _myIScrollsc = null;
            }
        });
    });

    // 取消搜索
    $('#search-address #cancelBtn').on('click', function() {
        $('#searchResult').html('');
        $('.searchResultNo').hide();
        $('#searchWrapper .gather').show();
        $('#search-address #closeBtn').show();
        $('#search-address .search-input input').val(''); // 初始化为空
        $(this).hide();
    });

    // 获取城市列表
    function initCity(callback){
        var paramList = {
            providerId: cityBusInfo.providerId,
            token:$.cookie('token'),
            stationType: stationType,
        }
        $.showLoading();
        $.ajax({
            type: 'POST',
            url: SERVER_URL_PREFIX + '/busline/optimized/getOpenCitys',
            data: paramList,
            dataType:  'json',
            success: function(data){
                $.hideLoading();
                var i = 0;
                if(data !=null && data.code==0){
                    cityList = data.data;
                    var html = "";
                    if(cityList.length == 0){
                        return;
                    }
                    htmlSub(cityList);
                }
                if(typeof callback == 'function'){
                    callback();
                }
            }
        });
    }

    function htmlSub(cityList){
        var html="";
        for(i= 0;i<cityList.length;i++){
            var city = cityList[i];
            if($('#city'+city.firstLetter+'').length>0){
                if($('#'+city.name).length<=0){
                    html = '<li id="'+city.name+'" data-area-code="'+city.areaCode+'" data-city-id="'+city.areaId+'">'+city.name+"</li>" ;
                    $("#city"+city.firstLetter+'').append(html);
                }
            }else{
                html = '<div class="sui-list-title" id="#city'+city.firstLetter+'">'+city.firstLetter+'</div>'+
                    '<ul id="city'+city.firstLetter+'" class="sui-list"><li id="'+city.name+'" ' +
                    'data-area-code="'+city.areaCode+'" data-city-id="'+city.areaId+'">'+city.name+"</li></ui>" ;
                $("#cityList").append(html);

                var cityHtml='<li><a href="#city'+city.firstLetter+'">'+city.firstLetter+'</a></li>';
                $('.nav-city').append(cityHtml);
            }

            $('#cityList li').off('tap').on('tap', function() {
                $('#searchResult').html('');
                $('.search-input input').val('');
                var areaCode = $(this).data('area-code');
                var cityId = $(this).data('city-id');
                var text = $(this).text();
                $("#areaCode").val(areaCode);
                $("#cityId").val(cityId);
                if (stationType == 1){
                    $('title').html("你从哪出发-"+cityBusInfo.providerName);
                }else if (stationType == 2){
                    $('title').html("你想到哪儿-"+cityBusInfo.providerName);
                }

                //重新恢复搜索框功能
                $('.search-bar .search-input').css('background','#FFFFFF');
                $('.search-bar .search-input input').css('background','#FFFFFF');
                $('.search-bar .search-input input').val('').removeAttr("disabled");
                $('#currentAddress').hide();
                $('#select-Citys').setPopupData(text);
                $('#select-Citys').closePopup(function() {
                    if(_myIScrollsc) {
                        _myIScrollsc.destroy();
                        _myIScrollsc = null;
                    }
                });
            });
        }


    }

    function clearCities() {
        var $parent = $('#cityWrapper #cityList');
        $parent.html('');
        var initCity = '<div class="current-city">当前定位所在城市：<span>深圳市</span></div><input type="hidden" id="currAreaCode" value="0755">';
        $parent.append(initCity);
        $('#select-Citys .nav-city').html('');
    }

    /**
     * 获取并填充历史记录
     */
    function showHistoryInfo(param){
        var strHtml = '';
        $('#searchResult').html('');
        $('#historyAddress').html('');

        if (param.length != 0) {
            for(var i=0;i<param.length;i++){
                var addressContent = param[i];
                var address = addressContent.address.split('#');
                strHtml += '<div class="address" data-areaId="'+addressContent.areaId+
                    '" data-lng="'+addressContent.longitude+
                    '" data-city="'+address[2]+
                    '" data-area="'+address[3]+
                    '" data-lat="'+addressContent.latitude+'"' +
                    ' data-city-id="'+addressContent.cityId+'">\n' +
                    '    <div class="address-name">'+address[0]+'</div>\n' +
                    '    <div class="address-detail">'+address[1]+'</div>\n' +
                    '</div>'
            }
            $('.gather').show();
            $('#historyAddress').html(strHtml);
            $('#historySearch').show();

            //添加点击事件
            searchClickEvent();
            // 这句不能少，否则超出屏幕不能滚动。
            if(_myIScrollsa) _myIScrollsa.refresh();
        }else{
            $('#historySearch').hide();
        }

        var isCurrAddress = $('#currentAddress').is(':hidden');
        var isShowHistory = $('#historySearch').is(':hidden');
    }

    function searchClickEvent(){
        var targetType = isAndroid() ? 'tap' : 'click';

        //点击历史记录返回首页
        $('.address').on(targetType, function () {
            var data = {};
            data['city'] = $(this).data('city');
            data['areaName'] = $(this).data('area');

            data['name'] = $(this).data('city') + ' · ' + $(this).find('.address-name').text();
            data['address'] = $(this).find('.address-detail').text();
            data['lng'] = $(this).data('lng');
            data['lat'] = $(this).data('lat');
            data['areaId'] = $(this).data('areaid');
            data['cityId'] = $(this).data('city-id');

            if (stationType == 1){
                lineParam['departAreaName'] = data['areaName'];
                lineParam['departCityName'] = data['city'];
            }
            if (stationType == 2){
                lineParam['arriveAreaName'] = data['areaName'];
                lineParam['arriveCityName'] = data['city'];
            }

            $('title').html(businessTypes.busTxt + '-'+cityBusInfo.providerName);
            $('#search-address').setPopupData(data);
            $('#search-address #closeBtn').triggerHandler('click');
        });

        // 点击搜索结果返回
        $('#searchResult').children('li').off('tap').on('tap', function() {
            if($(this).text() == '清空历史记录'){
                $('#searchResult').html('');
            }else{
                var data = {};
                data['name'] = $(this).find('h2').data('city') + ' · ' + $(this).find('h1').text();
                data['address'] = $(this).find('h2').text();
                data['lng'] = $(this).find('h1').data('lng');
                data['lat'] = $(this).find('h1').data('lat');
                data['city'] = $(this).find('h2').data('city');
                data['areaName'] = $(this).find('h2').data('area');
                data['areaId'] = $(this).find('h1').data('areaid');

                if (stationType == 1){
                    historyData["departLng"] = data['lng'];
                    historyData["departLat"] = data['lat'];
                    historyData["departCity"] = data['city'];
                    historyData["departName"] = $(this).find('h1').text();
                    historyData["departAddress"] = data['address'];

                    historyData["departArea"] = data['areaName'];
                    lineParam['departAreaName'] = data['areaName'];
                    lineParam['departCityName'] = data['city'];
                }
                if (stationType == 2){
                    historyData["arriveLng"] = data['lng'];
                    historyData["arriveLat"] = data['lat'];
                    historyData["arriveCity"] = data['city'];
                    historyData["arriveName"] = $(this).find('h1').text();
                    historyData["arriveAddress"] = data['address'];

                    historyData["arriveArea"] = data['areaName'];
                    lineParam['arriveAreaName'] = data['areaName'];
                    lineParam['arriveCityName'] = data['city'];
                }

                if (data['name'] != null) {
                    $('.sui-cell-map').remove();
                    $('#searchResult .search-input input').val('');
                    saveSearchRecord();
                    $('title').html(businessTypes.busTxt + '-'+cityBusInfo.providerName);
                    $('#search-address').setPopupData(data).closePopup();
                    $('#searchResult').hide();
                }
            }
        });
    }

    /*用户历史搜索站点保存*/
    function saveSearchRecord(isLocation){
        var addressType;
        if(isLocation == 0){
            addressType = historyData.address;
        }else{
            addressType = historyData.departName+'#'+historyData.departAddress+'#'+historyData.departCity+'#'+historyData.departArea;
        }
        var url = SERVER_URL_PREFIX + '/busline/optimized/saveSearchStation';
        var paramList = {
            token:$.cookie('token'),
            lat: historyData.departLat,
            lng:  historyData.departLng,
            address: addressType,
            businessType:4,  // 定制班线：4
            //stationType: 1, // 只保存出发地信息1 ，只保存目的地信息2，两个都保存传3
        }
        // if (historyData.departName != null){
        //     paramList.stationType = 1;
        // }
        // if (historyData.arriveName != null){
        //     paramList.stationType = 2;
        //     if (historyData.departName != null){
        //         paramList.stationType = 3;
        //     }
        // }

        $.ajax({
            type: 'POST',
            url: url,
            data: paramList,
            dataType:  'json',
            success: function(data){

                if(data.code==0){
                    if(paramList.stationType == 1){
                        lineParam.departAreaId = data.data.departAreaId;
                        lineParam.departCityId = data.data.departCityId;
                    }else if(paramList.stationType == 2){
                        lineParam.arriveAreaId = data.data.arriveAreaId;
                        lineParam.arriveCityId = data.data.arriveCityId;
                    }
                }
            }
        });
    }

    /*用户历史搜索站点查询*/
    function getSearchRecord(){
        var url = SERVER_URL_PREFIX + '/busline/optimized/getHistoryStation';
        var paramList = {
            token:$.cookie('token'),
            businessType:4,//业务类型
            //stationType: stationType, // 只保存出发地信息1 ，只保存目的地信息2
        }

        $.ajax({
            type: 'POST',
            url: url,
            data: paramList,
            dataType:  'json',
            success: function(data){
                if(data.code==0){
                    showHistoryInfo(data.data)
                }
            }
        });
    }

    chooseCityOrArea();//城市区域选择事件

    //获取车企开通的城市区域
    function getCityAndArea(){
        var departCityId = isEmpty(lineParam.departCityId) ? lineParam.departAreaId : lineParam.departCityId;
        var arriveCityId = isEmpty(lineParam.arriveCityId) ? lineParam.arriveAreaId : lineParam.arriveCityId;
        var paramList = {
            lineType:'1',  // 1.定制  2.通勤 3旅游'
            departAreaId: departCityId,
            arriveAreaId: arriveCityId,
            providerId: cityBusInfo.providerId,
            stationType: stationType,
        }
        $.ajax({
            type: 'POST',
            url: SERVER_URL_PREFIX + '/busline/optimized/getOpenAreas',
            data: paramList,
            dataType:  'json',
            success: function(data){
                if(data != null && undefined != data && data.code == 0 ){
                    if(undefined != data.data){
                        $('.recommend').html('');
                        var startCityList = data.data.startCityList;
                        var endCityList = data.data.endCityList;
                        if(undefined != startCityList && startCityList.length > 0){
                            $('.gather').show();
                            var startCityHtml = getCityAndAreaHtml(startCityList,'startArea');
                            $('#startCity').html(startCityHtml);
                        }
                        if(undefined != endCityList && endCityList.length > 0){
                            $('.gather').show();
                            var endCityHtml = getCityAndAreaHtml(endCityList,'endArea');
                            $('#endCity').html(endCityHtml);
                        }
                        chooseCityOrArea();
                    }else{
                        $.alert(data.message);
                    }
                }
            }
        });
    }

    //封装推荐地区
    var getCityAndAreaHtml = function(cityList,areaType){
        var cityAndAreaHtml = '<div class="title">按地区找线路</div>';
        for(var i = 0; i < cityList.length; i++){
            var cityItem = cityList[i];
            cityAndAreaHtml += '<h5 class="subtitle">'+ cityItem.name +'</h5>';
            cityAndAreaHtml += '<div class="station-group"><span data-area="' + cityItem.areaId + '" class="' + areaType + '">全部地区</span>';

            for (var j = 0; j < cityItem.childrenAreaList.length; j++){
                var area = cityItem.childrenAreaList[j];
                if(!area.name){
                    continue;
                }
                cityAndAreaHtml += '<span data-area="' + area.areaId + '" class="' + areaType + '">' + area.name + '</span>';
            }
            cityAndAreaHtml += '</div>';
        }
        return cityAndAreaHtml;
    }

    //推荐地区选择
    function chooseCityOrArea(){
        var targetType = isAndroid() ? 'tap' : 'click';
        $('.station-group span').off(targetType).on(targetType,function(){
            var _this = $(this);
            var cityName = _this.parent().prev('.subtitle').text();
            var areaName = _this.text();
            var areaType = _this.attr('class');
            var areaId = _this.attr('data-area');

            if(areaType == 'startArea'){
                lineParam['departAreaName'] = areaName;
                lineParam['departCityName'] = cityName;
                lineParam['departAreaId'] = areaId;
            }else if(areaType == 'endArea'){
                lineParam['arriveAreaName'] = areaName;
                lineParam['arriveCityName'] = cityName;
                lineParam['arriveAreaId'] = areaId;
            }
            var data = {};
            data['name'] = cityName + ' · ' + areaName;
            data['areaId'] = areaId;

            $('title').html(businessTypes.busTxt +'-'+cityBusInfo.providerName);
            $('#search-address').setPopupData(data);
            $('#search-address #closeBtn').triggerHandler('click');

        });

        //当前位置选择
        $('#currentAddressDetail').off(targetType).on(targetType,function(){
            var _this = $(this);
            var data = {};
            data['name'] = _this.data('city') + ' · ' + _this.text();
            data['lng'] = _this.data('lng');
            data['lat'] = _this.data('lat');
            data['areaId'] = _this.data('areaid');;

            if (stationType == 1){
                lineParam['departAreaName'] = _this.data('area');
                lineParam['departCityName'] = _this.data('city');
                lineParam['departAreaId'] = _this.data('areaid');
            }else if (stationType == 2){
                lineParam['arriveAreaName'] = _this.data('area');
                lineParam['arriveCityName'] = _this.data('city');
                lineParam['arriveAreaId'] = _this.data('areaid');
            }

            $('#search-address').setPopupData(data);
            $('#search-address #closeBtn').triggerHandler('click');

            historyData["departLng"] =  _this.data('lng');
            historyData["departLat"] =  _this.data('lat');
            historyData["address"] = _this.data('address');
            historyData["businessType"] = 4;
            
            saveSearchRecord(0);
        });

        //当前城市选择
        $("#cityWrapper").off(targetType).on(targetType,'.current-city',function(){
            $('#searchResult').html('');
            $('.search-input input').val('');
            var text = $('.current-city span').text();
            var areaCode =  $("#currAreaCode").val();
            if (stationType == 1){
                $('title').html("你从哪出发-"+cityBusInfo.providerName);
            }else if (stationType == 2){
                $('title').html("你想到哪儿-"+cityBusInfo.providerName);
            }
            $('#select-Citys').setPopupData(text);
            if(areaCode !=""){
                $("#areaCode").val(areaCode);
            }
            $('#select-Citys').closePopup(function() {
                if(_myIScrollsc) {
                    _myIScrollsc.destroy();
                    _myIScrollsc = null;
                }
            });
        })
    }

    /*搜索城市*/
    var sLock = true;
    $('#select-Citys .search-input input').off('input').on({
        compositionstart: function () {//中文输入开始
            sLock = false;
        },
        compositionend: function () {//中文输入结束
            sLock = true;
        },
        input:function(){
            setTimeout(function(){
                if (sLock){
                    var word = '';
                    var self = $('#select-Citys .search-input input').val();
                    self = $.trim(self.toLowerCase());
                    $('#cityWrapper .sui-list-title').show();
                    $('#select-Citys li').show();
                    if (self != '' && self != null){
                        $('#cityWrapper ul').each(function(){
                            var flag = false;
                            var index = $(this).index();
                            $(this).find('li').each(function () {
                                var strHtml = $(this).text();
                                if (strHtml.indexOf(self)!=-1){
                                    $(this).show();
                                    flag = true;
                                }
                                else{
                                    $(this).hide();
                                }
                            })
                            if (!flag){
                                word = $(this).prev().text();
                                $(this).prev().hide();
                                flag = false;
                            }
                            $('.nav-city').find('li').each(function () {
                                var text = $(this).text();
                                if (text == word){
                                    $(this).hide();
                                }
                            })
                        })
                    }
                }
            },0);
        }
    })

}

function getNowDate(){
    var date = new Date();
    var str = date.getFullYear() + '-' + formatNumber(date.getMonth()+1) + '-' + formatNumber(date.getDate());
    return str;
}

function getFormatTime(str){
	var time = new Date(parseInt(str));   
    var td = new Date();
	td = new Date(td.getFullYear(),td.getMonth(),td.getDate());
	var od=new Date(time.getFullYear(),time.getMonth(),time.getDate());
	var xc=(od-td)/1000/60/60/24;
	
	var timeList = {
		year: time.getFullYear(),
		month: formatNumber(time.getMonth() + 1),
		day: formatNumber(time.getDate()),
		hour: formatNumber(time.getHours()),
		minute: formatNumber(time.getMinutes()),
		seconds: formatNumber(time.getSeconds()),
		week: getTheWeek(time),
		timeDiff: xc,
	}
	return timeList;
}

function formatNumber(str){
    if( (str + '').length == 1){
        if( str < 10 ){
            str = '0' + str;
        }
    }
    return str;
}

function getTheWeek(date){
	
	var week = ''; 
	if(date.getDay()==0) week="周日";
	else if(date.getDay()==1) week="周一";
	else if(date.getDay()==2) week="周二";
	else if(date.getDay()==3) week="周三";
	else if(date.getDay()==4) week="周四";
	else if(date.getDay()==5) week="周五";
	else if(date.getDay()==6) week="周六";
	
	return week;
}

/*进入行程*/
$('.scheduling header').on(clickEvent,function () {
    window.location = '/cityBus/myTripList';
})

/*行程*/
function querySchedule(){
	var paramList = {
			//businessType:4,  // 定制班线：4,不限制查询全部
			token:$.cookie('token'),
	}
	$.ajax({
		type: 'POST',
		url: SERVER_URL_PREFIX + '/busline/optimized/getFutureOrderList',
		data: paramList,
		dataType:  'json',
		success: function(data){
			if(data.code==0){
                var scheduleList = data.data;
				if(scheduleList.length == 0){
					$('.scheduling').hide(); // 隐藏行程
					return;
                }
                if(scheduleList.length <=1){
                    $('.rolling').hide();
                }
                $('.scheduling').show();
				htmlSche(scheduleList);
                setFooterPosition();
			}
		}
	});

	function htmlSche(scheduleList){
	    var html = "";
		for (var i=0;i<scheduleList.length;i++){
			var date = '';
			var schedule = scheduleList[i];
			var temp = getFormatTime(schedule.departTime);
			if (temp.timeDiff == 0){
				date = '今天'+'('+temp.week+')';
			}
			else if(temp.timeDiff == 1){
				date = '明天'+'('+temp.week+')';
			}
			else{
				date = temp.month+'-'+temp.day+'('+temp.week+')';
			}
			var time = temp.hour+':'+temp.minute;
			html += '<div class="swiper-slide">' +
                    '   <div class="content">' +
                	'    <div class="startAdrs">' +
                	'        <div class="addr adrs">'+schedule.departTitle+'</div>' +
                	'        <div class="addr area">'+schedule.departCity+'</div>' +
                	'    </div>' +
                	'    <div class="center-line">' +
                	'        <div class="time">'+date+'</div>' +
                	'        <div class="line"></div>' +
                	'        <div class="time">'+time+'</div>' +
                	'    </div>' +
                	'    <div class="endAdrs">' +
                	'        <div class="addr adrs">'+schedule.arriveTitle+'</div>' +
                	'        <div class="addr area">'+schedule.arriveCity+'</div>' +
            		'    </div>'+
            		'   </div>' +
                    '</div>';
		}
        $('#scheduling-panle .swiper-wrapper').html(html);
        swSchedulingList(scheduleList);
	}
}

function swSchedulingList(scheduleList){
    /** 轮播图*/
    var mySwiper = new Swiper('#scheduling-panle .swiper-container', {
        spaceBetween: 10,
        pagination: {
            el: '.scheduling .swiper-pagination',
        },
    });

    if(scheduleList.length == 1){
        $('.scheduling .swiper-pagination').hide();
    }else {
        $('.scheduling .swiper-pagination').show();
    }

    $('.scheduling .swiper-container').on('click mousedown', function(e) {
        window.location = '/cityBus/myTripList';
    })
}

/* 跳转查询*/
function forwardSearch(){
    // lineType 1.定制  2.通勤 3旅游'
    window.location="/cityBus/lineListCityBus?"+"token="+$.cookie("token")+
        "&departLng="+lineParam['departLng']+"&departLat="+lineParam['departLat']+
        "&arriveLng="+lineParam['arriveLng']+"&arriveLat="+lineParam['arriveLat']+
        "&departDate="+getNowDate()+
        "&startAddr="+$('#startAddr').val()+"&endAddr="+$('#endAddr').val()+
        "&departCityName="+lineParam['departCityName']+"&arriveCityName="+lineParam['arriveCityName']+
        "&departAreaName="+lineParam['departAreaName']+"&arriveAreaName="+lineParam['arriveAreaName']+
        "&departAreaId=" + lineParam['departAreaId'] + "&arriveAreaId=" + lineParam['arriveAreaId']+"&lineType=1&search=1";
}

/*最近完成订单*/
function queryNearOrder(){
    var paramList = {
        businessType:4,  // 定制班线：4
        token:$.cookie('token'),
    }
    $.ajax({
        type: 'POST',
        url: SERVER_URL_PREFIX + '/busline/optimized/getLatelyOrderList',
        data: paramList,
        dataType:  'json',
        success: function(data){
            if(data.code==0){
                var oderList = data.data;
                if(oderList.length == 0){
                    $('.near-order').hide(); // 隐藏最近订单
                    return;
                }
                $('.near-order').show();
                htmlOrder(oderList);
                setFooterPosition();
            }
        }
    });


function htmlOrder(orderList){
        var html = '';
        for (var i=0;i<orderList.length;i++){

        	var order = orderList[i];
            html += '<div class="content"><div class="location"  data-departStationId="'+order.departStationId+
                    '" data-arriveStationId="'+order.arriveStationId+'"></div>' +
                	'            <div class="startAdrs" data-depart="'+order.departTitle+'">' +
                	'                <div class="addr adrs">'+order.departTitle+'</div>' +
                	'                <div class="addr area">'+order.departCity+'</div>' +
                	'            </div>' +
                	'            <div class="center-line">' +
                	'                <div class="arrow"></div>' +
                	'            </div>' +
                	'            <div class="endAdrs" data-arrive="'+order.arriveTitle+'">' +
                	'                <div class="addr adrs">'+order.arriveTitle+'</div>' +
                	'                <div class="addr area">'+order.arriveCity+'</div>' +
                	'            </div>' +
                	'            <div class="btn-list">' +
                	'                <div class="call-car" data-busId="'+order.busId+'">购票</div>' +
                	'                <div class="back">返程</div>' +
                	'            </div></div>';
            if ((i+1) != orderList.length){
            	html +='<div class="line"></div>';
            }
        }
        $('.near-order').html(html);

        /*添加点击事件*/
        $('.call-car').on(clickEvent,function(){

            var parent = $(this).parent().siblings('.location');
            var startAddr = $(this).parent().siblings('.startAdrs');
            var endAddr = $(this).parent().siblings('.endAdrs');
            var departStation = $(startAddr).data('depart');
            var arriveStation = $(endAddr).data('arrive');
            var departStationId = $(parent).data('departstationid');
            var arriveStationId = $(parent).data('arrivestationid');
            window.location="/cityBus/lineListCityBus?token="+$.cookie("token")+"&lineType=1&search=2"+
                '&departStationId='+ departStationId + '&arriveStationId=' + arriveStationId+
                '&departStation='+departStation + '&arriveStation=' + arriveStation;
        });

        /*返程*/
        $('.back').on(clickEvent,function () {
            var parent = $(this).parent().siblings('.location');
            var startAddr = $(this).parent().siblings('.endAdrs');
            var endAddr = $(this).parent().siblings('.startAdrs');
            var departStation = $(startAddr).data('arrive');
            var arriveStation = $(endAddr).data('depart');
            var departStationId = $(parent).data('arrivestationid');
            var arriveStationId = $(parent).data('departstationid');
            window.location="/cityBus/lineListCityBus?token="+$.cookie("token")+"&lineType=1&search=2"+
                '&departStationId='+ departStationId + '&arriveStationId=' + arriveStationId+
                '&departStation='+departStation + '&arriveStation=' + arriveStation;

        })
    }
}

/*验证当前城市是否开通该业务*/
function checkCityIsOpen(){
    var paramList = {
        providerId: cityBusInfo.providerId,
        lineType: 1,  // 1.定制  2.通勤 3旅游'
    }
    var urlList = SERVER_URL_PREFIX + '/busline/optimized/getIsOpenCity';
    // var cityName = '岳阳市';
    var cityName = $('#setCityButton').text();
    AMap.service(["AMap.PlaceSearch"], function() {
        var placeSearchOptions = { //构造地点查询类
            pageSize: 10,
            pageIndex: 1,
            city: $("#areaCode").val(), //城市
            extensions:'all',
            type:'汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|' +
            '医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|' +
            '交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施'
        };

        //地理位置搜索
        var placeSearch= new AMap.PlaceSearch(placeSearchOptions);
        placeSearch.search(cityName, callback); // 获取当前城市名
    });

    function callback(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            var location = result.poiList.pois[0].location;
            paramList.lng = location.lng;
            paramList.lat = location.lat;
            $.ajax({
                type: 'POST',
                url: urlList,
                data: paramList,
                dataType:  'json',
                success: function(res){
                    if (res.code == 0 ){
                        var data = res.data;
                        if(data.flag){
                            if(stationType == 1){
                                $('#currentAddress').show();
                            }
                            $('.search-bar .search-input').css('background','#FFFFFF');
                            $('.search-bar .search-input input').val('').removeAttr("disabled");
                        }else {
                            $('#currentAddress').hide();
                            $('.search-bar .search-input').css('background',' #F2F2F2');
                            $('.search-bar .search-input input').val('当前城市未开通线路').attr("disabled","disabled").css('background','#F2F2F2');
                        }
                    }
                }
            });
        }else{
            $('#currentAddress').hide();
            $('.search-bar .search-input').css('background',' #F2F2F2');
            $('.search-bar .search-input input').val('当前城市未开通线路').attr("disabled","disabled").css('background','#F2F2F2');
        }
    }
}

$(function () {
    //安安湛江搜索临时处理方案
    if(window.location.href.indexOf('aacx.') != -1){
        $('.search-form').hide();
    }
    //安安湛江搜索临时处理方案end--

    $('footer').hide();
    initPage();
});
