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
    <link href="/res/style/base/fy-datepicker.css?v=${version!}" rel="stylesheet" type="text/css">
    <!--<link href="/res/style/coach/line-list.css?v=${version!}" rel="stylesheet" type="text/css">-->
    <link href="/res/style/coach/line-list-01.css?v=${version!}" rel="stylesheet" type="text/css">
	<script>window.PointerEvent = undefined</script>
</head>

<body>

    <header>
    <div id="wrapper">
        <div class="content">
            <!--data-size="11" 需要显示的日历天数-->
            <ul class="ola-date" data-size="11"></ul>
        </div>
    </div>
    <button class="all-date-btn">全部<br/>日期</button>
</header>

    <div class="line-list">
        <div class="main">
            <div class="swapper" id="lineList">
            	<!--<#list data.lineList as item> -->
                <!--<div class="item line <#if (item.buyFlag!1) == 0>disabled</#if>" data-id="${item.idStr!''}">-->
                    <!--<div class="left">-->
                        <!--<h4>${item.departTimeStr}</h4>-->
                    <!--</div>-->
                    <!--<div class="middle">-->
                        <!--<div class="station">-->
                            <!--<div class="station-item">-->
                                <!--<h4>${item.departStation!''}</h4>-->
                            <!--</div>-->
                            <!--<div class="station-item">-->
                                <!--<h4>${item.arriveStation!''}</h4>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--<div class="right">-->
                        <!--<h2>${item.sellPrice!''}元</h2>-->
                         <!--<#if (item.buyFlag!1) == 0>-->
                        	<!--<p>${item.statusDesc!''}</p>-->
                        <!--<#else>-->
                        	<!--<p>${item.seatRemain!''}张</p>-->
                        <!--</#if>-->
                        <!--<#if (item.consumeTime!'')!= ''>-->
                        <!--<p>约${item.consumeTime!''}小时</p>-->
                        <!--</#if>-->
                    <!--</div>-->
                <!--</div>-->
                <!--</#list>-->
            <!--</div>-->
            <div class="empty-page" style="display: none">
                <div class="empty-main">
                    <i style="padding-top: 43.07%; background-image: url(/res/images/common/icon_defect_line.png);"></i>
                    <p>暂时没有找到合适的线路<br>换个地点再试试吧。</p>
                    <div class="btn primary">回到首页</div>
                </div>
            </div>
        </div>

        <footer>
            <ul class="sub-menu">
                <li id="selectStartStation">出发站点</li>
                <li id="selectEndStation">到达站点</li>
                <li id="selectStartTime">发车时间</li>
            </ul>
        </footer>
    </div>

    <!-- 选择日期 -->
    <div id="select-date" class="sui-popup-container" data-trigger="">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <div class="date"></div>
        </div>
    </div>

    <!-- 出发站点 -->
    <div id="start-station" class="sui-popup-container foot-handle-popup" data-trigger="">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <div class="head">
                <button data-handle="reset" class="btn">重置</button>
                <h4>出发站点</h4>
                <button data-handle="submit" class="btn">确定</button>
            </div>
            <div class="scroll-box">
                <ul class="main">
                    <!--默认选项：li添加样式active，input添加属性checked-->
                    <li <#if (departStation!'不限') =='不限'> class="active"</#if>><h4>不限</h4><input type="checkbox" class="frm-checkbox" name="startStation" value="不限" <#if (departStation!'不限') =='不限'> checked</#if>></li>
                    <#list data.departStaionList as item>
                    <li <#if (departStation!'不限') ==(item.stationName!'')>class="active"</#if>><h4>${item.stationName!''}</h4><input type="checkbox" class="frm-checkbox" name="startStation" value="${item.stationName!''}" <#if (departStation!'不限') ==(item.stationName!'')> checked</#if>></li>
                    </#list>
                </ul>
            </div>
        </div>
    </div>

    <!-- 到达站点 -->
    <div id="end-station" class="sui-popup-container foot-handle-popup" data-trigger="">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <div class="head">
                <button data-handle="reset" class="btn">重置</button>
                <h4>到达站点</h4>
                <button data-handle="submit" class="btn">确定</button>
            </div>
            <div class="scroll-box">
                <ul class="main">
                    <!--默认选项：li添加样式active，input添加属性checked-->
                    <li <#if (arriveStation!'不限') =='不限'>class="active"</#if>><h4>不限</h4><input type="checkbox" class="frm-checkbox" name="endStation" value="不限" <#if (arriveStation!'不限') =='不限'> checked</#if>></li>
                    <#list data.arriveStationList as item>
                    <li <#if (arriveStation!'不限') ==(item.stationName!''?string)> class="active"</#if>><h4>${item.stationName!''}</h4><input type="checkbox" class="frm-checkbox" name="endStation" value="${item.stationName!''}" <#if (arriveStation!'不限') ==(item.stationName!''?string)> checked</#if>></li>
                    </#list>
                </ul>
            </div>
        </div>
    </div>

    <!-- 发车时间 -->
    <div id="start-time" class="sui-popup-container foot-handle-popup" data-trigger="">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <div class="head">
                <button data-handle="reset" class="btn">重置</button>
                <h4>发车时间</h4>
                <button data-handle="submit" class="btn">确定</button>
            </div>
            <div class="scroll-box">
                <ul class="main">
                    <!--默认选项：li添加样式active，input添加属性checked-->
                    <li class="active"><h4>不限</h4><input type="checkbox" class="frm-checkbox" name="startTime" value="不限" checked></li>
                    <li><h4>00:00~06:00</h4><input type="checkbox" class="frm-checkbox" name="startTime" value="1"></li>
                    <li><h4>06:00~12:00</h4><input type="checkbox" class="frm-checkbox" name="startTime" value="2"></li>
                    <li><h4>12:00~18:00</h4><input type="checkbox" class="frm-checkbox" name="startTime" value="3"></li>
                    <li><h4>18:00~24:00</h4><input type="checkbox" class="frm-checkbox" name="startTime" value="4"></li>
                </ul>
            </div>
        </div>
    </div>


    <input type="hidden" value="${data.presellDay!60}" id="presellDay"/>
    <input type="hidden" value="${departStation!'不限'}" id="departStation"/>
    <input type="hidden" value="${arriveStation!'不限'}" id="arriveStation"/>
    <input type="hidden" value="${data.departDate!''}" id="departDate"/>
    <input type="hidden" value="${currentDateStr!''}" id="currentDateStr"/>
    <input type="hidden" value="${departPid}" id="departPid"/>
    <input type="hidden" value="${arrivePid}" id="arrivePid"/>
    <input type="hidden" value="${data.departAreaName!''}" id="departAreaName"/>
    <input type="hidden" value="${data.arriveAreaName!''}" id="arriveAreaName"/>

<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/zepto.scrollTo.min.js?v=${version!}"></script>
<script src="/js/coach/fy-datePicker.min.js?v=${version!}"></script>
<script src="/js/date.js?v=${version!}"></script>
<script src="/js/busTicket/busTicketLineList.js?v=${version!}"></script>

</body>
</html>