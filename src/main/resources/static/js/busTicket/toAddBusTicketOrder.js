var maxAllowCount=parseInt($('#ticketMaxBuyNumber').val());
var hasLoad=false;
// 绑定滚动条
var _myIScroll;
var currentEditPassengerId;
var click_event = isAndroid() ? 'tap' : 'click';
//景点门票列表
var attList = [];

var swiper;//滚动条
//存放要添加人员信息的父元素
var $personContent ;

var bindScroll = function(el) {
    if(_myIScroll) {
        _myIScroll.destroy();
        _myIScroll = null;
    }
    setTimeout(function() {
        _myIScroll = new IScroll(el + ' .listWrapper');
        // 这句不能少，否则超出屏幕不能滚动。
        if(_myIScroll) _myIScroll.refresh();
    }, 300);
}

//-- -------保险v2.0start-------- --
var orderInfo = {
    insurancePay:0, //保费
    insuranceUnitPrice:0, //保费单价
    passengerNum: 0,////乘车人数
    insuranceConfirm: 1,//是否购买保险 1-购买 0-不购买
    insuranceType: 0,//保险类型 大于0的保险才是有效的保险类型 作用类似于id
    sellPrice:0,//车票价格单价
    paySell:0,//车票价格总价
    servicePrice:0,//服务费单价
    payService:0,//服务费总价
    totalPrice:0,//订单总价格
    needInsurance:$('#needInsurance').val(),
    insuranceId:0,//保险id
    passengerList:[],
    totalTicketAmount:0,
    idStr:'',
    freeTicketAmount:0
};
var insuranceScroll = new IScroll('#wrapper', {
    scrollX: true,
    scrollY: false,
    mouseWheel: true,
    eventPassthrough: true,
});

$('#wrapper .content li').on(click_event,function () {
    var choose = $(this).data('choose');
    if(choose){
        $(this).data('choose',false);
        clearInsurance();
    }else{
        $(this).addClass('active').siblings().removeClass('active');
        $(this).data('choose',true).siblings().data('choose',false);
        // insuranceScroll.scrollToElement($(this)[0], 500, false, false, IScroll.utils.ease.circular);
        orderInfo.insuranceUnitPrice = $(this).data('unit');
        orderInfo.insuranceType = $(this).data('type');
        orderInfo.insuranceConfirm = 1;
        orderInfo.insuranceId = $(this).data('id');
        orderInfo.insurancePay = getInsurancePrice();
    }
    changeShowPrice();
    //    TODO 计算价格
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

//计算保费
function getInsurancePrice() {
    var re = saveTwoDigit(orderInfo.passengerNum * parseFloat(orderInfo.insuranceUnitPrice));
    return re;
}
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
//选择上一次选中的保险 汽车票无上车支付
function getLastInsurance() {
    $('#wrapper .content li').each(function () {
        var choose = $(this).data('choose');
        var defaultchoice = $(this).data('defaultchoice');
        if(choose || defaultchoice){
            $(this).data('choose',false);
            $(this).click();
        }
    });
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
                    /*orderInfo.insuranceUnitPrice = 0;
                    orderInfo.insuranceType = 0 ;
                    orderInfo.insuranceConfirm = 0;
                    orderInfo.insuranceId = 0;*/
                }
            }
            $(this).find('span.count').html(orderInfo.passengerNum + '份');
        });
        $('#insurancePrice').html(orderInfo.insurancePay + '元');
    }else{
        orderInfo.insuranceConfirm = 0;
        $('.insurance-container').hide();
    }
    changeShowPrice();
}

//保险价格变化
function changeInsurance() {
    orderInfo.insurancePay = saveTwoDigit(parseFloat(orderInfo.passengerNum * orderInfo.insuranceUnitPrice));
    $('#insurancePrice').html(orderInfo.insurancePay + '元');
    $('#wrapper .content li').each(function () {
        var el = $(this);
        $(el).find('span.count').html(orderInfo.passengerNum + '份')
    });
    $('#payInsurance').html('¥ '+ orderInfo.insuranceUnitPrice +' x '+ orderInfo.passengerNum +'人')
}
//-- -------保险v2.0end-------- --

// $('.listWrapper').each(function () {
//     $(this).css('height', ($(window).height() - 74) + 'px');
// });

var checkCollPerson = function(collName,collPhone,collCardId){
    if(undefined == collName || collName==''){
        $.toast('取票人姓名不能为空');
        return false;
    }
    if(undefined == collPhone || collPhone==''){
        $.toast('取票人手机号码不能为空');
        return false;
    }

    if(!(/^1\d{10}$/.test(collPhone))){
        $.toast('请填写正确的取票人手机号');
        return false;
    }


    if(undefined == collCardId || collCardId==''){
        $.toast('取票人身份证号码不能为空');
        return false;
    }else{
        var isCard = new clsIDCard(collCardId);
        if(!isCard.Valid){
            $.toast('请填写正确的取票人身份证号码');
            return false;
        }
    }

    return true;
}

var lock = false;//false是可点击
$("#confirmPay").on(click_event,function(){
    if(lock){
        return;
    }
    lock = true;
    var flag=true;
    //计算总价
    calBusTicket ();
    var priceParams = JSON.parse(sessionStorage.getItem('priceParams'));
    if("" != priceParams || priceParams.length > 0){
        if(orderInfo.passengerList.length <= 0){
            $.toast("请先添加乘车人");
            flag = false;
            lock = false;
            return false;
        }
    } else{
        if(orderInfo.idStr==""){
            $.toast("请先选择乘车人");
            lock = false;
            return false;
        }else {
            if(orderInfo.idStr.substr(orderInfo.idStr.length-1)== ','){
                orderInfo.idStr = orderInfo.idStr.substr(0,orderInfo.idStr.length-1);
            }
        }
    }

    var carryingChildrenNumbers =  $('#carryingChildrenNumbers').val();
    if(carryingChildrenNumbers > orderInfo.freeTicketAmount){
        $.toast("免费儿童个数不能超过"+orderInfo.freeTicketAmount+"人数");
        flag = false;
        lock = false;
        return false;
    }

    var collName = $('#collName').val();
    var collPhone = $('#collPhone').val();
    var collCardId = $('#collCardId').val();
    flag = checkCollPerson(collName,collPhone,collCardId);

    if(flag==false){
        lock = false;
        return;
    }

    var sessionAttInfo = JSON.parse(sessionStorage.getItem('sessionAttInfo'));
    var data={
        busId:$('#baseBusIdStr').val(),
        passengerContactIds:orderInfo.idStr,
        insuranceConfirm: orderInfo.insuranceConfirm,
        insuranceType: orderInfo.insuranceType,
        insurancePay : orderInfo.insurancePay,//总价
        insurancePrice : orderInfo.insuranceUnitPrice,//单价
        insuranceId : orderInfo.insuranceId,//保险id
        "contactName": collName,
        "contactMobile": collPhone,
        "contactCard": collCardId,
        spotInfo:sessionAttInfo,
        passengerList:orderInfo.passengerList,
        carryingChildrenNumbers:$('#carryingChildrenNumbers').val()
    };
    var urlStr =  SERVER_URL_PREFIX +'/busTicket/addOrder';
    var succ_event = function (data) {
        $.hideLoading();
        if(data.code==0){
            var data = data.data;
            var orderNo = data.orderNo;
            //var settleType = data.settleMode;
            var b = new Base64();
            var url = b.encode("/busTicketOrder/toOrderDetail?orderNo="+orderNo+'&autoShow=1');
            setTimeout(function() {
                //-100
                window.location.href='/order/payunit?orderNo='+orderNo+'&userCouponId='+0+'&url='+url+'&sameSale=busTicket';
            }, 10);
        }else if(data.code==88891){
            $.alert("当前班次余票不足,请重新购票",function(){
                window.location='/busTicketIndex';
            });
        }
        else if(data.code==88892){
            $.alert("当前班次余票不足",function(){
                window.location='/busTicketIndex';
            });
        }else if(data.code==88893){
            $.alert(data.message,function(){
                window.location='/busTicketIndex';
            });
        }else  if(data.code==88894){
            $.alert("乘车人"+data.message+"已购票,请重新选择");
        }else if(data.code == 88895){
            $.alert("门票预定失败，请重试");
        }
        else {
            $.alert(data.message);
        }
        lock = false;
    }
    var err_event = function (e) {
        $.hideLoading();
    }
    $.showLoading();
    $.ajaxService({
            url:urlStr,
            data:{data:JSON.stringify(data),token:$.cookie('token')},
            // contentType:'application/json',
            // traditional: true,
            success:succ_event,
            error:err_event
        })
})


