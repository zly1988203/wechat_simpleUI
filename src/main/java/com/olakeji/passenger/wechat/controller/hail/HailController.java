package com.olakeji.passenger.wechat.controller.hail;

import com.olakeji.passenger.wechat.controller.BaseController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;

/**
 * piggy 增加，主要是为了中交约车配置需要使用的。
 */
@Controller
public class HailController extends BaseController {

	@Value("${passenger.api.url}/hail")
	protected String apiUrlPrefix;

	@Value("${passenger.api.url}/hail")
	protected String serverUrl;
}
