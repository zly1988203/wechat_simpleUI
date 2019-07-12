<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>购票</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/payment-2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/passenger.css?v=${version!}" rel="stylesheet" type="text/css">
    <!-- start Dplus --><script src="/js/udplus.js"></script><!-- end Dplus -->
</head>

<body>
	<#if (result.departTimeClose!0) == 1>
	 <div class="ticket-tips">距离乘车时间不足30分钟，请您确保能够及时乘车。</div>
	 </#if>
    <div class="ticket-info sui-border-b">
        <div class="time">${result.departTime!''}</div>
        <div class="station">
            <div class="start">${result.departTitle!''}</div>
            <div class="end">${result.arriveTitle!''}</div>
        </div>
        <div class="ticket-rule" data-trigger-rule="#ticketRule">购票/退票规则</div>
    </div>

    <!-- 取票/退票规则 - 使用规则 -->
    <div id="ticketRule" class="sui-popup-container">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <div class="rule-content">
                <div class="close-popup close" data-target="ticketRule"></div>
                <h1>购票/退票规则</h1>
                <div class="rule-bar">
                    <div class="content">
                        <P>${result.payRule!''}</P>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!--
      如果不需要向右的箭头，去掉li.class=sui-cell-link即可
      文案提示：您当前没有可用优惠券
    -->
    <ul class="coupon-btn sui-list">
        <li class="sui-border-b">
            <div class="name">购票天数</div>
            <div class="value">${result.days!''}天 </div>
        </li>
        <li class="sui-border-b">
            <div class="name">票价总额</div>
            <div class="value text-red"><#if result.price??>${result.price?string("#.##")}<#else>0</#if>元</div>
        </li>
        <#if (result.specialPrice>0)>
        <li class="sui-border-b">
            <div class="name">${result.activityName!'特价优惠'}
            <#if (result.promoteType ==1) && (result.promoteNum > 0)>
            <span class="special-tips">${(result.promoteNum!0)?string("#.#")}折（${result.specialNum!}张）</span></div>
            <#else>
            <span class="special-tips">${result.specialNum!}张</span></div>
            </#if>
            
            <div class="value text-red">-${(result.specialPrice!0)?string("#.##")}元</div>
        </li>
        </#if>

        <li id="couponLi" class="sui-border-b sui-cell-link coupon-toggle" style="display: none">
            <div class="name">优惠金额</div>
            <div class="value text-gray" id="couponUsePrice"></div>
        </li>
    </ul>

    <!-- 选择交通意外险 -->
    <div id="insuranceList" class="sui-popup-container">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">

            <div class="wrapper listWrapper">
                <div class="content">
                    <div class="popup-list insurance-list">

                        <div class="item green">
                            <div class="left">
                                <div class="head">
                                    <div class="content">
                                        <h4>太平洋5元保险</h4>
                                        <p>100000元意外伤害，5000元意外医疗。</p>
                                    </div>
                                    <div class="price"><span>5</span>元/份</div>
                                </div>
                                <div class="state insurance-rule">保险说明</div>
                            </div>
                        </div>
                        <div class="item green">
                            <div class="left">
                                <div class="head">
                                    <div class="content">
                                        <h4>印度洋30元保险</h4>
                                        <p>100000元意外伤害，5000元意外医疗。</p>
                                    </div>
                                    <div class="price"><span>30</span>元/份</div>
                                </div>
                                <div class="state insurance-rule">保险说明</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="footer-fixed">
                <div class="btn-bar pab-10">
                    <button id="closeInsurance">不购买保险</button>
                </div>
            </div>

        </div>
    </div>

    <!-- 保险 - 说明 -->
    <div id="insuranceRule" class="sui-popup-container">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <div class="rule-content">
                <div class="close-popup close" data-target="insuranceRule"></div>
                <h1>保险说明</h1>
                <P>缺少文案</P>
            </div>
        </div>
    </div>
    
    <ul class="payment-way sui-list sui-border-tb">
		<li>
            <div class="icon icon-1">微信支付<em>（推荐）</em></div>
            <input type="radio" name="pay" class="frm-radio" checked />
        </li>
	</ul>

    <div class="btn-bar pab-10">
        <button id="confirmPay">确认支付<#if result.payPrice??>${result.payPrice?string("#.##")}<#else>0</#if>元</button>
    </div>

    <input type="hidden" id="busIds" value="${result.busIds!''}">
    <input type="hidden" id="busId" value="${result.busId!''}">
    <input type="hidden" id="price" value="${result.price!0}">
    <input type="hidden" id="specialPrice" value="${result.specialPrice!0}">
    <input type="hidden" id="realSpecialPrice" value="${result.realSpecialPrice!0}">
    <input type="hidden" id="payPrice" value="${result.payPrice!0}">
    <input type="hidden" id="qrcId" value="${result.qrcId!''}">
    <input type="hidden" id="settleType" value="${settleType!''}">

    <script src="/js/commonBus.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/vectors.min.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/coupons/coupons.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/commute/toAddOrder.js?v=${version!}"></script>
</body>
</html>