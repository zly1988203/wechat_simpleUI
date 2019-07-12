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
    <link href="/res/style/my/order-detail.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/innerCity/arrivedDestination.css?v=${version!}" rel="stylesheet" type="text/css">
    <!-- start Dplus --><script src="/js/udplus.js"></script><!-- end Dplus -->
</head>
<body>
	<!-- <#include "../foot.ftl"/> -->
	<div class="count-down" style="display: none">请在<span class="minute"></span>分<span class="second"></span>秒内支付，超时未支付订单将自动取消。</div>
	<div class="primary" id="timeout" style="display: none">支付超时，请重新购买。</div>
	<#if orderInformation.orderType?exists && travelLineInfo?exists>
	<#if orderInformation.orderType == 9>
	<div class="travel-detail lineInfo" data-href="/travel/travelLineInfo?lineId=${travelLineInfo.lineId!''}&fromUrl=orderDetail">
        <div class="thumb" style="background-image:url(${travelLineInfo.picUrl!''});"></div>
        <div class="content">
            <h4>${travelLineInfo.lineTitle!''}</h4>
            <a href="javascript:void(0)">查看详情</a>
        </div>
    </div>
    </#if>
    </#if>
	<div class="ticket-info">
        <div class="row">
            <div class="time">${orderInformation.boardingTime1!''}<#if (orderInformation.ifCooperate)?? && (orderInformation.ifCooperate)==1><span class="distribution">${orderInformation.tagName!""}</span></#if></div>
        </div>

        <div class="station sui-border-b">
            <div class="station-item">
                <h4>${orderInformation.departTitle!''}</h4>
            </div>
            <div class="station-item">
                <h4>${orderInformation.arriveTitle!''}</h4>
            </div>
        </div>
        <div class="ticket-rule" data-trigger-rule="#ticketRule">购票/退票规则</div>
    </div>
    
	<!-- 取票/退票规则 - 使用规则 -->
    <div id="ticketRule" class="sui-popup-container">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <div class="rule-content">
                <div class="close-popup close" data-target="ticketRule"></div>
                <h1>购票/退票规则</h1>
                <div class="rule-bar">
                    <div class="content">
                        <P>${orderInformation.content!''}</P>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
	<!-- 公共部分：订单信息 -->
	
	<!--
     	 如果不需要向右的箭头，去掉li.class=sui-cell-link即可
    -->
    <ul class="coupon-btn sui-list">
    	<#if (orderInformation.orderStatusInt)?? &&((orderInformation.orderStatusInt)==4||(orderInformation.orderStatusInt)==1||(orderInformation.orderStatusInt)==2)>
    	<#if ticketList??> 
		<#list ticketList as ticket>
		<#if (ticket.passengerName)?? && ticket.passengerName!=''>
    	<#else>
    	<li class="sui-border-b">
    		<div class="name">乘车人数</div>
    		<div class="value text-gray">${orderInformation.numbers!''}人</div>
    	</li>
    	</#if>
        <#break>
        </#list> </#if>
    	</#if>
        <li class="sui-border-b">
            <div class="name">订单状态</div>
            <#if orderInformation.isRefundFlag??> 
            <#if orderInformation.isRefundFlag == 0>
            <#if orderInformation.orderStatusInt??>
            <#if orderInformation.orderStatusInt==0>
            <div class="value text-gray status">${orderInformation.orderStatus!''}</div>
            <#elseif orderInformation.orderStatusInt==1>
            <div class="value text-gray status">${orderInformation.orderStatus!''}</div>
            <#elseif orderInformation.orderStatusInt==2>
            <div class="value text-gray status">${orderInformation.orderStatus!''}</div>
            <#elseif orderInformation.orderStatusInt==3>
            <div class="value text-gray status">${orderInformation.orderStatus!''}</div>
            <#elseif orderInformation.orderStatusInt==4>
            <div class="value text-gray status">${orderInformation.orderStatus!''}</div>
            <#else>
            <div class="value text-gray status">${orderInformation.orderStatus!''}</div>
            </#if> <#else>
            <div class="value text-gray status">${orderInformation.orderStatus!''}</div>
            </#if> <#elseif orderInformation.isRefundFlag == 1> <#elseif orderInformation.isRefundFlag == 2>
            <div class="value text-gray status">部分退票</div>
            <#elseif orderInformation.isRefundFlag == 3>
            <div class="value text-gray status">全部退票</div>
            <#else> </#if> <#else> </#if>
        </li>
        <li class="sui-border-b coupon-toggle">
            <div class="name">支付方式</div>
            <div class="value text-gray">${orderInformation.payTypeDesc!''}</div>
        </li>
        <li class="sui-border-b coupon-toggle">
            <div class="name">购票张数</div>
            <div class="value text-gray">${orderInformation.numbers!0}张</div>
        </li>
        <li class="sui-border-b coupon-toggle">
            <div class="name">票价总额</div>
            <div class="value text-gray" id="ticketPrice">元</div>
        </li>
        <li class="sui-border-b coupon-toggle" style="display: none;" id="specialPriceDetail">
            <div class="name">${orderInformation.specialActivityName!'特价优惠'}</div>
            <div class="value text-gray">元</div>
        </li>
        <#if (orderInformation.orderStatusInt)?? &&((orderInformation.orderStatusInt)!=2)>
        <li class="sui-border-b coupon-toggle">
            <div class="name">优惠金额</div>
            <div class="value text-gray"  data-id="${orderInformation.couponId!''}" id="couponPriceTxt">元</div>
        </li>
        <li class="sui-border-b coupon-toggle">
            <div class="name">交通意外险</div>
            <div class="value text-gray">${orderInformation.insuranceFee}元</div>
        </li>
        </#if>
        <li>
            <div class="name">订单总额</div>
            <div class="value text-red" id="payPriceTxt">元</div>
        </li>
    </ul>
     <ul class="coupon-btn sui-list" style="display: none;" id="refundDetail"> 
        <li class="sui-border-b">
            <div class="name">退票张数</div>
            <div class="value text-gray">${orderInformation.refundTicketCounts!0}张</div>
        </li>
        <li class="sui-border-b coupon-toggle">
            <div class="name">退票金额</div>
            <div class="value text-gray">${orderInformation.fee!0}元</div>
        </li>
    </ul>
     <ul class="coupon-btn sui-list" style="display: none;" id="refundInsuranceDetail"> 
        <li class="sui-border-b">
            <div class="name">退保张数</div>
            <div class="value text-gray">${orderInformation.refundInsuranceCounts!0}张</div>
        </li>
        <li class="sui-border-b coupon-toggle">
            <div class="name">退保金额</div>
            <div class="value text-gray">${orderInformation.refundInsuranceAmount!0}元</div>
        </li>
    </ul>
    <ul class="coupon-btn sui-list">
        <li class="sui-border-b">
            <div class="name">下单时间</div>
            <div class="value text-gray">${orderInformation.createTimeStr!''}</div>
        </li>
        <li class="sui-border-b coupon-toggle">
            <div class="name">订单编号</div>
            <div class="value text-gray">${orderInformation.orderNo!''}</div>
        </li>
    </ul>
	
	 <!-- 乘车人 -->
    <div class="passenger">
        <div class="content">
        	<#if ticketList?exists>
        	<#list ticketList as ticket>
        	<#if ticket_index == 0>
        	<#if (ticket.passengerName)?? && ticket.passengerName!=''>
	            <div class="item text-gray sui-border-b">
	                <div class="title">乘车人</div>
	                <div class="name">${ticket.passengerName!''}</div>
	                <div class="info">
	               <#if (ticket.passengerMobile)?? && ticket.passengerMobile != ''>
	                    <p><span class="label">手机号</span>${ticket.passengerMobile!''}</p>
	               </#if>     
	                <#if (ticket.idCardNo)?? && ticket.idCardNo != ''>
                    	<p><span class="label">身份证</span>${ticket.idCardNo!''}</p>
                    </#if>
	                </div>
	            </div>
	            </#if>
	            <#else>
	            <#if (ticket.passengerName)?? && ticket.passengerName!=''>
	             <div class="item text-gray sui-border-b">
	                <div class="title"></div>
	                <div class="name">${ticket.passengerName!''}</div>
	                <div class="info">
	               <#if (ticket.passengerMobile)?? && ticket.passengerMobile != ''>
	                    <p><span class="label">手机号</span>${ticket.passengerMobile!''}</p>
	               </#if>     
	                <#if (ticket.idCardNo)?? && ticket.idCardNo != ''>
                    	<p><span class="label">身份证</span>${ticket.idCardNo!''}</p>
                    </#if>
	                </div>
	            </div>
	            </#if>
	           </#if> 
	           </#list>
        	</#if>
        </div>
    </div>
    
    <!--备注-->
    <#if orderInformation.remark!=''>
    <div class="commit-bar">
        <h4>备注</h4>
        <div class="commit-content">${orderInformation.remark}</div>
    </div>
    </#if>
	
    <!-- 仅上车支付 -->
	<#if (orderInformation.orderStatusInt)?? &&(orderInformation.orderStatusInt)==2>
	<#if (ifShow!'0')== '1'>
	<div class="btn-group pab-10">
		<div class="btn default" id="cancel">取消订单</div>
        <div class="btn primary" id="toPay">在线支付</div>
	</div>
	</#if>
	<!-- 等待支付 -->
	<#elseif (orderInformation.orderStatusInt)?? &&(orderInformation.orderStatusInt)==1>
	<div class="btn-group pab-10">
		<div class="btn default" id="cancel">取消订单</div>
        <div class="btn primary" id="confirmPay">确定支付元</div>
	</div>
	<!-- 已支付或者有退票 -->
	<#elseif (orderInformation.orderStatusInt)?? &&((orderInformation.orderStatusInt)==0||(orderInformation.orderStatusInt)==3) >
	<ul class="coupon-btn sui-list">
	<#if insuranceList??&&(insuranceList?size>0)>
        <li class="sui-border-b">
            <div class="name">投保号</div>
            <div class="value text-gray">
            	<#list insuranceList as insurance>
                <p>${insurance.insuranceNo!''}</p>
                </#list>
            </div>
        </li>
     </#if>
    </ul>
	
    <div class="btn-group pab-10">
        <div class="btn default" id="refund">退票</div>
        <div class="btn primary toBuy" id="toBuy">再次购票</div>	
    </div>	
	</#if>
    <#if (orderInformation.orderStatusInt)?? &&(orderInformation.orderStatusInt)==4>
    <div class="btn-group  pab-10">
        <div class="btn primary toBuy">再次购票</div>
    </div>
    </#if>
    
    
    
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
    
	<input type="hidden" id="orderNo" value='${orderInformation.orderNo}' />
	<input type="hidden" id="isHavaShareRedBags" value='${orderInformation.isHavaShareRedBags}' />
	<input type="hidden" id="customrMobile" value='${orderInformation.customrMobile!""}' />
    <input type="hidden" id="settleType" value="${settleType!'1'}">
    <input type="hidden" id="tripDate" value="${tripDate!''}">
    <input type="hidden" id="orderStatusInt" value="${orderInformation.orderStatusInt!0}">
    <input type="hidden" id="orderType" value="${orderInformation.orderType!0}">
    <input type="hidden" id="isRefundFlag" value="${orderInformation.isRefundFlag!0}">
    <input type="hidden" id="refundInsuranceCounts" value="${orderInformation.refundInsuranceCounts!0}">
    <input type="hidden" id="status" value="${orderInformation.status!}">
    <input type="hidden" id="busId" value="${orderInformation.busId!}" placeholder="">
    <input type="hidden" id="price" value="${orderInformation.price!}" placeholder="票价总额+保险金额">
    <input type="hidden" id="insuranceFee" value="${orderInformation.insuranceFee!}" placeholder="保险金额">
    <input type="hidden" id="couponPrice" value="${orderInformation.couponPrice!}" placeholder="优惠券金额">
    <input type="hidden" id="specialPrice" value="${orderInformation.specialPrice!}" placeholder="特价优惠金额">
    <input type="hidden" id="payPrice" value="${orderInformation.payPrice!}" placeholder="金额">

    <input type="hidden" id="countDownTimeStr" value="${countDownTimeStr!''}">
    <input type="hidden" id="countDownTimeStrToShowFirst" value="${countDownTimeStrToShowFirst!''}">
    <input type="hidden" id="couponId" value="${orderInformation.couponId!''}">

    <input type="hidden" id="arriveStationId" value="${orderInformation.arriveStationId!''}" placeholder="目的站点id">
    <input type="hidden" id="departStationId" value="${orderInformation.departStationId!''}" placeholder="出发站点id">
    <input type="hidden" id="arriveStation" value="${orderInformation.arriveStation!''}" placeholder="目的站点名称">
    <input type="hidden" id="departStation" value="${orderInformation.departStation!''}" placeholder="出发站点名称">


	<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/vectors.min.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/bus/order/orderDetail.js?v=${version!}"></script>
    <script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
    <script src="/js/innerCityJs/order/getCoupon.js?v=${version!}"></script>
<script type='text/javascript' src='/adConfig.js?providerId=${orderInformation.providerId}&positionCode=intercity-order-bottom&operatorId=${orderInformation.userId}'></script>
</body>
</html>