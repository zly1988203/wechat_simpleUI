//线路类型 "1.定制  2.通勤 3旅游'
var LINE_TYPE = { bus: '1',commute: '2',travel: '3'};
// 分销标志 1-分销线路??或者默认
var  DISTRIB_TYPE = {distrib:'1'};
// 搜索类型 1-搜索框输入；2-历史记录；''-默认热门推荐线路
var SEARCH_TYPE = {input:'1',history:'2',hot:''};

//票状态0：有票；1-售罄 ；-1：没有排班；
var SELL_STATUS = {
    onSell: '0',//有票
    sellOut: '1',//售罄
    unplanned: '-1',//未排班
    finished: '3',// 停售
};
//节假日标记 -1-无  0-休 1-班
var FESTIRVAL_TYPE = {
    vacation : '0',  //法定节假日
    workday: '1', //法定节假日调班 一般在周末
    normal: '-1' //无节假日
};

var userInfo = JSON.parse(localStorage.getItem("userInfo"));
var maxDay ;//预售期中的最大天数
var shareFlag = false;
$(function () {
    //加载用户信息
    if (isEmpty(userInfo)) {
        initUserInfo(function () {
            init();
        });
    }
    else {
        init();
    }
});

/**
 * 初始化页面
 */
function init() {
    userInfo = JSON.parse(localStorage.getItem("userInfo"));
    //初始化当前日历
    var activeDay = localStorage.getItem('activeDay');
    var paramList = getUrlParams();
    var now = new Date();
    if(isEmpty(activeDay)){
        activeDay = paramList.departDate;
    }else if(!isSameDate(activeDay, paramList.departDate)){
        activeDay = paramList.departDate;
        localStorage.setItem('activeDay',activeDay);
    }

    //比较两个日期
    var dateFlag = compareDate(activeDay, now);
    if(dateFlag == -1){//activeDay是今天之前的日期
        activeDay = formatDateToString(now);
    }

    changeActiveDay(activeDay);

    var providerInfo = JSON.parse(localStorage.getItem('providerInfo'));
    var reqCalendarData = {
        providerId : providerInfo.providerId,
        departDate: activeDay,
        lineType: paramList.lineType,
    };
    //判断是那种方式进入该页面
    if(paramList.search == SEARCH_TYPE.input){
        //搜索进入
        //1.请求线路结果 2.线路结果获取lineIdList，作为请求日历的入参
        searchLineList(activeDay,function (paraObj) {
            //请求日历
            if(isEmpty(paraObj.lineIds)){
                reqCalendarData.lineIds = paramList.lineListIds;//线路ids
            }else{
                reqCalendarData.lineIds = paraObj.lineIds;//线路ids
            }
            reqCalendarData.distrib = '1';//分销标志
            getCalendarList(reqCalendarData,function (list) {
                //计算预售期
                maxDay = getMaxDayOfSell(paraObj);
                setChangeDay(paraObj);//前一天后一天按钮是否显示
                initDatePicker(list, maxDay);
            });

        });
    }else if(paramList.search == SEARCH_TYPE.history){
        //历史记录进入
        //1.请求线路结果 2.线路结果获取lineIdList，作为请求日历的入参
        searchLineList(activeDay,function (paraObj) {
            //请求日历
            if(isEmpty(paraObj.lineIds)){
                reqCalendarData.lineIds = paramList.lineListIds;//线路ids
            }else{
                reqCalendarData.lineIds = paraObj.lineIds;//线路ids
            }
            reqCalendarData.distrib = '1';//分销标志
            getCalendarList(reqCalendarData,function (list) {
                //计算预售期
                maxDay = getMaxDayOfSell(paraObj);
                setChangeDay(paraObj);//前一天后一天按钮是否显示
                initDatePicker(list, maxDay);
            });
        });
    }else{
        //热门推荐线路进入
        //搜索线路结果列表
        searchLineList(activeDay,function (paraObj) {
            //计算预售期
            maxDay = getMaxDayOfSell(paraObj);
            setChangeDay(paraObj);//前一天后一天按钮是否显示

            //请求日历数据
            if(isEmpty(paramList.lineId)){
                reqCalendarData.lineIds = paramList.lineListIds;//线路ids
            }else{
                reqCalendarData.lineIds = paramList.lineId;//线路ids
            }
            if(!isEmpty(paramList.distrib)){
                reqCalendarData.distrib = paramList.distrib;//分销标志
            }
            getCalendarList(reqCalendarData,function (list) {
                initDatePicker(list, maxDay);
            });
        });
    }
}
//是否显示前一天后一天按钮 activeDay:选中的日期,now：当前日期
function setChangeDay(paraObj) {
    var activeDay = paraObj.activeDay;
    var now = formatDateToString(new Date(paraObj.timestamp));
    //最后一天
    if(isSameDate(activeDay,maxDay)){
        $('.search-date-content .next-day').hide();
    }else if(isSameDate(activeDay,now)){
        $('.search-date-content .last-day').hide();
    }else{
        $('.search-date-content .last-day').show();
        $('.search-date-content .next-day').show();
    }
}

//获取预售期的最大日期
function getMaxDayOfSell(paraObj){
    var presellDay = paraObj.presellDay;
    var activeDay = formatDateToString(new Date(paraObj.timestamp));
    if(!isEmpty(presellDay)){
        presellDay = parseInt(presellDay);
    }
    //预售期包含今天
    return getCountDay(activeDay, presellDay-1);
}

