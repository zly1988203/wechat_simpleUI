$(function () {
    progress();

    //分享活动
    $('[trigger-target]').on('click', function () {
        var target = $(this).attr('trigger-target');
        $(target).show();
        var content=$('#shareContent').val();

        //分享行程
        var shareObj = {
            url : window.location.href,
            activityId : $('#activityId').val(),
            logo : $('#shareImg').val(),
            desc : content,
            title:$('#shareTitle').val()
        }
        wxActivityConfig(shareObj);
    });
    $('[trigger-hide]').on('click', function () {
        var target = $(this).attr('trigger-hide');
        $(target).hide();
    });

    //tabs
    $('.tabs li a').on('click', function () {
        var $el = $(this).parent();

        //点击增加active
        $el.addClass('active');
        $el.siblings().removeClass('active');

        //显示对应列表
        var $target = $($el.data('target'));
        $target.show();
        $target.siblings().hide();
    });
    $('.tabs li.active a').click();

    //list box: 显示全部
    $('.line-list-box .more').on('click', function () {
        var $el = $(this),
            $parent = $el.parent(),
            toggle = $el.data('toggle');

        if(!toggle) {
            $parent.addClass('all');
            $el.text('收起全部').data('toggle', true);
        } else {
            $parent.removeClass('all');
            $el.text('展开全部').data('toggle', false);
        }
    });

    $('.line-list-box .content').on('click',function(){
        var type=$(this).attr('data-type');
        var lineId=$(this).attr('line-id');
        if(type != 3){
            location.href = '/activityLine/activityLineList?lineId='+lineId+'&lineType='+ type + '&token=' + $.cookie('token');
        }else{
            window.location.href = '/interCityIndex?lineId='+lineId+'&lineType='+type;
        }
    });
    $('.sellTicket').off().on('click',function(){
        var type=$(this).attr('data-type');
        var lineId=$(this).attr('line-id');
        var lineName=$(this).attr('line-name');
        if(type == 1){
            location.href = '/cityBus/lineListCityBus?lineId='+ lineId +'&&token='+ $.cookie('token') +'&&lng=&&lat=&lineName='+lineName+'&&lineType=' + type;//定制班线优化之后的地址
        }else if(type != 3){
            location.href = '/activityLine/activityLineList?lineId='+lineId+'&lineType='+type;//定制班线优化之前的地址
        }else{
            location.href = '/interCityIndex?lineId='+lineId+'&lineType='+type;
        }
    });
});

/*
* 进度条
* */
var orderNo = $('#orderNo').val();
function progress() {
    var  orderNoHasFetchedCount =$('#orderNoHasFetchedCount').val();
    var remainCount =$('#remainCount').val(); //活动剩余名额
    var activityStatus=$('#activityStatus').val(); //活动状态
    var userHasFetchedCount=$('#userHasFetchedCount').val();  //已领取份数
    var everyNum=$('#activityEveryNum').val();   //总领取数
    var startDate=$("#startDate").val();
    var endDate=$("#endDate").val();
    var maxNum=$('#activityMaxNum').val(); //活动总名额
    var totalBuyPrice=$('#totalBuyPrice').val()// 活动期间已消费的金额
    var myDate = new Date();
    var currentTime=myDate.getFullYear()+"/"+(myDate.getMonth()+1)+"/"+myDate.getDate();
    if(new Date(startDate)>new Date(currentTime) || activityStatus==0){  //活动还未开始
        $('.progress').attr("class","progress disabled");
        $('.progress-info #span2').html("活动暂未开始，敬请期待");
        $('#fetchCoupon').attr("class","btn disabled");
    }else if(new Date(endDate)<new Date(currentTime) || activityStatus!=1 || remainCount<=0){  // 已过期/已下架/礼品已被领完  (活动名额已满)
        $('.progress').attr("class","progress disabled");
        $('.progress-info #span2').html("来晚了，礼品已被领完");
    }else{
        $('.progress').attr("class","progress");
        if(activityStatus==1){
            $('.progress-info #span2').html("活动剩余名额："+remainCount);
        }
    }
    /*if(everyNum==0){  //用户领取次数不限，则最大次数=活动总名额
        everyNum=maxNum;
    }*/
      
    //用户领取优惠券已达到上限
    if (everyNum != 0){
    	if(parseInt(userHasFetchedCount)>=parseInt(everyNum)){
            $('.progress').attr("class","progress disabled");
            //$('#fetchCoupon').attr("class","btn disabled");
            $('#fetchCoupon').css("display","none");
        }
    }
    if(orderNo!='' && orderNoHasFetchedCount>0){
        $('.progress').attr("class","progress disabled");
        //$('#fetchCoupon').attr("class","btn disabled");
        $('#fetchCoupon').css("display","none");
    }
    

    $('.progress').each(function (index, item) {
        var $el = $(this),
            $bar = $el.find('.progress-bar'),
            $value = $el.find('.progress-value');
        var amount = $el.data('amount'),
            count = $el.data('count');
        //设置总限额
        var number=operation((everyNum*amount),(userHasFetchedCount*amount),2,'subtract');
        if(count<=0){
            count=0;
        }else if(everyNum!=0 && userHasFetchedCount>=everyNum){
            count=0;
        }else if(count>=number){
            count=number;
        }
        if(amount == 0) {
            //总数为0
            percent = 100;
        } else {
            percent = count / amount * 100;
        }

        $bar.css('width', percent + '%');

        $value.text(count + '/' + amount + '元');
    });


}

