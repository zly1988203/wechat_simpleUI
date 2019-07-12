package com.olakeji.passenger.wechat.controller.busline;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.olakeji.cache.RedisUtil;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.controller.BaseController;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@Controller
@RequestMapping(value = "comment")
public class CommentController extends BaseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(CommentController.class);

    @Autowired
    private RedisUtil redisUtil;

    @RequestMapping(value = "/toComment")
    public String toComment(Model model, String ticketId) {
        model.addAttribute("ticketId", ticketId);
        return "comment/toComment";
    }

    @RequestMapping(value = "/toCommentDetail")
    public String toCommentDetail(Model model, Integer ticketId, String token) {
        model.addAttribute("ticketId", ticketId);
        model.addAttribute("token", token);
        return "comment/commentDetail";
    }

    @RequestMapping(value = "toCommentSuccess")
    public String toCommentSuccess(String ticketId, Model model) {
        model.addAttribute("ticketId", ticketId);
        return "comment/commentSuccess";
    }

    @RequestMapping(value = "uploadImg")
    @ResponseBody
    public String uploadImg(String baseContent, String fileName) {
        String url = apiUrlPrefix + AppUrlConfig.COMMONTOOL_UPLOADIMG;
        Map<String, String> paramsMap = new HashMap<String, String>();
        paramsMap.put("baseContent", baseContent);
        paramsMap.put("fileName", fileName);
        Map<String, String> params = this.genReqApiData(url, paramsMap);
        String jsonResult = HttpUtil.doPostReq(url, params);
        return jsonResult;
    }

    @RequestMapping(value = "downloadWxPicAndUploadQiNiu")
    @ResponseBody
    public String downloadWxPicAndUploadQiNiu(String serverId) {
        String url = apiUrlPrefix + AppUrlConfig.COMMONTOOL_DOWNLOADWXPICANDUPLOADQINIU;
        Map<String, String> paramsMap = new HashMap<String, String>();
        paramsMap.put("serverId", serverId);
        Map<String, String> params = this.genReqApiData(url, paramsMap);
        String jsonResult = HttpUtil.doPostReq(url, params);
        return jsonResult;
    }

    @RequestMapping(value = "/removeKey")
    @ResponseBody
    public String removeKey(String key) {
        redisUtil.remove(key);
        return null;
    }


    /**
     * 新的班线类的评价跳转到评价页面
     *
     * @param model
     * @param orderNo
     * @param busId
     * @return
     */
    @RequestMapping(value = "/toCommentBusPage")
    public String toComment(Model model, String orderNo, String busId, @RequestParam(required = false, defaultValue = "") String lineType) {
        model.addAttribute("orderNo", orderNo);
        model.addAttribute("lineType", lineType);
        model.addAttribute("busId", busId);
        return "comment/toComment";
    }

    /**
     * 新接口。班线类的获取评价详情
     *
     * @param model
     * @param orderNo
     * @param busId
     * @return
     */
    @RequestMapping(value = "/toCommentDetailBus")
    public String toCommentDetailBus(Model model, String orderNo, String busId) {
        model.addAttribute("orderNo", orderNo);
        model.addAttribute("busId", busId);
        return "comment/commentDetail";
    }
}
