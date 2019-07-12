<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>确认订单</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/fy-datepicker.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/swiper.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/payment-2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/passenger.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/attractions.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/coach/confirm-order.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>
<input type="hidden" id="ticketMaxBuyNumber" value="${ticketMaxBuyNumber!'5'}">
<input type="hidden" id="servicePrice" value="${line.servicePrice!'0'}">
<input type="hidden" id="lineId" value="${line.id!''}">
<input type="hidden" id="sellPrice" value="${baseBus.sellPrice!'0'}">
<input type="hidden" id="ticketSaleStatus" value="${ticketSaleStatus!'0'}">
<input type="hidden" id="baseBusIdStr" value="${baseBus.idStr}">
<input type="hidden" id="departPid" value="${departPid!''}">
<input type="hidden" id="arrivePid" value="${arrivePid!''}">
<input type="hidden" id="departStation" value="${departStation!''}">
<input type="hidden" id="arriveStation" value="${arriveStation!''}">
<input type="hidden" id="departDate" value="${departDate!''}">
<input type="hidden" id="settleType" value="${settleType!''}">
<input type="hidden" id="departDesc" value="${baseBus.departDesc!''}">

<div class="ticket-info">
    <div class="head">
        <div class="time">
            <#if baseBus.departDate?exists>
                ${baseBus.departDate?string('MM月dd日')}
            </#if>
            <#if baseBus.departDesc?has_content && baseBus.departDesc == "2">
                流水班可随时上车
            <#else>
                <#if baseBus.departTime?exists>
                    ${baseBus.departTime?string('HH:mm')}
                </#if>  发车
            </#if>
        </div>
        <div class="lineTag">
            <#if baseBus.isCooperateDealer == 0>
                自营线路
            <#else>
                合作线路
            </#if>
        </div>
    </div>
    <!--<div class="amount">-->
        <!--<#if baseBus.consumeTime?exists>-->
            <!--行程约${baseBus.consumeTime!""}小时-->
        <!--</#if>-->
    <!--</div>-->

    <div class="station">
        <div class="start">
            ${baseBus.departStation}
            <p>${baseBus.departCityName!''} ${baseBus.departDistrictName!''}</p>
        </div>
        <div class="end">
            ${baseBus.arriveStation}
            <p>${baseBus.arriveCityName!''} ${baseBus.arriveDistrictName!''}</p>
        </div>
    </div>
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
                    <P>${ticketRule!""}</P>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 乘车人：需要乘车人信息 -->
<div id="passengerWrapper" class="passenger" style="display: none">
    <div class="ticketType">
        <div class="head sui-border-b" id="addPassengerContact">
            <div class="item-title">乘车人 <span class="item-price">${baseBus.sellPrice!'0'}元/人</span> <span class="item-tips">（最多${ticketMaxBuyNumber!"5"}位）</span></div>
            <div class="handle-plus">
                <i id="selectPassengerButton" class="icon-plus">添加</i>
                <input id="addPassnegerTotal" type="hidden" val="0">
            </div>
        </div>
        <div class="content">
        </div>
    </div>
</div>

<div id="passengerPanle" class="person-panle passenger" style="display: none">
    <div class="content">
    </div>
</div>

<div id="carryingChildren" class="person-panle">
    <div class="content">
        <div class="person-item">
            <div class="item-type">携带免费儿童<em>(身高1.2米下的儿童乘车)</em></div>
            <div class="item-number">
                <div class="reduce-number"></div>
                <div class="number-str">
                    <div class="number-val">
                        <span>0</span>
                        <input id="carryingChildrenNumbers" type="hidden" value="0">
                    </div>
                </div>
                <div class="add-number"></div>
            </div>
        </div>
    </div>
</div>


<!--乘车人列表-->
<div id="passengerList" class="sui-popup-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <!--乘车列表-->
        <ul class="sui-list sui-list-cover sui-border-b">
            <li class="sui-cell-centerlink add-btn addPassengerButton">添加人员信息</li>
        </ul>
        <div id="swriperBox">
            <div class="swiper-container" id="passengerListContainer">
                <div class="swiper-wrapper" id="passengerListWrapper"></div>
                <div class="swiper-scrollbar"></div>
            </div>
        </div>

        <div class="btn-bar pab-10 btn-flex">
            <button id="selectCanle" class="btn-f1">取消</button>
            <button id="selectButton">确定</button>
        </div>

    </div>
