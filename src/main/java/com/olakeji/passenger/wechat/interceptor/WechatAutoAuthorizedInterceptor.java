package com.olakeji.passenger.wechat.interceptor;

import com.olakeji.passenger.wechat.utils.HttpUtil;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author mylies.liu
 *
 */
public class WechatAutoAuthorizedInterceptor extends UserCheckLogin implements HandlerInterceptor {
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		Cookie fakeToken = HttpUtil.getCookieByName(request, "fakeToken");
		//如果已经做了授权认证，则不需要再重新再做了。
		if (null != fakeToken && fakeToken.getValue().equals("1")) {
			return true;
		}
		return this.authorizedHandle(request, response, handler, false);
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
						   ModelAndView modelAndView) throws Exception {
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
	}
}
