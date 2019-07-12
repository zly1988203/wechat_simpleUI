package com.olakeji.passenger.wechat.controller;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.service.provider.BaseProviderService;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.utils.MD5Util;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/wechat/activity_split_coupon")
public class ShareController {
    @Value("${osp.php.url}")
    protected String ospURL;
    @Value("${passenger.api.url}")
    protected String apiUrlPrefix;
    @Autowired
    private BaseProviderService baseProviderService;
    Logger logger= LoggerFactory.getLogger(ShareController.class);
    @RequestMapping("/index")
    public String index(String key,Integer activityId,Integer providerId,Integer userId, String type ,String orderNo,Model model) throws Exception {
        String url = this.apiUrlPrefix + AppUrlConfig.CouponFission.SHARE_CHECK;
        if(StringUtils.isNotEmpty(type)&& "hail".equals(type)){
            url = this.apiUrlPrefix + AppUrlConfig.CouponFission.HAIL_SHARE_CHECK;
        }
        Map<String, Object> paramsMap = new HashMap<String,Object>();
        paramsMap.put("orderNo", orderNo);
        String jsonResult = HttpUtil.doPostRequest(url, paramsMap);
        ResultEntity resultData= GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
        if(resultData!=null && resultData.getData()!=null){
             Boolean flag = (Boolean) resultData.getData();
             //过期返回为 true   ，不过期返回为 false
             if(flag){
                 //通知链接过期
                 String phpUrl = baseProviderService.getOspUrl(Integer.valueOf(providerId));
                 if (org.apache.commons.lang3.StringUtils.isEmpty(phpUrl)) {
                     phpUrl = ospURL;
                 }
                 String setexpiredUrl = phpUrl + AppUrlConfig.CouponFission.SHARE_SETEXPIRED;
                 Map<String, Object> paramsMap2 = new HashMap<String,Object>();
                 paramsMap2.put("key",key);
                 String jsonResult2 = HttpUtil.doPostRequest(setexpiredUrl, paramsMap2);
                 logger.info("裂变分享跳转地址失效通知返回结果:"+jsonResult2);
             }
        }
        model.addAttribute("key",key);
        model.addAttribute("activityId",activityId);
        model.addAttribute("providerId",providerId);
        model.addAttribute("userId",userId);
        model.addAttribute("link",ospURL);
        return "/index/tempPage";
    }
}
