var driverInfo = {
    tripStatus:$('#tripStatus').val(),
    orderNo:$('#orderNo').val(),
    type:$('#type').val(),
    cityId:$('#cityId').val(),
    superviseTel:$('#superviseTel').val(),
    costTime:$('#costTimeVal').val(),
    departLng:$('#departLng').val(),
    departLat:$('#departLat').val(),
    arriveLng:$('#arriveLng').val(),
    arriveLat:$('#arriveLat').val(),
    settleType:$('#settleType').val()
}

$('#priceRule').off('click').on('click', function () {
    window.location = '/onlinecarOrder/billrules?orderNo=' + driverInfo.orderNo + '&type=' + driverInfo.type + '&cityId=' + driverInfo.cityId + '&token=' + $.cookie('token');
});

//拨打电话
$('#calltel').on('click', function () {
    callDriver(driverInfo.orderNo);
});

$('.commment').on('click', function () {
    if ('1' == $(this).attr('data-type')) {
        window.location.href = '/onlineComment/evaluate?orderNo=' + driverInfo.orderNo + '&token=' + $.cookie('token');
    }
    else if ('2' == $(this).attr('data-type')) {
        window.location.href = '/onlineComment/evaluated?orderNo=' + driverInfo.orderNo + '&token=' + $.cookie('token');
    }
});

