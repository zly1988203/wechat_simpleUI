<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>行程</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/coach/fy-datepicker.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/coach/schedule.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/my/my-ticket.css?v=${version!}" rel="stylesheet" type="text/css">
    <!-- start Dplus --><script src="/js/udplus.js?v=${version!}"></script><!-- end Dplus -->
</head>
<body>
    <header>
        <ul class="ola-date" >
            <li class="ola-prev" id="preDay"><span>前一天</span></li>
            <!--<li class="ola-current"><label for="startTime"><span><i>2017年12月17日</i><input type="text" id="startTime" data-date="" readonly /></span></label></li>
           -->
             <li class="ola-current" ><label for="startTime"><span><i>2015-06-16</i><input type="text" id="startTime" data-date=""  readonly unselectable="on" onfocus="this.blur()" /></span></label></li>
            <li class="ola-next" id="nextDay"><span>后一天</span></li>
        </ul>
    </header>
    <div class="main">
        <!--无行程页面-->
        <div class="no-schedule-container"  style="display: none">
            <div class="no-schedule-icon"></div>
            <div class="no-schedule-tips">当前日期没有行程</div>
            <div class="btn-group"><div class="btn primary">去购票</div></div>
        </div>
		<div id="ticketList" style="display: none">
			 <li class="ola-ticket-item border-dotted-b border-shadow" data-href="#">
                     <div class="left-line-li custom-line-bgc"></div>
                     <div class="ticket-checking-info">
                         <div class="checking-item">
                             seatNo
                             <div class="checking-code">验票码<span>ticketCode</span></div>
                         </div>
                         comment
                     </div>
                     	<!-- 状态图标-- success：已验票，refund：已退票，wait：待乘车, out：已过期， -->
                     <div class="icon-ticket-state">
                         templateShowOperation
                     </div>
             </li>
		</div>
        <!--有行程页面-->
        <ul class="ola-list-box" id="tripList">
            <li class="schedule-item" id="busList" style="display: none;">
                <div class="schedule-name custom-line custom-line-bgc">${basicConfig.busTxt!'定制班线'}</div>
                <div class="lineItem custom-line to-from-work">
                    <div class="ticket-info border-dotted-b border-shadow">
                        <div class="left-line custom-line-bgc"></div>
                        <div class="row">
                            <span class="time">departTime</span>
                           	carNo
                           	<span class="icon-list icon-img" onclick="toOrderDetail"></span>
                            <span class="icon-view-map icon-img" onclick="showStation"></span>
                            <span class="icon-phone icon-img" onclick="contactMobile"></span>
                        </div>
                        <div class="station">
                            <div class="start">departTitle</div>
                            <div class="end">arriveTitle</div>
                        </div>
                    </div>
                    <ul class="ola-ticket">
                        ticketList 
                        <#if marketImg?exists>
                        <!-- 品牌支持 -->
                        <li class="ola-ticket-item border-shadow brand">
                            <img class="brand-logo" src="${marketImg.tripBrandImg!}" />
                            <div class="brand-content">${marketImg.tripBrandTxt!}</div>
                        </li>
                        </#if>
                    </ul>
                </div>
            </li>
            
             <li class="schedule-item" id="travelList" style="display: none;">
                <div class="schedule-name custom-line introduce-line-bgc">${basicConfig.travelTxt!'旅游班线'}</div>
                <div class="lineItem custom-line to-from-work">
                    <div class="ticket-info border-dotted-b border-shadow">
                        <div class="left-line custom-line-bgc"></div>
                        <div class="row">
                            <span class="time">departTime</span>
                           	carNo
                           	<span class="icon-list icon-img" onclick="toOrderDetail"></span>
                            <span class="icon-view-map icon-img" onclick="showStation"></span>
                            <span class="icon-phone icon-img" onclick="contactMobile"></span>
                        </div>
                        <div class="station">
                            <div class="start">departTitle</div>
                            <div class="end">arriveTitle</div>
                        </div>
                    </div>
                    <ul class="ola-ticket">
                        ticketList 
                        <#if marketImg?exists>
                        <!-- 品牌支持 -->
                        <li class="ola-ticket-item border-shadow brand">
                            <img class="brand-logo" src="${marketImg.tripBrandImg!}" />
                            <div class="brand-content">${marketImg.tripBrandTxt!}</div>
                        </li>
                        </#if>
                    </ul>
                </div>
            </li>
            

            <li class="schedule-item" id="commuteList" style="display: none;">
                <div class="schedule-name to-from-work-bgc">${basicConfig.commuteTxt!'上下班'}</div>
                <div class="lineItem custom-line to-from-work">
                    <div class="ticket-info border-dotted-b border-shadow">
                        <div class="left-line to-from-work-bgc"></div>
                        <div class="row">
                            <span class="time">departTime</span>
                            carNo
                            <span class="icon-list icon-img" onclick="toOrderDetail"></span>
                            <span class="icon-view-map icon-img" onclick="showStation"></span>
                            <span class="icon-phone icon-img" onclick="contactMobile"></span>
                        </div>
                        <div class="station">
                            <div class="start">departTitle</div>
                            <div class="end">arriveTitle</div>
                        </div>
                    </div>
                    <ul class="ola-ticket">
                        ticketList
                        <#if marketImg?exists>
                        <!-- 品牌支持 -->
                        <li class="ola-ticket-item border-shadow brand">
                            <img class="brand-logo" src="${marketImg.tripBrandImg!}" />
                            <div class="brand-content">${marketImg.tripBrandTxt!}</div>
                        </li>
                        </#if>
                    </ul>
                </div>
            </li>

           

            <li class="schedule-item" id="busTicketList" style="display: none;">
                <div class="schedule-name coach-ticket-bgc">${basicConfig.busTicketTxt!'汽车票'}</div>
                <div class="lineItem coach-ticket">
                    <div class="ticket-info border-dotted-b border-shadow">
                        <div class="left-line coach-ticket-bgc"></div>
                        <div class="row">
                            <span class="time">departTime</span>
                            <span class="licence">carNo</span>
                            <span class="icon-list icon-img" onclick="toOrderDetail"></span>
                            <span class="icon-phone icon-img" onclick="contactMobile"></span>
                        </div>
                        <div class="station">
                            <div class="start">departTitle</div>
                            <div class="end">arriveTitle</div>
                        </div>
                    </div>
                    <ul class="ola-ticket">
                        <li class="ola-ticket-item border-shadow" data-href="#">
                            <div class="left-line-li coach-ticket-bgc"></div>
                            <div class="ticket-checking-info">
                                <div class="checking-item">
                                    <div class="checking-tips">凭乘车人身份证到站点取票</div>
                                </div>
                            </div>
                        </li>
                        <#if marketImg?exists>
                        <!-- 品牌支持 -->
                        <li class="ola-ticket-item border-shadow brand">
                            <img class="brand-logo" src="${marketImg.tripBrandImg!}" />
                            <div class="brand-content">${marketImg.tripBrandTxt!}</div>
                        </li>
                        </#if>
                    </ul>
                </div>
            </li>
            
             <li class="schedule-item" id="innerCityList" style="display: none;">
                <div class="schedule-name  intercity-renting-bgc">${basicConfig.interCityTxt!'城际约租车'}</div>
                <div class="lineItem intercity-renting">
                    <div class="ticket-info border-shadow">
                        <div class="left-line intercity-renting-bgc"></div>
                        <div class="row">
                            <span class="time">departTime</span>
                            <span class="licence">carNo</span>
							<span class="icon-list icon-img" onclick="innerCityDetail"></span> 
							<span class="icon-phone icon-img" onclick="contactMobile"></span>
                           
                        </div>
                        <div class="station">
                            <div class="start">departTitle</div>
                            <div class="end">arriveTitle</div>
                        </div>
                    </div>
                    <#if marketImg?exists>
                    <ul class="ola-ticket">
                        <!-- 品牌支持 -->
                        <li class="ola-ticket-item border-shadow brand">
                            <img class="brand-logo" src="${marketImg.tripBrandImg!}" />
                            <div class="brand-content">${marketImg.tripBrandTxt!}</div>
                        </li>
                    </ul>
                    </#if>
                </div>
            </li>
        </ul>

        <!-- 选择日期 -->
        <div id="select-date" class="sui-popup-container" data-trigger="">
            <div class="sui-popup-mask"></div>
            <div class="sui-popup-modal">
                <div class="date"></div>
            </div>
        </div>
    </div>
