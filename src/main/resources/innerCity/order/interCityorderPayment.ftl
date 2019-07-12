<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/>
    <meta http-equiv="Pragma" content="no-cache"/>
    <meta http-equiv="Expires" content="0"/>
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/innerCity/order/inerCityoderPayment.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<input id="payMode" type="hidden" value="${orderInformation.payMode!0}">
<input id="tipsMessage" type="hidden" value="${orderInformation.tipsMessage!''}">
<input id="statusDesc" type="hidden" value="${orderInformation.statusDesc!0}">
<input id="specialPrice" type="hidden" value="${orderInformation.specialPrice!0}">
<input id="couponPrice" type="hidden" value="${orderInformation.couponPrice!0}">
<input id="tripNo" type="hidden" value="${orderInformation.tripNo!''}">
<input id="type" type="hidden" value="${type!''}">
<input id="departTitle" type="hidden" value="${orderInformation.departTitle}">
<input id="arriveTitle" type="hidden" value="${orderInformation.arriveTitle}">
<input id="orderNo" type="hidden" value="${orderInformation.orderNo!''}">
<input id="departCity" type="hidden" value="${orderInformation.departCity!''}">
<input id="departArea" type="hidden" value="${orderInformation.departArea!''}">
<input id="upRegion" type="hidden" value="${orderInformation.upRegion!''}">
<input id="arriveCity" type="hidden" value="${orderInformation.arriveCity!''}">
<input id="arriveArea" type="hidden" value="${orderInformation.arriveArea!''}">
<input id="downRegion" type="hidden" value="${orderInformation.downRegion!''}">
<input id="departType" type="hidden" value="${orderInformation.departType!0}">
<input id="departCarType" type="hidden" value="${orderInformation.departCarType!0}">
<input id="numbers" type="hidden" value="${orderInformation.numbers!0}">
<input id="price" type="hidden" value="${orderInformation.price!''}">
<input id="realPrice" type="hidden" value="${orderInformation.realPrice!''}">
<input id="remainTime" type="hidden" value="${remainTime!0}">
<input id="recordId" type="hidden">
<input id="amount" type="hidden">
<input id="settleMode" type="hidden" value="${orderInformation.settleMode!0}">
<input id="departTime" type="hidden" value="${orderInformation.departTime!0}">
<body>

    <div class="payment">
        <div class="payment-top" style="display: none;">
        	<p>请在<span class="text-mark" id="time"></span>内支付，超时未支付订单将自动取消</p>
        </div>

        <div class="payment-list">
            <div class="head">
                <div id="departTimeFmt" class="date"></div>
            </div>
            <div class="main">
                <div class="info">
                    <div class="info-item start"></div>
                    <div class="info-item end"></div>
                    <div class="code"></div>
                </div>
            </div>
        	<div class="tips"></div>
        </div>

        <div class="payment-info">
            <div class="title">费用</div>

            <div class="detail-info">
                <div class="detail">
                    <dl class="list total-price">
                        <dt>一口价</dt>
                        <dd>${orderInformation.price!""}元</dd>
                    </dl>                
		            <dl class="list activity-price-1">
		                <dt>活动优惠</dt>    
		                <dd>-${orderInformation.specialPrice!0}元</dd>
		            </dl>             
		            <dl class="list coupon-price" id="has-coupon">
		                <dt>优惠劵</dt>
		                <dd>		                   
		                    <!---${orderInformation.couponPrice!""}元-->
		                </dd>
		            </dl>
                </div>
            </div>
            <div class="border-dashed"></div>
            <div class="price-container" >
                <!-- <span>${orderInformation.realPay!""}元</span> -->
                <span></span>
                <div class="wait-pay" id="laterPay" style="display: none">
                    <a href="#">稍后支付</a>
                </div>
            </div>
        </div>
        
<!--  
        <div class="range">
            <div class="tip-content"><span>正在为您安排车辆</span></div>
            <div class="location-point"></div>
        </div>
        <div class="white_overlay"></div>
        <div class="ola-maps" id="allmap"></div>
       
        <div class="black_overlay"></div>
        <div class="cancel-popup" >
            <div class="cancel-tip">支付成功后，将优先为您安排车辆</div>
            <div class="cancel-btns">
                <div class="is-cancel">确定取消</div>
                <div class="no-cancel">暂不取消</div>
            </div>
        </div>
--> 

        <div class="pay-foot">
            <div class="btn-group">
                <div class="btn return">返回</div>
                <div class="btn primary" id="orderPay" data-clickable="true">微信支付</div>
                <div id="cancel" class="btn cancel">取消订单</div>
                
            </div>
        </div>
    </div>

	<script src="/js/commonJs.js?v=${version!}"></script>
	<script src="/js/vectors.min.js?v=${version!}"></script>
	<script src="/js/backtrack.min.js?v=${version!}"></script>
	<script src="/js/coupons/coupons.js?v=${version!}"></script>
    <script src="/js/innerCityJs/order/innerCityPayment.js?v=${version!}"></script>
    <script src="https://webapi.amap.com/maps?v=1.4.4&key=cc84bbc40681d10bdf6a924b2caf31d5&plugin=AMap.Driving"></script>
	
</body>
</html>
