<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>中交出行</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/onlineCar/wait.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<script type="text/javascript">
var costTime=${driverInfo.alreadyDrivingTime!0}
</script>
<body>
       <div id="wait-instant">
           <input type="hidden" name="departLat" id="departLat" value="${driverInfo.departLat!''}">
           <input type="hidden" name="departLng" id="departLng" value="${driverInfo.departLng!''}">
           <input type="hidden" name="tripStatus" id="tripStatus" value="${driverInfo.tripStatus!''}">
           <input type="hidden"  id="arriveLat" value="${driverInfo.arriveLat!''}">
           <input type="hidden" id="arriveLng" value="${driverInfo.arriveLng!''}">

        <header>
            <div class="info">
              	<div class="avatar" style="background-image: url(${driverInfo.driverAvatar!'/res/images/hailing/avatar_driver.png'})"></div>
                <div class="content">
                   <h4>${driverInfo.driverName!'' } · ${driverInfo.providerName!'' }认证网约车司机</h4>
                    <div class="second">
                        <span>${driverInfo.color!''} ·${driverInfo.carDescrible!'' } </span>
                        <span>${driverInfo.carNo}</span>
                    </div>
                    <div class="starbar">
                        <div class="grade"><span>${(driverInfo.star)?string(",##0.0#")}</span></div>
                       	<#list 1..(driverInfo.star?round)!0 as index>
 							<i class="star"></i>
						</#list>
						<#if (5-(driverInfo.star?round) gt 0)>
							<#list 1..(5-driverInfo.star?round)!0 as index>
	 							<i></i>
							</#list>
						</#if>
                    </div>
                </div>
            </div>
            <div class="journey-info">
                <div class="end">
                    <div class="title">目的地</div>
                    <div class="content">
                        <h4>${driverInfo.arriveTitle}</h4>
                        <p id="costTime">已行驶：0分钟0秒</p>
                    </div>
                </div>
            </div>
        </header>
        <div id="allmap"></div>
    </div>
    
	<script src="/js/zepto.min.js?v=${version!}"></script>
	<script src="/js/simpleui.min.js?v=${version!}"></script>
    <script src="/js/vectors.min.js?v=${version!}"></script>
    <!--<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.4&key=cc84bbc40681d10bdf6a924b2caf31d5&plugin=AMap.Driving"></script>-->
       <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.4&key=65b7cb5e8c694cb822cd32791319b348&plugin=AMap.Driving"></script>
    <script type="text/javascript">
        //强制使用https
        var AMapUIProtocol = 'https:';  //注意结尾包括冒号
    </script>
    <!--引入UI组件库（1.0版本） -->
    <script src="https://webapi.amap.com/ui/1.0/main.js?v=${version!}"></script>
    <script src="/js/communicate.min.js?v=${version!}"></script>
    <script src="/js/carOnline/share.js?v=${version!}"></script>
</body>
</html>
