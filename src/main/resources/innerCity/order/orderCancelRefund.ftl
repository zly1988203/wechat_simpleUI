<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>取消订单并退款</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/innerCity/order-cancel-opt.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>
<input type="hidden" id="orderPrice" placeholder="订单金额" value="${orderInfo.orderPrice!0}"/>
<input type="hidden" id="discountPrice" placeholder="优惠金额" value="${orderInfo.discountPrice!0}"/>
<input type="hidden" id="specialActivityType" placeholder="" value="${orderInfo.specialActivityType!0}"/>
<input type="hidden" id="specialActivityName" placeholder="" value="${orderInfo.specialActivityName!''}"/>
<input type="hidden" id="specialPrice" placeholder="" value="${orderInfo.specialPrice!0}"/>
<input type="hidden" id="couponPrice" placeholder="优惠券" value="${orderInfo.couponPrice!0}"/>
<input type="hidden" id="payPrice" placeholder="支付金额" value="${orderInfo.payPrice!0}"/>
<input type="hidden" id="refundPrice" placeholder="退款金额" value="${orderInfo.refundPrice!0}"/>
<input type="hidden" id="feePrice" placeholder="手续费" value="${orderInfo.feePrice!0}"/>
<input type="hidden" id="orderNo" placeholder="订单号" value="${orderInfo.orderNo}"/>
<input type="hidden" id="tel" placeholder="客服电话" value="${orderInfo.tel!''}"/>
<input type="hidden" id="departCity" placeholder="出发地城市" value="${orderInfo.departCity!''}"/>
<input type="hidden" id="departArea" placeholder="出发地区域" value="${orderInfo.departArea!''}"/>
<input type="hidden" id="departTitle" placeholder="出发地名称" value="${orderInfo.departTitle!''}"/>
<input type="hidden" id="arriveCity" placeholder="目的地城市" value="${orderInfo.arriveCity!''}"/>
<input type="hidden" id="arriveArea" placeholder="目的地区域" value="${orderInfo.arriveArea!''}"/>
<input type="hidden" id="arriveTitle" placeholder="目的地名称" value="${orderInfo.arriveTitle!''}"/>
<input type="hidden" id="departAreaCode" placeholder="出发地区域code" value="${orderInfo.upRegionId!''}"/>
<input type="hidden" id="departLat" placeholder="出发地纬度" value="${orderInfo.departLat!''}"/>
<input type="hidden" id="departLng" placeholder="出发地经度" value="${orderInfo.departLng!''}"/>
<input type="hidden" id="departRegionName" placeholder="出发地区域名称" value="${orderInfo.upRegion!''}"/>
<input type="hidden" id="arriveAreaCode" placeholder="目的地区域code" value="${orderInfo.downRegionId!''}"/>
<input type="hidden" id="arriveLat" placeholder="目的地纬度" value="${orderInfo.arriveLat!''}"/>
<input type="hidden" id="arriveLng" placeholder="目的地经度" value="${orderInfo.arriveLng!''}"/>
<input type="hidden" id="arriveRegionName" placeholder="目的地区域名称" value="${orderInfo.downRegion!''}"/>

<!--1 即时行程 2 预约时间行程 3 拼车 4 包车-->
<input type="hidden" id="departType" placeholder="订单类型" value="${orderInfo.departType!''}"/>
<!-- 1 舒适 2 商务 3 豪华型-->
<input type="hidden" id="carTypeId" placeholder="车辆类型" value="${orderInfo.carTypeId!''}"/>
<input type="hidden" id="numbers" placeholder="人数" value="${orderInfo.numbers!''}"/>
<!--1未取消 2 乘客取消 3 司机取消 4 车企取消 5 超时取消 6 未支付取消',-->
<input type="hidden" id="cancelType" placeholder="取消订单类型" value="${orderInfo.cancelType!''}"/>
<input type="hidden" id="remark" placeholder="给司机留言" value="${orderInfo.remark!''}"/>
<input type="hidden" id="departTime" placeholder="出行时间" value="${orderInfo.departTime!''}"/>

    <div class="main-container">
        <!--行程起始点信息-->
        <div class="journey-container">
            <div class="time-box"><!--出发时间：10月15日 10:00 - 10:30--></div>
            <div class="station-box">
                <div class="left">
                    <div class="station depart"><!--深圳南山·深圳湾创业投资大厦--></div>
                    <div class="station arrive"><!--深圳福田·一个神奇的地方--></div>
                </div>
                <div class="right">
                    <div class="box"><!--<div>4人</div><div>舒适型</div>--></div>
                </div>
            </div>
            <div class="notes-box">
                <div class="icon"></div>
                <div class="notes"><!--愿意等待15分钟以上--></div>
            </div>
        </div>
        <!--退款详情信息-->
        <div class="cancel-detail-container">
            <!-- <div class="title">退款详情</div>
             <div class="detail-list">
                 <ul>
                     <li>
                         <div class="name">一口价</div>
                         <div class="value">93.3元</div>
                     </li>
                     <li>
                         <div class="name">优惠券</div>
                         <div class="value">-10元</div>
                     </li>
                     <li>
                         <div class="name">实付金额</div>
                         <div class="value">88.3元</div>
                     </li>
                 </ul>
                 <div class="refund-amount">
                     <div class="amount">退款金额<span>88.3元</span>(手续费 0元)</div>
                     <div class="tips">退款金额将在7个工作日内，按原支付途径退回</div>
                 </div>
                 <div class="refund-notes-box">
                     <textarea class="notes" placeholder="取消原因（选填）" maxlength="20"></textarea>
                     <div class="compute"><span class="current">0</span>/<span class="max">200</span></div>
                 </div>
             </div>-->
        </div>
        <!--按钮-->
        <div class="btn-group">
            <div class="btn normal" id="notRefund">暂不取消</div>
            <div class="btn protrude" id="refund">确定取消</div>
        </div>
    </div>

	<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
    <script src="/js/vectors.min.js?v=${version!}"></script>
	<script src="/js/backtrack.min.js?v=${version!}"></script>
	<script src="/js/innerCityJs/order/orderCancelRefund.js?v=${version!}"></script>
</body>
</html>
