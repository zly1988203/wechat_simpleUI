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
    <link rel="stylesheet" href="/res/style/pay/failure.css?v=${version!}">
</head>

<body>

    <div class="failure">
        <div class="state">
            <div class="thumb"></div>
            <p>很抱歉，二维码已失效</p>
        </div>
        <div class="btn-group">
            <div class="btn primary">联系客服</div>
        </div>
    </div>
    
	<script src="/js/commonBus.js?v=${version!}"></script>
	<!--<script type="text/javascript" src="/js/getProvider.js?v=${version!}"></script>-->
    <script>
        $(function () {
        	$('.primary').on('click',function(){
               	window.location.href = 'tel:'+"${map.customerTel!}";                   	            		
        	});
        });
    </script>
</body>
</html>
