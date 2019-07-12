var BusinessType = {
    //业务类型 1-同城 2-城际 3-出租车 4-大巴线路 5-大巴包车 6-汽车票 7通勤 8 扫码支付 9 旅游线路 10网约车 17-城际网约车 18-同城网约车
      10: "网约车", 4: "定制班线",
     9: "旅游线路", 7: "通勤(上下班)",
     6: "汽车票", 3: "城际约租车",
     5: "预约包车", 3: "出租车",
     17: "城际网约车", 18: "同城网约车"
}

var ticketStatusArr = {
    2:'待乘车',
    1:'已验票',
    3:'已退票'
}

var clickEvent = isAndroid()?'tap':'click';

/** 长按解锁车票
*
* param：
*   el：元素
*   count：时长
*   callback：成功后回调函数
* */
function handleTicket(el, count, callback) {
    /*
    * 创建图层
    * */
    var _html = '<div class="deblocking active">' +
        '<div class="main">' +
        '<div class="progress"><span class="bar"></span></div>' +
        '<div class="content">' +
        '<h4>长按图片' + count + '秒钟，解锁车票</h4>' +
        '<p>车票解锁后将不能退款，请慎重操作</p>' +
        '<div class="thumb longTap"></div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $('body').append(_html);

    /*
    * 关闭弹出层
    * */
    $('.deblocking').off('click').on('click', function (e) {
        if($(e.target).hasClass('deblocking')) {
            $('.deblocking').hide(0, function () {
                $('.deblocking').remove();
            });
        }
    });

    /*
    * signal    最长时间
    * step      步长
    * timeAuto  计时器
    * */
    var _self = el;
    var signal = count * 10,
        step = 100 / signal;
    var timeAuto = null;

    //时间
    if(!_self.data('time')) {
        _self.data('time', 0);
    } else if(_self.data('time') == signal) {
        //已解锁
        $('.progress').show();
        progress(_self.data('time'));
        return false;
    }

    var time = _self.data('time');

    $('.deblocking .longTap').on('touchstart', function (e) {
        $(".deblocking").removeClass("active");
        //如果已经解锁车票，则不触发
        if(!_self.data('lock')) {
            e.preventDefault();

            //初始化，并计时
            time = 0;

            timeAuto = setInterval(function () {
                //到达最长时长，则隐藏进度条
                if(time > signal) {
                    clearInterval(timeAuto);
                    success();
                }

                time++;
                progress(time);

                //持续时间超过100毫秒才展示
                if(time > 1) {
                    $('.progress').show();
                }
            }, 100);
        }
    }).on('touchend', function () {
        $(".deblocking").addClass("active");
        if(!_self.data('lock')) {
            clearInterval(timeAuto);

            //时长少于n秒，则回退到0秒
            if(time < signal) {
                time = 0;
                progress(time);
                $('.progress').hide();
            } else {
                success();
            }
        }
    });

    /*
    * 进度条
    * */
    function progress(t) {
        $('.progress .bar').width(t * step + '%');
    }

    /*
    * 完成
    * */
    function success() {
        time = signal;
        progress(time);
        _self.data('time', signal);
        _self.data('lock', true);

        if(callback instanceof Function) {
            callback();
        }
    }
}

/**
 * 长按解锁车票
 */
