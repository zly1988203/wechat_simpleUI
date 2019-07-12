<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>验票</title>
    <meta name="viewport"
          content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/swiper.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/coach/checkQrcode.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>
<div class="check-content">
        <div class="swiper-container">
            <div class="swiper-wrapper">

            </div>
            <div class="swiper-pagination" style="display: block"></div>
        </div>
        <div class="no-ticket-check" style="display: none">
            <div class="check-msg">
                由于系统异常或没有符合可验条
                件的乘车二维码
                请到订单中心-订单详情中查看
            </div>
        </div>
</div>
<div class="footer">
    <div class="btn-back">返回</div>

</div>

</body>
<script src="/js/zepto.min.js"></script>
<script src="/js/simpleui.min.js"></script>
<script src="/config.js"></script>
<script type="text/javascript" src="/js/vectors.min.js?v=${version!}"></script>
<script type="text/javascript" src="/js/commonjs/swiper.min.js"></script>
<script type="text/javascript" src="/js/commonjs/qrcode.min.js?v=${version!}"></script>
<script type="text/javascript" src="/js/busTicket/order/checkQrcode.js?v=${version!}"></script>
</html>
