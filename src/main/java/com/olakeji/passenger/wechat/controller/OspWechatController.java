package com.olakeji.passenger.wechat.controller;
/**
 * author:walle
 */

import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.util.BeanUtil;
import com.olakeji.common.wechat.api.WeChatCommonService;
import com.olakeji.common.wechat.bean.WeChatAccessToken;
import com.olakeji.common.wechat.bean.user.WeChatUser;
import com.olakeji.common.wechat.exception.WeChatErrorException;
import com.olakeji.osp.cache.OspCacheKey;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.entity.BaseUser;
import com.olakeji.passenger.wechat.service.provider.BaseProviderService;
import com.olakeji.passenger.wechat.utils.CookieUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.common.passenger.WeixinUserInfo;
import org.apache.commons.beanutils.BeanMap;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.BeanUtilsBean2;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.cache.RedisUtil;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.passenger.wechat.utils.StringUtil;
import com.olakeji.tsp.cache.CacheKey;
import com.olakeji.tsp.utils.GsonUtil;

@Controller
@RequestMapping("/wechatOsp")
public class OspWechatController extends BaseController {
    private final Logger LOGGER = LoggerFactory.getLogger(OspWechatController.class);
    @Autowired
    private RedisUtil redisUtil;

    @Autowired
    private BaseProviderService baseProviderService;

    @Value("${osp.php.url}")
    private String phpHost;

    @Value("${passenger.api.url}")
    private String apiUrlPrefix;

    @Autowired
    private WeChatCommonService commonService;

    /**
     * ops端获取微信用户信息
     *
     * @param request
     * @return
     * @throws IOException
     */
    @RequestMapping("/getOpenId")
    public String getOpenId(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String providerId = request.getParameter("providerId");
        String uuid = request.getParameter("uuid");
        String scope = request.getParameter("scope");
        if (StringUtil.isEmpty(scope)) {
            scope = "snsapi_base";
        }
        String openId = "";
        String access_token = "";
        String refresh_token = "";
        String redirect_url = "";
        String state = request.getParameter("state");
        String code = request.getParameter("code");
        String userInfo = "";

        //获取微信回调数据
        if (!StringUtil.isEmpty(code)) {
            if (!StringUtils.isEmpty(state)) {
                String[] paramArray = state.split("-");
                if (!StringUtil.isEmpty(paramArray[0])) {
                    providerId = paramArray[0];
                }
                if (!StringUtil.isEmpty(paramArray[1])) {
                    scope = paramArray[1];
                }
                if (!StringUtil.isEmpty(paramArray[2])) {
                    uuid = paramArray[2];
                }
            }
        }

        String phpUrl = baseProviderService.getOspUrl(Integer.valueOf(providerId));
        if (StringUtils.isEmpty(phpUrl)) {
            phpUrl = phpHost;
        }
        String fromUrl = phpUrl + "/tsp/wechat/openIdRedirect.html";

        //根据providerId获取车企appId及appSecret
        Map<String, String> wechatConfMap = wechatConf(providerId);
        String appid = wechatConfMap.get("appid");
        String appSecret = wechatConfMap.get("appSecret");

        if (StringUtil.isEmpty(code)) {
            //如果code为空,则获取code
            String referrUrl = request.getRequestURL().toString();
            LOGGER.info("refer url = {}", referrUrl);
            redirect_url = this.getRedirectUrl(request, "/wechatOsp/getOpenId");
            LOGGER.info("osp redirect url = {}", redirect_url);
            String url = this.commonService.authApiConfig().authUri(appid, URLEncoder.encode(redirect_url), providerId + "-" + scope + "-" + uuid, scope);
            /*String url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
                    appid + "&redirect_uri=" + URLEncoder.encode(redirect_url) + "&response_type=code&scope=" + scope + "&state=" + providerId + "-" + scope + "-" + uuid + "#wechat_redirect";*/
            return this.commonRedirect(request, response, url);
        } else {
            try {
                WeChatUser token = this.commonService.getUserService().getUserAuthToken(appid, appSecret, code);
                if (StringUtils.isNotEmpty(token.getOpenId()) && scope.equals("snsapi_userinfo")) {
                    WeChatUser weChatUser = this.commonService.getUserService().userAuthInfo(token.getOpenId(), token.getAccessToken());
                    weChatUser.setOpenId(token.getOpenId());
                    weChatUser.setAccessToken(token.getAccessToken());
                    weChatUser.setRefreshToken(token.getRefreshToken());
                    redisUtil.set(OspCacheKey.SNS_ACCESS_TOKEN.getCacheKey(openId + providerId), JSONObject.toJSONString(weChatUser), 30 * 24 * 60 * 60L);

                    Map<String, Object> paramMap = new HashMap<String, Object>();
                    paramMap.put("openId", weChatUser.getOpenId());
                    paramMap.put("providerId", providerId);
                    String url = apiUrlPrefix + AppUrlConfig.UPDATE_OSP_USER_INFO;
                    String resultRes = HttpUtil.doPostRequest(url, paramMap);
                    LOGGER.info("保存微信用户信息 结果{}， 参数{},  wechatUser = {}", resultRes, GsonUtil.GsonString(paramMap), JSON.toJSONString(weChatUser));

                    userInfo = URLEncoder.encode(JSON.toJSONString(weChatUser));
                }
            } catch (Exception ex) {
                LOGGER.error("保存微信用户信息 信息转换错误 ！ {}", ex.getMessage());
            }
            LOGGER.info("encode后获取到的用户信息@ {}",userInfo);
        }

        String toUrl = fromUrl + "?openId=" + openId + "&access_token=" + access_token + "&uuid=" + uuid + "&userInfo=" + userInfo;
        return this.commonRedirect(request, response, toUrl);
    }

