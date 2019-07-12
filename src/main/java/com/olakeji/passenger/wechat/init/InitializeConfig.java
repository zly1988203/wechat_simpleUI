package com.olakeji.passenger.wechat.init;

import com.olakeji.cache.RedisUtil;
import com.olakeji.common.wechat.api.WeChatCommonService;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * @program: TSP_parent
 * @description: ${description}
 * @author: piggy.huang
 * @create: 2019-06-05 19:58
 **/
@Component
public class InitializeConfig implements ApplicationContextAware {

    @Autowired
    private WeChatCommonService weChatCommonService;

    @Autowired
    private RedisUtil redisUtil;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        weChatCommonService.cacheService().redisCache(redisUtil.getRedisTemplate());
    }
}
