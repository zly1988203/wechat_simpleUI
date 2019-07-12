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
    <link href="/res/style/bus/ticket-rule.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/payment-2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/passenger.css?v=${version!}" rel="stylesheet" type="text/css">
    <!-- start Dplus --><script src="/js/udplus.js"></script><!-- end Dplus -->
</head>

<body>
<div class="ticket-tips" id="timeWarnTips" style="display: none">距离乘车时间不足30分钟，请您确保能够及时乘车。</div>
	<div id="templatePassenger" style="display:none;">
	                             <li class="templateClass" data-select="false" data-name="passengerName" data-phone="passengerPhone" data-code="passengerIdCard" data-id="passengerId">
	                                <div class="name">
	                                    <input type="checkbox" class="frm-checkbox checkBoxClass" />
	                                </div>
	                                <div class="info">
	                                    <h4>passengerName</h4>
	                                    <p><em>手机号</em>passengerPhone</p>
	                                    <p class="idCard"><em>身份证</em>passengerIdCard</p>
	                                </div>
	                                <div class="handle">
	                                    <i class="icon-edit editPassengerButton"></i>
	                                </div>
	                            </li>
      </div>
    <div class="ticket-info sui-border-b">
        <div class="time">${order.departTime?number_to_datetime?string("MM月dd日  HH:mm")}&emsp;发车<#if (isLineCooperate!"0")!="0"><span class="distribution">${tagName!""}</span></#if></div>
        <div class="station">
            <div class="start">${order.departTitle!""}</div>
            <div class="end">${order.arriveTitle!""}</div>
        </div>
       <!-- <div class="warm-prompt">
            <h6>温馨提示：</h6>
            <p>${remindContent!"儿童票、学生票等请前往车站购买。请在发车前提前到站取票，以免耽误行程。距发车时间15分钟内不支持网上退票。"}</p>
        </div>
        <div class="ticket-rule" data-trigger-rule="#ticketRule">取票/退票规则</div>-->
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
                        <P>${payRule!}</P>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!--乘车人列表-->
    <#if needIdCard == 1>
    		 <!-- 乘车人：需要乘车人信息 -->
		    <div id="passengerWrapper" class="passenger">
		        <div class="head sui-border-b" id="popupPassenger">
		            <h4>乘车人<span>（最多${ticketMaxBuyNumber}位）</span></h4>
		            <div class="handle-plus">
		                <i id="selectPassengerButton" class="icon-plus">添加</i>
		            </div>
		        </div>
		        <div class="content">
		        	<#if passengerList?exists>
		        	<#list passengerList as passenger>
		        	<div class="item" data-id="${passenger.id!}" data-idcard="${passenger.idCardNo!}">
		                <div class="handle-minus"></div>
		                <div class="name">${passenger.passengerName!}</div>
		                <div class="info">
		                    <p><span class="label">手机号</span>${passenger.mobile!}</p>
                            <#if needIdCard == '1'> <p><span class="label">身份证</span>${passenger.idCardNo!"请补充身份证号"}</p></#if>
		                </div>
		            </div>
		            </#list>
					</#if>
		        </div>
		    </div>
		    <div id="passengerList" class="sui-popup-container">
		        <div class="sui-popup-mask"></div>
		        <div class="sui-popup-modal">
		            <!--乘车列表-->
		            <div class="wrapper listWrapper">
		                <div class="content">
									
		                    <div class="passenger-list-wrapper">
		                        <ul class="sui-list sui-list-cover sui-border-b">
		                            <li class="sui-cell-centerlink add-btn addPassengerButton">添加乘车人</li>
		                        </ul>
		                        <ul class="passenger-list sui-list sui-list-cover passenger-list_ele">
		                        </ul>
		                    </div>
		                    <div class="not-data" id="passEmpty"  style="background-image: url(/res/images/common/icon_no_rider.png); display:none">您当前还未添加乘车人</div>
		                </div>
		            </div>
		
		            <div class="btn-group pab-10" id="passbtn" >
		            <div class="btn primary" id="selectButton">完成</div>
		            </div>
		
		        </div>
		    </div>
	</#if>
    <!--添加乘车人-->
    <div id="addPassenger" class="sui-popup-container">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">

            <div class="add-passenger-wrapper">
                <ul class="form sui-list sui-list-cover">
                    <li class="sui-border-b">
                        <label>姓名</label>
                        <input type="text" id="addPassengerName" placeholder="请输入姓名" maxlength="10"/>
                    </li>
                    <li class="sui-border-b">
                        <label>手机号</label>
                        <input type="text" id="addPassengerPhone" placeholder="请输入手机号"  maxlength="11"/>
                    </li>
                    <li class="sui-border-b idCard">
                        <label>身份证</label>
                        <input type="text" id="addPassengerCode" placeholder="请输入身份证"  maxlength="18"/>
                    </li>
                </ul>
            </div>

            <div class="btn-group pab-10">
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
                        <input type="text" id="editPassengerName" placeholder="请输入姓名" maxlength="10"/>
                    </li>
                    <li class="sui-border-b">
                        <label>手机号</label>
                        <input type="text" id="editPassengerPhone" placeholder="请输入手机号"  maxlength="11"/>
                    </li>
                    <li class="sui-border-b idCard">
                        <label>身份证</label>
                        <input type="text" id="editPassengerCode" placeholder="请输入身份证" maxlength="18"/>
                    </li>
                </ul>
            </div>

            <div class="btn-group pab-10">
            <div class="btn default" id="cancelEditButton">取消</div>
            <div class="btn primary" id="submitEditButton">确定</div>
            </div>

        </div>
    </div>

    <!--
      如果不需要向右的箭头，去掉li.class=sui-cell-link即可
      文案提示：您当前没有可用优惠券
    -->
    <ul class="coupon-btn sui-list">
        <!-- 不需要乘车信息 start -->
        <#if needIdCard == 0>
	        <li class="sui-border-b passenger-list">
	            <div class="name">
	                <h4>乘车人数<span>（最多${ticketMaxBuyNumber}位）</span></h4>
	            </div>
	            <div class="value operation">
	                <div class="handle-plus" data-passengerNum="1" id="passengerNumber">
	                    <i class="icon-minus out"></i>
	                    <span class="txt">1</span>
	                    <i class="icon-plus"></i>
	                </div>
	            </div>
	        </li>
	    </#if>    
        <!-- end -->
         
        <li class="sui-border-b">
            <div class="name">
            	票价总额
            </div>
           	<div class="value text-red" id="ticketPriceContent">0元</div>
        </li>
        <li class="sui-border-b" id="specialPriceli" style="display:none">
            <div class="name"><span id="activityName">特价优惠</span><span class="special-tips"></span></div>
            <div class="value text-red" id="specialPrice">-2元</div>
        </li>
        
        <li class="sui-border-b sui-cell-link coupon-toggle notPayLater" style="display: none" id="coupon-li">
            <div class="name">
                优惠金额
            </div>
            	<div class="value text-gray" id="couponUsePrice" ></div>
        </li>
    </ul>

