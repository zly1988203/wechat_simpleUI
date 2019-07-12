//车票状态
var TICKET_STATUS = {
    CHECKED: '1', // 已验票
    REFUNDED: '3', // 已退票
    TO_RIDE: '2', // 待乘车
};
var userInfo = JSON.parse(localStorage.getItem("userInfo"));
$(function () {
    //    TODO 倒计时
    //加载用户信息
    if (isEmpty(userInfo)) {
        initUserInfo(function () {
            init();
            hideOptionMenu(); // 隐藏分享
            setTimeout(function(){
                $('title').html("电子票-"+userInfo.providerName);
            },800)
        });
    }
    else {
        init();
        hideOptionMenu(); // 隐藏分享
        setTimeout(function(){
            $('title').html("电子票-"+userInfo.providerName);
        },800)
    }
});

function init() {
    userInfo = JSON.parse(localStorage.getItem("userInfo"));
    queryDetailByOrderNo(function (data) {
        var eleObj = createElementObj(data);
        showElement(eleObj);
    });

}

function getElementToPageTop(el) {
    if(el.parentElement) {
        return this.getElementToPageTop(el.parentElement) + el.offsetTop
    }
    return el.offsetTop
}


function setFooterPosition() {
    var body = document.documentElement.clientHeight;
    var heightTop = getElementToPageTop(document.getElementById('heightPoint'));
    if ((heightTop+100) >= (body)){
        $('footer').css({'position':'relative','margin-top': '2rem'});
    }else {
        $('footer').css({'position':'fixed'});
    }
}

function showElement(obj) {
    if(!isEmpty(obj)){
        var parent = $('.order-content');

        obj.forEach(function (item) {
            var orderTop = '<div class="order-top">' +
                '  <div class="head">' +
                '    <div class="time">'+ formatDateToString(new Date(item.ticketTime), true) +'</div>' +
                '    <div class="line-name">'+ item.scheduleCode +'</div>' +
                '    <div class="license-plate">'+ item.carNo +'</div>' +
                '  </div>' +
                '  <div class="station">' +
                '    <div class="station-item departure">'+ item.departCity + item.departStation +'</div>' +
                '    <div class="station-item arrival">'+ item.arriveCity + item.arriveStation +'</div>' +
                '</div>' +
                '</div>';
            var checkAnimat = '<div class="checkanimat"></div>';
            var orderBottom = '<div class="order-bottom"></div>';
            var orderItem = '<div class="order-item">' +
                orderTop + checkAnimat + orderBottom +
                '</div>';
            $(parent).append(orderItem);

            showTicketList(item.ticketInfoList);

            var ifQuickCheck = getUrlParams().ifQuickCheck;
            if(ifQuickCheck == '1'){
                //动态电子票
                $('.checkanimat').flightChart({
                    flights: ['/res/images/bus/check-animat/01.png', '/res/images/bus/check-animat/02.png', '/res/images/bus/check-animat/03.png',
                        '/res/images/bus/check-animat/04.png', '/res/images/bus/check-animat/05.png', '/res/images/bus/check-animat/06.png',
                        '/res/images/bus/check-animat/07.png', '/res/images/bus/check-animat/08.png'],
                    flightSpeed: 3,
                    text: item.code
                });
            }else{
                $('.checkanimat').hide();
            }

            // x渲染完页面渲染底部
            setTimeout(function () {
                setFooterPosition();
                // footer高度56
            },0)
        });
    }
}

/**
 * 返回的数据整理成显示的对象
 * @param data
 * @returns {Array}
 */
function createElementObj(data) {
    var resultObj = [];
    var ticketInfoList = [];
    var orderNoList = [];
    if(!isEmpty(data)){
        data.forEach(function (item) {
            var re = {};

            //如果不存在，放整体,存在放关键信息
            if(orderNoList.includes(item.orderNo)) {
                ticketInfoList.push ({
                    verifyCode: item.verifyCode,
                    idCardNo: item.idCardNo,
                    passengerName: item.passengerName,
                    ticketSerialNo: item.ticketSerialNo,
                    status: item.ticketStatus,
                    });
                re.ticketInfoList = ticketInfoList;
            }else{
                orderNoList.push(item.orderNo);
                re = item;
                ticketInfoList.push({
                    verifyCode: item.verifyCode,
                    idCardNo: item.idCardNo,
                    passengerName: item.passengerName,
                    ticketSerialNo: item.ticketSerialNo,
                    status: item.ticketStatus,
                });
                re.ticketInfoList = ticketInfoList;
                resultObj.push(re);
            }
        })
    }
 return resultObj;
}
// 接口查询
function queryDetailByOrderNo(callback) {
    var reqUrl = SERVER_URL_PREFIX + '/busTicket/queryDetailByOrderNo';
    var paramObj = getUrlParams();
    var dataObj = {
        token: paramObj.token,
        orderNo: paramObj.orderNo,
        departDate:paramObj.departDate,
    };
    dataObj = genReqData(reqUrl, dataObj);
    $.ajax({
        url: reqUrl,
        type: 'POST',
        data: dataObj,
        dataType: 'JSON',
        success: function (res) {
            res = $.parseJSON(res);
            if(res.code == '0'){
                if(callback && typeof callback == 'function'){
                    callback(res.data)
                }

                //倒计时
                var departDate = new Date(res.data[0].ticketTime);
                var now = new Date(res.timestamp);
                countDown(now,departDate);
            }
        }
    })
}