/**
 * 3 种方式异步查询线路结果列表
 * @param currentDay 查询日期 String yyyy-mm-dd
 */
function searchLineList(currentDay,searchBack) {
    var paramList = getUrlParams();
    // 搜索查询
    if(paramList.search == SEARCH_TYPE.input){
        searchBusListBySearch(paramList,currentDay,function (data) {
            var lineListDate = createLineListData(data);
            fullLineList(lineListDate, paramList.search);
            //获取lineIds 后请求日历,presellDay预售期，timestamp后台时间
            var backPrep = {
                lineIds: getLineIds(data),
                presellDay: data.presellDay,
                timestamp: data.timestamp,
                activeDay:currentDay,
            };
            if(searchBack && typeof searchBack == 'function'){
                searchBack(backPrep);
            }
        });
    }
    // 历史查询
    else if(paramList.search == SEARCH_TYPE.history){
        searchBusListByHistory(paramList,currentDay,function (data) {
            var lineListDate = createLineListData(data);
            fullLineList(lineListDate);

            //获取lineIds 后请求日历,presellDay预售期，timestamp后台时间
            var backPrep = {
                lineIds: getLineIds(data),
                presellDay: data.presellDay,
                timestamp: data.timestamp,
                activeDay:currentDay,
            };
            if(searchBack && typeof searchBack == 'function'){
                searchBack(backPrep);
            }
        });
    }
    // 热门推荐站点查询
    else if(paramList.search == SEARCH_TYPE.hot){
        searchBusListByHot(paramList,currentDay,function (data) {
            var lineListDate = createLineListData(data);
            fullLineList(lineListDate);

            //lineIds用不着 presellDay预售期，timestamp后台时间
            var backPrep = {
                // lineIds: getLineIds(data),
                presellDay: data.presellDay,
                timestamp: data.timestamp,
                activeDay:currentDay,
            };
            if(searchBack && typeof searchBack == 'function'){
                searchBack(backPrep);
            }
        });
    }
}

/**
 * 返回线路id，多个id用逗号','隔开
 * @param data
 * @returns {string}
 */
function getLineIds(data) {
    var lineIds = '';
    if(!isEmpty(data.busLineList)){
        data.busLineList.forEach(function (item, index) {
            if(isEmpty(item)){
                return true;
            }
            if(data.busLineList.length - 1 == index){
                lineIds += item;
            }else{
                lineIds += item + ',';
            }
        });
    }
    return lineIds;
}

/**
 * 组织页面展示数据结构
 * @param data
 * @returns {Array}
 */
function createLineListData(data) {
    var resultDate = [];

    //areaSearch Boolean标记不一样，返回的数据结构不一样
    if(data.areaSearch){
        if(!isEmpty(data.baseBusList)){
            data.baseBusList.forEach(function (item) {
                var lineItem = {};//一条线路信息obj

                lineItem.departTimeSim = item.departTimeSim;//出发时间
                lineItem.busNum = item.busNum;//班线号
                lineItem.vehicleCard = item.vehicleCard;//车牌号
                lineItem.ticketRemainNum = item.ticketRemainNum;//余票数
                lineItem.sellPrice = item.sellPrice;//售价
                lineItem.specialState = item.specialState;//特价标记 1-有特价
                lineItem.ticketPriceType = item.ticketPriceType;//线路计价方式：0 统一，1分段
                lineItem.specialPrice = item.specialPrice;// 特价价格
                lineItem.buyFlag = item.buyFlag; //1-可买, 2-售罄
                lineItem.idStr = item.idStr;//busID

                // 站点信息
                if(!isEmpty(item.sameStationBusList)){
                    lineItem.stationOrder = createStationOrder(item);
                    lineItem.stationList = createStationLines(item.sameStationBusList,lineItem.stationOrder.station);
                    lineItem.idStr = getFirstOnToLastOffBusId(lineItem.stationList,item.sameStationBusList);
                }

                // 活动标签
                lineItem.activityTagList = createActivityTags(item);

                resultDate.push(lineItem);
            });
        }
    } else{
        //区域搜索数据处理
        data.baseBusList.forEach(function (item) {
            if(isEmpty(item.idStr)){
                return true;//终止本次循环
            }else{
                var lineItem = {};//一条线路信息obj
                lineItem.departTimeSim = item.departTimeSim;//出发时间
                lineItem.busNum = item.busNum;//班线号
                lineItem.vehicleCard = item.vehicleCard;//车牌号
                lineItem.ticketRemainNum = item.ticketRemainNum;//余票数
                lineItem.sellPrice = item.sellPrice;//售价
                lineItem.specialState = item.specialState;//特价标记 1-有特价
                lineItem.specialPrice = item.specialPrice;// 特价价格
                lineItem.buyFlag = item.buyFlag; //1-可买, 2-售罄
                lineItem.idStr = item.idStr;//busID

                // 站点信息 TODO
                if(!isEmpty(item.sameStationBusList)){
                    lineItem.stationOrder = createStationOrder(item);
                    lineItem.stationList = createStationLine(item);
                }
                // 活动标签
                lineItem.activityTagList = createActivityTags(item);
                resultDate.push(lineItem);
            }
        });
    }

    return resultDate;
}

