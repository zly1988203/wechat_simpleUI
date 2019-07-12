<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${providerName!'中交出行'}邀您定制路线</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/fy-datepicker.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/bus.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/line/new-lines.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>
<div class="all-content">

    <div class="main">
        <div class="title"></div>
        <div class="tips"><a href="#">线路开通说明<i>&gt;</i></a></div>
        <!-- 线路开通说明 -->
        <div class="tips-info-content" style="display: none">
            <div class="tips-info">
                <a class="close"></a>
               ${rule!''}
            </div>
        </div>
        <div class="line-info">
            <form>
                <ul>
                    <li>
                        <div class="station start">
                            <input id="startAddr" type="text" class="select-city-btn" placeholder="请选择出发地" readonly />
                        </div>
                    </li>
                    <li>
                        <div class="station end">
                            <input id="endAddr" type="text" class="select-city-btn" placeholder="请选择目的地" readonly />
                        </div>
                    </li>
                    <li>
                        <div class="info-date">
                            <label>出发日期</label><input id="startTime" class="trip-time" type="text" value="" readonly />
                        </div>
                    </li>
                    <li>
                        <label class="info-flag" for="returnFlag">
                            <span><input type="checkbox" id="returnFlag"/></span>
                            <label for="returnFlag">需要返程</label>
                        </label>
                    </li>
                    <li style="display: none">
                        <div class="info-date return-date">
                            <label>返程日期</label><input id="returnTime" class="trip-time" type="text"  value="" readonly />
                        </div>
                    </li>
                    <li>
                        <div class="info-phone">
                            <label>联系手机号</label><input id="phoneNO" class="phone-num" type="number" value="" oninput="if(value.length>11)value=value.slice(0,11)"/>
                        </div>
                    </li>
                </ul>
            </form>
        </div>
    </div>

    <!--提交按钮-->
    <div class="btn-commit">
        <button id="commit"></button>
    </div>



    <!-- 选择日期 -->
    <div id="select-date" class="sui-popup-container" data-trigger="">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <div class="date"></div>
            <div class="btn-group">
                <div class="btn primary cancel">返回</div>
            </div>
        </div>
    </div>

    <!--查询地址-->
    <div id="search-address" class="sui-popup-container">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <div class="search-bar">
                <div class="search-bar-inner">
                    <div class="tools-control">
                       <div id="setCityButton" class="set-city">深圳</div>
                        <input type="hidden" id="areaCode" value="0755">
                        <div class="serach-input">
                            <input type="text" placeholder="请输入搜索关键字" />
                        </div>
                    </div>
                    <button  type="button" class="cancel">取消</button>
                </div>
            </div>

            <div id="searchWrapper" class="wrapper">
                <div class="content">
                    <ul id="searchResult" class="sui-list">
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!--选择城市-->
    <div id="select-Citys" class="sui-popup-container">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <div class="search-bar sui-border-b">
                <div class="search-bar-inner">
                    <div class="tools-control search-city">
                        <!--<div class="serach-input sui-border">
                            <input type="text" placeholder="城市中文名或拼音" />
                        </div>-->
                        请选择城市
                    </div>
                    <button  type="button" class="cancel">取消</button>
                </div>
            </div>

            <!-- 字母检索 -->
            <ul class="nav-city">
            </ul>
 			<div id="cityWrapper" class="wrapper">
               <div class="content" id="cityList">
                    <div class="current-city">当前定位城市：深圳市</div>
                    
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/coach/fy-datePicker.min.js?v=${version!}"></script>
<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.3&key=65b7cb5e8c694cb822cd32791319b348"></script>
<script src="/js/date.js?v=${version}"></script>
<script type="text/javascript" src="/js/shareConfig.js?v=${version!}"></script>
<script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
<script>
 var shareWechat = function(){
    	var reqUrl = CURRENT_SERVER + '/activity/require/line'
		var shareObj = {
        		url : window.location.href,			
				logo : CURRENT_SERVER + '/res/images/line/line_require_share@2x.png',
    			desc : "点击申请线路，不转车直接到家",
    			title: "呼叫老乡！快来和我一起定制春节回家班车"
		}
		wxLineRequireShare(shareObj,reqUrl,getGpsCallback);
    }

 /**********自动定位************************/
 var geocoder;//地图对象


    $(function(){
    	shareWechat();
    	
        //需要返程
        var _checked = false;//需要返程选项是否选中
        var initDateStatus = false;//已经初始化标志

        $('.info-flag').on('click',function () {
            _checked = $('#returnFlag').prop('checked');
            console.log('是否需要返程：' + _checked)
            if(_checked){
            	$('#returnTime').val("");//清空缓存日期
                //返程日期显示
                if($.trim($('#returnTime').val()).length > 0){
                    $('.return-date').parent().show().css('opacity','1');
                }else{
                    $('.return-date').parent().show().css('opacity','0.4');
                }

                //自身样式改变
                $(this).parents('li').addClass('active');
                $(this).children('span').addClass('active');
            }else{
                //返程日期隐藏
                $('.return-date').parent().hide();
                $('#startTime').removeClass('input-error');//去掉错误提示样式
                $(this).parents('li').removeClass('active');
                $(this).children('span').removeClass('active');
            }
        });

        //申请开通按钮点击事件
        var param = {};
        $('#commit').on('click',function () {
        	param = {};
            // 获取填写信息
            //getInfo();
            var _startAddr = $.trim($('#startAddr').val());
            var _endAddr = $.trim($('#endAddr').val());
            var _startTime = $.trim($('#startTime').val());
            var _returnTime = $.trim($('#returnTime').val());
            var _phoneNO = $.trim($('#phoneNO').val());
          
            if(_startAddr.length==0){
                $.toast('请选择出发地');
                return;
            }
            if(_endAddr.length==0){
                $.toast('请选择目的地');
                return;
            }
            if(_startAddr == _endAddr){
            	 $.toast('出发地和目的地不能相同');
                 return;
            }
            if(_startTime.length==0){
                $.toast('请选择出发时间');
                return;
            }
            // 选中返程才有校验
            var isBack = 0;
            if(_checked){
            	isBack = 1;
                if(_returnTime.length==0){
                   $.toast('请选择返程时间');
                   return;
                }
                var returnTimeL = Date.parse(new Date(_returnTime));
                var startTimeL = Date.parse(new Date(_startTime));
                if(startTimeL > returnTimeL){
                	 $.toast('返程时间不能早于出发时间');
                     return;
                }
            }else{
            	isBack = 0;
            	$('#returnTime').val("");
            }
            if(_phoneNO.length==0){
                $.toast('请输入手机号');
                return;
            }
            if(!(/^1\d{10}$/.test(_phoneNO))){ 
            	$.toast("请输入正确的手机号码");  
                return false; 
            }
            param = {
			   		 'departAddress' : _startAddr,
			   		 'arriveAddress' : _endAddr,
			   		 'departDate' : _startTime,
			   		 'departProvinceId' : lineParam['departProvinceId'],
			   		 'departProvince' : lineParam['departProvinceName'],
			   		 'departCityId' : lineParam['departCityId'],
			   		 'departCity' : lineParam['departCityName'],
			   		 'departAreaId' : lineParam['departAreaId'],
			   		 'departArea' : lineParam['departAreaName'],
			   		 'arriveProvinceId' : lineParam['arriveProvinceId'],
			   		 'arriveProvince' : lineParam['arriveProvinceName'],
			   		 'arriveCityId' : lineParam['arriveCityId'],
			   		 'arriveCity' : lineParam['arriveCityName'],
			   		 'arriveAreaId' : lineParam['arriveAreaId'],
			   		 'arriveArea' : lineParam['arriveAreaName'],
			   		 'mobile' : _phoneNO,
			   		 'isBack' : isBack,
			   		 'backDate' : _returnTime
   					} 
            
            var _html = '';
            if(_checked){
                //需要返程
                _html = '<div class="dialog-content">'+
                        '<ul>'+
                            '<li>'+
                                '<dl class="sui-cell-default">' +
                                    '<dt class="">出发地</dt>'+
                                    '<dd class="value">'+ _startAddr +'</dd>'+
                                '</dl>'+
                            '</li>'+
                            '<li>'+
                                '<dl class="sui-cell-default">' +
                                    '<dt class="">目的地</dt>'+
                                    '<dd class="value">'+ _endAddr +'</dd>'+
                                '</dl>'+
                            '</li>'+
                            '<li>'+
                                '<dl class="sui-cell-default">' +
                                    '<dt class="">出发日期</dt>'+
                                    '<dd class="value">'+ _startTime +'</dd>'+
                                '</dl>'+
                            '</li>'+
                            // 勾选返程，才展示返程信息，否则不展示
                            '<li>'+
                                '<dl class="sui-cell-default">' +
                                    '<dt class="">返程日期</dt>'+
                                    '<dd class="value">' + _returnTime+ '</dd>'+
                                '</dl>'+
                            '</li>'+
                            '<li>'+
                                '<dl class="sui-cell-default">' +
                                    '<dt class="">联系手机</dt>'+
                                    '<dd class="value">' + _phoneNO + '</dd>'+
                                '</dl>'+
                            '</li>'+
                        '</ul>'+
                    '</div>'
            }else{
            //不需要返程
            _html = '<div class="dialog-content">'+
                    '<ul>'+
                        '<li>'+
                            '<dl class="sui-cell-default">' +
                                '<dt class="">出发地</dt>'+
                                '<dd class="value">'+ _startAddr +'</dd>'+
                            '</dl>'+
                        '</li>'+
                        '<li>'+
                            '<dl class="sui-cell-default">' +
                                '<dt class="">目的地</dt>'+
                                '<dd class="value">'+ _endAddr +'</dd>'+
                            '</dl>'+
                        '</li>'+
                        '<li>'+
                            '<dl class="sui-cell-default">' +
                                '<dt class="">出发日期</dt>'+
                                '<dd class="value">'+ _startTime +'</dd>'+
                            '</dl>'+
                        '</li>'+
                        '<li>'+
                            '<dl class="sui-cell-default">' +
                                '<dt class="">联系手机</dt>'+
                                '<dd class="value">' + _phoneNO + '</dd>'+
                            '</dl>'+
                        '</li>'+
                    '</ul>'+
                '</div>'
            }

            //添加线路操作
            $.confirm(_html, function() {
                var url = "/activity/require/add"
                $.post(url,param,function(result){
                	var code = result.code;
                	if(code!=0){
                		 $.toast(result.message);
                	}else{
                		window.location.href = '/activity/require/success';
                	}
                },'json');
            });

            //清除弹框横线
            $('.sui-dialog-bd').removeClass('sui-border-b');
        });

        //线路开通说明
        $('.tips a').on('click',function(){
            $('.tips-info-content').css('display','block');
            //关闭按钮
            $('.close').on('click',function(){
                $('.tips-info-content').hide();
            });
        });
        //点击线路开通说明空白部分，线路开通说明消失
        $('.tips-info-content').on('click',function(){
            $(this).hide();
        });
        //阻止事件冒泡
        $('.tips-info').on('click',function (event) {
            event.stopPropagation();
        });

//        手机号输入样式改变
       $('#phoneNO').on('input',function () {
            var _this = this;
            var _elVal = $.trim($(_this).val());
            if(_elVal.length > 0){
                $(_this).parents('li').addClass('active');
                $(this).addClass('input-error');
                //校验手机号 1开头的11位
                if((_elVal.length == 11) && (_elVal[0] == '1')){
                    $(this).removeClass('input-error');
                }
            }else{
                $(_this).parents('li').removeClass('active');
            }
        });

        /*创建随机数据*/
        function createData() {
        	var result = {};
			var resultArray = []
			var months = [];
			var currDate = new Date();
			var currDateStr = currDate.getFullYear()+'-'+(currDate.getMonth()+1)+'-'+currDate.getDate();
			for(var i=0;i<366;i++){
	        	var dateStr1 = dateStrAddDay(currDateStr,i);
	        	var _result = {
	                    date: dateStr1,
	                    state: 'select',
	               };
	        	resultArray.push(_result);
	        	
	        	var m = getMonth(dateStr1);
				if($.inArray(m, months)==-1){
					months.push(m);
				}
	        }
			
			result.resultArray = resultArray;
			result.monthNum = months.length -1;
			return result;
        }

        /*选择日期*/
        $('.trip-time').on('click',function () {
            var trigger = $(this);
            var  parent = $('#select-date'),
                cancel = parent.find('.cancel');

            var init = function () {
                //只初始化一次
                if(!initDateStatus) {
                    initDateStatus = true;
                    var timeData = createData();
                    var today = new Date();
                    var month = today.getMonth() + 1;
                    var currentDay = today.getFullYear() + '-' + month;
                    parent.find('.date').datePicker({
                        dateBase: currentDay,
                        weekend: true,
                        multiple: false,
                        after:timeData.monthNum,
                		gather: timeData.resultArray,
                        selectCallback: function (data) {
                            var d = data.selectData[0].date;
                            var month = d.month;
                            var day = d.day;
                            if(month < 10){
                            	month = '0' + month;
                            }
                            if(day < 10) {
                            	day = '0' + day;
                            }
                            var val = d.year + '-' + month + '-' + day;
                            parent.setPopupData(val);
                            cancel.triggerHandler('click');
                        }
                    });
                }
            };

            parent.popup('modal', init, function (data) {
                trigger.val(data);
                $(trigger).parents('li').css('opacity','1');
                
             // 校验日期 返程日期不能早于出发日期
                var _startTime = $('#startTime').val();
                var start = new Date(_startTime.replace("-", "/").replace("-", "/"));
                var _end = $('#returnTime').val();
                var end = new Date(_end.replace("-", "/").replace("-", "/"));
                if ((end.length != 0) && (start > end)){
                    $.toast('返程日期不能早于出发日期');
                    $(trigger).addClass('input-error');
                }else{
                    $('#startTime').removeClass('input-error');
                    $('#returnTime').removeClass('input-error');
                }
            });

            //返回
            $('#select-date .cancel').on('click', function () {
                parent.closePopup();
            });
        });
    });
    
    
    
    //
	var lineParam={};//保存起止点的经纬度信息
	lineParam["departLng"] = '${departLng!''}';
	lineParam["departLat"] = '${departLat!''}';
	lineParam["arriveLng"] = '${arriveLng!''}';
	lineParam["arriveLat"] = '${arriveLat!''}';
	lineParam["departCityName"] = '${departCityName!''}';
	lineParam["arriveCityName"] = '${arriveCityName!''}';
	$('#startAddr').val('${startAddr!''}');
	$('#endAddr').val('${endAddr!''}');
	
	if(lineParam["departLng"]!='' && lineParam["departLat"]!='' && lineParam["arriveLng"]!='' && lineParam["arriveLat"]!=''){
		  $('#searchBtn').attr("class","search-btn");
	}
	
	//gps定位
	//后台搜索高德地址后回调
	var searchMapAddCallback=function searchAddressCallback(data){
		$('#startAddr').val(data.address);
		$('#currentAddressDetail').html(data.address);
		$('#currentAddressDetail').attr('data-lng',lineParam['departLng']);
		$('#currentAddressDetail').attr('data-lat',lineParam['departLat']);
		$('#currentAddress').show(); 
   	}
    //根据gps获取地理位置
    var getGpsCallback=function getAddressByGps(callbackData){
    	var gpsData=callbackData['longitude']+","+callbackData['latitude'];
    	lineParam['departLng']=callbackData['longitude'];//经度
        lineParam['departLat']=callbackData['latitude'];//纬度
        var gpsParam = [callbackData['longitude'],callbackData['latitude']];
        geoCallBack(1,gpsParam);
    	searchAddressByGps(gpsData,searchMapAddCallback);
    	if(lineParam["arriveLng"]!='' && lineParam["arriveLat"]!=''){
    		$('#searchBtn').attr("class","search-btn");
    	}
    	//解析当前定位获取城市名和城市编码
    	analyse(gpsParam);
    }
    
    
    function analyse(lnglatXY){
      	 geocoder.getAddress(lnglatXY,function(status,result){
               if(status=='complete'){
           	     var adcode=result.regeocode.addressComponent.adcode;//
                 //东莞做特殊处理
               	 if(adcode == '441900'){
               		 adcode = '441901';
               	 }
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
           	 var areaName = result.regeocode.addressComponent.district;//
           	 var cityName = result.regeocode.addressComponent.city;
           	 var provinceName = result.regeocode.addressComponent.province;
           	 
         	 var areaCode = result.regeocode.addressComponent.adcode;
         	 if(areaCode == '441900'){
         		areaCode = '441901';
         		areaName = cityName;
          	 }
           	var cityCode = areaCode.substring(0,4) + "00";
           	var provinceCode = areaCode.substring(0,2);
           	 if(cityName == null || cityName == ""){
           		cityName = provinceName;
           		cityCode = provinceCode;
           	 }
           	 if(type==1){
           		 lineParam['departAreaName'] = areaName;
           		 lineParam['departCityName'] = cityName;
           		 lineParam['departProvinceName'] = provinceName;
           		 lineParam['departAreaId'] = areaCode;
           		 lineParam['departCityId'] = cityCode;
           		 lineParam['departProvinceId'] = provinceCode;
           		 
           	 }else if(type==2){
           		 lineParam['arriveAreaName'] = areaName;
           		 lineParam['arriveCityName'] = cityName;
           		 lineParam['arriveProvinceName'] = provinceName;
           		 lineParam['arriveAreaId'] = areaCode;
           		 lineParam['arriveCityId'] = cityCode;
           		 lineParam['arriveProvinceId'] = provinceCode;
           	 }
            }
            $.hideLoading();
       })
   }
	    
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
	
	AMap.service(["AMap.PlaceSearch"], function() {
	    var placeSearchOptions = { //构造地点查询类
	            pageSize: 10,
	            pageIndex: 1,
	            city: $("#areaCode").val(), //城市
	        };
	    
	    //地理位置搜索
	    placeSearch= new AMap.PlaceSearch(placeSearchOptions);
    });  
  
    
    $(function() {
        initCity();
       
        //交换地址
        $('.exchange').on('click', function() {
            var startAddr = $('#startAddr').val();
            var endAddr = $('#endAddr').val();
            $('#startAddr').val(endAddr);
            $('#endAddr').val(startAddr);
            var departLng = lineParam['departLng'];
            var departLat = lineParam['departLat'];
            var arriveLng = lineParam['arriveLng'];
            var arriveLat = lineParam['arriveLat'];
            var departCityName = lineParam['departCityName'];
            var arriveCityName = lineParam['arriveCityName'];
            lineParam['departLng'] = arriveLng;
            lineParam['departLat'] = arriveLat;
            lineParam['arriveLng'] = departLng;
            lineParam['arriveLat'] = departLat;
            lineParam['departCityName'] = arriveCityName;
            lineParam['arriveCityName'] = departCityName;
        });
        


      
        // ================================= 选择地址相关 ===================================
        
        // 选择地址
        var _isInitsa = false, _myIScrollsa;
        $('.select-city-btn').on('click', function() {
        	
            var _this = $(this);
            
            showHistoryInfo();
            $('#search-address').popup('push', function() {
/*                 if(_isInitsa) return;
                _isInitsa = true;
 */                setTimeout(function() {
                    $('#search-address .wrapper').css('height', $(window).height() - 44);
                    _myIScrollsa = new IScroll('#searchWrapper');
                }, 300);
            }, function(data) {
            	$.showLoading();
                _this.val(data.name);
                if(_this.attr('id') == 'startAddr'){
	               lineParam['departLng'] = data.lng;
	               lineParam['departLat'] = data.lat;
	               var gpsParam=[data.lng,data.lat];
	               geoCallBack(1,gpsParam);
	               //查询按钮是否可点
	               if(lineParam['arriveLng'] !=null && lineParam['arriveLat'] !=null && lineParam['arriveLng'] !='' && lineParam['arriveLat'] !=''){
	            	   $('#searchBtn').attr("class","search-btn");
	               }
                }else if(_this.attr('id')== 'endAddr'){
                	lineParam['arriveLng'] = data.lng;
	               	lineParam['arriveLat'] = data.lat;
	               	var gpsParam=[data.lng,data.lat];
	               	geoCallBack(2,gpsParam);
	               	if(lineParam['departLng'] !=null && lineParam['departLat'] !=null && lineParam['departLng'] !='' && lineParam['departLat'] !=''){
	               		$('#searchBtn').attr("class","search-btn");
	               }
                }
                $(_this).parents('li').addClass('active');    
                
                //校验目的地 检查选择的地址是否相同
                var _startAddr = $('#startAddr').val();
                var _endAddr = $('#endAddr').val();
                if(_startAddr == _endAddr){
                    $.toast('出发地与目的地不能相同');
                    $(_this).addClass('input-error');
                }else{
                    $('#startAddr').removeClass('input-error');
                    $('#endAddr').removeClass('input-error');
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
                  	 _isInitsa = false;
                     _myIScrollsa.destroy();
                    _myIScrollsa = null; 
                }
            });
        });
        
        //选择当前位置返回首页
        $('#search-address .current .station-group span').on('click', function () {
            var data = $(this).text();
            $('#search-address').setPopupData(data);
            $('#search-address .cancel').triggerHandler('click');
        });
        
        
        // 打开选择城市
		var _isInitsc = false, _myIScrollsc;
         $('#setCityButton').on('click', function() {
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

        
        // ================================= 选择城市相关 ===================================
        
        // 选择城市
        $('#select-Citys .wrapper li').on('tap', function() {
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
        });
		
		//关键词搜索结果 - new (动态生成HTML并绑定事件)
		$('.serach-input input').off('input').on('input', function() {
			var searchLocation=$(this).val();
        	searchAddress(searchLocation);
		});
		
		//搜索地址
	    function searchAddress(param){
            placeSearch.search(param, callback);
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
	    
	     function initCity(){
	   		$.ajax({
	   	        type: 'POST',
	   	        url: '/activity/require/getAllCitys',
	   	        data: null,
	   	        dataType:  'json',
	   	        success: function(data){
	   	        	var i = 0;
	   	        	if(data.code==0){
	   	        		cityList = data.data;
	                 	var html = "";
	                 	if(cityList.length == 0){
	                 		return;
	                 	}
	   	        		for(i;i<cityList.length;i++){
	   	        			htmlSub(cityList[i]);
	   	        		}
	   	        	}
	   	        }
	   		});
	    }
	     
	    function htmlSub(city){
	    	var html="";
	    	if($('#city'+city.firstLetter+'').length>0){
	    		if($('#'+city.name).length<=0){
	    			html = '<li id="'+city.name+'">'+city.name+"</li>" ;
	    			$("#city"+city.firstLetter+'').append(html);    			
	    		}
			}else{
				html = '<div class="sui-list-title" id="#city'+city.firstLetter+'">'+city.firstLetter+'</div>'+
				'<ul id="city'+city.firstLetter+'" class="sui-list"><li id="'+city.name+'">'+city.name+"</li></ui>" ;
				$("#cityList").append(html);
				
				var cityHtml='<li><a href="#city'+city.firstLetter+'">'+city.firstLetter+'</a></li>';
			    $('.nav-city').append(cityHtml);
			}
	    	
	    	$('#'+city.name).off('tap').on('tap', function() {
	    		$('#searchResult').html('');
	    		$('.serach-input input').val('');
	    		var text = $(this).text();
	            $('#select-Citys').setPopupData(text);
	            if(city.areaCode !=""){
	            	$("#areaCode").val(city.areaCode);
	            	
	            	var placeSearchOptions = { //构造地点查询类
	         	            pageSize: 10,
	         	            pageIndex: 1,
	         	            city: $("#areaCode").val(), //城市
	         	        };
	         	    
	         	    //地理位置搜索
	         	    placeSearch= new AMap.PlaceSearch(placeSearchOptions);
	            }
				$('#select-Citys').closePopup(function() {
	                if(_myIScrollsc) {
	                    _myIScrollsc.destroy();
	                    _myIScrollsc = null;
	                }
	            });
	        });
	    } 
	    
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
	            $('#search-address .cancel').triggerHandler('click');
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

	  
               
       $("[data-udplus]").on("click",function(){
    	   var item = $(this).data('udplus');
    	   dplus.track(item,{
       		"车企":providerDomin,
       		"页面名称":"首页-个人中心",
       		});
    	    });
       
       getCityAndArea();//获取车企开通的城市区域
       chooseCityOrArea();//城市区域选择事件
    });
    
    //获取车企开通的城市区域
    var getCityAndArea = function(){
    	var url = '/busline/getAreas';
    	$.post(url,{lineType:'1'},function(data){
    		var code = data.code;
    		var startCityList = data.data.startCityList;
     		var endCityList = data.data.endCityList;
    		if(code != 0){
    			return false;
    		} 
    		if(startCityList.length > 0){
    			var startCityHtml = getCityAndAreaHtml(startCityList,'startArea');
    			$('#startCity').html(startCityHtml);
    		}
    		if(endCityList.length > 0){
    			var endCityHtml = getCityAndAreaHtml(endCityList,'endArea');
    			$('#endCity').html(endCityHtml);
    		}
    		chooseCityOrArea();
    	},'json');
    }
    
    //封装推荐地区
    var getCityAndAreaHtml = function(cityList,areaType){
    	var cityAndAreaHtml = '<h4 class="title">地区推荐</h4>';
		for(var i = 0; i < cityList.length; i++){
			var cityItem = cityList[i];
			cityAndAreaHtml += '<h5 class="subtitle">'+ cityItem.name +'</h5>';
			cityAndAreaHtml += '<div class="station-group"><span data-areaId="0">全部地区</span>';
                   
			for (var j = 0; j < cityItem.childrenAreaList.length; j++){
				var area = cityItem.childrenAreaList[j];
				if(!area.name){
					continue;					
				}
				cityAndAreaHtml += '<span data-areaId="' + area.areaId + '" class="' + areaType + '">' + area.name + '</span>';
			}
			cityAndAreaHtml += '</div>';
		}
		return cityAndAreaHtml;
    }
    
    //推荐地区选择
    var chooseCityOrArea = function(){
    	var targetType = isAndroid() ? 'tap' : 'click';
    	$('.station-group span').off(targetType).on(targetType,function(){
    		var _this = $(this);
    		var cityName = _this.parent().prev('.subtitle').text();
    		var areaName = _this.text();
    		var areaType = _this.attr('class');
    		var searchAddress = cityName + areaName;
    		if(areaName == '全部地区'){
    			searchAddress = cityName;
    			areaName = cityName;
    		}
    		 new AMap.Geocoder().getLocation(searchAddress,function(status,result){
    			var location = result.geocodes[0].location;	 
    			var data = {};
				data['name'] = cityName + ' · ' + areaName;
				//data['address'] = $(this).data('address');
				data['lng'] = location.lng;
				data['lat'] = location.lat;
				if(areaType == 'startArea'){
					lineParam['departAreaName'] = areaName;
				}else if(areaType == 'endArea'){
					lineParam['arriveAreaName'] = areaName;
				}
	            $('#search-address').setPopupData(data);
	            $('#search-address .cancel').triggerHandler('click');
    		 });
    	});
    	
    	//当前位置选择
    	$('#currentAddressDetail').off(targetType).on(targetType,function(){
    		var _this = $(this);
    		var data = {};
			data['name'] = _this.text();
			data['lng'] = _this.data('lng');
			data['lat'] = _this.data('lat');
            $('#search-address').setPopupData(data);
            $('#search-address .cancel').triggerHandler('click');
    	});
    }

</script>
</body>
</html>