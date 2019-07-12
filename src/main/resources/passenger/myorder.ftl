<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>我的订单</title>
	<meta name="viewport"
	content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
	<meta name="format-detection" content="telephone=no">
	<meta name="format-detection" content="email=no">
	<meta http-equiv="X-UA-Compatible" content="chrome=1" />
	<link href="/res/style/simpleui.min.css" rel="stylesheet" type="text/css">
	<link href="/res/style/common.css" rel="stylesheet" type="text/css">
	<link href="/res/style/myorder.css" rel="stylesheet" type="text/css">
	
	<script type="text/javascript" src="/js/commonJs.js?v=20170918"></script>
	<script>
	    $(function() {
	    	$.initLoading();
	    })
    </script>
</head>

<body>
	 <#include "../foot.ftl"/>
	<div class="order-empty" style="display: none;">
        <div>
            <i></i>
            暂无订单数据
	    </div>
	</div>
	
	<div id="template" style="display: none;">
		<div class="order-item sui-border">
			<ul class="head">
				<li>orderType</li>
				<li class="status status-green">orderStatus</li>
			</ul>
			<div class="time">createTime</div>
			<div class="address" data-url="detailUrl">
				<ul>
					<li class="start">departTitle</li>
					<li class="end">arriveTitle</li>
				</ul>
				<div class="arrow"></div>
			</div>
		</div>
	</div>

	<div id='underWayDiv' style="display: none" class="order-container">
		<div class="title">进行中的订单</div>
		<div id="underWay" ></div>
	</div>

	<div id='reservationDiv' style="display: none" class="order-container">
		<div class="title">已预约订单</div>
		<div id="reservation" ></div>
	</div>

	<div id='completedDiv' style="display: none" class="order-container">
		<div class="title">已完成订单</div>
		<div id="completed" ></div>
	</div>

	<div id="datalist">
		<ul class="sui-list"></ul>
	</div>

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
    	backtoUrl('/passenger/my/my.html');
    	
    	getOtherList();
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
    
    var getOtherList = function() {
    	var urlStr = SERVER_URL_PREFIX + '/Order/getOtherList';
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
				
				//isPage = 1;
				requestServer();
			}
		});
    }

		//未出行，执行中，预约订单目前只会出现一条，所以加载数据只会增加已完成订单数量
		var requestServer = function() {
				            //不为0的时候加载
					$('#datalist').loading();
					// 显示分页指示器
					//api url
					var urlStr = SERVER_URL_PREFIX + '/Order/getCompleteList';
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
									var contentArray = data.data.list;
									transInfoShow(contentArray);
			
									$.hideLoading();
									if (contentCount == 0) { //两个列表内容均为空
										$(".order-empty").show();
									} else {
										pageCount = data.data.pageCount;
										if (!pageCount)
											pageCount = 1;
									}
									
									// 销毁分页指示器的逻辑：
									// 1.假定最大页码是5页, 已经到第5页，移除
									// 2.假定数据不满一页，没有滚动条时候，移除
									if (_options.number >= pageCount) {
										$(document.body).rollPage('destroy'); // 销毁事件
										$('#datalist').hideLoading(); // 隐藏分页指示器
										return;
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

				$.each(
					contentArray,
					function(index, value) {
						$(value.target + 'Div').show()

						var template = $(
							"#template").html();
						template = template
						.replace(
							'status status-green',
							value.color);
						template = template
						.replace(
							'orderStatus',
							value.orderStatus);
						template = template
						.replace(
							'orderType',
							value.orderType);
						template = template
						.replace(
							'createTime',
							getLocalTime(value.createTime));
						template = template
						.replace(
							'departTitle',
							value.departTitle);
						template = template
						.replace(
							'arriveTitle',
							value.arriveTitle);

						if (value.url) {
							template = template
							.replace(
								'detailUrl',
								value.url);
						} else {
							template = template
							.replace(
								'data-url="detailUrl',
								'');
						}

						$(value.target).append(
							template);
						$('[data-url]').off('click')
						.on('click',function() {
							location.href = $(this).data('url');
						});
					});
			}
		}
	</script>
</body>
</html>
