package com.olakeji.passenger.wechat.controller.hail.onlinecar;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.controller.hail.HailController;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.enums.SystemReturn;
import com.olakeji.tsp.result.JsonResult;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.utils.StringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * 网约车基础配置页面
 * @author walle
 *
 */

@Controller("HailBaseOnlineCarController")
@RequestMapping("/hail/baseOnlineCar")
public class BaseOnlineCarController extends HailController {
	private Logger LOGGER = LoggerFactory.getLogger(BaseOnlineCarController.class);

	/**
	 * 获取开通的城市
	 * @param request
	 * @return
	 */
	@RequestMapping("/openCity")
	public @ResponseBody String openCity(HttpServletRequest request){
		//获取当前车企开通的城市
		String openCityUrl = apiUrlPrefix + AppUrlConfig.Online.OPEN_CITY;
		Map<String,String> map = new HashMap<String,String>();
		String token = getToken();
		map.put("token", token);
		map = this.genReqApiData(openCityUrl, map);
		String result = HttpUtil.doPostReq(openCityUrl, map);
		return result;
	}
	/**
	 * 校验当前城市是否开通网约车业务
	 * @param request
	 * @return
	 */
	@RequestMapping("/checkCityIsOpen")
	public @ResponseBody String checkCityIsOpen(HttpServletRequest request){
		String lng = request.getParameter("lng");
		String lat = request.getParameter("lat");
		if(StringUtil.isEmpty(lng) || StringUtil.isEmpty(lat)){
			return ResultEntity.setFailJson(SystemReturn.PARAM_ERROR.getCode(),"参数错误");
		}
		String url = apiUrlPrefix + AppUrlConfig.Online.OPEN_CITY_DETAIL;
		String token = getToken();
		Map<String,String> map = new HashMap<String,String>();
		map.put("lng", lng);
		map.put("lat",lat);
		map.put("token", token);
		map = this.genReqApiData(url, map);
		String resultStr = HttpUtil.doPostReq(url, map);
		return resultStr;
	}
	
	/**
	 *  获取价格规则
	 * @param token
	 * @param cityId 开通城市表的自增Id 不是城市Id
	 * @param type 业务类型 1-即时行程 2-预约行程
	 * @return
	 */
	@RequestMapping("/queryPriceRule")
	@ResponseBody
	public String queryBillRule(String token,String cityId,String type){
		Map<String, String> paramsMap = new HashMap<String, String>();
		String url = apiUrlPrefix + AppUrlConfig.Online.GET_PRICE_RULE;
		paramsMap.put("cityId", cityId);
		paramsMap.put("token", token);
		paramsMap.put("type", type);
		paramsMap = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, paramsMap);
		LOGGER.info("orderlistBytype返回数据：{}",jsonResult);
		return jsonResult;
	}
	
	@RequestMapping("/priceRule")
	@ResponseBody
	public String billRule(String token, String areaId, String departType){
		Map<String, String> paramsMap = new HashMap<String, String>();
		String url = apiUrlPrefix + AppUrlConfig.Online.PRICE_RULE;
		paramsMap.put("areaId", areaId);
		paramsMap.put("token", token);
		paramsMap.put("departType", departType);
		paramsMap = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, paramsMap);
		LOGGER.info("orderlistBytype返回数据：{}",jsonResult);
		return jsonResult;
	}
	
	/**
	 * 获取车企协议
	 * @param request
	 * @return
	 */
	@RequestMapping("/providerAgreement")
	@ResponseBody
	public String providerAgreement(HttpServletRequest request,Integer providerId, String token){
		providerId = providerId == null ? 0 : providerId;
		String url = apiUrlPrefix + AppUrlConfig.Online.PROVIDER_AGREEMENT;
		Map<String, String> params = new HashMap<String,String>();
		params.put("token", token);
		params.put("providerId", providerId + "");
		params = this.genReqApiData(url, params);
		String resultStr = HttpUtil.doPostReq(url, params);
		return resultStr;
	}
	
	/**
	 * 获取附近车辆数
	 * @param request
	 * @return
	 */
	@RequestMapping("/carNumber")
	@ResponseBody
	public String getCarNumber(HttpServletRequest request){
		String token = request.getParameter("token");
		String url = apiUrlPrefix + AppUrlConfig.Online.CAR_NUMBERS;
		Map<String, String> params = new HashMap<String,String>();
		params.put("token", token);
		params = this.genReqApiData(url, params);
		String resultStr = HttpUtil.doPostReq(url, params);
		return resultStr;
	}
	
	
	@RequestMapping("/sendSosMsg")
	@ResponseBody
	public String sendSosMsg(HttpServletRequest request){
		String token = request.getParameter("token");
		String orderNo = request.getParameter("orderNo");
		String url = apiUrlPrefix + AppUrlConfig.Online.SOS_MESSAGE;
		Map<String, String> params = new HashMap<String,String>();
		params.put("token", token);
		params.put("orderNo", orderNo);
		params = this.genReqApiData(url, params);
		String resultStr = HttpUtil.doPostReq(url, params);
		return resultStr;
	}
	
	@RequestMapping("/share")
	public String share(String orderNo,Model model){
		Map<String, String> paramsMap = new HashMap<String, String>();
		if (orderNo == null) {
			return "Error500";
		}
		String url = apiUrlPrefix + AppUrlConfig.Online.ORDER_SHARE;
		paramsMap.put("orderNo", orderNo);
		paramsMap = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, paramsMap);
		JsonResult resultData = GsonUtil.GsonToBean(jsonResult, JsonResult.class);
		if (resultData.getCode() != SystemReturn.OK.getCode()) {
			LOGGER.info(GsonUtil.GsonString(jsonResult));
			return "Error500";
		}
		model.addAttribute("driverInfo", resultData.getData());
		model.addAttribute("orderNo", orderNo);
		return "hail/share";
	}
	
	@RequestMapping("/addComplaint")
	@ResponseBody
	public String addComplaint(@RequestParam String orderNo,@RequestParam String content,@RequestParam String token,Model model){
		Map<String, String> paramsMap = new HashMap<String, String>();
		String url = apiUrlPrefix + AppUrlConfig.Online.ADD_COMPLAINT;
		paramsMap.put("orderNo", orderNo);
		paramsMap.put("content", content);
		paramsMap.put("token", token);
		paramsMap = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, paramsMap);
		return jsonResult;
	}
	
	
	@RequestMapping("/queryComplaint")
	@ResponseBody
	public String queryComplaint(@RequestParam String orderNo,@RequestParam String token,Model model){
		Map<String, String> paramsMap = new HashMap<String, String>();
		String url = apiUrlPrefix + AppUrlConfig.Online.QUERY_COMPLAINT;
		paramsMap.put("orderNo", orderNo);
		paramsMap.put("token", token);
		paramsMap = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, paramsMap);
		return jsonResult;
	}
}
