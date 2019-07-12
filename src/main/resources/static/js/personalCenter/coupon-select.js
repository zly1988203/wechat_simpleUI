var businessParam = {
    // businessType int -1 是 业务类型 1-同城 2-城际 3-出租车 4-大巴线路 5-大巴包车 6-汽车票 7上下班 8 扫码支付 9 旅游线路 10网约车 17-城际网约车 18-同城网约车
    onlineCar : 10,
    busline : 4,
    travel : 9,
    commute : 1,
    busTicket : 6,
    innerCity : 2,
    chartered : 5,
    taxi : 3,
    interCityOnline : 17,
    innerCityOnline : 18
}
var hailInitParam ={
    price:0,
    cityId:0,
    lineId:0,
    specialFlag:0
}
var initOrderHail = function () {
    var orderNo = getQueryString("orderNo");
    var businessType = getQueryString('businessType');
    if(businessType == 17 || businessType == 18){
        var questUrl = SERVER_URL_PREFIX + "/hail/Order/detailInfo";
        var questdata = {
            orderNo: orderNo,
        }
        questdata = genReqData(questUrl, questdata);
        $.ajax({
            type: 'POST',
            url: questUrl,
            data: questdata,
            dataType:  'json',
            success: function(data){
                if(undefined != data && data.code == 0){
                    var content = data.data;
                    if(undefined != content){
                        hailInitParam.cityId = content.departCityId;
                        hailInitParam.lineId = content.cityLineId;
                        hailInitParam.price = content.price;
                        if(content.specialPrice>0){
                            hailInitParam.specialFlag = 1;
                        }
                    }
                }
                queryUserCoupons();
            }
        })
    }else {
        queryUserCoupons();
    }
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 匹配目标参数
    var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
    if (result != null) {
        return decodeURIComponent(result[2]);
    } else {
        return null;
    }
}

var queryUserCoupons = function(){
    var orderNo = getQueryString("orderNo");
    var businessType = getQueryString('businessType');
    var busId = getQueryString('busId');
    var specialFlag = getQueryString('specialFlag');
    var price = getQueryString('price');
    var cityId= getQueryString('cityId');
    var lineId= getQueryString('lineId');


    var url = SERVER_URL_PREFIX + '/Coupon/queryValidConponByBusiness';
    var data = {
        businessType:businessType,
    }
    if (businessType == 17 || businessType == 18){
        data.busId = busId;
        data.price = hailInitParam.price;
        data.specialFlag =  hailInitParam.specialFlag;
        data.cityId = hailInitParam.cityId;
        data.lineId = hailInitParam.lineId;
    	url = SERVER_URL_PREFIX + '/Coupon/queryValidConponByBusinessHail';
    }
    if(businessType == 10 || businessType == 2 || businessType == 17 || businessType == 18){
        data.orderNo = orderNo;
    }else if(businessType == 4 || businessType == 7
        || businessType == 6 || businessType == 3  || businessType == 9){
        data.busId = busId;
        data.price = price;
        data.specialFlag =  specialFlag;
        url = SERVER_URL_PREFIX + '/Coupon/queryBusValidConponByBusiness';
    }
    data = genReqData(url, data);
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        dataType:  'json',
        success: function(data){
            if(undefined != data && data.code == 0){
                var content = data.data;
                if(undefined != content.list && content.list.length > 0){
                    drawingPage(content);
                }else {
                    $('#btnNotUse').show();
                    //无优惠券
                    $('#enabled-coupons').hide();
                    $('#disabled-coupons').hide();
                    $('#noCoupons').show();
                }
            }
        }
    })
}

