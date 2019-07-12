<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>去赚赏金</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <meta http-equiv="Expires" content="0">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Cache-Control" content="no-cache">
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/distribution/bounty-hunter.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>
<!--顶部-->
<header id="userhead" class="header">
    <div class="nav">
        <div class="thumb"></div>
    </div>
    <div class="hunter-info">
        <div id="avatar" class="hunter-avatar">
            <img src="/res/images/distribution/avatar_user.png"/></div>
        <div class="info">
            <div id="distribUserType" class="level"></div>
            <div id="providerName" class="current">当前车企：</div>
            <input id="providerId" type="hidden" value="">
        </div>
    </div>
</header>

<div class="hunter-container">
    <div class="hunter-box">
        <div class="accumulation-box">
            <div class="tips">累计获得赏金</div>
            <div class="amount-box sui-border-b">
                <div class="amount">¥<span></span><span class="withdraw-btn" data-href="/distribution/myBounty?v=${version!}">提现</span></div>
            </div>
            <div class="performance-box">
                <div id="dvcustomers" class="performance-name">当前客户<span></span></div>
                <div id="dvorders" class="performance-name">累计订单<span></span></div>
            </div>
        </div>

        <div class="generalize platform">
            <div class="head">
                <span class="name">推广平台</span>
                <a class="description" href="questions.html">说明</a>
            </div>
            <div class="introduction">
                <p>生成专属邀请链接或二维码邀请朋友使用平台服务，赚取赏金。</p>
                <button id="btnPlatform" class="share-btn" data-href="#">邀请</button>
            </div>
        </div>
        <div class="generalize hailing">
            <div class="head">
                <span class="name">推广网约车</span>
            </div>
            <div class="introduction">
                <p>生成专属邀请链接或二维码邀请朋友使用网约车服务，赚取赏金。
                </p>
                <button id="btnHailing" class="share-btn" data-href="#">邀请</button>
            </div>
        </div>
        <div class="generalize lines">
            <div class="head">
                <span class="name">推广线路</span>
                <span class="tips">(推广赏金比例可能会有调整，以实时比例为准)</span>
            </div>
            <div class="lines-box">
                <ul  id="line_box">
                </ul>
            </div>
        </div>
    </div>
</div>
<script src="/js/zepto.min.js"></script>
<script src="/js/simpleui.min.js"></script>
<script src="/js/zepto.cookie.js"></script>
<script src="/js/zepto.md5.js"></script>
<script src="/js/vectors.js"></script>
<script src="/config.js"></script>
<script src="/js/common.js"></script>
<script src="/js/distributionPlatform/bontyHunter.js?v=${version!}"></script>
<script>

</script>
</body>
</html>
