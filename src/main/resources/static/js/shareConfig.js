var shareURL = CURRENT_SERVER + '/shareTrip?orderNo='; //全局分享行程url地址
var title = '分享了一个行程'; //后期如果需要提供个性化标题，可在shareObj中添加属性
var FullApiList = ['getLocation', 'chooseImage', 'uploadImage', 'onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'];
var NoLocationApiList = ['chooseImage', 'uploadImage', 'onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'];
//微信分享接口公用配置初始化
//urlSuffix 当前页面url的后缀地址，进行拼接
function wxInitConfig(shareObj,getLocationCallBack) {
	var providerName = '中交出行';
	if (shareObj.providerName) {
		providerName = shareObj.providerName;
	}
	var businessType = undefined != shareObj.businessType?shareObj.businessType:'0';
	var desc = '我正在使用'+providerName+'，车牌：' + shareObj.carNo + '，车主：' + shareObj.driverName + '，点击可查看动态。'; // 分享描述
	var reqURL = shareURL + shareObj.orderNo + "&nickName=" + encodeURI(shareObj.nickName)+'&businessType='+businessType; //分享链接
	//以下3个值用于分享行程之外的数据传递
	
	if (shareObj.desc) {
		desc = shareObj.desc;
	}
	if (shareObj.reqURL) {
		reqURL = shareObj.reqURL;
	}
	if (shareObj.title) {
		title = shareObj.title;
	}
	shareObj.title=title;
	shareObj.reqURL=shareObj.url;
	shareObj.url=reqURL;
	shareObj.desc=desc;
	shareObj.providerName=providerName;
	wxShare(shareObj,getLocationCallBack);
}


function wxActivityConfig(shareObj,getLocationCallBack) {
	wxShare(shareObj,getLocationCallBack);
}

function wxLineRequireShare(shareObj,reqUrl,getLocationCallBack){
	var providerName = '中交出行';
	if (shareObj.providerName) {
		providerName = shareObj.providerName;
	}
	var desc = ''; // 分享描述
	var reqURL = ''; //分享链接
	//以下3个值用于分享行程之外的数据传递
	
	if (shareObj.desc) {
		desc = shareObj.desc;
	}
	if (reqUrl) {
		reqURL = reqUrl;
	}
	if (shareObj.title) {
		title = shareObj.title;
	}
	shareObj.title=title;
	shareObj.reqURL=shareObj.url;
	shareObj.url=reqURL;
	shareObj.desc=desc;
	shareObj.providerName=providerName;
	wxShare(shareObj,getLocationCallBack);
}

function wxShare(shareObj,getLocationCallBack){
	//请求分享行程接口，返回初始化参数
	var urlList = SERVER_URL_PREFIX + '/shareTrip';
	var dataList = {
		currentUrl : shareObj.reqURL
	};
	dataList = genReqData(urlList, dataList);
	var apiList = FullApiList;
	if (null == getLocationCallBack) {
        apiList = NoLocationApiList;
    }

    $.ajax({
    	type: 'POST',
    	url: urlList,
    	data: dataList,
    	dataType:  "json",
    	success: function(data){
    		if (data.code == 0) {
    			var content = data.data;
    			wx.config({
    		        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    		        appId: content.wechatAppId, // 必填，公众号的唯一标识
    		        timestamp: content.timestamp, // 必填，生成签名的时间戳
    		        nonceStr: content.nonceStr, // 必填，生成签名的随机串
    		        signature: content.signature,// 必填，签名，见附录1
                    // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    		        jsApiList: apiList
    		    });
    			return;
    		}
            var callbackData={};
            callbackData['latitude']=0;
            callbackData['longitude']=0;
            callbackData['flag'] = false;
            if(getLocationCallBack){
                getLocationCallBack(callbackData);
            }
    	},
		error:function(e){
            var callbackData={};
            callbackData['latitude']=0;
            callbackData['longitude']=0;
            callbackData['flag'] = false;
            if(getLocationCallBack){
                getLocationCallBack(callbackData);
            }
		}
    });
    try{

        //判断是否是微信浏览器
        //本地浏览器调试时，直接返回
        if(!isWeiXin()){
            var callbackData={};
            callbackData['latitude']=0;
            callbackData['longitude']=0;
            callbackData['flag'] = false;
            if(getLocationCallBack){
                getLocationCallBack(callbackData);
            }
            return;
        }

        wx.ready(function(){
            wx.getLocation({
                type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    try {
                        if (typeof(eval(getLocationCallBack)) == "function") {
                            var callbackData={};
                            callbackData['latitude']=latitude;
                            callbackData['longitude']=longitude;
                            callbackData['flag'] = true;
                            getLocationCallBack(callbackData);
                        }
                    } catch(e) {}
                    var speed = res.speed; // 速度，以米/每秒计
                    var accuracy = res.accuracy; // 位置精度
                },
                cancel: function (res) {
                    var callbackData={};
                    callbackData['latitude']=0;
                    callbackData['longitude']=0;
                    callbackData['flag'] = false;
                    getLocationCallBack(callbackData);
                    $.alert('用户拒绝授权获取地理位置');
                },
                error: function (res) {
                    var callbackData={};
                    callbackData['latitude']=0;
                    callbackData['longitude']=0;
                    callbackData['flag'] = false;
                    getLocationCallBack(callbackData);
                    $.alert('获取地理位置失败');
                }
            });
            wx.onMenuShareAppMessage({  //分享朋友事件
                title: shareObj.title, // 分享标题
                desc: shareObj.desc, // 分享描述
                link: shareObj.url, // 分享链接
                imgUrl: shareObj.logo, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    //   alert('分享成功啦！')  //可在此处加入分享成功后的逻辑
//                alert(shareObj.logo)
//                alert(shareObj.desc)
                },
                cancel: function () {
                    //	alert('分享取消！')
                }
            });

            wx.onMenuShareTimeline({  //分享朋友圈事件
                title: shareObj.title, // 分享标题
                link: shareObj.url, // 分享链接
                imgUrl: shareObj.logo, // 分享图标
                desc: shareObj.desc, // 分享描述
                success: function () {
                },
                cancel: function () {

                }
            });

            wx.onMenuShareQQ({ //分享QQ事件
                title:shareObj.title, // 分享标题
                desc:shareObj.desc, // 分享描述
                link:shareObj.url, // 分享链接
                imgUrl: shareObj.logo, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

            wx.onMenuShareWeibo({  //分享微博事件
                title: shareObj.title, // 分享标题
                desc: shareObj.content, // 分享描述
                link: shareObj.url, // 分享链接
                imgUrl: shareObj.logo, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

            wx.onMenuShareQZone({
                title: shareObj.title, // 分享标题
                desc: shareObj.content, // 分享描述
                link: shareObj.url, // 分享链接
                imgUrl: shareObj.logo, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

        });

        wx.error(function(res){
            var callbackData={};
            callbackData['latitude']=0;
            callbackData['longitude']=0;
            callbackData['flag'] = false;
            if(getLocationCallBack){
                getLocationCallBack(callbackData);
            }
            $.alert(res.errMsg);
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
	}catch (e){
        var callbackData={};
        callbackData['latitude']=0;
        callbackData['longitude']=0;
        callbackData['flag'] = false;
        if(getLocationCallBack){
            getLocationCallBack(callbackData);
        }
        $.alert('获取地理位置失败.');
	}
}

function hideOptionMenu() {
    function onBridgeReady() {
        WeixinJSBridge.call('hideOptionMenu');
    }

    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
    } else {
        onBridgeReady();
    }
}

function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}