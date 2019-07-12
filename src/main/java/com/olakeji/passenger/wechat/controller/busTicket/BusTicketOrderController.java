package com.olakeji.passenger.wechat.controller.busTicket;

import com.alibaba.fastjson.JSON;
import com.google.gson.reflect.TypeToken;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.entity.BaseProviderBasicConfig;
import com.olakeji.passenger.wechat.entity.OrderBusTicketInfo;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.NotValidatePermission;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.vo.BusOrderInformationVo;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("busTicketOrder")
public class BusTicketOrderController extends BaseController{

	private static Logger logger = LoggerFactory.getLogger(BusTicketOrderController.class);

	@Value("${passenger.api.url}")
	private String apiUrlPrefix;
	
	@RequestMapping("/getOrderList")
	@ResponseBody
	public String orderList(HttpServletRequest request){
		String url = apiUrlPrefix + AppUrlConfig.BUSTICKET_ORDER_LIST;
		 String page = request.getParameter("page");
		 String pageSize=request.getParameter("pageSize");
		Map<String,String> params = new HashMap<String,String>();
		Map<String,String> postParams = new HashMap<String,String>();
		params.put("page", page);
		params.put("pageSize", pageSize);
		postParams = this.genReqApiData(url, params);
		String busData = HttpUtil.doPostReq(url, postParams);
		return busData;
		
	}
	
