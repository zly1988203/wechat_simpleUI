<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>确认订单</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/payment-2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/passenger.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/coach/confirm-order.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>
    
    
<script src="/js/zepto.min.js?v=${version!}"></script>
<script src="/js/simpleui.min.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/commonjs/idCard.js?v=${version!}"></script>
<script src="/js/zepto.cookie.js?v=${version!}"></script>
    <script>
    	$(function(){
    		$.alert('${result.message}',function(){
    			window.location='/busTicketIndex';
    		})
    	})
    </script>
</body>
</html>