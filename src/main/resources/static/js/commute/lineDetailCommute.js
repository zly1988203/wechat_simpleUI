window.addEventListener('pageshow', function( e ){
    if (e.persisted) {
        window.location.reload()
    }
});

var lineInfo = {
    qrcId:$('#qrcId').val(),
    baseBusMap:JSON.parse($('#baseBusMap').val()),
    stationStartId:$('#departStationId').val(),
    stationEndingId:$('#arriveStationId').val(),
    childList:JSON.parse($('#childLineList').val()),
    scheduleInfoList:JSON.parse($('#scheduleInfoList').val()),
    busId:$('#busId').val(),
    departLng:$('#departLng').val(),
    departLat:$('#departLat').val(),
    arriveLat:$('#arriveLat').val(),
    arriveLat:$('#arriveLat').val()
}
var click_event = isAndroid() ? 'tap' : 'click';
var baseBusIds = '';//params
var busId='';
//线路详情展开收起动画
function animateSwitchDetail(){
    var el = $('.detail-main-content');
    if(el.data('toggle')){
        el.height(el.data('height'));
        el.data('toggle',false);
        $('.detail-toggle').removeClass('turn');

        //设置地图边界
        var line_detail_h = $('.detail-head-content').height()+ el.data('height')+ $('.detail-bottom').height();;
        var h = $(window).height() - line_detail_h;
        $('.ola-maps').css({height: h + 'px', 'margin-top': line_detail_h});

    }else{
        el.height(0);
        el.data('toggle',true);
        $('.detail-toggle').addClass('turn');

        //设置地图边界
        var line_detail_h = $('.detail-head-content').height()+ $('.detail-bottom').height();;
        var h = $(window).height() - line_detail_h;
        $('.ola-maps').css({height: h + 'px', 'margin-top': line_detail_h});
    }

    //滚动设置
    bindScroll();
}


/*展开收起切换*/
$('.detail-toggle').on(click_event, function () {
    animateSwitchDetail();
});

/*选中站点*/
$('.detail-station-list li').on(click_event, function () {
    var $el = $(this);
    $el.addClass('active').siblings().removeClass('active');
});

//选择站点滚动
$('.detail-station-list li').on(click_event, function () {
    scrollMiddle($(this));
});

// ================================= 选择日期 ===================================
$('.detail-station-btn').on(click_event, function() {
    //获取上下车店 stationId
    var stationStartId1 = $('.detail-station-start li.active').data('stationid');
    var stationEndingId1 = $('.detail-station-ending li.active').data('stationid');
    if(!stationStartId1){
        $.toast("请选择上车站点");
        return;
    }
    if(!stationEndingId1){
        $.toast("请选择下车站点");
        return;
    }

    $('#selectDate').popup('plate', function () {
        console.log('open')
    });
});

//初始化
function init(){
    //获取站点详情高度
    var main_content =  $('.detail-main-content');
    main_content.data('height',main_content.height());
    main_content.height(main_content.data('height'));
}

//点击购票按钮
$('#payTicket').off(click_event).on(click_event,function(){
    $('#payTicket').css('background-color','#999999');
    $('#payTicket').prop('disabled',true);
    baseBusIds = baseBusIds.substring(0,baseBusIds.length-1);
    if(baseBusIds==null||baseBusIds==''){
        $.toast("请选择日期！");
        $('#payTicket').css('background-color','#6392fe');
        $('#payTicket').prop('disabled',false);
        return false;
    }
    $('#selectDate').closePopup(function () {
        console.log('close')
    });
    //查询是否有未支付订单
    $.post("/busline/queryNotPayOrders",{token:$.cookie('token'),busId:busId,type:7},function(result){
        if(result.code == 0){
            postPage("/commute/toAddOrder",[{name:'busIds',value:baseBusIds},{name:'busId',value:lineInfo.busId},{name:'qrcId',value:lineInfo.qrcId}]);
        }else if(result.code == 50086){
            var orderNo = result.data;
            $.confirm('您当前有未支付订单，不能重复下单', '提示',['我知道了', '进入订单'], function() {
                window.location.href="/bus/toCommuteOrderDetail?orderNo="+orderNo;
            });
        }else{
            $('#payTicket').css('background-color','#6392fe');
            $('#payTicket').prop('disabled',false);
            $.alert(result.message||'未知错误');
        }
    },'json');
})

