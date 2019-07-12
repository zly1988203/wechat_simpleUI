var click_event = isAndroid() ? 'tap' : 'click';

$('.refund-info-content li').off(click_event).on(click_event,function () {
    var value = $(this).data('value');
    $('#refundReason').val(value);
    $(this).addClass('active').siblings().removeClass('active');
});
$('#refundBtn').off(click_event).on(click_event,function () {
    $.confirm('确定退票申请吗？', function() {
        var orderNo = getParam('orderNo',window.location.href);
        var url = SERVER_URL_PREFIX + '/spot/refundBatch';
        var li = $('.refund-info-content').find('li[class^="active"]');
        var refundReson = $(li).data('title');
        var param = {
            orderNo:orderNo,
            refundReason:refundReson
        }
        var succ_event = function (res) {
            $.hideLoading();
            if(res.code == 0){
                window.location = '/busTicketOrder/scenicTickets?orderNo=' + orderNo;
            }else {
                $.alert(res.message);
            }
        }
        var err_event = function (e) {
            $.hideLoading();
            $.alert(e.message);
        }

        $.showLoading();
        $.ajaxService({
            url:url,
            data:param,
            success:succ_event,
            error:err_event
        })
    });
});

$('.back').on('click',function () {
    window.history.go(-1);
});
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


function initRefundInfo() {
    var orderNo = getParam('orderNo',window.location.href);
    var url = SERVER_URL_PREFIX + '/spot/refundDetail';
    var param = {
        orderNo:orderNo,
    }

    var succ_event = function(res) {
        $.hideLoading();
        if(res.code == 0){
            var data = res.data;
            $('#canRefundNum').html('').html(data.canRefundNum+'张');
            $('#refundNum').html('').html(data.canRefundNum+'张');
            $('#totalPrice').html('').html(data.totalPrice+'元');
            $('#serviceFee').html('').html('-'+data.serviceFee+'元');
            $('#estimateRefundAmount').html('').html(data.estimateRefundAmount+'元');
        }else {
            $.alert(res.mesage);
            return;
        }
    }

    var err_event = function (e) {
        $.hideLoading();
        $.alert(e.message);
    }
    $.showLoading();
    $.ajaxService({
        url:url,
        data:param,
        success:succ_event,
        error:err_event,
    })
}

$(function () {
    initRefundInfo();
});



