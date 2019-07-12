package com.olakeji.passenger.wechat.interceptor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class RemoteOrignVisitInterceptor implements HandlerInterceptor{
	private final Integer TOKEN_EXPIRES = 24*60*60*30;
	protected final Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		logger.info("remote interceptor request url = @{}, referer = @{}", request.getRequestURL(), request.getHeader("Referer"));
		request.setAttribute("ctx", request.getContextPath());
		response.setHeader("Access-Control-Allow-Origin","*");
		response.setHeader("Access-Control-Allow-Methods","POST,GET");
		response.setHeader("Access-Control-Allow-Headers","Access-Control");
		response.setHeader("Allow","POST");
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		// TODO Auto-generated method stub
		
	}

}
