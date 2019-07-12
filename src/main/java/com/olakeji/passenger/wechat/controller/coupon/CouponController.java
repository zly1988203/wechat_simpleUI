package com.olakeji.passenger.wechat.controller.coupon;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;

@Controller
@RequestMapping(value = "/")
public class CouponController extends BaseController {
	
	@RequestMapping(value = "coupon/select")
	public String couponSelect(HttpServletRequest request) {
		return "coupon-select";
	}
}
