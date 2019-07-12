var click_event = isAndroid() ? 'tap' : 'click';

function reqScenicInfo(orderNo) {
    var url = SERVER_URL_PREFIX + '/spot/getOrderDetail';
    var dataObj = {
        orderNo:orderNo,
        token:$.cookie('token')
    };
    dataObj = genReqData(url, dataObj);
    $.ajax({
        url:url,
        data:dataObj,
        type: 'POST',
        dataType: 'JSON',
        success: function (res) {
            res = $.parseJSON(res);
            if(res.code== '0'){
                showScenicTicketInfo(res);
            }else{
                $.alert(res.message)
            }
        }
    });
}

function showScenicTicketInfo(res) {
    var qrcodeInfo = {};//二维码验票时弹窗中的信息

    // 景区名等
    showScenicInfo(res.data);

    //门票信息
    showTicketInfo(res.data);

    //使用说明信息
    showInstructions(res.data);

    //联系人信息
    showLinkmanInfo(res.data);

    //游客信息
    showPassengerInfo(res.data);
}

//验票按钮
function showBtnBar(data) {
    // 检票方式 1 实体票检票 2 二维码检票
    if(data.checkTicketType == '2'){
        $('.btn-bar .to-check').show();
    }else{
        $('.btn-bar .to-check').hide();
    }
}

//联系人信息
function showLinkmanInfo(data) {
    var linkmanHtml =  '<div class="lump role-info-content" id="linkman" data-name="'+ data.contactInfo.contactName +'" data-phone="'+ data.contactInfo.contactMobile +'" data-id-card="'+ data.contactInfo.contactCard +'">' +
    '    <div class="role-name sui-border-b">联系人信息</div>' +
    '    <ul>' +
    '        <li>' +
    '            <div class="line-item">' +
    '                <div class="name">'+ data.contactInfo.contactName +'</div><div class="value">'+ data.contactInfo.contactMobile +'</div>' +
    '            </div>' +
    '            <div class="line-item">' +
    '                <div class="name">'+ (data.contactInfo.contactCardType=="1"?"身份证":"证件号码") +'</div><div class="value">'+ data.contactInfo.contactCard +'</div>' +
    '            </div>' +
    '        </li>' +
    '    </ul>' +
    '</div>';

    $('.main-container').append(linkmanHtml);
}

function formatDepartDate(dateLong) {
    var temp = new Date(dateLong);
    var year = temp.getFullYear();
    var month = temp.getMonth()+1;
    var date = temp.getDate();

    if(month < 9){
        month = '0' + month;
    }
    if(date < 9){
        date = '0'+ date;
    }

    return (year + '-' + month  + '-' + date);
}

// 景区名等
function showScenicInfo(data) {
    var depart = formatDepartDate(data.departTime);
    var scenicHtml = '<div class="lump ticket-name-content" id="scenicInfo" data-name="'+ data.goodsName +'" data-time="'+ depart +'">' +
        '  <div class="info">'+ data.goodsName +'</div>' +
        '  <div class="info">'+ depart +' 入园</div>' +
        '</div>';

    $('.main-container').append(scenicHtml);
}

//使用说明信息
function showInstructions(data) {
    var insHtml = '<div class="lump ticket-info-content">' +
        '  <ul>' +
        '    <li><div class="left">使用时间</div><div class="right">'+ data.orderIntro +'</div></li>' +
        '    <li><div class="left">使用方法</div><div class="right">'+ data.useIntro +'</div></li>' +
        '    <li><div class="left">取票地址</div><div class="right">'+ data.fetchTicketAddr +'</div></li>' +
        '    <li><div class="left">使用地址</div><div class="right">'+ data.checkTicketAddr +'</div></li>' +
        '    <li><div class="left">退改说明</div><div class="right">'+ data.refundIntro +'</div></li>' +
        '    <li><div class="left">温馨提示</div><div class="right">'+ data.friendlyReminder +'</div></li>' +
        '  </ul>' +
        '</div>';
    $('.main-container').append(insHtml);
}
//门票信息：数量、价格
function showTicketInfo(data) {
    var typeListHtml = '';

    if(data.subOrderList && data.subOrderList.length > 0){
        data.subOrderList.forEach(function (item, index) {
            typeListHtml +=  '<li class="passenger-type" data-skuName="'+ item.skuName +'" data-total="'+ item.totalNum +'" data-price="'+ item.price +'"><div class="left">'+ item.skuName +'</div><div class="right">共'+ item.totalNum +'张</div></li>';
        });
    }

    var infoHtml = '<div class="lump ticket-info-content" id="passengerList">' +
        '  <ul>' +
        '    <li><div class="left">门票价总额</div><div class="right price">'+ data.totalPrice +'元</div></li>' +
        '    <li><div class="left">购票数</div><div class="right">共'+ data.totalNum +'张</div></li>' +
        typeListHtml +
        '  </ul>' +
        '</div>';
    $('.main-container').append(infoHtml);
}

