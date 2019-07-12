//初始化参数
var callCarInfoObj = {};//出发地目的地参数 转换为对象
var tempToday = new Date();
var today  = tempToday.getFullYear() + '-' + (tempToday.getMonth()+1) + '-' + tempToday.getDate();
var lineId = '';//匹配到的线路id
var personList = [];//所有乘车人信息列表
var click_tap = isAndroid()?'tap':'click';

//title相关数据
var providerName = '';
var serviceNameObj = '';
var currentServiceName = '';

//是否已有行程 有则保存订单号
var orderNo = '';
$(function () {
    //每次进叫车页面清空一次优惠券缓存
    window.localStorage.removeItem('selectedCoupon');
    clearStartTime();
    //查询是否有未完成的行程
    queryIfHasUnfinishedOrder();
    initPage();
    initTitle();
});

$('.notes').on('focus',function () {
    $(this).attr('placeholder','');
});
$('.notes').on('blur',function () {
    var value = $.trim($(this).val());
    if(value){
        $(this).attr('placeholder','');
    }else {
        $(this).val('');
        $(this).attr('placeholder','给司机留言');
    }
});

function queryIfHasUnfinishedOrder(){
    $.ajax({
        type: 'POST',
        url: '/hail/innerCity/order/queryIfHasUnfinishedOrder',
        data: {},
        dataType:  'json',
        success: function(data){
            if(data.code ==0){
                orderNo = data.data.orderNo;
                $.confirm('您当前有未完成的行程', '',[ '我知道了','进入行程'], function() {
                    window.location='/hail/innerCity/orderDetail/getOrderInfo?orderNo='+orderNo;
                });
            }
        }
    });
}

/***************************************************************************************************/
// 立即预约 预约车辆提交订单锁，用于防止用户短时间内频繁操作
var searchBtnLock = false;
$('#searchBtn').off(click_tap).on(click_tap,function(){
    if(searchBtnLock == false){
        if(orderNo){
            $.confirm('您当前有未完成的行程', '',[ '我知道了','进入行程'], function() {
                window.location='/hail/innerCity/orderDetail/getOrderInfo?orderNo='+ orderNo;
            });
        }else{
            searchBtnLock = true;
            //生成订单
            var departLng = $("#startAddr").data('departLng');
            var departLat = $("#startAddr").data('departLat');
            var departTitle = $("#startAddr").data('departAddress');
            var departAreaCode = $("#startAddr").data('departAreaCode');

            var arriveLng = $("#endAddr").data('arriveLng');
            var arriveLat = $("#endAddr").data('arriveLat');
            var arriveTitle = $("#endAddr").data('arriveAddress');
            var arriveAreaCode = $("#endAddr").data('arriveAreaCode');
            
            var departVal = $('#startAddr').val();
            if(departVal.indexOf('·') > -1){
                var tempStr = departVal.split('·');
                if(tempStr.length > 1){
                    departTitle = $.trim(tempStr[tempStr.length-1]);
                }
            }
            
            var arriveVal = $('#endAddr').val();
            if(arriveVal.indexOf('·') > -1){
                var tempStr = arriveVal.split('·');
                if(tempStr.length > 1){
                    arriveTitle = $.trim(tempStr[tempStr.length-1]);
                }
            }
            var num = $('#amount').val();
            if(departLng== ''|| departLat==''){
                $.toast('请填写出发地');
                searchBtnLock = false;//解锁
                return;
            }
            if(arriveLng== ''|| arriveLat==''){
                $.toast('请填写目的地');
                searchBtnLock = false;//解锁
                return;
            }
            if(!num){
                $.toast('请选择乘车人数');
                searchBtnLock = false;//解锁
                return;
            }
            if(!$('#present_startTime').data('time')){
                $.toast('请选择出发时间');
                searchBtnLock = false;//解锁
                return;
            }
            var startTime = $('#present_startTime').data('date').replace(/\-/g, '/')+" "+$('#present_startTime').data('time').split('~')[0];
            var remark = $.trim($('.notes-box textarea').val());
            var carType = $('.vehicle-switch-box').data('stage');// 车型

            if(!startTime){
                $.toast('请选择出发时间');
                searchBtnLock = false;//解锁
                return;
            }
            if(undefined == carType){
                $.toast('请选择车型');
                searchBtnLock = false;//解锁
                return;
            }
            var passengerIds = "";
            var selectedNum = 0;
            //实名制需要传乘车人id
            if($("#amount").data('type') == "1"){
                $.each(personList,function (index,person) {
                    if(person.selectedFlag){
                        //选中
                        passengerIds += person.id + ',';
                        selectedNum++;
                    }
                });
                if(selectedNum == 0){
                    $.toast('请选择乘车人信息');
                    searchBtnLock = false;//解锁
                    return;
                }
                passengerIds = passengerIds.substring(0, passengerIds.lastIndexOf(','));
            }

            var param = {
                departLng:departLng,
                departLat:departLat,
                arriveLng:arriveLng,
                arriveLat:arriveLat,
                departAreaCode:departAreaCode,
                arriveAreaCode:arriveAreaCode,
                num:num,
                startTime:startTime,
                departTitle:departTitle,
                arriveTitle:arriveTitle,
                remark:remark,
                carType:parseInt(carType),
                passengerIds:passengerIds
            }
            
            $.showLoading();
            $.ajaxService({
                type: 'POST',
                url: '/hail/innerCity/order/addOrder',
                data:param ,
                dataType:  'json',
                success: function(data){
                    searchBtnLock = false;//解锁
                    $.hideLoading();
                    if(data.code ==0){
                        var settleType = data.data.settleMode;
                        var timestamp=new Date().getTime();
                        window.location.href='/hail/innerCity/order/toOrderPay?orderNo='+data.data.orderNo+'&type=1&v='+timestamp;
                    }else{
                        $.alert(data.message);
                    }
                }
            });
        }
    }else{
        $.toast('操作过于频繁，请稍后再试')
    }
});

//返回按钮
$('.btn-bar .back').on(click_tap,function () {
    //清空缓存
    window.sessionStorage.removeItem('callCarInfo');
    window.location.href = '/hail/interCityIndex';
});

