var clickEvent = isAndroid() ? 'tap' : 'click';

/*有特价判断条件/bus/toBusOnlinePay：promoteType != -1 && singleDiscount !=0 ;*/

var userInfo = JSON.parse(localStorage.getItem("userInfo"));
//url中带的参数
var urlParams = getUrlParams();
//接口返回的数据
var orderInfo = {
    passengerNum: 0,
    // insuranceUnitPrice : 0,
    // insurancePay : 0,
};
//提交订单的数据
var finalOrderInfo = {
    passengerNum: 0,
    // realPayPrice: 0,//实付价格
    // normalPayPrice: 0,//原价
    currentPayWay: 1,//支付方式 1-微信支付 2-上车支付（无保险）
};
var selectPersonList = [];//选中的乘车人，用于乘车人弹窗数据回显
// 绑定滚动条
var _myIScroll;
var bindScroll = function(el) {
    if(_myIScroll) {
        _myIScroll.destroy();
    }
    setTimeout(function() {
        _myIScroll = new IScroll(el + ' .wrapper');
    }, 300);
}
var businessTypeList = ['','busline','commute','travel'];// 1-定制班线 2-通勤 3-旅游

// $('#tel').on('focus',function () {
// console.log('获得焦点');
// $('.btn-list').css({'position':'static'})
//
// });
$('#tel').on('blur',function () {
    console.log('失去焦点');
    var orderContactMobile = $.trim($(this).val());
    if(isPoneAvailable(orderContactMobile)){
        sessionStorage.setItem('orderContactMobile',orderContactMobile);
    }else{
        $.toast('请输入正确的手机号')
    }
});

function windowResizeEvent(callback) {
    var resizeFlag = false;
    window.onresize = function() {
        var target = this;
        if (target.resizeFlag) {
            clearTimeout(target.resizeFlag);
        }

        target.resizeFlag = setTimeout(function() {
            resizeFlag = !resizeFlag;
            console.log(resizeFlag);
            callback(resizeFlag);
            target.resizeFlag = null;
        }, 0);
    }
}

$(function () {
    //加载用户信息
    //加载用户信息
    if (isEmpty(userInfo)) {
        initUserInfo(function () {
            init();
        });
    }
    else {
        init();
    }
});

function init() {
    userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // 是否显示线路
    setTitle("订单信息-"+userInfo.providerName);
    // 清空联系人
    $('.clear-btn').off(clickEvent).on(clickEvent,function(){
        $(this).prev().val('').focus();
    });
    // 返回
    $('.cancel').off(clickEvent).on(clickEvent,function(){
        window.history.go(-1);
        sessionStorage.removeItem('passengerList');
    });
    //    以下为新
    var reqOnlinePayData = {
        token: $.cookie('token'),
        busId: urlParams.busId,
        passengerIds: $.cookie('passengerIds'),
    };
    reqOnlinePayInfo(reqOnlinePayData);
}

//初始化页面-数据回显 需要全部回显
function  initPage() {
    $('#tel').blur();//强制失去焦点
    var localIdCardInfo = sessionStorage.getItem('passengerList');
    var selectedCoupon = localStorage.getItem('selectedCoupon');
    var passengerNumber = sessionStorage.getItem('passengerNumber');
    var insuranceId = sessionStorage.getItem('insuranceId');


    if(orderInfo.needIdCard == 1){
        // 实名制
        if(!isEmpty(localIdCardInfo)){
            localIdCardInfo = $.parseJSON(localIdCardInfo);
            selectPersonList = localIdCardInfo;
            console.log('localIdCardInfo：');
            console.log(localIdCardInfo);

            //finalOrderInfo.passengerNum = localIdCardInfo;//TODO
            //选中的乘客数据回显
            showSelectPassenger(localIdCardInfo);
            //弹窗数据回显
            //选中乘车人弹窗数据回显
            // selectPersonList.forEach(function (person) {
            //     if(id == person.id){
            //         person.selectedFlag = false;
            //     }
            // });
            // changeSelect($input);
            if(insuranceId == 0){
                clearInsurance();
            }
            changeInsurance();
            calculateTotalPrice(false);
            // localIdCardInfo.forEach(function (local) {
            //     $('#passengerList .passenger-list li').forEach(function (item) {
            //         if(local.id == $(item).data('id')){
            //             $(item).data('select',true);
            //         }
            //     })
            // });
        }
    }else{
        // 非实名制
        if(!isEmpty(passengerNumber)){
            var $parent = $('#passengerNumber');
            //选中的乘客数据回显 TODO
            $parent.find('.txt').text(passengerNumber);
            $("#passengerNumber").attr('data-passengerNum',passengerNumber);
            calculateTotalPrice(false);
            if(passengerNumber == orderInfo.ticketMaxBuyNumber) {
                $parent.find('.icon-plus').addClass('out');
            }
            if(passengerNumber == 1) {
                $parent.find('.icon-minus').addClass('out');
            }
        }
    }

    // getLastInsurance();//保险回显

    windowResizeEvent(function (resizeFlag) {
        if(resizeFlag){
            $('.btn-list').css({'position':'static'})
        }else {
            $('.btn-list').css({'position':'fixed'})
        }
        // resizeFlag = !resizeFlag ;
    });
}

