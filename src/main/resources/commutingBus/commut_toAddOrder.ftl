<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/commutingBus/fonts/iconfont.css?v=${version}" rel="stylesheet">
    <link href="/res/style/commutingBus/toAddOrder.css?v=${version}" rel="stylesheet" type="text/css">
</head>
<body>
<div id="preOrderInfo" class="content">
    <div class="order-head">
        <div class="head-panle">
            <div class="head">
                <div class="time"></div>
                <div class="line-name"></div>
                <div class="license-plate"></div>
            </div>
            <div class="station">
                <div class="icon-up-down"></div>
                <div class="station-list">
                    <div id="departTitle" class="station-title"></div>
                    <div id="arriveTitle" class="station-title"></div>
                </div>
            </div>
        </div>

    </div>

    <div class="order-panle">
        <div class="item-info">
            <div class="title">乘车日期</div>
            <div id="payDays" class="txt">共 0 天</div>
        </div>
        <div class="item-info">
                <div class="ticket-total">
                    <span>票价总额</span>
                </div>

            <div class="price-txt">
                <div id="normalPrice" class="normal-price" style="display: none">0元</div>
                <div id="specialPrice" class="special-price">0元</div>
            </div>
        </div>
        <div class="item-info coupon-toggle">
            <div class="title">优惠券</div>
            <div id="couponUsePrice" class="coupon-price">
                选择优惠券
            </div>
        </div>
        <div class="item-info">
            <div class="title">联系手机 <span class="tip">(用于接收短信电话通知)</span></div>
            <div class="txt">
                <input id="mobile" type="tel" maxlength="11"  placeholder="填写手机号码">
            </div>
        </div>
    </div>


    <div id="tipRule" class="rule-content" style="display: none">
        <div class="head">
            温馨提示：
        </div>
        <div class="content">

        </div>
    </div>

    <div id="payRule" class="rule-content" style="display: none">
        <div class="head">
            购票/退票规则：
        </div>
        <div class="content">

        </div>
    </div>

    <div class="order-footer">
        <div class="back-btn">返回</div>
        <div class="pay-price">实付<span id="payPrice">0</span>元</div>
        <div class="pay-btn">确认支付 </div>
    </div>

</div>

</body>
<script src="/js/zepto.min.js"></script>
<script src="/js/simpleui.min.js"></script>
<script src="/js/zepto.cookie.js"></script>
<script src="/js/zepto.md5.js"></script>
<script src="/config.js?v=${version!}"></script>
<script src="/js/common.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version}"></script>
<script src="/js/commutingBus/serverApi.js?v=${version!}"></script>
<script src="/js/coupons/coupons.js?v=${version!}"></script>
<script src="/js/commutingBus/toAddOrder.js?v=${version!}"></script>
</html>