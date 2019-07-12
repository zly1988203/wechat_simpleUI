package com.olakeji.passenger.wechat;

public class AppUrlConfig {

	public static final String GET_HOT_LINE = "/bus/getHotLine";// 大巴获取热门路线

	public static final String GET_COMMUTE_HOT_LINE = "/commute/getHotLine";// 获取上下班热门线路

	public static final String SEARCH_BUS = "/busLine/searchBus";

	public static final String SEARCH_COMMUTE = "/commuteLine/getLineList";

	public static final String QRC_LINELIST = "/qrcForLine/getLineList";

	public static final String GET_LINE_LIST = "/busline/getLineList";// 获取大巴路线列表

	public static final String TO_LINE_DETAIL = "/busline/queryLineDetail";// 获取线路详情

	public static final String JUDGE_LINE_DETAIL = "/busline/judgeLineDetail";

	public static final String GET_FREQUENT_PASSENGERS = "/bus/passengerContactInfo/getList";// 获取常用乘车人列表

	public static final String TO_ADD_ORDER = "/busline/toAddOrder";// 跳转到添加订单页面

	public static final String ADD_CONTACT = "/bus/passengerContactInfo/add";// 添加常用联系人

	public static final String DELETE_CONTACT = "/bus/passengerContactInfo/delete";// 删除常用联系人

	public static final String UPDATE_CONTACT = "/bus/passengerContactInfo/update";// 修改常用联系人

	public static final String GET_CONTACT = "/bus/passengerContactInfo/getPassengerContactInfo";// 获取单个联系人

	public static final String TO_PAYMENT = "/busline/toPayment";// 跳转支付页面

	public static final String ADD_ORDER = "/busline/addOrder";// 提交订单

	public static final String GET_TICKET_LIST = "/busTicket/queryBusTicketList"; // 获取乘客票列表

	public static final String GET_TICKET_LIST_BY_DATE = "/busTicket/queryTicketListByDate"; // 获取乘客票列表

	public static final String GET_TICKET_DETAIL = "/busTicket/queryDetail"; // 获取乘客票详情

	public static final String GET_TICKET_REFUNDRATE = "/busTicket/refundRate"; // 获取退票费率

	public static final String UNLOCK_TICKET = "/busTicket/unLockTicket";

	public static final String TO_BUSONLINEPAY = "/bus/toBusOnlinePay";

	public static final String TO_GETPAYOPENID = "/bus/getPayOpenid";

	public static final String TO_GETPREPAYINFO = "/bus/getPrepayInfo";

	public static final String TO_WXPAY = "/bus/toWxPay";

	public static final String JUDGE_ORDER_bUSINESS = "/busline/busOrder/judgeBusiness";// 判断车企开通了多少业务

	public static final String BUS_ORDER_DETIAL = "/busline/busOrder/orderDetail";// 大巴订单详情

	public static final String BUS_COMMUNTE_ORDER_DETIAL = "/busline/busOrder/commuteOrderDetail";// 上下班线路订单详情

	public static final String BUS_TICKET_INFO_LIST = "/busline/busOrder/ticketList";// 大巴票信息

	public static final String BUS_HOT_LINE_SUB_LIST = "/busline/hotLineSubList";// 获取热门线路子线路列表

	public static final String COMMUTE_HOT_LINE_SUB_LIST = "/commuteLine/getHotLineList";// 获取通勤热门线路子线路列表

	public static final String COMMUTE_ONE_BASE_BUS_LIST = "/commuteLine/getOneScheduleBaseBusList";// 获取某一车次的排班列表(上下班线路)

	public static final String BUS_LINE_ONE_BASE_BUS_LIST = "/busLine/getOneLineBaseBuseList";// 获取某一车次的排班列表(定制线路)

	public static final String BUS_ORDER_MAP = "/busline/busOrder/getOrderMapDetail";// 订单地图页的详情

	public static final String BUS_TICKET_REFUND_RATE = "/busline/busOrder/getTicketRefundRate";// 查询退票比例

	public static final String BUS_CANCEL_ORDER = "/busline/busOrder/cancelOrder";// 取消订单

