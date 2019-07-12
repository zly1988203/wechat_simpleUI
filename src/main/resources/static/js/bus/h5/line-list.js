$(function () {

    var providerDomin = document.domain.split('.')[0];
    // dplus.track("浏览首页",{
    //     "车企":providerDomin,
    //     "业务":"定制班线",
    //     "页面名称":"首页",
    //     "页面URL":window.location.href
    // });

    //获取lineId，token
    var providerId = getParam('providerId', window.location.href);
    var lineId = getParam('lineId', window.location.href);//点击热门线路的线路id
    //搜索结果的lineId
    var lineListIds = '';
    var token = getParam('token', window.location.href);
    //当前位置的经纬度
    var lng = getParam('lng', window.location.href);
    var lat = getParam('lat', window.location.href);
    //lineType 线路类型 1-定制班线线路;2-上下班线路;3-旅游线路
    var lineType = getParam('lineType', window.location.href);
    var lineName = getParam('lineName', window.location.href);
    var busId = getParam('busId', window.location.href);//历史记录进入的busID

    // 搜索线路标志 1-表示是从搜索按钮进入该页面，需要先获取lineId,然后生成nav日历；2-从历史记录进入只有busId，需要查询lineId，显示日历和线路详细信息
    var search = getParam('search', window.location.href);
    //后台系统返回的当前时间
    var timestamp = getParam('timestamp', window.location.href);
    var departAreaId = getParam('departAreaId', window.location.href);
    var departCityName = getParam('departCityName', window.location.href);
    var departLat = getParam('departLat', window.location.href);
    var departLng = getParam('departLng', window.location.href);
    var departDate = getParam('departDate', window.location.href);
    var startAddr = getParam('startAddr', window.location.href);
    var endAddr = getParam('endAddr', window.location.href);
    var arriveCityName = getParam('arriveCityName', window.location.href);
    var arriveLng = getParam('arriveLng', window.location.href);
    var arriveLat = getParam('arriveLat', window.location.href);
    var arriveAreaId = getParam('arriveAreaId', window.location.href);

    //分销标志
    var distrib = getParam('distrib', window.location.href);

    var refreshFlag = false;//需要刷新标记

    var now = new Date();//今天
    var nowStr = myFormatDate(now); //今天
    var nowBuyFlag = false;//今天所有线路可售标记 用于反写今天的nav车票信息为售罄还是有票
    var existBaseBus = true;//判断是否存在班次
    var _activeDay = nowStr;//选中的日期 默认是今天
    if(search == '1'){//表示是从搜索进入的
       _activeDay = departDate;//选中的日期 从url参数中获取
    }else if(search == '2'){//表示是历史记录进入的
       //TODO
        _activeDay = departDate;//选中的日期 从url参数中获取？？
    }

    var navSuccessFlag = false;//请求nav成功标记
    var lineSuccessFlag = false;//请求线路时间成功标记


    // 后台数据： ticketInfoList:日期车票信息；date:日期;saleState:车票状态 0-有票，1-售罄，-1-未排班;
    var allTicketInfoList = [];

    //需要显示在上方的日历天数
    var navbarInfoSize = $('.ola-date').data('size');
    //需要显示在上方的日历数据
    var navbarInfoList = [];
    var dateScroll = null;

    $('.main-container').loading();
    //请求navbarr数据
    var requstNavbar = function () {
        navSuccessFlag = false;
        //api url
        var urlStr = SERVER_URL_PREFIX + "/busline/calendarList";
        //current page param
        var dataObj = {};
        dataObj.providerId = providerId;
        dataObj.departDate = _activeDay; //日期
        if(search == '1' || search == '2'){
            dataObj.lineIds = lineListIds;//线路ids
            dataObj.distrib = '1';//分销标志
        }else{
            dataObj.lineIds = lineId;//线路id
            if(distrib != '' || distrib != null || typeof(distrib) != 'undefined' ){
                dataObj.distrib = distrib;//分销标志
            }
        }
        dataObj.lineType = lineType;
        dataObj = genReqData(urlStr, dataObj);
        $.ajax({
            type: 'POST',
            data: dataObj,
            url: urlStr,
            dataType: 'json',
            success: function (res) {
                if (res.code == 0) {
                    navSuccessFlag = true;
                    allTicketInfoList = res.data;
                    navbarInfoList = createNavbarData(_activeDay, allTicketInfoList, navbarInfoSize);
                    //显示日历并显示有票还是售罄
                    showNavbarInfo(navbarInfoList);
                    dateScroll = new IScroll('#wrapper', {
                        scrollX: true,
                        scrollY: false,
                        mouseWheel: true
                    });
                    checkHideLoading();
                } else {
                    //error
                }
            },
            error: function () {
            }
        });
    };

    //请求到的线路数据
    var lineInfoData = null;
    //推荐线路详细信息数据 单条线路查询
    var requstLineInfo = function () {
        lineSuccessFlag = false;
        $('.main-container').loading();
        $('.main-container').html('');
        var urlStr = "/lineListJson";
        var dataObj = {};
        dataObj.departDate = _activeDay; //日期
        dataObj.lineId = lineId;//线路id
        if(distrib!=''){
            dataObj.distrib = distrib;//分销标志
        }

        dataObj.lng = lng;//经纬度
        dataObj.lat = lat;//经纬度
        dataObj.lineType = lineType;
        dataObj.lineName = lineName;
        dataObj = genReqData(urlStr, dataObj);
        $.ajax({
            type: 'GET',
            data: dataObj,
            url: urlStr,
            dataType: 'json',
            success: function (res) {
                if(res.code == 0){
                    lineSuccessFlag = true;
                    lineInfoData = res.data;
                    fullLines(lineInfoData);
                    // checkTodayNav(allTicketInfoList);//回写nav的今天票数情况 因当天是否可购票受时间影响
                    checkHideLoading();
                }else{
                    //error
                }
            },
            error: function(){

            }
        });
    };

    // 根据搜索的起点和终点，查询路线 多条线路查询
    var requstSearchBus = function () {
        // if(refreshFlag){
        //     //刷新页面
        //     window.location="/busLine/searchBus?"+"token="+token + "&departLng="+departLng + "&departLat="+departLat + "&arriveLng="+arriveLng + "&arriveLat="+arriveLat
        //         +"&departDate="+_activeDay + "&departCityName="+departCityName + "&arriveCityName="+arriveCityName + "&startAddr="+startAddr + "&endAddr="+endAddr
        //         + "&departCityId=" + departAreaId + "&arriveCityId=" + arriveAreaId + "&lineType="+lineType;
        // }else{
            lineSuccessFlag = false;
            $('.main-container').loading();
            $('.main-container').html('');
            var urlStr = "/busLine/searchBusJson";
            var dataObj = {};
            // dataObj.lineId = lineId;//线路id
            dataObj.lineType = lineType;
            dataObj.lineName = lineName;
            dataObj.lng = lng;//经纬度
            dataObj.lat = lat;//经纬度
            dataObj.departAreaId = departAreaId;
            dataObj.departCityName = departCityName;
            dataObj.departLat = departLat;
            dataObj.departLng = departLng;
            dataObj.departDate = _activeDay;
            dataObj.startAddr = startAddr;
            dataObj.endAddr = endAddr;
            dataObj.arriveCityName = arriveCityName;
            dataObj.arriveLng = arriveLng;
            dataObj.arriveLat = arriveLat;
            dataObj.arriveAreaId = arriveAreaId;

            dataObj = genReqData(urlStr, dataObj);
            $.ajax({
                type: 'post',
                data: dataObj,
                url: urlStr,
                dataType: 'json',
                success: function (res) {
                    if(res.code == 0){
                        lineSuccessFlag = true;
                        fullLines(res.data);
                        if(isSameDate(_activeDay ,departDate)){
                            // 获取lineId 查询navdate
                            requstNavbar();
                            checkHideLoading();
                        }else {
                            //不请求navdata
                            navSuccessFlag = true;
                            checkHideLoading();

                            $('#wrapper li').forEach(function (item, index) {
                                var itemDate = $(item).data('date');
                                if(itemDate && isSameDate(itemDate,_activeDay)){
                                    dateScroll.scrollToElement($('#wrapper li')[index], 500, false, false, IScroll.utils.ease.circular);
                                    $($('#wrapper li')[index]).addClass('active').siblings().removeClass('active')
                                }
                            });
                        }
                    }
                },
                error: function () {

                }
            });
        // }
    };

    //历史线路根据busId查询记录 历史线路查询
    var reqLineListJson = function () {
        // if(refreshFlag){
        //     //刷新页面
        //     window.location="/bus/lineList?busId=" + busId + "&&token="+$.cookie("token") + "&departDate=" + _activeDay +"&lineType="+lineType;
        // }else{
            lineSuccessFlag = false;
            $('.main-container').loading();
            $('.main-container').html('');
            $.ajax({
                type: 'POST',
                url: '/bus/lineHisListJson',
                data: {'token':$.cookie('token'),'busId':busId,departDate:_activeDay,lineType:getParam('lineType',window.location.href)},
                dataType:'json',
                success:function (res) {
                    if(res.code == 0){
                        lineSuccessFlag = true;

                        fullLines(res.data , 1);//历史记录当天无票，之后有票特殊处理

                        if(isSameDate(_activeDay ,departDate)){
                            // 获取lineId 查询navdate
                            requstNavbar();
                            checkHideLoading();
                        }else {
                            //不请求navdata
                            navSuccessFlag = true;
                            checkHideLoading();

                            $('#wrapper li').forEach(function (item, index) {
                                var itemDate = $(item).data('date');
                                if(itemDate && isSameDate(itemDate,_activeDay)){
                                    dateScroll.scrollToElement($('#wrapper li')[index], 500, false, false, IScroll.utils.ease.circular);
                                    $($('#wrapper li')[index]).addClass('active').siblings().removeClass('active')
                                }
                            });
                        }
                    }
                },
                error: function () {

                }
            });
        // }
    };
    // 从搜索按钮进入先获取lineId；
    if(search=='1'){
        requstSearchBus();
    }else if(search == '2'){
        //TODO
        reqLineListJson();
    }else{
        requstNavbar();
        requstLineInfo();
    }
    //全部日期
    selectDate(_activeDay);

    // 是否需要关闭loading
    function checkHideLoading(){
        if(navSuccessFlag && lineSuccessFlag){
            $('.main-container').hideLoading();
        }
    }

    /**
     * 显示线路信息
     * @param data线路信息
     * searchType 主要用来处理当天没有班次，当天之后有班次的情况
     */
    function  fullLines(data , searchType) {
        var _html = '';
        lineListIds = '';
        var lineInfoList = [];
        if(data.baseBusList.length > 0 ){
            lineInfoList = data.baseBusList;
            //空页面
            if(lineInfoList.length <= 0){
                _html += '<div class="empty-page"><div class="empty-main">' +
                    '<i style="padding-top: 43.07%; background-image: url(/res/images/common/icon_defect_line.png);"></i>' +
                    '<p>暂时没有找到合适的线路<br>换个地点再试试吧。</p>' +
                    '<div class="btn primary" id="backIndex">回到首页</div>' +
                    '</div></div>';
                
                existBaseBus = false;
            }
            else{
                _html += '<ul class="ola-list-box">';
                $.each(lineInfoList,function (index, item) {
                    //线路信息
                    var lineItem = item;
                    // //线路ID
                    // if((lineInfoList.length-1) == index){
                    //     lineListIds += lineItem.lineId;
                    // }else{
                    //     lineListIds += lineItem.lineId + ',';
                    // }

                    //分销合作线路标签
                    var _distributionHtml = '';
                    //活动标签
                    var _activeHtml = '';
                    if(undefined != lineItem.activityTag && lineItem.activityTag.length > 0){
                        $.each(lineItem.activityTag,function (index, item) {
                            //判断第一个活动标签是否是合作线路
                            if(index == 0){
                                if(lineItem.isCooperateDealer == 1){//合作线路标记
                                    _distributionHtml += '<span class="distribution">'+ item + '</span>';
                                }else{
                                    _activeHtml += '<span class="discount-name">' + item + '</span>';
                                }
                            }else{
                                _activeHtml += '<span class="discount-name">' + item + '</span>';
                            }
                        })
                    }
                    //特色标签
                    var characteristicHtml = '';
                    $.each(lineItem.tagList,function (index,item) {
                        characteristicHtml += '<span>' + item + '</span>';
                    });
                    //站点信息
                    var _stationHtml = '<div class="ola-station">';
                    //起点站
                    var _departHtml = '';
                    //终点站
                    var _arriveHtml = '';

                    if(lineItem.busLineStationList){
                        if(lineItem.busLineStationList.length > 0){
                            //KK出行特殊处理
                            var departStation = '';
                            var arriveStation = '';
                            $.each(lineItem.busLineStationList,function (index, item) {
                                if(item.type == 1){
                                    // 上车站点
                                    departStation += item.stationName + ' > ';
                                }else if(item.type == 2){
                                    // 下车站点
                                    arriveStation += item.stationName + ' > ';
                                }
                            });
                            departStation = departStation.substring(0, departStation.length-3);
                            arriveStation = arriveStation.substring(0, arriveStation.length-3);
                            _departHtml += '<div class="ola-station-item special-station"><div class="ola-station-info"><h4>'+ departStation +'</h4></div></div>';
                            _arriveHtml += '<div class="ola-station-item special-station"><div class="ola-station-info"><h4>'+ arriveStation +'</h4></div></div>';
                        }
                    }else{
                        _departHtml = '<div class="ola-station-item"><div class="ola-station-info"><h4>'+ lineItem.departStation +'</h4></div></div>';
                        _arriveHtml = '<div class="ola-station-item"><div class="ola-station-info"><h4>'+ lineItem.arriveStation + '</h4></div></div>';
                    }
                    _stationHtml += _departHtml + _arriveHtml;
                    _stationHtml += '</div>';


                    var ticketOutClass = '';//线路无可售班次样式;
                    //线路车票数据列表
                    var _lineListHtml = '';
                    var lineListData = lineItem.sameStationBusList;
                    if(lineListData.length > 0){
                        var _ticketNoHtml = '';//余票张数
                        var _specialMarkHtml = '';//特价标签
                        var _specialPriceHtml = '';//特价票价显示
                        var lineSellOutFlag = false;//线路是否为售罄样式  true为有票 FALSE为售罄-no-stock

                        var oneOutClass = '';//单个时刻售罄样式 有票情况下为可点击样式
                        _lineListHtml += '<ul class="sui-list-link ola-ticket">';
                        var busId = '';
                        var _travelHtml = '';//旅游班线配图和简介
                        var _useTimeHtml = '';//旅游班线不需要显示时间
                        var travelLineId = '';//旅游班线lineId

                        //只显示三条 多余的折叠
                        var _showAllHtml = '';
                        if(lineListData.length > 3){
                            _showAllHtml += '<div class="all show-all">显示全部</div>';
                        }
                        $.each(lineListData,function (index,item) {
                            //buyFlag 是否可买 1-可买, 2-售罄;  sizeFlag 1-, 2-;  sellPrice 售价;
                            //specialState 特价标记 1-特价; specialPrice 特价价格; ticketRemainNum 剩余票数量; departTime 出发时间
                            var lineData = item;
                            if(lineData.ticketRemainNum > 0){//有余票
                                if(lineType == 3){//旅游路线
                                    _travelHtml =  '<div class="travel">' +
                                        '<div class="thumb" style="background-image: url('+ lineItem.linePicUrl +')"></div>' +
                                        '<h4>'+  ((typeof(lineItem.lineTitle) == "undefined")?'':lineItem.lineTitle) +'</h4>' +
                                        '</div>';
                                    _useTimeHtml = '';
                                    travelLineId = lineData.lineId;
                                }else{
                                    _travelHtml =  '';
                                    _useTimeHtml = '<div class="duration">约' + lineItem.useTime + '分钟</div>';
                                }

                                if(lineData.specialState == 1){//有特价
                                    oneOutClass = '';
                                    _ticketNoHtml = '';
                                    if(lineData.buyFlag == 1){//可购票
                                        oneOutClass = ' sell';
                                        busId = lineData.idStr;
                                        if(lineData.ticketRemainNum > 0 && (lineData.ticketRemainNum <= data.remainShowNumber)){
                                            _ticketNoHtml = '<i>剩' + lineData.ticketRemainNum + '张</i>';
                                        }
                                        if(isToday(myFormatDate(new Date(lineItem.departDate)))){
                                            nowBuyFlag = nowBuyFlag || true;
                                        }
                                        lineSellOutFlag = lineSellOutFlag || true;
                                    }else if(lineData.buyFlag == 2){// 有票但不可购票
                                        oneOutClass = ' sell-out';
                                        _ticketNoHtml = '<i>已停售</i>';
                                        if(isToday(myFormatDate(new Date(lineItem.departDate)))){
                                            nowBuyFlag = nowBuyFlag || false;
                                        }
                                        lineSellOutFlag = lineSellOutFlag || false;
                                    }
                                    _specialMarkHtml = '<span class="special-icon">特价</span>';
                                    _specialPriceHtml = '<div class="ola-ticket-btn"><em class="original">' + lineData.sellPrice +'元</em>' + lineData.specialPrice + '元</div>';
                                }else{// 无特价
                                    oneOutClass = '';
                                    _ticketNoHtml = '';
                                    if(lineData.buyFlag == 1){
                                        oneOutClass = ' sell';
                                        busId = lineData.idStr;
                                        if(lineData.ticketRemainNum > 0 && (lineData.ticketRemainNum <= data.remainShowNumber)){
                                            _ticketNoHtml = '<i>剩' + lineData.ticketRemainNum + '张</i>';
                                        }
                                        if(isToday(myFormatDate(new Date(lineItem.departDate)))){
                                            nowBuyFlag = nowBuyFlag || true;
                                        }
                                        lineSellOutFlag = lineSellOutFlag || true;
                                    }else if(lineData.buyFlag == 2){
                                        oneOutClass = ' sell-out';
                                        _ticketNoHtml = '<i>已停售</i>';
                                        if(isToday(myFormatDate(new Date(lineItem.departDate)))){
                                            nowBuyFlag = nowBuyFlag || false;
                                        }
                                        lineSellOutFlag = lineSellOutFlag || false;
                                    }

                                    _specialPriceHtml = '<div class="ola-ticket-btn">' + lineData.sellPrice + '元<em>起</em></div>';
                                }
                            }else{// 已售罄
                                if(lineType == 3){//旅游路线
                                    _travelHtml =  '<div class="travel">' +
                                        '<div class="thumb" style="background-image: url("'+ lineItem.linePicUrl +'")"></div>' +
                                        '<h4>'+ ((typeof(lineItem.lineTitle) == "undefined")?'':lineItem.lineTitle) +'</h4>' +
                                        '</div>';
                                    _useTimeHtml = '';
                                    travelLineId = lineData.lineId;
                                }else{
                                    _travelHtml =  '';
                                    _useTimeHtml = '<div class="duration">约' + lineItem.useTime + '分钟</div>';
                                }
                                oneOutClass = ' sell-out';
                                _ticketNoHtml = '<i>已售罄</i>';
                                if(lineData.specialState == 1){//有特价
                                    _specialMarkHtml = '<span class="special-icon">特价</span>';
                                }
                                _specialPriceHtml = '<div class="ola-ticket-btn">' + lineData.sellPrice + '元<em>起</em></div>';
                                nowBuyFlag = nowBuyFlag || false;
                                lineSellOutFlag = lineSellOutFlag || false;
                            }

                            _lineListHtml += '<li class="ola-ticket-item sui-border-b' + oneOutClass + '" data-href="#" busId=' + busId + '>' +
                                '<div class="ola-ticket-info">' +
                                '<h4>'+ strToHour(lineData.departTime) + '</h4>' +
                                _ticketNoHtml + _specialMarkHtml +
                                '</div>' +
                                _specialPriceHtml +
                                '</li>';
                        });
                        _lineListHtml += '</ul>' + _showAllHtml;
                    }
                    else{
                        //无可售班次
                        ticketOutClass = ' no-stock';
                        _lineListHtml = '<div class="no-stock-status">无可售班次</div>';
                        if(isToday(myFormatDate(new Date(lineItem.departDate)))){
                            nowBuyFlag = nowBuyFlag || false;
                        }
                    }

                    if(!lineSellOutFlag){
                        ticketOutClass = ' no-stock';
                    }
                    _html += '<li class="lineItem' + ticketOutClass + '" data-lineid='+ lineItem.lineId +'>' +
                        _travelHtml +
                        '<div class="ola-head sui-border-b">' +
                        '<div class="line-labels">' + _distributionHtml + _activeHtml + '</div>' +
                        _useTimeHtml +  _stationHtml +
                        '<div class="ola-label">'+ characteristicHtml +'</div>' +
                        '</div>' +
                        _lineListHtml +
                        '</li>'
                });
                _html += '</ul>'
            }
        }
        else{
            _html += '<div class="empty-page"><div class="empty-main">' +
            '<i style="padding-top: 43.07%; background-image: url(/res/images/common/icon_no_ticket.png);"></i>' +
            '<p>暂无符合条件车次，请尝试更换日期</p>' +
            '<div class="btn primary" id="backIndex">回到首页</div>' +
            '</div></div>';
            
            existBaseBus = false;

        }

        //特殊处理当天没有班次，但当天之后有班次的情况
        if(typeof(data.busLineList)!='undefined'){
            lineInfoList = data.busLineList;
            $.each(lineInfoList,function (index, item) {
                if(searchType == 1){//历史线路返回结果的结构不同
                    //线路ID
                    if((lineInfoList.length-1) == index){
                        lineListIds += item.lineId;
                    }else{
                        lineListIds += item.lineId + ',';
                    }
                }else{
                    //线路ID
                    if((lineInfoList.length-1) == index){
                        lineListIds += item;
                    }else{
                        lineListIds += item + ',';
                    }
                }
            })
        }

        $('.main-container').html(_html);

        //回写今天是否有票
        if(nowBuyFlag){
            var all = $('.ola-date li');
            $.each(all,function (index, item) {
                if($(item).data('today')){
                    $(item).find('.message').html('有票');
                    $(item).find('.message').addClass('on-sale');
                }
            })
        }else{//已售罄-有票但不可买情况
        	if (existBaseBus) {
                var all = $('.ola-date li');
                $.each(all,function (index, item) {
                    if($(item).data('today') &&  $(item).find('.message').html()!="停售"){
                        $(item).find('.message').html('售罄');
                        $(item).find('.message').addClass('sell-out');
                    }
                })
        	}
        }

        $('.lineItem .travel').on('click',function () {
           var fromUrl = window.location.href;
           localStorage.setItem("travelLineList",fromUrl);
           var travelLineId = $($(this).parent('li')[0]).data('lineid');
           window.location = '/travel/travelLineInfo?lineId='+ travelLineId +'&fromUrl=toLineList'
        });

        //switch展示全部
        $('.show-all').on('click', function () {
            var el = $(this);

            //show
            el.data('clock', true);
            el.addClass('somersault');
            el.siblings('.ola-ticket').addClass('slideToggle');

            el.remove();
        });

        //可购票点击事件
        $(".sell").click(function(){
            dplus.track("线路班次列表-选择线路班次",{
                "车企":providerDomin,
                "业务":"定制班线",
                "页面名称":"线路班次列表",
            });
            var busId=$(this).attr('busId');
            $.ajax({
                type: "GET",
                url: "/busline/judegLineDetail",
                data:{'token':$.cookie('token'),'busId':busId},
                dataType: "json",
                success: function(result){
                    if(result!=undefined&&result.code!=undefined&&parseInt(result.code)==0){
                        // window.location='/busline/toLineDetail?busId='+busId +'&qrcId=' + qrcId;
                        window.location='/busline/toLineDetail?busId='+busId ;
                    }else{
                        $.alert(result.message||'该班次已停售',function(){
                            window.location.reload();
                            return false;
                        });
                    }
                }
            });
        })

        //回到首页按钮
        $('#backIndex').off().on('click',function(){
            if(lineType==1){//定制班线
                window.location = "/busIndex?token="+token+"&departLng="+departLng +"&departLat="+departLat+"&arriveLng="+arriveLng
                    +"&arriveLat="+arriveLat+"&departDate="+departDate+"&departCityName="+departCityName+"&arriveCityName="+arriveCityName
                    +"&startAddr="+startAddr+"&endAddr="+endAddr;
            }else if(lineType == 3){//旅游班线
                window.location = "/travelIndex?token="+token+"&departLng="+departLng +"&departLat="+departLat+"&arriveLng="+arriveLng
                    +"&arriveLat="+arriveLat+"&departDate="+departDate+"&departCityName="+departCityName+"&arriveCityName="+arriveCityName
                    +"&startAddr="+startAddr+"&endAddr="+endAddr;
            }
        });
    }

    /**初始化日期车票信息
     * @param dataList:车票信息列表
     * 默认为售罄 日期按照传入的参数填充
     */
    function showNavbarInfo(dataList){
        $('.ola-date').html('');//清空日历
        //1.日历填充
        var _html = '';
        for(var i=0; i<dataList.length; i++){
            //日期处理
            var dateTemp = strToDate(dataList[i].date);
            var className = "";//初始化时默认选中今天的class
            var todayFlag = false;//是否是今天
            if(switchWeeks(dateTemp) == '今天'){
                className = ' active';
                todayFlag = true;
            }

            var className2 = ''; //选中日期重新生成时，默认选中选中的日期
            //选中日期重新生成时，默认选中选中的日期
            if( isSameDate(_activeDay,dataList[i].date)){//等于选中日期的li为active
                if(!todayFlag){
                    className2 = " active";
                }
            }

            var ticketInfo = '/';
            var ticketClass = ' ';
            var clickFlag = true;//可点击标志： 只有未排班时为FALSE
            if(dataList[i].saleState ===0 || dataList[i].saleState==='0'){
                ticketInfo = '有票';
                ticketClass = ' on-sale';
            }else if(dataList[i].saleState === 1 || dataList[i].saleState==='1'){
                ticketInfo = '售罄';
                ticketClass = ' sell-out';
            }else if(dataList[i].saleState === -1 || dataList[i].saleState==='-1'){
                ticketInfo = '/';//未排班
                ticketClass = ' not-start';
                clickFlag = false;
            }else if(dataList[i].saleState === 3 || dataList[i].saleState==='3'){
                ticketInfo = '停售';//未排班
                ticketClass = ' sell-out';
                clickFlag = false;
            }
            //search=1和2时，是先获取线路信息，然后查询nav，今天是否有票需要重新判断
            if(search == '1' || search == '2'){
                if(isSameDate(_activeDay,dataList[i].date)){
                    if(nowBuyFlag){
                        ticketInfo = '有票';
                        ticketClass = ' on-sale';
                    }
                }
            }

            _html += '<li class="' + className + className2 +'" data-date=' + dataList[i].date + ' data-today='+ todayFlag +' todayflag='+ todayFlag +' data-clickable='+clickFlag+'>' +
                '<div class="weeks">' + switchWeeks(dateTemp) + '</div>' +
                '<div class="date">' + new Date(dateTemp).getDate() + '</div>' +
                '<div class="message ' + ticketClass + '">'+ ticketInfo +'</div>' +
                '</li>'
        }
        _html+='<li></li>';//解决最后一个显示不出来问题
        $('.ola-date').html(_html);

        //  清除今天的active
        if($('.ola-date li.active').length > 1){
            for(var i=0;i<$('.ola-date li.active').length;i++){
                $("[data-today='true']").removeClass('active');
            }
        }

        //绑定点击事件
        var date_event = isAndroid() ? 'tap' : 'click';
        $('.ola-date li').on(date_event, function () {
            if($(this).data('clickable')){
                refreshFlag = false;//不需要刷新
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
                dateScroll.scrollToElement($(this)[0], 500, false, false, IScroll.utils.ease.circular);
                _activeDay = $(this).data('date');//缓存选中日期
                if(search == '1'){
                    requstSearchBus();// 请求线路详细数据
                }else if(search == '2'){
                    //TODO
                    reqLineListJson();
                }else{
                    requstLineInfo();// 请求线路详细数据
                }
            }
        });
    }

    /***
     * 选择日期
     * @param today:当天日期 格式为yyyy-mm-dd
     */
    function selectDate(today) {
        var trigger = $('.all-date-btn'),
            parent = $('#select-date'),
            cancel = parent.find('.cancel');
        var initDateStatus = false;


        var init = function () {
            //只初始化一次
            if(!initDateStatus) {
                initDateStatus = true;
                parent.find('.date').datePicker({
                    dateBase: _activeDay,
                    weekend: true,
                    multiple: false,
                    switchMonth: switchMonth,
                    after:[-1,1],
                    gather: createShowDate(allTicketInfoList, nowStr),//可选择的数据集合
                    selectCallback: function (data) {
                        //点击选中日期事件之后的事情
                        var d = data.selectData[0].date;
                        _activeDay = d.year + '-' + d.month + '-' + d.day;
                        parent.setPopupData(_activeDay);
                        cancel.triggerHandler('click');
                        refreshFlag = true;//需要刷新

                        if(search=='1'){
                            requstSearchBus();
                        }else if(search == '2'){
                            //TODO
                            reqLineListJson();
                        }else{
                            //重新请求navBar数据
                            requstNavbar();
                            //重新请求lineInfo数据
                            requstLineInfo();
                        }


                    }
                });
            }
        };

        //弹出层
        trigger.on('click', function () {
            parent.popup('modal', init, function (data) {
                trigger.data('choice',data);
            });
        })

        //返回
        $('#select-date .cancel').on('click', function () {
            parent.closePopup();
        });
    }



    /***
     * 上一月 下一月点击事件
     * @param date
     * @param picker
     */
    function switchMonth(date,picker) {
        //api url
        var urlStr = SERVER_URL_PREFIX+"/busline/calendarList";
        //current page param
        var dataObj = {};
        dataObj.providerId = providerId;
        dataObj.lineType = lineType; //线路类型
        dataObj.departDate = date; //日期
        if(search == '1'){
            dataObj.lineIds = lineListIds;//线路id
            dataObj.distrib = '1';// 分销标志
        }else if(search == '2'){
            //TODO
            dataObj.lineIds = lineListIds;//线路id
            dataObj.distrib = '1';// 分销标志
        }else {
            dataObj.lineIds = lineId;//线路id
        }
        dataObj = genReqData(urlStr, dataObj);
        var requestServer = function(){
            $.ajax({
                type: 'POST',
                data: dataObj,
                url: urlStr,
                dataType: 'json',
                success:function (res){
                    allTicketInfoList = res.data;
                    if (picker!=null) {
                        picker.reset({
                            gather: createShowDate(res.data, nowStr)
                        });
                        picker.full(date);
                    }
                },
                error:function(){
                }
            });
        }

         requestServer();
    }

    /*可选择的数据*/
    function createShowDate(dataList ,nowStr) {
        nowStr = myFormatDateStr(nowStr);
        var result = [];
        dataList.forEach(function (item, index) {
            var _resultTemp = item;
            if(nowStr <= item.date){
                if(item.saleState=='0' || item.saleState==0){
                    _resultTemp.comment = '有票';
                    _resultTemp.state = 'select';//可选择
                }else if(item.saleState=='1' || item.saleState==1){
                    _resultTemp.comment = '售罄';
                    _resultTemp.state = 'select';//可选择
                }else if(item.saleState=='-1' || item.saleState==-1){
                    _resultTemp.comment = '';//未排班不显示备注
                    _resultTemp.state = '';//不可选择
                }
                else if(item.saleState=='3' || item.saleState==3){
                    _resultTemp.comment = '停售';//未排班不显示备注
                    _resultTemp.state = '';//不可选择
                }
            }

            //search=1时，今天的信息需要回写
            if(search==1){
                if(isSameDate(myFormatDate(now),item.date)){
                    if(nowBuyFlag){
                        _resultTemp.comment = '有票';
                        _resultTemp.state = 'select';//可选择
                    }
                }
            }
            result.push(_resultTemp);
        });
        return result;
    }
});



