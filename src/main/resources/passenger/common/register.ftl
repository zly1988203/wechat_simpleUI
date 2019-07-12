<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>体验领优惠</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/commonStyle/simpleui.min.css" rel="stylesheet" type="text/css">
    <link href="/res/commonStyle/common.css" rel="stylesheet" type="text/css">
    <link href="/res/commonStyle/register.css" rel="stylesheet" type="text/css">
</head>

<body>
	<#include "../foot.ftl"/>
<#setting number_format="#">
	<div class="header"></div>
	<div class="invite-tips">
	    <br/><br/>
	</div>
	
	<div class="form">
	    <div class="mobile text sui-border-b">
	        <input type="tel" placeholder="请输入手机号码" maxlength="11" id="mobile" />
	    </div>
        <div class="verifycode text sui-border-b">
            <div class="text-box">
                <input type="tel" placeholder="请输入验证码" maxlength="4" id="verifycode" />
            </div>
            <button type="button" id="sandBtn">获取验证码</button>
	    </div>
	    
	    <div class="disclaimer">
	        <label class="sui-checkbox" for="agree"><input type="checkbox" id="agree" checked /> 同意</label>
	        《<span class="open-popup" data-target="disclaimer">法律声明及隐私条款</span>》
	    </div>
	    
	    <button id="submitButton" type="button" class="submit-btn">立即体验</button>
	</div>
	
	
	<!--隐私声明-->
	<div id="disclaimer" class="sui-popup-container">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <article class="sui-article">
                <h1>用户服务协议</h1>
                <div class="sui-border-t content">
                    <p>中交出行科技有限公司（以下称“我司”）根据您的出行需求向您提供网约车服务，您访问和使用有关网站、服务、应用程序提供的网约车（城际约租车、网约车）预约服务适用本用户服务协议（以下简称“协议”）。
                    在您注册、使用有关网站、应用程序及接受我司提供的网约车服务之前，请您认真阅读本协议。您选择并使用服务即视为您已充分阅读并接受本协议的所有条款，您同意本协议对您和我司具有法律约束力。</p>
                    <p><strong>第一条 用户注册</strong><br/>
                    1.1为使用我司服务，您须在移动设备上下载“中交出行”应用程序（以下称“中交出行软件”）并进行注册，注册时您必须保证提供真实有效的信息、移动电话号码等，您知晓并同意，您一经成为中交出行软件注册用户，将会默认开通我司服务账户，账号及密码默认为中交出行软件账户的账号及密码。<br/>
                    1.2如果您是代表个人签订本协议，您应具有完全民事行为能力；如果您是代表法人实体签订本协议，您应获得授权并遵守本《用户服务协议》（并约束该法人实体）。</p>
                    <p><strong>第二条 服务内容</strong><br/>
                    您委托我司根据您的出行需求向您提供网约车服务。您可通过下载并安装到移动设备上的“中交出行”应用程序选择并使用上述服务。</p>
                    <p><strong>第三条 合同订立</strong><br/>
                    您理解并同意，您通过中交出行选择并使用我们的服务，即视为接受本《用户服务协议》并依据本协议与我司达成了合约（以下简称“合约”）。</p>
                    <p><strong>第四条 服务使用</strong><br/>
                    4.1您可以通过中交出行软件预约网约车/城际约租车服务。我司将按照您的预约信息提供网约车服务。<br/>
                    4.2我司将做出合理的努力，让您获得服务。但这受制于您请求服务之时所在位置周边是否有可提供服务的车辆。</p>
                    <p><strong>第五条 担保及承诺</strong><br/>
                    5.1您担保，您向我们提供的信息真实、准确、完整。我们在任何时候都有权验证您所提供的信息，并有权在不提供任何理由的情况下拒绝向您提供服务或拒绝您使用有关网站、服务、应用程序。<br/>
                    5.2您使用我司服务或中交出行软件，即表示您还同意以下事项：<br/>
                    a. 您出于您个人用途使用服务或下载应用程序，并且不会转售给第三方<br/>
                    b. 您不会将服务或应用程序用于非法目的，包括（但不限于）发送或存储任何非法资料或者用于欺诈目的；<br/>
                    c. 您不会利用服务或应用程序骚扰、妨碍他人或造成不便；<br/>
                    d. 您不会影响网络的正常运行；<br/>
                    e. 您不会尝试危害服务或应用程序；<br/>
                    f. 当我们提出合理请求时，您会提供身份证明；<br/>
                    g. 您将遵守国家/地区以及您在使用应用程序或服务时所处国家/地区、省和/或市的所有适用法律。<br/>
                    5.3如果您违反以上任一约定，我们保留立即终止向您提供服务和拒绝您使用有关网站、服务、应用程序的权利。</p>
                    <p><strong>第六条 付款及发票</strong><br/>
                    6.1您同意并认可中交出行软件现行公示或未来更新的有关服务价格标准，您可以在网站上或中交出行软件上查看有关服务的价格。这些价格可能会随时更新，您必须自行留意服务的价格。<br/>
                    6.2您在使用服务后应根据中交出行软件提示及时支付费用。逾期不支付费用且经催告后仍不履行支付义务的，我司有权拒绝您继续使用服务，同时您知悉并同意我司有权视情况将您的违约信息提交第三方征信机构。<br/>
                    6.3您在中交出行软件可以使用您的第三方电子支付账户（包括但不限于微信支付账户或支付宝支付账户）进行支付。处理您使用服务相关的付款时，除了受到本《用户服务协议》的约束之外，还要受电子支付服务商及信用卡/借记卡发卡行的条款和政策的约束。我们对于电子支付服务商或银行发生的错误不承担责任。我们将获取与您使用服务相关的特定交易明细。在使用这些信息时我们将严格遵守相关法律法规和公司的各项政策。<br/>
                    6.4在您提出开具发票的要求时，我们将为您开具发票，具体发票开具及申请规则，请参见应用程序上所列示的开票说明。（将根据各地细则调整）<br/>
                    6.5我们提供订单管理功能，您可以随时通过手机应用端查询订单情况。您应在每次服务完成后及时查询实际付款情况，如有异议应当在服务完成后48小时内联系我们，我们将对您提出的异议进行解释和处理。</p>
                    <p><strong>第七条 赔偿</strong><br/>
                    您使用中交出行软件的各应用程序及服务，即表示您接受本《用户服务协议》并同意：对于因以下事项产生的或与以下事项相关的任何及所有索赔、费用、赔偿、损失、债务和开销（包括但不限于律师费和诉讼费），您应该予以赔偿：<br/>
                    a. 您触犯或违反本《用户服务协议》中的任何条款或任何适用的法律法规（无论此处是否提及）；<br/>
                    b. 您触犯任何第三方的任何权利；<br/>
                    c. 您滥用应用程序或服务。</p>
                    <p><strong>第八条 责任</strong><br/>
                    8.1在网站或中交出行软件上向您提供的信息、推荐的服务仅供您参考。我们将在合理的范围内尽力保证该等信息准确，但无法保证其中没有任何错误、缺陷、恶意软件和病毒。对于因使用（或无法使用）网站或中交出行软件导致的任何损害（但排除死亡或人身伤害），我们不承担责任（除非此类损害是由我们的故意或重大过失造成的）。此外，对于因使用（或无法使用）与网站或中交出行软件的电子通信手段导致的任何损害，包括（但不限于）因电子通信传达失败或延时、第三方或用于电子通信的计算机程序对电子通信的拦截或操纵，以及病毒传输导致的损害，我们不承担责任。<br/>
                    8.2您知悉并确认，您通过中交出行软件预约的网约车服务由驾驶员以我司的名义向您提供并对服务质量予以保证。我司将在合理范围内承担相应的责任。同时，为提升服务品质，承担企业社会责任，我司将为您提供相应的服务保障（具体请参见《网络预约出租汽车经营服务管理暂行办法》），例如对于交通事故、治安事故或其他意外事故，我司将提供先行垫付、陪护及主动安全保障。对于超出法律规定应当赔偿的部分或存在侵权责任人、违约责任人的，我司有权向有关当事人追偿。</p>
                    <p><strong>第九条 授权及许可</strong><br/>
                    9.1在您遵守本《用户服务协议》的前提下，我们授予您有限的、非排他性的、不可转让的如下许可：<br/>
                    以将一份应用程序副本下载并安装到您拥有或控制的单台移动设备上，并仅出于您自己的个人用途运行此应用程序副本。您不得：（1）以任何方式许可、再许可、出售、转售、转让、分配、分发服务或应用程序，或以其他方式进行商业开发或提供给任何第三方；（2）修改服务或应用程序，或者据此创建衍生产品；（3）创建指向服务的互联网“链接”，或在任何其他服务器或基于无线或互联网的设备上“设计”或“镜像”任何应用程序；（4）反向工程或访问应用程序设计或构建竞争产品或服务、使用类似于服务或应用程序的设想或图形来设计或构建产品，或抄袭服务或应用程序的任何设想、特点、功能或图形，或（5）启动自动程序或脚本，每秒发送多个服务器请求或过度加重服务或应用程序负担或妨碍其工作和/或性能的程序。<br/>
                    9.2此外，您不得：（1）发送垃圾邮件或者以其他形式违反适用法律的重复或不受欢迎的邮件；（2）发送或存储侵权、淫秽、威胁、诽谤或者其他非法或侵权资料，包括危害儿童或触犯第三方隐私权的资料；（3）发送或存储包含软件病毒、蠕虫、木马或其他有害的计算机代码、文件、脚本、代理或程序的资料；（4）阻挠或扰乱网站、应用程序、服务或其所含数据的完整性或性能；（5）尝试未经授权地访问网站、应用程序、服务或其相关系统或网络。<br/>
                    9.3在法律允许的最大范围内，我们将有权调查并起诉任何上述违法违规行为。我们可参与并协助执法部门起诉违反本《用户服务协议》的用户。如果我们认为任何内容违反本《用户服务协议》或以其他方式危害网站、平台及/或其中的服务或应用程序，我们保留在不另行通知的情况下随时删除或禁用对这些内容的访问权限的权利。</p>
                    <p><strong>第十条 知识产权政策</strong><br/>
                    我们遵守各类适用的知识产权法律法规，并希望用户也遵守。</p>
                    <p><strong>第十一条 第三方链接</strong><br/>
                    在您使用网站、应用程序期间，我们可能会不时地提供由第三方拥有并控制的网站链接，以便您跟第三方沟通，向其购买产品或服务，参加其提供的促销活动。该等链接会带领您离开网站、中交出行软件，并且该等链接所指向的第三方网站内容不在我们的控制范围之内，这些第三方网站各自订立了条款、条件和隐私政策。因此，我们不会对这些网站的内容和活动负责，也不会承担任何义务，您应充分理解该等网站的内容及活动并自己全力承担浏览或访问这些网站的法律责任及风险。</p>
                    <p><strong>第十二条 合约期限</strong><br/>
                    12.1我们和您订立的这份合约是无固定期限合约。<br/>
                    12.2您有权随时通过永久性删除智能手机上安装的应用程序来终止合约，这样将禁止您使用中交出行软件及其中的应用程序和服务。<br/>
                    12.3如果您做出以下行为，我们有权随时终止合约并立即生效（即禁止您使用应用程序和服务）：<br/>
                    您触犯或违反本《用户服务协议》中的任何条款；<br/>
                    我们认为，您滥用应用程序或服务。我们没有义务提前通知合约终止。终止合约之后，我们将按照本《用户服务协议》给出相关通知。</p>
                    <p><strong>第十三条 不可抗力</strong><br/>
                    遭受不可抗力事件的一方可暂行中止履行本协议项下的义务直至不可抗力事件的影响消除为止，并且无需为此承担违约责任，但应尽最大努力克服该事件，减少损失的扩大。不可抗力指各方不能控制、不可预见或即使预见亦无法避免的事件，该事件足以妨碍、影响或延误任何一方根据本协议履行其全部或部分义务。该事件包括但不限于自然灾害、战争、政策变化、计算机病毒、黑客攻击或电信机构服务中断造成的事件。</p>
                    <p><strong>第十四条 其他</strong><br/>
                    14.1如果本《用户服务协议》的某一（些）条款被认定为无效而其他条款仍能保持有效且其执行不受影响，我们可决定是否继续履行该等其他条款。<br/>
                    14.2我们保留随时修改或替换本《用户服务协议》条款，或者更改、暂停或中断服务或应用程序（包括但不限于，任何功能、数据库或内容的可用性）的权利。届时，我们只需在网站及/或中交出行软件上发布通告或发送通知。您如果不同意我们对本《用户服务协议》所做的修改，您有权停止使用服务。如果您继续使用服务，则视为您接受我们对本《用户服务协议》所做的修改。<br/>
                    14.3我们可以通过以下途径发送通知：在网站及/或中交出行软件上张贴一般通知；按照您在账户信息中登记的电子邮件地址或电话发送电子邮件或短信。<br/>
                    14.4事先未经我们的书面同意，您不得转让本《用户服务协议》中的权利。</p>
                    <p><strong>第十五条 管辖约定</strong><br/>
                    15.1 本协议的订立、执行和解释及争议的解决均应适用中国法律并受中国法院管辖。  15.2 如双方就本协议内容或其执行发生任何争议，双方应尽量友好协商解决；协商不成时，任何一方均可向本公司所在地的人民法院提起诉讼</p>
                </div>
                <button class="close-popup" data-target="disclaimer">返回注册页</button>
            </article>
            <div class="close-popup close" data-target="disclaimer"></div>
        </div>
    </div>
    
	<input type="text" hidden id="inviterMobile" value="${inviterMobile!}" name="inviterMobile" />
	<input type="hidden" id="registerAmount" value="" name="registerAmount"/>
	<input type="text" hidden id="couponIdInvitee" value="${couponIdInvitee!}" name="couponIdInvitee" />
	<input type="text" hidden id="couponIdInviter" value="${couponIdInviter!}" name="couponIdInviter" />
	<input type="text" hidden id="inviterId" value="${inviterId!0}" name="inviterId" />
	
	<script type="text/javascript" src="/js/commonJs.js"></script>
	
	<script>
 
 	
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
       
       	showContent();
       
        // 发送验证码
		$('#sandBtn').on('click', function() {
				var _this = $(this);
				var mobile = $.trim($('#mobile').val());
				if(mobile.length <= 0) {
	                 $.toast('请填写手机号码');
	                 return;
	            }
				
				//api url
	 			var urlStr = SERVER_URL_PREFIX+"/Account/getVerifyCode";
	 			//current page param
	 			var dataObj = {
	 				mobile: mobile,
	 				onlyRegister: 1,
	 			};
	 			//merge page param and common param,generate request param
	  			dataObj = genReqData(urlStr, dataObj);
				
				_this.prop('disabled', true);//禁用发送验证码按钮
				/* $.post(urlStr, dataObj, function(result){
			        if(result && result.code == 0){
			        	if(result.data.hasRegister && result.data.hasRegister=="1"){
                    		$.alert("该手机号码已注册");
                    		$('#mobile').val("");
             				$('#sandBtn').prop('disabled', false);
             				$('#sandBtn').html("获取验证码")
                    		return;
                    	}
						sandVerifycode(_this);  
						$('#verifycode').val(result.data.verifyCode);
			        }else{
			        	_this.prop('disabled', false);
						$.alert( (result&&result.message) || '发送失败');
			        }
	    		}, 'json'); */
				
				$.ajax({
                     type: 'POST',
                     url:urlStr,
                     data:dataObj,
                     dataType:  "json",
                     success: function(result){
                    	 if(result && result.code == 0){
     			        	if(result.data.hasRegister && result.data.hasRegister=="1"){
                         		$.alert("该手机号码已注册");
                         		$('#mobile').val("");
                  				$('#sandBtn').prop('disabled', false);
                  				$('#sandBtn').html("获取验证码")
                         		return;
                         	}
     						sandVerifycode(_this);  
     						$('#verifycode').val(result.data.verifyCode);
     			        }else{
     			        	_this.prop('disabled', false);
     						$.alert( (result&&result.message) || '发送失败');
     			        }
                     },
                     error: function(jqXHR, textStatus, errorThrown){
                    	_this.prop('disabled', false);
     				}
               });
        });
        
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
             $.showLoading('正在登录中');
             
           	//api url
 			var urlStr = SERVER_URL_PREFIX + '/Account/regOrLogin';
 			//current page param
 			var dataObj = {
				mobile: mobile,
	            verifyCode: verifycode,
	            inviterId:$.trim($('#inviterId').val()),
	            onlyRegister:1,
 			};
 			//merge page param and common param,generate request param
  			dataObj = genReqData(urlStr, dataObj);
             
             $.post(urlStr, dataObj, function(result){
            	 	$.hideLoading();
            	 	submitBtn.prop('disabled', false);
                    if(result && result.code == 0){
                    	$.cookie("token", result.data.token,{expires: 30, path: '/' });
                    	var inviterId = $.trim($('#inviterId').val());
                    	var registerAmount = $.trim($('#registerAmount').val());
                    	//window.location='https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=' + CURRENT_SERVER + '/v2/registerResult&connect_redirect=1&response_type=code&scope=snsapi_base&state='+(result.data.token+'_${providerId}_'+mobile + '_' + registerAmount+'_'+inviterId)+'#wechat_redirect';
                    	//location.href ='/v2/registerResult?registerAmount='+registerAmount+'&inviterId='+inviterId;
                        window.location = getWechatAuthUrl(${appId}, CURRENT_SERVER + '/v2/registerResult', (result.data.token+'_${providerId}_'+mobile + '_' + registerAmount+'_'+inviterId));

                    }else{
                    	$.alert( (result&&result.message) || "未知错误");
                    	submitBtn.prop('disabled', false);
         				$('#sandBtn').prop('disabled', false);
         				$('#sandBtn').html("获取验证码")
                		clearInterval(timer);
                		
                    }
                }, 'json');
             
         });
        
         // 勾选协议
        $('#agree').on('change', function() {
            $('#submitButton').prop('disabled', !$(this).is(':checked'));
        });
    });
    
    var timer;
    // 发送验证码 - 倒计时
    function sandVerifycode(element) {
        var btnText = element.text();
        
        
        
         element.prop('disabled', true);
         var duration = 60;
         element.text(duration + 's');
         timer = setInterval(function() {
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
    
    function showContent(){
		//api url
		var urlStr = SERVER_URL_PREFIX + '/Account/getRegisterInfo';
		//current page param
		var dataObj = {
	        inviterId:$.trim($('#inviterId').val()),
		};
		dataObj = genReqData(urlStr, dataObj);
		
		$.post(urlStr, dataObj, function(result){
	        if(result && result.code == 0){
	        	var obj = result.data
	        	var mobile = obj.mobile;
	        	var providerName = obj.providerName;
	        	var registerAmount = obj.registerAmount;
	        	
	        	$('#registerAmount').val(registerAmount);
	        	
	        	var tips = '';
	        	tips += '用户<span id="showMobile">' + mobile + '</span>正在邀请您使用' + providerName + '<br/>';
	        	if(registerAmount>0){
	        		tips += '注册领取<span class="sui-red">' + registerAmount + '元</span>优惠券，';		
	        	}
	        	tips += '体验一站式出行服务';
	    		$('.invite-tips').html(tips);
	        }else{
	        	$.alert( (result&&result.message) || "未知错误");
	        }
        }, 'json');
    }
    </script>
</body>
</html>
