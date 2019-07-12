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

<body>
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
	
	<input type="hidden" id="arriveDepartTime" />
	<div class="msg-tip sui-border-b" id="tips1">
	    司机已到达，请尽快上车。若你未在 分钟内上车，司机可无责取消订单。
	</div>
	
	<div class="driver-detail sui-border">
	    <div class="attribute no-flex" >
	    	<span id="driverTip" style="color:black;">
	        司机已到达，请在<span id="timer" style="color:red;"></span>内上车
	        <span>
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
		</div>
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
            <span id="contactCall">联系客服</span>
            |
            <span id="suggestBtn">投诉建议</span>
            |
            <span class="contacts-help"  id="contacts">紧急求助</span>
        </div>
        <input type="hidden" id="orderNo" value="${orderNo}"/>
    </div>
    
    <script>
    var configTime=5;
    var remainTime=5;
    var tripNo = "";
    var urlDetail = SERVER_URL_PREFIX + '/Order/detail';
    var alertFlag = true;
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
        	var content = data.data;
        	var currentTime = data.timestamp;
        	tripNo = content.tripNo.toString();
        	var j = 0;
        	for(var i=0;i<content.star;i++){
        		$(".starbar i").eq(i).attr("class","star");
        		j++;
        	}
        	
        	if (content.star%1 != 0) {
        		$(".starbar i").eq(j-1).attr("class","star-half");
        	}
        	
        	$("#arriveDepartTime").val(content.arriveDepartTime);
        	
        	
        	$("#tips1").text("司机已到达，请尽快上车。若你未在"+content.configHasTime+"分钟内上车，司机可无责取消订单。");
        	
			//配置超时时间
			configTime=content.configHasTime;
        	//var reat = new Date(Date.parse(new Date().toString().replace(/-/g, "/"))).getTime();//当前时间
        	var reat = currentTime;//当前时间
        	var arriveTime =Number($("#arriveDepartTime").val());//预约时间
			var tempTime  = (reat - arriveTime) /1000;        //时间差 ，以秒为单位
			var tempTimeMin  = parseInt((reat - arriveTime) /(1000*60) );  // 时间差 ， 取分钟
			var configHasTime = content.configHasTime -1;  //59秒开始
         	var	timer = {
                    minute: configHasTime - tempTimeMin,  // 分钟
                    second: parseInt(59 - Math.abs(tempTime -tempTimeMin*60 ))  // 秒
            }
        	
                var timerval = setInterval(function() {
                	if(timer.minute < 0){
                		$('#timer').text('00:00');
                		timer.second = 0;
                		timer.minute = 0;
                		window.clearInterval(timerval);
                		
       				}
                	if(timer.minute>=0){
                		timer.second--;	
                	}
                    if(timer.second < 0) {
                        timer.second = 59;
                        timer.minute--;
                    }
                    remainTime = timer.minute;
                    var str = '';
                    if(timer.minute >= 0) {
                        timer.minute < 10 ? str += '0' + timer.minute : str += timer.minute;
                        str += ':';
                        timer.second < 10 ? str += '0' + timer.second : str += timer.second;
                    } else {
                        str += '00:00';
                    }
                    if(timer.minute < 0){
                    	$("#driverTip").attr("style","color:red;");
						$("#driverTip").text("司机已等待超过"+configTime+"分钟，请尽快上车");
					}
                    
                    $('#timer').text(str);
                }, 1000);
                
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
   			
   			tripInterval = setInterval("listenTrip('" + tripNo +"','toDriverArrived')", 1000);
        }
  	});
  	
    $(function() {
    	var tripInterval;
    	backtoUrl('/index');
    	//setInterval("myInterval()",1000);//1000为1秒钟
    	$("#suggestBtn").click(function(){
    		window.location='/passenger/suggest.html';
    	});		
    	
        // 取消提示
        $('#cancelBtn').on('click', function() {
        	var urlCancel = SERVER_URL_PREFIX + '/Order/cancelOrder';
			var dataCancel = {
				orderNo: '${orderNo}'
			};
 			dataCancel = genReqData(urlCancel, dataCancel);
 			var tipContent="确定取消订单？";
 			var cancelType="无责取消";
 			if(remainTime<0){
 			 	tipContent="司机已到达超过"+configTime+"分钟，取消将会影响您的信誉。为避免影响你的信誉，若为司机的责任，请让司机取消。";
 			 	cancelType="有责取消";
 			}
 			

 			$.confirm(tipContent, cancelType,['暂不取消', '确定取消'], function() {
 				$.ajax({
                    type: 'POST',
                    url: urlCancel,
                    data: dataCancel,
                    dataType:  "json",
                    success: function(data){
                       alertFlag = true;
                 	   if(data.paySwitch==1){
                 		   $.toastSuccess("需要支付违约金："+amount);
                 	   }else{
                 		   $.toastSuccess("不需要支付违约金");
                 	   } 
                 	   window.location=CURRENT_SERVER+'/order/toOrderCancel?orderNo=${orderNo}';  
                    },
              	}); 
 			});
        });
		
        //分享行程 - 显示
        $('#share').on('click', function() {
            $('.share').show();
        });
		
        $('#contacts').on('click', function(e) {
        	contact('${orderNo}');
        });
        
        //分享行程 - 隐藏
        $('.share').on('click', function() {
            $(this).hide();
        });
        
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
    
 			
/*     function myInterval()
    {
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
            	 if(data.data.tripStatus==6){   //接到乘客 去往目的地
            		 //location.href = "/order/toStartTrip?orderNo=" + '${orderNo}';
            	 	toHref(Number(data.data.tripStatus),toData);
            	 }
             },
       });
    } */
   
   
    
	
    </script>
</body>
</html>
