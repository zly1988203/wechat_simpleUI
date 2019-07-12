<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>等待接单</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/common.css" rel="stylesheet" type="text/css">
    <link href="/res/style/order-wait.css" rel="stylesheet" type="text/css">
</head>

<body>
  <#include "../foot.ftl"/>
    <div class="wait-box sui-border">
    	<input type="hidden" id="tripNo" name="tripNo" value="${tripNo!}">
    	<input type="hidden" id="callOutTime">
    	<input type="hidden" id="orderFlag">
    	<input type="hidden" id="min">
    	<input type="hidden" id="secs">
    	
    	<div class="call-car-tip">
            <h1>收到，正在为您叫车</h1>
            <p>附近的车辆会优先通知</p>
        </div>

        <div class="leave-msg">
            	${tipsMessage!}
            <i></i>
        </div>
		
         <div class="talk-animate"><i></i></div>
        
        <div class="talk-conatiner">
            <p>已等待 <span id="timer">1天 12小时 34分 20秒</span></p>
        </div>
    </div>
    
    <div class="btn-bar">
        <ul>
            <li><button class="reset" id="cancel" type="button">取消订单</button></li>
        </ul>
        <div class="link">
            <span  id="contact">联系客服</span>
        </div>
    </div>
    
	<script type="text/javascript" src="/js/commonJs.js?v=20170918"></script>
	<script>
        //底部元素定位
        function elPosition() {
            var _width  = $(window).width();
                _height = $(window).height(),
                _h      = $('body').height();

            if(_width > _height || _h > _height) {
                $('.btn-bar').css({'position': 'relative'});
            } else {
                $('.btn-bar').css({'position': 'absolute'});
            }
        }
		var createTime =  parseInt('${createTime?c}');
		var reatTime =   parseInt('${reatTime?c}')
		var tempTime = (reatTime - createTime)/1000;  //时间差包括分钟
		
		//console.log(new Date(Date.parse(new Date().toString().replace(/-/g, "/"))).getTime());
		//console.log(new Date().getTime());
		var alertNum = 0;
		var tripInterval;
		var alertFlag = true;
		
        $(function() {
        	var tips = '${tipsMessage}';
        	if (tips == '') {
        		$('.leave-msg').css('display','none'); 
        	}
        
        	tripInterval = setInterval("listenTrip('${tripNo}', 'toOrderWait')", 1000);
        	
            $('#timer').text('--:--');
            var timer = {
                minute: 0,  // 分钟
                second: 0  // 秒
            }
            var timerval = setInterval(function() {
                timer.second++;
                var min = $("#min").val();
                var secs = $("#secs").val();
                if(min!="" && secs!=""){
                	 timer.second = secs;
                	 timer.minute = min;
                }else{
                	timer.second = 0;
               	 	timer.minute = 0;
                	$('#timer').text('--:--');
                }
                
                /* if(timer.second >= 60) {
                    timer.second = 0;
                    timer.minute++;
                } */
                var str = '';

                if(timer.minute < 60) {
                    timer.minute < 10 ? str += '0' + timer.minute : str += timer.minute;
                    str += ':';
                    timer.second < 10 ? str += '0' + timer.second : str += timer.second;
                } else {
                    str += '>1小时';
                }
                if(timer.minute == 0 && timer.second ==0){
                	$('#timer').text('--:--');
                }else{
	                $('#timer').text(str);
                }
                var callOutTime = $("#callOutTime").val();
                if(callOutTime!="" && alertNum == 0){
                	var tempTime = parseInt(timer.minute) * 60 + parseInt(timer.second) ;
                	if($("#orderFlag").val() == 1){
                		window.clearInterval(timerval);
                		return;
                	}
                	if(tempTime>Number(callOutTime)){
            	        window.clearInterval(tripInterval);
                		alertNum ++;
                		var urlDetail = SERVER_URL_PREFIX+'/Trip/cancelTrip';
            			var dataDetail = {
            				tripNo : '${tripNo}',
            			};
             			dataDetail = genReqData(urlDetail, dataDetail);    
    					$.ajax({
            	            type: 'POST',
            	            url: urlDetail,
            	            data:dataDetail,
            	            dataType:  "json",
            	            success: function(data){
            	            		$.dialog({
                                        text: "等待超时自动取消本次行程!",
                                        title: '提示',
                                        buttons: [{
                                          text: '确定',
                                          onClick: function() {
                                        	  window.location=CURRENT_SERVER+'/index';             
                                         }
                                      }]
                                    });
            	            },
            	    	  });
    				}                	
                }
            }, 1000);
            
            //取消订单
           $('#cancel').off('click').on('click', function() {
        	   
                $.dialog({
                   text: '确定取消该次行程吗？',
                   title: '提示',
                   buttons: [{
                       text: '取消',
                   }, {
                       text: '确定',
                       onClick: function() {
                    	   alertFlag = false;
                    	   window.clearInterval(tripInterval);
	               			var urlDetail = SERVER_URL_PREFIX+'/Trip/cancelTrip';
	            			var dataDetail = {
	            				tripNo : '${tripNo}',
	            			};
	             			dataDetail = genReqData(urlDetail, dataDetail);    
                    	   	$.ajax({
                    	            type: 'POST',
                    	            url: urlDetail,
                    	            data: dataDetail,
                    	            dataType:  "json",
                    	            success: function(data){
                    	            	alertFlag = true;
                    	            	if(data.code ==0){
                    	            		$.toastSuccess("取消行程成功!");
                        	                window.location=CURRENT_SERVER+'/index';                    	            		
                    	            	}else{
                    	            		$.toastError("取消行程失败!");
                    	            	}
                    	            },
                    	            
                    	      });
                       }
                   }]
               });
            });
            
         //联系客服
           $('#contact').on('click', function() {
               
           	$.dialog({
                   text: '确定拨打客服电话吗？',
                   title: '提示',
                   buttons: [{
                       text: '取消',
                   }, {
                       text: '确定',
                       onClick: function() {
                    	   
                    	var urlDetail = SERVER_URL_PREFIX + '/Config/commonConfig';
                   		var dataDetail = {
                   			tripNo: '${tripNo}'
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
                       }
                   }]
               });
           	
           });
            
            elPosition();
            $(window).on('resize', function() {
                elPosition();
            });
        })
         
    </script>
</body>
</html>
