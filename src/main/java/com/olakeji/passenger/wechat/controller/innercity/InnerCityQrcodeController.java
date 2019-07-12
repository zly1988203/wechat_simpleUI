package com.olakeji.passenger.wechat.controller.innercity;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.olakeji.common.wechat.api.WeChatCommonService;
import com.olakeji.common.wechat.bean.user.WeChatUser;
import com.olakeji.common.wechat.exception.WeChatErrorException;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.service.provider.BaseProviderService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.cache.RedisUtil;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.entity.OrderInformation;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.passenger.wechat.utils.StringUtil;
import com.olakeji.tsp.cache.CacheKey;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.OrderStatusKey;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;

/**
 * 成绩约租车二维码订单
 * 
 * @author Yuki
 *
 */
@Controller
public class InnerCityQrcodeController extends BaseController {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());

	@Value("${passenger.api.url}")
	private String apiUrlPrefix;

	@Value("${zhongjiao.APP_ID}")
	private String zhongjiaoAppId;

	@Value("${pay.server.url}")
	private String payCenterUrl;

	@Value("${zhongjiao.sub_app_id}")
	private String zhongjiaoSubAppId;
	@Autowired
	private BaseProviderService baseProviderService;
	@Autowired
	private RedisUtil redisUtil;
	@Autowired
	private WeChatCommonService commonService;

	@RequestMapping("bus/toInnerCityQrcodePay")
	public String toInnerCityQrcodePay(String orderNo, HttpServletRequest request, Model model) {
		String wechatURL = "";

		StringBuffer url = request.getRequestURL();
		try {
			URI uri = new URI(url.toString());
			String scheme = uri.getScheme();
			String host = uri.getHost();
			String[] hostArr = host.split("\\.");
			if (hostArr != null && hostArr.length > 0) {
				String domainCode = hostArr[0];
				wechatURL = baseProviderService.getWechatUrl(baseProviderService.getCacheByDomain(domainCode).getProviderId());
				redisUtil.set(CacheKey.WECHAT_ORDER_URL + orderNo, wechatURL, 60 * 60L);
			}
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
		Map<String, Object> map = new HashMap<>();
		map.put("orderNo", orderNo);
		String payInfo = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.GET_INNERCITY_QRCODE_INFO, map);
		ResultEntity result = GsonUtil.GsonToBean(payInfo, ResultEntity.class);
		if (result.getCode() != Constant.SUCCESS) {
			if (result.getCode() == Constant.QRCODE_PAY_INVALID) {
				Map<String, Object> resultMap = GsonUtil.GsonToMaps(GsonUtil.GsonString(result.getData()));
				model.addAttribute("map", getTel(resultMap.get("providerId").toString()));
				return "order/qrcodePayFail";
			}
			return "Error500";
		}
		Map<String, Object> resultMap = GsonUtil.GsonToMaps(GsonUtil.GsonString(result.getData()));
		if (resultMap == null) {
			return "Error500";
		}
		String appid = resultMap.get("appid").toString().trim();
		Integer providerId = Integer.valueOf(resultMap.get("providerId").toString());
		if (StringUtil.isEmpty(appid)) {
			return "Error500";
		}
		String returnUrl = "";
		if (resultMap.get("settleMode").toString().equals("0")) {
			/*returnUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + zhongjiaoSubAppId
					+ "&redirect_uri=" + payCenterUrl
					+ "/order/toInnerCityQrcodeWXPay&connect_redirect=1&response_type=code&scope=snsapi_base&state="
					+ orderNo + "_" + providerId + "#wechat_redirect";*/
			returnUrl = this.commonService.authApiConfig().baseAuthUri(zhongjiaoSubAppId, payCenterUrl + "/order/toInnerCityQrcodeWXPay",
					orderNo + "_" + providerId);
		} else {
			/*returnUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri="
					+ wechatURL
					+ "/bus/toInnerCityQrcodeWXPay&connect_redirect=1&response_type=code&scope=snsapi_base&state="
					+ orderNo + "_" + providerId + "#wechat_redirect";*/
			returnUrl = this.commonService.authApiConfig().baseAuthUri(appid, wechatURL + "/bus/toInnerCityQrcodeWXPay",
					orderNo + "_" + providerId);
		}
		return "redirect:" + returnUrl;
	}

	@RequestMapping("bus/toInnerCityQrcodeWXPay")
	public String toInnerCityQrcodeWXPay(String code,
										 String state,
										 HttpServletRequest request,
										 HttpServletResponse response) {
		if (!StringUtils.isEmpty(state)) {
			String[] paramArray = state.split("_");
			String orderNo = paramArray[0];
			String providerId = paramArray[1];
			LOGGER.info("订单号orderNo====" + orderNo + "车企Id=====" + providerId);
			// 获取车企的微信支付信息
			Map<String, Object> map = new HashMap<>();
			map.put("providerId", providerId);
			String payInfo = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.GET_INNERCITY_PROVIDERPAY_INFO, map);
			ResultEntity result = GsonUtil.GsonToBean(payInfo, ResultEntity.class);
			if (result.getCode() != Constant.SUCCESS) {
				return "Error500";
			}

			Map<String, Object> resultMap = GsonUtil.GsonToMaps(GsonUtil.GsonString(result.getData()));
			if (resultMap == null) {
				return "Error500";
			}

			if (!StringUtils.isEmpty(code)) {
				if (!StringUtils.isEmpty(code)) {
					String appid = resultMap.get("appid").toString().trim();
					String appSecret = resultMap.get("appSecret").toString().trim();
					String openId = this.getZhongjiaoOpenid(code, appid, appSecret);
					// String openId = "oTEoXwhKQx2hrh9ADx1bpIaBvX2U";
					if (!StringUtils.isEmpty(openId)) {
						UUID uuid = UUID.randomUUID();
						redisUtil.set(CacheKey.WX_USER_OPENID + uuid, openId, 60 * 60L);
						LOGGER.info("用户在中交出行的openid为:" + openId);
//						return "redirect:" + "/bus/toInnerCityQrcodeOrderPay?uuid=" + uuid + "&orderNo=" + orderNo;
						String urlStr = "/bus/toInnerCityQrcodeOrderPay?uuid=" + uuid + "&orderNo=" + orderNo;
						return this.commonRedirect(request, response, urlStr);
					}
				}
			} else {
				return "Error500";
			}
		}
		return "Error500";
	}

	@RequestMapping("bus/toInnerCityQrcodeOrderPay")
	public String toInnerCityQrcodeOrderPay(String orderNo, String uuid, Model model) {
		model.addAttribute("uuid", uuid);
		String getOrderDetail = apiUrlPrefix + AppUrlConfig.GET_WAIT_PAY_ORDER_DETAIL + orderNo;
		Map<String,Object> requstMap = new HashMap<>();
		requstMap.put("payType",Constant.userCoupon.NOTUSE);
		String orderDetailResultData = HttpUtil.doPostRequest(getOrderDetail,requstMap);
		ResultEntity resultEntity = GsonUtil.GsonToBean(orderDetailResultData, ResultEntity.class);
		String orderDetailData = GsonUtil.GsonString(resultEntity.getData());
		OrderInformation orderInformation = GsonUtil.GsonToBean(orderDetailData, OrderInformation.class);

		if (orderInformation.getStatus() == OrderStatusKey.ORDER_STATUS_WAITPAY_INT) {
			model.addAttribute("orderInformation", orderInformation);
			return "order/qrcodePay";
		} else {
			model.addAttribute("map", getTel(String.valueOf(orderInformation.getProviderId())));
			return "order/qrcodePayFail";
		}
	}

	/**
	 * 获取用户在中交的openid
	 * 
	 * @param code
	 * @return
	 */
	public String getZhongjiaoOpenid(String code, String appid, String appSecret) {
		if (!StringUtils.isEmpty(code)) {
			/*String result = HttpUtil.doGetRequest("https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid
					+ "&secret=" + appSecret + "&code=" + code + "&grant_type=authorization_code");
			if (!StringUtils.isEmpty(result)) {
				LOGGER.info("返回的结果为" + result);
				Map<String, String> resultMap = GsonUtil.GsonToMaps(result);
				if (resultMap.get("openid") != null) {
					return ((String) resultMap.get("openid")).toString();
				}
			}*/
			try {
				WeChatUser weChatUser = this.commonService.getUserService().getUserAuthToken(appid, appSecret, code);
				logger.info("获取到的access_token:{}", weChatUser.getAccessToken());
				return weChatUser.getOpenId();
			} catch (WeChatErrorException ex) {
				logger.error("get open id exception = {}", ex.getMessage());
			}
		}
		return "";
	}

	@RequestMapping("innerCity/qrcode/toPaySuccess")
	public String toInnerCityPaySuccess(Model model, String orderNo) {
		model.addAttribute("orderNo", orderNo);
		Map<String, Object> map = new HashMap<>();
		map.put("orderNo", orderNo);
		String orderDetailResultData = HttpUtil
				.doPostRequest(apiUrlPrefix + AppUrlConfig.GET_INNERCITY_QRCODE_ORDER_INFO, map);
		ResultEntity resultEntity = GsonUtil.GsonToBean(orderDetailResultData, ResultEntity.class);
		Map<String, Object> data = GsonUtil.GsonToMaps(GsonUtil.GsonString(resultEntity.getData()));
		model.addAttribute("map", data);
		return "order/qrcodePaySuccess";
	}

	private Map<String, Object> getTel(String providerId) {
		Map<String, Object> params = new HashMap<>();
		params.put("providerId", providerId);
		String entity = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.INNERCITY_QRCODE_TEL, params);
		ResultEntity resultEntity2 = GsonUtil.GsonToBean(entity, ResultEntity.class);
		Map<String, Object> data = GsonUtil.GsonToMaps(GsonUtil.GsonString(resultEntity2.getData()));
		return data;
	}

	/**
	 * 获取订单预支付信息
	 * 
	 * @param orderNo
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "bus/getInnerCityQrcodeOrderPrepayInfo")
	public @ResponseBody String getOrderPrepayInfo(String orderNo, String uuid) {
		String requestUrl = apiUrlPrefix + AppUrlConfig.GET_INNERCITY_QRCODE_ORDER_PREPAY_INFO + "?orderNo=" + orderNo
				+ "&uuid=" + uuid;
		LOGGER.info("", requestUrl);
		String responseData = HttpUtil.doGetRequest(requestUrl);
		LOGGER.info(" 预支付信息请求Url@{},返回@{}", requestUrl, responseData);
		return responseData;
	}

	@RequestMapping(value = "innerCity/qrcode/toPayFail")
	public String failure(HttpServletRequest request, Model model, String providerId) {
		Map<String, Object> data = getTel(providerId);
		model.addAttribute("map", data);
		return "order/qrcodePayFail";
	}
}
