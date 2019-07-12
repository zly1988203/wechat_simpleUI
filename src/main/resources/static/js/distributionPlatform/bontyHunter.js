$(function() {
    loadeUserInfo();
    $("#btnPlatform").on("click",function () {
        var platform = {
            distribType:1,
            domain:window.location.host,
            lineId:'0',
            url:'/distribution/bindUser.html',
            businessType: '0',
            shareType:'platform' //推广业务类型 平台
        }
        window.sessionStorage.removeItem('shareInfo');
        sessionStorage.setItem("shareInfo",JSON.stringify(platform));
        sharePro("platform");
    })
    $("#btnHailing").on("click",function () {
        var hailing = {
            distribType:3,
            domain:window.location.host,
            lineId:'0',
            url:'/distribution/bindUser.html',
            businessType: '10',
            shareType:'hailing' //推广业务类型 网约车
        }
        window.sessionStorage.removeItem('shareInfo');
        sessionStorage.setItem("shareInfo",JSON.stringify(hailing));
        sharePro("hailing");
    })
});

function loadeUserInfo() {
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if(null == userInfo || undefined == userInfo){
        location.href = '/regOrLogin';
        return;
    }
    if(!isEmpty(userInfo.avatar)){
        $("#avatar img").prop("src",userInfo.avatarUrl);
    }

    if(userInfo.distribUserType == 1){
        $("#distribUserType ").html("高级推广员");
    }else if(userInfo.distribUserType == 2){
        $("#distribUserType").html("下级推广员");
    }
    $("#providerName").html("当前车企："+userInfo.providerName);
    $("#providerId").val(userInfo.providerId);
    loadData();
}

// 分页选项
/*var _options = {
    pageSize: 10, // 每页10条
    pageIndex:1,//当前页数
    totalCount:0, //总记录条数
    pageCount:0, //总页数
    totalIndex: 0, //当前条数
    flag: false // 事件锁
};*/

var loadData = function () {
    $.showLoading();
    var urlStr =  '/distrib/getBountyInfo';
    //current page param
    var dataObj = {

    };
    dataObj = genReqData(urlStr, dataObj);
    $.ajax({
        type: 'POST',
        data:dataObj,
        url:urlStr,
        dataType: 'json',
        success:function (res) {
            $.hideLoading();
            if(res.code == 0){
                var data = res.data;
                $(".amount span").first().html(data.totalBounty);
                $("#dvcustomers").find("span").html(data.customerNum);
                $("#dvorders").find("span").html(data.orderNum);

                requestServer();
            }else {
                alert(res.message);
                // window.location.href = '/errorPage-500.html';
            }
        },
        error:function (e) {
            window.location.href = '/errorPage-500.html';
        }
    })
}
/*
$(document.body).rollPage('load', function() {
    // 事件锁, 防止频繁触发事件
    if(_options.flag) return;
    _options.flag = true;

    // 页面滚动到底部请求下一页
    requestServer();
});*/

// 分页获取数据
var requestServer = function() {
    // 显示分页指示器
    // $('#line_box').loading();
    var urlStr =  '/distrib/getPromoterLineList';
    //current page param
    var dataObj = {
        page: 1 
    };
    dataObj = genReqData(urlStr, dataObj);
    $.ajax({
        type: 'POST',
        data:dataObj,
        url:urlStr,
        dataType: 'json',
        success:function (res) {
            if(res.code == 0){
                // _options.pageCount = res.data.pageCount;
                // _options.totalCount = res.data.totalCount;
                var dataList = undefined == res.data.lineList ? []: res.data.lineList;
                if(dataList.length > 0){
                    $('.generalize.lines').show();
                    loadList(dataList);
                }else {
                    $('#line_box').hideLoading();
                    $('.generalize.lines').hide();
                }
                //1-开通推广 0-未开通
                if(!isEmpty(res.data.hasDistribOnline) && res.data.hasDistribOnline == '1'){
                    $('.generalize.hailing').show();
                }else {
                    $('.generalize.hailing').hide();
                }
            }else {
                alert(res.data.message);
            }
        },
        error:function () {
            window.location.href = '/errorPage-500.html';
        }
    })
};

