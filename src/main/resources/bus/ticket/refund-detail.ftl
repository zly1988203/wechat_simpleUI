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
    <link rel="stylesheet" href="/res/style/batch/refund-detail.css?v=${version!}">
    <!-- start Dplus --><script src="/js/udplus.js"></script><!-- end Dplus -->
</head>

<body>
    <div class="content">
        <div class="item">
            <h4 class="caption  fs-36">退票详情</h4>
            <ul class="refund-detail">
                <li class="refund-item">
                    <div class="detail-list color-gray text-right">退票<#if (businessType!'')== '7'>天<#else>张</#if>数</div>
                    <div class="detail-list color-gray text-left"><span>${map.refundTicketCount!'0' }</span><#if (businessType!'')== '7'>天<#else>张</#if></div>
                </li>
                <li class="refund-item">
                    <div class="detail-list color-gray text-right">实付金额</div>
                    <div class="detail-list color-gray text-left"><span>${map.totalPayAmount!'0' }</span>元</div>
                </li>
                <li class="refund-item">
                    <div class="detail-list color-gray text-right">退票手续费</div>
                    <div class="detail-list color-gray text-left"><span>${map.totalFee!'0' }</span>元</div>
                </li>
                <li class="refund-item">
                    <div class="detail-list color-orange text-right">实际退款金额</div>
                    <div class="detail-list color-orange text-left"><span>${map.totalRefundAmount!'0' }</span>元</div>
                </li>
            </ul>
        </div>
        <div class="item">
            <h4 class="caption  fs-32">请选择退票原因</h4>
            <ul class="reason-list">
                <li data-value="行程有变" class="reason-item">行程有变</li>
                <li data-value="赶不上车" class="reason-item">赶不上车</li>
                <li data-value="有事取消" class="reason-item">有事取消</li>
                <li data-value="选择其他交通工具" class="reason-item">选择其他交通工具</li>
                <li data-value="其他" class="reason-item" id="other_reasons">其他</li>
                <input type="hidden" id="tag">
            </ul>
            <label class="message-area" for="message-1" style="display: none">
                <textarea id="message-1" data-max="40" placeholder="以上原因都不对，手动输入原因" maxlength="40"></textarea>
                <div class="message-length">0/40</div>
            </label>
        </div>
    </div>
    <div class="btn-group">
        <div class="btn default" id="btnBack">返回</div>
        <div class="btn unclickable" id="btn_refund">确认退票</div>
    </div>
    
<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>

