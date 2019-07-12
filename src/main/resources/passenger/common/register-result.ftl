<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>注册成功</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/commonStyle/simpleui.min.css" rel="stylesheet" type="text/css">
    <link href="/res/commonStyle/common.css" rel="stylesheet" type="text/css">
    <link href="/res/commonStyle/register-result.css" rel="stylesheet" type="text/css">
</head>

<body>
    <#include "../foot.ftl"/>
    <#setting number_format="#">
    <div class="register-head"></div>
    <div class="wrap">
        <div class="qrcode">
            <img id="newQrcodeUrl" name="newQrcodeUrl" src="" align="middle" />
        </div>
        <div class="qrcode-tip">
            长按识别 关注公众号
        </div>
        <#if registerAmount != "0">
	        <div class="coupon">
	            领取<span class="sui-red">${registerAmount}</span>元优惠券
	        </div>
        </#if>
        <div class="slogan">
            体验一站式出行服务
            	<input type="text" hidden id="inviterId" name="invterId" value="${inviterId!}"/>
        </div>
    </div>
	
	<script type="text/javascript" src="/js/commonJs.js"></script>
	
	<script>
	 $(function() {
  		 var inviterId = $('#inviterId').val();
  		 
        //api url
		var urlStr = SERVER_URL_PREFIX+"/v2/registerResult";
		//current page param
		var dataObj = {
			inviterId : inviterId,
		};
		
		//merge page param and common param,generate request param
		dataObj = genReqDataInviteRegister(urlStr, dataObj);
		
		 $.post(urlStr, dataObj, function(result){
             if (result && result.code == 0) {
                 var newQrcodeUrl = result.data.newQrcodeUrl;
                 if(!isEmpty(newQrcodeUrl)){
                 	$('#newQrcodeUrl').attr('src',newQrcodeUrl);
                 }
             }
         },'json');
       });
       
       function genReqDataInviteRegister(urlStr, data){
			var dataObj = {
					clientType : CLIENT_TYPE,
					appId : APP_ID,
					token : $.cookie('token'),
					appVersion: APP_VERSION,
					timestamp: new Date().getTime(),
					deviceId: DEVICE_ID,
					wechatLogin : WECHATLOGIN
				};
				
			dataObj = $.extend(dataObj, data);
			var signStr = getSignStr(urlStr, dataObj);
			dataObj.sign = signStr;
				
			return dataObj;
		}
	</script>
</body>
</html>
