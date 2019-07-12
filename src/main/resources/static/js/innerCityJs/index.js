//title相关数据
var providerName = '';
var serviceNameObj = '';
var currentServiceName = '';
var click_tap = isAndroid()?'tap':'click';
$(function () {
    //每次进首面清空一次优惠券缓存
    window.localStorage.removeItem('selectedCoupon');
    //header初始化
    getBusinessTypes("innerCity");//初始化header导航,引用js/commonjs/header.js
    var callCarInfo = JSON.parse(window.sessionStorage.getItem('callCarInfo'));
    if(typeof callCarInfo != 'undefined' && null != callCarInfo){
         if(undefined != callCarInfo.departAreaCode && undefined == callCarInfo.arriveAreaCode){
                $('#startAddr').val(callCarInfo.departRegionName+' · '+callCarInfo.departTitle);
                $('#startAddr').data('departAreaCode',callCarInfo.departAreaCode);
                $('#startAddr').data('departAddress',callCarInfo.departTitle);
                $('#startAddr').data('departLat',callCarInfo.departLat);
                $('#startAddr').data('departLng',callCarInfo.departLng);
                $('#startAddr').data('departRegionName',callCarInfo.departRegionName);
                $('#startAddr').data('localLat',callCarInfo.localLat);
                $('#startAddr').data('localLng',callCarInfo.localLng);
             loadAlltrip();
             loadHistoryRcord();
            } else if(undefined != callCarInfo.arriveAreaCode && undefined == callCarInfo.departAreaCode){
                $('#endAddr').val(callCarInfo.arriveRegionName+' · '+callCarInfo.arriveTitle);
                $('#endAddr').data('arriveAreaCode',callCarInfo.arriveAreaCode);
                $('#endAddr').data('arriveAddress',callCarInfo.arriveTitle);
                $('#endAddr').data('arriveLat',callCarInfo.arriveLat);
                $('#endAddr').data('arriveLng',callCarInfo.arriveLng);
                $('#endAddr').data('arriveRegionName',callCarInfo.arriveRegionName);
             loadAlltrip();
             loadHistoryRcord();
            }
        else if(null != callCarInfo.departAreaCode && null != callCarInfo.arriveAreaCode){
             window.location.href = '/innerCity/order/innerCityService';
        }else {
            initMapLocation();
            loadAlltrip();
            loadHistoryRcord();
        }
    }else{
        initMapLocation();
        loadAlltrip();
        loadHistoryRcord();
    }
})

/**********自动定位************************/
var geocoder;//地图对象
function initMapLocation() {
    AMap.plugin('AMap.Geocoder',function(){
        geocoder = new AMap.Geocoder({
        });
        var shareObj = {
            url : window.location.href,
        }
        wxInitConfig(shareObj,getGpsCallback);

    });
}

//定位是否成功
var isLocation = false;
//根据gps获取地理位置
var getGpsCallback=function getAddressByGps(callbackData){
    if(callbackData['flag'] == false){
        isLocation = false;
        // $('#adrsResult .current .station-group').html('<span>当前区域获取失败</span>');
        $('#adrsResult .current').hide();
        $('#adrsResult .history').hide();
    }else{
        isLocation = true;
        //解析当前定位获取城市名和城市编码
        var gpsParam = [callbackData['longitude'],callbackData['latitude']];

        var param = {
            departLat:gpsParam[1],
            departLng:gpsParam[0],
            departAreaCode:0,
            departTitle:'',
            arriveLat:0,
            arriveLng:0,
            arriveAreaCode:0,
            arriveTitle:'',
            stationType:$('#stationType').val() === 'start'?1:2,
            requestUrl:window.location.href,
            localLat:gpsParam[1],
            localLng:gpsParam[0]
        }
        initAreaBylat(param);
        
    }
}


