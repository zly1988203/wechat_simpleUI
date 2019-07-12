function dateStrToDate(dateStr){
	var dateStrs = dateStr.split("-");
    var year = parseInt(dateStrs[0], 10);
    var month = parseInt(dateStrs[1], 10) - 1;
    var day = parseInt(dateStrs[2], 10);
    var date = new Date(year, month, day);
    return date;
}

function dateStrAddDay(dateStr,addDayCount){
	var date = dateStrToDate(dateStr);
    date.setDate(date.getDate()+addDayCount);
  	var dateStr = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
  	return dateStr;
}

function getMonths(date1 , date2){
    //用-分成数组
    date1 = date1.split("-");
    date2 = date2.split("-");
    //获取年,月数
    var year1 = parseInt(date1[0]) , 
        month1 = parseInt(date1[1]) , 
        year2 = parseInt(date2[0]) , 
        month2 = parseInt(date2[1]) , 
        //通过年,月差计算月份差
        months = (year2 - year1) * 12 + (month2-month1);
    return months;    
}

function dateStrAddMonths(dateStr){
	var date = dateStrToDate(dateStr);
  	var dateStr = date.getFullYear()+'-'+(date.getMonth()+1);
  	return dateStr;
}

function getMonth(timestamp) {     
	var d = new Date(timestamp);
	var month = d.getMonth() + 1;
	return month;
}