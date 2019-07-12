/**
 * 服务端地址
 */
hostArray = ['sqbs','cyyc','lycx'];

function getServerInfo(){
	var host = window.location.host.split('.')[0];
	
	if(window.location.href.indexOf('https')==0){
		return 'https://' + host;
	}else{
		return 'http://' + host;
	}
	
}
var SERVER_URL_PREFIX='${serverUrlPrefix}';
//var SERVER_URL_PREFIX=getServerInfo() + '${serverUrlPrefix}';

/**
 * 本地服务器地址
 */
var CURRENT_SERVER_SUFFIX = '${currentServer}';
var CURRENT_SERVER=getServerInfo() + '${currentServer}';

var PAY_SERVER='${payCenterUrl}';

var WEBSOCKET_SERVER='${websocketServerUrl}';

var zhongjiao_AppId = '${zhongjiaoAppId}';

var APP_ID='${appId}';
var WX_APP_ID='${wxAppId!""}';
var APP_KEY='${appKey}';
var CLIENT_TYPE = '${clientType}';
var PAGE_SIZE = '${pageSize}';
var APP_VERSION = '${appVersion}';
var DEVICE_ID = '${drviceId}';
var WECHATLOGIN = '${wechatLogin}'; //用于区分微信乘客端和APP端
var loginType='${loginType!"2"}';
var adDomain='${adDomain}';
var wechatAuthUrl='${wechatAuthUrl!""}';
var USERINFO='${userInfo!""}';
var BUSINESSTYPE='${businessTypes!""}';

/**
 * 绑定用户Openid
 */
if (isWechatBrowser()) {
	$.post('/bindUserOpenId',{},function(data){
	},'json');
}
/**
 * 判断微信浏览器
 */
function isWechatBrowser() {
	var ua = navigator.userAgent.toLowerCase();
	var isWeixin = ua.indexOf('micromessenger') != -1;
	if (isWeixin) {
	    return true;
	}else{
	    return false;
	}
}
/**
* 获取微信授权地址
*/
function getWechatAuthUrl(appId, redirectUrl, state) {
	var authUrl = wechatAuthUrl;
	if (authUrl.indexOf("appid=APPID")>=0) {
		authUrl = authUrl.replace(/appid=APPID/, "appid="+appId);
	}
	if (authUrl.indexOf("redirect_uri=REDIRECTURL")>=0) {
		authUrl = authUrl.replace(/redirect_uri=REDIRECTURL/, "redirect_uri="+redirectUrl);
	}
	if (authUrl.indexOf("state=STATE")>=0) {
		authUrl = authUrl.replace(/state=STATE/, "state="+state);
	}
	return authUrl;
}
