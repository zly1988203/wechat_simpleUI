var orderInfo = {
    orderNo : $('#orderNo').val(),
    customrMobile:$('#customrMobile').val(),
    settleType:$('#settleType').val(),
    tripDate:$('#tripDate').val(),
    orderStatusInt:$('#orderStatusInt').val(),
    orderType:$('#orderType').val(),
    isRefundFlag:$('#isRefundFlag').val(),
    refundInsuranceCounts:$('#refundInsuranceCounts').val(),
    status:$('#status').val(),
    countDownTimeStr:$('#countDownTimeStrToShowFirst').val(),
    busId:$('#busId').val(),
    price:$('#price').val(),
    insuranceFee:$('#insuranceFee').val(),
    couponPrice:$('#couponPrice').val(),
    specialPrice:$('#specialPrice').val(),
    payPrice : $('#payPrice').val(),
    couponId : $('#couponId').val(),

    departStation : $('#departStation').val(),
    departStationId : $('#departStationId').val(),
    arriveStationId : $('#arriveStationId').val(),
    arriveStation : $('#arriveStation').val(),

}

function unLock(){
    lock=false;
}

var lock = false;
$(function(){
    orderStatusInt = orderInfo.orderStatusInt;
    if(orderStatusInt!=1){
        var tripDate = orderInfo.tripDate;
        if(tripDate == ''){
            if(orderInfo.orderType == '9'){
                backtoUrl('/passenger/travel-order-list.html');
            }else{
                backtoUrl('/passenger/order-list.html');
            }
        }else{
            backtoUrl('/trip/toTripListPage?tripDate='+tripDate);
        }
    }else{
        pushHistory();
        window.addEventListener("popstate", function(e) {
            $.closeDialog();
            pushHistory();
            cancel();
        }, false);
    }


    if(orderInfo.isRefundFlag == 1 || orderInfo.isRefundFlag == 2 || orderInfo.isRefundFlag == 3){
        $('#refundDetail').show();
    }

    if(orderInfo.refundInsuranceCounts > 0){
        $('#refundInsuranceDetail').show();
    }

    $('.lineInfo').off('click.localstrorage').on('click.localstrorage',function(){
        var fromUrl = window.location.href;
        localStorage.setItem("travelOrderDetail",fromUrl);
    });
});

//查看站点，共有
$('#toMap').on('click', function() {
    var urlStr = SERVER_URL_PREFIX+'/busline/busOrder/toOrderDetailMap';
    var dataObj = {
    };
    dataObj = genReqData(urlStr, dataObj);
    window.location.href="/busline/busOrder/toOrderDetailMap?token="+dataObj.token+"&orderNo="+orderInfo.orderNo+"&src=order";

});

//拨打司机电话，共有
$('#callDriver').on('click', function() {
    var mobile = $('#callDriver').attr('data-mobile');
    window.location.href = 'tel:'+ mobile;
});
function detail(data){
    location.href = "/trip/toTripListPage";
}

$('#toPay').on('click', function () {
    var settleType = orderInfo.settleType;
    var orderNo = orderInfo.orderNo;
    var b = new Base64();
    var couponId = orderInfo.couponId==""?0:orderInfo.couponId;
    var url = b.encode("/bus/h5/paymentUnit.html?token="+$.cookie('token')+"&orderNo="+orderNo);
    window.location.href='/order/payunit?orderNo='+orderNo+'&settleType='+settleType+'&userCouponId='+couponId+'&url='+url;
});

$('#timeout').on('click', function () {
    var urlStr = SERVER_URL_PREFIX+'/busIndex';
    var dataObj = {
    };
    dataObj = genReqData(urlStr, dataObj);
    window.location.href="/busIndex?token="+dataObj.token;
});

// 去支付，仅等待支付页面
$('#confirmPay').on('click', function () {
    var settleType = orderInfo.settleType;
    var orderNo = orderInfo.orderNo;
    var couponId = orderInfo.couponId==""?0:orderInfo.couponId;
    var b = new Base64();
    var url = b.encode("/bus/h5/paymentUnit.html?token="+$.cookie('token')+"&orderNo="+orderNo);
    window.location.href='/order/payunit?orderNo='+orderNo+'&settleType='+settleType+'&userCouponId='+couponId+'&url='+url;
});

$('#cancel').on('click', function () {
    cancel();
});

