backtoUrl('/busTicketIndex');
	var presellDay = $('#presellDay').val();
	
	var departStations =[];
  	var departStationId = $('#departStation').val();
  	departStations.push(departStationId);
  	
	var arriveStations = [];
  	var arriveStationId = $('#arriveStation').val();
  	arriveStations.push(arriveStationId);
	
	var selectTimes = [];
	var departDate = $('#departDate').val();//选中的日期
	var selectTimes = [];
	selectTimes.push('不限');

    var departPid = $('#departPid').val();
    var arrivePid = $('#arrivePid').val();
	
	var currentDateStr = $('#currentDateStr').val();//当前时间/默认时间？？
	var currentDate = dateStrToDate(currentDateStr);
    var now = new Date();//今天
    var nowStr = myFormatDate(now); //今天

    var departAreaName = $('#departAreaName').val();
    var arriveAreaName = $('#arriveAreaName').val();

// 后台数据： ticketInfoList:日期车票信息；date:日期;saleState:车票状态 0-有票，1-售罄，-1-未排班;
var allTicketInfoList = [];
//需要显示在上方的日历天数
var navbarInfoSize = $('.ola-date').data('size');
//需要显示在上方的日历数据
var navbarInfoList = [];
var dateScroll = null;
var nowBuyFlag = false;//今天所有线路可售标记 用于反写今天的nav车票信息为售罄还是有票
var refreshFlag = false;//需要刷新标记
var navSuccessFlag = false;//日历请求成功标志
var lineSuccessFlag = false;//线路信息请求成功标志
var initFlag = true;//初次进入页面 不用重复请求线路信息
var sesslineList = [];

    $(function() {

        $('title').html(departAreaName + "." + departStationId + " - " +  arriveAreaName + "."  + arriveStationId);

        getCalenderList();
        selectDate();
        getLineList();
        //出发站点
        footHandle($('#selectStartStation'), $('#start-station'), function () {
            //TODO
            //选中项
            var station = [];

            $('[name=startStation]:checked').each(function (index, item) {
                station.push($(item).val());
            });
            departStations = station;
            console.log('出发站点', station);
            getLineList();
        });

        //到达站点
        footHandle($('#selectEndStation'), $('#end-station'), function () {
            //TODO
            //选中项
            var station = [];

            $('[name=endStation]:checked').each(function (index, item) {
                station.push($(item).val());
            });
			arriveStations = station;
            console.log('到达站点', station);
            getLineList();
        });

        //发车时间
        footHandle($('#selectStartTime'), $('#start-time'), function () {
            //TODO
            //选中项
            var startTime = [];

            $('[name=startTime]:checked').each(function (index, item) {
                startTime.push($(item).val());
            });
			selectTimes = startTime;
            console.log('发车时间', startTime);
            getLineList();
        });
        
        $('.primary').on('click',function(){
			window.location.href = '/busTicketIndex';
		});
        
        bindClick();


    });

    // 是否需要关闭loading
    function checkHideLoading(){
        if(navSuccessFlag && lineSuccessFlag){
            $.hideLoading();
        }
    }


    function getCalenderList() {
        $.showLoading();
        //请求生成日历
        var calendarUrl = SERVER_URL_PREFIX + '/busTicket/calendarList';
        var dataObj = {
            requestUrl: subLocationHref(),
            departPid: departPid,
            arrivePid: arrivePid,
            departStation: departStationId,
            arriveStation: arriveStationId,
            departDate: departDate
        };
        dataObj = genReqData(calendarUrl, dataObj);
        $.ajax({
            type: 'post',
            data: dataObj,
            dataType:'json',
            url:calendarUrl,
            success: function (res) {
                if(res.code==0){
                    navSuccessFlag = true;
                    allTicketInfoList = res.data;
                    navbarInfoList = createNavbarData(departDate, allTicketInfoList, navbarInfoSize);
                    //显示日历并显示有票还是售罄
                    showNavbarInfo(navbarInfoList);
                    dateScroll = new IScroll('#wrapper', {
                        scrollX: true,
                        scrollY: false,
                        mouseWheel: true
                    });
                    //刚进入 不用请求线路数据
                    if(initFlag){
                        lineSuccessFlag = true;
                    }
                    checkHideLoading();
                }
            },
            error: function(){

            }
        });
    }

    /**初始化日期车票信息
    * @param dataList:车票信息列表
    * 默认为售罄 日期按照传入的参数填充
    */
    function showNavbarInfo(dataList){
    $('.ola-date').html('');//清空日历
    //1.日历填充
    var _html = '';
    for(var i=0; i<dataList.length; i++){
        //日期处理
        var dateTemp = strToDate(dataList[i].date);
        var className = "";//初始化时默认选中今天的class
        var todayFlag = false;//是否是今天
        if(switchWeeks(dateTemp) == '今天'){
            className = ' active';
            todayFlag = true;
        }

        var className2 = ''; //选中日期重新生成时，默认选中选中的日期
        //选中日期重新生成时，默认选中选中的日期
        if( isSameDate(departDate,dataList[i].date)){//等于选中日期的li为active
            if(!todayFlag){
                className2 = " active";
            }
        }

        var ticketInfo = '/';
        var ticketClass = ' ';
        if(dataList[i].saleState ===1 || dataList[i].saleState==='1'){
            ticketInfo = '有票';
            ticketClass = ' on-sale';
        }else if(dataList[i].saleState === 0 || dataList[i].saleState==='0'){
            ticketInfo = '售罄';
            ticketClass = ' sell-out';
        }else if(dataList[i].saleState === -1 || dataList[i].saleState==='-1'){
            ticketInfo = '/';//未排班
            ticketClass = ' not-start';
        }

        if(isSameDate(departDate,dataList[i].date)){
            if(nowBuyFlag){
                ticketInfo = '有票';
                ticketClass = ' on-sale';
            }
        }

        _html += '<li class="' + className + className2 +'" data-date=' + dataList[i].date + ' data-today='+ todayFlag +' todayflag='+ todayFlag +'>' +
            '<div class="weeks">' + switchWeeks(dateTemp) + '</div>' +
            '<div class="date">' + new Date(dateTemp).getDate() + '</div>' +
            '<div class="message ' + ticketClass + '">'+ ticketInfo +'</div>' +
            '</li>'
    }
    _html+='<li></li>';//解决最后一个显示不出来问题
    $('.ola-date').html(_html);

    //  清除今天的active
    if($('.ola-date li.active').length > 1){
        for(var i=0;i<$('.ola-date li.active').length;i++){
            $("[data-today='true']").removeClass('active');
        }
    }

    //绑定点击事件
    var date_event = isAndroid() ? 'tap' : 'click';
    $('.ola-date li').on(date_event, function () {
        console.log('日历点击事件触发')
            refreshFlag = false;//不需要刷新
            initFlag = false;//不是初次进入 需求请求线路数据
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            dateScroll.scrollToElement($(this)[0], 500, false, false, IScroll.utils.ease.circular);
            departDate = $(this).data('date');//缓存选中日期
            //TODO 请求数据
            getLineList();
    });
}

	function bindClick(){
		$('.line').off('click').on('click',function(){
			var busId = $(this).data('id');
            var priceParams = "";
            sesslineList.forEach(function (item,index) {
                if(busId == item.idStr){
                    priceParams = undefined != item.priceParams?item.priceParams:"[]";
                }
            })
			sessionStorage.setItem('priceParams',priceParams);
			window.location.href = '/busTicket/toAddOrder?busId='+busId+'&departPid='+ departPid +'&arrivePid='+ arrivePid +'&departStation='+ departStationId +'&arriveStation='+ arriveStationId +'&departDate='+departDate;
		});
		$('.disabled').unbind('click');
	}

	// 站点车票信息
	function getLineList(){
        $('#lineList').html('');
		$.showLoading();
   		$.ajax({
   	        type: 'POST',
   	        url: '/busTicket/getLineList',
   	        data: {departPid : departPid,
   	        		arrivePid : arrivePid,
   	        		departStations:departStations.join(','),
   	        		arriveStations:arriveStations.join(','),
   	        		selectTimes:selectTimes.join(','),
   	        		departDate:departDate},
   	        dataType:  'json',
   	        success: function(data){
   	            $.hideLoading();
   	            if(null == data)return;
                lineSuccessFlag = true;
   	        	var html = '';
                var lineList = data.data.lineList;
                if(lineList.length>0){
                	$('.empty-page').hide();
                    sesslineList = lineList;
                	for(var i=0;i<lineList.length;i++){
                	    var item = lineList[i];
                	    // item.priceParams = '[{"itemName": "成人票","price": 100,"itemType": 1,"certType": 1},{"itemName": "半价票","price": 50,"itemType": 2,"certType":0}]';
                		if(item.buyFlag == 0){
                			html += '<div class="item line disabled" data-id="'+item.idStr+'">';
                		}else{
                			html += '<div class="item line" data-id="'+item.idStr+'">';
                		}
                		html += '<div class="left">';
                		if(item.departDesc == '2'){
                            html +='<i class="warter-bus"></i>';
                        }else {
                            html +='<i class="not-warter-bus" style="background: none;"></i>';
                        }
                		html += '<h4>'+item.departTimeStr+'</h4>';
                		html += '</div>';
                		html += '<div class="middle">';
                        html += '<div class="station">';
                        html += '<div class="station-item">';
                        html += '<h4>'+item.departStation+'</h4>';
                        html += '</div>';
                        html += '<div class="station-item">';
                        html += '<h4>'+item.arriveStation+'</h4>'
                        html += '</div></div></div>';
                        html += '<div class="right">';
                        html += '<h2>'+item.sellPrice+'元</h2>';
                        if(item.buyFlag == 0){
                        	html += '<p>'+item.statusDesc+'</p>';
                        }else{
                        	html += '<p>'+item.seatRemain+'张</p>';
                        }
                        if(item.consumeTime != undefined & item.consumeTime != ''){
                        	html += '<p>约'+item.consumeTime+'小时</p>';
                        }
                        html += '</div></div>';
                	}
                }else{
                	$('.empty-page').show();
                }
                $('#lineList').html(html);
                bindClick();
                checkHideLoading();
   	        }
   		});
    }

    /*
    * 选择日期
    * */
    function selectDate() {
        var trigger = $('.all-date-btn'),
            parent = $('#select-date');
        var initDateStatus = false;

        var init = function () {
            //只初始化一次
            if(!initDateStatus) {
                initDateStatus = true;
                var timeData = createData();
                parent.find('.date').datePicker({
                    dateBase: currentDateStr,
                    weekend: true,
                    multiple: false,
                    switchMonth: switchMonth,
                    after:timeData.monthNum,
                    // gather: timeData.resultArray,
                    gather: createShowDate(allTicketInfoList, nowStr),//可选择的数据集合
                    selectCallback: function (data) {
                        //TODO
                        parent.closePopup(function () {
                            var d = data.selectData[0].date;
                            departDate = d.year + '-' + d.month + '-' + d.day;
							
                            parent.setPopupData(departDate);

                            refreshFlag = true;//需要刷新

                            //重新请求日历数据
                            getCalenderList();
                            //重新请求车票信息
                            getLineList();
                        });
                    }
                });
            }
        };

        //弹出层
        trigger.on('click', function () {
            var self = $(this);

            parent.popup('pull', init);
        });
    }

    //创建随机数据
    function createData() {
        var result = {};
		var resultArray = []
		var months = [];
		
		for(var i=0;i<presellDay;i++){
        	var dateStr = dateStrAddDay(currentDateStr,i);
        	var _result = {
                    date: dateStr,
                    state: 'select',
               };
        	resultArray.push(_result);
        	
        	var m = getMonth(dateStr);
			if($.inArray(m, months)==-1){
				months.push(m);
			}
        }
		
		result.resultArray = resultArray;
		result.monthNum = months.length -1;
		//console.log(JSON.stringify(result));
		return result;
    }
    
	function getMonth(timestamp) {     
		var d = new Date(timestamp);
		var month = d.getMonth() + 1;
		return month;
	}
    /*
    * 底部操作
    * */
    function footHandle(trigger, parent, submitCallback, openCallback) {
        var reset = parent.find('[data-handle=reset]'),
            submit = parent.find('[data-handle=submit]');
        var list = parent.find('.main li'),
            first = list.eq(0);

        var _myIScroll;

        var init = function () {
            var main = parent.find('.scroll-box');
            var MAX = list.height() * 5 / parseFloat($('html').css('font-size')) + 'rem';
            main.css('max-height', MAX);

            // 绑定滚动条
            var bindScroll = function() {
                if(_myIScroll) {
                    _myIScroll.destroy();
                }
                setTimeout(function() {
                    _myIScroll = new IScroll('#' + parent.attr('id') + ' .scroll-box', {
                        click: iScrollClick(),
                        scrollX: false,
                        scrollY: true,
                        mouseWheel: true
                    });
                }, 300);
            };
            bindScroll();
        };

        //兼容安卓
        function iScrollClick(){
            if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
            if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
            if (/Silk/i.test(navigator.userAgent)) return false;
            if (/Android/i.test(navigator.userAgent)) {
                var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
                return parseFloat(s[0]+s[3]) < 44 ? false : true
            }
        }

        //弹出层
        trigger.on('click', function () {
            parent.popup('plate', function () {
                //显示前触发函数
                if(openCallback instanceof Function) {
                    openCallback();
                }
            });

            if(!parent.data('init')) {
                parent.data('init', true);
                init();
            }
        });

        //选择站点
        list.on('click', function () {
            var self = $(this),
                ipt = self.find('input');

            if(!self.hasClass('active')) {
                self.addClass('active');
                ipt.prop('checked', true);

                if(ipt.val() == '不限') {
                    //选择不限：其他取消选中
                    first.addClass('active').find('input').prop('checked', true);
                    first.nextAll().removeClass('active').find('input').prop('checked', false);
                } else if(first.find('input:checked').length == 1) {
                    //选择其他项：如果不限已被选中，则取消不限
                    first.removeClass('active').find('input').prop('checked', false);
                }
            } else {
                self.removeClass('active');
                ipt.prop('checked', false);

                if(first.nextAll('.active').length == 0) {
                    //除不限以外，其他都取消选择
                    first.addClass('active').find('input').prop('checked', true);
                }
            }
        });

        //重置
        reset.on('click', function () {
            first.addClass('active').find('input').prop('checked', true);
            first.siblings().removeClass('active').find('input').prop('checked', false);
        });

        //确定
        submit.on('click', function () {
            //关闭弹出层
            parent.closePopup(function () {
                //关闭后触发函数
                if(submitCallback instanceof Function) {
                    submitCallback();
                }
            });
        });
    }

