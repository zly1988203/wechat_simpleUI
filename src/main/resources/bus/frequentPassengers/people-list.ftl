<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>常用乘车人</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=20170918" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/passenger.css?v=20170918" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="/js/commonJs.js?v=20170918"></script>
</head>
<body>
	<#include "../foot.ftl"/>
	<div class="passenger-list-wrapper">
        <ul class="sui-list passenger-handle sui-list-cover sui-border-b">
            <li class="sui-cell-centerlink add-btn addPassengerButton" onclick="toAdd()">添加乘车人</li>
            <li class="sui-cell-centerlink del-btn delPassengerButton" onclick="toDelete()">删除乘车人</li>
        </ul>
        <ul class="passenger-list sui-list sui-list-cover">
        	<#if (frePassList?size>0) >
        	<#list frePassList as PassengerInfo>
            <li class="sui-border-b">
                <div class="info">
                    <h4>${PassengerInfo.passengerName!''}</h4>
                    <p><em>手机号</em>${PassengerInfo.mobile!''}</p>
                    <p><em>身份证</em>${PassengerInfo.idCardNo!''}</p>
                </div>
                <div class="handle" >
                    <i class="icon-edit editPassengerButton" onclick="toUpdate('${PassengerInfo.id}')"></i>
                </div>
            </li>
            </#list>
			</#if>
		</ul>
    </div>
    <#if (frePassList?size==0) >
    <div class="not-data" style="background-image: url(/res/images/common/icon_no_rider.png);">您当前还未添加乘车人</div>
	</#if>
	

<script>
backtoUrl("/passenger/config.html?v=1.1");
function toAdd(){
	window.location.href="/bus/passengerContactInfo/toAdd";
}
function toUpdate(x){
	
	window.location.href="/bus/passengerContactInfo/toUpdatePage?id="+x;
}
function toDelete(){
	var pageType = 1;
	window.location.href="/bus/passengerContactInfo/toList?pageType="+pageType;
}    
</script>
</body>
</html>