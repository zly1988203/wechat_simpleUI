<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title></title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/commutingBus/searchLineResult.css?v=${version}" rel="stylesheet" type="text/css">
</head>

<body>
    <div class="main-content">
        <div class="result-line-list">
            <ul id="resultList"></ul>
        </div>

        <div class="no-line-box">
            <div class="no-line"></div>
            <div class="no-line-tips">暂时没有找到合适的班次</div>
        </div>
    </div>

    <div class="handle-list">
        <div class="handle" id="goBack">返回</div>
    </div>

    <!--<script src="/js/commonjs/babel.min.js"></script>-->
    <!--<script src="/js/commonjs/polyfill.min.js"></script>-->
    <script src="/js/zepto.min.js"></script>
    <script src="/js/simpleui.min.js"></script>
    <script src="/js/zepto.cookie.js"></script>
    <script src="/js/zepto.md5.js"></script>
    <script src="/config.js?v=${version!}"></script>
    <script src="/js/common.js?v=${version!}"></script>
    <script src="/js/vectors.min.js?v=${version!}"></script>
    <script src="/js/commonjs/jweixin-1.4.0.js?v=${version!}"></script>
    <script src="/js/shareConfig.js?v=${version}"></script>
    <script src="/js/commonjs/commonShare.js?v=${version}" type="text/babel"></script>
    <script src="/js/commutingBus/serverApi.js?v=${version}"></script>
    <script src="/js/commutingBus/searchLineResult.js?v=${version}" type="text/babel"></script>
</body>
</html>