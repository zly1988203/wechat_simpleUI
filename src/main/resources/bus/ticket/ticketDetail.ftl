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
    <link href="/res/style/taxi/common.css?v=${version!}" rel="stylesheet" type="text/css">
	<link href="/res/style/bus/ticket-detail-3.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>

    <div class="ticket-detail">
        <div class="head">
        	<input type="hidden" id="ticketDate" value="${result.departDate!}"/>
        	<input type="hidden" id="departTime" value="${result.departTime!}"/>
        	<input type="hidden" id="status" value="${result.status}"/>
        	<input type="hidden" id="ticketPrice" value="${result.ticketPrice}"/>
        	<input type="hidden" id="bossTel" value="${result.tel!}"/>
        	<input type="hidden" id="orderNo" value="${result.orderNo!}"/>
        	<input type="hidden" id="ticketId" value="${result.ticketSerialNo!}"/>
        	<input type="hidden" id="payPrice" value="${result.payPrice!}"/>
        	<input type="hidden" id="numbers" value="${result.numbers!}"/>
            <div class="tips" id="timeCountDown"></div>
            <#if (result.code!'')!= ''>
            <div class="checkanimat"></div>
            <div class="code">
                <h4>${result.carNo!''}</h4>
                <div class="number"><span>验票码：</span>${result.verifyCode!}</div>
            </div>
            <#else>
            <div id="code-detail">
              <div class="code-show">
                <p>验票码</p>
                <p class="value">${result.verifyCode!}</p>
              </div>
              <p class="car-number">${result.carNo!''}</p>
            </div>
            </#if>
        </div>
        <div class="main">
            <div class="top">
                <div class="date">${result.departDate!}&nbsp${result.departTime!}</div>
            </div>
            <div class="content">
                <div class="info">
                    <div class="info-item start">${result.departStation!}</div>
                    <div class="info-item end">${result.arriveStation!}</div>
                </div>
                <#if result.contactMobile??>
                	<div class="tel" data-href="tel:${result.contactMobile!}" id="callTel"></div>
                </#if>
            </div>
            <div class="btn" id="toMap">车辆与站点定位</div>
        </div>
        <div class="bottom">
            <div class="bottom-head">
                <h4>车票信息</h4>
                <span class="addition" data-href="/passenger/rideGuide.html">乘车指南</span>
            </div>
            <div class="bottom-content">
               <p>车票状态：
               <#if result.status?? &&result.status ==1>
                    <span class="code-type-wait">待乘车</span>
               <#elseif result.status?? &&result.status ==4>
                    <span class="code-type-success">已验票</span>
               <#else> 
                    <span class="code-type-expired">已过期</span>
               </#if>    
                </p>
                <p>下单时间：${result.createTime?c?number?number_to_datetime?string("yyyy年MM月dd日 HH:mm")}</p>
                <p>车票编号：${result.ticketSerialNo!}</p>
                <p>票价：￥${result.ticketPrice!}</p>
            </div>
            <div class="bottom-btn" id="refund">申请退票</div>
        </div>
    </div>

