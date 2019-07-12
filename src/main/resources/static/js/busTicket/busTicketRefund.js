$('#back').on('click', function () {
    history.go(-1);
});

$('.ticket-rule').on('click',function () {
    $('#ticketRule').popup();
})

$('#ticketRule .close').on('click',function () {
    $('#ticketRule').closePopup();
})

//下一步
$('#submit').on('click', function () {
    var flag = $(this).data('flag');
    if(flag == false) return;

    var ticketSerialNos='';

    $('.frm-checkbox').each(function () {
        var el = $(this);
        if(el.is(':checked')){
            ticketSerialNos = ticketSerialNos + el.data('serial-no') + ',';
        }
    });
    var dataObj = {
        orderNo:orderNo,
        ticketSerialNos:ticketSerialNos,
        token:$.cookie('token'),
    };
    var urlStr =SERVER_URL_PREFIX +  '/busTicketOrder/refundBatch';

    $.confirm('确定提交退票申请吗？', '提示',['暂不退票', '确定退票'], function() {
        $.ajax({
            type: 'POST',
            url:urlStr,
            data:dataObj,
            dataType:  "json",
            success: function(result){
                if(result&&result.code==0){
                    $.alert('退票申请已提交，具体退票情况以车站反馈为准',function () {
                        window.location.href="/busTicketOrder/toOrderDetail?orderNo="+orderNo;
                    })

                }
            }
        });
    })
});

//验票状态
var TicketCheckStatus = {
    0:"初始",
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

function drawPage(ticketList) {
    var ticketHtml = '';
    ticketList.forEach(function (item,index) {
        var checkboxHtml = '';
        if(item.status == 1 || item.status == 4){
            checkboxHtml = '<input type="checkbox" class="frm-checkbox" name="refund"  ' +
                '                           data-serial-no="'+item.ticketSerialNo+'">' ;
        }
        var ticketName = ''!=item.itemName?item.itemName:'成人票';
        if(item.idCardNo != '' && null != item.idCardNo){
            ticketHtml += '<div class="ticket">' +
                '            <div class="content">' +
                '             <label data-pay-price="'+item.ticketPrice+'" >' + checkboxHtml +
                '                <div class="info">' +
                '                    <ul>' +
                '                        <li><div class="name">'+item.passengerName+'<span>('+ticketName+')</span></div></li>' +
                '                        <li><div class="name">身份证</div><div class="value">'+item.idCardNo+'</div></li>' +
                '                    </ul>' +
                '                </div>' +
                '               </label>' +
                '            </div>' +
                '            <div class="right"><div class="status">'+TicketCheckStatus[item.status]+'</div></div>' +
                '        </div>'
        }else {
            ticketHtml += '<div class="ticket">' +
                '            <div class="content">' +
                '             <label data-pay-price="'+item.ticketPrice+'" >' + checkboxHtml +
                '                <div class="info">' +
                '                    <ul>' +
                '                        <li><div class="name">票号<span>('+ticketName+')</span></div></li>' +
                '                        <li><div class="name">'+item.ticketSerialNo+'</div></li>' +
                '                    </ul>' +
                '                </div>' +
                '               </label>' +
                '            </div>' +
                '            <div class="right"><div class="status">'+TicketCheckStatus[item.status]+'</div></div>' +
                '        </div>'
        }

    })
    $('.ticket-box').html('').append(ticketHtml);
    ticket_event();
}


function ticket_event(){
    $('.ticket label').off('click').on('click', function () {
        var totalPrice = 0;
        var totalRefundFee = 0;
        var  submit = $('#submit');
        //下一步按钮样式
        var ticketSerialNos = "";
        $('.frm-checkbox').each(function () {
            var el = $(this);
            var parent = el.parent();
            var payPrice = parseFloat($(parent).data('pay-price')*100);
            if(el.is(':checked')){
                totalPrice = totalPrice + parseFloat(payPrice);
                totalRefundFee = totalRefundFee + parseFloat(ticketRefundFee*100);
                ticketSerialNos = ticketSerialNos + el.data('serial-no') + ',';
            }
        });

        var refundPrice = parseFloat((totalPrice - totalRefundFee)/100).toFixed(2);
        $('#totalPrice').html("¥"+parseFloat(totalPrice/100).toFixed(2));
        totalRefundFee = parseFloat(totalRefundFee/100).toFixed(2);
        $('#totalRefundFee').html("¥"+totalRefundFee);
        $('#refundPrice').html("¥"+refundPrice);

        if(ticketSerialNos != "") {
            submit.data('flag',true);
            submit.removeClass('readonly').addClass('primary');
        } else {
            submit.data('flag',true);
            submit.addClass('readonly').removeClass('primary');
        }
    });

}

var ticketRefundFee = 0;
function initPageData() {
    var suc_event = function (res) {
        if(res.code == 0){
            var data = res.data;
            if(undefined != data && null != data){
                ticketRefundFee = data.ticketRefundFee;
                $('#ticketRule .content').html(data.ticketRule);
                var ticketList = data.ticketList;
                if(undefined != ticketList && ticketList.length > 0){
                    drawPage(ticketList);
                }
            }
        }
    }

    var url = SERVER_URL_PREFIX +  "/busTicketOrder/refundDetail";
    var param = {
        orderNo:orderNo,
        token:$.cookie('token'),
    }
    $.ajaxService({
        url:url,
        data:param,
        success:suc_event,
    })
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

var orderNo = '';
$(function () {
    orderNo = getParam('orderNo');
    initPageData();
})

