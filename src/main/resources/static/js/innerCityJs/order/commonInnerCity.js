var clickEvent = isAndroid()?'tap':'click';
/**
 * 城际约车公共Js判断
 */
var globalTripStatus = -100;
function  innerCityUrlJudge(tripNo,callBack,orderNo){
	$.ajax({
		url:'/innerCity/order/getInnerCityTripStatus',
		data:{'tripNo':tripNo,'orderNo':orderNo},
		dataType:'json',
		success:function(data){
		    console.log('订单状态接口错误：'+ data.data.status);
            if (globalTripStatus != data.data.status) {
                globalTripStatus = data.data.status;
                callBack(data);
            }
		}
	})
}


//分享行程 - 显示
$('#share').on('click', function() {
    $('.share-box').show();
});
//分享行程 - 隐藏
$('.share-box').on('click', function() {
    $(this).hide();
});
//阻止事件冒泡
$('.share-tips').on(clickEvent,function (e) {
    return false;
});

var orderInfo = {									
    status:$('#status').val(),
    orderNo:$('#orderNo').val(),
    tripNo:$('#tripNo').val(),
    settleMode:$('#settleMode').val(),
    tripStatus:$('#tripStatus').val()
};

var address = {
		departTitle:$('#departTitle').val(),
	    arriveTitle:$('#arriveTitle').val(),
	    upRegion:$('#upRegion').val(),
	    downRegion:$('#downRegion').val(),
	    tipsMessage:$('#tipsMessage').val(),	
}

function subAddrStr(address) {
    // 出发地
    var depart = address.departTitle;;
    if (address.upRegion != ""){
        depart = address.upRegion+" · "+address.departTitle;
    }

    if (depart.length>16){
        depart = depart.substr(0,16)+"...";
    }
    $(".depart").text(depart);

    // 目的地
    var arrive = address.arriveTitle;
    if (address.downRegion != ""){
        arrive = address.downRegion+" · "+address.arriveTitle;
    }

    if (arrive.length>16){
        arrive = arrive.substr(0,16)+"...";
    }
    $(".arrive").text(arrive);

    // 乘客备注
    if (address.tipsMessage != "" && address.tipsMessage.length>14){
    	address.tipsMessage = address.tipsMessage.substr(0,14)+"...";
    }
    $(".notes-box .notes").text(address.tipsMessage);
}

// 拨打号码
$(".tel").click(function(){
	$.confirm('拨打司机手机号时，系统将会采用隐号功能，隐藏你们的真实手机号，请放心拨打','提示',['取消','确定'],function() {
		window.location.href = 'tel://'+$('#driverMobile').val();
    })
});

