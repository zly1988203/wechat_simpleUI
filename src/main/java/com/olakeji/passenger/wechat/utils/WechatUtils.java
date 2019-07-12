package com.olakeji.passenger.wechat.utils;

import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.service.provider.BaseProviderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@Component
public class WechatUtils {
	private static final Logger logger = LoggerFactory.getLogger(WechatUtils.class);
	@Autowired
	protected BaseProviderService baseProviderService;
	@Autowired
	protected BaseController baseController;

	private static WechatUtils instance = null;
	
	@PostConstruct
	private void init() {
		if (instance==null) {
			instance = this;
		}
	}
	
	/**
	 * 判断是否是微信浏览器
	 */
	public static boolean isWechatBrowser(HttpServletRequest servlet) {
		return instance.baseController.isWechatBrowser(servlet);
	}
	
	/**
	 * 打开微信浏览器进行重定向
	 * @param servlet
	 * @param response
	 * @param redirectUrl
	 * @param toUrl
	 * @param state
	 */
	public static void openWechat(HttpServletRequest servlet,  HttpServletResponse response, String appId, String redirectUrl, String state) {
		instance.baseController.openWechat(servlet, response, appId, redirectUrl, state);
	}

	/**
	 * 打开微信浏览器进行重定向
	 * @param servlet
	 * @param response
	 * @param redirectUrl
	 * @param toUrl
	 * @param state
	 */
	public static String getWechatOpenUrl(HttpServletRequest servlet, String appId, String redirectUrl, String state) {
		return instance.baseController.getWechatOpenUrl(servlet, appId, redirectUrl, state);
	}

	/**
	 * 获取车企信息getProviderInfo
	 */
	public static Map getProviderInfo(HttpServletRequest request) {
		return instance.baseController.getProviderInfo(request);
	}

	/**
	 * 获取重定向地址
	 */
	public static String getRedirectUrl(HttpServletRequest request, String url) {
		return getRedirectUrl(request, url, null);
	}

	public static String getRedirectUrl(HttpServletRequest request, String url, Map<String, Object> paramMap) {
		return instance.baseController.getRedirectUrl(request, url, paramMap);
	}

	public static String getProviderFullPath(Integer providerId) {
        return instance.baseProviderService.getWechatUrl(providerId);
    }
}
