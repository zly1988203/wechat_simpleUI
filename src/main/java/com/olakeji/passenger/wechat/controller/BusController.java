package com.olakeji.passenger.wechat.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.google.gson.reflect.TypeToken;
import com.olakeji.cache.RedisUtil;
import com.olakeji.common.wechat.bean.user.WeChatUser;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.entity.*;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.LineType;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.DateUtils;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.utils.QiniuDown;
import com.olakeji.tsp.utils.StringUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 大巴相关业务控制器
 * 
 * @author herry.zhang
 *
 */
@Controller
public class BusController extends BaseController {

	private static final Logger LOGGER = LoggerFactory.getLogger(BusController.class);

	@Value("${passenger.api.url}")
	private String apiUrlPrefix;

	/**
	 * 当前的模式
	 */
	@Value("${mode}")
	private String mode;

	@Autowired
	private RedisUtil redisUtil;
	
	@InitBinder
	public void initBinder(WebDataBinder binder) {
		SimpleDateFormat dateFormat = new SimpleDateFormat(DateUtils.DATE_SIMPLE_FORMAT);
		dateFormat.setLenient(false);
		binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
	}

	/**
	 * 进入到大巴首页
	 * 
	 * @param request
	 * @param token
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "toBusHome")
	public String toBusHome(HttpServletRequest request, String token, Model model) {
		// 获取热门路线
		String lineData = HttpUtil.doGetRequest(
				apiUrlPrefix + AppUrlConfig.GET_HOT_LINE + "?" + getString() + "&token=" + this.getToken());
		ResultEntity resultEntity = GsonUtil.GsonToBean(lineData, ResultEntity.class);
		if (resultEntity.getCode() == Constant.SUCCESS) {
			if (resultEntity.getData() != null) {
				model.addAttribute("hotLineData", resultEntity.getData());
			}
		}
		return "busHome";
	}

	/**
	 * 搜索大巴车次
	 * 
	 * @param request
	 * @param baseBus
	 * @return
	 */
	@SuppressWarnings("unchecked")
	//@RequestMapping(value = "busLine/searchBus")
	public String searchBus(HttpServletRequest request, BaseBus baseBus, String token, Model model, String startAddr,
			String endAddr) {
		String requestUrl = request.getRequestURL().toString();
		String lineType = request.getParameter("lineType");
		if(StringUtil.isEmpty(lineType)){
			lineType = LineType.BUS_LINE_TYPE;//默认查询定制班线的线路列表
		}
		// 如果日期是以前的 那就查当天的
		if (baseBus.getDepartDate() == null || baseBus.getDepartDate().getTime() < new Date().getTime()) {
			baseBus.setDepartDate(new Date());
		}
		Integer departCityId = baseBus.getDepartCityId() == null ? 0 : baseBus.getDepartCityId();
		Integer arriveCityId = baseBus.getArriveCityId() == null ? 0 : baseBus.getArriveCityId();
		String url = apiUrlPrefix + AppUrlConfig.SEARCH_BUS + "?requestUrl=" + requestUrl + "&departLng="
				+ baseBus.getDepartLng() + "&departLat=" + baseBus.getDepartLat() + "&arriveLng="
				+ baseBus.getArriveLng() + "&arriveLat=" + baseBus.getArriveLat() + "&departDate="
				+ DateUtils.format(baseBus.getDepartDate(), DateUtils.DATE_FORMAT) + "&departCityName="
				+ baseBus.getDepartCityName() + "&arriveCityName=" + baseBus.getArriveCityName() + "&token=" 
				+ token + "&departCityId=" + departCityId + "&arriveCityId=" + arriveCityId + "&lineType=" + lineType;
		LOGGER.info("搜索班次请求地址为:" + url);
		String busData = HttpUtil.doGetRequest(url);	
		ResultEntity resultEntity = GsonUtil.GsonToBean(busData, ResultEntity.class);
		if (resultEntity.getCode() == Constant.SUCCESS) {
			if (resultEntity.getData() != null) {
				String lineListData = GsonUtil
						.GsonString(((Map<String, Object>) resultEntity.getData()).get("baseBusList"));
				List<BaseBus> data = GsonUtil.GsonToList(lineListData, new TypeToken<List<BaseBus>>() {
				});
				String presellDay = (String) ((Map<String, Object>) resultEntity.getData()).get("presellDay");
				String remainShowNumber = (String) ((Map<String, Object>) resultEntity.getData())
						.get("remainShowNumber");
				model.addAttribute("presellDay", presellDay);
				model.addAttribute("baseBusList", data);
				model.addAttribute("searchCondition", baseBus);
				model.addAttribute("remainShowNumber", Integer.parseInt(remainShowNumber));
				model.addAttribute("searchFlag", IndexController.LIST_FLAG_SEARCH);
				model.addAttribute("departCityName", baseBus.getDepartCityName());
				model.addAttribute("arriveCityName", baseBus.getArriveCityName());
				model.addAttribute("departCityId", departCityId);
				model.addAttribute("arriveCityId", arriveCityId);
				model.addAttribute("startAddr", startAddr);
				model.addAttribute("endAddr", endAddr);
				model.addAttribute("currentDateStr",DateUtils.format(new Date(), DateUtils.DATE_FORMAT));
			}
		}
		if(lineType.equals("3")){
			return "travelLineList";
		}
		return "lineList";
	}
	
