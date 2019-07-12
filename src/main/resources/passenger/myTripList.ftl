<#include "/_framework.ftl">
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>行程</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=20171031" rel="stylesheet" type="text/css">
    <link href="/res/style/my/tripList.css?v=${version}" rel="stylesheet" type="text/css">
</head>
<#--<style>
    body, html{height:auto;}
    .trip-container{min-height: 83vh;}
    .trip-container>ul>li ul li.trip-item .trip-top .top-left .start-time,
    .trip-container>ul>li ul li.trip-item .trip-bottom,
    .trip-container>ul>li ul li.trip-item .trip-top .trip-status{font-size:.24rem;}
    .trip-container>ul>li ul li.trip-item .trip-bottom .trip-buttons .button{width: .96rem;line-height: .5rem;margin-right: .1rem;text-align: center;}
    .handle-list{position: fixed;bottom: 0;padding: .2rem;z-index: 10}
    .handle-list .handle{background: #fff;box-shadow: 0 0 .2rem 0 hsla(0,0%,89%,.4);border-radius: .06rem;font-size: .32rem;color: #aaa;letter-spacing: 0;text-align: center;padding: .15rem .4rem}
    .handle-list .handle:active{background: #ccc}
</style>-->
<body>
<div class="trip-container">
    <div class="noTrip">
        <img  src="/res/images/cityBus/noTrip.png">
        <div>你没有待乘车行程～</div>
    </div>
    <ul id="tripLi">
    </ul>
</div>
<div class="handle-list">
    <div class="handle">返回</div>
</div>
<!--  底部 -->
<#include "/_footer.ftl">
<script src="/js/commonBus.js?v=${version!}"></script>
<script src="/js/commonjs/babel.min.js"></script>
<script src="/js/commonjs/polyfill.min.js"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/commonjs/util.js?v=${version!}"></script>
<script src="/js/commonjs/commonShare.js?v=${version}"></script>  <!-- 分享 -->
<script src="/js/shareConfig.js?v=${version}"></script>
<script src="/js/personalCenter/tripList.js?v=${version!}"></script>
<#--<script src="/js/commonjs/footer.js?v=${version}"></script>-->
</body>
</html>