package com.olakeji.passenger.wechat.controller.hail.onlinecar;

import com.olakeji.cache.RedisUtil;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.hail.HailController;
import com.olakeji.passenger.wechat.entity.OrderTrip;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.constant.OnlineCarConstant;
import com.olakeji.tsp.utils.DateUtils;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.utils.StringUtil;
import com.olakeji.tsp.vo.OnlineTripVo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@Controller("HailOnlineCarTripController")
@RequestMapping("/hail/onlineTrip")
public class OnlineCarTripController extends HailController {

	@Autowired
	private RedisUtil redisUtil;
	
	@RequestMapping("/checkUnfinishedTripAndOrder")
	@ResponseBody
	public String checkUnfinishedTripAndOrder(HttpServletRequest request){
		String url = apiUrlPrefix + AppUrlConfig.Online.CHECK_TRIP_STATUS;
		Map<String, String> params = this.getMap(request);
		params = this.genReqApiData(url, params);
		String resultString = HttpUtil.doPostReq(url, params);
		return resultString;
	}
	
	@RequestMapping("/addTrip")
	@ResponseBody
	public String addTrip(HttpServletRequest request) {
		Map<String, String> params = this.getMap(request);
		String departTime = params.get("departTime");
		if (!StringUtil.isEmpty(departTime)) {
			long departTimeL = 0;
			departTimeL = DateUtils.dateToUnixTimestamp(departTime, "yyyy-MM-dd HH:mm");
			params.put("departTime", String.valueOf(departTimeL));
		}
		String url = apiUrlPrefix + AppUrlConfig.Online.INIT_TRIP;
		params = this.genReqApiData(url, params);
		String jsonResult = HttpUtil.doPostReq(url, params);
		return jsonResult;
	}
	
	@RequestMapping("/cancelTrip")
	@ResponseBody
	public String cancelTrip(HttpServletRequest request){
		String tripNo = request.getParameter("tripNo");
		String cancleType =request.getParameter("cancleType");
		if(StringUtil.isEmpty(tripNo)){
			return ResultEntity.setFailJson("行程不存在或已被删除");
		}
		String token = this.getToken();
		Map<String,String> params = new HashMap<String, String>();
		params.put("tripNo", tripNo);
		params.put("token", token);
		params.put("cancleType",cancleType);
		String postUrl = apiUrlPrefix + AppUrlConfig.Online.CANCEL_TRIP;
		params = this.genReqApiData(postUrl, params);
		String resultStr = HttpUtil.doPostReq(postUrl, params);
		return resultStr;
	}

	@RequestMapping("/retryInitTrip")
	@ResponseBody
	public void  retryInitTrip(HttpServletRequest request,String tripNo){
		if (StringUtils.isBlank(tripNo)) return;
		Object orderTripObj = redisUtil.get(tripNo);

		if (orderTripObj == null) return;
		OrderTrip orderTrip = GsonUtil.GsonToBean(orderTripObj.toString(), OrderTrip.class);
		OnlineTripVo tripVo = new OnlineTripVo();
		tripVo.setName(orderTrip.getUserMobile());
		tripVo.setId(orderTrip.getUserId());
		//tripVo.setCityCode();
		tripVo.setAdCode(Integer.valueOf(orderTrip.getDepartCityid()));
		String distance = redisUtil.getString(OnlineCarConstant.INSTANT_ORDER_PUSH_RANGE);
		tripVo.setDistance(distance);
		tripVo.setLatitude(orderTrip.getDepartLat().doubleValue());
		tripVo.setLongitude(orderTrip.getDepartLng().doubleValue());
		tripVo.setPrice(orderTrip.getPrice() + "");
		tripVo.setStartLocation(orderTrip.getDepartTitle());
		tripVo.setEndLocation(orderTrip.getArriveTitle());
		tripVo.setType(Integer.valueOf(orderTrip.getDepartType() + ""));
		tripVo.setTripNo(tripNo);
		tripVo.setProviderId(orderTrip.getProviderId());
		tripVo.setStatus(orderTrip.getStatus());
		tripVo.setTripType(orderTrip.getTripType());
		redisUtil.convertAndSend("QUE:PassengerTripTopic", GsonUtil.GsonString(tripVo));
	}
	

	@RequestMapping("/tripPrice")
	@ResponseBody
	public String tripPrice(HttpServletRequest request) {
		Map<String, String> params = this.getMap(request);
		String url = apiUrlPrefix + AppUrlConfig.Online.TRIP_PRICE;
		params = this.genReqApiData(url, params);
		String jsonResult = HttpUtil.doPostReq(url, params);
		return jsonResult;

	}

	private Map<String, String> getMap(HttpServletRequest request) {
		Enumeration<String> enu = request.getParameterNames();
		Map<String, String> param = new HashMap<String, String>();
		while (enu.hasMoreElements()) {
			String paraName = (String) enu.nextElement();
			param.put(paraName, request.getParameter(paraName));
		}
		return param;
	}


}
