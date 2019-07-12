<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>车次信息提示</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/payment-2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/passenger.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>

	    
    <script src="/js/commonBus.js"></script>
    <script>
	$(function() {
		$.alert("${message}", function() {
            window.location='/busIndex';
        });
	})
    
    </script>
</body>
