<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/bus.css?v=${version!''}" rel="stylesheet" type="text/css">
   <link href="/res/style/bus/datePicker.css?v=${version!''}" rel="stylesheet" type="text/css">
   <link href="/res/style/base/vectors.2.css?v=${version!''}" rel="stylesheet" type="text/css">
   <link href="/res/style/base/select-citys.css?v=${version!''}" rel="stylesheet" type="text/css">
</head>
  <style>
    .call-car-panel ul .reddot:after {
	    content: '';
	    position: absolute;
	    display: block;
	    width: 8px;
	    height: 8px;
	    background-color: #f74c31;
	    border-radius: 5px;
	    right: 3px;
	    top: 8px;
	}
	
	.call-car-panel ul .reddot {
	    position: relative;
	}
	</style>
<body>
<!-- <#include "foot.ftl"/> -->
    <!--顶部-->
<input type="hidden" id="adDomain" value="${adDomain!}">
<input type="hidden" id="positionCode" value="${positionCode!}">
<input type="hidden" id="providerId" value="${providerId!}">
<input type="hidden" id="operatorId" value="${baseUser.id!''}">

<!--顶部-->
<#include "/_header.ftl">

    <!-- 广告位 -->
    <div class="vrt">
        <!-- src：引入运营平台广告接口 -->
        <script src="/adConfig.js?providerId=${providerId!}&positionCode=index-top&operatorId=${baseUser.id!''}"></script>
    </div>
    <!--搜索界面-->
    <div class="search-form sui-border-b">
        <div class="search-station">
            <ul class="sui-list sui-border-t">
                <li>
                    <div class="control start">
                        <input id="startAddr" type="text" class="select-city-btn" placeholder="请选择出发地" readonly />
                    </div>
                </li>
                <li>
                    <div class="control end">
                        <input id="endAddr" type="text" class="select-city-btn" placeholder="请选择目的地" readonly />
                    </div>
                </li>
            </ul>
            <div class="exchange"></div>
        </div>
    </div>
    <div class="search-btn disabled" id="searchBtn">查询购票</div>

    <div class="line-wrapper">
        <!--历史线路-->
        <#if historyList.historyOrderList?exists>
        <#if (historyList.historyOrderList?size>0)>
         <ul class="history-line-list">
        	<#list historyList.historyOrderList as item>
	            <li class="sui-border-b history" busId="${item.busId!''}">
	                <div class="content">
	                    <div class="abreast">
	                        <div class="station">${item.departStationName!""}&nbsp;&nbsp;&nbsp;( ${item.departTime!""} )</div>
	                        <div class="station">${item.arriveStationName!""}</div>
	                    </div>
	                    <div class="price">${item.price!""}元<#if item.isFlag==1><i>起</i></#if></div>
	                </div>
	            </li>
            </#list>
        </ul> 
		</#if>
        </#if>
        <!--热门线路-->
        <#if homeInfo.hotLineList?exists>
        <#if (homeInfo.hotLineList?size>0)>
        <ul class="hot-line-list">
            <#list homeInfo.hotLineList as item>
		        <#if item.type==0>
		            <li class="hotline sui-border-b hot" lineId="${item.id}" lineName="${item.lineName}">
		                <div class="content">
		                    <div class="txt">${item.lineName!""}</div>
		                    <#if item.minPrice?exists>
		                    <div class="price">${item.minPrice!""}元<i>起</i></div>
		                    </#if>
		                </div>
		            </li>
            	</#if>
		       	<#if item.type==1>
		            <li class="hotline sui-border-b recommend" lineId="${item.id}" lineName="${item.lineName}">
		                <div class="content">
		                    <div class="txt">${item.lineName!""}</div>
		                    <#if item.minPrice?exists>
		                    <div class="price">${item.minPrice!""}元<i>起</i></div>
		                    </#if>
		                </div>
		            </li>
		        </#if>
            </#list> 
        </ul>
        </#if>
        </#if>
    </div>

    <!--底部按钮-->
    <div class="foot-btn"></div>
    
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
                        <!--<li class="sui-border-b">
                            <div class="sui-cell-map">
                                <h1>中交出行科技有限公司</h1>
                                <h2>深圳市南山区科园路创业投资大厦8楼802</h2>
                            </div>
                        </li>-->
                    </ul>
                    <div class="gather">
                       <!-- 当前位置 -->
                       <div class="current" id="currentAddress" style="display: none;">
                           <h4 class="title">当前位置</h4>
                           <div class="station-group">
                               <span id="currentAddressDetail" data-lng="" data-lat=""></span>
                           </div>
                       </div>

                       <!-- 历史记录 -->
                       <div class="historyAddress" id="historySearch" style="display: none;">
                           <h4 class="title">历史记录</h4>
                           <div class="station-group" id="historyAddress">
                           </div>
                       </div>
						<div class="remove-history" style="display: none;">清空历史记录</div>
                       <!-- 地区推荐 -->
                       <div class="recommend" id="startCity" style="display: none;">
                          <!--  <h4 class="title">地区推荐</h4>
                           <h5 class="subtitle">珠海市</h5>
                           <div class="station-group">
                               <span>全部地区</span>
                               <span>香洲区</span>
                               <span>斗门区</span>
                               <span>金湾区</span>
                           </div> -->
                       </div>
                       <div class="recommend" id="endCity" style="display: none;">
                          <!--  <h4 class="title">地区推荐</h4>
                           <h5 class="subtitle">珠海市</h5>
                           <div class="station-group">
                               <span>全部地区</span>
                               <span>香洲区</span>
                               <span>斗门区</span>
                               <span>金湾区</span>
                           </div> -->
                       </div>
                   		
                   </div>
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
                    <div class="tools-control search-city" style="color:#999">
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
    <#include "/sideMenu.ftl">
    <script src="/js/commonjs/header.js?v=${version!''}"></script>
	<script src="/js/commonBus.js?v=${version!''}"></script>
	<script src="/js/bus/busHome.js?v=${version!''}"></script>
	<script src="/adConfig.js?providerId=${providerId}&positionCode=index-banner&operatorId=${baseUser.id!''}"></script>
    <!--<script src="/js/commonjs/adLoading.js"></script>-->
    <script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
	<script src="/js/shareConfig.js"></script>
	<!--<script type="text/javascript" src="/js/getProvider.js"></script>-->
	<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.3&key=65b7cb5e8c694cb822cd32791319b348"></script>
	 <script src="/js/vectors.min.js?v=${version!''}"></script>
	<script>
    var clickEvent = isAndroid()?'tap':'click';

	function back(){
	    pushHistory();  
	    window.addEventListener("popstate", function(e) {
	       	wx.closeWindow();
	       	pushHistory();
		}, false);  
    }
    
