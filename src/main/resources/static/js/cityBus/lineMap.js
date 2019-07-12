var imgUrl = '';
var click_event = isAndroid() ? 'tap' : 'click';
var lineArr = [];
var childLineList = [];
// 获取地址栏参数
var getUrlRequest = getRequest();
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

var userInfo = JSON.parse(localStorage.getItem("userInfo"));
var map = new AMap.Map('container', {
    resizeEnable: true,
    zoom:12,
    // center: [116.397428, 39.90923]
});

var startMarker = new AMap.Marker({
    map: map,
    icon:new AMap.Icon({
        size: new AMap.Size(48, 48),  //图标大小
        imageSize: new AMap.Size(21, 21),
        image: '/res/images/busCity/icon_up.png',
        imageOffset: new AMap.Pixel(0, 25)//偏移量 0-left;60-top
    }),
    zIndex: 200,
    position: map.getCenter()
});

var endMarker = new AMap.Marker({
    map: map,
    icon:new AMap.Icon({
        size: new AMap.Size(48, 48),  //图标大小
        imageSize: new AMap.Size(21, 21),
        image:  '/res/images/busCity/icon_down.png',
        imageOffset: new AMap.Pixel(0, 25)//偏移量 0-left;60-top
    }),
    zIndex: 200,
    position: map.getCenter()
});

var driverMarkAddFlag = false;//是否已经添加了司机位置marker，只添加一个driverMark
var driverMark = new AMap.Marker({
    // map: map,
    icon: new AMap.Icon({
        size: new AMap.Size(26,35),
        imageSize: new AMap.Size(26,35),
        image: '/res/images/busCity/icon-driver-position.png',
        imageOffset: new AMap.Pixel(0,0)
    }),
    // position: map.getCenter()
});


//车辆
// var  carMarker = new AMap.Marker({
//      map: map,
//      position: [113.877227, 22.575276],
//      icon: "https://webapi.amap.com/images/car.png",
//      offset: new AMap.Pixel(-26, -13),
//      autoRotation: true,
//      angle:-90,
//  });
//
//  carMarker.on('moving', function (e) {
//      passedPolyline.setPath(e.passedPath);
//  });


function  addMark() {
    // var marker = null;
    lineArr.forEach(function (item,index) {
        var name = item.stationName;
        var time = item.time;
        var imgUrl = item.imgUrl;
        var lng = item.lng;
        var lat = item.lat;
        var lnglat = [lng,lat];
        var isStation = item.isStation;

        var dataImg = '';
        if(!isEmpty(imgUrl)){
            dataImg = ' data-img-url="'+ imgUrl +'"';
        }

        var marker = new AMap.Marker({
            map: map,
            position:lnglat,
            offset: new AMap.Pixel(-7, -3),
            content:'<div class="mark-box"><div class="circle-mark" data-isstation="'+isStation+'" data-name="'+name+'" data-time="'+time+'"' +
            dataImg +'" data-lng="'+lng+'" data-lat="'+lat+'"></div></div>',
        });

        marker.on('click',function (e) {
            var $el = $(e.target.getContentDom());
            var _this =  $el.find('.circle-mark');
            var isStation = $(_this).data('isstation');
            var name = $(_this).data('name');
            var time = $(_this).data('time');
            var imgUrl = $(_this).data('img-url');
            var lng = $(_this).data('lng');
            var lat = $(_this).data('lat');
            var point = {
                imgUrl: imgUrl,
                lng:lng,
                lat:lat,
                name: name,
                time: time,
                isStation:isStation
            }
            openInfoWindow(point);
        })

    })
}

