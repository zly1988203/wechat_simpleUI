//服务器地址信息
var serverUtil = {
    testUrl: 'http://10.1.21.250:8084',
    devUrl: 'https://www.easy-mock.com/mock/5cda5548e6f3ff49f1a13913/TSP_passenger_api',
    releaseUrl: SERVER_URL_PREFIX,
    requestUrl: CURRENT_SERVER,
    token: $.cookie('token'),
    timestamp: new Date().getTime(),
    appId: APP_ID,
    APP_KEY: APP_KEY,
    clientType:CLIENT_TYPE,
    appVersion: APP_VERSION,
    deviceId: DEVICE_ID,
    wechatLogin: WECHATLOGIN, //用于区分微信乘客端和APP端
    loginType: loginType,
    adDomain: adDomain
}

var serverUrl = serverUtil.releaseUrl;

//公用接口
var commonApi = {
    regOrLogin: serverUrl + '/Account/regOrLogin', //登录
    getGpsLocation: serverUrl + '/searchAddressByGps', //定位
    getPrepayInfo: serverUrl + 'pay/mockGetPrepayInfo',
}

//通勤接口
var commuteApi = {
    //首页
    getFutureOrderList: serverUrl + '/commute/optimized/getFutureOrderList',//
    getLatelyOrderList: serverUrl + '/commute/optimized/getLatelyOrderList',//
    getHotLine: serverUrl + '/commute/getHotLine',
    getHistoryStation: serverUrl + '/commute/optimized/getHistoryStation',
    saveSearchStation: serverUrl + '/busline/optimized/saveSearchStation',
    getIsOpenCity: serverUrl + '/commute/optimized/getIsOpenCity',
    getAdList: "https://"+ serverUtil.adDomain + '/pub/ad/getAdList',
    adClicked:  "https://"+serverUtil.adDomain + '/pub/ad/clicked',
    getOpenAreas: serverUrl + '/busline/optimized/getOpenAreas',
    getOpenCitys: serverUrl + '/busline/optimized/getOpenCitys',
    //验票
    queryDetailByOrderNo: serverUrl + '/commute/optimized/queryDetailByOrderNo',
    //下单页面
    toAddOrder: serverUrl + '/commute/toAddOrder',
    addOrder: serverUrl +'/commute/addOrder',
    queryConponByBusiness: serverUrl +'/Coupon/queryBusValidConponByBusiness',
    //日期选择页面
    calendarList: serverUrl +'/commute/optimized/calendarList',
    queryNotPayOrders: serverUrl +'/commute/queryNotPayOrders',

// 通勤班次搜索结果页
    getHotLineList: serverUrl + '/commuteLine/getHotLineList', //热门线路查询
    getLineList: serverUrl + '/commuteLine/getLineList', //用户输入搜索查询
    searchBusByStationId: serverUrl + '/commuteLine/searchBusByStationId', //站点查询
    queryLineDetail: serverUrl + '/commute/queryLineDetail', //班次详情
    queryLineDetailByOrder: serverUrl + '/commute/optimized/queryLineDetailByOrder', //班线列获取订单详情
    
    //评价接口
    toCommentBusBefore: serverUrl + '/comment/toCommentBusBefore', //准备评价【订单】
    addCommentBus: serverUrl + '/comment/addCommentBus', //添加评价【订单】
    toCommentDetailBus: serverUrl + '/comment/toCommentDetailBus', //查询评价【订单】
    toCommentSuccess: serverUrl + '/comment/toCommentSuccess', //评价成功【订单】

    //模拟支付
    mockGetPrepayInfo: serverUrl + '/pay/mockGetPrepayInfo',

    //退款接口
    refundBatch: serverUrl + '/commute/commuteOrder/refundBatch',
    //退票接口
    toBatchRefund: serverUrl + '/commute/commuteOrder/toBatchRefund',
    toRefundDetail: serverUrl + '/commute/commuteOrder/toRefundDetail',
    checkRefund: serverUrl + '/commute/commuteOrder/checkRefund',
}

