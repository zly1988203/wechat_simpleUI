package com.olakeji.passenger.wechat.controller.pay;

import com.olakeji.cache.RedisUtil;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.tsp.utils.GsonUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 注册成功跳转二维码中转
 * @author ZERO
 *
 */
@Controller
public class ToPayController extends BaseController {
	@Value("${passenger.api.url}")
	private String apiUrl;

	/**
	 * 统一支付页面
	 * @return
	 */
	@RequestMapping("/order/payunit")
	public String commonPay(@RequestParam String orderNo,
							@RequestParam(required = false) Integer settleType,
							@RequestParam String userCouponId,
							@RequestParam String url,
							RedirectAttributes redirectAttributes,
							@RequestParam(required = false) String sameSale,
							HttpServletRequest request,
							HttpServletResponse response){
		logger.info("进入统一支付页面orderNo@{},url@{}",orderNo,url);
		redirectAttributes.addAttribute("orderNo", orderNo);
		if (null != settleType) {
			redirectAttributes.addAttribute("settleType", settleType);
		}
		if (StringUtils.isEmpty(userCouponId)) {
			userCouponId = "0";
		}
		redirectAttributes.addAttribute("userCouponId", userCouponId);
		redirectAttributes.addAttribute("url", url);
		if (StringUtils.isNotEmpty(sameSale)) {
			redirectAttributes.addAttribute("sameSale", sameSale);
		}
		logger.info(" ======  arrive /order/payunit  ====={}", GsonUtil.GsonString(redirectAttributes));
		return this.commonRedirect(request, response, "/bus/payunit");
	}
	
	/**
	 * 统一支付页面
	 * @return
	 */
	@RequestMapping("/bus/payunit")
	public String busCommonPay(HttpServletRequest request,
							   @RequestParam String orderNo,
							   @RequestParam(required = false)  Integer settleType,
							   @RequestParam Integer userCouponId,
							   @RequestParam String url,
							   @RequestParam(required = false) String sameSale){
		logger.info(" ====== arrive /bus/payunit  ===== {}", GsonUtil.GsonString(request.getParameterMap()));
		return "payunit";
	}

	/**
	 * 统一支付页面
	 * @return
	 */
	@RequestMapping("/hail/order/payunit")
	public String commonHailPay(@RequestParam String orderNo,
								@RequestParam(required = false) Integer settleType,
								@RequestParam String userCouponId,
								@RequestParam String url,
								RedirectAttributes redirectAttributes,
								HttpServletRequest request,
								HttpServletResponse response,
								@RequestParam(required = false) String sameSale){
		redirectAttributes.addAttribute("orderNo", orderNo);
        if (null != settleType) {
            redirectAttributes.addAttribute("settleType", settleType);
        }
		if (StringUtils.isEmpty(userCouponId)) {
			userCouponId = "0";
		}
        redirectAttributes.addAttribute("userCouponId", userCouponId);
        redirectAttributes.addAttribute("url", url);
        if (StringUtils.isNotEmpty(sameSale)) {
            redirectAttributes.addAttribute("sameSale", sameSale);
        }
		redirectAttributes.addAttribute("hail", "/hail");
        logger.info(" ======  arrive /order/payunit  ====={}", GsonUtil.GsonString(redirectAttributes));
        return this.commonRedirect(request, response, "/bus/payunit");
    }

	/**
	 * 统一支付页面
	 * @return
	 */
	@RequestMapping("/bus/hailPayunit")
	public String busHailCommonPay(HttpServletRequest request,
								   @RequestParam String orderNo,
								   @RequestParam(required = false) Integer settleType,
                                   @RequestParam Integer userCouponId,
								   @RequestParam String url,
								   @RequestParam String hail,
								   @RequestParam(required = false) String sameSale){
		logger.info(" ====== arrive /bus/hailPayunit  ===== {}", GsonUtil.GsonString(request.getParameterMap()));
		return "payunit";
	}
}
