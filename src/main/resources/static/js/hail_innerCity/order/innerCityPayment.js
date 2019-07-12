var orderInfo = {
    payMode:$("#payMode").val(),
    tipsMessage:$("#tipsMessage").val(),
    statusDesc:$("#statusDesc").val(),
    specialPrice:$("#specialPrice").val(),
    couponPrice:$("#couponPrice").val(),
    type:$("#type").val(),
    orderNo:$("#orderNo").val(),
    tripNo:$("#tripNo").val(),
    arriveTitle:$("#arriveTitle").val(),
    departTitle:$("#departTitle").val(),
    departCity:$("#departCity").val(),
    departArea:$("#departArea").val(),
    upRegion:$("#upRegion").val(),
    arriveCity:$("#arriveCity").val(),
    arriveArea:$("#arriveArea").val(),
    downRegion:$("#downRegion").val(),
    departCarType:$("#departCarType").val(),
    departType:$("#departType").val(),
    numbers:$("#numbers").val(),
    remainTime:$("#remainTime").val(),
    settleMode:$("#settleMode").val(),
    realPrice:$("#realPrice").val(),
    departTime:$('#departTime').val(),
    price:$('#price').val(),
    cityLineId:$('#lineId').val()
}
var interval;

// 初始化加载
$(function () {
	
	$(".activity-price-1").hide();
    // 初始化是否显示的内容
    isShow(orderInfo);

    // 地址显示及字符截取
    subAddrStr(orderInfo);

    // 显示车型及人数
    showCarType(orderInfo);

    // 显示优惠券及计算金额
    showCoupon(orderInfo);
//    initTitleOfStatus();
    var departTimefmt = formatTime('yyyy-MM-dd hh:mm',orderInfo.departTime);
    $('#departTimeFmt').html('出发时间：'+departTimefmt);
});

function showCarType(orderInfo) {
    var carType="";	// 包车类型
    if (orderInfo.departType==1){
        carType = "实时订单";
    }
    else if(orderInfo.departType==2){
        carType = "预约";
    }
    else if(orderInfo.departType==3){
        carType = "拼车";
    }
    else if(orderInfo.departType==4){
        if (orderInfo.departCarType==1){
            carType = "舒适型";
        }
        else if (orderInfo.departCarType==2){
            carType = "豪华型";
        }
        else if (orderInfo.departCarType==3){
            carType = "七座商务型";
        }
        else{
            carType = "舒适型";
        }
    }
    else{
        carType = "拼车";
    }

    if (orderInfo.numbers>0){
        $(".code").html("<span>"+orderInfo.numbers+"人<br>"+carType+"</span>");
    }
}

function isShow(orderInfo){
    //初始秒数
    if(orderInfo.payMode==0){
        $(".payment-top").show();
        var t = orderInfo.remainTime;
        countDown(t);
    }else{
        $(".payment-top").hide();
    }

    //支付方式样式选择 0-刚下单时，1或其他-稍后支付
    if(orderInfo.payMode == 1 && orderInfo.type!=''){
        $(".wait-pay").show();
    }else {
        $(".wait-pay").hide();
    }
}

//倒计时
function countDown(t) {
    var r = format(t);
    full(r);

    var auto = setInterval(function() {

        if((r.hours == 0 || r.hours == null) && (r.minute == 0 || r.minute == null) && r.second == 0){
            $.ajax({
                url:'/hail/innerCity/order/cancelOrder',
                data:{'orderNo':orderInfo.orderNo,'type':'auto'},
                dataType:'json',
                success:function(data){
                    if(parseInt(data.code) == 0){
                        $.alert('超时未支付,订单已关闭', function() {
                            location.href='/hail/innerCity/order/toOrderReturnDetailPage?orderNo='+orderInfo.orderNo;
                        });
                    }else if(parseInt(data.code)==8889){
                        $.dialog({
                            text: '你的订单已被客服取消，请重新发起行程',
                            buttons: [{
                                text: '我知道了',
                                onClick: function() {
                                    location.href='/hail/innerCity/order/toOrderReturnDetailPage?orderNo='+orderInfo.orderNo;
                                }
                            }]
                        });
                    }else{
                        $.alert(data.message);
                    }
                }
            })
        }
        if(r.second > 0) {
            r.second--;
        } else {
            if(r.minute > 0) {
                r.minute--;
                r.second = 59;
            } else {
                if(r.hours > 0) {
                    r.hours--;
                    r.minute = 59;
                    r.second = 59;
                } else {
                    r.second = 0;
                    clearInterval(auto);
                }
            }
        }
        full(r);
    }, 1000);
}

