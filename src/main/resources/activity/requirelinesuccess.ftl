<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${providerName!'中交出行'}邀您定制路线</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/line/success.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>
<div class="all-content">
    <div class="main">
        <div class="header">
            <div class="success"></div>
            <div class="success-tips"></div>
        </div>
        <div class="tips"><a href="#">线路开通说明<i>&gt;</i></a></div>
        <!-- 线路开通说明 -->
        <div class="tips-info-content" style="display: none">
            <div class="tips-info">
                <a class="close"></a>
               ${rule!''}
            </div>
        </div>

        <div class="company-info">
            <div class="QR-code">
                <img src="${wechatQrcodeUrl!''}"/>
            </div>
            <p class="tips">
                长按关注${providerName!'中交出行'}<br/>
                及时获取线路开通动态<br/>
            </p>
        </div>
    </div>

    <!--分享按钮-->
    <div class="btn-group">
        <button id="share-btn"></button>
    </div>
    <!--分享提示-->
    <div class="sharing-tips" style="display: none">
        <div class="sharing-title"></div>
    </div>
</div>

<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script type="text/javascript" src="/js/shareConfig.js?v=${version!}"></script>
<script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
<script>
    $(function(){
    	shareWechat();
        //线路开通说明-----------------------
        $('.tips a').on('click',function(){
            $('.tips-info-content').css('display','block');
            //关闭按钮
            $('.close').on('click',function(){
                $('.tips-info-content').hide();
            });
        });
        //点击线路开通说明空白部分，线路开通说明消失
        $('.tips-info-content').on('click',function(){
            $(this).hide();
        });
        //阻止事件冒泡
        $('.tips-info').on('click',function (event) {
            event.stopPropagation();
        });

        //分享--------------------------------
       $('#share-btn').on('click',function(){
            $('.sharing-tips').css('display','block');
        });
        //点击分享提示空白部分，分享提示消失
        $('.sharing-tips').on('click',function(){
            $(this).hide();
        });
        //阻止事件冒泡
        $('.sharing-title').on('click',function (event) {
            event.stopPropagation();
        });

    })

    
    var shareWechat = function(){
    	var reqUrl = CURRENT_SERVER + '/activity/require/line'
		var shareObj = {
        		url : window.location.href,			
				logo : CURRENT_SERVER + '/res/images/line/line_require_share@2x.png',
    			desc : "点击申请线路，不转车直接到家",
    			title: "呼叫老乡！快来和我一起定制春节回家班车"
		}
		wxLineRequireShare(shareObj,reqUrl);
    }
</script>
</body>
</html>