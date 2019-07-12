//模拟java枚举类型,定义代码以及描述
var BusinessType = {
    //业务类型 1-同城 2-城际 3-出租车 4-大巴线路 5-大巴包车 6-汽车票 7通勤 8 扫码支付 9 旅游线路 10网约车 17-城际网约车 18-同城网约车
    onlineCar: {type: 10, name: "网约车"},
    busline: {type: 4, name: "定制班线"},
    travel: {type: 9, name: "旅游线路"},
    commute: {type: 7, name: "通勤(上下班)"},
    busTicket: {type: 6, name: "汽车票"},
    innerCity: {type: 3, name: "城际约租车"},
    chartered: {type: 5, name: "预约包车"},
    taxi: {type: 3, name: "出租车"},
    interCityOnline: {type: 17, name: "城际网约车"},
    innerCityOnline: {type: 18, name: "同城网约车"},
    Name: function (typ) {
        for (var key in OrderStatus) {
            if (OrderStatus[key] instanceof Function) {
                continue;
            }
            var obj = OrderStatus[key];
            if (obj['type'] == typ) {
                return obj.name;
            }
        }
        return "";
    }
}

//websocket事件通知
var WssEvent = {
    DriverGpsReport: {serviceId: 1001, name: "司机端经纬度上报"},
    PushTripToDriver: {serviceId: 1002, name: "推送行程给司机"},
    TakeOrderRequest: {serviceId: 1003, name: "抢单请求"},
    TaskOrderResult: {serviceId: 1004, name: "抢单结果推送"},
    PushGpsToPassenger: {serviceId: 1005, name: "推送给乘客GPS信息"},
    PushMsgToPassenger: {serviceId: 1006, name: "推送给乘客其它消息"}
}

//websocket行程事件类型
var WssMsg1006 = {
    //1:去接乘客 2:司机抵达出发地 3:司机接到乘客 4:司机抵达目的地 5:司机取消订单 6:乘客取消订单 7:抢单成功
    ToPickPassenger: {type: 1, name: "去接乘客"},
    ArriveInDepart: {type: 2, name: "司机抵达出发地"},
    PickedPassenger: {type: 3, name: "司机接到乘客"},
    ArriveInDest: {type: 4, name: "司机抵达目的地"},
    DriveCancelOrder: {type: 5, name: "司机取消订单"},
    PassengerCancelOrder: {type: 6, name: "乘客取消订单"},
    GrabbedOrder: {type: 7, name: "抢单成功"},
    DriveOffer: {type: 8, name: "司机调整价格(报价)"},
    CashOffline: {type: 9, name: "现金收款"},
    Name: function (typ) {
        for (var key in OrderStatus) {
            if (OrderStatus[key] instanceof Function) {
                continue;
            }
            var obj = OrderStatus[key];
            if (obj['type'] == typ) {
                return obj.name;
            }
        }
        return "";
    }
}

//订单状态
var OrderStatus = {
    /**
     * 订单状态定义
     * 1-待执行 2-后付费业务进行中（后付费业务有此状态：同城出行、出租车) 3-待支付（预付费业务：城际约车，跳过“2-进行中”直接到此状态）
     * 4-已支付 5-预付费业务进行中（预付费业务完成“4-已支付”后有此状态：城际约车)6-已完成7-已取消 8-已关闭
     */
    NotDeal: {status: 1, name: "订单未处理"},
    UnderWay: {status: 2, name: "进行中(后付费)"},
    WaitPay: {status: 3, name: "订单待支付"},
    PaySuccess: {status: 4, name: "订单已支付"},
    PayUnderWay: {status: 5, name: "预付费业务进行中"},
    PayFinished: {status: 6, name: "已完成"},
    Canceled: {status: 7, name: "已取消"},
    Closed: {status: 8, name: "已关闭"},
    Name: function (stat) {
        for (var key in OrderStatus) {
            if (OrderStatus[key] instanceof Function) {
                continue;
            }
            var obj = OrderStatus[key];
            if (obj['status'] == stat) {
                return obj.name;
            }
        }
        return "";
    }
}

//行程状态
var TripStatus = {
    /**
     * 行程状态定义
     * 1-发起行程  2-等待接单  3-待执行 4-去接乘客 5-到达出发地 6-接到乘客，去往目的地  7-到达目的地 8-已完成 9-已取消  10:发起收款
     */
    Init: {status: 1, name: "发起行程"},
    WaitOrder: {status: 2, name: "等待接单"},
    ConfirmOrder: {status: 3, name: "待执行(确认订单)"},
    ToPickPassenger: {status: 4, name: "去接乘客"},
    ArriveInDepart: {status: 5, name: "到达出发地"},
    PickedPassenger: {status: 6, name: "接到乘客，去往目的地"},
    ArriveInDest: {status: 7, name: "到达目的地"},
    Finished: {status: 8, name: "已完成"},
    Canceled: {status: 9, name: "已取消"},
    SendPay: {status: 10, name: "发起收款"},
    Name: function (stat) {
        for (var key in OrderStatus) {
            if (OrderStatus[key] instanceof Function) {
                continue;
            }
            var obj = OrderStatus[key];
            if (obj['status'] == stat) {
                return obj.name;
            }
        }
        return "";
    }
}

//支付状态
var PayOrderStatus = {
    NonPay: {status: 0, name: "未支付"},
    AlreadyPay: {type: 1, name: "已支付"},
    Name: function (stat) {
        for (var key in OrderStatus) {
            if (OrderStatus[key] instanceof Function) {
                continue;
            }
            var obj = OrderStatus[key];
            if (obj['status'] == stat) {
                return obj.name;
            }
        }
        return "";
    }
}

//验票状态
var TicketCheckStatus = {
    Init: {status:0, name:"初始"},
    Paid: {status:1, name:"已购票"},
    Refund: {status:2, name:"已退票"},
    Fetched: {status:3, name:"已取票"},
    Checked: {status:4, name:"已检票"},
    Book: {status:5, name:"预定"},
    Cancel: {status:6, name:"取消"},
    Expire: {status:7, name:"过期"},
    Failed: {status:8, name:"失败"},
    Failed: {status:9, name:"退票中"},
    Name: function (stat) {
        for (var key in OrderStatus) {
            if (OrderStatus[key] instanceof Function) {
                continue;
            }
            var obj = OrderStatus[key];
            if (obj['status'] == stat) {
                return obj.name;
            }
        }
        return "";
    }
}