package com.olakeji.passenger.wechat.controller.statistics;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping(value = "/")
public class StatisticsController {
    @Value("${passenger.api.url}")
    protected String apiUrlPrefix;
    @RequestMapping(value = "/common/statistics/saveRecord")
    @ResponseBody
    public ResultEntity getShareLink(Integer pageNum,Integer activityId, String token) {
        String url = this.apiUrlPrefix + AppUrlConfig.COMMON_STATISTICS;
        Map<String, Object> paramsMap = new HashMap<String,Object>();
        paramsMap.put("pageNum", pageNum);
        paramsMap.put("token", token);
        paramsMap.put("activityId", activityId);
        String jsonResult = HttpUtil.doPostRequest(url, paramsMap);
        ResultEntity resultData=GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
        return resultData;
    }
}