/***
 * 获取navbar显示的数据
 * @param selectedDate 选中的日期 yyyy-dd-mm格式字符串
 * @param allDataList 所有日期
 * @param navbarInfoSize
 * @returns {Array} 返回结果
 */
function createNavbarData(selectedDate,allDataList,navbarInfoSize){
    var navbarResult = [];
    var selected = myFormatDateStr(selectedDate);
    for(var i=0;i<allDataList.length;i++){
        var item = allDataList[i];
        if(selected <= item.date){
            if(navbarResult.length < navbarInfoSize){
                navbarResult.push(item);
            }
        }
    }
    return navbarResult;
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


/***
 * 格式化date类型日期
 * @param date date对象 返回yyyy-mm-dd格式的string
 */
function myFormatDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();

    if(month <= 9){
        month = '0' + month;
    }
    if(day <=9 ){
        day = '0' + day;
    }
    return year + '-' + month + '-' + day;
}

/***
 * 格式化字符串类型日期
 * @param dateStr string类型的date yyyy-mm-dd格式
 * @returns {string}
 */
function myFormatDateStr(dateStr) {
    var str = dateStr.split('-');
    var year = str[0];
    var month = str[1];
    var day = str[2];

    if(parseInt(month) <= 9){
        month = '0' + parseInt(month);
    }
    if(parseInt(day) <=9 ){
        day = '0' + parseInt(day);
    }

    return year + '-' + month + '-' + day;
}

