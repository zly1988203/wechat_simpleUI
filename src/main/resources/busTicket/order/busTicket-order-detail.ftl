<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
   <!--   <#if (orderInformation.orderStatusInt)?? &&((orderInformation.orderStatusInt)==1||(orderInformation.orderStatusInt)==2)>
    <title>支付订单</title>
    <#else>
    <title>订单详情</title>
    </#if> -->
    <title>订单详情</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <meta name="referrer" content="no-referrer">
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/coach/order-detail.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>
<!-- 订单状态    待支付：pay-waiting,待出票：issuing,出票成功：issued-success,出票失败：issued-fail,已关闭：closed,部分退票：refund-part,全部退票：refund-all-->
<!--<div class="order-detail-state pay-waiting">-->
    <div class="count-down" style="display: none">
        请在<span class="minute" id="minute"></span>分<span class="second" id="second"></span>秒内支付，支付后务必查看订单详情，确认是否出票成功，若出票失败，票款会原路退回给微信。
    </div>

    <div class="ticket-info">
        <#if hasRunningWater == '0'>
        <div class="row">
            <div class="time">${orderInformation.boardingTime!''}</div>
            <!-- <div class="other">行程约<span>1.5</span>小时</div> -->
        </div>
        </#if>
        <#if hasRunningWater == '1'>
        <div class="row">
            <div class="time">${orderInformation.boardingTime!''}<span>(流水班,来车即可上)</span></div>
        </div>
        </#if>

         <div class="station sui-border-b">
            <div class="station-item">
                <h4>${orderInformation.departTitle!''}</h4>
            </div>
            <div class="station-item">
                <h4>${orderInformation.arriveTitle!''}</h4>
            </div>
        </div>
        <!--<div class="check-station" data-href="#">查看地图</div>-->
        <div class="ticket-rule" data-trigger-rule="#ticketRule">取票/退票规则</div>
    </div>

    <!-- 取票/退票规则 - 使用规则 -->
    <div id="ticketRule" class="sui-popup-container">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <div class="rule-content">
                <div class="close-popup close" data-target="ticketRule"></div>
                <h1>取票/退票/发票领取规则</h1>
                <div class="rule-bar">
                    <div class="content">
                        <P id="ruleContent">缺少文案</P>
                    </div>
                </div>
            </div>
        </div>
    </div>

<!--
  如果不需要向右的箭头，去掉li.class=sui-cell-link即可
-->
<ul class="coupon-btn sui-list">
    <li class="sui-border-b">
        <div class="name">订单状态</div>
        <div class="value text-gray" id="order_status">${orderInformation.orderStatus!''}</div>
    </li>

    <!--<li class="sui-border-b coupon-toggle">
        <div class="name">票价总额</div>
        <div class="value text-gray">${orderInformation.price!0}元</div>
    </li>-->
    <li id="totalAmount">
        <div class="name">订单总额</div>
        <div class="value text-red total-amount"><!--<button class="detail-btn">明细</button>--><span>
                ${totalPrice!0}元
            </span></div>
    </li>
