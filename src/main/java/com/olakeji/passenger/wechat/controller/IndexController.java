package com.olakeji.passenger.wechat.controller;

import com.alibaba.fastjson.JSON;
import com.google.gson.reflect.TypeToken;
import com.olakeji.cache.RedisUtil;
import com.olakeji.common.wechat.api.WeChatCommonService;
import com.olakeji.common.wechat.api.WeChatLocalInfoHolder;
import com.olakeji.common.wechat.bean.WeChatConfigInfo;
import com.olakeji.common.wechat.bean.user.WeChatUser;
import com.olakeji.common.wechat.exception.WeChatErrorException;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.entity.BaseBus;
import com.olakeji.passenger.wechat.entity.BaseProviderBasicConfig;
import com.olakeji.passenger.wechat.entity.BaseProviderInfo;
import com.olakeji.passenger.wechat.entity.BaseUser;
import com.olakeji.passenger.wechat.service.provider.BaseProviderService;
import com.olakeji.passenger.wechat.utils.CookieUtil;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.passenger.wechat.utils.StringUtil;
import com.olakeji.tsp.cache.CacheKey;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.LineType;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.constant.ConstantInfo;
import com.olakeji.tsp.utils.DateUtils;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.wechatapi.HttpUtils;
import com.olakeji.util.CommonTools;
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

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "/")
public class IndexController extends BaseController {
	private final Logger LOGGER = LoggerFactory.getLogger(IndexController.class);

	@Value("${passenger.api.url}")
	private String apiUrl;
	// 验证mp_verify文件
	private static final String VALIDATEMPVERIFY = "/validateMpVerify";
	// 增加注册数
	private static final String ADDBASEOAUTH = "/Account/addUserOauth";
	public static final int LIST_FLAG_SEARCH = 1;// 用户由搜索页跳转到该列表页
	public static final int LIST_FLAG_HOTLINE = 2;// 用户从热门班次关联到列表页
	public static final int LIST_FLAG_QRCODE = 3;// 用户从二维码关联到列表页
	public static final int LIST_FOR_ACTIVITY = 5;// 从活动进入线路列表
	@Autowired
	private RedisUtil redisUtil;
	@Autowired
	private WeChatCommonService wechatCommonService;
	@Value("${wechat.server.url}")
	private String wechatServerURL;
	@Value("${app.id}")
	private String appId;
	@Value("${app.key}")
	private String appKey;
	@Value("${client.type}")
	private Integer clientType;
	@Value("${page.size}")
	private Integer pageSize;
	@Value("${app.version}")
	private Double appVersion;
	@Value("${osp.php.url}")
	private String ospUrl;

	@Value("${device_id}")
	private String drviceId;
	@Value("${wechatlogin}")
	private String wechatLogin;

	@Value("${passenger.api.url}")
	private String passengerApiUrl;

	@Value("${pay.server.url}")
	private String payCenterUrl;
	
	@Value("${websocket.server.url}")
	private String websocketServerUrl;
	@Autowired
	private BaseProviderService baseProviderService;

	/**
	 * 代表什么模式
	 */
	@Value("${mode}")
	private String mode;

	@Value("${webapi.amap}")
	private String mapApiKey;

	public static final String DEVELOP_MODE = "develop";

	public static final String TEST_MODE = "test";

	public static final String ONLINE_MODE = "online";

	public static final String BUS_MODE = "bus";// 大巴车模式

	public static final String TAXI_MODE = "taxi";// 出租车模式

	public static final String INTERCITY_MODE = "interCity";// 城际约租车模式

	public static final String SAMECITY_MODE = "sameCity";// 同城出行模式

	/**
	 * 中交appId
	 */
	@Value("${zhongjiao.APP_ID}")
	private String zhongjiaoAppId;

	@Value("${zhongjiao.sub_app_id}")
	private String zhongjiaoSubAppId;

	@Value("${passenger.api.url}")
	private String apiUrlPrefix;