//    back();

	
    $("[data-href]").on("tap",function(){location.href=$(this).data("href")});
	$.cookie("providerId",'${providerId!''}',{expires: 30, path: '/' });
	$.cookie("operatorId",'${baseUser.id!''}',{expires: 30, path: '/' });
	//
	var lineParam={};//保存起止点的经纬度信息
	lineParam["departLng"] = '${departLng!''}';
	lineParam["departLat"] = '${departLat!''}';
	lineParam["arriveLng"] = '${arriveLng!''}';
	lineParam["arriveLat"] = '${arriveLat!''}';
	lineParam["departCityName"] = '${departCityName!''}';
	lineParam["arriveCityName"] = '${arriveCityName!''}';
	lineParam["departCityId"] = '${departCityId!''}';
	lineParam["arriveCityId"] = '${arriveCityId!''}';
	var departCityId = "";
	var arriveCityId = "";
	$('#startAddr').val('${startAddr!''}');
	$('#endAddr').val('${endAddr!''}');
	
	if(lineParam["departLng"]!='' && lineParam["departLat"]!='' && lineParam["arriveLng"]!='' && lineParam["arriveLat"]!=''){
		//$('#searchBtn').prop('disabled', false);
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
    var geocoder;//地图对象 
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

           	var cityName=result.regeocode.addressComponent.city;
           	 if(cityName==null||cityName==""){
           		 cityName=result.regeocode.addressComponent.province;
           		 if(cityName.indexOf("省")>= 0){
	           		 	cityName=result.regeocode.addressComponent.district;
	             } 
           	 }
           	if(type==1){
          		 lineParam['departCityName'] = cityName;
          		 if(lineParam['departAreaName'] != ''  && typeof(lineParam['departAreaName']) != 'undefined'){
          			lineParam['departCityName'] = lineParam['departAreaName']; 
          			lineParam['departAreaName'] = '';
          		 }
          		if(lineParam['departAreaId'] != ''  && typeof(lineParam['departAreaId']) != 'undefined'){
          			lineParam['departCityId'] = lineParam['departAreaId']; 
          			lineParam['departAreaId'] = '';
          		 }
          		 
          	 }else if(type==2){
          		 lineParam['arriveCityName'] = cityName;
          		 if(lineParam['arriveAreaName'] != ''  && typeof(lineParam['arriveAreaName']) != 'undefined'){
           			lineParam['arriveCityName'] = lineParam['arriveAreaName']; 
           			lineParam['arriveAreaName'] = '';
           		}
          		if(lineParam['arriveAreaId'] != ''  && typeof(lineParam['arriveAreaId']) != 'undefined'){
          			lineParam['arriveCityId'] = lineParam['arriveAreaId']; 
          			lineParam['arriveAreaId'] = '';
          		 }
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
    //获取当前月最大天数
    function maxDay(month){
        var d= new Date();
        return new Date(d.getFullYear(), month, 0).getDate();
    }
        
    // 顶部
    var initServerListBar = function() {
    	var length = 88; //存在右边按钮时，改为88
        var width = ($(window).width() - length) / 3;
        var ul = $('.server-list ul');
        var li = ul.children('li');
        var allWidth = 0;
        li.each(function(index, element) {
            var w = $(element).outerWidth(true);
            allWidth += w;
        });
        allWidth += 10;
        ul.css({
            'visibility': 'visible',
            'width': allWidth
        });
        if(allWidth < $(window).width() - length) {
            ul.css('margin-left', ((($(window).width() - length) - allWidth) / 2) + 'px');
        }
        
        //滚动插件
       /*  var barScroll = new IScroll('.server-list .bar', {
            scrollX: true,
            scrollY: false,
            mouseWheel: true
        }); */

        $('.server-list ul li').on('tap', function() {
            ul.children('.active').removeClass('active');
            $(this).addClass('active');
            barScroll.scrollToElement(this, 600, true, true, IScroll.utils.ease.bounce);
        });
        
        $('#openServer').on(clickEvent, function() {
            $('#allServer').show();
            $('#serverMask').show();
        });
        $('#allServer,#serverMask').on(clickEvent, function() {
            $('#allServer').hide();
            $('#serverMask').hide();
        });
    }

    function clearLocalCache() {
        // 优惠券缓存
        window.localStorage.removeItem('selectedCoupon');
    }
    
    $(function() {
        clearLocalCache();
    	getBusinessTypes("commute");//初始化header导航,引用js/commonjs/header.js

    	//查询城际约租车是否有未完成的行程，有则在顶部菜单-城际约租车显示小红点，切换小红点消失
    	// queryIfHasUnfinishedOrder();

        initServerListBar();
        initCity();

        //交换地址
        $('.exchange').on(clickEvent, function() {
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
        
        AMap.plugin('AMap.Geocoder',function(){
	        geocoder = new AMap.Geocoder({
	        });
	        
	        if(lineParam["departCityName"] == '') {
	        	var shareObj = {
					url : window.location.href,
				}
				wxInitConfig(shareObj,getGpsCallback);
	        }
        })

        // ================================= 选择地址相关 ===================================
        
        // 选择地址
        var _isInitsa = false, _myIScrollsa;
        $('.select-city-btn').on(clickEvent, function() {
        	 var _this = $(this);
             if(_this.attr('id') == 'startAddr'){
             	$('#startCity').show();
             	$('#endCity').hide();
             }else{
             	$('#startCity').hide();
             	$('#endCity').show();
             }
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
                
            });
        }).backtrack({
            cancel: '#search-address .cancel',
            event: clickEvent
        });
        
        //关闭地址查询
        $('#search-address .cancel').on(clickEvent, function() {
            $('#search-address').closePopup(function() {
                if(_myIScrollsa) {
                	 _isInitsa = false;
                     _myIScrollsa.destroy();
                    _myIScrollsa = null; 
                }
            });
        });
        
        $(".hotline").on(clickEvent,function() {
        	var lineId = $(this).attr("lineid");
        	var lineName=$(this).attr('lineName');
            var location="/commuteList/hotLineList?lineId=" + lineId + "&&token="+$.cookie("token")
                + "&&lng=" + lineParam.departLng + "&&lat=" + lineParam.departLat+"&lineName="+lineName;
            var distrib = "${distrib!''}";
            if(distrib != ''){
                location = location +"&distrib=${distrib!''}"
            }
            window.location = location;
        });
        
        $(".history").on(clickEvent,function() {

        	var busId = $(this).attr("busId");
        	//验证当前线路是否有排班
        	var url = "/commuteLine/checkBaseBusSchedule";
        	var token = $.cookie("token");
        	var data = {
        			busId : busId,
        			token : token
        	}
        	$.post(url,data,function(result){
        		if(result.code == 0){
        			var baseBusCount = result.data.baseBusCount;
        			if(baseBusCount > 0){
        				window.location="/commute/toLineDetail?busId="+busId;
        			}else{
        				$.toast('当前无可售班次');
        				return false;
        			}
        		}else{
        			$.toast(result.message);
        			return false;
        		}
        	},'json');
        	//
        });
        
        //点击票按钮
        $(".foot-btn").on(clickEvent,function() {
        	//window.location.href="/busTicket/toTicketListPage";
        	window.location.href="/trip/toTripListPage";
        });
        
        //搜索线路
        $("#searchBtn").on(clickEvent,function(){
        	
        	if($("#searchBtn").attr('class')=='search-btn'){
	        	//手机自带返回按钮
	        	var params = "token="+$.cookie("token")+"&departLng="+lineParam['departLng']+"&departLat="+lineParam['departLat']+"&arriveLng="+lineParam['arriveLng']+"&arriveLat="+lineParam['arriveLat']+"&departCityName="+lineParam['departCityName']+"&arriveCityName="+lineParam['arriveCityName']+"&startAddr="//
    			+$('#startAddr').val()+"&endAddr="+$('#endAddr').val() + "&departCityId=" + lineParam['departCityId'] + "&arriveCityId=" + lineParam['arriveCityId']
	        	window.history.replaceState({}, "", "/commuteIndex?" + params);
	        	var url = "/commuteLine/searchCommute?" + params;
	        	window.location = url;
        	}
        	
        });
        
        // 打开选择城市
		var _isInitsc = false, _myIScrollsc;
         $('#setCityButton').on(clickEvent, function() {
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

             $('.nav-city a').on(clickEvent, function (e) {
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
        $('#select-Citys .cancel').on(clickEvent, function() {
            $('#select-Citys').closePopup(function() {
                if(_myIScrollsc) {
                    _myIScrollsc.destroy();
                    _myIScrollsc = null;
                }
            });
        });
		
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
                },0)
            }
        });
		
		//搜索地址
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
	        	$('#searchResult').html('<span style="font-size:20px;">没有找到结果</span>');
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
	   	        url: '/busline/getCitys',
	   	        data: {token:$.cookie('token')},
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
	            $('#search-address .cancel').triggerHandler(targetType);
	        });
		   
		   $('.remove-history').off(targetType).on(targetType,function(){
			   _searchAddressHistory.remove();
			   $('#historySearch').hide();
		       $('.remove-history').hide();
		   });
		   
	    	$('#searchResult').children('li').off(targetType).on(targetType, function() {
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
       //显示用户
       function showUser(){
       	//api url
   		var urlStr = SERVER_URL_PREFIX+"/Account/queryAccount";
   		//current page param
   		var dataObj = {
   		};
   		//merge page param and common param,generate request param
   		dataObj = genReqData(urlStr, dataObj);
       	
           $.post(urlStr, dataObj, function(result){
               if(result && result.code == 0){
	               	var mobile = result.data.mobile;
	               	var nickName = result.data.nickName;
	               	isEmp = result.isEmp;
	               	
	               	if(!isEmpty(result.data.avatar)){
	               		$('#avatar').css("background-image","url("+result.data.avatarUrl+")");
	               	}
	               	if(isEmpty(nickName)){
	   	            	$('.mobile').html(mobile);
	               	}else{
	   					$('.mobile').html(nickName);          		
	               	}
	             /*   	// 展开侧边栏菜单
			       $('#menuArmrest').on('click', function() {
			           	$('#sideMenu').popup('menu');
			           	menuAdjust();
			       }); */
               }else{
               		if(loginType==1){
						$('.mobile').html("<a href='/selectionLogin'>登录</a>");
					}else{
						$('.mobile').html("<a href='/regOrLogin'>登录</a>");
					}
               		
               		$('#menuArmrest').on(clickEvent, function() {
               				if(loginType==1){
								location.href = '/selectionLogin';
							}else{
								location.href = '/regOrLogin';
							}
			       	});
               }
   	    }, 'json');
       }
  
     //联系客服
//       $('#contact').on(clickEvent, function() {
//    	   $('#sideMenu').closePopup(function() {
//  			var urlDetail = SERVER_URL_PREFIX + '/Config/getBusinessTel';
//           	var dataDetail = {
//           	};
//           	dataDetail = genReqData(urlDetail, dataDetail);
//        	$.ajax({
//     	            type: 'POST',
//     	            url: urlDetail,
//     	            data: dataDetail,
//     	            dataType:  'json',
//     	            success: function(data){
//     	            	if(data && data.tel){
//        	            	window.location.href = 'tel:'+data.tel;
//     	            	}
//        	        }
//        	 });
//       	  });
//       });

       getCityAndArea();//获取车企开通的城市区域
       chooseCityOrArea();//城市区域选择事件
    });
    
    
  //获取车企开通的城市区域
    var getCityAndArea = function(){
    	var url = '/busline/getAreas';
    	$.post(url,{lineType:'2'},function(data){
    	    if(data.code == 0){
    	        if(undefined != data.data){
                    var startCityList = data.data.startCityList;
                    var endCityList = data.data.endCityList;
                    if(startCityList.length > 0){
                        var areaType = 'startArea';
                        var startCityHtml = getCityAndAreaHtml(startCityList,areaType);
                        $('#startCity').html(startCityHtml);
                    }
                    if(endCityList.length > 0){
                        var areaType = 'endArea';
                        var endCityHtml = getCityAndAreaHtml(endCityList,areaType);
                        $('#endCity').html(endCityHtml);
                    }
                    chooseCityOrArea();

                }else {
    	            $.alert(data.message);
                }
            }

    	},'json');
    }
    
    //封装推荐地区
    var getCityAndAreaHtml = function(cityList,areaType){
    	var cityAndAreaHtml = '<h4 class="title">地区推荐</h4>';
		for(var i = 0; i < cityList.length; i++){
			var cityItem = cityList[i];
			cityAndAreaHtml += '<h5 class="subtitle">'+ cityItem.name +'</h5>';
			cityAndAreaHtml += '<div class="station-group"><span data-area="' + cityItem.areaId + '" class="' + areaType + '">全部地区</span>';
			for (var j = 0; j < cityItem.childrenAreaList.length; j++){
				var area = cityItem.childrenAreaList[j];
				if(!area.name){
					continue;
				}
				cityAndAreaHtml += '<span data-area="' + area.areaId + '" class="' + areaType + '">' + area.name + '</span>';
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
    		var areaId = _this.attr("data-area");
    		/* if(areaName == '全部地区'){
    			searchAddress = cityName;
    			areaName = cityName;
    		} */
    		 new AMap.Geocoder().getLocation(searchAddress,function(status,result){
    			var location = result.geocodes[0].location;	 
    			var data = {};
				data['name'] = cityName + ' · ' + areaName;
				data['lng'] = location.lng;
				data['lat'] = location.lat;
				if(areaType == 'startArea'){
					lineParam['departAreaName'] = cityName;
					lineParam['departAreaId'] = areaId;
				}else if(areaType == 'endArea'){
					lineParam['arriveAreaName'] = cityName;
					lineParam['arriveAreaId'] = areaId;
				}
	            $('#search-address').setPopupData(data);
	            $('#search-address .cancel').triggerHandler(targetType);
    		 });
    	});
    	
    	//选在当前位置
    	$('#currentAddressDetail').off(targetType).on(targetType,function(){
    		var _this = $(this);
    		var data = {};
			data['name'] = _this.text();
			data['lng'] = _this.data('lng');
			data['lat'] = _this.data('lat');
            $('#search-address').setPopupData(data);
            $('#search-address .cancel').triggerHandler(targetType);
    	});
    }
    
    </script>
</body>
</html>
