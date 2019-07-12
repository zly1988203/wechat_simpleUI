<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>等待接驾</title>
<meta name="viewport"
	content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
<meta name="format-detection" content="telephone=no">
<meta name="format-detection" content="email=no">
<meta http-equiv="X-UA-Compatible" content="chrome=1" />
<link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
<link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
<link href="/res/style/onlineCar/wait.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>
	<div id="wait-instant">
		<header>
			<input type="hidden" name="star" id="star" value="${driverInfo.star!''}">
			<input type="hidden" name="orderNo" id="orderNo" value="${driverInfo.orderNo!''}">
			<input type="hidden" name="tripStatus" id="tripStatus" value="${driverInfo.tripStatus!''}">
			<input type="hidden" name="timeOne" id="timeOne" value="${driverInfo.timeOne!''}">
			<input type="hidden" name="departLat" id="departLat" value="${driverInfo.departLat!''}">
			<input type="hidden" name="departLng" id="departLng" value="${driverInfo.departLng!''}">
			<input type="hidden" name="cancelType" id="cancelType" value="${driverInfo.cancelType!0}">

			<input type="hidden" name="driverName" id="driverName" value="${driverInfo.driverName!0}">
			<input type="hidden" name="arriveDepartTime" id="arriveDepartTime" value="${driverInfo.arriveDepartTime!0}">

			<div class="info">
				<div class="avatar" style="background-image: url(${driverInfo.driverAvatar!'/res/images/hailing/avatar_driver.png'})"></div>
				<div class="content">
					<h4>${driverInfo.driverName!'' }·${driverInfo.providerName!'' }认证网约车司机</h4>
					<div class="second">
						<span>${driverInfo.color!'' } ·${driverInfo.carDescrible!'' }
						</span> <span>${driverInfo.carNo!''}</span>
					</div>
					<div class="starbar">
						<div class="grade">
							<span>${(driverInfo.star)?string(",##0.0#")}</span>
						</div>
						<#list 1..(driverInfo.star?round)!0 as index> <i class="star"></i>
						</#list> <#if (5-(driverInfo.star?round) gt 0)> <#list
						1..(5-driverInfo.star?round)!0 as index> <i></i> </#list> </#if>
					</div>
				</div>
				<div class="tel" id="tel"></div>
			</div>
			<div class="tips" id="tips"></div>
		</header>
		<div id="allmap"></div>

		<!-- 更多操作 -->
		<div id="more"></div>
		<div class="more-modal">
			<ul>
				<li class="cancel-order">取消订单</li>
				<li data-href="tel:${driverInfo.contactPhone!'' }">联系客服</li>
			</ul>
		</div>
	</div>

	<script type="text/javascript"
		src="https://webapi.amap.com/maps?v=1.4.4&key=65b7cb5e8c694cb822cd32791319b348&plugin=AMap.Driving"></script>
	<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
	<script type="text/javascript">
        //强制使用https
        var AMapUIProtocol = 'https:';  //注意结尾包括冒号
    </script>
	<!--引入UI组件库（1.0版本） -->
	<script src="https://webapi.amap.com/ui/1.0/main.js?v=${version!}"></script>
	<script src="/js/communicate.min.js?v=${version!}"></script>
	<script src="/js/hail_carOnline/waitInstant.js?v=${version!}"></script>
</body>
</html>