//填入
function full(r) {

    var $t = $('#time');
    var html = '';
    if(r.second ==60){
        r.second=59;
    }
    if(r.second >= 10) {
        html = r.second + '秒' + html;
    } else if(r.second >= 0) {
        html = '0' + r.second + '秒' + html;
    }

    if(undefined !=  r.minute && r.minute >= 10) {
        html = r.minute + '分 ' + html;
    } else if(undefined !=  r.minute && r.minute > 0) {
        html = '0' + r.minute + '分' + html;
    }
    if(undefined !=  r.hours &&  r.hours >= 10) {
        html = r.hours + '时 ' + html;
    } else if(undefined !=  r.hours && r.hours > 0){
        html = '0' + r.hours + '时' + html;
    }
    $t.html(html);
}

//格式化时间
function format(n) {
    var s = parseInt(n);
    var	m = 0;
    var	h = 0;

    if(s > 60) {
        m = parseInt(s / 60);
        s = parseInt(s % 60);

        if(m > 60) {
            h = parseInt(m / 60);
            m = parseInt(m % 60)
        }
    }

    var result = {}
    result.second = s;
    if(m > 0) {
        result.minute = m;
    }
    if(h > 0) {
        result.hours = h;
    }

    return result;
}

function subAddrStr(orderInfo) {
   // 出发地
    var depart = orderInfo.departTitle;
    if (orderInfo.upRegion != ""){
        depart = orderInfo.upRegion+" · "+orderInfo.departTitle;
    }
    
    if (depart.length>16){
    	depart = depart.substr(0,16)+"...";
    }
    $(".start").text(depart);

    // 目的地
    var arrive = orderInfo.arriveTitle;
    if (orderInfo.downRegion != ""){
        arrive = orderInfo.downRegion+" · "+orderInfo.arriveTitle;
    }
    
    if (arrive.length>16){
        arrive = arrive.substr(0,16)+"...";
    }
    $(".end").text(arrive);
    
    // 乘客备注
    if (orderInfo.tipsMessage != "" && orderInfo.tipsMessage.length>14){          
    	orderInfo.tipsMessage = orderInfo.tipsMessage.substr(0,14)+"...";
    }
    $(".tips").text(orderInfo.tipsMessage);
}

// isValid=0 无可用优惠券
function isValid_(){
    $('#recordId').val(0);
    $('#has-coupon dd').html('不使用券');
    var selectedCoupon = {
        userId:0,
        isValid:0,
        recordId:0,
        amount:0,
        isDiscount:'',
        discountMaxLimitAmount:''
    }
    var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
    selectedCoupon.userId=userInfo.id;
    localStorage.setItem("selectedCoupon",JSON.stringify(selectedCoupon));
}

//特价优惠
var specialFlag
function isSpecialPrice(orderInfo,newPriceTmp){
    var result = 0;
    if (orderInfo.specialPrice>0){
        $(".activity-price-1").show();
        $('.price-container span').html(formatMoney(newPriceTmp,2)+ '元&nbsp');
    } else{
        result = newPriceTmp;
        $(".activity-price").hide();
        $('.price-container span').html(formatMoney(result,2)+ '元&nbsp;');
    }
}

