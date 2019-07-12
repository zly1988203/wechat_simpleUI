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
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/conclusion-2018/reveal-it.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/conclusion-2018/conclusion-year.css?v=${version!}" rel="stylesheet" type="text/css">
</head>
<style>
    .bg{
        background: url("/res/images/conclusion-2018/step1-1.png") fixed bottom  center no-repeat;
        width:100%;
        height:100%;
        position:absolute;
        background-size: 100% 100%;
    }
    header{
        display: flex;
        margin: 0.5rem 0 0.4rem 0.4rem;
    }
    .user-header{

    }

    .user-header img{
        width: 1.2rem;
        height: 1.2rem;
        -webkit-border-radius: 100%;
        -moz-border-radius: 100%;
        border-radius: 100%;
    }
    .user-name{
        font-size: 0.36rem;
        color: #333333;
        text-align: center;
        margin-left: 0.3rem;
    }
    .name-str{
        margin-top: 0.3rem;
    }

</style>
<body class="bg">
<header>
    <div class="user-header">
        <img id="avatar">
    </div>
    <div class="user-name">
        <div class="name-str" id="nickName"></div>
    </div>
</header>
<section class="content">
    <div>2018年,</div>
    <div id="str1" style="display: none;">你一共乘坐了 <span id="providerCount"></span> 次 <span id="providerName"></span></div>
    <div id="str2" style="display: none;"><span id="pName"></span>  与你同行了 <span id="milage"></span> 公里 </div>
    <div id="str3" style="display: none;">相当于<span id="str3Start">北京</span>到 <span id="milageStr"></span> 的距离</div>
    <div id="str4" style="display: none;">有没有某个Ta，</div>
    <div id="str5" style="display: none;">也和你走过这么长的路呢？</div>
</section>


    <div class="qrcode" >
        <img id="providerQRCode">
    </div>
    <div class="next-step animated">
    </div>
    <div class="tech-suport">
        中交出行提供技术支持
        <div class="suport-str">

        </div>
    </div>
<input type="hidden" id="providerQRCodeUrl" value="${providerQRCode!''}"/>
<input type="hidden" id="userAvatar" value="${userAvatar!''}"/>
</body>
<script src="/js/commonjs/zepto.min.js?v=${version!''}"></script>
<script src="/js/zepto.cookie.js?v=${version!''}"></script>
<script src="/js/simpleui.min.js?v=${version!''}"></script>
<script src="/js/conclusion-2018/conclusionCommon.js?v=${version!''}"></script>
<script>
    var annualData = ${annualData};
    sessionStorage.setItem('annualData',JSON.stringify(annualData));
    var userData = ${userInfo};
    sessionStorage.setItem('userData',JSON.stringify(userData));
    sessionStorage.setItem('providerQRCode', $('#providerQRCodeUrl').val());
    sessionStorage.setItem('avatar', $('#userAvatar').val());
    console.log('annualData-----');
    console.log(annualData);
    console.log('userData----');
    console.log(userData);
</script>
<script src="/js/conclusion-2018/step1.js?v=${version!''}"></script>
</html>