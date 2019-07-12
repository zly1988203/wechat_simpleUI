var _map, _isInitsa = false, _myIScrollsa, _mapScroll, marker;
var targetType = isAndroid() ? 'tap' : 'click';
// 打开选择城市
var _isInitsc = false, _myIScrollsc;
//加载地图
var loadMaps = function(lng, lat) {
    if(_map) return;
    _mapScroll = new IScroll('#mapWrapper');
    _map = new AMap.Map('mapContainer', {
        resizeEnable: true,
        zoom:15,
        center: [lng, lat]
    });

    //添加标注
    marker = new AMap.Marker({
        icon: new AMap.Icon({
            size: new AMap.Size(25, 36),
            imageSize: new AMap.Size(25, 36),
            image: '/res/images/rent/icon_marker.png'
        }),
        position: _map.getCenter()
    });
    marker.setMap(_map);

    //移动地图，标注固定在中心点
    _map.on('mapmove', function() {
        marker.setPosition(_map.getCenter());
    });

    //回到原点
    $('#currLocation').on('click', function() {
        if(currentLocation.length > 0){
            _map.panTo(currentLocation);
        }
    })

    //移动结束
    searchMaps();
    _map.on('moveend', function() {
        searchMaps();
    });
}

//gps定位
$.cookie("providerId",$('#providerId').val(),{expires: 30, path: '/' });
$.cookie("operatorId",$('#baseUserId').val(),{expires: 30, path: '/' });
//
var lineParam={};//保存起止点的经纬度信息
var geocoder;//地图对象
//根据gps获取地理位置
var currentLocation = [];
var getGpsCallback=function getAddressByGps(callbackData){
    //在这里验证当前位置是否开通
    var lng = callbackData['longitude'];
    var lat = callbackData['latitude'];
    currentLocation = [lng,lat];
    checkCityIsOpen(lng,lat,1)
}
var carNumbers = $('#baseCarNumbers').val();
// 验证城市是否开通网约车(type ==1 初始化当前位置验证 type == 3 选择出发地验证)
var checkCityIsOpen = function(lng,lat,type){
    var params = {
        lng : lng,
        lat : lat,
        token : $.cookie('token')
    }
    var url = '/baseOnlineCar/checkCityIsOpen';
    $.post(url,params,function(data){
        if(!data){
            //能获取到当前城市的经纬度,但当前城市未开通网约车业务
            var html = '当前城市未开通';
            if(type == 3){
                $.toast("当前城市暂未开通业务,请重新选择出发地");
                $('#startAddr').val("");
                $('#startAddr').attr('placeholder','请您选择上车地点');
            }
            $('.car-number-content').html(html);
            $('#present .billing .billing-charge').hide()
            return false;
        }
        var returnCode = data.code;
        var resultData = data.data;
        if(returnCode == 0){
            //当前城市有开通
            var html = '附近有<span>' + carNumbers + '</span>辆车，可以马上接驾';
            $('.car-number-content').html(html);
            if( type == 1 || type == 3){
                var gpsData = lng + "," + lat;
                $('#cityId').val(resultData.cityId);
                var gpsParam = [lng,lat];
                searchAddressByGps(gpsData,searchMapAddCallback);
                //解析当前定位获取城市名和城市编码
                analyse(gpsParam);
                lineParam['departLng'] = lng;//经度
                lineParam['departLat'] = lat;//纬度
            }
        }else if(returnCode == 10003){
            //参数错误(表示经纬度为空)
            var html = '为您提供正规网约车服务，出行更安全';
            $('.car-number-content').html(html);
            $('#present .billing .billing-charge').hide()
        }else{
            //能获取到当前城市的经纬度,但当前城市未开通网约车业务
            var html = '当前城市未开通';
            if(type == 3){
                $.toast("当前城市暂未开通业务,请重新选择出发地");
                $('#startAddr').val("");
                $('#startAddr').attr('placeholder','请您选择上车地点');
            }
            $('.car-number-content').html(html);
            $('#present .billing .billing-charge').hide()
        }
    },'json');
}

//后台搜索高德地址后回调
var searchMapAddCallback=function searchAddressCallback(data){
    if(!$('#startAddr').val()){
        $('#startAddr').val(data.address);
    }
    lineParam['departAddress'] = data.address;
    $('#currentAddressDetail').html(data.address);
    $('#currentAddressDetail').attr('data-lng',lineParam['departLng']);
    $('#currentAddressDetail').attr('data-lat',lineParam['departLat']);
    $('#currentAddress').show();
    showBillingLoading();
}

//加载地理位置
function analyse(lnglatXY){
    geocoder.getAddress(lnglatXY,function(status,result){
        if(status=='complete'){
            var cityName=result.regeocode.addressComponent.city;//
            var cityCode = result.regeocode.addressComponent.citycode;
            if(cityName==null||cityName==""){
                cityName=result.regeocode.addressComponent.province;
                if(cityName.indexOf("省")>= 0){
                    cityName=result.regeocode.addressComponent.district;
                }
            }
            $('#setCityButton').html(cityName);
            $('.current-city').html('当前定位城市：'+cityName);
            $("#areaCode").val(cityCode);
        }
    })
}