	@Autowired
	private WeChatCommonService commonService;
	/**
	 * 获取openid
	 * 
	 * @param request
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping({"index","","/"})
	public String getOpenId(HttpServletRequest request,
							HttpServletResponse response,
							Model model) {
		// 以下两个是微信公众号回调参数
		String code = request.getParameter("code");
		String state = request.getParameter("state");
		// state为空时，是标签间的切换，取传递过来的token，来获取用户业务类型配置
		String token = request.getParameter("token");
		String type = request.getParameter("type");
		String fromUrl = "";

		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals("token")) {
					token = cookie.getValue();
				}
			}
		}
		// 获取车企所有开通业务类型
		Map<String, Object> map1 = new HashMap<String, Object>();
		String requestUrl = request.getRequestURL().toString();
		map1.put("requestUrl", requestUrl);
		String jsonString = HttpUtil.doPostRequest(apiUrl + AppUrlConfig.GET_BUSINESS_TYPES, map1);
		ResultEntity result = GsonUtil.GsonToBean(jsonString, ResultEntity.class);
		Map<String, Object> resultMap = (Map<String, Object>) result.getData();

		BaseUser baseUser = new BaseUser();
		model.addAttribute("businessTypes", resultMap);
		model.addAttribute("baseUser", baseUser);
		model.addAttribute("mapApiKey", mapApiKey);
		model.addAttribute("providerId", resultMap.get("providerId"));
		model.addAttribute("token", token);
		LOGGER.info("跳转时的providerId@{}，token@{},@state{}", resultMap.get("providerId"),token,state);
		try {
			if (!StringUtils.isEmpty(state)) {
				String[] paramArray = state.split("_");
				// token = paramArray[0].replace(" ", "+");//第一个为用户登录的token
				if (paramArray.length > 3 && !StringUtil.isEmpty(paramArray[3])) {
					fromUrl = paramArray[3];
				}
			}
			if (!StringUtil.isEmpty(token)) {
				String baseUserStr = (String) redisUtil.get(token);
				if (!StringUtils.isEmpty(baseUserStr)) {
					baseUser = GsonUtil.GsonToBean(baseUserStr, BaseUser.class);
					model.addAttribute("baseUser", baseUser);
					model.addAttribute("providerId", baseUser.getProviderId());
					// 开发模式code允许为空
					if (!StringUtil.isEmpty(code)) {
						String openId = null;
						if (!DEVELOP_MODE.equals(mode)) {
							// 非开发模式需要获取openId
							openId = getOpenId(code, String.valueOf(baseUser.getProviderId()));
							// 用户的openid
							if (!StringUtils.isEmpty(openId)) {
								redisUtil.set(CacheKey.WX_USER_OPENID + token, openId);
								String appid = redisUtil
										.getString(CacheKey.WX_APP_ID_PREFIX + baseUser.getProviderId());
								redisUtil.set(CacheKey.WX_USER_OPENID_ORDER + appid + "_" + baseUser.getMobile(),
										openId);
								LOGGER.info("登录存放的redis key@{},mobile@{},openId@{}",
										CacheKey.WX_USER_OPENID_ORDER + baseUser.getProviderId(),
										"_" + baseUser.getMobile(), openId);

								// 新增注册数
								Map<String, Object> map = new HashMap<String, Object>();
								model.addAttribute("providerId", baseUser.getProviderId());
								map.put("providerId", String.valueOf(baseUser.getProviderId()));
								map.put("mobile", baseUser.getMobile());
								map.put("openId", openId);
								map.put("user", baseUser);
								HttpUtil.doPostRequest(apiUrl + ADDBASEOAUTH, map);
							}
						}
						LOGGER.info("mode为@{},token@{},providerId@{},openId@{}", mode, token, baseUser.getProviderId(),
								openId);
					}
				}
			}
			//判断跳转时，又跳回登录了
			if (StringUtils.isNotEmpty(fromUrl)) {
				if (fromUrl.indexOf(ConstantInfo.LOGIN_URL.REG_LOGIN)>=0 ||
					fromUrl.indexOf(ConstantInfo.LOGIN_URL.SELECT_LOGIN)>=0) {
					fromUrl = "";
				}
			}
			if (StringUtils.isNotEmpty(fromUrl)) {
				if(fromUrl.indexOf("/conclusion2018")>-1 && fromUrl.indexOf("/conclusion2018/annual/saveRecord")==-1){
					//年终总结特殊处理
					String toUrl = "/conclusion2018?token="+token+"&providerId="+resultMap.get("providerId");
					return this.commonRedirect(request, response, toUrl);
				}else{
					return this.commonRedirect(request, response, fromUrl);
				}
			}
			if (resultMap.get("hasTaxi") != null && (double) resultMap.get("hasTaxi") == 1) {
				if (!StringUtils.isEmpty(type)) { // 标签间跳转到指定业务界面
					if (Integer.valueOf(type) == ConstantInfo.BUSINESS_TYPE_HAS_TAXI)
						return "taxicab";
				}
			}
			if (resultMap.get("hasBus") != null && (double) resultMap.get("hasBus") == 1) {
				return "newbusIndex";
			}

			if (resultMap.get("hasTravel") != null && (double) resultMap.get("hasTravel") == 1) {
				return "/travelIndex";
			}

			if(resultMap.get("hasOnline") != null && (double) resultMap.get("hasOnline") == 1){
				return "/onlineIndex";
			}
			
			if(resultMap.get("charteredCarIndex") != null && (double) resultMap.get("charteredCarIndex") == ConstantInfo.HAS_CHARTERED){
				return "/charteredCarIndex";
			}
            if (resultMap.get("hasCommute") != null
                    && (double) resultMap.get("hasCommute") == ConstantInfo.HAS_COMMUTE) {
                return "commuteBusIndex";
            }
			if (resultMap.get("hasInterCity") != null && (double) resultMap.get("hasInterCity") == 1) {
				// 获取城际约租车规则和 温馨提示
				String url2 = apiUrlPrefix + AppUrlConfig.INTER_CITY_GET_INDEX_CONFIG;
				Map<String, String> paramsMap2 = new HashMap<String, String>();
				Map<String, String> params2 = this.genReqApiData(url2, paramsMap2);
				String jsonResult2 = HttpUtil.doPostReq(url2, params2);

				ResultEntity result2 = GsonUtil.GsonToBean(jsonResult2, ResultEntity.class);
				Map<String, Object> resultMap2 = (Map<String, Object>) result2.getData();
				model.addAttribute("nowTime", new Date().getTime());
				model.addAttribute("config", resultMap2);
				return "interCityIndex";
			}
			if (resultMap.get("hasInterCityOnline") != null && (double) resultMap.get("hasInterCityOnline") == 1) {
				// 获取城际约租车规则和 温馨提示
				String url2 = apiUrlPrefix + AppUrlConfig.INTER_CITY_ONLINE_GET_INDEX_CONFIG;
				Map<String, String> paramsMap2 = new HashMap<String, String>();
				Map<String, String> params2 = this.genReqApiData(url2, paramsMap2);
				String jsonResult2 = HttpUtil.doPostReq(url2, params2);
				ResultEntity result2 = GsonUtil.GsonToBean(jsonResult2, ResultEntity.class);
				Map<String, Object> resultMap2 = (Map<String, Object>) result2.getData();
				model.addAttribute("nowTime", new Date().getTime());
				model.addAttribute("config", resultMap2);
				return "/hail/interCityIndex";
			}
			if (resultMap.get("hasInnerCityOnline") != null && (double) resultMap.get("hasInnerCityOnline") == 1) {
					return "hail/onlineIndex";
			}
			if (resultMap.get("hasBusTicket") != null && (double) resultMap.get("hasBusTicket") == 1) {
				// 获取预售时间
				String presellDayUrl = apiUrl + AppUrlConfig.BUSTICKET_PRESELL_DAY;// 历史记录
				Map<String, String> paramsMap1 = new HashMap<String, String>();
				Map<String, String> params2 = this.genReqApiData(presellDayUrl, paramsMap1);
				String jsonResult2 = HttpUtil.doPostReq(presellDayUrl, params2);
				ResultEntity resultData2 = GsonUtil.GsonToBean(jsonResult2, ResultEntity.class);
				if (resultData2.getData() != null) {
					model.addAttribute("presellDay", resultData2.getData());
				}
				model.addAttribute("currentDateStr", DateUtils.format(new Date(), "yyyy-M-d"));
				return "busTicketHome";
			}
		} catch (Exception e) {
			LOGGER.error("获取openId异常:", e);
		}
		return "taxicab";
	}

	/**
	 * 微信登录回调
	 * 
	 * @param request
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "wechatLoginIndex")
	public String wechatLoginIndex(HttpServletRequest request, Model model) {
		String code = request.getParameter("code");
		String state = request.getParameter("state");
		String providerIdStr = "";
		if (!StringUtils.isEmpty(state)) {
			String[] paramArray = state.split("_");
			providerIdStr = paramArray[0];
		}
		if (!StringUtil.isEmpty(code)) {// 开发模式code允许为空
			String openId = null;
			if (!DEVELOP_MODE.equals(mode)) {// 非开发模式需要获取openId
				openId = getOpenId(code, providerIdStr);// 用户的openid
				if (!StringUtils.isEmpty(openId)) {
					String responseData = HttpUtil.doGetRequest(apiUrlPrefix + AppUrlConfig.WECHAT_LOGIN
							+ "?wechatOpenId=" + openId + "&providerId=" + providerIdStr);
					LOGGER.info("请求微信登录返回@{}", responseData);
					ResultEntity resultEntity = GsonUtil.GsonToBean(responseData, ResultEntity.class);
					Map<String, String> data = (Map<String, String>) resultEntity.getData();
					String token = data.get("token");
					redisUtil.set(CacheKey.WX_USER_OPENID + token, openId);
					
					String baseUserStr = (String) redisUtil.get(token);
					if (!StringUtils.isEmpty(baseUserStr)) {
						BaseUser baseUser = GsonUtil.GsonToBean(baseUserStr, BaseUser.class);
						String appid = redisUtil
								.getString(CacheKey.WX_APP_ID_PREFIX + providerIdStr);
						redisUtil.set(CacheKey.WX_USER_OPENID_ORDER + appid + "_" + baseUser.getMobile(),
								openId);
					}
					
					LOGGER.info("登录存放的redis key@{},openId@{}", CacheKey.WX_USER_OPENID_ORDER + providerIdStr + "_",
							openId);
					model.addAttribute("token", token);
					if ((Constant.USER_EXIST + "").equals(data.get("flag"))) {
						model.addAttribute("userExist", "true");
					}
					return "login/wechatLogin";
				}
			}

		}
		return "login/wechatLogin";
	}

	/**
	 * 城际约租车
	 * 
	 * @param request
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "interCityIndex")
	public String interCityIndex(HttpServletRequest request, Model model) {
		// 获取车企所有开通业务类型
		String url = apiUrlPrefix + AppUrlConfig.GET_BUSINESS_TYPES;
		Map<String, String> paramsMap = new HashMap<String, String>();
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		LOGGER.info("request interCity@url{},param@{},response@{}", url, GsonUtil.GsonString(paramsMap), jsonResult);
		ResultEntity result = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		Map<String, Object> resultMap = (Map<String, Object>) result.getData();
		model.addAttribute("businessTypes", resultMap);
		model.addAttribute("nowTime", new Date().getTime());
		// 获取城际约租车规则和 温馨提示
		String url2 = apiUrlPrefix + AppUrlConfig.INTER_CITY_GET_INDEX_CONFIG;
		Map<String, String> paramsMap2 = new HashMap<String, String>();
		Map<String, String> params2 = this.genReqApiData(url2, paramsMap2);
		String jsonResult2 = HttpUtil.doPostReq(url2, params2);
		ResultEntity result2 = GsonUtil.GsonToBean(jsonResult2, ResultEntity.class);
		/**
		 * piggy.huang 这里植入代码，需要对空指针做判断，已经发现了异常错误
		 */
		if (result2.getData()!=null) {
			Map<String, Object> resultMap2 = (Map<String, Object>) result2.getData();
			model.addAttribute("config", resultMap2);
		}

