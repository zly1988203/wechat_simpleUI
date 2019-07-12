<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/common.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/innerCity/order-common.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/innerCity/waitGoTravel.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/innerCity/arrivedDestination.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>

<input type="hidden" id="orderType" value="${orderInfo.orderType!}">
<input type="hidden" id="isHavaShareRedBags" value="${orderInfo.isHavaShareRedBags!}">

<!--评价状态 1未评价 2已评价-->
<input id="userCommentStatus" type="hidden" value="${orderInfo.userCommentStatus!''}">
<input id="commentContent" type="hidden" value="${orderInfo.commentContent!''}">

<input id="commentStar" type="hidden" value="${orderInfo.commentStar!''}">
<input id="tagListStr" type="hidden" value="${orderInfo.tagListStr!''}">
<!-- 0-无返程，1-有返程 -->
<input id="backTrack" type="hidden" placeholder="是否有返程" value="${orderInfo.backTrack!0}">
<!--地图请保持在前面-->
<div class="ola-maps amap-container" id="allmap"></div>
<div class="main-container">
    <!--司机信息 行程信息-->
    <#include "driverInfoContainer.ftl">

    <div class="driver-foot">
        <!-- 更多操作 -->
        <div id="morePanel" class="more-service-container" style="display:none;">
            <ul>
                <li id="contactCall">联系客服</li>
                <li id="suggestBtn">投诉建议</li>
                <li id="close" class="close-more-service">取消</li>
            </ul>
        </div>
    </div>

    <!--支付面板 -->
    <input type="hidden" id="orderPrice" placeholder="订单金额" value="${orderInfo.orderPrice!0}"/>
    <input type="hidden" id="price" placeholder="订单金额" value="${orderInfo.price!0}"/>
    <input type="hidden" id="discountPrice" placeholder="优惠金额" value="${orderInfo.discountPrice!0}"/>
    <input type="hidden" id="specialActivityType" placeholder="" value="${orderInfo.specialActivityType!0}"/>
    <input type="hidden" id="specialActivityName" placeholder="" value="${orderInfo.specialActivityName!''}"/>
    <input type="hidden" id="specialPrice" placeholder="" value="${orderInfo.specialPrice!0}"/>
    <input type="hidden" id="couponPrice" placeholder="优惠券" value="${orderInfo.couponPrice!0}"/>
    <input type="hidden" id="payPrice" placeholder="支付金额" value="${orderInfo.payPrice!0}"/>
    <input type="hidden" id="refundPrice" placeholder="退款金额" value="${orderInfo.refundPrice!0}"/>
    <input type="hidden" id="feePrice" placeholder="手续费" value="${orderInfo.feePrice!0}"/>
    <input type="hidden" id="realPrice" placeholder="实际支付价格" value="${orderInfo.realPrice!0}"/>
    <input type="hidden" id="priceAdjustValue" placeholder="调整价格" value="${orderInfo.priceAdjustValue!0}"/>
    <!--0:减价 1：加价-->
    <input type="hidden" id="priceAdjustType" placeholder="调整价格类型" value="${orderInfo.priceAdjustType!''}"/>
    <!--0：未支付，1：已支付，2：已退款-->
    <input type="hidden" id="payStatus" placeholder="支付状态" value="${orderInfo.payStatus!''}"/>
    <input type="hidden" id="driverMobile" placeholder="支付状态" value="${orderInfo.driverMobile!''}"/>

    <div id="payPanel" class="bottom-container payment-container pay-panel_arrived" style="display: none;">
        <div class="top">
            <div class="amount"><label>${orderInfo.realPrice!"0"}</label>元</div>
            <div class="detail">车费明细</div>
        </div>
        <div class="middle">
            <ul>
                <li>
                    <div class="name">一口价</div>
                    <div class="value">${orderInfo.price!""}元</div>
                </li>
                <li class="coupon" id="coupon">
                    <div class="name">优惠券</div>
                    <div class="value"></div>
                </li>
            </ul>
        </div>
        <div class="btn-group btn-group-arrived">
            <div class="btn btn-default" id="back1">返回</div>
            <input id="recordId" type="hidden" placeholder="优惠券id" value="">
            <input id="amount" type="hidden" placeholder="优惠券面额" value="">
            <input id="newCouponPrice" type="hidden" placeholder="优惠券抵扣金额" value="">
            <input id="newPayPrice" type="hidden" placeholder="选完优惠券后的支付价格" value="">
            <input id="oldPrice" type="hidden" placeholder="" value="${orderInfo.payPrice!0}">
            <div class="btn btn-primary" id="paymentBtn">微信支付</div>
            <div class="btn btn-default" id="more1">更多</div>
        </div>
    </div>

        <!--评价-->
    <div id="evaluatePanel" class="bottom-container evaluate-container" style="display:none;">
            <div class="top sui-border-b">
                <div class="title">评价</div>
                <div id="closeEvaluate" class="close"></div>
            </div>
        <div class="evaluate-content">
            <div class="star-box">
                <!--<div class="star-info">匿名评价司机</div>-->
                <div class="star max" data-size="max">
                    <input type="hidden" id="star1">
                    <span></span><span></span><span></span><span></span><span></span>
                </div>
                <div class="star-info">完成匿名评价，我们将提供更好的服务</div>
            </div>
            <div class="evaluate-box" style="display: none">
                <div class="tag">
                    <!--<div class="tag-tips">请选择标签</div>-->
                    <span data-value="服务好态度棒">服务好态度棒</span>
                    <span data-value="车内整洁">车内整洁</span>
                    <span data-value="驾驶平稳">驾驶平稳</span>
                    <span data-value="活地图认路准">活地图认路准</span>
                    <span data-value="不是订单显示车辆">不是订单显示车辆</span>
                    <span data-value="车内有其他陌生人">车内有其他陌生人</span>
                    <span data-value="车内有其他陌生人">车内有其他陌生人</span>
                    <input type="hidden" id="tag1">
                </div>
                <div class="others">
                    <label class="message-area" for="message-1">
                        <textarea id="message-1" data-max="200" placeholder="其他想说的" maxlength="200"></textarea>
                        <!--<div class="message-length">0/200</div>-->
                    </label>
                </div>
                <div class="evaluate-commit protrude" id="sub-evaluate">匿名提交</div>
            </div>
        </div>

    </div>
    <!--已评价-->
    <div id="viewEvaluated" class="bottom-container evaluated-container" style="display:none">
        <div class="evaluate-content">
            <div class="payment-info">
                <div class="amount">${orderInfo.payPrice!"0"}元</div>
                <div class="detail">车费明细</div>
            </div>
            <div class="btn-group" >
                <div class="btn btn-default" id="back2">返回</div>
                <div class="btn btn-default" id="btnEvaluate">评价</div>
                <div class="btn btn-default" id="callBack">返程</div>
                <div class="btn btn-default" id="more2">更多</div>
        <!--已评价-->
    </div>

    <!--查看评价-->
     <div id="evaluatedPanel" class="bottom-container evaluate-container" style="display:none">

            <div class="top sui-border-b">
                <div class="title">评价</div>
                <div id="" class="close"></div>
            </div>
            <div class="evaluate-content">
                <div class="star-box">
                    <div class="star max" data-size="max">
                        <span></span><span></span><span></span><span></span><span></span>
                    </div>
                    <!--<div class="star-info">完成匿名评价，我们将提供更好的服务</div>-->
                </div>
                <div class="evaluate-box">
                    <div class="tag">
                        <span data-value="服务好态度棒">服务好态度棒</span>
                        <span data-value="车内整洁">车内整洁</span>
                        <span data-value="驾驶平稳">驾驶平稳</span>
                        <span data-value="活地图认路准">活地图认路准</span>
                        <span data-value="不是订单显示车辆">不是订单显示车辆</span>
                        <span data-value="车内有其他陌生人">车内有其他陌生人</span>
                        <span data-value="车内有其他陌生人">车内有其他陌生人</span>
                    </div>
                    <div class="others">
                        <label class="message-area" for="message-1">
                            <textarea id="message-1" data-max="200" placeholder="其他想说的" maxlength="200"></textarea>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>
    <!--&lt;!&ndash;计价规则&ndash;&gt;-->
    <#include "/priceDetailPopup.ftl">

</div>

<div class="black_overlay" style="display: none;"></div>
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

<script type="text/javascript"
        src="https://webapi.amap.com/maps?v=1.4.4&key=65b7cb5e8c694cb822cd32791319b348&plugin=AMap.Driving"></script>
<script src="https://webapi.amap.com/ui/1.0/main.js?v=${version!}"></script>
<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script type="text/javascript" src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
<script type="text/javascript" src="/js/shareConfig.js?v=${version!}"></script>
<script src="/js/coupons/coupons.js?v=${version!}"></script>
<script src="/js/hail_innerCity/order/commonInnerCity.js?v=${version!}"></script>
<script src="/js/hail_innerCity/order/arrivedDestination.js?v=${version!}"></script>
<script src="/js/innerCityJs/order/getCoupon.js?v=${version!}"></script>
</body>
</html>
