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
    <link href="/res/style/taxi/common.css" rel="stylesheet" type="text/css">
    <link href="/res/style/taxi/main.css" rel="stylesheet" type="text/css">
    <link href="/res/style/base/time-picker.css" rel="stylesheet" type="text/css">
</head>

<body style="background-image:url('')">
	
    <header class="call-car-panel no-line sui-border-b">
        <div class="avatar" data-href="/passenger/my/my.html"></div>
        <div class="server-list">
            <div class="bar">
                <div class="content">
                    <ul class="tab">
	                     <#if businessTypes.hasBus?exists>
	                    	<#if businessTypes.hasBus==1> 
	                        	<li data-href="/busIndex" <#if type == 'busLine'>class="active"</#if>><span>定制班线</span></li>
	                        </#if> 
	                     </#if> 
	                     <#if businessTypes.hasInterCity?exists>
	                    	<#if businessTypes.hasInterCity==1> 
	                        	<li data-href="/interCityIndex"<#if type == 'interCity'>class="active"</#if>><span>城际约租车</span></li>
	                        </#if> 
	                     </#if> 
	                     <#if businessTypes.hasTaxi?exists>
	                    	<#if businessTypes.hasTaxi==1> 
	                        	<li id="taxi" data-href="/index?type=1"<#if type == 'taxi'>class="active"</#if>><span>出租车</span></li>
	                        </#if> 
	                      </#if>
	                      <#if businessTypes.hasSameCity?exists>
	                    	<#if businessTypes.hasSameCity==1> 
	                       		<li <#if type == 'sameCity'>class="active"</#if>><span>同城出行</span></li>
	                       	 </#if> 
	                     </#if>
                    </ul>
                </div>
            </div>
        </div>
        <div class="more" style="display:none" id="openServer"></div>
    </header>
	<div class="empty-page">
	    <div class="taxicab-empty">
	        <div class="thumb"></div>
	        <p>暂未提供约车服务，如有问题请联系客服</p>
	        <div class="btn" id="contactCall">联系客服</div>
	    </div>
	</div>
    
	<script type="text/javascript" src="/js/commonJs.js"></script>
	<script type="text/javascript" src="/js/getProvider.js"></script>
	<script type="text/javascript" src="/js/commonFoot.js"></script>
	<script>
	$("[data-href]").on("tap",function(){location.href=$(this).data("href")});
	// 顶部
    var initServerListBar = function() {
        var width = ($(window).width() - 44) / 3;
        var ul = $('.server-list ul');
        var li = ul.children('li');
        var allWidth = 0;
        li.each(function(index, element) {
            var w = $(element).outerWidth(true);
            allWidth += w;
        });
        allWidth += 10;
        ul.css({
            'visibility': 'visible',
            'width': allWidth
        });
        
        if(allWidth < $(window).width() - 44) {
            ul.css('margin-left', ((($(window).width() - 44) - allWidth) / 2) + 'px');
        }
        
        //滚动插件
        var barScroll = new IScroll('.server-list .bar', {
            scrollX: true,
            scrollY: false,
            mouseWheel: true
        });

        $('.server-list ul li').on('tap', function() {
            ul.children('.active').removeClass('active');
            $(this).addClass('active');
            barScroll.scrollToElement(this, 600, true, true, IScroll.utils.ease.bounce);
        });
        
        $('#openServer').on('click', function() {
            $('#allServer').show();
            $('#serverMask').show();
        });
        $('#serverMask').on('click', function() {
            $('#allServer').hide();
            $('#serverMask').hide();
            
        });
    }
    $(function() {
    	initServerListBar();
    	//查看是否有未完成的订单 并提醒
//    	hasUnFinishOrderOrTrip(false);
    	
    	$('#contactCall').on('click', function() {
        	$.confirm('确定拨打客服电话吗?。', '提示',['取消', '确定'], function() {
    			var urlDetail = SERVER_URL_PREFIX + '/Config/commonConfig';
           		var dataDetail = {
           		};
           		dataDetail = genReqData(urlDetail, dataDetail);
           		
           		$.ajax({
           	            type: 'POST',
           	            url: urlDetail,
           	            data: dataDetail,
           	            dataType:  'json',
           	            success: function(data){
           	            	if(data && data.code == 0){
           	            		window.location.href = 'tel:'+data.data.customerTel;                   	            		
           	            }
           	      	}
           	    });
    		});
        });
    });
    </script>
</body>
</html>
