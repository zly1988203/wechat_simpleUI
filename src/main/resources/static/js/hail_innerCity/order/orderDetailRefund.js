var journeyInfoObj = {
    departTime: $('#departTime').val(),
    departCity: $('#departCity').val(),
    departArea: $('#departArea').val(),
    departTitle: $('#departTitle').val(),
    arriveCity: $('#arriveCity').val(),
    arriveArea: $('#arriveArea').val(),
    arriveTitle: $('#arriveTitle').val(),
    departType: $('#departType').val(),
    carTypeId: $('#carTypeId').val(),
    numbers: $('#numbers').val(),
    cancelType: $('#cancelType').val(),
    remark: $('#remark').val(),
    upRegion:$("#departRegionName").val(),
    downRegion:$("#arriveRegionName").val(),

};

var cancelDetailObj = {
    orderPrice : $('#orderPrice').val(),
    discountPrice : $('#discountPrice').val(),
    specialActivityType : $('#specialActivityType').val(),
    specialActivityName : $('#specialActivityName').val(),
    specialPrice : $('#specialPrice').val(),
    couponPrice : $('#couponPrice').val(),
    payPrice : $('#payPrice').val(),
    refundPrice : $('#refundPrice').val(),
    feePrice : $('#feePrice').val(),
    cancelType: $('#cancelType').val(),
    status:$('#status').val(),
    payStatus:$('#payStatus').val()
};
var clickEvent = isAndroid()?'tap':'click';
$(function () {
	$('.cancel-detail-container').hide();
    if(cancelDetailObj.payStatus == '1'){
        showCancelDetail(cancelDetailObj);
    }
    showCancelResult(cancelDetailObj);
    showJourneyInfo(journeyInfoObj);
    backtoUrl('/passenger/innerCityOrder.html');
});

//显示退款详情
function showCancelDetail(cancelDetailObj) {
    var _html = '';
    _html += '<div class="title">退款详情</div>';

    //特价活动
    var _specialHtml = '';
    if(cancelDetailObj.specialActivityType != 0){
        if(cancelDetailObj.specialActivityType == 1 && cancelDetailObj.specialPrice!=0){
            _specialHtml += '<li>' +
                '   <div class="name">特价优惠</div>' +
                '   <div class="value">-'+ cancelDetailObj.specialPrice +'元</div>' +
                '</li>'
        }
    }

    var _couponHtml = '';
    if(cancelDetailObj.couponPrice != 0){
        //优惠券抵扣金额 后台传过来的
        var couponPrice = parseFloat(cancelDetailObj.couponPrice);
        _couponHtml +=  '<li>' +
            '   <div class="name">优惠券</div>' +
            '   <div class="value">-'+ formatMoney(couponPrice,2) +'元</div>' +
            '</li>'
    }

    _html +='<div class="detail-list"><ul>' +
        '<li>' +
        '   <div class="name">一口价</div>' +
        '   <div class="value">'+ cancelDetailObj.orderPrice +'元</div>' +
        '</li>' +
        _specialHtml + _couponHtml +
        '<li>' +
        '   <div class="name">实付金额</div>' +
        '   <div class="value">'+ cancelDetailObj.payPrice +'元</div>' +
        '</li>' +
        '</ul>';
    _html += '<div class="refund-amount">' +
        '                    <div class="amount">退款金额<span>'+ cancelDetailObj.refundPrice +'元</span>(手续费'+ cancelDetailObj.feePrice +'元)</div>' +
        '                    <div class="tips">退款金额将在7个工作日内，按原支付途径退回</div>' +
        '                </div>';
    _html += '</div>';

    $('.cancel-detail-container').show();
    $('.cancel-detail-container').html(_html);
}

//显示取消订单结果
function showCancelResult(cancelDetailObj){
    var cancelText = '订单取消成功';
    // 1 未取消 2 乘客取消 3 司机取消 4 车企取消 5 超时取消 6 未支付取消
    if(cancelDetailObj.cancelType == 2){
        cancelText = '订单取消成功';
    }else if(cancelDetailObj.cancelType == 3){
        cancelText = '客服已取消订单';
        $('.cancel-status-container').addClass('service-cancel');
    }else if(cancelDetailObj.cancelType == 4){
        cancelText = '客服已取消订单';
        $('.cancel-status-container').addClass('service-cancel');
    }else if(cancelDetailObj.cancelType == 5){
        cancelText = '因超时，已取消订单';
        $('.cancel-status-container').addClass('busy-cancel');
    }else if(cancelDetailObj.cancelType == 6){
        cancelText = '订单取消成功';
//        $('.cancel-status-container').addClass('timeout-cancel'); // 未支付取消
    }else if(cancelDetailObj.cancelType == 7){
        cancelText = '车辆都在忙，已取消订单';
        $('.cancel-status-container').addClass('timeout-cancel');
    }
    $('.cancel-status-container .result').html(cancelText);
}

//显示行程信息
function showJourneyInfo(journeyInfoObj) {
	 var departName = journeyInfoObj.upRegion + '·' + journeyInfoObj.departTitle;
	 var arriveName = journeyInfoObj.downRegion + '·' + journeyInfoObj.arriveTitle;
	 if (departName.length>16){
		 departName = departName.substr(0,16)+"...";
	 }
	 if (arriveName.length>16){
		 arriveName = arriveName.substr(0,16)+"...";
	 }
    var _rightHtml = '<div>'+ journeyInfoObj.numbers +'人</div><div>'+ switchCarType() +'</div>'

    $('.journey-container .time-box').html('出发时间：' + formatTime('yyyy-MM-dd hh:mm',journeyInfoObj.departTime));
    $('.station-box .depart').html(departName);
    $('.station-box .arrive').html(arriveName);
    $('.station-box .right .box').html(_rightHtml);
    $('.notes-box .notes').html(journeyInfoObj.remark);
}

//转换车型
function switchCarType() {
    // <!-- 1 舒适 2 商务 3 豪华型-->
    // <!-- 1 舒适 2 商务 3 豪华型-->
    var carType = '';

    if (journeyInfoObj.departType==1){
        carType = "实时订单";
    }
    else if(journeyInfoObj.departType==2){
        carType = "预约";
    }
    else if(journeyInfoObj.departType==3){
        carType = "拼车";
    }
    else if(journeyInfoObj.departType==4){
        if (journeyInfoObj.carTypeId==1){
            carType = "舒适型";
        }
        else if (journeyInfoObj.carTypeId==2){
            carType = "豪华型";
        }
        else if (journeyInfoObj.carTypeId==3){
            carType = "七座商务型";
        }
        else{
            carType = "舒适型";
        }
    }
    else{
        carType = "拼车";
    }

    return carType;
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

$('.btn-group .protrude').on(clickEvent,function () {
    var param = {
        departLng:$('#departLng').val(),
        departLat:$('#departLat').val(),
        arriveLng:$('#arriveLng').val(),
        arriveLat:$('#arriveLat').val(),
        departAreaCode:$('#departAreaCode').val(),
        arriveAreaCode:$('#arriveAreaCode').val(),
        departTitle:$('#departTitle').val(),
        arriveTitle:$('#arriveTitle').val(),
        departRegionName:$('#departRegionName').val(),
        arriveRegionName:$('#arriveRegionName').val(),
    }
    window.sessionStorage.setItem('callCarInfo',JSON.stringify(param));
    window.location.href = '/hail/innerCity/order/innerCityService';
})

$('.btn-group .normal').on(clickEvent,function () {
    //清空缓存
    window.sessionStorage.removeItem('callCarInfo');
    window.location='/hail/interCityIndex';
})

