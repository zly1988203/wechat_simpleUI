package com.olakeji.passenger.wechat.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 注册成功跳转二维码中转
 * @author ZERO
 *
 */
@Controller
public class SuggestController {
	
	@RequestMapping("/suggest")
	public String registerResult(@RequestParam(value="orderNo",required = false)String orderNo,
			Model model){
		model.addAttribute("orderNo", orderNo);
		return "/suggest.ftl";
	}
}
