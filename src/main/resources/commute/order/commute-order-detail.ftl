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
	<link href="/res/style/simpleui.min.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!''}" rel="stylesheet" type="text/css"> 
    <link href="/res/style/commute/order-detail.css?v=${version!''}" rel="stylesheet" type="text/css">  
    <link href="/res/style/innerCity/arrivedDestination.css?v=${version!}" rel="stylesheet" type="text/css">
    <!-- start Dplus --><script src="/js/udplus.js"></script><!-- end Dplus -->
</head>

<body>

	<!-- <#include "../foot.ftl"/> -->
	<div class="count-down" style="display: none">请在<span class="minute"></span>分<span class="second"></span>秒内支付，超时未支付订单将自动取消。</div>
	<div class="primary" id="timeout" style="display: none">支付超时，请重新购买。</div>
	<div class="ticket-info">
        <div class="row">
            <div class="time">${orderInformation.boardingTime1!''}</div>
        </div>
        <div class="station sui-border-b">
         	<div class="station-item">
                <h4 id="departTitle">${orderInformation.departTitle!''}</h4>
            </div>
            <div class="station-item">
                <h4 id="arriveTitle">${orderInformation.arriveTitle!''}</h4>
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
            <div class="name">购票天数</div>
            <div class="value text-gray">${orderInformation.days!''}天</div>
        </li>
        <li class="sui-border-b coupon-toggle">
            <div class="name">票价总额</div>
            <div class="value text-gray" id="ticketPrice">元</div>
        </li>
        <li class="sui-border-b coupon-toggle" style="display: none;" id="specialPriceDetail">
            <div class="name">${orderInformation.specialActivityName!'特价优惠'}</div>
            <div class="value text-gray" id="specialPriceStr">元</div>
        </li>
        <li class="sui-border-b coupon-toggle">
            <div class="name">优惠金额</div>
            <div class="value text-gray" id="couponPriceStr" data-id="${orderInformation.couponId!''}">${orderInformation.couponPrice!''}元</div>
        </li>
        <li>
            <div class="name">订单总额</div>
            <div class="value text-red" id="payPrice">元</div>
        </li>
    </ul>
    
    <ul class="coupon-btn sui-list" style="display: none;" id="refundDetail"> 
        <li class="sui-border-b">
            <div class="name">退票张数</div>
            <div class="value text-gray">${orderInformation.refundTicketCounts!0}天</div>
        </li>
        <li class="sui-border-b coupon-toggle">
            <div class="name">退票金额</div>
            <div class="value text-gray">${orderInformation.fee!0}元</div>
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
    
    <ul class="coupon-btn sui-list">
        <li class="sui-border-b">
            <div class="name">乘车日期</div>
            <div class="value passenger-date text-gray">
            	<#if ticketList??&&(ticketList?size>0)>
             	<#list ticketList as item>
             	<!-- 已支付/有退款 -->
             	<#if (orderInformation.orderStatusInt)?? &&((orderInformation.orderStatusInt)==0||(orderInformation.orderStatusInt)==3)>
              	<#if (item.status) == 2>
               	<span>${item.departDateDesc!''}(已退票)</span>
             	</#if>
              	<#if (item.status) != 2>
              	<span>${item.departDateDesc!''}</span>
              	</#if>
              	<!-- 等待支付、已关闭 -->
              	<#elseif (orderInformation.orderStatusInt)?? &&((orderInformation.orderStatusInt)==1||(orderInformation.orderStatusInt)==4)>
              	<span>${item.departDateDesc!''}</span>
              	</#if>
             	</#list>
             	</#if>
            </div>
        </li>
    </ul>
	<!-- 等待支付 -->
	<#if (orderInformation.orderStatusInt)?? &&(orderInformation.orderStatusInt)==1>
	<div class="btn-group pab-10">
		<div class="btn default" id="cancel">取消订单</div>
        <div class="btn primary" id="confirmPay">确定支付元</div>
	</div>
	<!-- 已支付或者有退票 -->
	<#elseif (orderInformation.orderStatusInt)?? &&((orderInformation.orderStatusInt)==0||(orderInformation.orderStatusInt)==3) >
    <div class="btn-group pab-10">
        <div class="btn default" id="refund">退票</div>
        <div class="btn primary" id="toBuy">再次购票</div>	
    </div>
    <!-- 已关闭 -->
	<#elseif (orderInformation.orderStatusInt)?? &&(orderInformation.orderStatusInt)==4>	
	<div class="btn-group pab-10">
        <div class="btn primary" id="toBuy">再次购票</div>	
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

    <input type="hidden" id="busId" value='${orderInformation.busId!}' />
    <input type="hidden" id="departStationId" value='${ticketList[0].departStationId!}' />
    <input type="hidden" id="arriveStationId" value='${ticketList[0].arriveStationId!}' />
	<input type="hidden" id="toMapOrderNo" value='${orderInformation.orderNo!}' />
	<input type="hidden" id="orderNo" value='${orderInformation.orderNo!}' />
	<input type="hidden" id="isHavaShareRedBags" value='${orderInformation.isHavaShareRedBags!}' />
	<input type="hidden" id="customrMobile" value='${orderInformation.customrMobile!""}' />
    <input type="hidden" id="isRefundFlag" value="${orderInformation.isRefundFlag!0}">
    <input type="hidden" id="orderStatusInt" value="${orderInformation.orderStatusInt!''}">
    <input type="hidden" id="settleType" value="${settleType!'1'}">
    <input type="hidden" id="status" value="${orderInformation.status!0}">
    <input type="hidden" id="couponId" value="${orderInformation.couponId!''}">
    <input type="hidden" id="autoShowPay" value="${autoShowPay!''}">
    <input type="hidden" id="tripDate" value="${tripDate!''}">
    <input type="hidden" id="countDownTimeStr" value="${countDownTimeStrToShowFirst!''}">
    <!--<input type="hidden" id="countDownTimeStrToShowFirst" value="${countDownTimeStrToShowFirst!''}">-->

    <input type="hidden" id="price" value="${orderInformation.price!''}"  placeholder="票价总额"/>
    <input type="hidden" id="couponPrice" value="${orderInformation.couponPrice!''}" placeholder="优惠券金额"/>
    <input type="hidden" id="specialPrice" value="${orderInformation.specialPrice!''}" placeholder="特价优惠金额"/>

	<script type="text/javascript" src="/js/commonJs.js?v=${version!''}"></script>
    <script type="text/javascript" src="/js/vectors.min.js?v=${version!''}"></script>
    <script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/commute/order/commuteOrderDetail.js?v=${version!''}"></script>
    <script src="/js/innerCityJs/order/getCoupon.js?v=${version!}"></script>
    <script type='text/javascript' src='/adConfig.js?providerId=${orderInformation.providerId}&positionCode=intercity-order-bottom&operatorId=${orderInformation.userId}'></script>

</body>
</html>