	public static final String GET_ORDER_DRIVER_LOCATION = "/busline/busOrder/getDriverLocationAndStationSymbol";

	public static final String PAY_ON_BUS = "/busline/payOnBus";// 上车支付

	public static final String GET_CITYS = "/busline/getCitys";// 获取城市列表

	public static final String PAY_COUPON = "/bus/payByCoupon";// 优惠劵支付

	public static final String IS_NEED_IDCARD_NUMBER = "/bus/passengerContactInfo/isNeedIDCardNumber";// 是否需要身份证号

	public static final String PROVIDER_WECHAT_CONFIG = "/wechatInfo/domain/";// 请求车企公众号配置信息

	public static final String WECHAT_SERVER_CHECKSIGNATURE = "/wechat/checkSignature";// wechatServer进行token验证

	public static final String WECHAT_SERVER_RECEIVE_CONTENT = "/wechat/recevieContent";// wechatServer处理微信主动推送的事件消息

	public static final String QUERY_NOT_PAY_ORDERS = "/busline/queryNotPayOrders";

	public static final String GET_INNERCITY_ORDER_INFO = "/innerCity/orderDetail/getOrderInfo";// 获取订单信息

	public static final String GET_INNERCITY_ORDER_DRIVER_INFO = "/innerCity/order/getDriverInfo";// 获取司机信息

	public static final String GET_OPENCITYS = "/Config/openCityList";// 获取城市列表

	public static final String JUDGE_SERVICE = "/innerCity/judgeService";// 判断经纬度是否在电子围栏内

	public static final String INNER_CITY_ADD_ORDER = "/innerCity/order/addOrder";// 添加城际约租车订单

	public static final String INNERCITY_ORDER_REFUND_DETAIL = "/innerCity/order/refundDetailPage";// 获取退款详情（城际约租车）

	public static final String INNERCITY_ORDER_CANCEL_REFUND_DETAIL = "/innerCity/order/cancelReturnPage";// 获取退款详情（城际约租车）

	public static final String INNERCITY_ORDER_REFUND = "/innerCity/order/refund";// 退款(城际约租车)

	public static final String GET_BUSINESS_TYPES = "/busline/getBusinessTypes";// 获取车企包含业务类型

	public static final String GET_WAIT_PAY_ORDER_DETAIL = "/innerCity/order/getOrderDetail/";

	public static final String GET_ORDER_PREPAY_INFO = "/innerCity/order/getInnerCityOrderPrepayInfo";// 获取订单预支付信息
	public static final String INNER_CITY_DISTANCE = "/innerCity/order/getDistance";// 获取距离

	public static final String INNER_CITY_GET_WAIT_ORDERS = "/innerCity/order/getWaitOrders";// 获取未支付和未指派的订单

	public static final String INNER_CITY_GET_ONTHEWAY_ORDERS = "/innerCity/order/getOnTheWayOrders";// 获取进行中的订单

	public static final String INNER_CITY_GET_RESERVATION_ORDERS = "/innerCity/order/getReservationOrders";// 获取已预约的订单

	public static final String INNER_CITY_GET_UNDER_WAY_ORDERS = "/innerCity/order/underWayOrders";// 获取等待，已预约，进行中的订单

	public static final String INNER_CITY_GET_FINISHED_ORDERS = "/innerCity/order/getFinishedOrders";// 获取完成了的订单

	public static final String INTER_CITY_GET_INDEX_CONFIG = "/innerCity/getIndexConfig";// 获取首页基础配置
	public static final String INTER_CITY_ONLINE_GET_INDEX_CONFIG = "/hail/innerCity/getIndexConfig";// 获取首页基础配置

	public static final String INNER_CITY_ORDER_DETAIL = "/innerCity/order/toOrderDetail";// 订单详情页

	public static final String INNER_CITY_CANCEL_ORDER = "/innerCity/order/cancel";// 取消订单

	public static final String INNER_CITY_QUERY_UNFINISHED_ORDER = "/innerCity/order/queryIfHasUnfinishedOrder";// 查询城际约租车有没有未完成的行程

