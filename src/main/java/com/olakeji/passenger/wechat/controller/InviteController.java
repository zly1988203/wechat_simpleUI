package com.olakeji.passenger.wechat.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.validation.ValidParameter;

@Controller
@RequestMapping("/invite")
public class InviteController {
	@Value("${passenger.api.url}")
	private String apiUrl;
	
	//增加注册数
	
	/**
	 * 邀请注册
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/{inviterId}", method = RequestMethod.GET)
	@ValidParameter(extraRequestParam={"inviterId"})
	public String orderDetail(@PathVariable Integer inviterId, Model model,HttpServletRequest request) {
		String responseData=HttpUtil.doGetRequest(apiUrl+AppUrlConfig.GET_PROVIDER_WECHAT_CONFIG+"?requestUrl="+request.getRequestURL().toString());
		ResultEntity resultEntity=GsonUtil.GsonToBean(responseData, ResultEntity.class);
		Map<String,Object> resultMap = (Map<String,Object>)resultEntity.getData();
		if(resultMap.containsKey("appId")){
			model.addAttribute("appId", resultMap.get("appId"));
		}
		if(resultMap.containsKey("providerId")){
			model.addAttribute("providerId", resultMap.get("providerId"));
		}
		model.addAttribute("inviterId", inviterId);
		return "/common/register";
	}
	
}