//行程中 等待出行 ，等待接驾 ，前往目的地 ， 加载优惠券的方法
function loadCoupons() {
    //一口价-特价优惠 = 支付价格 + 优惠券抵扣价格
    var selectedCoupon = JSON.parse(window.localStorage.getItem('selectedCoupon'));
    var price = $('#realPrice').val();//一口价
    var newCouponPrice = 0;//优惠券抵扣金额
    var newPayPrice = 0;//计算后的支付价格


    //检查优惠券用户是否为当前用户，如果不是当前用，则需要重置
    if(undefined != selectedCoupon){
        if(selectedCoupon.isValid == 1){
            $('#recordId').val(selectedCoupon.recordId);//优惠券id
            $('#amount').val(selectedCoupon.amount);//优惠券面额
            var isDiscount = selectedCoupon.isDiscount;
            if(isDiscount == '0'){
                if(parseFloat(price)  - parseFloat(selectedCoupon.amount) >= 0){
                    newCouponPrice = selectedCoupon.amount;
                    newPayPrice = parseFloat(price) - parseFloat(newCouponPrice);
                    newPayPrice = formatMoney(newPayPrice,2);
                }else {
                    newCouponPrice = parseFloat(price);
                    newCouponPrice = formatMoney(newCouponPrice,2);
                    newPayPrice = 0;
                }
            }else if(isDiscount == '1'){
                var discountMaxLimitAmount = selectedCoupon.discountMaxLimitAmount;//最大抵扣金额
                var newPrice = parseFloat(price)*100*selectedCoupon.amount*10/10000;//折扣支付后金额
                newPrice = formatMoney(newPrice);
                var discountVal = parseFloat(price) - parseFloat(newPrice);//折扣券抵扣金额
                if(discountVal >= discountMaxLimitAmount){
                    newPrice = parseFloat(price) - parseFloat(discountMaxLimitAmount);
                    discountVal = discountMaxLimitAmount;
                }
                newCouponPrice = formatMoney(discountVal,2);
                newPayPrice = newPrice;
                newPayPrice = formatMoney(newPayPrice,2);
            }
        }else {
            if(selectedCoupon.recordId == 0){//不使用优惠券
                $('#recordId').val(0);
                $('#amount').val('');
                newCouponPrice = '不使用券';
                // $('#payPanel #coupon .value').html('不使用券');
                // $('#newPrice b').html($('#price').val());
            }else{
                $('#payPanel #coupon').removeClass('saleprice').addClass('saleprice2');
                $('#recordId').val('');
                $('#amount').val('');
                newCouponPrice = '无可用券';
                // $('#payPanel #coupon .value').html('无可用券');
            }
            newPayPrice = parseFloat(price);
            newPayPrice = formatMoney(newPayPrice,2);
        }

        var reg = new RegExp(/^(-?\d+)(\.\d+)?$/);
        if(reg.test(newCouponPrice.toString())){
            $('#payPanel #coupon .value').html('-'+newCouponPrice+'元');
            $('#newCouponPrice').val(newCouponPrice);
        }else{
            $('#payPanel #coupon .value').html(newCouponPrice);
            $('#newCouponPrice').val(0);
        }
        $('#payPanel .amount label').html(newPayPrice);
        $('#newPayPrice').val(newPayPrice);

        //显示特价优惠
        var specialPrice = $('#specialPrice').val();
        if(specialPrice != '0'){
            var _html = '<li class="coupon">' +
                '                <div class="name">特价优惠</div>' +
                '                <div class="value">-'+ specialPrice +'</div>' +
                '            </li>';
            $('#payPanel .middle ul').append(_html);
        }
    }else{
        //调用查询优惠券信息接口
        var param = {
            businessType:'innerCity',
            orderNo:orderInfo.orderNo
        }
        queryHasCoupons(param,function (data) {
            if(data.isValid == 1){
                $('#recordId').val(data.recordId);//优惠券id
                $('#amount').val(data.amount);//优惠券面额
                var isDiscount = data.isDiscount;
                if(isDiscount == '0'){
                    if(parseFloat(price)  - parseFloat(data.amount) >= 0){
                        newCouponPrice = data.amount;
                        newPayPrice = parseFloat(price) - parseFloat(newCouponPrice);
                        newPayPrice = formatMoney(newPayPrice,2);
                    }else {
                        newCouponPrice = parseFloat(price);
                        newCouponPrice = formatMoney(newCouponPrice,2);
                        newPayPrice = 0;
                    }
                }else if(isDiscount == '1'){
                    var discountMaxLimitAmount = data.discountMaxLimitAmount;//最大抵扣金额
                    var newPrice = parseFloat(price)*100*data.amount*10/10000;//折扣支付后金额
                    newPrice = formatMoney(newPrice);
                    var discountVal = parseFloat(price) - parseFloat(newPrice);//折扣券抵扣金额
                    if(discountVal >= discountMaxLimitAmount){
                        newPrice = parseFloat(price) - parseFloat(discountMaxLimitAmount);
                        discountVal = discountMaxLimitAmount;
                    }
                    newCouponPrice = formatMoney(discountVal,2);
                    newPayPrice = newPrice;
                    newPayPrice = formatMoney(newPayPrice,2);
                }

            }else {
                if(data.recordId == '0'){//不使用优惠券
                    $('#recordId').val(0);
                    $('#amount').val('');
                    newCouponPrice = '不使用券';
                }else{
                    $('#payPanel #coupon').removeClass('saleprice').addClass('saleprice2');
                    $('#recordId').val('');
                    $('#amount').val('');
                    newCouponPrice = '无可用券';
                }
                newPayPrice = parseFloat(price)
                newPayPrice = formatMoney(newPayPrice,2);
            }

            var reg = new RegExp(/^(-?\d+)(\.\d+)?$/);
            if(reg.test(newCouponPrice.toString())){
                $('#payPanel #coupon .value').html('-'+newCouponPrice+'元');
                $('#newCouponPrice').val(newCouponPrice);
            }else{
                $('#payPanel #coupon .value').html(newCouponPrice);
                $('#newCouponPrice').val(0);
            }
            $('#payPanel .amount label').html(newPayPrice);
            $('#newPayPrice').val(newPayPrice);

            //显示特价优惠
            var specialPrice = $('#specialPrice').val();
            if(specialPrice != '0'){
                var _html = '<li class="coupon">' +
                    '                <div class="name">特价优惠</div>' +
                    '                <div class="value">-'+ specialPrice +'</div>' +
                    '            </li>';
                $('#payPanel .middle ul').append(_html);
            }

        });
    }

}

