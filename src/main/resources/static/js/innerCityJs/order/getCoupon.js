
var shareObj = {
	reqURL : window.location.href,
	title : '【XX出行】第 N 个领取的人红包最大！',
	desc : '优惠力度挺大，你也来试试~',
	imgUrl:'../../images/newInnerCity/share-logo.png',
	activityId: 264,
	pageNum:1,
}

//0-未关注,1-已经关注
var focusOn = $('#focusOn').val();
var businessType = $("#orderType").val();
var isConfig = $('.popup').data('show');
var isHavaShareRedBags = $("#isHavaShareRedBags").val();
var clickEvent = isAndroid()?'tap':'click';
$(".little-red-packet").on(clickEvent,function () {
    $(".popup-overlay").show().css("opacity",".5");
    $(".popup").show();
});

$(".btn-close-popup").on(clickEvent,function () {   
    $(".popup").hide();
    $(".popup-overlay").hide();
});

function isShow(isHavaShareRedBags){
	if (isHavaShareRedBags == 1){		
		$(".little-red-packet").show();
		wx.showAllNonBaseMenuItem({
            success:function () {
                console.log('已显示所有非基础按钮接口');
            }
        });
	}
	else{
		$(".little-red-packet").hide();
        //隐藏所有非基础按钮接口
        wx.hideAllNonBaseMenuItem({
            success:function () {
                console.log('已隐藏所有非基础按钮接口');
            }
        });
	}
}

function requestCount(shareObj){
	var url1 = SERVER_URL_PREFIX + '/common/statistics/saveRecord';
	var data1 = {
			activityId:shareObj.activityId,
			pageNum:shareObj.pageNum,
	};
	data1 = genReqData(url1, data1);
		
    $.ajax({
    	type: 'POST',
    	url: url1,
    	data: data1,
    	dataType:  "json",
    	success: function(data){
    	},
		error:function(e){
		}
    });
}


var orderNo = $("#orderNo").val();
var providerId = JSON.parse(localStorage.getItem('userInfo')).providerId;
var userId = JSON.parse(localStorage.getItem('userInfo')).id;

