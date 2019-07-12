<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>车票详情</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/common.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/my/e-ticket.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>
   <div class="ticket-detail">
        <div class="head">
            <div class="tips">还剩  <span>${result.data.remainingTime.day!}</span> 天 <span>${result.data.remainingTime.hour!}</span> 小时 <span>${result.data.remainingTime.minute!}</span> 分 上车</div>
            <div class="checkanimat"></div>
            <div class="code">
            	<#if (result.data.carNo!'') !='' >
                	<h4>${result.data.carNo!''}</h4>
                </#if>
                <div class="number"><span>验票码：</span>${result.data.verifyCode!}</div>
            </div>
        </div>
        <div class="bottom">
            <i></i>
            <h4>欢迎乘车</h4>
            <p>上车时请出示此页面给司机以供验票</p>
        </div>
    </div>

<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/flightchart.min.js?v=20181206?v=${version!}"></script>

<script>
	$(function() {
	    //动态电子票
	    $('.checkanimat').flightChart({
	    	text: "${result.data.code!''}",
	        flights: ['/res/images/bus/check-animat/01.png', '/res/images/bus/check-animat/02.png', '/res/images/bus/check-animat/03.png', '/res/images/bus/check-animat/04.png', '/res/images/bus/check-animat/05.png', '/res/images/bus/check-animat/06.png', '/res/images/bus/check-animat/07.png', '/res/images/bus/check-animat/08.png'],
	        flightSpeed: 3
	    });
	});
</script>
</body>
</html>