	/**
	 * 进入到订单支付页
	 * 
	 * @param model
	 * @param token
	 * @param qrcId
	 * @return
	 */
	@RequestMapping(value = "bus/toBusOnlinePay")
	public String toPay(Model model, String token, String busId, String qrcId) {
		token = this.getToken();
		model.addAttribute("token", token);
		Map<String, Object> map = new HashMap<>();
		map.put("token", token);
		map.put("busId", busId);
		String passengerIds = getLatestPassengersFromCookie();
		map.put("passengerIds",passengerIds);
        String userStr = (String) redisUtil.get(token);
		BaseUser baseUser = GsonUtil.GsonToBean(userStr, BaseUser.class);
		model.addAttribute("defaultMobile",baseUser!=null?baseUser.getMobile():"");

		String payData = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.TO_BUSONLINEPAY, map);
		ResultEntity resultEntity = JSON.parseObject(payData, ResultEntity.class);

		if (Constant.SUCCESS.equals(resultEntity.getCode())) {
			if (resultEntity.getData() != null) {
				Map<String, Object> data = JSON.parseObject(JSON.toJSONString(resultEntity.getData()));
				OrderInformation order = JSON.parseObject(JSON.toJSONString(data.get("order")),
						OrderInformation.class);

				if(data.containsKey("isLineCooperate")){
					String isLineCooperate = data.get("isLineCooperate").toString();
					if(isLineCooperate.equals("2")){ //合作线路
						model.addAttribute("settleType", 0);  //非预付款
					}else{
						if (data.containsKey("payMode")) {
							String payMode = GsonUtil.GsonString(data.get("payMode"));
							BaseProviderBasicConfig baseProviderBasicConfig = GsonUtil.GsonToBean(payMode,
									BaseProviderBasicConfig.class);
							model.addAttribute("settleType", baseProviderBasicConfig.getIsAdvance());
						}
					}
					model.addAttribute("isLineCooperate",isLineCooperate);
				}
				if (data.containsKey("tagName")) {
					model.addAttribute("tagName",data.get("tagName"));
				}
				
				model.addAttribute("order", order);
				if (data.containsKey("couponlist")) {
					String couponListStr = GsonUtil.GsonString(data.get("couponlist"));
					List<CouponReceiveRecord> couponReceiveRecordList = GsonUtil.GsonToList(couponListStr,
							new TypeToken<List<CouponReceiveRecord>>() {
							});
					model.addAttribute("couponlist", couponReceiveRecordList);
					model.addAttribute("couponlistJson", GsonUtil.GsonString(couponReceiveRecordList));
					if (couponReceiveRecordList.size() > 0) {
						model.addAttribute("currentCoupon", couponReceiveRecordList.get(0));
					}
				}
				if (data.containsKey("timeWarnFlag")) {
					String timeWarnFlag = (String) data.get("timeWarnFlag");
					model.addAttribute("timeWarnFlag", timeWarnFlag);
				}

                model.addAttribute("needInsurance", data.get("needInsurance"));
				model.addAttribute("insuranceRulePriceList", data.get("insuranceRulePriceList"));
                model.addAttribute("needMobile", data.get("needMobile") );
                model.addAttribute("needIdCard", data.get("needIdCard") );
                model.addAttribute("needPassInfo", data.get("needPassInfo"));
				model.addAttribute("ticketMaxBuyNumber", data.get("ticketMaxBuyNumber"));// 最大允许购票数
				model.addAttribute("allowOnLineBook", data.get("allowOnLineBook"));
				model.addAttribute("payRule", data.get("payRule"));
				model.addAttribute("qrcId", qrcId);
				model.addAttribute("singleDiscount",
						data.get("singleDiscount") == null ? 0 : data.get("singleDiscount"));
				model.addAttribute("leftNum", data.get("leftNum") == null ? 0 : data.get("leftNum"));
				model.addAttribute("promoteType", data.get("promoteType") == null ? 0 : data.get("promoteType"));
				model.addAttribute("promoteNum", data.get("promoteNum") == null ? 0 : data.get("promoteNum"));
				model.addAttribute("activityName", data.get("activityName") == null ? 0 : data.get("activityName"));
				model.addAttribute("remark", data.get("remark"));
				model.addAttribute("busName",data.get("busName"));
				model.addAttribute("remindContent", data.get("remindContent"));
				Integer lineType = (int)Constant.BusLineType.defaultValue;
				if(data.containsKey("lineType")){
					Double lineTypeD=Double.parseDouble(data.get("lineType")+"");
					lineType = lineTypeD.intValue();
					if(lineType==(int)Constant.BusLineType.busLine){
						lineType =(int)Constant.OrderType.busLine;
					}else if(lineType==(int)Constant.BusLineType.commuteLine){
						lineType =(int)Constant.OrderType.commute;
					}else if(lineType==(int)Constant.BusLineType.travelLine){
						lineType =(int)Constant.OrderType.travel;
					}
				}
				model.addAttribute("lineType",lineType);
			}
		} else {
			String message = resultEntity.getMessage();
			if (StringUtils.isEmpty(message)) {
				message = "当前车次不能购买";
			}
			model.addAttribute("message", message);
			return "busPass";
		}
		return "payment";
	}

	/**
	 * 获取预支付id
	 * 
	 * @param token
	 * @return
	 */
	@RequestMapping(value = "/bus/getPayOpenid")
	public @ResponseBody String judgeUserOpenidIsExist(String token) {
		Map<String, Object> map = new HashMap<>();
		map.put("token", this.getToken());
		if (Constant.DEVELOP_MODE.equals(mode)) {
			ResultEntity resultEntity = new ResultEntity(Constant.SUCCESS);
			return GsonUtil.GsonString(resultEntity);
		} else {
			LOGGER.info("开始调用获取openId");
			String entity = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.TO_GETPAYOPENID, map);
			return entity;
		}
	}

	/**
	 * 获取订单的预支付信息
	 * 
	 * @param request
	 * @param orderNo
	 * @param token
	 * @param receiveId
	 * @return
	 */
	@RequestMapping(value = "/bus/getPrepayInfo")
	public @ResponseBody String getPrepayInfo(HttpServletRequest request, String orderNo, String token,
			Integer receiveId) {
		Map<String, Object> map = new HashMap<>();
		map.put("orderNo", orderNo);
		map.put("token", this.getToken());
		map.put("receiveId", receiveId);
		String entity = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.TO_GETPREPAYINFO, map);
		return entity;
	}

	@RequestMapping(value = "bus/toWxPay")
	public String initZhongjiaoOpenId(String code, String state, Model model) {
		Map<String, Object> map = new HashMap<>();
		map.put("code", code);
		map.put("state", state);
		String payData = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.TO_WXPAY, map);
		ResultEntity resultEntity = GsonUtil.GsonToBean(payData, ResultEntity.class);
		if (Constant.SUCCESS.equals(resultEntity.getCode())) {
			if (resultEntity.getData() != null) {
				Map<String, Object> data = GsonUtil.GsonToMaps(GsonUtil.GsonString(resultEntity.getData()));
				OrderInformation order = GsonUtil.GsonToBean(GsonUtil.GsonString(data.get("order")),
						OrderInformation.class);
				Long remainTime = order.getCreateTime() + 10 * 60 * 1000 - new Date().getTime();
				model.addAttribute("remainTime", remainTime);
				model.addAttribute("order", order);
				model.addAttribute("couponlist", data.get("couponlist"));
				model.addAttribute("token", data.get("token"));
				model.addAttribute("allowOnLineBook", data.get("allowOnLineBook"));
			}
		}
		return "paymentNext";
	}

	@RequestMapping(value = "/bus/payByCoupon")
	public @ResponseBody String payByCoupon(HttpServletRequest request, String orderNo, String token,
			Integer receiveId) {
		Map<String, Object> map = new HashMap<>();
		map.put("orderNo", orderNo);
		map.put("token", this.getToken());
		map.put("receiveId", receiveId);
		String entity = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.PAY_COUPON, map);
		return entity;
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/bus/toPaySuccess")
	public String toPaySuccess(HttpServletRequest request, Model model, String orderNo) {
		model.addAttribute("orderNo", orderNo);
		model.addAttribute("payType", "busToPay");
		// 判断用户是否已经关注公众号
		String token = this.getToken();
		String userStr = (String) redisUtil.get(token);
		BaseUser baseUser = GsonUtil.GsonToBean(userStr, BaseUser.class);
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
		if (baseUser != null) {
			model.addAttribute("providerId", baseUser.getProviderId());
		}

		// 获取活动相关信息
		String activityInfoUrl = apiUrlPrefix + AppUrlConfig.PAY_SUCCESS_ACTIVITY_DETAIL;
		map.put("orderNo", orderNo);
		map.put("type", "1");
		params = this.genReqApiData(activityInfoUrl, map);
		String activityInfo = HttpUtil.doPostReq(activityInfoUrl, params);
		ResultEntity activityEntity = GsonUtil.GsonToBean(activityInfo, ResultEntity.class);
		Map<String, Object> activityInfoMap = (Map<String, Object>) activityEntity.getData();
		model.addAttribute("activityFlag", activityInfoMap.get("activityFlag"));
		model.addAttribute("totalBuyPrice", activityInfoMap.get("totalBuyPrice"));
		model.addAttribute("activityName", activityInfoMap.get("activityName"));
		model.addAttribute("needAmount", activityInfoMap.get("needAmount"));
		model.addAttribute("activityId", activityInfoMap.get("activityId"));
		model.addAttribute("focusOn", 1);
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
				model.addAttribute("focusOn", 0);
				model.addAttribute("wechatQrcodeUrl", qrcUrl);
				//return "qrcFocusOn";// 关注页面
				// return "paymentSuccess";
			}
			return "paymentSuccess";
		}
		return "paymentSuccess";
	}

	@SuppressWarnings("unchecked")
	//@RequestMapping(value = "/bus/lineList", method = RequestMethod.GET)
	public String toLineList(HttpServletRequest request, String token, Model model, long busId, String departDate) {
		if (StringUtils.isEmpty(departDate) || DateUtils.parse(departDate).getTime() < new Date().getTime()) {// 如果出发日期为空，默认为今天
			departDate = DateUtils.format(new Date(), DateUtils.DATE_FORMAT);
		}
		String lineTypeStr = request.getParameter("lineType");
		if(StringUtil.isEmpty(lineTypeStr)){
			lineTypeStr = LineType.BUS_LINE_TYPE;
		}
		if (StringUtil.isEmpty(token)) {
			Cookie[] cookies = request.getCookies();
			if (cookies != null) {
				for (Cookie cookie : cookies) {
					if (cookie.getName().equals("token")) {
						token = cookie.getValue();
						try {
							token = URLDecoder.decode(token, "utf-8");
						} catch (UnsupportedEncodingException e) {
							LOGGER.error("接下token异常:", e);
						}
					}
				}
			}
		}
		String requestUrl = request.getRequestURL().toString();
		String url = apiUrlPrefix + AppUrlConfig.BUS_HISTORY_LINE + "?requestUrl=" + requestUrl + "&&busId=" + busId
				+ "&departDate=" + departDate + "&token=" + token + "&lineType=" + lineTypeStr;
		String busData = HttpUtil.doGetRequest(url);
		ResultEntity resultEntity = GsonUtil.GsonToBean(busData, ResultEntity.class);

		if (resultEntity.getCode() == Constant.SUCCESS) {
			String baseBusData = GsonUtil.GsonString(((Map<String, Object>) resultEntity.getData()).get("baseBusList"));
			String presellDay = (String) ((Map<String, Object>) resultEntity.getData()).get("presellDay");
			String remainShowNumber = (String) ((Map<String, Object>) resultEntity.getData()).get("remainShowNumber");
			model.addAttribute("baseBusList", GsonUtil.GsonToList(baseBusData, new TypeToken<List<BaseBus>>() {
			}));
			model.addAttribute("presellDay", presellDay);
			model.addAttribute("areaSearch", ((Map<String, Object>) resultEntity.getData()).get("areaSearch"));
			model.addAttribute("remainShowNumber", Integer.parseInt(remainShowNumber));
		}
		model.addAttribute("searchFlag", 4);
		model.addAttribute("busId", busId);
		model.addAttribute("departDate", departDate);
		BaseBus searchCondition = new BaseBus();
		searchCondition.setDepartDate(DateUtils.parse(departDate, DateUtils.DATE_FORMAT));
		model.addAttribute("searchCondition", searchCondition);
		model.addAttribute("currentDateStr",DateUtils.format(new Date(), DateUtils.DATE_FORMAT));
		if(lineTypeStr.equals(LineType.TRAVEL_LINE_TYPE)){
			return "travelLineList";
		}
		return "lineList";
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/bus/lineList", method = RequestMethod.GET)
	public String toLineListH5(HttpServletRequest request,
							   String token,
							   Model model,
							   long busId,
							   String departDate,
							   HttpServletResponse response) {
		String lineType = request.getParameter("lineType");
		if(StringUtil.isEmpty(lineType)){
			lineType = LineType.BUS_LINE_TYPE;
		}
		Map<String, String> paraMap = this.getRequestParams();
		if (StringUtils.isEmpty(departDate)) {
			paraMap.put("departDate", DateUtils.getDate(new Date()));
		}
		BaseProviderInfo provider = this.getProviderDetail(request);
		if (provider!=null) {
			paraMap.put("providerId", String.valueOf(provider.getProviderId()));
		}
		//增加一个参数，查询历史线路
		paraMap.put("search", "2");
		paraMap.put("lineType", lineType);
		paraMap.put("isLoad", "1");
		String paramStr = this.genParamStr(paraMap);
		String url = "/lineList" + paramStr;
		return this.commonRedirect(request, response, url);
//		return "redirect:"+url;
/*		String paramStr = this.genParamStr(paraMap);
		String url = "/bus/h5/lineList.html" + paramStr;
		return "redirect:"+url;
*/	}
	
	/**
	 * 历史线路搜素
	 * 
	 * @param request
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/bus/lineHisListJson")
	@ResponseBody
	public String lineHisListJson(HttpServletRequest request, String token, Model model, long busId, String departDate) {
		this.getToLineList(request, token, model, busId, departDate);
		Map<String,Object> retMap = model.asMap();
		retMap.remove("org.springframework.validation.BindingResult.baseBus");
		retMap.remove("baseBus");
		return ResultEntity.setSuccessJson(retMap);
	}
	
	private void getToLineList(HttpServletRequest request, String token, Model model, long busId, String departDate) {
		if (StringUtils.isEmpty(departDate) || DateUtils.parse(departDate).getTime() < new Date().getTime()) {// 如果出发日期为空，默认为今天
			departDate = DateUtils.format(new Date(), DateUtils.DATE_FORMAT);
		}
		String lineTypeStr = request.getParameter("lineType");
		if(StringUtil.isEmpty(lineTypeStr)){
			lineTypeStr = LineType.BUS_LINE_TYPE;
		}
		if (StringUtil.isEmpty(token)) {
			Cookie[] cookies = request.getCookies();
			if (cookies != null) {
				for (Cookie cookie : cookies) {
					if (cookie.getName().equals("token")) {
						token = cookie.getValue();
						try {
							token = URLDecoder.decode(token, "utf-8");
						} catch (UnsupportedEncodingException e) {
							LOGGER.error("接下token异常:", e);
						}
					}
				}
			}
		}
		String requestUrl = request.getRequestURL().toString();
		String url = apiUrlPrefix + AppUrlConfig.BUS_HISTORY_LINE + "?requestUrl=" + requestUrl + "&&busId=" + busId
				+ "&departDate=" + departDate + "&token=" + token + "&lineType=" + lineTypeStr;
		String busData = HttpUtil.doGetRequest(url);
		ResultEntity resultEntity = GsonUtil.GsonToBean(busData, ResultEntity.class);

		if (resultEntity.getCode() == Constant.SUCCESS) {
			String baseBusData = GsonUtil.GsonString(((Map<String, Object>) resultEntity.getData()).get("baseBusList"));
			String presellDay = (String) ((Map<String, Object>) resultEntity.getData()).get("presellDay");
			String remainShowNumber = (String) ((Map<String, Object>) resultEntity.getData()).get("remainShowNumber");
			model.addAttribute("baseBusList", GsonUtil.GsonToList(baseBusData, new TypeToken<List<BaseBus>>() {
			}));
			String busLineList = GsonUtil.GsonString(((Map<String, Object>) resultEntity.getData()).get("busLineList"));
			model.addAttribute("busLineList", GsonUtil.GsonToList(busLineList, new TypeToken<List<BaseBus>>() {
			}));
			model.addAttribute("areaSearch", ((Map<String, Object>) resultEntity.getData()).get("areaSearch"));
			model.addAttribute("presellDay", presellDay);
			model.addAttribute("remainShowNumber", Integer.parseInt(remainShowNumber));
		}
		model.addAttribute("searchFlag", 4);
		model.addAttribute("busId", busId);
		model.addAttribute("departDate", departDate);
		BaseBus searchCondition = new BaseBus();
		searchCondition.setDepartDate(DateUtils.parse(departDate, DateUtils.DATE_FORMAT));
		model.addAttribute("searchCondition", searchCondition);
		model.addAttribute("currentDateStr",DateUtils.format(new Date(), DateUtils.DATE_FORMAT));
	}
	
	private void getSearchBus(HttpServletRequest request, BaseBus baseBus, String token, Model model, String startAddr,
			String endAddr) {
		String requestUrl = request.getRequestURL().toString();
		String lineType = request.getParameter("lineType");
		if(StringUtil.isEmpty(lineType)){
			lineType = LineType.BUS_LINE_TYPE;//默认查询定制班线的线路列表
		}
		// 如果日期是以前的 那就查当天的
		if (baseBus.getDepartDate() == null || baseBus.getDepartDate().getTime() < System.currentTimeMillis()) {
			baseBus.setDepartDate(new Date());
		}
		Integer departAreaId = baseBus.getDepartAreaId() == null ? 0 : baseBus.getDepartAreaId();
		Integer arriveAreaId = baseBus.getArriveAreaId() == null ? 0 : baseBus.getArriveAreaId();
		String url = apiUrlPrefix + AppUrlConfig.SEARCH_BUS + "?requestUrl=" + requestUrl + "&departLng="
				+ baseBus.getDepartLng() + "&departLat=" + baseBus.getDepartLat() + "&arriveLng="
				+ baseBus.getArriveLng() + "&arriveLat=" + baseBus.getArriveLat() + "&departDate="
				+ DateUtils.format(baseBus.getDepartDate(), DateUtils.DATE_FORMAT) + "&departCityName="
				+ baseBus.getDepartCityName() + "&arriveCityName=" + baseBus.getArriveCityName() + "&token=" 
				+ token + "&departAreaId=" + departAreaId + "&arriveAreaId=" + arriveAreaId + "&lineType=" + lineType;
		LOGGER.info("搜索班次请求地址为:" + url);
		String busData = HttpUtil.doGetRequest(url);	
		ResultEntity resultEntity = GsonUtil.GsonToBean(busData, ResultEntity.class);
		if (resultEntity.getCode() == Constant.SUCCESS) {
			if (resultEntity.getData() != null) {
			    Map<String,Object> resultMap=(Map<String, Object>) resultEntity.getData();
				String lineListData = GsonUtil
						.GsonString(resultMap.get("baseBusList"));
				List<BaseBus> data = GsonUtil.GsonToList(lineListData, new TypeToken<List<BaseBus>>() {
				});
				//List<BaseBus> data = JSONObject.parseArray(lineListData,BaseBus.class);
				String presellDay = (String) resultMap.get("presellDay");
				String remainShowNumber = (String) resultMap
						.get("remainShowNumber");
				String stationList = GsonUtil
						.GsonString(resultMap.get("busLineList"));
				List<Integer> stationData = GsonUtil.GsonToList(stationList, new TypeToken<List<Integer>>() {
				});
				model.addAttribute("presellDay", presellDay);
				model.addAttribute("baseBusList", data);
				model.addAttribute("searchCondition", baseBus);
				model.addAttribute("remainShowNumber", Integer.parseInt(remainShowNumber));
				model.addAttribute("searchFlag", IndexController.LIST_FLAG_SEARCH);
				model.addAttribute("departCityName", baseBus.getDepartCityName());
				model.addAttribute("arriveCityName", baseBus.getArriveCityName());
				model.addAttribute("departAreaId", departAreaId);
				model.addAttribute("arriveAreaId", arriveAreaId);
				model.addAttribute("startAddr", startAddr);
				model.addAttribute("endAddr", endAddr);
				model.addAttribute("currentDateStr",DateUtils.format(new Date(), DateUtils.DATE_FORMAT));
				model.addAttribute("busLineList", stationData);
				model.addAttribute("areaSearch",resultMap.get("areaSearch"));
			}
		}
		model.addAttribute("lineType", lineType);
	}
	
	
	/**
	 * 搜索大巴车次
	 * 
	 * @param request
	 * @param baseBus
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "busLine/searchBusJson")
	@ResponseBody
	public String searchBusJson(HttpServletRequest request, BaseBus baseBus, String token, Model model, String startAddr,
			String endAddr) {
		this.getSearchBus(request, baseBus, token, model, startAddr, endAddr);
		Map<String,Object> retMap = model.asMap();
		retMap.remove("org.springframework.validation.BindingResult.baseBus");
		retMap.remove("baseBus");
		return ResultEntity.setSuccessJson(retMap);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "busLine/searchBus")
	public String searchBusH5(HttpServletRequest request,
							  HttpServletResponse response) {
		String lineType = request.getParameter("lineType");
		if(StringUtil.isEmpty(lineType)){
			lineType = LineType.BUS_LINE_TYPE;
		}
		Map<String, String> paraMap = this.getRequestParams();
		BaseProviderInfo provider = this.getProviderDetail(request);
		if (provider!=null) {
			paraMap.put("providerId", String.valueOf(provider.getProviderId()));
		}
		paraMap.put("lineType", lineType);
		//增加一个参数标志，是属于查询标志了,搜索查询
		paraMap.put("search", "1");
		paraMap.put("isLoad", "1");
		String paramStr = this.genParamStr(paraMap);
		String url = "/lineList" + paramStr;
//		return "redirect:"+url;
		return this.commonRedirect(request, response, url);
/*		String paramStr = this.genParamStr(paraMap);
		String url = "/bus/h5/lineList.html" + paramStr;
		return "redirect:"+url;
*/		
	}
}
