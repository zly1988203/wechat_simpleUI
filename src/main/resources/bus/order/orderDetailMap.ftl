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
     <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/animate.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/my/check-station.css?version=${version!''}" rel="stylesheet" type="text/css">
</head>

<body>
    <input type="hidden" id="src" value="${src!''}"/>
    <input type="hidden" id="orderNo" value="${orderInformation.orderNo}"/>
    <input type="hidden" id="departStationId" value="${orderInformation.baseBus.departStationId!''}"/>
    <input type="hidden" id="arriveStationId" value="${orderInformation.baseBus.arriveStationId!''}"/>
    <input type="hidden" id="firstLng" value="${firstStation.longitude!''}"/>
    <input type="hidden" id="firstLat" value="${firstStation.latitude!''}"/>
    <input type="hidden" id="lastLng" value="${lastStation.longitude!''}"/>
    <input type="hidden" id="lastLat" value="${lastStation.latitude!''}"/>

    <div class="line-detail">
        <div class="detail-head">
            <div class="detail-date">${orderInformation.baseBus.departDate?string('M月dd日')} ${orderInformation.baseBus.departTime?string('HH:mm')}</div>
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
            <div class="tips" id="driverGpsEmpty" style="display: none"></div> -->
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
    <div class="tags" id="lineTips" style="display:none">
        <p>地图显示的的行车路线仅供参考</p>
        <p>乘车请以站点为准</p>
        <i class="close"></i>
    </div>

    <script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/vectors.min.js?v=${version!}"></script>
    <script src="/js/lineTips.js?v=${version!}"></script>
    <script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=LhAHTNditLOdtdKYk0dOljbG"></script>
    <script src="/js/bus/order/orderDetailMap.js?v=${version!}"></script>

</body>
</html>