function createStationOrder(data){
    var final = {};
    var stationJson = {};
    var upStationInfoList = [],downStationInfoList = []; // 存放站点顺序
    var upStationIdList = [],downStationIdList = [];//仅用于存放id

    var upStationOrder = [],downStationOrder = []; // 存放站点顺序

    data.stationVoList.forEach(function(station){
        stationJson[station.stationId] = station;
    });
    //上车站点 type=1 是上车站点  type =2 下车站点
    if(!isEmpty(data.departStationId)){
        data.stationVoList.forEach(function(station){
            if (station.type == 1){
                var upStation = {};
                upStation.stationId = station.stationId;
                upStation.orderNo = station.orderNo;  // 站点排序码
                upStationOrder.push(upStation);
            }
        })
    }

    //下车站点
    if(!isEmpty(data.arriveStationId)){
        data.stationVoList.forEach(function(station){
            if (station.type == 2){
                var downStation = {};
                downStation.stationId = station.stationId;
                downStation.orderNo = station.orderNo;  // 站点排序码
                downStationOrder.push(downStation);
            }
        })
    }
    final.upStationOrder = upStationOrder;
    final.downStationOrder = downStationOrder;
    final.station = stationJson;

    return final;
}

/**
 * 渲染线路查询结果
 * @param data 请求结果
 */
function fullLineList(data,searchType) {
    var parent = $('.main-content');
    parent.html('');
    if(data.length > 0){
        //有班次
        var itemHtml = '';//单个班次html
        data.forEach(function (item,index) {
            var allDistance = 0;//步行总距离

            //站点列表
            var stationItem = '';
            var upStationOrder = item.stationOrder.upStationOrder;
            if(!isEmpty(item.stationList.upStationInfoList)){
                item.stationList.upStationInfoList.forEach(function (upStation,item) {
                    var text = '途径';
                    if (upStation.departStationId == upStationOrder[0].stationId){
                        text = '始发';
                    }
                    var time = upStation.departTimeSim;
                    time = time.substr(0,time.length-3);

                    var distance = '';
                    if(upStation.departDistance){
                        distance = '<div class="item-distance"><i></i><span>'+ upStation.departDistance +'km</span></div>';
                        allDistance = allDistance + upStation.departDistance * 1000;
                    }

                    var _itemTimeHtml = '';
                    if(item > 0){
                        //第一个不显示时间
                        _itemTimeHtml = '  <div class="item-time">(约'+time+')</div>'
                    }
                    stationItem += '<div class="station-item get-on">' +
                        '  <div class="item-name">'+ upStation.departStation +'</div>' +
                        _itemTimeHtml +
                        '  <div class="item-type">'+text+'</div>' +
                        distance +
                        '</div>';
                });
            }

            var downStationOrder = item.stationOrder.downStationOrder;
            if(!isEmpty(item.stationList.downStationInfoList)){
                item.stationList.downStationInfoList.forEach(function (downStation) {
                    var text = '途径';
                    if (downStation.arriveStationId == downStationOrder[downStationOrder.length-1].stationId){
                        text = '终点';
                    }
                    var time = downStation.arriveTimeSim;
                    time = time.substr(0,time.length-3);

                    var distance = '';
                    if(downStation.arriveDistance){
                        distance = '<div class="item-distance"><i></i><span>'+ downStation.arriveDistance +'km</span></div>';
                        allDistance = allDistance + downStation.arriveDistance * 1000;
                    }

                    stationItem += '<div class="station-item get-off">' +
                        '  <div class="item-name">'+ downStation.arriveStation +'</div>' +
                        '  <div class="item-time">(约'+time+')</div>' +
                        '  <div class="item-type">'+text+'</div>' +
                        distance +
                        '</div>';
                });
            }

            var priceHtml = '';//价格

            if(item.ticketPriceType == 1){//分段计价 1-分段计价 0-统一票价
                if(item.specialState == '1'){
                    //有特价
                    priceHtml = '<div class="line-price"><span>特价</span> ￥'+ item.specialPrice + '起</div><div class="original">￥'+ item.sellPrice +'起</div>';
                }else{
                    // 无特价
                    priceHtml = '<div class="line-price">￥'+ item.sellPrice +'起</div>';
                }
            }else{//统一计价
                if(item.specialState == '1'){
                    //有特价
                    priceHtml = '<div class="line-price"><span>特价</span> ￥'+ item.specialPrice + '</div><div class="original">￥'+ item.sellPrice +'</div>';
                }else{
                    // 无特价
                    priceHtml = '<div class="line-price">￥'+ item.sellPrice +'</div>'
                }
            }

            var buyClassName = '';
            var ticketRemainText = '';
            var buyBtnHtml = '';
            var minHeight = '';
            var hasLittleTicket = "";
            if(item.ticketRemainNum > 0){
                //有余票
                if(item.buyFlag == '1'){
                    if(item.ticketRemainNum < 4){
                        minHeight = "style='min-height:1.1rem'";
                        ticketRemainText = '少量余票';
                        hasLittleTicket = 'style="margin-top:10px;"';
                    }
                    buyClassName = 'sell';
                    buyBtnHtml = '<div class="buy-ticket-btn">购票</div>';
                }else if(item.buyFlag == '2'){
                    //  不可购票
                    buyClassName = ' sell-out';
                    ticketRemainText = '停售';
                }
            }else{
                // 已售罄
                buyClassName = ' sell-out';
                ticketRemainText = '售罄';
            }

            if(searchType == SEARCH_TYPE.input){
                buyClassName += ' search'
            }

            var tagHtml = '';
            if(!isEmpty(item.activityTagList)){
                item.activityTagList.forEach(function (tag) {
                    tagHtml += '<div class="tag">'+ tag +'</div>';
                });
            }
            if(tagHtml == ""){
                tagHtml = '<div class="tag" style="opacity: 0;">中交出行</div>';
            }

            var time = item.departTimeSim;
            time = time.substr(0,time.length-3);

            var allDistanceHtml = '';
            if(allDistance > 0){
                allDistanceHtml = '<div class="all-distance">总步行'+ allDistance/1000 +'km</div>';
            }

            itemHtml += '<li class="line-item '+ buyClassName +'" data-busid="'+ item.idStr +'">' +
                '  <div class="line-top">' +
                '    <div class="top-left">' +
                '       <span class="start-time">'+ time +'</span><span class="line-name">'+ item.busNum +'</span>' +
                '    </div>' +
                '    <div class="top-right">' + priceHtml +'</div>' +
                '  </div>' +
                allDistanceHtml +
                '  <div class="line-middle">' +
                '    <div class="station-list">' + stationItem + '</div>' +
                '  </div>' +
                '  <div class="line-bottom">' +
                '    <div class="services-group" '+hasLittleTicket+'  '+minHeight+' >' + tagHtml +'</div>' +
                '    <div class="bottom-right">' +
                '      <div class="store-tips">'+ ticketRemainText +'</div>' +
                buyBtnHtml +
                '    </div>' +
                '  </div>' +
                '</li>';
        });
        var lineListHtml = '<div class="result-line-list"><ul>'+ itemHtml +'</ul></div>';
        parent.prepend(lineListHtml);

    }else{
        //无班次
        var noLine = '<div class="no-line-box">' +
            '  <div class="no-line"></div>' +
            '  <div class="no-line-tips">暂时没有找到合适的班次</div>' +
            '</div>';
        parent.append(noLine);
    }

    // 渲染完页面渲染底部
    setTimeout(function () {
        var body = $('.main-content').outerHeight(true);
        var screen = $(window).height();

        if (body >= (screen-56)){
            $('footer').css({'position':'relative','margin-bottom':'.2rem'});
        }
        // footer高度56
    },0)

    // 购票按钮绑定点击事件
    // $('.sell .buy-ticket-btn').on('click',function () {
    //可购票整列添加点击事件
     $('.sell').on('click',function () {
        // var busId = $(this).parents('.sell').data('busid');
         var busId = $(this).data('busid');
        var qrcId = getParam('qrcId',window.location.href);
        $.ajax({
            type: "GET",
            url: "/busline/judegLineDetail",
            data:{'token':$.cookie('token'),'busId':busId,'qrcId':qrcId},
            dataType: "json",
            success: function(result){
                if(result!=undefined&&result.code!=undefined&&parseInt(result.code)==0){
                    window.location='/cityBus/buyTicket?busId=' + busId+'&qrcId='+qrcId ;
                }else{
                    $.alert(result.message||'该班次已停售',function(){
                        window.location.reload();
                        return false;
                    });
                }
            }
        });
    });
}

