package com.olakeji.passenger.wechat.controller.activity;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.google.gson.reflect.TypeToken;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.controller.IndexController;
import com.olakeji.passenger.wechat.entity.BaseBus;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.DateUtils;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.utils.StringUtil;

@Controller
@RequestMapping(value = "activityLine")
public class ActivityLineController extends BaseController {

	@Value("${passenger.api.url}")
	protected String apiUrlPrefix;

	@SuppressWarnings("unchecked")
	@RequestMapping("/activityLineList")
	public String getActivityLineList(HttpServletRequest request, Model model) {
		String lineId = request.getParameter("lineId");
		String lineType = request.getParameter("lineType");
		String departDate = request.getParameter("departDate");
		if (StringUtil.isEmpty(departDate)) {
			departDate = DateUtils.format(new Date(), DateUtils.DATE_SMALL_STR);
		}
		String url = apiUrlPrefix + AppUrlConfig.ACTIVITY_LINE_INFO;
		Map<String, String> params = new HashMap<String, String>();
		params.put("lineId", lineId);
		params.put("lineType", lineType);
		params.put("departDate", departDate);
		Map<String, String> postParams = new HashMap<String, String>();
		postParams = this.genReqApiData(url, params);
		String busData = HttpUtil.doPostReq(url, postParams);
		ResultEntity resultEntity = GsonUtil.GsonToBean(busData, ResultEntity.class);
		if (resultEntity.getCode().equals(Constant.SUCCESS)) {
			if (resultEntity.getData() != null) {
				String lineListData = GsonUtil
						.GsonString(((Map<String, Object>) resultEntity.getData()).get("baseBusList"));
				List<BaseBus> data = GsonUtil.GsonToList(lineListData, new TypeToken<List<BaseBus>>() {
				});
				String presellDay = (String) ((Map<String, Object>) resultEntity.getData()).get("presellDay");
				String remainShowNumber = (String) ((Map<String, Object>) resultEntity.getData())
						.get("remainShowNumber");
				String lineName = "";
				if (data != null && data.size() == 1) {
					BaseBus baseBus = data.get(0);
					lineName = baseBus.getDepartCityName() + "-" + baseBus.getArriveCityName();
				}
				BaseBus searchBusCondition = new BaseBus();
				searchBusCondition.setDepartDate(DateUtils.parse(departDate, DateUtils.DATE_SMALL_STR));
				model.addAttribute("presellDay", presellDay);
				model.addAttribute("baseBusList", data);
				model.addAttribute("searchCondition", searchBusCondition);
				model.addAttribute("lineId", lineId);
				model.addAttribute("lineType", lineType);
				model.addAttribute("lineName", lineName);
				model.addAttribute("searchFlag", IndexController.LIST_FOR_ACTIVITY);
				model.addAttribute("currentDateStr",DateUtils.format(new Date(), DateUtils.DATE_FORMAT));
				if (lineType.equals("1") || lineType.equals("3")) {
					// 定制班线
					model.addAttribute("remainShowNumber", Integer.parseInt(remainShowNumber));
					return "lineList";
				} else if (lineType.equals("2")) {
					// 上下班班线
					return "commuteLineList";
				}
			}
		}
		return null;
	}
}
