<#include "/_framework.ftl">
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <title></title>
    <link href="/res/style/simpleui.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css" rel="stylesheet" type="text/css">
    <link href="/res/style/base/swiper.min.css" rel="stylesheet" type="text/css">
    <link href="/res/style/base/fy-datepicker.css" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/passenger.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/sameSale/attMain.css?v=${version!}" rel="stylesheet" type="text/css">
</head>
<body>
<div class="main-container">
    <!--banner轮播-->
    <div class="att-banner">
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <div class="content">
                        <div class="thumb">
                            <img  src="/res/images/sameSale/banner3.png"/>
                        </div>
                        <div class="att-title">1/4</div>
                    </div>
                </div>
                <div class="swiper-slide">
                    <div class="content">
                        <div class="thumb">
                            <img  src="/res/images/sameSale/banner4.png"/>
                        </div>
                        <div class="att-title">2/4</div>
                    </div>
                </div>
                <div class="swiper-slide">
                    <div class="content">
                        <div class="thumb">
                            <img  src="/res/images/sameSale/banner1.png"/>
                        </div>
                        <div class="att-title">3/4</div>
                    </div>
                </div>
                <div class="swiper-slide">
                    <div class="content">
                        <div class="thumb">
                            <img  src="/res/images/sameSale/banner6.png"/>
                        </div>
                        <div class="att-title">4/4</div>
                    </div>
                </div>
            </div>
            <!-- Add Pagination -->
            <div class="swiper-pagination" style="display: none"></div>
        </div>
    </div>

    <!--景区门票-->
    <div id="attractionsList" class="attractions-container" style="display: none">
        <div class="att-header">
            <div class="att-title">
                景点门票 <span>（提前抢票轻松出行）</span>
            </div>
            <!--<div class="att-total-price">-->
                <!--0元-->
            <!--</div>-->
            <input type="hidden" id="attTotalPrice" value="0">
        </div>
        <div class="att-body">

        </div>
    </div>

    <!--景区交通-->
    <div id="attrTrans" class="attraction-transportation-content" style="display: none">
        <div class="header">景区交通</div>
        <div class="trans-body">
            <div class="station">
                <div class="station-item">
                    <input id="departStation" placeholder="请选择出发站点" data-type="depart" readonly/>
                </div>
                <div class="station-item">
                    <input id="arriveStation" placeholder="请选择目的地" data-type="arrive" readonly/>
                </div>
            </div>
            <div id="preBuyBtn" class="pre-buy-btn">查询预订</div>
        </div>
    </div>

    <!--购票按钮-->
    <div class="buy-bottom-content">
        <input type="hidden" id="allTotalPrice" value="0">
        <div class="all-total-price">合计：<span>0元</span></div>
        <div id="toPayBtn" class="to-pay-btn bg_gray">去支付</div>
    </div>


</div>

<!---------黄山门票 begin----------->
<#include "attMain_Spot.ftl">
<!---------黄山门票 end----------->

<!--乘车站点选择-->
<div id="stationListPopup" class="sui-popup-container station-list-popup">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <!--内容开始-->
        <div class="popup-header sui-border-b temp-border-b">
            <div class="header-tips open-popup" data-target="ridingTips">乘车说明</div>
            <div class="close-popup"></div>
        </div>
        <div class="wrapper station-list">
            <div class="content">
                <ul class="passenger-list sui-list sui-list-cover">

                </ul>
            </div>
        </div>
        <div class="popup-btn-bar station-list-popup-fixed">
            <div id="stationConfirm" class="confirm-btn">确定</div>
        </div>
        <!--内容结束-->
    </div>
</div>

<!-- 乘车说明 -->
<div id="ridingTips" class="sui-popup-container riding-tips-popup">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal" style="height: 80%;">
        <!--内容开始-->
        <div class="popup-header sui-border-b temp-border-b">
            <div class="header-tips open-popup">乘车说明</div>
            <div class="close-popup" data-target="ridingTips"></div>
        </div>
        <div class="riding-content">
            <p>1、儿童1.2米以下免票，儿童1.2-1.5米半票，1.5米以上全票；</p>
            <p>2、宠物不得乘坐客车（导盲犬除外）；</p>
            <p>3、易燃易爆危险品不得携带乘车；</p>
            <p>4、松木及制品不得进入景区；</p>
        </div>
        <!--内容结束-->
    </div>
</div>

