<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>订单详情</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/onlineCar/order-status.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/innerCity/arrivedDestination.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>
<input  id="settleType" type="hidden" value="${settleType!1}">
<input  id="contactPhone" type="hidden" value="${contactPhone!1}">
<input  id="orderNo" type="hidden" value="${orderNo!''}">
<input type="hidden" id="isHavaShareRedBags" value='${isHavaShareRedBags}'/>

<div id="order-detail">
    <div id="allmap"></div>

    <div class="order-detail-container">
        <div class="station-content">
              <div class="station">

             </div>
        </div>
        <!--订单状态-->
        <div class="payment-content sui-border-b"></div>
        <div class="customer-service" data-href="tel:${contactPhone!0}">联系客服</div>
    </div>

</div>

<div class="little-red-packet"></div>
<div class="popup-overlay" ></div>
    <div class="popup" data-show='false'>
    	<div class="direct"></div>
        <div class="red-packet-popup">
            <div class="red-packet-img"></div>
            <div class="red-packet-context1">恭喜您获得10个红包</div>
            <div class="red-packet-context2">分享给好友，大家一起抢</div>
        </div>
        <div class="btn-close-popup"></div>
    </div>

<!--<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.4&key=cc84bbc40681d10bdf6a924b2caf31d5&plugin=AMap.Driving"></script>-->
<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.4&key=65b7cb5e8c694cb822cd32791319b348&plugin=AMap.Driving"></script>
<script src="/js/commonBus.js?v=${version!''}"></script>
<script type="text/javascript" src="/js/vectors.min.js?v=${version!}"></script>
<script src="https://webapi.amap.com/ui/1.0/main.js?v=${version!}"></script>
<script src="/js/communicate.min.js?v=${version!}"></script>
<script type="text/javascript">
    //强制使用https
    var AMapUIProtocol = 'https:';  //注意结尾包括冒号
</script>
<!--引入UI组件库（1.0版本） -->
<script src="/js/coupons/coupons.js?v=${version!}"></script>
<script src="/js/carOnline/onlineCarOrderDetail.js?v=${version!}"></script>
<script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
<script src="/js/innerCityJs/order/getCoupon.js?v=${version!}"></script>

</body>
</html>
