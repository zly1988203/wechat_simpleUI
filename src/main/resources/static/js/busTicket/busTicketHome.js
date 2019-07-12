// $("[data-href]").on("tap",function(){location.href=$(this).data("href")});
$(function() {
    //header导航封装
    getBusinessTypes("busTicket");
    //查询城际约租车是否有未完成的行程，有则在顶部菜单-城际约租车显示小红点，切换小红点消失
    // queryIfHasUnfinishedOrder();

    //交换地址
    $('.exchange').on('click', function() {
        var startAddr = $('#startAddr').val();
        var endAddr = $('#endAddr').val();
        var startStationId=$('#startAddr').data("stationid");
        var endStationId=$('#endAddr').data("stationid");
        var startCityId=$('#startAddr').data("cityid");
        var endCityId=$('#endAddr').data("cityid");
        var startName=$('#startAddr').data("stationname");
        var endName=$('#endAddr').data("stationname");
        $('#startAddr').val(endAddr);
        $('#endAddr').val(startAddr);
        $('#startAddr').attr("data-stationid",endStationId);
        $('#endAddr').attr("data-stationid",startStationId);
        $('#startAddr').attr("data-cityid",endCityId);
        $('#endAddr').attr("data-cityid",startCityId);
        $('#startAddr').attr("data-stationname",endName);
        $('#endAddr').attr("data-stationname",startName);
    });

    AMap.plugin('AMap.Geocoder',function(){
        geocoder = new AMap.Geocoder({
        });
        var shareObj = {
            url : window.location.href,
        }
        wxInitConfig(shareObj,getGpsCallback);
    })
    selectDate();
    // initCity();
});

var geocoder;//地图对象
//根据gps获取地理位置
var getGpsCallback=function getAddressByGps(callbackData){
    var gpsParam = [callbackData['longitude'],callbackData['latitude']];
    $.showLoading();
    if(callbackData['flag'] == true){
        //解析当前定位获取城市名和城市编码
        analyse(gpsParam);
    }else {
        initCity();
    }
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
    initCity();
}

AMap.service(["AMap.PlaceSearch"], function() {
    var placeSearchOptions = { //构造地点查询类
        pageSize: 10,
        pageIndex: 1,
        city: $("#areaCode").val(), //城市
    };

    //地理位置搜索
    placeSearch= new AMap.PlaceSearch(placeSearchOptions);
});


/*
* 选择城市
* */
function selectCity() {
    var $parent = $('#select-Citys'),
        $main = $parent.find('.main'),
        $station = $main.find('.station');

    //初始化
    var init = function () {
        var h = $(window).height() - parseFloat($parent.find('.sui-popup-modal').css('padding-bottom'));

        /*
        * param
        *   other：其他元素高度，现在是h4
        *   INIT_FontSize：html默认字体大小（比例值）
        *   MAX：最大高度
        * */
        var other = $station.prev().height();
        var INIT_FontSize = parseFloat($('html').css('font-size'));
        var MAX = (h - other) / INIT_FontSize - 0.3;
        $station.height(MAX + 'rem').css('max-height', MAX + 'rem');
        $main.css('height', MAX + other / INIT_FontSize + 'rem');

        //开启触摸滚动
        $station.on('touchmove', function (e) {
            e.stopPropagation();
        });
    };

    //弹出层
    $('.select-city-btn').on('click', function () {
        $.showLoading();
        var self = $(this);
        var stationType=self.attr("data-stationType");
        sessionStorage.setItem('stationType',stationType);
        if(stationType==1){
            $("#departStationList").css("display","block");
            $("#departCityList").css("display","block");
            $("#arriveStationList").css("display","none");
            $("#arriveCityList").css("display","none");
            //渲染出发城市列表
             var departCityList = JSON.parse(sessionStorage.getItem('departCityList'));
             if(null != departCityList){
                 $('.nav-city').html('');
                 $('#cityUl').html('');
                 departCityList.forEach(function (city,index) {
                     htmlCity(city)
                 })
             }

        }else{
            $("#departStationList").css("display","none");
            $("#departCityList").css("display","none");
            $("#arriveStationList").css("display","block");
            $("#arriveCityList").css("display","block");

            //渲染出发城市列表
            var arriveCityList = JSON.parse(sessionStorage.getItem('arriveCityList'));
            if(null != arriveCityList){
                $('.nav-city').html('');
                $('#cityUl').html('');
                arriveCityList.forEach(function (city,index) {
                    htmlCity(city)
                })
            }
        }

        $('#cityListContent').show();
        $('#searchResult').html('');
        $('#searchWrapper').hide();

        $('#select-Citys').data('trigger', '#' + self.attr('id')).popup('push', init, function (data) {
            self.val(data);
        });
        $.hideLoading();
    }).backtrack({
        cancel: '#select-Citys .cancel',
        event: 'click'
    });

    initStation();
}