// 存储搜索结果历史记录
var _searchAddressHistory = {
    name: '_searchOnlineCarAddressDataKey',  // 本地存储的key
    maxLength: 20,  // 最大存储数量
    storage: window.localStorage || null,
    get: function() {
        if(!this.storage) return false;
        var data = this.storage.getItem(this.name) || '[]';
        return JSON.parse(data);
    },
    set: function(data) {
        if(!this.storage) return false;
        var list = this.get();
        if(list.length >= this.maxLength) {
            list.splice(0,1);
        }
        var flag = false;
        $.each(list, function(k, v) {
            if(v.name == data.name && v.address == data.address) {
                flag = true;
                return;
            }
        });
        if(!flag) list.push(data);
        this.storage.setItem(this.name, JSON.stringify(list));
        return true;
    },
    remove:function(){
        if(!this.storage) return false;
        this.storage.removeItem(this.name);
    }
};

/**
 * 获取并填充历史记录
 */
function showHistoryInfo(){
    var tmp = _searchAddressHistory.get();
    var list = [];
    var strHtml = '';
    for(var i = tmp.length-1; i>=0; i--) {
        list.push(tmp[i]);
    }
    if (list.length != 0) {
        for(var i=0;i<list.length;i++){
            var addressContent = list[i];
            strHtml += '<li data-name="' + addressContent.name + '" data-address="' + addressContent.address + '" data-lat="' + addressContent.lat + '" data-lng="' + addressContent.lng + '">'+
                '<div class="sui-cell-map">' +
                '<h1 data-lng="'+addressContent.lng+'" data-lat="'+addressContent.lat+'">'+addressContent.name+'</h1>' +
                '<h2>'+addressContent.address+'</h2>' +
                '</div>' +
                '</li>';
        }
        $('#searchWrapper ul').html('');
        $('#searchWrapper ul').html(strHtml);
        //添加点击事件
        searchClickEvent();
        // 这句不能少，否则超出屏幕不能滚动。
        if(_myIScrollsa) _myIScrollsa.refresh();
    }
}

//查询地图周边
var searchMaps = function() {
    AMap.service(["AMap.PlaceSearch"], function() {
        var placeSearch = new AMap.PlaceSearch({
            type:'汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施',
            pageSize: 10,
            pageIndex: 1,
            // city: $('#cityId').val(),
        });

        placeSearch.searchNearBy('', _map.getCenter(), 200, function(status, result) {
            if(status == 'error' || status == 'no_data') {
                $('#mapResult').html('');
                return;
            }
            var list = result.poiList.pois;
            var strHtml = '';
            for(var i = 0; i < list.length; i++) {
                strHtml += '<li data-name="' + list[i].name + '" data-address="' + list[i].address + '" data-lat="' + list[i].location.lat + '" data-lng="' + list[i].location.lng + '" '+ (i == 0 ? 'class="active"' : '') +'>' +
                    '<div class="sui-cell-map-result">' +
                    '<div class="left">' +
                    '<h1>' + list[i].name + '</h1>' +
                    '<p>' + list[i].address + '</p>' +
                    '</div>' +
                    '<div class="right">' +
                    '<button type="button">确定</button>' +
                    '</div>' +
                    '</div>' +
                    '</li>';
            }
            $('#mapResult').html(strHtml);
            _mapScroll.refresh();

            $('#mapResult li').off(targetType).on(targetType, function() {
                $('#mapResult li').removeClass('active');
                $(this).addClass('active');
                var lat = $(this).data('lat');
                var lng = $(this).data('lng');
                marker.setPosition([lng, lat]);
            });

            //点击确定返回
            $('#mapResult button').off('click').on('click', function() {
                var li = $(this).closest('li');
                $('#search-address').setPopupData({
                    lat: li.data('lat'),
                    lng: li.data('lng'),
                    name: li.data('name'),
                    address: li.data('address')
                });
                var data = {};
                data['name'] = li.data('name');
                data['address'] = li.data('address');
                data['lng'] = li.data('lng');
                data['lat'] = li.data('lat');
                _searchAddressHistory.set(data);
                $('#search-address .cancel').triggerHandler('click');
            });
        });
    });
}

//历史数据点击事件
function searchClickEvent(){
    var href_event = isAndroid()? "tap" : "click";
    $('#searchWrapper li').off(href_event).on(href_event, function() {
        if(!_map) {
            loadMaps($(this).data('lng'), $(this).data('lat'))
        }else{
            _map.panTo([$(this).data('lng'), $(this).data('lat')]);
        }
        hideSearchAddressResult();
    });
    $('#searchWrapper div').off('click').on('click', function() {
        if($(this).text() == '清空历史记录'){
            _searchAddressHistory.remove();
            $('#searchWrapper ul').html('');
        }
    });
}


