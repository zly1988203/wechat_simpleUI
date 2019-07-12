package com.olakeji.passenger.wechat.utils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 * cookie工具类
 * @author herry
 *
 */
public class CookieUtil {

	private static Logger logger = LoggerFactory.getLogger(CookieUtil.class);
	
	
	/**
	 * 根绝key获取cookie中的值
	 * @param key
	 * @param request
	 * @return
	 */
	public static String getCookieValue(String key,HttpServletRequest request){
		try{
			Cookie[] cookies = request.getCookies();
			if(cookies != null){
				for(Cookie cookie : cookies){
					if(cookie.getName().equals(key)){
						String value = cookie.getValue();
						return value;
					}
				}
		}}catch(Exception e){
			logger.info("获取cookie中的值产生了异常:",e);
		}
		return null;
	}
	
}