	public static final String INNER_CITY_QUERY_IFOPENMODEL = "/innerCity/queryIfOpenModel";

	public static final String INNER_CITY_QUERY_TIMEOUT = "/innerCity/order/payTimeOut"; // 待支付倒计时

	public static final String GET_PROVIDER_PAYTYPE = "/Config/getPayType";// 获取车企配置的支付结算方式

	public static final String GET_HISTORY_LINE = "/bus/getHistoryOrder";// 大巴获取历史记录

	public static final String GET_INSURANCE_NO = "/insuranceApi/getInsuranceNos"; // 获取保单号

	public static final String BUS_REFUND_TICKET = "/busline/toRefundTicket"; // 退票页面

	public static final String INIT_ORDER = "/busline/busOrder/initOrder";// 在支付之前先初始化订单

	public static final String COMMUTE_ORDER_MAP = "/commute/commuteOrder/toOrderDetailMap";// 订单地图页的详情

	public static final String GET_COMMUTE_TICKET_LIST = "/busTicket/queryCommuteBusTicketList"; // 获取乘客通勤和定制车票列表

	public static final String GET_COMMUTE_TICKET_DETAIL = "/busTicket/queryCommuteDetail"; // 获取乘客通勤和定制车票详情

	public static final String COMMUTE_ORDER_DETIAL = "/commute/commuteOrder/orderDetail";// 大巴订单详情

	public static final String COMMUTE_TICKET_INFO_LIST = "/commute/commuteOrder/ticketList";// 通勤票信息

	public static final String COMMUTE_TOADD_ORDER = "/commute/toAddOrder";// 通勤下订单页面

	public static final String GET_COMMUTE_HISTORY_LINE = "/commute/getHistoryOrder";// 获取上下班历史记录线路

	public static final String COMMUTE_ADD_ORDER = "/commute/addOrder";// 创建订单

	public static final String TO_COMMUTE_LINE_DETAIL = "/commute/queryLineDetail";// 获取线路详情

	public static final String UNLOCK_COMMUTE_TICKET = "/busTicket/unLockCommuteTicket";

	public static final String QRCODE_TO_PAY = "/qrcode/toPay"; // 进入付款界面

	public static final String QRCODE_PAY_INFO = "/qrcode/getPrepayInfo"; // 获取预支付信息

	public static final String QRCODE_INFO = "/qrcode/getInfo"; // 付款成功之后信息

	public static final String QRCODE_TEL = "/qrcode/custTel"; // 查找客服电话

	public static final String BUS_HISTORY_LINE = "/busline/historyLineList";// 获取历史线路信息

	public static final String USER_OARTH_DETAIL = "/qrcFocus/userOathDetail"; // 用户是否已经关注公众号

	public static final String PRIOVIDER_PROVIDERINFO = "/provider/providerDetail";// 获取车企信息

	public static final String GET_PROVIDER_WECHAT_CONFIG = "/Account/queryProviderWechatConfigInfo";
	public static final String BUSLINE_TOCOMMENT = "/comment/toComment";// 跳转到评价页面
	// 新跳转到评价页面
	public static final String BUSLINE_TOCOMMENT_NEW = "/comment/toCommentBusBefore";
	public static final String BUSLINE_TOCOMMENT_DETAIL = "/comment/toCommentDetail";// 跳转到评价页面详情
	//新的获取评价接口 班线类的
	public static final String BUSLINE_TOCOMMENT_DETAIL_BUS = "/comment/toCommentDetailBus";

	public static final String BUSLINE_ADDCOMMENT = "/comment/addComment";// 添加评论

	public static final String BUSLINE_TOCOMMENT_SUCCESS = "/comment/toCommentSuccess";// 评论成功页面

	public static final String COMMENT_UPLOADIMG = "/comment/uploadImg";// 评价功能上传照片
	public static final String COMMONTOOL_UPLOADIMG = "/commonTool/uploadImg";// 统一的上传照片

	public static final String COMMENT_DOWNLOADWXPICANDUPLOADQINIU = "/comment/downloadWxPicAndUploadQiNiu";// 上传微信照片
	public static final String COMMONTOOL_DOWNLOADWXPICANDUPLOADQINIU = "/commonTool/downloadWxPicAndUploadQiNiu";// 统一公共的上传微信照片