		// 获取城际约车支付结算方式：0非预付款 1预付款
		String payTypeStr = HttpUtil.doPostReq(apiUrlPrefix + AppUrlConfig.GET_PROVIDER_PAYTYPE, params);
		ResultEntity payEntity = GsonUtil.GsonToBean(payTypeStr, ResultEntity.class);
		BaseProviderBasicConfig config = GsonUtil.GsonToBean(GsonUtil.GsonString(payEntity.getData()),
				BaseProviderBasicConfig.class);
		LOGGER.info("支付结算配置为@{}", config.getIsAdvance());
		model.addAttribute("settleType", config.getIsAdvance());
		BaseUser baseUser = new BaseUser();
		String baseUserStr = (String) redisUtil.get(this.getToken());
		if (!StringUtils.isEmpty(baseUserStr)) {
			baseUser = GsonUtil.GsonToBean(baseUserStr, BaseUser.class);
			model.addAttribute("baseUser", baseUser);
		} else {
			model.addAttribute("baseUser", baseUser);
		}
		model.addAttribute("providerId", resultMap.get("providerId"));
		return "innerCity-index";
	}

	/**
	 * 城际约租车
	 *
	 * @param request
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "hail/interCityIndex")
	public String interCityOnlineIndex(HttpServletRequest request, Model model) {
		// 获取车企所有开通业务类型
		String url = apiUrlPrefix + AppUrlConfig.GET_BUSINESS_TYPES;
		Map<String, String> paramsMap = new HashMap<String, String>();
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		LOGGER.info("request interCity@url{},param@{},response@{}", url, GsonUtil.GsonString(paramsMap), jsonResult);
		ResultEntity result = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		Map<String, Object> resultMap = (Map<String, Object>) result.getData();
		model.addAttribute("businessTypes", resultMap);
		model.addAttribute("nowTime", new Date().getTime());
		// 获取城际约租车规则和 温馨提示
		String url2 = apiUrlPrefix + AppUrlConfig.INTER_CITY_ONLINE_GET_INDEX_CONFIG;
		Map<String, String> paramsMap2 = new HashMap<String, String>();
		Map<String, String> params2 = this.genReqApiData(url2, paramsMap2);
		String jsonResult2 = HttpUtil.doPostReq(url2, params2);
		ResultEntity result2 = GsonUtil.GsonToBean(jsonResult2, ResultEntity.class);
		/**
		 * piggy.huang 这里植入代码，需要对空指针做判断，已经发现了异常错误
		 */
		if (result2.getData()!=null) {
			Map<String, Object> resultMap2 = (Map<String, Object>) result2.getData();
			model.addAttribute("config", resultMap2);
		}

		// 获取城际约车支付结算方式：0非预付款 1预付款
		String payTypeStr = HttpUtil.doPostReq(apiUrlPrefix + AppUrlConfig.GET_PROVIDER_PAYTYPE, params);
		ResultEntity payEntity = GsonUtil.GsonToBean(payTypeStr, ResultEntity.class);
		BaseProviderBasicConfig config = GsonUtil.GsonToBean(GsonUtil.GsonString(payEntity.getData()),
				BaseProviderBasicConfig.class);
		LOGGER.info("支付结算配置为@{}", config.getIsAdvance());
		model.addAttribute("settleType", config.getIsAdvance());
		BaseUser baseUser = new BaseUser();
		String baseUserStr = (String) redisUtil.get(this.getToken());
		if (!StringUtils.isEmpty(baseUserStr)) {
			baseUser = GsonUtil.GsonToBean(baseUserStr, BaseUser.class);
			model.addAttribute("baseUser", baseUser);
		} else {
			model.addAttribute("baseUser", baseUser);
		}
		model.addAttribute("providerId", resultMap.get("providerId"));
		return "hail/innerCity-index";
	}
	@RequestMapping(value = "busIndex")
	public String busIndex(HttpServletRequest request, Model model) {
		String requestUrl = request.getRequestURL().toString();
		// 获取车企所有开通业务类型
		String url = apiUrlPrefix + AppUrlConfig.GET_BUSINESS_TYPES;
		Map<String, String> paramsMap = new HashMap<String, String>();
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		LOGGER.info("request busIndex url@{},param@{},response@{}", url, GsonUtil.GsonString(params), jsonResult);
		String token = getToken(); // state为空时，是标签间的切换，取传递过来的token，来获取用户业务类型配置
		ResultEntity result = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		Map<String, Object> resultMap = (Map<String, Object>) result.getData();
		model.addAttribute("businessTypes", resultMap);

		BaseUser baseUser = new BaseUser();
		String baseUserStr = (String) redisUtil.get(this.getToken());
		if (!StringUtils.isEmpty(baseUserStr)) {
			baseUser = GsonUtil.GsonToBean(baseUserStr, BaseUser.class);
			model.addAttribute("baseUser", baseUser);
		} else {
			model.addAttribute("baseUser", baseUser);
		}
		model.addAttribute("providerId", resultMap.get("providerId"));
		if (resultMap.get("hasBus") != null && (double) resultMap.get("hasBus") == ConstantInfo.HAS_BUSINESS) {
			return "newbusIndex";
		}
		model.addAttribute("reLogin", "true");
		return "newbusIndex";
	}

	/**
	 * 旅游线路首页
	 * 
	 * @param request
	 * @param token
	 * @return
	 */
	@RequestMapping(value = "travelIndex")
	public String travelIndex(HttpServletRequest request, Model model) {
		BaseProviderInfo providerInfo = this.getProviderDetail(request);
		if(providerInfo == null){
			return "Error500";
		}
		Integer providerId = providerInfo.getProviderId();
		String token = getToken(); 
		BaseUser baseUser = new BaseUser();
		String baseUserStr = (String) redisUtil.get(this.getToken());
		if (!StringUtils.isEmpty(baseUserStr)) {
			baseUser = GsonUtil.GsonToBean(baseUserStr, BaseUser.class);
		}
		model.addAttribute("providerId", providerId);
		model.addAttribute("baseUser", baseUser);
		Map<String,String> map = new HashMap<String,String>();
		//旅游线路类型
		String lineType = LineType.TRAVEL_LINE_TYPE;
		String requestUrl = request.getRequestURL().toString();
		map.put("requestUrl",requestUrl);
		map.put("lineType", lineType);
		//获取旅游线路的热门线路
		String url = apiUrl + AppUrlConfig.GET_HOT_LINE;
		String lineData = HttpUtil.doPostReq(url, map);
		ResultEntity resultEntity = GsonUtil.GsonToBean(lineData, ResultEntity.class);
		if (resultEntity.getCode() == Constant.SUCCESS) {
			if (resultEntity.getData() != null) {
				model.addAttribute("homeInfo", resultEntity.getData());
				initRequestParamToModel(request, model,
						new String[] { "departLng", "departLat", "arriveLng", "arriveLat", "departDate",
								"departCityName", "arriveCityName", "startAddr", "endAddr", "departCityId",
								"arriveCityId" });
				if (request.getParameter("departDate") == null) {
					model.addAttribute("departDate", DateUtils.format(new Date(), "yyyy-M-d"));
				}
			}
		}
		model.addAttribute("historyList", busHistoryList(token,LineType.TRAVEL_LINE_TYPE));
		return "travelHome";
	}
	
	
	/**
	 * 检查车企是否开通预约租车
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping("/charteredCarIndex")
	public String charteredCarIndex(HttpServletRequest request,Model model) {
		BaseProviderInfo providerInfo = this.getProviderDetail(request);
		if(providerInfo == null){
			return "Error500";
		}
		LOGGER.info("当前车企信息:" + GsonUtil.GsonString(providerInfo));
		Integer providerId = providerInfo.getProviderId();
		String providerName = providerInfo.getProviderName();
		long currentTime = new Date().getTime();
		model.addAttribute("currentTime", currentTime);
		model.addAttribute("providerId", providerId);
		model.addAttribute("providerName", providerName);
		String token = getToken(); 
		BaseUser baseUser = new BaseUser();
		String baseUserStr = (String) redisUtil.get(token);
		if (!StringUtils.isEmpty(baseUserStr)) {
			baseUser = GsonUtil.GsonToBean(baseUserStr, BaseUser.class);
		}
		
		String url = apiUrlPrefix + AppUrlConfig.CharteredCar.QUERY_CHARTERED_CAR_CONFIG;
		Map<String, String> params = new HashMap<String,String>();
		params.put("providerId", providerId+"");
		params = this.genReqApiData(url, params);
		String resultStr = HttpUtil.doPostReq(url, params);
		LOGGER.info("返回结果：",resultStr);
		if(!StringUtil.isEmpty(resultStr)){
			ResultEntity result = GsonUtil.GsonToBean(resultStr, ResultEntity.class);
			model.addAttribute("baseProviderConfig", result.getData());
		}
		model.addAttribute("baseUser", baseUser);
		return "/charteredCarIndex";
	}
	
	
	@RequestMapping(value="onlineIndex")
	public String OnlineIndex(HttpServletRequest request,Model model){
		BaseProviderInfo providerInfo = this.getProviderDetail(request);
		if(providerInfo == null){
			return "Error500";
		}
		LOGGER.info("当前车企信息:" + GsonUtil.GsonString(providerInfo));
		Integer providerId = providerInfo.getProviderId();
		String providerName = providerInfo.getProviderName();
		long currentTime = new Date().getTime();
		model.addAttribute("currentTime", currentTime);
		model.addAttribute("providerId", providerId);
		model.addAttribute("providerName", providerName);
		String token = getToken(); 
		BaseUser baseUser = new BaseUser();
		String baseUserStr = (String) redisUtil.get(token);
		if (!StringUtils.isEmpty(baseUserStr)) {
			baseUser = GsonUtil.GsonToBean(baseUserStr, BaseUser.class);
		}
		//获取附近车辆数
		String url = apiUrlPrefix + AppUrlConfig.Online.ONLINE_INDEX;
		Map<String, String> params = new HashMap<String,String>();
		params = this.genReqApiData(url, params);
		String resultStr = HttpUtil.doPostReq(url, params);
		if(!StringUtil.isEmpty(resultStr)){
			ResultEntity result = GsonUtil.GsonToBean(resultStr, ResultEntity.class);
			model.addAttribute("baseProviderConfig", result.getData());
		}
		model.addAttribute("baseUser", baseUser);
		return "onlineCarHome";
	}

	@RequestMapping(value="hail/onlineIndex")
	public String innerCityOnlineIndex(HttpServletRequest request,Model model){
		BaseProviderInfo providerInfo = this.getProviderDetail(request);
		if(providerInfo == null){
			return "Error500";
		}
		LOGGER.info("当前车企信息:" + GsonUtil.GsonString(providerInfo));
		Integer providerId = providerInfo.getProviderId();
		String providerName = providerInfo.getProviderName();
		long currentTime = new Date().getTime();
		model.addAttribute("currentTime", currentTime);
		model.addAttribute("providerId", providerId);
		model.addAttribute("providerName", providerName);
		String token = getToken();
		BaseUser baseUser = new BaseUser();
		String baseUserStr = (String) redisUtil.get(token);
		if (!StringUtils.isEmpty(baseUserStr)) {
			baseUser = GsonUtil.GsonToBean(baseUserStr, BaseUser.class);
		}
		//获取附近车辆数
		String url = apiUrlPrefix + AppUrlConfig.Online.INNER_CITY_ONLINE_INDEX;
		Map<String, String> params = new HashMap<String,String>();
		params = this.genReqApiData(url, params);
		String resultStr = HttpUtil.doPostReq(url, params);
		if(!StringUtil.isEmpty(resultStr)){
			ResultEntity result = GsonUtil.GsonToBean(resultStr, ResultEntity.class);
			model.addAttribute("baseProviderConfig", result.getData());
		}
		model.addAttribute("baseUser", baseUser);
		return "hail/onlineCarHome";
	}

	public Object busHistoryList(String token,String lineType) {
		String historyOrderData = HttpUtil.doGetRequest(apiUrl + AppUrlConfig.GET_HISTORY_LINE + "?token=" + token + "&lineType=" + lineType);// 历史记录
		ResultEntity resultEntity2 = GsonUtil.GsonToBean(historyOrderData, ResultEntity.class);
		if (resultEntity2.getData() != null) {
			return resultEntity2.getData();
		}
		return null;
	}

	/**
	 * 逻辑有问题 通勤
	 * 
	 * @param token
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "commuteIndex")
	public String commuteIndex(HttpServletRequest request, Model model) {
		String requestUrl = request.getRequestURL().toString();
		String token = getToken(); // state为空时，是标签间的切换，取传递过来的token，来获取用户业务类型配置
		// 获取车企所有开通业务类型
		String url = apiUrlPrefix + AppUrlConfig.GET_BUSINESS_TYPES;
		Map<String, String> paramsMap = new HashMap<String, String>();
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		LOGGER.info("commuteIndex request url@{},param@{},respose@{}", url, GsonUtil.GsonString(params), jsonResult);
		ResultEntity result = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		Map<String, Object> resultMap = (Map<String, Object>) result.getData();
		model.addAttribute("businessTypes", resultMap);
		BaseUser baseUser = new BaseUser();
		String baseUserStr = (String) redisUtil.get(this.getToken());
		if (!StringUtils.isEmpty(baseUserStr)) {
			baseUser = GsonUtil.GsonToBean(baseUserStr, BaseUser.class);
			model.addAttribute("baseUser", baseUser);
		} else {
			model.addAttribute("baseUser", baseUser);
		}
		model.addAttribute("providerId", resultMap.get("providerId"));
		if (resultMap.get("hasCommute") != null && (double) resultMap.get("hasCommute") == ConstantInfo.HAS_COMMUTE) {
			return "commuteBusIndex";
		}
		model.addAttribute("reLogin", "true");
		return "commuteBusIndex";
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "busTicketIndex")
	public String busTicketIndex(HttpServletRequest request, Model model) {
		// 获取车企所有开通业务类型
		String url = apiUrlPrefix + AppUrlConfig.GET_BUSINESS_TYPES;
		Map<String, String> paramsMap = new HashMap<String, String>();
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);

		ResultEntity result = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);

		// 获取预售时间
		String presellDayUrl = apiUrl + AppUrlConfig.BUSTICKET_PRESELL_DAY;// 历史记录
		Map<String, String> paramsMap1 = new HashMap<String, String>();
		Map<String, String> params2 = this.genReqApiData(presellDayUrl, paramsMap1);
		String jsonResult2 = HttpUtil.doPostReq(presellDayUrl, params2);
		ResultEntity resultData2 = GsonUtil.GsonToBean(jsonResult2, ResultEntity.class);
		if (resultData2 != null && resultData2.getData() != null) {
			model.addAttribute("presellDay", resultData2.getData());
		}
		Map<String, Object> resultMap = (Map<String, Object>) result.getData();
		model.addAttribute("businessTypes", resultMap);
		BaseUser baseUser = new BaseUser();
		String baseUserStr = (String) redisUtil.get(this.getToken());
		if (!StringUtils.isEmpty(baseUserStr)) {
			baseUser = GsonUtil.GsonToBean(baseUserStr, BaseUser.class);
			model.addAttribute("baseUser", baseUser);
		} else {
			model.addAttribute("baseUser", baseUser);
		}
		model.addAttribute("providerId", resultMap.get("providerId"));
		model.addAttribute("currentDateStr", DateUtils.format(new Date(), "yyyy-M-d"));
		if (resultMap.get("hasBusTicket") != null
				&& (double) resultMap.get("hasBusTicket") == ConstantInfo.HAS_COMMUTE) {
			return "busTicketHome";
		}
		model.addAttribute("reLogin", "true");
		return "busTicketHome";
	}

	/**
	 * 点击热门线路后进入到
	 * 
	 * @param request
	 * @param token
	 * @param model
	 * @param lineId
	 * @param lat
	 * @param lng
	 * @return
	 */
	@SuppressWarnings("unchecked")
	//@RequestMapping(value = "lineList", method = RequestMethod.GET)
	public String toLineList(HttpServletRequest request, String token, Model model, Integer lineId, String lat,
			String lng, String departDate, String lineName) {
		String userStr = (String) redisUtil.get(token);
		String lineType = request.getParameter("lineType");
		if(StringUtil.isEmpty(lineType)){
			lineType = LineType.BUS_LINE_TYPE;
		}
		BaseUser baseUser = GsonUtil.GsonToBean(userStr, BaseUser.class);
		if (StringUtils.isEmpty(departDate) || DateUtils.parse(departDate).getTime() < new Date().getTime()) {// 如果出发日期为空，默认为今天
			departDate = DateUtils.format(new Date(), DateUtils.DATE_FORMAT);
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
							LOGGER.error("获取token 异常:", e);
						}
					}
				}
			}
		}
		if (StringUtil.isEmpty(lineName)) {
			Cookie[] cookies = request.getCookies();
			if (cookies != null) {
				for (Cookie cookie : cookies) {
					if (cookie.getName().equals("lineName")) {
						lineName = cookie.getValue();
						try {
							lineName = URLDecoder.decode(lineName, "utf-8");
						} catch (UnsupportedEncodingException e) {
							LOGGER.error("获取lineName 异常:", e);
						}
					}
				}
			}
		}
		String requestUrl = request.getRequestURL().toString();
		String url = passengerApiUrl + AppUrlConfig.BUS_HOT_LINE_SUB_LIST + "?requestUrl=" + requestUrl + "&&lat=" + lat
				+ "&&lng=" + lng + "&&lineId=" + lineId + "&departDate=" + departDate + "&token=" + token + "&lineType=" + lineType;
		/**
		 * piggy.huang嵌入代码,需要考虑分销的标志
		 */
		String distrib = request.getParameter("distrib");
		if (StringUtils.isNotEmpty(distrib)) {
			url += "&distrib="+distrib;
			model.addAttribute("distrib", distrib);
		}
		String busData = HttpUtil.doGetRequest(url);
		ResultEntity resultEntity = GsonUtil.GsonToBean(busData, ResultEntity.class);
		if (baseUser != null) {
			model.addAttribute("providerId", baseUser.getProviderId());
		}
		
		

		if (resultEntity.getCode() == Constant.SUCCESS) {
			String baseBusData = GsonUtil.GsonString(((Map<String, Object>) resultEntity.getData()).get("baseBusList"));
			String presellDay = (String) ((Map<String, Object>) resultEntity.getData()).get("presellDay");
			String remainShowNumber = (String) ((Map<String, Object>) resultEntity.getData()).get("remainShowNumber");
			model.addAttribute("baseBusList", GsonUtil.GsonToList(baseBusData, new TypeToken<List<BaseBus>>() {
			}));
			model.addAttribute("areaSearch", ((Map<String, Object>) resultEntity.getData()).get("areaSearch"));
			model.addAttribute("presellDay", presellDay);
			model.addAttribute("remainShowNumber", Integer.parseInt(remainShowNumber));
			if (baseUser != null) {
				model.addAttribute("providerId", baseUser.getProviderId());
			}
		}
		model.addAttribute("lineName", lineName);
		model.addAttribute("lineId", lineId);
		model.addAttribute("searchFlag", LIST_FLAG_HOTLINE);
		BaseBus searchCondition = new BaseBus();
		searchCondition.setDepartDate(DateUtils.parse(departDate, DateUtils.DATE_FORMAT));
		model.addAttribute("searchCondition", searchCondition);
		model.addAttribute("currentDateStr", DateUtils.format(new Date(), DateUtils.DATE_FORMAT));
		/**
		 * piggy.huang这里需要处理一个查询线路显示日历的问题
		 * 日历数据的显示以月来处理，以当前日期为起点，查到月底的方式。
		 */
		Object calendar = ((Map<String, Object>) resultEntity.getData()).get("calendar");
		if (calendar != null) {
			model.addAttribute("calendar", GsonUtil.GsonString(calendar));			
		}
		model.addAttribute("lineType", lineType);

		if(LineType.TRAVEL_LINE_TYPE.equals(lineType)){
			return "travelLineList";
		}
		return "lineList";
	}

	/**
	 * 将请求参数转换到model中去了
	 * 
	 * @param request
	 * @param model
	 * @param paramArray
	 *            需要转换的参数数组
	 */
	public void initRequestParamToModel(HttpServletRequest request, Model model, String[] paramArray) {
		for (String param : paramArray) {
			String value = request.getParameter(param);
			model.addAttribute(param, value);
		}
	}

	/**
	 * 判断当前属于哪个业务
	 * 
	 * @param token
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("judgeBusinessIndex")
	public @ResponseBody String judgeBusinessIndex(String token, Model model, HttpServletRequest request) {
		Map<String, Object> map1 = new HashMap<String, Object>();
		map1.put("token", this.getToken());
		map1.put("requestUrl", request.getRequestURL().toString());
		String jsonString = HttpUtil.doPostRequest(apiUrl + AppUrlConfig.GET_BUSINESS_TYPES, map1);
		ResultEntity result = GsonUtil.GsonToBean(jsonString, ResultEntity.class);
		Map<String, Object> resultMap = (Map<String, Object>) result.getData();
		ResultEntity resultEntity = new ResultEntity();
		resultEntity.setCode(Constant.SUCCESS);
		resultEntity.setMessage(resultMap.get("providerId") + "");// 车企编号
		if (resultMap.get("hasBus") != null && (double) resultMap.get("hasBus") == 1) {// 大巴业务存在优先进入大巴业务
			resultEntity.setData(BUS_MODE);// 大巴车模式
		} else if (resultMap.get("hasTaxi") != null && (double) resultMap.get("hasTaxi") == 1) {
			resultEntity.setData(TAXI_MODE);// 出租车模式
		} else if (resultMap.get("interCity") != null && (double) resultMap.get("interCity") == 1) {
			resultEntity.setData(INTERCITY_MODE);// 出租车模式
		} else {
			resultEntity.setData(SAMECITY_MODE);// 出租车模式
		}
		return GsonUtil.GsonString(resultEntity);
	}

	/**
	 * 只做中转跳转
	 * 
	 * @return
	 */
	@RequestMapping(value = "businessIndex")
	public String businessIndex(HttpServletRequest request) {
		return "businessIndex";
	}