function initCalendar(){
    if(lineInfo.scheduleInfoList.length<=0) return;

    var scheduleData = getScheduleData();

    //填充日历
    $('.datepicker-wrapper').datePicker({
        dateBase: getBaseDate(scheduleData['schedules'][0].date),
        gather: scheduleData.schedules,
        weekend: true,
        after: scheduleData.monthNum,
        selectCallback: function (data) {
            var selectPrice = 0;
            baseBusIds = '';
            var minDateStamp = Number.MAX_VALUE;
            $.each(data.selectData,function (index,cell){
                baseBusIds += cell['id']+",";
                var comment = cell['comment'].substring(1)||0;
                var price = Number(comment);
                selectPrice = add(selectPrice,price);

                var curBusId = getBaseBusId(cell['date']);
                // baseBusIds += curBusId+",";

                var curDateStamp = dateToStamp(cell['date']);
                if(minDateStamp>curDateStamp){
                    minDateStamp = curDateStamp;
                    busId = curBusId;
                }
            });

            $('.pay-handle').find('.day').html(data.selectData.length);
            $('.pay-handle').find('.price').html(selectPrice);
        }
    });
}

function getBaseDate(dateStr){
    var dateStrs = dateStr.split("-");
    var year = parseInt(dateStrs[0]);
    var month = parseInt(dateStrs[1]);
    return year+'-'+month;
}

//date transfer to timestamp
function dateToStamp(date){
    var dateStr = date.year+'-'+date.month+'-'+date.day;
    return Date.parse(new Date(dateStr.replace(/-/g, "/")));
}

function getBaseBusId(selectDate){
    var scheduleInfoId = 0;
    for(var i=0; i<lineInfo.scheduleInfoList.length; i++){
        var date = getDate(lineInfo.scheduleInfoList[i]['ticketDate']);
        var selectDate1 = selectDate.year+'-'+selectDate.month+'-'+selectDate.day;
        if(selectDate1==date){
            scheduleInfoId = lineInfo.scheduleInfoList[i]['id'];
            break;
        }
    }

    var baseBus = getBaseBus(scheduleInfoId);
    return baseBus['idStr'];
}

function getScheduleData(){
    var result = {};
    var schedules = [];
    var months = [];

    $.each(lineInfo.scheduleInfoList,function (index,cell){
        var schedule = {};
        var baseBus = getBaseBus(cell['id']);

        schedule['date'] = getDate(cell['ticketDate']);
        schedule['comment'] = '¥' + saveTwoDigit(baseBus['sellPrice']);
        schedule['state'] = 'select';
        schedule['id'] = baseBus.idStr;
        schedule['idStr'] = baseBus.idStr;

        if(cell['ticketRemainNum'] == 0){
            schedule['comment'] = '已售罄';
            schedule['state'] = 'readonly';
        }
        if(baseBus['busStatus'] == 0){
            schedule['comment'] = '已停售';
            schedule['state'] = 'readonly';
        }
        if(baseBus['busStatus'] == -1){
            schedule['state'] = 'readonly';
        }
        if(baseBus['id']==-1 || baseBus['id']==-2){
            schedule['comment'] = '未排班';
            schedule['state'] = 'readonly';
        }
        if(cell['hasBought'] == 1){
            schedule['comment'] = '已购票';
            schedule['state'] = 'readonly';
        }

        if(baseBus['specialState'] == 1 && cell['ticketRemainNum'] != 0 && baseBus['busStatus'] > 0){
            schedule['badge-right'] = '/res/images/common/icon-discounts.png';
            schedule['badge-right-active'] = '/res/images/common/icon-discounts-active.png';
        }
        schedules.push(schedule);

        var m = getMonth(cell['ticketDate']);
        if($.inArray(m, months)==-1){
            months.push(m);
        }
    });

    result.schedules = schedules;
    result.monthNum = months.length - 1;
    //console.log(JSON.stringify(result));
    return result;
}

function getBaseBus(scheduleInfoId){
    var baseBusArray = lineInfo.baseBusMap[scheduleInfoId];
    if(!baseBusArray) return {'sellPrice':'未排班','id':-1};

    if(baseBusArray.length>0){
        for(var i=0;i<baseBusArray.length;i++){
            var baseBus = baseBusArray[i];
            if(baseBus.departStationId == lineInfo.stationStartId & baseBus.arriveStationId == lineInfo.stationEndingId){
                return baseBus;
            }
        }
    }

    return {'sellPrice':'未排班','id':-2};
}

