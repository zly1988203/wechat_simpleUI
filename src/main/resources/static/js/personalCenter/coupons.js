var options_enab = {
    number: 1,  // 页码
    flag: false ,// 事件锁
    pageSize:10,
};
var e_tap = isAndroid()?'tap':'click';
var dbRequest_enab={};

$('#coupon-rule').on(e_tap,function () {
    $('#ruleContent').show()
})

$('#ruleContent .cancel').on(e_tap,function () {
    $('#ruleContent').hide();
})

$('#view_disCoupons').on(e_tap,function () {
    location.href = '/passenger/coupon-expire.html';
})

$('.load-more').on(e_tap,function () {
    queryUserCoupons();
})

var queryUserCoupons = function() {
    //api url
    var urlStr = SERVER_URL_PREFIX+'/Coupon/queryUserCoupons';

    var dataObj = {
        page : options_enab.number,
        // pageSize:options_enab.pageSize
    };
    //merge page param and common param,generate request param
    dataObj = genReqData(urlStr, dataObj);
    $.ajax({
        type: 'POST',
        url:urlStr,
        data:dataObj,
        dataType:  "json",
        success: function(result){
            if(result.code == 0){
                if(!dbRequest_enab[options_enab.number]||dbRequest_enab[options_enab.number]==null){
                    var data = result.data;
                    if(undefined !=data && undefined != data.list &&  data.list <= 0 ){
                        $('.load-more').hide();
                        $('#noCoupons').show();
                    }else{
                        drawingPage(data);
                        var pageCount = data.pageCount;
                        // 销毁分页指示器的逻辑：
                        // 1.假定最大页码是5页, 已经到第5页，移除
                        // 2.假定数据不满一页，没有滚动条时候，移除
                        if (options_enab.number >= pageCount) {
                            $('.load-more').hide();
                        }else {
                            $('.load-more').show();
                        }

                        options_enab.number++; // 页码自增
                        options_enab.flag = false; // 数据渲染完成，事件解锁
                        dbRequest_enab[options_enab.number]=0;
                    }

                    var couponsHeight = $('#enabled-coupons').outerHeight(true);
                    var view_disCouponsH = $('#view_disCoupons').outerHeight(true);
                    if(window.innerHeight > (couponsHeight + view_disCouponsH)){
                        $('#view_disCoupons').css('position','fixed');
                    }else {
                        $('#view_disCoupons').css('position','relative');
                    }
                }
            }
        }
    });
}

var btnToggle_click = function () {
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

function drawingPage(content) {
        var result= content.list;
        var interCityTxt= getValue(content.businessMap.interCityTxt,'城际约租车');
        var busTxt = getValue(content.businessMap.busTxt,'定制班线');
        var commuteTxt = getValue(content.businessMap.commuteTxt,'上下班');
        var busTicketTxt = getValue(content.businessMap.busTicketTxt,'汽车票');
        var travelTxt = getValue(content.businessMap.travelTxt,'旅游班线');
        var onlineCarTxt = getValue(content.businessMap.onlineTxt,'网约车');
        var isInnerCityOnlineTxt = getValue(content.businessMap.isInnerCityOnlineTxt,'同城网约车');
        var isInterCityOnlineTxt = getValue(content.businessMap.isInterCityOnlineTxt,'城际网约车');

        //'1-同城 2-城际 3-出租车 4-大巴线路 5-城际班车券 6-汽车票7-上下班券' 8 扫码支付 9 旅游线路 10网约车  12-城际网约车 11-同城网约车
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
            isInnerCityOnlineTxt,
            isInterCityOnlineTxt,
        ];

        for(var i=0;i<result.length;i++){
            var $couponItem = $('<div class="coupon-item">');
            var $couponType = $('<div class="coupon-type">');
            var data = result[i];

            var businessType = data.tripType;
            var name = data.name;
            if(businessType==null){
                businessType = 0;
            }
            if(businessType==17){
                businessType = 12;
            }
            if(businessType==18){
                businessType = 11;
            }
            var businessName = business[businessType];
            var price = data.amount;
            var minLimitAmount = data.minLimitAmount;
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
                    left = '<div '+ (data.isValid==1 ?" class=left":" class=dis-left") +'>' +
                        '<div class="price">'+price+'<em>折</em></div>' +
                        '<div class="use-rule">'+remark+'</div>' +
                        '</div>';
                }
            }

            var right = '<div class="right">' +
                '<div class="title">'+name+'</div>' +
                '<div class="limit-time">'+dateRange+'</div>' +
                '</div>';

            $couponType.append(left).append(right);
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
                }else {
                    limitText += ' · 仅用于“'+ businessName + '”业务；';
                    limitHtml += '<p> · 仅用于“'+ businessName +'”业务；</p>';
                }
            }else{
                limitText += ' · 平台通用；';
                limitHtml += '<p> · 平台通用；</p>';
            }

            //折扣券最大抵扣金额
            if(isExist(data.isDiscount) && data.isDiscount == '1'){
                if(isExist(data.discountMaxLimitAmount)){
                    limitText += ' · 最高抵扣'+ data.discountMaxLimitAmount + '元；';
                    limitHtml += '<p> · 最高抵扣'+ data.discountMaxLimitAmount +'元；</p>';
                }
            }

            //额外限制条件 1--可以与促销价格共用，2--仅原价购买时可用',文案：不显示和’不可与其他促销同享‘
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
            if(isExist(data.tripType) && (data.tripType=='2' || data.tripType=='10' || data.tripType=='17' || data.tripType=='18') && isExist(data.limitTimeType)){
                //0 不限制时间段  1限制时间段 时间格式"23:59:59"
                if(data.limitTimeType == '1' && isExist(data.limitStartTimeStr) && isExist(data.limitEndTimeStr)){
                    limitText += ' · 仅用于：' + changeTime(data.limitStartTimeStr,1) + ' - ' + changeTime(data.limitEndTimeStr,2) + '；';
                    limitHtml += '<p> · 仅用于：'+ changeTime(data.limitStartTimeStr,1) + ' - ' + changeTime(data.limitEndTimeStr,2) +'；</p>';
                }
            }
            if(limitText.length>0){
                limitText = '范围：' + limitText;
                limitHtml = '<p>范围：</p>' +limitHtml;
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
            $('#enabled-coupons .coupon-list').append($couponItem);
        }
        btnToggle_click();
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
            // $(ele).prev().find('p:last').html(String($(ele).prev().find('p:last').text()).replace('；','。'));
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
function isExist(data) {
    if(typeof data == 'undefined' || data == undefined || data == null || data === ''){
        return false;
    }else {
        return true;
    }
}

// 显示使用规则
function queryRule(){
    $.showLoading();
    var urlStr = SERVER_URL_PREFIX + '/Page';
    //current page param
    var dataObj = {
        type:12,//user guide
    };
    //merge page param and common param,generate request param
    dataObj = genReqData(urlStr, dataObj);

    $.ajax({
        type : 'POST',
        url : urlStr,
        data : dataObj,
        dataType : "json",
        success : function(result) {
            $.hideLoading();
            if(result && result.data){
                $("#ruleContent p").html(result.data);
            }else{
                $.alert((result&&result.message) || "未知错误");
            }
        },
    });
}

$(function() {
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(undefined != userInfo){
        $('title').html('优惠券 - '+ userInfo.providerName);
    }
    $.ruleInit();
    backtoUrl("/index");
    // bindPageEvent();
    $('#enabled-coupons .coupon-list').empty();
    queryUserCoupons();
    queryRule();
});