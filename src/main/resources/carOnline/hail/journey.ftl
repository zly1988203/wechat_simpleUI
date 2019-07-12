<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>行程开始</title>
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
                <div id="calltel" class="tel"></div>
            </div>
            <div class="journey-info">
                <div class="end">
                    <div class="title">目的地</div>
                    <div class="content">
                        <h4>${driverInfo.arriveTitle}</h4>
                        <p id="costTime">已行驶：0分钟0秒</p>
                    </div>
                </div>
                <!--优惠券-->
                <div class="price-content">
                    <div class="normal-price-box">
                        <span class="left">一口价</span><span class="right normal">${driverInfo.realPrice!0}元</span>
                    </div>
                    <#if driverInfo.status lte 3>
                    <div class="discount-price-box no-discount" id="couponsBox" data-clickable="true">
                        <input id="recordId" type="hidden" value="">
                        <input id="amount" type="hidden" value="">
                        <input id="oldPrice" type="hidden" value="${driverInfo.realPrice!0}">
                        <span class="left"">优惠券</span><span class="right discount">无可用券&nbsp;&gt;</span>
                    </div>
                    <#elseif driverInfo.status gt 3>
                        <#if driverInfo.couponMoney gt 0>
                        <div class="discount-price-box" style="color:#ccc;">
                            <span class="left">优惠券</span><span class="right discount">-${driverInfo.couponMoney}元</span>
                        </div>
                        </#if>
                    </#if>
                   <!-- <div class="discount-price-box no-discount"  id="couponsBox">
                        <span class="left">优惠券</span><span class="right discount">无可用券&nbsp;&gt;</span>
                    </div>-->
                </div>
                <!-- 等待支付 -->
                <#if driverInfo.status lte 3>
                <div class="pay-wait">
                    <div class="price">
                        <div id="newPrice" class="gold">
                           <b>${driverInfo.realPrice!0}</b>元
                        </div>
                        <div class="rule" id="priceRule">计费规则</div>
                    </div>
                    <div class="btn primary" id="payBtn">立即支付</div>
                </div>
               
                 <!--已支付-->
               <#elseif driverInfo.status gt 3>
	            <div class="pay-success">
                    <div class="pay-info"><span>您已支付车费<label>${driverInfo.payPrice!0}</label>元</span></div>
	                <p>如您需开发票，请下车时及时向司机索要</p>
	            </div>
               </#if>
                
            </div>
        </header>
        <div id="allmap"></div>

        <!-- 更多操作 -->
        <div id="more"></div>
        <div class="more-modal">
            <ul>
                <li class="share-btn">分享行程</li>
                <!-- data-tel属性：只有已经设置了紧急联系人，才有该属性 -->
                <li class="sos" data-tel="tel:123456">紧急求助</li>
                
                 <#if driverInfo.status gt 3>
	                 <#if driverInfo.userCommentStatus==1 >
	                	<li data-type="1"  class="commment">去评价</li>
	               	</#if>
	                <#if driverInfo.userCommentStatus==2 >
	                	<li data-type="2" class="commment" >查看评价</li>
	               </#if>
               </#if>
               
                <li class="complain">投诉建议</li>
                <li data-href="tel:${driverInfo.contactPhone!0}">联系客服</li>
            </ul>
        </div>
    </div>
    <!--分享-->
    <div class="share-box" style="display: none">
        <div class="share-tips"></div>
    </div>

    <!-- 投诉建议 - 提交成功 -->
    <div class="complain-success">
        <div class="complain-success-modal">
            <div class="title">提交成功</div>
            <div class="content">
                <ul>
                    <li>
                        <h4>投诉结果：客服已收到。</h4>
                        <p>我们将尽快给您安排处理，给您本次出行带来 的不便，深感歉意。</p>
                    </li>
                    <li>
                        <h4>投诉原因：</h4>
                        <p>本文信息描述本文信息描述本文信息描述本文 本文信息描述本文信息描述本文信息描述信息 描述</p>
                    </li>
                </ul>
            </div>
            <div class="btn primary confirm">知道了</div>
        </div>
    </div>

    <input type="hidden" id="costTimeVal" value="${driverInfo.alreadyDrivingTime!0}"/>
    <input type="hidden" id="tripStatus" value="${driverInfo.tripStatus}"/>
    <input type="hidden" id="departLng" value="${driverInfo.departLng!''}"/>
    <input type="hidden" id="departLat" value="${driverInfo.departLat!''}"/>
    <input type="hidden" id="arriveLng" value="${driverInfo.arriveLng!0}"/>
    <input type="hidden" id="arriveLat" value="${driverInfo.arriveLat!0}"/>
    <input type="hidden" id="type" value="${driverInfo.type!1}"/>
    <input type="hidden" id="cityId" value="${driverInfo.cityId!0}"/>
    <input type="hidden" id="orderNo" value="${driverInfo.orderNo!}"/>
    <input type="hidden" id="superviseTel" value="${driverInfo.superviseTel!0}"/>
    <input type="hidden" id="settleType"  value="${driverInfo.settleType!1}">

	<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
    <!--<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.4&key=cc84bbc40681d10bdf6a924b2caf31d5&plugin=AMap.Driving"></script>-->
    <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.4&key=65b7cb5e8c694cb822cd32791319b348&plugin=AMap.Driving"></script>
    <script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
  	<script type="text/javascript" src="/js/shareConfig.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/vectors.min.js?v=${version!}"></script>
    <script type="text/javascript">
        //强制使用https
        var AMapUIProtocol = 'https:';  //注意结尾包括冒号
    </script>
   <script src="/js/coupons/coupons.js?v=${version!}"></script>
    <!--引入UI组件库（1.0版本） -->
    <script src="https://webapi.amap.com/ui/1.0/main.js?v=${version!}"></script>
    <script src="/js/communicate.min.js?v=${version!}"></script>
    <script src="/js/hail_carOnline/journey.js?v=${version!}"></script>

</body>
</html>