<script>
var providerDomin = document.domain.split('.')[0];
if('${businessType!''}' == '7'){
	dplus.track("浏览退票确认页",{
		"车企":providerDomin,
		"业务":"通勤班线",
		"页面名称":"退票确认页",
		"页面URL":window.location.href
	});
}else{
	dplus.track("浏览退票确认页",{
		"车企":providerDomin,
		"业务":"定制班线",
		"页面名称":"退票确认页",
		"页面URL":window.location.href
	});
}

	var msg = '${map.message!''}';
	if(msg != ''){
		if('${businessType!''}' == '7'){
			$.alert(msg,function(){
				window.location.href='/commute/toBatchRefund?orderNo=${map.orderNo!''}';
			});
		}else if('${businessType!''}' == '4'){
			$.alert(msg,function(){
				window.location.href='/busline/toRefundTicket?orderNo=${map.orderNo!''}';
			});
		}
	}
	//if('${businessType!''}' == '7'){
	//	backtoUrl('/commute/toBatchRefund?orderNo=${map.orderNo!''}');
	//}else if('${businessType!''}' == '4'){
	//	backtoUrl('/busline/toRefundTicket?orderNo=${map.orderNo!''}');
	//}
    $(function() {
        //字数统计
        $('#message-1').on('input', function() {
            var length = $(this).val().length;
            var _MAX = $(this).data('max');

            if(length <= _MAX) {
                $(this).next('div').attr('class', 'message-length').text(length + '/' + _MAX);
            } else {
            }
        });


        /*选择退票原因*/
        $('.reason-item').on('click',function(){
            var $el = $(this);

            //选中
            $el.addClass('active');

            //其他兄弟节点不选中
            $el.nextAll().removeClass('active');
            $el.prevAll().removeClass('active');

            // 如果选中的是其他，弹出意见框
            if($el.attr('id')=='other_reasons'){
                $('.message-area').show();
            }else{
                $('.message-area').hide();
            }
            //设置选择的退票原因
            $el.siblings('input').val($el.data('value'));

            //退票原因为空，确定按钮不可用
            var refund_reason = $('#tag').val();
            console.log('退票原因：'+ refund_reason) ;
            if(refund_reason==''){
            	$('#btn_refund').removeClass('primary');
                $('#btn_refund').addClass('unclickable');
            }else{
            	$('#btn_refund').removeClass('unclickable');
                $('#btn_refund').addClass('primary');
            }
        });
        $('#btnBack').on('click',function(){
	        if('${businessType!''}' == '7'){
	        	dplus.track("退票确认页-返回",{
    				"车企":providerDomin,
    				"业务":"通勤班线",
    				"页面名称":"退票确认页",
    			});
				window.location.href = '/commute/toBatchRefund?orderNo=${map.orderNo!''}';
			}else{
				dplus.track("退票确认页-返回",{
    				"车企":providerDomin,
    				"业务":"定制班线",
    				"页面名称":"退票确认页",
    			});
        		history.back();
        	}
        });
        
      //提交退票信息提示
        // refund(2,'李梅梅');
         $('#btn_refund').on('click',function(){
        	 if('${businessType!''}' == '7'){
        			dplus.track("退票确认页-确认退票",{
        				"车企":providerDomin,
        				"业务":"通勤班线",
        				"页面名称":"退票确认页",
        			});
        		}else{
        			dplus.track("退票确认页-确认退票",{
        				"车企":providerDomin,
        				"业务":"定制班线",
        				"页面名称":"退票确认页",
        			});
        		}
        	 
            var refund_reason = $('#tag').val();
         	if(refund_reason==''){
         		$.toast("请选择退票原因");
         		return;
         	}else if(refund_reason=='其他'){
         		var length = $('#message-1').length;
         		refund_reason = '（其他）'+$('#message-1').val();
         		var _MAX = $('#message-1').data('max');

	            if(length > _MAX) {
	                $.toast("字数太多");
	                return;
	            }
         	}
         	$.showLoading('正在为您退票，请稍等');
         	var dataObj = {
                 	ticketSerialNos:'${ticketSerialNos!''}',
                 	businessType:'${businessType!''}',
                 	message:refund_reason,
                 	refundPrice:${map.totalRefundAmount!'0' }
                 	};
             var urlStr = SERVER_URL_PREFIX + '/busline/busOrder/refundBatch';
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

                            window.location.href=document.referrer;
							// window.history.go(-1);
	                 	  });
                	 }else if(result&&result.code==36000){
                	 		$.alert('退款信息有变化',function(){
                	 			history.go(0);
                	 		});
                	 }else{
                		$.dialog({
		                    title: '提示',
		                    text: result.message,
		                    buttons: [
		                        {
		                            text: '我知道了',
		                            onClick: function () {
		                                console.log('点击了 -- 我知道了')
		                            }
		                        },
		                        {
		                            text: '拨打电话',
		                            onClick: function () {
		                                console.log('点击了 -- 拨打电话')
		                                tel();
		                            }
		                        }
		                    ]
		                });
                	 }
                	 
                 },
           });
         });
    });
   function tel(){
		var urlDetail = SERVER_URL_PREFIX + '/Config/getBusinessTel';
       	var dataDetail = {
       	};
       	dataDetail = genReqData(urlDetail, dataDetail);
    	$.ajax({
 	            type: 'POST',
 	            url: urlDetail,
 	            data: dataDetail,
 	            dataType:  'json',
 	            success: function(data){
 	            	if(data && data.tel){
    	            	window.location.href = 'tel:'+data.tel;  
 	            	}
    	        }
    	 }); 
   }
    /*
    * 提交退票信息提示
    * 参数 state：1-已过退票时间，2-已取票，3-已退票，4-退票失败 默认值为-退票成功
    * 参数 passenger_name：乘客名称
    * */
    /* function refund(state,passenger_name){
        $('#btn_refund').on('click',function(){
        	
        });
    } */
</script>
</body>
</html>