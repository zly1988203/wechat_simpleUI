// 获取地址栏参数
var getUrlRequest = getRequest();
// 获取车企信息
var userInfo = JSON.parse(localStorage.getItem("userInfo"));
setTimeout(function(){
    $('title').html("订单信息 - " + userInfo.providerName);
},600)
// 获取url的参数
function getRequest() {
    var url = location.search; //获取url中"?"符后的字串  
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var strs = url.substr(1);
        strs = strs.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
var preOrderInfo = {
    price:0,
    specialPrice:0,
    businessType:7,//通勤业务代码
    specialFlag:'',
    busIds:'',
    qrcId:'',
    payPrice:0
}
var clickEvent = isAndroid()?'tap':'click';
function getPreOrderInfo() {
    var busIds = JSON.parse(sessionStorage.getItem('busIds'));
    preOrderInfo.busIds = busIds;
    var param = {
        token:serverUtil.token,
        busIds:busIds,
    }
    request(commuteApi.toAddOrder,param,true).then(function (res) {
        if(res.code == 0 ){
            var data = res.data;
            drawInfo(data);
        }
    })
    
    var drawInfo = function (data) {
        $('.head .time').html(data.departTime);
        $('.head .line-name').html(data.scheduleCode);
        $('#payDays').html('共 '+data.days+' 天');

        if(data.specialPrice > 0){
            $('#normalPrice').html(parseFloat(data.price).toFixed(2)+'元');
            $('#specialPrice').html(parseFloat(data.payPrice).toFixed(2)+'元');
            $('#normalPrice').show();
        }else {
            $('#specialPrice').html(parseFloat(data.price).toFixed(2)+'元');
        }


        $('#departTitle').html(data.departCityName + ' - ' + data.departTitle);
        $('#arriveTitle').html(data.arriveCityName + ' - ' + data.arriveTitle);
        preOrderInfo.price = data.price;
        preOrderInfo.specialPrice = data.specialPrice;
        preOrderInfo.specialFlag = parseFloat(data.specialPrice) > 0?1:0;
        $('#payPrice').html(parseFloat(data.payPrice).toFixed(2));
        if(data.tipRule!=''){
            $('#tipRule .content').html(data.tipRule);
            $('#tipRule').show();
        }
        if(data.payRule!=''){
            $('#payRule .content').html(data.payRule);
            $('#payRule').show();
        }

        $('#mobile').val(data.contactMobile);

        var orderMoblie = sessionStorage.getItem("addOrderMobile");
        if(orderMoblie !=null){
            $('#mobile').val(orderMoblie);
            sessionStorage.removeItem("addOrderMobile");
        }
        //调用查询优惠券信息接口
        loadCoupons();
    }
}

function loadCoupons() {
    var selectedCoupon = JSON.parse(window.localStorage.getItem('selectedCoupon'));
    if (undefined != selectedCoupon){
        calculateCouponPrice(selectedCoupon);
        calculateTotalPrice();
    }else{
        //调用查询优惠券信息接口
        var param = {
            businessType:'commute',
            busId :preOrderInfo.busIds,
            price : preOrderInfo.specialPrice>0?preOrderInfo.specialPrice:preOrderInfo.price,
            specialFlag : preOrderInfo.specialFlag
        }
        queryHasCoupons(param,function (data) {
            calculateCouponPrice(data);
            calculateTotalPrice();
        });
    }
}



function calculateCouponPrice(data) {
    if(data.isValid == 1) {
        var totalPrice = parseFloat(preOrderInfo.price) - parseFloat(preOrderInfo.specialPrice);
        //toFixed 方法保留2为小数并转换为string
        totalPrice = parseFloat(totalPrice.toFixed(2));
        var couponAmount = data.amount;
        if (data.isDiscount == 0) {
            if (totalPrice < data.amount) {
                couponAmount = totalPrice;
            }
        } else {
            couponAmount = totalPrice - (((totalPrice * 100) * (data.amount * 100)) / 100 / 1000).toFixed(2);
            if (couponAmount > data.discountMaxLimitAmount) {
                couponAmount = data.discountMaxLimitAmount;
            }
        }
        couponAmount = couponAmount.toFixed(2);
        $("#couponUsePrice").html("-" + couponAmount + "元");
        $("#couponUsePrice").removeClass('text-gray');
        $("#couponUsePrice").addClass('text-red');
        $("#couponUsePrice").attr("data-id", data.recordId);//选择的是哪个优惠券
        $("#couponUsePrice").attr("data-price", couponAmount);//选择的是哪个优惠券
    }else{
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

function calculateTotalPrice(){
    var totalPrice = parseFloat(preOrderInfo.price) - parseFloat(preOrderInfo.specialPrice);
    var couponPrice=$("#couponUsePrice").attr('data-price');
    if(couponPrice&&couponPrice!=null){
        if(couponPrice>totalPrice){
            totalPrice=0;
        }else{
            totalPrice=totalPrice-couponPrice;
        }
    }
    totalPrice = Math.floor(totalPrice.toFixed(2)* 100) / 100;
    $('#payPrice').html(totalPrice);
}

/*
* 优惠券 - 操作
* */
$('.coupon-toggle').off(clickEvent).on(clickEvent, function() {
    var addOrderMobile = $('#mobile').val();
    sessionStorage.setItem("addOrderMobile",addOrderMobile);
    window.location = '/coupon/select?businessType='+preOrderInfo.businessType+'&specialFlag='+preOrderInfo.specialFlag+'&price='+preOrderInfo.price+'&busId='+preOrderInfo.busIds;
});


$('.back-btn').on('click',function () {
    window.history.go(-1);
})
    
$('.pay-btn').on('click',function () {
    var mobile = $('#mobile').val();
    if(!(/^1\d{10}$/.test(mobile))){
        $.toast('请填写正确的手机号');
        return false;
    }

    var couponId=$("#couponUsePrice").data('id');//优惠券
    if("qrcId" in getUrlRequest){
        preOrderInfo.qrcId = getUrlRequest.qrcId;
    }
    var param = {
        token:serverUtil.token,
        qrcId:preOrderInfo.qrcId,//二维码ID
        busIds:preOrderInfo.busIds,
        couponId:couponId,
        specialPrice:preOrderInfo.specialPrice,
        ospTraceId:'',
        orderContactMobile:mobile,
    }

    request(commuteApi.addOrder,param,true).then(function (result) {
        localStorage.removeItem('selectedCoupon');
        if(result.code == 0){
            var orderNo = result.data;
            var b = new Base64();
            var url = b.encode("/commute/paymentUnit.html?token="+serverUtil.token+"&orderNo="+orderNo);
            window.location.href='/order/payunit?orderNo='+orderNo+'&userCouponId='+couponId+'&url='+url;
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
    })
})

$(function () {
    getPreOrderInfo();
})