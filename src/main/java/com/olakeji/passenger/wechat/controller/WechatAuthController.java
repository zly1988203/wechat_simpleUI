package com.olakeji.passenger.wechat.controller;

import com.olakeji.cache.RedisUtil;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.entity.BaseUser;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.passenger.wechat.utils.WechatUtils;
import com.olakeji.tsp.cache.CacheKey;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.constant.ConstantInfo;
import com.olakeji.tsp.utils.GsonUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

/**
 * 用来做微信认证的
 *
 * @author Administrator
 */
@Controller
@RequestMapping(value = "/wechat")
public class WechatAuthController extends BaseController {
    @Autowired
    private RedisUtil redisUtil;
    @Value("${app.id}")
    protected Integer appId;
    @Value("${client.type}")
    private Integer clientType;
    @Value("${app.version}")
    private Double appVersion;
    @Value("${device_id}")
    private String drviceId;
    @Value("${wechatlogin}")
    private String wechatLogin;

    private final Integer TOKEN_EXPIRES = 24 * 60 * 60 * 30;
    private final Integer FAKE_TOKEN_EXPIRES = 12 * 60 * 60;

    /**
     * @param request
     * @return
     */
    @RequestMapping(value = "checkWechatAutoLogin")
    public String checkWechatAutoLogin(HttpServletRequest request, HttpServletResponse response) {
        String code = request.getParameter("code");
        String state = request.getParameter("state");
        logger.info("check wechat auto login params = @{}", state);
        if (StringUtils.isNotEmpty(state) && state.indexOf("uuid-")>=0) {
            String key = state;
            state = (String)redisUtil.get(key);
            logger.info("check wechat auto login state = @{}", state);
            redisUtil.remove(key);
        }
        String[] params = state.split("_");
        String providerIdStr = params[0];
        String redirectUrl = params[1];
        String isToLogin = "";
        if (params.length>2) {
            isToLogin = params[2];
        }
        if (StringUtils.isEmpty(isToLogin)) {
            isToLogin = "1";
        }

        try {
            int checkWechatAutoLogin = 0;
            Double providerId = Double.valueOf(providerIdStr);
            // 用户的openid
            String openId = getOpenId(code, String.valueOf(providerId.intValue()));
            logger.info("WechatAuthController openid ==== {}", openId );
            if (!StringUtils.isEmpty(openId)) {
                Map<String, String> paramMap = new HashMap<String, String>();
                paramMap.put("openId", openId);
                paramMap.put("providerId", providerId.intValue() + "");
                paramMap.put("clientType", this.clientType.toString());
                String url = apiUrlPrefix + AppUrlConfig.AutoLogin.WECHAT_AUTO_LOGIN;
                Map<String, String> postParams = this.genReqApiData(url, paramMap);
                String responseData = HttpUtil.doPostReq(url, postParams);
                ResultEntity result = GsonUtil.GsonToBean(responseData, ResultEntity.class);
                logger.info("check auto login result = {}", responseData);
                if (result.getCode() == Constant.SUCCESS.intValue()) {
                    if (result.getData() instanceof Map) {
                        Map<String, Object> data = (Map<String, Object>) result.getData();
                        String token = data.get("token").toString();
                        String userstr = GsonUtil.GsonString(data.get("user"));
                        BaseUser baseUser = GsonUtil.GsonToBean(userstr, BaseUser.class);

                        /**
                         * 设置cookies值
                         */
                        HttpUtil.setCookie(request, response, "token", token, TOKEN_EXPIRES);

                        // 表示已经登录成功，需要将openId信息保留在redis中，同时设置cookies值
                        redisUtil.set(CacheKey.WX_USER_OPENID + token, openId);
                        String appid = redisUtil.getString(CacheKey.WX_APP_ID_PREFIX + baseUser.getProviderId());
                        redisUtil.set(CacheKey.WX_USER_OPENID_ORDER + appid + "_" + baseUser.getMobile(), openId);
                        logger.info("登录存放的redis key@{},mobile@{},openId@{}",
                                CacheKey.WX_USER_OPENID_ORDER + baseUser.getProviderId(), "_" + baseUser.getMobile(),
                                openId);

                        checkWechatAutoLogin = 1;
                    }
                }
            }
            /**
             * 设置cookies值 保留一分钟足够了
             */
            String requestUrl = request.getRequestURL().toString();
            URL refererUrl = new URL(requestUrl);
            String mainUrl = refererUrl.getProtocol() + "://" + refererUrl.getHost();
            redirectUrl = mainUrl + redirectUrl;
            if (checkWechatAutoLogin == 1) {
                return this.commonRedirect(request, response, redirectUrl);
            }
            if (Integer.parseInt(isToLogin) == 0) {
                HttpUtil.setCookie(request, response, "fakeToken", "1", FAKE_TOKEN_EXPIRES);
                return this.commonRedirect(request, response, redirectUrl);
            }
            return toLogin(request, response, redirectUrl);
        } catch (Exception ex) {
            logger.error("wechat auth except = {}", ex.getMessage());
            return toLogin(request, response, redirectUrl);
        }
    }