//验票状态
var TicketCheckStatus = {
    0:"出票中",
    1:"已购票",
    2:"已退票",
    3:"已取票",
    4:"已检票",
    5:"预定",
    6:"取消",
    7:"过期",
    8:"失败",
    9:"退票中"
}

//验票按钮
function showBtnBar(data) {
    // 检票方式 1 实体票检票 2 二维码检票
    if(data.checkTicketType == '2'){
        $('.btn-bar .to-check').show();
    }else{
        $('.btn-bar .to-check').hide();
    }
}

//显示游客信息
function showPassengerInfo(data) {
    if(data.passengerList && data.passengerList.length > 0){
        var personListHtml = '';
        data.passengerList.forEach(function (item, index) {
            var statusClassName = switchStatusClassName(item.status);
            personListHtml += '<li class="sui-border-b">' +
                '  <div class="line-item"><div class="name">'+ item.passengerName +'</div><div class="value">'+ item.passengerMobile +' </div></div>' +
                '  <div class="line-item"><div class="name">'+ (item.idCardType==1?"身份证":"证件号码") +'</div><div class="value">'+ item.idCardNo +'</div></div>' +
                '  <div class="line-item"><div class="status '+ statusClassName +'">'+ TicketCheckStatus[item.status] +'</div></div>' +
                '</li>';

            if(item.status == 1){
                $('.refund').show();
                showBtnBar(data);
            }
        });
        var contentHtml = '<div class="lump role-info-content">' +
            '  <div class="role-name sui-border-b">游客信息</div>' +
            '  <ul>' + personListHtml + '</ul>' +
            '</div>';

        $('.main-container').append(contentHtml);
    }
}

function switchStatusClassName(status) {
    var className = '';
    if(status == '0'){
        className = '  wait-check';
    }else if(status == '2'){
        className = ' refunded';
    }else if(status == '4'){
        className = ' checked';
    }else if(status == '6'){
        className = ' refunded';
    }else if(status == '7'){
        className = ' refunded';
    }else{
        className = ' refunded';
    }
    return className;
}

/**
 * 查询字符串上的指定值
 * @param key
 * @param strURL
 * @returns {string}
 */
function getParam(key, strURL) {
    strURL = strURL || window.location.search;
    return new RegExp("(^|\\?|&)" + key + "=([^&]*)(\\s|&|$)", "i").test(strURL) ?
        decodeURIComponent(RegExp.$2.replace(/\+/g, " ")) : "";
}


function initQrCode(res) {
    $('#qrCodePropup').show();
    $('#qrcode').html('<img src="'+ res.data +'">');
    $('#qrCodePropup .order-info .name').html($('#scenicInfo').data('name'));
    $('#qrCodePropup .order-info .time').html($('#scenicInfo').data('time') + ' 入园');
    $('#qrCodePropup .order-check .person-info').html('联系人：' + $('#linkman').data('name') + '  ' + $('#linkman').data('id-card'));

    var totalStr = '';
    $('#passengerList .passenger-type').forEach(function (item,index) {
        var totalPrice = parseFloat($(item).data('price'));
        var totalNum = parseInt($(item).data('total'));
        var tikectPrice = totalPrice/totalNum;
        totalStr += $(item).data('skuname') + '/¥' + tikectPrice + '*' + totalNum + '张,';
    });
    $('#qrCodePropup .check-info .info-data').html(totalStr);
}

function getQrcode(){
    var url = SERVER_URL_PREFIX + '/spot/getQrcode';
    var orderNo = getParam('orderNo',window.location.href);
    var dataObj = {
        orderNo:orderNo,
        token:$.cookie('token')
    };
    dataObj = genReqData(url, dataObj);
    $.ajax({
        url:url,
        data:dataObj,
        type: 'POST',
        dataType: 'JSON',
        success: function (res) {
            res = $.parseJSON(res);
            if(res.code== '0'){
                initQrCode(res);
            }else{
                $.alert(res.message)
            }
        }
    });

}

$('.to-check').on('click',function () {
    getQrcode();
});

$('.back').on(click_event,function () {
    var orderNo = getParam('orderNo',window.location.href);
    window.location = '/busTicketOrder/toOrderDetail?orderNo='+orderNo;
});

$('.refund').on(click_event,function () {
    var orderNo = getParam('orderNo',window.location.href);
    window.location = '/busTicketOrder/scenicTicketRefund?orderNo='+orderNo;
});

$('#qrCodePropup .icon-close').on(click_event,function () {
    $('#qrCodePropup').hide();
});

$(function () {
    var orderNo = getParam('orderNo',window.location.href);
    reqScenicInfo(orderNo);
});

