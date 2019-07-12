package com.olakeji.passenger.wechat.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.common.util.http.HttpClientUtil;
import com.olakeji.common.wechat.exception.WeChatErrorException;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.utils.GsonUtil;

/**
 * 用于微信公众号和wechat_server服务的消息中转
 *
 * @author roderick
 */
@RequestMapping(value = "/wechatserver")
@Controller
public class WeChatServerController {
	private Logger logger = LoggerFactory.getLogger(WeChatServerController.class);
	
	@Value("${passenger.api.url}")
	private String apiUrlPrefix;
	
	@Value("${wechat.server.url}")
	private String wechatServer;

	/**
	 * 开发者配置，token验证
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public @ResponseBody String checkSignature(String timestamp, String nonce, String signature, String echostr, HttpServletRequest request) {
		String serverName = request.getServerName();
		String domainName = serverName.split("\\.")[0];
		
		try {
			//1.先根据域名获取车企的token
			String res = HttpClientUtil.getURL(apiUrlPrefix + AppUrlConfig.PROVIDER_WECHAT_CONFIG + domainName);
			Map<String, String> jsonMap = GsonUtil.GsonToMaps(res);
			Integer code = Integer.valueOf(jsonMap.get("code").toString());
			if (Constant.SUCCESS == code) {
				jsonMap.put("timestamp", timestamp);
				jsonMap.put("nonce", nonce);
				jsonMap.put("signature", signature);
				jsonMap.put("echostr", echostr);
				//2.再请求wechatServer模块验证token
				String result = HttpClientUtil.postURL(wechatServer + AppUrlConfig.WECHAT_SERVER_CHECKSIGNATURE, GsonUtil.GsonString(jsonMap));
				Map<String, String> resultMap = GsonUtil.GsonToMaps(result);
				return resultMap.get("echostr");
			} else {
				logger.info("车企配置信息获取失败，域名：" + domainName);
			}
		} catch (WeChatErrorException e) {
			logger.error("token验证异常，错误码：" + e.getError().getErrorCode() + ", 错误信息：" + e.getError().getErrorMsg());
		}
		
		return "";
	}
	
	/**
	 * 用于接收微信主动推送的事件消息
	 */
	@RequestMapping(value = "/", method = RequestMethod.POST)
	public @ResponseBody String recevieContent(HttpServletRequest request, @RequestBody String bodyContent) {
		try {
			String serverName = request.getServerName();
			String domainName = serverName.split("\\.")[0];
			
			logger.info("微信给我的数据：" + bodyContent);
			logger.info("域名：" + domainName);
			
			Map<String, String> paramMap = new HashMap<>();
			paramMap.put("domainName", request.getParameter("domainName"));
			//用于安全模式下的加解密
			paramMap.put("timestamp", request.getParameter("timestamp"));
			paramMap.put("encrypt_type", request.getParameter("encrypt_type"));
			paramMap.put("msg_signature", request.getParameter("msg_signature"));
			paramMap.put("nonce", request.getParameter("nonce"));
			
			String result = HttpClientUtil.postURL(wechatServer + AppUrlConfig.WECHAT_SERVER_RECEIVE_CONTENT, paramMap, bodyContent);
			Map<String, String> resultMap = GsonUtil.GsonToMaps(result);
			return resultMap.get("result");
		} catch (WeChatErrorException e) {
			logger.error("消息处理异常，错误码：" + e.getError().getErrorCode() + ", 错误信息：" + e.getError().getErrorMsg());
		}
		
		return "success";
	}
	
}
