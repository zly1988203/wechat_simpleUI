<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>线路介绍</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/travel/line-introduce.css?v=${version!}" rel="stylesheet" type="text/css">
</head>
<body>
    <div class="introduce">
        <div class="head">
            <div class="thumb" style="background-image:url(${busLineInfo.picUrl!""});"></div>
            <h4>${busLineInfo.lineTitle!""}</h4>
            <div class="line-label">
            
           <#list busLineInfo.busLineTagList as busLineTag>     
    	   
        	<span>${busLineTag.tagName!""}</span>
 
    	   </#list>  
               <!-- <span>有WIFI</span>
                <span>漯河车队 联系电话：18655567778</span>
                <span>有厕所</span>-->
            </div>
        </div>
       <!-- 导航 -->
        <ul class="nav">
        	<#if busLineInfo.lineIntroStr??&&busLineInfo.lineIntroStr!="">
            	<li class="item"><a href="#page1">产品特色</a></li>
            	<#else>
            	<li class="item" style="display: none;"><a href="#page1">产品特色</a></li>
            </#if>
            <#if busLineInfo.lineTripIntroStr??&&busLineInfo.lineTripIntroStr!="">
            	<li class="item"><a href="#page2">行程安排</a></li>
            	<#else>
            	<li class="item" style="display: none;"><a href="#page2">行程安排</a></li>
             </#if>
            <#if busLineInfo.linePriceIntroStr??&&busLineInfo.linePriceIntroStr!="">
            	<li class="item"><a href="#page3">费用说明</a></li>
            	<#else>
            	<li class="item" style="display: none;"><a href="#page3">费用说明</a></li>
            </#if>
             <#if busLineInfo.lineBuyGuideStr??&&busLineInfo.lineBuyGuideStr!="">
            	<li class="item"><a href="#page4">购买须知</a></li>
            	<#else>
            	<li class="item" style="display: none;"><a href="#page4">购买须知</a></li>
            </#if>
        </ul>
        <!-- page -->
        <div class="page-wrapper">
            <div class="page" id="page1">
        	<#if busLineInfo.lineIntroStr??&&busLineInfo.lineIntroStr!="">
                <h5>产品特色</h5>
                 <p>${busLineInfo.lineIntroStr!""}</p>
             </#if>
            </div>
            <div class="page" id="page2">
            <#if busLineInfo.lineTripIntroStr??&&busLineInfo.lineTripIntroStr!="">
                <h5>行程安排</h5>
              <p>${busLineInfo.lineTripIntroStr!""}</p> 
            </#if>
            </div>
            <div class="page" id="page3">
            <#if busLineInfo.linePriceIntroStr??&&busLineInfo.linePriceIntroStr!="">
                <h5>费用说明</h5>
                <p>${busLineInfo.linePriceIntroStr!""}</p>
            </#if>
            </div>
            <div class="page" id="page4">
            <#if busLineInfo.lineBuyGuideStr??&&busLineInfo.lineBuyGuideStr!="">
                <h5>购买须知</h5>
                <p> ${busLineInfo.lineBuyGuideStr!""}</p>
            </#if>
            </div>
        </div>
		
        <!-- 返回按钮 -->
        <div class="btn-group">
            <div class="btn primary toLineList" style="display: none;">返回选择班次</div>
        </div>
        <div class="btn-group">
            <div class="btn primary toLineDetail" style="display: none;">返回继续购票</div>
        </div>
        <div class="btn-group">
            <div class="btn primary toOrderDetail" style="display: none;">返回订单详情</div>
        </div>
    </div>
    
	<script src="/js/zepto.min.js?v=${version!}"></script>
	<script src="/js/simpleui.min.js?v=${version!}"></script>
    <script src="/js/vectors.min.js?v=${version!}"></script>
    <script src="/js/stickUp.min.js?v=${version!}"></script>
    <script type="text/javascript">
        Zepto(function($) {
            $(document).ready( function() {
            	$('.nav .item').eq(0).addClass('active');
            	
                $('.nav').stickUp({
                    parts: {
                        0:'page1',
                        1:'page2',
                        2: 'page3',
                        3: 'page4'
                    },
                    itemClass: 'item',
                    itemHover: 'active',
                    topMargin: 'auto'
                });
                //自定义定位
                var nav_h = $('.nav').height();
                $('.nav a').on('click', function (e) {
                    e.preventDefault();
                    var self = $(this),
                        id = self.attr('href');
                    var offsetTop = $(id).offset().top;

                    $(window).scrollTop(offsetTop - nav_h)
                    self.parent().addClass('active').siblings().removeClass('active');
                });
            });
        });
        $(function(){
        	var fromUrl = "${fromUrl!''}";
        	if(fromUrl == 'toLineList'){
        		$('.toLineList').show();
        	}else if(fromUrl == 'orderDetail'){
        		$('.toOrderDetail').show();
        	}else if(fromUrl == 'lineDetail'){
        		$('.toLineDetail').show();
        	}
        	$('.toLineList').off('click').on('click',function(){
        		var fromUrl = localStorage.getItem("travelLineList");
        		location.href = fromUrl;
        	});
        	$('.toLineDetail').off('click').on('click',function(){
        		var fromUrl = localStorage.getItem("travelLineDetail");
        		location.href = fromUrl;
        	});
        	$('.toOrderDetail').off('click').on('click',function(){
        		var fromUrl = localStorage.getItem("travelOrderDetail");
        		location.href = fromUrl;
        	});
        })
    </script>
</body>
</html>