</div>

<!--添加乘车人-->
<div id="addPassenger" class="sui-popup-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">

        <div class="add-passenger-wrapper">
            <ul class="form sui-list sui-list-cover">
                <li class="sui-border-b">
                    <label>姓名</label>
                    <input type="text" id="addPassengerName" placeholder="请输入姓名" />
                </li>
                <li class="sui-border-b">
                    <label>手机号</label>
                    <input type="tel" maxlength="11" id="addPassengerPhone" placeholder="请输入手机号" />
                </li>
                <li class="sui-border-b">
                    <label>身份证</label>
                    <input type="text" maxlength="18" id="addPassengerCode" placeholder="请输入身份证" />
                </li>
            </ul>
        </div>

        <div class="btn-group">
            <div class="btn default" id="cancelAddButton">取消</div>
            <div class="btn primary" id="submitAddButton">确定</div>
        </div>

    </div>
</div>

<!--编辑乘车人-->
<div id="editPassenger" class="sui-popup-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <div class="edit-passenger-wrapper">
            <ul class="form sui-list sui-list-cover">
                <li class="sui-border-b">
                    <label>姓名</label>
                    <input type="text" id="editPassengerName" placeholder="请输入姓名" />
                </li>
                <li class="sui-border-b">
                    <label>手机号</label>
                    <input type="tel" maxlength="11" id="editPassengerPhone" placeholder="请输入手机号" />
                </li>
                <li class="sui-border-b">
                    <label>身份证</label>
                    <input type="text" maxlength="18" id="editPassengerCode" placeholder="请输入身份证" />
                </li>
            </ul>
        </div>

        <div class="btn-bar pab-10">
            <button id="submitEditButton">确定</button>
        </div>

    </div>
</div>

<ul class="coupon-btn sui-list">
    <li>
        <div class="name">票价总额</div>
        <div class="value text-red" id="totalTicketPrice">0元</div>
    </li>
    <li>
        <div class="name">服务费总额</div>
        <div class="value text-red" id="totalServicePrice">0元</div>
    </li>
</ul>

<!---------黄山门票 begin----------->
<#include "toAddBusTicketOrder_Spot.ftl">
<!---------黄山门票 end----------->

<!--保险v2.0start-->
<#include "toAddBusTicketOrder_Insurance.ftl">
<!--保险v2.0end-->

<ul class="payment-way sui-list sui-border-tb">
    <li>
        <div class="icon icon-1">微信支付<em>（推荐）</em></div>
        <input type="radio" name="pay" class="frm-radio" checked />
    </li>
</ul>

<div class="warm-prompt">
    <div class="head">
        <h6>温馨提示：</h6>
        <div class="ticket-rule" data-trigger-rule="#ticketRule">取票/退票规则</div>
    </div>
    <p>${remindContent!"儿童票、学生票等请前往车站购买。请在发车前提前到站取票，以免耽误行程。距发车时间15分钟内不支持网上退票。"}</p>
</div>

<div class="btn-bar pab-10">
    <div class="btn-contain">
        <!-- <div  class="btn-popup">
             <span id="payDetail" class="close"></span>
             <span>明细</span>
         </div>-->
        <div class="btnPay" id="confirmPay" data-clickable="true">确认支付0元</div>
    </div>

</div>

<!-- 是否有保险 1-有 2-无 -->
<input type="hidden" id="needInsurance" value="${needInsurance!''}">
<script src="/js/commonBus.js?v=${version!}"></script>
<script src="/js/commonjs/idCard.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/coach/fy-datePicker.min.js?v=${version!}"></script>
<script src="/js/commonjs/swiper.min.js?v=${version!}"></script>
<script src="/js/busTicket/toAddBusTicketOrder.js?v=${version!}"></script>

</body>
</html>