package com.olakeji.passenger.wechat.controller.activity;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.utils.HttpUtil;

@Controller
@RequestMapping(value = "activityRecom")
public class ActivityRecomController extends BaseController{

	@RequestMapping(value = "queryIfHasActivity")
	@ResponseBody
	public String queryIfHasActivity() {
		String url = apiUrlPrefix + AppUrlConfig.Activity.ACTIVITY_RECOM_EXIST;
		Map<String, String> paramsMap = new HashMap<String, String>();
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		return jsonResult;
	}
}