//计算多票种时的总价
function calBusTicket() {
    var priceParams = JSON.parse(sessionStorage.getItem('priceParams'));
    var passengerList = [];
    var totalTicketAmount = 0;
    var freeTicketAmount = 0;
    var totalPrice = 0;
    var idStr='';
    if("" == priceParams || priceParams.length <= 0){
        $("#passengerWrapper .handle-minus").each(function(){
            var parentTarget=$(this).parent();
            var code=parentTarget.data('code');
            var phone=parentTarget.data('phone');
            if(code==''||code==undefined){
                $.toast('乘车人身份证信息不能为空');
                return false;
            }
            // if(phone==''||phone==undefined){
            //     $.toast('乘车人手机号信息不能为空');
            //     return false;
            // }
            idStr+=parentTarget.data('id')+",";
        })

        totalTicketAmount = $("#passengerWrapper .handle-minus").length;
        freeTicketAmount = totalTicketAmount;
        var sellPrice = $('#sellPrice').val();
        totalPrice = totalPrice + (totalTicketAmount * parseFloat(sellPrice*100))/100;
    }
    else {
        priceParams.forEach(function (item,index) {
            if(item.certType == 0){
                var itemNumbId = '_number'+item.itemType;
                var passengerItem = {
                    "itemType": item.itemType,
                    "passengerIds": "",
                    "numbers": parseInt($('#'+itemNumbId).val()),
                    sellPrice:item.price,
                    ticketName:item.itemName
                }
                if(parseInt($('#'+itemNumbId).val()) > 0){
                    passengerList.push(passengerItem);
                    totalPrice = totalPrice + parseFloat(passengerItem.numbers * (passengerItem.sellPrice*100)/100);
                    totalTicketAmount = totalTicketAmount + passengerItem.numbers;
                    if(item.ifFreeTicket == 1){
                        freeTicketAmount = freeTicketAmount + passengerItem.numbers;
                    }
                }

            }else{
                var pssContentId = '_passengerContent'+ item.itemType;
                $("#"+pssContentId+"  .handle-minus").each(function(){
                    var parentTarget=$(this).parent();
                    var code=parentTarget.data('code');
                    var phone=parentTarget.data('phone');
                    if(code==''||code==undefined){
                        $.toast('乘车人身份证信息不能为空');
                        return false;
                    }
                    if(phone==''||phone==undefined){
                        $.toast('乘车人手机号信息不能为空');
                        return false;
                    }
                    idStr+=parentTarget.data('id')+",";
                })

                var amount = $("#passengerPanle .handle-minus").length;

                var passengerItem = {
                    "itemType": item.itemType,
                    "passengerIds": idStr,
                    "numbers": amount,
                    sellPrice:item.price,
                    ticketName:item.itemName
                }
                if(idStr!=""){
                    passengerList.push(passengerItem);
                    totalPrice = totalPrice + parseFloat(passengerItem.numbers * (passengerItem.sellPrice*100)/100);
                    totalTicketAmount = totalTicketAmount + passengerItem.numbers;
                    if(item.ifFreeTicket == 1){
                        freeTicketAmount = freeTicketAmount + passengerItem.numbers;
                    }
                }
            }
        })

    }
    orderInfo.idStr = idStr;
    orderInfo.passengerList = passengerList;
    orderInfo.totalTicketAmount = totalTicketAmount;
    orderInfo.freeTicketAmount = freeTicketAmount;
    orderInfo.paySell = totalPrice;
}


// 选择支付方式
$('.payment-way li').off(click_event).on(click_event, function() {
    $(this).find('input').prop('checked', true);
})

function changeShowPrice(){
    //保险费
    changeInsurance();
    /*景点门票费用*/
    var attPrice = $('#attTotalPrice').val();
    orderInfo.servicePrice = parseFloat($('#servicePrice').val());
    orderInfo.payService = parseFloat((orderInfo.servicePrice*100) * orderInfo.totalTicketAmount).toFixed(2);
    orderInfo.totalPrice = parseFloat(orderInfo.paySell + (orderInfo.payService/100) + orderInfo.insurancePay+parseFloat(attPrice)).toFixed(2);

    $("#confirmPay").html("确认支付"+orderInfo.totalPrice+"元");
    $("#totalTicketPrice").html(orderInfo.paySell+"元");
    $("#totalServicePrice").html((orderInfo.payService/100)+"元");
    $("#payTotal").html('￥'+ orderInfo.sellPrice +'x' +orderInfo.passengerNum+"人");
}


//实名制情况下添加人员信息到对应的类型下面
function loadPersonList(selectPersonList) {
    var personHtml = '';
    selectPersonList.forEach(function (person,index) {
        if('undefined' == person.phone){
            person.phone ='';
        }
        personHtml += '<div class="item" data-id="'+person.id+'" data-code="'+person.code+'"  data-phone="'+person.phone+'">' +
            '<div class="handle-minus"></div>' +
            '<div class="name">' + person.name + '</div>' +
            '<div class="info">' +
            '<p><span class="label">手机号</span>' + person.phone + '</p>' +
            '<p><span class="label">身份证</span>' + person.code + '</p>' +
            '</div>' +
            '</div>';
    })
    return personHtml;
}

function loadAttPersonList(selectPersonList,itemCode) {
    var personHtml = '';
    selectPersonList.forEach(function (person,index) {
        personHtml += '<div class="item" data-name="'+person.name+'" data-id="'+person.id+'"' +
            ' data-code="'+person.code+'"  data-phone="'+person.phone+'">' +
            '<div class="handle-minus" data-item-code="'+itemCode+'"></div>' +
            // '<div class="name">' + person.name + '</div>' +
            '<div class="info">' +
            '<p><span class="label">'+person.name+'</span></p>' +
            '<p><span class="label">身份证</span>' + person.code + '</p>' +
            '</div>' +
            '</div>';
    })
    return personHtml;
}

//查询人员列表
function getPassengerList(callback) {
    $.post('/bus/passengerContactInfo/passengerList',{},function(res){
        if(res.code==0){
            var list = res.data;
            if(callback){
                callback(list);
            }
        }
    },'json');
}

function drawPassengerList(list,$el) {

    if(list && list.length > 0){
        $('.not-data').hide();
        $.each(list,function(index,item){
            if('undefined' == typeof (item.mobile) || undefined == item.mobile){
                item.mobile ='';
            }
            var template='<div class="sui-border-b classDataId swiper-slide" data-select="false" data-showidcard="showIdCardNo" data-id="passengerId" data-name="passengerName" data-phone="passengerMobile" data-code="passengerCode">' +
                '<div class="name"><input type="checkbox" class="frm-checkbox checkBoxClassId" /></div>' +
                '<div class="info"><h4>passengerName</h4><p><em>手机号</em>passengerMobile</p><p><em>身份证</em>passengerCode</p></div>' +
                '<div class="handle"><i class="icon-edit editPassengerButton"></i></div></div>';
            template=template.replace("classDataId", "classData"+item.id);
            template=template.replace("showIdCardNo", item.showIdCardNo);
            template=template.replace("checkBoxClassId", "checkBoxClass"+item.id);
            template=template.replace(/\passengerId/g, item.id);
            template=template.replace(/\passengerName/g, item.passengerName);
            template=template.replace(/\passengerMobile/g, item.mobile);
            template=template.replace(/\passengerCode/g, item.idCardNo);
            $el.append(template);
        })
    }else{
        // 无乘车人 添加乘车人
        var template= '<div class="not-data" style="background-image: url(/res/images/common/icon_no_rider.png);">您当前还未添加乘车人</div>';
        $el.append(template);
    }

}

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

