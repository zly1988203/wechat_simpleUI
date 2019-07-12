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
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/coach/fy-datepicker.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/bus.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/coach/index.css?v=${version!}" rel="stylesheet" type="text/css">	
</head>

<body>
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
            <ul class="sui-list">
                <li>
                    <div class="control start">
                        <input id="startAddr" type="text" class="select-city-btn" data-stationType="1" placeholder="请选择出发站点" readonly />
                    </div>
                </li>
                <li>
                    <div class="control end">
                        <input id="endAddr" type="text" class="select-city-btn" data-stationType="2" placeholder="请选择目的站点" readonly />
                    </div>
                </li>
            </ul>
            <div class="exchange"></div>
        </div>
        <div class="sui-border-t sui-padding">
            <div class="search-date">
                <input id="startTime" type="text" placeholder="请选择出发日期" readonly />
            </div>
            <input id="presellDay" type="hidden" value="${presellDay!60}"/>
            <input id="currentDateStr" type="hidden" value="${currentDateStr!''}"/>
        </div>
    </div>
    <div class="search-btn" id="searchBtn">查询购票</div>
    <!-- 灰色按钮：disabled -->
    <!-- <div class="search-btn disabled">查询购票</div>-->

    <!--底部按钮-->
    <div class="foot-btn-bus"></div>

    <#include "/sideMenu.ftl">

    <!-- 选择城市区域 -->
    <div id="select-Citys" class="sui-popup-container" data-trigger="">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">

            <div class="search-bar">
                <div class="search-bar-inner">
                    <div class="tools-control">
                        <div id="setCityButton" class="set-city"></div>
                        <input type="hidden" id="areaCode" value="">
                        <input type="hidden" id="areaId" value="">
                        <div class="serach-input">
                            <input type="text" placeholder="请输入站点" />
                        </div>
                    </div>
                    <button  type="button" class="back">取消</button>
                </div>
            </div>

            <div id="cityListContent" class="main">
                <div class="left">
                    <h4>区域</h4>
                    <div class="station" id="departCityList">
                        <ul class="item">
                        </ul>
                    </div>
                     <div class="station" id="arriveCityList">
                        <ul class="item">
                        </ul>
                    </div>
                </div>

                <div class="right">
                    <h4>站点</h4>
                    <div class="station" id="departStationList">
                    </div>
                    <div class="station" id="arriveStationList">
                    </div>
                </div>
            </div>

            <div id="searchWrapper" class="wrapper" style="display: none">
                <div class="content">
                    <ul id="searchResult" class="sui-list">
                        <li>
                            <div>sdfsdfsd</div>
                            <div>dsfsdfsdfs</div>
                        </li>
                        <li>
                            <div>sdfsdfsd</div>
                            <div>dsfsdfsdfs</div>
                        </li>
                        <li>
                            <div>sdfsdfsd</div>
                            <div>dsfsdfsdfs</div>
                        </li>
                    </ul>
                </div>
            </div>

            <!--<div class="btn-group">-->
                <!--<div id="btnBack" class="btn primary cancel" data-target="select-Citys">返回</div>-->
            <!--</div>-->

        </div>
    </div>

    <!--切换城市-->
    <div id="change-Citys" class="sui-popup-container">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <div class="search-bar sui-border-b">
                <div class="search-bar-inner">
                    <div class="tools-control search-city" style="color:#999"> 请选择城市 </div>
                    <button  type="button" class="cancel">取消</button>
                </div>
            </div>
            <!-- 字母检索 -->
            <ul class="nav-city">
            </ul>
            <div id="cityWrapper" class="wrapper">
                <div class="content" id="cityList">
                    <div class="current-city">当前定位城市：深圳市</div>
                    <div id="cityUl"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- 选择日期 -->
    <div id="select-date" class="sui-popup-container" data-trigger="">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <div class="date"></div>
            <div class="btn-group">
                <div class="btn primary cancel" data-target="select-date ">返回</div>
            </div>
        </div>
    </div>

    <script src="/js/zepto.min.js"></script>
    <script src="/js/simpleui.min.js"></script>
    <script src="/js/zepto.cookie.js"></script>
    <script src="/js/zepto.md5.js"></script>
    <script src="/config.js?v=${version}"></script>
    <script src="/js/commonjs/header.js?v=${version}"></script>
    <script src="/js/vectors.min.js?v=${version}"></script>
    <script src="/js/common.js?v=${version!}"></script>
	<script src="/adConfig.js?providerId=${providerId}&positionCode=index-banner&operatorId=${baseUser.id!''}"></script>
    <!--<script src="/js/commonjs/adLoading.js"></script>-->
    <script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
    <script src="/js/shareConfig.js?v=${version}"></script>
    <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.3&key=65b7cb5e8c694cb822cd32791319b348"></script>
    <script src="/js/coach/fy-datePicker.min.js?v=${version!}"></script>
    <!--<script type="text/javascript" src="/js/getProvider.js?v=${version!}"></script>-->
    <script src="/js/date.js?v=${version!}"></script>
    <script src="/js/busTicket/busTicketHome.js?v=${version!}"></script>

</body>
</html>