/*function openInfoWindow(point) {
    var title = point.name;
    var dataTime = point.time;
    imgUrl = point.imgUrl;
    var lnglat = [point.lng,point.lat]
    var infoWindow = new AMap.InfoWindow({
        isCustom:true,
        // //基点指向marker的头部位置
        offset: new AMap.Pixel(0, -5),
        position:lnglat,
        content:' <div class="simple-content-body">' +
        '        <div class="simple-window-panel">' +
        '            <div class="simple-window-title">'+title+'</div>' +
        '            <div class="simple-window-body">' +
        '                <div class="info-content">'+dataTime+'出发</div>' +
        '            </div>' +
        '             <div class="window-foot">' +
        '                            <div class="icon-view-img"></div>' +
        '                            <div id="showImg" class="foot-txt">查看图片</div>' +
        '                            <div class="icon-see"></div>' +
        '                       </div>' +
        '        </div>' +
        '        <div class="ifwn-combo-sharp"></div>' +
        '    </div>',
    });

    infoWindow.open(map, lnglat);
}*/
function openInfoWindow(point) {
    var isStation = point.isStation;
    var title = point.name;
    var dataTime = point.time;
    imgUrl = point.imgUrl;
    var imgHtml = '';
    var dataContent = '';
    if(!isEmpty(point.imgUrl)){
        imgHtml = '<div class="window-foot">' +
            '  <div class="icon-view-img"></div>' +
            '  <div id="showImg" class="foot-txt">查看图片</div>' +
            '  <div class="icon-see"></div>' +
            '</div>'
    }
    if(isStation == 0){
        dataContent = dataTime+'出发';
    }else if(isStation == 1){
        dataContent = '预计'+dataTime+'到达';
    }
    var lnglat = [point.lng,point.lat]
    var infoWindow = new AMap.InfoWindow({
        isCustom:true,
        // //基点指向marker的头部位置
        offset: new AMap.Pixel(0, -5),
        position:lnglat,
        content:' <div class="simple-content-body">' +
            '        <div class="simple-window-panel">' +
            '            <div class="simple-window-title">'+title+'</div>' +
            '            <div class="simple-window-body">' +
            '                <div class="info-content">'+dataContent+'</div>' +
            '            </div>' +
            imgHtml +
            '        </div>' +
            '        <div class="ifwn-combo-sharp"></div>' +
            '    </div>',
    });

    infoWindow.open(map, lnglat);
}

document.body.addEventListener('touchend', function(e){
    // 事件与图片点击事件保持一致，防止图片和关闭按钮在相同位置上时两个事件都触发，导致图片闪现
    if( e.target.id === 'showImg'){
        $('.img-content img').attr('src',imgUrl) ;
        $('#stationImage').show();
        e.stopPropagation();//阻止事件穿透
    }
}, true);

$('.close-img').on('touchend',function (e) {
    // 事件与图片点击事件保持一致，防止图片和关闭按钮在相同位置上时两个事件都触发，导致图片闪现
    $('#stationImage').hide();
    e.stopPropagation();//阻止事件穿透
})

//线路详情展开收起动画
function animateSwitchDetail(){
    var el = $('.detail-main-content');
    if(el.data('toggle')){
        //展开
        // $('.edit-station').hide();
        // $('.save-station').show();
        el.height(el.data('height'));
        el.data('toggle',false);
        $('.detail-toggle').addClass('turn');

        //设置地图边界
        var line_detail_h = $('.detail-head-content').height()+ el.data('height')/*+ $('.detail-bottom').height();*/;
        var h = $(window).height() - line_detail_h;
        $('.ola-maps').css({height: h + 'px', 'margin-top': line_detail_h});
        $('.detail-station-list li.active').addClass('scheduling-colorfull');

    }else{
        //收起
        // $('.edit-station').show();
        // $('.save-station').hide();
        el.height(80);
        el.data('toggle',true);
        $('.detail-toggle').removeClass('turn');

        //设置地图边界
        var line_detail_h = $('.detail-head-content').height()+ $('.detail-bottom').height();;
        var h = $(window).height() - line_detail_h;
        $('.ola-maps').css({height: h + 'px', 'margin-top': line_detail_h});
        $('.detail-station-list li.active').removeClass('scheduling-colorfull');
    }

    //滚动设置
    // bindScroll();
}