/* 等待支付页 */
$(function() {
    // 倒计时
    var timeToUse = orderInfo.countDownTimeStr; //时间
    var flag = orderInfo.orderStatusInt;
    //待支付才启用
    if(flag==1){
        //填充元素到body最前面
        //var $cd = $('<div class="count-down">请在<span class="minute">1</span>分<span class="second">0</span>秒内支付，超时未支付订单将自动取消。</div>');
        //$('body').prepend($cd);
        countDown(timeToUse, function (m, s) {
            //$('#count').text('去支付(倒计时' + m + ':' + s + ')');
            $('.count-down').show();
            $('.minute').text(m);
            $('.second').text(s);
        }, function () {

            var urlStr = SERVER_URL_PREFIX+'/busline/busOrder/cancelOrder';
            var dataObj = {
                orderNo: orderInfo.orderNo,
            };
            dataObj = genReqData(urlStr, dataObj);
            $.ajax({
                type: 'POST',
                url:urlStr,
                data:dataObj,
                dataType:  "json",
                success: function(result){
                    if(result&&result.code==0){
                        $('.btn-group').remove();
                        //$('.count-down').remove();
                        //$('#timeout').show();
                        //var $cd = $('<div class="primary" id="timeout">支付超时，请重新购买。</div>');
                        //$('body').prepend($cd);
                        window.location.href="/bus/toBusOrderDetail?token="+$.cookie('token')+"&orderNo="+orderInfo.orderNo;
                    }else{
                        $.alert((result&&result.message) || "未知错误");
                    }

                },
            });


        });
    }

    // 分钟倒计时
    function countDown(t, action, callback) {
        var autoPlay = null;
        var d = new Date("1111/1/1,0:" + t);

        autoPlay = setInterval(function() {
            var m = d.getMinutes();
            var s = d.getSeconds();

            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;

            // 执行
            action && action(m, s);

            //结束
            if (m == 0 && s == 0) {
                clearInterval(autoPlay);
                callback && callback();
                return;
            }

            d.setSeconds(s - 1);
        }, 1000);
    }

});
//初始化頁面
$(function(){
    //设置金额
    setPrice();
    //规则
    $.ruleInit();
    //
});
//再次购票
$('.toBuy').on('click',function(){
    var busId = orderInfo.busId;
    var lineType = 1;// lineType 1.定制  2.通勤 3旅游'
    var orderType = orderInfo.orderType;//1-同城;2-城际;3-出租车;4-大巴线路;5-大巴包车;6-汽车票;7-上下班;8-扫码支付;9-旅游班线;10-网约车;17-城际网约车;18-同城网约车
    if(orderType == '9'){
        lineType = 3;
    }

    //定制班线优化跳转页面
    if(orderType == '4'){
        window.location="/cityBus/lineListCityBus?token="+$.cookie("token")+"&lineType=1&search=2"+
            '&departStationId='+ orderInfo.departStationId + '&arriveStationId=' + orderInfo.arriveStationId+
            '&departStation='+  orderInfo.departStation + '&arriveStation=' + orderInfo.arriveStation;
    }else{
        //否则还是原线路
        window.location="/bus/lineList?"+"token="+$.cookie("token") + "&busId=" + busId + '&lineType=' + lineType;
    }

});

//退票
$('#refund').on('click',function(){
    window.location.href = "/busline/toRefundTicket?orderNo="+orderInfo.orderNo;
});

function setPrice(){
    //设置票价总额=price-保险金额
    var price = parseFloat(orderInfo.price);//price=票价总额+保险金额
    var insuranceFee = parseFloat(orderInfo.insuranceFee);//保险金额
    var couponPrice = parseFloat(orderInfo.couponPrice);//优惠券金额
    var specialPrice = parseFloat(orderInfo.specialPrice);//特价优惠金额
    var ticketPrice = price;
    var payPrice;

    var payTicektPrice = 0;//实际票价
    if(parseFloat(specialPrice) > 0) {
        $('#specialPriceDetail .value').text(-specialPrice + '元');
        $('#specialPriceDetail').show();

    }
    payTicektPrice = ticketPrice - specialPrice;
    if(payTicektPrice <= couponPrice){
        couponPrice = payTicektPrice;
    }
    if(payTicektPrice >= ticketPrice){
        ticketPrice = payTicektPrice;
    }
    //订单状态
    var orderStatusInt = orderInfo.orderStatusInt;
    payPrice = parseFloat( payTicektPrice + insuranceFee  - couponPrice);
    couponPrice = saveTwoDigit(couponPrice);
    //待支付时,设置实际支付金额
    if(orderStatusInt==1){//未支付状态或上车支付状态
        payPrice = saveTwoDigit(payPrice);
        $('#confirmPay').text('确认支付'+payPrice+'元');
    }else if(orderStatusInt==2){
        //上车支付时，实际支付金额=票价
        //不做处理
    }else{
        //支付状态,实际支付金额直接取数据库中的payPrice
        payPrice = orderInfo.payPrice;
        if(payPrice <= 0){
            payPrice = parseFloat(payTicektPrice + insuranceFee  - couponPrice);
        }
    }
    payPrice = saveTwoDigit(payPrice);
    $('#payPrice').text(payPrice + '元');
    $('#payPriceTxt').text(payPrice + '元');
    var couponPriceHtml = couponPrice > 0 ? '-'+couponPrice+'元' : 0 + '元';
    $('#couponPrice').text(couponPriceHtml);
    $('#couponPriceTxt').text(couponPriceHtml);
    $('#ticketPrice').text(ticketPrice + '元');
}


function cancel(){
    $.confirm('确定取消当前订单？', '', ['取消订单', '再想想'], function(){
    }, function(){
        var urlStr = SERVER_URL_PREFIX+'/busline/busOrder/cancelOrder';
        //current page param
        var dataObj = {
            orderNo: orderInfo.orderNo,
        };
        //merge page param and common param,generate request param
        dataObj = genReqData(urlStr, dataObj);
        $.ajax({
            type: 'POST',
            url:urlStr,
            data:dataObj,
            dataType:  "json",
            success: function(result){
                if(result&&result.code==0){
                    $.alert('取消成功', function() {
                        console.log('ok');
                        if(orderInfo.orderType == '9'){
                            window.location.href="/passenger/travel-order-list.html";
                        }else{
                            window.location.href="/passenger/order-list.html";
                        }
                    });
                }else{
                    $.alert((result&&result.message) || "未知错误");
                }

            },
        });
    });
}

$('.ticket-rule').on('click',function(){
});