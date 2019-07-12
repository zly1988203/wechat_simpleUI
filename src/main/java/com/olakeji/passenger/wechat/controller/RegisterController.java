package com.olakeji.passenger.wechat.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.olakeji.common.wechat.api.WeChatCommonService;
import com.olakeji.common.wechat.api.WechatCommonApiService;
import com.olakeji.common.wechat.bean.user.WeChatUser;
import com.olakeji.common.wechat.exception.WeChatErrorException;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.olakeji.cache.RedisUtil;
import com.olakeji.passenger.wechat.entity.BaseUser;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.passenger.wechat.utils.StringUtil;
import com.olakeji.tsp.cache.CacheKey;
import com.olakeji.tsp.utils.GsonUtil;

/**
 * 注册成功跳转二维码中转
 * @author ZERO
 *
 */
@Controller
public class RegisterController {
	private final Logger logger = LoggerFactory.getLogger(getClass());
	
	//增加注册数
	private static final String ADDBASEOAUTH = "/Account/addUserOauth";
	
	@Value("${passenger.api.url}")
	private String apiUrl;
	/**
	 * redis工具
	 */
	@Autowired
	private RedisUtil redisUtil;

	@Autowired
	private WeChatCommonService commonService;
	
	/**
	 * 注册结果页面 
	 * @param registerAmount
	 * @param inviterId
	 * @param model
	 * @param request
	 * @return
	 */
	@RequestMapping("/v2/registerResult")
	public String registerResult(@RequestParam(value="registerAmount",required = false)String registerAmount,
			@RequestParam(value="inviterId",required = false)String inviterId,Model model,HttpServletRequest request){
		String code=request.getParameter("code");
		String state=request.getParameter("state");
		String token=null;
		logger.error(" 邀请注册界面回调l :"+ code+ "_" + state );
		if (!StringUtils.isEmpty(state)) {
			String[] paramArray=state.split("_");
			token = paramArray[0].replace(" ", "+");//第一个为用户登录的token
			registerAmount=paramArray[3];
			inviterId=paramArray[4];
		}
		if(!StringUtil.isEmpty(code)){//开发模式code允许为空
				String baseUserStr=(String)redisUtil.get(token);
				BaseUser baseUser=GsonUtil.GsonToBean(baseUserStr, BaseUser.class);
				String openId=null;
				openId=getOpenId(code, String.valueOf(baseUser.getProviderId()));//用户的openid
				if(!StringUtils.isEmpty(openId)){
					redisUtil.set(CacheKey.WX_USER_OPENID+token, openId);
					String appid = redisUtil.getString(CacheKey.WX_APP_ID_PREFIX + baseUser.getProviderId());
					redisUtil.set(CacheKey.WX_USER_OPENID_ORDER + appid + "_" + baseUser.getMobile(), openId);
				//	redisUtil.set(CacheKey.WX_USER_OPENID_ORDER + baseUser.getMobile(), openId);
				//	redisUtil.set(CacheKey.WX_USER_OPENID_ORDER + baseUser.getProviderId() + "_" +  baseUser.getMobile(), openId);
					logger.error("登录存放的redis key:"+ CacheKey.WX_USER_OPENID_ORDER + baseUser.getProviderId() + "_" + baseUser.getMobile() +
							"==================================================================值：" + openId);
					
					//新增注册数
					Map<String,Object> map = new HashMap<String,Object>();
					model.addAttribute("providerId", baseUser.getProviderId());
					map.put("providerId", String.valueOf(baseUser.getProviderId()));
					map.put("mobile",baseUser.getMobile());
					map.put("openId",openId);
					HttpUtil.doPostRequest(apiUrl+ADDBASEOAUTH,map);
				}
			
				model.addAttribute("inviterId", inviterId);
				model.addAttribute("registerAmount", registerAmount);
			logger.debug("  token为:"+token+" 车企编号为:"+baseUser.getProviderId()+" openid为"+openId);
		}
		return "/common/register-result";
	}
	
	
	//通过code获取openId  
	public String getOpenId(String code, String providerId) {
		logger.info("传递额参数" + code + "   " + providerId);
		if (!StringUtil.isEmpty(code)) {
			String appid = redisUtil.getString(CacheKey.WX_APP_ID_PREFIX + providerId); //redisUtil.getString(CacheKey.WX_APP_ID_PREFIX+providerId);//车企的appId ; "wx4cc488f3ef931e9b"
			String appSecret = redisUtil.getString(CacheKey.WX_APP_SERCET_PREFIX + providerId);//;//车企的秘钥  "907813991033958efc507dde7b1b3523"
			logger.info("appId为" + appid + " 秘钥为" + appSecret);
			/*String result = HttpUtil.doGetRequest("https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + appSecret + "&code=" + code + "&grant_type=authorization_code");
			logger.info("token url ======================================  :" + "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + appSecret + "&code=" + code + "&grant_type=authorization_code");
			logger.info("http result  json  =============================" + GsonUtil.GsonString(result));
			if (!StringUtil.isEmpty(result)) {
				Map<String, String> resultMap = GsonUtil.GsonToMaps(result);
				logger.info("获取到的access_token:" + resultMap.get("access_token") + "==================================================================");
				if (resultMap.get("openid") != null) {
					return resultMap.get("openid").toString();
				}
			}*/
			try {
				WeChatUser weChatUser = this.commonService.getUserService().getUserAuthToken(appid, appSecret, code);
				logger.info("获取到的access_token:{}", weChatUser.getAccessToken());
				return weChatUser.getOpenId();
			} catch (WeChatErrorException ex) {
				logger.error("get open id exception = {}", ex.getMessage());
			}
		}
		return "";
	}
}
