package com.olakeji.passenger.wechat.controller.distribution;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.cache.RedisUtil;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.entity.BaseUser;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * 分销web接口类
 * @author piggy
 *
 */

@Controller
public class DistributionController extends BaseController{
	Logger logger = LoggerFactory.getLogger(DistributionController.class);

	@RequestMapping("/distrib/getDistribUrl")
	@ResponseBody
	public String getDistribUrl(@RequestParam("lineId")String lineId, @RequestParam("url")String url,
			@RequestParam("distribType")String distribType, @RequestParam("domain")String domain,
								@RequestParam("businessType")String businessType) {
		String apiUrl = this.apiUrlPrefix + AppUrlConfig.Distribution.GET_DISTRIB_URL;
		//从session里面获取用户信息
		BaseUser baseUser = this.getBaseUser();
		if (baseUser==null) {
			return ResultEntity.setFailJson("用户未登录");
		}
		logger.info("baseUser===="+GsonUtil.GsonString(baseUser));
		
		Map<String, String> map = new HashMap<String, String>();
		map.put("lineId", lineId);
		map.put("url", url);
		map.put("distribType", distribType);
		map.put("businessType", businessType);
		//获取客户端域名
		map.put("domain", domain);
		
		map = this.genReqApiData(apiUrl, map);
		String resultString = HttpUtil.doPostReq(apiUrl, map);
		return resultString;
	}
	
	@RequestMapping("/distrib/order")
	@ResponseBody
	//public ResultEntity getDistribUrl(@ValidParameter CommonParam commonParam, HttpServletRequest request) {
	public String order(HttpServletRequest request) {
		String apiUrl = this.apiUrlPrefix + "/distrib/order";
		Map<String, String> map = new HashMap<String, String>();
		map = this.genReqApiData(apiUrl, map);
		String resultString = HttpUtil.doPostReq(apiUrl, map);
		return resultString;
	}

	@RequestMapping("/distribution/bountyHunter")
	public String bountyHunter(Model model, HttpServletRequest request) {
		return "bountyHunter";
	}

	@RequestMapping("/distribution/myBounty")
	public String myBounty(Model model, HttpServletRequest request) {
		return "myBounty";
	}
}