	public static final String GET_INNERCITY_QRCODE_INFO = "/innerCity/getQrcodePayInfo";// 获取城际约租车二维码支付相关信息
	public static final String GET_INNERCITY_PROVIDERPAY_INFO = "/innerCity/getProviderPayInfo";// 获取城际约租车二维码支付相关信息
	public static final String GET_INNERCITY_QRCODE_ORDER_INFO = "/innerCity/getInnerCityQrcodeOrderInfo";// 获取城际约租车二维码支付订单相关信息
	public static final String INNERCITY_QRCODE_TEL = "/innerCity/qrcode/custTel"; // 获取客服电话
	public static final String GET_INNERCITY_QRCODE_ORDER_PREPAY_INFO = "/innerCity/qrcode/getInnerCityOrderPrepayInfo";// 获取城际约租车二维码支付相关信息
	public static final String UPDATE_USER_INFO = "/Account/updateUserInfoByWx";// 根据微信信息修改用户资料
	public static final String UPDATE_OSP_USER_INFO = "/Account/saveUserInfoByOsp";// 根据微信信息修改用户资料

	// 微信登录
	public static final String WECHAT_LOGIN = "/Account/wechatLoginRegister";
	public static final String BUY_ACTIVITY_DETAIL = "/buyActivity/activityDetail";// 满减活动详情
	public static final String BUY_ACTIVITY_LIST = "/buyActivity/activityList";// 活动列表
	public static final String BUY_ACTIVITY_USER_COUPON = "/buyActivity/queryUserCoupons";// 满减活动领取记录
	public static final String ACTIVITY_LINE_INFO = "/activityLine/activityToLine";// 参加活动的线路相关
	public static final String BUY_ACTIVITY_FETCH_COUPON = "/buyActivity/fetchCoupon";// 用户领取优惠券
	public static final String PAY_SUCCESS_ACTIVITY_DETAIL = "/buyActivity/payActivityDetail";// 支付成功获取活动详情
	public static final String ACTIVITY_CHECK = "/activity/activtyCheck";// 验证活动是否存在
	public static final String BIND_USER_TOKEN = "/Account/bindUserOpenid";
	public static final String BUSTICKET_ORDER_LIST = "/busTicketOrder/getBusTicketOrderList";

	// 汽车票
	public static final String BUS_TICKET_ORDER_DETAIL = "/busTicketOrder/orderDetail";// 汽车票业务订单详情
	public static final String BUS_TICKET_TICKET_RULE = "/busTicketOrder/ticketRule";// 汽车票业务订单详情
	public static final String BUSTICKET_GETSTATION = "/busTicket/getStation"; // 获取站点
	public static final String BUSTICKET_GETCITY = "/busTicket/getCitys"; // 获取城市
	public static final String BUSTICKET_BASE_BUS_DETAIL = "/busTicket/baseBusDetail";// 获取汽车票业务车次详情
	public static final String BUSTICKET_PRESELL_DAY = "/busTicket/getPresellDay";// 获取汽车票业务车次详情

	public static final String BUSTICKET_QUERY_LINE_LIST = "/busTicket/queryLineList";// 查询车次列表

	public static final String BUSTICKET_REFUND = "/busTicket/busTicketRefund";// 汽车票退票

	public static final String CHECK_BUSTICKET = "/busTicket/toBusTicketRefund"; // 检查退票数据

	public static final String BUSTICKET_GET_LINE_LIST = "/busTicket/getLineList";// ajax查询车次列表
	// 行程列表
	public static final String TRIP_LIST = "/trip/tripListByDate"; // 行程列表
	public static final String TRIP_LIST_DATE = "/trip/tripListDateByUserId"; // 行程列表

	public static final String CHECK_BUSTICKET_REFUND = "/busTicket/checkBusTicketRefund"; // 检查退票数据

	public static final String TO_ADD_BUSTICKET_ORDER = "/busTicket/toAddBusTicketOrder";