function showCoupon(orderInfo){
    var newPriceTmp = orderInfo.realPrice; // 初始化价格为一口价
    var selectedCoupon = JSON.parse(localStorage.getItem('selectedCoupon'));
    if (selectedCoupon == null){
        //调用查询优惠券信息接口
    	
    	var param = {
                businessType:'interCityOnline',
                orderNo:orderInfo.orderNo,
                lineId: $('#lineId').val(),
                price:newPriceTmp,
				specialFlag:0,
        }
    	if (orderInfo.specialPrice>0){
    		param.specialFlag = 1;
    	}
        queryHasCoupons(param, function (data) {
            if (data.isValid == 1) {                
                
                var oldPrice = orderInfo.realPrice;
                $('#recordId').val(data.recordId);
                $('#has-coupon').removeClass('no-coupon');
                //  0--固定金额  1--折扣
                var isDiscount = data.isDiscount;
                if(isDiscount == '0'){
                    $('#amount').val(data.amount);
                    if (parseFloat(oldPrice) - parseFloat(data.amount) >= 0) {
                        newPriceTmp = parseFloat(oldPrice) - parseFloat(data.amount);
                        $('#has-coupon dd').html('-'+data.amount + '元');
                    } else {
                        newPriceTmp = 0;
                        $('#has-coupon dd').html('-'+oldPrice + '元');
                    }
                }else if(isDiscount == '1'){
                    //折扣券
                    var discountMaxLimitAmount = data.discountMaxLimitAmount;//最大抵扣金额
                    newPriceTmp = parseFloat(oldPrice)*100*data.amount*10/10000;//折扣后支付金额
                    newPriceTmp = formatMoney(newPriceTmp);
                    var discountVal = parseFloat(oldPrice) - parseFloat(newPriceTmp);//折扣券抵扣金额
                    if(discountVal >= discountMaxLimitAmount){
                        newPriceTmp = parseFloat(oldPrice) - parseFloat(discountMaxLimitAmount);
                        discountVal = discountMaxLimitAmount;
                    }
                    $('#amount').val(newPriceTmp);
                    $('#has-coupon dd').html('-'+ formatMoney(discountVal,2) + '元');
                    $('.price-container span').html(formatMoney(newPriceTmp,2)+ '元');
                }
                var selectedCoupon = {
                    userId:0,
                    isValid:data.isValid,
                    recordId:data.recordId,
                    amount:data.amount,
                    isDiscount: data.isDiscount,
                    discountMaxLimitAmount: data.discountMaxLimitAmount,
                }
                var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
                selectedCoupon.userId=userInfo.id;
                localStorage.setItem("selectedCoupon",JSON.stringify(selectedCoupon));

            } else {
                $('#has-coupon').addClass('no-coupon');
                $('#amount').val('');
                newPriceTmp = orderInfo.realPrice;
                if(data.recordId == 0){//不使用优惠券
                    isValid_();
                }else{
                    $('#recordId').val('');
                    $('#has-coupon dd').html('无可用券');
                    window.localStorage.removeItem("selectedCoupon");
                }
            }
         	//特价优惠
            isSpecialPrice(orderInfo,newPriceTmp);
        });
    }else{
        if (selectedCoupon.isValid == 1) {
                      
            var oldPrice = orderInfo.realPrice;
            $('#recordId').val(selectedCoupon.recordId);
            $('#has-coupon').removeClass('no-coupon');
            //  0--固定金额  1--折扣
            var isDiscount = selectedCoupon.isDiscount;
            if(isDiscount == '0'){
                $('#amount').val(selectedCoupon.amount);
                if (parseFloat(oldPrice) - parseFloat(selectedCoupon.amount) >= 0) {
                    newPriceTmp = parseFloat(oldPrice) - parseFloat(selectedCoupon.amount);
                    $('#has-coupon dd').html('-'+selectedCoupon.amount + '元');
                } else {
                    newPriceTmp = 0;
                    $('#has-coupon dd').html('-'+oldPrice + '元');
                }
            }else if(isDiscount == '1'){
                var discountMaxLimitAmount = selectedCoupon.discountMaxLimitAmount;//最大抵扣金额
                newPriceTmp = parseFloat(oldPrice)*100*selectedCoupon.amount*10/10000;//折扣后金额
                newPriceTmp = formatMoney(newPriceTmp);
                var discountVal = parseFloat(oldPrice) - parseFloat(newPriceTmp);//折扣券抵扣金额
                if(discountVal >= discountMaxLimitAmount){
                    newPriceTmp = parseFloat(oldPrice) - parseFloat(discountMaxLimitAmount);
                    discountVal = discountMaxLimitAmount;
                }
                $('#amount').val(newPriceTmp);
                $('#has-coupon dd').html('-'+ formatMoney(discountVal,2) + '元');
                $('.price-container span').html(formatMoney(newPriceTmp,2)+ '元');
            }
            
            var selectedCoupon = {
                userId:0,
                isValid:selectedCoupon.isValid,
                recordId:selectedCoupon.recordId,
                amount:selectedCoupon.amount,
                isDiscount: selectedCoupon.isDiscount,
                discountMaxLimitAmount: selectedCoupon.discountMaxLimitAmount,
            }
            var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
            selectedCoupon.userId=userInfo.id;
            localStorage.setItem("selectedCoupon",JSON.stringify(selectedCoupon));
        } else {
            $('#has-coupon').addClass('no-coupon');
            $('#amount').val('');
            newPriceTmp = orderInfo.realPrice;
            if(selectedCoupon.recordId == 0){//不使用优惠券
                isValid_();
            }else{
                $('#recordId').val('');
                $('#has-coupon dd').html('无可用券');
                window.localStorage.removeItem("selectedCoupon");
            }
        }
        
    }
	//特价优惠
	isSpecialPrice(orderInfo,newPriceTmp);
}

