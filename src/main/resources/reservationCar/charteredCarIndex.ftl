<#include "/_framework.ftl">
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>预约包车</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/time-picker.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/select-picker.css" rel="stylesheet" type="text/css">
    <link href="/res/style/font-style.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/reservationCar/index.css" rel="stylesheet" type="text/css">

</head>
<body>

<input type="hidden" id="adDomain" value="${adDomain!}">
<input type="hidden" id="positionCode" value="${positionCode!}">
<input type="hidden" id="providerId" value="${providerId!}">
<input type="hidden" id="operatorId" value="${baseUser.id!''}">
<!--顶部-->
<#include "/_header.ftl">

<!-- 广告位 -->
<div class="vrt">
    <!-- src：引入运营平台广告接口 -->
    <script src="/adConfig.js?providerId=${providerId!''}&positionCode=index-top&operatorId=${baseUser.id!''}"></script>
</div>
<div class="notice">
    ${baseProviderConfig.affiche!''}
</div>

<div class="search-form">
    <div class="tab-contents">
        <div id="dvtabs" class="tabs">
            <div id="tabOne" class="tab-item active">
                <span>单程</span>
            </div>
            <div id="tabTwo" class="tab-item">
                <span>往返</span>
            </div>
            <input type="hidden" id="tabWay" value="1">
            <input type="hidden" id="providerId" value="${baseProviderConfig.providerId!''}">
            <input type="hidden" id="providerName" value="${providerName!''}">
            <input type="hidden" id="providerMobile" value="${baseProviderConfig.mobile!''}">
        </div>
        <div id="present">
            <div class="search-station">
                <ul class="sui-list">
                    <li>
                        <div class="control start">
                            <i class="icon-point"></i>
                            <input id="startAddr" type="text" class="select-city-btn" placeholder="请您选择上车地点" value="" readonly />
                        </div>
                    </li>
                    <li>
                        <div class="control end">
                            <i class="icon-point"></i>
                            <input id="endAddr" type="text" class="select-city-btn" placeholder="您在哪下车" value="" readonly />
                        </div>
                    </li>
                </ul>
                <div class="exchange"></div>

            </div>
            <div class="present-time sui-border-b">
                <i class="icon-date"></i>
                <!-- data-now:默认时间；data-filter:需要显示的时间段；data-interval:最大可选数 data-level 可选的级别 -->
                <input type="text" id="present_startTime" class="startWeekTime"  placeholder="请选择何时出发" readonly value="现在出发" data-date="" data-time="now"   data-interval="${baseProviderConfig.days!3}" data-intervalminute="0"/>
            </div>
            <div id="dvEndTime" class="present-time sui-border-b undisplay">
                <i class="icon-date"></i>
                <!-- data-now:默认时间；data-filter:需要显示的时间段；data-interval:最大可选数 data-level 可选的级别 -->
                <input type="text" id="present_endTime" class="startWeekTime"  placeholder="请选择何时返程" readonly value="" data-date="" data-time="09" data-minute="00"   data-interval="${baseProviderConfig.days!3}" data-intervalminute="0"/>
            </div>
            <!--出行人数和出发时间-->
            <div class="trip-parameter">
                <ul class="sui-list controls">
                    <li>
                        <div class="present-people">
                            <i class="icon-people"></i>
                            <input id="present_peopleNumber" type="number" placeholder="出行人数"  value="" min="1" step="1" max="999999"/>
                        </div>

                    </li>
                    <li>
                        <div class="present-phone">
                            <i class="icon-phone"></i>
                            <input type="text"  id="present_phone" placeholder="电话号码" />
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>

<div class="message">
    <div class="container">
        <div class="title">备注</div>
        <label class="message-area" for="present_remark">
            <textarea id="present_remark" placeholder="备注" maxlength="100"></textarea>
            <div class="message-length">0/100</div>
        </label>
    </div>
</div>
<div class="tips">为了确保您包车服务需求能及时响应，请填写各项信息</div>
<input type="hidden" id="isShow" value="${baseProviderConfig.isShow!''}">
<div id="resbtn" class="search-btn">立即报价</div>

