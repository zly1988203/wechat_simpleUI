<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>中交出行</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
     <link href="/res/style/simpleui.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/pay/success-2.css" rel="stylesheet" type="text/css">
</head>

<body>

    <div class="success-2">
        <div class="status">
            <div class="thumb"></div>
            <p>支付成功</p>
        </div>
        <div class="ewm">
            <div class="thumb"><img src="${wechatQrcodeUrl}"></div>
            <div class="info">长按扫码关注公众号 立即查看详情</div>
        </div>
    </div>      
      
     <script src="/js/commonJs.js?v=20170704"></script>
    <script>
        $(function() {
        	var orderNo='${orderNo}'; 
        	var payType = '${payType}';
        	var token = $.cookie('token');
        	if(payType == 'commuteToPay'){
	        	backtoUrl('/bus/toCommuteOrderDetail?orderNo=' + orderNo + '&token=' + token);
        	}else if(payType == 'busToPay'){
        		backtoUrl('/bus/toBusOrderDetail?orderNo=' + orderNo+ '&token=' + token);
        	}else if(payType == 'busTicketTopay'){
        		backtoUrl('/busTicketOrder/toOrderDetail?orderNo=' + orderNo + '&token=' + token);
        	}
        });
    </script>
</body>
</html>