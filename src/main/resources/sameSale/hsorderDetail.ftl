<#include "/_framework.ftl">
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>景区门票</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css" rel="stylesheet" type="text/css">
    <link href="/res/style/sameSale/hsorderDetail.css" rel="stylesheet" type="text/css">
</head>
<body>
    <input type="hidden" id="productCode">
    <input type="hidden" id="storeCode">
    <input type="hidden" id="storeName">
    <div class="lump ticket-name-content">
        <div class="info" id="goodsName"></div>
    </div>

    <div class="lump ticket-info-content">
        <ul>
            <li>
                <div class="left">订单状态</div>
                <div class="right price" id="payStatus"></div>
            </li>
            <li>
                <div class="left">订单编号</div>
                <div class="right" id="orderNo"></div>
            </li>
            <li>
                <div class="left">下单时间</div>
                <div class="right" id="createTime"></div>
            </li>
            <li>
                <div class="left">订单总额</div>
                <div class="right">￥<span id="totalPrice"></span></div>
            </li>
            <li>
                <div class="left">购票张数</div>
                <div class="right" id="ticketDec"></div>
            </li>

        </ul>
    </div>

    <div class="lump ticket-info-content"></div>
    <div class="lump ticket-info-content"  style="margin-top:0;padding: 0 .22rem;padding-bottom:.1rem;">
        <ul>
            <li>
                <div class="left">使用时间</div>
                <div class="right" id="useTime"></div>
            </li>
        </ul>
    </div>
    <div class="explainBox" id="explainBox">
    </div>
    
    <div class="lump ticket-info-content"  style="margin-top:0;padding: 0 .22rem;padding-bottom:.1rem;">
        <ul>
            <li>
                <div class="left">使用地址</div>
                <div class="right" id="fetchTicketAddr"></div>
            </li>
            <li>
                <div class="left">退改说明</div>
                <div class="right" id="refundIntro"></div>
            </li>
        </ul>
    </div>

    <div class="lump role-info-content">
        <div class="role-name sui-border-b">联系人</div>
        <ul>
            <li class="flex">
                <div class="contacts" id="contactName"></div>
                <div>
                    <div class="line-item">
                        <div class="name">手机号</div><div class="value" id="contactMobile"></div>
                    </div>
                    <div class="line-item">
                        <div class="name">身份证</div><div class="value" id="contactCard"></div>
                    </div>
                </div>
            </li>
        </ul>
    </div>

    <div class="lump role-info-content" id="touristBox">
        <div class="role-name sui-border-b">游客</div>
        <ul id="tourist">
        </ul>
    </div>

    <div class="lump role-info-content" id="ticketBox">
        <div class="role-name sui-border-b">门票号</div>
        <ul id="ticket">
        </ul>
    </div>

    <div class="btn-bar" id="payStatusYes" style="display:none;">
        <div class="button refund" id="refundTicket">退票</div>
        <div class="button active" id="buyAgain">再次购买</div>
    </div>

    <div class="btn-bar" id="payStatusNo">
        <div class="button refund" id="orderCancel">取消订单</div>
        <div class="button active" id="payConfirm">确认支付<span id="totalPayPrice"></span>元</div>
    </div>

    <!--检票弹窗-->
    <div class="popup-container-detail" id="qrCodePropup" style="display: none">
        <div class="check-content">
            <div><i class="icon-close" onclick="checkTicket(0)"></i></div>
            <div class="order-info">
                <div class="name" id="qrcodeName">黄山风景区门票</div>
                <div class="time" id="departTime"></div>

            </div>
            <div class="order-check">
                <div class="prompt">向验票员/扫码机展示二维码验票</div>
                <div class="qr-code" id="qrcode"></div>
                <div class="person-info sui-border-b" id="contacts"></div>
                <div class="check-info">
                    <div class="info-header">票种/票价/张数</div>
                    <div class="info-data" id="ticketType"></div>
                </div>
            </div>
        </div>
    </div>
        
    <script type="text/javascript" src="/js/commonJs.js?v=20170918"></script>
    <script src="/js/zepto.min.js?v=${version!}"></script>
    <script src="/js/simpleui.min.js?v=${version!}"></script>
    <script src="/js/vectors.min.js?v=${version!}"></script>
    <script src="/js/sameSale/hsorderDetail.js?v=${version!}"></script>


</body>
</html>
