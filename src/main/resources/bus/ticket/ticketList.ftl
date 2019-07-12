<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>我的班车票</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
	<link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
	<link href="/res/style/my/my-ticket.css?v=${version!}" rel="stylesheet" type="text/css">
</head>
<body>
	 <div style="display: none;" id="ticketItemTemplate">	
		 <div  class="box card" style="ticketDisplay">
		 			<div class="main">
		 				date
                        <div class="code">
                            <span>验票码</span>
                            <span class="value">ticketCode</span>
                        </div>
	                </div>
                        commentContent
	                <div class="handle">
	                	templateShowOperation
	                </div>
	     </div>
     </div>
     
    <div class="my-ticket" id="datalist">
        <div class="item" style="display: none;" id="orderTemplate">
            <div class="box content">
                <div class="left">
                    <div class="time">departTime <span class="text-gray"> （共ticketNum）</span></div>
                    <div class="station">
                        <div class="station-item">
                            <div class="station-text">
                                <h4>departTitle</h4>
                            </div>
                        </div>
                        <div class="station-item">
                            <div class="station-text">
                                <h4>arriveTitle</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                busLineCarNo
	                    <!-- <div class="number">busLineCarNo</div> -->
	                    <div class="thumb" data-href="#">
	                        showStations
	                    </div>
	            </div>
            </div>
            ticketListTemplate
            <div class="box">
            	showAll
                <div class="foot-btn returnTicket" data-href="/busline/toRefundTicket?orderNo=templateOrderNo">退票</div>
            </div>
        </div>
    </div>
    <script src="/js/commonBus.js?v=${version!}"></script>
    <script src="/js/common.min.js?v=${version!}"></script>
      <script src="/js/vectors.min.js?v=${version!}"></script>
    <script>
    Date.prototype.Format = function (fmt) { //author: meizz 
	    var o = {
	        "M+": this.getMonth() + 1, //月份 
	        "d+": this.getDate(), //日 
	        "h+": this.getHours(), //小时 
	        "m+": this.getMinutes(), //分 
	        "s+": this.getSeconds(), //秒 
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	        "S": this.getMilliseconds() //毫秒 
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	}
    
    backtoUrl('/index');
	 // 分页选项
		var _options = {
	        number: 1,  // 页码
	        flag: false // 事件锁
	    };
	 
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
         var todayList = {};
         var orderNoList = [];
        $(function () {
            /*
             * 触发弹出层
             * */
            /* $('.showTicket').on('click', function () {
                handleTicket($(this), 5, function () {
                    //todo
                });
            }); */
           
            
            var urlStr = "/busTicket/getTicketListByDate";
            var dataObj = {
            		date:'',
				};
				//merge page param and common param,generate request param
				dataObj = genReqData(urlStr, dataObj);
				var data = {};
				var status = 0;
            $.post(urlStr,dataObj,function(data){
            	var commentStatus = data.data.isComment;
            	todayList = data.data.list;
            	$.each(todayList,function(index,value){
            		if($.inArray(value.orderNo,orderNoList) == -1){
            			orderNoList.push(value.orderNo);
            		}
            	});
            	 requestServer();
            },'json');
			
            
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
        })
        
        var databackRequest={};
		var callbackCount=0;
		var isPage = 0;
        var contentCount = 0; //两次列表获取，如果都为空，跳转到空页面
		function transInfoShow(contentArray,commentStatus) {
			if (contentArray.length > 0) { //内容不为空
				contentCount++;
				var newArr = [];
				for(var i = 0; i < contentArray.length; i++) {
					if($.inArray(contentArray[i].orderNo,orderNoList) == -1){
						newArr.push(contentArray[i]);
					}
				}
				if(contentCount == 1){
					if(todayList.length > 0){
						todayList.forEach(function(item) {
							newArr.unshift(item);
						});
					}
				}
				var ticketListHtml="";
				var orderList=$("#datalist");
				$.each(
						newArr,
					function(index, value) {
						var orderTemplateContent=$("#orderTemplate").html();
						//订单循环
						var busLineCarNoHtml = '';
						var showStationsHtml = '';
						if(value.orderType == 4){
							var ticketContent=parseTicketItem(value.ticketInfoList,value,commentStatus);//票的内容
							orderTemplateContent=orderTemplateContent.replace('departTime',getTicketListOrderDate(value.departTime));
							orderTemplateContent=orderTemplateContent.replace('showAll','');
							orderTemplateContent=orderTemplateContent.replace('ticketNum',value.ticketInfoList.length+"张");
							var carNo = $.trim(value.carNo);
							showStationsHtml = '<i data-href="/busline/busOrder/toOrderDetailMap?orderNo=templateOrderNo&token=templateToken" class="viewOrderMap"></i><p data-href="/busline/busOrder/toOrderDetailMap?orderNo=templateOrderNo&token=templateToken" class="viewOrderMap">查看站点</p>';
			    			if(carNo.length <= 0){
			    				busLineCarNoHtml = '<span class="number" style="display:none;"></span>';
			    			}else{
			    				busLineCarNoHtml = '<span class="number">' + carNo + '</span>';
			    			}
			    			orderTemplateContent = orderTemplateContent.replace('busLineCarNo',busLineCarNoHtml); 
						}else if(value.orderType == 7){
							var ticketContent=parseTicketItem(value.list,value,commentStatus);//票的内容
							busLineCarNoHtml = '<span class="number" style="display:none;"></span>';
							orderTemplateContent = orderTemplateContent.replace('busLineCarNo',busLineCarNoHtml);
							var temp = new Date(value.departTime).Format("hh:mm");
							orderTemplateContent=orderTemplateContent.replace('departTime',temp);
							showStationsHtml = '<i data-href="/commute/commuteOrder/toOrderDetailMap?orderNo=templateOrderNo&token=templateToken" class="viewOrderMap"></i><p data-href="/commute/commuteOrder/toOrderDetailMap?orderNo=templateOrderNo&token=templateToken" class="viewOrderMap">查看站点</p>';
							var showTicketHtml=''; 
							if(value.list.length >1){
	    						showTicketHtml = '<div class="foot-btn show-btn" >展示全部</div>'
	    						orderTemplateContent=orderTemplateContent.replace('showAll',showTicketHtml);
	    					}else{
	    						orderTemplateContent=orderTemplateContent.replace('showAll','');
	    					}
							orderTemplateContent=orderTemplateContent.replace('ticketNum',value.list.length+"天");
						}
						orderTemplateContent = orderTemplateContent.replace('showStations',showStationsHtml); 
						orderTemplateContent=orderTemplateContent.replace('departTitle',value.departTitle);
						orderTemplateContent=orderTemplateContent.replace('arriveTitle',value.arriveTitle);
						orderTemplateContent=orderTemplateContent.replace('ticketListTemplate',ticketContent);
						orderTemplateContent=orderTemplateContent.replace(/templateOrderNo/g,value.orderNo);
						orderTemplateContent=orderTemplateContent.replace(/templateToken/g,$.cookie('token'));
						orderTemplateContent='<div  class="item">'+orderTemplateContent+"</div>";
						orderList.append(orderTemplateContent);
						$('.toComment').off('click').on('click',function(){//立即评价
							var ticketId = $(this).attr('id');
							window.location = '/comment/toComment?ticketId=' + ticketId;
						});
						$('.commentDetail').off('click').on('click',function(){//评价详情
							var ticketId = $(this).attr('id');
							window.location = '/comment/toCommentDetail?ticketId=' + ticketId;
						});
						$(".returnTicket").click(function(){
							window.location=$(this).data('href');
						})
						$(".viewOrderMap").click(function(){
							window.location=$(this).data('href');
						})
						$('.showTicket').off('click').on('click', function () {
							var ticketId=$(this).attr('ticketId');
							var ticketStatus=$(this).attr('ticketStatus');
							var quickCheckFlag=$(this).attr('quickCheckFlag');
							var commentFlag = $(this).attr('commentFlag');
							 var depaerDate = $(this).data("name");
							 var nowDate  = new Date();
							 var year = nowDate.getFullYear();
							 var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1): nowDate.getMonth() + 1;
							 var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
							 var dateStr = year + "-" + month + "-" + day;
							 if(depaerDate<dateStr){
						         $.toast('车票已过期，无法出示');
						         return ;
						     }
							 if(depaerDate>dateStr){
								 $.toast('暂不支持解锁未来日期的车票');
							 }else{
							 if(ticketStatus==0){
				                handleTicket($(this), 3, function () {
				                    //todo
				                	$.ajax({
											type : 'POST',
											url : '/busTicket/unLockTicket',
											data : {'token':$.cookie('token'),'ticketId':ticketId},
											dataType : "json",
											success : function(data) {
												if(quickCheckFlag==1){
													$('.deblocking').trigger('click');
													window.location='/busTicket/ticketDetail?ticketId='+ticketId+'&token='+$.cookie('token') + '&commentFlag=' + commentFlag;
												}else{
													window.location.reload();
												}
											}
										});
				                });
							}else{
								window.location='/busTicket/ticketDetail?ticketId='+ticketId+'&token='+$.cookie('token') + '&commentFlag=' + commentFlag;
							}
						}
			            });
						
					});
					
			}else{
				//$(".empty-page").show();
				if (contentCount == 0 && _options.number == 1) { //两个列表内容均为空
					window.location.href='/ticketEmpty.html';
				}else{
					$(document.body).rollPage('destroy');   // 销毁事件
            		$('#datalist').hideLoading(); // 隐藏分页指示器
				}
				
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
				
	    	})
		}
        
        /**
         *处理订单里面的票务数组 
         */
        function parseTicketItem(ticketArray,order,commentStatus){
        	var ticketListHtml="";
        	if(order.orderType == 7){
        		ticketListHtml = EachCommuteArray(ticketArray,order,commentStatus);
        	}else{
        		ticketListHtml = EachArray(ticketArray,order,commentStatus);
        	}
        	return ticketListHtml;
        	
        }
        
        
        //未出行，执行中，预约订单目前只会出现一条，所以加载数据只会增加已完成订单数量
		var requestServer = function() {
				            //不为0的时候加载
					$('#datalist').loading();
					// 显示分页指示器
					//api url
					var urlStr = '/busTicket/ticketList';
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
									var commentStatus = data.data.isComment;
									var contentArray = data.data.list.data;
									transInfoShow(contentArray,commentStatus);
									$('#datalist').hideLoading();
									if (contentCount == 0 && _options.number == 1) { //两个列表内容均为空
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
									}
									_options.number++; // 页码自增
									_options.flag = false; // 数据渲染完成，事件解锁
									databackRequest[_options.number]=0;
								}
							},
						});
			}
    </script>
    
    <script>
    	function EachArray(ticketArray,order,commentStatus){
    		var ticketListHtml = '';
    		$.each(ticketArray,function(index, value) {
				var ticketItemTemplate=$("#ticketItemTemplate").html();
				var dateHtml ='';
				if(value.seatNo!='' && value.seatNo!=undefined && value.status != 2){
    				dateHtml = '<div class="seat"><span>座位号</span><span class="value" style="color:#999">'+value.seatNo+'</span></div>';
    			}
				ticketItemTemplate = ticketItemTemplate.replace('date',dateHtml);
	        	ticketItemTemplate = ticketItemTemplate.replace('ticketCode',value.verifyCode);
	        	ticketItemTemplate = ticketItemTemplate.replace('ticketDate','');

	        	//评价按钮
	        	//评价按钮
				var commentFlag = 0;//表示没有按钮
				var commentHtml = '<div class="evaluate" style="display:none;"><button></button></div>';
				if(commentStatus == 1){//表示启用
					if(value.commentStatus == 0 && value.status == 4){
						commentFlag = 1;//立即评价
						commentHtml = '<div class="evaluate"><button class="toComment" id="' + value.id + '">评价服务</button></div>';
					}else if(value.commentStatus == 1){
						commentFlag = 2;//查看评价
						commentHtml = '<div class="evaluate"><button class="commentDetail" id="' + value.id + '">查看评价</button></div>';
					}
				}
				ticketItemTemplate = ticketItemTemplate.replace('commentContent',commentHtml);
	        	
	        	//车票循环
	        	if(order.orderType == 4){
	        		value.departDate = new Date(value.departDate).Format("yyyy-MM-dd");
	        	}
	        	var showTicketTemplate='<button class="showTicket" commentFlag="' + commentFlag + '" ticketId="'+value.id+'" data-name='+value.departDate+' ticketStatus="statusTemplate" quickCheckFlag="quickCheckTemplate">出示车票</button>';
	        	
	        	var successTicketTemplate='<span class="status success"></span>';//已验票
	        	var returnTicketTemplate='<span class="status refund"></span>';//已退票
	        	var waitCarTicketTemplate='<span class="status wait"></span>';//带乘车
	        	var outCarTicketTemplate='<span class="status out"></span>';//带乘车
	        	
	        	if(order.ifQuickCheck==1){
	        		showTicketTemplate=showTicketTemplate.replace('quickCheckTemplate','1');
	        	}else{
	        		showTicketTemplate=showTicketTemplate.replace('quickCheckTemplate','0');
	        	}
	        	
	        	if(order.ifQuickCheck==1){
	        		if(value.status==4){
	        			showTicketTemplate=showTicketTemplate.replace('statusTemplate','1');
	        		}else{
	        			showTicketTemplate=showTicketTemplate.replace('statusTemplate','0');
	        		}
	        		
	        		if(value.status==1){
    	        		ticketItemTemplate=ticketItemTemplate.replace('templateShowOperation',showTicketTemplate);
    	        	}else if(value.status==2){
    	        		ticketItemTemplate=ticketItemTemplate.replace('templateShowOperation',returnTicketTemplate);
    	        	}else if(value.status==4){
    	        		ticketItemTemplate=ticketItemTemplate.replace('templateShowOperation',showTicketTemplate);
    	        	}
	        	}else{
	        		if(value.status==1){
    	        		ticketItemTemplate=ticketItemTemplate.replace('templateShowOperation',waitCarTicketTemplate);
    	        	}else if(value.status==2){
    	        		ticketItemTemplate=ticketItemTemplate.replace('templateShowOperation',returnTicketTemplate);
    	        	}else if(value.status==4){
    	        		ticketItemTemplate=ticketItemTemplate.replace('templateShowOperation',successTicketTemplate);
    	        	}
	        	}
				ticketListHtml+=ticketItemTemplate;
			});
    		return ticketListHtml;
    	}

    	function EachCommuteArray(ticketArray,order,commentStatus){
    		var ticketListHtml = '';
    		$.each(order.list,function(index, value) {
				var ticketItemTemplate = $("#ticketItemTemplate").html();
    			var dateHtml = '<div class="date">ticketDate commuteCarNo</div>';
				var carNo = $.trim(value.carNo);
    			ticketItemTemplate = ticketItemTemplate.replace('date',dateHtml);
    			if(carNo.length <= 0){
    				commuteCarNoHtml = '<span class="number" style="display:none;"></span>';
    			}else{
    				commuteCarNoHtml = '<span class="number">' + carNo + '</span>';
    			}
				ticketItemTemplate = ticketItemTemplate.replace('commuteCarNo',commuteCarNoHtml);
	        	ticketItemTemplate = ticketItemTemplate.replace('ticketCode',value.verifyCode);
	        	ticketItemTemplate = ticketItemTemplate.replace('ticketDate','<span>'+value.departDateStr+'</span>');
	        	var ticketDisplay ='';
				if(order.currentTime != value.departDate){
					ticketDisplay = 'display:none;" data-class="ticketDisplaysss';
					ticketItemTemplate = ticketItemTemplate.replace('ticketDisplay',ticketDisplay);
				}
	        	
				//评价按钮
				var commentFlag = 0;//表示没有按钮
				var commentHtml = '<div class="evaluate" style="display:none;"><button></button></div>';
				if(commentStatus == 1){//表示启用
					if(value.commentStatus == 0 && value.status == 4){
						commentFlag = 1;//立即评价
						commentHtml = '<div class="evaluate"><button class="toComment" id="' + value.id + '">评价服务</button></div>';
					}else if(value.commentStatus == 1){
						commentFlag = 2;//查看评价
						commentHtml = '<div class="evaluate"><button class="commentDetail" id="' + value.id + '">查看评价</button></div>';
					}
				}
				
				ticketItemTemplate = ticketItemTemplate.replace('commentContent',commentHtml);
	        	//车票循环
	        	var showTicketTemplate='<button class="showTicket" commentFlag="' + commentFlag + '" ticketId="'+value.id+'" data-name='+value.departDate+' ticketStatus="statusTemplate" quickCheckFlag="quickCheckTemplate">出示车票</button>';
	        	var successTicketTemplate='<span class="status success"></span>';//已验票
	        	var returnTicketTemplate='<span class="status refund"></span>';//已退票
	        	var waitCarTicketTemplate='<span class="status wait"></span>';//带乘车
	        	var outCarTicketTemplate='<span class="status out"></span>';//带乘车
	        	
	        	if(order.ifQuickCheck==1){
	        		showTicketTemplate=showTicketTemplate.replace('quickCheckTemplate','1');
	        	}else{
	        		showTicketTemplate=showTicketTemplate.replace('quickCheckTemplate','0');
	        	}
	        	
	        	if(order.ifQuickCheck==1 || order.orderType == 7){
	        		if(value.status==4){
	        			showTicketTemplate=showTicketTemplate.replace('statusTemplate','1');
	        		}else{
	        			showTicketTemplate=showTicketTemplate.replace('statusTemplate','0');
	        		}
	        		
	        		if(value.status==1){
    	        		ticketItemTemplate=ticketItemTemplate.replace('templateShowOperation',showTicketTemplate);
    	        	}else if(value.status==2){
    	        		ticketItemTemplate=ticketItemTemplate.replace('templateShowOperation',returnTicketTemplate);
    	        	}else if(value.status==4){
    	        		ticketItemTemplate=ticketItemTemplate.replace('templateShowOperation',showTicketTemplate);
    	        	}
	        	}else{
	        		if(value.status==1){
    	        		ticketItemTemplate=ticketItemTemplate.replace('templateShowOperation',waitCarTicketTemplate);
    	        	}else if(value.status==2){
    	        		ticketItemTemplate=ticketItemTemplate.replace('templateShowOperation',returnTicketTemplate);
    	        	}else if(value.status==4){
    	        		ticketItemTemplate=ticketItemTemplate.replace('templateShowOperation',successTicketTemplate);
    	        	}
	        	}
				ticketListHtml+=ticketItemTemplate;
			});
    		return ticketListHtml;
    	}
    </script>
</body>
</html>