// 显示搜索结果面板
var showSearchAddressResult = function(lng,lat) {
    $('#search-address .wrapper').css('height', $(window).height() - 44);
    $('#textSearchMap').val('');
    //$('#searchWrapper ul').html('');

    //TODO:加载历史记录
}

var cpLock = true;
$('#textSearchMap').focus(function() {
    showSearchAddressPanel();
}).off('input').on({
    //解决input事件在输入中文时多次触发事件问题
    compositionstart: function () {//中文输入开始
        cpLock = false;
    },
    compositionend: function () {//中文输入结束
        cpLock = true;
    },
    input: function () {//input框中的值发生变化
        setTimeout(function () {
           if(cpLock){
               //输入关键词搜索地图
               var text = $.trim($('#textSearchMap').val());
               AMap.service(["AMap.PlaceSearch"], function() {
                   var placeSearch = new AMap.PlaceSearch({
                       type: '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施',
                       pageSize: 10,
                       pageIndex: 1,
                       city: $('#cityId').val(),
                       citylimit:true,
                   });
                   placeSearch.search(text, function (status, result) {
                       var list = [];
                       if (text.length <= 0) {
                           status = 'no_data';
                           showHistoryInfo();
                           return false;

                       }
                       if (status == 'complete') {
                           list = result.poiList.pois;
                       }

                       var strHtml = '';
                       for (var i = 0; i < list.length; i++) {
                           var name = list[i].name.replace(text, '<span class="sui-orange">' + text + '</span>');
                           var address = list[i].address.replace(text, '<span class="sui-orange">' + text + '</span>');
                           strHtml += '<li data-name="' + list[i].name + '" data-address="' + list[i].address + '" data-lat="' + list[i].location.lat + '" data-lng="' + list[i].location.lng + '">' +
                               '<div class="sui-cell-map">' +
                               '<h1>' + name + '</h1>' +
                               '<h2>' + address + '</h2>' +
                               '</div>' +
                               '</li>';
                       }
                       $('#searchWrapper ul').html('');
                       $('#searchWrapper ul').html(strHtml);
                       $('#searchWrapper li').off(targetType).on(targetType, function () {
                           if (!_map) {
                               loadMaps($(this).data('lng'), $(this).data('lat'))
                           } else {
                               _map.panTo([$(this).data('lng'), $(this).data('lat')]);
                           }
                           hideSearchAddressResult();
                       });
                   });
               })
           }
        },0)
    }
})

//显示搜索结果面板
var showSearchAddressPanel = function() {
    $('#searchWrapper').show();
    $('.map-panel').hide();
    if(_isInitsa) return;
    _isInitsa = true;


    //自定义滚动条
    var stY = 0, etY = 0;
    $('#searchWrapper').on('touchstart', function() {
        etY = $(this).scrollTop();
        stY = event.touches[0].pageY;
    });
    $('#searchWrapper').on('touchmove', function(event) {
        var scrollY = stY - event.touches[0].pageY;
        $(this).scrollTop(scrollY + etY);
    });
}

//隐藏搜索结果面板
var hideSearchAddressResult = function() {
    $('#searchWrapper').hide();
    $('.map-panel').show();
    _mapScroll.refresh();
}
//初始化时间控件
$('.startWeekTime').on('click', function () {
    var _this = $(this)
    initWeekTime(_this,weekTimeCallback);
});

var weekTimeCallback = function (data) {
    showBillingLoading();
}

/*叫车*/
$('.search-btn').on('click',function () {
    //判断用户是否同意协议
    var isCheckAgreement = $('#agree_switcher').prop('checked');
    if(!isCheckAgreement){
        $.toast('请先阅读网约车用户协议');
        return false;
    }
    submitTrip();
});

//联系客服
// $('#contact').on('click', function() {
//     $('#sideMenu').closePopup(function() {
//         var urlDetail = SERVER_URL_PREFIX + '/Config/getBusinessTel';
//         var dataDetail = {
//         };
//         dataDetail = genReqData(urlDetail, dataDetail);
//         $.ajax({
//             type: 'POST',
//             url: urlDetail,
//             data: dataDetail,
//             dataType:  'json',
//             success: function(data){
//                 if(data && data.tel){
//                     window.location.href = 'tel:'+data.tel;
//                 }
//             }
//         });
//     });
// });

$('.bill-rules-btn').off('click').on('click',function(){
    var cityId = $('#cityId').val();
    var cityName = $('.set-city').html();
    var departTypeName = departType == 1 ? '即时用车' : '预约用车';
    $('#priceCity').html('');
    $('#departTypeName').html('');
    $('#priceCity').html(cityName + '-' + departTypeName);
    $('#departTypeName').html(departTypeName);
    $('.rules-table-container').empty();
    $('.rules-table-container').html('');
    $('#bill-rules-container').popup('modal');
    getPriceRule(cityId,departType)
});

