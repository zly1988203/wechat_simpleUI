<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>线路详情</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/fy-datepicker.css?time=${curtimeStamp!''}&v=${version!''}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/line-detail-2.css?v=${version!''}" rel="stylesheet" type="text/css">
     
</head>

<body>
	<!-- <#include "foot.ftl"/> -->
    <div class="line-detail">
    <div class="detail-head-content">
        <div class="detail-head">
            <div class="detail-date">${lineDetail.departStationTime!''}</div>
        </div>
	        <div class="detail-station-info">
                <div class="station">
                    <div class="station-item">
                        <h4>${lineDetail.departStation!''}</h4>
                    </div>
                    <div class="station-item">
                        <h4>${lineDetail.arriveStation!''}</h4>
                    </div>
                </div>
                <div class="other">
                    <div class="detail-station-distance">
                    </div>
                    <div class="detail-station-distance">约${lineDetail.useTimeDifference!''}分钟</div>
                </div>
            </div>
        </div>
        <div class="detail-main-content">
        <div class="detail-tips"><span>点击下方站点可更改上下车站</span></div>
        <div class="detail-main">
        <div class="content">
            <div class="detail-station-list">
                <ul class="detail-station-start">
                    <#list lineDetail.goOnStationList as station>
                    	<#if station.stationId==lineDetail.departStationId>
                    		<li class="active" data-stationid="${station.stationId!''}" data-lng="${station.longitude!'' }" data-lat="${station.latitude!''}" data-name="${station.stationName!'' }" data-min="${station.useTime!'0'}" data-time="${station.predictTime!'' }" data-form="on">
                    	<#else>
	                    	<li data-stationid="${station.stationId!''}" data-lng="${station.longitude!'' }" data-lat="${station.latitude!''}" data-name="${station.stationName!'' }" data-min="${station.useTime!'0'}" data-time="${station.predictTime!'' }" data-form="on">
                    	</#if>
	                        <div class="content">
	                            <h4>${station.stationName!''}</h4>
	                            <span><#if station_index != 0>预计</#if>${station.predictTime!''}</span>
	                        </div>
	                    </li>
                    </#list>
                </ul>
                <ul class="detail-station-ending">
                    <#list lineDetail.goOffStationList as station>
                    	<#if station.stationId==lineDetail.arriveStationId>
                    		<li class="active" data-stationid="${station.stationId!'' }" data-lng="${station.longitude!'' }" data-lat="${station.latitude!''}" data-name="${station.stationName!'' }" data-min="${station.useTime!'0'}" data-time="${station.predictTime!'' }" data-form="off">
                    	<#else>
                    		<li data-stationid="${station.stationId!'' }" data-lng="${station.longitude!'' }" data-lat="${station.latitude!''}" data-name="${station.stationName!'' }" data-min="${station.useTime!'0'}" data-time="${station.predictTime!'' }" data-form="off">
                    	</#if> 
	                        <div class="content">
	                            <h4>${station.stationName!'' }</h4>
	                            <span>预计${station.predictTime!'' }</span>
	                        </div>
	                    </li>
                    </#list>
                </ul>
            </div>
            </div>
        </div>
        </div>
        <div class="detail-bottom">
            <div class="detail-toggle" data-toggle="true"></div>
        </div>
    </div>

    <div class="ola-maps" id="allmap"></div>
	<div class="tags" id="lineTips" style="display:none">
        <p>地图显示的的行车路线仅供参考</p>
        <p>乘车请以站点为准</p>
        <i class="close"></i>
    </div>
    <footer class="detail-foot">
        <div id="selectDatebtn" class="detail-station-btn">选日期</div>
    </footer>

    <!-- 选择日期 -->
    <div id="selectDate" class="sui-popup-container">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <!-- 日历控件，先填充数据并输出 -->
            <div class="datepicker-wrapper"></div>
            <div class="pay-handle">
                <div class="left">
                    <p>已选<span class="day">0</span>天</p>
                    <p>合计：<span class="price">0</span>元</p>
                </div>
                <div class="right">
                    <button class="btn primary" id="payTicket">购票</button>
                </div>
            </div>
        </div>
    </div>
    <!--popup end-->

    <input type="hidden" id="qrcId" value="${qrcId!''}">
    <input type="hidden" id="departDate" value="${lineDetail.departDate!''}">
    <input type="hidden" id="childLineList" value='${lineDetail.childLineList!""}'>
    <input type="hidden" id="scheduleInfoList" value='${lineDetail.scheduleInfoList!""}'>
    <input type="hidden" id="curTimeStamp" value="${lineDetail.curTimeStamp!''}">
    <input type="hidden" id="baseBusMap" value='${lineDetail.baseBusMap!""}'>
    <input type="hidden" id="departStationId" value="${lineDetail.departStationId!''}">
    <input type="hidden" id="arriveStationId" value="${lineDetail.arriveStationId!''}">
    <input type="hidden" id="busId" value="${lineDetail.busId!''}">

    <input type="hidden" id="departLng" value="${lineDetail.departLng!''}">
    <input type="hidden" id="departLat" value="${lineDetail.departLat!''}">

    <input type="hidden" id="arriveLng" value="${lineDetail.arriveLng!''}">
    <input type="hidden" id="arriveLat" value="${lineDetail.arriveLat!''}">

	<script src="/js/commonJs.js?v=${version!''}"></script>
	<script src="/js/simpleui.min.js?v=${version!''}"></script>
    <script src="/js/vectors.min.js?v=${version!''}"></script>
    <!--进行了修改 与压缩文件有差异-->
    <script src="/js/coach/fy-datePicker.min.js?v=${version!''}"></script>
    <script src="/js/lineTips.js?v=${version!''}"></script>
    <!--<script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=LhAHTNditLOdtdKYk0dOljbG"></script>-->
    <script src="/js/commute/lineDetailCommute.js?v=${version!''}"></script>
</body>
</html>