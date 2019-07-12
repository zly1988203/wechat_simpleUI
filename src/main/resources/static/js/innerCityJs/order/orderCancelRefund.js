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
};

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
var clickEvent = isAndroid()?'tap':'click';
$(function () {
    showCancelDetail(cancelDetailObj);
    backtoUrl('/passenger/innerCityOrder.html');
    showJourneyInfo(journeyInfoObj);
});

//显示退款详情
function showCancelDetail(cancelDetailObj) {
    var _html = '';
    _html += '<div class="title">退款详情</div>';

    //特价活动
    var _specialHtml = '';
    if(cancelDetailObj.specialActivityType != '0'){
        if(cancelDetailObj.specialActivityType == '1' && cancelDetailObj.specialPrice != '0' ){
            _specialHtml += '<li>' +
                '   <div class="name"> 特价优惠</div>' +
                '   <div class="value">-'+ cancelDetailObj.specialPrice +'元</div>' +
                '</li>'
        }
    }

    var _couponHtml = '';
    if(cancelDetailObj.couponPrice != '0'){
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
    _html += '<div class="refund-notes-box">' +
        '                    <textarea class="notes" id="message-1" placeholder="取消原因（选填）" maxlength="200"></textarea>' +
        '                    <div class="compute"><span class="current">0</span>/<span class="max">200</span></div>' +
        '                </div>';
    _html += '</div>';

    $('.cancel-detail-container').html(_html);

    //字数统计
    /*$('.compute .max').html($('.refund-notes-box textarea').attr('maxlength'));
    $('.refund-notes-box textarea').on('input',function () {
        $('.compute .current').html($(this).val().length);
    });*/

    //字数统计
    $('.compute .max').html($('.refund-notes-box textarea').attr('maxlength'));
    $('#message-1').on('input', function() {
        var param = $(this).val();
        var maxLength = $(this).attr('maxlength');
        //去掉表情
        var regRule = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
        if(regRule.test(param)) {
            param = param.replace(regRule, "");
            $("#message-1").val(param);
        }
        var length = $(this).val().length;
        if(length <= maxLength) {
            $('.compute .current').html($(this).val().length);
        }
    });
}

// 确定退款
$("#refund").on("click",function(){
    var message = $("#message-1").val();
    var maxLength = $("#message-1").attr('maxlength');
    /*if(message==''){
        $.alert("退款原因不能为空");
        return;
    }*/
    if(message.length > maxLength){
        $.toast("退款原因字数过多");
        return;
    }

    var orderNo=$('#orderNo').val();
    $.dialog({
        title: "提示",
        text: '确定发起退款？',
        buttons: [{
            text: "取消",
            onClick: function() {
                console.log('btn 1');
            }
        }, {
            text: "确定",
            onClick: function() {
                $.post("/innerCity/order/refund",{orderNo:orderNo,message:$("#message-1").val()},function(result){
                    if(result.code==0){
                        $.alert(result.message);
                        location.href='/innerCity/order/toOrderReturnDetailPage?orderNo='+orderNo;
                    }else{
                        $.dialog({
                            title: "提示",
                            text: result.message,
                            buttons: [{
                                text: "取消",
                                onClick: function() {
                                    console.log('btn 1');
                                }
                            }, {
                                text:"联系客服",
                                onClick: function() {
                                    location.href="tel:"+$('#tel').val();
                                }
                            }]
                        });
                    }
                },'json');
            }
        }]
    });
});

//暂不退款
$('#notRefund').on(clickEvent,function(){
    location.href="/innerCity/order/toOrderDetail?orderNo=" + $('#orderNo').val();
});

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

function switchCarType() {
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

function dateFtt(fmt,date)
{ //author: meizz
    var o = {
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