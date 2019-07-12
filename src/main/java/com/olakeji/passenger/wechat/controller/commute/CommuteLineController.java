package com.olakeji.passenger.wechat.controller.commute;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.reflect.TypeToken;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.controller.IndexController;
import com.olakeji.passenger.wechat.entity.BaseBus;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.passenger.wechat.utils.StringUtil;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.DateUtils;
import com.olakeji.tsp.utils.GsonUtil;

@Controller
public class CommuteLineController extends BaseController {

	private Logger LOGGER = LoggerFactory.getLogger(getClass());

	@Value("${passenger.api.url}")
	private String apiUrlPrefix;

	/**
	 * 当前的模式
	 */
	@Value("${mode}")
	private String mode;

	/**
	 * 搜索上下班车次
	 * 
	 * @param request
	 * @param baseBus
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "commuteLine/searchCommute")
	public String searchBus(HttpServletRequest request, BaseBus baseBus, String token, Model model, String startAddr,
			String endAddr) {
		String requestUrl = request.getRequestURL().toString();
		Integer departCityId = baseBus.getDepartCityId() == null ? 0 : baseBus.getDepartCityId();
		Integer arriveCityId = baseBus.getArriveCityId() == null ? 0 : baseBus.getArriveCityId();
		String url = apiUrlPrefix + AppUrlConfig.SEARCH_COMMUTE + "?requestUrl=" + requestUrl + "&departLng="
				+ baseBus.getDepartLng() + "&departLat=" + baseBus.getDepartLat() + "&arriveLng="
				+ baseBus.getArriveLng() + "&arriveLat=" + baseBus.getArriveLat() + "&departAreaName="
				+ baseBus.getDepartCityName() + "&arriveAreaName=" + baseBus.getArriveCityName() + "&departAreaId=" + departCityId + "&arriveAreaId=" + arriveCityId;
		String busData = HttpUtil.doGetRequest(url);
		LOGGER.info("搜索班次请求地址为:{},返回@{}", url);
		ResultEntity resultEntity = GsonUtil.GsonToBean(busData, ResultEntity.class);
		if (resultEntity.getCode() == Constant.SUCCESS) {
			if (resultEntity.getData() != null) {
				String lineListData = GsonUtil
						.GsonString(((Map<String, Object>) resultEntity.getData()).get("baseBusList"));
				List<BaseBus> data = GsonUtil.GsonToList(lineListData, new TypeToken<List<BaseBus>>() {
				});
				model.addAttribute("baseBusList", data);
				model.addAttribute("searchCondition", baseBus);
				model.addAttribute("searchFlag", IndexController.LIST_FLAG_SEARCH);
				model.addAttribute("departCityName", baseBus.getDepartCityName());
				model.addAttribute("arriveCityName", baseBus.getArriveCityName());
				model.addAttribute("startAddr", startAddr);
				model.addAttribute("endAddr", endAddr);
			}
		}
		return "commuteLineList";
	}

	/**
	 * 点击热门线路后进入到子列表页
	 * 
	 * @param request
	 * @param token
	 * @param model
	 * @param lineId
	 * @param lat
	 * @param lng
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "commuteList/hotLineList", method = RequestMethod.GET)
	public String toLineList(Integer lineId, String lat,
							 String lng,  @RequestParam(defaultValue = "",required = false) String lineName,
							 @RequestParam(defaultValue = "",required = false) String qrcId,
							 @RequestParam(defaultValue = "",required = false) String distrib) throws UnsupportedEncodingException {
		String redirectUrl = "/commutingBus/searchLineResult?lineId="+lineId+"&qrcId="+qrcId+"&searchType=4"+"&lat="
				+ lat + "&lng=" + lng+ "&lineType="+Constant.BusLineType.commuteLine+"&lineName="+ URLEncoder.encode(lineName, "UTF-8");
		if(StringUtils.isNotEmpty(distrib)){
			redirectUrl+="&distrib="+distrib;
		}
		return "redirect:"+redirectUrl;
	}

	@RequestMapping("/commuteLine/checkBaseBusSchedule")
	@ResponseBody
	public String checkBaseBusSchedule(HttpServletRequest request) {
		String token = request.getParameter("token");
		String busId = request.getParameter("busId");
		String url = apiUrlPrefix + AppUrlConfig.COMMUTE_ONE_BASE_BUS_LIST;
		Map<String, String> map = new HashMap<String, String>();
		map.put("token", token);
		map.put("busId", busId);
		map = this.genReqApiData(url, map);
		String jsonResult = HttpUtil.doPostReq(url, map);
		return jsonResult;
	}
}