//关闭计价规则
$('.bill-close-icon').on('click',function () {
    $.hideLoading();
    $('#bill-rules-container').closePopup();
});
$('.bill-close-btn').on('click',function () {
    $.hideLoading();
    $('#bill-rules-container').closePopup();
});



/* 用户协议选择动态交互效果*/
$('#agree_switcher_l').on('click',function(){
    var _this = this;
    var agreement_input = $('#agree_switcher');
    var _checked = $(agreement_input).prop('checked');
    $(agreement_input).prop('checked',!_checked);
    if($(agreement_input).prop('checked')){
        $(_this).removeClass('switcher_disagree');
        $(_this).addClass('switcher_agree');
        $('.agreement').addClass('agree-color');
        $('.agreement').removeClass('disagree-color');
    }else{
        $(_this).removeClass('switcher_agree');
        $(_this).addClass('switcher_disagree');
        $('.agreement').addClass('disagree-color');
        $('.agreement').removeClass('agree-color');
    }
});

/* 打开用户协议*/
$('#agreement_btn').click(function() {
    $('#agreement_container').popup('modal');
    $('#agreement_container .agreement-box').empty();
    $.showLoading();
    //模拟数据加载
    $.hideLoading();
    //重新加载数据
    getAgreement(0);//默认加载中交
});

/*选择用户协议*/
$('#agreement_container .sub-nav .nav-item').on('click',function(){
    var _self = this;
    var providerId = $(_self).data('providerid');
    $(_self).addClass('nav-active').siblings().removeClass('nav-active');
    $('#agreement_container .agreement-box').empty();
    $.showLoading();
    //模拟数据加载
    $.hideLoading();
    //重新加载数据
    getAgreement(providerId);
});
/*  关闭用户协议 */
$('#closeButton').click(function() {
    $('#agreement_container').closePopup();
});
/*  关闭用户协议 */
$('.cancel').click(function() {
    $('#agreement_container').closePopup();
});

// ================================= 选择地址相关 ===================================

//选择地址
$('#present .select-city-btn').on('click', function() {
    var _this = $(this);
    if(openCitys.length <= 0){
        $.toast("当前业务暂未开通,敬请期待")
        return false;
    }

    //起始图标
    var opIcon = '';
    if(_this.parents('.start').length == 1) {
        opIcon = '/res/images/rent/icon_marker.png';
    } else if(_this.parents('.end').length == 1) {
        opIcon = '/res/images/rent/icon_marker_end.png';
    }
    $('.amap-icon img').attr('src', opIcon);

    //填充历史记录
    showHistoryInfo();
    //地址选择操作
    $('#search-address').popup('push', function() {
        if(_this.val().length <= 0) {
            showSearchAddressPanel();
            showSearchAddressResult();
        }

        if(_isInitsa) return;
        _isInitsa = true;
        setTimeout(function() {
            $('#search-address .wrapper').css('height', $(window).height() - 44);
            var _myIScrollsa = new IScroll('#searchWrapper');
        }, 300);
    }, function(data) {
        //将数据缓存在lineParam中
        var num = $('#present_peopleNumber').data('value');
        if(_this.attr('id') == 'startAddr'){
            _this.val(data.name);
            _this.data("address",data.address);
            checkCityIsOpen(data.lng,data.lat,3);//出发地
        }else if(_this.attr('id')== 'endAddr'){
            _this.val(data.name);
            _this.data("address",data.address);
            lineParam['arriveLng'] = data.lng;
            lineParam['arriveLat'] = data.lat;
            lineParam['arriveAddress'] = data.name;
            showBillingLoading();
        }

    });
}).backtrack({
    cancel: '#search-address .cancel',
    event: 'click'
});

//关闭地址查询
$('#search-address .cancel').on('click', function() {
    $('#search-address').closePopup(function() {
        if(_myIScrollsa) {
            _myIScrollsa.destroy();
            _myIScrollsa = null;
        }
    });
});

//点击地址返回数据
$('#search-address .wrapper li:not(.remove-history)').on('click', function() {
    var data = $(this).find('h1').text();
    $('#search-address').setPopupData(data);
    $('#search-address .cancel').triggerHandler('click');
});

$('#setCityButton').on('click', function() {
    var _this = $(this);
    $('#select-Citys').popup('push', function() {
        if(_isInitsc) return;
        _isInitsc = true;
        setTimeout(function() {
            $('#select-Citys .wrapper').css('height', $(window).height() - 44);
            var _myIScrollsc = new IScroll('#cityWrapper');
        }, 300);
    }, function(data) {
        _this.text(data);
    });

}).backtrack({
    cancel: '#select-Citys .cancel',
    event: 'click'
});
// ================================= 选择城市相关 ===================================
// 选择城市
$('#select-Citys .wrapper li').on(targetType, function() {
    var data = $(this).text();
    $('#select-Citys').setPopupData(data);
    $('#select-Citys .cancel').triggerHandler('click');
});

