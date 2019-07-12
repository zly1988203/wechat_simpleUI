// 时间戳转换时间
function timedat(res){
    var time = new Date(res);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var M = '';
    if(m <=9){
        M = "0"+m;
    }else {
        M = m;
    }
    var D = '';
    if(d <= 9){
        D = "0"+d;
    }else {
        D = d;
    }
    
    var param = {
        transfDate :M+'月'+D+'日',
        standardDate:y+'-'+M+'-'+D,

    }

    return param;
};

// 时间戳转换时间
function timeTransfHour(res){
    var time = new Date(res);
    var h = time.getHours();
    var m = time.getMinutes();
    if(h <= 9){
        h = "0"+h;
    }
    if(m <= 9){
       m = "0"+m;
    }
    return h+':'+m;
};

// 根据日期获取星期
function getWeek(timedat) {
    var week;
    if(timedat.getDay() == 0) week = "周日";
    if(timedat.getDay() == 1) week = "周一";
    if(timedat.getDay() == 2) week = "周二";
    if(timedat.getDay() == 3) week = "周三";
    if(timedat.getDay() == 4) week = "周四";
    if(timedat.getDay() == 5) week = "周五";
    if(timedat.getDay() == 6) week = "周六";
    return week;
}

$('.btn-back').on('click',function () {
    window.history.go(-1);
})


function loadQrcodeInfo() {
    var succ_event = function (res) {
            if(res.code == 0){
                if(null != res.data ){
                    //0 流水般
                    var hasRunningWater = res.data.hasRunningWater;
                    var ticketList = res.data.ticketList;
                    if(ticketList.length > 0){
                        drawQrcode(ticketList,hasRunningWater);
                    }else {
                        $.toast('未查询到数据');
                        return;
                    }

                }else {
                    $.toast('系统数据异常');
                    return;
                }

            }else{
                $.toast('系统数据异常');
                return;
            }
    }
    var orderNo =  getParam('orderNo',window.location.href);
    var url = SERVER_URL_PREFIX + '/busTicketOrder/check';
    var param = {
        orderNo:orderNo
    }
    $.ajaxService({
        url:url,
        data:param,
        success:succ_event
    })
}

function drawQrcode(list,hasRunningWater) {
    if(list.length > 1){
        $('.swiper-pagination').show();
    }else {
        $('.swiper-pagination').hide();
    }

    list.forEach(function (item,index) {
        let paramDate = timedat(parseInt(item.departDate));
        var transfDate = paramDate.transfDate;
        let departWeek = getWeek(new Date(paramDate.standardDate));
        var timeDesHtml = '';
        if(hasRunningWater == '1'){
            timeDesHtml = '<span class="des">（流水班，来车即可上）</span>'
        }else {
            let departTime = timeTransfHour(parseInt(item.departTime));
            timeDesHtml = departTime + ' 发车'
        }
        var status_css = 'ticket-status-uncheck';
        if(item.status == 1){
            status_css = 'ticket-status-uncheck';
        }else if(item.status == 4){
            status_css = 'ticket-status-alrdcheck';
        }else if(item.status == 2){
            status_css = 'ticket-status-alrdrefund';
        }

        var ticket_head = ' <div class="order-info">' +
            '        <div class="station-info">' +
            '                <div class="station-start">'+item.departStation+'</div>' +
            '                <div class="icon-arrow"></div>' +
            '                <div class="station-end">'+item.arriveStation+'</div>' +
            '        </div>' +
            '    <div class="fff-line"></div>' +
            '    <div class="start-time" id="departTimeHtml">'+transfDate+'  ('+ departWeek +')  '+timeDesHtml+' </div>' +
            '    <!--<div class="start-time">2019-05-08  发车</div>-->' +
            '        <div class="ticket-status '+status_css+'"></div>' +
            '' +
            '</div>';

        var serialNo = undefined != item.ticketSerialNo?item.ticketSerialNo:'暂无票号';
        var personHtml = '';
        if(undefined != item.idCardNo){
            personHtml = '<div class="person-info">乘车人：<span id="passengerName">'+item.passengerName+'</span>  ' +
                            '<span id="idCardCode">'+item.idCardNo+'</span></div>' ;
        }

        var sliderHtml =  '   <div class="swiper-slide">' +ticket_head +
            '                    <div class="order-check">' +
            '                        <div class="prompt">向验票员/扫码机展示二维码验票</div>' +
            '                        <div id="_qrcode'+item.id+'" class="qr-code"></div>' +
            '                        <div class="check-code">票号：<span id="ticketSerialNo">'+serialNo+'</span></div>' +
                                        personHtml +
            '                        <div class="ccc-line"></div>' +
            '                        <div class="check-info">' +
            '                            <div class="check-item">' +
            '                                <div class="title">' +
            '                                    <span>检票口</span>' +
            '                                </div>' +
            '                                <div class="txt">' +
            '                                    <span id="ticketCodeId">/</span>' +
            '                                </div>' +
            '                            </div>' +
            '                            <div class="check-item">' +
            '                                <div class="title">' +
            '                                    <span>票种</span>' +
            '                                </div>' +
            '                                <div class="txt">' +
            '                                    <span id="ticketPrice">'+item.itemName+'</span>' +
            '                                </div>' +
            '                            </div>' +
            '                            <div class="check-item">' +
            '                                <div class="title">' +
            '                                    <span>座位</span>' +
            '                                </div>' +
            '                                <div class="txt">' +
            '                                    <span>/</span>' +
            '                                </div>' +
            '                            </div>' +
            '                        </div>' +
            '                    </div>' +
            '                       <div class="slider-index">'+(index+1)+'/'+(list.length)+'</div>'+
            '                </div>';

        $('.swiper-wrapper').append(sliderHtml);
        if(undefined != item.ticketSerialNo){
            var qrcodeId = "_qrcode"+item.id;
            var qrcode = new QRCode($('#'+qrcodeId)[0]);
            qrcode.makeCode(item.ticketSerialNo + '');
        }

    })
    if(list.length <= 1){
        $('.slider-index').hide();
    }
    swTicketQrcode();
}

/**
 * 查询字符串上的指定值
 * @param key
 * @param strURL
 * @returns {string}
 */
function getParam(key, strURL) {
    strURL = strURL || window.location.search;
    return new RegExp("(^|\\?|&)" + key + "=([^&]*)(\\s|&|$)", "i").test(strURL) ?
        decodeURIComponent(RegExp.$2.replace(/\+/g, " ")) : "";
}
function swTicketQrcode(){
    /** 轮播图*/
    var sw = new Swiper('.swiper-container', {
        spaceBetween: 10,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        // slidesPerView: false,
        // centeredSlides: true,
        // paginationClickable: true,
        autoplay: false,//可选选项，自动滑动
    });
}


$(function () {
    var origin =  getParam('origin',window.location.href);
    if(undefined != origin && origin == 'sms'){
        $('.footer').hide();
    }
    loadQrcodeInfo();
})