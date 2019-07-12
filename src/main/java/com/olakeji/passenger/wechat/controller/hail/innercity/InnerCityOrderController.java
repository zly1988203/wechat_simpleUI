package com.olakeji.passenger.wechat.controller.hail.innercity;

import com.olakeji.cache.RedisUtil;
import com.olakeji.common.wechat.bean.user.WeChatUser;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.controller.hail.HailController;
import com.olakeji.passenger.wechat.entity.*;
import com.olakeji.passenger.wechat.service.innercity.CommonInnerCityOrderService;
import com.olakeji.passenger.wechat.utils.CookieUtil;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.cache.CacheKey;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.NotValidatePermission;
import com.olakeji.tsp.common.OrderStatusKey;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.common.passenger.PassengerConstant;
import com.olakeji.tsp.utils.DateUtils;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.utils.QiniuDown;
import com.olakeji.tsp.validation.ValidParameter;
import com.olakeji.tsp.vo.InnerCityOrderInfoVo;
import com.olakeji.tsp.vo.PassengerReturnDetailVo;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * @author pridewu
 */
@Controller("HailInnerCityOrderController")
@RequestMapping("/hail/innerCity/order")
public class InnerCityOrderController extends HailController {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());

	@Value("${app.id}")
	private Integer appId;
	@Value("${app.key}")
	private String appKey;
	@Value("${client.type}")
	private Integer clientType;
	@Value("${app.version}")
	private Double appVersion;

	/**
	 * 中交appId
	 */
	@Value("${zhongjiao.APP_ID}")
	private String zhongjiaoAppId;

	@Value("${pay.server.url}")
	private String payCenterUrl;

	@Value("${zhongjiao.sub_app_id}")
	private String zhongjiaoSubAppId;

	@Autowired
	private RedisUtil redisUtil;

	public static final String REDIRECT = "redirect:";
	@Autowired
	public CommonInnerCityOrderService commonInnerCityOrderService;

	/**
	 * go destination
	 * 
	 * @author pridewu
	 * @param orderNo
	 */
	@RequestMapping(value = "/goDestination")
	public String goDestination(String orderNo, Model model) {

		String url = apiUrlPrefix + AppUrlConfig.GET_INNERCITY_ORDER_INFO;
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("orderNo", orderNo);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		if (resultData.getCode() != Constant.SUCCESS) {
			return "Error500";
		}
		model.addAttribute("orderInfo", resultData.getData());

		return "hail/order/goDestination";
	}

	@RequestMapping(value = "/searchDistanceByGps")
	@ResponseBody
	public String searchDistanceByGps(String gpsArrive, String driverId) {

		String url = apiUrlPrefix + AppUrlConfig.INNER_CITY_DISTANCE;
		Map<String, String> paramsMap = new HashMap<String, String>();
		String gps = redisUtil.getString(CacheKey.GPS_DRIVER + driverId);

		LbsDriverGpsLocation lbsDriverGpsLocation = GsonUtil.GsonToBean(gps, LbsDriverGpsLocation.class);
		if (lbsDriverGpsLocation == null || lbsDriverGpsLocation.getLng() == null
				|| lbsDriverGpsLocation.getLat() == null) {
			ResultEntity resultEntity = new ResultEntity(Constant.FAILURE);
			resultEntity.setMessage("no driver location");
			return GsonUtil.GsonString(resultEntity);
		}
		String gpsCurrent = lbsDriverGpsLocation.getLng() + "," + lbsDriverGpsLocation.getLat();

		paramsMap.put("gpsCurrent", gpsCurrent);
		paramsMap.put("gpsArrive", gpsArrive);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		/**
		 * piggy.huang 增加一个字段来上传司机经纬度
		 */
		Map<String, Object> data = (Map<String, Object>)resultData.getData();
		data.put("gps", lbsDriverGpsLocation);

		return GsonUtil.GsonString(resultData);
	}

	@RequestMapping(value = "/getDriverInfo")
	@ResponseBody
	public String getDriverInfo() {
		String url = apiUrlPrefix + AppUrlConfig.GET_INNERCITY_ORDER_DRIVER_INFO;
		Map<String, String> paramsMap = new HashMap<String, String>();
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);

		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		return GsonUtil.GsonString(resultData);
	}

	/**
	 * 进入到城际约车订单待支付界面
	 * 
	 * @param request
	 * @param orderNo
	 * @return
	 */
	@RequestMapping(value = "toOrderPay")
	public String toInterCityOrderPay(HttpServletRequest request, String orderNo, Model model, String type) {
		String url = apiUrlPrefix + AppUrlConfig.GET_INNERCITY_ORDER_INFO;
		Map<String, String> paramsMap = new HashMap<>();
		paramsMap.put("orderNo", orderNo);
		Map<String, String> params = this.genReqApiData(url, paramsMap);

		String resultJson = HttpUtil.doPostReq(url, params);
		LOGGER.info("toOrderPay 请求连接地址：{}, 返回数据：{}",url,resultJson);
		ResultEntity resultEntity = GsonUtil.GsonToBean(resultJson, ResultEntity.class);

		String innerCityOrderInfo = GsonUtil.GsonString(resultEntity.getData());
		InnerCityOrderInfoVo orderInfo= GsonUtil.GsonToBean(innerCityOrderInfo, InnerCityOrderInfoVo.class);

		url = commonUrlJudge(orderInfo);

        LOGGER.info("订单路径:{}",url);
		if (orderInfo.getPayMode() == null || orderInfo.getPayMode() == 0) {
			String url2 = apiUrlPrefix + AppUrlConfig.INNER_CITY_QUERY_TIMEOUT;
			 params = this.genReqApiData(url2, paramsMap);

			LOGGER.info("付款倒计时请求连接地址：{}",url2);
			String jsonResult = HttpUtil.doPostReq(url2, params);
			LOGGER.info("付款倒计时请求返回：{}",jsonResult);
			ResultEntity en = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
			model.addAttribute("remainTime", en.getData());
		}

 		model.addAttribute("type", type);
		if (orderInfo.getStatus() == OrderStatusKey.ORDER_STATUS_WAITPAY_INT) {
			model.addAttribute("orderInformation", resultEntity.getData());
			return "hail/order/interCityorderPayment";
		} else {
			return REDIRECT + url;
		}
	}

	/**
	 * 获取订单预支付信息
	 * 
	 * @param orderNo
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "getOrderPrepayInfo")
	public @ResponseBody String getOrderPrepayInfo(String orderNo, HttpServletRequest request, String realPay) {
		String tokenValue = CookieUtil.getCookieValue("token", request);
		String requestUrl = apiUrlPrefix + AppUrlConfig.GET_ORDER_PREPAY_INFO + "?orderNo=" + orderNo + "&token="
				+ tokenValue;
		LOGGER.info("预支付信息请求Url为@{}", requestUrl);
		String responseData = HttpUtil.doGetRequest(requestUrl);
		LOGGER.info("获取预支付信息返回结果为@{}", responseData);
		return responseData;
	}

	@RequestMapping(value = "/addOrder")
	@ResponseBody
	public String addOrder(HttpServletRequest request, String departLng, String departLat, String arriveLng,
			String arriveLat, String departTitle, String arriveTitle, String departAreaCode, String arriveAreaCode,
			String num, String startTime, String remark,String carType,String passengerIds) {
		LOGGER.info("请求新增城际约租车订单接口，请求参数passengerIds：@{}",passengerIds);
		String url = apiUrlPrefix + AppUrlConfig.INNER_CITY_ADD_ORDER;
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("departLng", departLng);
		paramsMap.put("departLat", departLat);
		paramsMap.put("arriveLng", arriveLng);
		paramsMap.put("arriveLat", arriveLat);
		paramsMap.put("departAreaCode", departAreaCode);
		paramsMap.put("arriveAreaCode", arriveAreaCode);
		paramsMap.put("num", num);
		paramsMap.put("startTime", startTime);
		paramsMap.put("departTitle", departTitle);
		paramsMap.put("arriveTitle", arriveTitle);
		paramsMap.put("remark", remark);
		paramsMap.put("carType", carType);
		paramsMap.put("passengerIds", passengerIds);
		String ospTraceId = this.getCookie(Constant.OSP_TRACE_ID);
		if(!StringUtils.isEmpty(ospTraceId)){
			paramsMap.put("ospTraceId",ospTraceId);
		}
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);

		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		return GsonUtil.GsonString(resultData);
	}

	/**
	 * 进入已退款详情界面 joy
	 */
	@RequestMapping(value = "toOrderReturnDetailPage")
	public String toOrderReturnDetailPage(HttpServletRequest request, String token, String orderNo, Model model) {
		String url = apiUrlPrefix + AppUrlConfig.INNERCITY_ORDER_REFUND_DETAIL;
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("orderNo", orderNo);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		PassengerReturnDetailVo orderInfo = GsonUtil.GsonToBean(jsonResult, PassengerReturnDetailVo.class);
		model.addAttribute("orderInfo", orderInfo);
		return "hail/order/orderDetailRefund";
	}

	/**
	 * 退款展示界面 joy
	 */
	@RequestMapping(value = "toOrderCancelReturnPage")
	public String toOrderCancelReturnPage(HttpServletRequest request, String orderNo, Model model) {
		String url = apiUrlPrefix + AppUrlConfig.INNERCITY_ORDER_CANCEL_REFUND_DETAIL;
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("orderNo", orderNo);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		PassengerReturnDetailVo orderInfo = GsonUtil.GsonToBean(jsonResult, PassengerReturnDetailVo.class);
		model.addAttribute("orderInfo", orderInfo);
		return "hail/order/orderCancelRefund";
	}

	/**
	 * 退款 joy
	 */
	@RequestMapping(value = "refund")
	@ResponseBody
	public String refund(HttpServletRequest request, String token, String orderNo, Model model, String message) {
		String url = apiUrlPrefix + AppUrlConfig.INNERCITY_ORDER_REFUND;
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("orderNo", orderNo);
		paramsMap.put("message", message);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);

		return GsonUtil.GsonString(resultData);
	}

	/**
	 * 获取待支付和待指派的订单
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "getWaitOrders")
	@ResponseBody
	public String getWaitOrders(HttpServletRequest request) {
		String url = apiUrlPrefix + AppUrlConfig.INNER_CITY_GET_WAIT_ORDERS;
		Map<String, String> paramsMap = new HashMap<String, String>();
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);

		return GsonUtil.GsonString(resultData);
	}

	/**
	 * 获取进行中的订单
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "getOnTheWayOrders")
	@ResponseBody
	public String getOnTheWayOrders(HttpServletRequest request) {
		String url = apiUrlPrefix + AppUrlConfig.INNER_CITY_GET_ONTHEWAY_ORDERS;
		Map<String, String> paramsMap = new HashMap<String, String>();
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);

		return GsonUtil.GsonString(resultData);
	}

	/**
	 * 获取已预约的订单
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "reservationOrders")
	@ResponseBody
	public String reservationOrders(HttpServletRequest request) {
		String url = apiUrlPrefix + AppUrlConfig.INNER_CITY_GET_RESERVATION_ORDERS;
		Map<String, String> paramsMap = new HashMap<String, String>();
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);

		return GsonUtil.GsonString(resultData);
	}

	@RequestMapping(value = "underWayOrders")
	@ResponseBody
	public String underWayOrders(HttpServletRequest request) {
		String url = apiUrlPrefix + AppUrlConfig.INNER_CITY_GET_UNDER_WAY_ORDERS;
		Map<String, String> paramsMap = new HashMap<String, String>();
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);

		return GsonUtil.GsonString(resultData);
	}

	/**
	 * 查询已完成的订单
	 * 
	 * @param token
	 * @param page
	 * @return
	 */
	@RequestMapping(value = "queryInnerCityFinishedOrders")
	@ResponseBody
	public String queryInnerCityFinishedOrders(String page) {
		String url = apiUrlPrefix + AppUrlConfig.INNER_CITY_GET_FINISHED_ORDERS;
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("page", page);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);

		return GsonUtil.GsonString(resultData);
	}

	@RequestMapping(value = "toOrderDetail")
	public String toOrderDetail(String orderNo,
								HttpServletRequest request,
								HttpServletResponse response,
								RedirectAttributes redirectAttributes) throws Exception {
		LOGGER.info("跳转到订单详情orderNo@{}", orderNo);
		redirectAttributes.addAttribute("orderNo", orderNo);
		return this.commonRedirect(request, response, "/hail/innerCity/orderDetail/getOrderInfo");
//		return "redirect:/hail/innerCity/orderDetail/getOrderInfo";
		/*String url = apiUrlPrefix + AppUrlConfig.INNER_CITY_ORDER_DETAIL;
		Map<String, String> paramsMap = new HashMap<>();
		paramsMap.put("orderNo", orderNo);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		LOGGER.info("response data: {}", jsonResult);
		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);

		if (resultData.getCode() != Constant.SUCCESS) {
			return "Error500";
		}
		OrderInformation order = GsonUtil.GsonToBean(GsonUtil.GsonString(resultData.getData()), OrderInformation.class);
		;
		// 根据订单状态来实现相应订单详情页面的跳转
		// 已退款
		if (order.getIsRefundFlag() == 3) {
			response.sendRedirect("/innerCity/order/toOrderReturnDetailPage?orderNo=" + orderNo);
		} else if (order.getStatus() == OrderStatusKey.ORDER_STATUS_CANCEL_INT
				|| order.getStatus() == OrderStatusKey.ORDER_STATUS_OFF_INT) {
			response.sendRedirect("/innerCity/orderDetail/orderCanceled?orderNo=" + orderNo);
		} else if (order.getStatus() == OrderStatusKey.ORDER_STATUS_WAITPAY_INT) {
			if ((order.getPayMode() != null && order.getPayMode() == 0) || order.getTripStatus() == 10) {

				// 获取城际约车支付结算方式：0非预付款 1预付款
				String payTypeStr = HttpUtil.doPostReq(apiUrlPrefix + AppUrlConfig.GET_PROVIDER_PAYTYPE, params);
				ResultEntity payEntity = GsonUtil.GsonToBean(payTypeStr, ResultEntity.class);
				BaseProviderBasicConfig config = GsonUtil.GsonToBean(GsonUtil.GsonString(payEntity.getData()),
						BaseProviderBasicConfig.class);
				System.out.println("===支付结算配置为====" + config.getIsAdvance());
				if (config.getIsAdvance().equals((byte) 0)) {
					String returnUrl = payCenterUrl + "/order/toInnerCityOrderPay";
					response.sendRedirect("https://open.weixin.qq.com/connect/oauth2/authorize?appid="
							+ zhongjiaoSubAppId + "&redirect_uri=" + returnUrl
							+ "&connect_redirect=1&response_type=code&scope=snsapi_base&state=" + order.getUserId()
							+ "_" + order.getOrderNo() + "_" + params.get("token") + "#wechat_redirect");
				} else {
					response.sendRedirect("/innerCity/order/toOrderPay?orderNo=" + orderNo);
				}
			} else {
				response.sendRedirect("/innerCity/orderDetail/getOrderInfo?orderNo=" + orderNo);
			}
		} else if (order.getStatus() == OrderStatusKey.ORDER_STATUS_PAYSUCCES_INT
				|| order.getStatus() == OrderStatusKey.ORDER_STATUS_LOADING_FIRST_INT
				|| order.getStatus() == OrderStatusKey.ORDER_STATUS_SUCCES_INT) {
			response.sendRedirect("/innerCity/orderDetail/getOrderInfo?orderNo=" + orderNo);
		}

		LOGGER.warn("跳转订单详情，请检查订单orderNo@{}状态status@{}", order.getOrderNo(), order.getStatus());
		return null;*/
	}

	/**
	 * 通用的订单路径判断
	 * 
	 * @param order
	 * @return
	 */
	public String commonUrlJudge(InnerCityOrderInfoVo order) {
		String orderNo = order.getOrderNo();
		if (order.getIsRefundFlag() == 3) {
			return "/hail/innerCity/order/toOrderReturnDetailPage?orderNo=" + orderNo;
		} else if (order.getStatus() == OrderStatusKey.ORDER_STATUS_CANCEL_INT
				|| order.getStatus() == OrderStatusKey.ORDER_STATUS_OFF_INT) {
			return "/hail/innerCity/orderDetail/orderCanceled?orderNo=" + orderNo;
		} else if (order.getStatus() == OrderStatusKey.ORDER_STATUS_WAITPAY_INT) {
			return "/hail/innerCity/order/toOrderPay?orderNo=" + orderNo;
		} else if (order.getStatus() == OrderStatusKey.ORDER_STATUS_PAYSUCCES_INT
				|| order.getStatus() == OrderStatusKey.ORDER_STATUS_LOADING_FIRST_INT) {
			return "/hail/innerCity/orderDetail/getOrderInfo?orderNo=" + orderNo;
		} else if (order.getStatus() == OrderStatusKey.ORDER_STATUS_SUCCES_INT && order.getUserCommentStatus() == 1) {
			return "/hail/innerCity/order/toOrderNotComment?orderNo=" + orderNo;
		} else if (order.getStatus() == OrderStatusKey.ORDER_STATUS_SUCCES_INT && order.getUserCommentStatus() == 2) {
			return "/hail/innerCity/order/toOrderCommented?orderNo=" + orderNo;
		}
		return "Error500";
	}

	/*
	 * @RequestMapping(value="/toOrderNotComment")
	 * 
	 * @ResponseBody public String toOrderNotComment(String orderNo){
	 * 
	 * }
	 */

	/**
	 * 获取城际约车订单的行程状态
	 * 
	 * @param request
	 * @param tripNo
	 * @return
	 */
	@RequestMapping(value = "getInnerCityTripStatus")
	public @ResponseBody String getInnerCityTripStatus(HttpServletRequest request, String tripNo, String orderNo) {
		ResultEntity resultEntity=new ResultEntity(Constant.SUCCESS);
		if(redisUtil.exists(CacheKey.TRIP_STATUS_KEY+tripNo)){
			String tripJson=redisUtil.getString(CacheKey.TRIP_STATUS_KEY+tripNo);
			String orderJson=redisUtil.getString(CacheKey.ORDER_STATUS_KEY+orderNo);
			OrderInformation orderInformation=GsonUtil.GsonToBean(orderJson,OrderInformation.class);
			OrderTrip orderTrip=GsonUtil.GsonToBean(tripJson,OrderTrip.class);
			orderTrip.setOrderStatus(orderInformation.getStatus());
			resultEntity.setData(orderTrip);
		}else{
			String orderJson=(String)redisUtil.get(CacheKey.ORDER_STATUS_KEY+orderNo);
			if(StringUtils.isNotEmpty(orderJson)){
				OrderInformation orderInformation=GsonUtil.GsonToBean(orderJson,OrderInformation.class);
				if(orderInformation.getStatus()==PassengerConstant.ORDER_STATUS_COMPLETED){
					OrderTrip orderTrip=new OrderTrip();
					orderTrip.setStatus(PassengerConstant.TRIP_STATUS_SUCCES_INT);
					orderTrip.setOrderStatus(PassengerConstant.ORDER_STATUS_COMPLETED);
					resultEntity.setData(orderTrip);
				}
			}
		}
		return GsonUtil.GsonString(resultEntity);
	}

	/**
	 * 进入到待评价页面7
	 * 
	 * @param orderNo
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/toOrderNotComment", method = RequestMethod.GET)
	@ValidParameter(extraRequestParam = { "orderNo" })
	public String toOrderNotComment(String orderNo,
									Model model,
									HttpServletRequest request,
									HttpServletResponse response) {
		String url = apiUrlPrefix + AppUrlConfig.GET_INNERCITY_ORDER_INFO;
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("orderNo", orderNo);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		if (resultData.getCode() != Constant.SUCCESS) {
			return "Error500";
		}
		OrderVo order = GsonUtil.GsonToBean(GsonUtil.GsonString(resultData.getData()), OrderVo.class);
		if (order.getUserCommentStatus() == 2) {
//			return "redirect:" + "/hail/innerCity/order/toOrderCommented?orderNo=" + orderNo;
			String urlStr = "/hail/innerCity/order/toOrderCommented?orderNo=" + orderNo;
			return this.commonRedirect(request, response, urlStr);
		}
		model.addAttribute("orderInfo", resultData.getData());

		model.addAttribute("orderType", "2");
		model.addAttribute("orderNo", orderNo);
		return "hail/order/orderNotComment";
	}

	/**
	 * 取消订单
	 * 
	 * @param request
	 * @param orderNo
	 * @return
	 */
	@RequestMapping(value = "cancelOrder")
	public @ResponseBody String cancelOrder(HttpServletRequest request, String orderNo) {
		String tokenValue = CookieUtil.getCookieValue("token", request);
		String requestUrl = apiUrlPrefix + AppUrlConfig.INNER_CITY_CANCEL_ORDER + "?orderNo=" + orderNo + "&token="
				+ tokenValue;
		String responseData = HttpUtil.doGetRequest(requestUrl);
		return responseData;
	}

	/**
	 * 
	 * 进入到评价后的页面
	 * 
	 * @param request
	 * @param orderNo
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "toOrderCommented")
	public String toComment(HttpServletRequest request, @RequestParam(name = "orderNo") String orderNo, Model model) {
		String url = apiUrlPrefix + AppUrlConfig.GET_INNERCITY_ORDER_INFO;
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("orderNo", orderNo);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		if (resultData.getCode() != Constant.SUCCESS) {
			return "Error500";
		}
		model.addAttribute("orderInfo", resultData.getData());
		model.addAttribute("orderNo", orderNo);
		return "hail/order/orderCommented";
	}

	@RequestMapping(value = "queryIfHasUnfinishedOrder")
	@ResponseBody
	public String queryIfHasUnfinishedOrder() {
		String url = apiUrlPrefix + AppUrlConfig.INNER_CITY_QUERY_UNFINISHED_ORDER;
		Map<String, String> paramsMap = new HashMap<String, String>();
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		return jsonResult;
	}

	@RequestMapping(value = "changeStatus")
	@NotValidatePermission
	@ResponseBody
	public String changeStatus(String tripNo, String orderNo, byte tripStatus, byte orderStatus) {
		commonInnerCityOrderService.changeStatus(tripNo,orderNo,tripStatus,orderStatus);
		return "success";
	}

	@RequestMapping(value = "getTripStatus")
	@NotValidatePermission
	@ResponseBody
	public String getTripStatus(String tripNo, String orderNo) {
		String tripJson = redisUtil.getString(CacheKey.TRIP_STATUS_KEY + tripNo);
		String orderJson = (String) redisUtil.get(CacheKey.ORDER_STATUS_KEY + orderNo);
		String msg = "";
		if (tripJson == null) {
			msg += "redis没有此行程";
		}
		if (orderJson == null) {
			msg += "redis没有此订单";
		}
		try {
			OrderTrip orderTrip = GsonUtil.GsonToBean(tripJson, OrderTrip.class);
			msg += "tripStatus :" + orderTrip.getStatus();
			OrderInformation orderInformation = GsonUtil.GsonToBean(orderJson, OrderInformation.class);
			msg += "orderStatus :" + orderInformation.getStatus();
		} catch (Exception e) {
			e.printStackTrace();
			msg += "异常";
		}

		return msg;
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/toPaySuccess")
	public String toPaySuccess(HttpServletRequest request, Model model, String orderNo) {
		model.addAttribute("orderNo", orderNo);
		model.addAttribute("payType", "busToPay");
		// 判断用户是否已经关注公众号
		String token = this.getToken();
		Map<String, String> map = new HashMap<>();
		map.put("token", token);
		// String requestUrl =
		Map<String, String> params = null;
		String url = apiUrlPrefix + AppUrlConfig.USER_OARTH_DETAIL;
		params = this.genReqApiData(url, map);
		String resultData = HttpUtil.doPostReq(url, params);
		ResultEntity resultEntity = GsonUtil.GsonToBean(resultData, ResultEntity.class);
		boolean focusFlag = false;
		if (resultEntity != null && Constant.SUCCESS.equals(resultEntity.getCode())) {
			String oathStr = GsonUtil.GsonString(((Map<String, Object>) resultEntity.getData()).get("baseUserOath"));
			WeChatUser wechatUser = GsonUtil.GsonToBean(oathStr, WeChatUser.class);
			if (wechatUser != null) {
				focusFlag = wechatUser.getSubscribe() == 1;
			}
		}

		// 获取活动相关信息
		String activityInfoUrl = apiUrlPrefix + AppUrlConfig.PAY_SUCCESS_ACTIVITY_DETAIL;
		map.put("orderNo", orderNo);
		map.put("type", "3");
		params = this.genReqApiData(activityInfoUrl, map);
		String activityInfo = HttpUtil.doPostReq(activityInfoUrl, params);
		ResultEntity activityEntity = GsonUtil.GsonToBean(activityInfo, ResultEntity.class);
		Map<String, Object> activityInfoMap = (Map<String, Object>) activityEntity.getData();
		model.addAttribute("activityFlag", activityInfoMap.get("activityFlag"));
		model.addAttribute("totalBuyPrice", activityInfoMap.get("totalBuyPrice"));
		model.addAttribute("activityName", activityInfoMap.get("activityName"));
		model.addAttribute("needAmount", activityInfoMap.get("needAmount"));
		model.addAttribute("activityId", activityInfoMap.get("activityId"));
		if (!focusFlag) {
			// 获取当前车企的二维码路径
			String getProviderUrl = apiUrlPrefix + AppUrlConfig.PRIOVIDER_PROVIDERINFO;
			params = this.genReqApiData(getProviderUrl, map);
			String providerInfoData = HttpUtil.doPostReq(getProviderUrl, params);
			ResultEntity providerData = GsonUtil.GsonToBean(providerInfoData, ResultEntity.class);
			String providerStr = GsonUtil
					.GsonString(((Map<String, Object>) providerData.getData()).get("providerInfo"));
			BaseProviderInfo providerInfo = GsonUtil.GsonToBean(providerStr, BaseProviderInfo.class);
			String qrcUrl = "";
			if (providerInfo != null && !StringUtils.isEmpty(providerInfo.getWechatQrcodeUrl())) {
				qrcUrl = QiniuDown.DOAMIN + providerInfo.getWechatQrcodeUrl();
				model.addAttribute("wechatQrcodeUrl", qrcUrl);

				String getOrderDetail = apiUrlPrefix + AppUrlConfig.GET_WAIT_PAY_ORDER_DETAIL + orderNo;
				String orderDetailResultData = HttpUtil.doGetRequest(getOrderDetail);
				ResultEntity result = GsonUtil.GsonToBean(orderDetailResultData, ResultEntity.class);
				String orderDetailData = GsonUtil.GsonString(result.getData());
				OrderInformation orderInformation = GsonUtil.GsonToBean(orderDetailData, OrderInformation.class);

				model.addAttribute("payPrice", orderInformation.getPayPrice());
				model.addAttribute("payTime",
						DateUtils.unixTimestampToDate(orderInformation.getPayTime(), "yyyy年MM月dd日 HH:mm"));
				return "hail/order/qrcFocusOn";// 关注页面
			}
			return "hail/order/innerCityPaymentSuccess";
		}
		return "hail/order/innerCityPaymentSuccess";
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/innerCityService")
	public String innerCityService(HttpServletRequest request, Model model) {
		return "hail/innerCityService";
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/serviceRules")
	public String serviceRules(HttpServletRequest request, Model model) {
		return "hail/service-rules";
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/marketRules")
	public String marketRules(HttpServletRequest request, Model model) {
		return "hail/market-rules";
	}

}