// 关闭选择城市
$('#select-Citys .cancel').on('click', function() {
    $('#select-Citys').closePopup(function() {
        if(_myIScrollsc) {
            _myIScrollsc.destroy();
            _myIScrollsc = null;
        }
    });
})


function wsInit() {
    var websocketUrl = WEBSOCKET_SERVER + '?token=' + $.cookie('token');
    var wss = new communicate({
        url : websocketUrl,
        errorCallback: function (event) {
            if(event == '正在重连') {
                console.warn(event)
            } else {
                console.error(event)
            }
        },
        openCallback: function(event) {
        },
        messageCallback: function(event) {
            var data = event.data.data
            if(data.type == 7){
                //TODO 跳转订单页面
                if(data.orderNo){
                    var orderNo = data.orderNo;
                    //等待接驾
                    window.location = '/bus/toOnlineCarOrderDetail?orderNo=' + orderNo + '&token=' + $.cookie('token');
                }
            }
        }
    })

    wss.init();
}

/***************************************************************************************************/
//填入loading时间
function full(r) {
    var $t = $('#timer');
    var html = r + 's';
    $t.html(html);
}

/*  动态生成协议一内容*/
function getAgreement(providerId) {
    var params = {
        providerId : providerId,
        token : $.cookie('token')
    }
    var url = '/baseOnlineCar/providerAgreement';
    $.post(url,params,function(data){
        var content = '暂无协议';
        if(data && data.code == 0){
            content = data.data.content ? data.data.content : '暂无协议';
        }
        var _html = '<div class="agreement-content"><p class="">'+ content +'</p>' + '</div>';
        $('#agreement_container .agreement-box').html('');
        $('#agreement_container .agreement-box').html(_html);
    },'json');
}

/*正在计算价格*/
var departType = 1;
var tripNo = $('#tripPrice').data('tripNo');
function showBillingLoading() {
    var startTime = $('.startWeekTime').val();
    var startAddr = $('#present .start input').val();
    var endAddr = $('#present .end input').val();
    var startTime = $('#present #present_startTime').val();
    var startType = $('.startWeekTime').data('time');
    var departTime = '';
    var departDate = '';
    if(startType == 'now'){
        departType = 1;//即时行程
    }else{
        departType = 2;//即时行程
        departDate = $('.startWeekTime').data('date');
        var departHours = $('.startWeekTime').data('time');
        var departMinutes = $('.startWeekTime').data('minute');
        departTime = departDate + ' ' + departHours + ':' + departMinutes;
    }
    if(!startAddr || !endAddr || !startTime) {
        return;
    }
    $('#present .billing .billing-charge').hide();
    $('#present .billing .billing-loading').show();
    //开始计算价格
    var departCityId = $('#cityId').val();
    var params = {
        'departLng' : lineParam['departLng'],
        'departLat' : lineParam['departLat'],
        'arriveLng' : lineParam['arriveLng'],
        'arriveLat' : lineParam['arriveLat'],
        'cityId' : departCityId,
        'departType' : departType,
        'departTime' : departTime,
        'departDate' : departDate
    }
    $.post("/onlineTrip/tripPrice",params,function(data){
        $('#present .billing .billing-loading').hide();
        if(data.code == 0){
            tripNo = data.data.tripNo;
            var tripPrice = data.data.tripPrice;
            var couponMoney = 0;
            if(undefined != data.data.couponsPrice && data.data.couponsPrice != '' && data.data.couponsPrice != 0){
                var couponsPrice = data.data.couponsPrice;
                if(parseFloat(tripPrice) - parseFloat(couponsPrice) > 0){
                    tripPrice = parseFloat(tripPrice) - parseFloat(couponsPrice);
                    couponMoney = parseFloat(couponsPrice);
                }else {
                    tripPrice = 0;
                    couponMoney = parseFloat(data.data.tripPrice);
                }
                $('.bill-rules-btn').css('line-height','1.5rem');
                $('#coupons').html('券已抵'+couponMoney+'元');
            }else{
                $('.bill-rules-btn').css('line-height','');
                $('#coupons').css('display','none');
            }            
            if (undefined != data.data.calculateType && data.data.calculateType != '' && data.data.calculateType == 1){
            	$(".charge-type").text("预估价");
            	if(couponMoney==0){
                    $('#coupons').text("以实际行驶为准");
                }else{
                    $('#coupons').text("以实际行驶为准，券已抵" +couponMoney+'元');
                }
                $('#coupons').css({'margin-right':'1.8rem','margin-left':'0','display':''});
        	}
        	else{
        		$(".charge-type").text("一口价");
        		$('#coupons').css({'margin-right':'0','margin-left':'.5rem'});        		
        	}
                        
            tripPrice = formatMoney(tripPrice,2);
            $('#tripPrice').text(tripPrice);
            $('#tripPrice').data('tripNo',tripNo);
            $('#present .billing .billing-charge').show();
        }else{
            $.alert(data.msg,function(){
                window.location.reload();
            });
        }
    },'json');
}

