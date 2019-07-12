package com.olakeji.passenger.wechat.controller.busline;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.entity.BaseBus;
import com.olakeji.passenger.wechat.entity.BaseProviderBasicConfig;
import com.olakeji.passenger.wechat.entity.BusLineStation;
import com.olakeji.passenger.wechat.entity.OrderInformation;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.common.passenger.CommonParam;
import com.olakeji.tsp.utils.DateUtils;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.utils.StringUtil;
import com.olakeji.tsp.validation.ValidParameter;
import com.olakeji.tsp.vo.BusOrderInformationVo;

/**
 * 大巴订单
 * 
 * @author ZERO
 *
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
public class BusOrderController extends BaseController {

	private static final Logger LOGGER = LoggerFactory.getLogger(BusOrderController.class);

	/**
	 * 大巴订单判断页面跳转
	 * 
	 * @param request
	 * @param commonParam
	 * @param model
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/busline/busOrder/judgeBusiness")
	public String toOrderPage(HttpServletRequest request, Model model, HttpServletResponse response) throws Exception {
		String url = apiUrlPrefix + AppUrlConfig.GET_BUSINESS_TYPES;
		Map<String, String> paramsMap = new HashMap<String, String>();
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity result = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		Map<String, Object> resultMap = (Map<String, Object>) result.getData();
		String toUrl = "/passenger/order-list.html";
		if ((resultMap.get("hasBus") != null && (double) resultMap.get("hasBus") == 1)
				|| (resultMap.get("hasCommute") != null && (double) resultMap.get("hasCommute") == 1)) {
//			response.sendRedirect("/passenger/order-list.html");
			toUrl = "/passenger/order-list.html";
		} else if (resultMap.get("hasInterCity") != null && (double) resultMap.get("hasInterCity") == 1) {
//			response.sendRedirect("/passenger/innerCityOrder.html");
			toUrl = "/passenger/innerCityOrder.html";
		} else if (resultMap.get("hasTaxi") != null && (double) resultMap.get("hasTaxi") == 1) {
//			response.sendRedirect("/passenger/myorder.html");
			toUrl = "/passenger/myorder.html";
		} else if (resultMap.get("hasBusTicket") != null && (double) resultMap.get("hasBusTicket") == 1) {
//			response.sendRedirect("/passenger/busTicketOrder.html");
			toUrl = "/passenger/busTicketOrder.html";
		} else if (resultMap.get("hasOnline") != null && (double) resultMap.get("hasOnline") == 1) {
//			response.sendRedirect("/passenger/onlineCarOrderList.html");
			toUrl = "/passenger/onlineCarOrderList.html";
		} else if (resultMap.get("hasInterCityOnline") != null && (double) resultMap.get("hasInterCityOnline") == 1) {
//			response.sendRedirect("/passenger/interCityOnlineOrderList.html");
			toUrl = "/passenger/interCityOnlineOrderList.html";
		} else if (resultMap.get("hasInnerCityOnline") != null && (double) resultMap.get("hasInnerCityOnline") == 1) {
//			response.sendRedirect("/passenger/innerCityOnlineOrderList.html");
			toUrl = "/passenger/innerCityOnlineOrderList.html";
		} else if (resultMap.get("isSpot") != null && (double) resultMap.get("isSpot") == 1) {
//			response.sendRedirect("/passenger/spotOrderList.html");
			toUrl = "/passenger/spotOrderList.html";
		}
		toUrl += "?v="+System.currentTimeMillis();
		return this.commonRedirect(request, response, toUrl);
	}

	/**
	 * 大巴订单详情
	 * 
	 * @param request
	 * @param commonParam
	 * @param model
	 * @param orderNo
	 * @return
	 */
	@RequestMapping(value = "/bus/toBusOrderDetail")
	public String orderDetial(HttpServletRequest request, CommonParam commonParam, Model model, String orderNo,
			Integer autoShowPay,String tripDate) {
		model.addAttribute("autoShowPay", autoShowPay);
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("token", this.getToken());
		params.put("orderNo", orderNo);

		LOGGER.info("params:" + params);

		String jsonResult = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.BUS_ORDER_DETIAL, params);// 获取订单详情

		LOGGER.info("jsonResult:" + jsonResult);
		// 订单信息
		ResultEntity result = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		
		/**
		 * piggy.huang 这里植入代码，需要对数据内容做出判断
		 * 对于查询失败的内容无法进行GSON格式化转化，已经发现了异常错误
		 * 直接返回吧，需要有统一的错误页面，所以这一块代码先放在这里，
		 * 做完错误页面后再统一处理数据内容问题。
		 */
		if (result==null||result.getData()==null) {
			return "/order/order-detail";
		}
		BusOrderInformationVo vo = GsonUtil.GsonToBean(GsonUtil.GsonString(result.getData()),
				BusOrderInformationVo.class);
		// 获取大巴票信息列表
		String ticketJsonResult = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.BUS_TICKET_INFO_LIST, params);
		ResultEntity ticketResult = GsonUtil.GsonToBean(ticketJsonResult, ResultEntity.class);
		params.put("isPrice", 1);
		/* 时间转换：2017年1月26日（星期五） 10:00 */
		LOGGER.info("vo.getCreateTime():{}", vo.getCreateTime());
		LOGGER.info("new Date(vo.getCreateTime()):{}", new Date(vo.getCreateTime()));

		String createTime = DateUtils.unixTimestampToDate(vo.getCreateTime());
		createTime = DateUtils.unixTimestampToDate(vo.getCreateTime(), "yyyy-MM-dd HH:mm:ss");
		vo.setCreateTimeStr(createTime);
		String boardingTime = DateUtils.unixTimestampToDate(vo.getDepartTime(), "yyyy-MM-dd HH:mm");
		vo.setBoardingTime(boardingTime);
		// 新的上车时间
		String boardingTime1 = DateUtils.unixTimestampToDate(vo.getDepartTime(), "MM月dd日 HH:mm");
		vo.setBoardingTime1(boardingTime1);

		// 计时器倒计时
		String lockTicketTime = vo.getLockTicketTime()==null?"10":vo.getLockTicketTime();
		Long countDownTime = vo.getCreateTime() + Long.parseLong(lockTicketTime)*60000 - new Date().getTime();
		String countDownTimeMinStr = "0";
		String countDownTimeSecondStr = "0";
		if (countDownTime >= 0) {
			countDownTimeMinStr = String.valueOf(countDownTime / 60000);
			countDownTimeSecondStr = String.valueOf((countDownTime / 1000 - 60 * (countDownTime / 60000)));
		}

		long zeroTimeofCurDate = 0;
		try {
			zeroTimeofCurDate = DateUtils.getZeroTimeOfCurDate().getTime();
		} catch (Exception e) {
			LOGGER.error("获取当前时间异常:", e);
		}
		String ifShow = "1";
		// 是否显示按钮
		if (vo.getDepartTime() <= zeroTimeofCurDate) {
			ifShow = "0";
		}
		//合作线路 走非预付款模式
		byte settleType=0;
		params.put("requestUrl", request.getRequestURL().toString());
		if(vo.getIfCooperate()==null || vo.getSellProviderId()==null || vo.getSellProviderId().intValue()==vo.getProviderId().intValue()){ 
			String payTypeStr = HttpUtil.doPostRequest(this.apiUrlPrefix + AppUrlConfig.GET_PROVIDER_PAYTYPE, params);
			ResultEntity payEntity = (ResultEntity) GsonUtil.GsonToBean(payTypeStr, ResultEntity.class);
			BaseProviderBasicConfig config = (BaseProviderBasicConfig) GsonUtil
					.GsonToBean(GsonUtil.GsonString(payEntity.getData()), BaseProviderBasicConfig.class);
			settleType=config.getIsAdvance();
		}
		
		LOGGER.info("===订单:" + orderNo + "的支付结算配置为====" + settleType);
		model.addAttribute("settleType", settleType);
		model.addAttribute("orderInformation", vo);
		if(vo.getOrderType() == Constant.OrderType.travel){
			Map<String,String> map = new HashMap<String,String>();
			map.put("busId", vo.getBusId());
			String url = apiUrlPrefix + AppUrlConfig.Travel.Travel_LINE_QUERY;
			String lineInfoStr = HttpUtil.doPostReq(url, map);
			ResultEntity lineInfo = GsonUtil.GsonToBean(lineInfoStr, ResultEntity.class);
			model.addAttribute("travelLineInfo", lineInfo.getData());
		}
		if (ticketResult.getData()==null) {
			return "/order/order-detail";
		}
		model.addAttribute("ticketList", ticketResult.getData());
		model.addAttribute("countDownTimeStr", "'" + countDownTimeMinStr + ":" + countDownTimeSecondStr + "'");
		model.addAttribute("countDownTimeStrToShowFirst", countDownTimeMinStr + ":" + countDownTimeSecondStr);
		model.addAttribute("ifShow", ifShow);
		model.addAttribute("remindContent", vo.getRemindContent());
		model.addAttribute("tripDate",tripDate);
		model.addAttribute("arriveStationId",vo.getArriveStationId());
		model.addAttribute("departStationId",vo.getDepartStationId());
		model.addAttribute("arriveStation",vo.getArriveStation());
		model.addAttribute("departStation",vo.getDepartStation());

		return "/order/order-detail";
	}

	/**
	 * 通勤订单详情
	 * 
	 * @param request
	 * @param commonParam
	 * @param model
	 * @param orderNo
	 * @return
	 */
	@RequestMapping(value = "/busline/busOrder/commuteOrderDetail")
	public String commuteOrderDetail(HttpServletRequest request, @ValidParameter CommonParam commonParam, Model model,
			String orderNo) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("token", commonParam.getToken());
		params.put("appId", appId);
		params.put("clientType", clientType);
		params.put("appVersion", appVersion);
		params.put("deviceId", drviceId);
		params.put("timestamp", new Date().getTime());
		params.put("appKey", appKey);
		params.put("sign", commonParam.getSign());
		params.put("orderNo", orderNo);

		LOGGER.info("params:" + params);
		String jsonResult = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.BUS_COMMUNTE_ORDER_DETIAL, params);// 获取订单详情
		LOGGER.info("jsonResult:" + jsonResult);
		// 订单信息
		ResultEntity result = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		BusOrderInformationVo vo = GsonUtil.GsonToBean(GsonUtil.GsonString(result.getData()),
				BusOrderInformationVo.class);

		// 获取大巴票信息列表
		String ticketJsonResult = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.BUS_TICKET_INFO_LIST, params);
		ResultEntity ticketResult = GsonUtil.GsonToBean(ticketJsonResult, ResultEntity.class);
		params.put("isPrice", 1);


		// 计时器倒计时
		String lockTicketTime = vo.getLockTicketTime()==null?"10":vo.getLockTicketTime();
		Long countDownTime = vo.getCreateTime() + Long.parseLong(lockTicketTime)*60000 - new Date().getTime();
		String countDownTimeMinStr = "0";
		String countDownTimeSecondStr = "0";
		if (countDownTime >= 0) {
			countDownTimeMinStr = String.valueOf(countDownTime / 60000);
			countDownTimeSecondStr = String.valueOf((countDownTime / 1000 - 60 * (countDownTime / 60000)));
		}

		long zeroTimeofCurDate = 0;
		try {
			zeroTimeofCurDate = DateUtils.getZeroTimeOfCurDate().getTime();
		} catch (Exception e) {
			LOGGER.error("获取当前时间异常:", e);
		}
		String ifShow = "1";
		// 是否显示按钮
		if (vo.getDepartTime() <= zeroTimeofCurDate) {
			ifShow = "0";
		}

		model.addAttribute("orderInformation", vo);
		model.addAttribute("ticketList", ticketResult.getData());
		model.addAttribute("countDownTimeStr", "'" + countDownTimeMinStr + ":" + countDownTimeSecondStr + "'");
		model.addAttribute("countDownTimeStrToShowFirst", countDownTimeMinStr + ":" + countDownTimeSecondStr);
		model.addAttribute("ifShow", ifShow);
		return "/order/order-detail";
	}

	/**
	 * 进入到订单地图页
	 * 
	 * @param request
	 * @param orderNo
	 * @param token
	 * @return
	 */
	@RequestMapping(value = "/busline/busOrder/toOrderDetailMap")
	public String toOrderDetailMap(HttpServletRequest request, String orderNo, String token, Model model, String src,
			String autoShow) {
		token = this.getToken();
		String url = apiUrlPrefix + AppUrlConfig.BUS_ORDER_MAP + "?orderNo=" + orderNo + "&token=" + token;
		String responseData = HttpUtil.doGetRequest(url);
		ResultEntity result = GsonUtil.GsonToBean(responseData, ResultEntity.class);
		if (result != null) {
			String data = GsonUtil.GsonString(result.getData());
			OrderInformation orderInformation = GsonUtil.GsonToBean(data, OrderInformation.class);
			BaseBus baseBus = orderInformation.getBaseBus();
			List<BusLineStation> departStationList = orderInformation.getBaseBus().getBusLineStationList();
			List<BusLineStation> arriveStationList = orderInformation.getBaseBus().getArriveLineStationList();
			Integer useTime = 0;
			for (BusLineStation busLineStation : arriveStationList) {
				if (baseBus.getArriveStationId().compareTo(busLineStation.getStationId()) == 0) {
					useTime = busLineStation.getUseTime();
				}
			}
			if (departStationList.size() > 0) {
				model.addAttribute("firstStation", departStationList.get(0));
			}
			if (arriveStationList.size() > 0) {
				model.addAttribute("lastStation", arriveStationList.get(arriveStationList.size() - 1));
			}
			model.addAttribute("useTime", useTime);
			model.addAttribute("orderInformation", orderInformation);
			model.addAttribute("version", appVersion);
			model.addAttribute("src", src);
			model.addAttribute("autoShow", autoShow);
		}
		return "order/orderDetailMap";
	}

	/**
	 * 获取司机的位置信息
	 * 
	 * @param request
	 * 
	 * 
	 * @param orderNo
	 * @param token
	 * @return
	 */
	@RequestMapping(value = "/busline/busOrder/getDriverLocation")
	public @ResponseBody String getDriverLocation(HttpServletRequest request, String orderNo, String token) {
		ResultEntity resultData = new ResultEntity();
		String url = apiUrlPrefix + AppUrlConfig.GET_ORDER_DRIVER_LOCATION + "?token=" + this.getToken() + "&orderNo="
				+ orderNo;
		String driverLocationResult = HttpUtil.doGetRequest(url);// 获取大巴票信息列表
		if(!StringUtil.isEmpty(driverLocationResult)){
			resultData = GsonUtil.GsonToBean(driverLocationResult, ResultEntity.class);
		}else{
			resultData.setCode(Constant.FAILURE);
		}
		return GsonUtil.GsonString(resultData);

	}

	/**
	 * 在支付之前添加订单
	 * 
	 * @param request
	 * @param orderInformation
	 * @return
	 */
	@RequestMapping(value = "/busline/busOrder/initOrder")
	public @ResponseBody String preAddOrder(HttpServletRequest request, OrderInformation orderInformation,
			String token) {
		Map<String, String> orderParams = new HashMap<String, String>();
		String insuranceConfirm = StringUtil.isEmpty(request.getParameter("insuranceConfirm")) ? "0" : request.getParameter("insuranceConfirm");
		String insurancePay = request.getParameter("insurancePay");
		String insuranceType = request.getParameter("insuranceType");
		String insurancePrice = request.getParameter("insurancePrice");
		orderParams.put("orderNo", orderInformation.getOrderNo());
		orderParams.put("busId", orderInformation.getBusId() + "");
		orderParams.put("token", this.getToken());
		orderParams.put("remark", orderInformation.getRemark());
		orderParams.put("specialPrice", orderInformation.getSpecialPrice().toString());
		orderParams.put("insuranceConfirm", insuranceConfirm);
		orderParams.put("insurancePay", insurancePay);
		orderParams.put("insuranceType", insuranceType);
		orderParams.put("insurancePrice", insurancePrice);
		if (orderInformation.getCouponId() != null) {
			orderParams.put("couponId", orderInformation.getCouponId() + "");
		}
		if (orderInformation.getNumbers() != null) {
			orderParams.put("numbers", orderInformation.getNumbers() + "");
		}
		if (orderInformation.getReservationType() != null) {
			orderParams.put("reservationType", orderInformation.getReservationType() + "");
		}
		if (orderInformation.getQrcodeId() != null) {
			orderParams.put("qrcodeId", orderInformation.getQrcodeId() + "");
		}
		String ospTraceId = this.getCookie(Constant.OSP_TRACE_ID);
		if(!StringUtils.isEmpty(ospTraceId)){
			orderParams.put("ospTraceId",ospTraceId);
		}
		//新增字段  订单联系人
		orderParams.put("orderContactMobile", orderInformation.getOrderContactMobile());
		//orderParams.put("insuranceId", orderInformation.getInsuranceId() + "");
		orderParams.put("passengerContactIds", orderInformation.getPassengerContactIds());
		String response = HttpUtil.doPostReq(apiUrlPrefix + AppUrlConfig.INIT_ORDER, orderParams);
		LOGGER.info("定制班线下单api返回@{}", response);
		ResultEntity result = GsonUtil.GsonToBean(response, ResultEntity.class);
		if(result.getCode() == 0 && !StringUtils.isEmpty(orderInformation.getPassengerContactIds())){
			putIntoCookies("passengerIds",orderInformation.getPassengerContactIds().replaceAll(",", "#"),0);
		}
		return response;
	}
}
