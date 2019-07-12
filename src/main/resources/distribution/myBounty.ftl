<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>我的赏金</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/distribution/my-bounty.css?v=${version!}"  rel="stylesheet" type="text/css">
</head>
<body>
    <div class="bounty-container">
        <div class="bounty-content">
            <div class="bounty-box">
                <div id="recorded" class="bounty-item">
                    <p>待入账</p>
                    <span class="color-orange"></span>
                </div>
                <div id="failure" class="bounty-item">
                    <p>已失效</p>
                    <span class="color-default"></span>

                </div>
                <div id="withdraw" class="bounty-item">
                    <p>可提现</p>
                    <span class="color-blue"></span>
                </div>
            </div>
            <div class="phone">提现可联系客服电话：<a href="#" data-href="tel:0755-11112">0755-85269857</a></div>
            <ul class="sui-list sui-list-link sui-border-tb">
                <li data-href="#" class="withdraw-btn">提现记录</li>
            </ul>
        </div>
    </div>

    <div class="FAQ">
        <a href="questions.html">常见问题</a>
    </div>

    <div class="income-expense-list-container">
        <div class="title">收支明细</div>
        <div class="income-expense-list"></div>
    </div>

    <div class="btn-group" data-href="/distribution/bountyHunter?v=${version!}">
        <div class="btn">去赚赏金</div>
    </div>

    <script src="/js/zepto.min.js"></script>
    <script src="/js/simpleui.min.js"></script>
    <script src="/js/common.js"></script>
    <script src="/js/vectors.js?v=${version!}"></script>
    <script src="/js/backtrack.min.js?v=${version!}"></script>
    <script src="/config.js"></script>
    <script src="/js/zepto.cookie.js"></script>
	<script src="/js/zepto.md5.js"></script>
    <script src="/js/distributionPlatform/myBounty.js?v=${version!}"></script>

</body>
</html>