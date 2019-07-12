package com.olakeji.passenger.wechat.controller.innercity.param;

import java.io.Serializable;

import org.apache.commons.lang3.StringUtils;

public class BaseParam implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -1726152399244842370L;
	private String requestUrl;
	private String token;
	private Integer providerId;

	public String getRequestUrl() {
		return requestUrl;
	}

	public void setRequestUrl(String requestUrl) {
		this.requestUrl = requestUrl;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public Integer getProviderId() {
		return providerId;
	}

	public void setProviderId(Integer providerId) {
		this.providerId = providerId;
	}
	
	public boolean checkRequestUrl() {
		return StringUtils.isEmpty(this.requestUrl);
	}
	
	public boolean checkToken() {
		return StringUtils.isEmpty(token);
	}

}
