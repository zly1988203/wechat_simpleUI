<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/commutingBus/checkTicket.css?v=${version}" rel="stylesheet" type="text/css">
</head>
<body>
<div class="header-tips" style="display: none"></div>
<div class="order-content">

</div>
<div id="heightPoint"></div>
<div class="handle-list">
    <div class="handle" id="goBack">返回</div>
</div>

<!--  底部 -->
<#include "/_footer.ftl">
<script src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/commonjs/swiper.min.js"></script>
<script src="/js/commonjs/jweixin-1.4.0.js"></script>
<script src="/js/commonjs/util.js"></script>
<script src="/js/shareConfig.js?v=${version}"></script>
<script src="/js/commutingBus/serverApi.js?v=${version}"></script>
<script src="/js/commutingBus/checkTicket.js?v=${version}"></script>
</body>
</html>