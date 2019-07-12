package com.olakeji.passenger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
        "com.olakeji.passenger.wechat.init",
        "com.olakeji.passenger.wechat.interceptor",
        "com.olakeji.passenger.wechat.utils",
        "com.olakeji.passenger.wechat.config",
        "com.olakeji.passenger.wechat.exceptionHandler",
        "com.olakeji.cache",
        "com.olakeji.common.wechat.api",
        "com.olakeji.passenger.wechat.controller.busline",
        "com.olakeji.passenger.mock",
        "com.olakeji.passenger.wechat.controller",
        "com.olakeji.passenger.wechat.service"
})
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
