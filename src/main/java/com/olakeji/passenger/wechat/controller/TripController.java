package com.olakeji.passenger.wechat.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.DateUtils;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.utils.RegexUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 大巴相关业务控制器
 * 
 * @author herry.zhang
 *
 */
@Controller
public class TripController extends BaseController {

	@Value("${passenger.api.url}")
	private String apiUrlPrefix;
	
	Logger logger=LoggerFactory.getLogger(TripController.class);

	@RequestMapping("/trip/tripListByDate")
	public @ResponseBody String getTripList(Model model) {
		String date = request.getParameter("date");
		if (StringUtils.isEmpty(date)) {
			date = DateUtils.format(new Date(), "yyyy-MM-dd");
		}
		Map<String, String> params = new HashMap<String, String>();
		String token = this.getToken();
		params.put("token", token);
		params.put("date", date);
		String url = apiUrlPrefix + AppUrlConfig.TRIP_LIST;
		params = this.genReqApiData(url, params);
		String busData = HttpUtil.doPostReq(url, params);
		logger.info("行程列表展示信息:@{}",busData);
		return busData;
	}

	@RequestMapping("/trip/toTripListPage")
	public String getTripListDate(Model model,String tripDate  ,HttpServletResponse response, HttpServletRequest request) {
		return commonRedirect(request,response,"/cityBus/myTripList");
	}
}
