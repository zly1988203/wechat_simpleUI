<!---------黄山门票 begin----------->
<div id="attIntroduce" class="sui-popup-container"  style="display: none">
    <div class="sui-popup-mask sui-popup-mask-visible" style="display: block;"></div>
    <div class="sui-popup-modal">
        <header>
            <div class="title">景点介绍</div>
            <div class="close introClose"></div>
        </header>
        <div class="content">

        </div>
        <!--<div class="btn-toBuy" data-product-code="">立即预订</div>-->
    </div>
</div>

<div id="attReadInfo" class="sui-popup-container"  style="display: none">
    <div class="sui-popup-mask sui-popup-mask-visible" style="display: block;"></div>
    <div class="sui-popup-modal">
        <div class="popup-header sui-border-b temp-border-b">
            <div class="header-tips open-popup">购票须知</div>
            <div class="close readInfoClose"></div>
        </div>
        <div class="content">

        </div>
        <!--<div class="btn-toBuy" data-product-code="">立即预订</div>-->
    </div>
</div>

<div id="attOrderInfo" class="sui-popup-container"  style="display: none">
    <div class="sui-popup-mask sui-popup-mask-visible" style="display: block;"></div>
    <div class="sui-popup-modal">
        <div class="popup-header sui-border-b temp-border-b">
            <div class="header-tips open-popup">景区门票/索道票</div>
            <div id="closeSpotTicke" class="close-popup" data-target="scenicSpotTicket"></div>
        </div>
        <div class="order-content">
            <div class="att-info">
                <div class="att-name"></div>
                <input type="hidden" id="productName" value="">
                <input type="hidden" id="productCode" value="">
                <input type="hidden" id="orderCert" value="">

                <div class="att-tag-readme">
                    <div class="tag-left">
                        <div class="att-tags" id="refundHtml"></div>
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
                    <input type="hidden" id="expireDate" value="">
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

        <div class="popup-btn-bar">
            <div id="spotTicketConfirm" class="confirm-btn">确定</div>
        </div>

    </div>
</div>
<!-- 选择日期 -->
<div id="selectAttTicketDate" class="sui-popup-container" style="display: none">
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

                    </ul>
                </div>

            </div>
        </div>
        <div class="btn-passenger-bar btn-flex">
            <button id="btnTicketCancle">取消</button>
            <button id="btnTicketPerson">确定</button>
        </div>
    </div>
</div>

<!---------黄山门票 end----------->

<!--添加乘车人-->
<div id="addPassenger" class="sui-popup-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">

        <div class="add-passenger-wrapper">
            <ul class="form sui-list sui-list-cover">
                <li class="sui-border-b">
                    <label>姓名</label>
                    <input type="text" id="addPassengerName" placeholder="请输入姓名" />
                </li>
                <li class="sui-border-b">
                    <label>手机号</label>
                    <input type="tel" maxlength="11" id="addPassengerPhone" placeholder="请输入手机号" />
                </li>
                <li class="sui-border-b">
                    <label>身份证</label>
                    <input type="text" maxlength="18" id="addPassengerCode" placeholder="请输入身份证" />
                </li>
            </ul>
        </div>

        <div class="btn-group">
            <div class="btn default" id="cancelAddButton">取消</div>
            <div class="btn primary" id="submitAddButton">确定</div>
        </div>

    </div>
</div>

<!--编辑乘车人-->
<div id="editPassenger" class="sui-popup-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <div class="edit-passenger-wrapper">
            <ul class="form sui-list sui-list-cover">
                <li class="sui-border-b">
                    <label>姓名</label>
                    <input type="text" id="editPassengerName" placeholder="请输入姓名" />
                </li>
                <li class="sui-border-b">
                    <label>手机号</label>
                    <input type="tel" maxlength="11" id="editPassengerPhone" placeholder="请输入手机号" />
                </li>
                <li class="sui-border-b">
                    <label>身份证</label>
                    <input type="text" maxlength="18" id="editPassengerCode" placeholder="请输入身份证" />
                </li>
            </ul>
        </div>

        <div class="btn-passenger-bar pab-10">
            <button id="submitEditButton">确定</button>
        </div>

    </div>
</div>