function initAreaBylat(param) {
    var url = SERVER_URL_PREFIX + '/innerCity/optimize/homeAreaByLocation';
    var dataObj = param;
    dataObj = genReqData(url, dataObj);
    dataObj['token']=$.cookie('token');
    var success_event = function (result) {
        if(result.code == 0){
            var regionInfo = result.data;
            $('#cityCode').val(regionInfo.cityAreaId);
            // $.toast('当前定位城市：'+regionInfo.cityAreaId);
            window.sessionStorage.setItem('cityId',regionInfo.cityAreaId);
            if(regionInfo.isRecommend == 1) return;
                //后台搜索高德地址后回调
                var gpsData=param['departLng']+","+param['departLat'];
                searchAddressByGps(gpsData,function (data) {
                    $('#startAddr').val(regionInfo.regionName+' · '+data.address);
                    $('#startAddr').data('departAddress',data.address);
                    $('#startAddr').data('departRegionName',regionInfo.regionName);
                    var callCarInfo = {
                        departAreaCode:regionInfo.cityAreaId,
                        departTitle:data.address,
                        departLat:param.departLat,
                        departLng:param.departLng,
                        departRegionName:regionInfo.regionName,
                        localLat:param.localLat,
                        localLng:param.localLng
                    }
                    window.sessionStorage.setItem('callCarInfo',JSON.stringify(callCarInfo));
                });
                $('#startAddr').data('localLat',param.localLat);
                $('#startAddr').data('localLng',param.localLng);
                $('#startAddr').data('departLat',param.departLat);
                $('#startAddr').data('departLng',param.departLng);
                $('#startAddr').data('departAreaCode',param.departAreaCode);
        }else{
            $.toast('获取定位失败');
        }
    }

    $.ajaxService({
        url : url,
        data:dataObj,
        success:success_event,
    })
}


/************************页面数据加载********************************/

function loadHistoryRcord(){
    var url = SERVER_URL_PREFIX + '/innerCity/optimize/recommendTrip';
    var dataObj = {
    };
    dataObj = genReqData(url, dataObj);
    dataObj['token']=$.cookie('token');
    var sucess_event = function (result) {
        if(null != result && result.code == 0){
            var orderList = result.data;

            orderList.forEach(function (item,index) {
                if(item.departLat>0 && item.departLng>0 &&　item.arriveLat>0 && item.arriveLng>0){
                    var $content = $('<div class="content">');
                    var $location = $('<div class="location"></div>');
                    var $startAdrs = '<div class="startAdrs">' +
                        '            <div class="adrs">'+item.departAddress+'</div>' +
                        '            <div class="area">'+item.upRegion+'</div>' +
                        '        </div>';
                    var $line = '<div class="center-line">' +
                        '            <div class="arrow"></div>' +
                        '        </div>';
                    var $endAdrs = '<div class="endAdrs"  >' +
                        '            <div class="adrs">'+item.arriveAddress+'</div>' +
                        '            <div class="area">'+item.downRegion+'</div>' +
                        '        </div>';
                    var call_back = ''
                    if(item.backTrack == 1){
                        call_back = '<div class="call-back">返程</div>';
                    }
                    var $btnList = '<div class="btn-list"' +
                        'data-arriveAreaCode="'+item.arriveAreaid+'" ' +
                        'data-departAreaCode="'+item.departAreaId+'" ' +
                        'data-upRegion="'+item.upRegion+'" ' +
                        'data-departAddress="'+item.departAddress+'" ' +
                        'data-downRegion="'+item.downRegion+'" ' +
                        'data-arriveAddress="'+item.arriveAddress+'" ' +
                        'data-departLat="'+item.departLat+'" ' +
                        'data-departLng="'+item.departLng+'"' +
                        'data-arriveLat="'+item.arriveLat+'"' +
                        'data-arriveLng="'+item.arriveLng+'"' +
                        '>' +
                        '<div  class="call-car">叫车</div>' +
                        call_back+'</div>';
                    $content.append($location).append($startAdrs).append($line).append($endAdrs).append($btnList);
                    $('.his-order').append($content);
                }
            })

            btnClick_event();

            if(orderList.length <=0) return;
        }

    }

    $.ajaxService({
        url:url,
        data:dataObj,
        success: sucess_event
    })

}

