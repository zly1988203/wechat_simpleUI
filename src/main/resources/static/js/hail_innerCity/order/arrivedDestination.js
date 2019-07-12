var interval;
var orderInfo = {
    status:$('#status').val(),
    orderNo:$('#orderNo').val(),
    tripNo:$('#tripNo').val(),
    settleMode:$('#settleMode').val(),
    driverName:$('#driverName').val(),
    logoURL:$('#logoURL').val(),
    impProviderName:$('#impProviderName').val(),
    nickName:$('#nickName').val(),
    carNo:$('#carNo').val(),
    userCommentStatus:$('#userCommentStatus').val(),
    orderType:$("#orderType").val(),
    backTrack:$("#backTrack").val(),
    departLng:$("#departLng").val(),
    departLat:$("#departLat").val(),
    arriveLng:$("#arriveLng").val(),
    arriveLat:$("#arriveLat").val(),
    tripStatus:$('#tripStatus').val(),
    payStatus:$('#payStatus').val(),
    canCallDriverFlag:$('#canCallDriverFlag').val(),
    departCarType:$("#departCarType").val(),
    departType:$("#departType").val(),
};
var clickEvent = isAndroid()?'tap':'click';
var dialogText = '你的订单已被客服取消，支付的款项已退回，请通过我的订单查看';
function init(){
    if(orderInfo.payStatus == '0'){
        $('#pay').show();
        $('#payPanel').show();
    }else if(orderInfo.payStatus == '1' && orderInfo.userCommentStatus == 1){
        //未评价
        $('#btnEvaluate').removeClass('finish').addClass('btn-default').show();
        $('#evaluatePanel').show();
        $('#viewEvaluated').show();
        $('#evaluatePanel').css("height","3.42rem")
    }else if(orderInfo.payStatus == '1' && orderInfo.userCommentStatus == 2){
        //已评价
        $('#viewEvaluated').show();
        $('#btnEvaluate').html('已评价');
        $('#btnEvaluate').removeClass('btn-default').addClass('finish').show();
        showEvaluatedPanel();
    }

    if(orderInfo.status == 3 && orderInfo.tripStatus != 10){
        interval=setInterval("innerCityUrlJudge(orderInfo.tripNo+'',orderJudgeCallBack,orderInfo.orderNo+'')", 1000);
    }else{
        clearInterval(interval);
    }

    //订单已完成就隐藏司机电话 不可拨打
    if(orderInfo.status == 6 && orderInfo.canCallDriverFlag == 0){
        $('.driver-info-container .tel').hide();
    }
    isShowBackBtn();
    $('.tips-box').hide();
}

//订单状态扭转判断
function orderJudgeCallBack(data){
    if(parseInt(data.code)==0){
        if(typeof data.data === 'undefined'){
            console.log('订单状态接口错误 data.data：'+data.data);
            return;
        }else if(parseInt(data.data.status)==9){
            clearInterval(interval);
            $.dialog({
                text: dialogText,
                buttons: [{
                    text: '我知道了',
                    onClick: function() {
                        location.href='/hail/innerCity/order/toOrderReturnDetailPage?orderNo='+orderInfo.orderNo;
                    }
                }]
            });
        }else if(parseInt(data.data.status)==10){
            window.location='/hail/innerCity/orderDetail/getOrderInfo?orderNo='+orderInfo.orderNo;
        }else if(parseInt(data.data.status) == 8){
            if(parseInt(data.data.orderStatus) == 6 || parseInt(data.data.orderStatus) == 4 ){
                window.location='/hail/innerCity/orderDetail/getOrderInfo?orderNo='+orderInfo.orderNo;
            }
        }
    }
}

//回显评价信息
function showEvaluatedPanel() {
    var star = $('#commentStar').val();
    var commentContent = $('#commentContent').val();
    var tagIdValues = $('#tagListStr').val();
    if(tagIdValues){
        tagIdValues = tagIdValues.split('@');
        $.each(tagIdValues,function (index, item) {
            $('.evaluate-box span').each(function (ind,it) {
                if($(it).data('value') == item){
                    $(it).addClass('active');
                }
            });
        });
    }
    var eleSpan = $('.star span');
    $.each(eleSpan,function (index,item) {
        if(index < star){
            $(item).addClass('active');
        }
    });

    $('#evaluatePanel textarea').val(commentContent);
    $('#evaluatePanel textarea').attr('readonly');
}

