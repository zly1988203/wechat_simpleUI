<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${providerName!""}</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/pay/pay-order.css" rel="stylesheet" type="text/css">
</head>

<body>

    <div class="pay-order">
        <div class="title">${providerName!""}</div>
        <input id="orderNo" type="hidden" />
        <input type="hidden" id="hail" value="${hail!''}">

        <!-- 司机、车辆信息：如果不含车辆信息和司机信息，就去掉这个元素 -->
        <#if qrcodeInfo?exists>
	        <div class="vehicle-info">
	            <#if qrcodeInfo.type!=4>
	              	<p><#if driverInfo??>${driverInfo!''}</#if></p>
	            </#if>
	        </div>
        </#if>

        <!-- 输入消费金额 -->
        <div class="price">
            <input type="hidden" id="price">
            <div class="txt">¥</div>
        </div>

        <!--键盘-->
        <div class="keyboard-box">
            <div class="tip-title">中交出行 | 提供技术支持服务</div>

            <table class="keyboard">
                <tr>
                    <td class="number">1</td>
                    <td class="number">2</td>
                    <td class="number">3</td>
                    <td class="backspace"></td>
                </tr>
                <tr>
                    <td class="number">4</td>
                    <td class="number">5</td>
                    <td class="number">6</td>
                    <!-- 金额为空：empty -->
                    <td class="pay-btn lock" rowspan="3">确认<br>支付</td>
                </tr>
                <tr>
                    <td class="number">7</td>
                    <td class="number">8</td>
                    <td class="number">9</td>
                </tr>
                <tr>
                    <td class="clear">清空</td>
                    <td class="number">0</td>
                    <td class="number">.</td>
                </tr>
            </table>
        </div>
    </div>

    <script src="/js/common.min.js"></script>
    <script src="/js/commonBus.js?v=20170704"></script>
    <script>
    $(function() {
        var hail = $('#hail').val();
        backtoUrl(CURRENT_SERVER + hail + '/bus/toQrcodePay?qrcodeId='+'${qrcodeInfo.id!}');
    	
    	var isFlag='${isFlag!}';
    	if(isFlag==1){
    		window.location.href="/failure.html"
    	}
    	var settleType = '${settleType!'1'}';
 		if(settleType != 1){
 			window.location= PAY_SERVER +hail+'/order/toQrcodePay?qrcodeId='+'${qrcodeInfo.id!}';
 		}else{
 			if('${qrcodeOpenId!}'!=null && '${qrcodeOpenId!}'!=0){
 	 			document.cookie="qrcodeOpenId="+'${qrcodeOpenId!}';
 	 		}else{
 	 			//window.location='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+'${appId!}'+'&redirect_uri=' + CURRENT_SERVER + hail + '/bus/toQrcodePay&connect_redirect=1&response_type=code&scope=snsapi_base&state=${qrcodeInfo.id!}'+'#wechat_redirect';
                window.location = getWechatAuthUrl('${appId!}', CURRENT_SERVER + hail + '/bus/toQrcodePay', '${qrcodeInfo.id!}');

            }
 		}
 		
 		
 		init();

        //点击数字键
        $('.number').on('click', function() {
            var $price = $('#price');
            var num = $(this).text();

            var ponitIndex = $price.val().lastIndexOf(".");

            if($price.val().length>=5 && num!='.' && ponitIndex<0){
            	return;
            }
            
            if(ponitIndex > 0 && (num == '.' || $price.val().length - ponitIndex > 2)) {
                return;
            }

            $price
                .val($price.val() + '' + num)
                .next(".txt").text('¥' + $price.val());

            togglePay();
        });

        //点击退格
        $('.backspace').on('click', function() {
            var $price = $('#price');
            var text = '' + $price.val();
            if(text.length <= 0) return;

            var num = text.slice(0, text.length - 1);
            $price.val(num);

            $price.next(".txt").text('¥' + $price.val());

            togglePay();
        });

        //清空
        $('.clear').on('click', function() {
            var $price = $('#price');
            if(('' + $price.val()).length <= 0) return;

            $price.val('');
            $price.next(".txt").text('¥');

            togglePay();
        });

        //确认支付
        $('.pay-btn').on('click', function() {
            var $el = $(this);

            if($el.data('lock')) {
                var money = $('#price').val();
            }
            var money = $('#price').val();
         
            if(money<=0){
            	$.alert("请输入金额");
            }else {
                var dataParam = {'uuId': '${qrcodeOpenId!}', 'qrcodeId': '${qrcodeInfo.id!}', 'price': money};
                getPrepayInfo(dataParam, getPrepayInfoCallback);
            }
        });
        function getPrepayInfo(dataParam,callback){
    		$.ajax({
    	        type: "GET",
    	        url: hail+"/qrcode/getPrepayInfo",//添加订单
    	        data:dataParam,
    	        dataType: "json",
    	        success: function(result){
    	         if(parseInt(result.code)==20086){
    	        	 //TODO 跳转到支付成功界面
    	            var orderNo = $('#orderNo').val();
     				window.location=hail+'/qrcode/toPaySuccess?orderNo='+orderNo;
    	         }else if(result!=undefined&&result.code!=undefined&&parseInt(result.code)==0){
    	       		 callback(result.data.data);
    	       		 $("#orderNo").val(result.data.orderNo);
    	       	 }else if(parseInt(result.code)==20001){
    	       		window.location=hail+"/qrcode/failure?qrcodeId="+dataParam.qrcodeId;
    	       	 }else{
    	       	//	 $.alert(result.message);
    	       		orderDetial(currentOrderNo);
    	       	 }
    	        }
    	    });
    	}
        
        function onBridgeReady(data) {
    		lock = false;
    		WeixinJSBridge.invoke('getBrandWCPayRequest', {
    			"appId" : data.appId, //公众号名称，由商户传入
    			"timeStamp" : data.timeStamp, //时间戳，自1970年以来的秒数     
    			"nonceStr" : data.nonceStr, //随机串     
    			"package" : "prepay_id=" + data.prepayId,
    			"signType" : data.signType, //微信签名方式：     
    			"paySign" : data.paySign //微信签名 
    		}, function(res) {
	   			if (res.err_msg == "get_brand_wcpay_request:ok") {
    				var orderNo = $('#orderNo').val();
    				window.location=CURRENT_SERVER+hail+'/qrcode/toPaySuccess?orderNo='+orderNo;
	 			}
    		});
    	}
        
        var getPrepayInfoCallback=function(data){
    		onBridgeReady(data);
    	} 
        //是否锁定支付按钮
        function togglePay() {
            var $pay_btn = $('.pay-btn'),
                $price = $('#price');

            //为空，增加样式
            if($.trim($price.val()) == '') {
                $pay_btn.addClass('lock').data('lock', false);
            } else {
                $pay_btn.removeClass('lock').data('lock', true);
            }
        }
    });

    /*
    * 初始化
    * */
    function init() {
        var $pay_order = $('.pay-order'),
            $keyboard_box = $('.keyboard-box');
        var el_h = $pay_order.height() + $keyboard_box.height();
        var window_h = $(window).height();

        if(el_h >= window_h) {
            $keyboard_box.css({
                'position': 'relative',
                'margin-top': '50px'
            });
        }
    }
    </script>
</body>
</html>
