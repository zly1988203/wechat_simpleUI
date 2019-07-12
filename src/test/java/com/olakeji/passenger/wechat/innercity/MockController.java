package com.olakeji.passenger.wechat.innercity;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.beanutils.BeanUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.olakeji.passenger.Application;
import com.olakeji.passenger.mock.MockService;
import com.olakeji.passenger.wechat.innercity.param.StationParam;
import com.olakeji.tsp.utils.GsonUtil;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)//这里的Application是springboot的启动类名。
@WebAppConfiguration
public class MockController {
	private final Logger LOGGER = LoggerFactory.getLogger(MockController.class);
	
	@Autowired
    private WebApplicationContext context;
    private MockMvc mvc;
    
    @Resource
    private MockService baseService;
    
    Map<String,String> reqMap = new HashMap<String,String>();

    @Before
    public void setUp() throws Exception {
        mvc = MockMvcBuilders.webAppContextSetup(context).build();//建议使用这种
    }
    
    @Test
    public void cancelOrder() throws Exception {
    	this.reqMap.clear();
        this.reqMap.put("orderNo", "1221533808077462252732");
    	
        baseService.performPassengerApi("/innerCity/order/refund", this.reqMap);
    }
    
    @Test
    public void getOrderInfo() throws Exception {
        this.reqMap.clear();
        this.reqMap.put("orderNo", "122153416324825812700659");
        
        baseService.performPassengerApi("/innerCity/orderDetail/getOrderInfo", this.reqMap);
    }
    
    @Test
    public void queryRegions() throws Exception {
        this.reqMap.clear();
        StationParam param = new StationParam();
        param.setDepartAreaCode(0);
        param.setDepartLng(BigDecimal.valueOf(111.123423));
        param.setDepartLat(BigDecimal.valueOf(23.23423));
        param.setDepartTitle("");
        param.setSearchFlag(1);
        param.setRequestUrl("http://xinxin.com");
        Map map = BeanUtils.describe(param);
        map.remove("class");
        this.reqMap.putAll(map);
        
        baseService.performPassengerApi("/innerCity/optimize/queryRegions", this.reqMap);
    }
    
    @Test
    public void getRegionLineArea() throws Exception {
    	this.reqMap.clear();
    	this.reqMap.put("regionId", "1273");
        this.reqMap.put("stationType", "2");
        this.reqMap.put("requestUrl","http://xinxin.com");
        
        baseService.performPassengerApi("/innerCity/optimize/getRegionLineArea", this.reqMap);
    }
    
    @Test
    public void queryNewestOrder() throws Exception {
    	this.reqMap.clear();
        this.reqMap.put("requestUrl","http://xinxin.com");
        
        baseService.performPassengerApi("/innerCity/optimize/queryNewestOrder", this.reqMap);
    }
    
    @Test
    public void recommendTrip() throws Exception {
    	this.reqMap.clear();
        this.reqMap.put("requestUrl","http://xinxin.com");
        
        baseService.performPassengerApi("/innerCity/optimize/recommendTrip", this.reqMap);
    }

    @Test
    public void getGps() throws Exception {
        this.reqMap.clear();
        this.reqMap.put("requestUrl","http://passwechat.com");
        this.reqMap.put("tripNo","222222");
        this.reqMap.put("driverId", 100+"");

        baseService.performPassengerApi("/innerCity/getDriverCurrGps", this.reqMap);
    }
}