    /**
     * 微信自动认证登录
     */
    @RequestMapping(value = "autoLogin")
    public String autoLogin(HttpServletRequest request, HttpServletResponse response) {
        String redirectUrl = null;
        Cookie fromCookie = HttpUtil.getCookieByName(request, "fromUrl");
        if (fromCookie == null) {
            String fromUrl = request.getRequestURI();
            redirectUrl = fromUrl + (request.getQueryString() == null ? "" : "?" + request.getQueryString());
            Cookie cookie = new Cookie("fromUrl", redirectUrl);
            cookie.setMaxAge(60 * 10);
            cookie.setPath("/");
            response.addCookie(cookie);
            logger.info("没有登录准备跳转");
        } else {
            redirectUrl = fromCookie.getValue();
        }
        logger.info("没有登录准备跳转");
        //如果是微信浏览器,则需要跳转到公众号获取openId
        if (WechatUtils.isWechatBrowser(request)) {
            Cookie cookie1 = HttpUtil.getCookieByName(request, "checkWechatAutoLogin");
            if (cookie1 == null || cookie1.getMaxAge() <= 0) {
                Map data = WechatUtils.getProviderInfo(request);
                Double providerId = Double.valueOf(data.get("proId").toString());
                //增加一个标志，区分是否跳转到登录页面还是回原页面
                String state = data.get("proId") + "_" + redirectUrl;
                state = state + "_1";
                redirectUrl = this.getRedirectUrl(request, "/wechat/checkWechatAutoLogin");
                return "redirect:"+WechatUtils.getWechatOpenUrl(request, String.valueOf(data.get("appId")), redirectUrl, state);
            }
        }
        return toLogin(request, response, redirectUrl);
    }

    private String toLogin(HttpServletRequest request, HttpServletResponse response, String redirectUrl) {
        HttpUtil.setCookie(request, response, "fromUrl", redirectUrl, 60 * 10);
        logger.info("没有登录准备跳转");
        String domainCode = getDomainCode(request.getRequestURL().toString());
        int type = 2;
        if (redisUtil.exists(CacheKey.PROVIDER_DOMAIN + domainCode)) {//
            String providerId = redisUtil.getString(CacheKey.PROVIDER_DOMAIN + domainCode);
            if (redisUtil.exists(CacheKey.PROVIDER_WECHAT_LOGIN + providerId)) {
                type = 1;
            }
        }
        try {
            String requestUrl = request.getRequestURL().toString();
            URL refererUrl = new URL(requestUrl);
            String mainUrl = refererUrl.getProtocol() + "://" + refererUrl.getHost();
            if (type == 1) {
                redirectUrl = mainUrl + ConstantInfo.LOGIN_URL.SELECT_LOGIN;
                return this.commonRedirect(request, response, redirectUrl);
            } else {
                redirectUrl = mainUrl + ConstantInfo.LOGIN_URL.REG_LOGIN;
                return this.commonRedirect(request, response, redirectUrl);
            }
        } catch (Exception ex) {
            logger.error(ex.getMessage());
            return this.commonRedirect(request, response, "/index");
        }
    }
}
