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
    <link href="/res/style/base/swiper.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/commutingBus/commutingBusIndex.css?v=${version}" rel="stylesheet" type="text/css">
    <link href="/res/style/commutingBus/commutingSearchPop.css?v=${version}" rel="stylesheet" type="text/css">
    <link href="/res/style/commutingBus/fonts/iconfont.css?v=${version}" rel="stylesheet">
</head>

<body>

<!--顶部-->
<#include "/_header.ftl">

    <div class="search-form sui-border-b">
        <div class="search-station">
            <ul class="sui-list">
               <div class="icon-line"></div>
              <div class="sui-li">
                  <li>
                      <!--<span class="icon iconfont icon-start_icon"></span>-->
                      <div class="control start">
                          <input id="startAddr" type="text" class="select-city-btn" placeholder="您在哪上车" readonly />
                      </div>
                  </li>
                  <div class="bottom-line"></div>
                  <li>
                      <!--<span class="icon iconfont icon-end_icon"></span>-->
                      <div class="control end">
                          <input id="endAddr" type="text" class="select-city-btn" placeholder="您要去哪儿" readonly />
                      </div>
                  </li>
                  <input type="hidden" id="stationType" value="startAddr">
              </div>
                <!--<span class="icon iconfont icon-Line_icon"></span>-->

            </ul>
        </div>
    </div>

    <!--行程-->
    <!--行程-->
    <div class="scheduling" style="display: none;">
        <header>
            <div class="border-weight"></div>
            <div class="title">行程</div>
            <span class="icon iconfont icon-more_icon1 nav-right"></span>
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

    <!--banner广告图-->
<div id="layerContainer" class="layer-wrapper" style="display:none;">
    <div class="btnAd-close"></div>
    <div id="swpLayer" class="index-layer" >
        <div class="swiper-container">
            <div class="swiper-wrapper">

            </div>
            <div class="swiper-pagination"></div>
        </div>
    </div>
</div>
<div class="layer-modal" style="display: none"></div>

    <!--推荐线路-->
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
    <div id="search-address" class="sui-popup-container" hidden>
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <div class="search-bar">
                <div class="search-bar-inner">
                    <div class="tools-control">
                        <div id="setCityButton" class="set-city">深圳市</div>
                        <input type="hidden" id="areaCode" value="0755">
                        <input type="hidden" id="cityId" value="431000">
                        <div class="search-input">
                            <span class="icon iconfont icon-search_icon"></span>
                            <input id="textSearchMap" type="text" placeholder="搜索地点地址" />
                        </div>
                    </div>
                    <button  type="button" class="cancel" id="closeBtn">关闭</button>
                    <button  type="button" class="cancel" id="cancelBtn" style="display: none">取消</button>
                </div>
            </div>

            <div id="searchWrapper" class="wrapper">
                <div class="content">
                    <ul id="mapResult" class="sui-list" style="display:none;">

                    </ul>
                    <div id="adrsResult" class="gather">

                        <div class="current-panle">
                            <!-- 当前位置 -->
                            <div class="current" id="currentAddress" style="display: none;">
                                <div class="title">当前定位：</div>
                                <div class="adrs" id="currentAddressDetail" data-lng="" data-lat="">
                                    <span></span>
                                </div>
                            </div>

                            <!-- 历史记录 -->
                            <div class="historyAddress" id="historySearch" style="display: none;">
                                <div class="title">历史地点</div>
                                <div class="station-group" id="historyStation">
                                </div>
                            </div>
                            <div class="remove-history" style="display: none;">清空历史记录</div>
                        </div>

                        <!-- 地区推荐 -->
                        <div class="recommend" id="areaCityPanel" style="display: none;">
                            <div class="title">按地区找线路</div>
                            <div class="area-content">
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <!--选择城市-->
    <div id="select-Citys" class="sui-popup-container">
        <div class="sui-popup-mask"></div>
        <!--<div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">-->
        <div class="sui-popup-modal">
            <div class="search-bar sui-border-b">
                <div class="search-bar-inner">
                    <div class="tools-control">
                        <div class="search-input">
                            <span class="icon iconfont icon-search_icon"></span>
                            <input type="text" placeholder="城市中文名或拼音" />
                        </div>
                    </div>
                    <button id="closeCitys" type="button" class="cancel">关闭</button>
                </div>
            </div>

            <!-- 字母检索 -->
            <ul class="nav-city">

            </ul>
            <div class="pop-special">L</div>
            <div id="cityWrapper" class="wrapper">
                <div class="content">
                    <div class="current-city" style="display: none;">
                        <div class="city-title">
                            <span>
                                当前定位所在城市：
                            </span>
                        </div>
                        <div class="city-name">
                                <span>深圳市</span>
                        </div>
                        </div>
                    <div class="city-list"></div>

                </div>
            </div>
        </div>
    </div>

    <#include "/sideMenu.ftl">

    <!-- 底部 -->
    <#include "_footer.ftl">
    <script src="/js/zepto.min.js"></script>
    <script src="/js/simpleui.min.js"></script>
    <script src="/js/zepto.cookie.js"></script>
    <script src="/js/zepto.md5.js"></script>
    <script src="/config.js?v=${version}"></script>
    <script src="/js/commonjs/header.js?v=${version}"></script>
    <script src="/js/vectors.min.js?v=${version}"></script>
    <script src="/js/common.js?v=${version!}"></script>
    <script src="/js/commonjs/swiper.min.js?v=${version!}"></script>
    <script src="/js/commonjs/jweixin-1.4.0.js?v=${version!}"></script>
    <script src="/js/shareConfig.js?v=${version}"></script>
    <script src="https://webapi.amap.com/maps?v=1.4.4&key=cc84bbc40681d10bdf6a924b2caf31d5"></script>
    <script src="/res/style/commutingBus/fonts/iconfont.js"></script>
    <script src="/js/commonjs/commonShare.js?v=${version}"></script>
    <script src="/js/commutingBus/serverApi.js?v=${version}"></script>
    <script src="/js/commutingBus/commutingBusIndex.js?v=${version}"></script>
</body>
</html>
