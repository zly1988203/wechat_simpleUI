package com.olakeji.passenger.wechat.controller.coupon;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.APIConfig;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * 优惠券裂变
 */
@Controller
@RequestMapping(value = "/")
public class CouponFissionController {
    @Value("${passenger.api.url}")
    protected String apiUrlPrefix;
    @RequestMapping(value = "/couponFission/getShareLink")
    @ResponseBody
    public ResultEntity getShareLink(Integer providerId,String orderNo) {
        String url = this.apiUrlPrefix + AppUrlConfig.CouponFission.SHARE_LINK;
        Map<String, Object> paramsMap = new HashMap<String,Object>();
        paramsMap.put("providerId", providerId);
        paramsMap.put("orderNo", orderNo);
        String jsonResult = HttpUtil.doPostRequest(url, paramsMap);
        ResultEntity resultData=GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
        return resultData;
    }
}
