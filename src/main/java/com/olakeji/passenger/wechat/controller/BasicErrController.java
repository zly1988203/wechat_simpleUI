package com.olakeji.passenger.wechat.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.boot.autoconfigure.web.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class BasicErrController implements ErrorController {

	@RequestMapping("/error")
    public String  handleError(HttpServletRequest request){
		return "Error500";
    }
	
	@Override
	public String getErrorPath() {
		return "/Error500";
	}
	
	/**
	 * Error500 错误页面统一处理
	 */
	@RequestMapping("/Error500")
	public String Error500(HttpServletRequest request, HttpServletResponse response) {
		return "Error500";
	}
}
