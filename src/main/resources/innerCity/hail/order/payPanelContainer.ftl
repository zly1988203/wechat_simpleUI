<input type="hidden" id="orderPrice" placeholder="订单金额" value="${orderInfo.orderPrice!0}"/>
<input type="hidden" id="price" placeholder="订单金额" value="${orderInfo.price!0}"/>
<input type="hidden" id="discountPrice" placeholder="优惠金额" value="${orderInfo.discountPrice!0}"/>
<input type="hidden" id="specialActivityType" placeholder="" value="${orderInfo.specialActivityType!0}"/>
<input type="hidden" id="specialActivityName" placeholder="" value="${orderInfo.specialActivityName!'特价优惠'}"/>
<input type="hidden" id="specialPrice" placeholder="特价金额" value="${orderInfo.specialPrice!0}"/>
<input type="hidden" id="couponPrice" placeholder="优惠券" value="${orderInfo.couponPrice!0}"/>
<input type="hidden" id="payPrice" placeholder="支付金额" value="${orderInfo.payPrice!0}"/>
<input type="hidden" id="refundPrice" placeholder="退款金额" value="${orderInfo.refundPrice!0}"/>
<input type="hidden" id="feePrice" placeholder="手续费" value="${orderInfo.feePrice!0}"/>
<input type="hidden" id="realPrice" placeholder="实际支付价格" value="${orderInfo.realPrice!0}"/>
<input type="hidden" id="priceAdjustValue" placeholder="调整价格" value="${orderInfo.priceAdjustValue!0}"/>
<!--0:减价 1：加价-->
<input type="hidden" id="priceAdjustType" placeholder="调整价格类型" value="${orderInfo.priceAdjustType!''}"/>
<!--0：未支付，1：已支付，2：已退款-->
<input type="hidden" id="payStatus" placeholder="支付状态" value="${orderInfo.payStatus!''}"/>

<div id="payPanel" class="bottom-container payment-container" style="display: none;">
    <div class="top">
        <div class="amount"><label>${orderInfo.realPrice!"0"}</label>元</div>
        <div class="detail">车费明细</div>
        <div id="closePayPanel" class="close"></div>
    </div>
    <div class="middle">
        <ul>
            <li>
                <div class="name">一口价</div>
                <div class="value">${orderInfo.price!""}元</div>
            </li>
            <li class="coupon" id="coupon">
                <div class="name">优惠券</div>
                <div class="value"></div>
            </li>
        </ul>
    </div>
    <div class="bottom">
        <input id="recordId" type="hidden" placeholder="优惠券id" value="">
        <input id="amount" type="hidden" placeholder="优惠券面额" value="">
        <input id="newCouponPrice" type="hidden" placeholder="优惠券抵扣金额" value="">
        <input id="newPayPrice" type="hidden" placeholder="选完优惠券后的支付价格" value="">
        <input id="oldPrice" type="hidden" placeholder="" value="${orderInfo.payPrice!0}">
        <!--<div class="pay-btn normal" id="paymentBtn">微信支付</div>-->
        <div class="pay-btn protrude" id="paymentBtn">微信支付</div>
    </div>
</div>