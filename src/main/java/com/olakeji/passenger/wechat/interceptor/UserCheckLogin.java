package com.olakeji.passenger.wechat.interceptor;

import com.olakeji.cache.RedisUtil;
import com.olakeji.passenger.wechat.entity.BaseUser;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.passenger.wechat.utils.WechatUtils;
import com.olakeji.tsp.cache.CacheKey;
import com.olakeji.tsp.constant.ConstantInfo;
import com.olakeji.tsp.utils.GsonUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URLDecoder;
import java.util.Map;

/**
 *
 * @author mylies.liu
 *
 */
public  abstract  class UserCheckLogin {

	protected final Logger logger = LoggerFactory.getLogger(getClass());
	protected RedisUtil redisUtil = null;
	protected String token = null;

	protected boolean authorizedHandle(HttpServletRequest request,
								HttpServletResponse response,
								Object handler,
								boolean isToLogin)
			throws Exception {
		BeanFactory factory = WebApplicationContextUtils.getRequiredWebApplicationContext(request.getServletContext());
		redisUtil = (RedisUtil) factory.getBean(RedisUtil.class);
		try {
			Cookie cookie = HttpUtil.getCookieByName(request, "token");
			if (cookie != null) {
				token = cookie.getValue();
				token = URLDecoder.decode(token, "utf-8");
				if (this.checkUserLogin(request, token)) {
					return true;
				}
			}
		} catch (Exception e) {
			logger.error("拦截器异常:", e);
		}
		token = request.getParameter("token");
		if (this.checkUserLogin(request, token)) {
			return true;
		}
		String XRequested = request.getHeader("X-Requested-With");

		if ("XMLHttpRequest".equals(XRequested)) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		} else {
			String fromUrl = request.getRequestURI();
			String redirectUrl = fromUrl + (request.getQueryString() == null ? "" : "?" + request.getQueryString());
			Cookie cookie = new Cookie("fromUrl", redirectUrl);
			cookie.setMaxAge(60 * 10);
			cookie.setPath("/");
			response.addCookie(cookie);
			logger.info("没有登录准备跳转");
			String domainCode = getDomainCode(request.getRequestURL().toString());
			//如果是微信浏览器,则需要跳转到公众号获取openId
			if (WechatUtils.isWechatBrowser(request)) {
				Map data = WechatUtils.getProviderInfo(request);
				//增加一个标志，区分是否跳转到登录页面还是回原页面
				String providerId = data.get("proId")+"";
				String state = providerId+"_" + redirectUrl;
				if (isToLogin) {
					state = state + "_1";
				}
				else {
					state = state + "_0";
				}
				BigDecimal provd = new BigDecimal(providerId);
				String checkLogin = WechatUtils.getProviderFullPath(provd.intValue())+ "/wechat/checkWechatAutoLogin";
				redirectUrl = WechatUtils.getRedirectUrl(request, checkLogin);
				WechatUtils.openWechat(request, response, data.get("appId").toString(), redirectUrl, state);
				return false;
			}
			int type = 2;
			if (redisUtil.exists(CacheKey.PROVIDER_DOMAIN + domainCode)) {
				String providerId = redisUtil.getString(CacheKey.PROVIDER_DOMAIN + domainCode);
				if (redisUtil.exists(CacheKey.PROVIDER_WECHAT_LOGIN + providerId)) {
					type = 1;
				}
			}
			if (type == 1) {
				response.sendRedirect(ConstantInfo.LOGIN_URL.SELECT_LOGIN);
			} else {
				response.sendRedirect(ConstantInfo.LOGIN_URL.REG_LOGIN);
			}
		}
		return false;
	}

	private String getDomainCode(String url) {
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

	protected boolean checkUserLogin(HttpServletRequest request, String token) {
		if (!StringUtils.isEmpty(token)) {
			String baseUserStr = (String) redisUtil.get(token);
			if (!StringUtils.isEmpty(baseUserStr)) {
				BaseUser baseUser = GsonUtil.GsonToBean(baseUserStr, BaseUser.class);
				if (baseUser != null) {
					// 这里主要是判断如果不是通过手机号码注册则需要跳转到登录页面
					if (StringUtils.isNotEmpty(baseUser.getMobile()) && baseUser.getMobile().charAt(0) != 'u') {
						/**
						 * piggy.huang增加open_id处理过程,如果open_id不存在,则需要跳转到登录页面
						 * 另外，如果手机号没有注册也需要跳转到登录页面去了。
						 * 这里需要增加部分检测代码，判断是不是微信浏览器，只有通过微信浏览器过来的 才考虑open_id检测
						 */
						if (!WechatUtils.isWechatBrowser(request)) {
							return true;
						}
						String openId = (String)redisUtil.get(CacheKey.WX_USER_OPENID + token);
						if (StringUtils.isNotEmpty(openId)) {
							return true;
						}
						if (StringUtils.isNotEmpty(baseUser.getWechatOpenId())) {
							redisUtil.set(CacheKey.WX_USER_OPENID + token, baseUser.getWechatOpenId());
							return true;
						}
					}
				}
			}
		}
		return false;
	}
}
