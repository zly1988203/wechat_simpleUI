$('.warm-prompt .ticket-rule').on('click',function(){
    $('#ticketRule').popup();
    // $('.popup-overlay').show().css('opacity','.3');
    // $('body').css('position','fixed');
})

$('#ticketRule .close-popup').on('click',function(){
    $('#ticketRule').closePopup();
    // $('.popup-overlay').show().css('opacity','.3');
    // $('body').css('position','fixed');
})

$('.name-clear').on('click',function(){
    $('.info input[name=passenger-name]').val('');
})

$('.tel-clear').on('click',function(){
    $('.info input[name=passenger-tel]').val('');
})

$('.id-clear').on('click',function(){
    $('.info input[name=passenger-id]').val('');
})

$('#collName').on('blur', function() {
    (document.body.scrollTop = document.body.scrollTop)
})

$('#collPhone').on('blur', function() {
    (document.body.scrollTop = document.body.scrollTop)
})

$('#collCardId').on('blur', function() {
    (document.body.scrollTop = document.body.scrollTop)
})

var busTicketInfo = {
    orderDesc:'',
    busId:'',
    totalBusNum:'',
    totalTicketAmount:0,
    freeTicketAmount:0
}
$('.confirm').on('click',function(){
    var amount = parseInt($('#carryingChildrenNumbers').val());
    if(busTicketInfo.freeTicketAmount < parseInt(amount)){
        $.toast("免费儿童个数不能超过"+busTicketInfo.freeTicketAmount+"人");
        return;
    }

    var collName = $('#collName').val();
    var collPhone = $('#collPhone').val();
    var collCardId = $('#collCardId').val();

    if(undefined == collName || collName==''){
        $.toast('取票人姓名不能为空');
        return;
    }
    if(undefined == collPhone || collPhone==''){
        $.toast('取票人手机号码不能为空');
        return;
    }

    if(!(/^1\d{10}$/.test(collPhone))){
        $.toast('请填写正确的取票人手机号');
        return;
    }


    if(undefined == collCardId || collCardId==''){
        $.toast('取票人身份证号码不能为空');
        return;
    }else{
        var flag = new clsIDCard(collCardId);
        if(!flag.Valid){
            $.toast('请填写正确的取票人身份证号码');
            return;
        }
    }

    var sessionAttData = JSON.parse(sessionStorage.getItem('sessionAttData'));
    var attBaseInfo = JSON.parse(sessionStorage.getItem('attBaseInfo'));
    var data={
        storeCode:attBaseInfo.storeCode,
        storeName:attBaseInfo.storeName,
        "contactName":collName,
        "contactMobile": collPhone,
        "contactCard": collCardId,
        "busId": busTicketInfo.busId,
        "totalBusNum": busTicketInfo.totalBusNum,
        orderDesc:busTicketInfo.orderDesc,
        spotInfoList:sessionAttData,
        "passengers":"",
        passengerList:busTicketInfo.passengerList,
        carryingChildrenNumbers:$('#carryingChildrenNumbers').val()
    };

    var urlStr =  SERVER_URL_PREFIX +'/multipBusiness/ticket/addOrder';
    var succ_event = function (data) {
        $.hideLoading();
        if(data.code==0){
            var data = data.data;
            var orderNo = data.orderNo;
            var settleType = data.settleModel;
            var b = new Base64();
            var url = b.encode("/passenger/busTicketOrder.html?1=1");
            setTimeout(function() {
                window.location.href='/order/payunit?orderNo='+orderNo+'&settleType='+settleType+'&userCouponId='+0+'&url='+url;
            }, 10);
        }  else {
            var attBaseInfo = JSON.parse(sessionStorage.getItem('attBaseInfo'));
            $.alert(data.message,function(){
                window.location.href = '/sameSale/toAttMainPage?storeCode='+attBaseInfo.storeCode+'&storeName='+attBaseInfo.storeName;
            });
        }
    }
    var err_event = function (e) {
        $.hideLoading();
    }
    $.showLoading();
    $.ajaxService({
        url:urlStr,
        data:{data:JSON.stringify(data),token:$.cookie('token')},
        success:succ_event,
        error:err_event
    })
})

