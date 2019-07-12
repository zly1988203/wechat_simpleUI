$(function(){
		var urlStr = SERVER_URL_PREFIX + '/getProviderName';
		//current page param
		var dataObj = {
		};
		//merge page param and common param,generate request param
		dataObj = genReqData(urlStr, dataObj);
     
     $.post(urlStr, dataObj, function(result){
            if(result && result.code == 0){
            	$('title').html(result.data);
            }
        }, 'json');
})