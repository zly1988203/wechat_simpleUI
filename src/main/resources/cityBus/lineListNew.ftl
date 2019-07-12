<#include "/_framework.ftl">
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>查询结果页</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/cityBus/searchLineResult.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/zjcx-datePicker.css?v=${version!}" rel="stylesheet" type="text/css">
    <#--<link href="/res/style/cityBus/fyDate2.css?v=${version!}" rel="stylesheet" type="text/css">-->
</head>
<style>
    .main-content{margin-top:0;padding-top: 1.2rem;min-height: 70%;}
</style>
<body>
<div class="search-date-content">
    <div class="change-day last-day">前一天</div>
    <div id="activeBox" class="current-box" data-trigger="false">
        <span></span>
        <input id="activeDay" type="hidden" value=""/>
    </div>
    <div class="change-day next-day">后一天</div>
</div>

<#--<div class="date-content" style="display: none;">-->
    <#--<div class="date-container">-->
        <#--<div class="content"></div>-->
        <#--&lt;#&ndash;<div class="paging-tips">上滑加载更多</div>&ndash;&gt;-->
    <#--</div>-->
<#--</div>-->
<div class="date-content" style="display: none">
    <div class="date-content-box">
        <!--日历控件-->
        <div class="date-picker-container comment-theme-blue">
            <!--星期-->
            <div class="weeks-box"></div>
            <!--月份-->
            <div class="months-content">
                <div class="months-box">

                </div>
            </div>
        </div>
    </div>
</div>



