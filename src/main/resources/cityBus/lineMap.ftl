<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>中交出行</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css" rel="stylesheet" type="text/css">
    <link href="/res/style/cityBus/lineMap.css" rel="stylesheet" type="text/css">
</head>

<body>
<input type="hidden" id="orderNo" value="">
<input type="hidden" id="departDate" value="">

<div class="line-detail-container">
    <div class="line-detail">
        <div class="detail-head-content">
            <div class="detail-head">
                <div class="detail-date"><span class="depart-date"></span>
                    <div class="detail-busNo"></div>
                </div>
                <div class="detail-carNo"></div>
            </div>
        </div>
        <div class="detail-main-content" data-toggle="false">
            <div class="detail-main">
                <div class="content">
                    <div class="detail-station-list">
                        <i class="before"></i>
                        <ul class="detail-station-start">

                        </ul>
                        <ul class="detail-station-ending">

                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="detail-bottom">
            <div class="edit-station" style="display: none">修改上下车点</div>
            <div class="save-station" style="display:none;">确定上下车点</div>

        </div>
    </div>
    <div class="detail-toggle turn detail-toggle-o" data-toggle="true"></div>
</div>

<div class="map-panel">
    <div class="ola-maps" id="container"></div>
</div>

<div id="stationImage" style="display: none">
    <div class="img-content">
        <img src="">
    </div>
    <div class="close-img"></div>
</div>

<div class="foot-panel">
    <div id="back" class="back">返回</div>
</div>

<script src="/js/commonBus.js?v=${version!}"></script>
<script src="/js/commonjs/babel.min.js"></script>
<script src="/js/commonjs/polyfill.min.js"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
<script src="/js/shareConfig.js?v=${version!}"></script>
<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.13&key=cc84bbc40681d10bdf6a924b2caf31d5&plugin=AMap.Driving"></script>
<!--引入UI组件库（1.0版本） -->
<script src="https://webapi.amap.com/ui/1.0/main.js?v=1.0.11"></script>
<script src="/js/commonjs/util.js?v=${version}"></script>
<script src="/js/commonjs/commonShare.js?v=${version}"></script>  <!-- 分享 -->
<script src="/js/cityBus/lineMap.js?v=${version!}"></script>
</body>
</html>