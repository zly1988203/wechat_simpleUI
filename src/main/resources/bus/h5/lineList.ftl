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
    <link href="/res/style/base/fy-datepicker.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/line-list-3.css?v=${version!}" rel="stylesheet" type="text/css">
    <!-- start Dplus --><script src="/js/udplus.js"></script><!-- end Dplus -->
    
	<script>window.PointerEvent = undefined</script>
</head>

<body>
<header>
    <div id="wrapper">
        <div class="content">
            <!--data-size="11" 需要显示的日历天数-->
            <ul class="ola-date" data-size="11"></ul>
        </div>
    </div>

    <button class="all-date-btn">全部<br/>日期</button>
</header>

<!-- 选择日期 -->
<div id="select-date" class="sui-popup-container" data-trigger="">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <div class="date"></div>
        <div class="btn-group">
            <div class="btn primary cancel">返回</div>
        </div>
    </div>
</div>

<div class="main-container"></div>

<script src="/js/commonBus.js?v=${version!}"></script>
<script src="/js/zepto.min.js?v=${version!}"></script>
<script src="/js/simpleui.min.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/zepto.scrollTo.min.js?v=${version!}"></script>
<script src="/js/coach/fy-datePicker.min.js?v=${version!}"></script>
<script src="/js/bus/h5/line-list.js?v=${version!}"></script>
<script src="/js/date.js?v=${version!}"></script>
<!--<script src="/js/udplus.js?v=${version!}"></script>-->
</body>
</html>