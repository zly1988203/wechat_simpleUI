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
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="/res/style/batch/refund-detail.css?v=${version!}">
</head>

<body>
    <div class="content">
        <div class="item">
            <h4 class="caption  fs-36">退票详情</h4>
            <ul class="refund-detail">
                <li class="refund-item">
                    <div class="detail-list color-gray text-right">退票天数</div>
                    <div class="detail-list color-gray text-left"><span id="refundTicketCount"></span>天</div>
                </li>
                <li class="refund-item">
                    <div class="detail-list color-gray text-right">实付金额</div>
                    <div class="detail-list color-gray text-left"><span id="totalPayAmount"></span>元</div>
                </li>
                <li class="refund-item">
                    <div class="detail-list color-gray text-right">退票手续费</div>
                    <div class="detail-list color-gray text-left"><span id="totalFee"></span>元</div>
                </li>
                <li class="refund-item">
                    <div class="detail-list color-orange text-right">实际退款金额</div>
                    <div class="detail-list color-orange text-left"><span id="totalRefundAmount"></span>元</div>
                </li>
            </ul>
        </div>
        <div class="item">
            <h4 class="caption  fs-32">请选择退票原因</h4>
            <ul class="reason-list">
                <li data-value="行程有变" class="reason-item">行程有变</li>
                <li data-value="赶不上车" class="reason-item">赶不上车</li>
                <li data-value="有事取消" class="reason-item">有事取消</li>
                <li data-value="选择其他交通工具" class="reason-item">选择其他交通工具</li>
                <li data-value="其他" class="reason-item" id="other_reasons">其他</li>
                <input type="hidden" id="tag">
            </ul>
            <label class="message-area" for="message-1" style="display: none">
                <textarea id="message-1" data-max="40" placeholder="以上原因都不对，手动输入原因" maxlength="40"></textarea>
                <div class="message-length">0/40</div>
            </label>
        </div>
    </div>
    <div class="btn-group">
        <div class="btn default" id="btnBack">返回</div>
        <div class="btn unclickable" id="btn_refund">确认退票</div>
    </div>

    <script src="/js/zepto.min.js"></script>
    <script src="/js/simpleui.min.js"></script>
    <script src="/js/zepto.cookie.js"></script>
    <script src="/js/zepto.md5.js"></script>
    <script src="/config.js?v=${version}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
    <script src="/js/commutingBus/serverApi.js?v=${version}"></script>
    <script src="/js/commutingBus/refundDetail.js?v=${version!}"></script>
</body>
</html>