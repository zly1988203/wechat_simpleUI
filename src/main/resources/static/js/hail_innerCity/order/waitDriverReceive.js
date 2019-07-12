var orderInfo = {
    status: $('#status').val(),
    orderNo: $('#orderNo').val(),
    tripNo: $('#tripNo').val(),
    settleMode: $('#settleMode').val(),
    driverName: $('#driverName').val(),
    logoURL: $('#logoURL').val(),
    impProviderName: $('#impProviderName').val(),
    carNo: $('#carNo').val(),
    departLng: $("#departLng").val(),
    departLat: $("#departLat").val(),
    arriveLng: $("#arriveLng").val(),
    arriveLat: $("#arriveLat").val(),
    orderType: $("#orderType").val(),
    nickName: $('#nickName').val(),
    driverId: $('#driverId').val(),
    tripStatus: $('#tripStatus').val(),
    payStatus: $('#payStatus').val(),
    departCarType: $("#departCarType").val(),
    departType: $("#departType").val(),
}
var clickEvent = isAndroid()?'tap':'click';
var dialogText = '你的订单已被客服取消，支付的款项已退回，请通过我的订单查看';
//点击更多
$('#more').on(clickEvent, function() {
    $('#morePanel').show();
    $(".black_overlay").show();
});

$('#close').on(clickEvent,function () {
    $('#morePanel').hide();
    $(".black_overlay").hide();
})

//初始化
function init() {
    if(orderInfo.payStatus == '0'){
        $('#pay').show();
    }

    if(orderInfo.status === '3'){
        dialogText = '你的订单已被客服取消，请通过我的订单查看';

        if(orderInfo.cancelConfig === '1'){
            $('#cancel').show();
        }
    }else {
        $('#contacts').removeClass('btn-default').addClass('btn-primary');
    }

    if(orderInfo.tripStatus == 4){
        $('.tips-box .tips').html('司机已出发，请准时到达约定地点等候。');
    }else if(orderInfo.tripStatus == 5) {
        $('.tips-box .tips').html('司机已经到达上车点，请尽快到约定地点上车。');
    }

    //分享行程
    var shareObj = {
        url : window.location.href,
        carNo : orderInfo.carNo,
        driverName : orderInfo.driverName,
        businessType : orderInfo.orderType,
        orderNo : orderInfo.orderNo,
        logo : orderInfo.logoURL,
        nickName : orderInfo.nickName,
        providerName:orderInfo.impProviderName
    }

    wxInitConfig(shareObj);
}

var interval;
var settleType = "" != orderInfo.settleMode?orderInfo.settleMode:1;
//订单状态扭转判断
function orderJudgeCallBack(data){
    if(parseInt(data.code)==0){
        if(typeof data.data === 'undefined'){
            return;
        }
        if(parseInt(data.data.status)==2){
            clearInterval(interval);
            $.dialog({
                text: '您预约的订单因车辆资源无法满足，正在为您安排其他车辆，敬请原谅！',
                buttons: [{
                    text: '我知道了',
                    onClick: function() {
                        window.location='/hail/innerCity/order/toOrderDetail?orderNo='+orderInfo.orderNo;
                    }
                }]
            });
        }else if(parseInt(data.data.status)==4){
            // initTitleOfStatus();
            // window.location='/innerCity/orderDetail/getOrderInfo?orderNo='+orderInfo.orderNo;
            // document.title="等待接驾";
            // initTitleOfStatus();
            $('.tips-box .tips').html('司机已出发，请准时到达约定地点等候。');
        }else if(parseInt(data.data.status)==5){
            // initTitleOfStatus();
            if(orderInfo.tripStatus != 5){
                window.location='/hail/innerCity/orderDetail/getOrderInfo?orderNo='+orderInfo.orderNo;
            }

            $('.tips-box .tips').html('司机已经到达上车点，请尽快到约定地点上车。');
        }
        else if(parseInt(data.data.status)==6
            ||parseInt(data.data.status)==7 || parseInt(data.data.status)==8 || parseInt(data.data.status)==10){
            window.location='/hail/innerCity/orderDetail/getOrderInfo?orderNo='+orderInfo.orderNo;
        }else if(parseInt(data.data.status)==9){
            clearInterval(interval);
            $.dialog({
                text: dialogText,
                buttons: [{
                    text: '我知道了',
                    onClick: function() {
                        location.href='/hail/innerCity/order/toOrderReturnDetailPage?orderNo='+orderInfo.orderNo;
                    }
                }]
            });
        }
    }
}