function drawingPage(content) {
    var result= content.list;
    var interCityTxt= getValue(content.businessMap.interCityTxt,'城际约租车');
    var busTxt = getValue(content.businessMap.busTxt,'定制班线');
    var commuteTxt = getValue(content.businessMap.commuteTxt,'上下班');
    var busTicketTxt = getValue(content.businessMap.busTicketTxt,'汽车票');
    var travelTxt = getValue(content.businessMap.travelTxt,'旅游班线');
    var onlineCarTxt = getValue(content.businessMap.onlineTxt,'网约车');
    var interCityOnlineTxt = getValue(content.businessMap.isInterCityOnlineTxt,'城际网约车');
    var innerCityOnlineTxt = getValue(content.businessMap.isInnerCityOnlineTxt,'同城网约车');
    

    //'1-同城 2-城际 3-出租车 4-大巴线路 5-城际班车券 6-汽车票7-上下班券' 8 扫码支付 9 旅游线路 10网约车 17-城际网约车 18-同城网约车
    //'1-同城 2-城际 3-出租车 4-大巴线路 5-城际班车券 6-汽车票7-上下班券'
    var business = [
        '',
        '同城',
        interCityTxt,
        '出租车',
        busTxt,
        '大巴城际',
        busTicketTxt,
        commuteTxt,
        '',
        travelTxt,
        onlineCarTxt,
        interCityOnlineTxt,
        innerCityOnlineTxt
    ];

    for(var i=0;i<result.length;i++){
        var data = result[i];
        var $couponItem = $('<div class="coupon-item">');
        var $couponType = $('<div class="coupon-type" data-record-id="'+data.recordId+'" data-amount="'+data.amount+'" ' +
            'data-is-discount="'+data.isDiscount+'" data-max-limit-amount="'+data.discountMaxLimitAmount+'">');
        var name = data.name;
        var price = data.amount;
        var minLimitAmount = data.minLimitAmount;
        var businessType = data.tripType;
        if(businessType==null){
            businessType = 0;         
        }
        if (businessType == 17){
        	businessType = 11;
        }
        if (businessType == 18){
        	businessType = 12;
        }
        var businessName = business[businessType];
        var remark =""
        if(minLimitAmount > 0){
            remark = '满'+data.minLimitAmount+'元可用';
        }else{
            remark = data.remark;
        }
        var dateRange = '';
        var endTime=getLocalTime5(result[i].endTime);
        if (data.startTime == undefined) {
            dateRange = '期限：' + endTime;
        } else {
            var startTime=getLocalTime5(result[i].startTime);
            dateRange = '期限：' + startTime + ' ~ ' +  endTime;
        }
        var left = '';
        // 0--固定金额  1--折扣
        if(isExist(data.isDiscount)){
            if(data.isDiscount == '0'){
                left = '<div '+ (data.isValid==1 ?" class=left":" class=dis-left") +'>' +
                    '<div class="price"><em>¥</em>'+price+'</div>' +
                    '<div class="use-rule">'+remark+'</div>' +
                    '</div>';
            }else if(data.isDiscount == '1'){
                left = '<div '+ (data.isValid==1 ?" class=left":" class=dis-left") +' >' +
                    '<div class="price">'+price+'<em>折</em></div>' +
                    '<div class="use-rule">'+remark+'</div>' +
                    '</div>';
            }
        }
        var right = '<div '+(data.isValid==1 ?" class=right":" class=dis-right")+'>' +
            '<div class="title">'+name+'</div>' +
            '<div class="limit-time">'+dateRange+'</div>' +
            '</div>';

        $couponType.append(left).append(right);
        var selectedCoupon = JSON.parse(window.localStorage.getItem('selectedCoupon'));
        //检查优惠券用户是否为当前用户，如果不是当前用，则需要重置
        if(undefined != selectedCoupon){
            var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
        	if (selectedCoupon.userId!=userInfo.id) {
        		selectedCoupon = undefined;
        	}
        }
        if(data.isValid == 1 && undefined != selectedCoupon && selectedCoupon.recordId == data.recordId){
            var $choose = $('<div id="chooseItem" class="choose"></div>');
            $couponType.append($choose);
        }
        $couponItem.append($couponType);

        var $couponDes = $('<div class="coupon-des">');

        var limitText = '';
        var limitHtml = '';

        if(isExist(businessName)){
            // 0 全部城市  1限制城市
            if(isExist(data.limitCityType) && isExist(data.citys)){
                if(data.limitCityType == '1'){
                    limitText += ' · 仅用于“'+ businessName + '”业务中的城市：' + data.citys + '；';
                    limitHtml += '<p> · 仅用于“'+ businessName +'”业务中的城市:'+ data.citys +'；</p>';
                }
            }else if(isExist(data.limitLineType) && isExist(data.limitLine)){
                // 0 没有限制  1--指定可用线路 2--指定不可用线路
                if(data.limitLineType == '1'){
                    limitText += ' · 仅用于“'+ businessName + '”业务中的' + data.limitLine + '等线路；';
                    limitHtml += '<p> · 仅用于“'+ businessName +'”业务中的'+ data.limitLine +'等线路；</p>';
                }else if(data.limitLineType == '2'){
                    limitText += ' · 仅用于“'+ businessName + '”业务中的除了：' + data.limitLine + '的线路；';
                    limitHtml += '<p> · 仅用于“'+ businessName +'”业务中的除了:'+ data.limitLine +'的线路；</p>';
                }
            }else{
                limitText += ' · 仅用于“'+ businessName + '”业务；';
                limitHtml += '<p> · 仅用于“'+ businessName +'”业务；</p>';
            }
        }else {
            limitText += ' · 平台通用；';
            limitHtml += '<p> · 平台通用；</p>';
        }

        //额外限制条件 1--可以与促销价格共用，2--仅原价购买时可用', 文案：不显示和’不可与其他促销同享‘
        // 0-老数据 取supportActType为空时表示'不可与其他促销同享' 支持的活动类型(支持与该活动类型叠加使用),1-买满有礼,2-特价优惠（多个用逗号隔开）'
        if(isExist(data.extraLimit)){
            if(data.extraLimit == '0'){
                if(!isExist(data.supportActType)){
                    limitText += ' · 不可与其他促销同享；';
                    limitHtml += '<p> · 不可与其他促销同享；</p>';
                }
            }else if(data.extraLimit == '2'){
                limitText += ' · 不可与其他促销同享；';
                limitHtml += '<p> · 不可与其他促销同享；</p>';
            }
        }

        //网约车业务 2-城际约车 10-网约车
        if(isExist(data.tripType) && (data.tripType=='2' || data.tripType=='10' ||  data.tripType=='17' || data.tripType=='18') && isExist(data.limitTimeType)){
            //0 不限制时间段  1限制时间段 时间格式"23:59:59"
            if(data.limitTimeType == '1' && isExist(data.limitStartTimeStr) && isExist(data.limitEndTimeStr)){
                limitText += ' · 仅用于：' + changeTime(data.limitStartTimeStr,1) + ' - ' + changeTime(data.limitEndTimeStr,2) + '；';
                limitHtml += '<p> · 仅用于：'+ changeTime(data.limitStartTimeStr,1) + ' - ' + changeTime(data.limitEndTimeStr,2) +'；</p>';
            }
        }

        if(isExist(data.discountMaxLimitAmount)){
            if(data.discountMaxLimitAmount > 0){
                limitText += ' · 最高抵扣' + data.discountMaxLimitAmount + '元；';
                limitHtml += '<p> · 最高抵扣'+ data.discountMaxLimitAmount + '元；</p>';
            }
        }

        if(limitText.length>0){
            limitText = '范围：' + limitText;
            limitHtml = '<p>范围：</p>' + limitHtml;
        }

        var finalText = '';
        var des_content = '';
        if(limitText.length > 15){
            finalText = limitText.slice(0,20) + '...';
            des_content = ' <div class="content" data-text="'+ limitHtml +'"><p>'+finalText+'</p></div>' +
                '<div class="btn-icon" data-top="false"><div class="click-area" ><i></i></div></div>';
        }else{
            finalText = limitText;
            des_content = ' <div class="content"><p>'+finalText+'</p></div>';
        }

        $couponDes.append(des_content);
        $couponItem.append($couponDes);

        if(data.isValid == 1){
            $('#enabled-coupons .coupon-list').append($couponItem);
        }else {
            $('#disabled-coupons .coupon-list').append($couponItem);
        }

    }

    if($('#enabled-coupons .coupon-list').children('.coupon-item').length <= 0){
        $('#enabled-coupons').hide();
    }else{
        $('#enabled-coupons').show();
    }

    if($('#disabled-coupons .coupon-list').children('.coupon-item').length <= 0){
        $('#disabled-coupons').hide();
    }else{
        $('#disabled-coupons').show();
    }
    clickEvent();
    btnToggle_click();
}

