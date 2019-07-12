package com.olakeji.passenger.wechat.utils;

import java.util.HashMap;
import java.util.Map;

import com.olakeji.tsp.common.OrderStatusKey;
import com.olakeji.tsp.common.passenger.PassengerConstant;

import javax.servlet.http.HttpServletRequest;

/**
 * 城际约车状态判断
 * @author herry.zhang
 *
 */
public class InnerCityTripUtil {
	public static final String HAIL_PATH = "hail";
	public static final String REDIRECT = "redirect:";

	public static final Map<String, String> tripStatusUrlMap = new HashMap<String, String>();
	public static final Map<String, String> hailTripStatusUrlMap = new HashMap<String, String>();

	public static final String WAIT_RECEIVE_ORDER_PAGE = "/order/waitOrder";//等待接单

	public static final String WAIT_TRAVEL_ORDER_PAGE = "/order/waitGoTravel";//等待出行

	public static final String WAIT_RECEIVE_DRIVER_RECEIVE = "/order/waitDriverReceive";//等待接驾

	public static final String DRIVER_GO_DESTINATION = "/order/goDestination";//前往目的地

	public static final String DRIVER_ARRIVE_DESTINATION = "/order/arrivedDestination"; //到达目的地

	public static final String ORDER_ALREADY_CANCEL = "/order/orderDetailRefund"; //订单已取消

	public static final String ORDER_ALREADY_REFUND = "/innerCity/order/toOrderReturnDetailPage?orderNo="; //订单已退款

	public static final String ORDER_TO_PAY = "/innerCity/order/toOrderPay?orderNo="; //订单已退款

	public static final String ORDER_TO_NOT_COMMENT = "/innerCity/order/toOrderNotComment?orderNo="; //待评价

	public static final String ORDER_TO_COMMENTED = "/innerCity/order/toOrderCommented?orderNo="; //已经评价

	static {
		tripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_CREATE_INT + "", WAIT_RECEIVE_ORDER_PAGE);
		tripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_WAIT_INT + "", WAIT_RECEIVE_ORDER_PAGE);
		tripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_WAITLOADING_INT + "", WAIT_TRAVEL_ORDER_PAGE);
		tripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_LOADING_INT + "", WAIT_RECEIVE_DRIVER_RECEIVE);
		tripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_DEPART_INT + "", WAIT_RECEIVE_DRIVER_RECEIVE);
		tripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_GONE_INT + "", DRIVER_GO_DESTINATION);
		tripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_ARRIVE_INT + "", DRIVER_ARRIVE_DESTINATION);
		tripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_SUCCES_INT + "", DRIVER_ARRIVE_DESTINATION);
		tripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_SEND_PAY + "", DRIVER_ARRIVE_DESTINATION);
		tripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_CANCEL_INT + "", ORDER_ALREADY_CANCEL);

		hailTripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_CREATE_INT + "", HAIL_PATH + WAIT_RECEIVE_ORDER_PAGE);
		hailTripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_WAIT_INT + "", HAIL_PATH + WAIT_RECEIVE_ORDER_PAGE);
		hailTripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_WAITLOADING_INT + "", HAIL_PATH + WAIT_TRAVEL_ORDER_PAGE);
		hailTripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_LOADING_INT + "", HAIL_PATH + WAIT_RECEIVE_DRIVER_RECEIVE);
		hailTripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_DEPART_INT + "", HAIL_PATH + WAIT_RECEIVE_DRIVER_RECEIVE);
		hailTripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_GONE_INT + "", HAIL_PATH + DRIVER_GO_DESTINATION);
		hailTripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_ARRIVE_INT + "", HAIL_PATH + DRIVER_ARRIVE_DESTINATION);
		hailTripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_SUCCES_INT + "", HAIL_PATH + DRIVER_ARRIVE_DESTINATION);
		hailTripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_SEND_PAY + "", HAIL_PATH + DRIVER_ARRIVE_DESTINATION);
		hailTripStatusUrlMap.put(PassengerConstant.TRIP_STATUS_CANCEL_INT + "", HAIL_PATH + ORDER_ALREADY_CANCEL);
	}

	//跳转页面处理
	public static String toUrl (String orderNo, Byte orderStatus, Byte tripStatus, Byte payMode, Byte refundFlag, HttpServletRequest request) {
		//退款处理
		if (null!=refundFlag && refundFlag.intValue()==3) {
			return REDIRECT + WechatUtils.getRedirectUrl(request,ORDER_ALREADY_REFUND+orderNo);
//			return REDIRECT + ORDER_ALREADY_REFUND+orderNo;
		}
		//立即支付处理
		if (null==payMode||payMode.intValue()==0) {
			if (orderStatus.byteValue()== OrderStatusKey.ORDER_STATUS_WAITPAY_INT) {
				return REDIRECT+WechatUtils.getRedirectUrl(request,ORDER_TO_PAY + orderNo);
//				return REDIRECT + ORDER_TO_PAY + orderNo;
			}
		}
		/*//订单完成后的评价页面
		else if (orderStatus == OrderStatusKey.ORDER_STATUS_SUCCES_INT && userCommentStatus == 1) {
			return REDIRECT+ORDER_TO_NOT_COMMENT + orderNo;
		} else if (orderStatus == OrderStatusKey.ORDER_STATUS_SUCCES_INT && userCommentStatus == 2) {
			return REDIRECT+ORDER_TO_COMMENTED + orderNo;
		}*/
		return tripStatusUrlMap.get(tripStatus+"");
	}

	//跳转页面处理
	public static String hailToUrl (String orderNo, Byte orderStatus, Byte tripStatus, Byte payMode, Byte refundFlag, HttpServletRequest request) {
		//退款处理
		if (null!=refundFlag && refundFlag.intValue()==3) {
			return REDIRECT + WechatUtils.getRedirectUrl(request,"/"+HAIL_PATH+ORDER_ALREADY_REFUND+orderNo);
//			return REDIRECT + "/"+HAIL_PATH+ORDER_ALREADY_REFUND+orderNo;
		}
		//立即支付处理
		if (null==payMode||payMode.intValue()==0) {
			if (orderStatus.byteValue()== OrderStatusKey.ORDER_STATUS_WAIT_INT ||
					orderStatus.byteValue()== OrderStatusKey.ORDER_STATUS_LOADING_LAST_INT ||
					orderStatus.byteValue()== OrderStatusKey.ORDER_STATUS_WAITPAY_INT) {
				return REDIRECT + WechatUtils.getRedirectUrl(request,"/"+HAIL_PATH+ORDER_TO_PAY + orderNo);
//				return REDIRECT + "/"+HAIL_PATH+ORDER_TO_PAY + orderNo;
			}
		}
		/*//订单完成后的评价页面
		else if (orderStatus == OrderStatusKey.ORDER_STATUS_SUCCES_INT && userCommentStatus == 1) {
			return REDIRECT+"/"+HAIL_PATH+ORDER_TO_NOT_COMMENT + orderNo;
		} else if (orderStatus == OrderStatusKey.ORDER_STATUS_SUCCES_INT && userCommentStatus == 2) {
			return REDIRECT+"/"+HAIL_PATH+ORDER_TO_COMMENTED + orderNo;
		}*/
		return hailTripStatusUrlMap.get(tripStatus+"");
	}
}
