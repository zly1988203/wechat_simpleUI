var orderNo=getQueryString("orderNo");
var productCode=getQueryString("productCode");
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 匹配目标参数
    var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
    if (result != null) {
        return decodeURIComponent(result[2]);
    } else {
        return null;
    }
}

// 获取退票详情
function getRefundDetail(){
    var urlStr = SERVER_URL_PREFIX+'/spot/refundDetail';
    var dataObj = {
        orderNo:orderNo,
        productCode:productCode,
        token:$.cookie('token')
    }
    
    $.ajax({
        url:urlStr,
        data:dataObj,
        type: 'POST',
        dataType: 'JSON',
        success: function (res) {
            let data = JSON.parse(res);
            if(data.code == 0){
                $("#canRefundNum").html(data.data.canRefundNum);
                $("#alreadyRefundNum").html(data.data.canRefundNum);
                $("#totalPrice").html(data.data.totalPrice);
                $("#serviceFee").html(data.data.serviceFee);
                $("#estimateRefundAmount").html(data.data.estimateRefundAmount);
            }else{
                alert(data.message);
            }
        }
    })
}
getRefundDetail();

// 退票理由
$('.refund-info-content li').off('click').on('click',function () {
    var value = $(this).data('value');
    $('#refundReason').val(value);
    $(this).addClass('active').siblings().removeClass('active');
});

// 退票申请
$('#refundBtn').off('click').on('click',function () {
    var li = $('.refund-info-content').find('li[class^="active"]');
    var refundReason = $(li).data('value');
    var urlStr = SERVER_URL_PREFIX + '/spot/refundBatch';
    var alreadyRefundNum = $("#alreadyRefundNum").html();
    if(refundReason == undefined || refundReason == null){
        $.toast('请选中一个退票原因');
    }else{
        if(alreadyRefundNum > 0){
            $.confirm('确定提示退票申请吗？', function() {
                $.ajax({
                    url:urlStr,
                    data:{orderNo:orderNo,refundReason:refundReason},
                    type: 'POST',
                    dataType: 'JSON',
                    success: function (res) {
                        let data = JSON.parse(res);
                        if(data.code == 0){
                            alert("请求成功："+data.data);
                            window.history.back(-1);
                            // setTimeout(function() {
                            //     window.location.href='/sameSale/toDeatilPage?orderNo='+orderNo+'&token='+$.cookie('token');
                            // }, 10);
                        }else{
                            alert(data.message);
                        }
                    }
                })
            });
        }else{
            $.toast('可退票张数不足');
        }
    }

});

// 返回
$("#toBack").on('click',function(){
    window.history.back(-1);
});