var orderInfo = {
    timeWarnFlag:$('#timeWarnFlag').val(),
    isLineCooperate:$('#isLineCooperate').val(),
    qrcId:$('#qrcId').val(),
    settleType:$('#settleType').val(),
    needInsurance:$('#needInsurance').val(),
    needIdCard:$('#needIdCard').val(),
    ticketMaxBuyNumber:$('#ticketMaxBuyNumber').val(),
    insuranceId:0,//保险id
    ticketPrice:$('#ticketPrice').val(),
    singleDiscount:$('#singleDiscount').val(),
    leftNum:$('#leftNum').val(),
    promoteType:$('#promoteType').val(),
    promoteNum:$('#promoteNum').val(),
    insuranceType: 0,//保险类型 大于0的保险才是有效的保险类型 作用类似于id
    busIdStr:$('#busIdStr').val(),
    allowOnLineBook:$('#allowOnLineBook').val(),
    lineType:$('#lineType').val(),
    currentPayWay:1,//支付方式 1-微信支付 2-上车支付（无保险）
    confirmPayAmount:0,
    insurancePay:0, //保费
    insuranceUnitPrice:0, //保费单价
    passengerNum: 0,////乘车人数
    insuranceConfirm: 1 ,//是否购买保险 1-购买 0-不购买
}
var click_event = isAndroid() ? 'tap' : 'click';

var hasLoad=false;
var currentEditPassengerId;
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

//-- -------保险v2.0start-------- --
var insuranceScroll = new IScroll('#wrapper', {
    scrollX: true,
    scrollY: false,
    mouseWheel: true,
    eventPassthrough: true,
});
//选择保险
function chooseInsurance(ele) {
    var choose = $(ele).data('choose');
    if(choose){
        $(ele).data('choose',false);
        clearInsurance();
    }else{
        $(ele).addClass('active').siblings().removeClass('active');
        $(ele).data('choose',true).siblings().data('choose',false);
        // insuranceScroll.scrollToElement($(this)[0], 500, false, false, IScroll.utils.ease.circular);
        orderInfo.insuranceUnitPrice = $(ele).data('unit');
        orderInfo.insuranceType = $(ele).data('type');
        orderInfo.insuranceConfirm = 1;
        orderInfo.insuranceId = $(ele).data('id');
    }
    changeInsurance();
    //计算支付价格
    calculateTotalPrice();
}
//选中保险
$('#wrapper .content li').on(click_event,function () {
    chooseInsurance($(this));
   /* var choose = $(this).data('choose');
    if(choose){
        $(this).data('choose',false);
        clearInsurance();
    }else{
        $(this).addClass('active').siblings().removeClass('active');
        $(this).data('choose',true);
        // insuranceScroll.scrollToElement($(this)[0], 500, false, false, IScroll.utils.ease.circular);
        orderInfo.insuranceUnitPrice = $(this).data('unit');
        orderInfo.insuranceType = $(this).data('type');
        orderInfo.insuranceConfirm = 1;
        orderInfo.insuranceId = $(this).data('id');
    }
    changeInsurance();
    //计算支付价格
    calculateTotalPrice();*/
});
$('#wrapper .detail-btn span').on(click_event,function (e) {
    var insuranceIntro = $(this).parent().siblings('.insuranceIntro').html();
    $('#insuranceDetail .main').html(insuranceIntro);
    $('#insuranceDetail').show();
    e.stopPropagation();//阻止事件冒泡
});
function setWrapperHeight() {
    var _height = $('#wrapper .content').height();
    $('#wrapper').css({'height': _height});
}

$('#commentBtn').on(click_event,function () {
    $('#popupCommentInfo').popup('push');
});
$('#popupCommentInfo .close').on(click_event,function () {
    $('#popupCommentInfo').closePopup();
});
$('#popupCommentInfo .btn').on(click_event,function () {
    var remark = $('#remark').val();
    if(remark.length > 9){
        remark = remark.substring(0,9) + '...';
    }
    $('#commentText').html(remark);
    $('#popupCommentInfo').closePopup();
});
$('#insuranceDetail .close').on(click_event,function () {
    $('#insuranceDetail .main').html('');
    $('#insuranceDetail').hide();
});