//初始化城市与车站
function initCity(){
    $.ajax({
        type: 'POST',
        url: '/busTicket/getCitys',
        data: {token:$.cookie('token')},
        dataType:  'json',
        success: function(data){
            if(data.code==0){
                var departCityList = data.data.departCityList;
                var arriveCityList = data.data.arriveCityList;
                sessionStorage.setItem('departCityList',JSON.stringify(departCityList));
                sessionStorage.setItem('arriveCityList',JSON.stringify(arriveCityList));
                if($('#areaCode').val() === ''){
                    $('#areaId').val(departCityList[0].areaId);
                    $('#areaCode').val(departCityList[0].areaCode);
                    $('#setCityButton').html(departCityList[0].name);
                }
            }
            selectCity();
        }
    });
}

//初始化城市列表
function htmlCity(city){
    var html="";
    if($('#city'+city.firstLetter+'').length>0){
        if($('#'+city.name).length<=0){
            html = '<li id="'+city.name+'">'+city.name+"</li>" ;
            $("#city"+city.firstLetter+'').append(html);
        }
    }else{
        html = '<div class="sui-list-title" id="#city'+city.firstLetter+'">'+city.firstLetter+'</div>'+
            '<ul id="city'+city.firstLetter+'" class="sui-list"><li id="'+city.name+'">'+city.name+"</li></ui>" ;
        $('#cityUl').append(html);
        // $("#cityList").append(html);

        var cityHtml='<li><a href="#city'+city.firstLetter+'">'+city.firstLetter+'</a></li>';
        $('.nav-city').append(cityHtml);
    }

    $('#'+city.name).off('tap').on('tap', function() {
        $('#searchResult').html('');
        $('.serach-input input').val('');
        var data = {
            areaCode:city.areaCode,
            name:$(this).text(),
            areaId:city.areaId
        }
        $('#change-Citys').setPopupData(data);
        if(city.areaCode !=""){
            $("#areaCode").val(city.areaCode);
            $("#areaId").val(city.areaId);

        }
        $('#change-Citys').closePopup(function() {
            if(_myIScrollsc) {
                _myIScrollsc.destroy();
                _myIScrollsc = null;
            }
        });
    });
}

//初始化城市与车站
function initStation(){
    $.ajax({
        type: 'POST',
        url: '/busTicket/getStation',
        data: {token:$.cookie('token')},
        dataType:  'json',
        success: function(data){
            $.hideLoading();
            if(data.code==0){
                var departStationList = data.data.departStation;
                var arriveStationList = data.data.arriveStation;
                sessionStorage.setItem('departStationList',JSON.stringify(departStationList));
                sessionStorage.setItem('arriveStationList',JSON.stringify(arriveStationList));

                $("#departStationList").html("");
                $("#arriveStationList").html("");
                htmlStation(departStationList,1);
                htmlStation(arriveStationList,2);

                $("#departCityList ul").html("");
                $("#arriveCityList ul").html("");
                cityAreaHtml(departStationList,1);
                cityAreaHtml(arriveStationList,2);
            }
        }
    });
}

function cityAreaHtml(areaList,type){
    var html="";
    if(areaList.length==0){
        return;
    }
    var all = "#All"+type;
    html = '<li  class="active" data-linkage="'+all+'" data-id="0"><a href="javascript:void(0);">全部</a></li>';
    for(var i=0;i<areaList.length;i++){

        var area=areaList[i];
        if(area.areaCode === $('#areaCode').val()){
            html += '<li data-linkage="#'+area.areaId+type+'" data-id="'+area.id+'"><a href="javascript:void(0);">'+area.name+'</a></li>';
        }

    }
    if(type==1){
        $("#departCityList ul").append(html);
    }else{
        $("#arriveCityList ul").append(html);
    }
    linkclick();
}