<!--景区车票-->
<div id="scenicBusTicket" class="sui-popup-container scenic-ticket-popup">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <!--内容开始-->
        <div class="popup-header sui-border-b temp-border-b">
            <div class="header-tips open-popup">景区车票</div>
            <div class="close-popup" data-target="scenicBusTicket"></div>
        </div>
        <div class="wrapper popup-content">
            <div class="content">
                <div class="station-line"><#--新国线换乘中心（汤口）<span></span> 慈光阁景区（黄山风景区前山入口）--></div>
                <div class="station-spec sui-border-b temp-border-b">
                    <div class="labels"><span>有条件退</span></div>
                    <!--<div class="warm-prompt open-popup" data-target="warmPromptContent">温馨提示</div>-->
                    <div class="warm-prompt open-popup" id="warmPrompt" data-target="warmPromptContent">温馨提示</div>
                </div>
                <div class="depart-date-box">
                    <div class="depart-tips">选择日期</div>
                    <div class="depart-date">
                        <input value="" readonly/>
                        <i></i>
                    </div>
                </div>
                <div class="busLine">
                    <div class="line-header sui-border-b">班次</div>
                    <div id="wrapper" style="display: none">
                        <div class="content">

                        </div>
                    </div>

                    <div class="empty-page" style="display: none">
                        <div class="empty-main">
                            <img  src="/res/images/common/icon_defect_line.png"/>
                            <p>暂时没有找到合适的线路<br>换个地点再试试吧。</p>
                        </div>
                    </div>
                </div>
                <div class="ticket-list">
                    <ul>

                    </ul>
                    <div class="total-price">合计：<span>0元</span>
                        <input type="hidden" id="totalPriceBus" value="0">
                    </div>
                </div>
            </div>
        </div>
        <div class="popup-btn-bar station-list-popup-fixed">
            <div id="busTicketConfirm" class="confirm-btn">确定</div>
        </div>
        <!--内容结束-->
    </div>
</div>

<!--温馨提示-->
<div id="warmPromptContent" class="sui-popup-container riding-tips-popup">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal" style="height: 80%;">
        <!--内容开始-->
        <div class="popup-header sui-border-b temp-border-b">
            <div class="header-tips">温馨提示</div>
            <div class="close-popup" data-target="warmPromptContent"></div>
        </div>
        <div class="riding-content">
            <div class="warm-prompt">

            </div>
        </div>
        <!--内容结束-->
    </div>
</div>

<!-- 车票选择日期 -->
<div id="selectDateBus" class="sui-popup-container" style="display: none">
    <div class="sui-popup-mask sui-popup-mask-visible" style="display: block;"></div>
    <div class="sui-popup-modal">
        <!-- 日历控件，先填充数据并输出 -->
        <div class="datepicker-wrapper"></div>
    </div>
</div>

<!-- 景区门票/索道票 -->
<div id="scenicSpotTicket" class="sui-popup-container scenic-ticket-popup">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <!--内容开始-->
        <div class="popup-header sui-border-b temp-border-b">
            <div class="header-tips open-popup">景区门票/索道票</div>
            <div class="close-popup" data-target="scenicSpotTicket"></div>
        </div>
        <div class="popup-content">
            <div class="station-line">黄山景区门票</div>
            <div class="station-spec sui-border-b">
                <div class="labels"><span>有条件退</span><span>有条件退</span></div>
                <div class="warm-prompt open-popup" data-target="warmPromptContent">温馨提示</div>
            </div>
            <div class="depart-date-box">
                <div class="depart-tips">选择日期</div>
                <div class="depart-date">
                    <input value="2019-01-03" readonly/>
                    <i></i>
                </div>
            </div>

            <div class="ticket-list">
                <#--<ul>-->
                    <#--<li class="sui-border-b">-->
                        <#--<div class="ticket-info">-->
                            <#--<div class="ticket-type">儿童票</div>-->
                            <#--<div class="unit-price">单价:<span>5元</span></div>-->
                        <#--</div>-->
                        <#--<div class="ticket-amount">-->
                            <#--<i class="less"></i>-->
                            <#--<div class="amount"><input value="1" readonly/></div>-->
                            <#--<i class="more"></i>-->
                        <#--</div>-->

                    <#--</li>-->
                    <#--<li class="sui-border-b">-->
                        <#--<div class="ticket-info">-->
                            <#--<div class="ticket-type">成人票</div>-->
                            <#--<div class="unit-price">单价:<span>5元</span></div>-->
                        <#--</div>-->
                        <#--<div class="ticket-amount">-->
                            <#--<i class="less"></i>-->
                            <#--<div class="amount"><input value="1" readonly/></div>-->
                            <#--<i class="more"></i>-->
                        <#--</div>-->
                    <#--</li>-->
                <#--</ul>-->
                <div class="total-price">合计：<span>15元</span></div>
            </div>

            <div class="popup-btn-bar">
                <div id="spotTicketConfirm" class="confirm-btn">确定</div>
            </div>
        </div>

        <!--内容结束-->
    </div>
</div>
<input type="hidden" id="orderLimit" value="" />
<input type="hidden" id="maxBuyNumber" value="" />

<script src="/js/commonBus.js?v=${version!}"></script>
<script src="/js/vectors.min.js"></script>
<script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
<script src="/js/commonjs/swiper.min.js"></script>
<script src="/js/shareConfig.js?v=${version}"></script>
<script src="/js/commonjs/idCard.js?v=${version!}"></script>
<script src="/js/coach/fy-datePicker.min.js?v=${version!}"></script>
<script src="/js/sameSale/attMain_scenic.js?v=${version!}"></script>
<script src="/js/sameSale/attMain_bus.js?v=${version!}"></script>

</body>
</html>