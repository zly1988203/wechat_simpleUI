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
    <link href="/res/style/bus/bus.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/time-picker.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/onlineCar/hailing.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/onlineCar/bill-rules.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/font-style.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/onlineCar/coupons.css?v=${version!}" rel="stylesheet" type="text/css">
    <script>window.PointerEvent = undefined</script>

</head>

<body>
<input id="providerId" type="hidden" value="${providerId!''}">
<input id="baseUserId" type="hidden" value="${baseUser.id!''}">
<input id="baseCarNumbers" type="hidden" value="${baseProviderConfig.carNumbers!'15'}">
<input type="hidden" id="adDomain" value="${adDomain!}">
<input type="hidden" id="positionCode" value="${positionCode!}">
<input type="hidden" id="operatorId" value="${baseUser.id!''}">
<!--信息提示： 订单进行中-->
<div class="ticket-tips" data-hreft="" style="display: none;">
    <div class="info">您的网约车出行订单正在进行中</div>
</div>

<!--顶部-->
<#include "/_header.ftl">

   <!-- 广告位 -->
    <div class="vrt">
        <!-- src：引入运营平台广告接口 -->
        <script src="/adConfig.js?positionCode=index-top&operatorId=${baseUser.id!''}&providerId=${providerId!''}"></script>
    </div>
    

<!--附近车辆数量-->
<div class="car-number-container">
    <div class="instruction sui-border-b">由中交出行&${providerName!''}联合推出合规网约车服务</div>
    <div class="car-number-content" data-carnumbers="${baseProviderConfig.carNumbers!18}"></div>
</div>

<!--搜索界面-->
<div class="search-form" id="tabs">
    <div class="tab-contents">
        <div id="present">
            <div class="present-time sui-border-b">
                <input type="text" id="present_startTime" class="startWeekTime" placeholder="现在出发" readonly value="现在出发" data-now="${currentTime!''}" data-date="" data-time="now"  data-intervalminute="${baseProviderConfig.intervalMinutes!30}"  data-interval="${baseProviderConfig.intervalDates!3}"/>
            </div>
            <div class="search-station">
                <ul class="sui-list">
                    <li>
                        <div class="control start">
                            <input id="startAddr" type="text" class="select-city-btn" placeholder="请您选择上车地点" readonly data-address=""/>
                        </div>
                    </li>
                    <li>
                        <div class="control end">
                            <input id="endAddr" type="text" class="select-city-btn" placeholder="您在哪下车" readonly data-address=""/>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="billing">
                <div class="billing-loading"  style="display: none">
                    <div class="loading">正在为您计算价格</div>
                </div>
                 <span class="billing-charge" style="display: none">
                    <div class="charge-info">
                        <span class="charge-type">一口价</span>
                       <div class="charge">
                           <div id="tripPrice" class="charge-price"></div>
                       </div>                   
                        <span class="unit">元</span>
                        <div id="coupons" class="charge-sale" >无优惠券</div>
                    </div>
                    <a class="bill-rules-btn"><i class="icon-cost-rules"></i>计费规则</a>
                    <div class="other-text" style="display: none">以实际行驶为准</div>
                 </span>
                </div>
            </div>
        </div>
    </div>
</div>

<!--计费规则弹框-->
<div id="bill-rules-container" class="sui-popup-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <div class="all-content">
            <div class="bill-rules-content">
            <div class="popup-header">
                <div class="content">
                    <ul class="cities">
                        <li class="active" id="priceCity"></li>
                    </ul>
                </div>
                <div class="bill-close-icon"></div>
            </div>
            <div class="rules-table-container"></div>
            <div class="bill-close-btn">返回</div>
        </div>
        </div>
    </div>
</div>

<button class="search-btn">叫车</button>
<!-- 灰色按钮：disabled -->
<!--<button class="search-btn disabled" disabled>叫车</button>-->

<div class="agreement-btn">
    <label class="switcher" id="agree_switcher_l"></label><input id="agree_switcher" type="checkbox" checked="checked"/>
    <a class="agreement" id="agreement_btn">我已同意${providerName!''}&中交出行网约车用户协议</a>
</div>

