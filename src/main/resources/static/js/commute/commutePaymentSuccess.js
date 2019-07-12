$('.popup-container .close').on('click',function () {
    $('.popup-container').hide();
});

function showPopup() {
    // 0-未关注,1-已经关注
    var focusOn = $('#focusOn').val();
    if(focusOn == '0'){
        $('.popup-container').show();
    }else{
        $('.popup-container').hide();
    }
}
function showProvideName() {
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    var providerName = userInfo.providerName;
    $('#providerName').html(providerName);
}

$(function(){
    var orderNo = $('#orderNo').val();
    var activityId = $('#activityId').val();
    backtoUrl('/bus/toCommuteOrderDetail?orderNo='+orderNo);
    showPopup();
    showProvideName();
    //去乘车
    $('#back').on('click',function(){
        window.location.href = '/trip/toTripListPage ';
    });

    //查看订单详情
    $('#toOrderDetail').on('click',function(){
        var urlStr = SERVER_URL_PREFIX+'/bus/toCommuteOrderDetail';
        var dataObj = {
            orderNo: orderNo
        };
        dataObj = genReqData(urlStr, dataObj);
        window.location.href="/bus/toCommuteOrderDetail?token="+dataObj.token+"&orderNo="+dataObj.orderNo+"&sign="+dataObj.sign;
    });

    //查看活动详情
    $('#toActivityDetail').on('click',function(){
        var urlStr = SERVER_URL_PREFIX+'/buyActivity/activityDetail';
        var dataObj = {
            activityId:activityId,
            orderNo: orderNo
        };
        dataObj = genReqData(urlStr, dataObj);
        window.location.href="/buyActivity/activityDetail?token="+dataObj.token+"&activityId="+dataObj.activityId+"&sign="+dataObj.sign;
    });
});