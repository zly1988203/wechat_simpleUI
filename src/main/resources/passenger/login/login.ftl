<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/passenger/login.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>
	
	<div class="logo" style="background-image:none"></div>
	
	<div class="form">
	    <div class="mobile text sui-border-b">
	        <input type="tel" placeholder="请输入手机号码" id="mobile" maxlength="11" />
	    </div>
        <div class="verifycode text sui-border-b">
            <div class="text-box">
                <input type="tel" placeholder="请输入验证码" id="verifycode" maxlength="4"/>
            </div>
            <button type="button" id="sandBtn">获取验证码</button>
	    </div>
	    
	    <button id="submitButton" type="button" class="submit-btn">登录</button>

       <!--  <div class="disclaimer">
            <span class="open-popup" data-target="disclaimer">同意《法律声明及隐私条款》</span>
        </div> -->
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
    
	<script type="text/javascript" src="/js/commonJs.js?v=20170704"></script>
	<script>
	
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
	})
	
	var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

	function generateMixed(n) {
	     var res = "";
	     for(var i = 0; i < n ; i ++) {
	         var id = Math.ceil(Math.random()*35);
	         res += chars[id];
	     }
	     return res;
	}
    $(function() {
        //获取logo
        getLogo();
        // 发送验证码
		$('#sandBtn').on('click', function() {
				var _this = $(this);
				var mobile = $.trim($('#mobile').val());
				
				if(mobile.length<=0) {
	                 $.toast("请输入手机号");
	                 return;
	            }
				
				if(!(/^1[3456789]\d{9}$/.test(mobile))) {
	                 $.toast("请输入正确的手机号");
	                 return;
	            }
				
				//api url
	 			var urlStr = SERVER_URL_PREFIX+"/Account/getVerifyCode";
	 			//current page param
	 			var dataObj = {
	 				mobile: mobile,
	 			};
	 			//merge page param and common param,generate request param
	  			dataObj = genReqData(urlStr, dataObj);
				
				_this.prop('disabled', true);//禁用发送验证码按钮
				$.post(urlStr, dataObj, function(result){
			        if(result && result.code == 0){
						sandVerifycode(_this);  
			        }else{
			        	_this.prop('disabled', false);
						$.alert((result&&result.message) || '发送失败');
			        }
	    		}, 'json');
        });
        
         // 确定
         $('#submitButton').on('click', function() {
             var submitBtn = $(this);
             var mobile = $.trim($('#mobile').val());
             var verifycode = $.trim($('#verifycode').val());
             
            if(mobile.length<=0) {
                 $.toast("请输入手机号");
                 return;
            }
			
			if(!(/^1[3456789]\d{9}$/.test(mobile))) {
                 $.toast("请输入正确的手机号");
                 return;
            }
             
			if(verifycode.length<=0) {
                $.toast("验证码不能为空");
                return;
            }
			
            if(!(/^\d{4}$/.test(verifycode))) {
                $.toast("验证码错误或已失效");
                return;
            }
             
             submitBtn.prop('disabled', true);
             $.showLoading('正在登录中');
             
           	//api url
 			var urlStr = SERVER_URL_PREFIX + '/Account/regOrLogin';
 			//current page param
 			var dataObj = {
 					mobile: mobile,
 	                verifyCode: verifycode,
 			};
 			//merge page param and common param,generate request param
  			dataObj = genReqData(urlStr, dataObj);
             
             $.post(urlStr, dataObj, function(result){
            	 	$.hideLoading();
            	 	submitBtn.prop('disabled', false);
                    if(result && result.code == 0){
                    	if(result.data.token){
                    		$.cookie("token", result.data.token,{expires: 30, path: '/' });
                    		if(result.data.mode!="develop"){
                    			  var fromUrl = '';
                                  if(typeof($.cookie('fromUrl')) != 'undefined' && 'null' != $.cookie('fromUrl') && $.cookie('fromUrl') != 'undefined'){
                                      fromUrl = $.cookie('fromUrl');
                                  }
                                  $.cookie("fromUrl", null,{ path: '/' });
                    			//window.location='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+result.data.appID+'&redirect_uri=' + CURRENT_SERVER + '/index&connect_redirect=1&response_type=code&scope=snsapi_base&state='+(result.data.token+"_"+result.data.providerId+"_"+result.data.mobile + "_" + fromUrl)+'#wechat_redirect';
                                window.location = getWechatAuthUrl(result.data.appID, CURRENT_SERVER + '/index', (result.data.token+"_"+result.data.providerId+"_"+result.data.mobile + "_" + fromUrl));
                    		}else{
                    			window.location='/index?state='+result.data.token+'_'+result.data.providerId+'_'+result.data.mobile;
                    		}
                    		
                    	}
                    }else{
                    	$.alert((result&&result.message) || "未知错误");
                    }
                }, 'json');
             
         });
        
         // 勾选协议
        $('#agree').on('change', function() {
            $('#submitButton').prop('disabled', !$(this).is(':checked'));
        });
         
    });
    
    // 发送验证码 - 倒计时
    function sandVerifycode(element) {
        var btnText = element.text();
         element.prop('disabled', true);
         var duration = 60;
         element.text(duration + 's');
         var timer = setInterval(function() {
             duration--;
             if(duration <= 0) {
                 element.prop('disabled', false).text(btnText);
                 clearInterval(timer);
                 element.prop('disabled', false);
                 return;
             }
             element.text((duration < 10 ? '0' + duration : duration) + 's');
         }, 1000);
    }
    
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
    <div style="display:none;">
    	<script src="https://s4.cnzz.com/z_stat.php?id=1261515673&web_id=1261515673" language="JavaScript"></script>
    </div>
    </script>
</body>
</html>