function editPassenger(){
    var urlStr = '/bus/passengerContactInfo/update';
    var _editName = $('#editPassengerName').val(),
        _phoneName = $('#editPassengerPhone').val(),
        _codeName = $('#editPassengerCode').val();
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
                    _target = $('#passengerListWrapper .swiper-slide').eq(targetZindex);
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
                _target.find('.info p:last').html('</h4><p><em>身份证</em>' + _codeName);
            }else{
                $.alert((result&&result.message) || "未知错误");
            }
        }
    });
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

/*
* 编辑乘客
* */
//编辑操作
function editHandle(el) {
    var $parent = el.parents('.swiper-slide');
    var _name  = $parent.data('name'),
        _phone = $parent.data('phone'),
        _code  = $parent.data('code');
    var _id    = $parent.data('id');
    currentEditPassengerId=_id;
    getPassengerDetailInfo(_id,$parent);
}
/*
* 更新select状态
* */
function changeSelect(el) {
    el.parents('.swiper-slide').data('select', el.prop('checked'));
}

var isCopy = false;
//确定选择
$('#selectButton').on(click_event, function() {
    //存储用户选择的人员信息
    var selectPersonList = [];
    orderInfo.passengerNum = 0;
    $('#passengerListWrapper .swiper-slide ').each(function () {
        var el = $(this);
        if(el.data('select')) {
            var personInf = {
                id:el.data('id'),
                code:el.data('code'),
                name:el.data('name'),
                phone:el.data('phone')
            }
            selectPersonList.push(personInf);
            orderInfo.passengerNum++;
        }
    });

        if(orderInfo.passengerNum>maxAllowCount){
            $.toast('购票人数总计不能超过'+maxAllowCount+'人');
            return;
        }
        var personHtml = loadPersonList(selectPersonList);

        //在第一次添加汽车票人员信息时会执行
            /*
        * 此判断只是在用户第一次选择购买汽车票的人员信息时候复制人员信息到第一个景点门票作为默认信息
        * 汽车票和景点门票人员信息没有关联关系
        * */
            if(attList.length > 0){
                if(isCopy == false){
                    firstAddGoodsInfo(selectPersonList);
                }
            }
    $('#passengerList').setPopupData({data:personHtml,passengerNum:orderInfo.passengerNum});
    $('#passengerList').closePopup();
});

$('#btnTicketPerson').on(click_event, function() {
    var tempPersonList = [];
    var psersonNumber = 0;
    $('#ticketPersonList .passenger-list li').each(function () {
        var el = $(this);
        if(el.data('select')) {
            var personInf = {
                id:el.data('id'),
                code:el.data('code'),
                name:el.data('name'),
                phone:el.data('phone')
            }
            tempPersonList.push(personInf);
            psersonNumber++;
        }
    });
        //更新选中的需要购票的人员
        var itemCode = $($personContent).data('item-code');
        var psersonHtml = loadAttPersonList(tempPersonList,itemCode);
        $($personContent).html('').append(psersonHtml);
         var totalAmount = 0;
        $('#personTickets .person-type').forEach(function (el,index) {
            var totalNum = $(el).find('.item').length;
            var priceSell = parseFloat($(el).data('price-sell'))*100;
            totalAmount += parseFloat(priceSell) * (totalNum);
        })
        $('#attOrderInfo .total-val').html((totalAmount/100)+'元');
        $('#totalAttAmount').val((totalAmount/100));
        removeAttPerson();
        $('#ticketPersonList').closePopup();
});

var firstAddGoodsInfo = function (selectPersonList) {
    var productCode = attList[0].productCode;
    loadGoodsDetail(productCode,function (data) {
        isCopy = true;
        drawGoodDetail(data,function () {
            var ticketItem = data.skuInfos[0];
            var priceSell = ticketItem.priceSell;
            var skuItem = data.skuItems[0];
            var ticketName = ticketItem.itemValue;
            var itemCode = skuItem.itemAttrs[0].itemCode;
            if(data.orderCert == 1){
                var personHtml  = loadAttPersonList(selectPersonList,itemCode);
                $('#personTickets .person-body').find('.person-type').first().find('.content').html(personHtml);
                removeAttPerson();
                $('#personTickets').show();
            }else{
                var itemCodeNumId = itemCode+'_number';
                $('#'+itemCodeNumId).val(orderInfo.passengerNum);
                var itemCodeId = itemCode+'_item';
                $('#'+itemCodeId).find('.number-val span').html(orderInfo.passengerNum);
                $('#personNumber').show();
            }

            //景点选中 并且计算总价

            var attInfo = {
                productCode:productCode,
                productName:data.productName,
                orderDate:$('#departDate').val(),
                orderCert:data.orderCert,
                InfoList:[{
                    itemId:skuItem.itemId,
                    itemIds:ticketItem.itemIds,
                    itemCode:itemCode,
                    ticketName:ticketName,
                    skuCode:ticketItem.skuCode,
                    priceSell:ticketItem.priceSell,
                    totalNum:orderInfo.passengerNum,
                    passengerList:selectPersonList,
                }]
            }

            sessionStorage.setItem('sessionAttInfo',JSON.stringify(attInfo));
            var itemTicketInfo = '<div class="item-person-info" data-product-code="'+attInfo.productCode+'">' +
                '            <div class="person-info">' +
                '                <span class="person">'+ticketName+'</span><span class="person-price">¥'+priceSell+'</span>  x '+orderInfo.passengerNum+' 张' +
                '            </div></div>' +
            '            <div class="person-btn">' +
            '                <div class="btn-edit" data-product-code="'+productCode+'">修改</div>' +
            '            </div>' ;

            var attPanle = $('#attractionsList .att-body').find('.att-panle').first();
            $(attPanle).find('.item-person-panle').html('').append(itemTicketInfo);
            $(attPanle).find('.btn-buy').hide();
            $(attPanle).find('.active').show();
            var attTotalPrice = parseFloat(priceSell*orderInfo.passengerNum);
            $('#attOrderInfo .total-val').html(attTotalPrice+'元');
            $('#attOrderInfo #totalAttAmount').val(attTotalPrice);
            $('.att-total-price').html(attTotalPrice+'元');
            $('#attTotalPrice').val(attTotalPrice);
            changeShowPrice();
            btnEdit_clickEvent();

        });
    });
}

var btnEdit_clickEvent = function () {
    $('.btn-edit').off('click').on('click',function () {
        var productCode = $(this).data('product-code');
        loadGoodsDetail(productCode,function (res) {
            var data = res;
            drawGoodDetail(data,function () {
                getCollPersonInfo();
                var sessionAttInfo = JSON.parse(sessionStorage.getItem('sessionAttInfo'));
                $('#attOrderInfo .date-val').html('').html(sessionAttInfo.orderDate);
                $('#attOrderInfo #orderDate').val(sessionAttInfo.orderDate);
                var totalAmount = 0;
                if(sessionAttInfo.productCode == productCode){
                    //实名制添加人员
                    if(sessionAttInfo.orderCert == 1){
                        var skuItemList = sessionAttInfo.InfoList;
                        skuItemList.forEach(function (item,index) {
                            totalAmount += parseFloat(item.priceSell) * (item.passengerList.length);
                            var personHtml = loadAttPersonList(item.passengerList,item.itemCode);
                            var personType = $('#personTickets .person-body').find('.person-type').get(index);
                            $(personType).find('.content').html(personHtml);
                        })
                        removeAttPerson();
                        $('#attOrderInfo .total-val').html(parseFloat(totalAmount)+'元');
                        $('#attOrderInfo #totalAttAmount').val(totalAmount);
                    }else {
                        //非实名制添加对应的数量
                    }
                }
                $('#attOrderInfo').popup();

            })
        })
    })
}