<!--保险v2.0start-->
<div class="insurance-container">
    <div class="insurance-title">
        <div class="title">出行保障<span>（为自己和家人添一份安心）</span></div>
        <div class="amount" id="insurancePrice">0元</div>
    </div>
    <div id="wrapper">
        <div class="content" data-action="true">
            <ul>
                <#if insuranceRulePriceList?exists>
                    <#list insuranceRulePriceList as insuranceRule>
                        <li class="insurance-item" data-unit="${insuranceRule.insurancePrice!0}" data-type="${insuranceRule.insuranceType!0}" data-id="${insuranceRule.insuranceId!0}" data-defaultChoice="${insuranceRule.defaultChoice?string ("true","false")}">
                            <div class="desc">${insuranceRule.sumInsured/10000!0}万保障</div>
                            <div class="amount"><span class="unit-price">￥${insuranceRule.insurancePrice!0}</span> x <span class="count">份</span></div>
                            <div class="insuranceIntro" style="display: none">${insuranceRule.insuranceIntro!'暂无说明'}</div>
                            <div class="detail-btn"><span>详情</span></div>
                        </li>
                    </#list>
                </#if>
            </ul>
        </div>
    </div>
</div>
<!--备注-->
<div class="comment-container" id="commentBtn">
    <div class="comment">备注</div>
    <div class="comment-text" id="commentText">选填</div>
