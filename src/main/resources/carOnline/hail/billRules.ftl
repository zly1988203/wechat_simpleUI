<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>中交出行</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/onlineCar/time-picker.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/onlineCar/select-picker.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/fy-datepicker.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/onlineCar/bill-rules.css?v=${version!}" rel="stylesheet" type="text/css">
</head>
<body>

<div class="all-content">
    <!-- 计费规则 -->
    <div class="bill-rules-content">
        <div class="popup-header">
            <div class="content">
                <ul class="cities">
                </ul>
            </div>
        </div>
        <div class="sub-nav">
            <a class="nav-item">即时用车</a>
            <a class="nav-item">预约用车</a>
        </div>
        <div class="rules-table-container"></div>
    </div>
</div>

<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/zepto.min.js?v=${version!}"></script>
<script src="/js/simpleui.min.js?v=${version!}"></script>
<script src="/js/hail_carOnline/billRules.js?v=${version!}"></script>

</body>
</html>