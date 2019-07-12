$(function() {
    var orderNo = $('#orderNo').val();
    backtoUrl('/hail/bus/toOnlineCarOrderDetail?orderNo=' + orderNo + '&token=' + $.cookie('token'));
});