//  time:格式hh:mm:ss  type:1-开始时间 2-结束时间
function changeTime(time,type) {
    if(typeof time =='undefined'|| time==undefined || time==null || time==='' || time.length<2){
        return '';
    }else{
        var hour = 0;
        if(type == '1'){
            hour = parseInt(time.substring(0,2));
        }else if(type == '2'){
            hour = parseInt(time.substring(0,2)) + 1;
        }
        return hour+'点';
    }
}

function clickEvent(){
    var href_event = isAndroid()? "tap" : "click";
    $('#enabled-coupons  .coupon-item .coupon-type ').off(href_event).on(href_event,function () {
        $('#enabled-coupons').find('#chooseItem').remove();
        var obj = $(this);
        var $choose = $('<div id="chooseItem" class="choose"></div>');
        $(this).append($choose);
        var data = {
            userId:0,
            isValid:1,
            recordId:$(this).data('record-id'),
            amount:$(this).data('amount'),
            isDiscount:$(this).data('is-discount'),
            discountMaxLimitAmount:$(this).data('max-limit-amount'),
        }
        var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
        data.userId=userInfo.id;
        localStorage.setItem("selectedCoupon",JSON.stringify(data));
        window.location.href = document.referrer;
    })

}

var btnToggle_click = function () {
    var e_tap = isAndroid()?'tap':'click';
    $('.btn-icon').off(e_tap).on(e_tap,function () {
        var _this = $(this);
        if(_this.data('top')){
            $(this).find('.click-area').removeClass('up');
            _this.data('top',false);
            initDetail($(this),_this.data('top'));

        }else{
            $(this).find('.click-area').addClass('up');
            _this.data('top',true);
            initDetail($(this),_this.data('top'));
        }
    })
}

