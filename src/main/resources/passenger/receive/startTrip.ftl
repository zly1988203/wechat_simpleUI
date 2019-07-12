<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>前往目的地</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/common.css" rel="stylesheet" type="text/css">
    <link href="/res/style/passenger/driver-receive.css" rel="stylesheet" type="text/css">
    
    <script type="text/javascript" src="/js/commonJs.js"></script>
    <script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
	<script type="text/javascript" src="/js/shareConfig.js"></script>
	
	<script>
		$(function(){
			$.initLoading();
		})
	</script>
</head>

<body>
<div id="info">
 	 <#include "../foot.ftl"/>
	<div class="order-info sui-border-b">
        <div class="driver-info">
            <dl>
                <dt><img src="/res/images/avatar.png" id="img"/></dt>
                <dd>
                    <div class="name" id="driverName">driverName</div>
                    <div class="attribute" id="providerName">providerName</div>
                    <div style="color:#ffa800" id="zeroCom" >暂无评分</div>
                    <div class="starbar" id="starbar" style="display: none" >
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <div class="grade"><span id="starNumber">starNumber</span></div>
                    </div>
                </dd>
            </dl>
        </div>
        <div class="call-tel" id="callTel"></div>
    </div>
	
	<div class="msg-tip sui-border-b">
	  行程开始，祝您一路好心情!
	</div>
	
	<div class="driver-detail sui-border">
	    <div class="order-address sui-border-b">
	        <ul>
	            <li class="start" id="departTitle">departTitle</li>
	            <li class="end" id="arriveTitle">arriveTitle</li>
	        </ul>
	    </div>
        <div class="leave-msg" id="remark">
           remark
        </div>
	</div>
	</div>
	 <div class="btn-bar">
        <ul>
            <li><button class="reset" id="shareButton" type="button">分享行程</button></li>
            <li><button class="finish" id="payBtn" type="button">支付车费</button></li>
        </ul>
        <div class="link">
            <span  id="contactCall">联系客服</span>
            |
            <span id="suggestBtn">投诉建议</span>
            |
            <span class="contacts-help" id="contacts">紧急求助</span>
        </div>
    </div>
    
    <!--分享-->
	<div class="share" style="display:none">
	    <div class="arrow"></div>
	    <div class="tip">点击右上角“发送给好友”即可分享行程</div>
	</div>
    
	<script>
    $(function() {
    		backtoUrl('/index');
    		$("#suggestBtn").click(function(){
        		window.location='/passenger/suggest.html';
        	});		
        	
	    	var urlDetail = SERVER_URL_PREFIX + '/Order/detail';
			var dataDetail = {
				orderNo: '${orderNo}'
			};
				dataDetail = genReqData(urlDetail, dataDetail);
				
		 $.ajax({
	        type: 'POST',
	        url: urlDetail,
	        data: dataDetail,
	        dataType:  'json',
	        success: function(data){
	        	var content = data.data;
	        	var j = 0;
	        	for(var i=0;i<content.star;i++){
	        		$(".starbar i").eq(i).attr("class","star");
	        		j++;
	        	}
	        	
	        	if(content.isOpenWechatPayFlag == 0){
	        		$('#payBtn').unbind("click"); 
                	$('#payBtn').attr('disabled','true'); 
                }
	        	
	        	if (content.star%1 != 0) {
	        		$(".starbar i").eq(j-1).attr("class","star-half");
	        	}
	        	
	        	$("#img").attr("src", content.driverAvatar);
	        	$('#driverName').text(content.driverName+"."+content.carNo);
				$('#providerName').text(content.carBelongsCompany);
				
				if(content.star.toFixed(1)== -1){
    				$('#zeroCom').removeAttr("style");
    				$('#starbar').css('display','none'); 
    				//$('#starNumber').text("暂无评价");
    			}else{
    				$('#starNumber').text(content.star.toFixed(1));
    				$('#zeroCom').css('display','none');
    				$('#starbar').removeAttr("style")
    			}
				
				$('#departTitle').text(content.departTitle);
				$('#arriveTitle').text(content.arriveTitle);
				if (content.tipsMessage) {
	            	$('#remark').text(content.tipsMessage);
	            }else{
	            	$('.leave-msg').css('display','none'); 
	            }
				
				
				var shareObj = {
   					url : window.location.href,
   					carNo : content.carNo,
   					driverName : content.driverName,
   					orderNo : '${orderNo}',
   					logo : content.logoURL,
   					nickName : content.nickName,
   					providerName:content.impProviderName
   				}
   				wxInitConfig(shareObj);
   				
   				$.hideLoading();
   				
   			 	var tripInterval = setInterval("listenOrder('${orderNo}','toStartTrip')", 1000);
	        }
      	}); 
        //分享行程 - 显示
        $('#shareButton').on('click', function() {
            $('.share').show();
        });

        //分享行程 - 隐藏
        $('.share').on('click', function() {
            $(this).hide();
        });
        
        //支付车费
        $('#payBtn').on('click', function() {
            location.href="/order/toPay/" + '${orderNo}';
        });

        //紧急求助
        $('#contacts').on('click', function(e) {
        	contact('${orderNo}');
        });
        
       
        
/*         setInterval(function() {
        	var urlDetail = SERVER_URL_PREFIX + '/Order/orderStatus';
			var dataDetail = {
				orderNo: '${orderNo}'
			};
 			dataDetail = genReqData(urlDetail, dataDetail);
 			
        	 $.ajax({
                 type: 'POST',
                 url: urlDetail,
                 data: dataDetail,
                 dataType:  "json",
                 success: function(data){
                	 if(data.code ==0){
                       //  console.log(data);
                		 if(data.data.orderStatus == 6){
                			 window.location.href="/order/" + data.data.orderType +"/" +'${orderNo}';
                		 }
                		 if(data.data.orderStatus == 3){
                			 window.location.href="/order/toPay/" + '${orderNo}';
                		 }
                     }
                 }
           });
        }, 1000);
        
    }); */
    
    
    $('#contactCall').on('click', function() {
    	$.confirm('确定拨打客服电话吗?。', '提示',['取消', '确定'], function() {
			var urlDetail = SERVER_URL_PREFIX + '/Config/commonConfig';
       		var dataDetail = {
       			orderNo: '${orderNo}'
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
    <script type="text/javascript">
    $('#callTel').on('click', function() {
    	$.confirm('确定拨打司机电话吗?。', '提示',['取消', '确定'], function() {
            var urlDetail = SERVER_URL_PREFIX + '/Call/callDriver';
           	var dataDetail = {
           		orderNo: '${orderNo}'
           	};
           	dataDetail = genReqData(urlDetail, dataDetail);
           	
           	 $.ajax({
           	 	type: 'POST',
           	    url: urlDetail,
           	    data: dataDetail,
           	    dataType:  'json',
           	    success: function(data){
           	    	if(data && data.code == 0){
           	        	window.location.href = 'tel:'+data.data.callee;                   	            		
           	            }
           	        }
           	    }); 
			});
    });
    </script>
</body>
</html>