//价格详情
$('.bottom-container .detail').on(clickEvent,function () {
    showFeeDetail();
    $('.price-detail-container').popup('push');
});

//价格详情关闭
$('#closeButton').on(clickEvent,function () {
    $('.price-detail-container').closePopup();
});

//支付面板
$('#pay').on(clickEvent, function(e) {
    $('#payPanel').show();
});
$('#closePayPanel').on(clickEvent, function(e) {
    $('#payPanel').hide();
});

$('#payPanel #coupon').on(clickEvent,function () {
    var orderNo = $('#orderNo').val();
    window.location = '/coupon/select?orderNo='+$('#orderNo').val()+'&businessType='+businessParam.innerCity;
});

//支付bottom的关闭
$('.payment-container .close').on(clickEvent,function(){
    $('.payment-container').hide();
});

//立即支付
$('#paymentBtn').on(clickEvent,function(){
    var b = new Base64();
    var url = b.encode('/innerCity/orderDetail/getOrderInfo?orderNo='+orderInfo.orderNo);
    var selectedCoupon = JSON.parse(window.localStorage.getItem('selectedCoupon'));
    var userCouponId = 0;
    if(undefined != selectedCoupon || null != selectedCoupon){
        userCouponId = selectedCoupon.recordId == 'null'?0:selectedCoupon.recordId;
        window.localStorage.removeItem('selectedCoupon');
    }
    window.location ='/order/payunit?orderNo='+orderInfo.orderNo+'&settleType='+orderInfo.settleMode+'&userCouponId='+userCouponId+'&url='+url;
});

//计价规则
$('.price-detail-container .market-rules-btn').on(clickEvent,function () {
    var reqObj = {
        token:$.cookie('token'),
        number:$('.journey-container .right .box').data('numbers'),
        departDate:'2018-11-6',//$('.journey-container .time-box').data('time')
        lineId: $('.journey-content').data('lineid')
    };
    getLinePriceInfoService(reqObj);
    $('.market-rule-container').popup('modal')
});

$('#closePopup').on(clickEvent,function () {
    $('.market-rule-container').closePopup();
});

//行程展开收起
function switchJourney(){
    //展开收起行程信息
//    $('.journey-container').css({
//        'height':$('.journey-container').height()
//    });
//    $('.journey-container').data('height',$('.journey-container').height());
    $('.switch-box').on(clickEvent,function () {
        var showFlag = $(this).data('show');
//        var heightJour = $('.journey-container').data('height');
        if(showFlag){
        	$(this).data('show',false);
//            $('.journey-container').css({
//                'height':0,
//            });
//            $(this).data('show',false);
//            $(this).find('i').css({
//                'transform':'rotate(0deg)',
//                '-ms-transform':'rotate(0deg)',
//                '-moz-transform':'rotate(0deg)',
//                '-webkit-transform':'rotate(0deg)',
//                '-o-transform':'rotate(0deg)',
//            })
        	$('.journey-container').slideUp();
        }else{
        	$(this).data('show',true);
//            $('.journey-container').css({
//                'height':heightJour,
//            });
//            $(this).data('show',true);
//            $(this).find('i').css({
//                'transform':'rotate(180deg)',
//                '-ms-transform':'rotate(180deg)',
//                '-moz-transform':'rotate(180deg)',
//                '-webkit-transform':'rotate(180deg)',
//                '-o-transform':'rotate(180deg)',
//            })
        	$('.journey-container').slideDown(20000);
        }
    });
}

