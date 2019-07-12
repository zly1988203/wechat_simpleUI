<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>等待接驾</title>
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

<body >
  <#include "../foot.ftl"/>
	<div  id="info">
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
	
	<div class="msg-tip sui-border-b" id="tips">
	    司机即将到达，请提前到路旁等候。你若迟到，司机可无责取消订单。
	</div>
	
	<div class="driver-detail sui-border">
	    <div class="attribute">
	        <div  class="distance sui-border-r">
	            距您<span id="carDistance"  style="color:red;">carDistance</span>公里
	        </div>
	        <div  class="antipate-time">
	            预计<span id="duration"  style="color:red;" >duration</span>分钟到达
	        </div>
	    </div>
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
	<div>
    <!--分享-->
    <div class="share" style="display:none">
        <div class="arrow"></div>
        <div class="tip">点击右上角“发送给好友”即可分享行程</div>
    </div>

	<div class="btn-bar">
        <ul>
            <li><button class="reset" id="cancelBtn">取消订单</button></li>
            <li><button class="reset" id="share">分享行程</button></li>
        </ul>
        <div class="link">
            <span id="contactCall" >联系客服</span>
            |
            <span id="suggestBtn">投诉建议</span>
            |
            <span class="contacts-help" id="contacts">紧急求助</span>
        </div>
    </div>
    
	<script>
	var tripInterval;
	var alertFlag = true;
	
    $(function() {
    	backtoUrl('/index');
		$("#suggestBtn").click(function(){
    		window.location='/passenger/suggest.html';
    	});		
    	
    	orderDetail();
    	//删除首页的回显数据，不再记录用户的起点和终点信息
    	window.sessionStorage.removeItem('_indexStatus')
    	
    	//分享行程 - 显示
        $('#share').on('click', function() {
            $('.share').show();
        });

        //分享行程 - 隐藏
        $('.share').on('click', function() {
            $(this).hide();
        });
		
		
        //紧急求助
        $('#contacts').on('click', function(e) {
        	contact('${orderNo}'); 			
        });
   		
   		 	var urlCancel = SERVER_URL_PREFIX + '/Order/cancelOrder';
			var dataCancel = {
				orderNo: '${orderNo}'
			};
 			dataCancel = genReqData(urlCancel, dataCancel);
 			
        // 取消提示
        $('#cancelBtn').on('click', function() {
        	$.confirm('确定取消订单', '无责取消',['暂不取消', '确定取消'], function() {
        		$.ajax({
                    type: 'POST',
                    url: urlCancel,
                    data: dataCancel,
                    dataType:  "json",
                    success: function(data){
                 	   if(data.code ==0){
                 		   window.clearInterval(tripInterval);
                 		   if(data.paySwitch==1){
                           	 $.toastSuccess("需要支付违约金："+amount);
                 	  	   }else{
                 		  	 $.toastSuccess("不需要支付违约金");
                 	   	   } 
                 		  window.location=CURRENT_SERVER+'/order/toOrderCancel?orderNo=${orderNo}'; 
                 	   }
                    },
                }); 
    		});
        });

        
/*  	 setInterval(function() {
		  var urlListen = SERVER_URL_PREFIX + '/Order/listenOrder';
		  var dataListen = {
		   orderNo: '${orderNo}'
		  };
		   dataListen = genReqData(urlListen, dataListen);
		   
		       $.ajax({
		             type: 'POST',
		             url: urlListen,
		             data: dataListen,
		             dataType:  "json",
		             success: function(data){
		              if(data.code ==0){   //司机到达
		            //   console.log(data.data);
		            	var toData = {
			   		          orderNo:'${orderNo}'
			   		    }	
		             	if(data.data.status == 7){
		              		toData = {
		              			orderStatus: 7
			   		        }
		              		$.toastSuccess("订单已被司机取消!");
		              		toHref(Number(data.data.tripStatus),toData);
		              	}
		              	if(data.data.tripStatus==5){
		              		toHref(Number(data.data.tripStatus),toData);	
		              	}
		              }
		             },
		       }); 
		   }, 1000);
    
    }); */
    
   function orderDetail(){
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
        	var tripNo = content.tripNo;
        	var j = 0;
        	for(var i=0;i<content.star;i++){
        		$(".starbar i").eq(i).attr("class","star");
        		j++;
        	}
        	
        	if (content.star%1 != 0) {
        		$(".starbar i").eq(j-1).attr("class","star-half");
        	}
        	
        	$("#img").attr("src", content.driverAvatar);
        	$('#driverName').text(content.driverName+"."+content.carNo);
			$('#providerName').text(content.carBelongsCompany);
			
			if(content.star.toFixed(1)== -1){
				$('#zeroCom').removeAttr("style")
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
			
			var min = (content.durationArrive).toFixed();
			$('#carDistance').text((content.carDistance/1000).toFixed(1));
			$('#duration').text(min);
			
			if(min>3){
				$("#tips").text("司机将准时来接你，请你耐心等待。");
			}
			if(min<=3){
				$("#tips").text("司机即将到达，请提前到路边等候。若你迟到，司机可无责取消订单。");
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
   				
   	    		tripInterval = setInterval("listenTrip('" + tripNo + "','toWaitDriver')", 1000);
        	}
  		}); 
    }
   
    
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
    }); 
    </script>
</body>
</html>
