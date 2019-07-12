<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>评价详情</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/onlineCar/wait.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/onlineCar/evaluate.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>
<div id="wait-instant">
    <header>
        <div class="evaluate-container evaluated">
        <div class="star-box">
            <div class="star-info">匿名评价司机</div>
            <div class="star" data-size="max">
                <input type="hidden" id="star1"/>
                 <div class="starbar">
                       	<#list 1..(evaluated.star)!0 as index>
 							 <span class="active"></span>
						</#list>
						<#if (5-evaluated.star gt 0)>
							<#list 1..(5-evaluated.star)!0 as index>
	 							<span></span>
							</#list>
						</#if>
                   </div>
            </div>
            <#if evaluated.tags[0] != "">
            <div class="tag">
            	<#list evaluated.tags as tag>
            		 <span data-value="${tag}" class="active">${tag}</span>
            	</#list>
            </div>
            </#if>
            <div class="others">其他建议：<p>${evaluated.content}</p></div>
            <div class="star-info">您的评价会让我们做的更好</div>
        </div>
       
    </div>
    </header>

    <div class="btn-group">
        <div data-href="/passenger/innerCityOnlineOrderList.html" class="btn">订单列表</div>
        <div data-href="/hail/onlineIndex" class="btn">再次约车</div>
    </div>

    <input type="hidden" id="orderNo" value="${orderNo!''}"/>


<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/communicate.min.js?v=${version!}"></script>
<script src="/js/hail_carOnline/evaluated.js?v=${version!}"></script>

</body>
</html>
