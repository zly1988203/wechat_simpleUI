<!--侧边栏菜单-->
    <div id="sideMenu" class="sui-popup-container">
        <div class="sui-popup-mask"></div>
        <div class="sui-popup-modal">
            <div class="head" data-url="/passenger/my/myinfo.html??v=${version!}">
                <div class="avatar" style="background-image:url(/res/images/avatar_user.png)" id="avatar"></div>
                <div class="mobile">13800138000</div>
            </div>
            <ul class="sui-list">
                <li data-url="#" id="toCheckGift" style="display: none"><div class="sui-cell-icons"><span class="sui-cell-icon icon-coupon"></span> 核销礼品</div></li>
                <li data-url="/busline/busOrder/judgeBusiness">
                    <div class="sui-cell-icons" data-udplus="个人中心-查看订单列表">
                        <span class="sui-cell-icon icon-myorder"></span>
                        <span>订单</span>
                        <!--<span class="order-number">99</span>-->
                    </div>
                </li>
                <!-- <li data-url="/busTicket/toCommuteTicketListPage"><div class="sui-cell-icons"><span class="sui-cell-icon icon-ticket"></span> 车票</div></li> -->
				<!-- <li data-url="/busTicket/toTicketListPage"><div class="sui-cell-icons"><span class="sui-cell-icon icon-ticket"></span> 车票</div></li>  -->            

  				<li data-url="/trip/toTripListPage"><div class="sui-cell-icons" data-udplus="个人中心-查看行程"><span class="sui-cell-icon icon-ticket"></span> 行程</div></li>   
  				<li data-url="/passenger/coupon.html?v=${version!}">

                    <div class="sui-cell-icons" data-udplus="个人中心-查看优惠">
                        <span class="sui-cell-icon icon-coupon"></span>
                        <span>优惠</span>
                        <span class="coupon-number" style="display: none"></span>
                    </div>
                </li>
  				<li data-url="/passenger/activityList.html"><div class="sui-cell-icons" data-udplus="个人中心-查看活动" id="activity"><span class="sui-cell-icon icon-activity"></span> 活动</div></li>
                <li data-url="/passenger/config.html?v=1.1"><div class="sui-cell-icons"><span class="sui-cell-icon icon-config"></span> 设置</div></li>
                <li data-url="/passenger/suggest.html"><div class="sui-cell-icons"><span class="sui-cell-icon icon-suggest"></span> 反馈建议</div></li>
                <li data-url="#" id="toEmp" style="display: none"><div class="sui-cell-icons"><span class="sui-cell-icon icon-coupon"></span> 员工排行榜</div></li>
            </ul>
            <div class="foot">
                <div class="item" id="myBounty" style="display: none;" data-href="/distribution/myBounty?v=${version!}">
                    <span class="icon icon-bounty"></span>
                    <p>我的赏金</p>
                </div>
                <div class="item" id="getBounty" style="display: none;" data-href="/distribution/bountyHunter?v=${version!}">
                    <span class="icon icon-hunter"></span>
                    <p>去赚赏金</p>
                </div>
                <div class="item" id="contact">
                    <span class="icon icon-contact"></span>
                    <p>联系客服</p>
                </div>
                <div class="item" data-href="/passenger/invite.html?v=${version!}">
                    <span class="icon icon-invite"></span>
                    <p>邀请有礼</p>
                </div>
            </div>
        </div>
    </div>