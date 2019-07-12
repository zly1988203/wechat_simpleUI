package com.olakeji.passenger.wechat.osp;

import com.alibaba.fastjson.JSON;
import com.olakeji.cache.RedisUtil;
import com.olakeji.common.wechat.api.WeChatCommonService;
import com.olakeji.common.wechat.bean.user.WeChatUser;
import com.olakeji.passenger.Application;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

/**
 * @program: wechat_parent
 * @description: ${description}
 * @author: piggy.huang
 * @create: 2019-06-19 17:32
 **/

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)//这里的Application是springboot的启动类名。
@WebAppConfiguration
public class OspTest {
    @Autowired
    private RedisUtil redisUtil;

    @Autowired
    private WeChatCommonService commonService;

    @Test
    public  void test() throws Exception {
        commonService.cacheService().redisCache(redisUtil.getRedisTemplate());

        //wx55a6247bbbcc41bc&secret=376f5984d5379bb33c877de196ee170d&code=011tqJwI0Hh7Ne2Ot4yI0gRGwI0tqJwP&grant_type=authorization_code
        WeChatUser user = commonService.getUserService().getUserAuthToken("wx55a6247bbbcc41bc", "376f5984d5379bb33c877de196ee170d", "011tqJwI0Hh7Ne2Ot4yI0gRGwI0tqJwP");

        user = commonService.getUserService().userAuthInfo(user.getOpenId(), user.getAccessToken());

        System.out.println(JSON.toJSONString(user));
    }
}