function htmlStation(areaList,type){
    var html="";
    var allHtml = ""
    var city_name = $('#setCityButton').html();
    var area_code = $('#areaCode').val();
    var areaId = $('#areaId').val();
    for(var j=0;j<areaList.length;j++){
        var subHtml="";
        var city=areaList[j];
        if(city.areaCode === area_code){
            var station = city.stationList;
            for(var i=0;i<station.length;i++){
                subHtml+='<li data-cityname="'+city.name+'" data-value="'+station[i].stationName+'" data-id="'+station[i].providerId+'" data-code="'+station[i].areaCode+'" data-areaid="'+city.areaId+'"><a href="javascript:void(0);">'+station[i].stationName+'</a></li>';
                allHtml+='<li data-cityname="'+city.name+'" data-value="'+station[i].stationName+'" data-id="'+station[i].providerId+'" data-code="'+station[i].areaCode+'" data-areaid="'+city.areaId+'"><a href="javascript:void(0);">'+station[i].stationName+'</a></li>'
            }
            html+='<ul id="'+city.areaId+type+'" class="item fy-list-link">'+
                '<li data-value="不限" data-cityname="'+city.name+'" data-id="0" data-code="0" data-areaid='+city.areaId+'><a href="javascript:void(0);"  >不限</a></li>'+
                subHtml
                +'</ul>';
        }

    }
    var all= "All"+type;
    if(areaId != ""){
        var all_ul = '<ul id="'+all+'" class="item fy-list-link">'+
            '<li data-value="不限" data-cityname="'+city_name+'" data-id="0" data-code="0" data-areaid='+areaId+'><a href="javascript:void(0);"  >不限</a></li>'+
            allHtml
            +'</ul>';
    }

    if(type==1){
        $("#departStationList").append(all_ul);
        $("#departStationList").append(html);
    }else{
        $("#arriveStationList").append(all_ul);
        $("#arriveStationList").append(html);
    }
    linkclick();
}

//选中事件
function linkclick(){
    //选择城市：显示对应的车站
    $('[data-linkage]').off('click').on('click', function () {
        var self = $(this);
        var target = self.data('linkage');
        $(target).show().siblings('.item').hide();
    });

    //点击城市或车站
    $('#select-Citys .main .item li').on('click', function () {
        var self = $(this);

        self.addClass('active').siblings().removeClass('active');

        //去除其他active
        if(self.parent().siblings().length > 0) {
            self.parent().siblings().find('li.active').removeClass('active');
        }
        //车站选中,返回事件
        if(self.parents('.right').length > 0) {
            var popup = $('#select-Citys');
            var value = self.data('value'),
                trigger = popup.data('trigger');

            var stationId = self.data('id');
            var areaId = self.data('areaid');
            var stationName = self.data('value');
            var cityName=self.data('cityname');
            popup.closePopup(function () {
                value=cityName+"-"+value;
                $(trigger).val(value);
                $(trigger).attr("data-stationid",stationId);
                $(trigger).attr("data-cityid",areaId);
                $(trigger).attr("data-stationname",stationName);
            });
        }
    });
    //active自动选中
    $('[data-linkage].active').click();
}


//关键词搜索结果 - new (动态生成HTML并绑定事件)
var cpLock = true;
// 选择地址
var _isInitsa = false, _myIScrollsa;
$(".serach-input input").focus(function(){
    $('#btnBack').hide();
    $('#cityListContent').hide();
    $('#searchResult').html('');
    $('#searchWrapper').show();
});

$('.serach-input input').off('input').on({
    //解决input事件在输入中文时多次触发事件问题
    compositionstart: function () {//中文输入开始
        cpLock = false;
    },
    compositionend: function () {//中文输入结束
        cpLock = true;
    },
    input:function () {
        $('#cityListContent').hide();
        $('#searchResult').html('');
        $('#searchWrapper').show();
        setTimeout(function () {
            if(cpLock){
                var searchTxt=$('.serach-input input').val();

                var param = {
                    areaCode : $('#areaCode').val(),
                    searchTxt:searchTxt,
                    stationType:sessionStorage.getItem('stationType')
                }
                var listArr = searchAddress(param);
                if(listArr.length > 0){
                    if (param.stationType == 1) {
                        var cityList = JSON.parse(sessionStorage.getItem('departCityList'))
                    } else {
                        var cityList = JSON.parse(sessionStorage.getItem('arriveCityList'))
                    }

                    var strHtml = '';
                    listArr.forEach(function (item,index) {
                        cityList.forEach(function (city,c) {
                            if(item.areaCode === city.areaCode){
                                strHtml += '<li>' +
                                    '<div class="sui-cell-map" data-areaid="'+item.areaId+'" data-cityname="'+city.name+'" data-areaname="'+item.areaName+'" data-stationname="'+item.stationName+'">' +
                                    '<h1>'+item.stationName+'</h1>' +
                                    '<h2>'+city.name+item.areaName+'</h2>' +
                                    '</div>' +
                                    '</li>';
                            }
                        })
                    })
                    $('#searchResult').html(strHtml);
                    searchClickEvent();
                    // 这句不能少，否则超出屏幕不能滚动。
                    if(_myIScrollsa) _myIScrollsa.refresh();
                }

            }
        },0);
    }
});