/***
 * 上一月 下一月点击事件
 * @param date
 * @param picker
 */
function switchMonth(date,picker) {
    $.showLoading('数据加载中');
    var urlStr = SERVER_URL_PREFIX+"/busTicket/calendarList";
    var dataObj = {
        requestUrl: subLocationHref(),
        departPid: departPid,
        arrivePid: arrivePid,
        departStation: departStationId,
        arriveStation: arriveStationId,
        departDate: date
    };
    dataObj = genReqData(urlStr, dataObj);
    var requestServer = function(){
        $.ajax({
            type: 'POST',
            data: dataObj,
            url: urlStr,
            dataType: 'json',
            success:function (res){
                allTicketInfoList = res.data;
                if (picker!=null) {
                    picker.reset({
                        gather: createShowDate(res.data, nowStr)
                    });
                    picker.full(date);
                }
                $.hideLoading();
            },
            error:function(){
            }
        });
    }

    requestServer();
}

/*可选择的数据*/
function createShowDate(dataList ,nowStr) {
    nowStr = myFormatDateStr(nowStr);
    var result = [];
    dataList.forEach(function (item, index) {
        var _resultTemp = item;
        if(nowStr <= item.date){
            if(item.saleState=='1'){
                _resultTemp.comment = '有票';
                _resultTemp.state = 'select';//可选择
            }else if(item.saleState=='0'){
                _resultTemp.comment = '售罄';
                _resultTemp.state = 'select';//可选择
            }else if(item.saleState=='-1'){
                _resultTemp.comment = '';//未排班不显示备注
                _resultTemp.state = '';//不可选择
            }
        }

        //今天的信息需要回写
        // if(search==1){
        //     if(isSameDate(myFormatDate(now),item.date)){
        //         if(nowBuyFlag){
        //             _resultTemp.comment = '有票';
        //             _resultTemp.state = 'select';//可选择
        //         }
        //     }
        // }
        result.push(_resultTemp);
    });
    return result;
}

