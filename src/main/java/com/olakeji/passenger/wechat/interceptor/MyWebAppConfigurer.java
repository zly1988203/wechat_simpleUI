package com.olakeji.passenger.wechat.interceptor;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 *
 * 拦截器 针对分销加些白名单
 *
 */
@Configuration
public class MyWebAppConfigurer
        extends WebMvcConfigurerAdapter {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/passenger/**").addResourceLocations("classpath:/passenger/");
        registry.addResourceHandler("/distribution/**").addResourceLocations("classpath:/distribution/");
        registry.addResourceHandler("/bus/h5/**").addResourceLocations("classpath:/bus/h5/");
        registry.addResourceHandler("/commute/**").addResourceLocations("classpath:/commute/");
        registry.addResourceHandler("/conclusion-2018/**").addResourceLocations("classpath:/conclusion-2018/");
        super.addResourceHandlers(registry);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new RemoteOrignVisitInterceptor()).addPathPatterns("/**");
        registry.addInterceptor(new WechatAutoAuthorizedInterceptor()).addPathPatterns("/index","/busIndex", "/charteredCarIndex","/travelIndex","/commuteIndex","/busTicketIndex","/onlineIndex","/interCityIndex","/hail/onlineIndex","/hail/interCityIndex","/cityBus/lineListCityBus","/cityBus/myTripList","/commutingBus/searchLineResult");
        registry.addInterceptor(new UserSecurityInterceptor()).addPathPatterns("/**").excludePathPatterns("/config.js", "/wechatserver/*", "/MP_*.txt", "/invite/*","/v2/registerResult","/shareTrip","/wechatOsp/getOpenId","/wechatOsp/setCookie","/wechatOsp/activityToOsp","/index","/innerCity/order/queryIfHasUnfinishedOrder","/error"
                ,"/busline/getCitys","/adConfig.js","/judgeBusinessIndex","/businessIndex","/busIndex","/busLine/searchBus","/busline/judegLineDetail","/lineList","/commuteLine/searchCommute","/commuteList/hotLineList","commutingBus/searchLineResult","/commuteIndex","/bus/toQrcodePay","/qrcode/getPrepayInfo","/qrcode/toPaySuccess","/qrcode/failure","/qrcForLine/lineList",
                "/bus/toInnerCityQrcodePay","/bus/toInnerCityQrcodeWXPay","/bus/toInnerCityQrcodeOrderPay","/innerCity/qrcode/toPaySuccess","/bus/getInnerCityQrcodeOrderPrepayInfo","/innerCity/qrcode/toPayFail","/wechatLoginIndex","/buyActivity/activityDetail","/activityLine/activityLineList","/bindUserOpenId","/busTicketIndex","/busTicketIndex","/busTicketIndex","/busTicket/getStation","/busTicket/getCitys","/busTicket/getLineList","/busTicket/queryLineList","/getBusinessTypes","/innerCity/reminder"
                ,"/busline/getAreas","/activity/require/line","/activity/require/*","/activityRecom/queryIfHasActivity","/Config/reminder","/innerCity/judgeService","/innerCity/queryIfOpenModel","/innerCity/getCitys","/travel/travelLineInfo","/travelIndex","/onlineIndex","/baseOnlineCar/**","/onlineTrip/checkUnfinishedTripAndOrder","/onlineTrip/tripPrice","/baseOnlineCar/share","/distrib/bindUser","/lineListJson","/busLine/searchBusJson",
                "/wechat/checkWechatAutoLogin","/wechat/autoLogin","/login","/regOrLogin","/selectionLogin","/Error500","/innerCity/areaLocation","/coupon/select","/wechat/activity_split_coupon/index","/conclusion2018/","/distrib/","/onlineIndex","/interCityIndex","/hail/onlineIndex","/hail/interCityIndex","/sameSale/toAttMainPage1","/sameSale/toAttMainPage", "/busTicketOrder/check", "/busTicketOrder/getInvoiceLink","/cityBus/lineListCityBus","/cityBus/myTripList","/commutingBus/searchLineResult");
    }
}

