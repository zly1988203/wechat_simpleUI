
var orderInfo = {
    status:$('#status').val(),
    orderNo:$('#orderNo').val(),
    tripNo:$('#tripNo').val(),
    settleMode:$('#settleMode').val(),
    userId:$('#userId').val(),
    payPrice:$('#payPrice').val(),
    arriveTitle:$("#arriveTitle").val(),
    departTitle:$("#departTitle").val(),
    tipsMessage:$("#tipsMessage").val(),
    departCity:$("#departCity").val(),
    departArea:$("#departArea").val(),
    arriveCity:$("#arriveCity").val(),
    arriveArea:$("#arriveArea").val(),
    departType:$("#departType").val(),
    departCarType:$("#departCarType").val(),
    numbers:$("#numbers").val(),
    upRegion:$("#upRegion").val(),
    downRegion:$("#downRegion").val(),
    departTime:$('#departTime').val()
}
var interval;
var clickEvent = isAndroid()?'tap':'click';
var dialogText = '你的订单已被客服取消，支付的款项已退回，请通过我的订单查看';
$(function () {
    // 地址显示及字符截取
    subAddrStr(orderInfo);

    // 显示车型及人数
    showCarType(orderInfo);

    backtoUrl('/hail/interCityIndex');
    interval = setInterval("innerCityUrlJudge(orderInfo.tripNo,orderJudgeCallBack,orderInfo.orderNo+'')", 1000);

    if(orderInfo.status == 3){
        dialogText = '你的订单已被客服取消，请通过我的订单查看';
    }

    // 初始化地图
    var map = new AMap.Map('allmap', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom:13, //初始化地图层级
        center: [116.397428, 39.90923] //初始化地图中心点
    });

    initTitleOfStatus();
    //是否显示取消订单按钮
    isShowCancel();
    isShowPaymentInfo();
    var departTimefmt = formatTime('yyyy-MM-dd hh:mm',orderInfo.departTime);
    $('#departTimeFmt').html('出发时间：'+departTimefmt);
});

//联系客服
$('#contact').on(clickEvent, function() {
    var urlDetail = SERVER_URL_PREFIX + '/Config/commonConfig';
    var dataDetail = {
    };
    dataDetail = genReqData(urlDetail, dataDetail);
    $.ajax({
        type: 'POST',
        url: urlDetail,
        data: dataDetail,
        dataType:  'json',
        success: function(data){
            if(data && data.code == 0){
                window.location.href = 'tel:'+data.data.customerTel;
            }
        }
    });

});

//返回首页
$('#back').on(clickEvent,function(){
    //清空缓存
    window.sessionStorage.removeItem('callCarInfo');
    window.location = '/hail/interCityIndex';
});

//订单状态扭转判断
function orderJudgeCallBack(data){
    console.log('订单状态扭转毁掉'+data);
    if(parseInt(data.code)==0){
        if(parseInt(data.data.status)==3||parseInt(data.data.status)==4||parseInt(data.data.status)==5||parseInt(data.data.status)==6
            ||parseInt(data.data.status)==7){
            window.location='/hail/innerCity/orderDetail/getOrderInfo?orderNo='+orderInfo.orderNo;
        }else if(parseInt(data.data.status)==9){
            clearInterval(interval);
            $.dialog({
                text: dialogText,
                buttons: [{
                    text: '我知道了',
                    onClick: function() {
                        location.href='/hail/innerCity/order/toOrderReturnDetailPage?orderNo='+orderInfo.orderNo;
                    }
                }]
            });
        }

    }
}

function showCarType(orderInfo){
    var carType="";	// 包车类型
    if (orderInfo.departType=='1'){
        carType = "实时订单";
    }
    else if(orderInfo.departType=='2'){
        carType = "预约";
    }
    else if(orderInfo.departType=="3"){
        carType = "拼车";
    }
    else if(orderInfo.departType=="4"){
        if (orderInfo.departCarType==1){
            carType = "舒适型";
        }
        else if (orderInfo.departCarType==2){
            carType = "豪华型";
        }
        else if (orderInfo.departCarType==3){
            carType = "七座商务型";
        }
        else{
            carType = "舒适型";
        }
    }
    else{
        carType = "拼车";
    }

    if (orderInfo.numbers>0){
        $(".code").html("<span>"+orderInfo.numbers+"人<br>"+carType+"</span>");
    }
}

function subAddrStr(orderInfo){
    var depart = orderInfo.departTitle;
    if (orderInfo.upRegion != ""){
        depart = orderInfo.upRegion+" · "+orderInfo.departTitle;
    }

    if (depart.length>16){
    	depart = depart.substr(0,16)+"...";
    }
    $(".start").text(depart);
   

    var arrive = orderInfo.arriveTitle;
    if (orderInfo.downRegion != "" ){
        arrive = orderInfo.downRegion+" · "+orderInfo.arriveTitle;
    }

    if (arrive.length>16){
        arrive = arrive.substr(0,16)+"...";
    }
    $(".end").text(arrive);

    // 是否愿意等
    if (orderInfo.tipsMessage != "" && orderInfo.tipsMessage.length>14){
    	orderInfo.tipsMessage = orderInfo.tipsMessage.substr(0,14)+"...";       
    }
    $(".tips").text(orderInfo.tipsMessage);
}

//时间戳转换为yyyy/mm/dd/HH：mm
function formatTime(fmt,time) {
    if(time){
        time = parseInt(time);
        var date = new Date(time);
        var o = {
            'Y+' : date.getFullYear(),
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }else{
        return '';
    }
}