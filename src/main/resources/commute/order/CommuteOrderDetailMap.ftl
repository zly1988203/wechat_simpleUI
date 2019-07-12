<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>车辆定位</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/animate.min.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/my/check-station.css?version=${version!''}" rel="stylesheet" type="text/css">
</head>

<body>

    <div class="line-detail">
        <div class="detail-head">
            <div class="detail-date">${orderInformation.baseBus.departDate?string('M月dd日')} ${orderInformation.baseBus.departTime?string('HH:ss')}</div>
             <#if (orderInformation.baseBus.carNo!'')!=''>
            	<div class="licence">${orderInformation.baseBus.carNo!''}</div>
            </#if>
        </div>
        <div class="detail-station-info">
          <div class="station">
            <div class="station-item">
                    <h4>${orderInformation.baseBus.departStation}</h4>
            </div>
            <div class="station-item">
                    <h4>${orderInformation.baseBus.arriveStation}</h4>
            </div>
            </div>
            <#if (useTime!0) != 0>
       		    <div class="time">约${useTime!0}分钟</div>
       		</#if>
        </div>
        <div class="detail-tips"></div>
        <div class="detail-bar">
         <!-- tips：没有定位时显示 
            <div class="tips" id="driverGpsEmpty" style="display: none;"></div>-->
        <div class="detail-main">
            <div class="content">
                <div class="detail-station-list">
                    <ul class="detail-station-start">
                        <!--
                            .active 表示当前站点是选中
                            .arrive 表示车到达站点
                            .leave  表示车离开站点
                            data-lng，data-lat 地图坐标
                            data-name 站点名
                            data-time 时间
                            data-form on是上车点，off是下车点
                        -->
						<#list orderInformation.baseBus.busLineStationList as item> 
	                        <li data-lng="${item.longitude}" data-lat="${item.latitude}" data-name="${item.stationName }" data-date="预计${item.departTime}" data-form="on" id="station${item.id}" data-stationid="${item.stationId }">
	                            <div class="content">
	                                <h4>${item.stationName }</h4>
	                                <span>
	                                	<#if item_index!=0>
	                                		预计
	                                	</#if>	
	                                		${item.departTime}</span>
	                            </div>
	                        </li>
                        </#list> 
                    </ul>
                    <ul class="detail-station-ending">
						<#list orderInformation.baseBus.arriveLineStationList as item> 
	                        <li  data-lng="${item.longitude}" data-lat="${item.latitude}" data-name="${item.stationName }" data-date="预计${item.departTime}" data-form="off" id="station${item.id}" data-stationid="${item.stationId!''}">
	                            <div class="content">
	                                <h4>${item.stationName }</h4>
	                                <span>预计${item.departTime}</span>
	                            </div>
	                        </li>
                        </#list> 
                    </ul>
                </div>
            </div>
        </div>
        <div class="detail-bottom">
            <div class="detail-toggle" data-toggle="true"></div>
        </div>
        </div>
    </div>
    <div class="ola-maps" id="allmap"></div>
    
    <!--todo  -->
    <div class="tags" id="lineTips" style="display:none">
        <p>地图显示的的行车路线仅供参考</p>
        <p>乘车请以站点为准</p>
        <i class="close"></i>
    </div>
    
    <script type="text/javascript" src="/js/commonJs.js?v=${version!''}"></script>
    <script type="text/javascript" src="/js/vectors.min.js?v=${version!''}"></script>
    <script src="/js/lineTips.js"></script>
    <script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=LhAHTNditLOdtdKYk0dOljbG"></script>
    <script>
    var _gpsRemind = true;
	var _showMap = true;
	    function queryDriverLocation(){
			$.ajax({
				url:'/busline/busOrder/getDriverLocation',
				data:{orderNo:'${orderInformation.orderNo}',token:$.cookie('token')},
				dataType:'json',
				success:function(data){
					if(parseInt(data.code)==0){
						_gpsRemind = false;
						$('#driverGpsEmpty').hide();
						var stationData=data.data;
						if(stationData.leaveFlag!=null&&parseInt(stationData.leaveFlag)==1){
							$(".leave").removeClass('leave');//移除之前的样式
							$(".arrive").removeClass('arrive');
							$("#station"+stationData.id).attr('class','leave');
						}else{
							$(".arrive").removeClass('arrive');
							$(".leave").removeClass('leave');
							$("#station"+stationData.id).attr('class','arrive');
						}
					}else{
						if(_showMap){
							_gpsRemind = true;
							$('#driverGpsEmpty').show();
						}
					}
				},
				error: function(jqXHR, textStatus, errorThrown){
					switch (jqXHR.status){
						case(401):
							if(loginType==1){
								location.href = '/selectionLogin';
							}else{
								location.href = '/regOrLogin';
							}
							break;
					}
				}
			})
			
		}
	    
        $(function() {
        	var src = '${src!''}';
        	if(src =='order'){
        		backtoUrl('/bus/toCommuteOrderDetail?orderNo=${orderInformation.orderNo}'); 
        	}else{
        		backtoUrl('/trip/toTripListPage'); 
        	}
            var departStationId = ${orderInformation.baseBus.departStationId!''};
        	var arriveStationId = ${orderInformation.baseBus.arriveStationId!''};
            queryDriverLocation();
        	setInterval("queryDriverLocation()",60000)
        	 /*切换*/
            $('.detail-toggle').on('click', function () {
                switchDetail($(this));
            });

            $('.detail-station-start li').each(function () {
                var $el = $(this);
                if($el.data('stationid') == departStationId){
                	$el.addClass('active');
                }
            });
        	
        	$('.detail-station-ending li').each(function () {
                var $el = $(this);
                if($el.data('stationid') == arriveStationId){
                	$el.addClass('active');
                }
            });
        	
        	  //选择站点滚动
            $('.detail-station-list li').on('click', function () {
                scrollMiddle($(this));
            });

            init();

        });

        //设置地图的外边距
        function setMap() {
        	   var maps = $('.ola-maps');
               var h = 0,
                   mar_top = 0;

               mar_top += $.getHeight($('.line-detail')).replace('px', '');

               h = $(window).height() - mar_top;
               maps.css({height: h + 'px', 'margin-top': mar_top + 'px'});
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
                scrollMiddle($('.detail-station-start li.active'));
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
            var _startScrollTop = el.position().top,
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
            _myIScroll.scrollTo(0, _moveTop);
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

        // 切换列表
        function switchDetail(el) {
        	 var main = $('.detail-main'),
        	 tips = $('.detail-tips, .tips');
            if(el.data('toggle')) {
            	if(_gpsRemind){
            		$('#driverGpsEmpty').show()
            	}
            	tips.show();
            	  main.height(main.data('height'));

                  el.addClass('turn');
                  el.data('toggle', false);
                _showMap = true;
            } else {
            	$('#driverGpsEmpty').hide();
            	tips.hide();
            	 main.height(0);

                 el.removeClass('turn');
                 el.data('toggle', true);
                _showMap = false;
            }

            //滚动设置
            bindScroll();
            setMap();
        }

        // 地图功能
        function mapFn() {
            // 百度地图API功能
            var map = new BMap.Map("allmap");
            var startPoint = new BMap.Point(${firstStation.longitude!""},${firstStation.latitude!""});   //起点
            var endPoint = new BMap.Point(${lastStation.longitude!""},${lastStation.latitude!""});    //终点
            map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
            map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用

            // 初始化
            var pathwayPonit = [];
            $('.detail-station-list li').each(function (index) {
                var $el = $(this);
                pathwayPonit[index] = {lng: $el.data('lng'), lat: $el.data('lat')};
            });

            // 经途点
            var drivings = addPolyLine(pathwayPonit);

            // 画线
            function addPolyLine(points) {
                var pathwayPonitArr = [];
                for(var item in points) {
                    pathwayPonitArr.push(new BMap.Point(points[item].lng, points[item].lat));
                }

                var drivingStart = pathwayPonitArr.shift(),
                    drivingEnd = pathwayPonitArr.pop();
                var driving = new BMap.DrivingRoute(map, {
                    renderOptions:{map: map, autoViewport: true}
                });
                driving.search(drivingStart, drivingEnd, {
                    waypoints: pathwayPonitArr
                });  //waypoints表示途经点

                // 设置添加标注后的回调函数: 删除地图自带的图标
                driving.setMarkersSetCallback(function (pois) {
                    for(var item in pois) {
                        if(pois[item].marker) {
                            //屏蔽起终图标
                            map.removeOverlay(pois[item].marker);
                        }

                        if(pois[item].Hm) {
                            //屏蔽经字图标
                            map.removeOverlay(pois[item].Hm);
                        }
                    }

                    //屏蔽起终图标
                    $('[src="https://api0.map.bdimg.com/images/dest_markers.png"]').remove();
                    //屏蔽经字图标
                     $('[src="http://api0.map.bdimg.com/images/way-points.png"]').remove();
                    $('[src="https://api.map.baidu.com/images/way-points.png"]').remove();
                });

                //设置中心点为上车点
                driving.setPolylinesSetCallback(function () {
                    var $up = $('.detail-station-start li.active');
                    var upPoint = '';

                    //如果有上车点
                    if($up.length > 0) {
                        upPoint = new BMap.Point($up.data('lng'), $up.data('lat'));
                    } else {
                        //则使用默认起点
                        upPoint = startPoint;
                    }

                    map.centerAndZoom(upPoint, 18);
                });

                // 上下车点标注
                $('.detail-station-start li').each(function () {
                    var $el = $(this);
                    addMarker({lng: $el.data('lng'),lat: $el.data('lat')}, "/res/images/bus/map-4.png", {w: 13, h: 13}, 4);
                });
                $('.detail-station-ending li').each(function () {
                    var $el = $(this);
                    addMarker({lng: $el.data('lng'),lat: $el.data('lat')}, "/res/images/bus/map-2.png", {w: 13, h: 13}, 4);
                });

                return driving;
            }

            // 起始和终点-图标和大小
            var startIcon = "/res/images/bus/map-start.png",
                startSize = {w: 25, h: 36};
            var endIcon = "/res/images/bus/map-end.png",
                endtSize = {w: 25, h: 36};
            // 上下车点-图标和大小
            var aboardIcon = "/res/images/bus/map-up.png",
                aboardSize = {w: 25, h: 24};
            var debusIcon = "/res/images/bus/map-down.png",
                debusSize = {w: 25, h: 24};

            // 设置起点和目的地
            //var startMarker = addMarker({lng: 113.878651,lat: 22.572961}, startIcon, startSize, 5);
            //var endMarker = addMarker({lng: 113.94454,lat: 22.527815}, endIcon, endtSize, 5);

            // 设置线路上下车点
            var defaultAboardIcon = "/res/images/bus/map-3.png",
                defaultAboardSize = {w: 14, h: 14};
            var defaultDebusIcon = "/res/images/bus/map-1.png",
                defaultDebusSize = {w: 14, h: 14};
            var $defaultAboard = $('.detail-station-start li:first-child');
            addMarker({lng: $defaultAboard.data('lng'),lat: $defaultAboard.data('lat')}, defaultAboardIcon, defaultAboardSize, 4);
            var $defaultDebus = $('.detail-station-ending li:last-child');
            addMarker({lng: $defaultDebus.data('lng'),lat: $defaultDebus.data('lat')}, defaultDebusIcon, defaultDebusSize, 4);

            // 设置上车点和下车点
            var $aboard = $('.detail-station-start li.active');
            if($aboard.length != 0) {
                var aboardMarker = addMarker({lng: $aboard.data('lng'),lat: $aboard.data('lat')}, aboardIcon, aboardSize, 6);

                //文字提示
                var aboardlabel = labelAction($aboard.data('name'));
                aboardMarker.setLabel(aboardlabel);
            }

            var $debus = $('.detail-station-ending li.active');
            if($debus.length != 0) {
                var debusMarker = addMarker({lng: $debus.data('lng'),lat: $debus.data('lat')}, debusIcon, debusSize, 6);

                //文字提示
                var debuslabel = labelAction($debus.data('name'));
                debusMarker.setLabel(debuslabel);
            }

            // 点标注
            function addMarker(point, icon, size, zindex) {
                var markerPoint = new BMap.Point(point.lng, point.lat);
                var markerIcon = new BMap.Icon(icon, new BMap.Size(size.w, size.h), {
                    imageSize: new BMap.Size(size.w, size.h)
                });
                var marker = new BMap.Marker(markerPoint,{icon:markerIcon});
                map.addOverlay(marker);

                zindex && marker.setZIndex(zindex);

                return marker;
            }

            //定位上车点
            $('.detail-station-start li').on('click', function () {
                var $el = $(this);

                pantoMark($el, aboardIcon, aboardSize, 6);
            });

            //定位下车点
            $('.detail-station-ending li').on('click', function () {
                var $el = $(this);
                pantoMark($el, debusIcon, debusSize, 6);
            });

            // 定位站点
            function pantoMark(el, icon, size, zindex) {
                //参数定义
                if(!size) {
                    //覆盖物的size
                    size = {};
                }

                if(!zindex) {
                    //覆盖物的zindex
                    zindex = 1;
                }

                var lng = el.data('lng'),
                    lat = el.data('lat');
                map.panTo(new BMap.Point(lng, lat));

                //延迟放大
                setTimeout(function () {
                    map.setZoom(18);
                }, 500);

                //修改中心点 以至于让地图发生变化
                setTimeout(function() {
                    map.setCenter(new BMap.Point(lng, lat))
                }, 1);

                //文字提示
                var label = labelAction(el.data('name'));

                if(el.data('form') == 'on') {
                    map.removeOverlay(aboardMarker);
                    aboardMarker = addMarker({lng: lng, lat: lat}, icon, size, zindex);
                    aboardMarker.setLabel(label);
                } else if(el.data('form') == 'off') {
                    map.removeOverlay(debusMarker);
                    debusMarker = addMarker({lng: lng, lat: lat}, icon, size, zindex);
                    debusMarker.setLabel(label);
                }
            }

            // 文字提示
            function labelAction(dataName) {
                var label = new BMap.Label(dataName);

                // 设置样式
                label.setStyle({
                    backgroundColor: '#6392fe',
                    borderRadius: '3px',
                    fontSize: '12px',
                    color: '#fff',
                    padding: '0 4px',
                    textAlign: 'center',
                    height:'20px',
                    lineHeight: '20px',
                    border: '0 none'
                });

                // 设置偏移
                var l = ((dataName.length - 1) * 12) / 2 - 4;
                label.setOffset(new BMap.Size(-l, -23));

                return label;
            }

            return map;
        }
        
        function init() {
            $('.detail-toggle').click();

            var bar = $('.detail-bar'),
                tips = bar.find('.tips');

            //设置列表高度
            var main = $('.detail-main');
            var main_h = $.unit(main.height(), 'rem');
            main.data('height', main_h).height(main_h);

            //设置最小高度
            var bottom = $('.detail-bottom');
            var bottom_h = $.unit(bottom.height(), 'rem');
            bar.css('min-height', bottom_h);

            setMap();
            mapFn();
        }
    </script>
</body>
</html>