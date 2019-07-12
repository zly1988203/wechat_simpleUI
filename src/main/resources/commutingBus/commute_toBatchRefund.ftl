<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/coach/fy-datepicker.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/batch/refund-ticket.css?v=${version!''}" rel="stylesheet" type="text/css">
</head>

<body>
    <div class="ticket-info">
        <div class="row">
            <div id="departTime" class="time"></div>
        </div>

        <div class="station">
            <div id="departTitle" class="station-item"><h4></h4></div>
            <div id="arriveTitle" class="station-item"><h4></h4></div>
        </div>
    </div>

    <div class="head-title">已选择<em>0</em>天车票</div>

    <div class="ticket-date"></div>
    
    <div class="btn-group">
        <div class="btn default" id="back">返回</div>
        <div class="btn readonly" id="submit">下一步</div>
    </div>

    <script src="/js/zepto.min.js"></script>
    <script src="/js/simpleui.min.js"></script>
    <script src="/js/zepto.cookie.js"></script>
    <script src="/js/zepto.md5.js"></script>
    <script src="/config.js"></script>
    <script src="/js/common.js?v=${version!}"></script>
    <script src="/js/vectors.min.js?v=${version}"></script>
    <script src="/js/coach/fy-datePicker.min.js"></script>
    <script src="/js/date.js"></script>
    <script src="/js/commutingBus/serverApi.js?v=${version}"></script>
    <script src="/js/commutingBus/toBatchRefund.js?v=${version}"></script>
</body>
</html>