// 温馨提示
$('.btn-bar .tips-btn').on(click_tap,function () {
    var urlDetail ='/hail/innerCity/reminder';
    var dataDetail = {};
    dataDetail = genReqData(urlDetail, dataDetail);
    $.showLoading();
    $.ajaxService({
        type: 'POST',
        url: urlDetail,
        data: dataDetail,
        dataType:  'json',
        success: function(data){
            $.hideLoading();
            $('.tips-container-popup').show();
            if(data && data.code == 0){
                if(data.data.configValue!=''){
                    $(".tips-container-popup .tips").html(data.data.configValue);
                }
            }
        }
    });
});
// 弹出框关闭
$('.popup-container .close').on(click_tap,function () {
    $('.popup-container').hide();
});

$('#closeButton').on(click_tap,function () {
    $('.price-detail-container').closePopup();
});
$('#closePopup').on(click_tap,function () {
    $('.market-rule-container').closePopup();
});
//选择人数
$('#amount').on(click_tap,function () {
    showSelectPicker();
    matchLine();
});

//添加实名制乘车人
$('.add-person').on(click_tap,function () {
    $('.select-person-container').hide();
    showEditPersonContainer();
});

$('.notes-box textarea').on('input',function () {
    var _this = this;
    var maxLength = parseInt($(_this).data('maxlength'));
    var length = textLength($(_this));
    if(length > maxLength){
        $(_this).val($(_this).val().substring(0,maxLength)) ;
    }
});

//确定选中的实名制乘车人按钮
$('.select-person-container .confirm-btn').on(click_tap,function () {
    var selected = $('.select-person-main .title .selected').data('value');//选中的人数
    var selectedList = [];//选中的乘客列表
    var _selectedInputHtml = '';
    if(selected <= 0){
        $.toast('请选择乘车人');
        return;
    }else {
        $('#amount').val(selected);
        var allList = $('.select-person-container .person-content .person-item');
        $.each(allList,function (index, item) {
            var person = {};
            if($(item).data('selected')){
                if($(item).data('showidcardno')){
                    person.name = $(item).data('name');
                    person.showIdCardNo = $(item).data('showidcardno');
                    selectedList.push(person);
                    _selectedInputHtml +='<input type="hidden" data-id="" data-name="'+ $(item).data('name') +'" data-showidcardno="'+ $(item).data('showidcardno') +'" />'
                }else{
                    $.toast('请添加乘车人证件号码');
                    return;
                }
            }
        });
        //添加到页面
        $('#personList').html(_selectedInputHtml);
        $('.select-person-container').hide();

        //选中后自动弹出选择时间弹窗
        var date = $('.startTime').data('date');
        var time = $('.startTime').data('time');
        if(date=='' && time==''){
            initCityTimePicker($('.startTime'),showSharingCarPrice);
        }else{
            // 调用计算价格接口
            getLinePriceInfoService();
        }
    }
});

//    约车规则
$('.tips-container-popup .service-rules-btn').on(click_tap,function () {
    window.location.href = '/hail/innerCity/order/serviceRules';
});

//计价规则
$('.price-detail-container .market-rules-btn').on(click_tap,function () {
    $('.market-rule-container').popup('modal')
})

// 出发时间选择
$('.startTime').on(click_tap, function() {
	matchLine();
    var _input = $(this);
    initCityTimePicker(_input,showSharingCarPrice)
});
/***************************************************************************************************/
function clearStartTime() {
    $('.startTime').data('date','');
    $('.startTime').data('time','');
    $('.startTime').val('');
    $('.selected').data('value','0');
    $('.person-item').data('selected','false');
    $('.selection ').removeClass('active');
    $('#amount').val('');
    $('.select-person-main .title .selected').data('value',0);
    $('.select-person-container .title-box .selected').html(0);
    $('.confirm-container .vehicle-switch-box').html('');
    var size = personList.length;
    if (size>0){
    	for (let i = 0;i<size;i++){
    		personList[i].selectedFlag = false;
        }
    }
}

//初始化页面 根据经纬度渲染地图；匹配线路；请求乘车人信息列表
function initPage() {
    callCarInfoObj = JSON.parse(window.sessionStorage.getItem('callCarInfo'));
    if(null != callCarInfoObj && undefined != callCarInfoObj){
        var departLat = undefined == callCarInfoObj.departLat?0:callCarInfoObj.departLat;
        var departLng = undefined == callCarInfoObj.departLng?0:callCarInfoObj.departLng;
        var arriveLat = undefined == callCarInfoObj.arriveLat?0:callCarInfoObj.arriveLat;
        var arriveLng = undefined == callCarInfoObj.arriveLng?0:callCarInfoObj.arriveLng;
        var departAreaCode = undefined == callCarInfoObj.departAreaCode?0:callCarInfoObj.departAreaCode;
        var departTitle = undefined == callCarInfoObj.departTitle?'':callCarInfoObj.departTitle;
        var departRegionName = undefined == callCarInfoObj.departRegionName?'':callCarInfoObj.departRegionName;
        var arriveAreaCode = undefined == callCarInfoObj.arriveAreaCode?0:callCarInfoObj.arriveAreaCode;
        var arriveTitle = undefined == callCarInfoObj.arriveTitle?'':callCarInfoObj.arriveTitle;
        var arriveRegionName = undefined == callCarInfoObj.arriveRegionName?'':callCarInfoObj.arriveRegionName;
        var localLat = undefined == callCarInfoObj.localLat?'':callCarInfoObj.localLat;
        var localLng = undefined == callCarInfoObj.localLng?'':callCarInfoObj.localLng;
        var departVal = '';//显示的文字
        var arriveVal = '';//显示的文字

        //初始化地图：获取上下车经纬度，渲染地图
        initMap(departLat, departLng, arriveLat, arriveLng);
        if(departTitle.indexOf('·') == -1){
            if(departRegionName && departTitle){
                departVal = (departRegionName+ ' · '+departTitle);
            }
        }else{
            departVal = departTitle;
        }

        if(arriveTitle.indexOf('·') == -1){
            if(arriveRegionName && arriveTitle){
                arriveVal = (arriveRegionName+ ' · '+arriveTitle);
            }
        }else{
            arriveVal = arriveTitle;
        }

        //初始化出发地目的地信息
        $('#startAddr').val(departVal);
        $('#startAddr').data('departLat',departLat);
        $('#startAddr').data('departLng',departLng);
        $('#startAddr').data('departAreaCode',departAreaCode);
        $('#startAddr').data('departAddress',departTitle);
        $('#startAddr').data('departRegionName',departRegionName);
        $('#endAddr').val(arriveVal);
        $('#endAddr').data('arriveLat',arriveLat);
        $('#endAddr').data('arriveLng',arriveLng);
        $('#endAddr').data('arriveAreaCode',arriveAreaCode);
        $('#endAddr').data('arriveAddress',arriveTitle);
        $('#endAddr').data('arriveRegionName',arriveRegionName);
        $('#startAddr').data('localLat',localLat);
        $('#startAddr').data('localLng',localLng);
        if(departLat && departLng && arriveLat && arriveLng){
            //请求后台数据进行线路匹配
            var judgeServiceParam = {
                departLat:departLat,
                departLng:departLng,
                departAreaCode:departAreaCode,
                departTitle:departTitle,
                requestUrl:window.location.href,
                token:$.cookie("token"),
                arriveLat:arriveLat,
                arriveLng:arriveLng,
                arriveAreaCode:arriveAreaCode,
                arriveTitle:arriveTitle,
                number:1,//默认值
                departDate: today,//默认当天
            };
            judgeService(judgeServiceParam);


            // 登录成功后请求乘车人信息列表
            // 乘车人信息列表
            queryPassengerRequest();
        }

    }else{
        $.toast('请选择出发地目的地')

    }
}