function showTicketCode(){
    $('.toCheck').off('click').on('click', function () {
        // dplus.track("行程-出示车票",{
        //     "车企":providerDomin,
        //     "业务":"定制班线/通勤班线",
        //     "页面名称":"行程页",
        // });

        // var commentFlag = $(this).attr('commentFlag');//评价状态 0-无评价 1-立即评价 2-查看评价

        var nowDate  = new Date();
        var year = nowDate.getFullYear();
        var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1): nowDate.getMonth() + 1;
        var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
        var dateStr = year + "-" + month + "-" + day;
        var ticketStatus=$(this).data('ticket-status');// "ticketStatus": 1,[1已验票，2 待验票，3 已退票]
        var ifQuickCheck=$(this).data('quick-check');//1 为使用动态电子票，0 不使用动态电子票]
        var departDate = $(this).data("depart-date");
        var orderNo = $(this).data('order-no');
        var busId = $(this).data('bus-id');
        var orderType = $(this).data('order-type');
        if(formatStringToDate(departDate)<formatStringToDate(dateStr)){
            $.toast('车票已过期，无法出示');
            return ;
        }
        //快速验票不支持解锁未来日期的车票
        if(ifQuickCheck == 1 && formatStringToDate(departDate)>formatStringToDate(dateStr)){
            $.toast('暂不支持解锁未来日期的车票');
        }else{
            if(ticketStatus==2 && ifQuickCheck == 1 ){
                var server_url = '/busTicket/unLockTicketByOrderNo';
                var location_url = '/cityBus/goShowTicket';
                var param = {
                    'token':$.cookie('token'),
                    orderNo:orderNo,
                    busId:busId,
                    departDate:departDate,//通勤使用此参数
                }
                if(orderType == 4 || orderType == 9){
                    server_url = '/busTicket/unLockTicketByOrderNo';
                    location_url = '/cityBus/goShowTicket';
                }else if(orderType == 7){
                    server_url = '/commute/optimized/unLockTicketByOrderNo';
                    location_url = '/commutingBus/checkTicket';
                }

                handleTicket($(this), 1, function () {
                    //todo
                    $.ajax({
                        type : 'POST',
                        url : SERVER_URL_PREFIX + server_url,
                        data : param,
                        dataType : "json",
                        success : function(data) {
                            if(data.code == '0'){
                                $('.deblocking').trigger('click');
                                window.location = location_url + "?busId=" + busId+'&orderNo=' + orderNo + '&departDate=' + departDate + '&ifQuickCheck=' + ifQuickCheck;
                            }else{
                                $.alert(('验票失败:' + data.message) , function () {
                                    window.location.reload();
                                });
                            }
                        }
                    });
                });
            }else{

                if(orderType == 4  || orderType == 9){
                    window.location = '/cityBus/goShowTicket?busId=' + busId+'&orderNo=' + orderNo + '&departDate=' + departDate + '&ifQuickCheck=' + ifQuickCheck;
                }else if(orderType == 7){
                    window.location = '/commutingBus/checkTicket?busId=' + busId+'&orderNo=' + orderNo + '&departDate=' + departDate + '&ifQuickCheck=' + ifQuickCheck;
                }


            }
        }
    });
}
/***
 * 格式化时间显示
 * @param str 时间毫秒数
 * @returns {string} yyyy-mm-dd
 */
function  formatDate(str) {
    var millisecond = parseFloat(str);
    var date = new Date(millisecond);
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
}

