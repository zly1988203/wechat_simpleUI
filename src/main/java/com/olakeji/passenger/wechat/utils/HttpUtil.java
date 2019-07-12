package com.olakeji.passenger.wechat.utils;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HttpUtil {

	private static final Logger LOGGER = LoggerFactory.getLogger(HttpUtil.class);

	/**
	 * httpGet请求
	 * 
	 * @param url
	 * @return
	 */
	public static String doGetRequest(String url) {
		CloseableHttpClient httpclient = null;
		CloseableHttpResponse response = null;
		try {
			httpclient = HttpClients.createDefault();
			// 创建httpget.
			HttpGet httpget = new HttpGet(url);
			// 执行get请求.
			response = httpclient.execute(httpget);
			// 获取响应实体
			HttpEntity entity = response.getEntity();

			if (entity != null) {
				// 打印响应内容
				String content = EntityUtils.toString(entity,"utf-8");
				return content;
			}
			return null;
		} catch (Exception e) {
			LOGGER.error("请求接口异常：", e);
		} finally {
			try {
				httpclient.close();
				response.close();
			} catch (IOException e) {
				LOGGER.error("请求接口异常：", e);
			}
		}
		return null;
	}

	/**
	 * 处理post请求.
	 * 
	 * @param url
	 *            请求路径
	 * @param params
	 *            参数
	 * @return json
	 */
	public static String doPostRequest(String url, Map<String, Object> params) {
		// 实例化httpClient
		CloseableHttpClient httpclient = HttpClients.createDefault();
		// 实例化post方法
		HttpPost httpPost = new HttpPost(url);
		// 处理参数
		List<NameValuePair> nvps = new ArrayList<NameValuePair>();
		Set<String> keySet = params.keySet();
		for (String key : keySet) {
			if (params.get(key) != null) {
				nvps.add(new BasicNameValuePair(key, params.get(key).toString()));
			}
		}
		// 结果
		CloseableHttpResponse response = null;
		String content = "";
		try {
			// 提交的参数
			UrlEncodedFormEntity uefEntity = new UrlEncodedFormEntity(nvps, "UTF-8");
			// 将参数给post方法
			httpPost.setEntity(uefEntity);
			// 执行post方法
			response = httpclient.execute(httpPost);
			if (response.getStatusLine().getStatusCode() == 200) {
				content = EntityUtils.toString(response.getEntity(), "utf-8");
			}
		} catch (ClientProtocolException e) {
			LOGGER.error("请求接口异常：", e);
		} catch (IOException e) {
			LOGGER.error("请求接口异常：", e);
		}
		return content;
	}

	/**
	 * 处理post请求.
	 * 
	 * @param url
	 *            请求路径
	 * @param params
	 *            参数
	 * @return json
	 */
	public static String doPostReq(String url, Map<String, String> params) {
		// 实例化httpClient
		CloseableHttpClient httpclient = HttpClients.createDefault();
		// 实例化post方法
		HttpPost httpPost = new HttpPost(url);
		// 处理参数
		List<NameValuePair> nvps = new ArrayList<NameValuePair>();
		Set<String> keySet = params.keySet();
		for (String key : keySet) {
			if (params.get(key) != null) {
				nvps.add(new BasicNameValuePair(key, params.get(key).toString()));
			}
		}
		// 结果
		CloseableHttpResponse response = null;
		String content = "";
		try {
			// 提交的参数
			UrlEncodedFormEntity uefEntity = new UrlEncodedFormEntity(nvps, "UTF-8");
			// 将参数给post方法
			httpPost.setEntity(uefEntity);
			// 执行post方法
			response = httpclient.execute(httpPost);
			if (response.getStatusLine().getStatusCode() == 200) {
				content = EntityUtils.toString(response.getEntity(), "utf-8");
			}
		} catch (ClientProtocolException e) {
			LOGGER.error("请求接口异常：", e);
		} catch (IOException e) {
			LOGGER.error("请求接口异常：", e);
		}
		return content;
	}
	
	/**
	 * 读取所有cookie
	 * 注意二、从客户端读取Cookie时，包括maxAge在内的其他属性都是不可读的，也不会被提交。浏览器提交Cookie时只会提交name与value属性。maxAge属性只被浏览器用来判断Cookie是否过期
	 * 
	 * @param request
	 * @param response
	 */
	public static void showCookies(HttpServletRequest request, HttpServletResponse response) {

		Cookie[] cookies = request.getCookies();// 这样便可以获取一个cookie数组
		if (null == cookies) {
			LOGGER.info("没有cookie=========");
		} else {
			for (Cookie cookie : cookies) {
				LOGGER.info("name:" + cookie.getName() + ",value:" + cookie.getValue());
			}
		}
	}

	/**
	 * set cookies 值
	 * @param request
	 * @param response
	 * @param name
	 * @param value
	 * @param expires
	 */
	public static void setCookie(HttpServletRequest request, HttpServletResponse response, String name, String value, Integer expires) {
		Cookie cookie = getCookieByName(request, name);
		if (cookie!=null) {
			//编辑cookies
			editCookie(request, response, name, value, expires);
		}
		else {
			addCookie(response, name, value, expires);
		}
	}
	/**
	 * 添加cookie
	 * 
	 * @param response
	 * @param name
	 * @param value
	 */
	public static void addCookie(HttpServletResponse response, String name, String value, Integer expires) {
		Cookie cookie = new Cookie(name.trim(), value.trim());
		cookie.setMaxAge(expires);// 设置为30min
		cookie.setPath("/");
		LOGGER.info("已添加===============");
		response.addCookie(cookie);
	}

	/**
	 * 修改cookie
	 * 
	 * @param request
	 * @param response
	 * @param name
	 * @param value
	 *  注意一、修改、删除Cookie时，新建的Cookie除value、maxAge之外的所有属性，
	 *  例如name、path、domain等，都要与原Cookie完全一样。否则，浏览器将视为两个不同的Cookie不予覆盖，导致修改、删除失败。
	 */
	public static void editCookie(HttpServletRequest request, HttpServletResponse response, String name, String value, Integer expires) {
		Cookie[] cookies = request.getCookies();
		if (null == cookies) {
			LOGGER.info("没有cookie==============");
		} else {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals(name)) {
					LOGGER.info("原值为:" + cookie.getValue());
					cookie.setValue(value);
					cookie.setPath("/");
					// 设置为30min
					cookie.setMaxAge(expires);
					LOGGER.info("被修改的cookie名字为:" + cookie.getName() + ",新值为:" + cookie.getValue());
					response.addCookie(cookie);
					break;
				}
			}
		}
	}

	/**
	 * 删除cookie
	 * 
	 * @param request
	 * @param response
	 * @param name
	 */
	public static void delCookie(HttpServletRequest request, HttpServletResponse response, String name) {
		Cookie[] cookies = request.getCookies();
		if (null == cookies) {
			LOGGER.info("没有cookie==============");
		} else {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals(name)) {
					cookie.setValue(null);
					cookie.setMaxAge(0);// 立即销毁cookie
					cookie.setPath("/");
					LOGGER.info("被删除的cookie名字为:" + cookie.getName());
					response.addCookie(cookie);
					break;
				}
			}
		}
	}

	/**
	 * 根据名字获取cookie
	 * 
	 * @param request
	 * @param name
	 *            cookie名字
	 * @return
	 */
	public static Cookie getCookieByName(HttpServletRequest request, String name) {
		Map<String, Cookie> cookieMap = ReadCookieMap(request);
		if (cookieMap.containsKey(name)) {
			Cookie cookie = (Cookie) cookieMap.get(name);
			return cookie;
		} else {
			return null;
		}
	}

	/**
	 * 通常开发时先用以下的代码将获取的cookie进行封装 将cookie封装到Map里面
	 * 
	 * @param request
	 * @return
	 */
	public static Map<String, Cookie> ReadCookieMap(HttpServletRequest request) {
		Map<String, Cookie> cookieMap = new HashMap<String, Cookie>();
		Cookie[] cookies = request.getCookies();
		if (null != cookies) {
			for (Cookie cookie : cookies) {
				cookieMap.put(cookie.getName(), cookie);
			}
		}
		return cookieMap;
	}
	
	/**
	* 获取网址的指定参数值
	* 
	* @param url 网址
	* @param parameter 参数名称
	* @author cevencheng
	* @return
	*/
	public static Map<String, String> getParameter(String url) {
		try {
			if (url.indexOf('?') != -1) {
				final String contents = url.substring(url.indexOf('?') + 1);
				HashMap<String, String> map = new HashMap<String, String>();
				String[] keyValues = contents.split("&");
				for (int i = 0; i < keyValues.length; i++) {
					String key = keyValues[i].substring(0, keyValues[i].indexOf("="));
					String value = keyValues[i].substring(keyValues[i].indexOf("=") + 1);
					map.put(key, value);
				}				
				return map;
			}
			return null;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static Map<String, String> getParameter(HttpServletRequest request) {
		Map<String, String> params = new HashMap<String, String>();

		Map<String, String[]> requestParams = request.getParameterMap();
		for (Iterator<String> iter = requestParams.keySet().iterator(); iter.hasNext();) {
			String name = (String) iter.next();
			String[] values = (String[]) requestParams.get(name);
			String valueStr = "";
			for (int i = 0; i < values.length; i++) {
				valueStr = (i == values.length - 1) ? valueStr + values[i] : valueStr + values[i] + ",";
			}

			params.put(name, valueStr);
		}

		return params;
	}	
	/**
	 * 请求参数重新组装URL参数地址
	 */
	public static String genParamStr(Map<String, String> paramMap) {
		String urlStr = "";
		Iterator it = paramMap.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry entry = (Map.Entry) it.next();
			Object key = entry.getKey();
			Object value = entry.getValue();
			try {
				if (urlStr.indexOf("?") < 0) {
					urlStr += "?" + key + "=" + URLEncoder.encode((String) value, "UTF-8");
				} else {
					urlStr += "&" + key + "=" + URLEncoder.encode((String) value, "UTF-8");
				}
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		return urlStr;
	}	
}
