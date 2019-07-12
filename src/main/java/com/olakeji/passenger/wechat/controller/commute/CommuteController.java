package com.olakeji.passenger.wechat.controller.commute;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.entity.BaseProviderBasicConfig;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping(value = "commute")
public class CommuteController extends BaseController {
	@RequestMapping(value = "/toLineDetail")
	public String toLineDetail(HttpServletRequest request, Long busId, String token, String qrcId, Model model) {
		Map<String, Object> map = this.getMap();
		map.put("busId", busId);
		map.put("token", this.getToken());
		String content = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.TO_COMMUTE_LINE_DETAIL, map);
		ResultEntity result = GsonUtil.GsonToBean(content, ResultEntity.class);
		model.addAttribute("lineDetail", result.getData());
		model.addAttribute("qrcId", qrcId);
		model.addAttribute("curtimeStamp", System.currentTimeMillis());
		return "line-detail-commute";
	}

	/**
	 * 判断线路详情
	 * 
	 * @param busId
	 * @param token
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "judegLineDetail")
	public @ResponseBody String judgeLineDetail(Long busId, String token, Model model, HttpServletRequest request) {
		String requestUrl = request.getRequestURL().toString();
		String url = apiUrlPrefix + AppUrlConfig.JUDGE_LINE_DETAIL + "?requestUrl=" + requestUrl + "&busId=" + busId;
		String responseData = HttpUtil.doGetRequest(url);
		return responseData;
	}

	@RequestMapping(value = "toAddOrder")
	public String toAddOrder(String busIds, Model model, HttpServletRequest request, HttpServletResponse response,
			String busId, String qrcId,RedirectAttributes redirectAttributes) {

		/*
		 * String res = setOrGetCookie(request,response,busIds);
		 * if(StringUtils.isNotEmpty(res)){ if(res.startsWith("redirect")){ return res;
		 * }else{ busIds = res; } }
		 */

		logger.info("/commute/toAddOrder param = {}", GsonUtil.GsonString(request.getParameterMap()));
		if (StringUtils.isEmpty(busIds)) {
			String redirectUrl = this.getRedirectUrl(request, "/commuteIndex");
			return "redirect:"+redirectUrl;
		}
		redirectAttributes.addAttribute("busIds", busIds);
		redirectAttributes.addAttribute("busId", busId);
		redirectAttributes.addAttribute("qrcId", qrcId);
		String redirectUrl = this.getRedirectUrl(request, "/commute/toAddOrder1");
		return "redirect:"+redirectUrl;
	}

	@RequestMapping(value = "toAddOrder1")
	public String toAddOrder(String busIds, Model model, HttpServletRequest request, HttpServletResponse response,
							 String busId, String qrcId) {
		logger.info("/commute/toAddOrder1 param = {}", GsonUtil.GsonString(request.getParameterMap()));

		String url = apiUrlPrefix + AppUrlConfig.COMMUTE_TOADD_ORDER;
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("busIds", busIds);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity result = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		if (result.getData()!=null) {
			Map<String, Object> data = GsonUtil.GsonToMaps(GsonUtil.GsonString(result.getData()));
			if (data.containsKey("payMode")) {
				String payMode = GsonUtil.GsonString(data.get("payMode"));
				BaseProviderBasicConfig baseProviderBasicConfig = GsonUtil.GsonToBean(payMode,
						BaseProviderBasicConfig.class);
				model.addAttribute("settleType", baseProviderBasicConfig.getIsAdvance());
			}
		}
		model.addAttribute("result", result.getData());
		model.addAttribute("busId", busId);
		model.addAttribute("qrcId", qrcId);
		return "toAddOrder";
	}

	@RequestMapping(value = "addOrder")
	@ResponseBody
	public String addOrder(String qrcId, String busIds, String couponId, String specialPrice) {
		String url = apiUrlPrefix + AppUrlConfig.COMMUTE_ADD_ORDER;
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("busIds", busIds);
		paramsMap.put("couponId", couponId);
		paramsMap.put("qrcId", qrcId);
		paramsMap.put("specialPrice", specialPrice);
		String ospTraceId = this.getCookie(Constant.OSP_TRACE_ID);
		if(!StringUtils.isEmpty(ospTraceId)){
			paramsMap.put("ospTraceId",ospTraceId);
		}
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		return jsonResult;
	}

	@RequestMapping(value = "toCommuteRefundTicket")
	public String toCommuteRefundTicket(Model model, String orderNo, String type) {
		String url = apiUrlPrefix + AppUrlConfig.BUS_REFUND_TICKET;
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("orderNo", orderNo);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity resultEntity = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		if (resultEntity.getCode() == Constant.FAILURE) {
			return "noPrivilege";
		}
		model.addAttribute("ticket", resultEntity.getData());
		model.addAttribute("type", type);
		return "commutOrder/refund-ticket";
	}
}
