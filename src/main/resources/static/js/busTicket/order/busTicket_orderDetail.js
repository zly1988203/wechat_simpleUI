var click_event = isAndroid() ? 'tap' : 'click';
//取消订单
$('#cancelOrder').on(click_event,function(){
    cancelOrder();
});

$('.buyAgain').on(click_event,function(){
    var directUrlParam = $('#directUrlParam').val();
    if("" == directUrlParam){
        //暂时跳到首页
        window.location = "/busTicketIndex";
    }else {
        window.location = "/sameSale/toAttMainPage1?"+directUrlParam;
    }
});

//金额详情
$('#totalAmount').on(click_event,function () {
    $('#totalDetail').popup('push');
});
$('#totalDetail .close').on(click_event,function () {
    $('#totalDetail').closePopup();
});


$('#payConfirm').on(click_event,function(){
    payConfirm();
});

$('.detail-btn').on(click_event,function () {
    $('.popup-container-detail').show();

});
$('.popup-container-detail').on(click_event,function () {
    $('.popup-container-detail').hide();
});
$('.detail-content').on(click_event,function (e) {
    e.stopPropagation();
});

$('.btn-check').on(click_event,function () {
    var orderNo = $('#orderNo').val();
    window.location = '/busTicketOrder/check?orderNo='+orderNo;
})

function initPage() {
    var status = $('#orderStatusInt').val();
    if(status != 1){
        var tripDate = $('#tripDate').val();
        if(tripDate == ''){
            backtoUrl('/passenger/busTicketOrder.html');
        }else{
            backtoUrl('/trip/toTripListPage?tripDate='+tripDate);
        }
    }
}



//显示景区门票入口
function showScenicEnt(spotOrderCount) {
    var scenicHtml = '<div class="scenic-entrance" id="scenicEntrance">' +
        '  <div class="name">门票信息</div>' +
        '  <div class="value">共'+ spotOrderCount +'张</div>' +
        '</div>';

    $('body').append(scenicHtml);

    //绑定点击事件
    $('#scenicEntrance').off(click_event).on(click_event,function () {
        window.location = '/busTicketOrder/scenicTickets?orderNo=' + $('#orderNo').val();
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
        $('#ruleContent').html(ruleContent);
    },'json');
}
/* 倒计时
* param  参数是秒数
* */
function setCountDown(n) {
    var time = {
        minute: 0,
        second: 0
    };

    //计算出分和秒
    if(typeof n === 'number') {
        time.minute = parseInt(n / 60);
        time.second = n % 60;
    }
    full(time);
    //计时
    function full(t) {
        if(t.second > 0) {
            t.second--;
        } else {
            if(t.minute > 0) {
                t.minute--;
                t.second = 59;
            } else {
                //计时完毕-->关闭订单
                cancel(1);
                return false;
            }
        }
        $('#minute').text(t.minute);
        $('#second').text(t.second);
        $('.count-down').show();
        setTimeout(function () {
            full(t);
        }, 1000);
    }
}


