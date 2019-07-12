var orderInfo = {
    status:$('#status').val(),
    orderNo:$('#orderNo').val(),
    tripNo:$('#tripNo').val(),
    settleMode:$('#settleMode').val(),
    departCarType:$("#departCarType").val(),
    departType:$("#departType").val(),
};
var clickEvent = isAndroid()?'tap':'click';
var dialogText = '你的订单已被客服取消，支付的款项已退回，请通过我的订单查看';
//点击更多
$('#more').on(clickEvent, function() {
    $('#morePanel').show();
    $('.black_overlay').show();
});

$('#close').on(clickEvent,function () {
    $('#morePanel').hide();
    $('.black_overlay').hide();
});

//返回首页
$('#back').on(clickEvent,function(){
    //清空缓存
    window.sessionStorage.removeItem('callCarInfo');
    window.location='/interCityIndex';
})

//投诉建议
$('#suggestBtn').click(function(){
    window.location='/passenger/suggest.html';
});

// //紧急求助
// $('#contacts').on(clickEvent, function(e) {
//     contact(orderInfo.orderNo+'','innerCity');
// });

//联系客服
$('#contactCall').on(clickEvent, function() {
    var urlDetail = SERVER_URL_PREFIX + '/Config/commonConfig';
    var dataDetail = {
        orderNo: orderInfo.orderNo
    };
    dataDetail = genReqData(urlDetail, dataDetail);

    $.ajax({
        type: 'POST',
        url: urlDetail,
        data: dataDetail,
        dataType:  'json',
        success: function(data){
            if(data && data.code == 0){
                window.location.href = 'tel:'+data.data.customerTel;
            }
        }
    });
});

var interval;
function orderJudgeCallBack(data){
    if(parseInt(data.code)==0){
        if(parseInt(data.data.status)==4||parseInt(data.data.status)==5||parseInt(data.data.status)==6
            ||parseInt(data.data.status)==7 || parseInt(data.data.status)==8){
            // ToUrl.skip('/innerCity/orderDetail/getOrderInfo?orderNo='+orderInfo.orderNo);
            window.location='/innerCity/orderDetail/getOrderInfo?orderNo='+orderInfo.orderNo;
        }else if(parseInt(data.data.status)==9){
            clearInterval(interval);
            $.dialog({
                text: dialogText,
                buttons: [{
                    text: '我知道了',
                    onClick: function() {
                        location.href='/innerCity/order/toOrderReturnDetailPage?orderNo='+orderInfo.orderNo;
                    }
                }]
            });
        }

    }
}

//初始化
function init() {
    if(orderInfo.status == 3){
        dialogText = '你的订单已被客服取消，请通过我的订单查看';
    }
    $('.tips-box .tips').html('派车成功，司机会准时来接您，请按约定时间到上车地点等候。');
}

$(function () {
    init();
    switchJourney();
    interval=setInterval("innerCityUrlJudge(orderInfo.tripNo+'',orderJudgeCallBack,orderInfo.orderNo+'')", 1000);
    initTitleOfStatus();
    
    subAddrStr(address);
    //是否显示取消订单按钮
    isShowCancel();
    // 显示车型及人数
    showCarType(orderInfo);
})