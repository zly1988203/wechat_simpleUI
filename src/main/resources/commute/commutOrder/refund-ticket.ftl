<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>退票</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/my/refund-ticket.css?v=${version!''}" rel="stylesheet" type="text/css">
</head>

<body style="padding-bottom: 10px">
    <div class="head-title">请选择需退款的车票</div>

    <!-- 车票 -->
    <div class="ticket-box">
    <#list ticket.ticketList as info>
        <div class="ticket">
            <div class="content">
                <div class="info">
                    <ul>
                        <li>
                            <p>${info.departDateDesc}</p>
                        </li>
                        <li>
                            <div class="name text-gray">验票码</div>
                            <div class="value text-bold">${info.verifyCode!''}</div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="right">
              <#if info.status == 1>
                <div class="handle" data-payPrice="${info.payPrice!'0'}" 
               			 data-serialNo="${info.ticketSerialNo!''}" data-status="${info.status!''}" data-orderNo="${info.orderNo!''}" data-insurance="">申请<br>退票</div>
                </#if>
                <#if info.status == 2>
                <div class="status refund"></div>
                </#if>
                 <#if info.status == 4>
                <div class="status success"></div>
                </#if>
                <#if info.status == 7>
                <div class="status out"></div>
                </#if>
            </div>
        </div>
    </#list>

    <script type="text/javascript" src="/js/commonJs.js?v=${version!''}"></script>
    <script>
    $(function(){
    	var type = '${type!''}';
    	if(type==1){//type为1表示从订单详情页过来的，原路返回
    		<#list ticket.ticketList as info>
    			var orderNo = '${info.orderNo!''}';
    			<#break>
    		</#list>
    		backtoUrl('/bus/toCommuteOrderDetail?orderNo='+orderNo);
    	}else{//跳到票列表页
    		/* backtoUrl('/busTicket/toCommuteTicketListPage'); */
    		 backtoUrl('/busTicket/toTicketListPage'); 
    	}
    });
    
 // 退票
    var title="提示";
    var text="";
    var text2='我知道了';
    var text3='拨打电话';
    $('.handle').on('click', function () {
    	_this = $(this)
   	 	var tel='${ticket.tel!''}';
//		 var time='${ticket.departDate!''}';
		 var ticketSerialNo=$(this).data('serialno')+'';
		 var orderNo=$(this).data('orderno')+'';
		$.post("/busTicket/refundRate",{ticketSerialNo:ticketSerialNo,token:$.cookie('token'),businessType:4},function(result){
     			var data = result.data;
     			var re=data;
     			var status=_this.data('status');
     			var price=_this.data('payprice');
     			price=parseFloat(price).toFixed(2);
 //    			var ticketSerialNo=$("#ticketId").val();
     			var priceFee = price;//实际支付票价
  				var counterFee=0;//退款手续费
     			if(result.code == 1){   //已经发车
     				text='当前车票已过退票时间，无法退票。若有疑问请联系我们';
     				text3='拨打电话'
     			}else if(result.code == 20000){
     				text='当前车票已验票，无法退票。若有疑问请联系我们';
     				text3='拨打电话';
     			}else if(result.code == 20001){
     				text='当前车票已出发票，请到退票窗口办理。若有疑问请联系我们';
     				text3='拨打电话';
     			}else if(result.code == 20004){
     				text='未找到对应的车票信息，若有疑问请联系我们';
     				text3='拨打电话';
     			}else if(result.code == 20005){
     				text='退票已成功，可刷新页面查询状态，若有疑问请联系我们';
     				text3='拨打电话';
     			}else{
     				var rate=re.rate;
     				if(rate==1000){
     			    	text="当前车票已过退票时间，无法退票。若有疑问请联系我们";
     			    	text3='拨打电话'
     				}else if(status==4){
     					text='当前车票已验票，无法退票。若有疑问请联系我们';
     					text3='拨打电话'
     				}else{
     					title='您确定要退票吗？';
//     				    counterFee=rate/1000*price;
     				    counterFee=rate/1000*priceFee;
	 				    var temp = Math.floor((priceFee-counterFee) * 100) / 100;
	 				    counterFee = priceFee - temp;
     					 if(parseInt('${ticket.scheduleType!1}')!=3){
	 						text='将收取手续费'+counterFee.toFixed(2)+'元';
	 					}else{
	 						text='退票将会退全部车票并将每张收取手续费'+counterFee.toFixed(2)+'元';
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
                            	window.location.href="/busline/toRefundTicket?orderNo=" + orderNo;
                        	});
                	 		}else{
                	 		    if(result.code==10002){
                	 		    	$.alert('当前车票无法自动退票，请联系我们'+tel);
                	 		    }else if(result.code == 20006){
                	 		    	$.alert('当前车票正在退票中，请勿重复操作，若有疑问请联系我们' + tel);
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
                }
            }]
        });
     		
     	},'json');
    });
    </script>
</body>
</html>