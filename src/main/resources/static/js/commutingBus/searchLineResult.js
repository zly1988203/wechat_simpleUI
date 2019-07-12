var click_event = isAndroid() ? 'tap' : 'click';
// 获取地址栏参数
var getUrlRequest = getRequest();
// 获取车企信息
var userInfo = JSON.parse(USERINFO);
$(function () {
    //情况选择的优惠券
    localStorage.removeItem('selectedCoupon');
    // init();
    //根据首页传参searchType判断搜索类型
    if ("searchType" in getUrlRequest) {
        getSearchLine(parseInt(getUrlRequest.searchType));
    } else {
        getSearchLine(4);//扫码或者微页面进入
    }
});
// 获取url的参数
function getRequest() {
    var url = location.search; //获取url中"?"符后的字串  
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var strs = url.substr(1);
        strs = strs.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}


//时间戳格式化 str：时间戳 timeType：格式化时间类型
function formatTime(str, timeType) {
    if (isNumber(str)) {
        var time = new Date(parseInt(str));
        if (timeType == 1) {
            // hh:mm
            str = formatNum(time.getHours()) + ':' + formatNum(time.getMinutes());
        } else {
            // yyyy-MM-dd hh:mm:ss
            str = time.getFullYear() + '-' + formatNum(time.getMonth() + 1) + '-' + formatNum(time.getDate())
                + ' ' + formatNum(time.getHours()) + ':' + formatNum(time.getMinutes()) + ':' + formatNum(time.getSeconds());
        }
        return str;
    } else {
        return '';
    }
}
//数字格式化：数字为个位数时，前面添加0
function formatNum(str) {
    if ((str + '').length == 1) {
        if (str < 10) {
            str = '0' + str;
        }
    }
    return str;
}
//判断是否是非负整数
function isNumber(str) {
    var r = /^[1-9]\d*|0$/;
    return r.test(str);
}
// 返回
$('#goBack').on(click_event, function () {
    window.location = "/commuteIndex";
})

