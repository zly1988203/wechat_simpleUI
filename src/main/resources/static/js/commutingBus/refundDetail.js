var refundInfo = {
    serialNos:'',
    totalRefundAmount:0,
    refundTicketCount:0,
    totalPayAmount:0,
    totalFee:0,
    orderNo:''
}

/*选择退票原因*/
$('.reason-item').on('click',function(){
    var $el = $(this);

    //选中
    $el.addClass('active');

    //其他兄弟节点不选中
    $el.nextAll().removeClass('active');
    $el.prevAll().removeClass('active');

    // 如果选中的是其他，弹出意见框
    if($el.attr('id')=='other_reasons'){
        $('.message-area').show();
    }else{
        $('.message-area').hide();
    }
    //设置选择的退票原因
    $el.siblings('input').val($el.data('value'));

    //退票原因为空，确定按钮不可用
    var refund_reason = $('#tag').val();
    if(refund_reason==''){
        $('#btn_refund').removeClass('primary');
        $('#btn_refund').addClass('unclickable');
    }else{
        $('#btn_refund').removeClass('unclickable');
        $('#btn_refund').addClass('primary');
    }
});

//字数统计
$('#message-1').on('input', function() {
    var length = $(this).val().length;
    var _MAX = $(this).data('max');

    if(length <= _MAX) {
        $(this).next('div').attr('class', 'message-length').text(length + '/' + _MAX);
    } else {
    }
});


//提交退票信息提示
// refund(2,'李梅梅');
$('#btn_refund').on('click',function(){
    var refund_reason = $('#tag').val();
    if(refund_reason==''){
        $.toast("请选择退票原因");
        return;
    }else if(refund_reason=='其他'){
        var length = $('#message-1').length;
        refund_reason = '（其他）'+$('#message-1').val();
        var _MAX = $('#message-1').data('max');

        if(length > _MAX) {
            $.toast("字数太多");
            return;
        }
    }
    $.showLoading('正在为您退票，请稍等');
    var param = {
        token:serverUtil.token,
        ticketSerialNos:refundInfo.serialNos,
        message:refund_reason,
        refundPrice:refundInfo.totalRefundAmount
    };
    request(commuteApi.refundBatch,param,true).then(function(result) {
        $.hideLoading();
        if(result&&result.code==0){
            $.alert('退票成功', function() {
                var dataObj = {
                    orderNo: refundInfo.orderNo,
                    token: $.cookie('token')
                }
                window.location.href="/bus/toCommuteOrderDetail?token="+dataObj.token+"&orderNo="+dataObj.orderNo;
            });
        }else if(result&&result.code==36000){
            $.alert('退款信息有变化',function(){
                history.go(0);
            });
        }else{
            $.dialog({
                title: '提示',
                text: result.message,
                buttons: [
                    {
                        text: '我知道了',
                        onClick: function () {
                        }
                    },
                    {
                        text: '拨打电话',
                        onClick: function () {
                            tel();
                        }
                    }
                ]
            });
        }
    })
});


$('#btnBack').on('click',function(){
   history.back();
});

function tel(){
    var param = {}
    request(commuteApi.getBusinessTel,param,true).then(function(res) {
        if (res.code == 0) {
            if(res.data && data.tel){
                window.location.href = 'tel:'+data.tel;
            }
        }
    })
}

function getRefundDetail() {
    $.showLoading();
    var serialNos = JSON.parse(sessionStorage.getItem('serialNos'));
    refundInfo.serialNos = serialNos;
    var param = {
        serialNos:serialNos,
        token:serverUtil.token
    }
    request(commuteApi.toRefundDetail,param,true).then(function(res) {
        $.hideLoading();
        if (res.code == 0) {
            var data = res.data;
            refundInfo.orderNo = data.orderNo;
            if(''!= data.message && undefined != data.message){
                $.alert(data.message,function(){
                    window.location.href='/commute/toBatchRefund?orderNo='+data.orderNo;
                });
            }else {
                refundInfo.totalFee = data.totalFee;
                refundInfo.totalPayAmount = data.totalPayAmount;
                refundInfo.totalRefundAmount = data.totalRefundAmount;
                refundInfo.refundTicketCount = data.refundTicketCount;

                $('#refundTicketCount').html(data.refundTicketCount);
                $('#totalRefundAmount').html(data.totalRefundAmount);
                $('#totalPayAmount').html(data.totalPayAmount);
                $('#totalFee').html(data.totalFee);
            }
        }else {
            $.alert(res.message,function(){
                history.back();
                // window.location.href='/commute/toBatchRefund?orderNo='+res.data.orderNo;
            });
        }
    })
}

$(function () {
    getRefundDetail();
})