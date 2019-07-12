$(function() {
    backtoUrl('/passenger/onlineCarOrderList.html');
    var innerHTMLStar = "";
    var departLng = $("#departLng").val();
    var departLat = $("#departLat").val();
    var tripStatus = $("#tripStatus").val();
    var type = 0;
    var cancelType = $("#cancelType").val();
    var flag = true;
    var waitPassengerFlag = false;
    var driverName = $('#driverName').val();
    if(tripStatus == 9 && cancelType ==3){
        //司机取消订单
        $.dialog({
            text: '由于司机原因，<br />' + driverName + '已取消本次订单 ',
            buttons: [{
                text: '重新叫单',
                onClick: function() {
                    window.location = "/hail/onlineIndex";
                }
            }]
        });
    }else if(tripStatus == 5){
        type = 2;
        var arriveDepartTime = $('#arriveDepartTime').val();
        arriveDepartTime = Math.ceil(Number(arriveDepartTime)/1000);
        var outTime = arriveDepartTime + 300;
        var waitSecond = outTime - Date.parse(new Date())/1000;
        if(waitSecond > 0){
            $('#tips').html('司机已到达，请尽快上车。若您未在5分钟内上车，司机可无责取消订单。')
            if(waitSecond <= 0){
                $('#makeCountdowns').html('师傅已到达,已等待'+5+'分钟');
            }else{
                minu = Math.floor(waitSecond/60);
                var secd = Math.round(waitSecond%60);
                $('#makeCountdowns').html('师傅已到达,等待倒计时'+minu+':'+secd+'');
            }
        }

    }else if( tripStatus == 3){
        waitDriver();
    }else if(tripStatus == 4){
        type = 1;
        $('#tips').html('司机将准时来接您，请耐心等待。')
    }

    function waitDriver(){
        var minute = $("#timeOne").val();
        document.title = '等待上车';
        waitDepartCountDown(Number(minute));
    }

    function waitDepartCountDown(countdownMinute){
        countdownMinute = countdownMinute*60;
        countdowns = window.setInterval(function(){
            if(!flag){
                clearInterval(countdowns);
            }
            countdownMinute--;
            var secondTime = parseInt(countdownMinute);// 秒
            var minuteTime = 0;// 分
            var hourTime = 0;// 小时
            if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
                //获取分钟，除以60取整数，得到整数分钟
                minuteTime = parseInt(secondTime / 60);
                //获取秒数，秒数取佘，得到整数秒数
                secondTime = parseInt(secondTime % 60);
                //如果分钟大于60，将分钟转换成小时
                if(minuteTime > 60) {
                    //获取小时，获取分钟除以60，得到整数小时
                    hourTime = parseInt(minuteTime / 60);
                    //获取小时后取佘的分，获取分钟除以60取佘的分
                    minuteTime = parseInt(minuteTime % 60);
                }
            }
            if(countdownMinute >= 1200){
                $('#tips').html('您的行程将于'+hourTime+'小时'+minuteTime+'分钟后开始，如司机开始接驾我们将发送短信信息，请注意查收');
                $('#makeCountdowns').html('距离出发时间还有'+hourTime+"小时"+minuteTime+"分钟");
            }else {
                clearInterval(countdowns);
            }
        },1000);
    }

    //map
    AMapUI.loadUI(['overlay/SimpleMarker','misc/PathSimplifier'], function (SimpleMarker,PathSimplifier) {
        if (!PathSimplifier.supportCanvas) {
        	$.toast('当前环境不支持 Canvas！');
            return;
        }
        initMap(SimpleMarker,PathSimplifier)
    })



    function initMap(SimpleMarker,PathSimplifier) {
        // 根据起终点经纬度规划驾车导航路线
        var passengerPosition = new AMap.LngLat(departLng,departLat);
        // var passengerPosition = new AMap.LngLat(114.084496+'', 22.548325+'');
        var map = new AMap.Map('allmap', {
            resizeEnable: true,
            zoom: 16,
            center: [departLng,departLat]
            // center:  [114.084496+'', 22.548325+''],
        });

        //获取司机坐标规划驾车行程
        var driving = new AMap.Driving({
            policy: AMap.DrivingPolicy.LEAST_TIME,
            map: map,
            hideMarkers: true
        });

        var driverMark = new SimpleMarker({
            //背景图标样式
            // iconStyle: {
            //     src: '/res/images/icon_car.png',
            // },
            map: map,
        })

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
                innerHTML: '<div class="mark-label" id="makeCountdowns"></div>'
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
            if(isMark){
                //乘客位置         //司机位置
                driving.search(passengerPosition,driverPlanRoute , function (status, result) {
                    if (status == 'complete') {
                        //规划成功 - 标注点
                        var distance = (Math.round(result.routes[0].distance/100)/10).toFixed(1)
                        var time =  Math.floor(result.routes[0].time/60);

                        setLabel(distance, time, type)
                        //设置起点为中心点
                        // map.setCenter(destination)
                    } else if (status == 'no_data') {
                        //返回0结果
                    } else if (status == 'error') {
                    }
                });
                driverMark.setPosition(driverPlanRoute);
                driverMark.setMap(map);
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
            if( type == 1){//去接乘客
                flag = false;
                //$('#makeCountdowns').html('');
                $('#makeCountdowns').html('师傅距您 &nbsp; ' + d + ' &nbsp; 预计' + t + '到达');
                if(time > 3){
                    $('#tips').html('司机将准时来接您，请耐心等待。');
                }else if(time <= 3){
                    $('#tips').html('司机即将到达，请提前到路边等待，若您迟到，司机可无责取消订单。');
                }
            }else if( type == 2){//到达出发地
                document.title = '司机已到达';
                $('#tips').html('司机已到达，请尽快上车。若您未在5分钟内上车，司机可无责取消订单。');
                if(!waitPassengerFlag){
                    driverArriveCountDown();
                }
            }
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
            var url = '//restapi.amap.com/v3/direction/driving?key=12ba70f263fabfb44ae2f95fea0f2bdf&origin='+driverLong+','+driverLat+'&destination='+departLng+','+departLat+'&originid=&destinationid=&extensions=base&strategy=0&waypoints=&avoidpolygons=&avoidroad=';
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

        //websocket
        var wss = new communicate({
            url: WEBSOCKET_SERVER+'?token=' + $.cookie('token'),
            errorCallback: function (event) {
                if(event == '正在重连') {
                    console.warn(event)
                } else {
                    console.error(event)
                }
            },
            openCallback: function(event) {
                //获取司机距离和到达时间
                this.send({
                    distance: true,
                    time: true
                })
            },
            messageCallback: function(event) {
                var temptType = event.data.data.type;
                var orderNo = $('#orderNo').val();
                if(orderNo != event.data.data.orderNo){
                    return false;
                }
                if(temptType >= type ){
                    type = temptType;
                }

                var serviceId=event.data.serviceId;

                //type:1:去接乘客 2:司机抵达出发地 3:司机接到乘客 4:司机抵达目的地 5:司机取消订单 6:乘客取消订单 7:抢单成功
                if(type == 1 || type == 2){
                    var longitude = event.data.data.longitude;//经度
                    var latitude = event.data.data.latitude;//纬度
                    if(longitude == null || latitude ==null){
                        var driverPosition = passengerPosition; //司机位置
                    }else{
                        var driverPosition = new AMap.LngLat(longitude+"", latitude+"") //司机位置
                    }
                    initDes(longitude,latitude,type);
                    planRoute(passengerPosition, driverPosition,type);
                }else if (type == 3 || type == 4 || type == 8 || type == 9){
                    //跳转到接到乘客页面
                    var orderNo = event.data.data.orderNo;
                    window.location = '/hail/bus/toOnlineCarOrderDetail?orderNo=' + orderNo + '&token=' + $.cookie('token');
                }else if(type == 5&&serviceId=='1006') {
                    var cancel_reason = event.data.data.cancelReason;
                    if(cancel_reason!=null&&cancel_reason!=''){
                        $.dialog({
                            text: '由于'+cancel_reason+'原因，<br />' + driverName + '已取消本次订单 ',
                            buttons: [{
                                text: '重新叫单',
                                onClick: function() {
                                    window.location = "/hail/onlineIndex";
                                }
                            }]
                        });
                    }else{
                        //司机取消订单
                        $.ajax({
                            type: "post",
                            url: "/hail/onlinecarOrder/queryOrderdetail",
                            data:{"orderNo":orderNo,"token":$.cookie('token')},
                            dataType: "json",
                            success: function(result){
                                if(result!=undefined&&result.code!=undefined&&parseInt(result.code)==0){
                                    var remark = result.data.remark;
                                    $.dialog({
                                        text: '由于'+remark+'原因，<br />' + driverName + '已取消本次订单 ',
                                        buttons: [{
                                            text: '重新叫单',
                                            onClick: function() {
                                                window.location = "/hail/onlineIndex";
                                            }
                                        }]
                                    });
                                }
                            }
                        });
                    }
                }
            }
        })
        wss.init();

        //取消订单
        $('.cancel-order').on('click', function () {
            //隐藏更多操作
            $('#more').removeClass('open').data('state', 'close');
            $('.more-modal').hide();

            //弹窗提示
            $.confirm('师傅已在路上，你确定取消本次订单吗？<br />这将影响您的信用等级', '温馨提示', ['点错了', '确定'], function () {
                //取消原因
                $.dialog({
                    title: '取消原因',
                    html: '<form id="cancel-reason">' +
                    '<label><input type="radio" name="reason" checked /> 我的行程改变了，暂时不需要用车</label>' +
                    '<label><input type="radio" name="reason" /> 我需要等的时间太长了</label>' +
                    '<label><input type="radio" name="reason" /> 由于司机原因，无法提供服务</label>' +
                    '<label class="other-reason"><input type="radio" name="reason" /> 其他原因</label>' +
                    '<div class="frm-item"><textarea maxlength="200" placeholder="请描述（内容匿名，可放心填写）" id="textareas"></textarea><span class="amount">0/200</span></div>' +
                    '</form>',
                    buttons: [{
                        text: '确定',
                        onClick: function() {
                            var radio=document.getElementsByName("reason");
                            var selectvalue=null;   //  selectvalue为radio中选中的值
                            for(var i=0;i<radio.length;i++){
                                if(radio[i].checked==true) {
                                    selectvalue=radio[i].nextSibling.nodeValue;
                                    break;
                                }
                            }
                            selectvalue = selectvalue.replace(/(^\s*)|(\s*$)/g, "");
                            if("其他原因" == selectvalue){
                                selectvalue = $("#textareas").val();
                            }
                            var token = $.cookie("token");
                            var orderNo = $("#orderNo").val();
                            $.ajax({
                                type: "post",
                                url: "/hail/onlinecarOrder/passengerCancelOrder",
                                data:{"orderNo":orderNo,"remark":selectvalue,"token":token},
                                dataType: "json",
                                success: function(result){
                                    if(result!=undefined&&result.code!=undefined&&parseInt(result.code)==0){
                                        var data = {
                                            "type":6,
                                            "orderNo": orderNo,
                                            "cancelReason":selectvalue
                                        }
                                        var params = {
                                            'data' : data,
                                            "serviceId":"1006"
                                        }

                                        wss.send(params);

                                        $.alert('订单取消成功。', '温馨提示', ['知道了'], function() {

                                            window.location='/hail/onlineIndex';
                                        })

                                    }else{
                                        $.alert(result.message||'该行程取消失败',function(){
                                            window.location.reload();
                                            return false;
                                        });

                                    }
                                }
                            });
                        }
                    }]
                });

                //reset dialog
                $('.sui-dialog').addClass('reset-dialog');

                //其他原因
                $('#cancel-reason label').on('click', function () {
                    if($(this).hasClass('other-reason')) {
                        $('.frm-item').show();
                    } else {
                        $('.frm-item').hide();
                    }
                });

                //计算
                $('.frm-item textarea').on('input', amountHandler);
                $('.frm-item textarea').on('change', amountHandler);

                function amountHandler() {
                    var self = $(this);
                    var len = self.val().length;

                    if (len > 200) {
                        $.trim(self.val()).length = 200;
                    } else {
                        self.next().text(len + '/200')
                    }
                    // 表情转换为字符串
                    self.val(utf16toEntities(self.val()));
                }
            }, function () {
            });
        });

    }

    //拨打电话·
    $('.tel').on('click.tel', function() {
        callDriverByServer(SERVER_URL_PREFIX+"/hail",$('#orderNo').val());
    });

    function driverArriveCountDown(){
        waitPassengerFlag = true;
        var arriveDepartTime = $('#arriveDepartTime').val();
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
    }

    function countDown(countdownMinute){
        if(tripStatus == 3){
            countdownMinute = countdownMinute *60;
        }else{
            var startTimes = new Date();//开始时间 new Date('2016-11-16 15:21');
            var endTimes = new Date(startTimes.setMinutes(startTimes.getMinutes()+countdownMinute));//结束时间
            var curTimes = new Date();//当前时间
            var surplusTimes = endTimes.getTime()/1000 - curTimes.getTime()/1000;//结束毫秒-开始毫秒=剩余倒计时间
        }

        // 进入倒计时
    }

    //点击更多
    $('#more').on('click', function() {
        var self = $(this),
            $modal = $('.more-modal');

        if(!self.data('state') || self.data('state') == 'close') {
            self.addClass('open').data('state', 'open');
            $modal.show();
        } else {
            self.removeClass('open').data('state', 'close');
            $modal.hide();
        }
    });

    //更多操作栏点击 - 增加active
    $('.more-modal li').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
    });


});

// 表情转换为字符串
function utf16toEntities(str) {
    var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
    str = str.replace(patt, function(char){
        var H, L, code;
        if (char.length===2) {
            H = char.charCodeAt(0); // 取出高位
            L = char.charCodeAt(1); // 取出低位
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
            return "&#" + code + ";";
        } else {
            return char;
        }
    });
    return str;
}