var openCitys = [];
//获取开通的城市列表
var getOpencitys = function(){
    var params = {token : $.cookie('token')};
    $.post("/baseOnlineCar/openCity",params,function(data){
        if(data.code == 0){
            var i = 0;
            cityList = data.data;
            if(cityList.length == 0){
                return;
            }
            for(i;i<cityList.length;i++){
                loadOpenCity(cityList[i]);
            }
            var cityName = cityList[0].cityName;
            var areaCode = cityList[0].areaCode;
            var cityId = cityList[0].cityId;
            $('#setCityButton').html(cityName);
            $('#areaCode').val(areaCode);
            $('#cityId').val(cityId);
            openCitys.push(cityList);
        }else{
            return ;
        }
    },'json');
}

//加载开通的城市列表
var loadOpenCity = function(city){
    var html="";
    if($('#city'+city.firstLetter+'').length>0){
        if($('#'+city.cityName).length<=0){
            html = '<li id="'+city.cityName+'">'+city.cityName+"</li>" ;
            $("#city"+city.firstLetter+'').append(html);
        }
    }else{
        html = '<div class="sui-list-title" id="#city'+city.firstLetter+'">'+city.firstLetter+'</div>'+
            '<ul id="city'+city.firstLetter+'" class="sui-list"><li id="'+city.cityName+'">'+city.cityName+"</li></ui>" ;
        $("#cityList").append(html);

        var cityHtml='<li><a href="#city'+city.firstLetter+'">'+city.firstLetter+'</a></li>';
        $('.nav-city').append(cityHtml);
    }
    $('#'+city.cityName).off(targetType).on(targetType, function() {
        $('#searchResult').html('');
        $('.serach-input input').val('');
        var text = $(this).text();
        $('#select-Citys').setPopupData(text);
        if(city.areaCode !=""){
            $("#areaCode").val(city.areaCode);
        }
        if(city.cityId != ""){
            $("#cityId").val(city.cityId);
        }
        $('#select-Citys').closePopup(function() {
            if(_myIScrollsc) {
                _myIScrollsc.destroy();
                _myIScrollsc = null;
            }
        });
    });
}

//添加行程
var submitTrip = function(){
    var startTime = $('.startWeekTime').val();
    var startAddr = $('#present .start input').val();
    var startAddrInfo = $('#present .start input').data("address");
    var endAddr = $('#present .end input').val();
    var endAddrInfo = $('#present .end input').data("address");
    var departTime = '';
    var departDate = '';
    var departCityId = $('#cityId').val();
    var startType = $('.startWeekTime').data('time');
    if(startType == 'now'){
        departType = 1;//即时行程
    }else{
        departType = 2;//即时行程
        departDate = $('.startWeekTime').data('date');
        var departHours = $('.startWeekTime').data('time');
        var departMinutes = $('.startWeekTime').data('minute');
        departTime = departDate + ' ' + departHours + ':' + departMinutes;
    }
    if(!startTime) {
        $.toast("请选择出发时间");
        return;
    }
    if(!startAddr) {
        $.toast("请选择上车地点");
        return;
    }
    if(!endAddr) {
        $.toast("请选择目的地");
        return;
    }
    if(tripNo == ''){
        $.toast("正在计算行程价格,请稍等");
        return;
    }
    //封装提交的参数
    var params = {
        'departLng' : lineParam['departLng'],
        'departLat' : lineParam['departLat'],
        'departTitle' : startAddr,
        'departAddress' : startAddrInfo,
        'arriveLng' : lineParam['arriveLng'],
        'arriveLat' : lineParam['arriveLat'],
        'arriveTitle' : endAddr,
        'arriveAddress' : endAddrInfo,
        'cityId' : departCityId,
        'departType' : departType,
        'departTime' : departTime,
        'departDate' : departDate,
        'tripNo' : tripNo,
        'token' : $.cookie('token')
    }
    $.post("/onlineTrip/addTrip",params,function(data){
        var departType = params['departType'];
        if(data.code == 0){
            currentTimeSetCookie();
            var callOutTime = data.data.callOutTime ? data.data.callOutTime : 100;
            var tripNo = data.data.tripNo;
            if(departType == 1){
                callTrip(callOutTime,tripNo);
            }else{
                $.toast("行程添加成功");
            }
        }else if(data.code == 1){
            //有未完成的订单
            var orderNo = data.data.orderNo;
            var status = data.data.status;
            var tripStatus = data.data.tripStatus;
            var departType = data.data.tripType;
            $.dialog({
                text: '您有订单正在进行中',
                buttons: [{
                    text: '知道了',
                    onClick: function() {
                        window.location = '/bus/toOnlineCarOrderDetail?orderNo=' + orderNo + '&token=' + $.cookie('token');
                    }
                }]
            });
        }else{
            $.alert(data.message,function(){
                return false;
            })
        }

    },'json');
}

