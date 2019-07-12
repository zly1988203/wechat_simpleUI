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
    <input type="hidden" id="orderType" value="${orderType}"/>
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
        <!--不可打电话时加上call-tel-disabled样式-->
        <!--  
        <div class="call-tel call-tel-disabled"></div>
    	-->
    </div>
	
	
	<div id="orderDetail" class="payment-info sui-border">
        <div class="result-container">
            <div class="success sui-border-r">
                成功支付
            </div>
            <div class="price">
                <span>payPrice</span>
            </div>
            <input id="orderNo" type="hidden" value="${orderNo}" />
        </div>
        <div class="detail-info">
            <div class="title-bar">查看明细</div>
            <div class="detail" style="display:none">
                <dl>
                    <dt>出租车费</dt>
                    <dd>price</dd>
                </dl>
                <dl class="orange" id="couponPrice">
                    <dt>优惠金额</dt>
                    <dd>couponRealPrice</dd>
                </dl>
            </div>
        </div>
    </div>
	
	
	<div class="comment sui-border">
        <div class="comment-title">匿名评价司机</div>
	    <div class="comment-static">
            <div class="star-bar">
            </div>
            <input type="hidden" id="starNum" value="0"/>
            <div class="grade-tip">您的评论会让我们做的更好</div>
        </div>
        <div id="commentForm" style="display:none">
            <div class="tag-title ui-border-t">请选择标签</div>

			<ul class="tag-list"></ul>

			<div class="comment-area">
                <textarea id="text" placeholder="其他意见和建议（内容匿名，可放心填写）" maxlength="200" ></textarea>
                <div class="comment-font-size">0/200</div>
            </div>
                        
        </div>
	</div>
	
	<div class="comment-submit-position" style="display:none"></div>
	<div class="comment-submit"  style="display:none">
	    <div><button id="submitBtn">提交评论</button></div>
	</div>
	

	<div class="foot-position"></div>
    <footer>
        <div class="foot-wrap">
            <button class="submit-pay">返回首页</button>
            <div class="link">
                <span id="contactCall">联系客服</span> |
                <span  id="suggestBtn">投诉建议</span>
            </div>
        </div>
    </footer>
	
	<script>
    // 选择不同星的提示语，后台下发，这里的文案只是做模拟
    var _star_tip = ['非常不满意，各方面都很差', '不满意，比较差', '一般，需要改善', '较满意，但仍可改善', '非常满意，无可挑剔'];
    
    var tagList;
        
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
        
        //提交标识
        var commitFlag = true;
        //选择星星
        var star = 0;
        StarRating(function(num) {
            star = num;
        });
        
        //提交
        $('#submitBtn').on('tap', function() {
        	var star = $("#starNum").val();
            if(star <= 0) {
                $.dialog({content:'至少需要选择一颗星星。'});
                return;
            }
            
            if (!commitFlag) {
            	return;
            }
			            
            var urlDetail = SERVER_URL_PREFIX + "/Comment/add";
			var dataDetail = {
				orderNo: '${orderNo}',
				star: star,
        		tagIds: getTagList(),
        		content: $("#text").val()
			};
 			dataDetail = genReqData(urlDetail, dataDetail);
 			$.ajax({
                type: 'POST',
                url: urlDetail,
                data: dataDetail,
                dataType:  "json",
                success: function(data){
                	if(data && data.code == 0){
                		var orderNo = '${orderNo}';
                        window.location.href=CURRENT_SERVER+'/toComment?orderNo='+orderNo;
                    }else{
                      	$.dialog({content:'未知错误'});
                    }
                }
         	 }); 
        });
        
        //字数统计
        $('.comment-area textarea').on('input', function() {
            var length = $(this).val().length;
            if(length <= 200) {
                $(this).next('div').removeClass('sui-red').text(length + '/200');
                commitFlag = true;
            } else {
                commitFlag = false;
            }
        });
        
        //查询订单详情
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
            		var content = data.data;
            		
            		var j = 0;
                	for(var i=0;i<content.star;i++){
                		$(".starbar i").eq(i).attr("class","star");
                		j++;
                	}
                	
                	if (content.star%1 != 0) {
                		$(".starbar i").eq(j-1).attr("class","star-half");
                	}
            		
            		//司机信息
            		var name = $(".sui-border-r .name").html();
            		name = name.replace('driverName', data.data.driverName);
            		name = name.replace('carNo', data.data.carNo);
            		$(".sui-border-r .name").html("");
            		$(".sui-border-r .name").append(name);
            		
            		$("#img").attr("src", content.driverAvatar);
            		
            		var providerName = $(".sui-border-r .attribute").html();
            		providerName = providerName.replace('providerName', data.data.carBelongsCompany);
            		$(".sui-border-r .attribute").html("");
            		$(".sui-border-r .attribute").append(providerName);
            		
            	//	var grade = $(".sui-border-r .grade").html();
            	//	grade = grade.replace('grade', data.data.star);
            	//	$(".sui-border-r .grade").html("");
            	//	$(".sui-border-r .grade").append(grade);
            		
					var callDricerTime =  content.callDriverTime * 60 * 1000;
					var payTime = content.payTime;
					var currentTime = new Date(Date.parse(new Date().toString().replace(/-/g, "/"))).getTime();
					if(callDricerTime < currentTime - payTime){
						$("#callTel").removeClass();
						$("#callTel").addClass("call-tel call-tel-disabled");
						$('#callTel').unbind("click");
					}	
					
            		//隐藏评分
            		if(content.star.toFixed(1)== -1){
        				$('#zeroCom').removeAttr("style")
        				$('#starbar').css('display','none'); 
        				//$('#starNumber').text("暂无评价");
        			}else{
        				$('#starNumber').text(content.star.toFixed(1));
        				$('#zeroCom').css('display','none');
        				$('#starbar').removeAttr("style")
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
                		detail = detail.replace('couponRealPrice', data.data.couponPrice + ' 元');
                		$(".detail-info .detail").html("");
                		$(".detail-info .detail").append(detail);
            		}
            		
            		if(data.data.couponPrice == 0){
         				$("#couponPrice").remove();
         			}
            		
            		$.hideLoading();
            		
            	 }else{
            		 $.dialog({content:'未知错误'});
            	 }
        }
  	});
        
	//查询评价列表
	 	var urlDetail = SERVER_URL_PREFIX + '/Comment/tagList';
		var dataDetail = {
			businessType: '3'
		};
		dataDetail = genReqData(urlDetail, dataDetail);
		
		 $.ajax({
	            type: 'POST',
	            url: urlDetail,
	            data: dataDetail,
	            dataType:  'json',
	            success: function(data){
	            	if(data && data.code == 0){
	            		   // console.log(tagResult.data);
	            		    tagList = data.data.list;
	            	}
	            }
	      	}); 
    });
    
    //初始化评分
    function StarRating() {
        var strHtml = '';
        for(var i = 1; i <= 5; i++) {
            strHtml += '<i data-num="' + i + '"></i>';
        }
        $('.star-bar').html(strHtml);
        
        //触摸事件处理
        $('.star-bar i').on('tap', function() {
            var num = $(this).data('num');
            setStarRating(num,tagList);
          //  console.log('tagList' + tagList);
            $("#starNum").val(num);
            formDisplay();
        });
        $('.star-bar').on('touchend', function(){
            formDisplay();
        });
        
        $('.star-bar').on('touchmove', function(event) {
            var scrollX = parseInt(event.touches[0].pageX - $(this).offset().left);
            if(scrollX > 0 && scrollX < 220) {
                var num = parseInt(scrollX / 44) + 1;
                setStarRating(num);
            }
        });
    }
    
    //设置星星状态
    function setStarRating(num,tagList) {
        $('.star-bar i').removeClass('selected').each(function(index, element){
            if(index >= num) return;
            $(element).addClass('selected');
        });
        
        var strHtml = '';
        
        for(var i = 0; i < tagList.length; i++){
        	if(tagList[i].star == num){
        		var content = tagList[i].tags.content
        		if(content!=''){
        			var contentArray = content.split('@');
        			for(var j=0;j<contentArray.length;j++){
        				strHtml += '<li><span id='+ contentArray[j] +'>' + contentArray[j] + '</span></li>';
        			}
        		}
        	}
        }
        $('.tag-list').html(strHtml);
        $('.grade-tip').text(_star_tip[num - 1]);
        selectTagList();
    }
        
    //选择标签
    function selectTagList() {
        $('.tag-list li').on('tap', function() {
            var elemtnt = $(this);
            if(elemtnt.hasClass('selected')) {
                elemtnt.removeClass('selected');
            } else {
                elemtnt.addClass('selected');
            }
        });
    }
        
    //展开表单
    function formDisplay() {
        $(window).scrollTop(0);
        $('.grade-title').addClass('grade-title-active');
        $('#orderDetail').slideUp(400);
        $('.comment-title').hide();
        $('#commentForm').show();
        $('.btn-box').show();
        $('.foot-position').remove();
        $('footer').animate({translate: '0,100%'}, 'fast', function() {
            $(this).remove();
            $('.comment-submit-position').show();
            $('.comment-submit').show().animate({translate: '0,0'},'fast');
        });
        
    }
    
    function getTagList() {
    	var tagIdValues = "";
        $('.tag-list li').each(function() {
            var element = $(this);
            if(element.hasClass('selected')) {
            	tagIdValues += element.find('span')[0].id + "@";
            }
        });
        return tagIdValues;
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
               	    }else{
               	    	if(data.code == 50001){
               	    		$.alert("拨打司机电话超出预有配置!");
               	    		$("#callTel").removeClass();
    						$("#callTel").addClass("call-tel call-tel-disabled");
    						$('#callTel').unbind("click");
               	    	}
               	    }
               	}
            }); 
     });
    </script>
</body>
</html>
