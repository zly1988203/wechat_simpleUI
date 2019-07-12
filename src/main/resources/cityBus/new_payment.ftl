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
	<link href="/res/style/base/swiper.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/ticket-rule.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/cityBus/new_payment.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/cityBus/passengerHandle.css?v=${version!}" rel="stylesheet" type="text/css">
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
					<h6>passengerName</h6>
					<p class="idCard"><em>身份证</em></p>
				</div>
			<div class="handle">
				<i class="icon-edit editPassengerButton"></i>
			</div>
		</li>
	</div>

    <div class="ticket-info sui-border-b">
        <div class="time">

        </div>
        <div class="station">
            <div class="start"><div class="txt"></div></div>
            <div class="end"><div class="txt"></div></div>
        </div>
        <div class="special-price"></div>
        <div class="ticket-other-info">
        	<div class="ticket-num">少量余票</div>
            <div class="old-price">￥<span></span></div>
        </div>
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
                        <p></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- TODO 乘车人列表-->

		<!-- 乘车人：需要乘车人信息 -->
		<div id="passengerWrapper" class="passenger" style="display: none;">
			<div class="header-content common-border-b">
                <div class="head" id="popupPassenger">
                    <h4>乘车人<span></span></h4>
                    <div class="handle-plus">
                        <i id="selectPassengerButton" class="icon-plus">添加</i>
                    </div>
                </div>
			</div>


		<div class="content sui-border-b" >

		</div></div>
	<#--//选择乘车人-->
	<div class="popup-container select-person-container" id="passengerList" style="display: none">
        <div class="select-person-main">
            <div class="title-content">
                <div class="close" id="passengerCancel">取消</div>
                <div class="title-box">
                    <div class="title">选择乘车人(<span id="checkPassenger">0</span>/<span id="maxPassenger"></span>位）</div>
                    <div class="title-tips">根据相关部门规定，需要乘车人实名制登记</div>
                </div>
                <div class="confirm-btn" id="selectButton">确定</div>
            </div>
            <ul class="passenger-list person-content">

            </ul>
            <div class="add-person addPassengerButton"></div>
        </div>
	</div>
	<#--添加乘车人-->
    <div class="popup-container edit-person-container" style="display: none">
		<div class="popup-main">
			<div class="title-content">
				<div class="close-edit">取消</div><div class="title">编辑乘车人</div><div class="confirm-btn" data-confirm="true">确定</div>
			</div>
			<div class="edit-box">
				<#--<div class="edit-item">
					<div class="name">姓名</div>
					<input id="passengerName" class="value" value="啦啦啦" placeholder="请输入乘车人姓名" data-id="2549">
				</div>
				<div class="edit-item">
					<div class="name">身份证</div>
					<input id="passengerCode" class="value" value="513436200004247236" placeholder="请输入乘车人证件号码">
				</div>-->
			</div>
		</div>
	</div>
    <!--
      如果不需要向右的箭头，去掉li.class=sui-cell-link即可
      文案提示：您当前没有可用优惠券
    -->
    <ul class="coupon-btn sui-list">
        <!-- 不需要乘车信息 start -->

		<div class="no-info-passenger-list" style="display: none;">
            <li class="sui-border-b passenger-list paddingNo">
                <div class="name passengers">
                    <h4>乘车人数<span></span></h4>
                </div>
                <div class="value operation">
                    <div class="handle-plus" data-passengerNum="1" id="passengerNumber">
                        <i class="icon-minus out"></i>
                        <span class="txt">1</span>
                        <i class="icon-plus"></i>
                    </div>
                </div>
            </li>
            <div class="buy-tips count" style="display: none">特价限购 <span class="total"></span> 张，还可购 <span class="overplus"></span> 张</div>
		</div>


        <!-- end -->
        <div class="contact">
            <lable>联系手机<span>(用于接收短信电话通知)</span></lable>
				<input id='tel' type="number" value="" placeholder="请输入联系人手机号码" />

        </div>
		<div id="showTotalPrice">
            <li class="sui-border-b">
                <div class="name">票价总额</div>
                <div class="value text-red" id="ticketPriceContent"><span class="old-price-total"></span>&nbsp;<span class="new-price-total"></span></div>
            </li>
            <div class="buy-tips total" style="display: none">
                <span class="old-count"></span>&emsp;
                <sapn class="new-count"></sapn>
            </div>
		</div>

        <li class="sui-border-b" id="specialPriceli" style="display:none">
            <div class="name"><span id="activityName">特价优惠</span><span class="special-tips"></span></div>
            <div class="value text-red" id="specialPrice"></div>
        </li>
        
        <li class="sui-border-b sui-cell-link coupon-toggle notPayLater" style="display: none" id="coupon-li">
            <div class="name">优惠券</div>
            <div class="value text-gray" id="couponUsePrice" ></div>
        </li>
    </ul>

	<!--保险v2.0start-->
	<div class="insurance-container">
    	<div class="insurance-title">
        	<div class="title">保险</div>
        	<div class="amount" id="insurancePrice"></div>
    	</div>
    	<div id="wrapper">
    	    <div class="content" data-action="true">
	            <!--<ul>-->

        	    <!--</ul>-->
				<div class="swiper-container">
					<div class="swiper-wrapper">

					</div>
				</div>

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
	                <textarea id="remark" placeholder="<#--${remark!'可填写备注，建议填写与我们沟通好的内容'}-->" maxlength="40"></textarea>
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

	<ul class="payment-way sui-list sui-border-tb">
		<li value="1">
			<div class="icon icon-1">微信支付<em>（推荐）</em></div>
			<input type="radio" name="pay" class="frm-radio" checked />
		</li>

		<li id="onLineCarPay" value="2" style="display: none">
			<div class="icon icon-2">上车支付</div>
			<input type="radio" name="pay" class="frm-radio" />
		</li>
	</ul>
    
	<div class="warm-prompt">

	</div>
    
	<div class="btn-list">
		<div class="cancel">返回</div>
		<div class="pay-price">实付50元</div>
		<div class="submit" id="confirmPay">确认支付</div>
	</div>

    <script src="/js/commonBus.js?v=${version!}"></script>
    <script src="/js/vectors.min.js?v=${version!}"></script>
	<script src="/js/commonjs/swiper.min.js"></script>
    <script type="text/javascript" src="/js/coupons/coupons.js?v=${version!}"></script>
    <script src="/js/commonjs/idCard.js?v=${version!}"></script>
    <script src="/js/commonjs/commonShare.js?v=${version}"></script>  <!-- 分享 -->
    <script src="/js/shareConfig.js?v=${version}"></script>
    <script src="/js/commonjs/util.js?v=${version}"></script>
    <script src="/js/cityBus/new_payMent.js?v=${version!}"></script>
    <script src="/js/cityBus/passengerHandle.js?v=${version!}"></script>
</body>