function bindEvent(){
    if(orderInfo.userCommentStatus == 1){
        $('.star span').on(clickEvent,function () {
            var $child = $(this);

            $child.nextAll('span').removeClass('active');
            $child.prevAll('span').addClass('active');
            $child.addClass('active');

            //存储
            $child.siblings('input').val($('.star span.active').length);
            $('#evaluatePanel').css("height","auto");
            //展开全部评价
            $('.evaluate-box').show();
        });
        //评价tag的选中/取消
        $('.tag span').on('click', function () {
            var $el = $(this),
                $input = $el.siblings('input');
            var _value = $el.data('value'),
                _VAL = $input.val();

            //选中 或 取消
            if(!$el.data('lock')) {
                $el.data('lock', true);
                $el.addClass('active');

                //add
                if($.trim(_VAL) == "") {
                    $input.val(_value);
                } else if($input.val().indexOf(_value) < 0) {
                    $input.val(_VAL + "," + _value);
                }
            } else {
                $el.data('lock', false);
                $el.removeClass('active');

                //remove
                var _index = $input.val().indexOf(_value);
                if(_index >= 0) {
                    var reg = "";
                    if(_index == 0) {
                        reg = new RegExp(_value + ",?", "gi");
                    } else {
                        reg = new RegExp(",?" + _value, "gi");
                    }

                    _VAL = _VAL.replace(reg, "");
                    $input.val(_VAL);
                }
            }
        });

        $('.message-area textarea').on('input',function () {
            var param = $(this).val();
            var regRule = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
            if(regRule.test(param)) {
                param = param.replace(regRule, "");
                $(this).val(param);
            }
        });
    }else if(orderInfo.userCommentStatus == 2){
        var star = $('#commentStar').val();
        var starList = $('#evaluatedPanel .star span');
        $.each(starList,function (index,item) {
            if(index < star){
                $(item).addClass('active');
            }
        });
        // $('#commentContent').val();
        $('.message-area textarea').attr('readonly','readonly');
        $('.message-area textarea').text($('#commentContent').val());
        $('.message-area textarea').val($('#commentContent').val());
        $('.message-area textarea').attr('placeholder','');

    }

    $('.evaluate-container .close').on(clickEvent,function () {
        $('.evaluate-container').hide();
        $('#viewEvaluated').show();
    });

    //返回首页   页面有两个返回导致
    $('#back1').on(clickEvent,function(){
        window.localStorage.removeItem('selectedCoupon');
        window.sessionStorage.removeItem('callCarInfo');
        window.location='/hail/interCityIndex';
    });
    //返回首页
    $('#back2').on(clickEvent,function(){
        window.localStorage.removeItem('selectedCoupon');
        window.sessionStorage.removeItem('callCarInfo');
        window.location='/hail/interCityIndex';
    });

    var orderNo1 = $('#orderNo').val()
    //投诉建议
    $('#suggestBtn').click(function(){
        window.location='/passenger/suggest.html?orderNo='+orderNo1+"&businessType="+orderInfo.orderType;
    });

    //联系客服
    $('#contactCall').on(clickEvent, function() {
        var urlDetail = SERVER_URL_PREFIX + '/Config/commonConfig';
        var dataDetail = {
        };
        dataDetail = genReqData(urlDetail, dataDetail);
        $.ajax({
            type: 'POST',
            url: urlDetail,
            data: dataDetail,
            dataType:  'json',
            success: function(data){
                if(data && data.code == 0){
                    window.location.href = 'tel:'+data.data.customerTel;
                }
            }
        });

    });

    $('#backDestination').on(clickEvent,function () {
        var callCarInfo = {
            departAreaCode:li.data('areacode'),
            departTitle:li.data('name'),
            departLat:li.data('lat'),
            departLng:li.data('lng'),
            departRegionName:$('#setCityHtml').html(),
            arriveAreaCode:li.data('areacode'),
            arriveTitle:li.data('name'),
            arriveLat:li.data('lat'),
            arriveLng:li.data('lng'),
            arriveRegionName:$('#setCityHtml').html()
        };

        window.sessionStorage.setItem('callCarInfo',JSON.stringify(callCarInfo));
    });

    //点击更多
    $('#more1').on(clickEvent, function() {
        $('#morePanel').show();
        $(".black_overlay").show();
    });

    //点击更多
    $('#more2').on(clickEvent, function() {
        $('#morePanel').show();
        $(".black_overlay").show();
    });

    $('#close').on(clickEvent,function () {
        // $('#viewEvaluated').show();
        $('#morePanel').hide();
        $(".black_overlay").hide();
    })
}

$('#btnEvaluate').on(clickEvent,function () {
    if(orderInfo.userCommentStatus == 1){
        $('#evaluatePanel').show();
        $('#viewEvaluated').show();
    }else{
        $('#evaluatedPanel').show();
        // $('#viewEvaluated').hide();
    }
});

