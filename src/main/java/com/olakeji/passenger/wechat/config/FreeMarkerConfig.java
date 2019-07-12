package com.olakeji.passenger.wechat.config;

import com.olakeji.tsp.utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

/**
 * @program: TSP_parent
 * @description: ${description}
 * @author: piggy.huang
 * @create: 2019-03-19 12:32
 **/
@Configuration
public class FreeMarkerConfig {

    @Autowired
    private freemarker.template.Configuration configuration;
    // Spring 初始化的时候加载配置
    @PostConstruct
    public void setConfigure() throws Exception {
        // 增加版本号
        configuration.setSharedVariable("version", DateUtils.unixTimestampToDate(System.currentTimeMillis(), DateUtils.DATE_ALL_STR));
    }
}
