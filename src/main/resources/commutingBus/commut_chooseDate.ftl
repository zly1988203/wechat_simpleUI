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
    <link href="/res/style/commutingBus/fonts/iconfont.css?v=${version}" rel="stylesheet">
    <link href="/res/style/commutingBus/chooseDate.css?v=${version}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/zjcx-datePicker.css" rel="stylesheet" type="text/css">
</head>
<body>
<div id="chooseDate" class="content">
    <div class="order-head">
        <div class="head-panle">
            <div class="head">
                <div class="time"></div>
                <div class="line-name"></div>
                <div class="license-plate"></div>
            </div>
            <div class="station">
                <div class="icon-up-down"></div>
                <div class="station-list">
                    <div id="startName" class="station-title">
                        <div class="title"></div>
                        <div class="time"></div>
                    </div>
                    <div id="endName" class="station-title">
                        <div class="title"></div>
                        <div class="time"></div>
                    </div>
                </div>

            </div>
        </div>

    </div>

    <!--日历控件-->
    <div class="date-picker-container">
        <!--星期-->
        <div class="weeks-box"></div>
        <!--月份-->
        <div class="months-content">
            <div class="months-box">

            </div>
        </div>
    </div>


    <div class="btn-footer">
        <div class="back-btn">返回</div>
        <div class="confirm-btn">确定</div>
    </div>

</div>

<script src="/js/zepto.min.js"></script>
<script src="/js/simpleui.min.js"></script>
<script src="/js/zepto.cookie.js"></script>
<script src="/js/zepto.md5.js"></script>
<script src="/config.js?v=${version!}"></script>
<script src="/js/common.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version}"></script>
<script src="/js/commutingBus/serverApi.js?v=${version}"></script>
<script src="/js/commonjs/zjcx-datePicker.js" type="text/babel"></script>
<script src="/js/commutingBus/chooseDate.js?v=${version}" type="text/babel"></script>
</body>
</html>