<!--叫车loading页面-->
<div class="search-loading-container" style="display: none">
    <div class="content">
        <div class="title">温馨提示</div>
        <div class="number" id="carNumbers"></div>
        <div class="loading-content">
            <div class="loading"><span class="loading-icon"></span></div>
            <div class="timer" id="timer"></div>
        </div>
        <div class="tips" id="timeCount">100秒后无应答将优先为您叫车</div>
        <div class="btn-group"><div class="btn cancel" id="cancel_order" data-tripNo="">取消订单</div></div>
    </div>
</div>

<!--用户协议-->
<div id="agreement_container" class="sui-popup-container popup-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <!--内容开始-->
        <div class="all">
            <div class="agreement-title">${providerName!''}&中交出行网约车用户协议</div>
            <div class="sub-nav">
                <a class="nav-item nav-active" data-providerid="0">中交出行<br/>网约车用户协议</a>
                <a class="nav-item" data-providerid="${providerId!''}">${providerName!''}<br/>网约车用户协议</a>
            </div>
            <div class="agreement-box"></div>
            <div id="closeButton" class="close-btn"></div>
            <div class="btn-group"><div class="btn primary cancel">返回</div></div>
        </div>
        <!--内容结束-->
    </div>
</div>

<!--查询地址-->
<div id="search-address" class="sui-popup-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <div class="search-bar sui-border-b">
            <div class="search-bar-inner">
                <div class="tools-control">
                    <div id="setCityButton" class="set-city">深圳</div>
                    <input type="hidden" id="areaCode" value="0755">
                    <input type="hidden" id="cityId" value="431000">
                    <div class="serach-input">
                        <input type="text" id="textSearchMap" placeholder="输入关键字" />
                    </div>
                </div>
                <button  type="button" class="cancel">取消</button>
            </div>
        </div>

        <div class="map-panel" style="display: none;">
            <div id="mapContainer"><div id="currLocation"></div></div>
            <div id="mapWrapper" class="map-wrapper sui-border-t">
                <div class="content">
                    <ul id="mapResult" class="sui-list sui-border-tb">
                    </ul>
                </div>
            </div>
        </div>

        <div id="searchWrapper" class="wrapper">
            <div class="content">
                <ul class="sui-list" id="searchResult">
                </ul>
                <div class="remove-history">清空历史记录</div>
            </div>
        </div>
    </div>
</div>

<!--选择城市-->
<div id="select-Citys" class="sui-popup-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <div class="search-bar sui-border-b">
            <div class="search-bar-inner">
                <div class="tools-control search-city">
                    <!--<div class="serach-input sui-border">
                        <input type="text" placeholder="城市中文名或拼音" />
                    </div>-->
                    请选择城市
                </div>
                <button  type="button" class="cancel">取消</button>
            </div>
        </div>

        <div id="cityWrapper" class="wrapper">
            <div class="content" id="cityList">
                <div class="current-city">当前定位城市：深圳市</div>
            </div>
        </div>
    </div>
</div>

<!--侧边栏菜单-->
 <#include "/sideMenu.ftl">
    <script src="/js/zepto.min.js"></script>
    <script src="/js/simpleui.min.js"></script>
    <script src="/js/zepto.cookie.js"></script>
    <script src="/js/zepto.md5.js"></script>
    <script src="/config.js?v=${version}"></script>
    <script src="/js/commonjs/header.js?v=${version}"></script>
    <script src="/js/vectors.min.js?v=${version}"></script>
    <script src="/js/common.js?v=${version!}"></script>
	<script src="/js/commonjs/time-picker.min.js?v=${version!}"></script>
	<script src="/js/commonjs/weekTime-picker.min.js?v=${version!}"></script>
    <!--<script src="/js/commonjs/weekTime-picker.js?v=${version!}"></script>-->
    <script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
	<script src="/adConfig.js?providerId=${providerId}&positionCode=index-banner&operatorId=${baseUser.id!''}"></script>
    <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.3&key=65b7cb5e8c694cb822cd32791319b348"></script>
    <script src="/js/shareConfig.js?v=${version}"></script>
    <script src="/js/communicate.min.js?v=${version}"></script>
    <script src="/js/coupons/coupons.js?v=${version}"></script>
    <script src="/js/carOnline/onlineCarHome.js?v=${version}"></script>
</body>
</html>
