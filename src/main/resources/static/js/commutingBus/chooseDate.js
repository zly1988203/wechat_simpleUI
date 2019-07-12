// 获取地址栏参数
var getUrlRequest = getRequest();
// 获取车企信息
var userInfo = JSON.parse(localStorage.getItem("userInfo"));
setTimeout(function(){
    $('title').html("班次详情 - " + userInfo.providerName);
},600)
var clickEvent = isAndroid()?'tap':'click';
// 获取url的参数
function getRequest() {
    var url = location.search; //获取url中"?"符后的字串  
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var strs = url.substr(1);
        strs = strs.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
var preOrderInfo = {
    selectData:[],
    busIds:'',
    qrcId:'',
    preSellTime:0
}
function getCalendarList(param,callback) {
    request(commuteApi.calendarList,param,true).then(function (res) {
        if(res.code == 0){
            var data = res.data;
            preOrderInfo.preSellTime = data.preSellTime;
            if(data.scheduleInfoList.length > 0){
                data.scheduleInfoList.forEach(function (item,index) {
                    item.comment = "¥"+item.sellPrice;
                    item.status = 'select';

                    if(item['busId']==null){
                        item['comment'] = '/';
                        item['status'] = 'readonly';
                    }

                    if(item.hasWork == 0){
                        item['tag'] = '休';
                    }else if(item.hasWork == 1) {
                        item['tag'] = '班';
                    }

                    if(item['ticketRemainNum'] == 0){
                        item['comment'] = '售罄';
                        item['status'] = 'readonly';
                    }
                    if(item['busStatus'] == 0){
                        item['comment'] = '已停售';
                        item['status'] = 'readonly';
                    }
                    if(item['busStatus'] == -1){
                        item['status'] = 'readonly';
                    }
                    if(item['hasBought'] == 1){
                        item['comment'] = '已购票';
                        item['status'] = 'readonly';
                    }

                    if(item['specialState'] == 1 && item['ticketRemainNum'] != 0 && item['busStatus'] > 0){
                        item['badge'] = '/src/images/common/icon-discounts.png';
                    }

                })
               callback(data.scheduleInfoList,data.preSellTime)
            }else {
                callback([],data.preSellTime);
            }
        }else{
            $.hideLoading();
            $.alert(res.message);
        }
    })
}

function loadDatePicker() {
    $.showLoading();
    var chooseData = JSON.parse(sessionStorage.getItem('chooseData'));
    $('.head-panle .time').html(chooseData.startStationTime);
    $('#startName .title').html(chooseData.startStationName);
    $('#endName .title').html(chooseData.endStationName);
    $('#startName .time').html('预计'+chooseData.startStationTime);
    $('#endName .time').html('预计'+chooseData.endStationTime);
    var param = {
        token:serverUtil.token,
        scheduleId:chooseData.scheduleId,
        startStationId:chooseData.startStationId,
        endStationId:chooseData.endStationId,
        departDate:chooseData.departDateStr,
        async:false
    }
    getCalendarList(param,function (list, maxDate) {
        initDatePicker(list,maxDate);
        $.hideLoading();
    })
}

function getLocalTime(timestamp) {
    var d = new Date(timestamp);
    var month = d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : (d.getMonth()+1);
    var date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    return d.getFullYear() + '-' + month + '-' + date;
}

var switchMonthEvent = function (currentDate,picker) {
    getNexMonList(currentDate,picker)
};

function getNexMonList(currentDate,picker,loadAfterMonthFlag) {
    var preSellDate = getLocalTime(preOrderInfo.preSellTime);
    if(currentDate > preSellDate) return;
    if(picker){
        var chooseData = JSON.parse(sessionStorage.getItem('chooseData'));
        var param = {
            token:serverUtil.token,
            scheduleId:chooseData.scheduleId,
            startStationId:chooseData.startStationId,
            endStationId:chooseData.endStationId,
            departDate:currentDate,
            async:false
        }
        if(!loadAfterMonthFlag){
            picker.drawMonth(currentDate);
        }
        getCalendarList(param,function (list) {
            picker.reset({
                gather: list
            });
            picker.drawMonthData(currentDate);
        })
    }
}

var loadAfterMonthEvent = function (currentDate, picker) {
    getNexMonList(currentDate, picker, true);
};


function initDatePicker(list,maxDate) {
    var nowDay = new Date();
    var strDay = getLocalTime(nowDay.getTime());
    $('.date-picker-container').datePicker({
        dateBase: strDay,
        switchMonth:switchMonthEvent,
        gather: list,
        after: 2,
        loadAfterMonth:loadAfterMonthEvent,
        noGatherShow:false,
//            before: true,
        selectCallback:function (data) {
            preOrderInfo.selectData = data.selectData;
        },
        maxDate: getLocalTime(maxDate),
    });
}

$('.back-btn').on(clickEvent,function () {
    window.history.go(-1);
})

$('.confirm-btn').on(clickEvent,function () {
    if(preOrderInfo.selectData.length <= 0){
        $.toast('请选择购买日期');
        return;
    }

    var param = {
        token:serverUtil.token,
        busId:preOrderInfo.selectData[0].busId,
        type:7,
    }

    $.showLoading();
    request(commuteApi.queryNotPayOrders,param,true).then(function (result) {
        $.hideLoading();
        if(result.code == 0){
            preOrderInfo.selectData.forEach(function (item,index) {
                preOrderInfo.busIds += item.busId+','
            })
            preOrderInfo.busIds = preOrderInfo.busIds.substring(0,preOrderInfo.busIds.length-1);
            sessionStorage.setItem('busIds',JSON.stringify(preOrderInfo.busIds));
            if("qrcId" in getUrlRequest){
                window.location = "/commutingBus/toAddOrder?qrcId=" + getUrlRequest.qrcId;
            }else{
                window.location.href="/commutingBus/toAddOrder";
            }
        }else if(result.code == 50086){
            var orderNo = result.data;
            $.confirm('您当前有未支付订单，不能重复下单', '提示',['我知道了', '进入订单'], function() {
                window.location.href="/bus/toCommuteOrderDetail?orderNo="+orderNo;
            });
        }else{
            $.alert(result.message||'未知错误');
        }

    })
})

$(function () {
    localStorage.removeItem('selectedCoupon');
    loadDatePicker();
})

