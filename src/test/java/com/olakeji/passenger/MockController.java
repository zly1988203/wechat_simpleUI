package com.olakeji.passenger;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;

import com.alibaba.fastjson.JSON;
import com.olakeji.cache.RedisUtil;
import com.olakeji.common.wechat.api.WeChatCommonService;
import com.olakeji.common.wechat.bean.user.WeChatUser;
import com.olakeji.tsp.cache.CacheKey;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.olakeji.passenger.mock.MockService;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.entity.BaseUser;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)//这里的Application是springboot的启动类名。
@WebAppConfiguration
public class MockController {
	private final Logger LOGGER = LoggerFactory.getLogger(MockController.class);

	@Autowired
    private WebApplicationContext context;
    private MockMvc mvc;
    
    @Autowired
    private MockService baseService;

    @Autowired
	private RedisUtil redisUtil;

    @Autowired
	private WeChatCommonService commonService;
    
    Map<String,String> reqMap = new HashMap<String,String>();
    
    @Before
    public void setUp() throws Exception {
        baseService.initData();
    }
    
    //@Test
    public void ConfigJs() throws Exception {
    	baseService.perform("/index", null);
    }
    
    //@Test
    public void GetCity() throws Exception {
    	this.reqMap.clear();
    	this.reqMap.put("type", "1");
    	
    	baseService.perform("/innerCity/getCitys", this.reqMap);
    }
    
    //@Test
    public void SetTrip() throws Exception {
    	this.reqMap.clear();
    	this.reqMap.put("orderNo", "1221533710660757215522");
    	this.reqMap.put("status", "4");
    	
    	baseService.performPassengerApi("/test/setTrip", this.reqMap);
    }
    
    @Test
    public void SetGps() throws Exception {
    	
    	//SetTrip();
    	
    	BigDecimal lat = new BigDecimal(22.568908);
    	BigDecimal lng = new BigDecimal(113.870711);

    	this.reqMap.clear();
    	this.reqMap.put("driverId", "4792");
    	this.reqMap.put("orderNo", "1221533710660757215522");
    	this.reqMap.put("lat", lat.setScale(8,BigDecimal.ROUND_HALF_UP).toString());
    	this.reqMap.put("lng", lng.setScale(8,BigDecimal.ROUND_HALF_UP).toString());
    	
    	while (true) {    		    		
        	baseService.performPassengerApi("/test/setGriverGps", this.reqMap);
        	
        	Thread.sleep(5000);
        	
        	Random rnd = new Random();
        	int n = rnd.nextInt(3) + 1;
        	lat = lat.add(new BigDecimal(0.001*n));
        	n = rnd.nextInt(3) + 1;
        	lng = lng.add(new BigDecimal(0.001*n));
        	
        	this.reqMap.put("lat", lat.setScale(6,BigDecimal.ROUND_HALF_UP).toString());
        	this.reqMap.put("lng", lng.setScale(6,BigDecimal.ROUND_HALF_UP).toString());
    	}
    }
    
    @Test
    public void checkAutoWechatLogin() {
    	this.reqMap.clear();
    	this.reqMap.put("providerId", "194");
    	this.reqMap.put("clientType", "4");
    	this.reqMap.put("openId", "olzjOwFGhTzxRpPKevEKURxDQbk0");
    	
    	try {
			String resultstr = baseService.performPassengerApi(AppUrlConfig.AutoLogin.WECHAT_AUTO_LOGIN, this.reqMap);
			ResultEntity result = GsonUtil.GsonToBean(resultstr, ResultEntity.class);
			if (result.getCode()==Constant.SUCCESS) {
				if (result.getData() instanceof Map) {
					Map<String, Object> data = (Map<String, Object>)result.getData();
					String token = data.get("token").toString();
					String userstr = GsonUtil.GsonString(data.get("user"));
					BaseUser baseUser = GsonUtil.GsonToBean(userstr, BaseUser.class);
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }

    @Test
	public void SetZjcqpCache() {
		redisUtil.set(CacheKey.WX_APP_ID_PREFIX+508, "wxe80a591cbca9bb4d"); //redisUtil.getString(CacheKey.WX_APP_ID_PREFIX+providerId);//车企的appId ; "wx4cc488f3ef931e9b"
		redisUtil.set(CacheKey.WX_APP_SERCET_PREFIX+508, "64cb9a33af08648f5b16d25a49aaf545");//;//车企的秘钥  "907813991033958efc507dde7b1b3523"
	}

	@Test
	public void testSnsToken() {
    	String appId = "wx55a6247bbbcc41bc", appSecret="376f5984d5379bb33c877de196ee170d",code="0114Dmbn1Ohjdr00jSbn1DUnbn14Dmb8";
    	try {
			WeChatUser user = this.commonService.getUserService().getUserAuthToken(appId, appSecret, code);
			LOGGER.info(JSON.toJSONString(user));
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		}
	}
}
