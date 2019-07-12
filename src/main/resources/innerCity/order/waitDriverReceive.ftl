<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <!--<#if (orderInfo.status!0) == 4>-->
    <!--<title>等待接驾</title>-->
    <!--</#if>-->
    <!--<#if (orderInfo.status!0) == 5>-->
    <!--<title>等待上车</title>-->
    <!--</#if>-->
    <meta name="viewport"
          content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1"/>
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/innerCity/order-common.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/innerCity/waitGoTravel.css?v=${version!}" rel="stylesheet" type="text/css">

</head>

<body>
<input type="hidden" id="orderType" value="${orderInfo.orderType!}">
<input type="hidden"  id="arriveDepartTime"  value="${orderInfo.arriveDepartTime!''}">
<!--行程状态 1-发起行程  2-等待接单  3-待执行 4-去接乘客 5-到达出发地 6-接到乘客，去往目的地  7-到达目的地 8-已完成 9-已取消  10:发起收款-->
<input type="hidden"  id="tripStatus" placeholder="行程状态"  value="${orderInfo.tripStatus!''}">

<!--地图请保持在前面-->
<div class="ola-maps amap-container" id="allmap"></div>
<div class="main-container">
    <!--司机信息 行程信息-->
    <#include "driverInfoContainer.ftl">

    <div class="driver-foot">

        <div class="btn-group btn-group-not-paid">
            <div class="btn btn-default" id="back">返回</div>
            <div class="btn btn-default" id="contacts">紧急求助</div>
            <div class="btn btn-primary" id="pay" style="display: none">立即支付</div>
            <div class="btn btn-default" id="more">更多</div>
        </div>

    <!-- 更多操作 -->
    <div id="morePanel" class="bottom-container more-service-container" style="display:none;">
        <ul>
            <li id="share">分享行程</li>
            <li id="contactCall">联系客服</li>
            <li id="suggestBtn">投诉建议</li>
            <li id="close" class="close-more-service">取消</li>
        </ul>
    </div>
    </div>

    <!--支付面板 -->
    <#include "payPanelContainer.ftl">

    <!--分享-->
    <div class="share-box" style="display: none">
        <div class="share-tips"></div>
    </div>

    <!--&lt;!&ndash;计价规则&ndash;&gt;-->
    <#include "/priceDetailPopup.ftl">
</div>

<div class="black_overlay" style="display: none;"></div>

<script type="text/javascript"
        src="https://webapi.amap.com/maps?v=1.4.4&key=65b7cb5e8c694cb822cd32791319b348&plugin=AMap.Driving"></script>
<script src="https://webapi.amap.com/ui/1.0/main.js?v=${version!}"></script>
<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
<script type="text/javascript" src="/js/shareConfig.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/coupons/coupons.js?v=${version!}"></script>
<script src="/js/innerCityJs/order/commonInnerCity.js?v=${version!}"></script>
<script src="/js/innerCityJs/order/waitDriverReceive.js?v=${version!}"></script>
</body>
</html>
