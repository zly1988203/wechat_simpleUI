package com.olakeji.passenger.wechat.controller;

import com.olakeji.cache.RedisUtil;
import com.olakeji.common.wechat.api.WeChatCommonService;
import com.olakeji.common.wechat.bean.user.WeChatUser;
import com.olakeji.common.wechat.exception.WeChatErrorException;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.entity.BaseProviderInfo;
import com.olakeji.passenger.wechat.entity.BaseUser;
import com.olakeji.passenger.wechat.service.provider.BaseProviderService;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.passenger.wechat.utils.StringUtil;
import com.olakeji.tsp.cache.CacheKey;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.constant.AppContants;
import com.olakeji.tsp.constant.ConstantInfo;
import com.olakeji.tsp.exception.TspException;
import com.olakeji.tsp.utils.ApiHelper;
import com.olakeji.tsp.utils.GsonUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;

@Controller
public class BaseController {

    public final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Value("${passenger.api.url}")
    public String apiUrlPrefix;
    @Value("${app.id}")
    public Integer appId;
    @Value("${app.key}")
    public String appKey;
    @Value("${client.type}")
    public Integer clientType;
    @Value("${app.version}")
    public Double appVersion;
    @Value("${device_id}")
    public String drviceId;
    @Value("${wechatlogin}")
    public String wechatLogin;

    @Autowired
    HttpServletRequest request;
    @Autowired
    HttpServletResponse response;
    @Autowired
    public BaseProviderService baseProviderService;
    @Autowired
	protected RedisUtil redisUtil1;
    @Autowired
    private WeChatCommonService commonService;

	public Map<String, Object> getMap() {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("appId", appId);
        map.put("appVersion", appVersion);
        map.put("clientType", clientType);
        map.put("deviceId", drviceId);
        map.put("wechatLogin", wechatLogin);
        map.put("timestamp", System.currentTimeMillis());
        return map;
    }

    public Map<String, String> getMap(HttpServletRequest request, String token) {

        Map<String, String> map = new HashMap<String, String>();

        map.put("appId", appId.toString());
        map.put("appVersion", appVersion.toString());
        map.put("clientType", clientType.toString());
        map.put("deviceId", drviceId);
        map.put("wechatLogin", wechatLogin);
        map.put("timestamp", String.valueOf(System.currentTimeMillis()));
        map.put("token", token);
        map.put("requestUrl", request.getRequestURL().toString());

        return map;
    }

    public String getString() {
        StringBuilder sb = new StringBuilder();
        sb.append("appId=").append(appId.toString()).append("&appVersion=").append(appVersion.toString())
                .append("&clientType=").append(clientType.toString()).append("&deviceId=").append(drviceId)
                .append("&wechatLogin=").append(wechatLogin).append("&timestamp")
                .append(String.valueOf(System.currentTimeMillis()));
        return sb.toString();
    }

    /**
     * according to url and params, generate request parameters that contain
     * signatures
     *
     * @param url    api url
     * @param params private request param, or null
     * @return request parameters that contain signatures
     * @author pridewu
     */
    public Map<String, String> genReqApiData(String url, Map<String, String> params) {
        return this.genReqApiData(request, url, params);
    }

    /**
     * get the parameters of this request
     *
     * @return a java.util.Map of the parameters of this request.
     * @author pridewu
     */
    public Map<String, String> getRequestParams() {
        Map<String, String> params = new HashMap<String, String>();

        Map<String, String[]> requestParams = request.getParameterMap();
        for (Iterator<String> iter = requestParams.keySet().iterator(); iter.hasNext(); ) {
            String name = (String) iter.next();
            String[] values = (String[]) requestParams.get(name);
            String valueStr = "";
            for (int i = 0; i < values.length; i++) {
                valueStr = (i == values.length - 1) ? valueStr + values[i] : valueStr + values[i] + ",";
            }

            params.put(name, valueStr);
        }

        return params;
    }

    public ResultEntity doApiPostRequest(String apiUrlPostfix, Map<String, Object> param) throws Exception {
        if (StringUtils.isEmpty(apiUrlPostfix)) {
            throw new TspException("请求地址错误");
        }
        String resultStr = HttpUtil.doPostRequest(apiUrlPrefix + apiUrlPostfix, param);
        logger.info("添加访问需求返回@{}", resultStr);
        if (StringUtils.isEmpty(resultStr)) {
            throw new TspException("请求系统异常");
        }
        return GsonUtil.GsonToBean(resultStr, ResultEntity.class);
    }