    /**
     * 根据车企Id获取车企微信appId及appSecret
     *
     * @param provider_id
     * @return
     */
    public Map<String, String> wechatConf(String provider_id) {
        String appid = "";
        String appSecret = "";
        if (!StringUtil.isEmpty(provider_id)) {
            int providerId = Integer.valueOf(provider_id);
            appid = redisUtil.getString(CacheKey.WX_APP_ID_PREFIX + providerId); //redisUtil.getString(CacheKey.WX_APP_ID_PREFIX+providerId);//车企的appId ; "wx4cc488f3ef931e9b"
            appSecret = redisUtil.getString(CacheKey.WX_APP_SERCET_PREFIX + providerId);//;//车企的秘钥  "907813991033958efc507dde7b1b3523"
            //TODO 调取接口获取车企的微信相关配置
			/*if(StringUtil.isEmpty(appid) || StringUtil.isEmpty(appSecret)){
				
			}*/
        }
        Map<String, String> map = new HashMap<String, String>();
        map.put("appid", appid);
        map.put("appSecret", appSecret);
        return map;
    }

    /*
     * 设置cookie
     */
    @RequestMapping("/setCookie")
    public @ResponseBody
    String setCookie(HttpServletRequest request, HttpServletResponse response) {
        String key = request.getParameter("key");
        String value = request.getParameter("value");
        if (!StringUtil.isEmpty(key) && !StringUtil.isEmpty(value)) {
            Cookie cookie = new Cookie(key, value);
            cookie.setMaxAge(3600 * 24 * 30);
            cookie.setPath("/");
            response.addCookie(cookie);
        }
        return "success";
    }

    /**
     * 活动Java中转页面-->Java为入口跳转至php活动页面
     *
     * @param request
     * @param response
     * @return
     */
    @RequestMapping("/activityToOsp")
    @SuppressWarnings("deprecation")
    public String activityRedirect2Osp(HttpServletRequest request, HttpServletResponse response) {
        String providerId = request.getParameter("providerId");
        String redirectUrl = URLDecoder.decode(request.getParameter("redirectUrl"));
        String ospHost = baseProviderService.getOspUrl(Integer.valueOf(providerId));
        if (StringUtils.isEmpty(ospHost)) {
            ospHost = phpHost;
        }
        Cookie[] cookies = request.getCookies();
        String token = "";
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("token")) {
                    token = cookie.getValue().toString();
                }
            }
        }
        String separator = "?";
        if (redirectUrl.contains("?")) {
            separator = "&";
        }
        int anchorAt = redirectUrl.indexOf("#");
        String url = redirectUrl;
        String anchor = "";
        if (anchorAt >= 0) {
            url = redirectUrl.substring(0, anchorAt);
            anchor = redirectUrl.substring(anchorAt);
        }

        return "redirect:" + ospHost + url + separator + "token=" + token + anchor;
    }
}
