<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="viewport"
          content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/innerCity/index.css" rel="stylesheet" type="text/css">
    <link href="/res/style/innerCity/search-address.css" rel="stylesheet" type="text/css">
</head>

<body>

<input type="hidden" id="adDomain" value="${adDomain!}">
<input type="hidden" id="positionCode" value="${positionCode!}">
<input type="hidden" id="providerId" value="${providerId!}">
<input type="hidden" id="operatorId" value="${baseUser.id!''}">
<input type="hidden" id="pageUrl" value="/interCityIndex">

<!--顶部-->

<#include "/_header.ftl">

<div id="tabs" class="tabs-panel">
    <div class="tab-contents">
        <div id="present" class="content">
            <div class="search-station">
                <ul class="sui-list form">
                    <div class="v-line"></div>
                    <li>
                        <div class="control start">
                            <input type="text" id="startAddr" class="select-city-btn" placeholder="你从哪上车" readonly />
                        </div>
                    </li>
                    <div class="bottom-line"></div>
                    <li>
                        <div class="control end">
                            <input type="text" id="endAddr" class="select-city-btn" placeholder="你要去哪儿" readonly />
                        </div>
                    </li>
                </ul>
                <div class="switch-btn"></div>
                <input type="hidden" id="stationType" value="start">
            </div>

        </div>
    </div>
</div>
<input type="hidden" id="cityCode" value="">
<input type="hidden" id="cityName" value="">
<!--<div data-href="/order/waitGoTravel.html">-->
    <!--<p>待出行</p>-->
<!--</div>-->

<div class="his-order">

</div>

<div id="innerCity_foot" class="foot">


</div>

<!-- 广告位 -->
<div class="vrt">
    <!-- src：引入运营平台广告接口 -->
    <script src="/adConfig.js?providerId=${providerId!}&positionCode=index-top&operatorId=${baseUser.id!''}"></script>
</div>

<!--查询地址-->
<#include "searchAddressPopup.ftl">

<#include "/sideMenu.ftl">
<script src="/js/zepto.min.js"></script>
<script src="/js/simpleui.min.js"></script>
<script src="/js/zepto.cookie.js"></script>
<script src="/js/zepto.md5.js"></script>
<script src="/config.js?v=${version}"></script>
<script src="/js/commonjs/header.js?v=${version}"></script>
<script src="/js/vectors.min.js?v=${version}"></script>
<script src="/js/common.js?v=${version!}"></script>
<script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
<script src="/adConfig.js?providerId=${providerId}&positionCode=index-banner&operatorId=${baseUser.id!''}"></script>
<script src="https://webapi.amap.com/maps?v=1.4.4&key=cc84bbc40681d10bdf6a924b2caf31d5"></script>
<script src="/js/backtrack.min.js?v=${version!}"></script>
<script src="/js/shareConfig.js?v=${version}"></script>
<script src="/js/innerCityJs/common.js?v=${version}"></script>
<script src="/js/innerCityJs/index.js?v=${version}"></script>
</body>
</html>