var map;
var m_location = null;
// 初始化页面的地图
function initMap(departLat, departLng, arriveLat, arriveLng) {

    if(departLat && departLng && arriveLat && arriveLng){
        map = new AMap.Map('allmap', {
            resizeEnable: true, //是否监控地图容器尺寸变化
            zoom:13, //初始化地图层级
            center: [116.397428, 39.90923] //初始化地图中心点
        });

        //当前位置
        m_location = new AMap.Marker({
            icon:new AMap.Icon({
                size: new AMap.Size(22, 22),
                imageSize: new AMap.Size(22, 22),
                image: "/res/images/newInnerCity/icon-current.png",
                // imageOffset: new AMap.Pixel(0, 20)//偏移量 0-left;60-top
            }),
            map:map
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

        //地图自适应使点标记显示在视野中
        var newCenter = map.setFitView();

        var shareObj = {
            url : window.location.href,
        }
        //调用微信自动定位
        wxInitConfig(shareObj,getGpsCallback);

        //回到原点
        $('#currLocation').on(click_tap, function() {
            //  定位
            map.panTo(currentLocation);
        });
    }
}

// 线路匹配接口
function judgeService(param) {
    $.showLoading();
    var url = SERVER_URL_PREFIX+'/hail/innerCity/optimize/judgeService';
    var dataObj = param;
    dataObj.alone = true;
    dataObj = genReqData(url, dataObj);
    dataObj['token'] = $.cookie('token');
    $.ajaxService({
        url:url,
        data:dataObj,
        success:function (res) {
            $.hideLoading();
            if(null != res && res.code == 0){
                //没有车次
                if(null == res.data){
                    $.toast('该行程暂无开通线路~')
                }else {
                    var reqData = res.data;
                    //显示座位数
                    showSeatNo(reqData);
                    //显示阶梯价格
                    showLadderPrice(reqData);
                }
            }
            else{
                clearStartTime();
                $.alert(res.message);
            }
        }
    });
}

// 显示座位数
function showSeatNo(reqData) {
    lineId = reqData.cityLine.id;
    //座位数 实名制isCardNo 0-否 1-是
    if(reqData.isCardNo != undefined && reqData.isCardNo ==1){
        // 实名制
        $('#amount').data('type',1);
    } else{
        // 非实名制
        $('#amount').data('type',0);
    }

    //最大座位数 - 先写死为6个
    var maxSeatNo = 6;
    //最大座位数 取后台包车的最大座位数-后续优化该功能
    /*var maxSeatNo = (reqData.cityLine.comfortableSeat == undefined)? 0 : reqData.cityLine.comfortableSeat;
    if(maxSeatNo < reqData.cityLine.luxuriousSeat){
        maxSeatNo = reqData.cityLine.luxuriousSeat;
    }
    if(maxSeatNo < reqData.cityLine.businessSeat){
        maxSeatNo = reqData.cityLine.businessSeat;
    }*/
    $('#amount').data('max',maxSeatNo);
    $('.select-person-container .title-box .total').data('value',maxSeatNo);
    $('.select-person-container .title-box .total').html(maxSeatNo);

    //自动显示选择人数弹窗
    if($('#amount').val() == 0){
        showSelectPicker();
    }

    //出发时间 默认60分
    $('.startTime').data('intervalminute',(reqData.bookTime==undefined || reqData.bookTime=='' ? 60 : reqData.bookTime));
    $('.startTime').data('filter',(reqData.timeArea==undefined || reqData.timeArea=='' ? '' : reqData.timeArea));
}

//显示车型
function showVehicleSwitchBox(reqData) {
// 选择车型模块
    var personAmount = $('#amount').val();// 选择的人数
    //舒适型
    if(null==reqData.comfortable || reqData.cityLine.comfortableSeat==0 || personAmount > reqData.cityLine.comfortableSeat || reqData.comfortable.price==0){
        reqData.comfortable = null//对象置空 则不显示
    }
    // 豪华型
    if(null==reqData.luxurious || reqData.cityLine.luxuriousSeat==0 || personAmount > reqData.cityLine.luxuriousSeat || reqData.luxurious.price==0){
        reqData.luxurious = null;
    }
    // 商务型
    if(null==reqData.business || reqData.cityLine.businessSeat == 0 || personAmount > reqData.cityLine.businessSeat || reqData.business.price==0){
        reqData.business = null;
    }

    //动态生成车型模块
    var _switchBoxHtml = createVehicleBox(reqData);

    _switchBoxHtml += '';
    $('.confirm-container .vehicle-switch-box').html(_switchBoxHtml);
    $('.confirm-container .vehicle-switch-box').data('stage',0);//默认选中拼车
    $('.confirm-container .vehicle-switch-box').show();

    var vehicleScroll ;
    setTimeout(function () {
        vehicleScroll = new IScroll('#wrapper',{
            scrollX: true,
            scrollY: false,
            mouseWheel: true
        });
        if($('.vehicle-switch-box .vehicle-item').length > 3){
            var width = $('.vehicle-switch-box .vehicle-item').width() / 2;
            // vehicleScroll.scrollTo(-width, 0);
        }
    },300);

    // 车型选择
    $('.vehicle-item .vehicle-info').on(click_tap,function () {
        $('.notes').blur();
        $(this).parent().addClass('active').siblings().removeClass('active');
        $(this).parents('.vehicle-switch-box').data('stage',$(this).parent().data('stage'));
        vehicleScroll.scrollToElement($(this).parent()[0], 500, false, false, IScroll.utils.ease.circular);
    });

    // 查看费用明细
    $('.vehicle-item .price-box').on(click_tap,function () {
        $('.notes').blur();
        var parent = $(this).parent();
        var stageName = switchStage($(parent).data('stage'),'');
        var oldPrice = $(parent).data('oldprice');
        var discount = $(parent).data('discount');
        var type = $(parent).data('type');//优惠类型 0-无优惠 1-特价(对应该有特价类型) 2-优惠券
        var promoteType = $(parent).data('promotetype');//特价类型 0-固定金额（减），1-折扣，2-加价，
        var specialPrice = $(parent).data('specialprice');//特价优惠的价格
        var couponPrice = $(parent).data('couponprice');//优惠券抵扣的价格
        var payPrice = $(parent).data('payprice');//实际支付的价格

        //优惠项
        var _couponItem = '';
        if(type==1){
            //特价
            if(promoteType == 2){
                _couponItem += '<div class="coupon-item"><div class="name">特价</div><div class="number">+'+ specialPrice +'元</div></div>' ;
            }else if(promoteType == 1 || promoteType == 0){
                _couponItem += '<div class="coupon-item"><div class="name">活动优惠</div><div class="number">-'+ specialPrice +'元</div></div>' ;
            }
        }else if(type==2){
            //优惠券
            _couponItem = '<div class="coupon-item"><div class="name">优惠券</div><div class="number">-'+ couponPrice +'元</div></div>' ;
        }else if(type==3){
            //特价
            if(promoteType == 2){
                _couponItem += '<div class="coupon-item"><div class="name">特价</div><div class="number">+'+ specialPrice +'元</div></div>' ;
            }else if(promoteType == 1 || promoteType == 0){
                _couponItem += '<div class="coupon-item"><div class="name">活动优惠</div><div class="number">-'+ specialPrice +'元</div></div>' ;
            }
            //优惠券
            _couponItem += '<div class="coupon-item"><div class="name">优惠券</div><div class="number">-'+ couponPrice +'元</div></div>' ;
        }
        //所有的优惠项 如果没有优惠项则不显示
        var _couponBoxHtml = '';
        if(_couponItem){
            _couponBoxHtml = '<div class="coupon-box">' + _couponItem + '</div>';
        }


        var _detailHtml = '';
        _detailHtml += '<div class="detail-box">' +
            '<div class="detail-item"><div class="name">'+stageName+'一口价</div><div class="number">'+formatMoney(discount+payPrice,2)+'元</div></div>' +
            '<div class="detail-item"><div class="name">人数</div><div class="number">'+$('#amount').val()+'人</div></div>' +
            '</div>' + _couponBoxHtml;

        // 生成费用明细
        $('.price-detail-container .price-detail-main').html(_detailHtml);
        $('.price-detail-container .pay-price').html(payPrice + '<span>元</span>');
        $('.price-detail-container').popup('push')
    });
}

//显示阶梯价格
function showLadderPrice(reqData) {
    var laddFlag = reqData.cityLine.poolingMode;//价格模式 	0 固定 1 阶梯
    var carPool = reqData.carPool;

    //拼车
    var _itemHtml = '';
    if(laddFlag == 1){
        //拼车阶梯价格
        $.each(carPool.laddPrice,function (index,item) {
            _itemHtml += '<li class="stage-item">' +
                '<div class="unit-box"><div class="unit">每人</div><div class="price">'+ item.price +'元</div></div>' +
                '<div class="total">'+ item.personNum +'人同行</div>' +
                '</li>';
        })
    }else{
        //固定价格
        _itemHtml += '<li class="stage-item">' +
            '<div class="unit-box"><div class="unit">每人</div><div class="price">'+ carPool.price +'元</div></div>' +
            '</li>';
    }

    //舒适型
    var _comfortablePriceHtml = ''
    if(reqData.cityLine.comfortablePrice){
        _comfortablePriceHtml = '<li class="stage-type"><div class="stage-name">舒适型</div><ul>' +
            '<li class="stage-item">' +
            '<div class="unit-box"><div class="unit">每程</div><div class="price">'+ reqData.cityLine.comfortablePrice +'元</div></div>' +
            '</li>' +
            '</ul></li>'
    }

    //  豪华型
    var _luxuriousPriceHtml = ''
    if(reqData.cityLine.luxuriousPrice){
        _luxuriousPriceHtml = '<li class="stage-type"><div class="stage-name">豪华型</div><ul>' +
            '<li class="stage-item">' +
            '<div class="unit-box"><div class="unit">每程</div><div class="price">'+ reqData.cityLine.luxuriousPrice +'元</div></div>' +
            '</li>' +
            '</ul></li>'
    }

    //  商务型
    var _businessPriceHtml = '';
    if(reqData.cityLine.businessPrice){
        _businessPriceHtml = '<li class="stage-type"><div class="stage-name">商务型</div><ul>' +
            '<li class="stage-item">' +
            '<div class="unit-box"><div class="unit">每程</div><div class="price">'+ reqData.cityLine.businessPrice +'元</div></div>' +
            '</li>' +
            '</ul></li>'
    }

    var _allHtml = '<ul>' +
        '<li class="stage-type"><div class="stage-name">拼车</div><ul>' +
        _itemHtml +
        '</ul></li>' + _comfortablePriceHtml + _luxuriousPriceHtml + _businessPriceHtml +
        '</ul>';
    $('.market-rule-container .market-content').html(_allHtml);
}

/**
 * 添加乘乘车人请求
 */
function  addPassengerRequest(){
    var name = $('#passengerName').val();
    // var phone = $('#addPassengerPhone').val();
    var code = $('#passengerCode').val();

    if(name==""){
        $.toast("姓名不能为空");
        return;
    }
    if(!/^[\u4E00-\u9FA5]{0,10}$/.test(name)){
        $.toast('请输入10位以内中文姓名');
        return;
    }
    /*if(phone==""){
        $.toast("手机号不能为空");
        return;
    }
    if(!checkTel(phone)){
        $.toast("手机号格式错误");
        return;
    }*/
    if($('#amount').data('type') === "1" ){
        if(code==""){
            $.toast("身份证号不能为空");
            return;
        }
        if (code&& !new clsIDCard(code).Valid )
        {
            $.toast('请填写正确的身份证');
            return;
        }
    }

    $.showLoading();
    // $.post("/bus/passengerContactInfo/addContact",{passengerName:name,mobile:phone,idCardNo:code,token:$.cookie("token")},function(result){
    $.post("/bus/passengerContactInfo/addContact",{passengerName:name,idCardNo:code,token:$.cookie("token")},function(result){
        $.hideLoading();
        if(result.code == 0){
            var maxNo = $('.select-person-container .title-box .total').data('value');//最大座位数
            var selected = $('.select-person-container .title-box .selected').data('value');//已选中人数

            //数据回显到选择乘车人页面
            var person = result.data;
            if(selected >= maxNo){
                person.selectedFlag = false;
            }else{
                person.selectedFlag = true;
                //选择人数变化
                var selected = $('.select-person-container .title-box .selected').data('value');
                selected++;
                $('.select-person-container .title-box .selected').data('value',selected);
                $('.select-person-container .title-box .selected').html(selected);
            }

            personList.push(person);
            createPersonContent(personList);
        }else{
            $.alert(result.message);
            return;
        }
    },'json');
}

/**
 * 查询乘车人列表请求
 */
function queryPassengerRequest(){
    var token=$.cookie('token');
    $.post("/bus/passengerContactInfo/passengerList",{token:$.cookie("token")},function(result){
        if(null!=result){
            if(result.code == 0){
                personList = [];
                $.each(result.data,function (index,person) {
                    var tempPerson = person;
                    tempPerson.selectedFlag = false;
                    personList.push(tempPerson);
                });
                createPersonContent(personList);
            }
        }
    },'json');
}

/**
 * 提交编辑/添加的乘车人信息
 * @param editType 1-新增,2-编辑，
 */
function confirmEditPerson(editType,selectedFlag) {
    //  数据提交到后台 后台返回提交数据的后台id号
    if(editType == '1'){
        addPassengerRequest();
    }else if(editType == '2'){
        editPassenger(selectedFlag)
    }
}

//编辑乘车人
function editPassenger(selectedFlag){
    var urlStr = '/bus/passengerContactInfo/update';
    var _editName = $('#passengerName').val(),
        _currentEditPassengerId = $('#passengerName').data('id'),
        // _phoneName = $('#editPassengerPhone').val(),
        _codeName = $('#passengerCode').val();

    if(_editName==""){
        $.toast("姓名不能为空");
        return;
    }
    if(!/^[\u4E00-\u9FA5]{0,10}$/.test(_editName)){
        $.toast('请输入10位以内中文姓名');
        return;
    }

    /*if(_phoneName==""){
        $.toast("手机号不能为空");
        return;
    }
    if(!checkTel(_phoneName)){
        $.toast("请填写正确的手机号");
        return;
    }*/

    if($('#amount').data('type') === "1"){
        if(_codeName==""){
            $.toast("身份证不能为空");
            return;
        }
        var flag = new clsIDCard(_codeName);
        if(!flag.Valid){
            $.toast('请填写正确的身份证');
            return false;
        }
    }

    var dataObj = {
        id: _currentEditPassengerId,
        passengerName: _editName,
        // mobile: _phoneName,
        idCardNo: _codeName,
        token:$.cookie('token')
    };
    $.ajaxService({
        type: 'POST',
        url:urlStr,
        data:dataObj,
        dataType:  "json",
        success: function(result){
            if(result&&result.code==0){
                // 数据回显到选择乘车人页面
                var editPerson = result.data;
                $.each(personList,function (index,person) {
                    if(_currentEditPassengerId == person.id){
                        if(selectedFlag){
                            editPerson.selectedFlag = true;
                            personList[index] = editPerson;
                        }else{
                            //选中之前编辑 选择人数变化
                            editPerson.selectedFlag = true;//默认选中
                            personList[index] = editPerson;
                        }
                        return false;
                    }
                });
                createPersonContent(personList);
            }else{
                $.alert((result&&result.message) || "未知错误");
            }
        }
    });
}

//动态生成 编辑/添加 实名制乘车人信息
function showEditPersonContainer(name,idno,id,selectedFlag) {
    var _editPersonContainer = '';
    var _titleHtml = '';
    var editType = 0;//编辑类型 1-新增,2-编辑
    if(name == undefined){
        name = '';
    }
    if(idno == undefined){
        idno = '';
    }
    if( name==''&&  idno==''){
        //添加乘车人
        _titleHtml ='<div class="title">添加乘车人</div>';
        editType = 1;
    }else{
        // 编辑乘车人
        _titleHtml ='<div class="title">编辑乘车人</div>';
        editType = 2;
    }
    _editPersonContainer +=
        '<div class="popup-main">' +
        '<div class="title-content">' +
        '<div class="close-edit">取消</div>'+ _titleHtml +'<div class="confirm-btn">确定</div>' +
        '</div>' +
        '<div class="edit-box">' +
        '<div class="edit-item">' +
        '<div class="name">姓名</div><input id="passengerName" class="value" value="' + name + '" placeholder="请输入乘车人姓名" data-id="'+id +'"/>' +
        '</div>' +
        '<div class="edit-item">' +
        '<div class="name">身份证</div><input id="passengerCode" class="value" value="' + idno + '" placeholder="请输入乘车人证件号码"/>' +
        '</div>' +
        '</div>' +
        '</div>';

    $('.edit-person-container').html(_editPersonContainer).show();

    //取消 添加/编辑 乘车人
    $('.edit-person-container .close-edit').on(click_tap,function () {
        $('.select-person-container').show();
        $('.edit-person-container').hide();
    });
    //确定 添加/编辑 乘车人
    $('.edit-person-container .confirm-btn').on(click_tap,function () {
        // 数据提交
        var name = $.trim($('#passengerName').val());
        var IDNo = $.trim($('#passengerCode').val());
        if(name == ''){
            $.toast('请输入乘车人姓名');
        }else if(IDNo == ''){
            $.toast('请输入乘车人证件号码');
        }else if(!(new clsIDCard(IDNo).Valid)){
            $.toast('请输入正确的乘车人证件号码');
        }else if(name !='' && IDNo!='' && (new clsIDCard(IDNo).Valid)){
            confirmEditPerson(editType,selectedFlag);
            $('.select-person-container').show();
            $('.edit-person-container').hide();
        }
    });
}

//动态生成实名制乘车人信息
function createPersonContent(personList) {
    var _personContentHtml = '';
    var personContent = $('.select-person-container .person-content');
    var selectedNo = 0;//选中的人数
    $.each(personList,function (index,person) {
        var activeName = '';
        var idCardType = '身份证：';
        var selectedFlag = false;
        if(person.selectedFlag){
            activeName = ' active'
            selectedFlag = true;
            selectedNo++;
        }
        if(person.idCardType == '1'){
            idCardType = '身份证：'
        }
        if(person.showIdCardNo==undefined){
            person.showIdCardNo = '';
        }
        if(person.idCardNo == undefined){
            person.idCardNo = '';
        }

        _personContentHtml += '<div class="person-item" data-id="' + person.id + '" data-name="' + person.passengerName + '" ' +
            'data-idcardno="' + person.idCardNo + '" data-idcardtype="'+ person.idCardType+'" data-showidcardno="'+person.showIdCardNo+'" ' +
            'data-selected="'+selectedFlag+'">' +
            '<div class="selection'+ activeName +'">' +
            '<i></i>' +
            '<div class="person-box">' +
            '<div class="name">' + person.passengerName + '</div>' +
            '<div class="ID-No">' + idCardType + person.idCardNo + '</div>' +
            '</div>' +
            '</div>' +
            '<div class="edit-btn"></div>' +
            '</div>';
    });
    $(personContent).html(_personContentHtml);
    $('.select-person-main .title .selected').data('value',selectedNo);//选中的人数
    $('.select-person-main .title .selected').html(selectedNo);

    $('.selection').on(click_tap,function () {
        var idNo = $(this).parent().data('showidcardno');
        if(idNo){
            var classNames = $(this).attr('class');
            var selected = $('.select-person-main .title .selected').data('value');//选中的人数
            var maxNum = $('.select-person-main .title .total').data('value');//最大座位数
            if( classNames.indexOf('active') == -1){
                //选中乘车人
                if(selected < maxNum){
                    //选中乘车人
                    $(this).addClass('active');
                    $(this).parent().data('selected',true);//选中标记
                    selected++;
                }else {
                    $.toast('最多'+maxNum+'位哦~')
                }
            }else{
                $(this).removeClass('active');
                $(this).parent().data('selected',false);
                selected--;
            }
            $('.select-person-main .title .selected').html(selected);
            $('.select-person-main .title .selected').data('value',selected);

            //总人数中修改选中标记
            var id = $(this).parent().data('id');
            $.each(personList,function (index,person) {
                if(id == person.id){
                    person.selectedFlag = !person.selectedFlag;
                    return;
                }
            })
        }else{
            $.toast('请添加该乘车人证件号码');
        }
    });

    // 编辑实名制乘车人
    $('.person-item .edit-btn').on(click_tap,function () {
        $('.select-person-container').hide();

        //动态生成编辑弹窗数据
        var _parent = $(this).parent();
        var name = $(_parent).data('name');
        var idNo = $(_parent).data('showidcardno');
        var id = $(_parent).data('id');
        var selectedFlag = $(_parent).data('selected');
        showEditPersonContainer(name,idNo,id,selectedFlag);
    });
}


function createVehicleBox(reqData){
    var _switchBoxHtml = '<ul>';

    /* 参数对象 跟接口一至 新增stage 为车型 0-拼车 1-舒适 2-豪华 3-商务；seat：座位数
    * payPrice-最终支付价格 price-原价 specicalPrice-特价 couponPrice-优惠券面值 discount-总折扣金额
    * promoteType=0,1,2 都是特价优惠 0-固定金额，1-折扣 ，2-加价，
    * 特价判断： specialPrice不为0 ；优惠券判断：couponPrice不为0
    * */
    var itemData = {};

    //拼车 没有座位数
    if(reqData.carPool != null){
        itemData = reqData.carPool;
        itemData.stage = 0;
        _switchBoxHtml += createVehicleItem(itemData);
    }
    //舒适型
    if(reqData.comfortable != null){
        itemData = reqData.comfortable;
        itemData.stage = 1;
        itemData.seat = reqData.cityLine.comfortableSeat;
        _switchBoxHtml += createVehicleItem(itemData);
    }
    //豪华型
    if(reqData.luxurious != null){
        itemData = reqData.luxurious;
        itemData.stage = 2;
        itemData.seat = reqData.cityLine.luxuriousSeat;
        _switchBoxHtml += createVehicleItem(itemData);
    }
    // 商务型
    if(reqData.business != null){
        itemData = reqData.business;
        itemData.stage = 3;
        itemData.seat = reqData.cityLine.businessSeat;
        _switchBoxHtml += createVehicleItem(itemData);

    }

    _switchBoxHtml +='</ul>';
    return _switchBoxHtml;
}

function createVehicleItem(itemData) {
    var _vehicleItemHtml = '';
    var className = '';
    var itemActive = '';
    //车型
    var stage = undefined==itemData.stage?0:itemData.stage;
    //车型座位数
    var stageSeat = undefined==itemData.seat?0:itemData.seat;
    //车型名
    var stageName = switchStage(stage,stageSeat);
    var type = 0;//优惠类型 0-无优惠 1-特价(对应该有特价类型) 2-优惠券
    var promoteType = -1;//特价对应的特价类型
    //第一行显示价格为实际支付价格
    var payPrice = itemData.payPrice;
    if(payPrice==undefined || null==payPrice || payPrice==''){
        payPrice = 0;
    }
    //第二行显示价格为：特价情况下显示原价；有优惠券情况下显示优惠券抵扣价；无优惠券无特价时不显示；有特价有优惠券时显示总共优惠的价格
    var price = 0;
    var specialPrice = 0;//特价跟原价的差价
    var oldPrice = itemData.payPrice;//原价：特价情况下取原价，否则取一口价
    var couponPrice = itemData.couponPrice;//券优惠面额
    var discount = itemData.discount;
    var orderPrice= itemData.price;
    if(itemData.specialPrice > 0 && itemData.couponPrice > 0){
        //优惠券和特价同时享有 第二行显示为优惠总价格
        type = 3;
        price = itemData.discount;
        specialPrice = itemData.specialPrice;
        promoteType = itemData.promoteType;
    }else if(itemData.specialPrice > 0){
        //特价 取原价
        price = itemData.oldPrice;
        oldPrice = itemData.oldPrice;
        specialPrice = itemData.specialPrice;
        type = 1;
        promoteType = itemData.promoteType;
    }else if(itemData.couponPrice > 0){
        //券已抵扣 券面价
        price = itemData.couponPrice;
        type = 2;
    }

    if(stage == 0 ){
        className = ' stage-one';
        itemActive = 'active'
    }else if(stage == 1 ){
        className = ' stage-two';
    }else if(stage == 2 ){
        className = ' stage-three';
    }else if(stage == 3 ){
        className = ' stage-four';
    }

    var _payPriceHtml = '';//支付价格
    var _couponHtml = '';//优惠价格
    if(type == 1){
        //    特价
        _payPriceHtml = '<div class="price"><span>特价 ' + payPrice + '</span>元<i></i></div>';
        if(price > 0){
            _couponHtml = '<div class="coupon line-through">一口价' + price + '元</div>';
        }
    }else if(type == 2){
        //    券抵扣
        _payPriceHtml = '<div class="price">一口价<span>' + payPrice + '</span>元<i></i></div>';
        if(price > 0){
            _couponHtml = '<div class="coupon">券已抵' + couponPrice + '元</div>';
        }
    }else if(type == 3){
        _payPriceHtml = '<div class="price">一口价<span>' + payPrice + '</span>元<i></i></div>';
        if(discount > 0){
            _couponHtml = '<div class="coupon">已优惠' + discount + '元</div>';
        }
    }
    else{
        _payPriceHtml = '<div class="price">一口价<span>' + payPrice + '</span>元<i></i></div>';
    }

    //item需要存储的信息-显示费用详情用： 车型 支付价格 优惠类型（特价时需要特价的差价 特价类型）（优惠券时需要优惠券优惠的价格） 原价（貌似只有特价才有原价）
    _vehicleItemHtml +='<li class="vehicle-item ' + itemActive + '" data-stage="'+stage+'" data-payprice="'+payPrice+'"' +
        ' data-type="'+ type +'" data-promotetype="'+ promoteType +'" data-specialprice="'+specialPrice+'"' +
        ' data-couponprice="'+ itemData.couponPrice +'" data-oldprice="'+ oldPrice +'" data-discount="'+discount+'">' +
        '<div class="vehicle-info">' +
        '<div class="name">' + stageName + '</div>' +
        '<div class="stage-icon'+ className +'"><i></i></div>' +
        '</div>' +
        '<div class="price-box">' +
        _payPriceHtml + _couponHtml +
        '</div>' +
        '</li>';

    return _vehicleItemHtml;
}

function switchStage(stage,stageSeat) {
    var stageName = '';
    if(stageSeat){
        stageSeat = '('+ stageSeat +'座)'
    }else{
        stageSeat = '';
    }
    switch(stage){
        case 1: stageName='舒适型'+ stageSeat;break;
        case 2: stageName='豪华型'+ stageSeat;break;
        case 3: stageName='商务型'+ stageSeat ;break;
        default : stageName='拼车';break;
    }
    return stageName;
}

//选择乘车人 非实名制人数/实名制乘车人
function showSelectPicker(){
    var type = $('#amount').data('type');// 0-非实名制 1-实名制
    var max = $('#amount').data('max');// 非实名制最大座位数
    if(type == 1){
        // 实名制
        showSelectPerson();
    }else{
        // 非实名制选择人数
        var maxData = [];
        for(var i=1; i<max+1; i++){
            var temp = {
                'value':i,
                'text':i
            };
            maxData.push(temp);
        };
        if(maxData.length == 0){
            maxData.push({'value':0,'text':0})
        }

        $.selectPicker({
            title:'选择出行人数',
            data:maxData,
            current: $('#present_peopleNumber').data('value'),
            onChange: function(v, t) {
                var people = $('#amount');
                if(people.val() != v) {
                    people.data('value', v).val(v).trigger('change');

                    //自动弹出选择时间弹窗
                    var date = $('.startTime').data('date');
                    var time = $('.startTime').data('time');
                    if(date=='' && time==''){
                        initCityTimePicker($('.startTime'),showSharingCarPrice);
                    }else {
                        // 调用计算价格接口
                        getLinePriceInfoService();
                    }
                }
            }
        });
    }
}

// 调用计算价格接口
function getLinePriceInfoService() {
    var url = SERVER_URL_PREFIX+'/hail/innerCity/optimize/getLinePriceInfo';
    var number = $('#amount').val();
    var dataObj = {};
    if(number){
        dataObj = {
            token:$.cookie('token'),
            number:$('#amount').val(),
            departDate:$('#present_startTime').data('date'),
            lineId: lineId
        };
        dataObj = genReqData(url, dataObj);
        $.showLoading();
        $.ajaxService({
            url:url,
            data:dataObj,
            type: 'POST',
            dataType: 'JSON',
            success:function (result) {
                result = $.parseJSON(result);
                $.hideLoading();
                if(result.code==0){
                    if(null==result.data || undefined==result.data){
                        $.alert(result.message);
                    }else {
                        var reqData = result.data;
                        showSeatNo(reqData);
                        showVehicleSwitchBox(reqData);
                    }
                }else{
                    $.alert(result.message);
                }
            }
        })
    }else{
        $.toast('请选择人数');
    }

}

// 动态生成实名制乘车人信息
function showSelectPerson() {
    $('.select-person-container').show();
}

// 计算字符长度 汉子2字符 数字英文为1字符
function textLength(res) {
    var len = 0;
    var str = $(res).val();
    for (var i=0; i<str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
            len++;
        }
        else {
            len+=2;
        }
    }
    return len;
}

/**********自动定位************************/
//定位是否成功
var isLocation = false;
var currentLocation = [] //当前定位
//根据gps获取地理位置
var getGpsCallback=function getAddressByGps(callbackData){
    if(callbackData['flag'] == false){
        isLocation = false;
        $.toast('当前区域定位失败');
        // currentLocation = [callbackData['longitude'],callbackData['latitude']];
    }else{
        isLocation = true;
        currentLocation = [callbackData['longitude'],callbackData['latitude']];
        $('#startAddr').data('localLat',callbackData['latitude']);
        $('#startAddr').data('localLng',callbackData['longitude']);
        //定位
        if(currentLocation.length > 0){
            map.panTo(currentLocation);
            m_location.setPosition(currentLocation);
        }
    }
}

/**匹配线路*/
function matchLine(){
	var departLng = $("#startAddr").data('departLng');
    var departLat = $("#startAddr").data('departLat');
    var departAddress = $("#startAddr").data('departAddress');
    var departAreaCode = $("#startAddr").data('departAreaCode');

    var arriveLng = $("#endAddr").data('arriveLng');
    var arriveLat = $("#endAddr").data('arriveLat');
    var arriveAddress = $("#endAddr").data('arriveAddress');
    var arriveAreaCode = $("#endAddr").data('arriveAreaCode');
    
    var judgeServiceParam = {
            departLat:departLat,
            departLng:departLng,
            departAreaCode:departAreaCode,
            departTitle:departAddress,
            requestUrl:window.location.href,
            token:$.cookie("token"),
            arriveLat:arriveLat,
            arriveLng:arriveLng,
            arriveAreaCode:arriveAreaCode,
            arriveTitle:arriveAddress,
            number:1,//默认值
            departDate: today,//默认当天
        };
    judgeService(judgeServiceParam);
}

/**********************选择地址**********************************/

$('#present .select-city-btn').off(click_tap).on(click_tap, function() {
    var _this = $(this);
    searchAddressPopup(_this);
}).backtrack({
    cancel: '#search-address .cancel',
    event: 'click'
});

// 交换 出发地 / 目的地
$('.switch-btn').off(click_tap).on(click_tap, function() {
    $.showLoading()
    var start = $(this).prev().find('.start input');
    var end = $(this).prev().find('.end input');
    var tmp = start.val();
    start.val(end.val());
    end.val(tmp);
    var departLng = start.data('departLng');
    var departLat = start.data('departLat');
    var departAddress = start.data('departAddress');
    var departAreaCode = start.data('departAreaCode');
    var departRegionName = start.data('departRegionName');

    var arriveLng = end.data('arriveLng');
    var arriveLat = end.data('arriveLat');
    var arriveAddress = end.data('arriveAddress');
    var arriveAreaCode = end.data('arriveAreaCode');
    var arriveRegionName = end.data('arriveRegionName');

    start.data('departLng',arriveLng);
    start.data('departLat',arriveLat);
    start.data('departAddress',arriveAddress);
    start.data('departAreaCode',arriveAreaCode);
    start.data('departRegionName',arriveRegionName);

    end.data('arriveLng',departLng);
    end.data('arriveLat',departLat);
    end.data('arriveAddress',departAddress);
    end.data('arriveAreaCode',departAreaCode);
    end.data('arriveRegionName',departRegionName);
    var localLat = $('#startAddr').data('localLat');
    var localLng = $('#startAddr').data('localLng');
    //  更改session数据 重新请求页面数据
    var data = {
        departAreaCode:arriveAreaCode,
        departTitle:arriveAddress,
        departLat:arriveLat,
        departLng:arriveLng,
        departRegionName:arriveRegionName,
        arriveAreaCode:departAreaCode,
        arriveTitle:departAddress,
        arriveLat:departLat,
        arriveLng:departLng,
        arriveRegionName:departRegionName,
        localLat:localLat,
        localLng:localLng
    }
    window.sessionStorage.setItem('callCarInfo',JSON.stringify(data));
    clearStartTime();
    initPage();
    $.hideLoading()
});

/***********************弹出页面操作*********************************/

$('#sarchCancelbtn').off(click_tap).on(click_tap, function() {
    hideSearchAddressResult();
});

//显示车型
function showSharingCarPrice(data) {
    // 自动弹出车型选择
    getLinePriceInfoService();
}

var winHeight = $(window).height();   //获取当前页面高度
$(window).resize(function(){
    var thisHeight = $(this).height();
    if(winHeight - thisHeight > 50){
        //当软键盘弹出，在这里面操作
        $('.confirm-container').hide();
    }else{
        //当软键盘收起，在此处操作
        $('.confirm-container').show();
    }
});