<!--查询地址-->
<div id="search-address" class="sui-popup-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <div class="search-bar">
            <div class="search-bar-inner">
                <div class="tools-control">
                    <div id="setCityButton" class="set-city">深圳</div>
                    <input type="hidden" id="areaCode" value="0755">
                    <div class="serach-input">
                        <input type="text" placeholder="请输入搜索关键字" />
                    </div>
                </div>
                <button  type="button" class="cancel">取消</button>
            </div>
        </div>


        <div id="searchWrapper" class="wrapper">
            <div class="content">
                <ul id="searchResult" class="sui-list">
                </ul>
                <div class="gather">
                    <!-- 当前位置 -->
                    <div class="current" id="currentAddress" style="display: none;">
                        <h4 class="title">当前位置</h4>
                        <div class="station-group">
                            <span id="currentAddressDetail" data-lng="" data-lat=""></span>
                        </div>
                    </div>

                    <!-- 历史记录 -->
                    <div class="history" id="historySearch" style="display: none;">
                        <h4 class="title">历史记录</h4>
                        <div class="station-group" id="historyAddress">
                        </div>
                    </div>
                    <div class="remove-history" style="display: none;">清空历史记录</div>

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
                <div class="tools-control search-city">
                    <!--<div class="serach-input sui-border">
                        <input type="text" placeholder="城市中文名或拼音" />
                    </div>-->
                    请选择城市
                </div>
                <button  type="button" class="cancel">取消</button>
            </div>
        </div>

        <!-- 字母检索 -->
        <ul class="nav-city">

        </ul>

        <div id="cityWrapper" class="wrapper">
            <div class="content" id="cityList">
                <div class="current-city">当前定位城市：深圳市</div>
            </div>
        </div>
    </div>
</div>

<div class="cover undisplay"></div>
<div id="reservationInfo" class="resInfo undisplay">
    <header>
        <span>您的预约包车服务</span>
        <i class="icon-close"></i>
    </header>
    <section>
        <div class="resItem">
            <span>行程:</span>
            <span id="resWay">单程</span>
        </div>
        <div class="decoration"></div>
        <div class="resItem">
            <span>出发地:</span>
            <span id="startPlace">深圳市科技园地理大厦</span>
        </div>
        <div class="resItem">
            <span>目的地:</span>
            <span id="endPalce">广州市火车站</span>
        </div>
        <div class="decoration"></div>
        <div class="resItem">
            <span>出发时间:</span>
            <span id="startTime">2018-05-23 19:36</span>
        </div>
        <div id="returnItem" class="resItem">
            <span>返程时间:</span>
            <span id="returnTime">2018-05-25 13:36</span>
        </div>
        <div class="decoration"></div>
        <div class="resItem">
            <span>乘车:</span>
            <span id="personNumb">2人</span>
            <span>电话:</span>
            <span id="personPhone">15625487625</span>
        </div>
        <div class="decoration"></div>
        <div class="resItem">
            <span>备注:</span>
            <span id="remark"  class="remark">说的放松的方式地方上的sdfsdfds
                放松的方式对发生的撒旦放松的方式对发生的上的放松地方上的发生的发生的
                撒地方上的上的发生的发生的说的放松的方式地方上的放松的方式对发生的
                上的发生的发生的所发生的</span>
        </div>
        <div class="decoration"></div>
        <div id="submitInfo" class="submitBtn">确认提交</div>
    </section>

</div>
<div id="msgBox" class="msg-alert undisplay">
    <div class="content">
        预约提交成功，工作人员稍后与你联系，请稍等。
    </div>
    <div class="btn-konw">知道了</div>
</div>
<!--侧边栏菜单-->
<#include "/sideMenu.ftl">
<script src="js/commonjs/header.js?v=${version!}"></script>
<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/commonjs/time-picker.min.js?v=${version!}"></script>
<script src="/js/commonjs/weekTime-picker.min.js?v=${version!}"></script>
<!--<script src="/js/commonjs/weekTime-picker.js?v=${version!}"></script>-->
<script src="/js/commonjs/select-picker.min.js?v=${version!}"></script>
<script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
<script src="/adConfig.js?providerId=${providerId}&positionCode=index-banner&operatorId=${baseUser.id!''}"></script>
<!--<script src="/js/commonjs/adLoading.js"></script>-->
<script src="/js/shareConfig.js?v=${version}"></script>
<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.3&key=65b7cb5e8c694cb822cd32791319b348"></script>
<script src="/js/vectors.js?v=${version!}"></script>
<script src="/js/backtrack.min.js?v=${version!}"></script>
<script src="/js/communicate.min.js"></script>
<script src="/js/reservationCar/index.js?v=${version!}"></script>

</body>
</html>