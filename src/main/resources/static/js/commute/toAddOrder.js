var orderInfo = {
    qrcId:$('#qrcId').val(),
    busId:$('#busIds').val(),
    price:$('#price').val(),
    specialPrice:$('#specialPrice').val(),
    settleType:$('#settleType').val()
}

// 绑定滚动条
var _myIScroll;
var bindScroll = function(el) {
    if(_myIScroll) {
        _myIScroll.destroy();
    }
    setTimeout(function() {
        _myIScroll = new IScroll(el + ' .listWrapper');
    }, 300);
}

$('.listWrapper').each(function() {
    $(this).css('height', ($(window).height() - 74) + 'px');
});

// 打开选择优惠券
$('.coupon-toggle').on('click', function() {
    var busId = orderInfo.busId;
    var price = orderInfo.price;
    var specialFlag = parseFloat(orderInfo.specialPrice) > 0?1:0;
    window.location = '/coupon/select?businessType='+businessParam.commute+'&busId='+busId+'&specialFlag='+specialFlag+'&price='+price;
});
/*
* 交通意外险 - 操作
* */
function insuranceHandle() {
    // 打开选择交通意外险
    $('.insurance-toggle').on('click', function() {
        $('#insuranceList').popup('modal', function() {
            bindScroll();
        });
    });

    // 不使用交通意外险
    $('#closeInsurance').on('click', function() {
        $('#insuranceList').closePopup();
    });

    // 选中交通意外险
    $('.insurance-list .item').on('tap', function() {
        $('#insuranceList').closePopup();
    });

    // 显示保险说明
    $('.insurance-rule').on('tap', function(e) {
        e.stopPropagation();
        $('#insuranceRule').popup('push');
    });
}


$('.payment-way li').off('click').on('click', function() {
    $(this).find('input').prop('checked', true);
});

$("#confirmPay").click(function(){
    submitOrder();
});

function isExist(data) {
    if(typeof data == 'undefined' || data == undefined || data == null || data === ''){
        return false;
    }else {
        return true;
    }
}

/**
 *提交订单
 */
var lock=false;
function submitOrder(){
    $.showLoading()
    if(!lock){
        lock = true;
        var data={};
        var couponId=$("#couponUsePrice").data('id');//优惠券
        if(!isExist(couponId)){
            couponId = '0';
        }
        if(couponId&&couponId!=null){
            data.couponId=couponId;
        }

        data.qrcId = orderInfo.qrcId;
        data.busIds= orderInfo.busId;
        data.token=$.cookie("token");
        data.specialPrice = orderInfo.specialPrice;
        $.post("/commute/addOrder",data,function(result){
            $.hideLoading();
            if(result.code == 0){
                var orderNo = result.data;
                var settleType = orderInfo.settleType;
                var b = new Base64();
                var url = b.encode("/commute/paymentUnit.html?token="+$.cookie('token')+"&orderNo="+orderNo);
                window.location.href='/order/payunit?orderNo='+orderNo+'&settleType='+settleType+'&userCouponId='+couponId+'&url='+url;
            }
            else if(result.code == 30086){
                window.location.href = '/commute/commuteOrder/toPaySuccess?orderNo='+result.data; // 0元支付
            }
            else if(result.code == 30087){
                $.alert('支付失败，已关闭此订单',function(){
                    window.location.href = '/commuteIndex';
                });
            }else if(result.code == 30001){
                $.alert(result.message,function(){
                    history.go(0);
                })
            }else if(result.code == 88888){
                $.alert('10秒之内不允许重复操作下单');
            }else if(result.code == 88889){
                $.alert('您已存在待支付的订单',function(){
                    window.location.href = '/bus/toCommuteOrderDetail?orderNo='+result.data;
                });
            }
            else if(result.code == 88890){
                $.alert(result.message,function(){
                    window.location.href = '/bus/toCommuteOrderDetail?orderNo='+result.data;
                });
            }else{
                $.alert(result.message);
            }
            lock = false;
        },'json');
    }
}

function initPage() {
    var price = $('#price').val();
    var specialPrice = $('#specialPrice').val();

    if(parseFloat(price) > parseFloat(specialPrice)){
        $('#couponLi').show();
    }
}

function calculateTotalPrice(){
    var totalPrice = parseFloat(orderInfo.price) - parseFloat(orderInfo.specialPrice);
    var couponPrice=$("#couponUsePrice").attr('data-price');
    if(couponPrice&&couponPrice!=null){
        if(couponPrice>totalPrice){
            totalPrice=0;
        }else{
            totalPrice=totalPrice-couponPrice;
        }
    }
    totalPrice = Math.floor(totalPrice.toFixed(2)* 100) / 100;
    $('#confirmPay').html("确认支付"+totalPrice+"元");
}

function loadCoupons() {
    //一口价-特价优惠 = 支付价格 + 优惠券抵扣价格
    var selectedCoupon = JSON.parse(window.localStorage.getItem('selectedCoupon'));

    //检查优惠券用户是否为当前用户，如果不是当前用，则需要重置
    if(undefined != selectedCoupon){
        calculateCouponPrice(selectedCoupon)
        calculateTotalPrice();
    }else{
        //调用查询优惠券信息接口
        var param = {
            businessType:'commute',
            busId :orderInfo.busId,
            price : orderInfo.price,
            specialFlag : parseFloat(orderInfo.specialPrice) > 0?1:0
        }
        queryHasCoupons(param,function (data) {
            calculateCouponPrice(data);
            calculateTotalPrice();
        });
    }

}

function calculateCouponPrice(data) {
    if(data.isValid == 1){
        var totalPrice = parseFloat(orderInfo.price) - parseFloat(orderInfo.specialPrice);
        //toFixed 方法保留2为小数并转换为string
        totalPrice =parseFloat(totalPrice.toFixed(2));
        var couponAmount = data.amount;
        if(data.isDiscount == 0){
            if(totalPrice < data.amount ){
                couponAmount = totalPrice;
            }
        }else{
            couponAmount = totalPrice- (((totalPrice*100)*(data.amount*100))/100/1000).toFixed(2);
            if(couponAmount > data.discountMaxLimitAmount ){
                couponAmount = data.discountMaxLimitAmount;
            }
        }
        couponAmount = couponAmount.toFixed(2);
        $("#couponUsePrice").html("-" + couponAmount +"元");
        $("#couponUsePrice").removeClass('text-gray');
        $("#couponUsePrice").addClass('text-red');
        $("#couponUsePrice").attr("data-id",data.recordId);//选择的是哪个优惠券
        $("#couponUsePrice").attr("data-price",couponAmount);//选择的是哪个优惠券

    }else {
        if(data.recordId == '0'){//不使用优惠券
            $("#couponUsePrice").attr("data-price","0");//选择的是哪个优惠券
            $("#couponUsePrice").html("不使用优惠券");
            $("#couponUsePrice").removeClass('text-red');
            $("#couponUsePrice").addClass('text-gray');
            $("#couponUsePrice").attr("data-id","");//选择的是哪个优惠券
        }else{
            $("#couponUsePrice").attr("data-price","0");//选择的是哪个优惠券
            $("#couponUsePrice").html("无可用优惠券");
            $("#couponUsePrice").removeClass('text-red');
            $("#couponUsePrice").addClass('text-gray');
            $("#couponUsePrice").attr("data-id","");//选择的是哪个优惠券
        }
    }
}

$(function() {
    insuranceHandle();
    $.ruleInit();
    initPage();
    loadCoupons();
});