//搜索地址
function searchAddress(param){
    var arr = [];
    if($.trim(param.searchTxt) != '') {
        //内容不为空，隐藏下面的信息
        //正则表达式
        var list = [];
        if (param.stationType == 1) {
            list = JSON.parse(sessionStorage.getItem('departStationList'))
        } else {
            list = JSON.parse(sessionStorage.getItem('arriveStationList'))
        }
        var len = list.length;
        list.forEach(function (area, index) {
            //如果字符串中不包含目标字符会返回-1
                area.stationList.forEach(function (station,station_index) {
                    if (station.stationName.indexOf(param.searchTxt)>=0) {
                        var item = {
                            areaId:area.areaId,
                            areaCode:area.areaCode,
                            areaName:area.name,
                            stationName:station.stationName
                        }
                        if(area.areaCode === $('#areaCode').val()){
                            arr.splice(0,0,item);
                        }else {
                            arr.push(item);
                        }
                    }
                })

        })
        return arr;
    }

    return arr;
}

function searchClickEvent(){
    var targetType = isAndroid() ? 'tap' : 'click';

    $('#searchResult').children('li').off(targetType).on(targetType, function() {
            var self = $(this);
            if (self.find('h1').text() != null) {
                var popup = $('#select-Citys');
                    trigger = popup.data('trigger');

                var stationId = self.find('div').data('areaid');
                var areaId = self.find('div').data('areaid');
                var stationName = self.find('div').data('stationname');
                var areaName = self.find('div').data('areaname');
                var cityName= self.find('div').data('cityname');
                popup.closePopup(function () {
                    $('#searchResult').html('');
                    $('.serach-input input').val('');
                    $('#cityListContent').show();
                    $('#searchWrapper').hide();
                    $(trigger).val(areaName+"-"+stationName);
                    $(trigger).attr("data-stationid",stationId);
                    $(trigger).attr("data-cityid",areaId);
                    $(trigger).attr("data-stationname",stationName);
                });
            }
    });
}

//关闭地址查询
$('#select-Citys .back').on('click', function() {
    $('.serach-input input').val('');
    $('#searchResult').html('');
    $('#cityListContent').show();
    $('#searchWrapper').hide();
    $('#btnBack').show();
        if(_myIScrollsa) {
            _isInitsa = false;
            _myIScrollsa.destroy();
            _myIScrollsa = null;
        }
    $('#select-Citys').closePopup(function() {
    });

});
// 关闭选择城市
$('#select-Citys .cancel').on('click', function() {
    $('#select-Citys').closePopup(function() {
        // if(_myIScrollsa) {
        //     _myIScrollsa.destroy();
        //     _myIScrollsa = null;
        // }
    });
});