	public static final String GET_TICKET_REFUND_DETAIL = "/busTicket/getTicketRefundDetail";// 获取退票详情信息

	public static final String BUSTICKET_PRE_PAY_INFO = "/busTicketOrder/getPrepayInfo";// 检查汽车票订单支付信息

	public static final String BUSTICKET_ADDORDER = "/busTicket/addOrder";

	public static final String COMMUTE_TO_BATCH_REFUND = "/commute/commuteOrder/toBatchRefund";// 通勤批量退票

	public static final String COMMUTE_CHECK_REFUND = "/commute/commuteOrder/checkRefund";// 检查票的状态

	public static final String COMMUTE_REFUND_DETAIL = "/commute/commuteOrder/toRefundDetail";// 查询退票详情页

	public static final String BUS_LINE_AREA = "/busline/getAreas";// 获取车企线路开通的城市区域
	
	public static final String GET_REMINDER = "/Config/reminder";// 温馨提示

	public static final String BUSTICKET_GET_INVOICE_LIKE = "/busTicketOrder/getInvoiceLink";

	public static final String BUSTICKET_QUERY_HISTORY_CONTACT = "/busTicket/queryHistoryContact";
	// 活动相关的
	public static interface Activity {
		public static final String ACTIVITY_LINE_REQUIRE_ADD = "/activity/line/require/add";// 添加春运活动线路采集
		public static final String ACTIVITY_LINE_REQUIRE_ADD_RULE = "/activity/line/require/addRule";// 添加春运活动线路采集规则
		
		public static final String ACTIVITY_RECOM_EXIST = "/activityRecom/queryIfHasActivity";//首页查询是否有活动
		
		public static final String GET_ALL_CITYS = "/activity/line/require/getAllCitys";//获取全国所有城市
		 
	}
	
	public static interface Travel {
		public static final String Travel_LINE_QUERY = "/travel/queryTravelLine";// 添加春运活动线路采集
	}
	
	public static interface Online{
		public static final String CHECK_TRIP_STATUS = "/onlineCarTrip/checkTripAndOrder";//校验乘客是否有未完成的行程或订单
		public static final String INIT_TRIP = "/onlineCarTrip/initTrip";//添加网约车行程
		public static final String TRIP_PRICE = "/onlineCarTrip/tripPrice";//添加网约车行程
		public static final String OPEN_CITY = "/baseOnlineCar/openCity";//获取开放的城市
		public static final String OPEN_CITY_DETAIL = "/baseOnlineCar/checkCityIsOpen";//获取开放的城市详情
		public static final String PASSENGER_CANCEL_ORDER = "/onlineCarOrder/passengerCancelOrder"; //乘客取消订单
		public static final String GET_DRIVER_BY_DRIVERID = "/onlineCarTrip/showDriverReceipt";  //听单页面的司机信息
		public static final String ORDER_LIST = "/onlineCarOrder/orderList";  //查询网约车订单列表
		public static final String ORDER_DETAIL = "/onlineCarOrder/orderDetail";  //查询网约车订单详细
		public static final String GET_PRICE_RULE = "/baseOnlineCar/getPriceRule";  //查询网约车计价规则(根据开通城市自增Id查询)
		public static final String PRICE_RULE = "/baseOnlineCar/priceRule";  //查询网约车计价规则(根据区域Id查询)
		public static final String CANCEL_TRIP = "/onlineCarTrip/cancelTrip";//取消行程
		public static final String COMMENT_TAG = "/onlineCarTrip/queryComment"; //查询评论标签
		public static final String ADD_COMMENT = "/onlineCarTrip/addComment"; //添加评论
		public static final String QUERY_COMMENT_DETAIL = "/onlineCarTrip/queryrCommentByOrderNo"; //查询评价详情
		public static final String PAY_PREINFO = "/onlineCarPay/getPrepayInfo"; //支付信息
		public static final String CHECK_ZEROPAY = "/onlineCarPay/checkZeroTspPay"; //零元支付信息
		public static final String PROVIDER_AGREEMENT = "/baseOnlineCar/providerPage"; //车企协议信息
		public static final String CAR_NUMBERS = "/baseOnlineCar/carNumbers"; //获取附近车辆数
		public static final String ONLINE_INDEX = "/baseOnlineCar/index"; //获取网页车首页基础配置
		public static final String INNER_CITY_ONLINE_INDEX = "/hail/baseOnlineCar/index"; //获取网页车首页基础配置