//显示站点信息
function fullStationInfo(obj) {
    $('.ticket-info .time').html(formatDateToString(new Date(obj.order.departTime), true) + '<span>'+ (isEmpty(obj.scheduleCode)?"":obj.scheduleCode) +'</span>');
    $('.ticket-info .station .start .txt').html(obj.order.departTitle);
    $('.ticket-info .station .end .txt').html(obj.order.arriveTitle);
    // $('.ticket-info .ticket-other-info .old-price span').html(obj.order.ticketPrice);
    $('#ticketRule .rule-bar .content p').html(obj.payRule);

    //特价
    var singleSpecialPrice = (obj.order.ticketPrice * 100 - obj.singleDiscount *100) /100;
    if(obj.promoteType != -1 && singleSpecialPrice > 0){
        //有特价
        $('.ticket-info .special-price').html('特价￥'+saveTwoDigit(singleSpecialPrice));
        $('.ticket-info .ticket-other-info .old-price').html('原价￥<span>'+ obj.order.ticketPrice +'</span>');
    }else{
        //无特价
        $('.ticket-info .ticket-other-info .old-price').html('￥<span>'+ obj.order.ticketPrice +'</span>');
    }

    //显示开车前30分钟提示
    var now = new Date().getTime();
    var departTime = obj.order.departTime;
    var timeDifference = departTime - now;
    if(timeDifference >=0 && timeDifference<= 30*60*1000){
        $('#timeWarnTips').show();
    }else{
        $('#timeWarnTips').hide()
    }
}
//显示乘车人信息
function fullPassengersInfo(obj) {
    if(obj.needIdCard == 1){
    //    实名制
        $('#maxPassenger').html(obj.ticketMaxBuyNumber);
        $('#maxPassenger').data('value',obj.ticketMaxBuyNumber);
        // $('#passengerWrapper #popupPassenger h4 span').html('（最多'+ obj.ticketMaxBuyNumber +'位）');
        var availableHtml = '';//是否特价限购
        if(!isEmpty(obj.availableNum) && obj.availableNum > 0){
            //有特价限购张数
            availableHtml = '<div class="buy-tips count buy-tipss" >' +
                '  特价限购<span class="total">'+ obj.availableNum +'</span> 张，' +
                '  还可购 <span class="overplus">'+ obj.leftNum +'</span> 张' +
                '</div>'
        }else{
            //无特价限购张数
            // availableHtml = '<div class="buy-tips count buy-tipss" >可购 <span class="overplus">'+ obj.leftNum +'</span> 张</div>'
        }
        $('#passengerWrapper .header-content').append(availableHtml);
        $('#passengerWrapper').show();
        $('.no-info-passenger-list').hide();

    }else{
    //    非实名制
        console.log('非实名制');
        $('#passengerWrapper').hide();
        $('.no-info-passenger-list').show();

        $('.coupon-btn').show();
        $('.coupon-btn li .name h4 span').html('（最多'+ obj.ticketMaxBuyNumber +'位）');

        if(!isEmpty(obj.availableNum) && obj.availableNum > 0){
            //特价限购
            $('.no-info-passenger-list .count').show();
            $('.coupon-btn .count span.total').html(obj.availableNum);
            $('.coupon-btn .count span.overplus').html(obj.leftNum);
        }else{
            //特价不限购
            $('.no-info-passenger-list .count').hide();
        }
    }

    var orderContactMobile = sessionStorage.getItem('orderContactMobile');
    if(isEmpty(orderContactMobile)){
        $('.coupon-btn .contact #tel').val(obj.orderContactMobile);
    }else{
        $('.coupon-btn .contact #tel').val(orderContactMobile);
    }

}

