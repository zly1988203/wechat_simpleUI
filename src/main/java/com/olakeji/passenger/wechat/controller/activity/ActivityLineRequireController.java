package com.olakeji.passenger.wechat.controller.activity;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.common.passenger.ResCodeConstant;
import com.olakeji.tsp.exception.TspException;
import com.olakeji.tsp.utils.QiniuDown;
import com.olakeji.tsp.validation.Asserts;

@Controller
@RequestMapping("/activity/require/")
public class ActivityLineRequireController extends BaseController {
	private static final Logger LOGGER = LoggerFactory.getLogger(ActivityLineRequireController.class);

	@RequestMapping("line")
	@SuppressWarnings("unchecked")
	public String toLineRequire(HttpServletRequest request,Model model) {
		try {
			String apiUrl = AppUrlConfig.Activity.ACTIVITY_LINE_REQUIRE_ADD_RULE;
			String requestUrl = request.getRequestURL().toString();
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("requestUrl", requestUrl);
			ResultEntity result = this.doApiPostRequest(apiUrl, map);
			String rule = (String) ((Map<String, String>) result.getData()).get("rule");
			String providerName = (String) ((Map<String, String>) result.getData()).get("providerName");
			model.addAttribute("rule", rule);
			model.addAttribute("providerName", providerName);
		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.error("获取搜集线路规则异常:",e);
		}
		return "/requireline"; 
	}

	@RequestMapping("add")
	@ResponseBody
	public ResultEntity add(HttpServletRequest request) {
		try {
			Map<String, Object> param = this.getParam(request);
			return this.doApiPostRequest(AppUrlConfig.Activity.ACTIVITY_LINE_REQUIRE_ADD, param);
		} catch (TspException ex) {
			LOGGER.error("添加线路异常:", ex);
			return ResultEntity.setException(ex);
		} catch (Exception e) {
			LOGGER.error("添加线路异常:", e);
		}
		return ResultEntity.setException();
	}

	@RequestMapping("success")
	@SuppressWarnings("unchecked")
	public String addLineSuccess(HttpServletRequest request, Model model){
		try {
			String apiUrl = AppUrlConfig.Activity.ACTIVITY_LINE_REQUIRE_ADD_RULE;
			String requestUrl = request.getRequestURL().toString();
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("requestUrl", requestUrl);
			ResultEntity result = this.doApiPostRequest(apiUrl, map);
			String rule = (String) ((Map<String, String>) result.getData()).get("rule");
			String wechatQrcodeUrl = (String) ((Map<String, String>) result.getData()).get("wechatQrcodeUrl");
			String providerName = (String) ((Map<String, String>) result.getData()).get("providerName");
			model.addAttribute("rule", rule);
			model.addAttribute("providerName", providerName);
			model.addAttribute("wechatQrcodeUrl", QiniuDown.DOAMIN + wechatQrcodeUrl);
		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.error("获取搜集线路规则异常:",e);
		}
		return "requirelinesuccess";
	}
	
	private Map<String, Object> getParam(HttpServletRequest request) throws TspException {
		String departAddress = request.getParameter("departAddress");
		String departDate = request.getParameter("departDate");
		String departProvinceId = request.getParameter("departProvinceId");
		String departProvince = request.getParameter("departProvince");
		String departCityId = request.getParameter("departCityId");
		String departCity = request.getParameter("departCity");
		String departAreaId = request.getParameter("departAreaId");
		String departArea = request.getParameter("departArea");
		String arriveProvinceId = request.getParameter("arriveProvinceId");
		String arriveProvince = request.getParameter("arriveProvince");
		String arriveCityId = request.getParameter("arriveCityId");
		String arriveCity = request.getParameter("arriveCity");

		String arriveAreaId = request.getParameter("arriveAreaId");
		String arriveArea = request.getParameter("arriveArea");
		String arriveAddress = request.getParameter("arriveAddress");

		String backDate = request.getParameter("backDate");
		String mobile = request.getParameter("mobile");
		String isBack = request.getParameter("isBack");

		Asserts.isBlank(departAddress, "出发地不能为空");
		Asserts.isBlank(departDate, "出发日期不能为空");
		Asserts.isBlank(departProvinceId, "出发省不能为空");
		Asserts.isBlank(departProvince, "出发省不能为空");
		Asserts.isBlank(departCityId, "出发城市不能为空");
		Asserts.isBlank(departCity, "出发城市不能为空");
		Asserts.isBlank(departAreaId, "出发地区不能为空");
		Asserts.isBlank(departArea, "出发地区不能为空");
		Asserts.isBlank(arriveProvinceId, "到达省不能为空");
		Asserts.isBlank(arriveProvince, "到达省不能为空");
		Asserts.isBlank(arriveCityId, "到达城市不能为空");
		Asserts.isBlank(arriveCity, "到达城市不能为空");
		Asserts.isBlank(arriveAreaId, "到达地区不能为空");
		Asserts.isBlank(arriveArea, "到达地区不能为空");
		Asserts.isBlank(arriveAddress, "到达详细位置不能为空");
		if(isBack.equals("1")){
			Asserts.isBlank(backDate, "返程日期不能为空");
		}
		if(!this.checkMobile(mobile)){
			throw new TspException(ResCodeConstant.SYSTEM_PARAM_INVALID,"请输入正确的手机号码");
		}
		String requestUrl = request.getRequestURL().toString();
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("departAddress", departAddress);
		param.put("departDate", departDate);
		param.put("departProvinceId", departProvinceId);
		param.put("departProvince", departProvince);
		param.put("departCityId", departCityId);
		param.put("departCity", departCity);
		param.put("departAreaId", departAreaId);
		param.put("departArea", departArea);
		param.put("arriveProvinceId", arriveProvinceId);
		param.put("arriveProvince", arriveProvince);
		param.put("arriveCityId", arriveCityId);
		param.put("arriveCity", arriveCity);
		param.put("arriveAreaId", arriveAreaId);
		param.put("arriveArea", arriveArea);
		param.put("arriveAddress", arriveAddress);
		param.put("type", isBack);
		param.put("backDate", backDate);
		param.put("mobile", mobile);
		param.put("requestUrl", requestUrl);
		return param;
	}
	
	private boolean checkMobile(String mobile){
		boolean flag = true;
		if(StringUtils.isEmpty(mobile)){
			flag = false;
		}
		//Pattern p = Pattern.compile("^((13[0-9])|(15[^4,\\D])|(18[0,0-9]))\\d{8}$");  
		//Matcher m = p.matcher(mobile);
		//flag = m.matches();
		return flag;
	}
	
	@RequestMapping("getAllCitys")
	@ResponseBody
	public String getAllCitys(){
		String url = apiUrlPrefix + AppUrlConfig.Activity.GET_ALL_CITYS;
		Map<String, String> paramsMap = new HashMap<String, String>();
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		return jsonResult;
	}

}
