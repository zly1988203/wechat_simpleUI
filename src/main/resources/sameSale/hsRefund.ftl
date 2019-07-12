<#include "/_framework.ftl">
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>申请退票</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/sameSale/hsRefund.css?v=${version!}" rel="stylesheet" type="text/css">
</head>
<body>
    <div class="lump ticket-info-content">
        <div class="content-name sui-border-b">退票详情</div>
        <ul>
            <li class="sui-border-b">
                <div class="name">可退票张数</div>
                <div class="value"><span id="canRefundNum"></span> 张</div>
            </li>
            <li class="sui-border-b">
                <div class="name">退票张数</div>
                <div class="value"><span id="alreadyRefundNum"></span> 张</div>
            </li>
            <li class="sui-border-b">
                <div class="name">总票价</div>
                <div class="value price"><span class="price" id="totalPrice"></span> 元</div>
            </li>
            <li class="sui-border-b">
                <div class="name">总退票手续费</div>
                <div class="value price"><span class="price" id="serviceFee"></span> 元</div>
            </li>
            <li class="sui-border-b">
                <div class="name">预计退票款金额<span style="font-size:.2rem;">（实际退款金额以景点提供为准）</span></div>
                <div class="value price"><span class="price" id="estimateRefundAmount"></span> 元</div>
            </li>
        </ul>
    </div>

    <div class="lump refund-info-content">
        <div class="content-name sui-border-b">
            <div class="name">退票原因</div>
            <!--<div class="ticket-rule" data-trigger-rule="#ticketRule">购票/退票规则</div>-->
        </div>
        <input id="refundReason" type="hidden">
        <ul>
            <li data-value="1" data-title="入园不方便">
                <div class="check-icon"></div>
                <div class="text">入园不方便</div>
            </li>
            <li data-value="2" data-title="天气原因不方便出行">
                <div class="check-icon"></div>
                <div class="text">天气原因不方便出行</div>
            </li>
            <li data-value="3" data-title="计划有变/买错了，不想去">
                <div class="check-icon"></div>
                <div class="text">计划有变/买错了，不想去</div>
            </li>
            <li data-value="4" data-title="有价格更便宜的">
                <div class="check-icon"></div>
                <div class="text">有价格更便宜的</div>
            </li>
            <li data-value="5" data-title="景点服务态度差">
                <div class="check-icon"></div>
                <div class="text">景点服务态度差</div>
            </li>
            <li data-value="6" data-title="系统出票不及时">
                <div class="check-icon"></div>
                <div class="text">系统出票不及时</div>
            </li>
        </ul>
    </div>

    <div class="btn-bar">
        <div class="button back" id="toBack">返回</div>
        <div class="button refund active" id="refundBtn">退票</div>
    </div>

    <!-- 取票/退票规则 - 使用规则 -->
    <div id="ticketRule" class="sui-popup-container">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <div class="rule-content">
                <div class="close cancel"></div>
                <h1>取票/退票规则</h1>
                <div class="rule-bar">
                    <div class="content">
                        <P>缺少文案</P>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/vectors.min.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/sameSale/hsRefund.js?v=${version!}"></script>
</body>
</html>