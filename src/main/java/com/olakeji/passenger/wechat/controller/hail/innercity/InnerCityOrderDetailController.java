package com.olakeji.passenger.wechat.controller.hail.innercity;

import com.olakeji.cache.RedisUtil;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.controller.hail.HailController;
import com.olakeji.passenger.wechat.entity.OrderInformation;
import com.olakeji.passenger.wechat.entity.OrderTrip;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.passenger.wechat.utils.InnerCityTripUtil;
import com.olakeji.tsp.cache.CacheKey;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.OrderStatusKey;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.common.passenger.PassengerConstant;
import com.olakeji.tsp.common.passenger.ResCodeConstant;
import com.olakeji.tsp.constant.ConstantInfo;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.vo.InnerCityOrderInfoVo;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * @author JohnSon
 *
 */
@Controller("HailInnerCityOrderDetailController")
@RequestMapping("/hail/innerCity/orderDetail")
public class InnerCityOrderDetailController extends HailController {
	private Logger LOGGER = LoggerFactory.getLogger(InnerCityOrderDetailController.class);

	@Value("${app.id}")
	private Integer appId;
	@Value("${app.key}")
	private String appKey;
	@Value("${client.type}")
	private Integer clientType;
	@Value("${app.version}")
	private Double appVersion;

	@Autowired
	private RedisUtil redisUtil;

	/**
	 * 获取订单信息
	 * 跳转页面需要统一化处理，
	 * 退款、取消订单
	 * 立即支付
	 * 评论都需要单独处理
	 * 其他流程都统一化处理
	 *
	 * @return
	 */
	@RequestMapping(value = "/getOrderInfo")
	public String getOrderInfo(HttpServletRequest request, Model model, String orderNo, Integer pageType) {
		LOGGER.info("订单信息查询接口/getOrderInfo接收信息：orderNo@{} pageType{}", orderNo, pageType);
		String url = apiUrlPrefix + AppUrlConfig.GET_INNERCITY_ORDER_INFO;
		Map<String, String> paramsMap = new HashMap<>();
		paramsMap.put("orderNo", orderNo);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		if (HttpUtil.getCookieByName(request, "token") == null) {
			String redirectUrl = this.getRedirectUrl(request, ConstantInfo.LOGIN_URL.REG_LOGIN);
			return "redirect:" + redirectUrl;
		}
		String jsonResult = HttpUtil.doPostReq(url, params);
		LOGGER.info("result data: {}", jsonResult);
		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		if (!resultData.getCode().equals(Constant.SUCCESS)) {
			if (resultData.getCode().equals(ResCodeConstant.ACCOUNT_UNLOGIN)) {
				String redirectUrl = this.getRedirectUrl(request, ConstantInfo.LOGIN_URL.REG_LOGIN);
				return "redirect:" + redirectUrl;
			}
			return "Error500";
		}
		// 城际约车订单实体
		InnerCityOrderInfoVo innerCityOrderInfo = GsonUtil.GsonToBean(GsonUtil.GsonString(resultData.getData()), InnerCityOrderInfoVo.class);

		if (!resultData.getCode().equals(Constant.SUCCESS) || null == innerCityOrderInfo) {
			if (resultData.getCode().equals(ResCodeConstant.ACCOUNT_UNLOGIN)) {
				String redirectUrl = this.getRedirectUrl(request, ConstantInfo.LOGIN_URL.REG_LOGIN);
				return "redirect:" + redirectUrl;
			}
			return "Error500";
		}
		String returnPage = "";

		String tripNo = innerCityOrderInfo.getTripNo();
		if (null != innerCityOrderInfo.getTagList()) {
			innerCityOrderInfo.setTagListStr(convertTagListToString(innerCityOrderInfo.getTagList()));
		}

		// 根据车企配置判断是否可取消订单
		switch (innerCityOrderInfo.getCancelConfig()) {
			case ConstantInfo.PASSENGER_CANCEL_REFUND_CONFIG.AFTER_ASSIGN_DRIVER:
				if (innerCityOrderInfo.getTripStatus() >= OrderStatusKey.TRIP_STATUS_WAITLOADING_INT) {
					innerCityOrderInfo.setHasCanCancelOrder((byte) 0);
				}
				break;
			case ConstantInfo.PASSENGER_CANCEL_REFUND_CONFIG.AFTER__DRIVER_ACCEPT:
				if (innerCityOrderInfo.getTripStatus() >= OrderStatusKey.TRIP_STATUS_GONE_INT) {
					innerCityOrderInfo.setHasCanCancelOrder((byte) 0);
				}
				break;
		}
		returnPage = InnerCityTripUtil.hailToUrl(innerCityOrderInfo.getOrderNo(), innerCityOrderInfo.getStatus().byteValue(), innerCityOrderInfo.getTripStatus(), innerCityOrderInfo.getPayMode(), innerCityOrderInfo.getIsRefundFlag().byteValue(), request);
        LOGGER.info("获取到跳转路径为:" + returnPage);
		if (returnPage.indexOf(InnerCityTripUtil.REDIRECT) >= 0) {
			return returnPage;
		}
		LOGGER.info("获取到跳转路径为:" + returnPage);
		resultData.setData(innerCityOrderInfo);
		model.addAttribute("orderInfo", resultData.getData());

		return returnPage;
	}

	@RequestMapping(value = "/orderCanceled")
	public String orderCanceled(String orderNo, Model model) {
		String url = apiUrlPrefix + AppUrlConfig.GET_INNERCITY_ORDER_INFO;
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("orderNo", orderNo);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);

		ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		if (resultData.getCode() != Constant.SUCCESS) {
			return "Error500";
		}
		model.addAttribute("orderInfo", resultData.getData());
		return "/hail/order/orderDetailRefund";
	}

	/**
	 *  标签List列表转换为String，以@符分隔
	 * @param tagList
	 * @return
	 */
	private String convertTagListToString(List<String> tagList){
		StringBuilder stringBuilder = new StringBuilder();
		if(null != tagList && !tagList.isEmpty()){
			for(int i = 0 ; i < tagList.size(); i ++){
				stringBuilder.append(tagList.get(i));
				if(i != tagList.size() - 1){
					stringBuilder.append("@");
				}
			}
		}
		return stringBuilder.toString();
	}
}
