package com.olakeji.passenger.wechat.controller.bookingcharteredcar;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.controller.onlinecar.BaseOnlineCarController;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.enums.SystemReturn;
import com.olakeji.tsp.utils.StringUtil;

@Controller
@RequestMapping("baseCharteredCar")
public class BaseCharteredCarController extends BaseController {

	private Logger LOGGER = LoggerFactory.getLogger(BaseCharteredCarController.class);

	@Value("${passenger.api.url}")
	private String apiUrlPrefix;

	/**
	 * 检查车企是否开通预约租车
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping("/charteredCarIndex")
	public @ResponseBody String checkCharteredCarConfig(HttpServletRequest request) {
		String providerId = request.getParameter("providerId");
		if (StringUtil.isEmpty(providerId)) {
			return ResultEntity.setFailJson(SystemReturn.PARAM_ERROR.getCode(), "参数错误");
		}
		String url = apiUrlPrefix + AppUrlConfig.CharteredCar.QUERY_CHARTERED_CAR_CONFIG;
		String token = getToken();
		Map<String, String> map = new HashMap<String, String>();
		map.put("providerId", providerId);
		map.put("token", token);
		String resultStr = HttpUtil.doPostReq(url, map);
		return resultStr;
	}

}