//显示保险信息
function fullInsuranceInfo(obj) {

    if(obj.insuranceRulePriceList && obj.insuranceRulePriceList.length > 0){
        console.log('有保险');
        var insuHtml = '';
        obj.insuranceRulePriceList.forEach(function (item,index) {
            var insuranceIntro = '暂无说明';
            if(!isEmpty(item.insuranceIntro)){
                insuranceIntro = item.insuranceIntro;
            }
            insuHtml += '<div class="swiper-slide"><div class="insurance-item" data-unit="'+ item.insurancePrice +'" data-type="'+ item.insuranceType +'" ' +
                'data-id="'+ item.id +'" data-defaultChoice="'+ item.defaultChoice +'" data-choose="false">' +
                '  <div class="desc">'+ item.sumInsured/10000 +'万保障</div>' +
                '  <div class="amount"><span class="unit-price">￥'+ item.insurancePrice +'</span> × <span class="count">份</span></div>' +
                '  <div class="insuranceIntro" style="display: none">'+ insuranceIntro +'</div>' +
                '  <div class="detail-btn"><span>详情</span></div>' +
                '</div></div>';
        });
        $('.insurance-container #wrapper .content .swiper-wrapper').html(insuHtml);
        // $('.insurance-container #wrapper .content ul').html(insuHtml);
        swInsuranceList();
        $('.insurance-container').show();
    }else{
        console.log('无保险');
        $('.insurance-container').hide();
    }
}

function swInsuranceList(){
    /** 轮播图*/
    var sw = new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 10,
        // slidesPerView: false,
        // centeredSlides: true,
        // paginationClickable: true,
        // autoplay: true,//可选选项，自动滑动
    });
}

//其他信息
function fullOthers(obj) {
    var remark = '可填写备注，建议填写与我们沟通好的内容';
    if(!isEmpty(obj.remark)){
        remark = obj.remark;
    }
    $('#popupCommentInfo #remark').attr('placeholder', remark);

    var warmPromptHtml = '';
    //温馨提示
    if(!isEmpty(obj.remindContent)){
        warmPromptHtml += '<div class="head"><h6>温馨提示：</h6></div>' +
            '<p>'+ obj.remindContent +'</p>'
    }
    //退票规则
    if(!isEmpty(obj.payRule)){
        warmPromptHtml += '<div class="head"><h6>退票/购票规则</h6></div>' +
            '<p>'+ obj.payRule +'</p>'
    }
    $('.warm-prompt').html(warmPromptHtml);

    //是否支持上车支付
    if(obj.allowOnLineBook == '1'){
        // 支持上车 支付
        $('#onLineCarPay').show();
    }else{
        //不支持
        $('#onLineCarPay').hide();
    }
}

function addEvent(obj) {
    //选中保险
    $('#wrapper .content .insurance-item').off('click').on('click',function () {
        chooseInsurance(this);
    });
    $('#wrapper .detail-btn span').off(clickEvent).on(clickEvent,function (e) {
        var insuranceIntro = $(this).parent().siblings('.insuranceIntro').html();
        $('#insuranceDetail .main').html(insuranceIntro);
        $('#insuranceDetail').show();
        e.stopPropagation();//阻止事件冒泡
    });
    passengerHandle({needIdCard:obj.needIdCard,personList:selectPersonList},function (personList) {
        //强制失去焦点 - 部分手机可以获取焦点
        setTimeout(function () {
           $('#tel').blur();
        },0);

        showSelectPassenger(personList);

        selectPersonList = personList;//选中的乘车人

        changeInsurance();//保险价格变化
        calculateTotalPrice(false);
        sessionStorage.setItem('passengerList',JSON.stringify(personList));
    });
}

function reqOnlinePayInfo(reqDataObj) {
    var successCallback = function(res){
        fullStationInfo(res);
        fullPassengersInfo(res);
        fullInsuranceInfo(res);
        fullOthers(res);
        addEvent(res);
        initInsurance();
        initPage();
    };

    var url = SERVER_URL_PREFIX + '/bus/toBusOnlinePay';
    reqDataObj = genReqData(url, reqDataObj);
    $.showLoading();
    $.ajax({
        type:'post',
        data: reqDataObj,
        url: url,
        dataType: 'json',
        success: function (res) {
            $.hideLoading();
            if(res.code == 0){
                orderInfo = res.data;
                orderInfo.timestamp = res.timestamp;
                successCallback(orderInfo);
            }
        }
    })
}

// 获取url中传的参数
function getUrlParams() {
    var localUrl = window.location.href;
    var result = {
        busId: getParam('busId', localUrl),
        qrcId : getParam('qrcId', localUrl),
    }
    return result;
}

/* end */