/* 请求查询结果列表
    *searchType 1-行政地区搜索或城市搜索  2-站点查询 4-热门线路
*/
function getSearchLine(searchType) {
    var lineApi = "",
        pram = {},
        distrib = null,
        lineName = "",
        stationInfo;
    // 判断是否从分享链接进入
    if("shareType" in getUrlRequest){
        if(getUrlRequest.shareType == 1){
            stationInfo = {
                departAreaId:getUrlRequest.departAreaId,
                departAreaName:getUrlRequest.departAreaName,
                arriveAreaId:getUrlRequest.arriveAreaId,
                arriveAreaName:getUrlRequest.arriveAreaName,
                departLat:getUrlRequest.departLat,
                departLng:getUrlRequest.departLng,
                arriveLat:getUrlRequest.arriveLat,
                arriveLng:getUrlRequest.arriveLng
            }
        }else if(getUrlRequest.shareType == 2){
            stationInfo = {
                departStationId:getUrlRequest.departStationId,
                arriveStationId:getUrlRequest.arriveStationId,
                arriveTitle:getUrlRequest.arriveTitle,
                departTitle:getUrlRequest.departTitle
            }
        }
    }else{
        stationInfo = JSON.parse(sessionStorage.getItem('stationInfo'));
    }
    if (searchType == 1) {
        lineApi = commuteApi.getLineList;
        var departAreaName;
        var arriveAreaName;
        if("shareType" in getUrlRequest){
            departAreaName = stationInfo.departAreaName;
            arriveAreaName =stationInfo.arriveAreaName;
        }else{
            if(stationInfo.departAreaName != ""){
                departAreaName = stationInfo.departCityName + '·' + stationInfo.departAreaName;
            }else{
                departAreaName = stationInfo.departCityName;
            }
            if(stationInfo.arriveAreaName != ""){
                arriveAreaName = stationInfo.arriveCityName + '·' + stationInfo.arriveAreaName;
            }else{
                arriveAreaName =stationInfo.arriveCityName;
            }
        }
        pram = {
            departAreaId: stationInfo.departAreaId,
            departAreaName: departAreaName,
            arriveAreaId: stationInfo.arriveAreaId,
            arriveAreaName: arriveAreaName,
            departLat: stationInfo.departLat,
            departLng: stationInfo.departLng,
            arriveLat: stationInfo.arriveLat,
            arriveLng: stationInfo.arriveLng
        };
    } else if (searchType == 2) {
        $(".item-distance").hide();
        lineApi = commuteApi.searchBusByStationId;
        pram = {
            token: serverUtil.token,
            departStationId: stationInfo.departStationId,
            arriveStationId: stationInfo.arriveStationId,
            lineType: 2
        };
    } else if (searchType == 4) {
        $(".item-distance").hide();
        lineApi = commuteApi.getHotLineList;
        if ("distrib" in getUrlRequest) {
            distrib = 1;
        }
        if("lineName" in getUrlRequest){
            lineName = getUrlRequest.lineName
        }
        pram = {
            distrib: distrib,
            lineName: lineName,
            lineId: getUrlRequest.lineId
        };
    }
    $.showLoading("加载中...");
    request(lineApi, pram).then(function (res) {
        $.hideLoading();
        if (res.code == 0) {
            if (searchType == 1) {
                setTimeout(function(){
                    $('title').html(res.data.departName + " -> "+ res.data.arriveName + ' - '+userInfo.providerName);
                },1000)
                var pram = {
                    businessName:res.data.departName+'到'+res.data.arriveName+'的班车',
                    url: window.location.href +"&shareType=1" + "&token="+serverUtil.token
                    + "&departAreaId="+stationInfo.departAreaId+ "&departAreaName="+stationInfo.departAreaName 
                    +"&arriveAreaId="+stationInfo.arriveAreaId+ "&arriveAreaName="+stationInfo.arriveAreaName 
                    +"&departLat="+stationInfo.departLat+ "&departLng="+stationInfo.departLng 
                    +"&arriveLat="+stationInfo.arriveLat + "&arriveLng="+stationInfo.arriveLng
                }
                //分享
                shareCommon(pram);
            } else if (searchType == 2) {
                setTimeout(function(){
                    $('title').html(stationInfo.departTitle + " -> "+ stationInfo.arriveTitle + ' - '+userInfo.providerName);
                },1000)
                //分享
                var pram = {
                    businessName:stationInfo.departTitle +'到'+ stationInfo.arriveTitle +'的班车',
                    url: window.location.href +"&shareType=2" + "&departDate="+formatTime(stationInfo.departTime) + "&token="+serverUtil.token
                    +"&departStationId="+stationInfo.departStationId+ "&arriveStationId="+stationInfo.arriveStationId 
                    +"&departTitle="+stationInfo.departTitle+ "&arriveTitle="+stationInfo.arriveTitle 
                }
                shareCommon(pram);
            } else if (searchType == 4) {
                if("lineName" in getUrlRequest){
                    if(getUrlRequest.lineName == ""){
                        setTimeout(function(){
                            $('title').html(userInfo.providerName);
                        },1000)
                    }else{
                        setTimeout(function(){
                            $('title').html(getUrlRequest.lineName + ' - '+userInfo.providerName);
                        },1000)
                    }
                }else{
                    setTimeout(function(){
                        $('title').html(res.data.lineName + ' - '+userInfo.providerName);
                    },1000)
                }
                //分享
                var pram = {
                    businessName:res.data.lineName,
                    url: window.location.href + "&token="+serverUtil.token
                }
                shareCommon(pram);
            }
            var resultList = res.data.baseBusList;
            if (resultList.length <= 0) {
                $(".result-line-list").hide();
                $(".no-line-box").show();
            } else {
                var resultListHtml = "";
                $(".result-line-list").show();
                $(".no-line-box").hide();
                for (var i = 0; i < resultList.length; i++) {
                    resultListHtml += searchLineResult(resultList[i]);
                }
                $("#resultList").html(resultListHtml);
            }
        } else {
            $.alert(res.message);
        }
    });
}


