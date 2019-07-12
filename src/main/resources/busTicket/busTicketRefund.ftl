<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>中交出行</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/batch/refund-ticket.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>
    <!--<div class="ticket-info">-->
        <!--<div class="row">-->
            <!--<div class="time">${WeekTime}</div>-->
        <!--</div>-->

        <!--<div class="station">-->
        			<!--&lt;!&ndash; 到达站始发站 &ndash;&gt;-->
            <!--<div class="station-item"><h4>${departStation}</h4></div>-->
            <!--<div class="station-item"><h4>${arriveStation}</h4></div>-->
        <!--</div>-->
    <!--</div>-->

    <div class="head-title">选择车票</div>

    <!-- 车票 -->
    <div class="ticket-box">

    </div>

    <div class="ticket-total-info">
        <div class="total-item">
            <div class="item-title">总票价</div>
            <div class="item-price" id="totalPrice">¥0</div>
        </div>
        <div class="total-item">
            <div class="item-title">总退票手续费</div>
            <div class="item-price" id="totalRefundFee">¥0</div>
        </div>
        <div class="total-item">
            <div class="item-title">预计退款金额<span>（实际退款金额以车站提供为准）</span></div>
            <div class="item-price" id="refundPrice">¥0</div>
        </div>
    </div>

    <div id="ticketRule" class="sui-popup-container" style="display: none;">
        <div class="sui-popup-mask" style="display: none;"></div>
        <div class="sui-popup-modal" style="display: none;">
            <div class="rule-content">
                <div class="close cancel"></div>
                <h1>取票/退票规则</h1>
                <div class="rule-bar">
                    <div class="content">

                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="warm-prompt">
        <div class="head">
            <h6>注意：</h6>
            <div class="ticket-rule">取票/退票规则</div>
        </div>
        <p>购买保险且未过发车时间，则退票后保险会自动退回</p>
    </div>

        <div class="btn-group">
          <div class="btn default" id="back">返回</div>
          <div class="btn readonly" data-flag="false" id="submit">申请退票</div>
        </div>

    <script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/vectors.min.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/busTicket/busTicketRefund.js?v=${version!}"></script>
</body>
</html>