//点击更多
$('#more').on('click', function () {
    var self = $(this),
        $modal = $('.more-modal');

    if (!self.data('state') || self.data('state') == 'close') {
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

//投诉建议
$('.complain').on('click', function () {
    $('#more').removeClass('open').data('state', 'close');
    $('.more-modal').hide();

    //弹窗提示
    $.dialog({
        html: '<div class="complain-header">' +
        '<h4>投诉</h4>' +
        '<div class="tel-type">' +
        '<label data-href="tel:' + driverInfo.superviseTel + '">监管电话:'+driverInfo.superviseTel+'</label>' +
        '</div>' +
        '</div>' +
        '<form id="complain-reason">' +
        '<label><input type="radio" name="reason" value="司机态度恶劣" checked /> 司机态度恶劣</label>' +
        '<label><input type="radio" name="reason" value="司机中途甩客" /> 司机中途甩客</label>' +
        '<label><input type="radio" name="reason" value="车辆与描述不符" /> 车辆与描述不符</label>' +
        '<label><input type="radio" name="reason" value="司机中途加价" /> 司机中途加价</label>' +
        '<label class="other-reason"><input type="radio" name="reason" value="other" /> 其他原因</label>' +
        '<div class="frm-item"><textarea class="scroll-bar" maxlength="200" placeholder="请描述（内容匿名，可放心填写）"></textarea><span class="amount">0/200</span></div>' +
        '</form>',
        buttons: [{
            text: '取消',
            onClick: function () {
                console.log('取消')
            }
        }, {
            text: '提交',
            onClick: function () {
                var radioTag = $("#complain-reason  input[type='radio']:checked")
                var complaintContent = null;
                if ("other" != radioTag.val()) {
                    complaintContent = radioTag.val();
                } else {
                    complaintContent = $("#complain-reason  textarea").val();
                }
                var complaintParams = {
                    'orderNo': driverInfo.orderNo,
                    'content': complaintContent,
                    'token': $.cookie('token')
                }

                $.post("/baseOnlineCar/addComplaint", complaintParams, function (data) {
                    if (data.code == 0) {
                        var $success = $('.complain-success'),
                            $success_li = $success.find('.content li'),
                            $result = $success_li.eq(0),
                            $reason = $success_li.eq(1);
                        //投诉结果和处理信息
                        var result_txt = '客服已收到',
                            result_tips = '我们将尽快给您安排处理，给您本次出行带来的不便，深感歉意';
                        $result.find('h4').text('投诉结果：' + "");
                        $result.find('p').text(result_tips);

                        //投诉原因
                        $reason.find('p').text(complaintContent);

                        //展示
                        $success.show();
                    } else {
                        $.alert(data.message);
                    }

                }, 'json');

            }
        }]
    });


    //reset dialog
    $('.sui-dialog').addClass('reset-dialog complain');

    //其他原因
    $('#complain-reason label').on('click', function () {
        if ($(this).hasClass('other-reason')) {
            $('.frm-item').show();
        } else {
            $('.frm-item').hide();
        }
    });

    //计算
    $('.frm-item textarea').on('input', amountHandler);
    $('.frm-item textarea').on('change', amountHandler);

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

    function amountHandler() {
        var self = $(this);
        var len = self.val().length;

        if (len > 200) {
            $.trim(self.val()).length = 200;
        } else {
            self.next().text(len + '/200')
        }

        utf16toEntities(self.val());
    }

});

//紧急联系人
$('.sos').on('click', function () {
    $('#more').removeClass('open').data('state', 'close');
    $('.more-modal').hide();

    //发送求助短信
    var params = {
        'orderNo': driverInfo.orderNo,
        'token': $.cookie('token')
    }

    $.confirm("是否确定发送紧急求助?", '温馨提示', ['取消', '确定'], function () {
        $.post("/baseOnlineCar/sendSosMsg", params, function (data) {
            if (data.code != 0) {
                //没有设置紧急联系人
                $.confirm(data.message, '温馨提示', ['取消', '去设置'], function () {
                    window.location.href = '/passenger/contacts.html?type=online&orderNo=' + driverInfo.orderNo;
                    //跳转到紧急联系人页面
                }, function () {

                })
            } else {
                $.alert(data.message);
            }

        }, 'json');
        //跳转到紧急联系人页面
    }, function () {

    })

});


function parseTimeToHMS(costTime) {
    //总秒数
    var totalsecond = parseInt(costTime / 1000);
    //秒数
    var second = totalsecond % 60;
    //总分钟
    var totalminite = parseInt(totalsecond / 60);
    //分钟
    var minite = totalminite % 60;
    //总小时
    var hour = parseInt(totalminite / 60);
    if (hour < 1) {
        return (minite + "分钟" + second + "秒");
    }
    return (hour + "小时" + minite + "分钟" + second + "秒");
}

//投诉建议 - 提交成功 - 知道了
$('.complain-success .confirm').on('click', function () {
    $('.complain-success').hide();
});

$('#payBtn').off('click').on('click', function () {
    var userCouponId = 0;
    var selectedCoupon = JSON.parse(localStorage.getItem('selectedCoupon'));
    if (undefined != selectedCoupon &&  selectedCoupon != null){
        userCouponId = selectedCoupon.recordId == 'null'?0:selectedCoupon.recordId;
    }

    var b = new Base64();
    var url = b.encode('/bus/toOnlineCarOrderDetail?orderNo='+driverInfo.orderNo);
    window.location.href='/order/payunit?orderNo='+driverInfo.orderNo+'&settleType='+driverInfo.settleType+'&userCouponId='+userCouponId+'&url='+url;

    // var orderNo = $('#orderNo').val();
    // window.location = '/bus/toOnlineCarOrderDetail?token=' + $.cookie('token') + '&orderNo=' + orderNo + '&toPay=1&recordId=' + $('#recordId').val();
});

//分享行程
$('.share-btn').on('click', function () {
    //隐藏更多操作
    $('#more').removeClass('open').data('state', 'close');
    $('.more-modal').hide();
    $('.share-box').show();
});
$('.share-box').on('click', function () {
    $(this).hide();
});
$('.share-tips').on('click', function () {
    return false;// 阻止事件冒泡
})

//TODO 优惠券选择
$('#couponsBox').off('click').on('click', function () {
    var clickable = $(this).data('clickable');
    if(clickable){
        window.location = '/coupon/select?orderNo='+driverInfo.orderNo+'&businessType='+businessParam.onlineCar;
    }else{
        return;
    }
})

function  shareUserLine() {
    var reqUrl = CURRENT_SERVER + '/baseOnlineCar/share?orderNo=' + driverInfo.orderNo + '&driverLng=111.22&driverLat=1111.222';
    var shareObj = {
        url: window.location.href,
        logo: CURRENT_SERVER + '/res/images/line/online_car_share.png',
        desc: "我正在使用网约车，现把行程分享给您",
        title: "中交出行安全出行"
    }
    wxLineRequireShare(shareObj, reqUrl);
}

function initCouponVal() {
    var selectedCoupon = JSON.parse(window.localStorage.getItem('selectedCoupon'));

    //检查优惠券用户是否为当前用户，如果不是当前用，则需要重置
    if(undefined != selectedCoupon){
        var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
        if (selectedCoupon.userId!=userInfo.id) {
            selectedCoupon = undefined;
        }
    }
    if(undefined != selectedCoupon && null != selectedCoupon){
        if (selectedCoupon.isValid == 1) {
            var oldPrice = $('#oldPrice').val();
            $('#couponsBox').removeClass('no-discount');
            // 0--固定金额  1--折扣
            var isDiscount = selectedCoupon.isDiscount;
            if(isDiscount == '0'){
                
                $('#recordId').val(selectedCoupon.recordId);
                $('#amount').val(selectedCoupon.amount);
                var result = parseFloat(oldPrice) - parseFloat(selectedCoupon.amount);
                if (result >= 0) {                   
                    $('#newPrice b').html(formatMoney(result,2));
                    $('#couponsBox .discount').html('-'+selectedCoupon.amount + '元&nbsp;&gt;');
                } else {
                    $('#couponsBox .discount').html('-'+ oldPrice + '元&nbsp;&gt;');
                    $('#newPrice b').html(0);
                }
            }else if(isDiscount == '1'){
                var discountMaxLimitAmount = selectedCoupon.discountMaxLimitAmount;//最大抵扣金额
                var newPrice = parseFloat(oldPrice)*100*selectedCoupon.amount*10/10000;//折扣后支付金额
                newPrice = formatMoney(newPrice);
                var discountVal = parseFloat(oldPrice) - parseFloat(newPrice);//折扣券抵扣金额
                if(discountVal >= discountMaxLimitAmount){
                    newPrice = parseFloat(oldPrice) - parseFloat(discountMaxLimitAmount);
                    discountVal = discountMaxLimitAmount;
                }
                $('#couponsBox .discount').html('-'+ formatMoney(discountVal,2) + '元&nbsp;&gt;');
                $('#newPrice b').html(formatMoney(newPrice,2));
            }
        } else {
            if(selectedCoupon.recordId == '0'){//不使用优惠券
                $('#recordId').val(0);
                $('#amount').val('');
                $('#couponsBox .discount').html('不使用券&nbsp;&gt;');
                $('#newPrice b').html($('#oldPrice').val());
            }else {
                $('#recordId').val('');
                $('#amount').val('');
                $('#couponsBox .discount').html('无可用券&nbsp;&gt;');
                $('#newPrice b').html($('#oldPrice').val());
            }
        }

    }else{
        //调用查询优惠券信息接口
        var param = {
            businessType:'onlineCar',
            orderNo:driverInfo.orderNo
        }
        queryHasCoupons(param, function (data) {
            if (data.isValid == 1) {
                $('#couponsBox').removeClass('no-discount');
                $('#recordId').val(data.recordId);
                $('#amount').val(data.amount);

                var oldPrice = $('#oldPrice').val();
                //0--固定金额  1--折扣
                var isDiscount = data.isDiscount;
                if(isDiscount == '0'){
                    var result = parseFloat(oldPrice) - parseFloat(data.amount);
                    if( result>= 0){
                        var newPrice = parseFloat(oldPrice) - parseFloat(data.amount);
                        newPrice = formatMoney(newPrice,2);
                        $('#newPrice b').html(newPrice);
                        $('#couponsBox .discount').html('-'+data.amount+'元&nbsp;&gt;');
                    }else {
                        $('#couponsBox .discount').html('-'+oldPrice+'元&nbsp;&gt;')
                        $('#newPrice b').html(0);
                    }
                }else if(isDiscount=='1'){
                    var discountMaxLimitAmount = data.discountMaxLimitAmount;//最大抵扣金额
                    var newPrice = parseFloat(oldPrice)*100*data.amount*10/10000;//折扣后金额
                    newPrice = formatMoney(newPrice);
                    var discountVal = parseFloat(oldPrice) - parseFloat(newPrice);//折扣券抵扣金额
                    if(discountVal >= discountMaxLimitAmount){
                        newPrice = parseFloat(oldPrice) - parseFloat(discountMaxLimitAmount);
                        discountVal = discountMaxLimitAmount;
                    }
                    $('#couponsBox .discount').html('-'+formatMoney(discountVal,2)+'元&nbsp;&gt;')
                    $('#newPrice b').html(formatMoney(newPrice,2));
                }


                var selectedCoupon = {
                    userId:0,
                    isValid:data.isValid,
                    recordId:data.recordId,
                    amount:data.amount,
                    isDiscount: data.isDiscount,
                    discountMaxLimitAmount: data.discountMaxLimitAmount
                }
                var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
                selectedCoupon.userId=userInfo.id;
                localStorage.setItem("selectedCoupon",JSON.stringify(selectedCoupon));

            } else {
                if(data.recordId == 0){//不使用优惠券
                    $('#couponsBox').addClass('no-discount');
                    $('#recordId').val(0);
                    $('#amount').val('');
                    $('#couponsBox .discount').html('不使用券&nbsp;&gt;');
                    $('#newPrice b').html($('#oldPrice').val());
                    var selectedCoupon = {
                        userId:0,
                        isValid:0,
                        recordId:0,
                        amount:0
                    }
                    var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
                    selectedCoupon.userId=userInfo.id;
                    localStorage.setItem("selectedCoupon",JSON.stringify(selectedCoupon));

                }else{
                    $('#recordId').val('');
                    $('#amount').val('');
                    $('#couponsBox .discount').html('无可用券&nbsp;&gt;');
                    $('#newPrice b').html($('#oldPrice').val());
                    window.localStorage.removeItem("selectedCoupon");
                }
            }

        });
    }
}


function initMap(SimpleMarker,PathSimplifier) {
    var map = new AMap.Map('allmap', {
        resizeEnable: true,
        zoom: 16,
        center: [driverInfo.departLng,driverInfo.departLat]
    });


    /**
     *@param policy         驾车路线规划策略
     *@param map            AMap.Map对象, 展现结果的地图实例
     *@param hideMarkers    是否隐藏线路规划点图标
     */
    var driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME,
        map: map,
        hideMarkers: true
    });

    /**
     *@param    origin          起点
     *@param    destination     目的地
     *@param    waypoints       途径点：也许有，也许没有，可以选填{waypoints: waypoints}
     */
    var origin = new AMap.LngLat(driverInfo.departLng, driverInfo.departLat),
        destination = new AMap.LngLat(driverInfo.arriveLng, driverInfo.arriveLat);

    //规划成功 - 标注点

    driving.search(origin, destination, function (status, result) {
        if (status == 'complete') {
            //规划成功 - 标注点
            markerPoints(origin, 'start')
            markerPoints(destination, 'end')

            //设置起点为中心点
            map.setCenter(origin)
        } else if (status == 'no_data') {
            //返回0结果
        } else if (status == 'error') {
        }
    });

    /**
     *@param    position    坐标
     *@param    icon        图标
     *@param    offset      图标偏移量
     */
    function markerPoints(points, mark) {
        if (points instanceof Array) {
            //途径点
            for (var i = 0; i < points.length; i++) {
                new AMap.Marker({
                    map: map,
                    position: points[i],
                    icon: new AMap.Icon({
                        image: "/res/images/bus/map-4.png",
                        size: new AMap.Size(26, 26),  //图标大小
                        imageSize: new AMap.Size(13, 13),
                        imageOffset: new AMap.Pixel(0, 0)
                    }),
                    offset: new AMap.Pixel(0, 0)
                })
            }
        } else if (typeof points == 'object' && typeof mark == 'string') {
            //起点和目的地
            new AMap.Marker({
                map: map,
                position: points,
                icon: new AMap.Icon({
                    image: "/res/images/bus/map-" + mark + ".png",
                    size: new AMap.Size(50, 72),  //图标大小
                    imageSize: new AMap.Size(25, 36),
                    imageOffset: new AMap.Pixel(0, 0)
                })
            })
        }
    }

    var prePosition = origin;
    function planRoute(passengerPosition,driverPlanRoute ) {
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
        name: '行程中',
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
        },
        messageCallback: function(event) {
            var temptType = event.data.data.type;
            if(driverInfo.orderNo != event.data.data.orderNo){
                return false;
            }

            var serviceId=event.data.serviceId;

            //type:1:去接乘客 2:司机抵达出发地 3:司机接到乘客 4:司机抵达目的地 5:司机取消订单 6:乘客取消订单 7:抢单成功
            if(serviceId == '1005'){
                var longitude = event.data.data.longitude;//经度
                var latitude = event.data.data.latitude;//纬度
                if(longitude == null || latitude ==null){
                    var driverPosition = origin; //司机位置
                }else{
                    var driverPosition = new AMap.LngLat(longitude+"", latitude+"") //司机位置
                }
                planRoute(origin, driverPosition);
            }
            var data = event.data.data;

            if((temptType == 4 || temptType==8 || temptType==9) && serviceId == '1006'){
                //TODO 跳转订单页面
                if (data.orderNo) {
                    //立即支付
                	var type = $("#calculateType").val(); // 支付方式 1、打表计价
                	if (type == 1){
                		if (temptType==8 || temptType==9){
                			window.location = '/bus/toOnlineCarOrderDetail?orderNo=' + driverInfo.orderNo + '&token=' + $.cookie('token') + '&toPay=1&recordId=' + $('#recordId').val();
                		}
                	}
                	else{
                		window.location = '/bus/toOnlineCarOrderDetail?orderNo=' + driverInfo.orderNo + '&token=' + $.cookie('token') + '&toPay=1&recordId=' + $('#recordId').val();
                	}
                }
            }
        }
    })
    wss.init();

}
function initCostTime() {
    var timestr = parseTimeToHMS(parseInt(driverInfo.costTime));
    var timestamp = new Date().getTime();
    if (driverInfo.tripStatus == 6) {
        var auto = setInterval(function () {
            var curtimestamp = new Date().getTime();
            var thiscosttime = parseInt(driverInfo.costTime) + (curtimestamp - timestamp)
            timestr = parseTimeToHMS(thiscosttime);
            $("#costTime").html("已行驶：" + timestr)
        }, 1000);
    } else {
        $("#costTime").html("行驶时长：" + timestr)
    }
}

