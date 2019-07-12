package com.olakeji.passenger.wechat.commute;

import javax.annotation.Resource;

import org.junit.Before;
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

    @Before
    public void setUp() throws Exception {
        mvc = MockMvcBuilders.webAppContextSetup(context).build();//建议使用这种
    }
}
