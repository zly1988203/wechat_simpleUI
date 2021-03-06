<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/commutingBus/line.css" rel="stylesheet" type="text/css">
</head>

<body>
    <div class="line-detail-container">
        <div class="line-detail">
            <div class="detail-head-content">
                <div class="detail-head">
                    <div class="detail-date">
                        <span class="depart-date"></span>
                        <span class="lineName"></span>
                    </div>
                    <div class="detail-carNo"></div>
                    <!-- <div class="other">
                        <div class="detail-station-distance first"><div class="detail-price"><i class="sell-price">￥<i>0.02</i></i> </div></div>
                    </div> -->
                </div>
            </div>
            <div class="detail-main-content" data-height="130" data-line-height="32">
                <div class="detail-main">
                    <div class="content">
                        <div class="detail-station-list" data-real-height="130">
                            <i class="before"></i>
                            <ul class="detail-station-start"></ul>
                            <ul class="detail-station-ending"></ul>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="detail-bottom" style="transform-origin: 0px 0px 0px; opacity: 1; transform: scale(1, 1);">
                <div class="edit-station" style="display: none">修改上下车点</div>
                <div class="save-station">确定上下车点</div>
            </div> -->
        </div>
        <div class="detail-toggle turn" data-toggle="true" style="transform-origin: 0px 0px 0px; opacity: 1; transform: scale(1, 1);"></div>
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

    <script src="/js/zepto.min.js"></script>
    <script src="/js/simpleui.min.js"></script>
    <script src="/js/zepto.cookie.js"></script>
    <script src="/js/zepto.md5.js"></script>
    <script src="/config.js?v=${version!}"></script>
    <script src="/js/common.js?v=${version!}"></script>
    <script src="/js/vectors.min.js?v=${version}"></script>
    <script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
    <script src="/js/shareConfig.js?v=${version!}"></script>
    <script type="text/javascript"
        src="https://webapi.amap.com/maps?v=1.4.13&key=cc84bbc40681d10bdf6a924b2caf31d5&plugin=AMap.Driving"></script>
    <!--引入UI组件库（1.0版本） -->
    <script src="https://webapi.amap.com/ui/1.0/main.js?v=1.0.11"></script>
    <script src="/js/commutingBus/serverApi.js?v=${version}"></script>
    <script src="/js/commutingBus/lineMap.js?v=${version}"></script>

</body>

</html>