    /**
     * get token from cookie
     *
     * @return
     */
    public String getToken() {
        Cookie[] cookies = request.getCookies();
        String token = "";

        // get token from cookie
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("token")) {
                    token = cookie.getValue();
                    try {
                        token = URLDecoder.decode(token, "utf-8");
                    } catch (UnsupportedEncodingException e) {
                        logger.info("token decode error");
                    }
                }
            }
        }
        return token;
    }

    public String getLatestPassengersFromCookie() {
        Cookie[] cookies = request.getCookies();
        String passengerIds = "";

        //get token from cookie
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("passengerIds")) {
                    passengerIds = cookie.getValue();
                }
            }
        }
        return passengerIds;
    }

    public void putIntoCookies(String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        if (maxAge > 0) {
            cookie.setMaxAge(maxAge);
        }
        response.addCookie(cookie);
    }

    public String getCookie(String name) {
        Cookie[] cookies = request.getCookies();
        String value = "";

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    value = cookie.getValue();
                }
            }
        }
        return value;
    }

    /**
     * 获取车企信息的方法
     *
     * @param request
     * @return
     */
    @SuppressWarnings("unchecked")
    public BaseProviderInfo getProviderDetail(HttpServletRequest request) {
        String requestUrl = request.getRequestURL().toString();
        String url = apiUrlPrefix + AppUrlConfig.PRIOVIDER_PROVIDERINFO;
        Map<String, String> map = new HashMap<String, String>();
        map.put("requestUrl", requestUrl);
        String resultStr = HttpUtil.doPostReq(url, map);
        ResultEntity result = GsonUtil.GsonToBean(resultStr, ResultEntity.class);
        BaseProviderInfo providerInfo = null;
        if (result.getCode() == 0) {
            Map<String, Object> resultMap = (Map<String, Object>) result.getData();
            String providerInfoStr = GsonUtil.GsonString(resultMap.get("providerInfo"));
            providerInfo = GsonUtil.GsonToBean(providerInfoStr, BaseProviderInfo.class);
        }
        return providerInfo;
    }

    /**
     * 获取用户信息的方法，从redis缓存中查询
     */
    public BaseUser getBaseUser() {
        String token = this.getToken();
        if (!StringUtils.isEmpty(token)) {
            String baseUserStr = (String) redisUtil1.get(this.getToken());
            if (!StringUtils.isEmpty(baseUserStr)) {
                BaseUser baseUser = GsonUtil.GsonToBean(baseUserStr, BaseUser.class);
                return baseUser;
            }
        }

        return null;
    }

    /**
     * 获取前端域名了
     */
    public String getHost() {
        String host = request.getHeader("Host");
        if (!StringUtils.isEmpty(host)) {
            return host;
        }
        return null;
    }

    /**
     * 获取公众号OPEN_ID的方法，此方法是根据code，以及 providerId
     * 通过微信公众号授权认证获取open id的，可以是一个公用方法
     */
    // 通过code获取openId
    public String getOpenId(String code, String providerId) {
        logger.info("传递额参数,@code@{},providerId@{}", code, providerId);
        if (!StringUtils.isEmpty(code)) {
            String appid = redisUtil1.getString(CacheKey.WX_APP_ID_PREFIX + providerId); // ; "wx4cc488f3ef931e9b"
            String appSecret = redisUtil1.getString(CacheKey.WX_APP_SERCET_PREFIX + providerId);//
            logger.info("appId@{}, appSecret@{}", appid, appSecret);
            /*String url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + appSecret
                    + "&code=" + code + "&grant_type=authorization_code";
            String result = HttpUtil.doGetRequest(url);
            logger.info("获取openId 请求地址 url@{},response@{}", url, result);
            if (!StringUtils.isEmpty(result)) {
                Map<String, String> resultMap = GsonUtil.GsonToMaps(result);
                logger.info("获取到的access_token:{}", resultMap.get("access_token"));
                if (resultMap.get("openid") != null) {
                    return resultMap.get("openid").toString();
                }
            }*/
            try {
                WeChatUser weChatUser = this.commonService.getUserService().getUserAuthToken(appid, appSecret, code);
                logger.info("获取到的access_token:{}", weChatUser.getAccessToken());
                return weChatUser.getOpenId();
            } catch (WeChatErrorException ex) {
                logger.error("get open id exception = {}", ex.getMessage());
            }
        }
        return "";
    }

    /**
     * 获取网址的指定参数值
     *
     * @param url       网址
     * @param parameter 参数名称
     * @return
     * @author cevencheng
     */
    public Map<String, String> getParameter(String url) {
        try {
            if (url.indexOf('?') != -1) {
                final String contents = url.substring(url.indexOf('?') + 1);
                HashMap<String, String> map = new HashMap<String, String>();
                String[] keyValues = contents.split("&");
                for (int i = 0; i < keyValues.length; i++) {
                    String key = keyValues[i].substring(0, keyValues[i].indexOf("="));
                    String value = keyValues[i].substring(keyValues[i].indexOf("=") + 1);
                    map.put(key, value);
                }
                return map;
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 请求参数重新组装URL参数地址
     */
    public String genParamStr(Map<String, ?> paramMap) {
        String urlStr = "";
        Iterator it = paramMap.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry entry = (Map.Entry) it.next();
            Object key = entry.getKey();
            Object value = entry.getValue();
            try {
                if (urlStr.indexOf("?") < 0) {
                    urlStr += "?" + key + "=" + URLEncoder.encode((String) value, "UTF-8");
                } else {
                    urlStr += "&" + key + "=" + URLEncoder.encode((String) value, "UTF-8");
                }
            } catch (UnsupportedEncodingException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }

        return urlStr;
    }

    /**
     * 统一重定向处理，主要是针对小程序需要的HTTP与HTTPS问题
     */
    public String commonRedirect(HttpServletRequest request, HttpServletResponse response, String url) {
        return commonRedirect(request, response, url, null);
    }

    public String commonRedirect(HttpServletRequest request, HttpServletResponse response, String url, Map<String, Object> paramMap) {
        try {
            if (request == null) {
                response.sendRedirect(url);
                return "";
            }
            String toUrl = this.getRedirectUrl(request, url, paramMap);
            if (StringUtils.isEmpty(toUrl)) {
                response.sendRedirect(url);
                return "";
            }
            logger.info("重定向地址redirect: {}",toUrl);
            return "redirect:" + toUrl;
        } catch (Exception ex) {
            logger.error(ex.getMessage());
        }
        return "";
    }

    public String getScheme(HttpServletRequest request) {
        logger.info("scheme ==== @{}, protocol ==== @{}", request.getScheme(), request.getProtocol());
        return request.getScheme();
    }

    public String getFullPath(HttpServletRequest request) {
        return getScheme(request).toLowerCase() + "://" + request.getHeader("Host");
    }

    /**
     * 获取重定向地址
     */
    public String getRedirectUrl(HttpServletRequest request, String url) {
        return this.getRedirectUrl(request, url, null);
    }

    public String getRedirectUrl(HttpServletRequest request, String url, Map<String, Object> paramMap) {
        try {
            String referer = request.getHeader("Referer");
            if (StringUtils.isEmpty(referer)) {
                referer = getFullPath(request);
            }
            logger.info("页面重定向时 referer @{}, tourl = @{} ", referer, url);
            URL refererUrl = new URL(referer);
            if (!refererUrl.getHost().equalsIgnoreCase("" + request.getHeader("Host"))) {
                refererUrl = new URL(request.getRequestURL().toString());
            }
            String mainUrl = refererUrl.getProtocol() + "://" + refererUrl.getHost();
            String domainCode = this.getDomainCode(mainUrl);
            mainUrl = baseProviderService.getCacheByDomain(domainCode).getProtocol() + "://" + refererUrl.getHost();
            String param = "";
            if (!CollectionUtils.isEmpty(paramMap)) {
                param = this.genParamStr(paramMap);
            }
            if (url.toLowerCase().indexOf("http://") >= 0 ||
                    url.toLowerCase().indexOf("https://") >= 0) {
                logger.info("跳转地址1: {}",url + param);
                return url + param;
            }
            logger.info("跳转地址2: mainUrl [{}], url [{}], param [{}]",mainUrl,url,param);
            return mainUrl + url + param;
        } catch (Exception ex) {
            ex.printStackTrace();
            logger.error(ex.getMessage());
        }
        return "";
    }

    public String getDomainCode(String url) {
        try {
            URI uri = new URI(url.toString());
            String host = uri.getHost();
            String[] hostArr = host.split("\\.");
            if (hostArr != null && hostArr.length > 0) {
                String domainCode = hostArr[0];
                return domainCode;
            }
        } catch (Exception e) {
            logger.error("获取domainCode异常:", e);
        }
        return null;
    }

    /**
     * 判断是否是微信浏览器
     */
    public boolean isWechatBrowser(HttpServletRequest servlet) {
        boolean validation = false;
        String ua = ((HttpServletRequest) servlet).getHeader("User-Agent").toLowerCase();
        if (ua.indexOf("micromessenger") > 0) {
            // 是微信浏览器
            validation = true;
        }

        return validation;
    }

    /**
     * 打开微信浏览器进行重定向
     *
     * @param servlet
     * @param response
     * @param redirectUrl
     * @param toUrl
     * @param state
     */
    public void openWechat(HttpServletRequest servlet, HttpServletResponse response, String appId, String redirectUrl, String state) {
        try {
            response.sendRedirect(getWechatOpenUrl(servlet, appId, redirectUrl, state));
        } catch (IOException ex) {
            logger.error("open wechat error = {}", ex.getMessage());
        }
    }

    /**
     * 打开微信浏览器进行重定向
     *
     * @param servlet
     * @param response
     * @param redirectUrl
     * @param toUrl
     * @param state
     */
    public String getWechatOpenUrl(HttpServletRequest servlet, String appId, String redirectUrl, String state) {
        try {
            String uuid = "uuid-"+UUID.randomUUID().toString().toLowerCase().replace("-","");
            redisUtil1.set(uuid, state, CacheKey.CACHE_FIF_SEC*4);
            //String wechatUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + URLEncoder.encode(redirectUrl, "UTF-8") + "&connect_redirect=1&response_type=code&scope=snsapi_base&state=" + uuid + "#wechat_redirect";
            String wechatUrl = this.commonService.authApiConfig().baseAuthUri(appId, URLEncoder.encode(redirectUrl, "UTF-8"), uuid);
            logger.info("openWechat = {}, uuid state = {}", wechatUrl, redisUtil1.get(uuid));
            return wechatUrl;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return this.getRedirectUrl(servlet, ConstantInfo.LOGIN_URL.REG_LOGIN);
    }

    /**
     * 获取车企信息getProviderInfo
     */
    public Map getProviderInfo(HttpServletRequest request) {
        String url = apiUrlPrefix + "/Account/getProviderInfo";
        Map<String, String> params = new HashMap<String, String>();
        params = genReqApiData(request, url, params);
        String busData = HttpUtil.doPostReq(url, params);
        ResultEntity result = GsonUtil.GsonToBean(busData, ResultEntity.class);
        return (Map) result.getData();
    }

    /**
     * according to url and params, generate request parameters that contain
     * signatures
     *
     * @param url    api url
     * @param params private request param, or null
     * @return request parameters that contain signatures
     * @author pridewu
     */
    public Map<String, String> genReqApiData(HttpServletRequest servletRequest, String url, Map<String, String> params) {

        Cookie[] cookies = servletRequest.getCookies();
        String token = "";

        // get token from cookie
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("token")) {
                    token = cookie.getValue();
                    try {
                        token = URLDecoder.decode(token, "utf-8");
                    } catch (UnsupportedEncodingException e) {
                        logger.info("token decode error");
                    }
                }
            }
        }

        Map<String, String> paramMap = getMap(servletRequest, token);
        if (params != null && !params.isEmpty()) {
            for (String key : params.keySet()) {
                String value = params.get(key);
                if (value != null) {
                    paramMap.put(key, value);
                }
            }
        }

        // generate sign;
        String host = url.substring(url.indexOf("//") + 2);
        String checkSign = "";
        try {
            checkSign = ApiHelper.genSig(host, paramMap, AppContants.APP_MAP.get(appId.toString()));
        } catch (NoSuchAlgorithmException e) {
            logger.info("generate decode error");
        }
        paramMap.put("sign", checkSign);

        return paramMap;
    }
}