// 初始化页面的地图
function initMap(departLat, departLng, arriveLat, arriveLng) {
    var map;
    if(departLat && departLng && arriveLat && arriveLng){
       map = new AMap.Map('allmap', {
            resizeEnable: true, //是否监控地图容器尺寸变化
            zoom:13, //初始化地图层级
            center: [arriveLng, arriveLat] //初始化地图中心点
        });

        //构造路线导航类
        var driving = new AMap.Driving({
            policy: AMap.DrivingPolicy.LEAST_TIME,
            map: map,
            hideMarkers: true
        });

        var markers = [];//所有maker对象、
        // marker点信息
        var markerList = [{
            icon: '/res/images/newInnerCity/icon-start-1.png',
            size:[21,32],
            position: [departLng, departLat],
            offset: [0,0],
            markerType: 1//1-出发站点，2-结束，0-其他
        },{
            icon: '/res/images/newInnerCity/icon-end-1.png',
            size:[21,32],
            position: [arriveLng, arriveLat],
            offset: [0,0],
            markerType: 2//1-出发站点，2-结束，0-其他
        }];

        //生成marker和自定义信息框
        $.each(markerList,function (index, marker) {
            var tempMarker = new AMap.Marker({
                map: map,
                position: [marker.position[0], marker.position[1]],
                icon:new AMap.Icon({
                    size: new AMap.Size(marker.size[0], marker.size[1]),  //图标大小
                    imageSize: new AMap.Size(marker.size[0], marker.size[1]),  //图标大小
                    image: marker.icon,
                    //imageOffset: new AMap.Pixel(marker.offset[0], marker.offset[1])//偏移量 0-left;60-top
                })
            });

            markers.push(tempMarker);
        });

        // 根据起终点经纬度规划驾车导航路线
        driving.search(new AMap.LngLat(departLng, departLat), new AMap.LngLat(arriveLng, arriveLat), function(status, result) {
            // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
            if (status === 'complete') {

            } else {
                $.toast('绘制线路数据失败')
            }
        });


        //地图自适应使点标记显示在视野中
        map.setFitView();
    }
}

$(function() {
    init();
    bindEvent();
    initMap(orderInfo.departLat,orderInfo.departLng,orderInfo.arriveLat,orderInfo.arriveLng);
    if(orderInfo.payStatus == '0'){
        loadCoupons();
    }
    switchJourney();
    initTitleOfStatus();
    //是否显示取消订单按钮
    isShowCancel();
    subAddrStr(address);
    showCarType(orderInfo);
});

function secToMin(duration){
    if(duration%60 == 0){
        var minute = parseInt(duration/60);
    }else{
        var minute = parseInt(duration/60) + 1;
    }

    $('#time').html(minute);
}

//提交评论
$('#sub-evaluate').on('click', function () {
    var star = $('.star span.active').length;
    if(star <= 0) {
        $.toast('至少需要选择一颗星星。');
        return;
    }

    var length = $('#message-1').val().length;
    if(length > 200) {
        $.toast('字数太多了。');
        return;
    }

    var urlDetail = SERVER_URL_PREFIX + "/hail/Comment/add";
    // var urlDetail = SERVER_URL_PREFIX + "/comment/addComment";
    var dataDetail = {
        orderNo: $('#orderNo').val(),
        star: star,
        tagIds: getTagList(),
        content: $("#message-1").val()
    };
    dataDetail = genReqData(urlDetail, dataDetail);
    $.ajax({
        type: 'POST',
        url: urlDetail,
        data: dataDetail,
        dataType:  "json",
        success: function(data){
            if(data && data.code == 0){
                var orderNo = $('#orderNo').val();
                // window.location.href='/innerCity/order/toOrderCommented?orderNo='+orderNo;
                // if(data.data){
                //     var message = $.parseJSON(data.data);
                //     showEvaluated(message);
                // }
                // var star = message.star;
                // var tagIds = message.tagIds;//示例：服务好态度棒@不是订单显示车辆
                // var content = message.content;//其他信息

                window.location.reload();
            }else{
                $.toast('未知错误');
            }
        }
    });
});


//获取选中的tag信息
function getTagList() {
    var tagIdValues = [];
    $('.evaluate-box .tag span.active').each(function() {
        tagIdValues.push($(this).data('value'));
    });
    return tagIdValues.join('@');
}

//返程
$('#callBack').on(clickEvent,function () {
    var departAreaCode = $('#departAreaCode').val();
    var departTitle = $('#departTitle').val();
    var departLat = $('#departLat').val();
    var departLng = $('#departLng').val();
    var departRegionName = $('#departRegionName').val();
    var arriveAreaCode = $('#arriveAreaCode').val();
    var arriveTitle = $('#arriveTitle').val();
    var arriveLat = $('#arriveLat').val();
    var arriveLng = $('#arriveLng').val();
    var arriveRegionName = $('#arriveRegionName').val();

    var data = {
        departAreaCode:arriveAreaCode,
        departTitle:arriveTitle,
        departLat:arriveLat,
        departLng:arriveLng,
        departRegionName:arriveRegionName,
        arriveAreaCode:departAreaCode,
        arriveTitle:departTitle,
        arriveLat:departLat,
        arriveLng:departLng,
        arriveRegionName:departRegionName,
    };
    window.localStorage.removeItem('selectedCoupon');
    window.sessionStorage.setItem('callCarInfo',JSON.stringify(data));
    window.location.href = '/hail/innerCity/order/innerCityService'
});


//是否显示返程按钮
function isShowBackBtn() {
    if(orderInfo.backTrack == 0){
        $('#callBack').hide();
    }else if(orderInfo.backTrack == 1){
        $('#callBack').show();
    }
}