/***
 * 获取navbar显示的数据
 * @param selectedDate 选中的日期 yyyy-dd-mm格式字符串
 * @param allDataList 所有日期
 * @param navbarInfoSize
 * @returns {Array} 返回结果
 */
function createNavbarData(selectedDate,allDataList,navbarInfoSize){
    var navbarResult = [];
    var selected = myFormatDateStr(selectedDate);
    for(var i=0;i<allDataList.length;i++){
        var item = allDataList[i];
        if(selected <= item.date){
            if(navbarResult.length < navbarInfoSize){
                navbarResult.push(item);
            }
        }
    }
    return navbarResult;
}

/***
 * 格式化字符串类型日期
 * @param dateStr string类型的date yyyy-mm-dd格式
 * @returns {string}
 */
function myFormatDateStr(dateStr) {
    var str = dateStr.split('-');
    var year = str[0];
    var month = str[1];
    var day = str[2];

    if(parseInt(month) <= 9){
        month = '0' + parseInt(month);
    }
    if(parseInt(day) <=9 ){
        day = '0' + parseInt(day);
    }

    return year + '-' + month + '-' + day;
}

/***
 * 判断两个日期是否是同一天
 * @param date1 yyyy-mm-dd
 * @param date2 yyyy-mm-dd
 */
