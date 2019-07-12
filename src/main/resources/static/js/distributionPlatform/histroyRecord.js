$(function() {
	//金额类型 1-待入账 2-已失效 3-提现 提现记录调用接口getBountyDetailList，待入账和已失效调用接口getCustomerOrderList
	var scheduleType = sessionStorage.getItem('scheduleType');
    var _getMoreHtml = '';
    //api url
    var urlStr = SERVER_URL_PREFIX;
    //current page param
    var dataObj = {type: scheduleType};
	var  initPage = function (){
        if(scheduleType == '1' ){
        	urlStr += '/distrib/getCustomerOrderList';
        	dataObj.type = '1';
        	$("title").html("待入账");
        }else if(scheduleType == '2'){
        	urlStr += '/distrib/getCustomerOrderList';
        	dataObj.type = '2';
        	$("title").html("已失效");
        }else if(scheduleType == '3'){
        	urlStr += '/distrib/getBountyDetailList';
        	dataObj.type = '2'; //提现
        	$("title").html("提现记录");
        }
        $('.history-container').loading();
        //待入账和已失效记录 可分页请求
        if(scheduleType == '1' || scheduleType == '2'){
            // 分页选项
            var _options = {
                number: 1,  // 页码
                totalCount: 1, //总页数
                currentIndex: 1, //当前条数
                flag: false // 事件锁
            };

            // 分页获取数据
            var requestServer = function() {
                dataObj.page = _options.number; //当前页码
                //merge page param and common param,generate request param
                dataObj = genReqData(urlStr, dataObj);
                // 显示分页指示器
                //  $('.history-container').loading();
                //异步ajax的开始
                $.ajax({
                    type: 'POST',
                    data: dataObj,
                    url: urlStr,
                    dataType: 'json',
                    success:function (res) {
                        if(res.code == 0){
                            _options.totalCount = res.data.pageCount;
                            loadPagingData(res.data.detailList, _options.currentIndex);

                            _options.number++;       // 页码自增
                            _options.flag = false;   // 数据渲染完成，事件解锁

                        }else {
                        	//window.location.href = '/errorPage-500.html';
                        }
                    },
                    error:function () {
                    	//window.location.href = '/errorPage-500.html';
                    }
                });
            };
            // 页面加载完自动请求数据
            requestServer();
        }
        //提现记录 后台不好分页，不分页
        else if(scheduleType == '3'){
            //merge page param and common param,generate request param
            dataObj = genReqData(urlStr, dataObj);
            $.ajax({
                type: 'POST',
                data: dataObj,
                url: urlStr,
                dataType: 'json',
                success:function (res) {
                    if(res.code == 0){
                        loadData(res.data);
                     }else {
                    	 //window.location.href = '/errorPage-500.html';
                    }
                },
                error:function () {
                	//window.location.href = '/errorPage-500.html';
                }
            });
        }

      

        /**
         * 渲染历史记录-分页
         * @param list 数据列表
         * @param index 当前条数
         */
        function loadPagingData(list ,index){
            // 销毁分页的逻辑：已经到最大页码
            if(_options.number >= _options.totalCount) {
                _getMoreHtml = '<div class="get-more">没有更多啦</div>'
            }else{
                _getMoreHtml = '<div class="get-more">点击加载更多</div>'
            }

            // 渲染数据
            var strHtml ='';
            //第一页并且没有记录
            if(_options.totalCount<2 && list <= 0){
                strHtml = '<div class="order-empty"><i></i><p>暂无数据</p></div>';
                $('.history-container').html(strHtml);
            }else{
                for(var i = 0; i < list.length; i++) {
                	strHtml += '<li>' +
                    '<div class="amount">' + list[i].title + '<span>' + (list[i].type==1?'+':'-') + (list[i].amount==null?0:list[i].amount) + '元</span></div>' +
                    '<div class="time">' + formatTime(list[i].createTime) + '<span>' + (list[i].mobile==null?'':list[i].mobile) + '</span></div>' +
                    '</li>';
                index++;  //当前记录条数自增
                }
            }
            $('.history-container #history_list').append(strHtml);
            $('.get-more-box').html(_getMoreHtml);
            $('.history-container').hideLoading();
            
            $('.history-container .get-more').on('click',function () {
                // console.log('请求更多数据')
                //当前页数大于总页数时，不再请求
                if(_options.number > _options.totalCount){
                    $('.get-more').html('没有更多啦')
                    return;
                }else{
                    $('.get-more-box .get-more').loading();
                    $('.get-more-box .get-more').hide();
                    // 事件锁, 防止频繁触发事件
                    if(_options.flag) return;
                    _options.flag = true;

                    //请求下一页
                    requestServer();
                    $('.get-more-box .get-more').hideLoading();
                    $('.get-more-box .get-more').show();
                }
            });
        }
	};
	
	initPage();

    /**
     * 渲染历史记录-不分页
     * @param list 数据列表
     */
	function loadData(list){
        // 渲染数据
        var strHtml ='';
        //没有记录
        if(list <= 0){
            strHtml = '<div class="order-empty"><i></i><p>暂无数据</p></div>';
        }else{
        	strHtml += '<ul  class="history-list" id="history_list">';
            for(var i = 0; i < list.length; i++) {
                strHtml += '<li>' +
                    '<div class="amount">' + list[i].title + '<span>' + (list[i].type==1?'+':'-') + (list[i].amount==null?0:list[i].amount) + '元</span></div>' +
                    '<div class="time">' + formatTime(list[i].createTime) + '<span>' + (list[i].mobile==null?'':list[i].mobile) + '</span></div>' +
                    '</li>';
            }
            strHtml += '</ul>';
        }
        $('.history-container').append(strHtml);
        $('.history-container').hideLoading();
    }



    // $(document.body).rollPage('load', function() {
    //     // 事件锁, 防止频繁触发事件
    //     if(_options.flag) return;
    //     _options.flag = true;
    //
    //     // 页面滚动到底部请求下一页
    //     requestServer();
    // });
});