function selectCoupon(){
    var status = $("#status").val;
    var realPrice = $("#realPrice").val;
    var couponMoney = $("#couponMoney").val;
    var result =  parseFloat(realPrice) - parseFloat(couponMoney);
    if (status > 3 && couponMoney > 0){
        if (result > 0){
            $('#couponsBox .discount').html('-'+couponMoney + '元&nbsp;&gt;');
        }
        else{
            $('#couponsBox .discount').html('-'+realPrice + '元&nbsp;&gt;');
        }
    }
}

function initShow(){
	var type = $("#calculateType").val()
	if (type == 1){
		$(".normal-price-box .left").text("预估价(以实际行驶为准)");
		$("#payBtn").text("行程结束后支付").css({"pointer-events":"none","background-color":"#CCC"});
	}
	else{
		$(".normal-price-box .left").text("一口价");
		$("#payBtn").text("立即支付").css({"pointer-events":"","background-color":"#6392FE"});
	}
}

$(function () {
    backtoUrl('/passenger/onlineCarOrderList.html');
    initCouponVal();
    selectCoupon();
    initShow();
    initCostTime();
    shareUserLine();
    //map
    AMapUI.loadUI([ 'overlay/SimpleMarker','misc/PathSimplifier'], function (SimpleMarker,PathSimplifier) {
        if (!PathSimplifier.supportCanvas) {
        	$.toast('当前环境不支持 Canvas！');
            return;
        }
        initMap(SimpleMarker,PathSimplifier)
    })

});
