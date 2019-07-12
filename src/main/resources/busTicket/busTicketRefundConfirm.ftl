<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>中交出行</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="/res/style/batch/refund-detail.css?v=${version!}" type="text/css">
</head>

<body>
    <div class="content">
        <div class="item">
            <h4 class="caption">退票详情</h4>
            <ul class="refund-detail">
                <li class="refund-item">
                    <div class="detail-list color-gray text-right">退票张数</div>
                    <div class="detail-list color-gray text-left"><span>${map.refundTicketCount!'0' }</span>张</div>
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
            <h4 class="caption">请选择退票原因</h4>
            <ul class="reason-list">
                <li data-value="行程有变" class="reason-item">行程有变</li><br/>
                <li data-value="赶不上车" class="reason-item">赶不上车</li><br/>
                <li data-value="有事取消" class="reason-item">有事取消</li><br/>
                <li data-value="选择其他交通工具" class="reason-item">选择其他交通工具</li><br/>
                <li data-value="其他" class="reason-item" id="other_reasons">其他</li><br/>
                <input type="hidden" id="tag">
            </ul>
            <label class="message-area" for="message-1" style="display: none">
                <textarea id="message-1" data-max="200" placeholder="其他意见和建议（内容匿名，可放心填写）" maxlength="200"></textarea>
                <div class="message-length">0/200</div>
            </label>
        </div>
    </div>
    <div class="btn-group">
        <div class="btn default" id="btn_back" >返回</div>
        <div class="btn default" id="btn_refund">确认退票</div>
    </div>
<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script>
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

        $('#btn_back').on('click',function(){
        	history.go(-1);
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
                $('#btn_refund').addClass('default');
            }else{
                $('#btn_refund').addClass('primary');

                $('#btn_refund').on('click',function(){
                	$.showLoading('正在为您退票，请稍等');
                	var dataObj = {
                        	ticketSerialNos:'${ticketSerialNos}',
                        	businessType:'${businessType}',
                        	ticketDate:'${ticketDate}',
                        	message:refund_reason
                        	};
                    var urlStr = SERVER_URL_PREFIX + '/busTicket/refundBatch';
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
                            	window.location.href="";//跳转页面 
                        	});
                       	 }else{
                       		$.alert((result&&result.message) || "未知错误");
                       	 }
                       	 
                        },
                  });
                }); 
                
                
               
            }
        });
    });
</script>
</body>
</html>