package com.olakeji.passenger.wechat.controller.busline;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.DateUtils;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.vo.PassengerTicketListVo;

@Controller
@RequestMapping(value = "busTicket")
public class OrderBusTicketInfoController extends BaseController {

	@Value("${passenger.api.url}")
	private String apiUrlPrefix;

	@RequestMapping(value = "/toTicketListPage")
	public String toTicketListPage(String token, Integer page, HttpServletResponse response) {
		response.setStatus(302);
		response.setHeader("Location", "/trip/toTripListPage");
		return "/ticket/ticketList";
	}

	@RequestMapping(value = "/toCommuteTicketListPage")
	public String toCommuteTicketListPage(String token, Integer page) {
		return "/ticket/commuteTicketList";
	}

	@RequestMapping(value = "/ticketList")
	public @ResponseBody String OrderDetailReservation(HttpServletRequest request, String token, Integer page) {
		if (page == null) {
			page = 1;
		}
		String requestUrl = request.getRequestURL().toString();
		String url = apiUrlPrefix + AppUrlConfig.GET_TICKET_LIST + "?token=" + this.getToken() + "&page=" + page
				+ "&requestUrl=" + requestUrl;
		String busData = HttpUtil.doGetRequest(url);
		return busData;
	}

	@RequestMapping(value = "/ticketCommuteList")
	public @ResponseBody String ticketCommuteList(String token, Integer page) {
		if (page == null) {
			page = 1;
		}
		String busData = HttpUtil.doGetRequest(
				apiUrlPrefix + AppUrlConfig.GET_COMMUTE_TICKET_LIST + "?token=" + this.getToken() + "&page=" + page);
		return busData;
	}