/***
 * 判断两个日期是否是同一天
 * @param date1 yyyy-mm-dd
 * @param date2 yyyy-mm-dd
 */
function isSameDate(date1,date2) {
    var sameDateFlag = false;
    var temp1 = date1.split('-');
    var temp2 = date2.split('-');
    if(parseInt(temp1[0]) == parseInt(temp2[0])){
        if(parseInt(temp1[1]) == parseInt(temp2[1])){
            if(parseInt(temp1[2]) == parseInt(temp2[2])){
                sameDateFlag = true;
            }
        }
    }
    return sameDateFlag;
}

/**
 * 判断当前日期date是否是今天
 * @param date 格式yyyy-mm-dd
 */
function isToday(date) {
    var _isToday = false;
    var _date = date.split('-');
    var _year = 0,
        _month = 0,
        _day = 0;
    if(_date.length > 2){
        _year = parseInt(_date[0]);
        _month = parseInt(_date[1] - 1);
        _day = parseInt(_date[2]);
    }else{
        return false;
    }
    date = new Date(_year, _month, _day);

    var localDate = new Date();//本地时间
    if(localDate.getFullYear() == date.getFullYear()){
        if(localDate.getMonth() == date.getMonth()){
            if(localDate.getDate() == date.getDate()){
                _isToday = true;
            }
        }
    }
    return _isToday;
}