//-- -------保险v2.0end-------- --
//乘车人信息
function calculateTotalPrice(){
    //不需要乘车人信息
    if(orderInfo.needIdCard==0){
        orderInfo.passengerNum=$("#passengerNumber").attr('data-passengerNum');//乘车人数
    }
    var ticketTotalPrice=parseFloat(orderInfo.ticketPrice) * orderInfo.passengerNum;
    //如果特价是加价
    var specialPrice = 0;
    if(orderInfo.singleDiscount<=0){
        if(orderInfo.passengerNum <= orderInfo.leftNum){
            ticketTotalPrice = (parseFloat(orderInfo.ticketPrice)-orderInfo.singleDiscount) * orderInfo.passengerNum;
            // realSpecialPrice = saveTwoDigit(passengerNum*orderInfo.singleDiscount);
        }else{
            ticketTotalPrice = (parseFloat(orderInfo.ticketPrice)-orderInfo.singleDiscount)*orderInfo.leftNum+parseFloat(orderInfo.ticketPrice)*(orderInfo.passengerNum-orderInfo.leftNum);
            // realSpecialPrice = saveTwoDigit(orderInfo.leftNum*orderInfo.singleDiscount);
        }
    }else{
        var specialTicketNum = orderInfo.leftNum;
        if(orderInfo.passengerNum<=orderInfo.leftNum){
            specialTicketNum = orderInfo.passengerNum;
        }
        // $('#activityName').html(activityName);
        $('.special-tips').html(specialTicketNum+'张');
        $('#specialPriceli').show();
        $('#specialPrice').html('-'+saveTwoDigit(specialTicketNum*orderInfo.singleDiscount)+'元');
        specialPrice = saveTwoDigit(specialTicketNum*orderInfo.singleDiscount);
        if( orderInfo.promoteType == 1 && orderInfo.promoteNum > 0){
            $('.special-tips').html(saveTwoDigit(orderInfo.promoteNum) + '折' + '（' + specialTicketNum+'张）');
        }
    }
    if(orderInfo.passengerNum==0 || orderInfo.singleDiscount<=0 || orderInfo.leftNum<=0){
        $('#specialPriceli').hide();
    }
    $("#ticketPriceContent").data('price',saveTwoDigit(ticketTotalPrice));
    $("#ticketPriceContent").html(saveTwoDigit(ticketTotalPrice) + "元");
    var totalPrice = ticketTotalPrice-specialPrice;
    if(totalPrice > 0){
        loadCoupons(totalPrice,function () {
            confirmPayPrice(totalPrice);
        });
    }else{
        confirmPayPrice(totalPrice);
    }
}

//计算支付价格
function confirmPayPrice(totalPrice) {
    //当支付总额小于等于0时，隐藏优惠券列表
    $("#totalPrice").val(totalPrice);
    if (totalPrice <= 0 || orderInfo.currentPayWay == 2) {
        $("#coupon-li").hide();
    } else {
        $("#coupon-li").show();
    }

    var couponPrice=$("#couponUsePrice").data('price');
    if(couponPrice&&couponPrice!=null){
        if(couponPrice>totalPrice){
            totalPrice=0;
        }else{
            totalPrice=totalPrice-couponPrice;
        }
    }

    if (orderInfo.insuranceType != 0 && orderInfo.insuranceConfirm==1){
        totalPrice = totalPrice + orderInfo.insurancePay;
    }
    orderInfo.confirmPayAmount = totalPrice;
    changeInsurance();
    $('#insuranceCount').html('<i>x</i>' + orderInfo.passengerNum + '份');
    $("#insurancePay").html(saveTwoDigit(orderInfo.insurancePay) + "元" );
    if(orderInfo.currentPayWay==1){
        $('#confirmPay').html("确认支付"+saveTwoDigit(totalPrice)+"元");
    }else{
        $('#confirmPay').html("确认预订");
        $("#ticketPriceContent").html(saveTwoDigit(parseFloat(orderInfo.ticketPrice) * orderInfo.passengerNum) + "元");
        $('#specialPriceli').hide();
    }
}

