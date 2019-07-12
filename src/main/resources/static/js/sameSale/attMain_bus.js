var wrapperScroll;
var storeCode = getParam('storeCode',window.location.href);
var storeName = getParam('storeName',window.location.href);
//选择的班次数据对象
var busTicketObj = {
    ticketList:null,
    arriveAreaCode: '',//目的站点区域code
    arriveName: "",//目的站点名称
    departAreaCode: '',//出发站点区域code
    departDate: formatDateToString(new Date()),// 购票日期
    departName: "",//出发站点名称
    idStr: "",//busID
    totalPriceBus: 0, //总价
    passengerList:[],
    totalTicketAmount:0,
    freeTicketAmount:0
};

var priceParams = [];

var tempGlobalObj = {
    isGetLineListBack: false,
    isCalendarListBack:false,
};

var busStationList = {
    departStationList:[],
    arriveStationList:[],
}
var _iScroll_bus;
var bindScroll_bus = function(el) {
    if(_iScroll_bus) {
        _iScroll_bus.destroy();
    }
    setTimeout(function() {
        _iScroll_bus = new IScroll(el + ' .station-list');
    }, 300);
}
var scroll_busPop;
var bindScroll_Pop = function(el) {
    if(scroll_busPop) {
        scroll_busPop.destroy();
    }
    setTimeout(function() {
        scroll_busPop = new IScroll(el + ' .popup-content');
    }, 300);
}

