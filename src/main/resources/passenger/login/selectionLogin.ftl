<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>登录</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/sanqin/login-selection.css?v=${version!}" rel="stylesheet" type="text/css">
    
</head>

<body>

<div class="logo"></div>

<div class="form">

    <div class="wechat-select">
        <button id="wechatButton" type="button" class="submit-btn">微信登录</button>
    </div>

    <p class="or">或者</p>

    <div class="phone-select" >
        <p>使用手机号登录</p>
    </div>

    <div class="disclaimer">
        <p class="open-popup" data-target="disclaimer">同意《法律声明及隐私条款》</p>
        <P class="copyright">由中交出行科技提供技术支持</P>
    </div>
</div>


<!--隐私声明-->
<div id="disclaimer" class="sui-popup-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <article class="sui-article">
            <h1>用户服务协议</h1>
            <div class="sui-border-t content">
            </div>
            <button class="close-popup" data-target="disclaimer">返回注册页</button>
        </article>
        <div class="close-popup close" data-target="disclaimer"></div>
    </div>
</div>

<script type="text/javascript" src="/js/commonJs.js?v=20170912"></script>
<script src="/js/common.min.js?v=20170912"></script>

<script>
    $(function() {
        
        // 勾选协议
        $('#agree').on('change', function() {
            $('#submitButton').prop('disabled', !$(this).is(':checked'));
        });
        
    	//api url
    	var urlStr = SERVER_URL_PREFIX + '/userServiceProtocol';
    	//current page param
    	var dataObj = {
    			type:1,
    		};
    	//merge page param and common param,generate request param
    	dataObj = genReqData(urlStr, dataObj);

    	$(function() {
    		$.ajax({
    			type : 'POST',
    			url : urlStr,
    			data : dataObj,
    			dataType : "json",
    			success : function(result) {
    				if(result && result.data){
    					$(".sui-border-t").html(result.data);
    				}else{
    					$.alert((result&&result.message) || "未知错误");
    				}
    			},
    		});
    	});
    	
    	 //获取logo
        getLogo();

        //手机号登录
        $(".phone-select").on('click',function(){
        	location.href="/regOrLogin"
        });
        var fromUrl=$.cookie('fromUrl');
        if(fromUrl==undefined){
        	fromUrl=='';
        }
        //微信登录
        $("#wechatButton").on('click',function(){
        	var urlStr = SERVER_URL_PREFIX+"/Account/getProviderInfo";
			//current page param
			var dataObj = {
			};
			//merge page param and common param,generate request param
			dataObj = genReqData(urlStr, dataObj);
			$.post(urlStr, dataObj, function(result){
		        if(result && result.code == 0){
		        	//window.location='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+result.data.appId+'&redirect_uri=' + CURRENT_SERVER + '/wechatLoginIndex&connect_redirect=1&response_type=code&scope=snsapi_base&state='+(result.data.proId+"_" + fromUrl)+'#wechat_redirect';
                    window.location = getWechatAuthUrl(result.data.appId, CURRENT_SERVER + '/wechatLoginIndex', (result.data.proId+"_" + fromUrl));
		        }
			}, 'json');
        	
        });
    	
    });
    
    function getLogo(){
    	var urlStr = SERVER_URL_PREFIX+"/Account/getLogo";
			//current page param
		var dataObj = {
		};
		//merge page param and common param,generate request param
		dataObj = genReqData(urlStr, dataObj);
		
		$.post(urlStr, dataObj, function(result){
	        if(result && result.code == 0){
				$('.logo').attr('style','background-image: url('+result.data+')')
	        }
		}, 'json');
    }
</script>
</body>
</html>

