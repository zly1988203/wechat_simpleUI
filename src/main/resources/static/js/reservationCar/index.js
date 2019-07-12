var lineParam={};//保存起止点的经纬度信息
var geocoder;//地图对象
AMap.service(["AMap.PlaceSearch"], function() {
    var placeSearchOptions = { //构造地点查询类
        pageSize: 10,
        pageIndex: 1,
        city: $("#areaCode").val(), //城市
    };

    //地理位置搜索
    placeSearch= new AMap.PlaceSearch(placeSearchOptions);
});

AMap.plugin('AMap.Geocoder',function(){
    geocoder = new AMap.Geocoder({
    });
})

//根据gps获取地理位置
var getGpsCallback=function getAddressByGps(callbackData){
    var gpsData=callbackData['longitude']+","+callbackData['latitude'];
    lineParam['departLng']=callbackData['longitude'];//经度
    lineParam['departLat']=callbackData['latitude'];//纬度
    $('#startAddr').data('lng',callbackData['longitude']);
    $('#startAddr').data('lat',callbackData['latitude']);
    var gpsParam = [callbackData['longitude'],callbackData['latitude']];
    geoCallBack(1,gpsParam);
    searchAddressByGps(gpsData,searchMapAddCallback);
    //解析当前定位获取城市名和城市编码
    analyse(gpsParam);
}

//gps定位
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
}


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
            var placeSearchOptions = { //构造地点查询类
                pageSize: 10,
                pageIndex: 1,
                city: $("#areaCode").val(), //城市
            };

            //地理位置搜索
            placeSearch= new AMap.PlaceSearch(placeSearchOptions);
        }
    })
}

function geoCallBack(type,lnglatXY){
    geocoder.getAddress(lnglatXY,function(status,result){
        if(status=='complete'){
            var cityName=result.regeocode.addressComponent.city;//
            if(cityName==null||cityName==""){
                cityName=result.regeocode.addressComponent.province;
                if(cityName.indexOf("省")>= 0){
                    cityName=result.regeocode.addressComponent.district;
                }
            }
        }
        $.hideLoading();
    })
}

//初始化时间控件
$('.startWeekTime').on('click', function () {
    var _this = $(this)
    initWeekTime(_this);
});

