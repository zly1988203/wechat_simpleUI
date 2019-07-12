package com.olakeji.tsp.wechatapi;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SuppressWarnings("deprecation")
public class HttpUtils {
	private static final Logger LOGGER = LoggerFactory.getLogger(HttpUtils.class);

	@SuppressWarnings({ "resource" })
	public static String doGet(String url) {
		String result = "";
		HttpGet httpRequst = new HttpGet(url);
		try {
			HttpResponse httpResponse = new DefaultHttpClient().execute(httpRequst);// 其中HttpGet是HttpUriRequst的子类
			if (httpResponse.getStatusLine().getStatusCode() == 200) {
				HttpEntity httpEntity = httpResponse.getEntity();
				result = EntityUtils.toString(httpEntity);// 取出应答字符串
				// 一般来说都要删除多余的字符
				result.replaceAll("\r", "");// 去掉返回结果中的"\r"字符，否则会在结果字符串后面显示一个小方格
			} else {
				httpRequst.abort();
			}
		} catch (ClientProtocolException e) {
			LOGGER.error("http request exception:", e);
			result = e.getMessage().toString();
		} catch (IOException e) {
			LOGGER.error("http request exception:", e);
			result = e.getMessage().toString();
		}
		return result;
	}

	public static String doPost(String url, String json) throws Exception {
		CloseableHttpClient httpClient = HttpClients.createDefault();
		HttpPost httpPost = new HttpPost(url);
		StringEntity se = new StringEntity(json);
		httpPost.setEntity(se);
		HttpResponse response = httpClient.execute(httpPost);
		int statusCode = response.getStatusLine().getStatusCode();
		if (statusCode != HttpStatus.SC_OK && statusCode != 201) {
			LOGGER.error("Method failed: response", response.getStatusLine());
		}

		String body = EntityUtils.toString(response.getEntity(), "UTF-8");
		return body;
	}
}