var clickEvent = isAndroid()?'tap':'click';

// 查看优惠券
$('#has-coupon dd').on(clickEvent,function(){
    var specialFlag = orderInfo.specialPrice>0?1:0;
    window.location = '/coupon/select?orderNo='+orderInfo.orderNo+'&businessType='+businessParam.interCityOnline+'&lineId='+$('#lineId').val()+"&specialFlag="+specialFlag+"&price="+orderInfo.price;
});
//取消订单
$(".cancel").on(clickEvent,function(){
    cancelOrder();
});

// 点击微信支付
$("#orderPay").on(clickEvent,function(){//获取预支付信息
    var userCouponId = 0;
    var selectedCoupon = JSON.parse(localStorage.getItem('selectedCoupon'));
    if (undefined != selectedCoupon &&  selectedCoupon != null){
        userCouponId = selectedCoupon.recordId;
        window.localStorage.removeItem('selectedCoupon');
    }
    var b = new Base64();
    var url = b.encode('/hail/innerCity/orderDetail/getOrderInfo?orderNo='+orderInfo.orderNo);
    window.location.href='/hail/order/payunit?orderNo='+orderInfo.orderNo+'&settleType='+orderInfo.settleMode+'&userCouponId='+userCouponId+'&url='+url;
});

// 点击稍后支付
$('#laterPay').on(clickEvent,function () {
    window.location='/hail/innerCity/orderDetail/getOrderInfo?orderNo='+orderInfo.orderNo;
});

// 返回
$(".return").on(clickEvent,function () {
    //清空缓存
    window.sessionStorage.removeItem('callCarInfo');
    window.location = '/hail/interCityIndex';
});


// 取消订单
function cancelOrder(){
    $.confirm('支付成功后，将会优先为你安排车辆', '',['暂不取消','确定取消'],function() {
        $.ajax({
            url:'/hail/innerCity/order/cancelOrder',
            data:{'orderNo':orderInfo.orderNo},
            dataType:'json',
            success:function(data){
                if(parseInt(data.code)==0){
                    //清空缓存
                    location.href='/hail/innerCity/order/toOrderReturnDetailPage?orderNo='+orderInfo.orderNo;
                }else if(parseInt(data.code)==8889){
                    //清空缓存
                    window.sessionStorage.removeItem('callCarInfo');
                    $.dialog({
                        text: '你的订单已被客服取消，请重新发起行程',
                        buttons: [{
                            text: '我知道了',
                            onClick: function() {
                                location.href='/hail/innerCity/order/toOrderReturnDetailPage?orderNo='+orderInfo.orderNo;
                            }
                        }]
                    });
                }else{
                    $.alert(data.message);
                }
            }
        })
    })
}