function getDate(timestamp) {
    var d = new Date(timestamp);
    var month = d.getMonth() + 1;
    var date = d.getDate();
    return d.getFullYear() + '-' + month + '-' + date;
}

function getMonth(timestamp) {
    var d = new Date(timestamp);
    var month = d.getMonth() + 1;
    return month;
}

//设置地图的外边距
function setMap() {
    var h = $(window).height() - $('.line-detail').height();
    $('.ola-maps').css({height: h + 'px', 'margin-top': $('.line-detail').height()});
}

// 绑定滚动条
var _myIScroll;
var bindScroll = function() {
    if(_myIScroll) {
        _myIScroll.destroy();
    }
    setTimeout(function() {
        _myIScroll = new IScroll('.detail-main', {
            click: iScrollClick(),
            scrollX: false,
            scrollY: true,
            mouseWheel: true
        });

        //第一次滚动的位移
        scrollMiddle($('.detail-station-start li.active'));
    }, 300);
};
/*
* 滚动到中间
* */
function scrollMiddle(el) {
    /*
     * param
     *
     *   el：当前上车点
     *   _moveTop：移动距离
     *   el_halfHeight：当前上车点元素高度的一半
     *   _redundant：多余高度
     *   _startScrollTop：当前上车点位置
     *   _mainHeight：盒子高度
     *   _halfMainHeight：盒子高度的一半
     *   _contentHeight：内容总高度
     *   _MAX：最大移动距离
     *
     * */
    var _moveTop = 0;
    var el_halfHeight = parseInt(el.height() / 2);
    var _redundant = el_halfHeight;
    var _startScrollTop = el.position().top,
        _mainHeight = parseInt($('.detail-main').height()),
        _halfMainHeight = _mainHeight / 2,
        _contentHeight = parseInt($('.detail-main .content').height()),
        _MAX = _contentHeight - _mainHeight;

    //如果 当前上车点的位置小于盒子高度的一半 => 不移动
    if(_startScrollTop < _halfMainHeight) {
        _moveTop = 0;
    } else {
        //如果 当前上车点的位置大于盒子高度的一半 => 移动距离为 当前上车点的位置 - 盒子高度的一半 + 多余的高度
        _moveTop = -(_startScrollTop - _halfMainHeight + _redundant);
    }

    //如果移动距离超过最大移动距离
    if(Math.abs(_moveTop) > _MAX) {
        _moveTop = -_MAX;
    }

    //滚动
    _myIScroll.scrollTo(0, _moveTop);
}

//兼容安卓
function iScrollClick(){
    if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
    if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
    if (/Silk/i.test(navigator.userAgent)) return false;
    if (/Android/i.test(navigator.userAgent)) {
        var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
        return parseFloat(s[0]+s[3]) < 44 ? false : true
    }
}