//取消添加
$('#btnNotUse').off('click').on('click', function () {
    var data = {
    	userId:0,
        recordId:0,
        amount:0,
        isValid:0,
        isDiscount:'',
        discountMaxLimitAmount:''
    }
    var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
    data.userId=userInfo.id;
    localStorage.setItem("selectedCoupon",JSON.stringify(data));
    window.location.href = document.referrer;
});

function isExist(data) {
    if(typeof data == 'undefined' || data == undefined || data == null || data === ''){
        return false;
    }else {
        return true;
    }
}

function getValue(value1,value2){
    if(value1 == undefined){
        value1 = value2
    }
    return value1;
}

//初始化优惠券使用说明 flag:true-展开，false-收起  ele:切换的元素
function initDetail(ele,flag) {
    _html = $(ele).prev().data('text');
    if(flag){
        if(ele){
            $(ele).prev().html(_html);
            $(ele).prev().find('p:last').html($(ele).prev().find('p:last').text().toString().replace('；','。'));
        }
    }else{
        var _text = _html.replace(/<p>/g,'').replace(/<\/p>/g,'');
        var finalText = '';
        if(_text.length > 15){
            finalText = _text.slice(0,20) + '...';
        }else{
            finalText = _text + '...';
        }
        if(ele){
            $(ele).prev().html('<p>'+ finalText +'</p>');
        }
    }
}

// 显示使用规则
function queryRule() {

    var urlStr = SERVER_URL_PREFIX + '/Page';
    //current page param
    var dataObj = {
        type: 12,//user guide
    };
    //merge page param and common param,generate request param
    dataObj = genReqData(urlStr, dataObj);

    $.ajax({
        type: 'POST',
        url: urlStr,
        data: dataObj,
        dataType: "json",
        success: function (result) {
            if (result && result.data) {
                $("#ruleContent p").html(result.data);
            } else {
                $.alert((result && result.message) || "未知错误");
            }
        },
    });
}

$(function () {
	var orderNo = getQueryString("orderNo");
	var businessType = getQueryString('businessType');
	if (businessType == 10){
		backtoUrl('/bus/toOnlineCarOrderDetail?orderNo=' + orderNo + '&token=' + $.cookie('token'));
	}
	if (businessType == 18){
		backtoUrl('/hail/bus/toOnlineCarOrderDetail?orderNo=' + orderNo + '&token=' + $.cookie('token'));
	}
    initOrderHail();
    queryRule();
})