function btnClick_event() {
    var localLat = $('#startAddr').data('localLat');
    var localLng = $('#startAddr').data('localLng');
    $('.call-car').on(click_tap,function () {
        var _this = $(this).parent();
        var upRegion = _this.data('upregion');
        var departAddress = _this.data('departaddress');
        var downRegion = _this.data('downregion');
        var arriveAddress = _this.data('arriveaddress');
        var departLat = _this.data('departlat');
        var departLng = _this.data('departlng');
        var arriveLat = _this.data('arrivelat');
        var arriveLng = _this.data('arrivelng');
        var departAreaCode = _this.data('departAreaCode');
        var arriveAreaCode = _this.data('arriveAreaCode');
        var data = {
            departAreaCode:departAreaCode,
            departTitle:departAddress,
            departLat:departLat,
            departLng:departLng,
            departRegionName:upRegion,
            arriveAreaCode:arriveAreaCode,
            arriveTitle:arriveAddress,
            arriveLat:arriveLat,
            arriveLng:arriveLng,
            arriveRegionName:downRegion,
            localLat:localLat,
            localLng:localLng
        }
        window.sessionStorage.setItem('callCarInfo',JSON.stringify(data));
        window.location.href = '/innerCity/order/innerCityService'

    });
    $('.call-back').on(click_tap,function () {
        var _this = $(this).parent();
        var upRegion = _this.data('upregion');
        var departAddress = _this.data('departaddress');
        var downRegion = _this.data('downregion');
        var arriveAddress = _this.data('arriveaddress');
        var departLat = _this.data('departlat');
        var departLng = _this.data('departlng');
        var arriveLat = _this.data('arrivelat');
        var arriveLng = _this.data('arrivelng');
        var departAreaCode = _this.data('departAreaCode');
        var arriveAreaCode = _this.data('arriveAreaCode');

        var data = {
            departAreaCode:arriveAreaCode,
            departTitle:arriveAddress,
            departLat:arriveLat,
            departLng:arriveLng,
            departRegionName:downRegion,
            arriveAreaCode:departAreaCode,
            arriveTitle:departAddress,
            arriveLat:departLat,
            arriveLng:departLng,
            arriveRegionName:upRegion,
            localLat:localLat,
            localLng:localLng
        };
        window.sessionStorage.setItem('callCarInfo',JSON.stringify(data));
        window.location.href = '/innerCity/order/innerCityService';
    })
}

function loadAlltrip() {
    var url = SERVER_URL_PREFIX + '/innerCity/optimize/queryNewestOrder';
    var dataObj = {
    };
    dataObj = genReqData(url, dataObj);
    dataObj['token']=$.cookie('token');
    var sucess_event = function (result) {
        if(null != result && result.code == 0){
            var orderArr = result.data;
            if(orderArr.length <=0) return;
            orderArr.forEach(function (item,index) {
                var $trip = $('<div class="order-box">');

                if(item.tripStatus > 2){
                    var $head = '  <header>' +
                        '            <div class="border-weight"></div>' +
                        '            <div class="title">当前行程</div>' +
                        '            <div class="nav-right"> </div>' +
                        '           </header>'
                }else{
                    var $head = '  <header>' +
                        '            <div class="border-weight"></div>' +
                        '            <div class="title">预约行程</div>' +
                        '            <div class="nav-right"> </div>' +
                        '           </header>'
                }
                var des = '行程中';
                if(item.tripStatus == 1 || item.tripStatus == 2){
                    des = '待接单';
                }else if(item.tripStatus == 3){
                    des = '待出行';
                }else if(item.tripStatus == 4){
                    des = '等待接驾';
                }else if(item.tripStatus == 5){
                    des = '等待上车';
                }else if(item.tripStatus == 6){
                    des = '前往目的地';
                }else if(item.tripStatus == 7 || item.tripStatus == 8 || item.tripStatus == 10 ){
                    des = '待支付（已结束）';
                }

                var $content = $('<div class="content"' +
                    'data-departAreaCode="'+item.departAreaId+'" ' +
                    'data-arriveAreaCode="'+item.arriveAreaid+'" ' +
                    'data-upRegion="'+item.upRegion+'" ' +
                    'data-departAddress="'+item.departAddress+'" ' +
                    'data-downRegion="'+item.downRegion+'" ' +
                    'data-arriveAddress="'+item.arriveAddress+'" ' +
                    'data-departLat="'+item.departLat+'" ' +
                    'data-departLng="'+item.departLng+'"' +
                    'data-arriveLat="'+item.arriveLat+'"' +
                    'data-arriveLng="'+item.arriveLng+'"' +
                    'data-tripstatus="'+item.tripStatus+'"' +
                    'data-orderno="'+item.orderNo+'"' +
                    '>');
                var $startAdrs = '<div class="startAdrs">' +
                    '            <div class="adrs">'+item.departAddress+'</div>' +
                    '            <div class="area">'+item.upRegion+'</div>' +
                    '        </div>';
                var $line = '<div class="center-line">' +
                    '             <div class="des">'+des+'</div>' +
                    '             <div class="line"></div>' +
                    '        </div>';
                var $endAdrs = '<div class="endAdrs">' +
                    '            <div class="adrs">'+item.arriveAddress+'</div>' +
                    '            <div class="area">'+item.downRegion+'</div>' +
                    '        </div>';

                $content.append($startAdrs).append($line).append($endAdrs);
                $trip.append($head).append($content);
                $('#innerCity_foot').append($trip);
            })
            contentClick_event();
        }
    }

    $.ajaxService({
        url:url,
        data:dataObj,
        success: sucess_event
    })
}

