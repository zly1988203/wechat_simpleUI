<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>活动详情</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
	<link href="/res/style/simpleui.min.css?v=20170929" rel="stylesheet" type="text/css">
	<link href="/res/style/base/vectors.2.css?v=20170929" rel="stylesheet" type="text/css">
	<link href="/res/style/base/progressbar.css?v=20170929" rel="stylesheet" type="text/css">
	<link href="/res/style/activity/detail.css?v=20170929" rel="stylesheet" type="text/css">
</head>
<body>
    <div class="detail">
        <div class="header">
            <div class="banner">
            <#if activity.activity.adImg != ''>
          	  <img src="${activity.activity.adImg!}">
          	  <#else>
          	  <img src="/res/images/activity/default.jpg">
            </#if>
            </div>
            <div class="progress-box">
                <div class="title">${activity.activity.activityName!''}</div>
                <div class="content">
                    <!-- data-amount：总计，data-count：当前占数 -->
                    <!-- progress disabled：礼品已领完或者活动未开始 -->
                    <div class="progress" data-amount="${activity.activity.needAmount!0}" data-count="${(activity.totalBuyPrice!0)-(activity.userHasFetchedCount!0)*(activity.activity.needAmount!0)}">
                        <div class="progress-bar progress-bar-warning progress-bar-striped active" style="width: 90%;"></div>
                        <div class="progress-value"><span></span></div>
                    </div>
                    <div class="progress-info">
                    	<span id="span1">已领取：${activity.userHasFetchedCount!0}/<#if (activity.activity.everyNum!0) == 0>无限<#else>${activity.activity.everyNum!0}</#if></span>
                    	<span id="span2"></span>
                    </div>
                </div>
            </div>
            <input type="hidden" id="startDate" value="${activity.startDate!''}"/>
            <input type="hidden" id="endDate" value="${activity.endDate!''}"/>
            
            <input type="hidden" id="orderNo" value="${orderNo!''}"/>

            <input type="hidden" id="shareContent" value="${activity.activity.shareContent!''}"/>
            <input type="hidden" id="activityId" value="${activity.activity.id!''}"/>
            <input type="hidden" id="shareImg" value="${activity.activity.shareImg!}"/>
            <input type="hidden" id="shareTitle" value="${activity.activity.shareTitle}"/>
            <input type="hidden" id="remainCount" value="${activity.remainCount}" placeholder="活动剩余名额"/>
            <input type="hidden" id="activityStatus" value="${activity.activity.status}" placeholder="活动状态"/>
            <input type="hidden" id="userHasFetchedCount" value="${activity.userHasFetchedCount}" placeholder="已领取分数"/>
            <input type="hidden" id="activityEveryNum" value="${activity.activity.everyNum}" placeholder="总领取数"/>
            <input type="hidden" id="activityMaxNum" value="${activity.activity.maxNum}" placeholder="活动总名额"/>
            <input type="hidden" id="totalBuyPrice" value="${activity.totalBuyPrice}" placeholder="活动期间已消费的金额"/>
            <input type="hidden" id="hasLogin" value="${activity.hasLogin!0}" placeholder=""/>
            <input type="hidden" id="orderNoHasFetchedCount" value="${activity.orderNoHasFetchedCount!'0'}" />

            <div class="btn-group">
                <!-- default：默认（棕色）, primary：主要（橘色）, disabled：禁止（透明度降低） -->
                <!-- 最多放两个按钮，不然很丑 -->
                <#if (activity.hasLogin!0) ==0>
                <div class="btn default <#if (activity.activity.status!0) == 0>disabled</#if>" style="<#if (activity.activity.status!0) == 0> pointer-events: none</#if>"  id="login">登录参与</div>
                <#else>
                	<#if (activity.activity.status!0) == 1 && (activity.remainCount!0) gte 1>
                	<div class="btn default" trigger-target="#share">分享活动</div>
	                	<#if (activity.totalBuyPrice!0) gte ((activity.userHasFetchedCount!0)+1)*(activity.activity.needAmount!0)>
	                	<div class="btn primary" id="fetchCoupon">立即领取</div>
	                	</#if>
                	</#if>
                </#if>
            </div>

            <div class="ewmbar" id="qrcFocuson" style="display: none;">
                <div class="container">
                    <div class="ewm"><img src="" id="wechatQrc"></div>
                    <div class="content">
                        <p>长按二维码</p>
                        <p id="provider"></p>
                    </div>
                </div>
            </div>

            <div class="guide"></div>
        </div>

        <div class="line-list">
            <div class="title">活动线路</div>
            <ul class="tabs">
            	<#if activity.busLines?size gt 0> 
                <li class="active" data-target="#tab1"><a href="javascript:void(0);">定制班线</a></li>
                </#if>
				<#if activity.commuteLines?size gt 0>
                <li data-target="#tab2" <#if activity.busLines?size == 0> class="active" </#if>><a href="javascript:void(0);">上下班</a></li>
                </#if>
				<#if activity.cityLines?size gt 0>
                <li data-target="#tab3" <#if (activity.busLines?size == 0) && (activity.commuteLines?size == 0)> class="active"</#if>><a href="javascript:void(0);">城际约租车</a></li>
                </#if>
            </ul>
            <div class="line-list-swapper">
                <!-- 定制班线列表 -->
                <div id="tab1" class="line-list-box">
                    <div class="container">
                    	<#list activity.busLines as item>
                        <div class="item">
                            <div class="content" data-type="1" line-id='${item.id}'>
                                <p>${item.lineName}</p>
                            </div>
                            <div class="btn primary sellTicket" data-type="1" line-id='${item.id}' line-name='${item.lineName}'>立即购票</div>
                        </div>
                        </#list>
                    </div>
                    <#if activity.busLines?exists>
                    <#if (activity.busLines?size>5)>
                    	<div class="btn more">展开全部</div>
                    </#if>
                    </#if>
                </div>

                <!-- 上下班列表 -->
                <div id="tab2" class="line-list-box">
                    <div class="container">
                   	 	<#list activity.commuteLines as item>
                        <div class="item">
                            <div class="content" data-type="2" line-id='${item.id}'>
                                <p>${item.lineName}</p>
                            </div>
                            <div class="btn primary sellTicket" data-type="2" line-id='${item.id}' line-name='${item.lineName}>立即购票</div>
                        </div>
                        </#list>
                    </div>
                    <#if activity.commuteLines?exists>
                    <#if (activity.commuteLines?size>5)>
                    	<div class="btn more">展开全部</div>
                    </#if>
                    </#if>
                </div>

                <!-- 城际约租车列表 -->
                <div id="tab3" class="line-list-box">
                    <div class="container">
                        <#list activity.cityLines as item>
                        <div class="item">
                            <div class="content" data-type="3" line-id='${item.id}'>
                                <p>${item.name!''}</p>
                            </div>
                            <div class="btn primary sellTicket" data-type="3" line-id='${item.id}'>去约车</div>
                        </div>
                        </#list>
                    </div>
                    <#if activity.cityLines?exists>
                    <#if (activity.cityLines?size>5)>
                    	<div class="btn more">展开全部</div>
                    </#if>
                    </#if>
                </div>
            </div>
        </div>

        <!-- 优惠券 -->
        <div class="coupon" style="display: none">
            <div class="title">领取详情</div>
            <div class="container" id="fetchedDetail">
                <div class="item">
                    <div class="left">
                        <h2>城际班车劵</h2>
                        <h4>有效期至2017-12-31</h4>
                        <p>限线路 这是这是这是1号线，这是这是2号线，这是3号线，这是这是2号线，这是3号线</p>
                    </div>
                    <div class="right">
                        <h2><i>¥</i>100<i>.00</i></h2>
                        <h4>满100元可使用</h4>
                    </div>
                </div>
                <div class="item">
                    <div class="left">
                        <h2>城际班车劵</h2>
                        <h4>有效期至2017-12-31</h4>
                        <p>限线路 这是这是这是1号线，这是这是2号线，这是3号线，这是这是2号线，这是3号线</p>
                    </div>
                    <div class="right">
                        <h2><i>¥</i>100<i>.00</i></h2>
                        <h4>满100元可使用</h4>
                    </div>
                </div>
            </div>
        </div>

        <!-- 活动说明 -->
        <div class="explain">
            <h4>活动时间</h4>
            <p>${activity.activity.planStartDateStr!} ~ ${activity.activity.planEndDateStr!}</p>
            <h4>活动礼品</h4>
            <#list activity.activityCouponList as item>
                <p>${item_index+1}、${item.businessName}-${item.faceValue}元优惠券 x ${item.num}</p>
             </#list>
            <h4>活动规则</h4>
            <p>${activity.activity.activityRule!''}</p>
        </div>
    </div>

    <!-- 分享活动 -->
    <div id="share" trigger-hide="#share" style="display: none"></div>

    <!-- 领取奖品 -->
    <div id="receive" style="display: none">
        <div class="container">
            <div class="icon"></div>
            <div class="content">
                <#list activity.activityCouponList as item>
                <#if item.isDiscount == 0>
                <p>${item.businessName}-${item.faceValue}元优惠券 x ${item.num}</p>
                </#if>
                <#if item.isDiscount == 1>
                <p>${item.businessName}-${item.faceValue}折优惠券 x ${item.num}</p>
                </#if>
             </#list>
            </div>
            <div class="btn primary" id="iKonw">知道了</div>
        </div>
    </div>
<input type="hidden" name="orderNo" value="${orderNo}" id="orderNo">
	<script type="text/javascript" src="/js/commonJs.js?v=20170929"></script>
	<script src="/js/vectors.min.js?v=20170929"></script>
	<script type="text/javascript" src="/js/shareConfig.js?date=20170925"></script>
    <script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
    <script src="/js/personalCenter/activityDetail.js?v=${version!}"></script>
</body>
</html>
