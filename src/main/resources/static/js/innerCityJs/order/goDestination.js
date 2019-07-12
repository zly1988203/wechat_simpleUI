var interval;
var orderInfo = {
    status:$('#status').val(),
    orderNo:$('#orderNo').val(),
    tripNo:$('#tripNo').val(),
    settleMode:$('#settleMode').val(),
    driverName:$('#driverName').val(),
    logoURL:$('#logoURL').val(),
    impProviderName:$('#impProviderName').val(),
    nickName:$('#nickName').val(),
    carNo:$('#carNo').val(),
    departLng:$("#departLng").val(),
    departLat:$("#departLat").val(),
    arriveLng:$("#arriveLng").val(),
    arriveLat:$("#arriveLat").val(),
    orderType:$("#orderType").val(),
    driverId:$('#driverId').val(),
    payStatus:$('#payStatus').val(),
    departCarType:$("#departCarType").val(),
    departType:$("#departType").val(),
}
var clickEvent = isAndroid()?'tap':'click';
var dialogText = '你的订单已被客服取消，支付的款项已退回，请通过我的订单查看';
//订单状态扭转判断
function orderJudgeCallBack(data){
    if(parseInt(data.code)==0){
        if(typeof data.data === 'undefined'){
            console.log('订单状态接口错误 data.data：'+data.data);
            return;
        }
        if(parseInt(data.data.status)==7 || parseInt(data.data.status)==8 || parseInt(data.data.status)==10){
            // ToUrl.skip('/innerCity/orderDetail/getOrderInfo?orderNo='+orderInfo.orderNo);
            window.location='/innerCity/orderDetail/getOrderInfo?orderNo='+orderInfo.orderNo;
        }else if(parseInt(data.data.status)==9){
            clearInterval(interval);
            $.dialog({
                text: dialogText,
                buttons: [{
                    text: '我知道了',
                    onClick: function() {
                        location.href='/innerCity/order/toOrderReturnDetailPage?orderNo='+orderInfo.orderNo;
                    }
                }]
            });
        }

    }
}

function init(){
    if(orderInfo.payStatus == '0'){
        $('#pay').show();
    }

    if(orderInfo.status == 3){
        dialogText = '你的订单已被客服取消，请通过我的订单查看';

    }else {
        $('#contacts').removeClass('btn-default').addClass('btn-primary');
    }

    $('.tips-box .tips').html('正在前往目的地，请保持系好安全带。');
    //分享行程
    var shareObj = {
        url : window.location.href,
        carNo : orderInfo.carNo,
        businessType : orderInfo.orderType,
        driverName : orderInfo.driverName,
        orderNo : orderInfo.orderNo,
        logo : orderInfo.logoURL,
        nickName : orderInfo.nickName,
        providerName:orderInfo.impProviderName
    };

    wxInitConfig(shareObj);
}

function bindEvent(){
    //返回首页
    $('#back').on(clickEvent,function(){
        window.sessionStorage.removeItem('callCarInfo');
        window.location='/interCityIndex';
    })

    //投诉建议
    $('#suggestBtn').click(function(){
        window.location='/passenger/suggest.html';
    });

    //紧急求助
    $('#contacts').on(clickEvent, function(e) {
        contact(orderInfo.orderNo,'innerCity');
    });

    //联系客服
    $('#contactCall').on(clickEvent, function() {
        var urlDetail = SERVER_URL_PREFIX + '/Config/commonConfig';
        var dataDetail = {
        };
        dataDetail = genReqData(urlDetail, dataDetail);
        $.ajax({
            type: 'POST',
            url: urlDetail,
            data: dataDetail,
            dataType:  'json',
            success: function(data){
                if(data && data.code == 0){
                    window.location.href = 'tel:'+data.data.customerTel;
                }
            }
        });

    });

    //拨打司机电话
    $('#callTel').on(clickEvent, function() {
        callDriver(orderInfo.orderNo);
    });

    //点击更多
    $('#more').on(clickEvent, function() {
        $('#morePanel').show();
        $(".black_overlay").show();
    });

    $('#close').on(clickEvent,function () {
        $('#morePanel').hide();
        $(".black_overlay").hide();
    })
}

function secToMin(duration){
    if(duration%60 == 0){
        var minute = parseInt(duration/60);
    }else{
        var minute = parseInt(duration/60) + 1;
    }

    $('#time').html(minute);
}

