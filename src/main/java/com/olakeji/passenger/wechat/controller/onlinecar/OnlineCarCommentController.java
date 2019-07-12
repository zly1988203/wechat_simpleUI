package com.olakeji.passenger.wechat.controller.onlinecar;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.enums.SystemReturn;
import com.olakeji.tsp.result.JsonResult;
import com.olakeji.tsp.utils.GsonUtil;

@Controller
@RequestMapping("onlineComment")
public class OnlineCarCommentController extends BaseController{
	private Logger LOGGER = LoggerFactory.getLogger(OnlineCarTripController.class);
	
	@Value("${passenger.api.url}")
	private String apiUrlPrefix;
	
	@RequestMapping("/evaluate")
	public String evaluate(Model model,String orderNo,String token) {
		return "evaluate";
	}
	
	@RequestMapping("/queryCommentTag")
	@ResponseBody
	public String queryCommentTag(Model model,String star,String token) {
		Map<String, String> paramsMap = new HashMap<String, String>();
		String url = apiUrlPrefix + AppUrlConfig.Online.COMMENT_TAG;
		//userId=String.valueOf(baseUser.getId());
		paramsMap.put("star", star);
		paramsMap.put("token", token);
		paramsMap = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, paramsMap);
		return jsonResult;
	}
	
	
	@RequestMapping("/submitComment")
	@ResponseBody
	public String submitComment(Model model,String orderNo,String content,String star,String tagIds,String token) {
		Map<String, String> paramsMap = new HashMap<String, String>();
		String url = apiUrlPrefix + AppUrlConfig.Online.ADD_COMMENT;
		//userId=String.valueOf(baseUser.getId());
		paramsMap.put("orderNo", orderNo);
		paramsMap.put("star", star);
		paramsMap.put("content", content);
		paramsMap.put("token", token);
		paramsMap.put("tagIds", tagIds);
		paramsMap = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, paramsMap);
		return jsonResult;
	}
	
	
	@RequestMapping("/evaluated")
	public String evaluated(Model model,String orderNo,String token) {
		Map<String, String> paramsMap = new HashMap<String, String>();
		if (orderNo == null) {
			return "Error500";
		}
		String url = apiUrlPrefix + AppUrlConfig.Online.QUERY_COMMENT_DETAIL;
		paramsMap.put("orderNo", orderNo);
		paramsMap.put("token", token);
		paramsMap = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, paramsMap);
		JsonResult resultData = GsonUtil.GsonToBean(jsonResult, JsonResult.class);
		if (resultData.getCode() != SystemReturn.OK.getCode()) {
			LOGGER.info(GsonUtil.GsonString(resultData));
			return "Error500";
		}
		
		model.addAttribute("evaluated", resultData.getData());
		model.addAttribute("orderNo", orderNo);
		
		return "evaluated";
	}
}
