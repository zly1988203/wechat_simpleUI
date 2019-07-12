package com.olakeji.passenger.wechat.controller.statistics;

import com.alibaba.fastjson.JSON;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.entity.BaseProviderInfo;
import com.olakeji.passenger.wechat.entity.annual.BaseUserVo;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.util.ImageTools;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/conclusion2018")
public class AnnualStatisticsController extends BaseController {
    private static final Logger LOGGER = LoggerFactory.getLogger(AnnualStatisticsController.class);

    @RequestMapping(value = "")
    public String getData(Model model,HttpServletRequest request, HttpServletResponse response) {
        return getPageRouter(model,request,"step1", response);
    }
    @RequestMapping(value = "step2")
    public String goStep2(Model model,HttpServletRequest request, HttpServletResponse response) {
        return getPageRouter(model,request,"step2", response);
    }
    @RequestMapping(value = "step3")
    public String step3(Model model,HttpServletRequest request, HttpServletResponse response) {
        return getPageRouter(model,request,"step3", response);
    }
    @RequestMapping(value = "step4")
    public String step4(Model model,HttpServletRequest request, HttpServletResponse response) {
        return getPageRouter(model,request,"step4", response);
    }
    @RequestMapping(value = "step5")
    public String step5(Model model,HttpServletRequest request, HttpServletResponse response) {
        return getPageRouter(model,request,"step5", response);
    }
    @RequestMapping("/annual/saveRecord")
    @ResponseBody
    public ResultEntity saveRecord(String token, Integer pageNum, Model model) {
        try {
            String apiUrl = AppUrlConfig.Annual.STATISTICS_SAVERECORD;
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("token", token);
            map.put("pageNum", pageNum);
            String resultStr = HttpUtil.doPostRequest(apiUrlPrefix + apiUrl, map);
            ResultEntity result = JSON.parseObject(resultStr, ResultEntity.class);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            LOGGER.error("2018年终总结保存PV/UV:", e);
        }
        return ResultEntity.setFail("请求异常");
    }


    private String getPageRouter(Model model,
                                 HttpServletRequest request,
                                 String goPageName,
                                 HttpServletResponse response){
        Cookie cookie = HttpUtil.getCookieByName(request, "token");
        String token = "";
        if (cookie!=null) {
            token = cookie.getValue();
        }
        BaseProviderInfo baseProviderInfo = getProviderDetail(request);
        if(baseProviderInfo== null){
            LOGGER.info("进入年终总结入口baseProviderInfo为空，token为空");
            //return "redirect:/regOrLogin";
            return commonRedirect(request,response,"/regOrLogin");
        }
        Integer providerId = baseProviderInfo.getProviderId();
        LOGGER.info("进入年终总结入口token@{},providerId@{}",token,providerId);
        String pageName = "logo";
        try {
            String apiUrl = AppUrlConfig.Annual.STATISTICS_GETDATA;
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("token", token);
            map.put("providerId", providerId);
            String resultStr = HttpUtil.doPostRequest(apiUrlPrefix + apiUrl, map);
            if (StringUtils.isEmpty(resultStr)) {
                //没有数据返回
                LOGGER.info("获取2018年终总结数据:数据返回为空");
                return pageName;
            }
            ResultEntity result = JSON.parseObject(resultStr, ResultEntity.class);
            Object resultData = result.getData();
            Map resultMap = new HashMap();
            if (resultData instanceof Map && resultData != null) {
                resultMap = (Map) resultData;
            } else {
                //跳至不展示页面
                return pageName;
            }
            String baseUserVoStr = "";
            BaseUserVo baseUserVo = null;
            if (resultMap.containsKey("userInfo")) {
                baseUserVoStr = (String) resultMap.get("userInfo");
                LOGGER.info("年终总结返回数据baseUserVoStr:"+baseUserVoStr);
                baseUserVo = JSON.parseObject(baseUserVoStr, BaseUserVo.class);
                if(resultMap.containsKey("userAvatar")){
                    model.addAttribute("userAvatar",resultMap.get("userAvatar"));
                } else if (baseUserVo != null && !resultMap.containsKey("userAvatar")) {
                    model.addAttribute("userAvatar",ImageTools.getBase64StaticImage("/static/res/images/avatar.png"));
                }
                model.addAttribute("userInfo", JSON.toJSONString(baseUserVo));
            }
            if (resultMap.containsKey("annualData")) {
                LOGGER.info("年终总结返回数据annualData:"+ resultMap.get("annualData"));
                model.addAttribute("annualData", resultMap.get("annualData"));
                model.addAttribute("providerQRCode",resultMap.get("providerQRCode"));
                //跳至展示页面有全部数据
                if (baseUserVo == null) {
                    //有二维码数据
                    pageName = "logo";
                } else {
                    pageName = goPageName;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            LOGGER.error("获取2018年终总结数据:", e);
            //跳至不展示页面
            return pageName;
        }
        LOGGER.info("获取2018年终总结数据 跳转页面为@{}",pageName);
        return pageName;
    }
}