function initMap(SimpleMarker,PathSimplifier) {
    // 根据起终点经纬度规划驾车导航路线
    var prePosition = new AMap.LngLat(orderInfo.departLng, orderInfo.departLat);
    var passengerPosition = new AMap.LngLat(orderInfo.arriveLng, orderInfo.arriveLat);
    var map = new AMap.Map('allmap', {
        resizeEnable: true,
        zoom: 16,
        center: prePosition
    });
    // AMap.plugin([
    //     'AMap.ToolBar',
    // ], function(){
    //     // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
    //     map.addControl(new AMap.ToolBar({
    //         // 简易缩放模式，默认为 false
    //         liteStyle: true
    //     }));
    // });
    
    //获取司机坐标规划驾车行程
    var driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME,
        map: map,
        hideMarkers: true
    });

    var endMark = new SimpleMarker({
        //背景图标样式
        iconStyle: {
            src: '/res/images/hailing/mark.png',
            style: {
                width: '0.46rem',
                height: '0.56rem'
            }
        },
        //图标前景文字
        iconLabel: {
            innerHTML: '<div class="mark-label" id="makeCountdowns">前往目的地</div>'
        },
        map: map,
        position: passengerPosition
    })
    
    /**
     *@param    position    坐标
     *@param    icon        图标
     *@param    offset      图标偏移量
     */
    var isMark = true ;//出行位置
    function planRoute(passengerPosition, driverPlanRoute) {
        ///res/images/hailing/car.png',
        if(isMark) {
            //乘客位置         //司机位置
            driving.search(passengerPosition, driverPlanRoute, function (status, result) {
                if (status == 'complete') {
                    //规划成功 - 标注点
                    var distance = (Math.round(result.routes[0].distance / 100) / 10).toFixed(1);
                    var time = Math.floor(result.routes[0].time / 60);
                    setLabel(distance, time)
                    //设置起点为中心点
                    // map.setCenter(destination)
                } else if (status == 'no_data') {
                    //返回0结果
                } else if (status == 'error') {
                }
            });
            endMark.setPosition(driverPlanRoute);
            endMark.setMap(map);
            isMark = false;
        }

        pathSimplifierIns.setData([{
            name: '等待接驾',
            path: [
                prePosition,
                driverPlanRoute,
            ]
        }]);

        navg1 = pathSimplifierIns.createPathNavigator(0, {
            loop: false,
            speed: 150,
            pathNavigatorStyle: pathNavigatorStyles
        });
        navg1.start();
        prePosition = driverPlanRoute;
    }

    var pathSimplifierIns = new PathSimplifier({
        zIndex: 999,
        //autoSetFitView:false,
        map: map, //所属的地图实例

        getPath: function (pathData, pathIndex) {

            return pathData.path;
        },
        getHoverTitle: function (pathData, pathIndex, pointIndex) {

            return null;
        },
        renderOptions: {
            pathLineStyle: {
                strokeStyle: null,
                lineWidth: null,
                borderStyle:null
            },
            startPointStyle: {
                radius: 1,
                fillStyle: null,
                lineWidth: 1,
                strokeStyle: null
            },
            endPointStyle: {
                radius: 1,
                fillStyle: null,
                lineWidth: 1,
                strokeStyle: null
            },

        }
    });

    window.pathSimplifierIns = pathSimplifierIns;

    pathSimplifierIns.setData([{
        name: '等待接驾',
        path: [
            prePosition,
            passengerPosition
        ]
    }]);

    function onload() {
        pathSimplifierIns.renderLater();
    }

    function onerror(e) {
        $.toast('图片加载失败！');
    }

    var pathNavigatorStyles = {
        width: 16,
        height: 32,
        //使用图片
        content: PathSimplifier.Render.Canvas.getImageContent('/res/images/icon_car.png', onload, onerror),
        pathLinePassedStyle: null,
        strokeStyle: null,
        fillStyle: null,

    }

    var navg1 = pathSimplifierIns.createPathNavigator(0, {
        loop: false,
        speed: 150,
        pathNavigatorStyle: pathNavigatorStyles
    });

    navg1.start();

    function searchDistanceByGps(){
        var gpsArrive = $('#arriveLng').val()+","+$('#arriveLat').val();
        var urlDetail = '/innerCity/order/searchDistanceByGps';
        var dataDetail = {
            driverId: orderInfo.driverId,
            gpsArrive: gpsArrive,
        };

        $.ajax({
            type: 'GET',
            url: urlDetail,
            data: dataDetail,
            dataType:  'json',
            success: function(data){
                var code = data.code;
                if(code == undefined){
                    code = -1;
                }
                if(code==0 && data.data.infocode=="10000"){
                    var res = data.data.results[0];
                    var gps = data.data.gps;
                    var distance = parseInt(res.distance||0);
                    var duration = parseInt(res.duration||0);

                    distance = (distance/1000).toFixed(1);
                    $('#distance').html(distance);

                    secToMin(duration);
                    $('.head').show();
                    var longitude = gps.lng;//经度
                    var latitude = gps.lat;//纬度
                    if(longitude != null && latitude != null){
                        var driverPosition = new AMap.LngLat(longitude+"", latitude+"") //司机位置
                    }
                    planRoute(passengerPosition, driverPosition);
                }
            }
        });
    }

    searchDistanceByGps();
    setInterval(searchDistanceByGps, 10000);

}

//5秒刷新位置，预计到达时间
function setLabel(distance, time) {
    var d = distance + '公里',
        t = time + '分钟';
    if (time>300){
    	t = Math.ceil(time%60) + '小时';
    }
    $('#makeCountdowns').html(' 预计行驶' + t+ ' &nbsp;距离终点 ' + d);
    var text = $('#makeCountdowns').text();
    if (text == undefined){
    	text = " ";
    }
    if (text.length>26){
    	$('#makeCountdowns').text(substring(0,text.length-2)+"...")
    }
}

$(function() {
    interval = setInterval("innerCityUrlJudge(orderInfo.tripNo,orderJudgeCallBack,orderInfo.orderNo+'')", 1000);
    init();
    bindEvent();
    loadCoupons();
    switchJourney();
    
    subAddrStr(address);
    //终点位置

    AMapUI.loadUI(['overlay/SimpleMarker','misc/PathSimplifier'], function (SimpleMarker,PathSimplifier) {
        if (!PathSimplifier.supportCanvas) {
        	$.toast('当前环境不支持 Canvas！');
            return;
        }
        initMap(SimpleMarker,PathSimplifier)
    });
    initTitleOfStatus();
    //是否显示取消订单按钮
    isShowCancel();
    showCarType(orderInfo);
});