//验证有无正在进行的行程或订单
var checkUnfinishTripAndOrder = function(){
    var url = '/onlineTrip/checkUnfinishedTripAndOrder';
    var params = {
        token : $.cookie('token')
    }

    $.post(url,params,function(data){
        if(undefined != data && null != data){
            if(data.code && data.code == 2){
                //有在进行中的即时行程
                var currentTime = data.timestamp;
                var callOutTime = data.data.callOutTime ? data.data.callOutTime : 100;
                var departTime = data.data.departTime;
                var tripNo = data.data.tripNo;
                callOutTime = callOutTime*1000;
                if((departTime + callOutTime) <= currentTime){
                    //取消行程
                    cancelTrip(tripNo,2);
                }else{
                    //加载推送订单
                    var time = departTime + callOutTime - currentTime;
                    time = time/1000;
                    time = Math.ceil(time);
                    currentTimeSetCookie();
                    callTrip(time,tripNo);
                }
            }else if(data.code && data.code == 1){
                //有未完成的订单
                var orderNo = data.data.orderNo;
                var status = data.data.status;
                var tripStatus = data.data.tripStatus;
                var departType = data.data.tripType;
                $('.ticket-tips').show();
                $('.ticket-tips').off('click').on('click',function(){
                    window.location = '/bus/toOnlineCarOrderDetail?orderNo=' + orderNo + '&token=' + $.cookie('token');
                });
            }
        }

    },'json');
}

/*乘客取消订单*/
var cancelTripByUser = function(tripNo){
    $('#cancel_order').off('click').on('click',function () {
        var _this = $(this);
        $.dialog({
            text: '司机就快接单了，\n您确定要取消订单吗？',
            buttons: [{
                text: '点错了',
                onClick: function() {
                }
            }, {
                text: '确定',
                onClick: function() {
                    cancelTrip(tripNo,1);
                    $('.search-loading-container').hide();
                    clearInterval(auto);//清除倒计时
                }
            }]
        });
    });
}

//取消行程
var cancelTrip = function(tripNo,type){
    var params = {
        tripNo : tripNo,
        token : $.cookie('token')
    }
    var postUrl = '/onlineTrip/cancelTrip';
    $.post(postUrl,params,function(data){
        if(data.code != 0){
            $.toast("服务器错误,请稍等...");
            return false;
        }else{
            if(type == 1){
                //手动取消
                $.alert("取消成功",function(){
                    window.location.reload();
                });
            }else{
                $.dialog({
                    text: '司机正忙，\n下次叫车将优先为您派单',
                    buttons: [{
                        text: '知道了',
                        onClick: function() {
                            window.location.reload();
                        }
                    }]
                });
            }

        }
    },'json');
}

//叫单
var callTrip = function(t,tripNo){
    $('.search-loading-container').show();
    $('#timeCount').html('');
    $('#timeCount').html(t + '秒后无应答将优先为您叫车');
    $('#carNumbers').html('已通知<span>' + carNumbers + '</span>辆')
    cancelTripByUser(tripNo);
    full(t);
    var outTime = Number($.cookie("currentTime"))+t;
    var i = 0;
    auto = setInterval(function() {
        var timestamp = Date.parse(new Date())/1000;
        var T = outTime - timestamp;
        i++;
        if(i%20 == 0&&T>0){
            retryInitTrip(tripNo);
        }
        if(T <= 0){
            // 倒计时时间到
            $('.search-loading-container').hide();
            clearInterval(auto);//清除倒计时
            cancelTrip(tripNo,2);
        }
        full(T);
    }, 1000);
}

var priceShow = function(){
    var startTime = $('.startWeekTime').val();
    var startAddr = $('#present .start input').val();
    var endAddr = $('#present .end input').val();
    if(startAddr && endAddr && startTime) {
        $('#present .billing .billing-charge').show();
    }
}

//获取价格规则
var getPriceRule = function(cityId,departType){
    $.showLoading();
    var params = {
        areaId : cityId,
        departType : departType,
        token : $.cookie('token')
    }
    var postUrl = '/baseOnlineCar/priceRule';
    $.post(postUrl,params,function(data){
        $.hideLoading();
        if(data.code == 0){
            var priceRule = data.data;
            loadPriceRule(priceRule)
        }else{
            $.alert(data.msg);
            return;
        }
    },'json');
}