//显示选中的乘客
function showSelectPassenger(personList){
    var contentHtml = '';
    var selectedNo = 0;
    if(personList && personList.length > 0){
        personList.forEach(function (item, index) {
            var tipsHTml = '';
            if(orderInfo.needIdCard == 1){
                tipsHTml = '<p><span class="label">身份证</span>'+ (isEmpty(item.idCardNo)? "请补充身份证号" : item.idCardNo) +'</p>';
            }
            if(item.selectedFlag){
                selectedNo++;
                //选中的
                contentHtml += '<div class="item" data-id="'+ item.id +'" data-idcard="'+ item.idCardNo +'">' +
                    '  <div class="handle-minus"></div>' +
                    '  <div class="info">' +
                    '    <p><span class="label passenger-name">'+ item.passengerName +'</span></p>' +
                    '    ' + tipsHTml +
                    '  </div>' +
                    '</div>'
            }
        });
        finalOrderInfo.passengerNum =  selectedNo;
    }
    $('#passengerWrapper .content').html(contentHtml);

    $('#passengerWrapper').show();
    $('.no-info-passenger-list').hide();

    $(".handle-minus").off(clickEvent).on(clickEvent,function(){
        clickHandleMinus(this)
    });
}

//不选保险
function clearInsurance() {
    var ele = $('#wrapper .content  .active');
    if(!ele.data('choose')){
        $('#wrapper .content .active').removeClass('active');
    }
    orderInfo.insuranceUnitPrice = 0;
    orderInfo.insuranceType = 0 ;
    orderInfo.insuranceConfirm = 0;
    orderInfo.insuranceId = 0;
    orderInfo.insurancePay = 0;
}

//选择上一次选中的保险
function getLastInsurance() {
    var insuranceId = sessionStorage.getItem('insuranceId');
    if(isEmpty(insuranceId) || insuranceId == 0){
        return;
    }
    $('#wrapper .content .insurance-item').each(function () {
        var id = $(this).data('id');
        if(id == insuranceId ){
            $(this).data('choose',false);
            chooseInsurance($(this));
        }
    });
}

//选择保险
function chooseInsurance(ele) {
    var choose = $(ele).data('choose');
    if(choose){
        $(ele).data('choose',false);
        clearInsurance();
        //清除缓存

        sessionStorage.setItem('insuranceId','0');
    }else{
        $('#wrapper .swiper-slide .insurance-item').forEach(function (el,index) {
            $(el).removeClass('active');
            $(el).data('choose',false);
        });
        $(ele).addClass('active');
        $(ele).data('choose',true);
        orderInfo.insuranceUnitPrice = $(ele).data('unit');
        orderInfo.insuranceType = $(ele).data('type');
        orderInfo.insuranceConfirm = 1;
        orderInfo.insuranceId = $(ele).data('id');

        //缓存
        sessionStorage.setItem('insuranceId', $(ele).data('id'));
    }
    changeInsurance();
    //计算支付价格
    calculateTotalPrice(false);
}

/**
 *提交订单
 */
function submitOrder(){
    var passengerIdList="";
    var data={};
    var passengerNum=0;
    data.orderContactMobile = $("#tel").val(); // 联系号码

    if(!isPoneAvailable(data.orderContactMobile)){
        $.toast("请输入正确的手机号码");
        return;
    }

    if(orderInfo.needIdCard==1){//实名制
        var passFlag=true;
        $('#passengerWrapper .content .item').each(function(){
            var passengerItemId=$(this).data('id');
            var idCard=$(this).data('idcard');
            passengerIdList+=passengerItemId+",";
            passengerNum++;
            if((orderInfo.needIdCard ==  '1' /*|| orderInfo.insuranceConfirm==1*/)&&(idCard==undefined||idCard=="")){
                passFlag=false;
            }
        })
        if(passFlag==false){
            $.toast("乘车人身份证信息不能为空");
            return;
        }
        if(passengerNum==0){
            $.toast("请先选择乘车人");
            return;
        }
        data.passengerContactIds = passengerIdList;
    }else if(orderInfo.needIdCard==0){//非实名制
        var passengerNum=$("#passengerNumber").attr('data-passengerNum');//乘车人数
        if(passengerNum==0){
            $.toast("乘车人数不能为0");
            return;
        }
        data.numbers=passengerNum;
    }
    if(parseInt(passengerNum)>parseInt(orderInfo.ticketMaxBuyNumber)){
        $.toast("乘车人数不能超过"+orderInfo.ticketMaxBuyNumber);
        return;
    }
    var couponId=$("#couponUsePrice").data('coupon-id');//优惠券
    if(couponId&&couponId!=null){
        data.couponId=couponId;
    }

    if(orderInfo.needIdCard == "1" && orderInfo.needInsurance =="1"){
        data.insuranceId = orderInfo.insuranceId;
    }

    if(finalOrderInfo.currentPayWay==2){
        data.reservationType=1;
    }
    data.insurancePrice = orderInfo.insuranceUnitPrice;
    data.insuranceType = orderInfo.insuranceType;
    data.insurancePay = orderInfo.insurancePay;
    data.insuranceConfirm = orderInfo.insuranceConfirm;
    data.busId=orderInfo.order.busIdStr;
    data.token=$.cookie("token");
    data.qrcodeId = urlParams.qrcId;
    data.orderNo="";
    data.remark = $("#remark").val();

    //购票人数超过特价限购数量时
    if(passengerNum > orderInfo.leftNum){
        data.specialPrice = parseFloat(orderInfo.singleDiscount) * orderInfo.leftNum;
    }else{
        data.specialPrice = parseFloat(orderInfo.singleDiscount) * passengerNum;
    }

    if (data.remark && data.remark.length > 40) {
        $.toast("备注的长度不能超过40");
        return ;
    }
    console.log(data);
    $.showLoading();
    $.post("/busline/busOrder/initOrder",data,function(result){
        $.hideLoading();
        if(result.code == 0){
            var currentOrderNo = result.data;
            if(data.reservationType&&data.reservationType==1){
                window.location.href="/bus/toBusOrderDetail?token="+$.cookie('token')+"&orderNo="+currentOrderNo;
            }else{
                var b = new Base64();
                var url = b.encode("/bus/h5/paymentUnit.html?token="+$.cookie('token')+"&orderNo="+currentOrderNo);

                var couponId=$("#couponUsePrice").data('coupon-id') == undefined ? 0 : $("#couponUsePrice").data('coupon-id');

                window.location.href='/order/payunit?orderNo='+currentOrderNo+'&userCouponId='+couponId+'&url='+url;
            }
        }
        else if(result.code==30086){
            window.location='/bus/toPaySuccess?orderNo='+result.data; // 0元支付
        }
        else if(result.code==30001){
            $.alert(result.message,function(){
                history.go(0);
            })
        }else{
            if(result.message == "票已售罄"){
                $.alert("该班次已售罄",function(){
                    window.location = "/busIndex?token="+$.cookie('token');
                    return false;
                });
            }else{
                $.alert(result.message);
            }
        }
    },'json');
}

