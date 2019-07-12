var url = null;
var timeLeft = 5000;//倒计时5秒
var totalAmount = 0;
var payStatus = '0';

var orderNo = getQueryString("orderNo");
var token = $.cookie('token');
var userCouponId = getQueryString("userCouponId");
var settleType = getQueryString("settleType");
var enUrl = getQueryString("url");
var hail = getQueryString("hail");

function getQueryString(key, strURL) {
    strURL = strURL || window.location.search;
    return new RegExp("(^|\\?|&)" + key + "=([^&]*)(\\s|&|$)", "i").test(strURL) ? decodeURIComponent(RegExp.$2.replace(/\+/g, " ")) : "";
}

var getPrepayInfoCallback = function (data) {
    if (typeof WeixinJSBridge == "undefined") {
        $(document).on('WeixinJSBridgeReady', function () {
            onBridgeReady(data);
        });
    } else {
        onBridgeReady(data);
    }
}

function onBridgeReady(data) {
    $.hideLoading();
    WeixinJSBridge.invoke('getBrandWCPayRequest', {
        "appId": data.appId, //公众号名称，由商户传入
        "timeStamp": data.timeStamp, //时间戳，自1970年以来的秒数
        "nonceStr": data.nonceStr, //随机串
        "package": "prepay_id=" + data.prepayId,
        "signType": data.signType, //微信签名方式：
        "paySign": data.paySign //微信签名
    }, function (res) {
        switch (res.err_msg) {
            case 'get_brand_wcpay_request:cancel':
                $('#payStatue').removeClass('icon-loading').addClass('icon-cancel');
                $('#content').removeClass('pay-success').addClass('pay-failure');
                $('#content').html('支付已取消');
                payStatus = '0';
                break;
            case 'get_brand_wcpay_request:fail':
                $('#payStatue').removeClass('icon-loading').addClass('icon-failure');
                $('#content').removeClass('pay-success').addClass('pay-failure');
                $('#content').html('支付失败');
                payStatus = '0';
                break;
            case 'get_brand_wcpay_request:ok':
                $('#payStatue').removeClass('icon-loading').addClass('icon-success');
                $('#content').html('支付成功');
                $('#payPrice').html(totalAmount + '元');
                $('#payPrice').show();
                payStatus = '1';
                break;
            default:
                console.log('支付返回结果===='+JSON.stringify(res));
                $('#payStatue').removeClass('icon-loading').addClass('icon-error');
                $('#content').removeClass('pay-success').addClass('pay-failure');
                $('#content').html('页面加载失败，请返回再试');
                payStatus = '0';
        }

        countTime();
    });
}

function countTime() {
    if (timeLeft == 0) {
        url = url + '&payStatus=' + payStatus;
        location.replace(url);
        return;
    }

    var startSec = parseInt(timeLeft / 1000);
    var strHtml = startSec + ' 秒后回到订单…';
    $('.time-label').html(strHtml)
    timeLeft = timeLeft - 1000;
    setTimeout('countTime()', 1000);
}

function getPrepayInfo(dataParam, callback) {
    $.ajax({
        type: "GET",
        url: SERVER_URL_PREFIX + hail + "/pay/getPrepayInfo",//获取支付返回信息
        data: dataParam,
        dataType: "json",
        success: function (result) {
            if (parseInt(result.code) == 8888) {
                //0元支付
                url = url + '&payStatus=1';
                window.location = url;
            } else if (result != undefined && result.code != undefined && parseInt(result.code) == 0) {
                totalAmount = result.data.totalAmount;
                callback(result.data);
            } else if (parseInt(result.code) == 10087 || parseInt(result.code) == 8889) {
                $.alert('订单已被后台客服取消', function () {
                    url = url + '&payStatus=0';
                    window.location = url;
                });
            } else if (parseInt(result.code) == 40003) {
                $.alert('操作太频繁，' + result.message, function () {
                    url = url + '&payStatus=0';
                    window.location = url;
                });
            } else if (parseInt(result.code) == 9999999) {
                $.alert(result.message, function () {
                    url = url + '&payStatus=0';
                    window.location = url;
                });
            }
            else {
                //$.hideLoading();
                var errMsg = "获取预支付信息失败！";
                $.alert(errMsg, function () {
                    url = url + '&payStatus=0';
                    window.location = url;
                });
            }
        }
    });
}

$('#btnBack').on('click', function () {
    var b = new Base64();
    var toUrl = b.decode(enUrl);
    toUrl = toUrl + '&payStatus=' + payStatus;
    location.replace(toUrl);
})

function initPage() {
    if (undefined == userCouponId || userCouponId == null) {
        userCouponId = 0;
    }
    if (undefined == hail || hail == null) {
        hail = "";
    }
    var dataParam = {'orderNo': orderNo, 'token': token, 'userCouponId': userCouponId};
    getOrderSettleTypeByOrderNo(orderNo, function (settleType) {
        if (settleType == 0) {
            if (undefined == enUrl || enUrl == null) {
                enUrl = hail + "/index";
            }
            //中交支付 非预付款
            window.location = PAY_SERVER + hail + '/order/payunit?orderNo=' + orderNo + '&token=' + token + '&userCouponId=' + userCouponId + '&url=' + enUrl;
        } else {
            if (undefined == enUrl || enUrl == null) {
                url = hail + "/index";
            } else {
                //解密
                var b = new Base64();
                url = b.decode(enUrl);
            }
            //车企支付 预付款
            getPrepayInfo(dataParam, getPrepayInfoCallback);
        }
    });
}

function init() {
    window.wx.miniProgram.getEnv(function (res) {
        var isWxMini = res.miniprogram;
        if(isWxMini){
            //小程序环境
            var jumpUrl = encodeURIComponent(window.location);
            var path = '/pages/payFor/payUnit?orderNo='+ orderNo + '&token=' + token + '&userCouponId='
                + userCouponId + '&url=' + enUrl + '&jumpUrl=' + jumpUrl + '&serviceUrlPrefix='+ SERVER_URL_PREFIX + '&hail='+hail;
            window.wx.miniProgram.navigateTo({
                url: path
            })
        }else {
            // 非小程序环境
            initPage();
        }
    });
}

function getOrderSettleTypeByOrderNo(orderNo, func) {
    // 默认无效结算类型
    var settleType = -1;
    $.ajax({
        type: 'GET',
        url: SERVER_URL_PREFIX + hail + "/pay/getSettleMode",
        data: {'orderNo': orderNo},
        dataType: 'json',
        success: function (result) {
            settleType = result.settleMode;
            func(settleType);
        }
    });
}

$(function () {
    if (undefined == hail || hail == null) {
        hail = "";
    }
    init();
});

