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
    .bg{
        background: url("/res/images/conclusion-2018/step4.png") fixed bottom  center no-repeat;
        width:100%;
        height:100%;
        position:absolute;
        background-size: 100% 100%;
    }

    .content{
        margin-top: 2.5rem;
    }

    .header{
        display: flex;
        margin-left: 0.7rem;
        margin-right: 0.7rem;
    }
    .header img{
        width: 0.9rem;
        height: 0.9rem;
        border-radius: 0.9rem;
        margin-left: 0.1rem;
    }

    .header .user{
        margin: 0.15rem;
    }

    .header .user .name{
        font-size: 0.24rem;
        color: #333333;
    }

</style>
<body class="bg">
<section class="content">
    <div>过去一年里 <span id="providerName"></span> 共有 <span id="orderCount"></span> 班次</div>
    <div>载着 <span id="orderTotal"></span> 位乘客穿梭于这个城市</div>
    <div>茫茫人海中，Ta们曾与你擦肩而过？</div>
</section>
<div class="header">

</div>

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
    var userHeadArr = [
        '/res/images/conclusion-2018/user1.png',
        '/res/images/conclusion-2018/user2.png',
        '/res/images/conclusion-2018/user3.png',
        '/res/images/conclusion-2018/user4.png',
        '/res/images/conclusion-2018/user5.png'
    ]
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

    $('.next-step').on('click',function () {
        window.location.href='/conclusion2018/step5';
    })

    function initPage(){
        if(annualData== null || isEmpty(annualData)){
            //数据为空跳至首页
            window.location.href='/conclusion2018';
        }
        if(!isEmpty(annualData)){
            $('#orderCount').html(annualData.orderCount);
            $('#orderTotal').html(annualData.orderTotal);
            $('#providerName').html(annualData.providerName);
            $('#providerQRCode').attr('src', providerQRCode);
            $('title').html('2018，你的专属出行记忆-'+annualData.providerName);
            var together = JSON.parse(annualData.together);
            if(together.length > 0){
                var userHtml=''
                $.each(together,function (index,item) {
                    var userIcon = "" != item.icon?item.icon:userHeadArr[index];
                    userHtml += ' <div class="user">' +
                        '        <img src="'+userIcon+'">' +
                        '        <div class="name">同行'+item.count+'次</div>' +
                        '    </div>'
                })

                $('.header').append(userHtml)
            }
            $.post('/conclusion2018/annual/saveRecord',{token:$.cookie('token'),pageNum:4},function (res) {

            })
        }
    }

    function touchEnd(event) {
        //100是给定触上下方向摸起始的坐标差
        if (endY >100) {
            window.location.href = '/conclusion2018/step5';
        }
        if(endY<-100){
            if(annualData.couponCount != 0){
                window.location.href='/conclusion2018/step3';
            }else {
                window.location.href='/conclusion2018/step2';
            }
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