<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>订单详情</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/common.css" rel="stylesheet" type="text/css">
    <link href="/res/style/order-detail.css" rel="stylesheet" type="text/css">
    
    <script type="text/javascript" src="/js/commonJs.js?v=20170918"></script>
	<script>
		$(function(){
			$.initLoading();
		})
	</script>
</head>

<body>
	  <#include "../foot.ftl"/>
    <input type="hidden" id="orderNo" value="${orderNo}"/>
	<div class="order-info sui-border-b">
        <div class="driver-info">
            <dl class="sui-border-r">
                <dt><img src="/res/images/avatar.png" id="img" /></dt>
                <dd>
                    <div class="name">driverName · carNo</div>
                    <div class="attribute">providerName</div>
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
	
	
	<div id="orderDetail" class="payment-info sui-border">
        <div class="result-container">
            <div class="success sui-border-r">
                成功支付
            </div>
            <div class="price">
                <span>payPrice</span>
            </div>
        </div>
        <div class="detail-info">
            <div class="title-bar">查看明细</div>
            <div class="detail" style="display:none">
               <!--  <dl>
                    <dt>里程（6.7公里）</dt>
                    <dd>8.0元</dd>
                </dl>
                <dl>
                    <dt>时长费（6.7公里）</dt>
                    <dd>2.5元</dd>
                </dl> -->
                <dl>
                    <dt>出租车费</dt>
                    <dd>price</dd>
                </dl>
                <dl class="orange" id="couponPrice">
                    <dt>优惠金额</dt>
                    <dd>couponFee</dd>
                </dl>
            </div>
        </div>
    </div>
	
	
	<div class="comment sui-border">
        <div class="comment-title">匿名司机评价</div>
	    <div class="comment-static">
            <div class="star-bar">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
            </div>
            <ul class="tag-list tag-disable">
             <!--    <li><span></span></li>
                <li><span></span></li>
                <li><span></span></li> -->
            </ul>
            <div class="other">
                <span>其他建议：</span>content
            </div>
            <div class="grade-tip">您的评论会让我们做的更好</div>
        </div>
	</div>
	
	<div class="foot-position"></div>
    <footer>
        <div class="foot-wrap">
            <button class="submit-pay" id="toIndex">返回首页</button>
            <div class="link">
                <span id="contactCall">联系客服</span> |
                <span id="suggestBtn">投诉建议</span>
            </div>
        </div>
    </footer>
	
	<script>
    $(function() {
   		backtoUrl('/passenger/myorder.html');
   		$("#suggestBtn").click(function(){
    		window.location='/passenger/suggest.html';
    	});		
    	
        $('.submit-pay').on('click', function() {
           window.location=CURRENT_SERVER + '/index';
        });
        
        // 展开收缩详情
        $('.detail-info .title-bar').on('click', function() {
            var _this = $(this);
            if(_this.hasClass('active')) {
                _this.removeClass('active');
                _this.next().slideUp('fast');
            } else {
                _this.addClass('active');
                _this.next().slideDown('fast');
            }
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
        	 if(data && data.code == 0){
            		//console.log(data.data);
            		
            		//司机信息
            		var name = $(".sui-border-r .name").html();
            		name = name.replace('driverName', data.data.driverName);
            		name = name.replace('carNo', data.data.carNo);
            		$(".sui-border-r .name").html("");
            		$(".sui-border-r .name").append(name);
            		
            		var providerName = $(".sui-border-r .attribute").html();
            		providerName = providerName.replace('providerName', data.data.carBelongsCompany);
            		$(".sui-border-r .attribute").html("");
            		$(".sui-border-r .attribute").append(providerName);
            		
            		$("#img").attr("src", data.data.driverAvatar);
            		
            	//	var grade = $(".sui-border-r .grade").html();
            	//	grade = grade.replace('grade', data.data.star);
            	//	$(".sui-border-r .grade").html("");
            	//	$(".sui-border-r .grade").append(grade);
            		
            		if(data.data.star.toFixed(1)== -1){
        				$('#zeroCom').removeAttr("style")
        				$('#starbar').css('display','none'); 
        				//$('#starNumber').text("暂无评价");
        			}else{
        				$('#starNumber').text(data.data.star.toFixed(1));
        				$('#zeroCom').css('display','none');
        				$('#starbar').removeAttr("style")
        				
        				var content = data.data;
                		var j = 0;
                    	for(var i=0;i<content.star;i++){
                    		$(".starbar i").eq(i).attr("class","star");
                    		j++;
                    	}
                    	
                    	if (content.star%1 != 0) {
                    		$(".starbar i").eq(j-1).attr("class","star-half");
                    	}
                    	
        			}
            		
            		var callDricerTime =  content.callDriverTime * 60 * 1000;
					var payTime = content.payTime;
					var currentTime = new Date(Date.parse(new Date().toString().replace(/-/g, "/"))).getTime();
					if(callDricerTime < currentTime - payTime){
						$("#callTel").removeClass();
						$("#callTel").addClass("call-tel call-tel-disabled");
						$('#callTel').unbind("click");
					}
            		
            		//判断是否线下支付
            		if(data.data.payType == 3){
            			$(".detail-info").hide();
            			$("#orderDetail .price").hide();
            		}else{
            		    //订单信息
         			var price = $("#orderDetail .price").html();
         			price = price.replace('payPrice', data.data.payPrice+' 元');
         			
         			$("#orderDetail .price").html("");
                		$("#orderDetail .price").append(price);
                		
            			var detail = $(".detail-info .detail").html();
                		detail = detail.replace('price', data.data.price + ' 元');
                		detail = detail.replace('couponFee', data.data.couponPrice + ' 元');
                		$(".detail-info .detail").html("");
                		$(".detail-info .detail").append(detail);
            		}
            		
            		if(data.data.comment){
	            		setStarRating(data.data.comment.star);
            		}

               		var strHtml = '';
               		for(var i=0; i<data.data.comment.tags.length;i++){
               			strHtml += '<li><span>' + data.data.comment.tags[i] + '</span></li>';
               		}
                    /* var strHtml = '<li><span>' + result.data.comment.tags.content + '</span></li>';
                    strHtml += '<li><span>' + '行驶平稳' + '</span></li>'; */
                    $('.comment-static .tag-list').append(strHtml);

                    var content = $(".comment-static .other").html();
                    if(data.data.comment.content == ''){
                    	content = content.replace('content',"我对司机没任何说的，非常棒的出行体验。");
                    }else{
                    	content = content.replace('content',data.data.comment.content);
                    }
                    $(".comment-static .other").html("");
                    $(".comment-static .other").append(content);
            		
                    if(data.data.couponPrice == 0){
         				$("#couponPrice").remove();
         			}
                    
            		$.hideLoading();
            	 }else{
            		 $.dialog({content:'未知错误'});
            	 }
        }
  	});
    });
    //设置星星状态
    function setStarRating(num) {
        $('.star-bar i').removeClass('selected').each(function(index, element){
            if(index >= num) return;
            $(element).addClass('selected');
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
               	    if(data.code == 50001){
               	    	$.alert("拨打司机电话超出预有配置!");
               	    	$("#callTel").removeClass();
    					$("#callTel").addClass("call-tel call-tel-disabled");
    					$('#callTel').unbind("click");
               	    }
           	    }    
           	    }); 
			});
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
    
    $('#toIndex').on('click', function() {
    	window.location=CURRENT_SERVER+'/index';  	
    });
    </script>
</body>
</html>
