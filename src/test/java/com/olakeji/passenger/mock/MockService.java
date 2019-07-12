package com.olakeji.passenger.mock;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.servlet.http.Cookie;

import com.olakeji.passenger.wechat.service.provider.BaseProviderService;
import org.hamcrest.Matchers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.util.CollectionUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.context.WebApplicationContext;

import com.olakeji.cache.RedisUtil;
import com.olakeji.common.wechat.api.WeChatCommonService;
import com.olakeji.tsp.constant.AppContants;
import com.olakeji.tsp.constant.ConstantInfo;
import com.olakeji.tsp.utils.ApiHelper;
import com.olakeji.tsp.utils.HttpUtil;

@Service
public class MockService {
	private Logger logger = LoggerFactory.getLogger(MockService.class);
	
	@Value("${passenger.api.url}")
	public String apiUrl;
	@Autowired
	public RedisUtil redisUtil;
	@Autowired
	public WeChatCommonService wechatCommonService;
	@Value("${wechat.server.url}")
	public String wechatServerURL;
	@Value("${app.id}")
	public String appId;
	@Value("${app.key}")
	public String appKey;
	@Value("${client.type}")
	public Integer clientType;
	@Value("${page.size}")
	public Integer pageSize;
	@Value("${app.version}")
	public Double appVersion;
	@Value("${device_id}")
	public String drviceId;
	@Value("${wechatlogin}")
	public String wechatLogin;
	@Value("${pay.server.url}")
	public String payCenterUrl;
	@Value("${websocket.server.url}")
	public String websocketServerUrl;
	/**
	 * 代表什么模式
	 */
	@Value("${mode}")
	public String mode;
	@Value("${webapi.amap}")
	public String mapApiKey;
	@Value("${adDomainCode}")
	public String adDomainCode;
	/**
	 * 中交appId
	 */
	@Value("${zhongjiao.APP_ID}")
	public String zhongjiaoAppId;
	@Value("${zhongjiao.sub_app_id}")
	public String zhongjiaoSubAppId;
	
	private String token = "NGN6d0loZXhzNGl5R0p4Z1ZvTHM1cGZXS0RybUs4SUVjdW1Zd2tOT1hYRkY";
	
    private Cookie[] cookies;
	@Autowired
	private BaseProviderService baseProviderService;
	@Autowired
    private WebApplicationContext context;
    private MockMvc mvc;
	
	public void initData() {
        mvc = MockMvcBuilders.webAppContextSetup(context).build();//建议使用这种
        List<Cookie> cooks = this.genCookies();
        this.cookies = new Cookie[cooks.size()];
        for(int i=0; i<cooks.size(); i++) {
        	this.cookies[i] = cooks.get(i);
        }
	}
	
	/**
	 * 获取TOKEN值
	 */
	public String getWebToken(Integer userId) {
		this.token = redisUtil.getString(ConstantInfo.CLIENT_TYPE.WEB+"-"+userId.toString());
		return this.token;
	}
	
	public Map<String, String> genCommonParam() {
		Map<String,String> commonParam = new HashMap<String,String>();
		commonParam.put("clientType", this.clientType.toString());
		commonParam.put("appId", this.appId);
		commonParam.put("token", this.token);
		commonParam.put("appVersion", this.appVersion.toString());
		commonParam.put("deviceId", this.drviceId);
		commonParam.put("wechatLogin", this.wechatLogin);
		
		return commonParam;
	}

	public List<Cookie> genCookies() {
		Map<String,String> commonParam = this.genCommonParam();
		List<Cookie> cookies = new ArrayList<Cookie>();
		commonParam.forEach((k,v)-> {
			Cookie cookie = new Cookie(k,v);
			cookies.add(cookie);
		});		
		return cookies;
	}
	
	/**
	 * 生成验签接口
	 * @param url
	 * @param params
	 * @return
	 */
	public Map<String, String> genReqApiData(String url, Map<String, String> params) {
		Map<String,String> paramMap = new HashMap<String,String>();
		paramMap.putAll(this.genCommonParam());
		paramMap.putAll(params);
		paramMap.remove("sign");
		// generate sign;
		String host = url.substring(url.indexOf("//") + 2);
		String checkSign = "";
		try {
			checkSign = ApiHelper.genSig(host, paramMap, this.appKey);
		} catch (NoSuchAlgorithmException e) {
			logger.info("generate decode error");
		}
		paramMap.put("sign", checkSign);
		return paramMap;
	}
	
    /**
     * 本地URL请求
     * @param url
     * @param param
     * @throws Exception
     */
	public void performUrl(String url, Map<String,String> param) throws Exception {
    	logger.info(""+System.currentTimeMillis());
    	MultiValueMap<String,String> mvcParam = new LinkedMultiValueMap<String,String>();
    	if (!CollectionUtils.isEmpty(param)) {
        	param.forEach((k,v)-> {
        		mvcParam.add(k, v);
        	});
    	}
        mvc.perform(MockMvcRequestBuilders.post(url)
        		.cookie(this.cookies)
        		.params(mvcParam)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.content().string(Matchers.containsString("SUCCESS")));
        logger.info(""+System.currentTimeMillis());
	}
	public void perform(String url, Map<String,String> param) throws Exception {
    	String currUrl = "http://xinxin"+baseProviderService.getCacheByDomain("xinxin")+url;
    	this.performUrl(currUrl, param);
    }
    
    /**
     * passenger api url请求
     * @param url
     * @param param
     * @throws Exception
     */
    public String performPassengerApi(String url, Map<String,String> param) throws Exception {
    	logger.info(""+System.currentTimeMillis());
    	String apiUrl = this.apiUrl+url;
    	Map<String, String> apiParam = this.genReqApiData(apiUrl, param);
    	Map<String, Object> mvcParam = new HashMap<String,Object>();
    	if (!CollectionUtils.isEmpty(apiParam)) {
        	apiParam.forEach((k,v)-> {
        		mvcParam.put(k, v);
        	});
        	
    	}
        String result = HttpUtil.doPostRequest(apiUrl, mvcParam);
        logger.info("{},{}",result,System.currentTimeMillis()); 
        return result;
    }
}