var hasLogin = $('#hasLogin').val();
if(hasLogin == 1){
    queryCouponInfo();
    //查询用户是否关注了公众号
    cheUserQrcFocusOn();
}

function cheUserQrcFocusOn(){
    var token = $.cookie("token");
    var url = SERVER_URL_PREFIX + '/qrcFocus/userOathDetail';
    $.post(url,{token:token},function(result){
        if(result.code == 0){
            var baseUserOath = result.data.baseUserOath;
            var subscribe = baseUserOath.subscribe;
            var providerInfo = result.data.providerInfo;
            if(subscribe == 0){
                $('#wechatQrc').attr('src',providerInfo.wechatQrcodeUrl);
                var focusAttention = '关注' + providerInfo.providerName +'</br>享受更多出行优惠';
                $('#provider').html(focusAttention);
                $('#qrcFocuson').show();

            }
        }
    },'json');
}

//ajax请求查询优惠券领取情况
function queryCouponInfo(){
    $.ajax({
        type: 'POST',
        url: '/buyActivity/queryUserCoupons',
        data: {activityId:$('#activityId').val()},
        dataType:  'json',
        success: function(data){
            if(data.code ==0){
                var couponList = data.data.list;
                if(couponList.length>0){
                    var html = '';
                    //'0-平台通用 1-同城 2-城际 3-出租车 4-大巴线路 5-城际班车券 6-汽车票' 7-上下班券' 8 扫码支付 9 旅游线路 10网约车 11 城际网约车 12 同城网约车
                    var business = [
                        '平台通用券',
                        '同城',
                        '城际约租车',
                        '出租车',
                        '定制班线券',
                        '大巴城际',
                        '汽车票',
                        '上下班券',
                        '',
                        '旅游班线券',
                        '网约车券',
                        '城际网约车',
                        '同城网约车'
                    ];
                    for(var i=0;i<couponList.length;i++){
                        var coupon = couponList[i];

                        var businessType = coupon.tripType;
                        if(businessType==null){
                            businessType = 0;
                        }
                        if(businessType==17){
                            businessType = 11;
                        }
                        if(businessType==18){
                            businessType = 12;
                        }
                        var businessName = business[businessType];
                        var endTime=getLocalTime5(coupon.endTime);
                        var startTime=getLocalTime5(coupon.startTime);
                        html += '<div class="item">';
                        html += '<div class="left">';
                        html += '<h2>'+businessName+'</h2>';
                        if(coupon.startTime!=undefined){
                            html += '<h4>有效期<br/>'+startTime+'~'+endTime+'</h4>';
                        }else{
                            html += '<h4>有效期至'+endTime+'</h4>';
                        }

                        if(coupon.limitLine != undefined){
                            html += '<p>限线路 '+ coupon.limitLine+'</p>';
                        }
                        html += '</div>';

                        if(coupon.isDiscount == '0'){
                            // 金额券
                            html += '<div class="right">';
                            html += '<h2><i>¥</i>'+coupon.amount+'<i></i></h2>';
                            if(coupon.minLimitAmount>0){
                                html += '<h4>'+coupon.remark+'</h4>';
                            }
                        }else if(coupon.isDiscount == '1'){
                            // 折扣券
                            html += '<div class="right">';
                            html += '<h2>'+coupon.amount+'<i>折</i></h2>';
                            if(coupon.limitDiscountMoney>0){
                                html += '<h4>最高抵扣'+coupon.limitDiscountMoney+'元</h4>';
                            }
                        }


                        html += '</div></div>';
                    }
                    $('#fetchedDetail').html(html);
                    $('.coupon').css("display","block");
                }
            }
        }
    });
}