function createActivityTags(data) {
    // 活动标签： 分销标志 array活动标签 tagList特色标签特色标签
    var tagList = [];
    //分销标记 0-自营 1-分销
    if(data.isCooperate == '1'){
        tagList.push('合作线路');//后台已拼接
    }else {
        if(data.isCooperateDealer=='1'){
            tagList.push("自营线路");
        }
    }
    //活动标签
    if(!isEmpty(data.activityTag)){
        data.activityTag.forEach(function (item) {
            tagList.push(item)
        });
    }

    //特色标签
    if(!isEmpty(data.tagList)){
        data.tagList.forEach(function (value) {
            tagList.push(value);
        });
    }

    return tagList;
}
function createStationLine(data) {
    var final = {};
    var upStationInfoList = [],downStationInfoList = [];
    var upStationIdList = [],downStationIdList = [];//仅用于存放id

    //上车站点
    var upStation = {};
    if(!isEmpty(data.departStationId)){
        if(!upStationIdList.includes(data.departStationId)){
            var stationVo = data.stationVoList;   // 记录起始站点
            if (stationVo[0].type == 1 && data.departStationId == stationVo[0].stationId && stationVo[0].orderNo==1){
                upStation.orderNo = stationVo[0].orderNo;
            }

            //不包含站点则存入List
            upStationIdList.push(data.departStationId);
            upStation.departStationId = data.departStationId;
            upStation.departStation = data.departStation;
            upStation.departStationCode = data.departStationCode;
            upStation.departCityId = data.departCityId;
            upStation.departCityName = data.departCityName;
            upStation.departDate = data.departDate;
            upStation.departDesc = data.departDesc;
            upStation.departLat = data.departLat;
            upStation.departLng = data.departLng;
            upStation.departTimeSim = data.departTimeSim;
            upStation.departDistance = data.departDistance;

            upStationInfoList.push(upStation);
        }
    }

    //下车站点
    // type=1 是上车站点  type =2 下车站点
    var downStation = {};
    if(!isEmpty(data.arriveStationId)){
        if(!downStationIdList.includes(data.arriveStationId)){

            var stationVo = data.stationVoList;   // 记录终止站点
            if (stationVo[stationVo.length-1].type == 2 && data.arriveStationId == stationVo[stationVo.length-1].stationId){
                downStation.orderNo = stationVo[stationVo.length-1].orderNo;
            }

            //不包含站点则存入List
            downStationIdList.push(data.arriveStationId);

            downStation.arriveStation = data.arriveStation;
            downStation.arriveStationCode = data.arriveStationCode;
            downStation.arriveStationId = data.arriveStationId;
            downStation.arriveCityId = data.arriveCityId;
            downStation.arriveCityName = data.arriveCityName;
            downStation.arriveDesc = data.arriveDesc;
            downStation.arriveLat = data.arriveLat;
            downStation.arriveLng = data.arriveLng;
            downStation.arriveTimeSim = calTime(data.departTime,parseInt(data.consumeTime));
            downStation.arriveDistance = data.arriveDistance;

            downStationInfoList.push(downStation);
        }
    }

    final.upStationInfoList = upStationInfoList;
    final.downStationInfoList = downStationInfoList;

    return final;
}