/*if(!window.Promise ){
    document.write('<script src="https://cdn.bootcss.com/babel-standalone/6.26.0/babel.min.js"></script>');
    document.write('<script src="//cdn.jsdelivr.net/npm/es6-promise@4.1.1/dist/es6-promise.min.js"></script><script>ES6Promise.polyfill()</script>');
}*/

//兼容promise
document.write('<script src="/js/commonjs/babel.min.js"></script>');
document.write('<script src="/js/commonjs/polyfill.min.js"></script>');
var userInfo = JSON.parse(USERINFO);
var providerInfo = userInfo.provider;
// if ($.cookie('show_ad') != 'show') {
//     document.write('<script src="/adConfig.js?providerId='+providerInfo.providerId+'&positionCode=index-banner&operatorId='+userInfo.id+'"></script>');
//     var now_date=new Date();
//     now_date.setTime(now_date.getTime()+30*60*1000); //设置date为当前时间+30
//     $.cookie('show_ad','show',{
//         path : '/',//cookie的作用域
//         expires:now_date
//     })
// }


/* 请求
    url：请求路径，data：参数，sign：验签
*/
var request = function request(url, data, _sign, _method) {
    var data = data;
    var sign = false;
    var method = "post";
    if(_sign){
        sign = _sign
    }
    if(_method && ""!=_method){
        method = _method
    }
    return new Promise(function (resolve, reject) {
        data = $.extend({requestUrl:serverUtil.requestUrl},data);
        if(sign){
            data = genReqData(url, data);
        }
        $.ajaxService({
            url: url,
            type: method,
            data: data,
            dataType: 'json',
            success: function (res) {
                if(undefined == res || "undefined" == typeof(res) || res == "" ){
                    $.hideLoading();
                    $.alert("接口返回异常");
                }
                // console.log(res);
                if (res.code == 0) {
                    resolve(res);
                } else if (res.code == 20003) {
                    // resolve(res);
                    setTimeout("javascript:location.href='/examples/bus/login.html'", 1000);
                } else {
                    resolve(res);
                    // $.alert(res.message);
                }
            },
            fail: function (err) {
                reject(err)
            }
        });
    })
}


//拼接url和参数，然后进行md5加密
function getSignStr(url, data){
	if (url === null || data === null) { 
		return ''; 
	}
	
	url = url.substring((url.indexOf('//', 0) + 2), url.length);
	
	var suffix = '?';
	var keyArray = new Array();
	for(var key in data){ 
		keyArray.push(key);
	}
	
	if (data['token'] == undefined) {
		data['token'] = '';
	}
	
	keyArray.sort(); //按字母排序
	
	for(var keyName in keyArray){
		//nickname utf8mb4 问题,验签通不过,这里做签名的地方不对它做处理
		var key = keyArray[keyName];
		if (key==='nickName' || key==='sign') {
			continue;
		}
		suffix+= keyArray[keyName] +"="+data[keyArray[keyName]]+"&";  
	}
	
	suffix+= serverUtil.APP_KEY;
	//alert(url+suffix);
	//var base = new Base64();
	//var result = base.encode(url+suffix);
	//alert(result)
    if (url.indexOf("/hail")>=0) {
        url=url.replace("/hail","");
    }
	return $.md5(url+suffix);
}

//merge param
function genReqData(urlStr, data){
	var dataObj = {
			clientType : serverUtil.clientType,
			appId : serverUtil.appId,
			token : serverUtil.token,
			appVersion: serverUtil.appVersion,
			timestamp: new Date().getTime(),
			deviceId: serverUtil.deviceId,
            wechatLogin : serverUtil.wechatLogin
		};
	
	dataObj = $.extend(dataObj, data);
	var signStr = getSignStr(urlStr, dataObj);
	dataObj.sign = signStr;
	return dataObj;
}