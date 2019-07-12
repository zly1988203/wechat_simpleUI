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
    <link href="/res/style/conclusion-2018/conclusion-year.css?v=${version!''}" rel="stylesheet" type="text/css">
</head>
<style>

    .img-box{
        position:absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        width:100%;
        margin:auto;
        z-index: -1;
    }

    .bg{
        position:absolute;
        width: 7.5rem;
        height: 100%;
        background: url("/res/images/conclusion-2018/step5.png") no-repeat;
        background-size: 100% 100%;
    }

    header{
        position:relative;
        display: flex;
        padding: 0.5rem;
    }
    .user-header{
    }
    .user-header img{
        width: 1.2rem;
        height: 1.2rem;
        background-size: 100% 100%;
        border-radius: 1.2rem;
    }
    .user-name{
        font-size: 0.36rem;
        color: #333333;
        margin-left: 0.3rem;
    }
    .name-str{
        font-size: 0.24rem;
        color: #666666;
        margin-top: 0.3rem;
    }

    .save-pic{
        font-size: 0.28rem;
    }
    .content{
        position:absolute;
        margin-top: 0.1rem;
    }
    .content p{
        color: #F34032;
    }
</style>
<body>

<div id="poster"  class="bg">
    <header>
        <div class="user-header">
            <img id="avatar" src="">
        </div>
        <div class="user-name">
            <div id="nickName" class="name-str"></div>
            <div>2018，我的出行记忆</div>
        </div>
    </header>
    <section class="content">
        <div>2018年，</div>
        <div>我一共乘坐了 <span id="providerCount"></span> 次 <span id="providerName"></span></div>
        <div>我与<span id="pName"></span>  同行了 <span id="milage"></span> 公里 </div>
        <div>最常乘坐的线路是</div>
        <p id="lineStart"> </p>
        <p id="lineEnd">  </p>
        <div>共乘坐了 <span id="commonLineCount"></span> 次，在这条路上度过了<span id="commonLineHour"></span> 个小时</div>
        <div><span id="pName1"></span> ，让奋斗的路途少一点匆忙</div>
    </section>

    <div class="qrcode">
        <img id="providerQRCode">
    </div>
    <div class="tech-suport">
        <div class="save-pic">
            <!--长按保存图片-->
        </div>

        <div class="suport-str">
            中交出行提供技术支持
        </div>
    </div>
</div>

<div id="canvas-box" style="display: none"></div>
<!--<div class="img-box" id="img-box">-->
</div>
<input type="hidden" id="providerQRCodeUrl" value="${providerQRCode!''}"/>
<input type="hidden" id="userAvatar" value="${userAvatar!''}"/>
</body>
<script src="/js/commonjs/zepto.min.js?v=${version!''}"></script>
<script src="/js/zepto.cookie.js?v=${version!''}"></script>
<script src="/js/simpleui.min.js?v=${version!''}"></script>
<script src="/js/html2canvas.min.js?v=${version!''}"></script>
<script src="/js/clipboard.min.js?v=${version!''}"></script>
<script>
    function initPage(){
        var annualData  = JSON.parse(sessionStorage.getItem('annualData'));
        var providerQRCode = sessionStorage.getItem('providerQRCode');
        var avatar = sessionStorage.getItem('avatar');
        if (annualData == null || isEmpty(annualData)) {
            annualData = ${annualData};
            sessionStorage.setItem('annualData', JSON.stringify(annualData));
            userData = ${userInfo};
            avatar =  $('#userAvatar').val();
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
            $('#avatar').attr('src', avatar);
            $('#nickName').html(annualData.nickName);
            $('#providerCount').html(annualData.providerCount);
            $('#providerName').html(annualData.providerName);
            $('#pName').html(annualData.providerName);
            $('#pName1').html(annualData.providerName);
            $('#milage').html(annualData.milage);
            $('#lineStart').html(annualData.lineStart);
            $('#lineEnd').html(annualData.lineEnd);
            $('#commonLineCount').html(annualData.commonLineCount);
            $('#commonLineHour').html(annualData.commonLineHour);
            $('#commonLineEnd').html(annualData.commonLineEnd);
            $('#providerQRCode').attr('src', providerQRCode);
            $('title').html('2018，你的专属出行记忆-'+annualData.providerName);
            $.showLoading('图片生成中');
            setTimeout(function () {
                html2canvas(document.getElementById('poster')).then(function(canvas) {
                    $('#canvas-box').append(canvas);
                    createImage();
                });
            },5000);
            $.post('/conclusion2018/annual/saveRecord',{token:$.cookie('token'),pageNum:5},function (res) {

            })
        }
    }

    function createImage() {
        //获取网页中的canvas对象
        var mycanvas1 = $('#canvas-box canvas')[0];
        //将转换后的img标签插入到html中
        var img = convertCanvasToImage(mycanvas1);
        document.body.appendChild(img);
        $(img).addClass('img-box');
        $('#poster').css("display","none");
        $('#canvas-box').empty();
        $.hideLoading();
        $.toast('长按保存图片');
    }

    //从canvas中提取图片image
    function convertCanvasToImage(canvas) {
        //新Image对象，可以理解为DOM
        var image = new Image();
        // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
        // 指定格式PNG
        image.src = canvas.toDataURL("image/png");
        return image;
    }


    //判断空字符串
    function isEmpty(obj){
        if (obj === null || obj === undefined || obj === '') {
            return true;
        }
        return false;
    }

    $(function () {
        initPage();

    })
</script>
</html>