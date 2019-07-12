<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title><#if searchFlag?exists>
			    <#if searchFlag==1>
				     ${departCityName!''} - ${arriveCityName!''}
				<#else>
					${lineName!""}                   		
				</#if>
     		</#if>
     </title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!''}" rel="stylesheet" type="text/css">
	<link href="/res/style/base/vectors.2.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/commute/line-list-2.css?v=${version!''}" rel="stylesheet" type="text/css">
</head>

<body>
	<!-- <#include "foot.ftl"/> -->
	<#assign sizeFlag="1"/>
    <ul class="ola-list-box">
    	<#if baseBusList?exists> 
		   <#list baseBusList as item> 
		   	<#if item.buyFlag==1>
		   		<#assign sizeFlag="2"/>
		       <li class="lineItem sui-border">
		       	<div class="ola-head sui-border-b">
		       		  <#if item.activityTag?exists>
                    <#if (item.activityTag?size > 0)>
		       		<div class="line-labels">
                    <span class="label-right">约${item.useTime!""}分钟</span>
	                    <#list item.activityTag as activityTag>
	                    	<span class="discount-name">${activityTag!""}</span>
				        </#list>
              	   </div>
				   <#else>
					     <#if searchFlag?exists>
				         <#if searchFlag == 1>
					        <div class="ola-tips">约${item.useTime!""}分钟</div>
	                     </#if>
	                     </#if>
                    </#if>
                    </#if>
		            <div class="ola-station">
		                <div class="ola-station-item">
		                    <div class="ola-station-info">
		                        <h4>${item.departStation!""}
		                        <#if item.stationSortNo?exists>
			                        <#if item.stationSortNo==1>
			                        	<i class="starting">始发</i>
			                        </#if>
			                        <#if item.stationSortNo!=1>
			                        	<i class="pathway">途经</i>
			                        </#if>
		                        </#if>
		                        <if searchFlag?exists>
			                        <#if searchFlag==2>
			                        <i class="starting">始发</i>
			                        </#if>	
		                        </h4>
		                    </div>
		                    <#if searchFlag?exists>
		                    	<#if searchFlag==1>
		                    		<div class="ola-station-distance">
		                    		<#if item.departDistance?exists>
		                    			<#if (item.departDistance>=1)>
		                    				距上车点${item.departDistance!""}公里
		                    			<#else>
		                    			
		                    			步行${(item.departDistance*1000)}米上车
		                    			</#if>
		                    		</#if>
		                    		</div>
		                    	<#else>
			                    	<#if item.activityTag?size=0>
			                    	<div class="ola-tips">约${item.useTime!""}分钟</div>
			                    	</#if>
		                    	</#if>
		                    </#if>
		                </div>
		                <div class="ola-station-item">
		                    <div class="ola-station-info">
		                        <h4>${item.arriveStation!""}</h4>
		                    </div>
		                     <#if searchFlag?exists>
		                       <#if searchFlag==1>
		                    		<div class="ola-station-distance">
			                    		<#if item.arriveDistance?exists>
			                    			<#if (item.arriveDistance>=1)>
			                    				下车距终点${item.arriveDistance!""}公里
			                    			<#else>
			                    				下车需步行${(item.arriveDistance*1000)}米
			                    			</#if>
			                    		</#if>
		                    		</div>
		                    	</#if>
		                    </#if>	
		                </div>
		            </div>
		            <#if item.tagList?exists>
		       		<#if (item.tagList?size > 0)>
		            <div class="ola-label">
		            	<#list item.tagList as tag>
		                	<span>${tag!""}</span>
		                </#list>
		            </div>
		            </#if>
		            </#if> 
		            </div>
		            <#assign count=0/>
		            <ul class="sui-list-link ola-ticket">
		            	<#list item.sameStationBusList as sameStationItem> 
		            		<#if sameStationItem.buyFlag==1>
		            		<#assign count=count+1/>
			                <li class="ola-ticket-item sui-border-b sell"  busId="${sameStationItem.idStr!}">
			                    <div class="ola-ticket-info">
			                        <h4>
			                        <#if sameStationItem.departTime?exists>
			                       		 ${sameStationItem.departTime?string('HH:mm')}
			                        </#if>
			                        </h4>
			                         <#if sameStationItem.specialState?exists>
			                        	<#if sameStationItem.specialState==1>
			                        		<span class="special-icon">特价</span>
			                        	</#if>
			                   		</#if>
			                    </div>
			                     <#if sameStationItem.specialPrice?exists>
			                    	<#if (sameStationItem.specialPrice < sameStationItem.sellPrice)>
			                        <div class="ola-ticket-btn"><em class="original">${sameStationItem.sellPrice!"错误价格"}元</em>${sameStationItem.specialPrice!"错误价格"}元</div>
			                        <#else>
			                        <#if (sameStationItem.specialPrice > sameStationItem.sellPrice)>
			                        <div class="ola-ticket-btn">${sameStationItem.specialPrice!"错误价格"}元
				                    </div>
			                        </#if>
			                        </#if>
			                       <#else>
			                       <div class="ola-ticket-btn">${sameStationItem.sellPrice!"错误价格"}元</div>
			                     </#if>
			                     <#if (sameStationItem.lineType!'0')=='1'>
				                   <em>起</em>
				                 </#if>
			                </li>
			              </#if>
			          </#list> 
			          <#list item.sameStationBusList as sameStationItem>     
			                <#if sameStationItem.buyFlag==2>
			                <li class="ola-ticket-item sui-border-b sell-out">
			                    <div class="ola-ticket-info">
			                        <h4>
			                        <#if sameStationItem.departTime?exists>
			                       		 ${sameStationItem.departTime?string('HH:mm')}
			                        </#if>
			                        </h4>
			                    </div>
			                    <div class="ola-ticket-btn">
			                    	<i>¥</i>${sameStationItem.sellPrice!"错误价格"}
			                    		<#if (sameStationItem.lineType!'0')=='1'>
			                    			<em>起</em>
			                    		</#if>	
			                    </div>
			                </li>
			                </#if>
		                </#list> 
		            </ul>
		            <#if item.sameStationBusList?exists>
		       		<#if (item.sameStationBusList?size>3)>
		            	<div class="all show-all">显示全部</div>
		            </#if>
		            </#if> 
		        </li>
		        </#if>
		        </#list>
		        
		        <!-- 无可售 -->
		</#if>
	<#if sizeFlag=='1'>
    <div class="empty-page">
        <div class="empty-main">
            <i style="padding-top: 43.07%; background-image: url(/res/images/common/icon_defect_line.png);"></i>
            <p>暂时没有找到合适的线路<br>换个地点再试试吧</p>
            <div class="btn primary" id="backIndex">返回首页</div>
        </div>
    </div>
    </#if>

<script src="/js/commonBus.js?v=${version!''}"></script>
<script>
var qrcId = "${qrcId!''}";
    $(function() {
    	$('#backIndex').on('click',function(){
    		window.location.href = "/commuteIndex?token="+$.cookie('token');
 		});
        $(".sell").click(function(){
        	window.location.href='/commute/toLineDetail?busId='+$(this).attr('busId') + "&qrcId=" + qrcId;
        })
        
        $('.ola-foot-item').on('click', function () {
            var href = $(this).data('href');
            if (href && href != '#') {
                location.href = href;
            }
        });
        
        //switch全部
        $('.show-all').on('click', function () {
           var el = $(this);
        	if(el.html() == '显示全部'){
        		 //show
                el.data('clock', true);
                el.addClass('somersault');
                el.siblings('.ola-ticket').addClass('slideToggle');
                el.html('收起列表');
        	}else if(el.html() == '收起列表'){
        		el.data('clock', false);
        		el.removeClass('somersault');
        		el.siblings('.ola-ticket').removeClass('slideToggle');
        		el.html('显示全部');
        	}
        });
    });
</script>
</body>
</html>