$(function () {
    getIndexConfigService();

    $('.back-btn').on('click',function () {
        window.location.href = '/innerCity/order/innerCityService';
    });
});

//约车规则接口
function getIndexConfigService() {
    $.showLoading();
    var url = SERVER_URL_PREFIX+'/innerCity/getIndexConfig';
    var dataObj = {
        requestUrl:window.location.href
    };
    dataObj = genReqData(url, dataObj);
    dataObj['token'] = $.cookie('token');
    $.ajaxService({
        url:url,
        data:dataObj,
        success:function (res) {
            $.showLoading();
            $.hideLoading();
            if(null != res && res.code == 0){
                if(null == res.data){
                    // $.alert('该行程暂无开通线路~')

                }else {
                    var _html = res.data.rulePage;
                    $('.rules-content').html(_html);
                }
            }
            else{
                $.alert(res.message);
            }
        }
    });
}
