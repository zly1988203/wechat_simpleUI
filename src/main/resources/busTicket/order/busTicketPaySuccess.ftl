<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>支付成功</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/progressbar.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/payment-success.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>

    <div class="success">
        <div class="status">
            <div class="thumb" style="margin-top: 1.71rem;"></div>
            <p>支付成功</p>
        </div>

        <div class="link"  id="toDetail">查看订单详情</div>
        <div class="info">
            <div class="txt">在首页车票快捷入口查看车票，凭票上车</div>
            <div class="pic"><img src="/res/images/bus/payment-success-pic-2.png"></div>
        </div>

        <div class="foot-bar" style="margin-top: 0.95rem;">
            <div class="btn primary" id="toBus">去乘车</div>
        </div>
    </div>
    <script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
</body>
<script type="text/javascript">
	$(function(){
		var orderNo='${orderNo!""}'; 
    	backtoUrl('/busTicketOrder/toOrderDetail?orderNo='+orderNo);
		$('#toDetail').on('click',function(){
			window.location = '/busTicketOrder/toOrderDetail?orderNo='+orderNo;
		});
		$('#toBus').on('click',function(){
			//去乘车
			window.location.href = '/trip/toTripListPage';
		});
	});
</script>
</html>