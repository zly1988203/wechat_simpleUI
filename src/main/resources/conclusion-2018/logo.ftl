<#include "/_framework.ftl">
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>2018，你的专属出行记忆</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/conclusion-2018/logo.css?v=${version!''}" rel="stylesheet" type="text/css">
</head>

<body>
<div class="banner">
    <div class="title">
        <img src="/res/images/conclusion-2018/not-konw.png">
    </div>
    <div class="sorry">
        <img src="/res/images/conclusion-2018/sorry.png">
    </div>
</div>

<div class="qrcode">
    <img id="providerQRCode">
</div>

<div class="btgroup">
    <div id="oldUser" class="btn">不，我是老用户</div>

    <div id="providerbtn" class="btn active" style="display: none">了解  <span id="providerName"></span></div>
</div>


<div class="popup-container login-content-popup" hidden>
    <div class="popup-main">
        <button class="close"></button>
        <!--手机号验证码-->
        <div class="login-container">
            <div class="input-box phone-no">
                <label class="icon-phone"></label>
                <input type="tel" placeholder="请输入手机号" id="phoneNo" maxlength="11">
                <button id="getVerificationCode">获取验证码</button>
            </div>
            <div class="input-box verification-code"><label></label><input type="text" placeholder="请输入验证码" id="verificationCode"></div>
            <div class="btn-box"><button id="btnlogo" data-clickable="false">登录</button></div>
        </div>
    </div>
</div>

<input type="hidden" id="providerQRCodeUrl" value="${providerQRCode!''}"/>
<input type="hidden" id="userAvatar" value="${userAvatar!''}"/>

</body>
<script type="text/javascript" src="/js/commonJs.js?v=${version!''}"></script>
<script src="/js/vectors.min.js?v=${version!''}"></script>
<script>
    $(function () {
        var annualData = ${annualData!};
        sessionStorage.setItem('annualData',JSON.stringify(annualData));
        console.log('annualData----');
        console.log(annualData);
    });
</script>
<script src="/js/conclusion-2018/logo.js?v=${version!''}"></script>
</html>