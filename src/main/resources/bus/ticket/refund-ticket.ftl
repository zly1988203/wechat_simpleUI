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
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/batch/refund-ticket.css?v=${version!}" rel="stylesheet" type="text/css">
    <!-- start Dplus --><script src="/js/udplus.js"></script><!-- end Dplus -->
</head>

<body>

    <div class="ticket-info">
        <div class="row">
            <div class="time">${orderInformation.boardingTime1!''}<span>（共${orderInformation.numbers!''}张）</span></div>
            <!-- 已支付才显示车牌、电话，站点 -->
            <#if (orderInformation.orderStatusInt)?? &&(orderInformation.orderStatusInt)==0>
            <div class="other">
            	<#if (orderInformation.vehicleCard)??>
                <div class="licence">${orderInformation.vehicleCard!''}</div>
                </#if>
                <#if (orderInformation.mobile)??>
                <div class="phone" id="callDriver" data-mobile="${orderInformation.mobile}" ></div>
                </#if>
            </div>
            </#if>
        </div>

        <div class="station">
            <div class="station-item start">${orderInformation.departTitle!''}</div>
            <div class="station-item end">${orderInformation.arriveTitle!''}</div>
        </div>
     </div>
    <div class="head-title">已选择<em>0</em>张车票</div>

    <!-- 车票 -->
    <div class="ticket-box">
    	<#list ticket.ticketList as info>
        <div class="ticket">
            <div class="content">
             <label>
                <#if info.status = 1>
                	<input type="checkbox" class="frm-checkbox" name="refund"  data-serialNo="${info.ticketSerialNo!''}">
                </#if>
                <#if info.status = 1>
                	<div  class="info">
                <#else>
                	<div class="info mrl-70">
                </#if>
                    <ul>
                        <li>
                            <div class="name text-gray">验票码</div>
                            <div class="value text-bold">${info.verifyCode!''}</div>
                        </li>
                        <#if (info.passengerName!'') != ''>
                        <li>
                            <div class="name">乘客</div>
                            <div class="value">${info.passengerName!''}</div>
                        </li>
                        </#if>
                        <#if (info.passengerMobile!'') != ''>
                        <li>
                            <div class="name">手机号</div>
                            <div class="value">${info.passengerMobile!''}</div>
                        </li>
                        </#if>
                        <#if (info.idCardNo!'') != ''>
                        <li>
                            <div class="name">身份证</div>
                            <div class="value">${info.idCardNo!''}</div>
                        </li>
                        </#if>
                    </ul>
                </div>
               </label>
            </div>
            <!--  <div class="right">
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
            </div> -->
            <div class="right">
            	<#if info.status == 1>
                  <div class="status wait"></div>
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

        <div class="btn-group">
          <div class="btn default" id="btnBack">返回</div>
          <div class="btn readonly" id="submit">下一步</div>
        </div>
    
    <script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
    <script>
	var providerDomin = document.domain.split('.')[0];
	dplus.track("浏览退票选择票页",{
		"车企":providerDomin,
		"业务":"定制班线",
		"页面名称":"退票选择票页",
		"页面URL":window.location.href
	});
	
    $(function () {
    	//backtoUrl('/bus/toBusOrderDetail?orderNo=${orderInformation.orderNo!''}');
        $('.ticket label').on('touchstart', function (e) {
            //解除阻止
            e.stopPropagation();
        }).on('click', function () {
            var parent = $('.ticket-box'),
                title = $('.head-title'),
                submit = $('#submit');
            var len = parent.find('[name=refund]:checked').length;

            //计数
            title.find('em').text(len);

            //下一步按钮样式
            if(len > 0) {
                submit.removeClass('readonly').addClass('primary');
            } else {
                submit.addClass('readonly').removeClass('primary');
            }
        });
        //下一步
        $('#submit').on('click', function () {
        	dplus.track("退票选择票页-下一步",{
        		"车企":providerDomin,
        		"业务":"定制班线",
        		"页面名称":"退票选择票页",
        	});

        	var ticketSerialNos='';
        	var ticketArray = [];
        	var token=$.cookie('token');
        	var ticketDate = '${orderInformation.boardingTime}';
        	
        	$('.frm-checkbox').each(function () {
        		var el = $(this);
        		if(el.is(':checked')){
        			ticketArray.push(el.data('serialno'));
        		}
        	});
        	ticketSerialNos = ticketArray.join(',');
        	//alert(ticketSerialNos);
        	
           var dataObj = {
                	ticketSerialNos:ticketSerialNos,
                	token:token,
                	businessType:4
                	};
            var urlStr = '/busTicket/checkBusTicketRefund';
        	$.ajax({
                type: 'POST',
                url:urlStr,
                data:dataObj,
                dataType:  "json",
                success: function(result){
               	 if(result&&result.code==0){
               		window.location.href="/busTicket/toRefundDetail?ticketSerialNos=" + ticketSerialNos + "&token=" + token + "&businessType=" + ${orderInformation.orderType!'4'};
               	 }else{
               		//$.alert((result&&result.message) || "未知错误");
               		if(result.code==20004){
               			$.alert(result.message);
                   	 }else{
                   		var tel='${ticket.tel!''}';
                   	  	var title="提示";
                        var text="";
                        var text2='我知道了';
                        var text3='拨打电话';
         				if(result.code==1){
         			    	text="当前车票已过退票时间，无法退票。若有疑问请联系我们";
         				}else if(result.code==20000){
         					text='当前车票已验票，无法退票。若有疑问请联系我们';
         				}else if(result.code == 20005){
         	 				text='退票已成功，可刷新当前页面查询状态，若有疑问请联系我们';
         	 			}else{
         					text=result.message;
         				}
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
                        	}
                        }
                    	}]
                		});
                   	 }
               		}
               		
             
                },
          });
        });
        $('#btnBack').on('click',function(){
        	dplus.track("退票选择票页-返回",{
        		"车企":providerDomin,
        		"业务":"定制班线",
        		"页面名称":"退票选择票页",
        	});
			window.history.go(-1);
        });
    });
    </script>
    <script>
  //  backtoUrl('/busTicket/toTicketListPage');
 // 退票
    /* var title="提示";
    var text="";
    var text2='我知道了';
    var text3='拨打电话';
    $('.handle').on('click', function () {
    	_this = $(this)
   	 	var tel='${ticket.tel!''}';
//		 var time='${ticket.departDate!''}';
		 var ticketSerialNo=$(this).data('serialno')+'';
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
 				text='请先选择车票';
 				text3='拨打电话';
 			}else if(result.code == 20005){
 				text='退票已成功，可刷新当前页面查询状态，若有疑问请联系我们';
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
                		var orderNo=_this.data('orderNo');
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
                    console.log('btn 2');
                }
            }]
        });
     		
     	},'json');
    }); */
    </script>
</body>
</html>