// 调用计算价格接口显示计价规则
function getLinePriceInfoService(reqObj) {
    var url = SERVER_URL_PREFIX+'/innerCity/optimize/getLinePriceInfo';
    var dataObj = genReqData(url, reqObj);
    $.showLoading();
    $.ajaxService({
        url:url,
        data:dataObj,
        type: 'POST',
        dataType: 'JSON',
        success:function (result) {
            result = $.parseJSON(result);
            $.hideLoading();
            if(result.code==0){
                if(null==result.data || undefined==result.data){
                    $.alert(result.message);
                }else {
                    var reqData = result.data;
                    //TODO
                    // showSeatNo(reqData);
                    // showVehicleSwitchBox(reqData);
                    showLadderPrice(reqData);
                }
            }else{
                $.alert(result.message);
            }
        }
    });
}

//显示车型
function showVehicleSwitchBox(reqData) {
// 选择车型模块
    var personAmount = $('#amount').val();// 选择的人数
    //舒适型
    if(null==reqData.comfortable || reqData.cityLine.comfortableSeat==0 || personAmount > reqData.cityLine.comfortableSeat || reqData.comfortable.price==0){
        reqData.comfortable = null//对象置空 则不显示
    }
    // 豪华型
    if(null==reqData.luxurious || reqData.cityLine.luxuriousSeat==0 || personAmount > reqData.cityLine.luxuriousSeat || reqData.luxurious.price==0){
        reqData.luxurious = null;
    }
    // 商务型
    if(null==reqData.business || reqData.cityLine.businessSeat == 0 || personAmount > reqData.cityLine.businessSeat || reqData.business.price==0){
        reqData.business = null;
    }

    //动态生成车型模块
    var _switchBoxHtml = createVehicleBox(reqData);

    _switchBoxHtml += '';
    $('.confirm-container .vehicle-switch-box').html(_switchBoxHtml);
    $('.confirm-container .vehicle-switch-box').data('stage',0);//默认选中拼车
    $('.confirm-container .vehicle-switch-box').show();

    var vehicleScroll ;
    setTimeout(function () {
        vehicleScroll = new IScroll('#wrapper',{
            scrollX: true,
            scrollY: false,
            mouseWheel: true
        });
        if($('.vehicle-switch-box .vehicle-item').length > 3){
            var width = $('.vehicle-switch-box .vehicle-item').width() / 2;
            // vehicleScroll.scrollTo(-width, 0);
        }
    },300);

    // 车型选择
    $('.vehicle-item .vehicle-info').on(click_tap,function () {
        $('.notes').blur();
        $(this).parent().addClass('active').siblings().removeClass('active');
        $(this).parents('.vehicle-switch-box').data('stage',$(this).parent().data('stage'));
        vehicleScroll.scrollToElement($(this).parent()[0], 500, false, false, IScroll.utils.ease.circular);
    });

    // 查看费用明细
    $('.vehicle-item .price-box').on(click_tap,function () {
        $('.notes').blur();
        var parent = $(this).parent();
        var stageName = switchStage($(parent).data('stage'),'');
        var oldPrice = $(parent).data('oldprice');
        var type = $(parent).data('type');//优惠类型 0-无优惠 1-特价(对应该有特价类型) 2-优惠券
        var promoteType = $(parent).data('promotetype');//特价类型 0-固定金额（减），1-折扣，2-加价，
        var specialPrice = $(parent).data('specialprice');//特价优惠的价格
        var couponPrice = $(parent).data('couponprice');//优惠券抵扣的价格

        //优惠项
        var _couponItem = '';
        if(type==1){
            //特价
            if(promoteType == 2){
                _couponItem += '<div class="coupon-item"><div class="name">特价</div><div class="number">+'+ specialPrice +'元</div></div>' ;
            }else if(promoteType == 1 || promoteType == 0){
                _couponItem += '<div class="coupon-item"><div class="name">活动优惠</div><div class="number">-'+ specialPrice +'元</div></div>' ;
            }
        }else if(type==2){
            //优惠券
            _couponItem = '<div class="coupon-item"><div class="name">优惠券</div><div class="number">-'+ couponPrice +'元</div></div>' ;
        }else if(type==3){
            //特价
            if(promoteType == 2){
                _couponItem += '<div class="coupon-item"><div class="name">特价</div><div class="number">+'+ specialPrice +'元</div></div>' ;
            }else if(promoteType == 1 || promoteType == 0){
                _couponItem += '<div class="coupon-item"><div class="name">活动优惠</div><div class="number">-'+ specialPrice +'元</div></div>' ;
            }
            //优惠券
            _couponItem += '<div class="coupon-item"><div class="name">优惠券</div><div class="number">-'+ couponPrice +'元</div></div>' ;
        }
        //所有的优惠项 如果没有优惠项则不显示
        var _couponBoxHtml = '';
        if(_couponItem){
            _couponBoxHtml = '<div class="coupon-box">' + _couponItem + '</div>';
        }


        var _detailHtml = '';
        _detailHtml += '<div class="detail-box">' +
            '<div class="detail-item"><div class="name">'+stageName+'一口价</div><div class="number">'+oldPrice+'元</div></div>' +
            '<div class="detail-item"><div class="name">人数</div><div class="number">'+$('#amount').val()+'人</div></div>' +
            '</div>' + _couponBoxHtml;

        // 生成费用明细
        $('.price-detail-container .price-detail-main').html(_detailHtml);
        $('.price-detail-container').popup('push');
    });
}