// 加载数据到页面
function searchLineResult(item) {
    var goOnStationListFirst = "";
    var goOnStationList = "";
    var goOffStationListLast = "";
    var goOffStationList = "";
    var servicesGroup = "";
    var lineInfoBox = "";
    // 遍历上车点
    for (var i = 0; i < item.goOnStationList.length; i++) {
        var stationTypeName = '';
        var stationType = item.goOnStationList[i].stationType;
        if(stationType ==1){
            stationTypeName = "始发";
        }else if(stationType ==2){
            stationTypeName = "途径";
        }else if(stationType ==3){
            stationTypeName = "终点";
        }

        goOnStationList += `<div class="station-gray" data-departStationId=${item.goOnStationList[i].stationId}>
                            <div class="station-item get-off gray">
                                <div class="item-name"><span>${item.goOnStationList[i].stationName}</span></div>
                                <div class="item-type">${stationTypeName}</div>
                                ${item.goOnStationList[i].stationDistance ? `<div class="item-distance"><i></i>${item.goOnStationList[i].stationDistance}Km</div>` : ''}
                            </div>
                        </div>`;
    }
    // 遍历下车点
    for (var i = 0; i < item.goOffStationList.length; i++) {
        var stationTypeName = '';
        var stationType = item.goOffStationList[i].stationType;
        if(stationType ==1){
            stationTypeName = "始发";
        }else if(stationType ==2){
            stationTypeName = "途径";
        }else if(stationType ==3){
            stationTypeName = "终点";
        }
        goOffStationList += `<div class="station-gray" data-arriveStationId=${item.goOffStationList[i].stationId}>
                            <div class="station-item get-off gray">
                                <div class="item-name"><span>${item.goOffStationList[i].stationName}</span></div>
                                <div class="item-type">${stationTypeName}</div>
                                ${item.goOffStationList[i].stationDistance ? `<div class="item-distance"><i></i>${item.goOffStationList[i].stationDistance}Km</div>` : ''}
                            </div>
                        </div>`;
    }
    // 遍历标签
    for (var i = 0; i < item.tagList.length; i++) {
        servicesGroup += '<span>' + item.tagList[i] + '</span>';
    }
    // 遍历时间价格
    for (var i = 0; i < item.sameStationBusList.length; i++) {
        var departTime = formatTime(item.sameStationBusList[i].departTime, 1);
        lineInfoBox += `<div class="lineInfo flex ac jcs lineInfoClick" ${i > 2 ? `style="display:none;"` : ''} data-scheduleid=${item.sameStationBusList[i].scheduleId}>
                            <div class="timeBox flex jcs">
                                <div class="ShiftsTime">${departTime}</div>
                                <span class="spanShifts">${item.sameStationBusList[i].scheduleCode}</span>
                            </div>
                            <div class="price flex ">
                            ${item.sameStationBusList[i].specialState == 0 ? `<div class="bargainPrice"><span class="f24">￥</span><span class="f32">${item.sameStationBusList[i].sellPrice}${item.sameStationBusList[i].ticketPriceType == 1?'起':''}</span></div>` : `<p class="f24">￥${item.sameStationBusList[i].sellPrice}</p><div class="bargainPrice"><span class="f24">特价￥</span><span class="f32">${item.sameStationBusList[i].specialPrice}${item.sameStationBusList[i].ticketPriceType == 1?'起':''}</span></div>`}
                                <span class="f20 rightArrow"></span>
                            </div>
                        </div>`;
    }

    var stationList = goOnStationListFirst + goOnStationList + goOffStationList + goOffStationListLast;
    return `<li class="line-item">
                <div class="line-top">
                    ${item.totalStationDistance ? `<p>总步行${item.totalStationDistance}Km</p>` : ''}
                </div>
                <div class="line-middle" data-toggle="false">
                    <div class="station-list"><i class="before"></i>${stationList}</div>
                </div>
                <div class="line-bottom">
                    <div class="services-group">${servicesGroup}</div>
                </div>
                <div class="lineInfoBox">
                    ${lineInfoBox}
                    ${item.sameStationBusList.length > 3 ? `<div class="moreLineInfo">更多班次</div>` : ''}
                </div>
            </li>`;
}

// 班线详情
$(document).on("click", ".lineInfoClick", function () {
    var scheduleId = $(this).data('scheduleid');
    var departStationId = $(this).parent().parent().find(".station-gray").data("departstationid");
    var arriveStationId = $(this).parent().parent().find(".station-gray:last-child").data("arrivestationid");
    if ("qrcId" in getUrlRequest) {
        window.location = "/commutingBus/shiftsDetail?scheduleId=" + scheduleId + "&departStationId=" + departStationId + "&arriveStationId=" + arriveStationId + "&qrcId=" + getUrlRequest.qrcId;
    } else {
        window.location = "/commutingBus/shiftsDetail?scheduleId=" + scheduleId + "&departStationId=" + departStationId + "&arriveStationId=" + arriveStationId;
    }
});
// 更多
$(document).on("click", ".moreLineInfo", function () {
    $(this).css("display", "none");
    $(this).parent().find(".lineInfo ").css("display", "flex");
});