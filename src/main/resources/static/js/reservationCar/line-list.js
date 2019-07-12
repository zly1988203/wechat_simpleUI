$(function () {
    /**
     * 初始化时需要请求数据：本月当天开始，以及后两月，共三个月的数据
     *
     */
    // 后台数据： ticketInfoList:日期车票信息；date:日期;saleState:车票状态 0-有票，1-售罄;
    // 三个月的所有数据
    var allTicketInfoList = [
            {date:'2018-5-25',saleState:1},
            {date:'2018-5-26',saleState:0},
            {date:'2018-5-27',saleState:1},
            {date:'2018-5-28',saleState:0},
            {date:'2018-5-29',saleState:1},
            {date:'2018-5-30',saleState:0},
            {date:'2018-5-31',saleState:0},
            {date:'2018-6-1',saleState:0},
            {date:'2018-6-2',saleState:0},
            {date:'2018-6-3',saleState:1},
            {date:'2018-6-4',saleState:0},
            {date:'2018-6-5',saleState:0},
            {date:'2018-6-6',saleState:1},
            {date:'2018-6-7',saleState:0},
            {date:'2018-6-8',saleState:1},
            {date:'2018-6-9',saleState:0},
            {date:'2018-6-10',saleState:0},
            {date:'2018-6-11',saleState:1},
            {date:'2018-6-12',saleState:0}];
    //需要显示的日历天数
    var bannerInfoSize = $('.ola-date').data('size');
    //需要显示的日历数据
    var bannerInfoList = [];
    //对于请求的数据做初步处理
    if(allTicketInfoList.length > 0){
        if(allTicketInfoList.length >= bannerInfoSize){
            for(var i = 0; i < bannerInfoSize; i++){
                bannerInfoList.push(allTicketInfoList[i]);
            }
        }else {
           console.log('请求数据异常,服务端没有返回足够的数据');
        }
    }else{
        console.log('请求数据异常，服务端没有返回数据');
    }

    showTicketInfo(bannerInfoList);
    var dateScroll = new IScroll('#wrapper', {
        scrollX: true,
        scrollY: false,
        mouseWheel: true
    });
    var active_li = $('.ola-date li.active');
    dateScroll.scrollToElement(active_li[0], 500, false, false, IScroll.utils.ease.circular);

    var _activeDay = '2018-5-24';//选中的日期，初始化时默认为系统当天日期，否则为点击选中的日期 TODO
//全部日期
    selectDate(_activeDay);

    /**初始化日期车票信息
     * @param dataList:车票信息列表
     * 默认为售罄 日期按照传入的参数填充
     */
    function showTicketInfo(dataList){
        $('.ola-date').html('');//清空日历
        //1.日历填充
        var _html = '';
        for(var i=0; i<dataList.length; i++){
            //日期处理
            var dateStr = dataList[i].date.split('-');
            var _year = "";
            var _month = "";
            var _day = "";
            if(dateStr.length > 0){
                _year = dateStr[0];
                _month = dateStr[1]-1;
                _day = dateStr[2];
            }
            var dateTemp = new Date(_year,_month,_day);
            var className = (switchWeeks(dateTemp)=='今天') ? " active":"";//初始化时默认选中今天
            var todayFlag = (switchWeeks(dateTemp)=='今天') ? true : false;//是否是今天

            var className2 = ''; //选中日期重新生成时，默认选中选中的日期
            //选中日期重新生成时，默认选中选中的日期
            if(_activeDay == dataList[i].date){//等于选中日期的li为active
                className2 = " active";
            }
            var ticketInfo = (dataList[i].saleState == 0) ? "有票" : "售罄";
            var ticketClass = (dataList[i].saleState == 0) ? "on-sale" : "sell-out";
            _html += '<li class="' + className + className2 +'" data-date=' + dataList[i].date + ' data-today='+ todayFlag +'>' +
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
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            dateScroll.scrollToElement($(this)[0], 500, false, false, IScroll.utils.ease.circular);

            //TODO 做前后端分离后，需要请求当天的数据
        });
    }

    /***
     * 选择日期
     * @param today:当天日期 格式为yyyy-mm-dd
     */
    function selectDate(today) {
        var trigger = $('.all-date-btn'),
            parent = $('#select-date'),
            cancel = parent.find('.cancel');
        var initDateStatus = false;

        var init = function () {
            //只初始化一次
            if(!initDateStatus) {
                initDateStatus = true;
                parent.find('.date').datePicker({
                    dateBase: today,
                    weekend: true,
                    multiple: false,
                    gather: createShowDate(allTicketInfoList),//可选择的数据集合
                    selectCallback: function (data) {
                        //TODO 点击选中日期事件之后的事情
                        var d = data.selectData[0].date;
                        _activeDay = d.year + '-' + d.month + '-' + d.day;

                        parent.setPopupData(_activeDay);
                        cancel.triggerHandler('click');
                        var bannerDataList = createBannerDataList(_activeDay);//banner日历显示的数据
                        showTicketInfo(bannerDataList);
                        dateScroll.scrollToElement($('.ola-date li.active')[0], 500, false, false, IScroll.utils.ease.circular);
                    }
                });
            }
        };

        //弹出层
        trigger.on('click', function () {
            parent.popup('modal', init, function (data) {
                trigger.data('choice',data);
            });
        }).backtrack({
            cancel: '#select-date .cancel'
        });

        //返回
        $('#select-date .cancel').on('click', function () {
            parent.closePopup();
        });
    }

    /*选中日期后，需要展示的日期 date:yyyy-mm-dd*/
    function createBannerDataList(date) {
        var _index = getIndex(date,allTicketInfoList);
        var bannerResult = [];
        if(allTicketInfoList.length-_index < bannerInfoSize){
            //选中的日期后面剩余的日期数量 小于 要显示的数量时
            for(var i = allTicketInfoList.length-bannerInfoSize;i < allTicketInfoList.length; i++){
                bannerResult.push(allTicketInfoList[i]);
            }
        }else{
            //选中的日期后面剩余的日期数量 大于等于 要显示的数量时
            for(var i = 0 ;i < bannerInfoSize; i++){
                bannerResult.push(allTicketInfoList[_index + i]);
            }
        }
        return bannerResult;
    }
});

/***
 *  获取选中的日期在全部日期中的index
 * @param date yyyy-dd-mm
 * @param allDataList 全部日期
 */
function getIndex(date,allDataList) {
    var _index = 0;
    allDataList.forEach(function (item, index) {
        if(isSameDate(date,item.date)){
             _index = index;//选中的日期在全部数据中的位置
            return _index;
        }
    });
    return _index;
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

//switch展示全部
$('.show-all').on('click', function () {
    var el = $(this);

    //show
    el.data('clock', true);
    el.addClass('somersault');
    el.siblings('.ola-ticket').addClass('slideToggle');

    el.remove();
});

/*可选择的数据*/
function createShowDate(dataList) {
    var result = [];
    dataList.forEach(function (item, index) {
        var _resultTemp = item;
        _resultTemp.comment = (item.saleState=='0') ? '有票' : '售罄';
        _resultTemp.state = 'select';//可选择
        result.push(_resultTemp);
    });
    return result;
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

