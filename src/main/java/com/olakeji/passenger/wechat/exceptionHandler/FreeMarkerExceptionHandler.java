package com.olakeji.passenger.wechat.exceptionHandler;

import java.io.IOException;
import java.io.Writer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import freemarker.core.Environment;
import freemarker.template.TemplateException;
import freemarker.template.TemplateExceptionHandler;

public class FreeMarkerExceptionHandler implements TemplateExceptionHandler {
	/**
	 * freemarker页面上的异常控制 在webmvc-config.xml里面的freemarkerSettings里头配置
	 */
	private static final Logger LOG = LoggerFactory.getLogger(FreeMarkerExceptionHandler.class);

	@Override
	public void handleTemplateException(TemplateException te, Environment env, Writer out) throws TemplateException {


		String missingVariable = "undefined";
		try {
			String[] tmp = te.getMessageWithoutStackTop().split("\n");
			if (tmp.length > 1)
				tmp = tmp[1].split(" ");
			if (tmp.length > 1)
				missingVariable = tmp[1];
			
			//跳转到错误页面(500)
			out.write("<script language='javascript'>window.location.href='/errorPage-500.html'</script>");
			LOG.info("[Freemarker Error: " + te.getMessage() + "]");
		} catch (IOException e) {
			throw new TemplateException("Failed to print error message. Cause: " + e, env);
		}
	}
}
