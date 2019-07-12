package com.olakeji.passenger.wechat.controller.busline;

import com.alibaba.fastjson.JSON;
import com.google.gson.reflect.TypeToken;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.entity.BaseProviderBasicConfig;
import com.olakeji.passenger.wechat.entity.CouponReceiveRecord;
import com.olakeji.passenger.wechat.entity.OrderInformation;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "/cityBus")
public class BusCityController extends BaseController {
    @RequestMapping(value = "/getOpenCitys")
    @ResponseBody
    public String getCitys(HttpServletRequest request,
                           @RequestParam(required = false, defaultValue = "") Integer departAreaId,
                           @RequestParam(required = false, defaultValue = "") String departCityName,
                           @RequestParam(required = false, defaultValue = "") Integer arriveAreaId,
                           @RequestParam(required = false, defaultValue = "") String arriveCityName,
                           @RequestParam(required = false, defaultValue = "1") Integer lineType,
                           @RequestParam(required = false, defaultValue = "1") String stationType) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("requestUrl", request.getRequestURL().toString());
        map.put("departAreaId", departAreaId);
        map.put("departCityName", departCityName);
        map.put("arriveAreaId", arriveAreaId);
        map.put("arriveCityName", arriveCityName);
        map.put("lineType", lineType);
        map.put("stationType", stationType);
        String content = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.NEW_GET_OPENCITYS, map);
        return content;
    }

    @RequestMapping(value = "/getOpenAreas")
    @ResponseBody
    public String getOpenAreas(HttpServletRequest request,
                               @RequestParam(required = false, defaultValue = "") Integer departAreaId,
                               @RequestParam(required = false, defaultValue = "") String departCityName,
                               @RequestParam(required = false, defaultValue = "") Integer arriveAreaId,
                               @RequestParam(required = false, defaultValue = "") String arriveCityName,
                               @RequestParam(required = false, defaultValue = "1") Integer lineType,
                               @RequestParam(required = false, defaultValue = "1") String stationType) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("requestUrl", request.getRequestURL().toString());
        map.put("departAreaId", departAreaId);
        map.put("departCityName", departCityName);
        map.put("arriveAreaId", arriveAreaId);
        map.put("arriveCityName", arriveCityName);
        map.put("lineType", lineType);
        map.put("stationType", stationType);
        String content = HttpUtil.doPostRequest(apiUrlPrefix + AppUrlConfig.NEW_GET_OPENAEAR, map);
        return content;
    }
    @RequestMapping(value = "/buyTicket")
    public String toLineDetail(String busId, String qrcId, Model model) {
        model.addAttribute("busId", busId);
        model.addAttribute("qrcId", qrcId);
        return "buyTicket";
    }
    @RequestMapping(value = "/lineMap")
    public String lineMap( String orderNo, String departDate, Model model) {
        model.addAttribute("orderNo", orderNo);
        model.addAttribute("departDate", departDate);
        return "lineMap";
    }
    @RequestMapping(value = "/lineListCityBus")
    public String listList(Integer providerId, Integer lineId, String lineListIds, BigDecimal lng,BigDecimal lat,
                           String lineType,String lineName,String busId,String search,Integer departCityId,String departCityName,
            BigDecimal departLat,BigDecimal departLng,String departDate,String startAddr,String endAddr,String arriveCityName,
            BigDecimal arriveLng,BigDecimal arriveLat,Integer arriveCityId,String distrib, String qrcId,
            Model model) {
        if(StringUtils.isNotEmpty(qrcId)){
            logger.info("/cityBus/lineList接口qrcId@{},@{}",qrcId,lineName);
        }
        model.addAttribute("providerId", providerId);
        model.addAttribute("lineId", lineId);
        model.addAttribute("lineListIds", lineListIds);
        model.addAttribute("lng", lng);
        model.addAttribute("lat", lat);
        model.addAttribute("lineType", lineType);
        model.addAttribute("lineName", lineName);
        model.addAttribute("busId", busId);
        model.addAttribute("search", search);
        model.addAttribute("departCityId", departCityId);
        model.addAttribute("departCityName", departCityName);
        model.addAttribute("departLat", departLat);
        model.addAttribute("departLng", departLng);
        model.addAttribute("departDate", departDate);
        model.addAttribute("startAddr", startAddr);
        model.addAttribute("endAddr", endAddr);
        model.addAttribute("arriveCityName", arriveCityName);
        model.addAttribute("arriveLng", arriveLng);
        model.addAttribute("arriveLat", arriveLat);
        model.addAttribute("arriveCityId", arriveCityId);
        model.addAttribute("distrib", distrib);
        model.addAttribute("qrcId",qrcId);
        return "lineListNew";
    }
    @RequestMapping(value = "/myTripList")
    public String myTripList(Model model) {
        return "myTripList";
    }

    /**
     * 跳转至展示票页面
     * @param model
     * @return
     */
    @RequestMapping(value = "/goShowTicket")
    public String showTicket( Model model) {
        return "showTicket";
    }

    /**
     * 跳至购票页面
     * @param model
     * @param busId
     * @param qrcId
     * @return
     */
    @RequestMapping(value = "/goBusOnlinePayPage")
    public String goBusOnlinePayPage( Model model,String busId, String qrcId) {
        String token = this.getToken();
        model.addAttribute("token", token);
        model.addAttribute("busId",busId);
        model.addAttribute("qrcId",qrcId);
        return "new_payment";
    }
}
