package com.olakeji.passenger.wechat.controller.distribution;

import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.entity.BaseUser;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * 分销web接口类
 * @author piggy
 *
 */

@Controller
public class DistributionInfoController extends BaseController{
	
	Logger logger = LoggerFactory.getLogger(DistributionInfoController.class);
	
	/**
	 * 代表什么模式
	 */
	@Value("${mode}")
	private String mode;
	
	@RequestMapping("/distrib/getBountyInfo")
	@ResponseBody
	public String getBountyInfo() {
		logger.info("进入推广员相关信息接口");
		//从session里面获取用户信息
		BaseUser baseUser = this.getBaseUser();
		if (baseUser==null) {
			return ResultEntity.setFailJson("用户未登录");
		}
		logger.info("baseUser===="+GsonUtil.GsonString(baseUser));

		String url = this.apiUrlPrefix + AppUrlConfig.Distribution.GET_DISTRIB_BOUNTYINFO;
		Map<String, String> paramsMap = new HashMap<String,String>(); 
		paramsMap.put("token", this.getToken());
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity resultData=GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		return GsonUtil.GsonString(resultData);
	}
	
	@RequestMapping("/distrib/getPromoterLineList")
	@ResponseBody
	public String getPromoterLineList(@RequestParam("page")String page) {
		logger.info("进入推广线路列表接口 参数 page{}",page);
		//从session里面获取用户信息
		BaseUser baseUser = this.getBaseUser();
		if (baseUser==null) {
			return ResultEntity.setFailJson("用户未登录");
		}
		logger.info("baseUser===="+GsonUtil.GsonString(baseUser));

		String url = this.apiUrlPrefix + AppUrlConfig.Distribution.GET_DISTRIB_LINELIST;
		Map<String, String> paramsMap = new HashMap<String,String>(); 
		paramsMap.put("page", page);
		paramsMap.put("token", this.getToken());
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity resultData=GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		return GsonUtil.GsonString(resultData);
	}

	@RequestMapping("/distrib/getBountyDetailList")
	@ResponseBody
	public String getBountyDetailList(@RequestParam("type")String type) {
		logger.info("进入收支明细列表接口 参数 type{}",type);
		//从session里面获取用户信息
		BaseUser baseUser = this.getBaseUser();
		if (baseUser==null) {
			return ResultEntity.setFailJson("用户未登录");
		}
		logger.info("baseUser===="+GsonUtil.GsonString(baseUser));

		String url = this.apiUrlPrefix + AppUrlConfig.Distribution.GET_DISTRIB_BOUNTYDETAILLIST;
		Map<String, String> paramsMap = new HashMap<String,String>(); 
		paramsMap.put("type", type);
		paramsMap.put("token", this.getToken());
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity resultData=GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		return GsonUtil.GsonString(resultData);
	}

	@RequestMapping("/distrib/getCustomerOrderList")
	@ResponseBody
	public String getCustomerOrderList(@RequestParam("type")String type,@RequestParam(value = "page", required = false)String page) {
		logger.info("进入订单返佣记录列表接口 参数 type{} page{}",type,page);
		//从session里面获取用户信息
		BaseUser baseUser = this.getBaseUser();
		if (baseUser==null) {
			return ResultEntity.setFailJson("用户未登录");
		}
		logger.info("baseUser===="+GsonUtil.GsonString(baseUser));

		String url = this.apiUrlPrefix + AppUrlConfig.Distribution.GET_DISTRIB_CUSTOMERORDERLIST;
		Map<String, String> paramsMap = new HashMap<String,String>(); 
		paramsMap.put("type", type);
		paramsMap.put("token", this.getToken());
		paramsMap.put("page", page);
		Map<String, String> params = this.genReqApiData(url, paramsMap);
		String jsonResult = HttpUtil.doPostReq(url, params);
		ResultEntity resultData=GsonUtil.GsonToBean(jsonResult, ResultEntity.class);
		return GsonUtil.GsonString(resultData);
	}

	@RequestMapping(value = "/distrib/bindUser")
	public void bindUserNew(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String code = request.getParameter("code");
		String state = request.getParameter("state");
		logger.info("进入绑定用户接口，请求参数 ：state @{}, code @{}, token @{}",state,code,this.getToken());

		String fromUrl = "/index";
		if(StringUtils.isNotEmpty(state)){
		    String[] paramArray = state.split("_");
		    String distribId = paramArray[0];
		    String channel = paramArray[1];

            String url = this.apiUrlPrefix + AppUrlConfig.Distribution.DISTRIB_BINDUSER;
            Map<String, String> paramsMap = new HashMap<>();
            paramsMap.put("distribId", distribId);
            paramsMap.put("channel", channel);
            paramsMap.put("code", code);

            Map<String, String> params = this.genReqApiData(url, paramsMap);
            String jsonResult = HttpUtil.doPostReq(url, params);
            ResultEntity resultData=GsonUtil.GsonToBean(jsonResult, ResultEntity.class);

            logger.info("推广员绑定用户返回信息：{}", jsonResult);
            // 推广成功，跳到给业务指定页面
            if( null != resultData && resultData.getCode().compareTo(Constant.SUCCESS) == 0){
                fromUrl = (String) resultData.getData();
            }
        }

		// 异常抛出， 丢给全局异常处理
		response.sendRedirect(fromUrl);

	}

    /**
     *  根据业务类型获取宣传语
     * @param businessType
     * @return
     */
	@RequestMapping(value = "/distrib/getPosterSlogan")
    public @ResponseBody String getPosterSloganByBusinessType(@RequestParam(value = "businessType") byte businessType){
        BaseUser baseUser = this.getBaseUser();
        if (baseUser==null) {
            return ResultEntity.setFailJson("用户未登录");
        }

        String url = this.apiUrlPrefix + AppUrlConfig.Distribution.GET_DISTRIB_POSTER_SLOGAN;
        Map<String, String> map = new HashMap<>();
        map.put("businessType", String.valueOf(businessType));

        Map<String, String> params = this.genReqApiData(url, map);
	    return HttpUtil.doPostReq(url, params);
    }

    /**
     * 获取车企所有的宣传语
     * @return
     */
    @RequestMapping(value = "/distrib/getAllPosterSlogan")
    public @ResponseBody String getPosterSloganList(){
        BaseUser baseUser = this.getBaseUser();
        if (baseUser==null) {
            return ResultEntity.setFailJson("用户未登录");
        }
		Map<String, String> params = new HashMap<String, String>();
        String url = apiUrlPrefix + AppUrlConfig.Distribution.GET_DISTRIB_ALL_POSTER_SLOGAN;
        params = this.genReqApiData(url, params);
		String jsonResult = HttpUtil.doPostReq(url, params);
		logger.info("获取车企所有的宣传语 = {}", jsonResult);
		return  jsonResult;
    }
}

