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
    <link href="/res/style/base/vectors.2.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/coach/fy-datepicker.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/batch/refund-ticket.css?v=${version!''}" rel="stylesheet" type="text/css">
</head>

<body>
    <div class="ticket-info">
        <div class="row">
            <div class="time">${order.departTime!''}</div>
        </div>

        <div class="station">
            <div class="station-item"><h4>${order.departTitle!''}</h4></div>
            <div class="station-item"><h4>${order.arriveTitle!''}</h4></div>
        </div>
    </div>

    <div class="head-title">已选择<em>0</em>天车票</div>

    <div class="ticket-date"></div>
    
    <div class="btn-group">
        <div class="btn default" id="back">返回</div>
        <div class="btn readonly" id="submit">下一步</div>
    </div>
    
    <script type="text/javascript" src="/js/commonJs.js?v=${version!''}"></script>
    <script src="/js/zepto.min.js"></script>    
    <script src="/js/simpleui.min.js"></script>
    <script src="/js/vectors.min.js"></script>
    <script src="/js/coach/fy-datePicker.min.js"></script>
    <script src="/js/common.js"></script>
    <script src="/js/date.js"></script>
    <script>
    	backtoUrl('/bus/toCommuteOrderDetail?orderNo=${orderNo!''}');
    	var ticketList = '${order.ticketList!""}'||'[]';
  		var ticketListJson = JSON.parse(ticketList);
  		var ticketNo=[];
        $(function () {
            //存储选中的日期
            var ticket = null;
			var ticketData = createData();
			console.log(ticketData.resultArray);
            $('.ticket-date').datePicker({
                dateBase: '${order.dateStr!''}',
                weekend: true,
                multiple: true,
                before:true,
                after:ticketData.monthNum,
                gather: ticketData.resultArray,
                selectCallback: function (data) {
                    //TODO
                    ticketNo=[];//先清空
                    
                    var title = $('.head-title');
                    var selectData = ticket = data.selectData;
                    $.each(selectData,function (index,cell){
                    	var serialNo = getSerialNo(cell['date']);
                		ticketNo.push(serialNo);
                	});
                    //计数
                    title.find('em').text(selectData.length);

                    //下一步样式
                    if(selectData.length > 0) {
                        $('#submit').removeClass('readonly').addClass('primary');
                    } else {
                        $('#submit').addClass('readonly').removeClass('primary');
                    }
                }
            });

			function getSerialNo(selectDate){
				var serialNo = '';
	  			for(var i=0; i<ticketListJson.length; i++){
	  				var date = getDate(ticketListJson[i]['departDateDesc']);
	  				var selectDate1 = selectDate.year+'-'+selectDate.month+'-'+selectDate.day;
	  				if(selectDate1==date){
	  					serialNo = ticketListJson[i]['ticketSerialNo'];
	  					break;
	  				}
	  			}
	  			return serialNo;
	  		}
  		
			function createData(){
	  			var result = {};
	  			var resultArray = []
	  			var months = [];
	  			var monthNum = 0;
	  			$.each(ticketListJson,function (index,cell){
	  				var _result = {};
	  				
	  				_result['date'] = getDate(cell['departDateDesc']);
	  				_result['state'] = 'readonly';
	  				
	  				if(cell['status'] == 1){
	  					_result['comment'] = '待乘车';
	  					_result['state'] = 'select';
	  				}
	  				if(cell['status'] == 2){
	  					_result['comment'] = '已退票';
	  					_result['state'] = 'readonly';
	  				}
	  				if(cell['status'] == 4){
	  					_result['comment'] = '已验票';
	  					_result['state'] = 'readonly';
	  				}
	  				if(cell['status'] == 7){
	  					_result['comment'] = '待乘车';
	  					_result['state'] = 'readonly';
	  				}
					
	  				resultArray.push(_result);
	  				
	  				var months = getMonths('${order.dateStr!''}' , cell['departDateDesc']);
	  				if(monthNum<months){
	  					monthNum = months;
	  				}
	  				
	      		});
	  			result.resultArray = resultArray;
	  			result.monthNum = monthNum;
	  			//console.log(JSON.stringify(result));
	  			return result;
	  		}
	  		
	  		function getDate(timestamp) {     
	  			var d = new Date(timestamp);
	  			var month = d.getMonth() + 1;
	  			var date = d.getDate();
	  			return d.getFullYear() + '-' + month + '-' + date;
	  		}
	  		
	  		function getMonth(timestamp) {     
	  			var d = new Date(timestamp);
	  			var month = d.getMonth() + 1;
	  			return month;
	  		}
	  		
	  		$('#back').on('click',function(){
	  			window.location.href='/bus/toCommuteOrderDetail?orderNo=${orderNo!''}';
	  		})
           //下一步
            $('#submit').on('click', function () {
                //TODO
                if(ticketNo.length<=0){
                	return;
                }
				
				//ajax请求判断是否已过退票时间或是否已验票
				$.ajax({
		   	        type: 'POST',
		   	        url: '/commute/checkRefundTicket',
		   	        data: {serialNos:ticketNo.join(',')},
		   	        dataType:  'json',
		   	        success: function(data){
		   	        	if(data.code ==0){
		   	        		postPage("/commute/toRefundDetail",[{name:'serialNos',value:ticketNo.join(',')}]);
		   	        	}else{
		   	        		$.dialog({
			                    title: '',
			                    text: data.message,
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
			                                window.location.href = 'tel:${order.tel}';
			                            }
			                        }
			                    ]
			                });
		   	        	}
		   	        }
		   		});
            });
        });

    </script>
</body>
</html>