/**
 *  倒计时
 * @param now
 * @param end
 */
function countDown(nowTime, endTime) {
    var count = format((endTime.getTime() - nowTime.getTime())/1000);
    var auto = setInterval(function () {
        if(count.second > 0) {
            count.second--;
        } else {
            if(count.minute > 0) {
                count.minute--;
                count.second = 59;
            } else {
                if(count.hour > 0) {
                    count.hour--;
                    count.minute = 59;
                    count.second = 59;
                } else {
                    count.second = 0;
                    clearInterval(auto);
                }
            }
        }
        fullCount(count);
    },1000);
}

/**
 * 倒计时
 * @param count
 */
function fullCount(count) {
    var el = $('.header-tips');
    if (undefined == count.hour){
        count.hour = 0;
    }
    if (undefined == count.minute){
        count.minute = 0;
    }
    if(count.hour<=0 && count.minute<=0 && count.second<=0 ){
        $(el).hide();
        return;
    }

    var text = '还剩'+ count.hour + '小时'+ count.minute +'分'+ count.second +'秒上车';
    $(el).text(text);
    $(el).show();
}
/**
 * 获取页面参数：url的参数
 * @returns {{}}
 */
function getUrlParams() {
    //获取页面参数
    var localUrl = window.location.href;

    var resultParams = {
        orderNo: getParam('orderNo',localUrl),
        departDate: getParam('departDate',localUrl),
        token: $.cookie('token'),
        ifQuickCheck: getParam('ifQuickCheck',localUrl),
    };
    return resultParams;
}

/**
 * 显示验票信息
 * @param ticketList
 */
function showTicketList(ticketList){
    var parent = $('.order-bottom');

    var itemHtml = '';
    var listIndex = '';
    ticketList.forEach(function (item ,index) {
        var ticketInfo = '';
        if(!isEmpty(item.idCardNo)){
            ticketInfo = '<div>姓名：'+ item.passengerName +'</div>' +'<div>身份证：'+ item.idCardNo +'</div>' ;
        }
        itemHtml += '<li data-status="'+ item.status +'">' +
            '  <div class="check-in-tips">验票码</div>' +
            '  <div class="check-in-code">'+ item.verifyCode +'</div>' +
            '  <div class="ticket-info">' +
            '    <div>票号：'+ item.ticketSerialNo +'</div>' + ticketInfo +
            '  </div>' +
            '  <div class="status '+ getStatusClassName(item.status) +'"></div>' +
            '</li>';

        if(index == 0){
            listIndex += '<span class="active"></span>'
        }else{
            listIndex += '<span></span>'
        }
    });
    if(ticketList.length <= 1){
        var sliderHtml = '<div class="slider-box" style="height:3.3rem;">' +
            '<div class="ticket-list slider">' +
            '  <ul class="slider-main clearfloat">' +
                 itemHtml +
            '  </ul>' +
            '</div>' +
            '</div>';
    }else{
        var sliderHtml = '<div class="slider-box" style="height:3.6rem;">' +
            '<div class="ticket-list slider">' +
            '  <ul class="slider-main clearfloat">' +
                 itemHtml +
            '  </ul>' +
            '</div>' +
            '<div class="list-index">'+ listIndex +'</div>' +
            '</div>';
    }

    $(parent).append(sliderHtml);

    //获取slider宽度，设置样式
    var width = $('.order-bottom').width();//单个宽度
    $('.slider-main li').width(width + 'px');
    $('.slider').width(width + 'px').css({'overflow':'hidden'});//可视窗
    $('.slider-main').width(width * ticketList.length + 'px');

    //轮播功能
    sliderCheckNo(ticketList.length, width);
}
/**
 * 滑动切换验车码
 */
function sliderCheckNo(amount,width) {
    var visibleIndex = 1;// 当前可见li 的index 默认为1
    var now = $('.slider-main');//
    var startX, startY, moveEndX, moveEndY, X, Y;
    $('.slider-main li').on('touchstart',function (e) {
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY;
    });
    $('.slider-main li').on('touchend',function (e) {
        moveEndX = e.changedTouches[0].pageX;
        moveEndY = e.changedTouches[0].pageY;
        X = moveEndX - startX;
        Y = moveEndY - startY;
        if(Math.abs(X) > Math.abs(Y) && X > 0){
            //right
            if(visibleIndex > 1){
                visibleIndex--;
                now.css({'left': -width*(visibleIndex-1) +'px'});
            }else{
                // 觉得没必要
                // now.css({'left': -width*(amount-1) + 'px'});
                // visibleIndex = amount;
            }
        }else if (Math.abs(X) > Math.abs(Y) && X < 0){
            //left
            if(visibleIndex < amount){
                visibleIndex++;
                now.css({'left': -width*(visibleIndex-1)+'px'});
            }else{
                // 觉得没必要
                // now.css({'left': '0px'});
                // visibleIndex = 1;
            }
        }
        //index指示样式改变
        var currentEle = $('.list-index').children('span')[visibleIndex-1];
        $(currentEle).addClass('active').siblings().removeClass();
    })
}

function getStatusClassName(status){
    var className = '';
    if(status == TICKET_STATUS.CHECKED){
        className = 'checked';
    }else if(status == TICKET_STATUS.REFUNDED){
        className = 'refunded';
    }else if(status == TICKET_STATUS.TO_RIDE){
        className = 'toride';
    }
    return className
}

// 返回
$('#goBack').on('click', function () {
    window.history.go(-1);
})