</ul>

    <#if ticketList?exists>
    <!-- 乘车人 -->
    <div class="passenger" style="padding:0.22rem;">
        <div class="content">
            <div class="title">乘车人</div>
            <#list ticketList as ticket>
            <#if (ticket.idCardNo)??>
            <div class="item text-gray">
                <div class="info">
                    <p><span class="label">${ticket.passengerName!''}</span> ${ticket.passengerMobile!''}</p>
                    <p>
                        <span class="label">票号</span>
                        <#if (ticket.itemName)?? && ticket.itemName != ''>
                            (${ticket.itemName!'成人票'})
                        <#else>
                            (成人票)
                        </#if>

                        ${ticket.ticketSerialNo!' 暂无票号'}
                    </p>
                    <!--<div class="info-head">-->
                        <!--<div class="name"> </div>-->
                    <!--</div>-->
                    <#if (ticket.idCardNo)?? && ticket.idCardNo != ''>
                    <!--<p><span class="label">手机号</span></p>-->

                    <p><span class="label">身份证</span> ${ticket.idCardNo!''}</p>
                </#if>
                <input type="hidden" value="${ticket.idCardNo!}" id="idCardNo1"/>
                <input type="hidden" value="${ticket.insuranceStatus!}" id="insuranceStatus1"/>
                <input type="hidden" value="${ticket.insuranceNo!}" id="insuranceNo1"/>
                <#if (ticket.insuranceStatus)??>
                <#if ticket.insuranceStatus == 1>
                <p><span class="label">保单号</span>${ticket.insuranceNo!''}</p>
                <#elseif ticket.insuranceStatus == 2>
                <p><span class="label">出保失败</span></p>
                <#elseif ticket.insuranceStatus == 3>
                <p><span class="label">已退保</span></p>
                <#elseif ticket.insuranceStatus==0 && insurancePrice?? && insurancePrice!=0>
                <p><span class="label">出保中</span></p>
            </#if>
        </#if>
        <#--  checkQrCode：1.纸质 2.二维码  -->
        <#if orderInformation.checkQrCode == 2 && (ticket.status == 1 ||  ticket.status == 4)>
        <div class="btn-check btn-bottom" data-price="${ticket.ticketPrice}" data-ticket-serial-no="${ticket.ticketSerialNo!''}" data-passenger-name="${ticket.passengerName!''}"
             data-id-card-no="${ticket.idCardNo!''}" data-ticket-code-id="${ticket.ticketCodeId!'/'}">验票</div>
    </#if>
    </div>
    </div>
    <#else>
    <div class="item">
        <div class="name">票号<span style="margin-left: 0.2rem;">(${ticket.itemName!'成人票'})</span></div>
        <div class="flex jcs">
            <div class="ticket-no">${ticket.ticketSerialNo!' 暂无票号'}</div>
            <#--  checkQrCode：1.纸质 2.二维码  -->
            <#if orderInformation.checkQrCode == 2 && (ticket.status == 1 ||  ticket.status == 4)>
            <div class="btn-check" data-price="${ticket.ticketPrice}" data-ticket-serial-no="${ticket.ticketSerialNo!''}" data-passenger-name="${ticket.passengerName!''}"
                 data-id-card-no="${ticket.idCardNo!''}" data-ticket-code-id="${ticket.ticketCodeId!'/'}">验票</div>
        </#if>
    </div>
        <!--<div class="btn-check" data-price="${ticket.ticketPrice}" data-ticket-serial-no="${ticket.ticketSerialNo!''}" data-passenger-name="${ticket.passengerName!''}"-->
             <!--data-id-card-no="${ticket.idCardNo!''}" data-ticket-code-id="${ticket.ticketCodeId!'/'}">验票-->
        <!--</div>-->
    </div>
    </#if>

    </#list>
    </div>
    </div>

    </#if>


<#--  联系人  -->
<div class="passenger">
    <div class="content">
        <div class="title" >联系人</div>
        <div class="pass-info">
            <div style="padding-right:.22rem;">${orderInformation.orderExtraInfoVo.contactName!''}</div>
            <div>
                <div>手机号  ${orderInformation.orderExtraInfoVo.contactMobile!''}</div>
                <div>身份证  ${orderInformation.orderExtraInfoVo.contactCard!''}</div>
            </div>
        </div>
    </div>
