$(function () {
    var  initPage = function (){
        //api url
        var urlStr = SERVER_URL_PREFIX + '/distrib/getBountyInfo';
        //current page param
        var dataObj = {};
        //merge page param and common param,generate request param
        dataObj = genReqData(urlStr, dataObj);
        
        // var userInfo = localStorage.getItem("userInfo");
        $('.income-expense-list').loading();
        $.ajax({
            type: 'POST',
            data: dataObj,
            url: urlStr,
            dataType: 'json',
            success:function (res) {
                if(res.code == 0){
                	$("#recorded").find("span").html('￥' + res.data.recordedAmount);
                    $("#withdraw").find("span").html('￥' + res.data.withdrawAmount);
                    $("#failure").find("span").html('￥' + res.data.failureAmount);
                    $(".phone").find("a").html(res.data.serviceTel);
                    $(".phone").find("a").data('href','tel:' + res.data.serviceTel);
//                    loadDate(mock_list);
                }else {
                    //alert(res.message);
                	// window.location.href = '/errorPage-500.html';
                }
            },
            error:function () {
            	//window.location.href = '/errorPage-500.html';
            }
        })
    }

    
    //收支明细
    var  loadDate = function(list) {
    	var liContent = '';
    	//请求结果记录为0条
    	if(list.length <= 0){
    		liContent = '<div class="order-empty"><i></i><p>暂无数据</p></div>'
    	}else{
    		liContent +='<ul id="ulLst">';
    		$.each(list,function (index,item) {
            	//type：收支方向 0 全部 1 收入 2 提现
                var in_out = "-";
                if(item.type === 1){
                    in_out = "+";
                }
                liContent += '<li>' +
                    '<div class="list-particulars">' +
                    '<div class="name">'+item.title+'</div>' +
                    '<div class="amount">'+in_out+item.amount+'</div>' +
                    '</div>' +
                    '<div class="list-info">' +
                    '<div class="time">' + formatTime(item.createTime) + '</div>' +
                    '<div class="tips">'+(item.mobile==null?'':item.mobile)+'</div>' +
                    '</div>'+
                '</li>';
            });
            liContent +='</ul>';
    	}
    	$(".income-expense-list").append(liContent);
        $('.income-expense-list').hideLoading();
       
    }
    
    
    //收支明细getBountyDetailList的结果
    var mock_list = [];
    //收支明细URL
    var getBountyDetailListUrlStr = SERVER_URL_PREFIX + '/distrib/getBountyDetailList';
    //收支明细参数对象
    var getBountyDetailListDataObj = {type: 0};
    getBountyDetailListDataObj = genReqData(getBountyDetailListUrlStr, getBountyDetailListDataObj);
    $.ajax({
        type: 'POST',
        data: getBountyDetailListDataObj,
        url: getBountyDetailListUrlStr,
        dataType: 'json',
        success:function (res) {
            $.hideLoading();
            if(res.code == 0){
                mock_list = res.data;
                loadDate(mock_list);
            }else {
            	//window.location.href = '/errorPage-500.html';
            }
        },
        error:function () {
        	//window.location.href = '/errorPage-500.html';
        }
    });
    
    initPage();
    
    //页面跳转
    //待入账
    $('#recorded').on('click',function(){
    	window.location.href = '/distribution/histroyRecord.html';
        sessionStorage.scheduleType  = '1'; //金额类型 1-待入账 2-已失效 3-提现
    });
    //已失效
    $('#failure').on('click',function(){
    	window.location.href = '/distribution/histroyRecord.html';
        sessionStorage.scheduleType  = '2'; //金额类型 1-待入账 2-已失效 3-提现
    });
    //提现记录
    $('li.withdraw-btn').on('click',function(){
    	window.location.href = '/distribution/histroyRecord.html';
        sessionStorage.scheduleType  = '3'; //金额类型 1-待入账 2-已失效 3-提现
    });
});