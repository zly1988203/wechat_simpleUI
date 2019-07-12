package com.olakeji.passenger.wechat.controller.busTicket;

import com.alibaba.fastjson.JSON;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.entity.BaseBus;
import com.olakeji.passenger.wechat.entity.OrderInformation;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.common.passenger.CommonResultConvert;
import com.olakeji.tsp.utils.DateUtils;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.utils.StringUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

@Controller
@RequestMapping(value = "busTicket")
public class BusTicketController extends BaseController {
    private Logger logger = LoggerFactory.getLogger(BusTicketController.class);

    @RequestMapping(value = "/getStation")
    public @ResponseBody
    String getStation() {
        String url = apiUrlPrefix + AppUrlConfig.BUSTICKET_GETSTATION;
        Map<String, String> paramsMap = new HashMap<String, String>();
        Map<String, String> params = this.genReqApiData(url, paramsMap);
        String jsonResult = HttpUtil.doPostReq(url, params);
        ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
        return GsonUtil.GsonString(resultData);
    }

    @RequestMapping(value = "/getCitys")
    public @ResponseBody
    String getCity() {
        String url = apiUrlPrefix + AppUrlConfig.BUSTICKET_GETCITY;
        Map<String, String> paramsMap = new HashMap<String, String>();
        Map<String, String> params = this.genReqApiData(url, paramsMap);
        String jsonResult = HttpUtil.doPostReq(url, params);

        ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
        return GsonUtil.GsonString(resultData);
    }

    @RequestMapping(value = "/queryLineList")
    public String queryLineList(String departPid, String arrivePid, String departStation,
                                String arriveStation, String departDate, Model model) {
        if (StringUtils.isEmpty(departDate) || DateUtils.parse(departDate).getTime() < new Date().getTime()) {//如果出发日期为空或者比当前日期小，默认为今天
            departDate = DateUtils.format(new Date(), "yyyy-MM-dd");
        }
        String url = apiUrlPrefix + AppUrlConfig.BUSTICKET_QUERY_LINE_LIST;
        Map<String, String> paramsMap = new HashMap<String, String>();
        paramsMap.put("departPid", departPid);
        paramsMap.put("arrivePid", arrivePid);
        paramsMap.put("departStation", departStation);
        paramsMap.put("arriveStation", arriveStation);
        paramsMap.put("departDate", departDate);
        Map<String, String> params = this.genReqApiData(url, paramsMap);
        String jsonResult = HttpUtil.doPostReq(url, params);

        ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
        model.addAttribute("data", resultData.getData());
        model.addAttribute("departPid", departPid);
        model.addAttribute("arrivePid", arrivePid);
        model.addAttribute("departStation", departStation);
        model.addAttribute("arriveStation", arriveStation);
        model.addAttribute("currentDateStr", DateUtils.format(new Date(), "yyyy-M-d"));
        return "busTicketLineList";

    }

    @RequestMapping(value = "/getLineList")
    @ResponseBody
    public String getLineList(String departPid, String arrivePid, String departStations,
                              String arriveStations, String departDate, String selectTimes, Model model) {
        String url = apiUrlPrefix + AppUrlConfig.BUSTICKET_GET_LINE_LIST;
        Map<String, String> paramsMap = new HashMap<String, String>();
        paramsMap.put("departPid", departPid);
        paramsMap.put("arrivePid", arrivePid);
        paramsMap.put("departStations", departStations);
        paramsMap.put("arriveStations", arriveStations);
        paramsMap.put("departDate", departDate);
        paramsMap.put("selectTimes", selectTimes);
        Map<String, String> params = this.genReqApiData(url, paramsMap);
        String jsonResult = HttpUtil.doPostReq(url, params);

        return jsonResult;

    }

    @RequestMapping("/baseBusDetail")
    @ResponseBody
    public String baseBusInfo(HttpServletRequest request) {
        String busId = request.getParameter("busId");
        String requestUrl = request.getRequestURL().toString();
        String postUrl = apiUrlPrefix + AppUrlConfig.BUSTICKET_BASE_BUS_DETAIL;
        Map<String, String> params = new HashMap<String, String>();
        params.put("busId", busId);
        params.put("requestUrl", requestUrl);
        Map<String, String> postParams = this.genReqApiData(postUrl, params);
        String resultGson = HttpUtil.doPostReq(postUrl, postParams);
        return resultGson;
    }

