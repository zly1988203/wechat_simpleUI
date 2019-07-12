<#include "/_framework.ftl">
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>选择优惠券</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css" rel="stylesheet" type="text/css">
    <link href="/res/style/my/coupon-select.css" rel="stylesheet" type="text/css">
</head>
<body>
<div id="selectCoupon" class="coupon">
    <!--<div class="rule-btn">-->
        <!--<div class="coupon-rule" data-trigger-rule="#ruleContent" style="display: none">-->
            <!--使用规则-->
        <!--</div>-->
    <!--</div>-->

    <div  class="main content">
        <div id="enabled-coupons">
            <div class="line">
                <b></b>
                <span>可用优惠券</span>
                <b></b>
            </div>

            <div  class="coupon-list">

            </div>
        </div>

        <div id="disabled-coupons">
            <div class="line">
                <b></b>
                <span>不可用优惠券</span>
                <b></b>
            </div>

            <div  class="coupon-list">

            </div>
        </div>

    </div>
    <!-- 没有优惠券 -->
    <div id="noCoupons" class="not-data" style="display: none">暂无优惠券</div>
    <div id="btnNotUse" class="btn-box"><div class="btn-nouse">不使用优惠券</div></div>
</div>


<!-- 优惠券 - 使用规则 -->
<div id="ruleContent" class="sui-popup-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <div class="rule-content">
            <div class="close cancel"></div>
            <h1>优惠券使用规则</h1>
            <div class="rule-bar">
                <div class="content">
                    <P>缺少文案</P>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript" src="/js/commonJs.js"></script>
<script type="text/javascript" src="/js/vectors.min.js?v=${version!}"></script>
<script type="text/javascript" src="/js/personalCenter/coupon-select.js?v=${version!}"></script>
</body>
</html>