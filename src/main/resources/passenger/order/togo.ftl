<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>订单详情</title>
<script type="text/javascript" src="/js/commonJs.js"></script>

<script>
	$(function(){
	  $.showLoading('正在为您跳转 ');
		
	  var urlDetail = SERVER_URL_PREFIX + '/Order/queryUnFinishOrderOrTrip';
	  var dataDetail = {};
	  dataDetail = genReqData(urlDetail, dataDetail);
	  $.ajax({
	     type: 'POST',
	     url: urlDetail,
	     data: dataDetail,
	     dataType:  'json',
	     success: function(data){
	    	 $.hideLoading();
	        if (data.data.orderStatus == 0) { //行程已经结束，用户点击跳转到首页，后面复用取消订单的详情页
	        	
	        } else {
	            var goToResult = data.data.goToResult;
	            if (goToResult) {
	            	window.location.href = CURRENT_SERVER + goToResult.url;
	            } else { //跳转匹配失败
	              $.toastError("行程出错啦");
	            }
	        }
	    }
	})
</script>
</head>
<body>
	  <#include "../foot.ftl"/>
</body>
</html>