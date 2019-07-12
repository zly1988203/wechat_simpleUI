package com.olakeji.passenger.wechat.controller;

import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;

/**
 * common request Api
 * @author pridewu
 *
 */
@Controller
public class RequestApi extends BaseController {

	@Value("${passenger.api.url}")
	private String apiUrlPrefix;
	
	@RequestMapping(value = "/requestApi")
	@ResponseBody
	public String requestApi() {
		Map<String, String> paramsMap = this.getRequestParams();
		String uri = paramsMap.get("uri");
		paramsMap.remove("uri");
		
		if(!StringUtils.isEmpty(uri) && !uri.substring(0, 1).equals("/")){
			uri = "/" + uri;
		}
		String url = apiUrlPrefix + uri;
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		
		ResultEntity resultData=GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		return GsonUtil.GsonString(resultData);
	}

}