$(function () {
    var targetType = isAndroid() ? 'tap' : 'click';
    //按钮背景置灰
    var isShow = $("#isShow").val();
    if(isShow === "0"){
        $("#resbtn").css('background','#ccc');
    }
    // showUser();

    getBusinessTypes("chartered");
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

    var d = new Date(new Date().getTime());
    var startTime = d.getFullYear() + '-' + zeroize(d.getMonth()+1) + '-' + zeroize(d.getDate());
    var endTime = d.getFullYear() + '-' + zeroize(d.getMonth()+1) + '-' + zeroize(d.getDate()+1);
    $("#present_startTime").data('date',startTime);

    $("#present_endTime").data('date',endTime);
    $("#present_endTime").val("明天" + " 09点"+" 00分");

    $("#tabOne").on("click",function () {
        $("#tabWay").val("1");
        $("#tabTwo").removeClass("active");
        $("#dvEndTime").addClass("undisplay");
        $(this).addClass("active");
    })

    $("#tabTwo").on("click",function () {
        $("#tabWay").val("2");
        $("#tabOne").removeClass("active");
        $("#dvEndTime").removeClass("undisplay");
        $(this).addClass("active");
    })

    exChangeVal = function (_el_trigger,_elStart,_elEnd) {
        _el_trigger.on('click', function() {
            var startAddr = _elStart.val();
            var endAddr = _elEnd.val();
            _elStart.val(endAddr);
            _elEnd.val(startAddr);
        });
    }

    exChangeVal($('.exchange'),$('#startAddr'),$('#endAddr'));

    // ================================= 选择地址相关 ===================================
    //关键词搜索结果 - new (动态生成HTML并绑定事件)
    var cpLock = true;
    $('.serach-input input').off('input').on({
        //解决input事件在输入中文时多次触发事件问题
        compositionstart: function () {//中文输入开始
            cpLock = false;
        },
        compositionend: function () {//中文输入结束
            cpLock = true;
        },
        input:function () {
            setTimeout(function () {
                if(cpLock){
                    var searchLocation=$('.serach-input input').val();
                    searchAddress(searchLocation);
                }
            },0);
        }
    });

    function searchAddress(param){
        var gather = $('.gather');
        if($.trim(param) != '') {
            //内容不为空，隐藏下面的信息
            gather.hide();
            placeSearch.search(param, callback);
        } else {
            gather.show();
            $('#searchResult').html('');
        }
    }

    //关键字查询，您如果想修改结果展现效果，请参考页面：http://lbs.amap.com/fn/css-style/
    function callback(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            parseSearchResult(result.poiList.pois);
        }else{
            $('#searchResult').css("font-size","20px");
            $('#searchResult').html('没有找到结果');
        }
    }

    function parseSearchResult(result){
        var inputText = $('.serach-input input').val();
        if($.trim(inputText) == ''){
            return false;
        }
        var strHtml = '';
        if(result.length>0){
            for(var i = 0; i < result.length; i++) {
                strHtml += '<li>' +
                    '<div class="sui-cell-map">' +
                    '<h1 data-lng="'+result[i].location.lng+'" data-lat="'+result[i].location.lat+'">'+result[i].name+'</h1>' +
                    '<h2>'+result[i].address+'</h2>' +
                    '</div>' +
                    '</li>';
            }
            $('#searchResult').html(strHtml);
            //添加点击事件
            searchClickEvent();
            // 这句不能少，否则超出屏幕不能滚动。
            if(_myIScrollsa) _myIScrollsa.refresh();
        }
    }

    // 选择地址
    var _isInitsa = false, _myIScrollsa;
    $('.select-city-btn').on(targetType, function() {
        var _this = $(this);
        showHistoryInfo();
        $('#search-address').popup('push', function() {
               setTimeout(function() {
                $('#search-address .wrapper').css('height', $(window).height() - 44);
                _myIScrollsa = new IScroll('#searchWrapper');
            }, 300);
        }, function(data) {
            $.showLoading();
            _this.val(data.name);
            if(_this.attr('id') == 'startAddr'){
                var gpsParam=[data.lng,data.lat];
                geoCallBack(1,gpsParam);
            }else if(_this.attr('id')== 'endAddr'){

                var gpsParam=[data.lng,data.lat];
                geoCallBack(2,gpsParam);
            }
        });
    }).backtrack({
        cancel: '#search-address .cancel',
        event: 'click'
    });

    //关闭地址查询
    $('#search-address .cancel').on(targetType, function() {
        $('#search-address').closePopup(function() {
            if(_myIScrollsa) {
                _isInitsa = false;
                _myIScrollsa.destroy();
                _myIScrollsa = null;
            }
        });
    });

    //选择当前位置返回首页
    $('#search-address .current .station-group span').on(targetType, function () {
        var data = $(this).text();
        $('#search-address').setPopupData(data);
        $('#search-address .cancel').triggerHandler('click');
    });

    /**
     * 获取并填充历史记录
     */
    function showHistoryInfo(){
        $('#searchResult').html('');
        var tmp = _searchAddressHistory.get();
        var list = [];
        var strHtml = '';
        for(var i = tmp.length-1; i>=0; i--) {
            list.push(tmp[i]);
        }

        if (list.length != 0) {
            for(var i=0;i<list.length;i++){
                var addressContent = list[i];
                strHtml += '<span class="historySearch" data-lng="'+addressContent.lng+'" data-lat="'+addressContent.lat+'" data-address="' + addressContent.address + '">' + addressContent.name + '</span>';
                //只显示最近十条记录
                if(i == 9){
                    break;
                }
            }
            $('.gather').show();
            $('#historyAddress').html(strHtml);
            $('#historySearch').show();
            $('.remove-history').show();
            //添加点击事件
            searchClickEvent();
            // 这句不能少，否则超出屏幕不能滚动。
            if(_myIScrollsa) _myIScrollsa.refresh();
        }

    }

    function searchClickEvent(){
        var targetType = isAndroid() ? 'tap' : 'click';
        //点击历史记录返回首页
        $('.historySearch').on(targetType, function () {
            var data = {};
            data['name'] = $(this).text();
            data['address'] = $(this).data('address');
            data['lng'] = $(this).data('lng');
            data['lat'] = $(this).data('lat');
            $('#search-address').setPopupData(data);
            $('#search-address .cancel').triggerHandler(targetType);
        });

        $('.remove-history').off(targetType).on(targetType,function(){
            _searchAddressHistory.remove();
            $('#historySearch').hide();
            $('.remove-history').hide();
        });

        $('#searchResult').children('li').off('tap').on('tap', function() {
            if($(this).text() == '清空历史记录'){
                _searchAddressHistory.remove();
                $('#searchResult').html('');
            }else{
                var data = {};
                data['name'] = $(this).find('h1').text();
                data['address'] = $(this).find('h2').text();
                data['lng'] = $(this).find('h1').data('lng');
                data['lat'] = $(this).find('h1').data('lat');
                if (data['name'] != null) {
                    $('.sui-cell-map').remove();
                    $('.serach-input input').val('');
                    _searchAddressHistory.set(data);
                    $('#search-address').setPopupData(data).closePopup();
                }
            }
        });
    }

    // ================================= 选择城市相关 ===================================

    // 打开选择城市
    var _isInitsc = false, _myIScrollsc;
    $('#setCityButton').on(targetType, function() {
        var _this = $(this);
        $('#select-Citys').popup('push', function() {
            if(_isInitsc) return;
            _isInitsc = true;
            setTimeout(function() {
                $('#select-Citys .wrapper').css('height', $(window).height() - 44);
                var _myIScrollsc = new IScroll('#cityWrapper');

                retrieveWord(function (el) {
                    _myIScrollsc.scrollToElement(el.attr('href'));
                });

            }, 300);
        }, function(data) {
            _this.text(data);
        });

    });

    /* 字母快速检索 */
    function retrieveWord(callback) {
        var $city = $('.nav-city'),
            $city_li = $city.find('li');
        var city_h = 0;

        $city_li.each(function () {
            city_h += $(this).height();
        });

        $city.css('height', city_h);

        $('.nav-city a').on('click', function (e) {
            e.preventDefault();

            if(callback instanceof Function) {
                callback($(this));
            }
        });
    }

    // 选择城市
    $('#select-Citys .wrapper li').on(targetType, function() {
        var data = $(this).text();
        $('#select-Citys').setPopupData(data);
        $('#select-Citys .cancel').triggerHandler('click');
    });

    // 关闭选择城市
    $('#select-Citys .cancel').on(targetType, function() {
        $('#select-Citys').closePopup(function() {
            if(_myIScrollsc) {
                _myIScrollsc.destroy();
                _myIScrollsc = null;
            }
        });
    });
    
    // 存储搜索结果历史记录
    var _searchAddressHistory = {
        name: '_searchBusLineAddressDataKey',  // 本地存储的key
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

    $("#resbtn").on(targetType,function () {
        if(isShow === "0"){
            $(".cover").removeClass("undisplay");
            $("#msgBox").removeClass("undisplay");
            $("#msgBox .content").html("此功能暂未开放。");
            return;
        }

        if($("#tabWay").val() === "1"){
            $("#resWay").html("单程");
            $("#returnItem").addClass("undisplay");
        }else{
            $("#returnItem").removeClass("undisplay");
            $("#resWay").html("往返");
        }

        if($("#tabWay").val() === "1"){
            $("#resWay").html("单程");
            $("#returnItem").addClass("undisplay");
        }else{
            $("#returnItem").removeClass("undisplay");
            $("#resWay").html("往返");
        }

        if($("#startAddr").val() === "" ){
            $(".cover").removeClass("undisplay");
            $("#msgBox").removeClass("undisplay");
            $("#msgBox .content").html("请选择您的上车地点。");
            return;
        }

        if($("#endAddr").val() === ""){
            $(".cover").removeClass("undisplay");
            $("#msgBox").removeClass("undisplay");
            $("#msgBox .content").html("请选择您要到达的地点。");
            return;
        }

        if($("#present_startTime").val() === ""){
            $(".cover").removeClass("undisplay");
            $("#msgBox").removeClass("undisplay");
            $("#msgBox .content").html("请选择您何时出发。");
            return;
        }

        if($("#tabWay").val() === "2"){
                var date = getStart_EndTime();
                if(!compareDate(date.departTime,date.returnTime)){
                    $(".cover").removeClass("undisplay");
                    $("#msgBox").removeClass("undisplay");
                    $("#msgBox .content").html("返程时间应晚于出发时间。");
                    return;
                }
        }

        if($("#present_peopleNumber").val() === ""){
            $(".cover").removeClass("undisplay");
            $("#msgBox").removeClass("undisplay");
            $("#msgBox .content").html("请填写出行人数。");
            return;
        }

        var checkNumber = /^[0-9]*[1-9][0-9]*$/;
        if(!checkNumber.test($("#present_peopleNumber").val())){
            $(".cover").removeClass("undisplay");
            $("#msgBox").removeClass("undisplay");
            $("#msgBox .content").html("出行人数必须为大于0的正整数。");
            return;
        }

        var phone = $("#present_phone").val();
        if(phone === ""){
            $(".cover").removeClass("undisplay");
            $("#msgBox").removeClass("undisplay");
            $("#msgBox .content").html("请填写你的手机号码。");
            return;
        }

        if(!checkTel(phone)){
            $(".cover").removeClass("undisplay");
            $("#msgBox").removeClass("undisplay");
            $("#msgBox .content").html("你填写的电话号码不正确。");
            return;
        }

        $("#startPlace").html($("#startAddr").val());
        $("#endPalce").html($("#endAddr").val());
        $("#startTime").html($("#present_startTime").val());
        $("#returnTime").html($("#present_endTime").val());
        $("#personNumb").html($("#present_peopleNumber").val()+"人");
        $("#personPhone").html($("#present_phone").val());
        $("#remark").html($("#present_remark").val())
        
        $(".cover").removeClass("undisplay");
        $("#reservationInfo").removeClass("undisplay");

    })

    function compareDate(beginDate,endDate) {
        var d1 = new Date(beginDate.replace(/\-/g, "\/"));
        var d2 = new Date(endDate.replace(/\-/g, "\/"));

        if(beginDate!=""&&endDate!=""&&d1 >=d2)
        {
            return false;
        }
        return true;
    }

    function checkTel(tel)
    {
        var mobile = /^1[3|4|5|6|7|8|9]\d{9}$/ , phone = /^0\d{2,3}-?\d{7,8}$/;
        return mobile.test(tel) || phone.test(tel);
    }

    function getStart_EndTime() {
        var d = new Date(new Date().getTime());
        var startTime = d.getFullYear() + '-' + zeroize(d.getMonth()+1) + '-' + zeroize(d.getDate());
        var departTime =  $("#present_startTime").data('date')+" " +$("#present_startTime").data('time')+":"+ $("#present_startTime").data('minute');
        if($("#present_startTime").data('time') === "now"){
            departTime = startTime+" " +zeroize(d.getHours())+":"+ zeroize(d.getMinutes());
        }

        var  returnTime = $("#present_endTime").data('date')+" " +$("#present_endTime").data('time')+":"+ $("#present_endTime").data('minute');;
        if($("#tabWay").val() == 2){
            if($("#present_endTime").data('time') === "now"){
                returnTime = startTime+" " +zeroize(d.getHours())+":"+ zeroize(d.getMinutes());
            }
        }

        return {departTime:departTime,returnTime:returnTime};
    }

    var interfacePath = "";
    var flag = false;
    $("#submitInfo").on('click',function () {
        $.showLoading();
        $("#reservationInfo").addClass("undisplay");

        var date = getStart_EndTime();
        if (navigator.onLine) {
            var param = {
                url:"charteredCarOrder/addCharteredCarOrder",
                data: {
                    departStation:$("#startAddr").val(),
                    arriverStation:$("#endAddr").val(),
                    tripType:$("#tabWay").val(),
                    departTime:date.departTime,
                    returnTime:date.returnTime,
                    numbers:$("#present_peopleNumber").val(),
                    mobile:$("#present_phone").val(),
                    remark:$("#present_remark").val(),
                    providerId:$("#providerId").val(),
                    providerMobile:$("#providerMobile").val()
                }
            }

            $.ajax({
                type: 'POST',
                data:param.data,
                url:param.url,
                dataType: 'json',
                success:function (res) {
                    $.hideLoading();
                    if(res.code == 0){
                    	 flag = true;
                    	 $("#msgBox").removeClass("undisplay");
                        var d = new Date(new Date().getTime());
                        var startTime = d.getFullYear() + '-' + zeroize(d.getMonth()+1) + '-' + zeroize(d.getDate());
                        startTime = startTime+" " +zeroize(d.getHours())+":"+ zeroize(d.getMinutes());
                    	 var msg = $("#providerName").val()+"于 " + startTime +" 收到您的包车预约,稍后我们的服务人员将与您电话联系，请保持电话畅通。";
                    	 $("#msgBox .content").html(msg);
                    }else {
                    	 $("#msgBox").removeClass("undisplay")
                        $("#msgBox .content").html(res.message);
                    }
                },
                error:function (err) {
                    console.log(err)
                    if(err.status == '401'){//登录
                        var fromUrl = window.location.href;
                        var i =fromUrl.indexOf(CURRENT_SERVER_SUFFIX);
                        fromUrl = fromUrl.substring(i+CURRENT_SERVER_SUFFIX.length,fromUrl.length);
                        var exp = new Date();
                        exp.setTime(exp.getTime() + 60 * 1000 * 10);
                        $.cookie('fromUrl',fromUrl,{expires: exp, path: '/' });

                        window.location.href = '/regOrLogin';
                    }
                }
            })

        }else {
            $("#msgBox .content").html("您可能断网了，请检查网络");
        }

    })
    $("#reservationInfo .icon-close").on('click',function () {
        $(".cover").addClass("undisplay");
        $("#reservationInfo").addClass("undisplay");
    })

    $("#msgBox .btn-konw").on('click',function () {
        $(".cover").addClass("undisplay");
        $("#msgBox").addClass("undisplay");
        if(flag) location.reload();
    })

    //字数统计
    $('#present_remark').on('input', function() {
        var length = $(this).val().length;
        if(length <= 100) {
            $(this).next('div').attr('class', 'message-length').text(length + '/100');
        } else {
            /*$(this).next('div').attr('class', 'sui-red').text('字数太多了。');*/
        }
    });
    
})