var loadPriceRule = function(priceRule){
    var basePrice = priceRule.basePrice ? priceRule.basePrice : 0;
    var nightBasePrice = priceRule.nightBasePrice ? priceRule.nightBasePrice : 0;
    var baseKm = priceRule.baseKm ? priceRule.baseKm : 0;
    var baseTime = priceRule.baseTime ? priceRule.baseTime : 0;
    var moreKmPrice = priceRule.moreKmPrice ? priceRule.moreKmPrice : 0;
    var moreTimePrice1 = priceRule.moreTimePrice1 ? priceRule.moreTimePrice1 : 0;
    var moreTimePrice2 = priceRule.moreTimePrice2 ? priceRule.moreTimePrice2 : 0;
    var waitPrice = priceRule.waitPrice ? priceRule.waitPrice : 0;
    var backKm = priceRule.backKm ? priceRule.backKm : 0;
    var nightKmExPrice = priceRule.nightKmExPrice ? priceRule.nightKmExPrice : 0;
    var nightServerBegin = priceRule.nightServerBegin ? priceRule.nightServerBegin : 0;
    var nightServerEnd = priceRule.nightServerEnd ? priceRule.nightServerEnd : 0;
    var morningBusiTimeBegin = priceRule.morningBusiTimeBegin ? priceRule.morningBusiTimeBegin : 0;
    var morningBusiTimeEnd = priceRule.morningBusiTimeEnd ? priceRule.morningBusiTimeEnd : 0;
    var nightBusiTimeBegin = priceRule.nightBusiTimeBegin ? priceRule.nightBusiTimeBegin : 0;
    var nightBusiTimeEnd = priceRule.nightBusiTimeEnd ? priceRule.nightBusiTimeEnd : 0;
    nightServerBegin = dataChange('hh:mm',nightServerBegin);
    nightServerEnd = dataChange('hh:mm',nightServerEnd);
    morningBusiTimeBegin = dataChange('hh:mm',morningBusiTimeBegin);
    morningBusiTimeEnd = dataChange('hh:mm',morningBusiTimeEnd);
    nightBusiTimeBegin = dataChange('hh:mm',nightBusiTimeBegin);
    nightBusiTimeEnd = dataChange('hh:mm',nightBusiTimeEnd);
    var _html =
        "<table>" +
        "<tr>" +
        "<td style='width: 50%'>" + "基础价格" +"</td>" +
        "<td>" + basePrice +"元"+"</td>" +
        "</tr>" +
        "<tr>" +
        "<tr>" +
        "<td style='width: 50%'>" + "夜间基础价格" +"</td>" +
        "<td>" + nightBasePrice +"元"+"</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +"公里数（含）"+"</td>" +
        "<td>" + baseKm +"公里"+"</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +"基础时长（含）"+"</td>" +
        "<td>" + baseTime + "分钟"+"</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +"超里程费（元／公里）"+"</td>" +
        "<td>" + moreKmPrice +"</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +"超时长费（元／分钟）"+"</td>" +
        "<td>" +"<div>" +"平峰(" + moreTimePrice1 +")</div>" +"<div>" +"高峰(" + moreTimePrice2 + ")</div>" +"</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +"等候费（元／分钟）"+"</td>" +
        "<td>" + waitPrice  +"</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +"回空里程"+"</td>" +
        "<td>" + backKm + "公里"+"</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +"夜间服务里程附加费（元／公里）"+"</td>" +
        "<td>" + nightKmExPrice +"</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +"夜间服务时段"+"</td>" +
        "<td>" +"<div>" + nightServerBegin + "-" + nightServerEnd +"</div>" + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +"高峰服务时段"+"</td>" +
        "<td>" +
        "<div>" +"<span>" +"工作日"+"</span>" +"<span>" + morningBusiTimeBegin + " - " + morningBusiTimeEnd + "<br/>" + nightBusiTimeBegin + " - " + nightBusiTimeEnd + "</span>" +"</div>" +
        "<div>" +"国家法定节假日高峰期服务时段以实际为准"+"</div>" +
        "</td>" +
        "</tr>" +
        "</table>";
    $('.rules-table-container').html(_html);
}

var currentTimeSetCookie = function(){
    var timestamp = Date.parse(new Date())/1000;
    $.cookie("currentTime",timestamp);
}

//日期格式转化
var dataChange = function(fmt,date){
    if(typeof date == "string"){
        date = new Date(date);
    }
    var o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

//获取车辆数
var getCarNumbers = function(){
    var params = {
        'token' : $.cookie('token')
    }
    $.post('/baseOnlineCar/carNumber',params,function(data){
        var carNumbers = 15;
        if(data && data.code == 0){
            if(data.configValue){
                carNumbers = data.configValue;
            }
        }
        $('.car-number-content').data('carnumbers',carNumbers);
    },'json')
}

function retryInitTrip(tripNo){
    var param = {
        "tripNo":tripNo,
        "token" :$.cookie('token')
    };
    $.post('/onlineTrip/retryInitTrip', param, function(result){});
}


$(function() {
    //初始化加载业务当行蓝
    getBusinessTypes("onlineCar");
    wsInit();

    AMap.plugin('AMap.Geocoder',function(){
        geocoder = new AMap.Geocoder({
        });
        if(!lineParam["departCityName"]) {
            var shareObj = {
                url : window.location.href,
            }
            wxInitConfig(shareObj,getGpsCallback);
        }
    });

    //获取开通的城市列表
    getOpencitys();

    //倒计时返回的，用于清除倒计时
    var auto;
    //校验当前乘客行程状态
    checkUnfinishTripAndOrder();

    //价格显示
    priceShow();
});