    /**
     * 汽车票批量退票
     *
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/busTicketRefund")
    public String busTicketRefund(HttpServletRequest request, Model model) {
        String url = apiUrlPrefix + AppUrlConfig.BUSTICKET_REFUND;
        Map<String, String> paramsMap = new HashMap<String, String>();
        String orderNo = request.getParameter("orderNo");
        paramsMap.put("orderNo", orderNo);
        Map<String, String> params = this.genReqApiData(url, paramsMap);
        String jsonResult = HttpUtil.doPostReq(url, params);
        ResultEntity resultData = GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
        Map data1 = GsonUtil.GsonToBean(GsonUtil.GsonString(resultData.getData()), Map.class);
        Object time = data1.get("boardingTime");
        Object time1 = data1.get("boardingTime1");
        Object arriveStation = data1.get("arriveTitle");
        Object departStation = data1.get("departTitle");
        model.addAttribute("time", time1 + "");
        model.addAttribute("ticket", resultData.getData());
        model.addAttribute("WeekTime", time + "");
        model.addAttribute("arriveStation", arriveStation + "");
        model.addAttribute("departStation", departStation + "");
        return "busTicketRefund";
    }

    /**
     * 汽车票退票信息
     *
     * @return
     */
    @RequestMapping(value = "/toBusTicketRefund")
    @ResponseBody
    public String toBusTicketRefund(String token, Byte businessType, String ticketDate,
                                    @RequestParam(value = "ticketSerialNos", required = false) String ticketSerialNos) {
        long time = 0;
        if (!"".equals(ticketDate) && ticketDate != null) {
            time = DateUtils.dateToUnixTimestamp(ticketDate);
        }
        String busData = HttpUtil.doGetRequest(apiUrlPrefix + AppUrlConfig.CHECK_BUSTICKET +
                "?token=" + this.getToken() + "&ticketDate=" + time + "&ticketSerialNos=" + ticketSerialNos + "&businessType=" + businessType);
        return busData;
    }