/**
 * 获取第一个上车点到最后一个下车点的BusId
 */
function getFirstOnToLastOffBusId(stationList,busStationList) {
    var busId = '';
    if(isEmpty(stationList) || isEmpty(busStationList) || busStationList.length <=0 || isEmpty(stationList.upStationInfoList) || isEmpty(stationList.downStationInfoList)){
        return '';
    }else{
        var upStationId = stationList.upStationInfoList[0].departStationId;
        var downStationId = stationList.downStationInfoList[stationList.downStationInfoList.length-1].arriveStationId;
        for(var i=0;i<busStationList.length;i++){
            var stationItem = busStationList[i];
            if(upStationId == stationItem.departStationId && downStationId == stationItem.arriveStationId){
                busId = stationItem.idStr;
            }
        }
    }
    return busId;
}

/**
 * 处理返回的站点信息-排序展示
 * @param data
 */
function createStationLines(data,stationMap) {
    var final = {};
    var upStationInfoList = [],downStationInfoList = [];
    var upStationIdList = [],downStationIdList = [];//仅用于存放id
    data.forEach(function (item) {
        //上车站点
        var upStation = {};
        if(!isEmpty(item.departStationId)){
            if(!upStationIdList.includes(item.departStationId)){

                //不包含站点则存入List
                upStationIdList.push(item.departStationId);

                upStation.departStationId = item.departStationId;
                upStation.departStation = item.departStation;
                upStation.departStationCode = item.departStationCode;
                upStation.departCityId = item.departCityId;
                upStation.departCityName = item.departCityName;
                upStation.departDate = item.departDate;
                upStation.departDesc = item.departDesc;
                upStation.departLat = item.departLat;
                upStation.departLng = item.departLng;
                upStation.departTimeSim = item.departTimeSim;
                upStation.orderNo = stationMap[item.departStationId].orderNo;

                upStationInfoList.push(upStation);
            }
        }

        //下车站点
        var downStation = {};
        if(!isEmpty(item.arriveStationId)){
            if(!downStationIdList.includes(item.arriveStationId)){

                //不包含站点则存入List
                downStationIdList.push(item.arriveStationId);

                downStation.arriveStation = item.arriveStation;
                downStation.arriveStationCode = item.arriveStationCode;
                downStation.arriveStationId = item.arriveStationId;
                downStation.arriveCityId = item.arriveCityId;
                downStation.arriveCityName = item.arriveCityName;
                downStation.arriveDesc = item.arriveDesc;
                downStation.arriveLat = item.arriveLat;
                downStation.arriveLng = item.arriveLng;
                downStation.arriveTimeSim = calTime(item.departTime,parseInt(item.consumeTime));
                downStation.orderNo = stationMap[item.arriveStationId].orderNo;

                downStationInfoList.push(downStation);
            }
        }
    });
    final.upStationInfoList = upStationInfoList;
    final.downStationInfoList = downStationInfoList;
    //统一排序
    final.upStationInfoList.sort(function (a, b) {
        return a.orderNo - b.orderNo;
    });
    //统一排序
    final.downStationInfoList.sort(function (a, b) {
        return a.orderNo - b.orderNo;
    });

    return final;
}

function calTime(time,differ){

    var today = new Date(time);
    var later = today.getTime()+differ*60*1000; // 计算后的时间戳
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    var oneDay = 1000 * 60 * 60 * 24; // 今天

    var tomorrow = new Date(today.getTime()+oneDay); // 明天
    var afterTomorrow = new Date(today.getTime()+oneDay*2); // 后天

    var temp = '';
    if ((later-tomorrow)>0){
        temp = '次日';
    }
    if ((later-afterTomorrow)>0){
        temp = '隔日';
    }
    later = new Date(later);

    var hour = later.getHours() > 9 ? later.getHours():'0'+later.getHours();
    var min = later.getMinutes() > 9 ? later.getMinutes():'0'+later.getMinutes();

    var timeStr = temp+hour+':'+min+':00';
    return timeStr;
}

/**
 * 搜索输入查询线路列表
 * @param paramList
 * @param currentDay yyyy-dd-mm 查询日期 String
 * @param callback 回调函数
 */