//显示阶梯价格
function showLadderPrice(reqData) {
    var laddFlag = reqData.cityLine.poolingMode;//价格模式 	0 固定 1 阶梯
    var carPool = reqData.carPool;

    //拼车
    var _itemHtml = '';
    if(laddFlag == 1){
        //拼车阶梯价格
        $.each(carPool.laddPrice,function (index,item) {
            _itemHtml += '<li class="stage-item">' +
                '<div class="unit-box"><div class="unit">每人</div><div class="price">'+ item.price +'元</div></div>' +
                '<div class="total">'+ item.personNum +'人同行</div>' +
                '</li>';
        })
    }else{
        //固定价格
        _itemHtml += '<li class="stage-item">' +
            '<div class="unit-box"><div class="unit">每人</div><div class="price">'+ carPool.price +'元</div></div>' +
            '</li>';
    }

    //舒适型
    var _comfortablePriceHtml = ''
    if(reqData.cityLine.comfortablePrice){
        _comfortablePriceHtml = '<li class="stage-type"><div class="stage-name">舒适型</div><ul>' +
            '<li class="stage-item">' +
            '<div class="unit-box"><div class="unit">每程</div><div class="price">'+ reqData.cityLine.comfortablePrice +'元</div></div>' +
            '</li>' +
            '</ul></li>'
    }

    //  豪华型
    var _luxuriousPriceHtml = ''
    if(reqData.cityLine.luxuriousPrice){
        _luxuriousPriceHtml = '<li class="stage-type"><div class="stage-name">豪华型</div><ul>' +
            '<li class="stage-item">' +
            '<div class="unit-box"><div class="unit">每程</div><div class="price">'+ reqData.cityLine.luxuriousPrice +'元</div></div>' +
            '</li>' +
            '</ul></li>'
    }

    //  商务型
    var _businessPriceHtml = '';
    if(reqData.cityLine.businessPrice){
        _businessPriceHtml = '<li class="stage-type"><div class="stage-name">商务型</div><ul>' +
            '<li class="stage-item">' +
            '<div class="unit-box"><div class="unit">每程</div><div class="price">'+ reqData.cityLine.businessPrice +'元</div></div>' +
            '</li>' +
            '</ul></li>'
    }

    var _allHtml = '<ul>' +
        '<li class="stage-type"><div class="stage-name">拼车</div><ul>' +
        _itemHtml +
        '</ul></li>' + _comfortablePriceHtml + _luxuriousPriceHtml + _businessPriceHtml +
        '</ul>';
    $('.market-rule-container .market-content').html(_allHtml);
}

