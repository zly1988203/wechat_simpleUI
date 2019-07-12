<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>

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
<!--地图请保持在前面-->
<div class="ola-maps amap-container" id="allmap"></div>
<div class="main-container">
    <!--司机信息 行程信息-->
    <#include "driverInfoContainer.ftl">

    <div class="driver-foot">
        <div class="btn-group btn-group-not-paid">
            <div class="btn btn-default" id="back">返回</div>
            <div class="btn btn-default" id="more">更多</div>
        </div>

        <!-- 更多操作 -->
        <div id="morePanel" class="bottom-container more-service-container" style="display:none;">
            <ul>
                <li id="contactCall">联系客服</li>
                <li id="suggestBtn">投诉建议</li>
                <li id="close" class="close-more-service">取消</li>
            </ul>
        </div>
    </div>

    <!--支付面板 -->
    <#include "payPanelContainer.ftl">

    <!--&lt;!&ndash;计价规则&ndash;&gt;-->
    <#include "/priceDetailPopup.ftl">
</div>

<div class="black_overlay" style="display: none;"></div>

<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/simpleui.min.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/coupons/coupons.js?v=${version!}"></script>
<script src="/js/hail_innerCity/order/commonInnerCity.js?v=${version!}"></script>
<script src="/js/hail_innerCity/order/waitGoTravel.js?v=${version!}"></script>
</body>
</html>
