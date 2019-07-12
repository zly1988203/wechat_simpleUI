package com.olakeji.passenger.wechat.exceptionHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

/**
 * 全局web异常处理
 * 
 * @author herry
 *
 */
@Component
public class GlobalWebExceptionHandler implements HandlerExceptionResolver {

	private static final Logger LOGGER = LoggerFactory.getLogger(GlobalWebExceptionHandler.class);

	@Override
	public ModelAndView resolveException(HttpServletRequest req, HttpServletResponse resp, Object handler,
			Exception ex) {
		LOGGER.error("开始进入全局异常:", ex);
		return new ModelAndView("Error500");
	}

}