//获取乘客端详细信息
function getPassengerDetailInfo(id,$parent){
    $.showLoading();
    $.ajax({
        type: "GET",
        url: "/bus/passengerContactInfo/getPassengerDetailInfo",//添加订单
        data:{'id':id},
        dataType: "json",
        success: function(result){
            $.hideLoading();
            if(result != undefined && result.code != undefined && parseInt(result.code) == 0){
                var data=result.data.passenger;
                $('#editPassenger').popup('push', function() {
                    $('#editPassengerName').val(data.passengerName);
                    $('#editPassengerPhone').val(data.mobile);
                    $('#editPassengerCode').val(data.showIdCardNo);

                    //设置触发的元素
                    $('#editPassenger').data('trigger', $parent.index());
                });
            }else{

            }
        }
    });
}

function checkTel(tel) {
    var mobile = /^1[3|4|5|6|7|8|9]\d{9}$/ , phone = /^0\d{2,3}-?\d{7,8}$/;
    return mobile.test(tel) || phone.test(tel);
}

//计算保费
function getInsurancePrice() {
    var re = saveTwoDigit(finalOrderInfo.passengerNum * parseFloat(orderInfo.insuranceUnitPrice));
    return re;
}

//优惠券选择
function isSelectCoupon(){
    var localIdCardInfo = JSON.parse(sessionStorage.getItem('passengerList'));
    if(undefined != localIdCardInfo && null != localIdCardInfo &&  localIdCardInfo.length > 0){
        finalOrderInfo.passengerNum = localIdCardInfo.length;
        var  _html = '';
        localIdCardInfo.forEach(function (item,index) {
            var idcardHtml='';
            if(item.idCard != '' && null != item.idCard){
                idcardHtml= '<p><span class="label">身份证</span>' + item.idCard + '</p>';
            }
            _html += '<div class="item" data-id="'+item.id+'" data-idcard="'+item.idCard+'">' +
                '<div class="handle-minus"></div>' +
                '<div class="info">' +
                '<p><span class="label passenger-name">' + item.name + '</span></p>' +
                idcardHtml +
                '</div>' +
                '</div>';
        })
        $('#passengerWrapper .content').html('').append(_html);

        $(".handle-minus").off(clickEvent).on(clickEvent,function(){
            clickHandleMinus(this)
        });
    }
    calculateTotalPrice();
}

/*
* 优惠券 - 操作
* */
$('.coupon-toggle').off(clickEvent).on(clickEvent, function() {
    var passengerNum = finalOrderInfo.passengerNum;
    if(passengerNum == 0){
        $.toast("请先选择乘车人");
        return;
    }
    var busId = orderInfo.order.busIdStr;
    var price = $('#ticketPriceContent').data('price');
    var specialFlag = parseFloat(orderInfo.singleDiscount) == 0 ? 0 : 1;
    // var businessType = orderInfo.lineType == '4'?businessParam.busline:businessParam.travel;
    var businessType = businessParam[businessTypeList[orderInfo.lineType]];
    window.location = '/coupon/select?businessType='+businessType+'&busId='+busId+'&specialFlag='+specialFlag+'&price='+price;
});
/*
   * 更新select状态
   * */
