package com.olakeji.passenger.wechat.controller.busline;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.google.gson.internal.LinkedTreeMap;
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
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.constant.ConstantInfo;
import com.olakeji.tsp.utils.DateUtils;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.validation.ValidParameter;
import com.olakeji.tsp.vo.BusOrderInformationVo;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping(value = "busline")
public class BusLineController extends BaseController {

	private static final Logger LOGGER = LoggerFactory.getLogger(BusLineController.class);

	@Value("${pay.server.url}")
	private String payApi;

	@RequestMapping(value = "/toLineDetail")
	public String toLineDetail(HttpServletRequest request, Long busId, String qrcId, String token, Model model) {
		Map<String, Object> map = this.getMap();
		map.put("busId", busId);
		map.put("token", this.getToken());
		String content = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.TO_LINE_DETAIL, map);
		ResultEntity result = GsonUtil.GsonToBean(content, ResultEntity.class);
		if(result.getData()!=null){
            Map<String, Object> resultMap = (LinkedTreeMap<String, Object>) result.getData();
            if(resultMap.containsKey("goOnStationList")){
                resultMap.put("goOnStationList",GsonUtil.GsonString(resultMap.get("goOnStationList")));
            }
            if(resultMap.containsKey("goOffStationList")){
                resultMap.put("goOffStationList",GsonUtil.GsonString(resultMap.get("goOffStationList")));
            }
        }
		model.addAttribute("lineDetail",result.getData());
		model.addAttribute("qrcId", qrcId);
		return "line-detail";
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


	@RequestMapping(value = "/addOrder")
	@ResponseBody
	public String addOrder(Long busId, String needPassInfo, String token, Integer num, String passengers, Model model) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("busId", busId);
		map.put("needPassInfo", needPassInfo);
		map.put("num", num);
		map.put("passengers", passengers);
		map.put("token", this.getToken());
		String content = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.ADD_ORDER, map);
		return content;
	}

	@RequestMapping(value = "/payOnBus")
	@ResponseBody
	public String payOnBus(String token, String orderNo) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("token", this.getToken());
		map.put("orderNo", orderNo);
		String content = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.PAY_ON_BUS, map);
		return content;
	}

	@RequestMapping(value = "/getCitys")
	@ResponseBody
	public String getCitys(HttpServletRequest request) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("requestUrl", request.getRequestURL().toString());
		String content = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.GET_CITYS, map);
		return content;
	}

	@RequestMapping(value = "/queryNotPayOrders")
	@ResponseBody
	public String queryNotPayOrders(String token, @ValidParameter(validateFields = { "busId" }) String busId,
			String type) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("token", this.getToken());
		map.put("busId", busId);
		map.put("type", type);
		String content = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.QUERY_NOT_PAY_ORDERS, map);
		return content;
	}

	@RequestMapping(value = "toRefundTicket")
	public String toRefundTicket(Model model, String orderNo, String type,
								 HttpServletRequest request,
								 RedirectAttributes redirectAttributes) {
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("orderNo", orderNo);
		String orderUrl = apiUrlPrefix + AppUrlConfig.BUS_ORDER_DETIAL;
		Map<String, String> orderParams = this.genReqApiData(orderUrl, paramsMap);
		LOGGER.info("订单号ordreNo@{}请求参数：@{}",orderNo,GsonUtil.GsonString(orderParams));
		String orderResult = HttpUtil.doPostReq(orderUrl, orderParams);// 获取订单详情
		LOGGER.info("订单号ordreNo@{}，进入退票页面返回订单数据@{}",orderNo,orderResult);
		// 订单信息
		ResultEntity result = GsonUtil.GsonToBean(orderResult, ResultEntity.class);
		BusOrderInformationVo vo = GsonUtil.GsonToBean(GsonUtil.GsonString(result.getData()),
				BusOrderInformationVo.class);
		String createTime = DateUtils.unixTimestampToDate(vo.getCreateTime());
		createTime = DateUtils.unixTimestampToDate(vo.getCreateTime(), "yyyy-MM-dd HH:mm:ss");
		vo.setCreateTimeStr(createTime);
		String boardingTime = DateUtils.unixTimestampToDate(vo.getDepartTime(), "yyyy-MM-dd HH:mm");
		vo.setBoardingTime(boardingTime);
		// 新的上车时间
		String boardingTime1 = DateUtils.unixTimestampToDate(vo.getDepartTime(), "HH:mm MM月dd日");
		vo.setBoardingTime1(boardingTime1);
		model.addAttribute("orderInformation", vo);

		String url = apiUrlPrefix + AppUrlConfig.BUS_REFUND_TICKET;
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		LOGGER.info("订单号ordreNo@{}，进入退票页面返回票数据@{}",orderNo,jsonResult);
		if(StringUtils.isEmpty(jsonResult)) {
		}
		ResultEntity resultEntity = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		if (resultEntity.getCode() == Constant.FAILURE) {
			LOGGER.info("没有权限查看订单号@{}",orderNo);
			return "noPrivilege";
		}
		model.addAttribute("ticket", resultEntity.getData());
		model.addAttribute("type", type);
		Map<String, Object> map = GsonUtil.GsonToMaps(GsonUtil.GsonString(resultEntity.getData()));
		if ((Double) map.get("orderType") == ConstantInfo.BUS_BUSINESS_COMMUTE) {
			redirectAttributes.addAttribute("orderNo", orderNo);
			String redirectUrl = this.getRedirectUrl(request, "/commute/toBatchRefund");
			return "redirect:" + redirectUrl;
		} else {
			return "ticket/refund-ticket";
		}
	}

	/**
	 * 根据某一个班次获取该条线路的排班列表
	 * 
	 * @return
	 */
	@RequestMapping("/getOneBusLineBaseBusList")
	@ResponseBody
	public String getOneBusLineBaseBusList(@RequestParam(value = "busId", required = true) Long busId, String token,
			String departDate) {
		String url = apiUrlPrefix + AppUrlConfig.BUS_LINE_ONE_BASE_BUS_LIST;
		Map<String, String> map = new HashMap<String, String>();
		map.put("busId", String.valueOf(busId));
		if (StringUtil.isEmpty(departDate)) {
			departDate = DateUtils.format(new Date(), "yyyy-MM-dd");
		}
		map.put("departDate", departDate);
		map.put("token", token);
		map = this.genReqApiData(url, map);
		String jsonReultStr = HttpUtil.doPostReq(url, map);
		return jsonReultStr;

	}
	
	@RequestMapping("/getAreas")
	@ResponseBody
	public String getAreas(HttpServletRequest request){
		String url = apiUrlPrefix + AppUrlConfig.BUS_LINE_AREA;
		String lineType = request.getParameter("lineType");
		String requestUrl = request.getRequestURL().toString();
		Map<String,String> params = new HashMap<String,String>();
		params.put("requestUrl", requestUrl);
		params.put("lineType", lineType);
		params = this.genReqApiData(url, params);
		String jsonResult = HttpUtil.doPostReq(url, params);
		return jsonResult;
	}
	
}