function contentClick_event() {
    $('#innerCity_foot .content').on(click_tap,function () {
        var _this = $(this);
        var orderNo = _this.data('orderno');
        // ToUrl.skip('/innerCity/orderDetail/getOrderInfo?orderNo='+orderNo);
        window.location='/innerCity/orderDetail/getOrderInfo?orderNo='+orderNo;
        // window.location.href="/innerCity/order/toOrderDetail?orderNo="+orderNo;
    })
}

/********************************************************/
/**********************选择地址**********************************/
var _myIScrollsa;
$('#present .select-city-btn').on(click_tap, function() {
    var _this = $(this);
    searchAddressPopup(_this);
}).backtrack({
    cancel: '#search-address .cancel',
    event: 'click'
});

// 交换 出发地 / 目的地
$('.switch-btn').on(click_tap, function() {
    var start = $(this).prev().find('.start input');
    var end = $(this).prev().find('.end input');
    var tmp = start.val();
    start.val(end.val());
    end.val(tmp);
    var departLng = start.data('departLng');
    var departLat = start.data('departLat');
    var departAddress = start.data('departAddress');
    var departAreaCode = start.data('departAreaCode');
    var departRegionName = start.data('departRegionName');

    var arriveLng = end.data('arriveLng');
    var arriveLat = end.data('arriveLat');
    var arriveAddress = end.data('arriveAddress');
    var arriveAreaCode = end.data('arriveAreaCode');
    var arriveRegionName = end.data('arriveRegionName');

    start.data('departLng',arriveLng);
    start.data('departLat',arriveLat);
    start.data('departAddress',arriveAddress);
    start.data('departAreaCode',arriveAreaCode);
    start.data('departRegionName',arriveRegionName);

    end.data('arriveLng',departLng);
    end.data('arriveLat',departLat);
    end.data('arriveAddress',departAddress);
    end.data('arriveAreaCode',departAreaCode);
    end.data('arriveRegionName',departRegionName);
    var localLat = $('#startAddr').data('localLat');
    var localLng = $('#startAddr').data('localLng');
    var callCarInfo = {
        departAreaCode:arriveAreaCode,
        departTitle:arriveAddress,
        departLat:arriveLat,
        departLng:arriveLng,
        departRegionName:arriveRegionName,
        arriveAreaCode:departAreaCode,
        arriveTitle:departAddress,
        arriveLat:departLat,
        arriveLng:departLng,
        arriveRegionName:departRegionName,
        localLat:localLat,
        localLng:localLng
    }

    window.sessionStorage.setItem('callCarInfo',JSON.stringify(callCarInfo));
});

/***********************弹出页面操作*********************************/

$('#sarchCancelbtn').on(click_tap, function() {
    hideSearchAddressResult();
});