</div>
<!--备注弹出框-->
<div id="popupCommentInfo" class="sui-popup-container comment-info-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <!--内容开始-->
        <div class="close"><img src="/res/images/newInnerCity/icon-left.png"/></div>
        <div class="commit">
            <label>
                <textarea id="remark" placeholder="${remark!'可填写备注，建议填写与我们沟通好的内容'}" maxlength="40"></textarea>
                <div class="message-length">0/40</div>
            </label>
        </div>
        <div class="btn-group">
            <div class="btn">确定</div>
        </div>
        <!--内容结束-->
    </div>
</div>
<!--保险详情弹出-->
<div class="popup-container" id="insuranceDetail" style="display: none">
    <div class="content">
        <div class="main-content">
            <div class="title sui-border-b">保险说明</div>
            <div class="main"></div>
        </div>
        <div class="close"></div>
    </div>
</div>
<!--保险v2.0end-->

	<!--<div class="commit-bar">
        <h4>备注</h4>
        <div class="commit">
            <label for="message-1">
                <textarea id="remark" placeholder="${remark!'可填写备注，建议填写与我们沟通好的内容'}" maxlength="40"></textarea>
                <div class="message-length">0/40</div>
            </label>
        </div>
    </div>-->

    <ul class="payment-way sui-list sui-border-tb">
		<li value="1">
            <div class="icon icon-1">微信支付<em>（推荐）</em></div>
            <input type="radio" name="pay" id="wechatPay" class="frm-radio" checked />
        </li>

        <li id="onLineCarPay" value="2" style="display: none">
            <div class="icon icon-2">上车支付</div>
            <input type="radio" name="pay" id="boardPay" class="frm-radio" />
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
        <button id="confirmPay">确认支付0元</button>
    </div>
    <input type="hidden" id="allowOnLineBook" value="${allowOnLineBook!''}"/>
    <input type="hidden" id="timeWarnFlag" value="${timeWarnFlag!''}"/>
    <input type="hidden" id="isLineCooperate" value="${isLineCooperate!''}"/>
    <input type="hidden" id="qrcId" value="${qrcId!''}"/>
    <input type="hidden" id="settleType" value="${settleType!'1'}">
    <!-- 是否有保险 1-有 2-无 -->
    <input type="hidden" id="needInsurance" value="${needInsurance!''}">
    <input type="hidden" id="needIdCard" value="${needIdCard!''}">
    <input type="hidden" id="ticketMaxBuyNumber" value="${ticketMaxBuyNumber!''}">

    <input type="hidden" id="ticketPrice" value="${order.ticketPrice!'0'}">
    <input type="hidden" id="singleDiscount" value="${singleDiscount!0}">
    <input type="hidden" id="leftNum" value="${leftNum!0}">
    <input type="hidden" id="promoteNum" value="${promoteNum!0}">
    <input type="hidden" id="promoteType" value="${promoteType!0}">
    <input type="hidden" id="busIdStr" value="${order.busIdStr!''}">
    <input type="hidden" id="lineType" value="${lineType!''}">

    <script src="/js/commonBus.js?v=${version!}"></script>
    <script src="/js/vectors.min.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/coupons/coupons.js?v=${version!}"></script>
    <script src="/js/commonjs/idCard.js?v=${version!}"></script>
    <script src="/js/bus/payMent.js?v=${version!}"></script>
</body>