function initPage() {
    var sessionAttData = JSON.parse(sessionStorage.getItem('sessionAttData'));
    if(undefined != sessionAttData && sessionAttData.length > 0){
        var ticketHtml = "";
        sessionAttData.forEach(function (item,index) {
            var tempTicketHtml = ' <div class="ticket">' +
                '                <div class="pre">' +
                '                    <div class="ticket-name">'+item.productName+'</div>' +
                '                    <div class="ticket-prcie price">￥<span>'+item.totalAmount+'元</span></div>' +
                '                </div>' +
                '                <div class="in-time"><span>'+item.orderDate+'</span>入园</div>' +
                '                <div class="ticket-num">';
            busTicketInfo.orderDesc += "["+item.productCode +"]"+item.productName;
            var tempDiv = '</div></div>';
                var itemHtml = '';
                item.InfoList.forEach(function (child,i) {
                    itemHtml +=  '<span class="adult">'+child.ticketName+'￥<span class="price">'+child.priceSell+'</span>x<span class="num">'+child.totalNum+'</span>张 </span>' ;
                })
            ticketHtml += tempTicketHtml+itemHtml+tempDiv;
        })
        $('#attTicketList').html('').append(ticketHtml);
        $('#attTicketList').show();
    }
    var busTicketData = JSON.parse(sessionStorage.getItem('busTicketData'));
    if(undefined != busTicketData){
        busTicketInfo.totalTicketAmount = busTicketData.totalTicketAmount;
        busTicketInfo.freeTicketAmount = busTicketData.freeTicketAmount;
        if(busTicketData.totalPriceBus > 0) {
            busTicketInfo.busId = busTicketData.idStr;
            busTicketInfo.orderDesc = busTicketInfo.orderDesc +'['+busTicketInfo.busId+"]"+busTicketData.departName+'-'+busTicketData.arriveName;
            $('#busTicket .ticket-name').html(busTicketData.departName);
            $('#busTicket .arriveName').html(busTicketData.arriveName);
            $('#totalPriceBus').html(busTicketData.totalPriceBus+'元');
            $('#departDate').html(busTicketData.departDate);
            var itemHtml = '';
            if(null != busTicketData.ticketList && busTicketData.ticketList.amount > 0){
                //如果购买了汽车票就显示添加携带儿童
                $('#carryingChildren').show();
                itemHtml += '<span class="adult">'+busTicketData.ticketList.ticketName+'￥<span class="price">'+busTicketData.ticketList.sellPrice+'</span>x<span class="num">'+busTicketData.ticketList.amount+'</span>张 </span>';
                busTicketInfo.totalBusNum = parseInt(busTicketData.ticketList.amount);
            }else {
                var amount = 0;
                //如果购买了汽车票就显示添加携带儿童
                if(busTicketData.passengerList.length > 0 ){
                    $('#carryingChildren').show();
                }
                busTicketData.passengerList.forEach(function (item,index) {
                    itemHtml += '<span class="adult">'+item.ticketName+'￥<span class="price">'+item.sellPrice+'</span>x<span class="num">'+item.amount+'</span>张 </span>';
                    amount = amount + parseInt(item.amount);
                })
                busTicketInfo.passengerList = busTicketData.passengerList;
                busTicketInfo.totalBusNum = parseInt(amount);
            }
            $('#busTicket .ticket-num').html('').append(itemHtml);
            $("#busTicket").show();
        }
    }
    var attBaseInfo = JSON.parse(sessionStorage.getItem('attBaseInfo'));
    $('#attName').html('').html(attBaseInfo.storeName);
    $('#totalPrice').html(attBaseInfo.totalPrice);
}

function reqWarmPromptContent () {
    $.showLoading();
    var succ_event = function (res) {
        $.hideLoading();
        if(res.code == 0){
            $('.warm-prompt .content').html(res.data);
        }
    }
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    var providerId = userInfo.providerId;
    var url = SERVER_URL_PREFIX + '/busTicketOrder/tips';
    var param = {
        providerId:providerId
    }
    $.ajaxService({
        url:url,
        data:param,
        success:succ_event,
    })
}

function childrenNumberClick_event() {
    $('#carryingChildren .less').off('click').on('click',function () {
        var amount = parseInt($('#carryingChildrenNumbers').val());
        if(amount<=0){
            return;
        }
        amount -= 1;
        $('#carryingChildrenNumbers').val(amount);
    });
    $('#carryingChildren .more').off('click').on('click',function () {
        var amount = parseInt($('#carryingChildrenNumbers').val());
        if(busTicketInfo.freeTicketAmount > amount){
            amount = parseInt(amount);
            amount += 1;
            $('#carryingChildrenNumbers').val(amount);
        }else{
            $.toast("免费儿童个数不能超过"+busTicketInfo.freeTicketAmount+"人");
        }
    });
}
//取票/退票规则
function getTicketRule() {
    var url = '/busTicketOrder/ticketRule';
    var data = {
        token : $.cookie('token')
    }
    $.post(url,data,function(result){
        var code = result.code;
        var ruleContent = '暂无文案';
        if(code == 0 ){
            ruleContent = result.data;
        }
        $('#ticketRule .content').html(ruleContent);
    },'json');
}

$(function(){
    initPage();
    reqWarmPromptContent();
    childrenNumberClick_event();
    getTicketRule();
})
