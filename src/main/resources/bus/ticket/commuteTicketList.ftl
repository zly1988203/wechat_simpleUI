<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>我的班车票</title>
	<meta name="viewport"
	content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
	<meta name="format-detection" content="telephone=no">
	<meta name="format-detection" content="email=no">
	<meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/taxi/common.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/ticket-list.css?v=${version!}" rel="stylesheet" type="text/css">
	<link href="/res/style/my/my-ticket.css?v=${version!}" rel="stylesheet" type="text/css">
	<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
	<script>window.PointerEvent = undefined</script>
	
</head>

<body>
	 <#include "../foot.ftl"/>	
	 <div class="my-ticket" id="ticketTemplate"></div>
	

	<script>
	 // 分页选项
	var _options = {
        number: 1,  // 页码
        flag: false // 事件锁
    };
    var databackRequest={};
	var callbackCount=0;
	var isPage = 0;
    $(function(){
    	backtoUrl('/commuteIndex');
    	requestServer();
    	// getOtherList(); 
		$(document.body).rollPage('load', function() {
				// 事件锁, 防止频繁触发事件
				if (_options.flag)
					return;
				_options.flag = true;
				// 页面滚动到底部请求下一页
				if(isPage == 1){
					requestServer();
				}
			});
		});
    
    //var getOtherList = function() {
    	/*
    	var urlStr = '/busTicket/ticketList';
		var otherObj = {};
		otherObj = genReqData(urlStr, otherObj);
		
		$.ajax({
			type : 'POST',
			url : urlStr,
			data : otherObj,
			dataType : "json",
			success : function(data) {
				var contentArray = data.data;
				transInfoShow(contentArray);
				
			}
		});
		*/
    //}

		//未出行，执行中，预约订单目前只会出现一条，所以加载数据只会增加已完成订单数量
		var requestServer = function() {
				            //不为0的时候加载
					$('#datalist').loading();
					// 显示分页指示器
					//api url
					var urlStr = '/busTicket/ticketCommuteList';
					//current page param
					var dataObj = {
						page : _options.number,
					};
					//merge page param and common param,generate request param
					dataObj = genReqData(urlStr, dataObj);
					
					$.ajax({
						type : 'POST',
						url : urlStr,
						data : dataObj,
						dataType : "json",
						success : function(data) {
								isPage = 1;
								if(!databackRequest[_options.number]||databackRequest[_options.number]==null){
									var pageCount = 1;
									var contentArray = data.data.data;
									transInfoShow(contentArray);
			
									$.hideLoading();
									if (contentCount == 0) { //两个列表内容均为空
										var html = '<div class="empty-page">'
						    				+'<div class="empty-main">'
						    					+'<i style="padding-top: 44%; background-image: url(/res/images/common/icon_no_ticket.png);"></i>'
						    						+'<p>您当前没有可用车票</p>'
						    						+'<div class="btn-group">'
						    							+'<button class="primary" onclick="buyTicket();">去购票</button>'
						    						+'</div>'
						    				+'</div>'
						    			+'</div>';
									$("#ticketTemplate").append(html);
										$(".empty-page").show();
									} else {
										
										var totalCount = data.data.totalCount;
										var pageSize = data.data.pageSize;
										
										if(totalCount%pageSize == 0){
						                    pageCount = totalCount/pageSize
						                }else{
						                	pageCount = totalCount/pageSize + 1;
						                }   
										
										if (!pageCount)
											pageCount = 1;
									}
									
									// 销毁分页指示器的逻辑：
									// 1.假定最大页码是5页, 已经到第5页，移除
									// 2.假定数据不满一页，没有滚动条时候，移除
									if (_options.number < pageCount) {
										if(contentArray.length<10){
					                		$(document.body).rollPage('destroy');   // 销毁事件
					                		$('#datalist').hideLoading(); // 隐藏分页指示器
					                	}
									}else{
										$(document.body).rollPage('destroy');   // 销毁事件
										$('#datalist').hideLoading(); // 隐藏分页指示器
									}
			
									_options.number++; // 页码自增
									_options.flag = false; // 数据渲染完成，事件解锁
									databackRequest[_options.number]=0;
								}
							},
						});
			
			}


		var contentCount = 0; //两次列表获取，如果都为空，跳转到空页面
		function transInfoShow(contentArray) {
			if (contentArray.length > 0) { //内容不为空
				contentCount++;
				$.each(contentArray,function(index, value) {
					var ticketHtml = '';
					var showTicketHtml = '';
					
					if(value.list.length >1 && value.orderType == 7){
						showTicketHtml = '<div class="foot-btn show-btn" >展示全部</div>'
					}
					$.each(value.list,function(ticketIndex, ticket) {
						var ticketDisplay ='';
						var orderType = value.orderType;
						if(value.currentTime != ticket.departDate && orderType == 7){
							ticketDisplay = 'style="display:none" data-class="ticketDisplaysss"';
						}
						var ifQuickCheck = value.ifQuickCheck;
						if(!ifQuickCheck){
							ifQuickCheck = 0;
						}
						var ticketId = ticket.id;
						
						var statusHtml = null;
			        	if(ifQuickCheck == 1 || orderType == 7){
			        		if(ticket.status == 2){
								statusHtml = '<span class="status refund"></span>';
							}else if(ticket.status == 4){
								statusHtml = '<button class="showTicket" data-id='+ticketId+' data-name='+ticket.departDate+' ticketStatus='+ticket.status+' quickCheckFlag='+value.ifQuickCheck+'>出示车票</button>';
							}else if(ticket.status == 1){
								statusHtml = '<button class="showTicket" data-id='+ticketId+' data-name='+ticket.departDate+' ticketStatus='+ticket.status+' quickCheckFlag='+value.ifQuickCheck+'>出示车票</button>';
							}else {
								statusHtml = '';
							}
			        	}else{
			        		if(ticket.status == 2){
								statusHtml = '<span class="status refund"></span>';
							}else if(ticket.status == 4){
								statusHtml = '<span class="status success"></span>';
							}else if(ticket.status == 1){
								statusHtml = '<span class="status wait"></span>';
							}else {
								statusHtml = '';
							}
			        	}
			        	
						
						var departDateHtml = '';
						if(orderType == 7){
							departDateHtml = '<span>'+ticket.departDateStr+'</span>';
						}
						ticketHtml = ticketHtml + '<div  class="box card" ' + ticketDisplay + '>'
													+'<div class="code">'
														+'<div>'
															+departDateHtml
														+'</div>'
														+'<span>验票码</span>'
														+'<span>'+ticket.verifyCode+'</span>'
													+'</div>'
													+'<div class="handle">'
														+statusHtml
													+'</div>'
												+'</div>';
					});
					var ticketListNum = '';
					var departDateHtml = '';
					if(value.orderType == 7){
						ticketListNum = value.list.length + '天';
					}else if(value.orderType == 4){
						ticketListNum = value.list.length + '张';
					}
					
						var title = '<div class="item">'
							+'<div class="box content">'
								+'<div class="left">'
									+'<div class="time">'+value.departTimeStr+' <span class="text-gray"> （共'+ticketListNum+'）</span></div>'
	                    			+'<div class="station">'
                    					+'<div class="station-item">'
                        					+'<div class="station-text">'
                        					 	+'<h4>'+value.departAddress+'</h4>'
                        					+'</div>'
                        				+'</div>'
                    					+'<div class="station-item">'
                        					+'<div class="station-text">'
                            					+'<h4>'+value.arriveAddress+'</h4>'
                        					+'</div>'
                   						 +'</div>'
                					+'</div>'
                				+'</div>'
                				+'<div class="right">'
                            	+'<div class="thumb" data-href="#">'
                            		+'<i data-href="/busline/busOrder/toOrderDetailMap?orderNo='+value.orderNo+'&token='+$.cookie('token')+'" class="viewOrderMap"></i>'
                            		+'<p data-href="/busline/busOrder/toOrderDetailMap?orderNo='+value.orderNo+'&token='+$.cookie('token')+'" class="viewOrderMap">查看站点</p>'
                             	+'</div>'
                            +'</div>'
                			+'</div>'
                			+ticketHtml
                			+'<div class="box">'
                			+showTicketHtml
                			+'<div class="foot-btn returnTicket" data-href="/busline/toRefundTicket?type=2&orderNo='+value.orderNo+'">退票</div>'
                			+'</div>'
                		+'</div>'
					$("#ticketTemplate").append(title);
						
				});
				
			}else{
				//$(".empty-page").css("display","none");
				window.location.href='/commuteTicketEmpty.html';
			}
			
			$('.show-btn').off('click').on('click',function(){
				var type = $(this).hasClass('shows');
				if(type){
					$(this).closest('.item').find('div[data-class="ticketDisplaysss"]').hide();
					$(this).text('展示全部');
					$(this).removeClass('shows')
				}else{
					$(this).closest('.item').find('div[data-class="ticketDisplaysss"]').show();
					$(this).text('隐藏部分');
					$(this).addClass('shows')
				}
				
	    	});
			
			$(".returnTicket").click(function(){
				window.location=$(this).data('href');
			});
			
			$(".viewOrderMap").click(function(){
				window.location=$(this).data('href');
			});
			
			/*
	         * 触发弹出层
	         * */
	         $('.showTicket').on('click', function () {
	        	 	
				 var ticketId = $(this).data("id");
				 var ticketStatus=$(this).attr('ticketStatus');
				 var quickCheckFlag=$(this).attr('quickCheckFlag');
				 
				 var depaerDate = $(this).data("name");
				 var nowDate  = new Date();
				 var year = nowDate.getFullYear();
				 var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1): nowDate.getMonth() + 1;
				 var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
				 var dateStr = year + "-" + month + "-" + day;
				 if(depaerDate>dateStr){
					 $.toast('暂不支持解锁未来日期的车票');
				 }else{
					 if(ticketStatus==1 && quickCheckFlag==1){
			                handleTicket($(this), 3, function () {
			                    //todo
			                	$.ajax({
										type : 'POST',
										url : '/busTicket/unLockCommuteTicket',
										data : {'token':$.cookie('token'),'ticketId':ticketId},
										dataType : "json",
										success : function(data) {
											if(data.code==0){
												$('.deblocking').trigger('click');
												window.location='/busTicket/commuteTicketDetail?ticketId='+ticketId+'&token='+$.cookie('token');
											}else{
												window.location.reload();
											}
										}
									});
			                    
			                });
						}else{
							window.location='/busTicket/commuteTicketDetail?ticketId='+ticketId+'&token='+$.cookie('token');
						}
				 }
		        });
			
		}
		
		  /*
	        * 解锁车票
	        *
	        * param：
	        *   el：元素
	        *   count：时长
	        *   callback：成功后回调函数
	        * */
	        function handleTicket(el, count, callback) {
	            /*
	            * 创建图层
	            * */
	            var _html = '<div class="deblocking">' +
	                    '<div class="main">' +
	                        '<div class="progress"><span class="bar"></span></div>' +
	                        '<div class="content">' +
		                        '<h4>长按图片' + count + '秒钟验票</h4>' +
	                            '<p>验票后将不能退票，请慎重操作</p>' +
	                            '<div class="thumb longTap"></div>' +
	                        '</div>' +
	                    '</div>' +
	                '</div>';
	            $('body').append(_html);

	            /*
	            * 关闭弹出层
	            * */
	            $('.deblocking').off('click').on('click', function (e) {
	                if($(e.target).hasClass('deblocking')) {
	                    $('.deblocking').hide(0, function () {
	                        $('.deblocking').remove();
	                    });
	                }
	            });

	            /*
	            * signal    最长时间
	            * step      步长
	            * timeAuto  计时器
	            * */
	            var _self = el;
	            var signal = count * 10,
	                step = 100 / signal;
	            var timeAuto = null;

	            //时间
	            if(!_self.data('time')) {
	                _self.data('time', 0);
	            } else if(_self.data('time') == signal) {
	                //已解锁
	                $('.progress').show();
	                progress(_self.data('time'));
	                return false;
	            }

	            var time = _self.data('time');

	            $('.deblocking .longTap').on('touchstart', function (e) {
	                //如果已经解锁车票，则不触发
	                if(!_self.data('lock')) {
	                    e.preventDefault();

	                    //初始化，并计时
	                    time = 0;

	                    timeAuto = setInterval(function () {
	                        //到达最长时长，则隐藏进度条
	                        if(time > signal) {
	                            clearInterval(timeAuto);
	                            success();
	                        }

	                        time++;
	                        progress(time);

	                        //持续时间超过100毫秒才展示
	                        if(time > 1) {
	                            $('.progress').show();
	                        }
	                    }, 100);
	                }
	            }).on('touchend', function () {
	                if(!_self.data('lock')) {
	                    clearInterval(timeAuto);

	                    //时长少于n秒，则回退到0秒
	                    if(time < signal) {
	                        time = 0;
	                        progress(time);
	                        $('.progress').hide();
	                    } else {
	                        success();
	                    }
	                }
	            });

	            /*
	            * 进度条
	            * */
	            function progress(t) {
	                $('.progress .bar').width(t * step + '%');
	            }

	            /*
	            * 完成
	            * */
	            function success() {
	                time = signal;
	                progress(time);
	                _self.data('time', signal);
	                _self.data('lock', true);

	                if(callback instanceof Function) {
	                    callback();
	                }
	            }
	        }
		
		
		function detail(data){
			location.href = "/busTicket/ticketDetail?ticketId="+data+"&token="+$.cookie('token');
		}
		
		function toBusIndex(){
			window.location.href='/busIndex?token='+$.cookie('token');
		} 
		
		function buyTicket(){
			window.location.href='/commuteIndex?token='+$.cookie('token');
		}
		
	</script>
</body>
</html>