		public static final String SOS_MESSAGE = "/baseOnlineCar/sosMessage"; //发送sos求助短信
		public static final String ORDER_SHARE = "/onlineCarTrip/share";  //听单页面的司机信息
		public static final String ADD_COMPLAINT = "/baseOnlineCar/addComplaint"; //添加投诉建议
		public static final String QUERY_COMPLAINT = "/baseOnlineCar/queryComplaint"; //查询投诉建议
		
	}
	
	/**
	 * 预约租车
	 * @author Administrator
	 *
	 */
	public static interface CharteredCar{
		public static final String QUERY_CHARTERED_CAR_CONFIG = "/baseCharteredCar/index"; //查询预约包车的配置
		public static final String ADD_CHARTERED_CAR_ORDER = "/charteredCarOrder/addCharteredCarOrder"; //添加订单
	}

	/**
	 * 分销接口定义
	 */
	public static interface Distribution {
		//获取用户URL地址
		public static final String GET_DISTRIB_URL = "/distrib/getDistribUrl";
		//获取推广员相关信息
		public static final String GET_DISTRIB_BOUNTYINFO= "/distrib/getBountyInfo";
		//获取推广线路列表接口
		public static final String GET_DISTRIB_LINELIST = "/distrib/getPromoterLineList";
		//获取收支明细列表接口
		public static final String GET_DISTRIB_BOUNTYDETAILLIST = "/distrib/getBountyDetailList";
		//获取用户下单返佣记录列表
		public static final String GET_DISTRIB_CUSTOMERORDERLIST = "/distrib/getCustomerOrderList";
		//绑定用户OpenId
		public static final String DISTRIB_BINDUSER = "/distrib/bindUser";
		/**
		 * 根据业务类型获取车企推广宣传语
		 */
		String GET_DISTRIB_POSTER_SLOGAN = "/distrib/getPosterSlogan";
		/**
		 * 获取车企所有宣传语
		 */
		String GET_DISTRIB_ALL_POSTER_SLOGAN = "/distrib/getAllPosterSlogan";
	}
	
	/**
	 * 日历接口定义，显示是否有票
	 */
	public static interface Calendar {
		//日历接口定义，显示是否有票
		public static final String GET_CALENDAR_LIST = "/busline/calendarList";
	}
	
	/**
	 * 城际约租车URL接口
	 */
	public static interface InnerCity {
		//查询订单司机经纬度及其它详细信息
		public static final String SHOW_DRIVER_DETAIL = "/innerCity/showDriverDetail";
	}
	
	/**
	 * 检查微信公众号自动登录
	 */
	public static interface AutoLogin {
		//检查微信公众号自动登录
		public static final String WECHAT_AUTO_LOGIN = "/Account/checkWechatAutoLogin";
	}

	public static interface  Annual{
		public static final String STATISTICS_GETDATA = "/annual/statistics/getData";
		public static final String STATISTICS_SAVERECORD = "/annual/statistics/saveRecord";
	}

	public static interface CouponFission{
		public static final String SHARE_LINK = "/couponFission/getShareLink";
		public static final String SHARE_CHECK = "/couponFission/getShareCheckOrder";
		public static final String HAIL_SHARE_CHECK = "/hail/couponFission/getShareCheckOrder";
		public static final String SHARE_SETEXPIRED = "/tsp/api/setSpliteOutExpired";
	}

	public static final String COMMON_STATISTICS = "/common/statistics/saveRecord";
    /**
     * 班线获取城市
     */
    public static final String NEW_GET_OPENCITYS = "/busline/optimized/getOpenCitys";
    public static final String NEW_GET_OPENAEAR = "/busline/optimized/getOpenAreas";

    public static final String PROVIDERWEHCHATURL = "/provider/getProviderWechatUrl";
}