/*	// 通过code获取openId
	@Override
	public String getOpenId(String code, String providerId) {
		LOGGER.info("传递额参数,@code@{},providerId@{}", code, providerId);
		if (!StringUtil.isEmpty(code)) {
			String appid = redisUtil.getString(CacheKey.WX_APP_ID_PREFIX + providerId); // ; "wx4cc488f3ef931e9b"
			String appSecret = redisUtil.getString(CacheKey.WX_APP_SERCET_PREFIX + providerId);//
			LOGGER.info("appId@{}, appSecret@{}", appid, appSecret);
			*//*String url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + appSecret
					+ "&code=" + code + "&grant_type=authorization_code";
			String result = HttpUtil.doGetRequest(url);
			LOGGER.info("获取openId 请求地址 url@{},response@{}", url, result);
			if (!StringUtil.isEmpty(result)) {
				Map<String, String> resultMap = GsonUtil.GsonToMaps(result);
				LOGGER.info("获取到的access_token:{}", resultMap.get("access_token"));
				if (resultMap.get("openid") != null) {
					return resultMap.get("openid").toString();
				}
			}*//*
			try {
				WeChatUser weChatUser = this.commonService.getUserService().getUserAuthToken(appid, appSecret, code);
				logger.info("获取到的access_token:{}", weChatUser.getAccessToken());
				return weChatUser.getOpenId();
			} catch (WeChatErrorException ex) {
				logger.error("get open id exception = {}", ex.getMessage());
			}
		}
		return "";
	}*/

	/**
	 * 进入到评价后的页面
	 * 
	 * @param request
	 * @param orderNo
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "toComment")
	public String toComment(HttpServletRequest request, @RequestParam(name = "orderNo") String orderNo, Model model) {
		model.addAttribute("orderNo", orderNo);
		return "order/orderResult";
	}

	/**
	 * 进入到分享行程页面
	 * 
	 * @param request
	 * @param orderNo
	 * @param model
	 * @param businessType
	 * @return
	 */
	@RequestMapping("shareTrip")
	public String shareTrip(@RequestParam(name = "orderNo") String orderNo,
			Model model) {
		/*
		* 调用订单查询接口，拿到其它数据，供前端挑选
		* 目前支支持城际约车，增加 businessType字段供扩展
		* */
        Map<String, String> paramsMap = new HashMap<>();
        String[] params = orderNo.split("_");
		Byte businessType = 0;
		String nickName = "";
        if (null != params && params.length==2) {
        	orderNo = params[0];
			businessType = Byte.valueOf(params[1]);
		}
        paramsMap.put("orderNo", orderNo);

		model.addAttribute("hail", "");
		String jsonResult = "";
        if(businessType.equals(Constant.OrderType.interCity)){
			String url = apiUrl + AppUrlConfig.GET_INNERCITY_ORDER_INFO;
			jsonResult= HttpUtil.doPostReq(url, paramsMap);
		}
		if(businessType.equals(Constant.OrderType.interCityOnline)){
			String url = apiUrl + "/hail" + AppUrlConfig.GET_INNERCITY_ORDER_INFO;
			jsonResult= HttpUtil.doPostReq(url, paramsMap);
			model.addAttribute("hail", "/hail");
		}
        model.addAttribute("orderInfo", jsonResult);
        model.addAttribute("orderNo", orderNo);
		model.addAttribute("nickName", nickName);

        LOGGER.info("分享行程页面orderNo={}, businessType={}, orderInfo={}", orderNo, businessType, jsonResult);
		return "common/share-result";
	}

	@RequestMapping("MP_*.txt")
	@ResponseBody
	public String validateMpVerify(HttpServletRequest request) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("requestUrl", request.getRequestURL().toString());
		String content = HttpUtil.doPostRequest(apiUrl + VALIDATEMPVERIFY, map);
		ResultEntity result = GsonUtil.GsonToBean(content, ResultEntity.class);
		if (result.getCode() == Constant.SUCCESS) {
			return (String) result.getData();
		} else {
			return null;
		}
	}

	@RequestMapping(value = "config.js")
	public String home(HttpServletRequest request, HttpServletResponse response, Model modle) {
		try {
			modle.addAttribute("zhongjiaoAppId", zhongjiaoSubAppId + "");
			modle.addAttribute("payCenterUrl", payCenterUrl);
			modle.addAttribute("serverUrlPrefix", passengerApiUrl);
			modle.addAttribute("appId", appId + "");
			modle.addAttribute("appKey", appKey);
			modle.addAttribute("clientType", clientType);
			modle.addAttribute("pageSize", pageSize);
			modle.addAttribute("appVersion", appVersion);
			modle.addAttribute("drviceId", drviceId);
			modle.addAttribute("wechatLogin", wechatLogin);
			modle.addAttribute("websocketServerUrl", websocketServerUrl);
			modle.addAttribute("wechatAuthUrl", this.commonService.authApiConfig().baseAuthUri("APPID", "REDIRECTURL", "STATE"));
			String domainCode = getDomainCode(request.getRequestURL().toString());
			if (redisUtil.exists(CacheKey.PROVIDER_DOMAIN + domainCode)) {//
				String providerId = redisUtil.getString(CacheKey.PROVIDER_DOMAIN + domainCode);
				if (redisUtil.exists(CacheKey.PROVIDER_WECHAT_LOGIN + providerId)) {
					modle.addAttribute("loginType", 1);
				}
				if(redisUtil.exists(CacheKey.WX_APP_ID_PREFIX + providerId)){
                    String appid = (String) this.redisUtil.get(CacheKey.WX_APP_ID_PREFIX + providerId);
					modle.addAttribute("wxAppId", appid);
				}
				modle.addAttribute("currentServer", baseProviderService.getWechatSuffixUrl(Integer.parseInt(providerId)));
				String ospDomain = baseProviderService.getOspDomain(Integer.parseInt(providerId));
				if(StringUtils.isEmpty(ospDomain)){
                   ospDomain = CommonTools.getConvertDomain(ospUrl);
				}
				modle.addAttribute("adDomain",ospDomain );
			}
            /**
             * 查询用户登录信息
             */
            String token = CookieUtil.getCookieValue("token", request);
            String requestUrl = request.getRequestURL().toString();
			String url = apiUrlPrefix + "/Account/queryAccount";
			Map<String, String> params = new HashMap<String, String>();
			params.put("token", token);
			params.put("requestUrl", requestUrl);
			params = genReqApiData(request, url, params);
			String accountData = HttpUtil.doPostReq(url, params);
			ResultEntity result = GsonUtil.GsonToBean(accountData, ResultEntity.class);
			modle.addAttribute("userInfo", JSON.toJSONString(result.getData()));
			/**
			 * 查询buinessTypes
			 */
			String businessTypes = this.getBusinessTypes(null, null);
			result = GsonUtil.GsonToBean(businessTypes, ResultEntity.class);
			modle.addAttribute("businessTypes", JSON.toJSONString(result.getData()));

		} catch (Exception e) {
			LOGGER.info("config.js异常:", e);
		}
		return "common/config_js";
	}

	/**
	 * 广告相关配置
	 */
	@RequestMapping(value = "adConfig.js")
	public String adConfig(HttpServletRequest request, HttpServletResponse response, Model model) {
		String providerId = request.getParameter("providerId");
		String positionCode = request.getParameter("positionCode");
		String operatorId = request.getParameter("operatorId");
		String protocol = request.getRequestURL().toString().startsWith("https") ? "https" : "http";
		LOGGER.info("请求参数为:providerId@{},positionCode@{},protocol@{},operatorId@{},请求地址@{}", providerId, positionCode, protocol,
				operatorId,protocol);
		model.addAttribute("providerId", providerId);
		model.addAttribute("positionCode", positionCode);
		model.addAttribute("operatorId", operatorId);
		model.addAttribute("protocol", "https");
		model.addAttribute("version", (new Date()).getTime()+"");
		model.addAttribute("adDomain", baseProviderService.getOspDomain(Integer.parseInt(providerId)));
		model.addAttribute("wechatAuthUrl", this.commonService.authApiConfig().baseAuthUri("APPID", "REDIRECTURL", "STATE"));
		return "common/adConfig_js";
	}

	@RequestMapping(value = "toSettings")
	public String toSettings(String token, Model model) {
		token = this.getToken();
		ResultEntity resultEntity = new ResultEntity();
		LOGGER.info("token@{}", token);
		if (redisUtil.exists(token)) {
			String baseUserStr = redisUtil.getString(token);
			if (!StringUtils.isEmpty(baseUserStr)) {
				LOGGER.info("获取用户信息@{}", baseUserStr);
				resultEntity.setCode(Constant.SUCCESS);
				BaseUser baseUser = GsonUtil.GsonToBean(baseUserStr, BaseUser.class);
				model.addAttribute("baseUser", baseUser);
			}
		}
		return "config";
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/toNoBusinessPage")
	public String toNoBusinessPage(Model model, String type) {
		String url = apiUrlPrefix + AppUrlConfig.GET_BUSINESS_TYPES;
		Map<String, String> paramsMap = new HashMap<String, String>();
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity result = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		Map<String, Object> resultMap = (Map<String, Object>) result.getData();
		model.addAttribute("businessTypes", resultMap);
		model.addAttribute("type", type);
		return "noBusinessPage";
	}

	/**
	 * 绑定用户的openid
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "bindUserOpenId")
	public @ResponseBody String bindUserOpenId(HttpServletRequest request) {
		ResultEntity resultEntity = new ResultEntity(Constant.SUCCESS);
		String token = getToken();
		if (!StringUtils.isEmpty(token)) {
			if (redisUtil.exists(CacheKey.WX_USER_OPENID + token)) {
				String responseData = HttpUtil
						.doGetRequest(apiUrlPrefix + AppUrlConfig.BIND_USER_TOKEN + "?token=" + token);
				ResultEntity bindResult = GsonUtil.GsonToBean(responseData, ResultEntity.class);
				return GsonUtil.GsonString(bindResult);
			}
		}
		return GsonUtil.GsonString(resultEntity);
	}

	@RequestMapping(value = "/getBusinessTypes")
	@ResponseBody
	public String getBusinessTypes(Model model, String type) {
		String url = apiUrlPrefix + AppUrlConfig.GET_BUSINESS_TYPES;
		Map<String, String> paramsMap = new HashMap<String, String>();
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		return jsonResult;
	}

	@RequestMapping(value = "/wxUserInfo")
	@ResponseBody
	public String getWxUserInfo() throws UnsupportedEncodingException {
		ResultEntity resultEntity = new ResultEntity(Constant.SUCCESS);
		String token = this.getToken();
		String openId = null;
		String accessToken = getAccessToken();
		if (redisUtil.exists(CacheKey.WX_USER_OPENID + token)
				&& redisUtil.get(CacheKey.WX_USER_OPENID + token) != null) {
			openId = (String) redisUtil.get(CacheKey.WX_USER_OPENID + token);
		}
		LOGGER.info("获取到的access_token@{}", accessToken);
		LOGGER.info("获取到的openId@{}", openId);
		/*String infoUrl = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=" + accessToken + "&openid=" + openId
				+ "&lang=zh_CN";
		String result = HttpUtil.doGetRequest(infoUrl);
		LOGGER.info("request token url@{},response@{}", GsonUtil.GsonString(result));
		if (!StringUtil.isEmpty(result)) {
			LOGGER.info("获取微信的用户信息001====={}",result);
			*//**
			 * piggy.huang获取微信资料的时候是不需要进行UTF-8编码
			 *//*
			//result = new String(result.getBytes("ISO-8859-1"), "UTF-8");
			LOGGER.info("获取微信的用户信息[编码后]002====={}",result);
			WeixinUserInfo weixinUserInfo = GsonUtil.GsonToBean(result, WeixinUserInfo.class);
			LOGGER.info("获取微信的用户信息[转换成对象后]003====={}",GsonUtil.GsonString(weixinUserInfo));
			Map<String, Object> resultMap = new HashMap<String, Object>();
			if (weixinUserInfo != null) {
				if (weixinUserInfo.getNickname() == null || "".equals(weixinUserInfo.getNickname())) {
					LOGGER.info("用户已取消关注");
					resultEntity.setCode(1);
				} else {
					resultMap.put("nickname", weixinUserInfo.getNickname());
					resultMap.put("sex", weixinUserInfo.getSex());
					resultMap.put("headimgurl", weixinUserInfo.getHeadimgurl());
					resultMap.put("openid", weixinUserInfo.getOpenid());
					resultMap.put("subscribe", weixinUserInfo.getSubscribe());
					String url = apiUrlPrefix + AppUrlConfig.UPDATE_USER_INFO;
					resultMap.put("token", token);
					String jsonResult = HttpUtil.doPostRequest(url, resultMap);
					if (StringUtils.isEmpty(jsonResult)) {
						return ResultEntity.setFailJson("请求服务器超时");
					}
					resultEntity = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
					return GsonUtil.GsonString(resultEntity);
				}
			} else {
				resultEntity.setCode(1);
				LOGGER.info("用户已取消关注");
			}
		}*/
		try {
			WeChatUser weChatUser = this.commonService.getUserService().userInfo(openId,null, accessToken);
			LOGGER.info("获取微信的用户信息====={}",JSON.toJSONString(weChatUser));
			Map<String, Object> resultMap = new HashMap<String, Object>();
			if (!StringUtils.isEmpty(weChatUser.getOpenId())) {
				if (weChatUser.getNickname() == null || "".equals(weChatUser.getNickname())) {
					LOGGER.info("用户已取消关注");
					resultEntity.setCode(1);
				} else {
					resultMap.put("nickname", weChatUser.getNickname());
					resultMap.put("sex", weChatUser.getSex());
					resultMap.put("headimgurl", weChatUser.getHeadImgUrl());
					resultMap.put("openid", weChatUser.getOpenId());
					resultMap.put("subscribe", weChatUser.getSubscribe());
					String url = apiUrlPrefix + AppUrlConfig.UPDATE_USER_INFO;
					resultMap.put("token", token);
					String jsonResult = HttpUtil.doPostRequest(url, resultMap);
					if (StringUtils.isEmpty(jsonResult)) {
						return ResultEntity.setFailJson("请求服务器超时");
					}
					resultEntity = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
					return GsonUtil.GsonString(resultEntity);
				}
			} else {
				resultEntity.setCode(1);
				LOGGER.info("用户已取消关注");
			}
		} catch (WeChatErrorException ex) {
			logger.error("get open id exception = {}", ex.getMessage());
		}
		return GsonUtil.GsonString(resultEntity);
	}

	public String getAccessToken() {
		String token = this.getToken();
		String baseUserStr = (String) redisUtil.get(token);
		BaseUser baseUser = GsonUtil.GsonToBean(baseUserStr, BaseUser.class);
		String appid = redisUtil.getString(CacheKey.WX_APP_ID_PREFIX + baseUser.getProviderId());
		String appSecret = redisUtil.getString(CacheKey.WX_APP_SERCET_PREFIX + baseUser.getProviderId());
		WeChatConfigInfo configInfo = new WeChatConfigInfo();
		configInfo.setAppID(appid);
		configInfo.setSecret(appSecret);
		configInfo.setWechatServerURL(wechatServerURL);
		WeChatLocalInfoHolder.setLocalInfo(configInfo);
		String accessToken = "";
		try {
			accessToken = wechatCommonService.getAccessToken();
		} catch (WeChatErrorException e) {
			LOGGER.error("获取微信accessToken异常:", e);
		}
		return accessToken;
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "lineListJson", method = RequestMethod.GET)
	@ResponseBody
	public String toLineListJson(HttpServletRequest request, String token, Model model, Integer lineId, String lat,
			String lng, String departDate, String lineName) {
		getLineList(request,token,model,lineId,lat,lng,departDate,lineName);
		return ResultEntity.setSuccessJson(model.asMap());
	}
	
	/**
	 * 写一个通用的获取线路详情的方法，只是外面包一个返回页面或返回JSON数据
	 */
	@SuppressWarnings("unchecked")
	private String getLineList(HttpServletRequest request, String token, Model model, Integer lineId, String lat,
			String lng, String departDate, String lineName) {
		String userStr = (String) redisUtil.get(token);
		String lineType = request.getParameter("lineType");
		if(StringUtil.isEmpty(lineType)){
			lineType = LineType.BUS_LINE_TYPE;
		}
		BaseUser baseUser = GsonUtil.GsonToBean(userStr, BaseUser.class);
		if (StringUtils.isEmpty(departDate) || DateUtils.parse(departDate).getTime() < new Date().getTime()) {// 如果出发日期为空，默认为今天
			departDate = DateUtils.format(new Date(), DateUtils.DATE_FORMAT);
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
							LOGGER.error("获取token 异常:", e);
						}
					}
				}
			}
		}
		if (StringUtil.isEmpty(lineName)) {
			Cookie[] cookies = request.getCookies();
			if (cookies != null) {
				for (Cookie cookie : cookies) {
					if (cookie.getName().equals("lineName")) {
						lineName = cookie.getValue();
						try {
							lineName = URLDecoder.decode(lineName, "utf-8");
						} catch (UnsupportedEncodingException e) {
							LOGGER.error("获取lineName 异常:", e);
						}
					}
				}
			}
		}
		String requestUrl = request.getRequestURL().toString();
		String url = passengerApiUrl + AppUrlConfig.BUS_HOT_LINE_SUB_LIST + "?requestUrl=" + requestUrl + "&&lat=" + lat
				+ "&&lng=" + lng + "&&lineId=" + lineId + "&departDate=" + departDate + "&token=" + token + "&lineType=" + lineType;
		/**
		 * piggy.huang嵌入代码,需要考虑分销的标志
		 */
		String distrib = request.getParameter("distrib");
		if (StringUtils.isNotEmpty(distrib)) {
			url += "&distrib="+distrib;
			model.addAttribute("distrib", distrib);
		}
		String busData = HttpUtil.doGetRequest(url);
		ResultEntity resultEntity = GsonUtil.GsonToBean(busData, ResultEntity.class);
		if (baseUser != null) {
			model.addAttribute("providerId", baseUser.getProviderId());
		}
		
		if (resultEntity!=null && resultEntity.getCode() == Constant.SUCCESS) {
			String baseBusData = GsonUtil.GsonString(((Map<String, Object>) resultEntity.getData()).get("baseBusList"));
			String presellDay = (String) ((Map<String, Object>) resultEntity.getData()).get("presellDay");
			String remainShowNumber = (String) ((Map<String, Object>) resultEntity.getData()).get("remainShowNumber");
			model.addAttribute("baseBusList", GsonUtil.GsonToList(baseBusData, new TypeToken<List<BaseBus>>() {
			}));
			model.addAttribute("areaSearch", ((Map<String, Object>) resultEntity.getData()).get("areaSearch"));
			model.addAttribute("presellDay", presellDay);
			model.addAttribute("remainShowNumber", Integer.parseInt(remainShowNumber));
			if (baseUser != null) {
				model.addAttribute("providerId", baseUser.getProviderId());
			}
		}
		model.addAttribute("lineName", lineName);
		model.addAttribute("lineId", lineId);
		model.addAttribute("searchFlag", LIST_FLAG_HOTLINE);
		BaseBus searchCondition = new BaseBus();
		searchCondition.setDepartDate(DateUtils.parse(departDate, DateUtils.DATE_FORMAT));
		model.addAttribute("searchCondition", searchCondition);
		model.addAttribute("currentDateStr", DateUtils.format(new Date(), DateUtils.DATE_FORMAT));
		/**
		 * piggy.huang这里需要处理一个查询线路显示日历的问题
		 * 日历数据的显示以月来处理，以当前日期为起点，查到月底的方式。
		 */
		Object calendar = ((Map<String, Object>) resultEntity.getData()).get("calendar");
		if (calendar != null) {
			model.addAttribute("calendar", GsonUtil.GsonString(calendar));			
		}
		model.addAttribute("lineType", lineType);
		
		return lineType;
	}
	
	/**
	 * 点击热门线路后进入到H5页面，以前是走freemarker的，
	 * 现在走另一条方式，先把代码保留好，以后备用了。
	 * 
	 * @param request
	 * @param token
	 * @param model
	 * @param lineId
	 * @param lat
	 * @param lng
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "lineList", method = RequestMethod.GET)
	public String toLineListH5(HttpServletRequest request,
                               HttpServletResponse response,
                               String token,
                               Model model,
                               Integer lineId,
                               String lat,
                               String lng,
                               String departDate,
                               String lineName) {
		String lineType = request.getParameter("lineType");
		if(StringUtil.isEmpty(lineType)){
			lineType = LineType.BUS_LINE_TYPE;
		}
		Map<String, String> paraMap = this.getRequestParams();
		if (paraMap.containsKey("isLoad") && !LineType.BUS_LINE_TYPE.equals(lineType)) {
			return "/h5/lineList";
		}
		BaseProviderInfo provider = this.getProviderDetail(request);
		if (provider!=null) {
			paraMap.put("providerId", String.valueOf(provider.getProviderId()));
		}
		paraMap.put("isLoad","1");
		paraMap.put("lineType",lineType);
		String paramStr = this.genParamStr(paraMap);
		String url = "";
		if(LineType.BUS_LINE_TYPE.equals(lineType)){
			//定制班线条新页面
			url = "/cityBus/lineListCityBus"+paramStr;
		}else{
			url = "/lineList" + paramStr;
		}
		return this.commonRedirect(request, response, url);
	}
}
