package com.olakeji.passenger.wechat.controller.qrcforline;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.olakeji.passenger.wechat.controller.BaseController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.google.gson.reflect.TypeToken;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.IndexController;
import com.olakeji.passenger.wechat.entity.BaseBus;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.DateUtils;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.utils.StringUtil;

/**
 * 根据线路二维码获取线路列表
 * @author walle
 *
 */
@Controller
@RequestMapping("/qrcForLine")
public class QrcForLineController extends BaseController {
	@Value("${passenger.api.url}")
	private String apiUrlPrefix;

	@RequestMapping("/lineList")
	@SuppressWarnings("unchecked")
	public String getLineList(HttpServletRequest request,Model model) throws UnsupportedEncodingException {
		String requestUrl = request.getRequestURL().toString();
		String departDate = request.getParameter("departDate");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		if(StringUtil.isEmpty(departDate)){
			departDate = sdf.format(new Date());
		}
		String qrcId = request.getParameter("qrcId");
		String  url=apiUrlPrefix+AppUrlConfig.QRC_LINELIST+"?requestUrl="+requestUrl+"&departDate=" + departDate +//
				"&qrcId=" + qrcId;
		String busData=HttpUtil.doGetRequest(url);
		ResultEntity resultEntity=GsonUtil.GsonToBean(busData,ResultEntity.class);
		if(resultEntity.getCode().equals(Constant.SUCCESS)){
			if(resultEntity.getData()!=null){
				Map<String,Object> map = ((Map<String,Object>)resultEntity.getData());
				String qrcName = (String)((Map<String,Object>)resultEntity.getData()).get("qrcName");
				String qrcType = (String)((Map<String,Object>)resultEntity.getData()).get("qrcType");
				String lineName = qrcName;
				Integer qrcodeType = Integer.valueOf(qrcType);
				if(qrcodeType == 0){
					//定制班线
					//return "lineList";
					String redirectUrl = "/cityBus/lineListCityBus?lineListIds="+(String)map.get("lineIds") +"&qrcId="+qrcId+"&distrib=1&lineType="+Constant.BusLineType.busLine+"&lineName="+ URLEncoder.encode(lineName, "UTF-8");
					logger.info("二维码跳转的地址为@{}",redirectUrl);
					return "redirect:"+redirectUrl;
				}else if(qrcodeType == 1){
					//上下班班线
					String redirectUrl = "/commutingBus/searchLineResult?lineId="+(String)map.get("lineIds")+"&qrcId="+qrcId+"&searchType=4"+
							"&distrib=1&lineType="+Constant.BusLineType.commuteLine+"&lineName="+URLEncoder.encode(lineName, "UTF-8");
					logger.info("二维码跳转的地址为@{}",redirectUrl);
					return "redirect:"+redirectUrl;
				}
			}
		}else{
			return "/qrcForLine/failure?qrcodeId="+ qrcId;//线路二维码被禁用
		}
		return null;
	}
	
	@RequestMapping(value="/failure")
	public String failure(HttpServletRequest request,Model model,Integer qrcodeId){
		Map<String, Object> map = new HashMap<>();
		map.put("qrcodeId", qrcodeId);
		String entity = HttpUtil.doPostRequest(apiUrlPrefix+AppUrlConfig.QRCODE_TEL, map);
		ResultEntity resultEntity=GsonUtil.GsonToBean(entity,ResultEntity.class);
		Map<String, Object> data = GsonUtil.GsonToMaps(GsonUtil.GsonString(resultEntity.getData()));
		model.addAttribute("map", data);
		return "failure";
	}
}
