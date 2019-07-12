    <!--司机信息-->
    <input id="tripNo" type="hidden" value="${orderInfo.tripNo!''}">
    <input type="hidden" id="orderNo" value="${orderInfo.orderNo!}">
    <input type="hidden" id="carNo" value="${orderInfo.carNo!}">
    <input id="driverName" type="hidden" value="${orderInfo.driverName!''}">
    <input id="logoURL" type="hidden" value="${orderInfo.logoURL!''}">
    <input type="hidden"  id="color"  value="${orderInfo.color!''}">
    <input type="hidden"  id="modelName"  value="${orderInfo.modelName!''}">
    <input type="hidden"  id="names"  value="${orderInfo.names!''}">
    <input type="hidden" id="driverId" value="${orderInfo.driverId!}">
    <input type="hidden" id="departCity" placeholder="出发地城市(行政区域)" value="${orderInfo.departCity!''}"/>
    <input type="hidden" id="departArea" placeholder="出发地区域(行政区域)" value="${orderInfo.departArea!''}"/>
    <input type="hidden" id="arriveCity" placeholder="目的地城市(行政区域)" value="${orderInfo.arriveCity!''}"/>
    <input type="hidden" id="arriveArea" placeholder="目的地区域(行政区域)" value="${orderInfo.arriveArea!''}"/>

    <input type="hidden" id="departAreaCode" placeholder="出发地区域code" value="${orderInfo.upRegionId!''}"/>
    <input type="hidden" id="departTitle" placeholder="出发地名称" value="${orderInfo.departTitle!''}"/>
    <input type="hidden" id="departLat" placeholder="出发地纬度" value="${orderInfo.departLat!''}"/>
    <input type="hidden" id="departLng" placeholder="出发地经度" value="${orderInfo.departLng!''}"/>
    <input type="hidden" id="departRegionName" placeholder="出发地区域名称" value="${orderInfo.upRegion!''}"/>
    <input type="hidden" id="arriveAreaCode" placeholder="目的地区域code" value="${orderInfo.downRegionId!''}"/>
    <input type="hidden" id="arriveTitle" placeholder="目的地名称" value="${orderInfo.arriveTitle!''}"/>
    <input type="hidden" id="arriveLat" placeholder="目的地纬度" value="${orderInfo.arriveLat!''}"/>
    <input type="hidden" id="arriveLng" placeholder="目的地经度" value="${orderInfo.arriveLng!''}"/>
    <input type="hidden" id="arriveRegionName" placeholder="目的地区域名称" value="${orderInfo.downRegion!''}"/>

    <input type="hidden" id="numbers" placeholder="人数" value="${orderInfo.numbers!''}"/>
    <input type="hidden" id="departTime" placeholder="出行时间" value="${orderInfo.departTime!''}"/>
    <input id="departType" type="hidden" placeholder="车型名称" value="${orderInfo.departType!0}">
    <input id="departCarType" type="hidden" value="${orderInfo.departCarType!0}">
    <input id="driverMobile" type="hidden" value="${orderInfo.driverMobile!''}">
    
    <input id="upRegion" type="hidden" value="${orderInfo.upRegion!''}">
    <input id="downRegion" type="hidden" value="${orderInfo.downRegion!''}">
    <input id="tipsMessage" type="hidden" value="${orderInfo.tipsMessage!''}">
    <input id="upRegion" type="hidden" value="${orderInfo.providerId!''}">

    <!--1-待执行 2-后付费业务进行中（后付费业务有此状态：同城出行、出租车) 3-待支付（预付费业务：城际约车，跳过“2-进行中”直接到此状态）4-已支付 5-预付费业务进行中（预付费业务完成“4-已支付”后有此状态：城际约车)6-已完成7-已取消 8-已关闭'-->
    <input id="status" type="hidden" placeholder="订单状态" value="${orderInfo.status!'0'}">
    <!-----支付模式 1 2--------------------->
    <input id="settleMode" type="hidden" value="${orderInfo.settleMode!0}">
    <input type="hidden" id="orderId" placeholder="线路ID" value="${orderInfo.cityLineId!0}"/>
    <!--是否可取消订单标志 0-不可取消，1-可取消-->
    <input type="hidden" id="hasCanCancelOrder" placeholder="是否可取消订单标志" value="${orderInfo.hasCanCancelOrder!''}"/>
    <!--是否可取消订单标志 前提是已完成行程 0-不可拨打，1-可拨打-->
    <input type="hidden" id="canCallDriverFlag" placeholder="是否可以拨打司机电话" value="${orderInfo.canCallDriverFlag!0}"/>
    <!--行程状态 1-发起行程  2-等待接单  3-待执行 4-去接乘客 5-到达出发地 6-接到乘客，去往目的地  7-到达目的地 8-已完成 9-已取消  10:发起收款-->
    <input type="hidden"  id="tripStatus" placeholder="行程状态"  value="${orderInfo.tripStatus!''}">

    <div class="driver-info-container">
        <div class="info">
            <div class="avatar"><img src="${orderInfo.driverAvatar!}"></div>
            <div class="content">
                <h4>${orderInfo.driverName!} · ${orderInfo.carNo!}</h4>
                <div class="second">
                    <div>${orderInfo.color!} · ${orderInfo.names!}${orderInfo.modelName!}</div>
                    <div class="service">
                        <div class="times">已服务${orderInfo.serverCount!'0'}次</div>
                        <div class="level">${orderInfo.star?string("0.0")}</div>
                    </div>
                </div>
            </div>
            <div class="other-info">
                <div class="identification">中交认证</div>
                <div class="tel"></div>
            </div>
        </div>
        <div class="tips-box">
            <div class="icon"></div>
            <div class="tips">派车成功，司机会准时来接您，请按约定时间到上车地点等候。</div>
        </div>
    </div>
    <!--行程信息-->
    <div class="journey-container">
        <div class="journey-content" data-lineid="${orderInfo.cityLineId!0}">
            <div class="time-box"></div>
            <div class="station-box">
                <div class="left">
                    <div class="station depart"></div>
                    <div class="station arrive"></div>
                </div>
                <div class="right">
                    <div class="box" data-numbers="${orderInfo.numbers!}" data-classname="${orderInfo.departType!}"><div>${orderInfo.numbers!}人</div><div id="depart_Type"></div></div>
                </div>
            </div>
            <div class="notes-box">
                <div class="icon"></div>
                <div class="notes"> </div>
            </div>
        </div>
    </div>
    <div class="switch-box" data-show="true"><i></i></div>