function changeSelect(el) {
    el.parents('li').data('select', el.prop('checked'));
}

function clickHandleMinus(_this){

    var currentParent = $(_this).parent();
    currentParent.remove();
    // finalOrderInfo.passengerNum--;
    $("#couponUsePrice").data("price","0");//选择的是哪个优惠券
    $("#couponUsePrice").removeClass('text-red');
    $("#couponUsePrice").addClass('text-gray');

    if(orderInfo.isLineCooperate == 2){
        $("#couponUsePrice").html("合作线路不支持使用优惠券");
    }else{
        $("#couponUsePrice").html("不使用优惠券");
    }
    $("#couponUsePrice").data("couponId","");//选择的是哪个优惠券

    var id = currentParent.data('id');
    var $input = $(".checkBoxClass" + id);
    $input.prop('checked', false);

    //选中乘车人弹窗数据回显
    finalOrderInfo.passengerNum = 0;
    selectPersonList.forEach(function (person) {
        if(id == person.id){
            person.selectedFlag = false;
        }

        if(person.selectedFlag == true){
            finalOrderInfo.passengerNum++;
        }
    });
    changeSelect($input);
    changeInsurance();
    calculateTotalPrice();
    sessionStorage.setItem('passengerList',JSON.stringify(selectPersonList))
}

