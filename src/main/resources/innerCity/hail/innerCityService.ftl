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
    <link href="/res/style/innerCity/time-picker.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/innerCity/select-picker.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/innerCity/search-address.css" rel="stylesheet" type="text/css">
    <link href="/res/style/innerCity/innerCityService.css?v=${version!}" rel="stylesheet" type="text/css">
    <style>
        .amap-marker:first-child {
            top:210px !important;
        }
    </style>
</head>
<body>
<input type="hidden" id="pageUrl" value="/hail/innerCity/order/innerCityService">
<div class="information-container">
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
                    <input type="hidden" id="stationType" value="startAddr">
                </div>

            </div>
        </div>
    </div>
    <div class="info-box">
        <div class="info-item amount-box">
            <!-- data-type 1-实名制选人数 0-非实名制选人数 -->
            <input type="text" id="amount" class="amount" placeholder="人数" readonly value="">
            <!--选中的实名制乘客信息-->
            <div id="personList"></div>
        </div>
        <div class="info-item time-box">
            <input type="text" id="present_startTime" class="startTime" placeholder="出发时间" readonly value="" data-date="" data-time=""   data-interval="5" data-intervalminute="60"/>
        </div>
    </div>
    <div class="notes-box">
        <div class="icon"></div>
        <textarea class="notes" maxlength="40" placeholder="给司机留言"></textarea>
    </div>
</div>

<div class="ola-maps" id="allmap"></div>
<div id="currLocation"></div>

<!--选择车型和提交按钮-->
<div class="confirm-container">
    <div class="confirm-content">
        <div class="vehicle-switch-box" id="wrapper" style="display: none"></div>
        <div class="btn-bar">
            <button class="back">返回</button>
            <button class="confirm-btn" id="searchBtn">立即预约</button>
            <div class="action-box">
                <!--<div class="action-item instead"><i></i>代人叫车</div>-->
                <div class="action-item tips-btn"><i></i>温馨提示</div>
            </div>
        </div>
    </div>
</div>

<!--温馨提示框-->
<div class="popup-container tips-container-popup" style="display:none;">
    <div class="popup-main">
        <div class="tips-box">
            <div class="tips-title">温馨提示</div>
            <div class="tips"></div>
            <div class="service-rules-btn">约车规则</div>
        </div>
        <div class="close"></div>
    </div>
</div>

<!--&lt;!&ndash;计价规则&ndash;&gt;-->
<#include "priceDetailPopup.ftl">

<!--实名制选择人数-->
<div class="popup-container select-person-container" style="display: none">
    <div class="select-person-main">
        <div class="title-content">
            <div class="close">取消</div>
            <div class="title-box">
                <div class="title">选择乘车人(<span class="selected" data-value="0">0</span>/<span class="total" data-value="6">6</span>位)</div>
                <div class="title-tips">根据相关部门规定，需要乘车人实名制登记</div>
            </div>
            <div class="confirm-btn">确定</div>
        </div>
        <div class="person-content"></div>
        <div class="add-person"></div>
    </div>
</div>

<!--编辑/添加 实名制乘车人-->
<div class="popup-container edit-person-container" style="display: none">
</div>

<!--查询地址-->
<#include "searchAddressPopup.ftl">

<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/commonjs/time-picker.min.js?v=${version!}"></script>
<script src="/js/commonjs/select-picker.min.js?v=${version!}"></script>
<script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
<script src="/js/commonjs/idCard.js"></script>
<script src="/js/shareConfig.js?v=${version}"></script>
<script src="/js/commonjs/cityTimePicker.js?v=${version!}"></script>
<script src="https://webapi.amap.com/maps?v=1.4.4&key=cc84bbc40681d10bdf6a924b2caf31d5"></script>
<script type="text/javascript" src="/js/hail_innerCity/common.js?v=${version!}"></script>
<script type="text/javascript" src="/js/hail_innerCity/innerCityService.js?v=${version!}"></script>
</body>
</html>