package com.olakeji.passenger.wechat.controller.travel;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.alibaba.fastjson.JSON;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.tsp.common.ResultEntity;

/**
 * 
 * 功能： 旅游线路信息controller
 * @author WanChaoFeng
 * @date 2018年1月19日
 *
 */
@Controller
@RequestMapping("travel")
public class TravelLineInfoController extends BaseController {
	private static final Logger LOGGER = LoggerFactory.getLogger(TravelLineInfoController.class);

	/**
	 * 查询旅游线路信息
	 * @param request
	 * @param model
	 * @return
	 */
	@RequestMapping("/travelLineInfo")
	public String queryTraveLineInfo(HttpServletRequest request,Model model) {
		try {
			String apiUrl = AppUrlConfig.Travel.Travel_LINE_QUERY;
			String fromUrl = request.getParameter("fromUrl");
			Map<String, Object> map = new HashMap<String, Object>();
			String lineId = request.getParameter("lineId");
			map.put("lineId", lineId);
			ResultEntity result = this.doApiPostRequest(apiUrl, map);
			Object info = result.getData();
			if(info instanceof String&&"".equals(info)){
				info=null;
			}
			model.addAttribute("busLineInfo", JSON.toJSON(info));
			model.addAttribute("fromUrl",fromUrl);
		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.error("获取旅游线路信息异常:",e);
		}
		
		return "travellineInfo"; 
	}
}
