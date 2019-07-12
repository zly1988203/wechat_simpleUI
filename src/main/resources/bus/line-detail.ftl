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
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/line-detail-2.css?v=${version!}" rel="stylesheet" type="text/css">
    <!-- start Dplus --><script src="/js/udplus.js"></script><!-- end Dplus -->
</head>

<body>
<input type="hidden" id="tel" value="${lineDetail.tel!''}">
<input type="hidden" id="specialState" value="${lineDetail.specialState!0}">
<input type="hidden" id="sellPrice" value="${lineDetail.sellPrice!''}">
<input type="hidden" id="specialPrice" value="${lineDetail.specialPrice!''}">
<input type="hidden" id="goOnStationList" value='${lineDetail.goOnStationList!""}'>
<input type="hidden" id="departStationId" value='${lineDetail.departStationId!""}'>
<input type="hidden" id="goOffStationList" value='${lineDetail.goOffStationList!""}'>
<input type="hidden" id="arriveStationId" value="${lineDetail.arriveStationId!''}">
<input type="hidden" id="qrcId" value="${qrcId!''}">
<input type="hidden" id="departDate" value="${lineDetail.departDate!''}">
<input type="hidden" id="busId" value="${lineDetail.busId!''}">
<input type="hidden" id="childLineList" value='${lineDetail.childLineList!""}'>
<input type="hidden" id="scheduleId" value="${lineDetail.scheduleId!''}">
<input type="hidden" id="busType" value="${lineDetail.busType!''}">
<input type="hidden" id="lineId" value="${lineDetail.lineId!''}">
<input type="hidden" id="departLng" value="${lineDetail.departLng!''}">
<input type="hidden" id="departLat" value="${lineDetail.departLat!''}">
<input type="hidden" id="arriveLng" value="${lineDetail.arriveLng!''}">
<input type="hidden" id="arriveLat" value="${lineDetail.arriveLat!''}">

	<!-- <#include "foot.ftl"/> -->
    <div class="line-detail">
    	<div class="detail-head-content">
        <div class="detail-head">
            <div class="detail-date">${lineDetail.departDate!''} ${lineDetail.departStationTime!''}</div>
            <div class="detail-tel" data-href="tel:${lineDetail.tel!''}" style="display:none"></div>
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
                <div class="detail-station-distance first"></div>
                <div class="detail-station-distance">约${lineDetail.useTimeDifference!''}分钟</div>
            </div>
        </div>
        </div>
        <div class="detail-main-content">
        <div class="detail-tips"><span>点击下方站点可更改上下车站</span></div>
        <div class="detail-main">
        <div class="content">
            <div class="detail-station-list">
                <ul class="detail-station-start"></ul>
                <ul class="detail-station-ending"></ul>
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
    <footer class="detail-foot" style="display:none">
        <div id="buyBtn" class="detail-station-btn" data-clickable="false" style="background: #999999;">购票</div>
    </footer>
     <div class="btn-group" style="display:none">
        <div class="btn default travelLineInfo">线路介绍</div>
        <div class="btn primary detail-station-btn" data-clickable="false" style="background: #999999;">购票</div>
    </div>

    <script src="/js/commonJs.js?v=${version!}"></script> 
    <script src="/js/vectors.min.js?v=${version!}"></script>
    <script src="/js/lineTips.js?v=${version!}"></script>
    <script src="/js/bus/line-detail.js?v=${version!}"></script>
    <!--<script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=LhAHTNditLOdtdKYk0dOljbG"></script>-->
</body>
</html>