</div>


 	<ul class="coupon-btn sui-list refundDetail" style="display: none;">

        <li class="sui-border-b">
            <div class="name">退票张数</div>
            <div class="value text-gray">${orderInformation.refundTicketCounts!0}张</div>
        </li>
        <li class="sui-border-b coupon-toggle">
            <div class="name">退票金额</div>
            <div class="value text-gray">${orderInformation.fee!0}元</div>
        </li>
    </ul>

    <ul class="coupon-btn sui-list">
        <li class="sui-border-b coupon-toggle">
            <div class="name">支付方式</div>
            <div class="value text-gray">${orderInformation.payTypeDesc!''}</div>
        </li>
        <li class="sui-border-b coupon-toggle">
            <div class="name">购票张数</div>
            <div class="value text-gray">${orderInformation.numbers!0}张</div>
        </li>
        <li class="sui-border-b">
            <div class="name">下单时间</div>
            <div class="value text-gray">${orderInformation.createTimeStr!''}</div>
        </li>
        <li class="sui-border-b coupon-toggle">
            <div class="name">订单编号</div>
            <div class="value text-gray">${orderInformation.orderNo!''}</div>
        </li>
    </ul>

    <div class="warm-prompt">
        <div class="h6">温馨提示：</div>
        <p>${remindContent!"儿童票、学生票等请前往车站购买。请在发车前提前到站取票，以免耽误行程。距发车时间15分钟内不支持网上退票。"}</p>
    </div>

    <div class="btn-group pab-10" id="btn-group-A">
        <button class="default" id="cancelOrder">取消订单</button>
        <button class="primary" id="payConfirm">确定支付<span class="total">${totalPrice!0}</span>元</button>
    </div>

    <div class="btn-group pab-10" id="btn-group-B" style="display: none">
        <button class="default" id="refund" style="display: none">退票</button>
        <button class="primary buyAgain">再次购票</button>
    </div>

    <div class="btn-group pab-10" id="btn-group-C" style="display: none">
        <button class="primary buyAgain">再次购票</button>
    </div>

    <!--<div class="popup-container-detail" style="display: none">
        <div class="detail-content">
            <ul class="detail-box">
                <li class="detail-item">
                    <div class="name">票价总额</div>
                    <div class="value"><span>&#165;&nbsp;${ticketPrice!0}</span>X<span>${orderInformation.numbers!0}</span>人</div>
                </li>
                <li class="detail-item">
                    <div class="name">服务费总额</div>
                    <div class="value"><span>&#165;&nbsp;${serviceFee!0}</span>X<span>${orderInformation.numbers!0}</span>人</div>
                </li>
            </ul>
        </div>
    </div>-->

<!--金额详情-->
<div id="totalDetail" class="sui-popup-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <div class="title">金额明细</div>
        <div class="detail-box">
            <ul>
                <li>
                    <div class="name">票价总额</div>
                    <div class="value">${totalTicketPrice!0}<span>元</span></div>
                </li>
                <li>
                    <div class="name">乘车险</div>
                    <div class="value">${totalInsurancePrice!0}<span></span>元</div>
                </li>
                <li>
                    <div class="name">服务费</div>
                    <div class="value">${totalServiceFee!0}<span>元</span></div>
                </li>
                <li>
                    <div class="name">门票费</div>
                    <div class="value">${orderInformation.spotPrice!0}<span>元</span></div>
                </li>
            </ul>
        </div>
        <div class="close">返回</div>
    </div>
</div>

<input type="hidden" id="orderNo" value="${orderInformation.orderNo!''}"/>
<input type="hidden" id="settleType" value="${settleType!1}"/>
<input type="hidden" id="orderStatusInt" value="${orderInformation.orderStatusInt!''}"/>
<input type="hidden" id="tripDate" value="${tripDate!''}"/>
<input type="hidden" id="autoShow" value="${autoShow!}"/>
<input type="hidden" id="countDownTime" value="${countDownTime!''}"/>
<input type="hidden" id="ifCooperate" value="${orderInformation.ifCooperate!0}"/>
<input type="hidden" id="sellProviderId" value="${orderInformation.sellProviderId!0}"/>
<input type="hidden" id="providerId" value="${orderInformation.providerId!0}"/>
<input type="hidden" id="departTime" value="${orderInformation.departTime!''}"/>
<input type="hidden" id="hasCanRefund" value="${orderInformation.hasCanRefund!0}">

<input type="hidden" id="serviceFee" value="${serviceFee!0}"/>
<input type="hidden" id="price" value="${ticketPrice!0}"/>
<input type="hidden" id="spotOrderCount" value="${spotOrderCount!0}"/>
<input type="hidden" id="directUrlParam" value="${orderInformation.directUrlParam!''}"/>

    <script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/vectors.min.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/busTicket/order/busTicket_orderDetail.js?v=${version!}"></script>

</body>
</html>