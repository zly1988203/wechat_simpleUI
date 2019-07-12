<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>支付费用</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/common.css" rel="stylesheet" type="text/css">
    <link href="/res/style/order-payment.css" rel="stylesheet" type="text/css">
    
    <script type="text/javascript" src="/js/commonJs.js"></script>
    <script>
		$(function(){
			$.initLoading();
		})
	</script>
</head>

<body>
	  <#include "../foot.ftl"/>
	<div id="info" class="order-info sui-border-b">
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
        <div id="callTel" class="call-tel"></div>
    </div>
    
    <div class="input-price-bar sui-border">
        <div class="input-box sui-border">
            <div class="left">打表</div>
            <input id="orderAmount" type="number"  placeholder="请填写正确的金额" step="0.1" max="999999.9" min="0.1"   />
            <div class="right">元</div>
        </div>
        <div class="tips" id="toPay">请咨询出租车司机车费，并输入金额</div>
        <div id="couponInfo" class="preferential" style="display: none">
            优惠信息
            <dl>
                <dt>优惠券</dt>
                <dd id="couMoney"></dd>
            </dl>
        </div>
    </div>
    
    <div class="pay-label">支付方式</div>
    <div class="pay-method sui-border-tb">
        <label class="wechat" for="wechatPay">
            <span>微信支付</span>
            <input type="radio" id="wechatPay" checked />
        </label>
    </div>
    <div class="foot-position"></div>
    <footer>
        <div class="foot-wrap">
            <button class="submit-pay" id="payBtn">确定支付</button>
                    <div class="link">
            <span id="contactCall" >联系客服</span>
            |
            <span id="suggestBtn">投诉建议</span>
            |
            <span class="contacts-help" id="contacts">紧急求助</span>
        </div>
        </div>
    </footer>
    
	<script>
		var couponReceiveRecordList = null;//用户优惠券列表
		var couponReceiveRecord = {};//一张优惠券
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
	        	
	        	if (content.star%1 != 0) {
	        		$(".starbar i").eq(j-1).attr("class","star-half");
	        	}
	        	
	        	$("#img").attr("src", content.driverAvatar);
				
				$('#driverName').text(content.driverName+"."+content.carNo);
				$('#providerName').text(content.carBelongsCompany);
				
				if(content.star.toFixed(2)== -1){
					$('#zeroCom').removeAttr("style")
					$('#starbar').css('display','none'); 
					//$('#starNumber').text("暂无评价");
				}else{
					$('#starNumber').text(content.star.toFixed(2));
					$('#zeroCom').css('display','none');
					$('#starbar').removeAttr("style")
				}
				
				couponReceiveRecordList = content.couponReceiveRecordList;
				
				$.hideLoading();
				var tripInterval = setInterval("listenOrder('${orderNo}','toPay')", 1000);
		    }
		}); 
		
	var couponValue = 0;//优惠券金额
	var couponId = 0;
	var needToPay = 0;//需要支付的金额
	var totalPay = 0; //用户输入的金额 
	
	$(function(){
		backtoUrl('/index');
		$("#suggestBtn").click(function(){
    		window.location='/passenger/suggest.html';
    	});	
		 $('#orderAmount').on('input', function() {
		 	couponReceiveRecord = getOptimalCouponReceiveRecord($('#orderAmount').val());
		 	if(couponReceiveRecord != null){
		 		var couponValue = couponReceiveRecord.faceValue;
		 		$('#couMoney').html("-"+couponValue+"元");
		 		$('#couponInfo').show();
		 	}else{
		 		couponReceiveRecord = {};
		 		couponReceiveRecord.faceValue = 0;
		 		couponReceiveRecord.id = 0;
		 		var couponValue = 0;
		 		$('#couponInfo').hide();
		 	}
			var pay = $(this).val();
			var dian = pay.indexOf('.');  
			 //var aa=  Math.round(parseFloat(needToPay)*10)/10;  
			var result = "";  
			if(dian == -1){  
				result =  parseFloat(pay).toFixed(2); 
			}else{
				var cc = pay.substring(dian+1,pay.length);  
				if(cc.length >= 3){
					result = pay.toString().substr(0,pay.toString().length-1);
					pay = result;
				}
			}
			
			if(pay == '') {
				$('#payBtn').text('确定支付');
				$('#toPay').html('请咨询出租车司机车费，并输入金额');
				return false;
			}
			totalPay = pay;
			pay = parseFloat(pay);   //计算前转换为数字类型
			if (pay%1 == 0) { //整数
				needToPay = (pay-couponValue).toFixed(2);
			} else { //非整数，保留1位
				needToPay = (pay-couponValue).toFixed(2);
			}
			
			if(pay==0 || pay==null ||pay==0.0){
				$('#toPay').html('请咨询出租车司机车费，并输入金额');
				$('#payBtn').text('确定支付');
			}else{
				if(needToPay<=0){
					needToPay = 0;
					$('#payBtn').text('确定支付');
				} else {
					$('#payBtn').text('确定支付  ' + toDdian(needToPay.toString()) + '元');
				}
				$('#toPay').html('需要支付' + toDdian(needToPay.toString()) + '元');  
			}
		 });
		 
		 $('#contacts').on('click', function(e) {
	        	contact('${orderNo}'); 			
	     });
		
	}); 
		
	function toDdian(needToPay){
			  var bb = needToPay+"";  
		      var dian = bb.indexOf('.');  
						 //var aa=  Math.round(parseFloat(needToPay)*10)/10;  
			  var result = "";  
			  if(dian == -1){  
				result =  parseFloat(needToPay).toFixed(2);  
			  }else{  
			  		var cc = needToPay.substring(dian+2,needToPay.length);  
					result = needToPay.toString();
					if(cc.length == 3){
						result = needToPay.toString().substr(0,needToPay.toString().length-1);
					}
			 }
			 return result;
		}
	
		function onBridgeReady(data) {
			WeixinJSBridge.invoke('getBrandWCPayRequest', {
				"appId" : data.appId, //公众号名称，由商户传入
				"timeStamp" : data.timeStamp, //时间戳，自1970年以来的秒数     
				"nonceStr" : data.nonceStr, //随机串     
				"package" : "prepay_id=" + data.prepayId,
				"signType" : data.signType, //微信签名方式：     
				"paySign" : data.paySign //微信签名 
			}, function(res) {
				if (res.err_msg == "get_brand_wcpay_request:ok") {
					$.showLoading('正在查询支付结果');
				} else {
					$.toastSuccess("取消支付");
				}
			});
		}
	
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

		$(function() {
			$("#payBtn").click(
					function() {
						var orderAmount = $("#orderAmount").val();
						var temp = (orderAmount - 0).toFixed(2);
						if (orderAmount == null || $.trim(orderAmount) == "" || $.trim(orderAmount) == 0 || temp == 0.0) {
							$.toastError("请输入正确的<br/>订单金额!");
							return;
						}
						
						if (needToPay == 0) { //支付金额0元
							var urlZero = SERVER_URL_PREFIX + "/zeroPay";
							var dataZero = {
									id : couponReceiveRecord.id,
									totalPay : totalPay,
									orderNo : '${orderNo}'
							};
							dataZero = genReqData(urlZero, dataZero);
							$.post(urlZero, dataZero, function(result) {
										if (parseInt(result.code) == 0) {
											$.toastSuccess("支付成功");
										} else {
											$.toastError(result.message);
										}
									}, 'json');
						} else {
							var urlAmount = SERVER_URL_PREFIX + '/getPrepayInfo';
							var dataAmount = {
									id : couponReceiveRecord.id,
									faceValue:couponReceiveRecord.faceValue,
									orderAmount : needToPay,
									orderNo : '${orderNo}'
							};
							dataAmount = genReqData(urlAmount, dataAmount);
							$.post(urlAmount, dataAmount, function(result) {
										if (parseInt(result.code) == 0) {
											onBridgeReady(result.data);
										} else {
											$.toastError(result.data.err_code_des);
										}
									}, 'json');
						}
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
			
		});
		
		function amount(obj){  
	       /*  var regStrs = [  
	            ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0  
	            ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点  
	            ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点  
	            ['^(\\d+\\.\\d{1}).+', '$1'] //禁止录入小数点后两位以上  
	        ];  
	        for(var i=0; i<regStrs.length; i++){  
	            var reg = new RegExp(regStrs[i][0]);  
	            th.value = th.value.replace(reg, regStrs[i][1]);  
	        }   */
	       // obj.value = obj.value.replace(/^0(\\d+)$,"$1"); 
	        /* obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符  
	        obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字而不是  
	        obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
	        obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
	        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3'); //只能输入1个小数  */
	        
	        /*
	        try{
		        if(!obj.validity.valid){
			        var num1 = $('#orderAmount').val();
			      	//num1 = new Number(num1).toFixed(2);
			      	num1 = parseFloat(Math.round(num1 * 1000000) / 1000000).toFixed(2);
			      	var indexDot = num1.indexOf('.');
			      	if(indexDot > -1){
			      		var decimalAfterDot = num1.substring(indexDot, indexDot + 1);
			      		if(num1 != '0.0' && decimalAfterDot === 0){
			      			num1 = num1.substring(0, indexDot);
			      		}
			      	}
			      	
			       	$('#orderAmount').val(num1);
		       	}
	       	}catch(e){
	       	}
	       	*/
	    } 	
		
		 $(function() {
				var oldNum = '';
		        $('#orderAmount').on('keyup', function(e) {
		            num = $(this).val();
		            var arr = num.split('.');
		            if(arr.length > 1) {
		                oldNum = arr[0] + '.' + arr[1].substr(0, 2);
		                $('#orderAmount').val(oldNum);
		            }if(num.length <= 0) {
		                if(e.keyCode != 8) {
		                    $('#orderAmount').val(oldNum);
		                }
		            }
		        });	
		 });
		 
		 function getOptimalCouponReceiveRecord(orderPrice){
		 	var crr = null;
		 	
		 	var crrList = [];
		 	$.each(couponReceiveRecordList, function(i, val) {  
				if(orderPrice >= val.minLimitAmount){
					console.log(val);
					crrList.push(val);
				}
			});
			
			if(crrList.length>0){
				crr = couponReceiveRecordList[0];
			}
			
			console.log(crr)
			return crr;
		 }
	</script>
</body>
</html>