	@RequestMapping(value = "/commuteTicketDetail", method = RequestMethod.GET)
	public String commuteTicketDetail(Integer ticketId, String token, Model model) {
		String result = HttpUtil.doGetRequest(apiUrlPrefix + AppUrlConfig.GET_COMMUTE_TICKET_DETAIL + "?ticketId="
				+ ticketId + "&token=" + this.getToken());
		ResultEntity entity = GsonUtil.GsonToBean(result, ResultEntity.class);
		if (entity.getCode() == Constant.FAILURE) {
			return "noPrivilege";
		}
		model.addAttribute("result", entity);
		return "/ticket/commuteTicketDetail";
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/ticketDetail", method = RequestMethod.GET)
	public String ticketDetail(Integer ticketId, String token, Integer commentFlag, Model model) {
		String result = HttpUtil.doGetRequest(
				apiUrlPrefix + AppUrlConfig.GET_TICKET_DETAIL + "?ticketId=" + ticketId + "&token=" + this.getToken());
		ResultEntity entity = GsonUtil.GsonToBean(result, ResultEntity.class);
		if (entity.getCode() == Constant.FAILURE) {
			return "noPrivilege";
		}
		PassengerTicketListVo vo = GsonUtil.GsonToBean(
				GsonUtil.GsonString(((Map<String, Object>) entity.getData()).get("list")), PassengerTicketListVo.class);
		String isComment = (String) ((Map<String, Object>) entity.getData()).get("isComment");
		String date = vo.getDepartDate() + " " + vo.getDepartTime();
		long timeStamp = DateUtils.dateToUnixTimestamp(date) - new Date().getTime();
		vo.setCountDown(timeStamp / 1000 + "");
		vo.setDepartDate(StringPattern(vo.getDepartDate(), "yyyy-MM-dd", "MM月dd日"));
		vo.setDepartTime(StringPattern(vo.getDepartTime(), "HH:mm:ss", "HH:mm"));
		model.addAttribute("result", vo);
		model.addAttribute("isComment", Integer.valueOf(isComment));
		model.addAttribute("commentFlag", commentFlag);
		return "/ticket/show-ticket";
	}

	@RequestMapping(value = "/refundRate")
	public @ResponseBody String refundRate(String token, Byte businessType, String ticketDate,
			@RequestParam(value = "ticketSerialNo", required = false) String ticketSerialNo) {
		long time = 10;
		if (!"".equals(ticketDate) && ticketDate != null) {
			String tic = "";
			if (ticketDate.contains("-")) {
				tic = ticketDate;
			} else {
				tic = StringPattern(ticketDate, "yyyy年MM月dd日 HH:mm", "yyyy-MM-dd HH:mm");
			}
			time = DateUtils.dateToUnixTimestamp(tic);
		}
		String busData = HttpUtil.doGetRequest(
				apiUrlPrefix + AppUrlConfig.GET_TICKET_REFUNDRATE + "?token=" + this.getToken() + "&ticketDate=" + time
						+ "&ticketSerialNo=" + ticketSerialNo + "&businessType=" + businessType);
		return busData;
	}

	/**
	 * 车票解锁
	 * 
	 * @param ticketId
	 * @return
	 */
	@RequestMapping(value = "unLockTicket")
	public @ResponseBody String unLockTicket(Integer ticketId, String token) {
		String responseData = HttpUtil.doGetRequest(
				apiUrlPrefix + AppUrlConfig.UNLOCK_TICKET + "?ticketId=" + ticketId + "&token=" + this.getToken());
		return responseData;
	}

	/**
	 * 车票解锁(通勤)
	 * 
	 * @param ticketId
	 * @return
	 */
	@RequestMapping(value = "unLockCommuteTicket")
	public @ResponseBody String unLockCommuteTicket(Integer ticketId, String token) {
		String responseData = HttpUtil.doGetRequest(apiUrlPrefix + AppUrlConfig.UNLOCK_COMMUTE_TICKET + "?ticketId="
				+ ticketId + "&token=" + this.getToken());
		return responseData;
	}

	public final String StringPattern(String date, String oldPattern, String newPattern) {
		if (date == null || oldPattern == null || newPattern == null)
			return "";
		SimpleDateFormat sdf1 = new SimpleDateFormat(oldPattern); // 实例化模板对象
		SimpleDateFormat sdf2 = new SimpleDateFormat(newPattern); // 实例化模板对象
		Date d = null;
		try {
			d = sdf1.parse(date); // 将给定的字符串中的日期提取出来
		} catch (Exception e) { // 如果提供的字符串格式有错误，则进行异常处理
			e.printStackTrace(); // 打印异常信息
		}
		return sdf2.format(d);
	}

	@RequestMapping("/getTicketListByDate")
	@ResponseBody
	public String getTicketListByDay(HttpServletRequest request) {
		String date = request.getParameter("date");
		if (StringUtils.isEmpty(date)) {
			date = DateUtils.format(new Date(), "yyyy-MM-dd");
		}
		Map<String, String> params = new HashMap<String, String>();
		String token = this.getToken();
		params.put("token", token);
		params.put("date", date);
		String url = apiUrlPrefix + AppUrlConfig.GET_TICKET_LIST_BY_DATE;
		params = this.genReqApiData(url, params);
		String busData = HttpUtil.doPostReq(url, params);
		return busData;
	}

	@RequestMapping(value = "/checkBusTicketRefund")
	public @ResponseBody String checkBusTicketRefund(String token, Byte businessType,
			@RequestParam(value = "ticketSerialNos", required = false) String ticketSerialNos) {
		String busData = HttpUtil.doGetRequest(
				apiUrlPrefix + AppUrlConfig.CHECK_BUSTICKET_REFUND + "?token=" + this.getToken() 
						+ "&ticketSerialNos=" + ticketSerialNos + "&businessType=" + businessType);
		return busData;
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "toRefundDetail", method = RequestMethod.GET)
	public String toRefundDetail(Model model, String token, Byte businessType, 
			@RequestParam(value = "ticketSerialNos", required = false) String ticketSerialNos) {
		String busData = HttpUtil.doGetRequest(
				apiUrlPrefix + AppUrlConfig.GET_TICKET_REFUND_DETAIL + "?token=" + this.getToken()  + "&ticketSerialNos=" + ticketSerialNos + "&businessType=" + businessType);
		Map<String, Object> map = (Map<String, Object>) GsonUtil.GsonToBean(busData, ResultEntity.class).getData();
		model.addAttribute("map", map);
		model.addAttribute("token", token);
		model.addAttribute("businessType", businessType + "");
		model.addAttribute("ticketSerialNos", ticketSerialNos);
		return "/ticket/refund-detail";
	}
}
