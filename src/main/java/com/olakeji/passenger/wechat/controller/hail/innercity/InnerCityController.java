package com.olakeji.passenger.wechat.controller.hail.innercity;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.controller.hail.HailController;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Controller("HailInnerCityController")
@RequestMapping(value = "/hail/innerCity")
public class InnerCityController extends HailController {
	private Logger logger = LoggerFactory.getLogger(InnerCityController.class);

	@RequestMapping(value = "/getCitys", method = RequestMethod.POST)
	@ResponseBody
	public String getCitys(String type, HttpServletRequest request) {
		String requestUrl = request.getRequestURL().toString();
		String url = apiUrlPrefix + AppUrlConfig.GET_OPENCITYS;
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("type", type);
		paramsMap.put("requestUrl", requestUrl);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);

		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		return GsonUtil.GsonString(resultData);
	}

	@RequestMapping(value = "/judgeService")
	@ResponseBody
	public String judgeService(HttpServletRequest request, String departLng, String departLat, String arriveLng,
			String arriveLat, String departAreaCode, String arriveAreaCode, String num, String departDate,
			String carType) {
		String requestUrl = request.getRequestURL().toString();
		String url = apiUrlPrefix + AppUrlConfig.JUDGE_SERVICE;
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("departLng", departLng);
		paramsMap.put("departLat", departLat);
		paramsMap.put("arriveLng", arriveLng);
		paramsMap.put("arriveLat", arriveLat);
		paramsMap.put("departAreaCode", departAreaCode);
		paramsMap.put("arriveAreaCode", arriveAreaCode);
		paramsMap.put("num", num);
		paramsMap.put("departDate", departDate);
		paramsMap.put("carType", carType);
		paramsMap.put("requestUrl", requestUrl);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		logger.info("judgeService返回:", jsonResult);
		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		return GsonUtil.GsonString(resultData);
	}

	@RequestMapping(value = "queryIfOpenModel")
	@ResponseBody
	public String queryIfOpenModel(HttpServletRequest request) {
		String requestUrl = request.getRequestURL().toString();
		String url = apiUrlPrefix + AppUrlConfig.INNER_CITY_QUERY_IFOPENMODEL;
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("requestUrl", requestUrl);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		return jsonResult;
	}

	@RequestMapping(value = "/reminder", method = RequestMethod.POST)
	@ResponseBody
	public String reminder(HttpServletRequest request) {
		String requestUrl = request.getRequestURL().toString();
		String url = apiUrlPrefix + AppUrlConfig.GET_REMINDER;
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("requestUrl", requestUrl);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);

		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		return GsonUtil.GsonString(resultData);
	}
	
	/**
	 * 只做中转跳转
	 * 
	 * @return
	 */
	@RequestMapping(value = "areaLocation")
	public String areaLocation(HttpServletRequest request) {
		return "hail/areaLocation";
	}
}
