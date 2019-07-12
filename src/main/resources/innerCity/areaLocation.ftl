<#include "/_framework.ftl">
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/innerCity/areaLocation.css" rel="stylesheet" type="text/css">
    <script>window.PointerEvent = undefined</script>
    <style>

    </style>
</head>
<body>

<input type="hidden" id="regionId" value="">
<input type="hidden" id="stationType" value="start">
<input type="hidden" id="href_url" value="">
<input type="hidden" id="cityCode" value="">

<div class="search-bar">
    <div class="search-bar-inner">
        <div class="tools-control">
            <div id="setCityButton" class="set-city"></div>
            <div id="setCityHtml" class="set-city-html"></div>
            <div class="serach-input">
                <input type="text" id="textSearchMap" placeholder="输入地点" />
            </div>
        </div>
        <button id="btnCancel"  type="button" class="cancel">取消</button>
        <button id="backBtn" type="button" class="cancel">返回</button>
    </div>
</div>
<div class="map-panel">
    <div id="mapContainer">
        <!--<div id="logInfo"></div>-->
        <div id="currLocation"></div>
    </div>
    <div id="mapWrapper" class="map-wrapper">
        <div class="content">
            <ul id="mapResult" class="sui-list">
            </ul>
        </div>
    </div>
</div>


<div id="searchWrapper" class="wrapper" style="display: none;">
    <div class="content">
        <ul class="sui-list">
        </ul>
    </div>
</div>

<!--温馨提示框-->
<div id="logInfoPopup"  class="sui-popup-container market-rule-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <div id="closePopup" class="back-box"><div class="back-btn close-btn"></div></div>
        <div class="market-content">

        </div>
    </div>
</div>

<script>
    /*---此句代码解决页面滑动的问题---*/
    window.PointerEvent = undefined;
    /*------------------------------*/
</script>
<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/common.js?v=${version!}"></script>
<script src="https://webapi.amap.com/maps?v=1.4.4&key=cc84bbc40681d10bdf6a924b2caf31d5"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/backtrack.min.js?v=${version!}"></script>
<script src="/js/shareConfig.js?v=${version!}"></script>
<script src="/js/innerCityJs/areaLocation.js?v=${version!}"></script>
</body>
</html>