function loadList(dataList){
    //异步请求到的每页数据
    // 渲染数据
    var strHtml ='';
    for(var i = 0; i < dataList.length; i++) {
        if(dataList[i].businessType == 2){
            strHtml += '<li>' +
                '<div class="station">' +
                '<span class="lineStart">' + dataList[i].lineName + '</span>' +
                '</div>' +
                '<button class="share-btn">邀请</button>' +
                '<div class="line-info line-info-height">' +
                '<input class="lineId" type="hidden" value="'+dataList[i].lineId+'">'+
                '<input class="businessType" type="hidden" value="'+dataList[i].businessType+'">'+
                '<input class="lineName" type="hidden" value="'+dataList[i].lineName+'">' +
                '<input class="minLinePrice" type="hidden" value="'+dataList[i].minLinePrice+'">'+
                '<span class="brokerage">赏金' + dataList[i].bountyCost + '元起</span>' +
                '</div>' +
                '</li>';
        }else{
            strHtml += '<li>' +
                '<div class="station">' +
                '<span class="start">' + dataList[i].departAddress + '</span>' +
                '<span class="end">' + dataList[i].arriveAddress + '</span>' +
                '</div>' +
                '<button class="share-btn">邀请</button>' +
                '<div class="line-info">' +
                '<input class="lineId" type="hidden" value="'+dataList[i].lineId+'">'+
                '<input class="businessType" type="hidden" value="'+dataList[i].businessType+'">'+
                '<input class="lineName" type="hidden" value="'+dataList[i].lineName+'">'+
                '<input class="minLinePrice" type="hidden" value="'+dataList[i].minLinePrice+'">'+
                '<span class="name">' + dataList[i].lineName + '</span>' +
                '<span class="brokerage">赏金' + dataList[i].bountyCost + '元起</span>' +
                '</div>' +
                '</li>';
        }

    }
    // _options.pageIndex++;
    $('#line_box').append(strHtml);
    lineClickEvent();
    /*
     * 销毁分页指示器的逻辑：
     * 1.数据加载完成的时候，移除
     * 2.假定数据不满一页，没有滚动条时候，移除
     */
    /*if(_options.pageIndex >= _options.pageCount || dataList.length < _options.pageSize) {
        $(document.body).rollPage('destroy');   // 销毁事件
        $('#line_box').hideLoading();               // 隐藏分页指示器
        return;
    }
    _options.flag = false;   // 数据渲染完成，事件解锁*/
}

function lineClickEvent() {
    var targetEvent = isAndroid()? "tap" : "click";
    $("#line_box li button").on(targetEvent,function () {
        var _this = $(this);
        var dvInfo = _this.parent('li');
        var lineId = $(dvInfo).find('.lineId').val();
        var businessType = $(dvInfo).find('.businessType').val();
        var lineName = $(dvInfo).find('.lineName').val();
        var departAddress = $(dvInfo).find('.start').html();
        var arriveAddress = $(dvInfo).find('.end').html();
        var minLinePrice = $(dvInfo).find('.minLinePrice').val();
        var lineInfo = {
            lineId : lineId,
            departAddress:departAddress,
            arriveAddress:arriveAddress,
            distribType:2, //线路标识
            businessType:businessType, //线路业务内容
            url:'/distribution/bindUser.html',
            domain:window.location.host,
            lineName:lineName,
            minLinePrice:minLinePrice,//线路价格,
            shareType:'line' //推广业务类型 线路
        }
        window.sessionStorage.removeItem('shareInfo');
        sessionStorage.setItem("shareInfo",JSON.stringify(lineInfo));
        sharePro("line");
    })
}

function sharePro(shareType) {
    var timestamp=new Date().getTime();
    if(shareType === "platform"){
        // window.location.href = "sharePlatform.html?v="+timestamp;
        window.location.href = "sharePlatformV2.html?v="+timestamp;
    }else if(shareType === "hailing"){
        // window.location.href = "hunter-normal.html?v="+timestamp;
        window.location.href = "sharePlatformV2.html?v="+timestamp;
    }else {
        // window.location.href = "shareLine.html?v="+timestamp;
        window.location.href = "shareLineV2.html?v="+timestamp;
    }
}