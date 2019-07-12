package com.olakeji.passenger.wechat.controller;

import java.util.Date;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.validation.ValidParameter;

/**
 * 用于订单页面间的中转
 *
 * @author roderick
 */
@Controller
@RequestMapping("/order")
public class OrderController {
	private static final Logger LOGGER = LoggerFactory.getLogger(OrderController.class);

	@Value("${passenger.api.url}")
	private String serverUrl;

	public static final String ORDER_CANCEL_CONFIG_URL = "getProviderCancelOrderConfigRelate";

	@RequestMapping(value = "/{orderType}/{orderNo}", method = RequestMethod.GET)
	@ValidParameter(extraRequestParam = { "orderType", "orderNo" })
	public String orderDetail(@PathVariable int orderType, @PathVariable String orderNo, Model model) {
		model.addAttribute("orderType", orderType);
		model.addAttribute("orderNo", orderNo);
		return "/order/orderDetail";
	}

	/**
	 * 跳转至预约订单详情页面（待执行状态）
	 */
	@RequestMapping(value = "/orderReservation", method = RequestMethod.GET)
	public String OrderDetailReservation(String orderNo, String tripNo, Model model) {
		model.addAttribute("orderNo", orderNo);
		model.addAttribute("tripNo", tripNo);
		return "/order/orderReservation";
	}

	/**
	 * 跳转至等待司机页面
	 * 
	 * @param orderNo
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/toWaitDriver", method = RequestMethod.GET)
	public String orderToMeet(String orderNo, Model model) {
		model.addAttribute("orderNo", orderNo);
		return "/receive/waitDriver";
	}

	/**
	 * 跳转至司机已到达页面 joy
	 * 
	 * @param orderNo
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/toDriverArrived", method = RequestMethod.GET)
	public String toOrderReceiveB(@RequestParam(value = "orderNo", required = false) String orderNo, Model model) {
		model.addAttribute("orderNo", orderNo);
		return "/receive/driverArrived";
	}

	/**
	 * 跳转至接到乘客 去往目的地页面 joy
	 * 
	 * @param orderNo
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/toStartTrip", method = RequestMethod.GET)
	public String toOrderReceiveAb(@RequestParam(value = "orderNo", required = false) String orderNo, Model model) {
		model.addAttribute("orderNo", orderNo);
		return "/receive/startTrip";
	}

	@RequestMapping(value = "/toPay/{orderNo}", method = RequestMethod.GET)
	@ValidParameter(extraRequestParam = { "orderNo" })
	public String toPay(@PathVariable String orderNo, Model model) {
		model.addAttribute("orderNo", orderNo);
		return "/order/pay-taxicab";
	}

	/**
	 * 微信客服消息中的点击详情链接，到该页面进行跳转
	 */
	@RequestMapping(value = "/togo", method = RequestMethod.GET)
	public String togo() {
		return "/order/togo";
	}

	/**
	 * 进入到行程等待界面
	 * 
	 * @param request
	 * @param model
	 * @param tripNo
	 * @return
	 */
	@RequestMapping("/toOrderWait")
	public String toOrderWait(HttpServletRequest request, Model model, @RequestParam("tripNo") String tripNo,
			@RequestParam("tipsMessage") String tipsMessage, @RequestParam("createTime") Long createTime) {
		model.addAttribute("tripNo", tripNo);
		model.addAttribute("createTime", createTime);
		model.addAttribute("reatTime", new Date().getTime());
		model.addAttribute("tipsMessage", tipsMessage);
		return "order/order-wait";
	}

	/*
	 * 跳转到订单取消页面
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/toOrderCancel", method = RequestMethod.GET)
	public String toOrderCancel(String orderNo, Model model) {
		model.addAttribute("orderNo", orderNo);
		String configResult = HttpUtil.doGetRequest(serverUrl + "/" + ORDER_CANCEL_CONFIG_URL + "?orderNo=" + orderNo);
		ResultEntity responseData = GsonUtil.GsonToBean(configResult, ResultEntity.class);
		Map resultData = GsonUtil.GsonToMaps(GsonUtil.GsonString(responseData.getData()));
		if (resultData != null) {
			String limitTime = resultData.get("passenger_call_driver_afterorder_time") + "";
			String cancelTime = resultData.get("cancelTime") + "";
			try {
				int limitTimeNum = Integer.parseInt(limitTime);
				long cancelTimeNum = Long.parseLong(cancelTime);
				if (new Date().getTime() - cancelTimeNum >= (limitTimeNum * 60 * 1000)) {
					System.out.println("用户不可以拨打电话了");
					model.addAttribute("disableDial", "true");// 时间已过，禁用用户拨打电话
				} else {
					System.out.println("用户可以拨打电话");
					model.addAttribute("disableDial", "false");
				}
			} catch (Exception e) {
				LOGGER.error("跳转取消订单异常:", e);
				model.addAttribute("disableDial", "false");
			}
		}
		return "/order/orderCancel";
	}

}