//显示价格详情
function showFeeDetail(){
    var  payStatus = $('#payStatus').val();
    var feeDetailObj = {
        orderPrice: $('#orderPrice').val(),
        price: $('#price').val(),
        discountPrice: $('#discountPrice').val(),
        couponPrice: payStatus =='0'? $('#newCouponPrice').val():$('#couponPrice').val(),
        payPrice: payStatus =='0'? $('#newPayPrice').val():$('#payPrice').val(),
        refundPrice: $('#refundPrice').val(),
        feePrice: $('#feePrice').val(),
        specialActivityType: $('#specialActivityType').val(),
        specialActivityName: $('#specialActivityName').val(),
        specialPrice: $('#specialPrice').val(),
        realPrice: $('#realPrice').val(),
        priceAdjustValue: $('#priceAdjustValue').val(),
        numbers: $('#numbers').val(),
        priceAdjustType: $('#priceAdjustType').val(),
    };

    //优惠项
    var _couponItem = '';
    //所有的优惠项 如果没有优惠项则不显示
    var _couponBoxHtml = '';

    // if(feeDetailObj.priceAdjustValue != 0){
    //     if(feeDetailObj.priceAdjustType == 0){
    //         // <!--0:减价 1：加价-->
    //         _couponItem += '<div class="coupon-item"><div class="name">调整金额</div><div class="number">-'+ feeDetailObj.priceAdjustValue +'元</div></div>';
    //     }else{
    //         _couponItem += '<div class="coupon-item"><div class="name">调整金额</div><div class="number">+'+ feeDetailObj.priceAdjustValue +'元</div></div>';
    //     }
    // }
    if(feeDetailObj.couponPrice != 0){
        var realCouponPrice = 0;
        // var realPrice = parseFloat(feeDetailObj.price)-parseFloat(feeDetailObj.discountPrice);
        //if(parseFloat(feeDetailObj.realPrice) > parseFloat(feeDetailObj.couponPrice)){
        //    realCouponPrice = feeDetailObj.couponPrice;
        //}else {
        //    realCouponPrice = parseFloat(feeDetailObj.realPrice) - parseFloat(feeDetailObj.couponPrice)
        //}
		realCouponPrice = (parseFloat(feeDetailObj.realPrice) - parseFloat(feeDetailObj.couponPrice))>=0 ? feeDetailObj.couponPrice : parseFloat(feeDetailObj.realPrice);
        _couponItem += '<div class="coupon-item"><div class="name">优惠券</div><div class="number">-'+ formatMoney(realCouponPrice,2) +'元</div></div>';
    }
    if(feeDetailObj.specialPrice!=0 ){
        _couponItem += '<div class="coupon-item"><div class="name">特价优惠</div><div class="number">-'+ feeDetailObj.specialPrice +'元</div></div>';
    }
    // if(feeDetailObj.discountPrice != 0){
    //     _couponItem += '<div class="coupon-item"><div class="name">折扣优惠金额</div><div class="number">'+ feeDetailObj.discountPrice +'元</div></div>';
    // }
    if(_couponItem){
        _couponBoxHtml = '<div class="coupon-box">' + _couponItem + '</div>';
    }

    //费用明细项
    var _itemHtml = '<div class="detail-item"><div class="name">一口价</div><div class="number">'+ feeDetailObj.price +'元</div></div>';
    _itemHtml += '<div class="detail-item"><div class="name">人数</div><div class="number">'+ feeDetailObj.numbers +'人</div></div>';
    if(feeDetailObj.feePrice != 0){
        _itemHtml += '<div class="detail-item"><div class="name">手续金额</div><div class="number">'+ feeDetailObj.feePrice +'元</div></div>';
    }
    var _detailHtml = '';
    _detailHtml += '<div class="detail-box">' + _itemHtml + '</div>' + _couponBoxHtml;

    // 生成费用明细
    $('.price-detail-container .price-detail-main').html(_detailHtml);

    //显示实付价格
    $('.price-detail-container .pay-price').html(feeDetailObj.payPrice + '<span>元</span>')
}