//设置分享到朋友圈信息
function initShareConfig(data) {
    //请求分享行程接口，返回初始化参数
    var urlList = SERVER_URL_PREFIX + '/couponFission/getShareLink';
    if(isEmpty(orderNo)){
        orderNo = '';
	}
	if(isEmpty(providerId)){
    	providerId = '';
	}
	if(isEmpty(userId)){
		userId = '';
	}
	if (businessType == 17 || businessType == 18){
		urlList = SERVER_URL_PREFIX + '/hail/couponFission/getShareLink';
	}

	var bussiness = 0;
	if (undefined == isHavaShareRedBags){
		bussiness = 1
	}
    var dataList = {
        orderNo:orderNo,
        providerId:providerId,
        userId:userId,
        bussiness:bussiness,
	};
    dataList = genReqData(urlList, dataList);
    // $.showLoading();
    $.ajax({
        type: 'POST',
        url: urlList,
        data: dataList,
        dataType:  "json",
        success: function(data){
            if (data.code == 0) {               
                var content = JSON.parse(data.data);
                if (undefined != content && content != null){
                	shareObj.title = content.title;
                    shareObj.reqURL = content.link;
                    shareObj.desc = content.desc;
                    shareObj.imgUrl = content.img;
                    shareObj.activityId = content.activityId;
                 
                    wxShare(shareObj);
                    
                    if (focusOn == 1){
                    	$(".popup").show();
                	    $(".popup-overlay").show().css('opacity','.5');
                	    wx.showAllNonBaseMenuItem({
                            success:function () {
                                console.log('已显示所有非基础按钮接口');
                            }
                        });
                    }
                    else{
                    	wx.hideAllNonBaseMenuItem({
                            success:function () {
                                console.log('已隐藏所有非基础按钮接口');
                            }
                        });
                    }
                }               
            }
            else{
            	$(".popup").hide();
            	$(".popup-overlay").hide();
            	wx.hideAllNonBaseMenuItem({
                    success:function () {
                        console.log('已隐藏所有非基础按钮接口');
                    }
                });
            }
        },
    });

}
function wxShare(shareObj){
    //请求分享行程接口，返回初始化参数
    var urlList = SERVER_URL_PREFIX + '/shareTrip';
    var dataList = {
        currentUrl : window.location.href
    };
    dataList = genReqData(urlList, dataList);

    $.ajax({
        type: 'POST',
        url: urlList,
        data: dataList,
        dataType:  "json",
        success: function(data){
            if (data.code == 0) {
                var content = data.data;
                shareObj.appId = content.wechatAppId
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: content.wechatAppId, // 必填，公众号的唯一标识
                    timestamp: content.timestamp, // 必填，生成签名的时间戳
                    nonceStr: content.nonceStr, // 必填，生成签名的随机串
                    signature: content.signature,// 必填，签名，见附录1
                    jsApiList: [ 'onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            }else{
                $.dialog({
                    text: '当前业务获取失败，你可以试试其它！',
                    buttons: [{
                        text: '确定',
                        onClick: function() {
                            location.href = '/distribution/bountyHunter';
                        }
                    }]
                });
            }

        },
        error:function (e) {
            // $.hideLoading();
            $.dialog({
                text: '当前业务获取失败，你可以试试其它！',
                buttons: [{
                    text: '确定',
                    onClick: function() {
                        location.href = '/distribution/bountyHunter';
                    }
                }]
            });
        }
    });


    wx.ready(function(){
        wx.onMenuShareAppMessage({  //分享朋友事件
            title: shareObj.title, // 分享标题
            desc: shareObj.desc, // 分享描述
            link: shareObj.reqURL+"&channel=1&appId="+shareObj.appId, // 分享链接
            imgUrl: shareObj.imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // alert('分享成功啦！')  //可在此处加入分享成功后的逻辑
                requestCount(shareObj);

            },
            cancel: function () {
                // alert('分享取消！')
            }
        });

        wx.onMenuShareTimeline({  //分享朋友圈事件
            title: shareObj.title, // 分享标题
            link: shareObj.reqURL+"&channel=2&appId="+shareObj.appId, // 分享链接
            imgUrl: shareObj.imgUrl, // 分享图标
            desc: shareObj.desc, // 分享描述
            success: function () {
                // alert('分享成功啦！')  //可在此处加入分享成功后的逻辑
                requestCount(shareObj);
            },
            cancel: function () {
                // alert('分享取消！')
            }
        });

        wx.onMenuShareQQ({ //分享QQ事件
            title:shareObj.title, // 分享标题
            desc:shareObj.desc, // 分享描述
            link:shareObj.reqURL+"&channel=6&appId="+shareObj.appId, // 分享链接
            imgUrl: shareObj.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                requestCount(shareObj);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        wx.onMenuShareWeibo({  //分享微博事件
            title: shareObj.title, // 分享标题
            desc: shareObj.content, // 分享描述
            link: shareObj.reqURL+"&channel=4&appId="+shareObj.appId, // 分享链接
            imgUrl: shareObj.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                requestCount(shareObj);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        wx.onMenuShareQZone({//分享QQ空间
            title: shareObj.title, // 分享标题
            desc: shareObj.content, // 分享描述
            link: shareObj.reqURL+"&channel=5&appId="+shareObj.appId, // 分享链接
            imgUrl: shareObj.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                requestCount(shareObj);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        // $.hideLoading();
    });
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

function hideOptionMenu1() {
    // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
    wx.hideMenuItems({
        menuList: ["menuItem:share:timeline", "menuItem:copyUrl", "menuItem:share:appMessage", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:favorite", "menuItem:share:facebook", "menuItem:share:QZone", "menuItem:editTag", "menuItem:delete", "menuItem:copyUrl", "menuItem:originPage", "menuItem:readMode", "menuItem:openWithQQBrowser", "menuItem:openWithSafari", "menuItem:share:email", "menuItem:share:brand"]
    });
}

$(function() {
    isShow(isHavaShareRedBags);
    initShareConfig();
    if($("#isHavaShareRedBags")[0]&&$("#isHavaShareRedBags")[0].value!='1'){
        hideOptionMenu();
    }
});
