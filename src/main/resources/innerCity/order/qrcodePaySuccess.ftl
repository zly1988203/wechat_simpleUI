<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${map.providerName!'中交出行'}</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/pay/success-3.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>

    <div class="success-3">
        <div class="status">
            <div class="thumb"></div>
            <div class="info">支付成功&nbsp;${map.payPrice!0}元</div>
            <div class="tips">
                <p>支付时间：${map.payTime!0}</p>
            </div>
        </div>
        <div class="ewm">
            <div class="thumb"><img src="${map.qrcodeUrl!''}"></div>
            <div class="info">长按扫码关注公众号 了解更多出行优惠</div>
        </div>
    </div>
    
    <script src="/js/zepto.min.js?v=${version!}"></script>
    <script src="/js/simpleui.min.js?v=${version!}"></script>
    <script src="/js/common.min.js?v=${version!}"></script>
    <script>
        $(function() {
        });
    </script>
</body>
</html>