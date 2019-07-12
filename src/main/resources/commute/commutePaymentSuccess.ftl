<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>支付成功</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css" rel="stylesheet" type="text/css">
     <link href="/res/style/base/vectors.2.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/progressbar.css?v=${version!''}" rel="stylesheet" type="text/css">    
    <link href="/res/style/bus/payment-success.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/innerCity/arrivedDestination.css?v=${version!}" rel="stylesheet" type="text/css">
    <!-- start Dplus --><script src="/js/udplus.js"></script><!-- end Dplus -->
</head>

<body>
<input  id="orderNo" type="hidden" value="${orderNo!}">
    <div class="success">
        <div class="status">
            <div class="thumb"></div>
            <p>支付成功</p>
        </div>

        <div class="link" id="toOrderDetail">查看订单详情</div>

        <#if activityFlag=='1'>
        <div class="activity" id="toActivityDetail">
            <div class="title">在个人中心-活动查看活动详情</div>
            <div class="progress-box">
                <div class="content">
                    <!-- data-amount：总计，data-count：当前占数 -->
                    <div class="progress" data-amount="${needAmount!'0' }" data-count="${totalBuyPrice!'0' }">
                        <div class="progress-bar progress-bar-warning progress-bar-striped active" style="width: 90%;"></div>
                    </div>
                    <div class="progress-info">
                        <span>${activityName!''}</span>
                        <span class="progress-value"></span>
                    </div>
                </div>
            </div>
        </div>
        </#if>

        <div class="info">
            <div class="txt">在首页车票快捷入口查看车票，凭票上车</div>
            <div class="pic"><img src="/res/images/bus/payment-success-pic-2.png"></div>
        </div>

        <div class="foot-bar">
            <div class="btn-group">
                <button class="primary" id="back">去乘车</button>
            </div>
        </div>

        <div class="popup-container" style='display:none'>
            <div class="popup-main">
                <div class="QR-code-container">
                    <div class="service-img"></div>
                    <div class="close"></div>
                    <div class="popup-title">关注服务号</div>
                    <div class="popup-desc">为避免耽误您的行程，请关注<span id="providerName"></span>公众号，及时获取行程提醒。</div>
                    <div class="QR-code-box"><img src="${wechatQrcodeUrl!''}"/></div>
                    <div class="QR-code-tips">长按关注二维码</div>
                </div>
            </div>
        </div>
    </div>

    <!-- <div class="little-red-packet"></div> -->
	<div class="popup-overlay" style='display:none'></div>
    <div class="popup" style='display:none' data-show='true'>
    	<div class="direct"></div>
        <div class="red-packet-popup">
            <div class="red-packet-img"></div>
            <div class="red-packet-context1">恭喜您获得10个红包</div>
            <div class="red-packet-context2">分享给好友，大家一起抢</div>
        </div>
        <div class="btn-close-popup"></div>
    </div>

    <input type="hidden" id="activityId" value="${activityId!0}">
    <input type="hidden" id="focusOn" value="${focusOn!'0'}" placeholder="0-未关注,1-已经关注">
    <input type="hidden" id="wechatQrcodeUrl" value="${wechatQrcodeUrl!''}">

    <script src="/js/commonJs.js?v=${version!''}"></script>
    <script src="/js/common.min.js?v=${version!''}"></script>
    <script type="text/javascript" src="/js/vectors.min.js?v=${version!}"></script>
    <script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
    <script src="/js/innerCityJs/order/getCoupon.js?v=${version!}"></script>
    <script src="/js/commute/commutePaymentSuccess.js?v=${version!''}"></script>
</body>
</html>