<script src="/js/commonBus.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/coach/fy-datePicker.min.js?v=${version!}"></script>
<script src="/js/date.js?v=${version!}"></script>
<script>
var providerDomin = document.domain.split('.')[0];
dplus.track("浏览行程页",{
	"车企":providerDomin,
	"页面名称":"行程页",
	"页面URL":window.location.href
});

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
    $(function () {
        //初始化行程默认日期
        initStartDate();

        selectDate();
        initList();
        
        $('.primary').on('click',function(){//城际约租车订单详情
			var index='/index'
			window.location = index;
		});
        backtoUrl('/index'); 
        
    });

    /*
     *前一天后一天按钮切换日期
     * */
    function preDay(cd){
        $('#preDay').on('click',function(){
            var _preDay = (new Date(cd).getDate()) - 1;
            var _nextDay = (new Date(cd).getDate()) + 1;
            console.log(_preDay+ ":" + _nextDay)
            initList();
        });
    }

    /*
    初始化行程默认日期
    */
    function initStartDate(){
        var _startTime = $('#startTime');
        _startTime.val('${startTime}')
        console.info("------====="+'${startTime}');
        $('#startTime').val('${startTime}').siblings('i').text('${startTime}');
       /*  var initDate = new Date();
        console.info("=====121==="+_startTime);
        
        _startTime.val(initDate.getFullYear() + '-' + (initDate.getMonth()+1) + '-' + initDate.getDate()); */
        reSetWidth(_startTime);

        //前一天点击事件
        $('#preDay').on('click',function(){
        	var dateStr = dateStrAddDay(_startTime.val(),-1)
            _startTime.val(dateStr);
        	_startTime.val(dateStr).siblings('i').text(dateStr);
            $("#select-date td").attr("data-confirm","false");
            $("#select-date td").removeClass("active");
            initList();
        });
        //后一天点击事件
        $('#nextDay').on('click',function(){
        	var dateStr = dateStrAddDay(_startTime.val(),1)
            _startTime.val(dateStr);
        	_startTime.val(dateStr).siblings('i').text(dateStr);
            $("#select-date td").attr("data-confirm","false");
            $("#select-date td").removeClass("active");
            initList();
        });
        

    }
    
    /*
    * 选择日期
    * */
    function selectDate() {
        var trigger = $('#startTime'),
            parent = $('#select-date');
        var initDateStatus = false;
		var tripData = getTripData();
		var months=dateStrAddMonths(trigger.val());
		//console.info(tripData.trip);
        var init = function () {
            //只初始化一次
            if(!initDateStatus) {
                initDateStatus = true;
                parent.find('.date').datePicker({
                    dateBase: months,
                    weekend: false,
                    multiple: false,
                    gather: tripData.trip,
                    after:[-3,3],
                    selectCallback: function (data) {
                        //TODO
                        parent.closePopup(function () {
                            var d = data.selectData[0].date;
                            var val = d.year + '-' + d.month + '-' + d.day ;//+ d.week;

                            //是否是今天
                           /*  var today = new Date();
                            if(today.getFullYear() == d.year && today.getMonth() + 1 == d.month && today.getDate() == d.day) {
                                val += '(今天)';
                            } */

                            trigger.val(val).siblings('i').text(val);
                            //console.log(val)
                            initList();
                        });
                    }
                });
            }
        };

        //弹出层
        trigger.parent().on('click', function () {
            var self = $(this);
            parent.popup('pull', init);
        });
    }

    //监听文字变化，重设宽度
    function reSetWidth(o) {
        var _html = $('<div>' + o.val() + '</div>');
        _html.css({
            position: 'absolute',
            top: '-9999px',
            zIndex: -9999,
            paddingLeft: o.css('padding-left'),
            paddingRight: o.css('padding-right'),
            fontSize: o.css('font-size'),
            fontWeight: o.css('font-weight'),
            fontFamily: o.css('font-family')
        });
        o.after(_html);

        var w = (_html.width() + 10) / parseFloat($('html').css('font-size')) + 'rem'
        o.width(w);

        _html.remove();
    }

     //创建随机数据
    function createData(monthDrr) {
        var result = [];

        monthDrr.forEach(function (item, index) {
            var _n = 0,
                _MAX = new Date(2017, item, 0).getDate();

            var arr = [];
            //创建数组
            for(var i = 0; i < _MAX; i++) {
                _n = parseInt(Math.random().toFixed(2) * 10) + i + index;

                if(_n <= _MAX) {
                    arr.push(_n);
                }
            }

            //去重
            for(var n = 0; n < arr.length; n++) {
                for(var m = 0; m < arr.length; m++) {
                    if(arr[n] == arr[m]) {
                        arr.splice(m, 1);
                    }
                }
            }

            //排序
            arr.sort(function () {
                return -1;
            });

            //填充数据
            for(var l = 0; l < arr.length; l++) {
                var _result = {
                    date: '2017-' + item + '-' + arr[l],
                    state: 'select'
                };

                if(parseInt(2 * Math.random())) {
                    _result.comment = '备注';
                }

                /*switch(parseInt(4 * Math.random()) + 1) {
                    case 1:
                        _result.state = 'select';
                        break;
                    case 2:
                        _result.state = 'readonly';
                        break;
                    case 3:
                        _result.state = 'disabled';
                        break;
                }*/
                _result.state = 'select';
                result.push(_result);
            }
        });

        return result;
    } 
    
    function initList(){
    	 var orderNoList = [];
    	 var urlStr = "/trip/tripListByDate";
    	 var startTime=$('#startTime').val();
    	// console.info("111----------"+startTime);
         var dataObj = {
         		date:startTime,
				};
				//merge page param and common param,generate request param
				dataObj = genReqData(urlStr, dataObj);
				var data = {};
				var status = 0;
        $.post(urlStr,dataObj,function(data){
        	$(".trips").remove();
         	busList = data.data.busList; //定制班线
         	travelList = data.data.travelList; //旅游班线
         	commuteList=data.data.commuteList;  //上下班
         	innerCityList=data.data.innerCityList;  //城际约租车
         	busTicketList=data.data.busTicketList;  //汽车票
         	if(busList=='' && travelList=='' && commuteList=='' && innerCityList=='' && busTicketList==''){
         		$(".no-schedule-container").css("display","block");
         	}else{
         		$(".no-schedule-container").css("display","none");
         		tripList(busList,4);
         		tripList(travelList,9);
             	tripList(commuteList,7);
             	tripList(busTicketList,6);
             	tripList(innerCityList,2);
             	showTicketCode();
         	}
         },'json');
    }
	
    function tripList(busList,type){
    	var orderList=$("#tripList");
    	$.each(busList,function(index,value){
   			var busListHtml=$("#busList").html();
        	var showStation='';
        	var toOrderDetail = '';
        	var contactMobile=value.contactMobile;
        	var contactMobileClick="contactMobileClick('"+contactMobile+"',"+type+",'"+value.orderNo+"')";
    		if(type==2){
    			busListHtml=$("#innerCityList").html();
    			contactMobile=value.driverMobile;
    			var canCallDriverFlag = value.callDriverTime;
    			console.info("-----------"+canCallDriverFlag);
    		    if(canCallDriverFlag==0){
    		    	busListHtml=busListHtml.replace('icon-phone icon-img',"icon-phone icon-img icon-phone-disable");
    		    	contactMobileClick="innerCityClick('"+value.orderNo+"')";
    			}else{
    				busListHtml=busListHtml.replace('icon-phone icon-img',"icon-phone icon-img");
    				contactMobileClick="contactMobileClick('"+contactMobile+"',"+type+",'"+value.orderNo+"')";
    			}
    			
    		}else if(type==9){
     			busListHtml=$("#travelList").html();
     			showStation="onclickStation('"+value.orderNo+"',"+type+")";
     			toOrderDetail = "onclickDetail('"+value.orderNo+"',"+type+")";
     		}else if(type==7){
     			busListHtml=$("#commuteList").html();
     			showStation="onclickStation('"+value.orderNo+"',"+type+")";
     			toOrderDetail = "onclickDetail('"+value.orderNo+"',"+type+")";
     		}else if(type==4){
     			busListHtml=$("#busList").html();
     			showStation="onclickStation('"+value.orderNo+"',"+type+")";
     			toOrderDetail = "onclickDetail('"+value.orderNo+"',"+type+")";
     		}else if(type==6){
     			busListHtml=$("#busTicketList").html();
     			toOrderDetail = "onclickDetail('"+value.orderNo+"',"+type+")";
     		}
       		var ticketContent=parseTicketItem(value.ticketInfoList,value);
       		var carNo = $.trim(value.carNo);
       		if(carNo.length <= 0){
       			carNohtml='<span class="licence" style="display:none;"></span>';
   			}else{
   				if(type==2 && value.driverName!=''){
   					carNo=value.driverName+"-"+carNo
   				}
   				carNohtml='<span class="licence">' + carNo + '</span>';
   			}
       		
       		busListHtml=busListHtml.replace('contactMobile',contactMobileClick);
       		busListHtml=busListHtml.replace('innerCityDetail',"innerCityDetailClick('"+value.orderNo+"')");
       		busListHtml=busListHtml.replace('carNo',carNohtml);
       		busListHtml=busListHtml.replace('departTime',getTripListOrderDate(value.departTime));
       		busListHtml=busListHtml.replace('ticketList',ticketContent);
       		busListHtml=busListHtml.replace('departTitle',value.departTitle);
       		busListHtml=busListHtml.replace('arriveTitle',value.arriveTitle);
       		busListHtml=busListHtml.replace('showStation',showStation);
       		busListHtml=busListHtml.replace('toOrderDetail',toOrderDetail);
       		busListHtml='<li  class="schedule-item trips">'+busListHtml+"</li>";
       		orderList.append(busListHtml);	
       		
       		$('.toComment').off('click').on('click',function(){//立即评价
       			dplus.track("行程-评价服务",{
  	    			"车企":providerDomin,
  	    			"业务":"定制班线/通勤班线",
  	    			"页面名称":"行程页",
  	    		});
			var ticketId = $(this).attr('id');
				window.location = '/comment/toComment?ticketId=' + ticketId;
			});
			$('.commentDetail').off('click').on('click',function(){//评价详情
				dplus.track("行程-查看评价",{
  	    			"车企":providerDomin,
  	    			"业务":"定制班线/通勤班线",
  	    			"页面名称":"行程页",
  	    		});
				var ticketId = $(this).attr('id');
				window.location = '/comment/toCommentDetail?ticketId=' + ticketId;
			});
        });
    }
    function onclickStation(orderNo,type){
    	var startTime = $('#startTime').val();
  		var showStationsHref='';
    	if(type==4){
    		dplus.track("行程-查看车辆定位",{
  	    			"车企":providerDomin,
  	    			"业务":"定制班线",
  	    			"页面名称":"行程页",
  	    		});
    		showStationsHref = '/busline/busOrder/toOrderDetailMap?orderNo='+orderNo+'&token='+$.cookie('token');
    	}else if(type==7){
    		dplus.track("行程-查看车辆定位",{
  	    			"车企":providerDomin,
  	    			"业务":"通勤班线",
  	    			"页面名称":"行程页",
  	    		});
    		showStationsHref = '/commute/commuteOrder/toOrderDetailMap?orderNo=' + orderNo + '&departDate=' + startTime + '&token='+$.cookie('token');
    	}else if(type==9){
    		dplus.track("行程-查看车辆定位",{
  	    			"车企":providerDomin,
  	    			"业务":"旅游班线",
  	    			"页面名称":"行程页",
  	    		});
    		showStationsHref = '/busline/busOrder/toOrderDetailMap?orderNo=' + orderNo + '&departDate=' + startTime + '&token='+$.cookie('token');
    	}
    	window.location = showStationsHref;
    }
    
    function onclickDetail(orderNo,type){
  		var detailHref='';
    	if(type==4){
    		detailHref = '/bus/toBusOrderDetail?orderNo='+orderNo+'&tripDate='+$('#startTime').val();
    	}else if(type==7){
    		detailHref = '/bus/toCommuteOrderDetail?orderNo=' + orderNo+'&tripDate='+$('#startTime').val();
    	}else if(type == 6){
    		detailHref = '/busTicketOrder/toOrderDetail?orderNo='+orderNo+'&tripDate='+$('#startTime').val();
    	}else if(type == 9){
    		detailHref = '/bus/toBusOrderDetail?orderNo='+orderNo+'&tripDate='+$('#startTime').val();
    	}
    	window.location = detailHref;
    }
    
    function innerCityDetailClick(orderNo){
    	//城际约租车订单详情
		var innerCityDetail='/innerCity/order/toOrderDetail?orderNo='+orderNo
		window.location = innerCityDetail;
		
    }
    
    function contactMobileClick(phone,type,orderNo){
    	if(phone!=undefined && phone!=0){
   			if(type==2){
   	   			callDriver(orderNo);
   	    	}else{
   	    		if(type==4){
   	    			dplus.track("行程-拨打电话",{
   	   	    			"车企":providerDomin,
   	   	    			"业务":"定制班线",
   	   	    			"页面名称":"行程页",
   	   	    		});
   	    		}else if(type==7){
   	    			dplus.track("行程-拨打电话",{
   	   	    			"车企":providerDomin,
   	   	    			"业务":"通勤班线",
   	   	    			"页面名称":"行程页",
   	   	    		});
   	    		}else if(type==9){
   	    			dplus.track("行程-拨打电话",{
   	   	    			"车企":providerDomin,
   	   	    			"业务":"旅游班线",
   	   	    			"页面名称":"行程页",
   	   	    		});
   	    		}
   				window.location.href = 'tel:'+phone;  
   		    }
    	}else{
    		if(type==2){
    			$.toast("正在安排接送司机，请稍后");
    		}
    	}
    	
    }
    function innerCityClick(orderNo){
    	$.confirm('订单已结束多时，如需联系司机 ，可联系客服帮忙', '提示',['取消', '联系客服'], function() {
			var urlDetail = SERVER_URL_PREFIX + '/Config/commonConfig';
       		var dataDetail = {
       			orderNo: orderNo
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
    }
    function call(orderNo){
        var urlDetail = SERVER_URL_PREFIX + '/Call/callDriver';
       	var dataDetail = {
       		orderNo: orderNo
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
         	    	/* 	$("#callTel").removeClass();
						$("#callTel").addClass("call-tel call-tel-disabled"); */
						innerCityClick(orderNo);
					}
       	        }
       	   }
       	}); 
	}
    /**
     *处理订单里面的票务数组 
     */
    function parseTicketItem(ticketArray,order){
    	var ticketListHtml="";
    	if(order.orderType == 2){ //城际约租车
    		//ticketListHtml = EachCommuteArray(ticketArray,order,commentStatus);
    	}else{
    		ticketListHtml = EachArray(ticketArray,order,order.orderType);
    	}
    	return ticketListHtml;
    	
    }
    //车票列表
    function EachArray(ticketArray,order,orderType){
		var ticketListHtml = '';
		$.each(ticketArray,function(index, value) {
			
			var ticketItemTemplate=$("#ticketList").html();
			if(orderType==7){
				ticketItemTemplate = ticketItemTemplate.replace('custom-line-bgc','to-from-work-bgc');
			}
			var dateHtml ='';
			if(value.seatNo!='' && value.seatNo!=undefined){
				dateHtml = '<div class="seat-number">座位号<span>'+value.seatNo+'</span></div>';
			}
			ticketItemTemplate = ticketItemTemplate.replace('seatNo',dateHtml);
        	ticketItemTemplate = ticketItemTemplate.replace('ticketCode',value.verifyCode);

        	//评价按钮
        	//评价按钮
        	console.info("是否开启评价"+order.isComment);
        	console.info("车企id"+order.providerId);
			var commentFlag = 0;//表示没有按钮
			var commentHtml = '<div class="evaluate" style="display:none;"><button></button></div>';
			if(order.isComment == 1){//表示启用
				if(value.commentStatus == 0 && value.status == 4){
					commentFlag = 1;//立即评价
					commentHtml = '<button class="toComment" id="' + value.id + '">评价服务</button>';
				}else if(value.commentStatus == 1){
					commentFlag = 2;//查看评价
					commentHtml = '<button class="commentDetail" id="' + value.id + '">查看评价</button>';
				}
			}
			ticketItemTemplate = ticketItemTemplate.replace('comment',commentHtml);
        	
        	//车票循环
        	/* if(order.orderType == 4){
        		value.departDate = new Date(value.departDate).Format("yyyy-MM-dd");
        	} */
        	value.departDate = new Date(value.departDate).Format("yyyy-MM-dd");
        	var showTicketTemplate='<button class="showTicket" commentFlag="' + commentFlag + '" ticketId="'+value.id+'" data-name='+value.departDate+' ticketStatus="statusTemplate" quickCheckFlag="quickCheckTemplate">出示车票</button>';
        	//console.info("======"+value.departDate);
        	var successTicketTemplate='<span class="state-icon success"></span>';//已验票
        	var returnTicketTemplate='<span class="state-icon refund"></span>';//已退票
        	var waitCarTicketTemplate='<span class="state-icon wait"></span>';//带乘车
        	var outCarTicketTemplate='<span class="state-icon out"></span>';//已过期
        	
        	if(order.ifQuickCheck==1 || order.orderType == 7){
        		showTicketTemplate=showTicketTemplate.replace('quickCheckTemplate','1');
        	}else{
        		showTicketTemplate=showTicketTemplate.replace('quickCheckTemplate','0');
        	}
        	
        
        	if(order.ifQuickCheck==1  || order.orderType == 7){
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
	        	}else{
	        		ticketItemTemplate=ticketItemTemplate.replace('templateShowOperation',"");
	        	}
        	}else{
        		if(value.status==1){
	        		ticketItemTemplate=ticketItemTemplate.replace('templateShowOperation',waitCarTicketTemplate);
	        	}else if(value.status==2){
	        		ticketItemTemplate=ticketItemTemplate.replace('templateShowOperation',returnTicketTemplate);
	        	}else if(value.status==4){
	        		ticketItemTemplate=ticketItemTemplate.replace('templateShowOperation',successTicketTemplate);
	        	}else{
	        		ticketItemTemplate=ticketItemTemplate.replace('templateShowOperation',"");
	        	}
        	}
			ticketListHtml+=ticketItemTemplate;
		});
		return ticketListHtml;
	}

  //解锁车票
    function handleTicket(el, count, callback) {
            /*
            * 创建图层
            * */
            var _html = '<div class="deblocking">' +
                    '<div class="main">' +
                        '<div class="progress"><span class="bar"></span></div>' +
                        '<div class="content">' +
                            '<h4>长按图案' + count + '秒验票</h4>' +
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
	   function showTicketCode(){
	   		$('.showTicket').off('click').on('click', function () {
	   			dplus.track("行程-出示车票",{
  	    			"车企":providerDomin,
  	    			"业务":"定制班线/通勤班线",
  	    			"页面名称":"行程页",
  	    		});
	   			
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
	               handleTicket($(this), 1, function () {
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
	   }
	function getTripListOrderDate(timestamp) {     
		var d = new Date(timestamp);
		var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
		var min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
		return hour + ':' + min;
	}
  
	var scheduleInfos = '${tripDateList}';
    var tripDateList= JSON.parse(scheduleInfos);
	function getTripData(){
	   	var result = {};
		var trips = [];
		var months = [];
		$.each(tripDateList,function (index,cell){
			var trip = {};
	
			trip['date'] = getDate(cell['departTimeStr']);
			trip['comment'] = '有行程';
			trip['state'] = 'select';
			
			trips.push(trip);
			
			var m = getMonth(cell['departTimeStr']);
			if($.inArray(m, months)==-1){
				months.push(m);
			}
		});
		
		result.trip = trips;
		result.monthNum = months.length - 1;
		//console.log(JSON.stringify(result));
		return result;
	}
	
   function getMonth(timestamp) {     
		var d = new Date(timestamp);
		var month = d.getMonth() + 1;
		return month;
	}
   function getDate(timestamp) {     
			var d = new Date(timestamp);
			var month = d.getMonth() + 1;
			var date = d.getDate();
			return d.getFullYear() + '-' + month + '-' + date;
		}

</script>
</body>
</html>