//-------------选择城市-------------
// 打开选择城市
var  _myIScrollsc;
$('#setCityButton').on('click', function() {
    var _this = $(this);
    $('#change-Citys').popup('push', function() {
        setTimeout(function() {
            $('#change-Citys .wrapper').css('height', $(window).height() - 44);
             _myIScrollsc = new IScroll('#cityWrapper');

            retrieveWord(function (el) {
                _myIScrollsc.scrollToElement(el.attr('href'));
            });

        }, 300);
    }, function(data) {
        $.showLoading();
        var data = data;
        _this.text(data.name);
        var departStationList = JSON.parse(sessionStorage.getItem('departStationList'));
        var arriveStationList = JSON.parse(sessionStorage.getItem('arriveStationList'));
        $("#departStationList").html("");
        $("#arriveStationList").html("");
        htmlStation(departStationList,1);
        htmlStation(arriveStationList,2);

        $("#departCityList ul").html("");
        $("#arriveCityList ul").html("");
        cityAreaHtml(departStationList,1);
        cityAreaHtml(arriveStationList,2);
        $.hideLoading();
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

// ================================= 选择城市相关 ===================================

// 选择城市
$('#change-Citys .wrapper li').on('tap', function() {
    var data = $(this).text();
    $('#change-Citys').setPopupData(data);
    $('#change-Citys .cancel').triggerHandler('click');
});

// 关闭选择城市
$('#change-Citys .cancel').on('click', function() {
    $('#change-Citys').closePopup(function() {
        if(_myIScrollsc) {
            _myIScrollsc.destroy();
            _myIScrollsc = null;
        }
    });
});

//-----------------------------------
$(".search-btn").on('click',function(){
    var departDate=$('#startTime').data("departdate");
    var departStationId=$('#startAddr').data("stationid");
    var arriveStationId=$('#endAddr').data("stationid");
    var departPid=$('#startAddr').data("cityid");
    var arrivePid=$('#endAddr').data("cityid");
    var departStationName=$('#startAddr').data("stationname");
    var arriveStationName=$('#endAddr').data("stationname");

    if(departStationId==null){
        $.toast("请选择出发地");
        return;
    }
    if(arriveStationId==null ){
        $.toast("请选择目的地");
        return;
    }
    window.location.href=encodeURI("/busTicket/queryLineList?departPid="+departPid+"&arrivePid="+arrivePid+"&departStation="+departStationName+"&arriveStation="+arriveStationName+"&departDate="+departDate+"");
});
$(".foot-btn-bus").on('click',function(){
    window.location.href="/trip/toTripListPage"
});

//监听文字变化，重设宽度
function reSetWidth(o) {
    var _html = $('<div>' + o.val() + '</div>');
    _html.css({
        position: 'absolute',
        top: '-9999px',
        zIndex: -9999,
        paddingLeft: o.css('padding-left'),
        paddingRight: o.css('padding-right'),
        fontSize: o.css('font-size'),
        fontWeight: o.css('font-weight'),
        fontFamily: o.css('font-family')
    });
    o.after(_html);

    var w = (_html.width() + 10) / parseFloat($('html').css('font-size')) + 'rem'
    o.width(w);

    _html.remove();
}

/*
* 选择日期
* */
function selectDate() {
    var trigger = $('#startTime'),
        parent = $('#select-date');
    cancel = parent.find('.cancel');
    var initDateStatus = false;
    var currentDateStr = $('#currentDateStr').val();
    var today = dateStrToDate(currentDateStr);
    var show_day=new Array('星期日','星期一','星期二','星期三','星期四','星期五','星期六');
    var val =(today.getMonth() + 1) + '月' + today.getDate() + '日 ' + show_day[today.getDay()]+'(今天)';
    var departDate=today.getFullYear() +'-'+ (today.getMonth()+1) +'-'+ today.getDate();
    trigger.val(val);
    trigger.attr("data-departDate",departDate);
    reSetWidth(trigger);
    var init = function () {
        //只初始化一次
        if(!initDateStatus) {
            initDateStatus = true;
            var timeData = createData();
            parent.find('.date').datePicker({
                dateBase: currentDateStr,
                multiple: false,
                weekend: true,
                after:timeData.monthNum,
                gather: timeData.resultArray,
                selectCallback: function (data) {
                    //TODO
                    var d = data.selectData[0].date;
                    var val = d.month + '月' + d.day + '日  ' + d.week;

                    //是否是今天
                    // var today = new Date();
                    if(today.getFullYear() == d.year && today.getMonth() + 1 == d.month && today.getDate() == d.day) {
                        val += '(今天)';
                    }

                    var departDate=d.year+'-'+d.month+'-'+d.day;
                    trigger.val(val);
                    trigger.attr("data-departDate",departDate);
                    reSetWidth(trigger);
                    cancel.triggerHandler('click');
                }
            });
        }
    };

    //弹出层
    trigger.on('click', function () {
        var self = $(this);

        parent.popup('modal', init, function (data) {
            trigger.val(data);
            reSetWidth(trigger);
        });
    }).backtrack({
        cancel: '#select-date .cancel'
    });

    //返回
    $('#select-date .cancel').on('click', function () {
        parent.closePopup();
    })
}

//创建随机数据
function createData() {
    var result = {};
    var resultArray = []
    var months = [];

    var presellDay  = $('#presellDay').val();
    var currentDateStr = $('#currentDateStr').val();
    for(var i=0;i<presellDay;i++){
        var dateStr = dateStrAddDay(currentDateStr,i);
        var _result = {
            date: dateStr,
            state: 'select',
        };
        resultArray.push(_result);

        var m = getMonth(dateStr);
        if($.inArray(m, months)==-1){
            months.push(m);
        }
    }

    result.resultArray = resultArray;
    result.monthNum = months.length -1;
    //console.log(JSON.stringify(result));
    return result;
}

function getMonth(timestamp) {
    var d = new Date(timestamp);
    var month = d.getMonth() + 1;
    return month;
}

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