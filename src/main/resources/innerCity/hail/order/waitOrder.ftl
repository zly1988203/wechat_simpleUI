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
    <link href="/res/style/innerCity/order/waitOrder.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>
<input id="status" type="hidden" value="${orderInfo.status!'0'}">
<input id="orderNo" type="hidden" value="${orderInfo.orderNo!''}">
<input id="tripNo" type="hidden" value="${orderInfo.tripNo!''}">
<input id="settleMode" type="hidden" value="${orderInfo.settleMode!'1'}">
<input id="userId" type="hidden" value="${orderInfo.userId!'1'}">
<input id="realPay" type="hidden" value="${orderInfo.realPay!''}">
<input id="payPrice" type="hidden" value="${orderInfo.payPrice!''}">
<input id="departTitle" type="hidden" value="${orderInfo.departTitle!''}">
<input id="arriveTitle" type="hidden" value="${orderInfo.arriveTitle!''}">
<input id="tipsMessage" type="hidden" value="${orderInfo.tipsMessage!''}">
<input id="departCity" type="hidden" value="${orderInfo.departCity!''}">
<input id="departArea" type="hidden" value="${orderInfo.departArea!''}">
<input id="arriveCity" type="hidden" value="${orderInfo.arriveCity!''}">
<input id="arriveArea" type="hidden" value="${orderInfo.arriveArea!''}">
<input id="numbers" type="hidden" value="${orderInfo.numbers!0}">
<input id="downRegion" type="hidden" value="${orderInfo.downRegion!''}">
<input id="upRegion" type="hidden" value="${orderInfo.upRegion!''}">
<input id="departType" type="hidden" placeholder="车型名称" value="${orderInfo.departType!0}">
<input id="departCarType" type="hidden" value="${orderInfo.departCarType!0}">
<input id="departTime" type="hidden" value="${orderInfo.departTime!0}">
<!--是否可取消订单标志 0-不可取消，1-可取消-->
<input type="hidden" id="hasCanCancelOrder" placeholder="是否可取消订单标志" value="${orderInfo.hasCanCancelOrder!''}"/>
<!--0：未支付，1：已支付，2：已退款-->
<input type="hidden" id="payStatus" placeholder="支付状态" value="${orderInfo.payStatus!''}"/>

<!--行程状态 1-发起行程  2-等待接单  3-待执行 4-去接乘客 5-到达出发地 6-接到乘客，去往目的地  7-到达目的地 8-已完成 9-已取消  10:发起收款-->
<input type="hidden"  id="tripStatus" placeholder="行程状态"  value="${orderInfo.tripStatus!''}">
    <div class="payment">
        <div class="payment-list">
            <div class="head">
                <div id="departTimeFmt" class="date"></div>
            </div>
            
           <div class="main">
                <div class="info">
                    <div class="info-item start"></div>
                    <div class="info-item end"></div>
                    <div class="code"></div>
                </div>
            </div>
            <div class="tips"></div>
        </div>

        <div class="payment-info" style="display: none">
            <div class="title">订单支付成功</div>

            <div class="price-container" >
                <span>实付${orderInfo.payPrice!""}元</span>
            </div>
        </div>

        <div class="range">            
        </div>
        <div class="block">
            <div class="tip-content"><span>正在为您安排车辆</span></div>
            <div class="location-point"></div>
        </div>
        <div class="white_overlay"></div>
        <div class="ola-maps" id="allmap"></div>

        <div class="black_overlay" style="display:none"></div>
        <div class="cancel-popup"  style="display:none">
            <div class="cancel-tip">支付成功后，将优先为您安排车辆</div>
            <div class="cancel-btns">
                <div class="is-cancel">确定取消</div>
                <div class="no-cancel">暂不取消</div>
            </div>
        </div>

        <div class="pay-foot">
            <div class="btn-group">
                <div class="btn return" id="back">返回</div>
                <div class="btn cancel" id="cancel">取消订单</div>
                <!--<div class="btn1 cancel" id="refund" style="display:none">取消订单</div>-->
                <div class="btn contact-btn" id="contact">联系客服</div>
            </div>
        </div>
    </div>
<script src="https://webapi.amap.com/maps?v=1.4.4&key=65b7cb5e8c694cb822cd32791319b348&plugin=AMap.Driving"></script>
<script src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/backtrack.min.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/hail_innerCity/order/commonInnerCity.js?v=${version!}"></script>
<script src="/js/hail_innerCity/order/waitOrder.js?v=${version!}"></script>


</body>
</html>
