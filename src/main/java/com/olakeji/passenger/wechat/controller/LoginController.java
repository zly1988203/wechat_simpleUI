package com.olakeji.passenger.wechat.controller;

import java.io.UnsupportedEncodingException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/")
public class LoginController extends BaseController {
	
	@RequestMapping(value="login")
	public String login() throws UnsupportedEncodingException {
		return "login/login";
	}
	
	@RequestMapping(value="regOrLogin")
	public String regOrLogin() throws UnsupportedEncodingException {
		return "login/regOrLogin";
	}
	
	@RequestMapping(value="selectionLogin")
	public String selectionLogin() throws UnsupportedEncodingException {
		return "login/selectionLogin";
	}
}