$('#fetchCoupon').on('click',function(){

    $.showLoading('请稍等');
    //请求获取优惠券
    $.ajax({
        type: 'POST',
        url: '/buyActivity/fetchCoupon',
        data: {
            activityId: $('#activityId').val(),
            orderNo: $('#orderNo').val()
        },
        dataType:  'json',
        success: function(data){
            if(data.code ==0){
                //领取优惠券成功
                $('#receive').show();
            }else{
                $.hideLoading();
                $.dialog({
                    title: "提示",
                    text: data.message,
                    buttons: [{
                        text: '我知道了',
                        onClick: function() {
                            location.reload();
                        }
                    }]
                });
            }
        }
    });
})
$('#iKonw').on('click',function(){
    //领取优惠券成功
    $.hideLoading();
    $('#receive').hide();
    history.go(0);
    //location.reload();
})

$('#login').on('click',function(){
    var fromUrl = window.location.href;
    fromUrl = fromUrl.substring(CURRENT_SERVER.length,fromUrl.length);
    var exp = new Date();
    exp.setTime(exp.getTime() + 60 * 1000 * 10);
    $.cookie('fromUrl',fromUrl,{expires: exp, path: '/' });
    location.href = '/regOrLogin';
})
function operation(a, b, digits, op) {
    var o1 = toInteger(a)
    var o2 = toInteger(b)
    var n1 = o1.num
    var n2 = o2.num
    var t1 = o1.times
    var t2 = o2.times
    var max = t1 > t2 ? t1 : t2
    var result = null
    switch (op) {
        case 'add':
            if (t1 === t2) { // 两个小数位数相同
                result = n1 + n2
            } else if (t1 > t2) { // o1 小数位 大于 o2
                result = n1 + n2 * (t1 / t2)
            } else { // o1 小数位 小于 o2
                result = n1 * (t2 / t1) + n2
            }
            return result / max
        case 'subtract':
            if (t1 === t2) {
                result = n1 - n2
            } else if (t1 > t2) {
                result = n1 - n2 * (t1 / t2)
            } else {
                result = n1 * (t2 / t1) - n2
            }
            return result / max
        case 'multiply':
            result = (n1 * n2) / (t1 * t2)
            return result
        case 'divide':
            result = (n1 / n2) * (t2 / t1)
            return result
    }
}
function toInteger(floatNum) {
    var ret = {times: 1, num: 0}
    var isNegative = floatNum < 0
    if (isInteger(floatNum)) {
        ret.num = floatNum
        return ret
    }
    var strfi  = floatNum + ''
    var dotPos = strfi.indexOf('.')
    var len    = strfi.substr(dotPos+1).length
    var times  = Math.pow(10, len)
    var intNum = parseInt(Math.abs(floatNum) * times + 0.5, 10)
    ret.times  = times
    if (isNegative) {
        intNum = -intNum
    }
    ret.num = intNum
    return ret
}
function isInteger(obj) {
    return Math.floor(obj) === obj
}