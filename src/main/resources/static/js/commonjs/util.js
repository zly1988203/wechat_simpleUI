/**
 * 常用工具js
 */
/**
 * 查询字符串上的指定值
 * @param key
 * @param strURL
 * @returns {string}
 */
function getParam(key, strURL) {
    strURL = strURL || window.location.search;
    return new RegExp("(^|\\?|&)" + key + "=([^&]*)(\\s|&|$)", "i").test(strURL) ?
        decodeURIComponent(RegExp.$2.replace(/\+/g, " ")) : "";
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
/***
 * 格式化date类型日期
 * @param  timeFlag: 是否包含时分 false:不包含（默认），true:包含
 * @param date date对象 返回yyyy-mm-dd格式的string
 */
function formatDateToString(date,timeFlag) {
    if(isEmpty(timeFlag)){
        timeFlag = false;
    }
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    month = formatNumber(month);
    day = formatNumber(day);
    hour = formatNumber(hour);
    minute = formatNumber(minute);
    second = formatNumber(second);

    if(timeFlag){
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
    }else {
        return year + '-' + month + '-' + day;
    }
}

/**
 * 格式化date类型日期
 * @param date
 * @param  timeFlag: 是否包含时分 false:不包含（默认），true:包含
 * @returns {string} yyyy年mm月dd日
 */
function formatDateToStringHan(date, timeFlag) {
    if(isEmpty(timeFlag)){
        timeFlag = false;
    }
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    month = formatNumber(month);
    day = formatNumber(day);
    hour = formatNumber(hour);
    minute = formatNumber(minute);
    second = formatNumber(second);

    if(timeFlag){
        return year + '年' + month + '月' + day + '日 ' + hour + ':' + minute;
    }else {
        return year + '年' + month + '月' + day + '日';
    }
}

/**
 * 格式化数字，小于9的用两位数表示。如 2用02表示
 * @param num
 * @returns {String}
 */
function formatNumber(num) {
    if(num <= 9){
        num = '0' + num;
    }
    return num;
}

/**
 * string类型日历转换为date
 * @param dateStr string yyyy-mm-dd
 */
function formatStringToDate(dateStr) {
    var _date = dateStr.split('-');
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
    return new Date(_year, _month, _day);
}

/**
 * 获取参数日期的前/后几天
 * @param currentDay  string yyyy-mm-dd
 * @param n  n-负数表示前几天，n-正数表示后几天，0为当天
 * @returns string-date 字符串类型的日期 yyyy-mm-dd
 */
function getCountDay(currentDay,n) {
    if(!n){
        n = 0;
    }
    var currentDate = formatStringToDate(currentDay);
    var result = currentDate.getTime() + n*24*60*60*1000;
    var final = new Date(result);
    return formatDateToString(final);
}

/**
 * 获取参数日期的前/后几个月
 * @param currentDay string yyyy-mm-dd
 * @param n n-负数表示前几个月，n-正数表示后几个月，0为当月
 * @returns string-date string格式的日期 yyyy-mm-dd 返回的是月初1号
 */
function getCountMonthEarlier(currentDay, n){
    if(!n){
        n = 0;
    }
    var currentDate = formatStringToDate(currentDay);
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + n;
    var day = 1;//月初
    var temp = new Date(year,month,day);
    return formatDateToString(temp);
}

/**
 * 获取一个日期的当月最大天数
 * @param date String yyyy-mm-dd
 * @returns {number} 返回最大天数
 */
function getMaxDate(date) {
    //获取最大天数
    var max = [31,28,31,30,31,30,31,31,30,31,30,31];
    var tempDate = formatStringToDate(date);
    var year = tempDate.getFullYear();
    if(year % 4 == 0){
        //闰年
        max[1] = 29;
    }
    var month = tempDate.getMonth();
    return max[month];
}

/**
 * 获取星期数
 * @param date Date类型
 * @param flag 星期类型标记 true:周一，false:星期一
 * @returns {string}
 */

function switchWeekday(date,flag) {
    if(isEmpty(flag)){
        flag = false;
    }
    var week = date.getDay();
    var weekText1 = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    var weekText2 = ['周日','周一','周二','周三','周四','周五','周六'];
    if(flag){
        return weekText2[week];
    }else{
        return weekText1[week];
    }
}

/**
 * 格式化时间
 * @param n 单位是秒
 */
function format(n) {
    var s = parseInt(n);
    var	m = 0;
    var	h = 0;

    if(s > 60) {
        m = parseInt(s / 60);
        s = parseInt(s % 60);

        if(m > 60) {
            h = parseInt(m / 60);
            m = parseInt(m % 60)
        }
    }

    var result = {}
    result.second = s;
    if(m > 0) {
        result.minute = m;
    }
    if(h > 0) {
        result.hour = h;
    }

    return result;
}

/**
 * 支持string格式 yyyy-mm-dd和date类型参数
 * @param dateStr1
 * @param dateStr2
 * @returns {number} 0:两个日期相等;1:dateStr1>dateStr2; -1:dateStr1<dateStr2
 */
function compareDate(dateStr1,dateStr2) {
    var date1,date2;
    if(typeof dateStr1 == 'string'){
        //字符串类型
        date1 = formatStringToDate(dateStr1);
    }else if(typeof dateStr1 == 'object' && dateStr1 instanceof Date){
        //date类型
        date1 = dateStr1;
    }
    if(typeof dateStr2 == 'string'){
        //字符串类型
        date2 = formatStringToDate(dateStr2);
    }else if(typeof dateStr2 == 'object' && dateStr2 instanceof Date){
        //date类型
        date2 = dateStr2;
    }

    var tempTime1,tempTime2;
    tempTime1 = date1.getTime();
    tempTime2 = date2.getTime();

    if(tempTime1 == tempTime2){
        return 0;
    }else if(tempTime1 > tempTime2){
        return 1;
    }else if(tempTime1 < tempTime2){
        return -1;
    }
}

//判断空
function isEmpty(obj){
    if (obj === null || obj === undefined || obj === '') {
        return true;
    }
    return false;
}

/**
 * 校验手机号 vectors.js中有
 * @param $poneInput
 * @returns {boolean}
 */
// function isPoneAvailable($poneInput) {
//     var myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
//     if (!myreg.test($poneInput)) {
//         return false;
//     } else {
//         return true;
//     }
// }

/**
 * input类的最大长度
 * @param $el
 * @param maxLength
 */
function maxLengthCheck($el,maxLength) {
    if(isEmpty(maxLength)){
        return;
    }
    if(typeof maxLength != 'number'){
        return;
    }

    if($.trim($el.val()).length > maxLength) {
        $el.val($el.val().slice(0,maxLength));
    }
}