	/**
	 * 订单详情/支付页面
	 * @param request
	 * @param model
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/toOrderDetail")
	public String orderToWaitPay(HttpServletRequest request,Model model,String autoShow,String tripDate){
		String orderNo = request.getParameter("orderNo");
		Map<String,String> map = new HashMap<String, String>();
		map.put("orderNo", orderNo);
		String postUrl = apiUrlPrefix + AppUrlConfig.BUS_TICKET_ORDER_DETAIL;
		Map<String,String> params = this.genReqApiData(postUrl, map);
		
		//查询订单详情
		String jsonResult = HttpUtil.doPostReq(postUrl, params);
		if(StringUtils.isEmpty(jsonResult)) {
			return "Error500";
		}
		logger.info("汽车票订单详情查询 {}", jsonResult);
		ResultEntity result = JSON.parseObject(jsonResult, ResultEntity.class);
		if(result.getCode() != 0){
			return "Error500";
		}
		BusOrderInformationVo orderInformationVo = GsonUtil.GsonToBean(GsonUtil.GsonString(((Map<String,Object>)result.getData()).get("orderInformation")), BusOrderInformationVo.class);
		
		//获取温馨提示语
		String remindContent = ((Map<String,Object>)result.getData()).get("remindContent") + "";
		//是否为流水班
		String hasRunningWater = ((Map<String,Object>)result.getData()).get("hasRunningWater") + "";
		//是否有门票记录或门票数据
		String spotCount =  ((Map<String,Object>)result.getData()).get("spotOrderCount") + "";

		//查询乘客及车票信息
		String ticketJsonResult = HttpUtil.doPostReq(apiUrlPrefix+AppUrlConfig.BUS_TICKET_INFO_LIST,params);
		ResultEntity ticketResult = GsonUtil.GsonToBean(ticketJsonResult, ResultEntity.class);
		List<OrderBusTicketInfo> ticketList = GsonUtil.GsonToList(GsonUtil.GsonString(ticketResult.getData()), new TypeToken<List<OrderBusTicketInfo>>() {});

		Double totalTicketPrice = 0d;
		Double totalInsurancePrice = 0d;
		BigDecimal totalServiceFee = BigDecimal.ZERO;

		BigDecimal serviceFee = BigDecimal.ZERO;
		double ticektPrice = 0d;
		if(!CollectionUtils.isEmpty(ticketList)){
			// 每张票的服务费相同
			serviceFee = ticketList.get(0).getServiceFee();
			ticektPrice = ticketList.get(0).getTicketPrice();
			for(OrderBusTicketInfo item : ticketList){
				if (item.getInsuranceStatus() == null) {
					item.setInsuranceStatus(0);
				}

				totalInsurancePrice += item.getInsurancePrice();
				totalTicketPrice += item.getTicketPrice();
				totalServiceFee = totalServiceFee.add(item.getServiceFee());
			}
		}

		//  vo 中price 已经包含了 总票价 + 总服务费 + 门票（套票情况）
		BigDecimal totalPrice = orderInformationVo.getPrice().add(BigDecimal.valueOf(totalInsurancePrice));

		//计时器倒计时
		Long countDownTime = orderInformationVo.getCreateTime()+600000-new Date().getTime();
		String countDownTimeMinStr = "0";//计时器倒计时精确分
		String countDownTimeSecondStr = "0";//计时器倒计时精确秒
		if(countDownTime>=0){
			countDownTimeMinStr = String.valueOf(countDownTime/60000);
			countDownTimeSecondStr = String.valueOf((countDownTime/1000-60*(countDownTime/60000)));
		}		
		
		//查询当前车企结算模式(0-预付款:车企已支付服务费,乘客直接支付给车企;1-非预付款:车企未支付服务费,乘客先支付给平台,平台再结算给车企)
		String payTypeStr = HttpUtil.doPostReq(apiUrlPrefix + AppUrlConfig.GET_PROVIDER_PAYTYPE, params);
	    ResultEntity payEntity = (ResultEntity)GsonUtil.GsonToBean(payTypeStr, ResultEntity.class);
	    BaseProviderBasicConfig config = (BaseProviderBasicConfig)GsonUtil.GsonToBean(GsonUtil.GsonString(payEntity.getData()), BaseProviderBasicConfig.class);
	    Byte settleType = config.getIsAdvance();

	    //页面回显
	    model.addAttribute("orderInformation", orderInformationVo);
	    model.addAttribute("remindContent", remindContent);
	    model.addAttribute("ticketList", ticketList);
	    model.addAttribute("serviceFee", serviceFee);
		model.addAttribute("totalServiceFee", totalServiceFee);
	    model.addAttribute("totalTicketPrice", totalTicketPrice);
		model.addAttribute("totalPrice", totalPrice);
		model.addAttribute("ticketPrice", ticektPrice);
	    model.addAttribute("settleType", settleType);
	    model.addAttribute("countDownTime", countDownTime);
	    model.addAttribute("countDownTimeMinStr", countDownTimeMinStr);
	    model.addAttribute("countDownTimeSecondStr", countDownTimeSecondStr);
	    model.addAttribute("autoShow", autoShow);
	    model.addAttribute("tripDate",tripDate);
	    model.addAttribute("totalInsurancePrice", totalInsurancePrice);
		model.addAttribute("spotOrderCount", spotCount);
		model.addAttribute("hasRunningWater",hasRunningWater);

		return "/order/busTicket-order-detail";
	}
	
	/**
	 * 购票/退票规则
	 * @param request
	 * @return
	 */
	@RequestMapping("/ticketRule")
	@ResponseBody
	public String ticketRule(HttpServletRequest request){
		String postUrl = apiUrlPrefix + AppUrlConfig.BUS_TICKET_TICKET_RULE;
		Map<String,String> map = new HashMap<String, String>();
		map.put("requestUrl", request.getRequestURL().toString());
		Map<String,String> params = this.genReqApiData(postUrl, map);
		String jsonResult = HttpUtil.doPostReq(postUrl, params);
		return jsonResult;
	}
	
	/**
	 * 支付前获取微信支付需要的参数
	 * @param request
	 * @return
	 */
	@RequestMapping("/getPrepayInfo")
	@ResponseBody
	public String checkOrderPrepayInfo(HttpServletRequest request){
		String orderNo = request.getParameter("orderNo");
		String url = apiUrlPrefix + AppUrlConfig.BUSTICKET_PRE_PAY_INFO;
		Map<String,String> map = new HashMap<String, String>();
		map.put("orderNo", orderNo);
		Map<String,String> params = this.genReqApiData(url, map);
		String jsonResult = HttpUtil.doPostReq(url, params);	
		return jsonResult;
	}
	