function getCollPersonInfo(){
    //取票人信息
    var collName = $('#collName').val();
    var collPhone = $('#collPhone').val();
    var collCardId = $('#collCardId').val();
    $('#attOrderInfo .person-name').html('').html(collName);
    $('#attOrderInfo .person-phone').html('').html(collPhone);
    $('#attOrderInfo .person-cardId').html('').html(collCardId);
}

function removeAttPerson() {
    $("#attOrderInfo .handle-minus").off('touchend').on('touchend',function (e) {
        e.stopPropagation();
        var itemCode = $(this).data('item-code');
        var personTypeId = itemCode+'_type';
        $(this).parent().remove();
        var priceSell = $("#"+personTypeId).data('priceSell');
        var tempAmount = parseFloat($('#totalAttAmount').val());
        $('#attOrderInfo .total-val').html(parseFloat(tempAmount-priceSell)+'元');
        $('#attOrderInfo #totalAttAmount').val(parseFloat(tempAmount-priceSell));
    })
}

$('#selectCanle').on(click_event,function () {
    $('#passengerList').closePopup();
})
$('#btnTicketCancle').on(click_event,function () {
    $('#ticketPersonList').closePopup();
})



/*
* 乘客 - 操作
* */
function passengerHandle() {
    // 打开选择乘车人列表 配置票种
    $('#selectPassengerButton').on(click_event, function() {
        if(hasLoad==true){
            $('.not-data').hide();
            $('#passengerList').popup('modal', function() {
                console.log('打开222')
                setTimeout(function () {
                    swiper = new Swiper('#passengerListContainer',{
                        speed: 300,
                        slidesPerView: 'auto',//设置slider容器能够同时显示的slides数量， 'auto'则自动根据slides的宽度来设定数量。
                        freeMode: false,//滑动模式为普通模式
                        direction: 'vertical', //垂直切换选项
                        scrollbar: {
                            el: '.swiper-scrollbar',//滚动条
                        },
                    });
                },100);
            },function (data) {
                console.log('回调222');
                var price = parseFloat($('#sellPrice').val());
                orderInfo.paySell = (orderInfo.passengerNum * (price*100))/100;
                $('#passengerWrapper .content').html('').html(data.data);
                //绑定事件
                removePassengerHandle();
                calBusTicket();
                changeShowPrice();
            });
        }else{
            hasLoad=true;
            getPassengerList(function (list) {
                $("#passengerListWrapper").html("");
                drawPassengerList(list,$('#passengerListWrapper'));
                $('#passengerList').popup('modal', function() {
                    console.log('打开111')
                    setTimeout(function () {
                        console.log(11111 + $('#passengerList').attr('style'));
                        swiper = new Swiper('#passengerListContainer',{
                            speed: 300,
                            slidesPerView: 'auto',//设置slider容器能够同时显示的slides数量， 'auto'则自动根据slides的宽度来设定数量。
                            freeMode: false,//滑动模式为普通模式
                            direction: 'vertical', //垂直切换选项
                            scrollbar: {
                                el: '.swiper-scrollbar',//滚动条
                            },
                        });
                    },100);
                },function (data) {
                    console.log('回调111')
                    var price = parseFloat($('#sellPrice').val());
                    orderInfo.paySell = (orderInfo.passengerNum * (price*100))/100;
                    $('#passengerWrapper .content').html('').html(data.data);
                    calBusTicket();
                    changeShowPrice();
                    removePassengerHandle();
                });

                //选择乘客 - 更新select状态
                $('#passengerListWrapper input[type=checkbox]').on('change', function () {
                    changeSelect($(this));
                });

                $('#passengerList .editPassengerButton').on('tap', function () {
                    $('#passengerList').closePopup();
                    editHandle($(this));
                });

            })
        }

    });

    /*
       * 添加乘客
     * */
    // 打开添加界面
    $('#passengerList .addPassengerButton').off('tap').on('tap', function() {
        $('#passengerList').closePopup();
        $('#addPassenger').popup('push', function() {
            $('#addPassengerName').val('');
            $('#addPassengerPhone').val('');
            $('#addPassengerCode').val('');
        })
    });


    $('#passengerListWrapper .swiper-slide .info').on(click_event, function () {
        triggerCheckbox($(this));
    });

    //取消添加
    $('#cancelAddButton').off(click_event).on(click_event, function () {
        $('#addPassenger').closePopup();
    });

    //提交添加
    $('#submitAddButton').on(click_event, function() {
        //TODO: 提交添加
        var name = $('#addPassengerName').val();
        var phone = $('#addPassengerPhone').val();
        var code = $('#addPassengerCode').val();


        if(name == ''||phone==''||code==''){
            $.toast('乘车人信息不完整请补充');
            lock =false;
            return;
        }
        if(!(/^1\d{10}$/.test(phone))){
            $.toast('请填写正确的手机号');
            lock =false;
            return;
        }
        //判断身份证是否合法
        code = $.trim(code);
        var flag = new clsIDCard(code);
        if(!flag.Valid){
            $.toast('请填写正确的身份证');
            lock =false;
            return false;
        }
        $.post("/bus/passengerContactInfo/addContact",{passengerName:name,mobile:phone,idCardNo:code,token:$.cookie("token")},function(result){
            if(result.code == 0){
                //创建标签
                var $strLi = $('<div class="sui-border-b classData swiper-slide '+result.data.id+'" data-id="'+result.data.id+'" data-showidcard="'+code+'" data-select="false" data-name="' + name + '" data-phone="' + phone + '" data-code="' + result.data.idCardNo + '"></div>'),
                    $strName = $('<div class="name"><input type="checkbox" class="frm-checkbox checkBoxClass'+result.data.id+'" /></div>'),
                    $strInfo = $('<div class="info"><h4>' + name + '</h4><p><em>手机号</em>' + phone + '</p><p><em>身份证</em>' + result.data.idCardNo + '</p></div>'),
                    $strHandle = $('<div class="handle"><i class="icon-edit editPassengerButton"></i></div>');
                //合并标签
                $strLi.append($strName).append($strInfo).append($strHandle);

                //添加到父元素里
                $('#passengerListWrapper').append($strLi);
                // $('#ticketPersonList .passenger-list').append($strLi);
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

                $('#addPassenger').closePopup();
            }else{
                $.toast(result.message);
            }
            lock =false;
        },'json');

    });

    //关闭编辑
    $('#submitEditButton').on(click_event, function () {
        $('#editPassenger').closePopup(function () {
            editPassenger();
        });
    });

    //乘客人数运算
    $('.operation .icon-minus').on(click_event, function () {
        //减
        var el = $(this);

        if(!el.data('clock')) {
            el.data('clock', true);

            var _v = parseInt(el.next().text());

            if(_v == 5) {
                el.siblings('.icon-plus').removeClass('out');
            }

            if(_v == 1) {
                //TODO
//                    $.toast('人数至少为1');
            } else {
                el.next().text(_v - 1);

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

            if(_v == 5) {
                //TODO
//                    $.toast('人数最多5位');
            } else {
                el.prev().text(_v + 1);

                if(el.prev().text() == 5) {
                    el.addClass('out');
                }
            }

            el.data('clock', false);
        }
    });
}

function removePassengerHandle(){
    $("#passengerWrapper .handle-minus").off('touchend').on('touchend',function () {
        $(this).parent().remove();
        var id=$(this).parent().data('id');
        var $input=$(".checkBoxClass"+id);
        $input.prop('checked', false);
        changeSelect($input);
        orderInfo.passengerNum--;
        var price = parseFloat($('#sellPrice').val());
        orderInfo.paySell = (orderInfo.passengerNum * (price*100))/100;
        changeShowPrice();
    })
}

function initPage() {
    if(parseInt($('#ticketSaleStatus').val())==0){
        $.alert("购票系统已停售",function(){
            window.location='/busTicketIndex';
        });
        return;
    }

    initInsurance();
}

/*
*黄山门票部分 开始
* */

$('#attOrderInfo .att-readme').off(click_event).on(click_event,function (e) {
    e.stopPropagation();
    var productCode = $('#attOrderInfo #productCode').val();
    $('#attReadInfo .btn-toBuy').data('product-code',productCode);
    var orderIntroHtml = '';
    attList.forEach(function (item,index) {
        if(item.productCode == productCode){
            orderIntroHtml = item.orderIntro;
        }
    })
    $('#attReadInfo .content').html('').html(orderIntroHtml);
    $('#attOrderInfo').closePopup();
    $('#attReadInfo').popup();
})

$('.introClose').on(click_event,function () {
    $('#attIntroduce').closePopup();
})

$('.readInfoClose').on(click_event,function () {
    $('#attReadInfo').closePopup();
})

$('.btn-order-canle').off(click_event).on(click_event,function () {
    $('#attOrderInfo').closePopup();
})
$('.btn-order-ok').off(click_event).on(click_event,function () {
    var attInfo = {
        productCode:$('#attOrderInfo #productCode').val(),
        productName:$('#attOrderInfo #productName').val(),
        orderDate:$('#attOrderInfo #orderDate').val(),
        orderCert:$('#attOrderInfo #orderCert').val(),
        InfoList:[]
    }
    var totalAmount = 0;

    var proId = attInfo.productCode+'_panle';
    var productId = attInfo.productCode+'_att';
    var $itemTicketInfo= $('<div class="item-person-info" data-product-code="'+attInfo.productCode+'"></div>') ;
    var tempTicketPersonHtml = '';
        if(attInfo.orderCert == 1){
            var personTypeNumber = $('#personTickets .person-type').find('.item').length;
            if(personTypeNumber > 0){
                $('#personTickets .person-type').forEach(function (el,index) {
                    var itemId = $(el).data('item-id');
                    var itemIds = $(el).data('item-ids');
                    var skuCode = $(el).data('sku-code');
                    var itemCode = $(el).data('item-code');
                    var priceSell = $(el).data('price-sell');
                    var ticketName = $(el).data('ticketName');
                    var totalNum = $(el).find('.item').length;
                    totalAmount += parseFloat(priceSell) * (totalNum);
                    var item = {
                        itemId:itemId,
                        itemIds:itemIds,
                        ticketName:ticketName,
                        itemCode:itemCode,
                        skuCode:skuCode,
                        priceSell:priceSell,
                        totalNum:totalNum,
                        passengerList:[]
                    }
                    tempTicketPersonHtml += '<div class="person-info">' +
                        '                <span class="person">'+ticketName+'</span><span class="person-price">¥'+priceSell+'</span>  x '+totalNum+' 张，' +
                        '            </div>' ;

                    $(el).find('.item').forEach(function (child,i) {
                        var personInfo = {
                            id:$(child).data('id'),
                            code:$(child).data('code'),
                            name:$(child).data('name'),
                            phone:$(child).data('phone')
                        }
                        item.passengerList.push(personInfo);
                    })

                    attInfo.InfoList.push(item);
                })

                $itemTicketInfo.append(tempTicketPersonHtml);
                var btnEditHtml = '            <div class="person-btn">' +
                    '                <div class="btn-edit" data-product-code="'+attInfo.productCode+'">修改</div>' +
                    '            </div>' ;

                $("#"+proId).html('').append($itemTicketInfo).append(btnEditHtml);
                $("#"+productId).find('.active').show();
                $("#"+productId+' .btn-buy').hide();
                btnEdit_clickEvent();

            }else{
            $("#"+productId+' .btn-buy').show();
            $("#"+productId).find('.active').hide();
            $("#"+proId).html('');
            sessionStorage.removeItem('sessionAttInfo');
            }
        }
        else{
            var totalNumber = 0;
            $('#personNumber .person-item').forEach(function (el) {
                var itemCode = $(el).data('item-code');
                var itemCodeId = itemCode+'_item';
                var itemCodeNumber = parseInt($('#'+itemCodeId).val());
                totalNumber = totalNumber + itemCodeNumber;
            })

            if(totalNumber > 0){
                $('#personNumber .person-item').forEach(function (el) {
                    var itemCode = $(el).data('item-code');
                    var itemCodeId = itemCode+'_item';
                    var itemCodeNumber = parseInt($('#'+itemCodeId).val());
                    var itemId = $(el).data('item-id');
                    var itemIds = $(el).data('item-ids');
                    var skuCode = $(el).data('sku-code');
                    var priceSell = $(el).data('price-sell');
                    var ticketName = $(el).data('ticketName');
                    totalAmount += parseFloat(priceSell) * (itemCodeNumber);
                    var item = {
                        itemId:itemId,
                        itemIds:itemIds,
                        ticketName:ticketName,
                        itemCode:itemCode,
                        skuCode:skuCode,
                        priceSell:priceSell,
                        totalNum:itemCodeNumber,
                        passengerList:[]
                    }

                    attInfo.InfoList.push(item);
                    tempTicketPersonHtml += '<div class="person-info">' +
                        '                <span class="person">'+ticketName+'</span><span class="person-price">¥'+priceSell+'</span>  x '+itemCodeNumber+' 张，' +
                        '            </div>' ;
                })


                $itemTicketInfo.append(tempTicketPersonHtml);
                var btnEditHtml = '            <div class="person-btn">' +
                    '                <div class="btn-edit" data-product-code="'+attInfo.productCode+'">修改</div>' +
                    '            </div>' ;

                $("#"+proId).html('').append($itemTicketInfo).append(btnEditHtml);
                $("#"+productId).find('.active').show();
                $("#"+productId+' .btn-buy').hide();
                btnEdit_clickEvent();

            }else{
                $("#"+productId+' .btn-buy').show();
                $("#"+productId).find('.active').hide();
                $("#"+proId).html('');
                sessionStorage.removeItem('sessionAttInfo');
            }
        }
        sessionStorage.removeItem('sessionAttInfo');
        sessionStorage.setItem('sessionAttInfo',JSON.stringify(attInfo));
    $('#attOrderInfo .total-val').html(totalAmount+'元');
    $('#attOrderInfo #totalAttAmount').val(totalAmount);
    $('.att-total-price').html(totalAmount+'元');
    $('#attTotalPrice').val(totalAmount);
    changeShowPrice();

    $('#attOrderInfo').closePopup();
})

$('#btn-date').on(click_event, function() {
    var productCode = $(this).data('product-code');
    var queryDate = $('#departDate').val();
    var param = {
        productCode:productCode,
        queryDate :queryDate
    }
    getDatePopupResult(param,function (dayList) {
        if(dayList.length > 0){
            var dayArr = [];
                dayList.forEach(function (dayItem,index) {
                var day = {
                    date: dayItem.orderDate,
                    comment: dayItem.skuInfoList[0].priceSell,
                    state: 'select'
                };
                    dayArr.push(day);
            })
            initDatepicker(dayArr);

            $('#selectDate').popup('plate', function () {

            }, function (data) {

            });
        }

    })
    // $('#attOrderInfo').closePopup();

}).backtrack({
    cancel: '#selectDate .sui-popup-mask'
});

$('#attIntroduce .btn-toBuy').on(click_event,function () {
    $('#attIntroduce').closePopup();
    var productCode = $(this).data('product-code');
    loadGoodsDetail(productCode,function (data) {
        drawGoodDetail(data,function () {
            getCollPersonInfo();
            $('#attOrderInfo').popup();
        });

    })

})

$('#attReadInfo .btn-toBuy').on(click_event,function () {
    $('#attReadInfo').closePopup();
    var productCode = $(this).data('product-code');
    loadGoodsDetail(productCode,function (data) {
        drawGoodDetail(data,function () {
            getCollPersonInfo();
            $('#attOrderInfo').popup();
        });

    })

})

$('#cleanName').on(click_event,function () {
    $('#collName').val('');
})

$('#cleanPhone').on(click_event,function () {
    $('#collPhone').val('');
})

$('#cleanCardId').on(click_event,function () {
    $('#collCardId').val('');
})

function initDatepicker(dayArr) {
    //填充日历
    var departDate = $('#departDate').val();
    $('.datepicker-wrapper').datePicker({
        dateBase: departDate,
        multiple:false,
        before:true,
        after:1,
        gather: dayArr,
        selectCallback: function (data) {
            var selectDate = data.selectData[0].date;
            var dateStr = selectDate.year+'-'+selectDate.month+'-'+selectDate.day;
            $('#attOrderInfo .date-val').html("").html(dateStr);
            $('#attOrderInfo #orderDate').val(dateStr);
            $('#selectDate').closePopup();
        },
        switchMonth:switchMonth
    });
}

function switchMonth(data,picker) {
    var productCode = $('#attOrderInfo #productCode').val();
    var queryDate = data;
    var param = {
        productCode:productCode,
        queryDate :queryDate
    }

    getDatePopupResult(param,function (dayList) {
        if(dayList.length > 0){
            var dayArr = [];
            dayList.forEach(function (dayItem,index) {
                var day = {
                    date: dayItem.orderDate,
                    comment: dayItem.skuInfoList[0].priceSell,
                    state: 'select'
                };
                dayArr.push(day);
            })
            if (picker!=null) {
                picker.reset({
                    gather: dayArr,
                    after:1,
                });
                picker.full(param.queryDate);
            }
        }
    })
}

function getDatePopupResult(param,callback) {
    $.showLoading();
    var succ_event = function (res) {
        $.hideLoading();
        var data = res.data;
        if(res.code == 1){
            $.alert(res.msg);
            return;
        }

        if(callback && "" != data){
            callback(data)
        }else {
            $.alert('暂不支持购买');
            return;
        }

    }

    var err_event = function (e) {
        if(callback){
            callback({code:1})
        }
        $.hideLoading();
        $.alert(e.message);
    }

    var url = SERVER_URL_PREFIX + '/spot/getGoodsSku';
    var param = {
        "token": $.cookie('token'),
        "productCode":param.productCode,
        "queryDate":param.queryDate,
    }
    $.ajaxService({
        url:url,
        data:param,
        success:succ_event,
        error:err_event,
    })
}

function initAttList() {
    $.showLoading();
    var succ_event = function (res) {
        $.hideLoading();
        if(res.code == 0){
            if("" != res.data){
                attList = res.data;
                if(attList.length > 0 ){
                    var att_item = '';
                    attList.forEach(function (item,index) {
                        att_item += '      <div class="att-panle">  <div id="'+item.productCode+'_att" class="att-item">' +
                            '            <div class="active" style="display: none"></div>' +
                            '            <div class="item-banner" data-store-code="'+item.storeCode+'" data-product-code="'+item.productCode+'">' +
                            '                <img src="'+item.thumb+'">' +
                            '            </div>' +
                            '            <div class="item-content">' +
                            '                <div class="item-name-price">' +
                            '                    <div class="item-name">'+item.productName+'</div>' +
                            '                    <div class="item-sell-price">' +
                            '                        ¥<em>'+item.minPrice+'</em>起' +
                            '                    </div>' +
                            '                </div>' +
                            '                <div class="item-instructions">'+item.orderDate+'入园，截止至'+item.expireDate+'有效</div>' +
                            '                <div class="item-others">' +
                            '                    <div class="item-others-left">' +
                            '                        <div class="item-tag">不可退</div>' +
                            '                        <div class="item-readme" data-product-code="'+item.productCode+'">' +
                            '                            <span></span> 购票须知<i></i>' +
                            '                        </div>' +
                            '                    </div>' +
                            '                    <div class="item-others-right">' +
                            '                        <div class="btn-buy" data-product-code="'+item.productCode+'">预定</div>' +
                            '                    </div>' +
                            '                </div>' +
                            '            </div></div>' +
                            '<div id="'+item.productCode+'_panle" class="item-person-panle" data-product-code="'+item.productCode+'"></div></div>' ;
                    })
                    $('.att-body').append(att_item);
                    // if(attList.length > 3){
                    //     $('.att-body').append('<div class="load-more">查看更多门票</div>')
                    // }
                    attClick_event();
                    $('#attractionsList').show();
                }
            }else {
                // $.alert('未查询到数据');
                return;
            }
        }else {
            // $.alert(res.message);
        }

    }

    var url = SERVER_URL_PREFIX + '/spot/getGoodsList';
    var param = {
        "token": $.cookie('token'),
        "lineId": $('#lineId').val(),
        "queryDate": $('#departDate').val()
    }
    
    $.ajaxService({
        url:url,
        data:param,
        success:succ_event,
        // error:err_event,
    })
}

function attClick_event() {
    $('.item-banner').on(click_event,function (e) {
        e.stopPropagation();
        var storeCode = $(this).data('store-code');
        var productCode = $(this).data('product-code');
        $('#attIntroduce .btn-toBuy').data('product-code',productCode);
        initAttInfo(storeCode,function (data) {
            if(data.code == 0){
                $('#attIntroduce').popup();
            }else{
                $.toast('获取景点信息失败');
            }

        })

    })
    
    $('.item-readme').on(click_event,function (e) {
        e.stopPropagation();
        var productCode = $(this).data('product-code');
        var orderIntroHtml = '';
        attList.forEach(function (item,index) {
            if(item.productCode == productCode){
                orderIntroHtml = item.orderIntro;
            }
        })
        $('#attReadInfo .btn-toBuy').data('product-code',productCode);
        $('#attReadInfo .content').html('').html(orderIntroHtml);
        $('#attReadInfo').popup();
    })
    
    $('.btn-buy').on(click_event,function () {
        var productCode = $(this).data('product-code');

        loadGoodsDetail(productCode,function (data) {
            drawGoodDetail(data,function () {
                getCollPersonInfo();
                $('#attOrderInfo').popup();
            });

        })

    })

}

function initAttInfo(storeCode,callback) {
    $.showLoading();
    var url = SERVER_URL_PREFIX + '/spot/getSpotInfo' ;
    var param = {
        'storeCode':storeCode
    }
    
    function succ_event(res) {
        $.hideLoading();
        if(res.code == 0){
            if(callback){
                callback({code:0});
            }
            var data = res.data;
            $('#attIntroduce .content').html('').html(data.storeIntro);
        }else{
            $.alert(res.message);
            return;
        }
    }
    
    function err_event(e) {
        if(callback){
            callback({code:1});
        }
        $.hideLoading();
        $.alert(e);
    }

    $.ajaxService({
        url:url,
        data:param,
        success:succ_event,
        error:err_event,
    })

}

function loadGoodsDetail(productCode,callback) {
    $.showLoading();
    var succ_event = function (res) {
        $.hideLoading();
        if(res.code == 1){
            $.alert(res.msg);
            return;
        }
        var data = res.data;
        if(callback && "" != data){
            if(undefined != data.skuItems && undefined != data.skuInfos){
                callback(data)
            }else {
                $.toast('暂不支持购买');
                return;
            }
        }else {
            $.toast('暂不支持购买');
            return;
        }
    }

    var err_event = function (e) {
        if(callback){
            callback({code:1})
        }
        $.hideLoading();
        $.alert(e.message);
    }

    var url = SERVER_URL_PREFIX + '/spot/getGoodsDetail';
    var param = {
        "token": $.cookie('token'),
        "productCode":productCode,
        "queryDate":$('#departDate').val(),
    }
    $.ajaxService({
        url:url,
        data:param,
        success:succ_event,
        error:err_event,
    })
}

function drawGoodDetail(data,callback) {
    $('#attOrderInfo .att-name').html('').html(data.productName);
    $('#attOrderInfo #btn-date').data('product-code',data.productCode);
    $('#attOrderInfo .date-val').html('').html($('#departDate').val());
    $('#attOrderInfo #productCode').val(data.productCode);
    $('#attOrderInfo #productName').val(data.productName);
    $('#attOrderInfo #orderDate').val($('#departDate').val());
    $('#attOrderInfo #orderCert').val(data.orderCert);
    var skuItems = data.skuItems;
    var skuInfors = data.skuInfos;
    //是否需要实名认证
    if(data.orderCert == 1){
        $('#personTickets').show();
        skuItems.forEach(function (item,index) {
            if(item.itemType == 1){
                var childList = item.itemAttrs;
                if(childList.length > 0){
                    var tickeTypeHtml = '';
                    childList.forEach(function (child,num) {
                        tickeTypeHtml += '    <div id="'+child.itemCode+'_type" class="person-type" data-item-id="'+child.itemId+'" data-item-ids="'+skuInfors[num].itemIds+'"  ' +
                            '               data-price-sell="'+skuInfors[num].priceSell+'" data-sku-code="'+skuInfors[num].skuCode+'" ' +
                            '               data-item-code="'+child.itemCode+'" data-ticket-name="'+child.ticketName+'">' +
                            '                <div class="head">' +
                            '                    <h4>'+child.ticketName+'</h4>' +
                            '                            <div class="personPrice">' +
                            '                                <span class="priceTitle">单价：</span>' +
                            '                                <span class="priceSell">'+skuInfors[num].priceSell+'元/人</span>' +
                            '                            </div>'+
                            '                    <div class="handle-plus">' +
                            '                        <i class="icon-person-plus"  data-item-id="'+child.itemId+'" ' +
                            '                       data-price-sell="'+skuInfors[num].priceSell+'" data-item-code="'+child.itemCode+'"></i>' +
                            '                    </div>' +
                            '                </div>' +
                            '                <div id="'+child.itemCode+'_content" class="content" data-item-code="'+child.itemCode+'" data-price-sell="'+skuInfors[num].priceSell+'">' +
                            '                </div>' +
                            '            </div>'
                    })
                    $('#personTickets .person-body').html('').append(tickeTypeHtml);
                    addPersonClick_evnet();
                }
            }
        })
    }
    else{
        $('#personNumber').show();
        skuItems.forEach(function (item,index) {
            if(item.itemType == 1){
                var childList = item.itemAttrs;
                if(childList.length > 0){
                    var tickeTypeHtml = '';
                    childList.forEach(function (child,num) {
                        tickeTypeHtml += ' <div id="'+child.itemCode+'_item" class="person-item" data-item-id="'+child.itemId+'" data-item-ids="'+skuInfors[num].itemIds+'" ' +
                            '               data-price-sell="'+skuInfors[num].priceSell+'" data-sku-code="'+skuInfors[num].skuCode+'" ' +
                            '               data-item-code="'+child.itemCode+'" data-name="'+child.ticketName+'">' +
                            '                    <div class="item-type">'+child.ticketName+'</div>' +
                            '                    <div class="item-number">' +
                            '                        <div class="reduce-number" ' +
                            '                              data-price-sell="'+skuInfors[num].priceSell+'" ' +
                            '                           data-item-code="'+child.itemCode+'"></div>' +
                            '                        <div class="number-str">' +
                            '                            <div class="number-val">' +
                            '                                <span>0</span><input id="'+child.itemCode+'_number" type="hidden" value="0">' +
                            '                               </div></div>' +
                            '                        <div class="add-number" ' +
                            '                               data-price-sell="'+skuInfors[num].priceSell+'" ' +
                            '                           data-item-code="'+child.itemCode+'"></div>' +
                            '                    </div></div>';

                    })
                    $('#personNumber .content').html('').append(tickeTypeHtml);
                    numberClick_evnet();
                }
            }
        })
    }
    callback(data)
}

var numberClick_evnet = function () {
    $('#personNumber .reduce-number').off(click_event).on(click_event,function () {
           var itemCodeId = $(this).data('item-code')+'_number';
           var personNumber = parseFloat($('#'+itemCodeId).val());
            personNumber = personNumber - 1;
        var totalAmount = personNumber * priceSell;
        $('#attOrderInfo .total-val').html((totalAmount/100)+'元');
        $('#totalAttAmount').val((totalAmount/100));

        var priceSell = parseFloat($(this).data('price-sell')) * 100;
        var totalAmount = personNumber * priceSell;
        $('#attOrderInfo .total-val').html((totalAmount/100)+'元');
        $('#totalAttAmount').val((totalAmount/100));
    })

    $('#personNumber .add-number').off(click_event).on(click_event,function () {
        var itemCodeId = $(this).data('item-code')+'_number';
        var personNumber = parseInt($('#'+itemCodeId).val());
        personNumber = personNumber + 1;
        var priceSell = parseFloat($(this).data('price-sell')) * 100;
        var totalAmount = personNumber * priceSell;
        $('#attOrderInfo .total-val').html((totalAmount/100)+'元');
        $('#totalAttAmount').val((totalAmount/100));
    })
}

var addPersonClick_evnet = function () {
    $('.icon-person-plus').on(click_event,function () {
        //获取最近的父元素
        var itemCode = $(this).data('item-code');
        var itemCodeId = itemCode+'_content';
        getPassengerList(function (list) {
            $("#ticketPersonList .passenger-list").html("");
            drawPassengerList(list,$('#ticketPersonList .passenger-list'));
            $('#ticketPersonList').popup('modal', function() {
                console.log('打开333')
            });
            //选择乘客 - 更新select状态
            $('#passengerListWrapper input[type=checkbox]').on('change', function () {
                changeSelect($(this));
            });

            $('#ticketPersonList .addPassengerButton').off('tap').on('tap', function() {
                $('#ticketPersonList').closePopup();
                $('#addPassenger').popup('push', function() {
                    $('#addPassengerName').val('');
                    $('#addPassengerPhone').val('');
                    $('#addPassengerCode').val('');
                })
            });

            $('#ticketPersonList .editPassengerButton').on('tap', function () {
                $('#ticketPersonList').closePopup();
                editHandle($(this));
            });
        })
    })

}

/*
* 黄山门票 结束
* */

function initPassengerType() {
    var priceParams = JSON.parse(sessionStorage.getItem('priceParams'));
    if(undefined == priceParams || "" == priceParams || priceParams.length <= 0){
        $('#passengerWrapper').show();
    }else {
        var pasTypeHtml = '';
        priceParams.forEach(function (item,index) {
            if(item.certType == 0){
                pasTypeHtml += '<div class="person-item">' +
                    '                        <div class="item-type">'+item.itemName+'<span class="item-price">'+item.price+'元/人</span>' +
                    // '                       <span class="item-tips">（最多'+maxAllowCount+'位）</span>' +
                    '                       </div>' +
                    '                        <div class="item-number" id="_item'+item.itemType+'">' +
                    '                            <div class="reduce-number"' +
                    '                           data-price="'+item.price+'" data-type="'+item.itemType+'"></div>' +
                    '                            <div class="number-str">' +
                    '                                <div class="number-val">' +
                    '                                    <span>0</span><input id="_number'+item.itemType+'" type="hidden" value="0">' +
                    '                               <input id="_totalPrice'+item.itemType+'" type="hidden" value="0">' +
                    '                                </div>' +
                    '                            </div>' +
                    '                            <div class="add-number" data-price="'+item.price+'" data-type="'+item.itemType+'"></div>' +
                    '                        </div>' +
                    '                    </div>';
            }else{
                pasTypeHtml += '    <div class="ticketType">' +
                    '        <div class="head sui-border-b">' +
                    '            <div class="item-title">'+item.itemName+'<span class="item-price">'+item.price+'元/人</span>' +
                    // '               <span class="item-tips">（最多'+maxAllowCount+'位）</span>' +
                    '            </div>' +
                    '            <div class="handle-plus">' +
                    '                <i class="icon-plus" data-price="'+item.price+'" data-type="'+item.itemType+'">添加</i>' +
                    '            </div>' +
                    '        </div>' +
                    '        <div id="_passengerContent'+item.itemType+'" class="content">' +
                    '        </div>' +
                    '    </div>';
            }

        })
        $('#passengerPanle .content').html('').append(pasTypeHtml);
        $('#passengerPanle').show();
        passengerClick_evnet();
    }
}

function  removeTicketPerson() {
    $("#passengerPanle .handle-minus").off('touchend').on('touchend',function () {
        $(this).parent().remove();
        var id=$(this).parent().data('id');
        var $input=$(".checkBoxClass"+id);
        $input.prop('checked', false);
        calBusTicket();
        changeSelect($input);
        changeShowPrice();
    })
}

var passengerClick_evnet = function () {
    // 打开选择乘车人列表 无配置票种
    $('#passengerPanle .icon-plus').on(click_event, function() {
        var type = $(this).data('type');
        var price = parseFloat($(this).data('price'));
        var contentId = '_passengerContent'+type;
        if(hasLoad){
            $('.not-data').hide();
            $('#passengerList').popup('modal', function(data) {
                setTimeout(function () {
                    swiper = new Swiper('#passengerListContainer',{
                        speed: 300,
                        slidesPerView: 'auto',//设置slider容器能够同时显示的slides数量， 'auto'则自动根据slides的宽度来设定数量。
                        freeMode: false,//滑动模式为普通模式
                        direction: 'vertical', //垂直切换选项
                        scrollbar: {
                            el: '.swiper-scrollbar',//滚动条
                        },
                    });
                },100);
            },function (data) {
                console.log('回调444')
                calBusTicket();
                if(parseInt(maxAllowCount) - parseInt(orderInfo.totalTicketAmount) >= parseInt(data.passengerNum)) {
                    $('#'+contentId).html('').html(data.data);
                    calBusTicket();
                    changeShowPrice();
                    removeTicketPerson();
                }else {
                    $.toast(" 购票人数总计不能超过" + maxAllowCount + "张");
                    return;
                }
            });
        }else {
            hasLoad = true;
            getPassengerList(function (list) {
                $("#passengerListWrapper").html("");
                drawPassengerList(list,$('#passengerListWrapper'));
                $('#passengerList').popup('modal', function(data) {
                    console.log('打开5555')
                    setTimeout(function () {
                        swiper = new Swiper('#passengerListContainer',{
                            speed: 300,
                            slidesPerView: 'auto',//设置slider容器能够同时显示的slides数量， 'auto'则自动根据slides的宽度来设定数量。
                            freeMode: false,//滑动模式为普通模式
                            direction: 'vertical', //垂直切换选项
                            scrollbar: {
                                el: '.swiper-scrollbar',//滚动条
                            },
                        });
                    },100);
                },function (data) {
                    console.log('回调555')
                    calBusTicket();
                    if(parseInt(maxAllowCount) - parseInt(orderInfo.totalTicketAmount) >= parseInt(data.passengerNum)) {
                        $('#'+contentId).html('').html(data.data);
                        calBusTicket();
                        changeShowPrice();
                        removeTicketPerson();
                    }else {
                        $.toast(" 购票人数总计不能超过" + maxAllowCount + "张");
                        return;
                    }
                });

                //选择乘客 - 更新select状态 TODo 是否要改
                // $('.passenger-list input[type=checkbox]').on('change', function () {
                $('#passengerListWrapper input[type=checkbox]').on('change', function () {
                    changeSelect($(this));
                });

                $('#passengerList .editPassengerButton').on('tap', function () {
                    $('#passengerList').closePopup();
                    editHandle($(this));
                });

            })
        }
    });


    $('#passengerPanle .reduce-number').off(click_event).on(click_event,function () {
        var itemCodeId = '_number'+$(this).data('type');
        var personNumber = parseFloat($('#'+itemCodeId).val());
        if(personNumber == 0)return;
        personNumber = personNumber - 1;
        $('#'+itemCodeId).val(personNumber);
        var itemId ='_item'+$(this).data('type');
        $('#'+itemId).find('.number-val span').html(personNumber);
        var _totalPrice ='_totalPrice'+$(this).data('type');
        var price = $(this).data('price');
        $('#'+_totalPrice).val(personNumber * price);
        orderInfo.paySell = ((orderInfo.paySell*100) - (1 * price*100))/100;
        calBusTicket();
        changeShowPrice();

    })

    $('#passengerPanle .add-number').off(click_event).on(click_event,function () {
        var itemCodeId = '_number'+$(this).data('type');
        var personNumber = parseInt($('#'+itemCodeId).val());
        calBusTicket();
        if(parseInt(orderInfo.totalTicketAmount) >= maxAllowCount){
            $.toast(' 购票人数总计不能超过'+maxAllowCount+'人');
            return;
        }
        personNumber = personNumber + 1;
        $('#'+itemCodeId).val(personNumber);
        var itemId ='_item'+$(this).data('type');
        $('#'+itemId).find('.number-val span').html(personNumber);
        //计算此票种类型的总价
        var _totalPrice ='_totalPrice'+$(this).data('type');
        var price = $(this).data('price');
        $('#'+_totalPrice).val(personNumber * price);
        //计算票总价
        orderInfo.paySell = ((orderInfo.paySell*100) + (1 * price*100))/100;
        calBusTicket();
        changeShowPrice();
    })


}

var childrenNumberClick_evnet = function () {
    $('#carryingChildren .reduce-number').off(click_event).on(click_event,function () {
        var personNumber = parseInt($('#carryingChildrenNumbers').val());
        if(personNumber == 0)return;
        personNumber = personNumber - 1;
        $('#carryingChildren').find('.number-val span').html(personNumber);
        $('#carryingChildrenNumbers').val(personNumber);
    })

    $('#carryingChildren .add-number').off(click_event).on(click_event,function () {
        var personNumber = parseInt($('#carryingChildrenNumbers').val());
        calBusTicket();
        if(personNumber >= orderInfo.freeTicketAmount){
            $.toast("免费儿童个数不能超过"+orderInfo.freeTicketAmount+"人");
            return;
        }
        personNumber = personNumber + 1;
        $('#carryingChildren').find('.number-val span').html(personNumber);
        $('#carryingChildrenNumbers').val(personNumber);
    })
}


$(function() {
    initPage();
    setWrapperHeight();
    passengerHandle();
    initAttList();
    initPassengerType();
    childrenNumberClick_evnet();
    $.ruleInit();

    //返回键
    back();
});

function back() {
    if (window.history && window.history.pushState) {
        var href = window.location.href;
        var level = -1;

        history.pushState({page: 1}, 'page', href);

        //点击返回键
        $(window).on('popstate', function() {
            if(level == -1){
                var departPid = $('#departPid').val();
                var arrivePid = $('#arrivePid').val();
                var departStation = $('#departStation').val();
                var arriveStation = $('#arriveStation').val();
                var departDate = $('#departDate').val();
                var href = '/busTicket/queryLineList?departPid='//
                    + departPid + '&arrivePid=' + arrivePid + '&departStation='//
                    + departStation +'&arriveStation=' + arriveStation + '&departDate=' + departDate;
                window.location = href;
            }else{
                history.go(level);
            }
        });

        //弹窗层，返回0
        $('#selectPassengerButton, .coupon-toggle, .insurance-toggle, .ticket-rule').on('click.back', function () {
            level = 0;
        });

        //关闭弹窗层，返回-1
        $('#selectButton, #closeCoupon, #closeInsurance').on('click.back', function () {
            level = -1;
        });
    }
}


//===========