function calculateCouponPrice(data,totalPrice){

    if(data.isValid == 1){
        var couponAmount = 0;
        if(data.isDiscount == 0){
            couponAmount = data.amount;
            if(totalPrice <= couponAmount ){
                couponAmount = totalPrice;
            }
        }else{
            couponAmount = totalPrice- (((totalPrice*100)*(data.amount*100))/100/1000).toFixed(2);
            if(couponAmount > data.discountMaxLimitAmount ){
                couponAmount = data.discountMaxLimitAmount;
            }
        }

        $("#couponUsePrice").html("-" + saveTwoDigit(couponAmount.toFixed(2))+"元");
        $("#couponUsePrice").data("couponId",data.recordId);//选择的是哪个优惠券
        $("#couponUsePrice").data("price",couponAmount);//选择的是哪个优惠券
        $("#couponUsePrice").removeClass('text-gray');
        $("#couponUsePrice").addClass('text-red');
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

function loadCoupons(totalPrice,callback) {

    var selectedCoupon = JSON.parse(window.localStorage.getItem('selectedCoupon'));
    if(undefined != selectedCoupon){
        calculateCouponPrice(selectedCoupon,totalPrice)
        callback();
    }else{
        //调用查询优惠券信息接口

        var param = {
            businessType:businessTypeList[orderInfo.lineType],
            busId :orderInfo.order.busIdStr,
            price : $('#ticketPriceContent').data('price'),
            specialFlag : parseFloat(orderInfo.singleDiscount) == 0 ? 0 : 1
        }
        queryHasCoupons(param,function (data) {
            calculateCouponPrice(data,totalPrice);
            callback();
        });
    }
}
//计算支付价格
function confirmPayPrice(totalPrice) {
    //当支付总额小于等于0时，隐藏优惠券列表
    $("#totalPrice").val(totalPrice);
    if (totalPrice <= 0 || finalOrderInfo.currentPayWay == 2) {
        $("#coupon-li").hide();
    } else {
        $("#coupon-li").show();
    }

    var couponPrice = $("#couponUsePrice").data('price');
    if(couponPrice && couponPrice != null){
        if(couponPrice > totalPrice){
            totalPrice=0;
        }else{
            totalPrice = totalPrice-couponPrice;
        }
    }
    if (orderInfo.insuranceType != 0 && orderInfo.insuranceConfirm == 1){
        totalPrice = totalPrice + orderInfo.insurancePay;
    }
    orderInfo.confirmPayAmount = totalPrice;
    changeInsurance();

    $('#insuranceCount').html('<i>×</i>' + finalOrderInfo.passengerNum + '份');
    $("#insurancePay").html(saveTwoDigit(orderInfo.insurancePay) + "元" );

    if(finalOrderInfo.currentPayWay == 1){
        $('.pay-price').css("color",'#999999');
        $('.pay-price').html('实付' + saveTwoDigit(totalPrice) + "元").show();
    }else{
        //设置价格区域的文字与底色相同 达到隐藏的效果
        $('.pay-price').css("color",'#f2f2f2');
        $("#ticketPriceContent .new-price-total").html(saveTwoDigit(parseFloat(orderInfo.order.ticketPrice) * finalOrderInfo.passengerNum) + "元");
        $("#ticketPriceContent .old-price-total").hide();
        $('#specialPriceli').hide();
        $('.new-count').hide();
        // $(".coupon-btn li").css('border','0');
    }
}
//计算价格
function calculateTotalPrice(clearCouponFlag){
    // clearCouponFlag 是否清除优惠券缓存 默认清除 解决选中优惠券或者刷新页面的时候不需要清除
    if(isEmpty(clearCouponFlag)){
        clearCouponFlag = true;
    }

    //清除优惠券缓存
    if(clearCouponFlag){
        localStorage.removeItem('selectedCoupon');
    }

    if(finalOrderInfo.passengerNum > 0){
        $('#showTotalPrice .buy-tips').show();
    }else{
        $('#showTotalPrice .buy-tips').hide();
    }

    if(orderInfo.needIdCard==0){//非实名制
        finalOrderInfo.passengerNum=$("#passengerNumber").attr('data-passengerNum');//乘车人数
    }

    var oldTotalPrice = parseFloat(orderInfo.order.ticketPrice) * finalOrderInfo.passengerNum;
    var ticketTotalPrice=parseFloat(orderInfo.order.ticketPrice) * finalOrderInfo.passengerNum;

    //如果特价是加价 singleDiscount为负是加价
    var specialNum = 0;
    var singleSpecialPrice = parseFloat(orderInfo.order.ticketPrice) - orderInfo.singleDiscount;
    if( orderInfo.promoteType == 1 && orderInfo.promoteNum > 0){
        // singleSpecialPrice = saveTwoDigit((orderInfo.promoteNum * orderInfo.order.ticketPrice * 100)/1000);
    }
    if (orderInfo.promoteType != -1 && orderInfo.singleDiscount != 0){
        $('.buy-tipss').show();
        $('.special-price').html('特价￥'+saveTwoDigit(singleSpecialPrice));
        setTimeout(function () {
            $('.ticket-other-info').css('margin-top','-.4rem');
        },0)

    }
    else{
        $('.buy-tipss').hide();
        setTimeout(function () {
            $('.ticket-other-info').css('margin-top','0');
        });
    }

    if(finalOrderInfo.passengerNum <= orderInfo.leftNum){
        ticketTotalPrice = singleSpecialPrice * finalOrderInfo.passengerNum;
        // ticketTotalPrice = orderInfo.singleDiscount * finalOrderInfo.passengerNum;
        specialNum = finalOrderInfo.passengerNum;
    }else{
        ticketTotalPrice = singleSpecialPrice*orderInfo.leftNum + parseFloat(orderInfo.order.ticketPrice)*(finalOrderInfo.passengerNum-orderInfo.leftNum);
        specialNum = orderInfo.leftNum;
    }

    $('.overplus').html(orderInfo.leftNum-specialNum);
    if(orderInfo.promoteType != -1 && orderInfo.singleDiscount != 0){
        // 有特价
        if(orderInfo.leftNum < finalOrderInfo.passengerNum){
            //特价人数小于等于选中人数，不显示原价
            $('.old-count').html('原价￥'+orderInfo.order.ticketPrice+'×'+(finalOrderInfo.passengerNum - orderInfo.leftNum));
            $('.old-count').show();
        }else{
            $('.old-count').html('');
            $('.old-count').hide();
        }
    }else{
        // 无特价
        $('.old-count').html('￥'+orderInfo.order.ticketPrice+'×'+(finalOrderInfo.passengerNum - orderInfo.leftNum));
    }


    if (orderInfo.promoteType != -1 && orderInfo.singleDiscount != 0 && finalOrderInfo.currentPayWay==1){
        $('.new-count').html('特价￥'+saveTwoDigit(singleSpecialPrice)+'×'+specialNum).show();
    }
    if (specialNum != 0){
        $("#ticketPriceContent .old-price-total").html(saveTwoDigit(oldTotalPrice) + "元").show();
    }
    $("#ticketPriceContent").data('price',saveTwoDigit(ticketTotalPrice));
    $("#ticketPriceContent .new-price-total").html(saveTwoDigit(ticketTotalPrice) + "元");

    if(ticketTotalPrice > 0){
        loadCoupons(ticketTotalPrice,function () {
            confirmPayPrice(ticketTotalPrice);
        });
    }
    confirmPayPrice(ticketTotalPrice);
}

function insuranceIsNeed(){
    if(orderInfo.insuranceType == 0 || !orderInfo.needIdCard){
        var insuranceConfirm = $('.insurance-container .content').data("action");
        if(orderInfo.insuranceConfirm ==1 ){
            $('.insurance-container .content').addClass('off').removeClass('on').data('action', false);
        }
        $('.insurance-row').hide();
    }else{
        $('.insurance-row').show();
    }
}

$('#insuranceDetail .close').off(clickEvent).on(clickEvent,function () {
    $('#insuranceDetail .main').html('');
    $('#insuranceDetail').hide();
});
$('#commentBtn').off(clickEvent).on(clickEvent,function () {
    $('#popupCommentInfo').popup('push');
});

$('#popupCommentInfo .close').off(clickEvent).on(clickEvent,function () {
    $('#popupCommentInfo').closePopup();
});

$('#popupCommentInfo .btn').off(clickEvent).on(clickEvent,function () {
    var remark = $('#remark').val();
    if(remark.length > 9){
        remark = remark.substring(0,9) + '...';
    }
    $('#commentText').html(remark);
    $('#popupCommentInfo').closePopup();
});

//初始化保险信息
function initInsurance(){
    var insuranceId = sessionStorage.getItem('insuranceId');//insuranceId == 0 不选保险
    if(isEmpty(insuranceId)){
        if(orderInfo.needInsurance == '1'){
            $('#wrapper .content .insurance-item').each(function (index) {
                if(index == 0){
                    var defaultChoice = $(this).data('defaultchoice');
                    if(defaultChoice){
                        //默认选中第一个保险
                        orderInfo.insuranceUnitPrice = $(this).data('unit');
                        orderInfo.insurancePay = getInsurancePrice();
                        orderInfo.insuranceId = $(this).data('id');
                        orderInfo.insuranceType = $(this).data('type');
                        orderInfo.insuranceConfirm = 1;
                        $(this).data('choose',true).addClass('active');
                        sessionStorage.setItem('insuranceId',$(this).data('id'))
                    }else{
                        //不选中
                        clearInsurance();
                        $(this).data('choose',false);
                        sessionStorage.setItem('insuranceId','0');
                    }
                }
                $(this).find('span.count').html(finalOrderInfo.passengerNum + '份');
            });
            $('#insurancePrice').html(orderInfo.insurancePay + '元');
        }else{
            orderInfo.insuranceConfirm = 0;
            $('.insurance-container').hide();
        }
        calculateTotalPrice(false);
    }else{
        getLastInsurance();
    }
}

//保险价格变化
function changeInsurance() {
    orderInfo.insurancePay = saveTwoDigit(parseFloat(finalOrderInfo.passengerNum * orderInfo.insuranceUnitPrice));
    $('#insurancePrice').html(orderInfo.insurancePay + '元');
    $('#wrapper .content .insurance-item').each(function () {
        var el = $(this);
        $(el).find('span.count').html(finalOrderInfo.passengerNum + '份')
    });
}

// 选择支付方式
$('.payment-way li').off('click').on('click', function() {
    finalOrderInfo.currentPayWay = Number($(this).attr('value'));

    $(this).find('input').prop('checked', true);
    $(this).siblings().find('input').removeProp('checked');

    console.log(finalOrderInfo.currentPayWay);
    
    //1-微信支付 2-上车支付（无保险）
    if(finalOrderInfo.currentPayWay == 1){
        $(".notPayLater").show();
        if (orderInfo.needInsurance == 1){
            $('.insurance-container').show();
        }
        getLastInsurance();
    }else{
        $('.insurance-container').hide();
        $(".notPayLater").hide();
        clearInsurance();
        changeInsurance();
        //计算支付价格
        calculateTotalPrice();
        $("#couponUsePrice").data("price","0");//选择的是哪个优惠券
        $("#couponUsePrice").removeClass('text-red');
        $("#couponUsePrice").addClass('text-gray');
        if(orderInfo.isLineCooperate == 2){
            $("#couponUsePrice").html("合作线路不支持使用优惠券");
        }else{
            $("#couponUsePrice").html("不使用优惠券");
        }
        $("#couponUsePrice").data("couponId","");//选择的是哪个优惠券
    }
    calculateTotalPrice();
});

//字数统计
$('#remark').on('input', function() {
    var param = $(this).val();
    var regRule = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
    if(regRule.test(param)) {
        param = param.replace(regRule, "");
        $("#remark").val(param);
    }
    var length = param.length;
    if(length <= 40) {
        $(this).next('div').attr('class', 'message-length').text(length + '/40');
    } else {

    }
});

$("#confirmPay").off('click').on('click',function(){
    localStorage.removeItem('selectedCoupon');
    sessionStorage.removeItem('passengerList');
    sessionStorage.removeItem('passengerNumber');
    sessionStorage.removeItem('insuranceId');
    submitOrder();
});

$('#tel').on('input',function () {
    maxLengthCheck($(this),11);
});