<div class="main-content">
    <div class="station-content" style="display: none">
        <div class="station-name">广州市 · 番禺区</div>
        <div class="station-name">深圳市 · 南山区</div>
    </div>

    <div class="result-line-list" style="display: none;">
        <ul>
            <li class="line-item">
                <div class="line-top">
                    <div class="top-left"><span class="start-time">8:00</span><span class="line-name">LXC123</span></div>
                    <div class="top-right"><div class="line-price">特价35</div><div class="original">原价45</div></div>
                </div>
                <!--区域到区域的-->
                <div class="line-middle" data-toggle="false">
                    <div class="station-list">
                        <div class="station-item get-on">
                            <div class="item-name">站点名称1</div>
                            <div class="item-type">起点</div>
                        </div>
                        <div class="station-item get-on">
                            <div class="item-name">站点名称站点名称站点名称2</div>
                            <div class="item-time">（约18：20）</div>
                            <div class="item-type">起点</div>
                            <div class="item-distance">
                                <i></i><span>1.3km</span>
                            </div>
                        </div>
                        <div class="station-item get-on">
                            <div class="item-name">站点名称站点名称站点名称2</div>
                            <div class="item-time">（约18：20）</div>
                            <div class="item-type">起点</div>
                            <div class="item-distance">
                                <i></i><span>1.3km</span>
                            </div>
                        </div>
                        <div class="station-item get-off">
                            <div class="item-name">站点名称站点名称站点名称3</div>
                            <div class="item-time">（约18：20）</div>
                            <div class="item-type">起点</div>
                            <div class="item-distance">
                                <i></i><span>1.3km</span>
                            </div>
                        </div>
                        <div class="station-item get-off">
                            <div class="item-name">站点名称站点名称站点名称3</div>
                            <div class="item-time">（约18：20）</div>
                            <div class="item-type">起点</div>
                            <div class="item-distance">
                                <i></i><span>1.3km</span>
                            </div>
                        </div>
                        <div class="station-item get-off">
                            <div class="item-name">站点名称站点名称站点名称4</div>
                            <div class="item-time">（约18：20）</div>
                            <div class="item-type">起点</div>
                        </div>
                    </div>

                    <div class="flex-bar">
                        <div class="switch-o switch-t"></div>
                        <div class="switch-btn">全部</div>
                        <div class="switch-o switch-b"></div>
                    </div>
                </div>
                <div class="line-bottom">
                    <div class="services-group">
                        <span>豪华大巴</span><span>豪华大巴</span><span>豪华大巴</span><span>豪华大巴</span><span>豪华大巴</span><span>豪华大巴</span><span>豪华大巴</span><span>豪华大巴</span><span>豪华大巴</span>
                        <span>豪华大巴</span><span>豪华大巴</span><span>豪华大巴</span><span>豪华大巴</span>
                    </div>
                    <div class="bottom-right">
                        <div class="store-tips">少量余票</div>
                        <div class="buy-ticket-btn">购票</div>
                    </div>
                </div>
            </li>
            <li class="line-item">
                <div class="line-top">
                    <div class="top-left"><span class="start-time">8:10</span><span class="line-name">LXC123</span></div>
                    <div class="top-right"><div class="line-price">特价35</div><div class="original">原价45</div></div>
                </div>
                <!--区域到区域的-->
                <div class="line-middle">
                    <div class="station-list">
                        <div class="station-item">
                            <div class="item-name">站点名称1</div>
                            <div class="item-type">起点</div>
                        </div>
                        <div class="station-item">
                            <div class="item-name">站点名称2</div>
                            <div class="item-time">（约8：20）</div>
                            <div class="item-type">起点</div>
                        </div>
                    </div>
                </div>
                <div class="line-bottom">
                    <div class="services-group">
                        <span>豪华大巴</span><span>豪华大巴</span><span>豪华大巴</span><span>豪华大巴</span>
                    </div>
                    <div class="bottom-right">
                        <div class="store-tips">少量余票</div>
                        <div class="buy-ticket-btn">购票</div>
                    </div>
                </div>
            </li>
            <li class="line-item sell-out">
                <div class="line-top">
                    <div class="top-left"><span class="start-time">8:00</span><span class="line-name">LXC123</span></div>
                    <div class="top-right"><div class="line-price">特价35</div><div class="original">原价45</div></div>
                </div>
                <!--区域到区域的-->
                <div class="line-middle">
                    <div class="station-list">
                        <div class="station-item get-on">
                            <div class="item-name">站点名称1</div>
                            <div class="item-type">起点</div>
                        </div>
                        <div class="station-item get-on">
                            <div class="item-name">站点名称站点名称站点名称2</div>
                            <div class="item-time">（约18：20）</div>
                            <div class="item-type">起点</div>
                        </div>
                        <div class="station-item get-off">
                            <div class="item-name">站点名称站点名称站点名称3</div>
                            <div class="item-time">（约18：20）</div>
                            <div class="item-type">起点</div>
                        </div>
                        <div class="station-item get-off">
                            <div class="item-name">站点名称站点名称站点名称4</div>
                            <div class="item-time">（约18：20）</div>
                            <div class="item-type">起点</div>
                        </div>
                    </div>
                    <div class="flex-bar">
                        <div class="switch-o switch-t"></div>
                        <div class="switch-btn">全部</div>
                        <div class="switch-o switch-b"></div>
                    </div>
                </div>
                <div class="line-bottom">
                    <div class="services-group">
                        <span>豪华大巴</span><span>豪华大巴</span><span>豪华大巴</span>
                    </div>
                    <div class="bottom-right">
                        <div class="store-tips">少量余票</div>
                        <div class="buy-ticket-btn">购票</div>
                    </div>
                </div>
            </li>
        </ul>
    </div>

    <div class="no-line-box" style="display: none;">
        <div class="no-line"></div>
        <div class="no-line-tips">暂时没有找到合适的班次</div>
    </div>
</div>

<div class="handle-list">
    <div class="handle">返回</div>
</div>
<!--  底部 -->
<#include "/_footer.ftl">

<script src="/js/zepto.min.js"></script>
<script src="/js/simpleui.min.js"></script>
<script src="/js/zepto.cookie.js"></script>
<script src="/js/zepto.md5.js"></script>
<script src="/js/commonjs/babel.min.js"></script>
<script src="/js/commonjs/polyfill.min.js"></script>
<script src="/config.js?v=${version}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/common.js?v=${version!}"></script>
<script src="/js/commonjs/util.js?v=${version!}"></script>
<script src="/js/commonjs/zjcx-datePicker.js?v=${version!}"></script>
<script src="/js/commonjs/jweixin-1.4.0.js?v=${version!}"></script>
<script src="/js/commonjs/commonShare.js?v=${version}"></script>  <!-- 分享 -->
<script src="/js/shareConfig.js?v=${version}"></script>
<script src="/js/cityBus/searchLineResult.js?v=${version!}" type="text/babel"></script>
</body>
</html>