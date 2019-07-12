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
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/my/e-ticket.css?v=${version!}" rel="stylesheet" type="text/css">
    <!-- start Dplus --><script src="/js/udplus.js"></script><!-- end Dplus -->
</head>

<body>

    <div class="ticket-detail">
        <div class="head">
            <div class="tips" id="timeCountDown"></div>
            <div class="checkanimat"></div>
            <div class='info'>
            	<div class="detail">
                    <div class="title">
                        <#if (result.carNo!'') !=''>
	                		<h4>${result.carNo!''}</h4>
	                	</#if>
                        <span>${result.departDate!''} ${result.departTime}</span>
                    </div>
                    <div class="address">${result.lineName!''}</div>
                </div>
                <div class="code">
                    <div class="station">
                        <div class="station-item start">
                            <h4>${result.departStation!''}</h4>
                        </div>
                        <div class="station-item end">
                            <h4>${result.arriveStation!''}</h4>
                        </div>
                    </div>
                    <div class="number"><span>验票码：</span>${result.verifyCode!}</div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <i></i>
            <h4>欢迎乘车</h4>
            <p>上车时请出示此页面给司机以供验票</p>
        </div>
         <div class="btn-group" id="commentFlag" >
            <div class="btn primary" id="comment">评价服务</div>
        </div>
    </div>

<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/flightchart.min.js?v=${version!}"></script>
<script>
    var providerDomin = document.domain.split('.')[0];
	//backtoUrl('/busTicket/toTicketListPage');
	backtoUrl('/trip/toTripListPage');
	function timer(){
		var intDiff = parseInt('${result.countDown!}');
		var t= window.setInterval(function(){
		var day=0,
		    hour=0,
		    minute=0,
		    second=0;//时间默认值        
		if(intDiff > 0){
		    day = Math.floor(intDiff / (60 * 60 * 24));
		    hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
		    minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
		    second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
		}else{
			clearInterval(t);
			$('#timeCountDown').hide();
		}
		if (minute <= 9) minute = '0' + minute;
		if (second <= 9) second = '0' + second;
		
		$('#timeCountDown').html('还剩  <span>'+hour+'</span> 小时 <span>'+minute+'</span> 分 上车');
		intDiff--;
		}, 1000);
	} 
	
    $(function() {
    	timer();
    	var code = '${result.code!''}';
    	var ticketId = '${result.id!''}'
    	var commentFlag = '${commentFlag!0}';
    	var isComment = '${isComment!0}';
    	
    	var url = '/comment/toComment?ticketId=' + ticketId;
    	if(isComment == 0){
    		$('#commentFlag').hide(); 
    	}else{
    		if(commentFlag == 1){
    			dplus.track("车票详情-评价",{
  	    			"车企":providerDomin,
  	    			"业务":"定制班线/通勤班线",
  	    			"页面名称":"车票详情页",
  	    		});
        		$('#commentFlag').show();
        		$('#comment').html('评价服务');
        		url = '/comment/toComment?ticketId=' + ticketId;
        	}else if(commentFlag == 2){
        		dplus.track("车票详情-查看评价",{
  	    			"车企":providerDomin,
  	    			"业务":"定制班线/通勤班线",
  	    			"页面名称":"车票详情页",
  	    		});
        		$('#commentFlag').show();
        		$('#comment').html('查看评价');
        		url = '/comment/toCommentDetail?ticketId=' + ticketId;
        	}
        	$('#comment').off('click').on('click',function(){
        		window.location = url;
        	});
    	}
    	
    	//动态电子票
        $('.checkanimat').flightChart({
        	text: "${result.code!''}",
            flights: ['/res/images/bus/check-animat/01.png', '/res/images/bus/check-animat/02.png', '/res/images/bus/check-animat/03.png', '/res/images/bus/check-animat/04.png', '/res/images/bus/check-animat/05.png', '/res/images/bus/check-animat/06.png', '/res/images/bus/check-animat/07.png', '/res/images/bus/check-animat/08.png'],
            flightSpeed: 3
        });
    });
</script>
</body>
</html>