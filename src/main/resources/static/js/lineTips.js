$(function(){
//仅供参考冒泡
    if($.cookie('lineTips')==undefined){
    	$('#lineTips').css('display','block');
    }
    //关闭线路提示
    $('.tags .close').on('click', function () {
    	$.cookie('lineTips','1');
    	$('.tags').remove();
    });
});