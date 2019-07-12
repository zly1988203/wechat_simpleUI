var orderInfo = {
    orderNo : $('#toMapOrderNo').val(),
    customrMobile:$('#customrMobile').val(),
    settleType:$('#settleType').val(),
    status:$('#status').val(),
    orderStatusInt:$('#orderStatusInt').val(),
    autoShowPay:$('#autoShowPay').val(),
    isRefundFlag:$('#isRefundFlag').val(),
    couponId:$('#couponId').val(),
    tripDate:$('#tripDate').val(),
    busId:$('#busId').val(),
    countDownTimeStr:$('#countDownTimeStr').val(),
    price:$('#price').val(),
    couponPrice:$('#couponPrice').val(),
    specialPrice:$('#specialPrice').val()
}




//查看站点，共有
$('#toMap').on('click', function() {
    var urlStr = SERVER_URL_PREFIX+'/commute/commuteOrder/toOrderDetailMap';
    var orderNo = $('#toMapOrderNo').val();
    var dataObj = {
    };
    dataObj = genReqData(urlStr, dataObj);
    window.location.href="/commute/commuteOrder/toOrderDetailMap?token="+dataObj.token+"&orderNo="+orderNo+"&src=order";

});

//拨打司机电话，共有
$('#callDriver').on('click', function() {
    var mobile = $('#callDriver').attr('data-mobile');
    window.location.href = 'tel:'+ mobile;
});

// 去支付，仅等待支付页面
$('#confirmPay').on('click', function () {
    var settleType = orderInfo.settleType;
    var orderNo = orderInfo.orderNo;
    var couponId = orderInfo.couponId==""?0:orderInfo.couponId;
    var b = new Base64();
    var url = b.encode("/commute/paymentUnit.html?token="+$.cookie('token')+"&orderNo="+orderNo);
    window.location.href='/order/payunit?orderNo='+orderNo+'&settleType='+settleType+'&userCouponId='+couponId+'&url='+url;
});

// 取消订单,等待支付页
$('#cancel').on('click', function () {
    cancel();
});

//再次购票
$('#toBuy').on('click',function(){
    var departStationId = $("#departStationId").val();
    var arriveStationId = $("#arriveStationId").val();
    var arriveTitle = $("#arriveTitle").html();
    var departTitle = $("#departTitle").html();
    var stationInfo = {
        departStationId:departStationId,
        arriveStationId:arriveStationId,
        arriveTitle:arriveTitle,
        departTitle:departTitle
    }
    sessionStorage.setItem('stationInfo',JSON.stringify(stationInfo));
    window.location='/commutingBus/searchLineResult?searchType=2';
});

//退票
$('#refund').on('click',function(){
    var orderNo = $('#toMapOrderNo').val();
    window.location.href = '/commute/toBatchRefund?orderNo='+orderNo;
});

function setPrice(){
    //设置实际支付金额
    var ticketPrice = orderInfo.price;//票价总额
    var couponPrice = orderInfo.couponPrice;//优惠券金额
    var payPrice;//实际支付金额
    var orderStatusInt = orderInfo.orderStatusInt;//订单状态
    var specialPrice = orderInfo.specialPrice;//特价优惠金额
    if(parseFloat(specialPrice) > 0) {
        $('#specialPriceStr').text(-specialPrice + '元');
        $('#specialPriceDetail').show();

    }
    var payTicektPrice = ticketPrice - specialPrice;
    if(payTicektPrice <= couponPrice){
        couponPrice = payTicektPrice;
    }
    if(payTicektPrice >= ticketPrice){
        ticketPrice = payTicektPrice;
    }
    payPrice = payTicektPrice - couponPrice;
    payPrice = saveTwoDigit(payPrice);
    $('#payPrice').text(payPrice+'元');
    $('#ticketPrice').text(ticketPrice+'元');
    if(orderInfo.orderStatusInt==1){
        $('#confirmPay').text('确认支付'+payPrice+'元');
    }
    var couponPriceHtml = couponPrice > 0 ? '-'+couponPrice.toFixed(2)+'元' : 0 + '元';
    $('#couponPriceStr').text(couponPriceHtml);
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

function cancel(){
    $.confirm('确定取消当前订单？', '', ['取消订单', '再想想'], function(){
    }, function(){
        var urlStr = SERVER_URL_PREFIX+'/busline/busOrder/cancelOrder';
        console.log('btn 2');

        //api url
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
                        window.location.href="/passenger/commute-order-list.html";

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


function initPage() {
    //展示退票详情
    if(orderInfo.isRefundFlag == 1 || orderInfo.isRefundFlag == 2 || orderInfo.isRefundFlag == 3){
        $('#refundDetail').show();
    }

    if(orderInfo.orderStatusInt!=1){
        var tripDate = orderInfo.tripDate;
        if(tripDate == ''){
            backtoUrl('/passenger/commute-order-list.html');
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
}

$(function(){
    initPage();
    //初始化頁面
    setPrice();
    //规则
    $.ruleInit();
    /* 等待支付页 */
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
                        window.location.href="/bus/toCommuteOrderDetail?token="+$.cookie('token')+"&orderNo="+orderInfo.orderNo;
                    }else{
                        $.alert((result&&result.message) || "未知错误");
                    }

                },
            });
        });
    }
});