function getTripList() {
    $.showLoading();
    var evt_success = function (data) {
        $.hideLoading();
        if(data.code == 0){
            var tripList =data.data.list;
            if(null == tripList || tripList.length <= 0){
                $(".noTrip").show();
                $.toast('你没有新的行程');
                return;
            }
           $(".noTrip").hide();
           var newArr = [];//最终数据
           var tempDepartDate = [];//只放日期
           for(var i=0;i<tripList.length;i++){
               var trip = tripList[i];
               if(tempDepartDate.includes(trip.busDepartDate)){
                   //已有日期: 遍历newArr 添加数据
                   for(var j=0;j<newArr.length;j++){
                       if(newArr[j].busDepartDate == trip.busDepartDate){
                           newArr[j].list.push(trip);
                       }
                   }
               }else{
                   //没有该日期
                   tempDepartDate.push(trip.busDepartDate);
                   newArr.push({
                       busDepartDate:trip.busDepartDate,
                       busDepartDateStr:formatDateToString(new Date(trip.busDepartDate)),
                       list:[trip]
                   })
               }
           }
            // console.log(newArr)

            // 加载完行程显示底部footer
            setTimeout(function () {
                var body = $('.trip-container').outerHeight(true);
                var screen = $(window).height();

                if (body >= (screen-56)){
                    $('footer').css({'position':'relative','margin-top': '.75rem','margin-bottom':'.2rem'});
                }
                // footer高度56
            },0)

            newArr.forEach(function (itemArr,i) {
                var busDepartDate = formatDate(itemArr.busDepartDate);
                var list = itemArr.list;
                var li = "";
                var ticketStatusColor="";
                list.forEach(function (item,index) {
                        //出发时间以item.departTime为准，其他的时间只做辅助用
                    if(item.ticketStatus == 2){
                        ticketStatusColor = "style='color:#F5A623;'";
                    }else if(item.ticketStatus == 3){
                        ticketStatusColor = "style='color:#AAAAAA;'";
                    }
                    if(item.orderType == 6){
                        //汽车票特殊处理
                        li += ' <li class="trip-item">' +
                            '                   <div class="trip-top sui-border-b">' +
                            '                       <div class="top-left">' +
                            '                           <span class="start-time">'+item.departTimeStr+'</span>' +
                            '                           <span class="business-name">'+ getBusinessName(item.orderType, item.businessName)+'</span>' +
                            '                       </div>' +
                            // '                       <div class="trip-status checked">'+ticketStatusArr[item.ticketStatus]+'</div>' +
                            '                   </div>' +
                            '                   <div class="trip-middle" data-order-type="'+item.orderType+'" ' +
                            '                   data-order-no="'+item.orderNo+'" data-depart-date="'+busDepartDate+'">' +
                            '                       <div class="station-info">' +
                            '                           <div class="station-name">'+item.departTitle+'</div>' +
                            '                           <div class="station-city">'+item.departCity+'</div>' +
                            '                       </div>' +
                            '                       <div class="transfer"></div>' +
                            '                       <div class="station-info">' +
                            '                           <div class="station-name">'+item.arriveTitle+'</div>' +
                            '                           <div class="station-city">'+item.arriveCity+'</div>' +
                            '                       </div>' +
                            // '                       <div class="more-info-btn"></div>' +
                            '                   </div>' +
                            '                   <div class="trip-bottom">' +
                            (isEmpty(item.carNo) ? '' : '<div class="license-plate">'+item.carNo+'</div>')+
                            // '                       <div class="license-plate">'+item.carNo+'</div>' +
                            '                       <div class="trip-tips">凭乘车人身份证到站点取票</div>' +
                            '                       <div class="trip-buttons">';
                        if (item.ticketStatus == 1){
                            // 获取当前时间的时间戳
                            var timestamp=new Date().getTime();
                            if(timestamp > item.departTime){
                                li += '<div class="button toComment" data-bus-id="'+item.busIdStr+'" data-order-no="'+item.orderNo+'">评价</div>'
                                // + '<div class="button" data-href="tel:'+ item.contactMobile +'">联系客服</div>';
                            }
                        }
                        if(item.contactMobile != ''){
                            li += '<div class="button toContact" data-order-type="'+item.orderType+'" ' +
                                ' data-order-no="'+item.orderNo+'" data-contact-mobile="'+item.contactMobile+'">联系</div>';
                        }
                        li += '<div class="button toOrderDetail" data-order-type="'+item.orderType+'" data-order-no="'+item.orderNo+'" data-depart-date="'+ busDepartDate +'">订单</div>';
                        //汽车票无验票入口
                        // var timeDiffer = (new Date().getTime()) - (item.departTime+2*60*60*1000); // 当前时间与超过上车时间2小时差
                        // if (timeDiffer<0 && item.ticketStatus != 3){
                        //     li += '<div class="button toCheck" data-bus-id="'+item.busIdStr+'" data-order-no="'+item.orderNo+'" data-quick-check="'+ item.ifQuickCheck +
                        //         '" data-depart-date="'+ busDepartDate +'" data-ticket-status="'+ item.ticketStatus +'" data-order-type="'+ item.orderType +'">验票</div>';
                        // }
                        li += '</div></div></li>';
                    }else{
                        li += ' <li class="trip-item">' +
                            '                   <div class="trip-top sui-border-b">' +
                            '                       <div class="top-left">' +
                            '                           <span class="start-time">'+item.departTimeStr+'</span>' +
                            '                           <span class="business-name">'+ getBusinessName(item.orderType, item.businessName)+'</span>' +
                            '                       </div>' +
                            '                       <div '+ticketStatusColor+' class="trip-status checked">'+ticketStatusArr[item.ticketStatus]+'</div>' +
                            '                   </div>' +
                            '                   <div class="trip-middle" data-order-type="'+item.orderType+'" ' +
                            '                   data-order-no="'+item.orderNo+'" data-depart-date="'+busDepartDate+'">' +
                            '                       <div class="station-info">' +
                            '                           <div class="station-name">'+item.departTitle+'</div>' +
                            '                           <div class="station-city">'+item.departCity+'</div>' +
                            '                       </div>' +
                            '                       <div class="transfer"></div>' +
                            '                       <div class="station-info">' +
                            '                           <div class="station-name">'+item.arriveTitle+'</div>' +
                            '                           <div class="station-city">'+item.arriveCity+'</div>' +
                            '                       </div>' +
                            '                       <div class="more-info-btn"></div>' +
                            '                   </div>' +
                            '                   <div class="trip-bottom">' +
                            '                       <div class="license-plate">'+item.carNo+'</div>' +
                            '                       <div class="trip-buttons">';
                            
                        if(item.isComment == 1){//判断是否开启评价
                            if (item.ticketStatus == 1){//是否已验票
                                // 获取当前时间的时间戳
                                var timestamp=new Date().getTime();
                                if(timestamp > item.departTime){//是否已过到达时间
                                    li += '<div class="button toCommentBus" data-bus-id="'+item.busIdStr+'" data-order-no="'+item.orderNo+'">评价</div>';
                                    // + '<div class="button" data-href="tel:'+ item.contactMobile +'">联系客服</div>';
                                }
                            }
                        }
                        if(item.contactMobile != ''){
                            li += '<div class="button toContact" data-order-type="'+item.orderType+'" ' +
                                ' data-order-no="'+item.orderNo+'" data-contact-mobile="'+item.contactMobile+'">联系</div>';
                        }
                        li += '<div class="button toOrderDetail" data-order-type="'+item.orderType+'" data-order-no="'+item.orderNo+'" ' +
                            'data-depart-date="'+ busDepartDate +'" >订单</div>';
                        var timeDiffer = (new Date().getTime()) - (item.departTime+2*60*60*1000); // 当前时间与超过上车时间2小时差
                        if (timeDiffer<0 && item.ticketStatus != 3){
                            li += '<div class="button toCheck" data-bus-id="'+item.busIdStr+'" data-order-no="'+item.orderNo+'" data-quick-check="'+ item.ifQuickCheck +
                                '" data-depart-date="'+ busDepartDate +'" data-ticket-status="'+ item.ticketStatus +'" data-order-type="'+ item.orderType +'" >验票</div>';
                        }
                        li += '</div></div></li>';
                    }
                });
                var p_li = '<li> <div class="trip-date">'+getTripDate(itemArr.busDepartDate)+'</div>' +
                    '<ul>'+li+'</ul></li>';
                $('#tripLi').append(p_li);

                //行程详情页面
                $('.trip-middle').off(clickEvent).on(clickEvent,function () {
                    //汽车票不能进入
                    var orderType = $(this).data('order-type');
                    if(orderType == 6){
                        return;
                    }
                    var departDate = $(this).data('depart-date');
                    var orderNo = $(this).data('order-no');
                    window.location = '/cityBus/lineMap?departDate=' + departDate+'&orderNo='+orderNo+'&orderType='+orderType;

                });

                // 验票
                showTicketCode();

                $('.toOrderDetail').off(clickEvent).on(clickEvent,function () {
                    var orderType = $(this).data('order-type');
                    var departDate = $(this).data('depart-date');
                    var dataObj = {
                        // orderNo:$('#orderNo').val()
                        orderNo: $(this).data('order-no'),
                        token: $.cookie('token')
                    };
                    if(orderType == '7'){
                        //通勤班线
                        var urlStr = SERVER_URL_PREFIX+'/bus/toCommuteOrderDetail';
                        window.location.href="/bus/toCommuteOrderDetail?token="+dataObj.token+"&orderNo="+dataObj.orderNo+"&departDate="+departDate;

                    }else if(orderType == '4'){
                        //定制班线
                        var urlStr = SERVER_URL_PREFIX+'/busline/busOrder/orderDetail';
                        dataObj = genReqData(urlStr, dataObj);
                        window.location.href="/bus/toBusOrderDetail?token="+dataObj.token+"&orderNo="+dataObj.orderNo+"&sign="+dataObj.sign;
                    }else if(orderType == '6'){
                        // 汽车票
                        var urlStr ='/busTicketOrder/OrderDetail';
                        dataObj = genReqData(urlStr, dataObj);
                        window.location.href="/busTicketOrder/toOrderDetail?token="+dataObj.token+"&orderNo="+dataObj.orderNo+"&sign="+dataObj.sign;
                    }else if(orderType == '9'){
                        // 旅游班线
                        var urlStr = SERVER_URL_PREFIX+'/busline/busOrder/orderDetail';
                        dataObj = genReqData(urlStr, dataObj);
                        window.location.href="/bus/toBusOrderDetail?token="+dataObj.token+"&orderNo="+dataObj.orderNo+"&sign="+dataObj.sign;
                    }
                });

                $('.toContact').off(clickEvent).on(clickEvent,function () {
                    var orderNo = $(this).data('order-no');
                    var orderType = $(this).data('order-type');
                    var contactMobile = $(this).data('contact-mobile');
                    if(undefined == contactMobile || '' == contactMobile){
                        $.toast('未提供联系手机号码');
                        return;
                    }
                    contactMobileClick(contactMobile,orderType,orderNo);
                })

                $('.toComment').off(clickEvent).on(clickEvent,function(){//立即评价
                    var busId = $(this).data('bus-id');
                    var orderNo = $(this).data('order-no');
                    window.location = '/comment/toCommentBusPage?busId=' + busId+'&orderNo='+orderNo;
                });

                $('.toCommentBus').off(clickEvent).on(clickEvent,function(){//通勤立即评价
                    var busId = $(this).data('bus-id');
                    var orderNo = $(this).data('order-no');
                    window.location = '/comment/toCommentBusPage?busId=' + busId+'&orderNo='+orderNo+'&lineType=2';
                });

            })

            function getBusinessName(businessType,businessName) {
               var name = '';
                if(isEmpty(businessName) && !isEmpty(businessType)){
                    name =  BusinessType[businessType];
                }else{
                    name = businessName;
                }
                return name;
            }

            function getTripDate(date) {
               var dateStr = '';

               if(isToday(formatDateToString(new Date(date)))){
                   //今天
                   dateStr = '今天';
               }else if(isToday(getCountDay(formatDateToString(new Date(date)),-1))){
                   //明天
                   dateStr = '明天';
               }else {
                   dateStr = formatDateToStringHan(new Date(date));
               }
                dateStr += '（' + switchWeekday(new Date(date),true) + '）';
               return dateStr;
            }

            function contactMobileClick(phone,type,orderNo){
                if(phone!=undefined && phone!=0){
                    if(type==2){
                        callDriver(orderNo);
                    }else{
                        window.location.href = 'tel:'+phone;
                    }
                }else{
                    if(type==2){
                        $.toast("正在安排接送司机，请稍后");
                    }
                }

            }

        }else{

        }
    }

    var evt_error = function (e) {
        $.hideLoading();
    }
    var url = SERVER_URL_PREFIX+ "/busline/optimized/getUserAllBusTrip";
    var param = {
        token : $.cookie('token'),
        pageSize: 1000,
        currentPage: 1,
    };
    $.ajaxService({
        url:url,
        data:param,
        success:evt_success,
        error:evt_error,
    })
}
//车票状态：是否验票的相关操作
function ticketStatusAction(ticketStatus){
    // [1已验票，2 待验票，3 已退票]
    if(ticketStatus == '1'){
        $('.trip-buttons .toComment').show();
    }else{
        $('.trip-buttons .toComment').hide();
    }

    if (ticketStatus == '3'){
        $('.trip-buttons .toCheck').hide();
    }
}


$(function () {
    getTripList();
    hideOptionMenu(); // 隐藏分享
    var userInfo = JSON.parse(USERINFO);
    $('title').html("行程-"+userInfo.providerName);
});

/**
 * 返回按钮
 */
$('.handle-list .handle').off('click').on('click',function () {
    window.location = "/index";
});