// 地图功能
function mapFn() {
    // 百度地图API功能
    var map = new BMap.Map("allmap");
    if(undefined == map  || null == map){
        $.hideLoading();
        $.toast('地图加载失败');
        return;
    }
    var startPoint = new BMap.Point(lineInfo.departLng,lineInfo.departLat);   //起点
    var endPoint = new BMap.Point(lineInfo.arriveLng,lineInfo.arriveLat);    //终点
    map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
    map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用

    // 初始化
    var pathwayPonit = [];
    $('.detail-station-list li').each(function (index) {
        var $el = $(this);
        pathwayPonit[index] = {lng: $el.data('lng'), lat: $el.data('lat')};
    });

    // 经途点
    var drivings = addPolyLine(pathwayPonit);

    // 画线
    function addPolyLine(points) {
        var pathwayPonitArr = [];
        for(var item in points) {
            pathwayPonitArr.push(new BMap.Point(points[item].lng, points[item].lat));
        }

        //去掉首尾两个点
        var drivingStart = pathwayPonitArr.shift(),
            drivingEnd = pathwayPonitArr.pop();
        var driving = new BMap.DrivingRoute(map, {
            renderOptions:{map: map, autoViewport: true}
        });
        driving.search(drivingStart, drivingEnd, {
            waypoints: pathwayPonitArr
        });  //waypoints表示途经点

        // 设置添加标注后的回调函数: 删除地图自带的图标
        driving.setMarkersSetCallback(function (pois) {
            for(var item in pois) {
                if(pois[item].marker) {
                    //屏蔽起终图标
                    map.removeOverlay(pois[item].marker);
                }

                if(pois[item].Hm) {
                    //屏蔽经字图标
                    map.removeOverlay(pois[item].Hm);
                }
            }

            //屏蔽起终图标
            $('[src="https://api0.map.bdimg.com/images/dest_markers.png"]').remove();
            //屏蔽经字图标
            $('[src="https://api0.map.bdimg.com/images/way-points.png"]').remove();
            $('[src="https://api.map.baidu.com/images/way-points.png"]').remove();
        });

        //设置中心点为上车点
        driving.setPolylinesSetCallback(function () {
            var $up = $('.detail-station-start li.active');
            var upPoint = '';

            //如果有上车点
            if($up.length > 0) {
                upPoint = new BMap.Point($up.data('lng'), $up.data('lat'));
            } else {
                //则使用默认起点
                upPoint = startPoint;
            }

            map.centerAndZoom(upPoint, 18);
        });

        // 上下车点标注
        $('.detail-station-start li').each(function () {
            var $el = $(this);
            addMarker({lng: $el.data('lng'),lat: $el.data('lat')}, "/res/images/bus/map-4.png", {w: 13, h: 13}, 4);
        });
        $('.detail-station-ending li').each(function () {
            var $el = $(this);
            addMarker({lng: $el.data('lng'),lat: $el.data('lat')}, "/res/images/bus/map-2.png", {w: 13, h: 13}, 4);
        });

        return driving;
    }

    // 起始和终点-图标和大小
    var startIcon = "/res/images/bus/map-start.png",
        startSize = {w: 25, h: 36};
    var endIcon = "/res/images/bus/map-end.png",
        endtSize = {w: 25, h: 36};
    // 上下车点-图标和大小
    var aboardIcon = "/res/images/bus/map-up.png",
        aboardSize = {w: 25, h: 24};
    var debusIcon = "/res/images/bus/map-down.png",
        debusSize = {w: 25, h: 24};

    // 设置起点和目的地
    //var startMarker = addMarker({lng: 113.878651,lat: 22.572961}, startIcon, startSize, 5);
    //var endMarker = addMarker({lng: 113.94454,lat: 22.527815}, endIcon, endtSize, 5);

    // 设置线路上下车点
    var defaultAboardIcon = "/res/images/bus/map-3.png",
        defaultAboardSize = {w: 14, h: 14};
    var defaultDebusIcon = "/res/images/bus/map-1.png",
        defaultDebusSize = {w: 14, h: 14};
    var $defaultAboard = $('.detail-station-start li:first-child');
    addMarker({lng: $defaultAboard.data('lng'),lat: $defaultAboard.data('lat')}, defaultAboardIcon, defaultAboardSize, 4);
    var $defaultDebus = $('.detail-station-ending li:last-child');
    addMarker({lng: $defaultDebus.data('lng'),lat: $defaultDebus.data('lat')}, defaultDebusIcon, defaultDebusSize, 4);

    // 设置上车点和下车点
    var $aboard = $('.detail-station-start li.active');
    if($aboard.length != 0) {
        var aboardMarker = addMarker({lng: $aboard.data('lng'),lat: $aboard.data('lat')}, aboardIcon, aboardSize, 6);

        //文字提示
        var aboardlabel = labelAction($aboard.data('name'));
        aboardMarker.setLabel(aboardlabel);
    }

    var $debus = $('.detail-station-ending li.active');
    if($debus.length != 0) {
        var debusMarker = addMarker({lng: $debus.data('lng'),lat: $debus.data('lat')}, debusIcon, debusSize, 6);

        //文字提示
        var debuslabel = labelAction($debus.data('name'));
        debusMarker.setLabel(debuslabel);
    }

    // 点标注
    function addMarker(point, icon, size, zindex) {
        var markerPoint = new BMap.Point(point.lng, point.lat);
        var markerIcon = new BMap.Icon(icon, new BMap.Size(size.w, size.h), {
            imageSize: new BMap.Size(size.w, size.h)
        });
        var marker = new BMap.Marker(markerPoint,{icon:markerIcon});
        map.addOverlay(marker);

        zindex && marker.setZIndex(zindex);

        return marker;
    }

    //定位上车点
    $('.detail-station-start li').on(click_event, function () {
        var $el = $(this);
        if(undefined != map  && null != map){
            pantoMark($el, aboardIcon, aboardSize, 6);
        }

        var stationName = $el.data('name');
        var stationTime = $el.data('time');
        $('.detail-station-info .station-item:first-child h4').text(stationName);

        var startUseTime = $el.data('min')||0;
        var endUseTime = $('.detail-station-ending li.active').data('min')||0;
        if(endUseTime >= startUseTime){
            var time = endUseTime - startUseTime;
            var text = '约'+time+'分钟'
            $('.detail-station-info .detail-station-distance:last-child').text(text);
        }

        $('.detail-date').text(stationTime);

        changePrice();
    });

    //定位下车点
    $('.detail-station-ending li').on(click_event, function () {
        var $el = $(this);
        if(undefined != map  && null != map){
            pantoMark($el, debusIcon, debusSize, 6);
        }
        var stationName = $el.data('name');
        $('.detail-station-info .station-item:last-child h4').text(stationName);

        var startUseTime = $('.detail-station-start li.active').data('min')||0;
        var endUseTime = $el.data('min')||0;
        if(endUseTime >= startUseTime){
            var time = endUseTime - startUseTime;
            var text = '约'+time+'分钟'
            $('.detail-station-info .detail-station-distance:last-child').text(text);
        }

        changePrice();
    });

    function changePrice(){
        //获取上下车店 stationId
        lineInfo.stationStartId = $('.detail-station-start li.active').data('stationid');
        lineInfo.stationEndingId = $('.detail-station-ending li.active').data('stationid');
        if(lineInfo.childList.length>0){
            for(var i=0;i<lineInfo.childList.length;i++){
                var childLine = lineInfo.childList[i];
                if(childLine.departStationId == lineInfo.stationStartId & childLine.arriveStationId == lineInfo.stationEndingId){
                    //$('#price').html(childLine.sellPrice);
                    busId = childLine.idStr;
                    //reset calendar,for change of sellPrice;
                    initCalendar();
                }
            }
        }
    }

    // 定位站点
    function pantoMark(el, icon, size, zindex) {
        //参数定义
        if(!size) {
            //覆盖物的size
            size = {};
        }

        if(!zindex) {
            //覆盖物的zindex
            zindex = 1;
        }

        var lng = el.data('lng'),
            lat = el.data('lat');
        map.panTo(new BMap.Point(lng, lat));

        //延迟放大
        setTimeout(function () {
            map.setZoom(18);
        }, 500);

        //修改中心点 以至于让地图发生变化
        setTimeout(function() {
            map.setCenter(new BMap.Point(lng, lat))
        }, 1);

        //文字提示
        var label = labelAction(el.data('name'));

        if(el.data('form') == 'on') {
            map.removeOverlay(aboardMarker);
            aboardMarker = addMarker({lng: lng, lat: lat}, icon, size, zindex);
            aboardMarker.setLabel(label);
        } else if(el.data('form') == 'off') {
            map.removeOverlay(debusMarker);
            debusMarker = addMarker({lng: lng, lat: lat}, icon, size, zindex);
            debusMarker.setLabel(label);
        }
    }

    // 文字提示
    function labelAction(dataName) {
        var label = new BMap.Label(dataName);

        // 设置样式
        label.setStyle({
            backgroundColor: '#6392fe',
            borderRadius: '3px',
            fontSize: '12px',
            color: '#fff',
            padding: '0 4px',
            textAlign: 'center',
            height:'20px',
            lineHeight: '20px',
            border: '0 none'
        });

        // 设置偏移
        var l = ((dataName.length - 1) * 12) / 2 - 4;
        label.setOffset(new BMap.Size(-l, -23));

        return label;
    }

    $.hideLoading();
    // $('#selectDatebtn').show();
    return map;
}

function clearLocalCache() {
    // 优惠券缓存
    window.localStorage.removeItem('selectedCoupon');
}

/**
 * 异步加载
 */
function asyncLoading() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://api.map.baidu.com/api?v=2.0&ak=akLhAHTNditLOdtdKYk0dOljbG&callback=mapFn";
    document.body.appendChild(script);
}

$(function() {
    $.showLoading();
    //填充日历
    initCalendar();
    init();
    setMap();
    // mapFn();
    bindScroll();
    clearLocalCache();
    asyncLoading();
});