//设置地图的外边距
function setMap() {
    var h = $(window).height() - $('.line-detail').height();
    $('.ola-maps').css({height: h + 'px', 'margin-top': $('.line-detail').height()});
    switchFunction();
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
        // scrollMiddle($('.detail-station-start li.active'));
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
    var _startScrollTop = el.position().top || el.offset().top,
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
    // _myIScroll.scrollTo(0, _moveTop);
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


//初始化
function init(){
    //获取站点详情高度
    // var main_content =  $('.detail-main-content');
    // main_content.data('height',main_content.height()+80);
    // main_content.height(main_content.data('height'));
}

function getStationList() {
    $.showLoading();
    var evt_success = function (res) {
        $.hideLoading();
        if(res.code == 0){
            var data = res.data;
            var scheduleCode = (isEmpty(data.scheduleCode) ? '' : data.scheduleCode);
            var carNo = (isEmpty(data.carNo ) ? '' : data.carNo );
            $('.detail-head .detail-busNo').html(scheduleCode);
            $('.detail-head  .depart-date').html(formatDateToString(new Date(data.departStationTimeLong), true));
            $('.detail-head .detail-carNo').html(carNo);
            var goOnStationList = data.goOnStationList;
            var goOffStationList = data.goOffStationList;
            childLineList = JSON.parse(data.childLineList);
            var lineDetail = {
                departTime:data.departTime,
                departStationId:data.departStationId,
                arriveStationId:data.arriveStationId,
                goOnStationList:goOnStationList,
                goOffStationList:goOffStationList,
            }

            goOnStationList.forEach(function (item,index) {
                var station = {
                    stationId:item.stationId,
                    stationName:item.stationName,
                    lng:item.longitude,
                    lat:item.latitude,
                    time:calTime(item.departTime),
                    imgUrl:item.stationPicUrl,
                    isStation:0
                }
                lineArr.push(station);
            })
            goOffStationList.forEach(function (item,index) {
                var station = {
                    stationId:item.stationId,
                    stationName:item.stationName,
                    lng:item.longitude,
                    lat:item.latitude,
                    time: calTime(item.departTime),
                    imgUrl:item.stationPicUrl,
                    isStation:1
                }
                lineArr.push(station);
            })

            var endStation = lineArr[lineArr.length-1];
            var startPoint = new AMap.LngLat(lineArr[0].lng, lineArr[0].lat);
            var endPoint = new AMap.LngLat(endStation.lng, endStation.lat);
            var tempArr = Object.assign([],lineArr);
            tempArr.splice(0,1);
            tempArr.splice(tempArr.length-1);

            var tempAMapArr = [];
            tempArr.forEach(function (item) {
                tempAMapArr.push(new AMap.LngLat(item.lng, item.lat));
            });

            var wayPoints = tempAMapArr;
            initShow(lineDetail);
            setMap();
            drivingStations(startPoint,endPoint,wayPoints);
            var startPointFirst = new AMap.LngLat(data.departLng, data.departLat);
            var endPointFirst = new AMap.LngLat(data.arriveLng, data.arriveLat);
            startMarker.setPosition(startPointFirst);
            endMarker.setPosition(endPointFirst);

            timesGetDriverLocation(data.driverId);
        }
    }

    var evt_error = function (e) {
        $.hideLoading();
    }
    var url;
    if(getUrlRequest.orderType ==7){
        //定制通勤接口
        url = SERVER_URL_PREFIX + "/commute/optimized/queryLineDetailByOrder";
    }else{
        url = SERVER_URL_PREFIX + "/busline/queryLineDetailByOrder";
    }
     
    var param = {
        orderNo: getUrlRequest.orderNo,
        departDate:getUrlRequest.departDate,
        token : $.cookie('token')
    };
    $.ajaxService({
        url:url,
        data:param,
        success:evt_success,
        error:evt_error,
    })
}

function calTime(time,differ){
    if(isEmpty(differ)){
        differ = 0;
    }
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

    var timeStr = temp+hour+':'+min;
    return timeStr;
}


// 初始化显示
function initShow(lineDetail){
    // 显示price
    var otherHtml = '';
    if (lineDetail.specialState == 1){
        otherHtml = '<div class="detail-price"> <s class="special-price">￥<i>'+lineDetail.sellPrice+'</i></s>' +
            '<i class="sell-price">￥<i>'+lineDetail.specialPrice+'</i></i> </div>';
    }
    else{
        otherHtml = '<div class="detail-price">' +
            '<i class="sell-price">￥<i>'+lineDetail.sellPrice+'</i></i> </div>';
    }
    $('.other .first').html('');
    $('.other .first').html(otherHtml);

    var startHtml = '';
    var goOnStationList = lineDetail.goOnStationList;
    if (goOnStationList.length>0){
        // var sellOutFlag = false;//售罄标记 true-售罄 false-有票
        // var activeFlag = false;
        var defaultFlag = false;//默认选中标记-后台传来的选中站点
        for (var i=0;i<goOnStationList.length;i++){
            var stationTag = "途径";
            if (i==0) {
                stationTag = "始发";
            }
            var list = goOnStationList[i];
            startHtml = '<li';
            if (list.stationId == lineDetail.departStationId){
                startHtml += ' class="active"';
                defaultFlag = true;
                var imgUrlOn = list.stationPicUrl;
                var lngOn = list.longitude;
                var latOn = list.latitude;
                var nameOn = list.stationName;
                var timeOn = calTime(list.departTime);
                var isStationOn = 0;
                var pointOn = {
                    imgUrl: imgUrlOn,
                    lng: lngOn,
                    lat: latOn,
                    name: nameOn,
                    time: timeOn,
                    isStation: isStationOn
                }
                startMarker.on('click', function (e) {
                    openInfoWindow(pointOn);
                })
            }else {
                defaultFlag = false;
                // startHtml += ' style="display: none;"';//默认收起其他站点
            }

            startHtml += ' data-stationid="'+list.stationId+'"'+
                ' data-lng="'+list.longitude+'"' +
                'data-default="'+ defaultFlag +'"'+
                ' data-lat="'+list.latitude+'"'+
                ' data-name="'+list.stationName+'"'+
                ' data-min="'+list.useTime+'"'+
                ' data-img-url="'+ list.stationPicUrl +'"'+
                ' data-time="'+list.predictTime+'"'+' data-form="on">'+
                ' <div class="content">'+
                ' <div class="name"><h4>'+list.stationName+'</h4>' +
                ' <div class="item-type">'+stationTag+'</div></div>';

            if (i != 0){
                startHtml += ' <span>预计'+calTime(list.departTime)+'</span></div>';
            }else{
                startHtml += ' <span>'+calTime(list.departTime)+'</span></div>';
            }
            startHtml += '</div></li>';
            $('.detail-station-start').append(startHtml);
        }
        stationClickEvent();
        // getActiveStation();
    }

    var endtHtml = '';
    var goOffStationList = lineDetail.goOffStationList;
    if (goOffStationList.length>=0){
        var defaultFlag = false;//默认选中标记-后台传来的选中站点
        for (var i=0;i<goOffStationList.length;i++){
            var stationTag = "途径";
            var stationTag = "途径";
            if (i==goOffStationList.length-1) {
                stationTag = "终点";
            }
            var list = goOffStationList[i];
            endtHtml = '<li';
            if (list.stationId == lineDetail.arriveStationId){
                endtHtml += ' class="active"';
                defaultFlag = true;
                var imgUrlOff = list.stationPicUrl;
                var lngOff = list.longitude;
                var latOff = list.latitude;
                var nameOff = list.stationName;
                var timeOff = calTime(list.departTime);
                var isStationOff = 0;
                var pointOff = {
                    imgUrl: imgUrlOff,
                    lng: lngOff,
                    lat: latOff,
                    name: nameOff,
                    time: timeOff,
                    isStation: isStationOff
                }
                endMarker.on('click', function (e) {
                    openInfoWindow(pointOff);
                })
            }else {
                defaultFlag = false;
                // endtHtml += ' style="display: none;"';//默认收起其他站点
            }
            endtHtml += ' data-stationid="'+list.stationId+'"'+
                ' data-lng="'+list.longitude+'"' +
                'data-default="'+ defaultFlag +'"'+
                ' data-lat="'+list.latitude+'"'+
                ' data-name="'+list.stationName+'"'+
                ' data-min="'+list.useTime+'"'+
                ' data-img-url="'+ list.stationPicUrl +'"'+
                ' data-time="'+list.predictTime+'"'+' data-form="off">'+
                '<div class="content">'+
                '<div class="name"><h4>'+list.stationName+'</h4>' +
                '<div class="item-type">'+stationTag+'</div></div>'+
                '<span>预计'+calTime(list.departTime)+'</span></div>'+
                '</div></li>';
            $('.detail-station-ending').append(endtHtml);
        }
        stationClickEvent();
    }

    $('.detail-station-list').data('real-height',$('.detail-station-list')[0].scrollHeight);

    // changePrice();

    //只有两个站点不显示切换站点
    if(goOnStationList.length == 1 && goOffStationList.length == 1){
        // $('.detail-bottom').hide();
        $('.detail-toggle').hide();
    }else{
        // $('.detail-bottom').show();
        $('.detail-toggle').show();
    }

    addMark();

    var  initHeight = $('.detail-main-content').height();
    $('.detail-main-content').data('height',initHeight);
    var lineHeight = $('.detail-main-content ul li').height();
    $('.detail-main-content').data('line-height',lineHeight);
    // $('.detail-main-content').height(initHeight);

    initStationInfo();
}

function initStationInfo(){
    var $el = $('.detail-station-start li.active');
    var lat = $el.data('lat');
    var lng = $el.data('lng');
    var name = $el.data('name');
    var time = $el.data('time');
    var imgUrl = $el.data('img-url');
    var type = $el.data('form');
    var isStation = null;
    if(type == 'on'){
        startMarker.setPosition([lng,lat]);
        isStation = 0;
    }else {
        endMarker.setPosition([lng,lat]);
        isStation = 1;
    }
    var point = {
        imgUrl: imgUrl,
        lng:lng,
        lat:lat,
        name: name,
        time: time,
        isStation:isStation
    }
    openInfoWindow(point);
    //剔除已停售站点
    if($el.hasClass('sell-out')) {
        return false;
    }
    // //滚动
    // scrollMiddle($el);
    // changePrice();
}

/*点击事件展开收起切换*/
$('.detail-toggle').on('touchstart', function () {
    switchFunction();
});
//展开收起切换
function switchFunction() {
    // animateSwitchDetail();
    animateSwitchDetail();
    showSelectedStation();
}

//展示 选中/全部 线路
function showSelectedStation() {
    var el = $('.detail-main-content');
    if(el.data('toggle')){
        $('.detail-station-list .detail-station-start li').hide();
        $('.detail-station-list .detail-station-start li.active').show();
        $('.detail-station-list .detail-station-ending li').hide();
        $('.detail-station-list .detail-station-ending li.active').show();
    }else{
        $('.detail-station-list .detail-station-start li').show();
        $('.detail-station-list .detail-station-ending li').show();
    }
}

function drivingStations(startPoint,endPoint,wayPoints) {
    $.showLoading('线路绘制中.....');
    var driving = new AMap.Driving({
        map: map,
        hideMarkers:true,
    });

    // 根据起终点经纬度规划驾车导航路线
    driving.search(startPoint,endPoint,{waypoints:wayPoints},
        function(status, result) {
        // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
        if (status === 'complete') {
            map.setCenter(startPoint);
            map.setFitView();
            $.hideLoading();
        } else {
            console.log('获取驾车数据失败：' + result)
        }
    });
}

//上车站点默认选中站点：默认选中后台的，否则选中默认后的第一个未售罄
function getActiveStation() {
    var onStationList = $('.detail-station-start li');
    var defaultIndex;
    for(var i=0; i<onStationList.length;i++){
        var stationItem = $(onStationList[i]);
        var defaultFlag = stationItem.data('default');
        var sellOut = stationItem.data('sell-out');
        if(defaultFlag && !sellOut){
            stationItem.addClass('active').siblings().removeClass('active');
            // return false;//终止整个循环
            break;
        }else if(defaultFlag && sellOut){
            defaultIndex = i;
            // return true;//终止本次循环，进入下一次循环
            continue;
        }else if(!defaultFlag && sellOut){
            // return true;//终止本次循环，进入下一次循环
            continue;
        }else if(!defaultFlag && !sellOut){
            stationItem.addClass('active').siblings().removeClass('active');
            // return false;//终止整个循环
            break;
        }
    }

}
function stationClickEvent() {
    /*选中站点*/
    $('.detail-station-list li').on('tap', function () {
        // startAnimation();
        var $el = $(this);
        var lat = $el.data('lat');
        var lng = $el.data('lng');
        var name = $el.data('name');
        var time = $el.data('time');
        var imgUrl = $el.data('img-url');
        var type = $el.data('form');
        var defaultFlag = $el.data('default')
        var isStation = null;
        if(defaultFlag){
            if(type == 'on'){
                startMarker.setPosition([lng,lat]);
                isStation = 0;
            }else {
                endMarker.setPosition([lng,lat]);
                isStation = 1;
            }

            //选中站点居中
            map.setCenter(new AMap.LngLat(lng, lat));

            var point = {
                imgUrl: imgUrl,
                lng:lng,
                lat:lat,
                name: name,
                time: time,
                isStation:isStation
            }
            openInfoWindow(point);
            //剔除已停售站点
            if($el.hasClass('sell-out')) {
                return false;
            }

            if(!$('.detail-main-content').data('toggle')){
                //展开状态点击才改变样式
                $el.addClass('active scheduling-colorfull').siblings().removeClass('active scheduling-colorfull');
            }

            //滚动
            scrollMiddle($el);
            // changePrice();
        }else {
            return;
        }
    });
}

function changePrice(){
    //获取上下车店 stationId
    var stationStartId = $('.detail-station-start li.active').data('stationid');
    var stationEndingId = $('.detail-station-ending li.active').data('stationid');
    if(childLineList.length>0){
        for(var i=0;i<childLineList.length;i++){
            var childLine = childLineList[i];
            if(childLine.departStationId == stationStartId & childLine.arriveStationId == stationEndingId){
                var sellPrice = saveTwoDigit(childLine.sellPrice);
                $('#price').val(sellPrice);
                $('.detail-price .sell-price i').html(sellPrice);
                if($("#specialState").val() == 1){
                    var showPrice = saveTwoDigit(childLine.specialPrice);
                    if(showPrice<0){
                        $('#specialPrice').val(0);
                        $('.detail-price .sell-price i').html(0);
                    }else{
                        $('#specialPrice').val(showPrice);
                        $('.detail-price .sell-price i').html(showPrice);
                    }
                }
                busId = childLine.idStr;//选择不同的上下车站点，有不同的busId，下单请求接口是需要传不同的busid
                $("#busId").val(busId);
            }
        }
    }
}

function timesGetDriverLocation(driverId) {
    getDriverLocation(driverId);
    //一分钟请求一次
    setInterval(function () {
        getDriverLocation(driverId)
    }, 30*1000);
}

//获取司机信息
function getDriverLocation(driverId){
    if(isEmpty(driverId)){
        return;
    }

    var evt_success = function (res) {
        $.hideLoading();
        if(res.code == 0){
            if(isNaN(res.data.lng) || isNaN(res.data.lat) || res.data.lng < -180 || res.data.lng > 180 || res.data.lat < -90 || res.data.lat > 90){
                //不是正确的经纬度坐标判断
                return;
            }else{
                if(!driverMarkAddFlag){
                    driverMarkAddFlag = true;
                    map.add(driverMark);
                }
                driverMark.setPosition([res.data.lng,res.data.lat]);
            }
        }else {
            //隐藏司机位置
            map.remove(driverMark);
        }
    }

    var evt_error = function (e) {
        $.hideLoading();
    }
    var url = SERVER_URL_PREFIX + "/busline/getDriverLation";

    var param = {
        driverId: driverId,
    };
    $.ajaxService({
        url:url,
        data:param,
        success:evt_success,
        error:evt_error,
    })

}

$(function () {
    //加载用户信息
    if (isEmpty(userInfo)) {
        initUserInfo(function () {
            initPage();
        });
    }
    else {
        initPage();
    }
});

$('#back').on('click',function () {
   window.history.back(-1);
});

function initPage() {
    userInfo = JSON.parse(localStorage.getItem("userInfo"));
    init();
    // setMap();
    hideOptionMenu(); // 隐藏分享
    getStationList();
    setTimeout(function(){
        $('title').html("线路地图-"+userInfo.providerName);
    },800)
}
