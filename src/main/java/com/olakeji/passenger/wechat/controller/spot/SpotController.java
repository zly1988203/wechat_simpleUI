package com.olakeji.passenger.wechat.controller.spot;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.entity.BaseUser;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.NotValidatePermission;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.vo.OrderExtraInfoVo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.Map;

@Controller
public class SpotController extends BaseController {
    @Value("${passenger.api.url}")
    public String apiUrlPrefix;

    @RequestMapping("/sameSale/toDeatilPage")
    public String toDeatilPage(Model model, String orderNo, String productCode, String refundReason) {
        model.addAttribute("orderNo", orderNo);
        model.addAttribute("productCode", productCode);
        model.addAttribute("refundReason", refundReason);
        return "hsorderDetail";
    }

    @RequestMapping("/sameSale/toWaitPayPage")
    public String toWaitPayPage(Model model, String paramsStr) {
        model.addAttribute("paramsStr", paramsStr);
        return "wait-pay";
    }

    @RequestMapping("/sameSale/toAttMainPage")
    public String toAttMainPage(Model model, @RequestParam String storeCode, @RequestParam String storeName, RedirectAttributes redirectAttributes) {
        redirectAttributes.addAttribute("storeCode", storeCode);
        redirectAttributes.addAttribute("storeName", storeName);
        return "redirect:/sameSale/toAttMainPage1";
    }

    @RequestMapping("/sameSale/toAttMainPage1")
    public String toAttMainPage1(Model model) {
        return "attMain";
    }

    @RequestMapping("/sameSale/toRefundPage")
    public String toRefundPage(Model model, String orderNo, String goodsNo) {
        model.addAttribute("orderNo", orderNo);
        model.addAttribute("goodsNo", goodsNo);
        return "hsRefund";
    }

    @RequestMapping(value = "/sameSale/toPay")
    @NotValidatePermission
    public String toPay(Model model) {
        String userPhone = "", cardId = "",  name = "";
        try {
            String token = getToken();
            if (StringUtils.isNotEmpty(token)) {
                String userStr = (String) redisUtil1.get(token);
                BaseUser user = GsonUtil.GsonToBean(userStr, BaseUser.class);
                userPhone = user.getMobile();

                 String url = apiUrlPrefix + AppUrlConfig.BUSTICKET_QUERY_HISTORY_CONTACT;
                Map<String, String> paraMap = new HashMap<String, String>(){{
                    put("userId", String.valueOf(user.getId()));
                }};
                String resultStr = HttpUtil.doPostReq(url, paraMap);
                ResultEntity result = GsonUtil.GsonToBean(resultStr, ResultEntity.class);
                if(result.getCode().equals(Constant.SUCCESS)){
                    OrderExtraInfoVo infoVo = JSON.parseObject(JSONObject.toJSONString(result.getData()), OrderExtraInfoVo.class);
                    cardId = infoVo.getContactCard();
                    name = infoVo.getContactName();
                }
            }
        } catch (Exception e) {
            logger.error("三票同售入口： 获取用户手机号失败，不影响查询", e.getMessage());
        }
        model.addAttribute("userPhone", userPhone);
        model.addAttribute("cardId", cardId);
        model.addAttribute("name", name);
        return "wait-pay";
    }
}
