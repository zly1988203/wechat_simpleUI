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
    <link href="/res/style/sameSale/wait-pay.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>
    <ul>
        <li><div id="attName" class="top-title">西递风景区门票</div></li>
        <li id="attTicketList" style="display: none">

        </li>
        <li id="busTicket" style="display: none">
            <div class="ticket">
                <div class="pre">
                    <div class="ticket-name">黄山北站客运站</div>
                    <div class="ticket-prcie price">￥<span id="totalPriceBus">0元</span></div>
                </div>
                <div class="arriveName">黄山风景区</div>
                <div class="in-time"><span id="departDate"></span>发车</div>
                <div class="ticket-num">

                </div>
            </div>
        </li>

        <div id="carryingChildren" class="sui-border-b"  style="display: none">
            <div class="ticket-info">
                <div class="ticket-type">携带免费儿童<span>(身高1.2米下的儿童乘车)</span></div>
            </div>
            <div class="ticket-amount">
                <i class="less"></i>
                <div class="amount"><input id="carryingChildrenNumbers" value="0" readonly=""></div>
                <i class="more"></i>
            </div>
        </div>

        <li class="passenger-info">
            <div class="passenger-header">联系人<span>（仅需<em>1位</em>联系人，用于接收短信信息）</span></div>
            <div class="pre info">
                <div>姓名</div>
                <div><input id="collName" type="text" name="passenger-name" value="${name!}" placeholder="请填写姓名" autofocus><i class="name-clear"></i></div>
            </div>
            <div class="pre info">
                <div>手机号</div>
                <div><input id="collPhone" type="tel" maxlength="11" name="passenger-tel" value="${userPhone!}" placeholder="请填写手机号"><i class="tel-clear"></i></div>
            </div>
            <div class="pre info">
                <div>身份证</div>
                <div><input id="collCardId" type="text" maxlength="18" name="passenger-id" value="${cardId!}" placeholder="请填写身份证号码"><i class="id-clear"></i></div>
            </div>
        </li>
        <li class="pre pay">
            <div class="pay-way">微信支付<em>推荐</em></div>
            <div class="pay-icon"><input type="radio"></div>
        </li>
        <div class="warm-prompt">
            <div class="head">
                <h3 style="flex: 1;">温馨提示：</h3>
                <div class="ticket-rule">取票/退票规则</div>
            </div>
            <div class="content"></div>
        </div>
        <div class="pay-btn"><div class="confirm">确认支付<span id="totalPrice">0</span>元</div></div>
    </ul>

    <div class="popup-overlay" ></div>

    <!-- 取票/退票规则 - 使用规则 -->
    <div id="ticketRule" class="sui-popup-container">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <div class="rule-content">
                <div class="close-popup close"></div>
                <h1>取票/退票/发票领取规则</h1>
                <div class="rule-bar">
                    <div class="content">

                    </div>
                </div>
            </div>
        </div>
    </div>
<script src="/js/commonBus.js?v=${version!}"></script>
<script type="text/javascript" src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
    <script src="/js/commonjs/idCard.js?v=${version!}"></script>
<script src="/js/sameSale/wait-pay.js?v=${version!}"></script>

</body>
</html>
