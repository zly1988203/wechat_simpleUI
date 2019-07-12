<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/common.css" rel="stylesheet" type="text/css">
</head>

<body>
	<ul class="sui-list sui-list-link sui-border-tb">
	    <li data-href="/selectionLogin">注册登录</li>
	    <li data-href="/passenger/taxicab.html">出行主页</li>
	    <li data-href="/passenger/order/order-detail-1.html">订单详情（已支付，现金，未评价）</li>
	    <li data-href="/passenger/order/order-result-1.html">订单详情（已支付，线上，已评价）</li>
	    <li data-href="/passenger/order/order-detail-2.html">订单详情（已支付，线上，未评价）</li>
	    <li data-href="/passenger/order/order-result-2.html">订单详情（已支付，线上，已评价）</li>
	    <li data-href="/passenger/contacts.html">联系人</li>
	    <li data-href="/passenger/config.html?v=1.1">设置（已支付，线上，已评价）</li>
	    <li data-href="/passenger/invite-list.html">邀请人列表</li>
	    <li data-href="/passenger/invite.html">邀请好友</li>
	     <li data-href="/passenger/order/orderPay.html">支付测试</li>
	     <li data-href="/passenger/order/pay-taxicab.html">微信支付</li>
	     <li data-href="/passenger/driver-receive-a.html">等待接驾(司机未到)</li>
	     <li data-href="/passenger/driver-receive-b.html">等待接驾(司机已到)</li>
	     <li data-href="/passenger/driver-receive-c.htmll">等待接驾(预约出行)</li>
	    
	</ul>
	
	<script src="/js/zepto.min.js"></script>
	<script src="js/simpleui.min.js"></script>
	<script src="/js/common.js?v=2"></script>
	<script src="/js/config.js"></script>
	<script src="/js/zepto.cookie.js"></script>
</body>

<script>         
	$(function(){            
		console.log($.cookie("token"));
		
	})

</script>
</html>