	/**
	 * 支付成功页面
	 * @param request
	 * @param model
	 * @return
	 */
	@RequestMapping("/toPaySuccess")
	public String paySuccess(HttpServletRequest request,Model model){
		String orderNo = request.getParameter("orderNo");
		model.addAttribute("orderNo", orderNo);
		model.addAttribute("payType", "busTicketTopay");
		/*//判断用户是否已经关注公众号
		String token = this.getToken();
		Map<String, String> map = new HashMap<>();
		map.put("token", token);
		Map<String, String> params = null;
		String url = apiUrlPrefix + AppUrlConfig.USER_OARTH_DETAIL;
		params = this.genReqApiData(url, map);
		String resultData = HttpUtil.doPostReq(url, params);
		ResultEntity resultEntity = GsonUtil.GsonToBean(resultData,ResultEntity.class);
		boolean focusFlag = false;
		if(resultEntity != null && Constant.SUCCESS.equals(resultEntity.getCode())){
			String oathStr = GsonUtil.GsonString(((Map<String,Object>)resultEntity.getData()).get("baseUserOath"));
			WeChatUser wechatUser = GsonUtil.GsonToBean(oathStr, WeChatUser.class);
			if(wechatUser != null){
				focusFlag = wechatUser.getSubscribe() ==1; 
			}
		}
		
		if(!focusFlag ){
			//获取当前车企的二维码路径
			String getProviderUrl = apiUrlPrefix + AppUrlConfig.PRIOVIDER_PROVIDERINFO;
			params = this.genReqApiData(getProviderUrl, map);
			String providerInfoData = HttpUtil.doPostReq(getProviderUrl, params);
			ResultEntity providerData = GsonUtil.GsonToBean(providerInfoData,ResultEntity.class);
			String providerStr = GsonUtil.GsonString(((Map<String,Object>)providerData.getData()).get("providerInfo"));
			BaseProviderInfo providerInfo =  GsonUtil.GsonToBean(providerStr, BaseProviderInfo.class);
			String qrcUrl = "";
			if(providerInfo != null && !StringUtils.isEmpty(providerInfo.getWechatQrcodeUrl())){
				qrcUrl = QiniuDown.DOAMIN + providerInfo.getWechatQrcodeUrl();
				model.addAttribute("wechatQrcodeUrl", qrcUrl);
				return "qrcFocusOn";//关注页面
			}
			return "order/busTicketPaySuccess";
		}*/
		return "order/busTicketPaySuccess";
	}

	/**
	 * 跳转到订单详情页
	 * @param request
	 * @param model
	 * @return
	 */
	@RequestMapping("/scenicTickets")
	public String scenicTickets(HttpServletRequest request,
								Model model,
								RedirectAttributes redirectAttribute,
								@RequestParam String orderNo){
		redirectAttribute.addAttribute("orderNo", orderNo);
		return "redirect:scenicTicketList";
	}

	@RequestMapping("/scenicTicketList")
	public String scenicTicketList(HttpServletRequest request,
								   Model model){
		return "order/scenic-ticket-info";
	}

	/**
	 * 跳转到订单详情页
	 * @param request
	 * @param model
	 * @return
	 */
	@RequestMapping("/scenicTicketRefund")
	public String scenicTicketRefund(HttpServletRequest request,
								Model model,
								RedirectAttributes redirectAttribute,
								@RequestParam String orderNo){
		redirectAttribute.addAttribute("orderNo", orderNo);
		return "redirect:scenicTicketInternalRefund";
	}

	@RequestMapping("/scenicTicketInternalRefund")
	public String scenicTicketInternalRefund(HttpServletRequest request,
								   Model model){
		return "order/scenic-refund";
	}

	@RequestMapping("/check")
	@NotValidatePermission
	public String ticketChecking(@RequestParam String orderNo, Model model, @RequestParam(required = false) String origin){
		model.addAttribute("orderNo", orderNo);
		model.addAttribute("origin", origin);
		return "order/checkQrcode";
	}

	/**
	 *  获取开具发票连接
	 * @param ticketSerialNo
	 * @param mobile
	 * @return
	 */
	@RequestMapping(value = "/getInvoiceLink")
	@ResponseBody
	@NotValidatePermission
	public String queryElectronicInvoice(@RequestParam String ticketSerialNo, @RequestParam  String mobile){
		String url = apiUrlPrefix + AppUrlConfig.BUSTICKET_GET_INVOICE_LIKE;
		Map<String,String> map = new HashMap<String, String>(){{
			put("ticketSerialNo", ticketSerialNo);
			put("mobile", mobile);
		}};
		Map<String,String> params = this.genReqApiData(url, map);
		return  HttpUtil.doPostReq(url, params);
	}
}























