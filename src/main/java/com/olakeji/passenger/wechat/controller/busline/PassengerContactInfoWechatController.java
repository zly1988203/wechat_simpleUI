package com.olakeji.passenger.wechat.controller.busline;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;

/**
 * 大巴常用联系页面空值
 * @author ZERO
 *
 */
@Controller
@RequestMapping("bus/passengerContactInfo")
public class PassengerContactInfoWechatController extends BaseController{

	@Value("${passenger.api.url}")
	private String apiUrlPrefix;
	@Value("${app.id}")
	private Integer appId;
	@Value("${app.key}")
	private String appKey;
	@Value("${client.type}")
	private Integer clientType;
	@Value("${app.version}")
	private Double appVersion;
	@Value("${device_id}")
	private String drviceId;

	/**
	 * list页,空页，删除页
	 * @param request
	 * @param commonParam
	 * @param model
	 * @param pageType 为1跳转删除页
	 * @return
	 */
	@RequestMapping(value="toList")
	public String toPeopleList(HttpServletRequest request,String token,Model model,Integer pageType){
		String url = apiUrlPrefix + AppUrlConfig.GET_FREQUENT_PASSENGERS;
		Map<String, String> paramsMap = new HashMap<String,String>(); 
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		
		ResultEntity result = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		model.addAttribute("frePassList", result.getData());
		String returnPage = "";
		returnPage = (pageType != null && pageType == 1)==true?"/frequentPassengers/people-del":"/frequentPassengers/people-list";
		return returnPage;
	}
	
	/**
	 * 查询常量乘车人
	 * @param token
	 * @return
	 */
	@RequestMapping("passengerList")
	public @ResponseBody String queryFrequentPassengerList(String token){
		Map<String, Object> params = new HashMap<String,Object>();
		params.put("token", this.getToken());
		params.put("appId", appId);
		params.put("clientType", clientType);
		params.put("appVersion", appVersion);
		params.put("deviceId", drviceId);
		params.put("timestamp", new Date().getTime());
		params.put("appKey", appKey);
		String jsonResult = HttpUtil.doPostRequest(apiUrlPrefix+AppUrlConfig.GET_FREQUENT_PASSENGERS,params);//获取常用联系人数据
		return jsonResult;
	}
	/**
	 * 转添加页
	 * @return
	 */
	@RequestMapping(value="/toAdd")
	public String toAddPage(String token,Model model){
		String url = apiUrlPrefix + AppUrlConfig.IS_NEED_IDCARD_NUMBER;
		Map<String, String> paramsMap = new HashMap<String,String>(); 
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity result = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		model.addAttribute("isNeedIdCardNum", result.getData().toString());
		//if(result.getData().toString().contains("1")){
			return "/frequentPassengers/people-add";
		/*}else{
			return "/frequentPassengers/people-addNoId";

		}*/
	}
	/**
	 * 转修改页
	 * @param x 修改前信息
	 * @param model
	 * @return
	 */
	@RequestMapping(value="/toUpdatePage")
	public String toUpdatePage(String id,Model model){
		String url = apiUrlPrefix + AppUrlConfig.GET_CONTACT;
		Map<String, String> paramsMap = new HashMap<String,String>(); 
		paramsMap.put("passengerContactInfoId", id);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity resultData=GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		if(resultData.getCode()!=Constant.SUCCESS){
			return "Error500";
		}
		Map<String,Object> map = GsonUtil.GsonToMaps(GsonUtil.GsonString(resultData.getData()));
		model.addAttribute("passenger", map.get("passenger"));
		model.addAttribute("isNeedIdCardNum", map.get("isNeedIdCardNum"));
		return "/frequentPassengers/people-edit";
	}
	
	/**
	 * 加载乘客详细信息
	 * @param id
	 * @return
	 */
	@RequestMapping(value="getPassengerDetailInfo")
	public @ResponseBody  String getPassengerDetailInfo(String id){
		String url = apiUrlPrefix + AppUrlConfig.GET_CONTACT;
		Map<String, String> paramsMap = new HashMap<String,String>(); 
		paramsMap.put("passengerContactInfoId", id);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		return jsonResult;
	}
	
	@RequestMapping(value="getContacts")
	@ResponseBody
	public String getPassengerContactList(String token){
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("token", this.getToken());
		String jsonResult = HttpUtil.doPostRequest(apiUrlPrefix+AppUrlConfig.GET_FREQUENT_PASSENGERS,map);//获取常用联系人数据
		return jsonResult;
	}
	
	@RequestMapping(value="addContact")
	@ResponseBody
	public String addContact(String token,String passengerName,String mobile,String idCardNo){
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("token", this.getToken());
		map.put("passengerName", passengerName);
		map.put("mobile", mobile);
		map.put("idCardNo", idCardNo);
		String jsonResult = HttpUtil.doPostRequest(apiUrlPrefix+AppUrlConfig.ADD_CONTACT ,map);//获取常用联系人数据
		return jsonResult;
	}
	
	@RequestMapping(value="delete")
	@ResponseBody
	public String delete(String token,String idArray){
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("token", this.getToken());
		map.put("idArray", idArray);
		String jsonResult = HttpUtil.doPostRequest(apiUrlPrefix+AppUrlConfig.DELETE_CONTACT ,map);//获取常用联系人数据
		return jsonResult;
	}
	
	@RequestMapping(value="update")
	@ResponseBody
	public String update(String token,Integer id,String passengerName,String mobile,String idCardNo){
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("token", this.getToken());
		map.put("passengerName", passengerName);
		map.put("id", id);
		map.put("mobile", mobile);
		map.put("idCardNo", idCardNo);
		String jsonResult = HttpUtil.doPostRequest(apiUrlPrefix+AppUrlConfig.UPDATE_CONTACT ,map);//获取常用联系人数据
		return jsonResult;
	}
}