    /**
     * 汽车票确认退票信息
     */
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "toTicketRefundDetail", method = RequestMethod.GET)
    public String toTicketRefundDetail(Model model, String token, Byte businessType, String ticketDate, @RequestParam(value = "ticketSerialNos", required = false) String ticketSerialNos) {
        long time = DateUtils.dateToUnixTimestamp(ticketDate);
        String busData = HttpUtil.doGetRequest(apiUrlPrefix + AppUrlConfig.GET_TICKET_REFUND_DETAIL + "?token=" + this.getToken() + "&ticketDate=" + time + "&ticketSerialNos=" + ticketSerialNos + "&businessType=" + businessType);
        Map<String, Object> map = (Map<String, Object>) GsonUtil.GsonToBean(busData, ResultEntity.class).getData();
        model.addAttribute("map", map);
        model.addAttribute("token", token);
        model.addAttribute("businessType", businessType);
        model.addAttribute("ticketDate", ticketDate);
        model.addAttribute("ticketSerialNos", ticketSerialNos);
        return "busTicketRefundConfirm";
    }

    /**
     * 进入添加订单界面
     *
     * @param request
     * @param model
     * @return
     */
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "toAddOrder")
    public String toAddOrder(HttpServletRequest request, Model model, String busId) {
        String token = getToken();
        String departPid = request.getParameter("departPid");
        String arrivePid = request.getParameter("arrivePid");
        String departStation = request.getParameter("departStation");
        String arriveStation = request.getParameter("arriveStation");
        String departDate = request.getParameter("departDate");
        model.addAttribute("departPid", departPid);
        model.addAttribute("arrivePid", arrivePid);
        model.addAttribute("departStation", departStation);
        model.addAttribute("arriveStation", arriveStation);
        model.addAttribute("departDate", departDate);
        String url = apiUrlPrefix + AppUrlConfig.TO_ADD_BUSTICKET_ORDER;
        Map<String, String> requestParam = new HashMap<String, String>();
        requestParam.put("busId", busId);
        requestParam.put("token", token);

        String jsonResult = HttpUtil.doPostReq(url, requestParam);
        logger.info("url = {}, result = {}", url, jsonResult);
        ResultEntity resultEntity = JSON.parseObject(jsonResult, ResultEntity.class);
        if (resultEntity.getCode() != Constant.SUCCESS) {
            model.addAttribute("result", resultEntity);
            return "errorTicket";
        }

        Map<String, Object> data = JSON.parseObject(JSON.toJSONString(resultEntity.getData()), Map.class);
        model.addAttribute("needInsurance", data.get("needInsurance"));
        model.addAttribute("insuranceRulePriceList", data.get("insuranceRulePriceList"));
        model.addAttribute("remindContent", data.get("remindContent"));
        model.addAttribute("line", data.get("line"));
        // 最大允许购票数
        model.addAttribute("ticketMaxBuyNumber", data.get("ticketMaxBuyNumber"));
        Object baseBusObj = data.get("baseBus");

        if (baseBusObj != null) {//车次信息是否为空
            BaseBus baseBus = GsonUtil.GsonToBean(GsonUtil.GsonString(baseBusObj), BaseBus.class);
            model.addAttribute("baseBus", baseBus);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(baseBus.getDepartDate());
            Map<String, String> weekChiness = weekMap();
            model.addAttribute("weekDay", weekChiness.get(calendar.get(Calendar.DAY_OF_WEEK) + ""));
        }
        Object ticketRuleObj = data.get("ticketRule");
        if (ticketRuleObj != null) {
            model.addAttribute("ticketRule", ticketRuleObj + "");
        }
        for (Entry<String, Object> entry : data.entrySet()) {
            String entryKey = entry.getKey();
            if (!entryKey.equals("baseBus") && !entryKey.equals("ticketRule")) {
                model.addAttribute(entryKey, entry.getValue());
            }
        }

        return "toAddBusTicketOrder";
    }

    /**
     * 周映射
     *
     * @return
     */
    private Map<String, String> weekMap() {
        Map<String, String> weekChiness = new HashMap<String, String>();
        weekChiness.put("7", "六");
        weekChiness.put("1", "天");
        weekChiness.put("2", "一");
        weekChiness.put("3", "二");
        weekChiness.put("4", "三");
        weekChiness.put("5", "四");
        weekChiness.put("6", "五");
        return weekChiness;
    }

    /**
     * 确定添加订单
     *
     * @param request
     * @return
     */
    @SuppressWarnings("deprecation")
    @RequestMapping(value = "addOrder")
    @ResponseBody
    public String addOrder(HttpServletRequest request, OrderInformation orderInformation) {
        String postUrl = apiUrlPrefix + AppUrlConfig.BUSTICKET_ADDORDER;
        Map<String, String> paramsMap = CommonResultConvert.convertEntityToMap(orderInformation, new HashMap<String, String>(), new String[]{"busId", "passengerContactIds"});

        // 保险
        String insuranceConfirm = StringUtil.isEmpty(request.getParameter("insuranceConfirm")) ? "0"
                : request.getParameter("insuranceConfirm");
        String insurancePay = request.getParameter("insurancePay");
        String insuranceType = request.getParameter("insuranceType");
        String insurancePrice = request.getParameter("insurancePrice");

        paramsMap.put("insuranceConfirm", insuranceConfirm);
        paramsMap.put("insurancePay", insurancePay);
        paramsMap.put("insuranceType", insuranceType);
        paramsMap.put("insurancePrice", insurancePrice);


        Map<String, String> params = this.genReqApiData(postUrl, paramsMap);
        String resultGson = HttpUtil.doPostReq(postUrl, params);
        return resultGson;
    }

    public final String StringPattern(String date, String oldPattern, String newPattern) {
        if (date == null || oldPattern == null || newPattern == null)
            return "";
        SimpleDateFormat sdf1 = new SimpleDateFormat(oldPattern);        // 实例化模板对象
        SimpleDateFormat sdf2 = new SimpleDateFormat(newPattern);        // 实例化模板对象
        Date d = null;
        try {
            d = sdf1.parse(date);   // 将给定的字符串中的日期提取出来
        } catch (Exception e) {            // 如果提供的字符串格式有错误，则进行异常处理
            e.printStackTrace();       // 打印异常信息
        }
        return sdf2.format(d);
    }

}

	
