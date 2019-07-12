function initDepartDate(){
	var str = '';
	var d = new Date();
	var week = getMyDay(d);
	str += (d.getMonth()+1) + '月' + d.getDate() + '日' + ' ' + week+' (今天)';
	$('#startTime').val(str);
	var str1 = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
	$('#startTime').data('date',str1);
}

function getMyDay(date){
	var week; 
	if(date.getDay()==0) week="星期日"
	else if(date.getDay()==1) week="星期一"
	else if(date.getDay()==2) week="星期二" 
	else if(date.getDay()==3) week="星期三"
	else if(date.getDay()==4) week="星期四"
	else if(date.getDay()==5) week="星期五"
	else if(date.getDay()==6) week="星期六"
	return week;
}