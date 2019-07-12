<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>验票</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/my/e-ticket-citybus.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/cityBus/showTicket.css?v=${version!}" rel="stylesheet" type="text/css">
</head>
<style>
    footer{width: 100%;position: fixed;bottom: 0;}
</style>

<body>
<div class="header-tips" style="display: none"></div>
<div class="order-container">
    <div class="order-content">
        <!--理论上只有一个item-->
    <#--<div class="order-item">-->
    <#--<div class="order-top">-->
    <#--<div class="head">-->
    <#--<div class="time">2019年1月21日 18:55</div>-->
    <#--<div class="line-name">LXC123</div>-->
    <#--<div class="license-plate">粤B76527</div>-->
    <#--</div>-->
    <#--<div class="station">-->
    <#--<div class="station-item departure">车陂南地铁站C口车陂南地铁站C口车陂南地铁站C口车陂南地铁站C口</div>-->
    <#--<div class="station-item arrival">深大地铁站A3口</div>-->
    <#--</div>-->
    <#--</div>-->
    <#--<div class="checkanimat">动态电子票动画</div>-->
    <#--<div class="order-bottom">-->
    <#--<!--<div class="slider-box">-->
    <#--<div class="ticket-list slider">-->
    <#--<ul class="slider-main clearfloat">-->
    <#--<li>-->
    <#--<div class="check-in-tips">验票码1</div>-->
    <#--<div class="check-in-code">8976</div>-->
    <#--<div class="ticket-info">-->
    <#--<div>票号：876553223455555</div>-->
    <#--<div>姓名：张三</div>-->
    <#--<div>身份证：4415***********975</div>-->
    <#--</div>-->
    <#--<div class="status checked"></div>-->
    <#--</li>-->
    <#--<li>-->
    <#--<div class="check-in-tips">验票码2</div>-->
    <#--<div class="check-in-code">8976</div>-->
    <#--<div class="ticket-info">-->
    <#--<div>票号：876553223455555</div>-->
    <#--<div>姓名：张三</div>-->
    <#--<div>身份证：4415***********975</div>-->
    <#--</div>-->
    <#--<div class="status toride"></div>-->
    <#--</li>-->
    <#--<li>-->
    <#--<div class="check-in-tips">验票码3</div>-->
    <#--<div class="check-in-code">8976</div>-->
    <#--<div class="ticket-info">-->
    <#--<div>票号：876553223455555</div>-->
    <#--<div>姓名：张三</div>-->
    <#--<div>身份证：4415***********975</div>-->
    <#--</div>-->
    <#--<div class="status refunded"></div>-->
    <#--</li>-->
    <#--</ul>-->
    <#--</div>-->
    <#--<div class="list-index"><span class="active"></span><span></span><span></span></div>-->
    <#--</div>&ndash;&gt;-->
    <#--</div>-->
    <#--</div>-->
    </div>
</div>

<div id="heightPoint"></div>
<div class="handle-list">
    <div class="handle" id="goBack">返回</div>
</div>
<!--  底部 -->
<#include "/_footer.ftl">

<script src="/js/commonBus.js?v=${version!}"></script>
<script src="/js/commonjs/babel.min.js"></script>
<script src="/js/commonjs/polyfill.min.js"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/commonjs/util.js?v=${version!}"></script>
<script src="/js/flightchart.min.js?v=${version!}"></script>
<script src="/js/commonjs/commonShare.js?v=${version}"></script>  <!-- 分享 -->
<script src="/js/shareConfig.js?v=${version}"></script>
<script src="/js/cityBus/showTicket.js?v=${version!}"></script>
<#--<script src="/js/commonjs/footer.js?v=${version}"></script>-->
</body>
</html>