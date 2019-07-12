<#include "/_framework.ftl">
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1"/>
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
</head>
<style>

    @keyframes around {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .msgInfo {
        margin-top: 2rem;
        font-family: PingFangSC-Regular;
        font-size: 0.28rem;
        color: #6392FE;
        text-align: center;
    }

    .billing-loading {
        width: 100%;
        height: 1.59rem;
        font-size: .28rem;
        color: #6392FE
    }

    .icon-loading {
        margin: 2.6rem auto 0;
        width: .98rem;
        height: 1rem;
        background: url(/res/images/pay/icon-loading.png) no-repeat;
        background-size: 100% 100%;
        animation: around 3s linear infinite;
    }

    .icon-failure {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        background: url(/res/images/pay/icon-failure.png) 50% no-repeat;
        background-size: 100% 100%;
    }

    .icon-cancel {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        background: url(/res/images/pay/icon-payCancle.png) 50% no-repeat;
        background-size: 100% 100%;
    }

    .icon-success {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        background: url(/res/images/pay/icon-success.png) 50% no-repeat;
        background-size: 100% 100%;
    }

    .icon-error {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        background: url(/res/images/pay/icon-error.png) 50% no-repeat;
        background-size: 100% 100%;
    }

    .pay-success {
        font-family: PingFangSC-Regular;
        font-size: 0.28rem;
        color: #6392FE;
    }

    .pay-failure {
        font-family: PingFangSC-Regular;
        font-size: 0.28rem;
        color: #AAAAAA;
    }

    .pay-price {
        font-family: PingFangSC-Semibold;
        font-size: 0.48rem;
        color: #333333;
        text-align: center;
        margin-top: .5rem;
        display: none;
    }

    .foot {
        position: fixed;
        margin-left: 2.02rem;
        bottom: 1rem;
        font-family: PingFangSC-Regular;
        font-size: 0.28rem;
        color: #FFFFFF;
        letter-spacing: 0;
    }

    .btn {
        background: #6392fe;
        box-shadow: 0 0 0.2rem 0 rgba(61, 59, 238, .31);
        border-radius: .06rem;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        width: 3.45rem;
    }

    .time-label {
        font-family: PingFangSC-Regular;
        font-size: 0.28rem;
        color: #DDDDDD;
        text-align: center;
        margin-bottom: 2rem;
    }

</style>
<body>
<div>
    <div class="msgInfo">
        <div class="billing-loading">
            <div id="payStatue" class="icon-loading"></div>
        </div>
        <div id="content" class="pay-success">正在进行微信支付…</div>
        <div id="payPrice" class="pay-price"></div>
    </div>
</div>
<div class="foot">
    <div class="time-label"></div>
    <div id="btnBack" class="btn">返回</div>
</div>
<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/commonjs/jweixin-1.4.0.js?v=${version!}"></script>
<script src="/js/pay/payunit.js?v=${version!}"></script>
</body>
</html>