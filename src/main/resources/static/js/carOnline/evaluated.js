$(function() {
    var orderNo = $('#orderNo').val();
    backtoUrl('/bus/toOnlineCarOrderDetail?orderNo=' + orderNo + '&token=' + $.cookie('token'));
});