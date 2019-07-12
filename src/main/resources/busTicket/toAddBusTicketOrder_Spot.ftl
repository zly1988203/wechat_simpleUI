<!---------黄山门票 begin----------->
<div id="attractionsList" class="attractions-container" style="display: none">
    <div class="att-header">
        <div class="att-title">
            景点门票 <span>（提前抢票轻松出游）</span>
        </div>
        <div class="att-total-price">
            0元
        </div>
        <input type="hidden" id="attTotalPrice" value="0">
    </div>
    <div class="att-body">
        <!--<div class="att-item">-->
            <!--<div class="active"></div>-->
            <!--<div class="item-banner">-->
                <!--<img src="/res/images/bus/icon-banner1.png">-->
            <!--</div>-->
            <!--<div class="item-content">-->
                <!--<div class="item-name-price">-->
                    <!--<div class="item-name">-->
                        <!--黄山风景区门票-->
                    <!--</div>-->
                    <!--<div class="item-sell-price">-->
                        <!--¥<em>150</em>起-->
                    <!--</div>-->
                <!--</div>-->
                <!--<div class="item-instructions">-->
                    <!--3月22号入园，截止至3月23号有效-->
                <!--</div>-->
                <!--<div class="item-others">-->
                    <!--<div class="item-others-left">-->
                        <!--<div class="item-tag">-->
                            <!--不可退-->
                        <!--</div>-->
                        <!--<div class="item-readme">-->
                            <!--<span></span> 购票须知<i></i>-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--<div class="item-others-right">-->
                        <!--<div class="btn-buy">预定</div>-->
                    <!--</div>-->

                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
        <!--<div class="item-person-info">-->
            <!--<div class="person-info">-->
                <!--<span class="person">成人票</span><span class="person-price">¥10</span>  x 1 张，-->
                <!--<span class="person">儿童票</span> <span class="person-price">¥5</span> x 1 张-->
            <!--</div>-->
            <!--<div class="person-btn">-->
                <!--<div class="btn-edit">修改</div>-->
            <!--</div>-->

        <!--</div>-->
    </div>
</div>

<div id="collectPerson" class="collect-person-container">
    <div class="coll-header">
        <div class="coll-title">
            取票人 <span>（仅需1位联系人，用于接收短信信息）</span>
        </div>
    </div>
    <div class="coll-body">
        <div class="coll-item">
            <div class="item-title">姓名</div>
            <div class="item-input"><input type="text" id="collName"></div>
            <div class="icon-clean" id="cleanName"></div>
        </div>
        <div class="coll-item">
            <div class="item-title">手机号</div>
            <div class="item-input"><input type="tel" id="collPhone" maxlength="11"></div>
            <div class="icon-clean" id="cleanPhone"></div>
        </div>
        <div class="coll-item">
            <div class="item-title">身份证</div>
            <div class="item-input"><input type="text" id="collCardId" maxlength="18"></div>
            <div class="icon-clean" id="cleanCardId"></div>
        </div>
    </div>
</div>

<div id="attIntroduce" class="sui-popup-container"  style="display: none">
    <div class="sui-popup-mask sui-popup-mask-visible" style="display: block;"></div>
    <div class="sui-popup-modal">
        <header>
            <div class="title">景点介绍</div>
            <div class="close introClose"></div>
        </header>
        <div class="content">

        </div>
        <div class="btn-toBuy" data-product-code="">立即预订</div>
    </div>
</div>

<div id="attReadInfo" class="sui-popup-container"  style="display: none">
    <div class="sui-popup-mask sui-popup-mask-visible" style="display: block;"></div>
    <div class="sui-popup-modal">
        <header>
            <div class="title">购票须知</div>
            <div class="close readInfoClose"></div>
        </header>
        <div class="content">

        </div>
        <div class="btn-toBuy" data-product-code="">立即预订</div>
    </div>
</div>

<div id="attOrderInfo" class="sui-popup-container"  style="display: none">
    <div class="sui-popup-mask sui-popup-mask-visible" style="display: block;"></div>
    <div class="sui-popup-modal">
        <header>
            <div class="head-left">
                <div class="btn-order-canle">取消</div>
            </div>
            <div class="head-right">
                <div class="btn-order-ok">确定</div>
            </div>
        </header>
        <div class="order-content">
            <div class="att-info">
                <div class="att-name"></div>
                <input type="hidden" id="productName" value="">
                <input type="hidden" id="productCode" value="">
                <input type="hidden" id="orderCert" value="">

                <div class="att-tag-readme">
                    <div class="tag-left">
                        <div class="att-tags">有条件退</div>
                    </div>
                    <div class="tag-right">
                        <div class="att-readme">购买须知</div>
                    </div>
                </div>
            </div>
            <div class="att-date">
                <div class="date-title">使用日期</div>
                <div id="btn-date" class="date-str">
                    <span class="date-val"></span><i></i>
                    <input type="hidden" id="orderDate" value="">
                </div>
            </div>
        </div>

        <!-- 成人票 -->
        <div id="personTickets" class="person-panle" style="display: none">
            <div class="person-body">
            </div>
        </div>

        <div id="personNumber" class="person-panle" style="display: none">
            <div class="content">
            </div>
        </div>

        <div class="total-amount">
            <div class="total-str">合计：</div>
            <div class="total-val">0元</div>
            <input type="hidden" id="totalAttAmount">
        </div>
        <!-- 取票人 -->
        <div id="collectTickets" class="passenger">
            <div class="head">
                <h5>取票人<span>（需要<span>1位</span>游客信息，用于入园身份验证）</span></h5>
            </div>
            <div class="content">
                <div class="item">
                    <div class="info">
                        <p><span class="label person-name">***</span><span class="person-phone">************</span></p>
                        <p><span class="label">身份证</span><span class="person-cardId">******************</span></p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
<!-- 选择日期 -->
<div id="selectDate" class="sui-popup-container" style="display: none">
    <div class="sui-popup-mask sui-popup-mask-visible" style="display: block;"></div>
    <div class="sui-popup-modal">
        <!-- 日历控件，先填充数据并输出 -->
        <div class="datepicker-wrapper"></div>
    </div>
</div>

<!--门票人员列表-->
<div id="ticketPersonList" class="sui-popup-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <!--乘车列表-->
        <div class="wrapper listWrapper">
            <div class="content">
                <div class="passenger-list-wrapper">
                    <ul class="sui-list sui-list-cover sui-border-b">
                        <li class="sui-cell-centerlink add-btn addPassengerButton">添加人员信息</li>
                    </ul>
                    <ul class="passenger-list sui-list sui-list-cover">
                        <!--
                            data-select：是否选中
                            data-name：  姓名
                            data-phone： 手机号码
                            data-code：  身份证号码
                        -->
                    </ul>
                </div>

            </div>
        </div>

        <div class="btn-bar pab-10 btn-flex">
            <button id="btnTicketCancle">取消</button>
            <button id="btnTicketPerson">确定</button>
        </div>

    </div>
</div>


<!---------黄山门票 end----------->