function searchBusListBySearch(paramList,currentDay,callback) {
    //根据搜索查询
    var urlStr = SERVER_URL_PREFIX + "/busLine/searchBus";
    var dataObj = {};
    dataObj.departDate = currentDay;

    //有经纬度则传经纬度，否则传ID
    if(paramList.departLat == '0' && paramList.departLng == '0'){
        dataObj.departAreaId = paramList.departAreaId;
    }else{
        dataObj.departLat = paramList.departLat;
        dataObj.departLng = paramList.departLng;

    }
    dataObj.departAreaName = paramList.departAreaName;
    //有经纬度则传经纬度，否则传ID
    if(paramList.arriveLat == '0' && paramList.arriveLng == '0'){
        dataObj.arriveAreaId = paramList.arriveAreaId;
    }else{
        dataObj.arriveLat = paramList.arriveLat;
        dataObj.arriveLng = paramList.arriveLng;
    }

    if((paramList.departLat == '0' && paramList.departLng == '0') && (paramList.arriveLat == '0' && paramList.arriveLng == '0')){
        setTitle(paramList.departCityName+paramList.departAreaName+'->'+paramList.arriveCityName+paramList.arriveAreaName+"-"+userInfo.providerName);
        if(!shareFlag){
            var param = {
                businessName:paramList.departCityName+paramList.departAreaName+'到'+paramList.arriveCityName+paramList.arriveAreaName+'的班车',
                url:window.location.href,
            }
            shareCommon(param); // 分享
            shareFlag = true;
        }
    }
    else if (paramList.departLat == '0' && paramList.departLng == '0'){
        setTitle(paramList.departCityName+paramList.departAreaName+'->'+paramList.arriveCityName+"-"+userInfo.providerName);
    }
    else if(paramList.arriveLat == '0' && paramList.arriveLng == '0'){
        setTitle(paramList.departCityName+'->'+paramList.arriveCityName+paramList.arriveAreaName+"-"+userInfo.providerName);
    }
    else{
        setTitle(paramList.departCityName+'->'+paramList.arriveCityName+"-"+userInfo.providerName);
        if(!shareFlag){
            var param = {
                businessName:paramList.departCityName+'到'+paramList.arriveCityName+'的班车',
                url:window.location.href,
            }
            shareCommon(param); // 分享
            shareFlag = true;
        }
    }

    dataObj.arriveAreaName = paramList.arriveAreaName;
    dataObj.lineType = paramList.lineType;
    dataObj = genReqData(urlStr, dataObj);
    $.showLoading();
    $.ajax({
        type: 'post',
        data: dataObj,
        url: urlStr,
        dataType: 'json',
        success: function (res) {
            $.hideLoading();
            if(res.code == 0){
                //TODO
                if(callback && typeof callback == 'function'){
                    var temp = {timestamp:res.timestamp};
                    var result = $.extend(true,res.data,temp);
                    callback(result);
                }
            }else{
                $.alert(res.message);
            }
        }
    });
}

/**
 * 历史线路查询线路列表
 * @param paramList
 * @param currentDay yyyy-dd-mm 查询日期 String
 * @param callback 回调函数
 */
function searchBusListByHistory(paramList,currentDay,callback) {
    // var urlStr = '/bus/lineHisListJson';

    setTitle(paramList.departStation+'->'+paramList.arriveStation+"-"+userInfo.providerName);
    if(!shareFlag){
        var param = {
            businessName:paramList.departStation+'到'+paramList.arriveStation+'的班车',
            url:window.location.href,
        }
        shareCommon(param);   // 分享
        shareFlag = true;
    }
    var urlStr = SERVER_URL_PREFIX + '/busLine/searchBusByStationId';

    var dataObj = {
        token:$.cookie('token'),
        // busId: paramList.busId,
        departDate:currentDay,
        lineType: paramList.lineType,
        departStationId: paramList.departStationId,
        arriveStationId: paramList.arriveStationId
    };
    dataObj = genReqData(urlStr, dataObj);
    $.showLoading();
    $.ajax({
        type: 'POST',
        url: urlStr,
        data: dataObj,
        dataType:'json',
        success:function (res) {
            $.hideLoading();
            if(res.code == 0){
                //TODO
                if(callback && typeof callback == 'function'){
                    var temp = {timestamp:res.timestamp};
                    var result = $.extend(true,res.data,temp);
                    callback(result);
                }
            }else{
                $.alert(res.message);
            }
        }
    });
}

/**
 * 热门线路查询线路列表
 * @param paramList
 * @param currentDay yyyy-dd-mm 查询日期 String
 * @param callback 回调函数
 */
function searchBusListByHot(paramList,currentDay,callback) {
    var urlStr = "/lineListJson";
    var dataObj = {};

    dataObj.departDate = currentDay; //日期
    // dataObj.lineId = paramList.lineId;//线路id
    if(isEmpty(paramList.lineName)){
        setTitle(userInfo.providerName);
    }else{
        setTitle(paramList.lineName+"-"+userInfo.providerName);
    }

    if(!shareFlag){
        var param = {
            businessName:paramList.lineName,
            url:window.location.href,
        }
        shareCommon(param);   // 分享
        shareFlag = true;
    }

    if(!isEmpty(paramList.distrib)){
        dataObj.distrib = paramList.distrib;//分销标志
    }
    if(!isEmpty(paramList.qrcId)){
        dataObj.qrcId = paramList.qrcId;
    }
    // 线路id
    if(isEmpty(paramList.lineListIds)){
        dataObj.lineId = paramList.lineId;
    }else{
        dataObj.lineId = paramList.lineListIds;
    }
    //distrib，qrcId，lineListIds三个参数用于扫描二维码进入的情况（推广员？？）

    dataObj.lng = paramList.lng;//经纬度
    dataObj.lat = paramList.lat;//经纬度
    dataObj.lineType = paramList.lineType;
    dataObj.lineName = paramList.lineName;
    dataObj = genReqData(urlStr, dataObj);
    $.showLoading();
    $.ajax({
        type: 'GET',
        data: dataObj,
        url: urlStr,
        dataType: 'json',
        success: function (res) {
            $.hideLoading();
            if(res.code == 0){
                if(callback && typeof callback == 'function'){
                    var temp = {timestamp:res.timestamp};
                    var result = $.extend(true,res.data,temp);
                    callback(result);
                }
            }else{
                $.alert(res.message);
            }
        }
    });
}