//初始化所有页面的title
var currentServiceName;
var providerName;
function initTitleOfStatus() {
        var userInfo = JSON.parse(localStorage.getItem("userInfo"));
        var title = '';
        if(null != userInfo){
            providerName = userInfo.providerName;
        }
        serviceNameObj = JSON.parse(localStorage.getItem("serviceNameObj"));
        if(null != serviceNameObj){
            currentServiceName = serviceNameObj.interCityTxt;
            if(!currentServiceName){
                currentServiceName = '城际约车'
            }
        }
        var tripStatus = $('#tripStatus').val();
        var tripStatusTxt = '';
        if(tripStatus == 3){
            tripStatusTxt = '待出行';
        }else if(tripStatus == 4){
            tripStatusTxt = '等待接驾';
        }else if(tripStatus == 5){
            tripStatusTxt = '等待上车';
        }else if(tripStatus == 6){
            tripStatusTxt = '前往目的地';
        }

        if(tripStatusTxt){
            if(providerName){
                title = tripStatusTxt + ' - ' + currentServiceName + ' - ' + providerName;
            }else{
                title = tripStatusTxt + ' - ' + currentServiceName;
            }
        }else{
            if(providerName){
                title = currentServiceName + ' - ' + providerName;
            }else{
                title = currentServiceName;
            }
        }

        $('title').html(title);
        $(document).attr("title",title);
}

//是否显示取消订单按钮
function isShowCancel() {
    // 0-不可取消，1-可取消
    var hasCanCancelOrder = $('#hasCanCancelOrder').val();
    if(hasCanCancelOrder == '0' ){
        $('#morePanel').find('#cancel').remove();
    }else if(hasCanCancelOrder == '1'){
        $('#morePanel ul').prepend('<li id="cancel">取消订单</li>');
    }

   // 取消订单点击事件绑定
    $('#cancel').on('click',function(){
        $.confirm('确定取消订单吗？', '',['暂不取消', '确定取消'],function() {
            if (orderInfo.status == 4 || orderInfo.status == 5){
                $(".range").css("margin-top",".17rem");
                $(".payment-info").show();
                //取消并退款
                location.href='/innerCity/order/toOrderCancelReturnPage?orderNo='+orderInfo.orderNo;
            }
            else if(orderInfo.status == 3){
                $(".range").css("margin-top",".6rem");
                $.ajax({
                    url:'/innerCity/order/cancelOrder',
                    data:{'orderNo':orderInfo.orderNo},
                    dataType:'json',
                    success:function(data){
                        if(parseInt(data.code)==0){
                            //清空缓存
                            location.href ='/innerCity/order/toOrderReturnDetailPage?orderNo='+orderInfo.orderNo;
                        }else if(parseInt(data.code)==8889){
                            $.dialog({
                                text: '你的订单已被客服取消，请重新发起行程',
                                buttons: [{
                                    text: '我知道了',
                                    onClick: function() {
                                        //清空缓存
                                        window.sessionStorage.removeItem('callCarInfo');
                                        window.location='/interCityIndex';
                                    }
                                }]
                            });
                        }else{
                            $.alert(data.message);
                        }
                    }
                })
            }
        })
    })
}

//是否显示支付成功
function isShowPaymentInfo() {
    // 0：未支付，1：已支付，2：已退款
    var payStatus = $('#payStatus').val();
    if(payStatus == '0' || payStatus == '2'){
        $('.payment .payment-info').hide();
    }else if(payStatus == '1'){
        $('.payment .payment-info').show();
    }
}

var departTimefmt = formatTime('yyyy-MM-dd hh:mm',$('#departTime').val());
$('.journey-container .time-box').html('出发时间：'+departTimefmt);

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

    $("#depart_Type").html(carType);
}