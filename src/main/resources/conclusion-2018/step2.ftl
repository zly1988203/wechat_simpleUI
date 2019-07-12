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
        background: url("/res/images/conclusion-2018/step2.png") fixed  center bottom  no-repeat;
        width:100%;
        height:100%;
        position:absolute;
        background-size: 100% 100%;
    }

    .content{
        margin-top: 2rem;
    }
    .content p{
        color: #F34032;
    }

</style>
<body class="bg">
<section class="content">
    <div>2018年，最常乘坐的线路是</div>
    <p id="lineStart" style="display: none;"> </p>
    <p id="lineEnd" style="display: none;"> </p>
    <div id="str1" style="display: none;">共乘坐了 <span id="commonLineCount"></span> 次</div>
    <div id="str2" style="display: none;">在这条路上度过了 <span id="commonLineHour"></span> 个小时</div>
    <div id="earliest" style="display: none;">最早的一次， <span id="commonLineStart"></span> 就上车了</div>
    <div id="latest" style="display: none;">最晚的一次， <span id="commonLineEnd"></span> 才上车</div>
    <div id="str3" style="display: none;">奋斗的路从来不简单，有 <span id="providerName"></span> 陪你</div>
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

    $('.next-step').on('click',function () {
        if(!isEmpty(annualData) && annualData.couponCount != 0){
            window.location.href='/conclusion2018/step3';
        }else {
            window.location.href='/conclusion2018/step4';
        }
    })

    function initPage(){
        if(annualData== null || isEmpty(annualData)){
            //数据为空跳至首页
            window.location.href='/conclusion2018';
        }
        if(!isEmpty(annualData)){
            $('#commonLineCount').html(annualData.commonLineCount);
            $('#commonLineHour').html(annualData.commonLineHour);
            var commonLineArr = annualData.commonLine.split(' ');
            $('#lineStart').html(commonLineArr[0]+' '+commonLineArr[1]);
            $('#lineEnd').html(commonLineArr[2]+' '+commonLineArr[3]);
            var start =  formatTime(annualData.commonLineStart);
            var end = formatTime(annualData.commonLineEnd);
            $('#commonLineStart').html(start);
            $('#commonLineEnd').html(end);
            $('#providerName').html(annualData.providerName);
            $('#providerQRCode').attr('src', providerQRCode);
            $('title').html('2018，你的专属出行记忆-'+annualData.providerName);
            annualData.commonLineStart = start;
            annualData.commonLineEnd = end;
            annualData.lineStart = commonLineArr[0]+' '+commonLineArr[1];
            annualData.lineEnd = commonLineArr[2]+' '+commonLineArr[3];
            sessionStorage.setItem('annualData',JSON.stringify(annualData));
            initReveal();
            $.post('/conclusion2018/annual/saveRecord',{token:$.cookie('token'),pageNum:2},function (res) {

            })
        }
    }

    function initReveal() {
        $('#lineStart').fadeIn(2000,function () {
            $('#lineEnd').fadeIn(2000,function () {
                $('#str1').fadeIn(2000,function () {
                    $('#str2').fadeIn(2000,function () {
                        $('#earliest').fadeIn(2000,function () {
                            $('#latest').fadeIn(2000,function () {
                                $('#str3').fadeIn(2000,function () {

                                })
                            })
                        })
                    })
                });
            });
        })
    }

    //时间戳格式化 (yyyy-MM-dd hh:mm:ss)
    function formatTime(str){
        if(isNumber(str)){
            var time = new Date(parseInt(str));
            str = time.getFullYear() + '-' + formatNum(time.getMonth()+1) + '-' + formatNum(time.getDate())
                + ' ' + formatNum(time.getHours()) + ':' + formatNum(time.getMinutes()) + ':' + formatNum(time.getSeconds());
            var hours_min = formatNum(time.getHours()) + ':' + formatNum(time.getMinutes());
            return hours_min;
        }else{
            return '';
        }
    }

    //数字格式化：数字为个位数时，前面添加0
    function formatNum(str){
        if( (str + '').length == 1){
            if( str < 10 ){
                str = '0' + str;
            }
        }
        return str;
    }

    //判断是否是非负整数
    function isNumber(str){
        var r = /^[1-9]\d*|0$/;
        return r.test(str);
    }

    function touchEnd(event) {
        //100是给定触上下方向摸起始的坐标差
        if (endY >100) {
            if(annualData.couponCount != 0){
                window.location.href='/conclusion2018/step3';
            }else {
                window.location.href='/conclusion2018/step4';
            }
        }
        if(endY<-100){
            var token = $.cookie('token');
            var providerId = annualData.providerId;
            window.location = '/conclusion2018';
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