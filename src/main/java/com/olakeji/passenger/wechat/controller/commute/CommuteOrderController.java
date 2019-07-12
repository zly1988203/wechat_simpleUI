package com.olakeji.passenger.wechat.controller.commute;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.common.wechat.bean.user.WeChatUser;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.entity.BaseBus;
import com.olakeji.passenger.wechat.entity.BaseProviderBasicConfig;
import com.olakeji.passenger.wechat.entity.BaseProviderInfo;
import com.olakeji.passenger.wechat.entity.BusLineStation;
import com.olakeji.passenger.wechat.entity.OrderInformation;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.common.passenger.CommonParam;
import com.olakeji.tsp.utils.DateUtils;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.utils.QiniuDown;
import com.olakeji.tsp.vo.BusOrderInformationVo;

/**
 * 上下班订单
 * 
 * @author Johnson
 *
 */
@Controller
public class CommuteOrderController extends BaseController {

	private static final Logger LOGGER = LoggerFactory.getLogger(CommuteOrderController.class);

	@Value("${passenger.api.url}")
	private String apiUrlPrefix;
	@Value("${app.id}")
	private Integer appId;
	@Value("${app.key}")
	private String appKey;
	@Value("${client.type}")
	private Integer clientType;
	@Value("${app.version}")
	private Double appVersion;
	@Value("${device_id}")
	private String drviceId;

	/**
	 * 进入到订单地图页
	 * 
	 * @param request
	 * @param orderNo
	 * @param token
	 * @return
	 */
	@RequestMapping(value = "commute/commuteOrder/toOrderDetailMap")
	public String toOrderDetailMap(HttpServletRequest request, String orderNo, String token, Model model, String src,
			String departDate) {
		token = this.getToken();
		String url = apiUrlPrefix + AppUrlConfig.COMMUTE_ORDER_MAP + "?orderNo=" + orderNo + "&token=" + token
				+ "&departDate=" + departDate;
		String responseData = HttpUtil.doGetRequest(url);
		ResultEntity result = GsonUtil.GsonToBean(responseData, ResultEntity.class);
		if (result != null) {
			String data = GsonUtil.GsonString(result.getData());
			OrderInformation orderInformation = GsonUtil.GsonToBean(data, OrderInformation.class);
			List<BusLineStation> departStationList = orderInformation.getBaseBus().getBusLineStationList();
			List<BusLineStation> arriveStationList = orderInformation.getBaseBus().getArriveLineStationList();
			Integer useTime = 0;
			BaseBus baseBus = orderInformation.getBaseBus();
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
		}
		return "/order/CommuteOrderDetailMap";
	}

	/**
	 * 通勤业务订单详情
	 * 
	 * @param request
	 * @param commonParam
	 * @param model
	 * @param orderNo
	 * @return
	 */
	@RequestMapping(value = "bus/toCommuteOrderDetail")
	public String orderDetial(HttpServletRequest request, CommonParam commonParam, Model model, String orderNo,
			Integer autoShowPay,String tripDate) {
		model.addAttribute("autoShowPay", autoShowPay);
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("token", this.getToken());
		params.put("orderNo", orderNo);
		LOGGER.info("params:{}", params);
		String jsonResult = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.COMMUTE_ORDER_DETIAL, params);// 获取订单详情
		LOGGER.info("jsonResult:" + jsonResult);
		// 通勤订单信息
		ResultEntity result = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		BusOrderInformationVo vo = GsonUtil.GsonToBean(GsonUtil.GsonString(result.getData()),
				BusOrderInformationVo.class);
		// 获取通勤票信息列表
		String ticketJsonResult = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.COMMUTE_TICKET_INFO_LIST, params);
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
		String boardingTime1 = DateUtils.unixTimestampToDate(vo.getDepartTime(), "HH:mm");
		vo.setBoardingTime1(boardingTime1);
		// 计时器倒计时
		String lockTicketTime = vo.getLockTicketTime() == null?"10":vo.getLockTicketTime();
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
		params.put("requestUrl", request.getRequestURL().toString());
		String payTypeStr = HttpUtil.doPostRequest(this.apiUrlPrefix + AppUrlConfig.GET_PROVIDER_PAYTYPE, params);
		ResultEntity payEntity = (ResultEntity) GsonUtil.GsonToBean(payTypeStr, ResultEntity.class);
		BaseProviderBasicConfig config = (BaseProviderBasicConfig) GsonUtil
				.GsonToBean(GsonUtil.GsonString(payEntity.getData()), BaseProviderBasicConfig.class);
		LOGGER.info("订单:{},支付结算配置@{}", orderNo, config.getIsAdvance());
		model.addAttribute("settleType", config.getIsAdvance());
		model.addAttribute("orderInformation", vo);
		// //获取保单号
		model.addAttribute("ticketList", ticketResult.getData());
		model.addAttribute("countDownTimeStr", "'" + countDownTimeMinStr + ":" + countDownTimeSecondStr + "'");
		model.addAttribute("countDownTimeStrToShowFirst", countDownTimeMinStr + ":" + countDownTimeSecondStr);
		model.addAttribute("ifShow", ifShow);
		model.addAttribute("tripDate",tripDate);
		return "/order/commute-order-detail";
	}

	/**
	 * 通勤业务跳转至支付成功页
	 * 
	 * @param request
	 * @param commonParam
	 * @param model
	 * @param orderNo
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/commute/commuteOrder/toPaySuccess")
	public String toPaySuccess(HttpServletRequest request, Model model, String orderNo) {
		model.addAttribute("orderNo", orderNo);
		model.addAttribute("payType", "commuteToPay");
		// 判断用户是否已经关注公众号
		String token = this.getToken();
		Map<String, String> map = new HashMap<>();
		map.put("token", token);
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
		map.put("type", "2");
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
				model.addAttribute("focusOn", 0);
				qrcUrl = QiniuDown.DOAMIN + providerInfo.getWechatQrcodeUrl();
				model.addAttribute("wechatQrcodeUrl", qrcUrl);
				return "commutePaymentSuccess";
			}
			return "commutePaymentSuccess";
		}

		return "commutePaymentSuccess";
	}

	@RequestMapping(value = "commute/toBatchRefund")
	public String toBatchRefund(String orderNo, Model model) {
	    model.addAttribute("orderNo",orderNo);
		return "commute_toBatchRefund";
	}

	@RequestMapping(value = "commute/checkRefundTicket")
	@ResponseBody
	public String checkRefundTicket(String serialNos, Model model) {
		String url = apiUrlPrefix + AppUrlConfig.COMMUTE_CHECK_REFUND;
		Map<String, String> map = new HashMap<String, String>();
		map.put("serialNos", serialNos);
		Map<String, String> params = this.genReqApiData(url, map);
		String resultData = HttpUtil.doPostReq(url, params);
		return resultData;
	}

	@RequestMapping(value = "commute/toRefundDetail")
	public String toRefundDetail() {
		return "commute_refundDetail";
	}
}