<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/flightchart.min.js?v=${version!}"></script>
<script>
//查看地图，共有
$('#toMap').on('click', function() {
	var urlStr = SERVER_URL_PREFIX+'/busline/busOrder/toOrderDetailMap';
	var orderNo = $('#orderNo').val();
	var dataObj = {	
	};
	dataObj = genReqData(urlStr, dataObj);
	window.location.href="/busline/busOrder/toOrderDetailMap?token="+dataObj.token+"&orderNo="+orderNo;
	
});	  

	function timer(){
		var intDiff = parseInt('${result.countDown!}');
		window.setInterval(function(){
		var day=0,
		    hour=0,
		    minute=0,
		    second=0;//时间默认值        
		if(intDiff > 0){
		    day = Math.floor(intDiff / (60 * 60 * 24));
		    hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
		    minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
		    second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
		}
		if (minute <= 9) minute = '0' + minute;
		if (second <= 9) second = '0' + second;
		
		$('#timeCountDown').html('上车倒计时  <span>'+day+'</span>天<span>'+hour+'</span>小时<span>'+minute+'</span>分');
		intDiff--;
		}, 1000);
	} 

    $(function() {
//    	backtoUrl('/busTicket/toTicketListPage');
    	timer();
    	var code = '${result.code!''}';
    	if(code !=''){
	    	//动态电子票
	        $('.checkanimat').flightChart({
	        	text: "${result.code!''}",
	            flights: ['/res/images/bus/check-animat/01.png', '/res/images/bus/check-animat/02.png', '/res/images/bus/check-animat/03.png', '/res/images/bus/check-animat/04.png', '/res/images/bus/check-animat/05.png', '/res/images/bus/check-animat/06.png', '/res/images/bus/check-animat/07.png', '/res/images/bus/check-animat/08.png'],
	            flightSpeed: 3
	        });
        }
        // 退票
        var title="提示";
        var text="";
        var text2='我知道了';
        var text3='拨打电话';
        $('#refund').on('click', function () {
        	 var tel=$("#bossTel").val();
   			 var time=$("#ticketDate").val()+' '+$("#departTime").val();
   			 var ticketSerialNo='${result.ticketSerialNo!}';
			$.post("/busTicket/refundRate",{ticketSerialNo:ticketSerialNo,ticketDate:time,token:$.cookie('token'),businessType:4},function(result){
         			var data = result.data;
         			var re=data;
         			var status=$("#status").val();
         			var price=$("#ticketPrice").val();
         			price=parseFloat(price).toFixed(2);
         			var ticketSerialNo=$("#ticketId").val();
         			var priceFee = $("#payPrice").val()/$("#numbers").val();//实际支付票价
      				var counterFee=0;//退款手续费
      				
         			if(result.code == 1){   //已经发车
         				text='当前车票无法自动退票，请联系我们'+tel;
         				text3='拨打电话'
         			}else{
         				var rate=re.rate;
         				if(rate==1000){
         			    	text="当前车票无法自动退票，请联系我们"+tel;
         			    	text3='拨打电话'
         				}else if(status==4){
         					text='当前车票无法自动退票，请联系我们'+tel;
         					text3='拨打电话'
         				}else{
         					title='您确定要退票吗？';
         				    counterFee=rate/1000*price;
         					 if(parseInt('${result.scheduleType}')==1){
		 						text='将收取手续费'+counterFee.toFixed(2)+'元';
		 					}else{
		 						text='退票将会退全部车票并将收取手续费'+counterFee.toFixed(2)+'元';
		 					}
         					text2='再想想';
         					text3='确定';
         				}
         			}
         			var fee = parseFloat(priceFee).toFixed(2) - parseFloat(counterFee).toFixed(2);//退款金额
      				
         			$.dialog({
                		title: title,
                		text: text,
                		buttons: [{
                    	text: text2,
                    	onClick: function() {
                          console.log('btn 1');
                    	}
                	}, {
                    	text: text3,
                    	onClick: function() {
                    	if(text3=='拨打电话'){
                    	    location.href="tel:"+tel;
                    	}else if(text3='确定'){
                    		$.showLoading('正在为您退票，请稍等');
                    		var orderNo=$("#orderNo").val();
                    		var urlStr = SERVER_URL_PREFIX+'/busline/busOrder/refund';
            				var dataObj = {
            					orderNo: orderNo,
                				priceFee: priceFee,
                				ticketSerialNo: ticketSerialNo
            			  	};	
            			dataObj = genReqData(urlStr, dataObj);
            	 		$.ajax({
                     		type: 'POST',
                     		url:urlStr,
                    		data:dataObj,
                     		dataType:  "json",
                     		success: function(result){
                     			$.hideLoading();
                    	 		if(result&&result.code==0){
                    			$.alert('退票成功', function() {
                                	console.log('ok');
                                	window.location.href="/busTicket/toTicketListPage";
                            	});
                    	 		}else{
                    	 		    if(result.code==10002){
                    	 		    	$.alert('当前车票无法自动退票，请联系我们'+tel);
                    	 		    }else if(result.code == 404317 ){
                    	 				$('#confirmTester').on('click', function() {
                    	 		           $.confirm((result&&result.message+''+tel) || "未知错误", function() {
                    	 		        	  location.href="tel:"+tel;
                    	 		           });
                    	 		       });
                    	 			}else{
	                    				$.alert((result&&result.message+''+tel) || "未知错误");
                    	 			}
                    	 		}
                    	 
                     		},
               			});
                    	}
                        console.log('btn 2');
                    }
                }]
            });
         		
         	},'json');
        });
    });
  
</script>
</body>
</html>