//返回首页
$('#back').on(clickEvent,function(){
    //清空缓存
    window.sessionStorage.removeItem('callCarInfo');
    window.location='/hail/interCityIndex';
})

//投诉建议
$('#suggestBtn').on(clickEvent,function(){
    window.location='/passenger/suggest.html?orderNo='+orderInfo.orderNo+"&businessType="+orderInfo.orderType;
});

//紧急求助
$('#contacts').on(clickEvent, function(e) {
    contact(orderInfo.orderNo+'','interCityOnline',SERVER_URL_PREFIX + '/hail');
});

//联系客服
$('#contactCall').on(clickEvent, function() {
    var urlDetail = SERVER_URL_PREFIX + '/Config/commonConfig';
    var dataDetail = {
        orderNo: orderInfo.orderNo
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
    callDriver(orderInfo.orderNo+'');
});

var flag = true;
var waitPassengerFlag = false;
function initMap(SimpleMarker,PathSimplifier) {
    // 根据起终点经纬度规划驾车导航路线
    var passengerPosition = new AMap.LngLat(orderInfo.departLng,orderInfo.departLat);
    var map = new AMap.Map('allmap', {
        resizeEnable: true,
        zoom: 16,
        center: [orderInfo.departLng,orderInfo.departLat]
    });

    //获取司机坐标规划驾车行程
    var driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME,
        map: map,
        hideMarkers: true
    });

    var endMark = new AMap.Marker({
        icon: new AMap.Icon({
            // image: "/res/images/icon_car.png",
            size: new AMap.Size(24, 48),  //图标大小
            imageSize: new AMap.Size(24, 48),
            imageOffset: new AMap.Pixel(0, 0)
        })
    })


    var driverMark = new SimpleMarker({
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
            innerHTML: '<div class="mark-label" id="makeCountdowns">等待接驾</div>'
        },
        map: map,
        position: passengerPosition
    });


    /**
     *@param    position    坐标
     *@param    icon        图标
     *@param    offset      图标偏移量
     */

    /**
     * origin   乘客位置
     * destination   司机位置
     */
    var prePosition = passengerPosition;
    var isMark = true ;//出行位置
    function planRoute(passengerPosition,driverPlanRoute ,type) {
        ///res/images/hailing/car.png',
        if(isMark) {
            //乘客位置         //司机位置
            driving.search(driverPlanRoute, passengerPosition, function (status, result) {
                if (status == 'complete') {
                    //规划成功 - 标注点
                    var distance = (Math.round(result.routes[0].distance / 100) / 10).toFixed(1);
                    var time = Math.floor(result.routes[0].time / 60);

                    setLabel(distance, time, type)
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
            speed: 100,
            pathNavigatorStyle: pathNavigatorStyles
        });
        navg1.start();
        prePosition = driverPlanRoute;
    }

    //5秒刷新位置，预计到达时间
    function setLabel(distance, time, type) {
        var d = distance + '公里',
            t = time + '分钟';
        if (time>300){
        	t = Math.ceil(time%60) + '小时';
        }
        if( type == 4){//去接乘客
            flag = false;
            //$('#makeCountdowns').html('');
            $('#makeCountdowns').html('师傅距您 &nbsp; ' + d + ' &nbsp; 预计' + t + '到达');
            if(time > 3){
                $('#tips').html('司机将准时来接您，请耐心等待。');
            }else if(time <= 3){
                $('#tips').html('司机即将到达，请提前到路边等待，若您迟到，司机可无责取消订单。');
            }
        }else if( type == 5){//到达出发地
            // document.title = '司机已到达';
            $('#tips').html('司机已到达，请尽快上车。若您未在5分钟内上车，司机可无责取消订单。');
            if(!waitPassengerFlag){
                driverArriveCountDown();
            }
        }
        subStr();
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
            prePosition
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
        fillStyle: null
    }

    var navg1 = pathSimplifierIns.createPathNavigator(0, {
        loop: false,
        speed: 100,
        pathNavigatorStyle: pathNavigatorStyles
    });

    navg1.start();

    function initDes(driverLong,driverLat,type){
        var url = '//restapi.amap.com/v3/direction/driving?key=12ba70f263fabfb44ae2f95fea0f2bdf&origin='+driverLong+','+driverLat+'&destination='+orderInfo.departLng+','+orderInfo.departLat+'&originid=&destinationid=&extensions=base&strategy=0&waypoints=&avoidpolygons=&avoidroad=';
        $.ajax({
            url:url,
            dataType:'json',
            success:function (res) {
                var data = res.route.paths[0];
                var distance = (Math.round(data.distance/100)/10).toFixed(1);
                var time =  Math.floor(data.duration/60);
                setLabel(distance, time, type);
            }
        })
    }

    function driverPosition(){
        var urlDetail = SERVER_URL_PREFIX + "/hail/innerCity/getDriverCurrGps";
        var dataDetail = {
            tripNo:orderInfo.tripNo,
            driverId: orderInfo.driverId
        };
        dataDetail = genReqData(urlDetail, dataDetail);
        $.ajax({
            type: 'POST',
            url: urlDetail,
            data: dataDetail,
            dataType:  'json',
            success: function(data){
                if(data && data.code == 0){
                    var res = data.data;
                    if(res.type == 4 ||res.type == 5){
                        if(res.gps == null ) return;
                        var longitude = res.gps.lng;//经度
                        var latitude = res.gps.lat;//纬度
                        if(longitude == null || latitude ==null){
                            var driverPosition = passengerPosition; //司机位置
                        }else{
                            var driverPosition = new AMap.LngLat(longitude+"", latitude+"") //司机位置
                        }
                        initDes(longitude,latitude,res.type);
                        planRoute(passengerPosition, driverPosition, res.type);

                        if(!sessionStorage.getItem('isDriver')){
                            sessionStorage.isDriver = true;
                            location.reload();
                        }
                    }

                }
            }
        });
    }
    driverPosition();
    setInterval(driverPosition,10000);
}

function driverArriveCountDown(){
    waitPassengerFlag = true;
    var arriveDepartTime = ""!=$('#arriveDepartTime').val()?$('#arriveDepartTime').val():0;
    arriveDepartTime = Math.ceil(Number(arriveDepartTime)/1000);
    if(arriveDepartTime <= 0){
        arriveDepartTime = Date.parse(new Date())/1000;
    }
    var outTime = arriveDepartTime + 300;
    countdowns = window.setInterval(function(){
        var waitSecond = outTime - Date.parse(new Date())/1000;
        minu = "0" + Math.floor(waitSecond/60);
        var secd = Math.round(waitSecond%60);
        if(secd < 10){
            secd = "0" + secd;
        }
        $('#makeCountdowns').html('师傅已到达,等待倒计时'+minu+':'+secd+'');
        if(waitSecond <= 0){
            $('#makeCountdowns').html('师傅已到达,已等待'+5+'分钟');
            clearInterval(countdowns);
        }
    },1000);
    subStr();
}

function subStr(){
	var text = $('#makeCountdowns').text();
    if (text == undefined){
    	text = " ";
    }
    if (text.length>26){
    	$('#makeCountdowns').text(substring(0,text.length-2)+"...")
    }
}

$(function () {
    init();
    switchJourney();
    loadCoupons();
    interval=setInterval("innerCityUrlJudge(orderInfo.tripNo+'',orderJudgeCallBack,orderInfo.orderNo+'')", 1000);
    
    subAddrStr(address);
    //map
    AMapUI.loadUI(['overlay/SimpleMarker','misc/PathSimplifier'],
        function (SimpleMarker,PathSimplifier) {
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