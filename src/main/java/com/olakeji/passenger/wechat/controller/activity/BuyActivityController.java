package com.olakeji.passenger.wechat.controller.activity;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;

@Controller
@RequestMapping(value="buyActivity")
public class BuyActivityController extends BaseController{

	@RequestMapping(value="/activityDetail")
	public String activityDetail(String activityId,String orderNo,Model model){
		String url = apiUrlPrefix + AppUrlConfig.BUY_ACTIVITY_DETAIL;
		Map<String, String> paramsMap = new HashMap<String,String>(); 
		paramsMap.put("activityId", activityId);
		paramsMap.put("orderNo",orderNo);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		
		ResultEntity resultData=GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		model.addAttribute("activity", resultData.getData());
		model.addAttribute("orderNo",orderNo);
		if(resultData.getCode()!=0){
			model.addAttribute("message", resultData.getMessage());
			return "activityDetailEmpty";
		}
		return "activityDetail";
	}
	
	@RequestMapping(value="/activityList")
	public String activityList(Model model){
		String url = apiUrlPrefix + AppUrlConfig.BUY_ACTIVITY_LIST;
		Map<String, String> paramsMap = new HashMap<String,String>(); 
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity resultData=GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		model.addAttribute("activity", resultData.getData());
		return "activityList";
	}

	@RequestMapping(value="/queryUserCoupons")
	@ResponseBody
	public String queryUserCoupons(String activityId){
		String url = apiUrlPrefix + AppUrlConfig.BUY_ACTIVITY_USER_COUPON;
		Map<String, String> paramsMap = new HashMap<String,String>(); 
		paramsMap.put("activityId", activityId);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		return jsonResult;
	}
	
	@RequestMapping(value="/fetchCoupon")
	@ResponseBody
	public String fetchCoupon(String activityId,String orderNo){
		String url = apiUrlPrefix + AppUrlConfig.BUY_ACTIVITY_FETCH_COUPON;
		Map<String, String> paramsMap = new HashMap<String,String>(); 
		paramsMap.put("activityId", activityId);
		paramsMap.put("orderNo", orderNo);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		return jsonResult;
	}
}

	
