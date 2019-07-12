package com.olakeji.passenger.wechat.busTicket;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

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
import com.olakeji.tsp.common.Constant;

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

    /**
     * 查询日历
     * @throws Exception 
     */
    @Test
    public void calandarList() throws Exception {
    	this.reqMap.clear();
    	this.reqMap.put("token","eG01ODAxYzRGQWxQbWJlUFFGcFdkWUNaMHR0ejBqb3FxLzJVTXlrbktrVVo");
    	this.reqMap.put("requestUrl", "http://xinxin.ssssss.com");
    	this.reqMap.put("departPid", "440300");
    	this.reqMap.put("arrivePid", "440100");
    	this.reqMap.put("departStation", "不限");
    	this.reqMap.put("arriveStation", "不限");
    	this.reqMap.put("departDate", "2018-08-23");
    	baseService.performPassengerApi("/busTicket/calendarList", this.reqMap);
    }
        
}
