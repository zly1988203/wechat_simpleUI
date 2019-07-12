package com.olakeji.passenger.wechat.innercity.param;

import java.io.Serializable;

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
}