//星期切换
function switchWeeks(date){
//            var _date = new Date(date);
    var week = '';
    switch(parseInt(date.getDay())){
        case 0:
            week = '日';
            break;
        case 1:
            week = '一';
            break;
        case 2:
            week = '二';
            break;
        case 3:
            week = '三';
            break;
        case 4:
            week = '四';
            break;
        case 5:
            week = '五';
            break;
        case 6:
            week = '六';
            break;
    }

    //今天判断: 年月日跟本地的年月日分别相等，则为今天
    var localDate = new Date();
    if(localDate.getFullYear() == date.getFullYear()){
        if(localDate.getMonth() == date.getMonth()){
            if(localDate.getDate() == date.getDate()){
                week = '今天';
            }
        }
    }
    return week;
}

/***
 * 字符串转换为日期
 * @param dateStr 格式yyyy-mm-dd
 * @returns {Date}
 */
function strToDate(dateStr) {
    var temp = dateStr.split('-');
    var _year = temp[0];
    var _month = temp[1]-1;
    var _day = temp[2];
return new Date(_year,_month,_day);
}

/***
 * 返回时间 格式HH:mm
 * @param str
 * @returns {string}
 */
function strToHour(str) {
    var date = new Date(str);
    var hour = date.getHours();
    var min = date.getMinutes();
    if(hour <= 9){
        hour = '0' + hour;
    }
    if(min <=9 ){
        min = '0' + min;
    }
    return hour + ':' + min;
}
