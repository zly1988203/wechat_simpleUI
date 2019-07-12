<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>我的订单</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/common.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/multi-service.css?v=${version!}" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
</head>

<body>
	<#include "../foot.ftl"/>
    <div class="multi-service">
         <#if businessTypes.hasBus?exists>
             	<#if businessTypes.hasBus==1> 
                	<div class="item" data-href="/passenger/order-list.html" style="background-image:url(/res/images/bus/icon_bus_order.png);"></div>
                </#if> 
         </#if>
         <#if businessTypes.hasInterCity?exists>
             	<#if businessTypes.hasInterCity==1> 
                	<div class="item" data-href="/passenger/innerCityOrder.html" style="background-image:url(/res/images/bus/icon_intercity.png);"></div>
                </#if> 
         </#if>
         <#if businessTypes.hasTaxi?exists>
             	<#if businessTypes.hasTaxi==1> 
                	<div class="item" data-href="/passenger/myorder.html" style="background-image:url(/res/images/bus/icon_taxi_orders.png);"></div>
                </#if> 
         </#if>
    </div>

<script>
    $(function() {
		backtoUrl('/passenger/my/my.html');
    });
</script>
</body>
</html>