/**
 * 更改查询日期
 * @param activeDay String yyyy-mm-dd
 */
function changeActiveDay(activeDay) {
    $('#activeDay').val(activeDay);
    var date = formatStringToDate(activeDay);
    var week = switchWeekday(date);
    var activeText = activeDay + ' '+ week;
    $('#activeBox span').html(activeText);
}


function getCalendarList(reqCalendarData, callback) {
    var url = SERVER_URL_PREFIX + "/busline/calendarList";
    reqCalendarData = genReqData(url, reqCalendarData);
    sessionStorage.setItem('reqCalendarData', JSON.stringify(reqCalendarData));

    $.ajaxService({
        url: url,
        type: "post",
        data: reqCalendarData,
        success: function (res) {
            if (res.code == 0) {
                var dateList = createDateList(res.data);
                if(callback &&　typeof callback == "function"){
                    callback(dateList);
                }
            }else {
                $.alert(res.message);
            }
        },
    });
}

function initDatePicker(dateList, maxDate) {
    // var nowDay = new Date();
    var strDay = formatDateToString(new Date());
    $('.date-picker-container').datePicker({
        dateBase: strDay,
        gather: dateList,
        switchMonth: switchMonthEvent,
        selectCallback:function (data) {
            //单选
            var tempDate = data.selectData[0].date;
            var date = tempDate.year + '-' + tempDate.month + '-' + tempDate.day;
            if(data && data.selectData.length > 0){
                triggerDate();
            }
            changeActiveDay(date);

            searchLineList(date,function (paraObj) {
                //计算预售期
                maxDay = getMaxDayOfSell(paraObj);
                setChangeDay(paraObj);//前一天后一天按钮是否显示
                cacheActiveDate(date);
                setActiveDate(date);
            });

        },
        noGatherShow: false,//没有gather数据的是否显示
        multiple: false,//单选
        after: 2,
        loadAfterMonth: loadAfterMonthEvent,
        maxDate: maxDate,
    });
    setActiveDate(strDay);
}
var loadAfterMonthEvent = function(currentDate, picker){
    if(picker){
        var reqCalendarData = JSON.parse(sessionStorage.getItem('reqCalendarData'));
        reqCalendarData.departDate = currentDate;
        // picker.drawMonth(currentDate);
        getCalendarList(reqCalendarData,function (list) {
            picker.reset({
                gather: list
            });
            picker.drawMonthData(currentDate);
        })
    }
};
var switchMonthEvent = function(currentDate,picker) {
    if(picker){
        var reqCalendarData = JSON.parse(sessionStorage.getItem('reqCalendarData'));
        reqCalendarData.departDate = currentDate;

        picker.drawMonth(currentDate);
        getCalendarList(reqCalendarData,function (list) {
            picker.reset({
                gather: list
            });
            picker.drawMonthData(currentDate);
        })
    }
};

function createDateList(dateList) {
    var result = [];
    dateList.forEach(function (item, index) {
        var tempDate = {};
        tempDate.date = item.date;
        tempDate.comment = switchStatue(item.saleState).comment;
        tempDate.status = switchStatue(item.saleState).status;
        tempDate.tag = switchTag(item.hasWork);
        tempDate.label = item.label ? item.label : '';// 农历/节假日;
        result.push(tempDate);
    });
    return result;
}
function switchStatue(saleState) {
    var result = {};
    var comment = '';
    var status = '';
    saleState = saleState+ '';
    if(saleState == SELL_STATUS.onSell){
        comment = '有票';
        status = 'select';//只有有票才能点击
    }else if(saleState == SELL_STATUS.sellOut){
        comment = '售罄';
    }else if(saleState == SELL_STATUS.unplanned){
        comment = '/';
    }else if(saleState == SELL_STATUS.finished){
        comment = '停售';
    }
    result.comment = comment;
    result.status = status;
    return result;
}
function switchTag(tag) {
    var result = '';
    if(tag == FESTIRVAL_TYPE.vacation){
        result = '休'
    }else if(tag == FESTIRVAL_TYPE.workday){
        result = '班'
    }
    return result;
}

function setActiveDate(activeDate){
    $('.date-picker-container .months-box td').forEach(function (item) {
        var itemDate = $(item).data('date');
        if(!isEmpty(itemDate)){
            if(isSameDate(activeDate, itemDate)){
                $(item).addClass('active');
                $(item).siblings().removeClass('active');
                $(item).parents('tr').siblings().find('td').removeClass('active');
                $(item).parents('.month-item-box').siblings().find('td').removeClass('active');
            }
        }
    })
}

/**
 * 返回按钮
 */
$('.handle-list .handle').off('click').on('click',function () {
    window.history.back(-1);
    clearActiveDate();
});


/**
 * 站点收起操作
 */
$('.flex-bar').off('click').on('click',function () {
    var parent = $(this).parents('.line-middle');
    var showFlag = parent.data('toggle');
    if(showFlag){
        // 收起操作
        parent.find('.station-gray').height(0);
        parent.find('.switch-t').css({'transform':'rotate(-90deg)'});
        parent.find('.switch-b').css({'transform':'rotate(90deg)'});
        parent.find('.switch-btn').html('全部');
    }else{
        // 展开
        var height = parent.find('.station-gray').data('height');
        parent.find('.station-gray').height(height);
        parent.find('.switch-t').css({'transform':'rotate(90deg)'});
        parent.find('.switch-b').css({'transform':'rotate(-90deg)'});
        parent.find('.switch-btn').html('收起');
    }
    parent.data('toggle',!showFlag);
});
/**
 * 点击展开日历
 */