function initBusTicketObj(obj) {
    $.extend(true,busTicketObj,obj);
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

/**
 *
 * @param date date对象
 * @returns {string}
 */
function formatDateToString(date){
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
}

$('#stationListPopup .close-popup').on('click',function () {
    $('#stationListPopup').closePopup();
});

function drawStationList(data){
    var stationList = '';
    if(data.length > 0){
        data.forEach(function (item,index) {
            var itemClassName = '';
            if(index == 0){
                itemClassName = 'active sui-border-b';
            }else{
                itemClassName = 'sui-border-b';
            }
            stationList += '<li class="'+ itemClassName +'" data-station-code="'+ item.stationCode +'" data-station-name="'+ item.stationName +'"' +
                ' data-area-code="'+ item.areaCode +'" data-area-name="'+ item.areaName +'">' +
                '                    <div class="station-name">'+ item.stationName +'</div>' +
                '                    <div class="station-checkbox"></div>' +
                '                </li>';
        });
    }else{
        stationList = '<div class="no-station-list">暂无站点</div>'
    }
    $('#stationListPopup .passenger-list').html('').append(stationList);

    var addClickEvent = function(){
        $('#stationListPopup .passenger-list li').off('click').on('click',function () {
            $(this).addClass('active').siblings().removeClass('active');
        });
        $('#stationListPopup .confirm-btn').on('click',function () {
            var activeItem = $('#stationListPopup ul li.active');
            var areaCode = activeItem.data('area-code');
            var stationName = activeItem.data('station-name');
            var type = $('#stationListPopup').data('type');
            if(type == 'depart'){
                $('#departStation').val(stationName);
                $('#departStation').data('area-code',areaCode);
            }else{
                $('#arriveStation').val(stationName);
                $('#arriveStation').data('area-code',areaCode);
            }

            $('#stationListPopup').closePopup();
        })
    };

    addClickEvent();
}

$('#attrTrans input').off('click').on('click',function () {
    var type = $(this).data('type');
    var value = $(this).val();

    if(type == 'depart'){
        drawStationList(busStationList.departStationList);
    }else if(type == 'arrive'){
        drawStationList(busStationList.arriveStationList);
    }

    if(!isEmpty(value)){
        $('#stationListPopup .passenger-list li').forEach(function (item) {
            if($(item).data('station-name').trim() == value){
                $(item).addClass('active').siblings().removeClass('active');
            }
        })
    }else{
        $('#stationListPopup .passenger-list li:first-child').addClass('active').siblings().removeClass('active');
    }
    $('#stationListPopup').data('type',type);
    $('#stationListPopup').popup('modal',function () {
        bindScroll_bus('#stationListPopup');  //加载滚动条
    });
});

$('.station-list').each(function () {
    $(this).css('height', (($(window).height()*0.7) - 74) + 'px');
});

$('.popup-content').each(function () {
    $(this).css('height', (($(window).height()*0.7) - 54) + 'px');
});

$('#preBuyBtn').off('click').on('click',function () {
    var departName = $('#departStation').val();
    var departAreaCode = $('#departStation').data('area-code');
    var arriveName = $('#arriveStation').val();
    var arriveAreaCode = $('#arriveStation').data('area-code');
    var departDate = formatDateToString(new Date());



    if(isEmpty(departAreaCode)){
        $.toast('请选择出发站点');
        return;
    }

    if(isEmpty(arriveAreaCode)){
        $.toast('请选择到达站点');
        return;
    }

    if(departName == arriveName){
        $.toast('请选择不同的站点');
        return;
    }

    if(departAreaCode==busTicketObj.departAreaCode && arriveAreaCode==busTicketObj.arriveAreaCode
        && departName == busTicketObj.departName && arriveName == busTicketObj.arriveName && busTicketObj.totalPriceBus > 0){
        //出发地目的地相同，回显数据
        $('#scenicBusTicket').popup();
        return;
    }
    initBusTicketObj({
        departName: departName,
        departAreaCode : departAreaCode,
        arriveAreaCode : arriveAreaCode,
        arriveName : arriveName
    });

    $('#scenicBusTicket .station-line').html(departName + '<span></span>' + arriveName);
    $('#scenicBusTicket .depart-date input').val(departDate);

    var dataObj = {
        departPid: departAreaCode,
        arrivePid: arriveAreaCode,
        departStations: departName,
        arriveStations: arriveName,
        departDate: departDate,
        requestUrl: window.location.href,
        selectTimes:'不限',
    };
    reqLineList(dataObj);

    var param = {
        requestUrl:window.location.href,
        departPid :departAreaCode,
        arrivePid: arriveAreaCode,
        departStation: departName,
        arriveStation: arriveName,
        departDate: departDate,
    }
    getDatePopupResult(param,function (dayList) {
        if(dayList.length > 0){
            var dayArr = [];
            dayList.forEach(function (dayItem,index) {
                var day = {
                    date: dayItem.date,
                };
                if(dayItem.saleState == '1'){
                        day.state = 'select';
                        day.comment = '有票';
                    }else if(dayItem.saleState == '0'){
                        day.state = 'select';
                        day.comment = '售罄';
                    }else{
                        day.state = 'disable';
                        day.comment = '';
                    }
                dayArr.push(day);
            })
            initDatepicker(dayArr);
        }

    })

    $('#scenicBusTicket').popup('modal',function () {
        bindScroll_Pop('#scenicBusTicket');
    });

});


$('#busTicketConfirm').off('click').on('click',function () {
    // calculateTicketList();
    showTotalAmount();
    $('#scenicBusTicket').closePopup();
});

//计算多票种时的总价
function calculateTicketList() {
    var passengerList = [];
    var idStr='';
    var totalPrice = 0;
    var totalTicketAmount = 0;
    var freeTicketAmount = 0;
    priceParams.forEach(function (item,index) {
        if(item.certType == 0){
            var itemNumbId = '_number'+item.itemType;
            var passengerItem = {
                "itemType": item.itemType,
                "passengerIds": "",
                "amount": parseInt($('#'+itemNumbId).val()),
                numbers:parseInt($('#'+itemNumbId).val()),
                sellPrice:item.price,
                ticketName:item.itemName
            }
            if(parseInt($('#'+itemNumbId).val()) > 0){
                totalPrice = parseFloat(totalPrice) + parseFloat(passengerItem.numbers * passengerItem.sellPrice);
                totalTicketAmount = totalTicketAmount + passengerItem.numbers;
                if(item.ifFreeTicket == 1){
                    freeTicketAmount = freeTicketAmount + passengerItem.numbers;
                }
                passengerList.push(passengerItem);
            }

        }else{
            $("#scenicBusTicket .handle-minus").each(function(){
                var parentTarget=$(this).parent();
                var code=parentTarget.data('code');
                var phone=parentTarget.data('phone');
                if(code==''||code==undefined){
                    $.toast('乘车人身份证信息不能为空');
                }
                if(phone==''||phone==undefined){
                    $.toast('乘车人手机号信息不能为空');
                }
                idStr+=parentTarget.data('id')+",";
            })

            var amount = $("#scenicBusTicket .handle-minus").length;
            var passengerItem = {
                "itemType": item.itemType,
                "passengerIds": idStr,
                "amount": amount,
                numbers:amount,
                sellPrice:item.price,
                ticketName:item.itemName
            }
            if(idStr!=""){
                totalPrice = parseFloat(totalPrice) + parseFloat(passengerItem.numbers * passengerItem.sellPrice);
                totalTicketAmount = totalTicketAmount + passengerItem.numbers;
                if(item.ifFreeTicket == 1){
                    freeTicketAmount = freeTicketAmount + passengerItem.numbers;
                }
                passengerList.push(passengerItem);
            }
        }
    })
    totalPrice = parseFloat(totalPrice).toFixed(2) ;
    busTicketObj.totalTicketAmount = totalTicketAmount;
    busTicketObj.freeTicketAmount = freeTicketAmount;
    busTicketObj.totalPriceBus = totalPrice;
    busTicketObj.passengerList = passengerList;
}

function initDatepicker(dayArr) {
    //填充日历
    var departDate = $('#scenicBusTicket .depart-date input').val();

    $('#selectDateBus .datepicker-wrapper').datePicker({
        dateBase: departDate,
        multiple:false,
        before:false,
        weekend:true,
        after: 6,
        gather: dayArr,
        selectCallback: function (data) {
            var selectDate = data.selectData[0].date;
            var dateStr = selectDate.year+'-'+selectDate.month+'-'+selectDate.day;
            $('#scenicBusTicket .depart-date input').val(dateStr);
            $('#selectDateBus').closePopup();

            var dataObj = {
                departPid: busTicketObj.departAreaCode,
                arrivePid: busTicketObj.arriveAreaCode,
                departStations: busTicketObj.departName,
                arriveStations: busTicketObj.arriveName,
                departDate: dateStr,
                requestUrl: window.location.href,
                selectTimes:'不限',
            };
            reqLineList(dataObj);
        },
        switchMonth:switchMonth
    });
}
function switchMonth(data,picker) {
    var param = {
        requestUrl:window.location.href,
        departPid :busTicketObj.departAreaCode,
        arrivePid: busTicketObj.arriveAreaCode,
        departStation: busTicketObj.departName,
        arriveStation: busTicketObj.arriveName,
        departDate: data,
    }
    getDatePopupResult(param,function (dayList) {
        if(dayList.length > 0){
            var dayArr = [];
            dayList.forEach(function (dayItem,index) {
                var day = {
                    date: dayItem.date,
                };
                if(dayItem.saleState == '1'){
                    day.state = 'select';
                    day.comment = '有票';
                }else if(dayItem.saleState == '0'){
                    day.state = 'select';
                    day.comment = '售罄';
                }else{
                    day.state = 'disable';
                }
                dayArr.push(day);
            })
            if (picker!=null) {
                picker.reset({
                    gather: dayArr
                });
                picker.full(param.departDate);
            }
        }

    })
}

function getDatePopupResult(param,callback) {
    $.showLoading();
    var succ_event = function (res) {
        tempGlobalObj.isCalendarListBack = true;
        if(tempGlobalObj.isGetLineListBack && tempGlobalObj.isCalendarListBack){
            $.hideLoading();
        }
        res = $.parseJSON(res);
        var data = res.data;
        if(res.code == 1){
            $.alert(res.msg);
            return;
        }

        if(callback && "" != data){
            callback(data)
        }else {
            $.alert('未查询到数据');
            return;
        }

    }
    var err_event = function (e) {
        if(callback){
            callback({code:1})
        }
        $.hideLoading();
        $.alert(e.message);
    }

    var url = SERVER_URL_PREFIX + '/busTicket/calendarList';
    param = genReqData(url, param);
    $.ajax({
        url: url,
        data: param,
        type: 'post',
        dataType: 'JSON',
        success:succ_event,
        error:err_event,
    })
}

//查询班次信息
var reqLineList = function (reqData) {
    var successCallback = function(data){
        if(data.lineList && data.lineList.length > 0){
            $('.empty-page').hide();

            $("#maxBuyNumber").val(data.maxBuyNumber);
            //流水班
            if(data.hasRunningWater == '1'){
                $('#scenicBusTicket .busLine .line-header').html('班次<span>（流水班，购票后可随时上车）</span>');
                $('#scenicBusTicket #wrapper').hide();
                if(data.lineList && data.lineList.length > 0){
                    $('#scenicBusTicket .ticket-list').show();
                    $('#scenicBusTicket .no-bus-line').hide();
                    //渲染页面票种
                    drawTickeList(data,reqData);
                }else{
                    initBusTicketObj({
                        ticketList:null,
                        totalPriceBus: 0, //总价
                    });
                    $('#scenicBusTicket .ticket-list').hide();
                    $('#scenicBusTicket .no-bus-line').show();
                }
            }else{
                //非流水班
                var busListHtml = '';
                if(data.lineList && data.lineList.length > 0){
                    $('#scenicBusTicket .ticket-list').show();
                    $('#scenicBusTicket .no-bus-line').hide();
                    busListHtml += '<ul>';
                    data.lineList.forEach(function (item,index) {
                        var className = '';
                        if(index == 0){
                            //默认选中第一个
                            className = 'active';
                        }
                        if(item.buyFlag == 0){
                            busListHtml += '<li class="buyFlag" data-flag="'+ item.buyFlag +'" data-id="'+ item.idStr +'" data-sell-price="'+ item.sellPrice +'">' +
                                '  <div class="time">'+ item.departTimeStr +'</div>' +
                                '  <div class="price">￥'+ item.sellPrice +'</div>' +
                                '</li>';
                        }else{
                            busListHtml += '<li data-flag="'+ item.buyFlag +'" class="'+ className +'" data-id="'+ item.idStr +'" data-sell-price="'+ item.sellPrice +'">' +
                                '  <div class="time">'+ item.departTimeStr +'</div>' +
                                '  <div class="price">￥'+ item.sellPrice +'</div>' +
                                '</li>';
                        }
                    });
                    busListHtml += '</ul>';
                    //渲染页面票种
                    drawTickeList(data,reqData);

                    $('#scenicBusTicket #wrapper').show();
                    $('#scenicBusTicket .busLine .no-bus-line').hide();
                    $('#scenicBusTicket #wrapper .content').html(busListHtml);

                    wrapperScroll = new IScroll('#wrapper', {
                        scrollX: true,
                        scrollY: false,
                        mouseWheel: true
                    });
                    $('#scenicBusTicket #wrapper').height($('#scenicBusTicket #wrapper .content ul').height());
                }else{
                    //没有线路
                    initBusTicketObj({
                        ticketList:null,
                        totalPriceBus: 0, //总价
                    });
                    $('#scenicBusTicket .ticket-list').hide();
                    $('#scenicBusTicket .no-bus-line').show();
                    $('#scenicBusTicket #wrapper').hide();
                }
            }
        }else{
            $('#scenicBusTicket .ticket-list').hide();
            $('.empty-page').show();
        }
        addClickEvent();
        if(scroll_busPop) {
            scroll_busPop.refresh();   // 刷新滚动条
        }
    };
    var addClickEvent = function(){
        $('.busLine #wrapper ul li').off('click').on('click',function () {
            var buyFlag = $(this).data('flag');
            if(buyFlag == 1){
                var sellPrice = $(this).data('sell-price');
                $(this).addClass('active').siblings().removeClass('active');
                busTicketObj.ticketList.sellPrice = sellPrice;
                busTicketObj.idStr = $(this).data('id');
    
                busTicketObj.totalPriceBus = addPrice(busTicketObj.ticketList);

                if(priceParams.length < 0){
                    $('#scenicBusTicket .ticket-list .ticket-info .unit-price span').html(busTicketObj.totalPriceBus +'元');
                }

                $('#scenicBusTicket .total-price span').html(busTicketObj.totalPriceBus + '元');
    
                wrapperScroll.scrollToElement($(this)[0], 500, false, false, IScroll.utils.ease.circular);
            }else{
                $.toast("该车次已停售");
            }
        });

        $('#scenicBusTicket .ticket-list ul li .less').off('click').on('click',function () {
            var maxBuyNumber = parseInt($("#maxBuyNumber").val());
            var $input = $(this).parent().find('input');
            var amount = $input.val();
            amount = parseInt(amount);
            if(amount <= 0)return;
            amount -= 1;
            $input.val(amount);
            var ticketType = $(this).parents('li').data('ticket-type');
            if(ticketType == 1){
                busTicketObj.ticketList.amount = amount;
                busTicketObj.totalTicketAmount = amount;
                busTicketObj.totalPriceBus = addPrice(busTicketObj.ticketList);
            }else {
                calculateTicketList();
            }
            $('#totalPriceBus').val(busTicketObj.totalPriceBus);
            $('#scenicBusTicket .total-price span').html( busTicketObj.totalPriceBus + '元');
        });
        $('#scenicBusTicket .ticket-list ul li .more').off('click').on('click',function () {
            var maxBuyNumber = parseInt($("#maxBuyNumber").val());
            var $input = $(this).parent().find('input');
            var amount = parseInt($input.val());
                var ticketType = $(this).parents('li').data('ticket-type');
                if(ticketType == 1){
                    if(amount < maxBuyNumber) {
                        amount = parseInt(amount);
                        amount += 1;
                        $input.val(amount);
                    }else {
                        $.toast(" 购票人数总计不能超过" + maxBuyNumber + "张");
                        return;
                    }

                    busTicketObj.ticketList.amount = amount;
                    busTicketObj.totalTicketAmount = amount;
                    busTicketObj.totalPriceBus = addPrice(busTicketObj.ticketList);
                }else {
                    //先计算已经添加的人员数量
                    calculateTicketList();
                    //如果没有达到上限就可以再添加，不行就提示
                    if(busTicketObj.totalTicketAmount < maxBuyNumber) {
                        amount = parseInt(amount);
                        amount += 1;
                        $input.val(amount);
                        calculateTicketList();
                    }else {
                        $.toast(" 购票人数总计不能超过" + maxBuyNumber + "张");
                        return;
                    }
                }
                $('#totalPriceBus').val(busTicketObj.totalPriceBus);
                $('#scenicBusTicket .total-price span').html(busTicketObj.totalPriceBus + '元');
        });

    };
    var openDatePop = function () {
        $('#scenicBusTicket .depart-date').on('click',function () {
            $('#selectDateBus').popup('plate', function () {
            }, function (data) {
            })//.backtrack({
            //     cancel: '#selectDate .sui-popup-mask'
            // });
        });
    }
    var url = SERVER_URL_PREFIX + '/busTicket/getLineList';
    reqData = genReqData(url, reqData);
    $.showLoading();
    $.ajaxService({
        url: url,
        data: reqData,
        type: 'post',
        dataType: 'JSON',
        success: function (res) {
            tempGlobalObj.isGetLineListBack = true;
            if(tempGlobalObj.isGetLineListBack && tempGlobalObj.isCalendarListBack){
                $.hideLoading();
            }
            res = $.parseJSON(res);
            if(res.code == '0'){
                openDatePop();
                var lineList = res.data.lineList;
                if(lineList.length > 0){
                    $('.empty-page').hide();
                    successCallback(res.data);
                }else{
                    $('#scenicBusTicket .ticket-list').hide();
                    $('.empty-page').show();
                }
            }
        }
    })
};

function drawTickeList(data,reqData) {
    var ticketListHtml = '';
        busTicketObj.departName = reqData.departStations;
        busTicketObj.departAreaCode = reqData.departPid;
        busTicketObj.arriveAreaCode = reqData.arrivePid;
        busTicketObj.arriveName = reqData.arriveStations;
        busTicketObj.departDate= $('#scenicBusTicket .depart-date input').val();
        busTicketObj.idStr = data.lineList[0].idStr;
    //渲染页面票种
    if(undefined != data.lineList[0].priceParams && "" != data.lineList[0].priceParams){
        priceParams = JSON.parse(data.lineList[0].priceParams);
        priceParams.forEach(function (item,index) {
            if(item.certType == 0){
                ticketListHtml +=  '  <li class="sui-border-b" data-ticket-type="'+item.itemType+'" data-ticket-name="'+item.itemName+'" ' +
                    '               data-sell-price="'+ item.price +'" data-free-ticket="'+item.ifFreeTicket+'">' +
                    '                        <div class="ticket-info">' +
                    '                            <div class="ticket-type">'+item.itemName+'</div>' +
                    '                            <div class="unit-price">单价:<span>'+ item.price +'元</span></div>' +
                    '                        </div>' +
                    '                        <div class="ticket-amount">' +
                    '                            <i class="less"></i>' +
                    '                            <div class="amount"><input value="0" readonly=""><input id="_number'+item.itemType+'" type="hidden" value="0"></div>' +
                    '                            <i class="more"></i>' +
                    '                        </div>' +
                    '  </li>' ;
            }else{
                ticketListHtml += '  <div class="person-panle"> <div id="'+item.itemType+'_type" class="person-type"  data-sell-price="'+item.price+'"  ' +
                    '               data-ticket-name="'+item.itemName+'" data-free-ticket="'+item.ifFreeTicket+'">' +
                    '                <div class="head">' +
                    '                    <h4>'+item.itemName+'</h4>' +
                    '                            <div class="personPrice">' +
                    '                                <span class="priceTitle">单价：</span>' +
                    '                                <span class="priceSell">'+item.price+'元/人</span>' +
                    '                            </div>'+
                    '                    <div class="handle-plus">' +
                    '                        <i class="icon-person-plus" data-ticket-type="'+item.itemType+'" data-sell-price="'+item.price+'" ></i>' +
                    '                    </div>' +
                    '                </div>' +
                    '                <div id="'+item.itemType+'_content" class="content"  data-sell-price="'+item.price+'">' +
                    '                </div>' +
                    '            </div></div>'
            }

        })

        busTicketObj.ticketList = {
            sellPrice: 0,
            amount: 0,
            ticketType: '',
            ticketName: ''
        };
        busTicketObj.totalPriceBus = addPrice(busTicketObj.ticketList);
        $('#scenicBusTicket .total-price span').html(busTicketObj.totalPriceBus + '元');

    }else{
        //成人票
        //ticket-type 1-成人票，2-儿童票
        ticketListHtml += '  <li class="sui-border-b" data-ticket-type="1" data-ticket-name="成人票" data-sell-price="'+ data.lineList[0].sellPrice +'">' +
            '                        <div class="ticket-info">' +
            '                            <div class="ticket-type">成人票</div>' +
            '                            <div class="unit-price">单价:<span>'+ data.lineList[0].sellPrice +'元</span></div>' +
            '                        </div>' +
            '                        <div class="ticket-amount">' +
            '                            <i class="less"></i>' +
            '                            <div class="amount"><input value="1" readonly=""></div>' +
            '                            <i class="more"></i>' +
            '                        </div>' +
            '  </li>';

        busTicketObj.ticketList = {
            sellPrice: data.lineList[0].sellPrice,
            amount: 1,
            ticketType: '1',
            ticketName: '成人票'
        };
        busTicketObj.totalPriceBus = addPrice(busTicketObj.ticketList);
        $('#scenicBusTicket .total-price span').html(busTicketObj.totalPriceBus + '元');

    }
    $('#scenicBusTicket .ticket-list ul').html(ticketListHtml);
    addTicketPersonClick_evnet();
}
var addTicketPersonClick_evnet = function () {
    $('.icon-person-plus').on(click_event,function () {
        //获取最近的父元素
        var ticketType = $(this).data('ticket-type');
        var ticketTypeId = ticketType+'_content';
        var ticketPrice = $(this).data('sell-price');
        $personContent = $("#"+ticketTypeId);
        getPassengerList(function (list) {
            $("#ticketPersonList .passenger-list").html("");
            drawPassengerList(list,$('#ticketPersonList .passenger-list'));
            $('#ticketPersonList').popup('modal', function() {
                bindScroll('#ticketPersonList');  //加载滚动条
            },function (data) {
                var maxBuyNumber = parseInt($("#maxBuyNumber").val());
                var psersonHtml = loadPersonList(data,ticketType);

                //先计算已经添加的人员数量
                calculateTicketList();
                //如果没有达到上限就可以再添加，不行就提示
                if(parseInt(maxBuyNumber) - parseInt(busTicketObj.totalTicketAmount) > parseInt(data.length)) {
                    $($personContent).html('').append(psersonHtml);
                    calculateTicketList();
                    $('#totalPriceBus').val(busTicketObj.totalPriceBus);
                    $('#scenicBusTicket .total-price span').html(busTicketObj.totalPriceBus + '元');
                    removeTicketPerson();
                }else {
                    $.toast("购票人数总计不能超过" + maxBuyNumber + "张");
                    return;
                }
            });
            //选择乘客 - 更新select状态
            $('.passenger-list input[type=checkbox]').on('change', function () {
                changeSelect($(this));
            });

            $('#ticketPersonList .addPassengerButton').off('tap').on('tap', function() {
                $('#ticketPersonList').closePopup();
                $('#addPassenger').popup('push', function() {
                    $('#addPassengerName').val('');
                    $('#addPassengerPhone').val('');
                    $('#addPassengerCode').val('');
                })
            });

            $('#ticketPersonList .editPassengerButton').on('tap', function () {
                $('#ticketPersonList').closePopup();
                editHandle($(this));
            });
        })
    })

}

function removeTicketPerson() {
    $(".handle-minus").click(function(e){
        e.stopPropagation();
        var ticketType = $(this).data('ticket-type');
        var ticketTypeId = ticketType+'_type';
        $(this).parent().remove();
        calculateTicketList();
        $('#totalPriceBus').val(busTicketObj.totalPriceBus);
        $('#scenicBusTicket .total-price span').html( busTicketObj.totalPriceBus + '元');
    })
}

//实名制情况下添加人员信息到对应的类型下面
function loadPersonList(selectPersonList,ticketType) {
    var personHtml = '';
    selectPersonList.forEach(function (person,index) {
        if('undefined' == person.phone){
            person.phone ='';
        }
        personHtml += '<div class="item" data-id="'+person.id+'" data-code="'+person.code+'"  data-phone="'+person.phone+'">' +
            '<div class="handle-minus" data-ticket-type="'+ticketType+'"></div>' +
            '<div class="name">' + person.name + '</div>' +
            '<div class="info">' +
            '<p><span class="label">手机号</span>' + person.phone + '</p>' +
            '<p><span class="label">身份证</span>' + person.code + '</p>' +
            '</div>' +
            '</div>';
    })
    return personHtml;
}


$('#warmPrompt').off('click').on('click',function () {
    reqWarmPromptContent(function (data) {
        $('#warmPromptContent .warm-prompt').html('').html(data);
        $('#warmPromptContent').popup();
    });
})

function reqWarmPromptContent (callback) {
    $.showLoading();
    var succ_event = function (res) {
        $.hideLoading();
        if(res.code == 0){
            callback(res.data);
        }
    }
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    var providerId = userInfo.providerId;
    var url = SERVER_URL_PREFIX + '/busTicketOrder/tips';
    var param = {
        providerId:providerId
    }
    $.ajaxService({
        url:url,
        data:param,
        success:succ_event,
    })
}

//计算价格
function addPrice(obj) {
    var totalPrice = parseFloat(obj.sellPrice)*100*parseInt(obj.amount)/100;
    return parseFloat(totalPrice).toFixed(2);
}

//查询站点信息
function reqStationList(){
    var url =  SERVER_URL_PREFIX + '/spot/listStation';
    var dataObj = {
        storeCode: storeCode,
    };
    dataObj = genReqData(url, dataObj);
    var successBack = function(data){
        if(data.length > 0){

            //上下车站点列表 1-上车 2-下车
            data.forEach(function (item) {
                if(item.type == 1){
                    busStationList.departStationList.push(item);
                }else if(item.type == 2){
                    busStationList.arriveStationList.push(item);
                }
            });
            if(busStationList.departStationList.length > 0 && busStationList.arriveStationList.length > 0){
                $('#attrTrans').show();
            }

        }else {
            $('#attrTrans').hide();
        }

    };

    $.ajax({
        url: url,
        data: dataObj,
        type: 'post',
        dataType:' JSON',
        success: function (res) {
            res = $.parseJSON(res);
            if(res.code == '0'){
                successBack(res.data);
            }
        }
    })
}
//初始化站点信息
function initStationInfo(){
    $('#departStation').val('');
    $('#departStation').data('area-code','');
    $('#arriveStation').val('');
    $('#arriveStation').data('area-code','');
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

function initTitle(txt){
    setTimeout(function () {
        $('title').html(txt);
        $(document).attr('title',txt);
    })
}



$(function () {
    initTitle(storeName);
    reqStationList();
    initStationInfo();
});