function loadCoupons(totalPrice,callback) {
    var selectedCoupon = JSON.parse(window.localStorage.getItem('selectedCoupon'));
    if (undefined != selectedCoupon){
        calculateCouponPrice(selectedCoupon,totalPrice)
        callback();
    }else{
        //调用查询优惠券信息接口
        var param = {
            businessType:orderInfo.lineType == '4'?'busline':'travel',
            busId :orderInfo.busIdStr,
            price : $('#ticketPriceContent').data('price'),
            specialFlag : parseFloat(orderInfo.singleDiscount) == 0 ? 0 : 1
        }
        queryHasCoupons(param,function (data) {
            calculateCouponPrice(data,totalPrice);
            callback();
        });
    }
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

        $("#couponUsePrice").html("-"+couponAmount.toFixed(2)+"元");
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

function clickHandleMinus(_this){
    var currentParent=$(_this).parent();
    currentParent.remove();
    orderInfo.passengerNum--;
    $("#couponUsePrice").data("price","0");//选择的是哪个优惠券
    $("#couponUsePrice").removeClass('text-red');
    $("#couponUsePrice").addClass('text-gray');
    if(orderInfo.isLineCooperate==2){
        $("#couponUsePrice").html("合作线路不支持使用优惠券");
    }else{
        $("#couponUsePrice").html("不使用优惠券");
    }
    $("#couponUsePrice").data("couponId","");//选择的是哪个优惠券

    var id=currentParent.data('id');
    var $input=$(".checkBoxClass"+id);
    $input.prop('checked', false);
    changeSelect($input);
    calculateTotalPrice();
}

/*
* 乘客 - 操作
* */
function passengerHandle() {
    // 打开选择乘车人列表
    $('#selectPassengerButton').on(click_event, function() {
        var insuranceConfirm = $('.insurance-container .content').data("action");
        if(orderInfo.insuranceType != 0 || orderInfo.needIdCard === "1"){
            $(".idCard").show();
        }else if(orderInfo.needIdCard === "0"){
            $(".idCard").css("display","none");
        }
        $('#passengerList').popup('modal', function() {
            bindScroll('#passengerList');  //加载滚动条
            if(hasLoad==false){
                queryPassengerRequest();
            }
        });
    });

    //点击内容区，自动选中或取消
    function triggerCheckbox($el) {
        var $input = $el.prev('.name').find('input[type=checkbox]');

        if($input.prop('checked')) {
            $input.prop('checked', false);
        } else {
            $input.prop('checked', true);
        }

        changeSelect($input);
    }

    $('#passengerList .passenger-list li .info').on(click_event, function () {
        triggerCheckbox($(this));
    });


    //选择乘客 - 更新select状态
    $('.passenger-list input[type=checkbox]').on('change', function () {
        changeSelect($(this));
    });

    //确定选择
    $('#selectButton').on(click_event, function() {
        var _html = '';
        var selectPassengerNum=0;
        var insuranceConfirm = $('.insurance-container .content').data("action");
        var isNeedIdCard = false;
        var localIdCardInfo = [];
        $('.passenger-list li').each(function () {
            var el = $(this);
            if(el.data('select')) {
                var idcardHtml='';
                if(orderInfo.needIdCard === "1" || orderInfo.insuranceConfirm==1){
                    idcardHtml= '<p><span class="label">身份证</span>' + el.data('code') + '</p>';
                    if(el.data('code') == "" || el.data('code') == undefined){
                        isNeedIdCard = true;
                    }
                }

                var idCardItem = {
                    id:el.data('id'),
                    idCard:el.data('code'),
                    name:el.data('name'),
                    phone:el.data('phone')
                }
                localIdCardInfo.push(idCardItem);
                _html += '<div class="item" data-id="'+el.data('id')+'" data-idcard="'+el.data('code')+'">' +
                    '<div class="handle-minus"></div>' +
                    '<div class="name">' + el.data('name') + '</div>' +
                    '<div class="info">' +
                    '<p><span class="label">手机号</span>' + el.data('phone') + '</p>' +
                    idcardHtml
                    +
                    '</div>' +
                    '</div>';
                selectPassengerNum++;
            }
        });
        if(isNeedIdCard){
            $.toast("请补充身份证信息");
            return;
        }
        if(selectPassengerNum<=orderInfo.ticketMaxBuyNumber){
            orderInfo.passengerNum = selectPassengerNum;
            sessionStorage.setItem('localIdCardInfo',JSON.stringify(localIdCardInfo));
            $('#passengerWrapper .content').html('').append(_html);
            changeInsurance();
            calculateTotalPrice();
            $('#passengerList').closePopup();

        }else{
            //更新选中的乘客
            $.toast("乘车人数不能超过"+orderInfo.ticketMaxBuyNumber);
            return;
        }

        $(".handle-minus").on(click_event,function(){
            clickHandleMinus(this)
        });
    });

    /*
    * 添加乘客
    * */
    // 打开添加界面
    $('.addPassengerButton').on(click_event, function() {
        $('#addPassengerName').val("");
        $('#addPassengerPhone').val("");
        $('#addPassengerCode').val("");
        $('#addPassenger').popup('push', function() {
            $('#name').val('');
            $('#phone').val('');
            $('#code').val('');
        })
    });

    //取消添加
    $('#cancelAddButton').on(click_event, function () {
        $('#addPassenger').closePopup();
    });
    $('#cancelEditButton').on(click_event, function () {
        $('#editPassenger').closePopup();
    });
    $('#cancelSelectButton').on(click_event, function () {
        $('#passengerList').closePopup();
    });

    //提交添加
    $('#submitAddButton').on(click_event, function() {
        addPassengerRequest();

    });

    /**
     *添加乘客请求
     */
    function  addPassengerRequest(){
        //TODO: 提交添加
        var name = $('#addPassengerName').val();
        var phone = $('#addPassengerPhone').val();
        var code = $('#addPassengerCode').val();

        if(name==""){
            $.toast("姓名不能为空");
            return;
        }
        if(!/^[\u4E00-\u9FA5]{0,10}$/.test(name)){
            $.toast('请输入10位以内中文姓名');
            return;
        }
        if(phone==""){
            $.toast("手机号不能为空");
            return;
        }
        if(!checkTel(phone)){
            $.toast("手机号格式错误");
            return;
        }
        var insuranceConfirm = $('.insurance-container .content').data("action");
        if(orderInfo.needIdCard === "1" || orderInfo.insuranceConfirm==1){
            if(code==""){
                $.toast("身份证号不能为空");
                return;
            }
            if (code&& !new clsIDCard(code).Valid )
            {
                $.toast('请填写正确的身份证');
                return;
            }
        }

        $.post("/bus/passengerContactInfo/addContact",{passengerName:name,mobile:phone,idCardNo:code,token:$.cookie("token")},function(result){
            if(result.code == 0){
                addPassengerCallback(result.data);
                $("#passEmpty").css("display","none");
                $("#passbtn").css("display","block");
            }else{
                $.toast(result.message);
            }
        },'json');

    }

    /**
     *乘车人列表请求
     */
    function queryPassengerRequest(){
        var token=$.cookie('token');
        $.post("/bus/passengerContactInfo/passengerList",{token:$.cookie("token")},function(result){
            if(result.code == 0){
                queryPassengerRequestCallback(result)
                autoSelect();
                hasLoad=true;
            }else{
                $("#passEmpty").css("display","block");
                $("#passbtn").css("display","none");
            }
        },'json');
    }


    function autoSelect(){
        $(".passenger-list li").each(function(){
            var passengerIdArray = [];
            $('#passengerWrapper .content .item').each(function(){
                var passengerItemId=$(this).data('id');
                passengerIdArray.push(passengerItemId);
            })
            if($.inArray($(this).data('id'),passengerIdArray)>=0){
                triggerCheckbox($(this).find('.info'));
            }
        })

    }
    /**
     *查询乘车人列表请求回调
     */
    function queryPassengerRequestCallback(result){
        if(parseInt(result.code)==0){
            $(".passenger-list_ele").html("");
            var passengerItemTemplate=$("#templatePassenger").html();
            var passengerList=result.data;
            $.each(passengerList,function(index,value){
                var passengerItem=passengerItemTemplate.replace(/passengerName/g, value.passengerName).replace(/passengerIdCard/g,value.idCardNo)
                    .replace(/passengerPhone/g,(undefined==value.mobile?'':value.mobile)).replace(/passengerId/g,(undefined==value.id?'':value.id))
                    .replace(/checkBoxClass/g,(undefined==value.id?'checkBoxClass':'checkBoxClass'+value.id));
                if(index==0){
                    passengerItem=passengerItem.replace(/templateClass/g,"sui-border-b");
                }
                $(".passenger-list_ele").append(passengerItem);

                $('input[type=checkbox]').on('change', function () {
                    changeSelect($(this));
                });

                //绑定 - 编辑乘客
                $('.editPassengerButton').on(click_event, function () {
                    editHandle($(this));
                });
            });
        }
    }

    /**
     * 添加乘客后回调
     */
    function addPassengerCallback(data){
        //TODO: 提交添加
        var name = $('#addPassengerName').val();
        var phone = $('#addPassengerPhone').val();
        var code = $('#addPassengerCode').val();
        var $idcard='';
        var insuranceConfirm = $('.insurance-container .content').data("action");
        if(orderInfo.needIdCard === "1" || orderInfo.insuranceConfirm==1){
            $idcard='<p class="idCard"><em>身份证</em>' + data.idCardNo + '</p>';
        }
        //创建标签
        var $strLi = $('<li class="sui-border-b" data-select="true" data-name="' + data.passengerName + '" data-phone="' + data.mobile +'" data-id="' + data.id + '" data-code="' + data.idCardNo + '" ></li>'),
            $strName = $('<div class="name"><input type="checkbox" class="frm-checkbox '+ 'checkBoxClass'+data.id+'"  checked /></div>'),
            $strInfo = $('<div class="info"><h4>' + data.passengerName + '</h4><p><em>手机号</em>' + (undefined==data.mobile?'':data.mobile) + '</p>'+$idcard+'</div>'),
            $strHandle = $('<div class="handle"><i class="icon-edit editPassengerButton"></i></div>');


        //合并标签
        $strLi.append($strName).append($strInfo).append($strHandle);

        //添加到父元素里
        $('#passengerList .passenger-list').append($strLi);

        //绑定 - 更新乘客选择
        $strName.find('input[type=checkbox]').on('change', function () {
            changeSelect($(this));
        });

        //绑定 - 编辑乘客
        $strHandle.find('.editPassengerButton').on(click_event, function () {
            editHandle($(this));
        });

        //绑定 - 点击内容区，自动选中或取消
        $strInfo.on(click_event, function () {
            triggerCheckbox($(this));
        });

        if(_myIScroll) {
            _myIScroll.refresh();   // 刷新滚动条
        }

        $('#addPassenger').closePopup();
    }

    /*
    * 编辑乘客
    * */
    //编辑操作
    function editHandle(el) {
        var $parent = el.parents('li');
        var _name  = $parent.data('name'),
            _phone = $parent.data('phone'),
            _code  = $parent.data('code');
        var _id    = $parent.data('id');
        currentEditPassengerId=_id;
        getPassengerDetailInfo(_id,$parent);
    }

    // 打开编辑界面
    $('.editPassengerButton').on(click_event, function() {
        editHandle($(this));
    });

    //关闭编辑
    $('#submitEditButton').on(click_event, function () {
        editPassenger();
    });

    //乘客人数运算
    $('.operation .icon-minus').on(click_event, function () {
        //减
        var el = $(this);

        if(!el.data('clock')) {
            el.data('clock', true);
            var _v = parseInt(el.next().text());
            if(_v <= orderInfo.ticketMaxBuyNumber) {
                el.siblings('.icon-plus').removeClass('out');
            }
            if(_v == 1) {
                //TODO
                //$.alert('人数至少为1');
            } else {
                el.next().text(_v - 1);
                $("#passengerNumber").attr('data-passengerNum',_v - 1);
                sessionStorage.setItem('passengerNumber',(_v - 1));
                calculateTotalPrice();
                if(el.next().text() == 1) {
                    el.addClass('out');
                }
            }

            el.data('clock', false);
        }
    });

    $('.operation .icon-plus').on(click_event, function () {
        //加
        var el = $(this);

        if(!el.data('clock')) {
            el.data('clock', true);
            var _v = parseInt(el.prev().text());

            if(_v == 1) {
                el.siblings('.icon-minus').removeClass('out');
            }

            if(_v == orderInfo.ticketMaxBuyNumber) {
                // 	 $.alert('人数最多'+orderInfo.ticketMaxBuyNumber+'位');
                //TODO
                //             $.alert('人数最多5位');
            } else {
                el.prev().text(_v + 1);
                $("#passengerNumber").attr('data-passengerNum',_v + 1);
                sessionStorage.setItem('passengerNumber',(_v + 1));
                calculateTotalPrice();
                if(el.prev().text() == orderInfo.ticketMaxBuyNumber) {
                    el.addClass('out');
                }
            }

            el.data('clock', false);
        }
    });
}
/*
   * 更新select状态
   * */
function changeSelect(el) {
    el.parents('li').data('select', el.prop('checked'));
}

/*
* 优惠券 - 操作
* */
$('.coupon-toggle').on(click_event, function() {
    var passengerNum= orderInfo.passengerNum;
    if(passengerNum==0){
        $.toast("请先选择乘车人");
        return;
    }
    var busId = orderInfo.busIdStr;
    var price = $('#ticketPriceContent').data('price');
    var specialFlag = parseFloat(orderInfo.singleDiscount) == 0 ? 0 : 1;
    var businessType = orderInfo.lineType == '4'?businessParam.busline:businessParam.travel;
    window.location = '/coupon/select?businessType='+businessType+'&busId='+busId+'&specialFlag='+specialFlag+'&price='+price;
});
//不选保险
function clearInsurance() {
    var ele = $('#wrapper .content li.active');
    if(!ele.data('choose')){
        $('#wrapper .content li.active').removeClass('active');
    }
    orderInfo.insuranceUnitPrice = 0;
    orderInfo.insuranceType = 0 ;
    orderInfo.insuranceConfirm = 0;
    orderInfo.insuranceId = 0;
    orderInfo.insurancePay = 0;
}
//选择上一次选中的保险
function getLastInsurance() {
    $('#wrapper .content li').each(function () {
        var choose = $(this).data('choose');
        var defaultchoice = $(this).data('defaultchoice');
        if(choose || defaultchoice){
            $(this).data('choose',false);
            chooseInsurance($(this));
        }
    });
}

/**
 *提交订单
 */
function submitOrder(){
    var passengerIdList="";
    var data={};
    var passengerNum=0;
    if(orderInfo.needIdCard == 1){
        var passFlag=true;
        $('#passengerWrapper .content .item').each(function(){
            var passengerItemId=$(this).data('id');
            var idCard=$(this).data('idcard');
            passengerIdList+=passengerItemId+",";
            passengerNum++;
            if((orderInfo.needIdCard ===  '1' || orderInfo.insuranceConfirm==1)&&(idCard==undefined||idCard=="")){
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
        data.passengerContactIds=passengerIdList;
    }else if(orderInfo.needIdCard==0){//不需要乘车人信息
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

    if(orderInfo.needIdCard == 1 && orderInfo.needInsurance == 1){
        data.insuranceId = orderInfo.insuranceId;
        // data.insuranceId='';
    }

    if(orderInfo.currentPayWay==2){
        data.reservationType=1;
    }
    data.insurancePrice = orderInfo.insuranceUnitPrice;
    data.insuranceType = orderInfo.insuranceType;
    data.insurancePay = orderInfo.insurancePay;
    data.insuranceConfirm = orderInfo.insuranceConfirm;
    data.busId=orderInfo.busIdStr;
    data.token=$.cookie("token");
    data.qrcodeId = orderInfo.qrcId;
    data.orderNo="";
    data.remark = $("#remark").val();
    data.specialPrice = parseFloat(orderInfo.singleDiscount) * passengerNum;
    if (data.remark && data.remark.length > 40) {
        $.toast("备注的长度不能超过40");
        return ;
    }
    $.post("/busline/busOrder/initOrder",data,function(result){
        if(result.code == 0){
            var currentOrderNo = result.data;
            if(data.reservationType&&data.reservationType==1){
                window.location.href="/bus/toBusOrderDetail?token="+$.cookie('token')+"&orderNo="+currentOrderNo;
            }else{
                var b = new Base64();
                var url = b.encode("/bus/h5/paymentUnit.html?token="+$.cookie('token')+"&orderNo="+currentOrderNo);

                var couponId=$("#couponUsePrice").data('coupon-id') == undefined ? 0 : $("#couponUsePrice").data('coupon-id');
                var settleType = $('#settleType').val();
                window.location.href='/order/payunit?orderNo='+currentOrderNo+'&settleType='+settleType+'&userCouponId='+couponId+'&url='+url;
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
    $.ajax({
        type: "GET",
        url: "/bus/passengerContactInfo/getPassengerDetailInfo",//添加订单
        data:{'id':id},
        dataType: "json",
        success: function(result){

            if(result!=undefined&&result.code!=undefined&&parseInt(result.code)==0){
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

function editPassenger(){
    var urlStr = '/bus/passengerContactInfo/update';
    var _editName = $('#editPassengerName').val(),
        _phoneName = $('#editPassengerPhone').val(),
        _codeName = $('#editPassengerCode').val();

    if(_editName==""){
        $.toast("姓名不能为空");
        return;
    }
    if(!/^[\u4E00-\u9FA5]{0,10}$/.test(_editName)){
        $.toast('请输入10位以内中文姓名');
        return;
    }

    if(_phoneName==""){
        $.toast("手机号不能为空");
        return;
    }
    if(!checkTel(_phoneName)){
        $.toast("请填写正确的手机号");
        return;
    }
    var insuranceConfirm = $('.insurance-container .content').data("action");
    if(orderInfo.needIdCard === "1" || orderInfo.insuranceConfirm==1){
        if(_codeName==""){
            $.toast("身份证不能为空");
            return;
        }
        var flag = new clsIDCard(_codeName);
        if(!flag.Valid){
            $.toast('请填写正确的身份证');
            return false;
        }
    }

    //current page param
    var dataObj = {
        id: currentEditPassengerId,
        passengerName: _editName,
        mobile: _phoneName,
        idCardNo: _codeName,
        token:$.cookie('token')
    };
    $.ajax({
        type: 'POST',
        url:urlStr,
        data:dataObj,
        dataType:  "json",
        success: function(result){
            if(result&&result.code==0){
                var targetZindex = $('#editPassenger').data('trigger'),
                    _target = $('.passenger-list li').eq(targetZindex);
                var _editName = $('#editPassengerName').val(),
                    _phoneName = $('#editPassengerPhone').val(),
                    _codeName = result.data.idCardNo;

                //更新 - 存储数据
                _target.data('name', _editName)
                    .data('phone', _phoneName)
                    .data('code', result.data.idCardNo);

                //更新 - 展示数据
                _target.find('.info h4').text(_editName);
                _target.find('.info p:first').html('</h4><p><em>手机号</em>' + _phoneName);
                var insuranceConfirm = $('.insurance-container .content').data("action");
                if(orderInfo.needIdCard === "1" || orderInfo.insuranceConfirm==1 || orderInfo.insuranceType != 0){
                    _target.find('.info p:last').html('</h4><p><em>身份证</em>' + _codeName);
                }
                $('#editPassenger').closePopup();
            }else{
                $.alert((result&&result.message) || "未知错误");
            }
        }
    });
}


// 选择支付方式
$('.payment-way li').on(click_event, function() {
	var _this = $(this);
    orderInfo.currentPayWay=parseInt($(this).attr('value'));
    //1-微信支付 2-上车支付（无保险）
    if(orderInfo.currentPayWay==1){
        $(".notPayLater").show();
        // $(".insurance-row").show()
        if (orderInfo.needInsurance==1){
        	$('.insurance-container').show();
        	_this.find('input').prop('checked', true);
        }else{
        	_this.find('input').prop('checked', true);
        }
        
        getLastInsurance();
    }else{
        clearInsurance();
        changeInsurance();
        //计算支付价格
        calculateTotalPrice();
        
        $('.insurance-container').hide();
        _this.find('input').prop('checked', true);

        $(".notPayLater").hide();
        $("#couponUsePrice").data("price","0");//选择的是哪个优惠券
        $("#couponUsePrice").removeClass('text-red');
        $("#couponUsePrice").addClass('text-gray');
        if(orderInfo.isLineCooperate==2){
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

// $(".handle-minus").on(click_event,function(){
//     clickHandleMinus(this)
// });


$("#confirmPay").on(click_event,function(){
    localStorage.removeItem('selectedCoupon');
    sessionStorage.removeItem('localIdCardInfo');
    sessionStorage.removeItem('passengerNumber');
    submitOrder();
});
//计算保费
function getInsurancePrice() {
    var re = saveTwoDigit(orderInfo.passengerNum * parseFloat(orderInfo.insuranceUnitPrice));
    return re;
}
//初始化保险信息
function initInsurance(){
    if(orderInfo.needInsurance == '1'){
        $('#wrapper .content li').each(function (index) {
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
                }else{
                    //不选中
                    clearInsurance();
                    $(this).data('choose',false);
                    /*$(this).removeClass('active');
                    orderInfo.insuranceUnitPrice = 0;
                    orderInfo.insuranceType = 0 ;
                    orderInfo.insuranceConfirm = 0;
                    orderInfo.insuranceId = 0;
                    orderInfo.insurancePay = 0;*/
                }
            }
            $(this).find('span.count').html(orderInfo.passengerNum + '份');
        });
        $('#insurancePrice').html(orderInfo.insurancePay + '元');
    }else{
        orderInfo.insuranceConfirm = 0;
        $('.insurance-container').hide();
    }
    calculateTotalPrice();
}
//保险价格变化
function changeInsurance() {
    orderInfo.insurancePay = saveTwoDigit(parseFloat(orderInfo.passengerNum * orderInfo.insuranceUnitPrice));
    $('#insurancePrice').html(orderInfo.insurancePay + '元');
    $('#wrapper .content li').each(function () {
        var el = $(this);
        $(el).find('span.count').html(orderInfo.passengerNum + '份')
    });
}

function initPage(){
    if(orderInfo.timeWarnFlag == '2'){
        $('#timeWarnTips').attr("style","display:block");
    }

    if(orderInfo.allowOnLineBook == '1'){
        $('#onLineCarPay').show();
    }

    if(orderInfo.insuranceType !=0 || orderInfo.needIdCard){
        $(".idCard").show();
    }else if(orderInfo.needIdCard === "0" ){
        $(".idCard").css("display","black");
    }
    $('.listWrapper').each(function() {
        $(this).css('height', ($(window).height() - 74) + 'px');
    });

    setWrapperHeight();
    initInsurance();
}

function isSelectCoupon(){
        var localIdCardInfo = JSON.parse(sessionStorage.getItem('localIdCardInfo'));
        if(undefined != localIdCardInfo && null != localIdCardInfo &&  localIdCardInfo.length > 0){
            orderInfo.passengerNum = localIdCardInfo.length;
            var  _html = '';
            localIdCardInfo.forEach(function (item,index) {
                var idcardHtml='';
                if(item.idCard != '' && null != item.idCard){
                    idcardHtml= '<p><span class="label">身份证</span>' + item.idCard + '</p>';
                }
                _html += '<div class="item" data-id="'+item.id+'" data-idcard="'+item.idCard+'">' +
                    '<div class="handle-minus"></div>' +
                    '<div class="name">' + item.name + '</div>' +
                    '<div class="info">' +
                    '<p><span class="label">手机号</span>' + item.name + '</p>' +
                    idcardHtml
                    +
                    '</div>' +
                    '</div>';
            })
            $('#passengerWrapper .content').html('').append(_html);

            $(".handle-minus").on(click_event,function(){
                clickHandleMinus(this)
            });
        }
    calculateTotalPrice();
}

$(function() {
    isSelectCoupon();
    initPage();
    passengerHandle();

    //规则
    $.ruleInit();

    insuranceIsNeed();

});


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