<#include "/_framework.ftl">
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>2018，你的专属出行记忆 - 乐乘巴士</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/conclusion-2018/reveal-it.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/conclusion-2018/conclusion-year.css?v=${version!''}" rel="stylesheet" type="text/css">
</head>
<style>
    .bg{
        background: url("/res/images/conclusion-2018/step3-1.png") fixed bottom  center no-repeat;
        width:100%;
        height:100%;
        position:absolute;
        background-size: 100% 100%;
    }

    .content{
        margin-top: 2.5rem;
    }

</style>
<body class="bg">
<section class="content">
    <div>2018年，</div>
    <div id="str1" style="display: none;">你一共使用了 <span id="couponCount"></span> 次优惠券</div>
    <div id="str2" style="display: none;">享受优惠 <span id="couponAmount"></span> 元</div>
    <div id="str3" style="display: none;">省下来的车费相当于， <span id="saveEqualStr">一顿法式大餐</span> </div>
    <div id="str4" style="display: none;">今天，不打算犒劳一下精打细算的自己吗？</div>
</section>

<div class="qrcode">
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
<script src="/js/conclusion-2018/conclusionCommon.js?v=${version!''}"></script>
<script>
    $('.next-step').on('click',function () {
        window.location.href='/conclusion2018/step4';
    })

    function initPage(){
        var annualData  = JSON.parse(sessionStorage.getItem('annualData'));
        var providerQRCode = sessionStorage.getItem('providerQRCode');
        if (annualData == null || isEmpty(annualData)) {
            annualData = ${annualData};
            sessionStorage.setItem('annualData', JSON.stringify(annualData));
            userData = ${userInfo};
            providerQRCode = $('#providerQRCodeUrl').val();
            sessionStorage.setItem('userData', JSON.stringify(userData));
            sessionStorage.setItem('providerQRCode', $('#providerQRCodeUrl').val());
            sessionStorage.setItem('avatar', $('#userAvatar').val());
        }
        if(annualData== null || isEmpty(annualData)){
            //数据为空跳至首页
            window.location.href='/conclusion2018';
        }
        if(!isEmpty(annualData)){
            $('#couponCount').html(annualData.couponCount);
            $('#couponAmount').html(annualData.couponAmount);
            $('#saveEqualStr').html(annualData.saveEqualStr);
            $('#providerName').html(annualData.providerName);
            $('#providerQRCode').attr('src', providerQRCode);
            $('title').html('2018，你的专属出行记忆-'+annualData.providerName);
            if(annualData.couponAmount <= 50 ){
                $('body.bg').css({'background':'url("/res/images/conclusion-2018/step3-1.png") fixed bottom  center no-repeat','background-size':'100% 100%'})
            }else if(annualData.couponAmount > 50 && annualData.couponAmount <=200){
                $('body.bg').css({'background':'url("/res/images/conclusion-2018/step3-2.png") fixed bottom  center no-repeat','background-size':'100% 100%'})
            }else if(annualData.couponAmount > 200 && annualData.couponAmount <=500){
                $('body.bg').css({'background':'url("/res/images/conclusion-2018/step3-3.png") fixed bottom  center no-repeat','background-size':'100% 100%'})
            }else  if(annualData.couponAmount > 500){
                $('body.bg').css({'background':'url("/res/images/conclusion-2018/step3-4.png") fixed bottom  center no-repeat','background-size':'100% 100%'})
            }
            initReveal();
            $.post('/conclusion2018/annual/saveRecord',{token:$.cookie('token'),pageNum:3},function (res) {

            })
        }
    }

    function initReveal() {
        $('#str1').fadeIn(2000,function () {
            $('#str2').fadeIn(2000,function () {
                $('#str3').fadeIn(2000,function () {
                    $('#str4').fadeIn(2000,function () {

                    })
                });
            });
        })

    }

    function touchEnd(event) {
        //100是给定触上下方向摸起始的坐标差
        if (endY >100) {
            window.location.href = '/conclusion2018/step4';
        }
        if(endY<-100){
            window.location.href = '/conclusion2018/step2';
        }
        //如果不重置，会出现问题
        endY = 0;

    }

    $(function () {
        initPage();
        document.body.addEventListener("touchend", touchEnd, false);
    })
</script>
</html>