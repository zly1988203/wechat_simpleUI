package com.olakeji.passenger.wechat.controller.bookingcharteredcar;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.cache.RedisUtil;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.entity.BaseUser;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.passenger.wechat.utils.StringUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.enums.SystemReturn;
import com.olakeji.tsp.utils.GsonUtil;

@Controller
@RequestMapping(value = "charteredCarOrder")
public class CharteredCarOrderController extends BaseController {
	private Logger LOGGER = LoggerFactory.getLogger(CharteredCarOrderController.class);

	@Value("${passenger.api.url}")
	private String apiUrlPrefix;

	
	@Autowired
	private RedisUtil redisUtil;
	/**
	 * 检查车企是否开通预约租车
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping("/addCharteredCarOrder")
	@ResponseBody
	public String addCharteredCarOrder(HttpServletRequest request) {
		String requestUrl = request.getRequestURL().toString();
		String departStation = request.getParameter("departStation"); // 出发时间
		String arriverStation = request.getParameter("arriverStation"); // 到达时间
		String tripType = request.getParameter("tripType"); // 行程类型
		String departTime = request.getParameter("departTime"); // 出发时间
		String returnTime = request.getParameter("returnTime"); // 到达时间
		String numbers = request.getParameter("numbers"); // 出行人数
		String mobile = request.getParameter("mobile"); // 电话号码
		String remark = request.getParameter("remark"); // 备注
		String providerMobile = request.getParameter("providerMobile");
		
		if (StringUtil.isEmpty(departStation)) {
			return ResultEntity.setFailJson(SystemReturn.PARAM_ERROR.getCode(), "参数错误");
		}
		if (StringUtils.isEmpty(arriverStation)) {
			return ResultEntity.setFailJson(SystemReturn.PARAM_ERROR.getCode(), "参数错误");
		}
		if (StringUtil.isEmpty(tripType)) {
			return ResultEntity.setFailJson(SystemReturn.PARAM_ERROR.getCode(), "参数错误");
		}
		if (StringUtil.isEmpty(departTime)) {
			return ResultEntity.setFailJson(SystemReturn.PARAM_ERROR.getCode(), "参数错误");
		}
		if (StringUtil.isEmpty(departStation)) {
			return ResultEntity.setFailJson(SystemReturn.PARAM_ERROR.getCode(), "参数错误");
		}
		if (StringUtil.isEmpty(numbers)) {
			return ResultEntity.setFailJson(SystemReturn.PARAM_ERROR.getCode(), "参数错误");
		}
		if (StringUtil.isEmpty(mobile)) {
			return ResultEntity.setFailJson(SystemReturn.PARAM_ERROR.getCode(), "参数错误");
		}

		String url = apiUrlPrefix + AppUrlConfig.CharteredCar.ADD_CHARTERED_CAR_ORDER;
		Map<String, String> map = new HashMap<String, String>();
		map.put("requestUrl", requestUrl);
		map.put("departStation", departStation);
		map.put("arriverStation", arriverStation);
		map.put("tripType", tripType);
		map.put("departTime", departTime);
		map.put("returnTime", returnTime);
		map.put("providerMobile", providerMobile);
		map.put("numbers", numbers);
		map.put("mobile", mobile);
		map.put("remark", remark);
		map = this.genReqApiData(url, map);
		String resultStr = HttpUtil.doPostReq(url, map);
		return resultStr;
	}
}