/*根据订单状态动态生成对应状态特有的页面
    参数为：订单状态
 订单状态 [待支付：pay_waiting,待出票：issuing,出票成功：issued_success,出票失败：issued_fail,已关闭：closed,部分退票：refund_part,全部退票：refund_all]
*/
function checkTicketState(){
    /*根据订单状态动态生成对应状态特有的页面*/
    var status = $('#orderStatusInt').val();//1-待支付,2-出票中,-1-出票失败,3-已出票,4-全部退款,5-部分退款,6-已关闭
    if(status==1){//待支付
        var countDownTime = $('#countDownTime').val();
        setCountDown(parseInt(countDownTime/1000));

        //修改订单状态
        $('#order_status').text('待支付');

        //修改底部按钮组
        $('#btn-group-A').show();
        $('#btn-group-B').hide();
        $('#btn-group-C').hide();

    }else if(status==2){//待出票
        //顶部提示信息
        var $cd = $('<div class="count-down">正在出票，若出票失败，票款会原路退回给微信。</div>');
        $('body').prepend($cd);

        //修改订单状态
        $('#order_status').text('待出票');

        //无按钮
        $('#btn-group-A').hide();
        $('#btn-group-B').hide();
        $('#btn-group-C').hide();
    }else if(status==3) {//出票成功
        //顶部提示信息： 无
        //修改订单状态
        $('#order_status').text('已出票');

        //修改底部按钮组
        $('#btn-group-A').hide();
        $('#btn-group-B').show();
        if($('#hasCanRefund').val() == 1){
            $('#refund').show();
        }
        $('#btn-group-C').hide();

    }else if(status==-1) {//出票失败
        //顶部提示信息： 无
        //修改订单状态
        $('#order_status').text('出票失败');
        //退票详情
        $('.refundDetail').show();
        //修改底部按钮组
        $('#btn-group-A').hide();
        $('#btn-group-B').hide();
        $('#btn-group-C').show();

    }else if(status==6) {//已关闭
        //顶部提示信息： 无
        //修改订单状态
        $('#order_status').text('已关闭');

        //修改底部按钮组
        $('#btn-group-A').hide();
        $('#btn-group-B').hide();
        $('#btn-group-C').show();

    }else if(status==4) {//全部退票
        //顶部提示信息： 无
        //修改订单状态
        $('#order_status').text('全部退票');

        //退票详情
        $('.refundDetail').show();

        //修改底部按钮组
        $('#btn-group-A').hide();
        $('#btn-group-B').show();
        if($('#hasCanRefund').val() == 1){
            $('#refund').show();
        }
        $('#btn-group-C').hide();

    }else if(status==5) {//部分退票
        //顶部提示信息： 无
        //修改订单状态
        $('#order_status').text('部分退票');

        //退票详情
        $('.refundDetail').show();

        //修改底部按钮组
        $('#btn-group-A').hide();
        $('#btn-group-B').show();
        if($('#hasCanRefund').val() == 1){
            $('#refund').show();
        }
        $('#btn-group-C').hide();
    }
}

$(function() {
    getTicketRule();
    //规则
    $.ruleInit();
    checkTicketState();

    var spotOrderCount = $('#spotOrderCount').val();
    if(parseInt(spotOrderCount) > 0){
        showScenicEnt(spotOrderCount);
    }
});

//取消订单
function cancelOrder(){
    $.confirm('确定取消当前订单？', '', ['取消订单', '再想想'], function(){}, function(){
        cancel(2);
    });
}

//取消订单
function cancel(type){
    //api url
    var urlStr = SERVER_URL_PREFIX+'/busTicketOrder/orderCancel';
    //current page param
    var orderNo = $('#orderNo').val();
    var dataObj = {
        orderNo: orderNo,
    };
    //merge page param and common param,generate request param
    dataObj = genReqData(urlStr, dataObj);
    $.ajax({
        type: 'POST',
        url:urlStr,
        data:dataObj,
        dataType:  "json",
        success: function(result){
            if(result&&result.code==0){
                var message = "取消成功";
                if(type == 1){//订单自动关闭
                    message = "超时未支付，订单已关闭";
                }
                $.alert(message, function() {
                    window.location.href = "/passenger/busTicketOrder.html"; ;
                });
            }else{
                $.alert((result&&result.message) || "未知错误");
            }
        },
    });
}

//确定支付
function payConfirm(){
    var orderNo = $('#orderNo').val();
    var settleType = $('#settleType').val();
    //分销的订单也需要中交支付 忽略配置
    var ifCooperate = $('#ifCooperate').val();
    if(ifCooperate == 1){
        settleType = 0;
    }
    var b = new Base64();
    var url = b.encode("/busTicketOrder/toOrderDetail?orderNo="+orderNo);
    window.location.href='/order/payunit?orderNo='+orderNo+'&settleType='+settleType+'&userCouponId='+0+'&url='+url;
}

//退票处理
$('#refund').on(click_event,function(){
    var orderNo = $('#orderNo').val();
    window.location.href='/busTicket/busTicketRefund?orderNo='+orderNo;
});