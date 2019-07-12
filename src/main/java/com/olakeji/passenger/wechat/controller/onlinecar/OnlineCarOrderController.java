package com.olakeji.passenger.wechat.controller.onlinecar;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.olakeji.tsp.constant.ConstantInfo;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.entity.BaseProviderBasicConfig;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.passenger.wechat.utils.StringUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.common.passenger.PassengerConstant;
import com.olakeji.tsp.enums.SystemReturn;
import com.olakeji.tsp.result.JsonResult;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.vo.DriverReceiptVo;
/**
 * 
 * 功能： 网约车订单列表
 * @author wanchaofeng
 * @date 2018年4月26日
 *
 */
@Controller
@RequestMapping("")
public class OnlineCarOrderController extends BaseController{

	private Logger LOGGER = LoggerFactory.getLogger(OnlineCarTripController.class);
	
	@Value("${passenger.api.url}")
	private String apiUrlPrefix;
	
	@RequestMapping("/onlinecarOrder/billrules")
	public String billRules(Model model) {
		return "billRules";
	}
	
	@RequestMapping("/bus/toOnlineCarOrderDetail")
	public String orderdetail(HttpServletRequest request,Model model,String orderNo,@RequestParam(required = false,defaultValue = "") String payStatus) {
		String toPay = request.getParameter("toPay");
		if(StringUtil.isEmpty(toPay)){
			toPay = ConstantInfo.toPayType.NO;
		}
		Map<String, String> paramsMap = new HashMap<String, String>();
		if (orderNo == null) {
			return "Error500";
		}
		String token = this.getToken();
		String url = apiUrlPrefix + AppUrlConfig.Online.GET_DRIVER_BY_DRIVERID;
		paramsMap.put("orderNo", orderNo);
		paramsMap.put("token", token);
		long currentTime = System.currentTimeMillis();
		model.addAttribute("currentTime", currentTime);
		paramsMap = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, paramsMap);
		JsonResult resultData = GsonUtil.GsonToBean(jsonResult, JsonResult.class);
		if (resultData.getCode() != SystemReturn.OK.getCode()) {
			LOGGER.info(GsonUtil.GsonString(jsonResult));
			return "Error500";
		}
		model.addAttribute("driverInfo", resultData.getData());
		model.addAttribute("orderNo", orderNo);
		DriverReceiptVo driverInfo = GsonUtil.GsonToBean(GsonUtil.GsonString(resultData.getData()), DriverReceiptVo.class) ;
		byte tripStatus = driverInfo.getTripStatus();
		boolean notPayBoolean = !(StringUtils.isNotEmpty(payStatus) && "1".equals(payStatus));
		if(notPayBoolean &&  tripStatus == PassengerConstant.TRIP_STATUS_ARRIVE_INT){
			toPay =ConstantInfo.toPayType.YES;
		}
		if(tripStatus == PassengerConstant.TRIP_STATUS_WAITLOADING_INT||
				tripStatus == PassengerConstant.TRIP_STATUS_LOADING_INT||
				tripStatus == PassengerConstant.TRIP_STATUS_DEPART_INT
				){
			return "waitInstant"; 
		}else if((tripStatus == PassengerConstant.TRIP_STATUS_GONE_INT || tripStatus == PassengerConstant.TRIP_STATUS_ARRIVE_INT) && !toPay.equals(ConstantInfo.toPayType.YES)){
			return "journey"; 
		}
		Map<String,String> map = new HashMap<String, String>();
		map.put("orderNo", orderNo);
		String postUrl = apiUrlPrefix + AppUrlConfig.BUS_TICKET_ORDER_DETAIL;
		Map<String,String> params = this.genReqApiData(postUrl, map);
		//查询当前车企结算模式(0-预付款:车企已支付服务费,乘客直接支付给车企;1-非预付款:车企未支付服务费,乘客先支付给平台,平台再结算给车企)
		String payTypeStr = HttpUtil.doPostReq(apiUrlPrefix + AppUrlConfig.GET_PROVIDER_PAYTYPE, params);
	    ResultEntity payEntity = (ResultEntity)GsonUtil.GsonToBean(payTypeStr, ResultEntity.class);
	    BaseProviderBasicConfig config = (BaseProviderBasicConfig)GsonUtil.GsonToBean(GsonUtil.GsonString(payEntity.getData()), BaseProviderBasicConfig.class);
	    Byte settleType = config.getIsAdvance();
		//当前车企是否是有预付款
	    model.addAttribute("settleType", settleType);
	    Integer isHavaShareRedBags =0;
	    if( driverInfo.getIsHavaShareRedBags()!= null){
			isHavaShareRedBags =driverInfo.getIsHavaShareRedBags();
		}
		model.addAttribute("isHavaShareRedBags",isHavaShareRedBags);
	    model.addAttribute("contactPhone", driverInfo.getContactPhone());
		return "onlineCarOrderDetail";
	}
	
	
	@RequestMapping("/onlinecarOrder/queryOrderdetail")
	@ResponseBody
	public String queryOrderdetail(Model model,String orderNo,String token) {
		Map<String, String> paramsMap = new HashMap<String, String>();
		String url = apiUrlPrefix + AppUrlConfig.Online.ORDER_DETAIL;
		paramsMap.put("orderNo", orderNo);
		paramsMap.put("token", token);
		model.addAttribute("orderNo", orderNo);
		paramsMap = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, paramsMap);
		return jsonResult;
	}
	
	@RequestMapping("/onlinecarOrder/orderlistBytype")
	@ResponseBody
	public String orderlistBytype(Model model,String tripStatus,String token) {
		Map<String, String> paramsMap = new HashMap<String, String>();
		String url = apiUrlPrefix + AppUrlConfig.Online.ORDER_LIST;
		paramsMap.put("token", token);
		paramsMap.put("tripStatus", tripStatus);
		paramsMap = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, paramsMap);
		LOGGER.info("orderlistBytype返回数据：{}",jsonResult);
		return jsonResult;
	}

	@RequestMapping("/onlinecarOrder/passengerCancelOrder")
	@ResponseBody
	public String passengerCancelOrder(String orderNo, String remark,String token) {
		Map<String, String> paramsMap = new HashMap<String, String>();
		if (orderNo == null) {
			return JsonResult.setReturnStr(SystemReturn.SYS_FAILED);
		}
		String url = apiUrlPrefix + AppUrlConfig.Online.PASSENGER_CANCEL_ORDER;
		paramsMap.put("orderNo", orderNo);
		paramsMap.put("remark", remark);
		paramsMap.put("token", token);
		paramsMap = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, paramsMap);
		JsonResult resultData = GsonUtil.GsonToBean(jsonResult, JsonResult.class);
		if (resultData.getCode() != SystemReturn.OK.getCode()) {
			LOGGER.info(GsonUtil.GsonString(resultData));
			return jsonResult;
		}
		return jsonResult;
	}
	
	/**
	 * 支付前获取微信支付需要的参数
	 * @param request
	 * @return
	 */
	@RequestMapping("/bus/onlinecarOrder/getPrepayInfo")
	@ResponseBody
	public String checkOrderPrepayInfo(HttpServletRequest request){
		String orderNo = request.getParameter("orderNo");
		String recordId = request.getParameter("recordId");		
		String url = apiUrlPrefix + AppUrlConfig.Online.PAY_PREINFO;
		Map<String,String> map = new HashMap<String, String>();
		map.put("orderNo", orderNo);
		map.put("recordId", recordId);
		Map<String,String> params = this.genReqApiData(url, map);
		String jsonResult = HttpUtil.doPostReq(url, params);	
		return jsonResult;
	}
	
	/**
	 * 支付前检查使用优惠券后是否需要零元支付
	 * @param request
	 * @return
	 */
	@RequestMapping("/bus/onlinecarOrder/checkZeroTspPay")
	@ResponseBody
	public String checkZeroTspPay(HttpServletRequest request){
		String orderNo = request.getParameter("orderNo");
		String recordId = request.getParameter("recordId");		
		String url = apiUrlPrefix + AppUrlConfig.Online.CHECK_ZEROPAY;
		Map<String,String> map = new HashMap<String, String>();
		map.put("orderNo", orderNo);
		map.put("recordId", recordId);
		Map<String,String> params = this.genReqApiData(url, map);
		String jsonResult = HttpUtil.doPostReq(url, params);	
		return jsonResult;
	}
	
}