function isSameDate(date1,date2) {
    var sameDateFlag = false;
    var temp1 = date1.split('-');
    var temp2 = date2.split('-');
    if(parseInt(temp1[0]) == parseInt(temp2[0])){
        if(parseInt(temp1[1]) == parseInt(temp2[1])){
            if(parseInt(temp1[2]) == parseInt(temp2[2])){
                sameDateFlag = true;
            }
        }
    }
    return sameDateFlag;
}

/**
 * 判断当前日期date是否是今天
 * @param date 格式yyyy-mm-dd
 */
function isToday(date) {
    var _isToday = false;
    var _date = date.split('-');
    var _year = 0,
        _month = 0,
        _day = 0;
    if(_date.length > 2){
        _year = parseInt(_date[0]);
        _month = parseInt(_date[1] - 1);
        _day = parseInt(_date[2]);
    }else{
        return false;
    }
    date = new Date(_year, _month, _day);

    var localDate = new Date();//本地时间
    if(localDate.getFullYear() == date.getFullYear()){
        if(localDate.getMonth() == date.getMonth()){
            if(localDate.getDate() == date.getDate()){
                _isToday = true;
            }
        }
    }
    return _isToday;
}

//星期切换
function switchWeeks(date){
//            var _date = new Date(date);
    var week = '';
    switch(parseInt(date.getDay())){
        case 0:
            week = '日';
            break;
        case 1:
            week = '一';
            break;
        case 2:
            week = '二';
            break;
        case 3:
            week = '三';
            break;
        case 4:
            week = '四';
            break;
        case 5:
            week = '五';
            break;
        case 6:
            week = '六';
            break;
    }

    //今天判断: 年月日跟本地的年月日分别相等，则为今天
    var localDate = new Date();
    if(localDate.getFullYear() == date.getFullYear()){
        if(localDate.getMonth() == date.getMonth()){
            if(localDate.getDate() == date.getDate()){
                week = '今天';
            }
        }
    }
    return week;
}

/***
 * 字符串转换为日期
 * @param dateStr 格式yyyy-mm-dd
 * @returns {Date}
 */
function strToDate(dateStr) {
    var temp = dateStr.split('-');
    var _year = temp[0];
    var _month = temp[1]-1;
    var _day = temp[2];
    return new Date(_year,_month,_day);
}

/***
 * 格式化date类型日期
 * @param date date对象 返回yyyy-mm-dd格式的string
 */
function myFormatDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();

    if(month <= 9){
        month = '0' + month;
    }
    if(day <=9 ){
        day = '0' + day;
    }
    return year + '-' + month + '-' + day;
}

//截取url？之前的地址
function subLocationHref() {
    var href = window.location.href;
    var index = href.indexOf('?');
    if(index > 0){
        return href.slice(0, index);
    }else{
        return href;
    }

}
