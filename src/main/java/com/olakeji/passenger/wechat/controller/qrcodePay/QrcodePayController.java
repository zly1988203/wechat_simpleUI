package com.olakeji.passenger.wechat.controller.qrcodePay;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.olakeji.common.wechat.api.WeChatCommonService;
import com.olakeji.common.wechat.bean.user.WeChatUser;
import com.olakeji.common.wechat.exception.WeChatErrorException;
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
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.entity.BaseProviderBasicConfig;
import com.olakeji.passenger.wechat.entity.BaseQrcodeInfo;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.passenger.wechat.utils.StringUtil;
import com.olakeji.tsp.cache.CacheKey;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class QrcodePayController extends BaseController {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	/**
	 * 当前的模式
	 */
	@Value("${mode}")
	private String mode;

	@Autowired
	private RedisUtil redisUtil;

	public static final String DEVELOP_MODE = "develop";

	@Value("${passenger.api.url}")
	private String apiUrl;

	@Autowired
	private WeChatCommonService commonService;

	@RequestMapping("/bus/toQrcodePay")
	public String qrcodePay(Model model,
							Integer qrcodeId,
							HttpServletRequest request,
							RedirectAttributes redirectAttributes,
							HttpServletResponse response) {
		String code = request.getParameter("code");
		String infoId = request.getParameter("state");
		if (!StringUtil.isEmpty(code)) {
			redirectAttributes.addAttribute("code", code);
		}
		if (!StringUtil.isEmpty(infoId)) {
			redirectAttributes.addAttribute("state", infoId);
		}
		redirectAttributes.addAttribute("qrcodeId", qrcodeId);
		logger.info("扫描支付参数:@code{},@state{},@qrcodeId{}",code,infoId,qrcodeId);
//		return "redirect:/bus/toDriverQrcodePay";
		return this.commonRedirect(request, response, "/bus/toDriverQrcodePay");
	}

	@RequestMapping("/bus/toDriverQrcodePay")
	public String toDriverQrcodePay(Model model, Integer qrcodeId, HttpServletRequest request) {
		logger.info("进入扫描支付");
		Map<String, Object> map = new HashMap<>();
		String code = request.getParameter("code");
		LOGGER.info("wechatcode@{}", code);
		String infoId = request.getParameter("state");
		if (infoId == null && qrcodeId != null) {
			infoId = qrcodeId.toString();
		}
		logger.info("扫描支付@{}",infoId);
		Cookie[] cookies = request.getCookies();
		String qrcodeOpenId = "";
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals("qrcodeOpenId")) {
					qrcodeOpenId = cookie.getValue();
					try {
						qrcodeOpenId = URLDecoder.decode(qrcodeOpenId, "utf-8");
					} catch (UnsupportedEncodingException e) {
						LOGGER.info("qrcodeOpenId decode error:", e);
					}
				}
			}
		}

		String payData = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.QRCODE_TO_PAY + "?qrcodeId=" + infoId, map);
		logger.info("扫描支付接口回复@{}",payData);
		ResultEntity resultEntity = GsonUtil.GsonToBean(payData, ResultEntity.class);
		BaseQrcodeInfo info = null;
		if (resultEntity.getCode() == Constant.SUCCESS) {
			Map<String, Object> data = GsonUtil.GsonToMaps(GsonUtil.GsonString(resultEntity.getData()));
			if (data.containsKey("payMode")) {
				String payMode = GsonUtil.GsonString(data.get("payMode"));
				BaseProviderBasicConfig baseProviderBasicConfig = GsonUtil.GsonToBean(payMode,
						BaseProviderBasicConfig.class);
				model.addAttribute("settleType", baseProviderBasicConfig.getIsAdvance());
			}
			if (data.containsKey("qrcodeInfo")) {
				String qrcodeInfo = GsonUtil.GsonString(data.get("qrcodeInfo"));
				info = GsonUtil.GsonToBean(qrcodeInfo, BaseQrcodeInfo.class);
				model.addAttribute("qrcodeInfo", info);

				if (!StringUtil.isEmpty(code)) {// 开发模式code允许为空
					String openId = null;
					// if(!DEVELOP_MODE.equals(mode)){//非开发模式需要获取openId
					openId = getOpenId(code, String.valueOf(info.getProviderId()));// 用户的openid
					if (!StringUtils.isEmpty(openId)) {
						UUID uuid = UUID.randomUUID();
						redisUtil.set(CacheKey.WX_USER_OPENID + uuid, openId);
						model.addAttribute("qrcodeOpenId", uuid);
						LOGGER.info("mode为:{},uuid@{},providerId@{},openId@{}", mode, uuid, info.getProviderId(),
								openId);
					}
				}

				if (data.containsKey("providerName")) {
					String providerName = (String) data.get("providerName");
					model.addAttribute("providerName", providerName);
				}

				if (data.containsKey("appId")) {
					String appId = (String) data.get("appId");
					model.addAttribute("appId", appId);
					redisUtil.set(CacheKey.WX_APP_ID_PREFIX + info.getProviderId(), appId);
					redisUtil.set(CacheKey.WX_APP_SERCET_PREFIX + info.getProviderId(), data.get("appSecret"));
				}

				if (data.containsKey("driverInfo")) {
					String driverInfo = (String) data.get("driverInfo");
					model.addAttribute("driverInfo", driverInfo);
				}

			}
			return "payOrder";
		} else if (resultEntity.getCode().equals(Constant.QRCODE_PAY_INVALID)) {
			return "/qrcode/failure?qrcodeId=" + qrcodeId;
		} else {
			return "Error500";
		}

	}

	// 通过code获取openId
	public String getOpenId(String code, String providerId) {
		LOGGER.info("传递额参数@code@{},providerId@{}", code, providerId);
		if (!StringUtil.isEmpty(code)) {
			String appid = redisUtil.getString(CacheKey.WX_APP_ID_PREFIX + providerId);
			String appSecret = redisUtil.getString(CacheKey.WX_APP_SERCET_PREFIX + providerId);//

			LOGGER.info("appId为@{},秘钥为@{}", appid, appSecret);
			/*String url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + appSecret
					+ "&code=" + code + "&grant_type=authorization_code";
			String result = HttpUtil.doGetRequest(url);
			LOGGER.info("获取openId,url@{},返回@{}", url, result);
			if (!StringUtil.isEmpty(result)) {
				Map<String, String> resultMap = GsonUtil.GsonToMaps(result);
				if (resultMap.get("openid") != null) {
					return resultMap.get("openid").toString();
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

	@RequestMapping(value = "qrcode/getPrepayInfo")
	public @ResponseBody String getPrepayInfo(HttpServletRequest request, Integer qrcodeId, BigDecimal price,
			String uuId) {
		Map<String, Object> map = new HashMap<>();
		map.put("qrcodeId", qrcodeId);
		map.put("price", price);
		map.put("uuId", uuId);
		String entity = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.QRCODE_PAY_INFO, map);
		return entity;
	}

	@RequestMapping(value = "qrcode/toPaySuccess")
	public String toPaySuccess(HttpServletRequest request, Model model, String orderNo) {
		model.addAttribute("orderNo", orderNo);
		Map<String, Object> map = new HashMap<>();
		map.put("orderNo", orderNo);
		String entity = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.QRCODE_INFO, map);
		ResultEntity resultEntity = GsonUtil.GsonToBean(entity, ResultEntity.class);
		Map<String, Object> data = GsonUtil.GsonToMaps(GsonUtil.GsonString(resultEntity.getData()));
		model.addAttribute("map", data);
		return "qrcodeSuccess";
	}

	@RequestMapping(value = "qrcode/failure")
	public String failure(HttpServletRequest request, Model model, Integer qrcodeId) {
		Map<String, Object> map = new HashMap<>();
		map.put("qrcodeId", qrcodeId);
		String entity = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.QRCODE_TEL, map);
		ResultEntity resultEntity = GsonUtil.GsonToBean(entity, ResultEntity.class);
		Map<String, Object> data = GsonUtil.GsonToMaps(GsonUtil.GsonString(resultEntity.getData()));
		model.addAttribute("map", data);
		return "failure";
	}
}
