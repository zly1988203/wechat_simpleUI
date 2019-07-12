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
    <link href="/res/style/base/swiper.min.css?v=${version}" rel="stylesheet" type="text/css">
    <link href="/res/style/cityBus/busIndex.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/fy-datepicker.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/datePicker.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/commutingBus/fonts/iconfont.css?v=${version}" rel="stylesheet">
   
</head>
<body>
<style>
    .sui-list>li{margin-left: 0.3rem;}
    .sui-popup-container .cf2{background: #f2f2f2;}
    .search-bar{box-shadow: 0 0.05rem 0.2rem rgba(0,0,0,.1);}
    .sui-popup-container{height: 100vh;overflow: hidden;}
</style>

<!--顶部-->
<#include "/_header.ftl">

    <input type="hidden" id="providerId" value="${providerId!''}">
    <input type="hidden" id="operatorId" value="${baseUser.id!''}">
    <input type="hidden" id="departLng" value="${departLng!''}">
    <input type="hidden" id="departLat" value="${departLat!''}">
    <input type="hidden" id="arriveLng" value="${arriveLng!''}">
    <input type="hidden" id="arriveLat" value="${arriveLat!''}">
    <input type="hidden" id="departCityName" value="${departCityName!''}">
    <input type="hidden" id="arriveCityName" value="${arriveCityName!''}">
    <input type="hidden" id="departCityId" value="${departCityId!''}">
    <input type="hidden" id="arriveCityId" value="${arriveCityId!''}">
    <input type="hidden" id="startAddress" value="${startAddr!''}">
    <input type="hidden" id="endAddress" value="${endAddr!''}">

    <input type="hidden" id="departAreaName" value="${departAreaName!''}">
    <input type="hidden" id="arriveAreaName" value="${arriveAreaName!''}">
    <input type="hidden" id="departAreaId" value="${departAreaId!''}">
    <input type="hidden" id="arriveAreaId" value="${arriveAreaId!''}">

    <!--搜索界面--> 
    <div class="search-form sui-border-b">
        <div class="search-station">
            <ul class="sui-list">
                <div class="v-line"></div>
                <li>
                    <div class="control start">
                        <input id="startAddr" type="text" class="select-city-btn" placeholder="您在哪上车" readonly />
                    </div>
                </li>
                <div class="bottom-line"></div>
                <li>
                    <div class="control end">
                        <input id="endAddr" type="text" class="select-city-btn" placeholder="您要去哪儿" readonly />
                    </div>
                </li>
            </ul>
        </div>
    </div>
    
    <!--行程-->
    <div class="scheduling" style="display: none;">
        <header>
            <div class="border-weight"></div>
            <div class="title">行程</div>
            <div class="nav-right" date-url=''> </div>
        </header>
        <div id="scheduling-panle" class="scheduling-panle">
            <div class="swiper-container">
                <div class="swiper-wrapper">

                </div>
                <div class="swiper-pagination"></div>
            </div>
        </div>

    </div>
    
    <!--最近订单-->
    <div class="near-order" style="display: none;">
    </div>
    
    <!--banner广告图-->
    <div id="swpBanner" class="banner" style="display:none;">
        <div class="swiper-container">
            <div class="swiper-wrapper">

            </div>
            <div class="swiper-pagination"></div>
        </div>
    </div>

<div  id="hotLine" class="hot-line-list">
    <header>
        <div class="border-weight"></div>
        <div class="title">推荐线路</div>
    </header>
    <div class="line-list">

    </div>
</div>

<div id="heightPoint"></div>
    <!--查询地址-->
    <div id="search-address" class="sui-popup-container">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal cf2">
            <div class="search-bar">
               <div class="search-bar-inner">
                    <div class="tools-control">
                        <div id="setCityButton" class="set-city">深圳市</div>
                        <input type="hidden" id="areaCode" value="0755">
                        <input type="hidden" id="cityId" value="431000">
                        <div class="search-input">
                            <i class="icon-search"></i>
                            <input type="text" placeholder="搜索地址"/>
                        </div>
                    </div>
                    <button  type="button" class="cancel" id="closeBtn">关闭</button>
                    <button  type="button" class="cancel" id="cancelBtn" style="display: none">取消</button>
                </div>
            </div>
            
            <div id="searchWrapper" class="wrapper">
               <div class="content">
                    <ul id="searchResult" class="sui-list" style="display: none;">
                        <!--<li class="sui-border-b">-->
                        <!--</li>-->
                    </ul>
                    <div class="searchResultNo">
                        <div class="no-line-box">  
                            <div class="no-line">
                            </div>  
                            <div class="no-line-tips">暂无搜索结果</div>
                        </div>
                    </div>

                   <div class="gather">
                       <!-- 当前位置 -->
                       <div class="current-history">
                           <div class="current" id="currentAddress" style="display: none;">
                               <div class="title">当前位置：</div>
                               <div class="station-group">
                                   <span id="currentAddressDetail" data-lng="" data-lat="">深圳湾创业投资大厦</span>
                               </div>
                           </div>

                           <!-- 历史记录 -->
                           <div class="history" id="historySearch"  style="display: none;">
                               <div class="title">历史地点</div>
                               <div class="station-group-history" id="historyAddress">
                               </div>
                           </div>
                       </div>


                       <!-- 地区推荐 -->
                       <div class="recommend" id="startCity" style="display: none;">
                           <!--<h4 class="title">按地区找线路</h4>
                           <h5 class="subtitle">珠海市</h5>
                           <div class="station-group">
                               <span>全部地区</span>
                               <span>香洲区</span>
                               <span>斗门区</span>
                               <span>金湾区</span>
                           </div>-->
                       </div>
                       <div class="recommend" id="endCity" style="display: none;">
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
                    <div class="tools-control">
                        <div class="search-input">
                            <i class="icon-search"></i>
                            <input type="text" placeholder="城市中文名或拼音" />
                        </div>
                    </div>
                    <button  type="button" class="cancel" id="closeCity">关闭</button>
                </div>
            </div>


            <div class="pop-special"></div>
            <div id="cityWrapper" class="wrapper">
                <div class="content" id="cityList">
                    <div class="current-city">当前定位所在城市：<span>深圳市</span></div>
                    <input type="hidden" id="currAreaCode" value="0755">
                    <!--<div class="sui-list-title" id="city1">A</div>
                    <ul class="sui-list">
                        <li>广州</li>
                        <li>深圳</li>
                        <li>珠海</li>
                    </ul>
                    <div class="sui-list-title" id="city2">B</div>
                    <ul class="sui-list">
                        <li>广州</li>
                        <li>深圳</li>
                    </ul>
                    <div class="sui-list-title" id="city3">C</div>
                    <ul class="sui-list">
                        <li>广州</li>
                    </ul>-->
                </div>

                <!-- 字母检索 -->
                <ul class="nav-city">
                    <!--<li><a href="#city1">A</a></li>
                    <li><a href="#city2">B</a></li>
                    <li><a href="#city3">C</a></li>
                    <li><a href="#city4">D</a></li>-->
                </ul>
            </div>
        </div>
    </div>

    
    <!-- <div class="foot-btn"></div> -->
    <#include "/sideMenu.ftl">
    <!-- 底部 -->
    <#include "/_footer.ftl">

    <script src="/js/zepto.min.js"></script>
    <script src="/js/simpleui.min.js"></script>
    <script src="/js/zepto.cookie.js"></script>
    <script src="/js/zepto.md5.js"></script>
    <script src="/js/commonjs/babel.min.js"></script>
    <script src="/js/commonjs/polyfill.min.js"></script>
    <script src="/config.js?v=${version}"></script>
    <script src="/js/commonjs/header.js?v=${version}"></script>
    <script src="/js/vectors.min.js?v=${version}"></script>
    <script src="/js/common.js?v=${version!}"></script>
    <script src="/adConfig.js?providerId=${providerId}&positionCode=index-banner&operatorId=${baseUser.id!''}"></script>
    <script src="/js/commonjs/swiper.min.js?v=${version}"></script>
    <script src="/js/commonjs/jweixin-1.4.0.js?v=${version!}"></script>
	<script src="/js/shareConfig.js?v=${version}"></script>
    <script src="https://webapi.amap.com/maps?v=1.4.4&key=cc84bbc40681d10bdf6a924b2caf31d5"></script>
	<!--<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.3&key=65b7cb5e8c694cb822cd32791319b348"></script>-->
    <script src="/js/commonjs/commonShare.js?v=${version}"></script>  <!-- 分享 &ndash;&gt;-->
    <script src="/js/cityBus/index.js?v=${version}" type="text/babel"></script>

</body>
</html>
