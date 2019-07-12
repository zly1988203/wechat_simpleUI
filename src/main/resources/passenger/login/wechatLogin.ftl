<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>手机号绑定</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/sanqin/wechat-login.css?v=${version!}" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
	<script src="/js/common.min.js?v=${version!}"></script>
	<script>
		$(function(){
			if('${userExist!""}'=='true'){//用户已存在
				var fromUrl=$.cookie('fromUrl');
				$.cookie("fromUrl", null,{ path: '/' });
				if(fromUrl==undefined||fromUrl==null||fromUrl==''||fromUrl=='null'||fromUrl=='/error'){
					window.location='/index';
				}else{
					window.location=fromUrl;
				}
			}
		})
	</script>
</head>

<body>
<#if userExist?exists>  
<#else>  
    <div class="banner"></div>

	<div class="form">
	    <div class="mobile text sui-border-b">
	        <input type="tel" placeholder="请输入手机号码" id="mobile" />
	    </div>
	    <div class="verifycode text sui-border-b">
	        <div class="text-box">
	            <input type="tel" placeholder="请输入验证码" id="verifycode" />
	        </div>
	        <button type="button" id="sandBtn">获取验证码</button>
	    </div>
	
	    <button id="submitButton" type="button" class="submit-btn">立即绑定</button>
	</div>
	 
</#if>


<script>
    $(function() {
		$.cookie("token", '${token!""}',{expires: 30, path: '/' });
		$(".submit-btn").click(function(){
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
				var urlStr = SERVER_URL_PREFIX + '/Account/bindMobile';
				//current page param
				var dataObj = {
						mobile: mobile,
		                verifyCode: verifycode,
		                token:$.cookie('token')
				};
				//merge page param and common param,generate request param
	 			dataObj = genReqData(urlStr, dataObj);
	            
	            $.post(urlStr, dataObj, function(result){
	           	 	$.hideLoading();
	           	 	submitBtn.prop('disabled', false);
	                   if(result && result.code == 0){
	                	  window.location='/index';  	
	                   }else{
	                   	  $.alert((result&&result.message) || "未知错误");
	                   }
	               }, 'json');
			
		})	
			
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
		
        // 发送验证码
        $('#sandBtn').on('click', function() {
           
        });
	
	
		$("#skip-binding-btn").click(function(){
			var fromUrl=$.cookie('fromUrl');
			if(fromUrl==undefined||fromUrl==null||fromUrl==''||fromUrl=='null'){
				$.cookie('fromUrl','');
				window.location='/index';
			}else{
				window.location=fromUrl;
			}
		})
	
        // 确定
        $('#submitButton').on('click', function() {
            var submitBtn = $(this);
            var mobile = $.trim($('#mobile').val());
            var verifycode = $.trim($('#verifycode').val());

            if(mobile.length <= 0 || verifycode.length <= 0) {
                $.toast('请填写手机号码和验证码。');
                return;
            }

            submitBtn.prop('disabled', true);
            $.showLoading('正在绑定中');

            // 模拟异步请求
            setTimeout(function() {
                $.hideLoading();
                $.toastSuccess('绑定成功');
                submitBtn.prop('disabled', false);
            }, 3000);

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
                return;
            }
            element.text((duration < 10 ? '0' + duration : duration) + 's');
        }, 1000);
    }
    
</script>
</body>
</html>