$('#activeBox').on('click',function (e) {
    e.stopPropagation();
    triggerDate();
});

/**
 * 日期收起和展示
 */
function triggerDate() {
    var el = $('#activeBox');
    var trigger = el.data('trigger');
    if(trigger){
        $('.date-content').hide();
        $("body").css({overflow:"visible"});//显示滚动条
    }else{
        $('.date-content').show();
        $("body").css({overflow:"hidden"});    //禁用滚动条
        $("#date-content").css({visibility:"visible"});   //显示date-content的滚动条属性
    }
    el.data('trigger',!trigger);
}


/**
 * 关闭日历
 */
$('[data-selectable=true]').on('click',function () {
    hideDate();
    $("body").css({overflow:"visible"});//显示滚动条
});

/**
 * 获取页面参数：url的参数
 * @returns {{lineType: string, lineId: string, providerId: string, distrib: string, departDate: *}}
 */
function getUrlParams() {
    //获取页面参数
    var localUrl = window.location.href;
    var now = new Date();
    //线路类型 "1.定制  2.通勤 3旅游'

    var resultParams = {
        providerId : getParam('providerId', localUrl),
        lineId : getParam('lineId', localUrl),//点击热门线路的线路id
        lineListIds : getParam('lineListIds', localUrl),//点击热门线路的线路id-后台生成线路二维码用
        qrcId: getParam('qrcId', localUrl),//二维码id
        // //搜索结果的lineId
        // lineListIds : '',
        token : getParam('token', localUrl),
        //当前位置的经纬度
        lng : getParam('lng', localUrl),
        lat : getParam('lat', localUrl),
        //lineType 线路类型 1-定制班线线路,2-上下班线路,3-旅游线路
        lineType : getParam('lineType', localUrl),
        lineName : getParam('lineName', localUrl),
        busId : getParam('busId', localUrl),//历史记录进入的busID

        // 搜索线路标志 1-表示是从搜索按钮进入该页面，需要先获取lineId,然后生成nav日历；2-从历史记录进入只有busId，需要查询lineId，显示日历和线路详细信息
        search : getParam('search', localUrl),
        //后台系统返回的当前时间
        timestamp : getParam('timestamp', localUrl),
        departCityId : getParam('departCityId', localUrl),
        departCityName : getParam('departCityName', localUrl),
        departLat : getParam('departLat', localUrl),
        departLng : getParam('departLng', localUrl),
        departAreaId : getParam('departAreaId', localUrl),
        departStationId : getParam('departStationId', localUrl),
        arriveAreaName : getParam('arriveAreaName', localUrl),
        departDate : isEmpty(getParam('departDate', localUrl)) ? formatDateToString(now) : getParam('departDate', localUrl),
        startAddr : getParam('startAddr', localUrl),
        endAddr : getParam('endAddr', localUrl),
        arriveCityName : getParam('arriveCityName', localUrl),
        arriveLng : getParam('arriveLng', localUrl),
        arriveLat : getParam('arriveLat', localUrl),
        arriveCityId : getParam('arriveCityId', localUrl),
        arriveAreaId : getParam('arriveAreaId', localUrl),
        arriveStationId : getParam('arriveStationId', localUrl),
        departAreaName : getParam('departAreaName', localUrl),

        departStation: getParam('departStation', localUrl),
        arriveStation: getParam('arriveStation', localUrl),


        //分销标志
        distrib : getParam('distrib', localUrl),
    };

    var userInfo = $.parseJSON(localStorage.getItem('userInfo'));
    if(isEmpty(resultParams.providerId)){
        resultParams.providerId = userInfo.providerId;
    }
    return resultParams;
}
//缓存选中的日期
function cacheActiveDate(date){
    localStorage.setItem('activeDay',date);
}

//清空缓存中选中的日期
function clearActiveDate(){
    localStorage.removeItem('activeDay');
}

//后一天
$('.search-date-content .next-day').off('click').on('click',function () {
    hideDate();
    var currentDay = $('#activeDay').val();
    var activeDay = getCountDay(currentDay,1);
    changeActiveDay(activeDay);
    //请求后一天数据
    searchLineList(activeDay,function (paraObj) {
        //计算预售期
        maxDay = getMaxDayOfSell(paraObj);
        setChangeDay(paraObj);//前一天后一天按钮是否显示
        cacheActiveDate(activeDay);
        setActiveDate(activeDay);
    });

});
//前一天
$('.search-date-content .last-day').off('click').on('click',function () {
    hideDate();
    var currentDay = $('#activeDay').val();
    if(isToday(currentDay)){
        return ;
    }
    var activeDay = getCountDay(currentDay,-1);
    changeActiveDay(activeDay);
    //请求前一天数据
    searchLineList(activeDay,function (paraObj) {
        //计算预售期
        maxDay = getMaxDayOfSell(paraObj);
        setChangeDay(paraObj);//前一天后一天按钮是否显示
        cacheActiveDate(activeDay);//缓存日期

        setActiveDate(activeDay);
    });
});

function hideDate() {
    var el = $('#activeBox');
    $('.date-content').hide();
    el.data('trigger',false);
}

$('.date-content').on('click',function (e) {
    hideDate();
});
$('.date-content-box').on('click',function (e) {
    e.stopPropagation();
});
