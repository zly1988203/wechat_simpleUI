var dateScroll = null;
var clickEvent = isAndroid()?'tap':'click';
var contentList = [];//推广文案
var posterSize = '220';//二维码尺寸 默认220
var shareInfo = JSON.parse(sessionStorage.getItem("shareInfo"));
var userInfo = JSON.parse(localStorage.getItem("userInfo"));
var serviceNameObj = JSON.parse(localStorage.getItem('serviceNameObj'));
var isAllPosterSloganBack = false;
var isGetDistribUrlBack = false;

//获取海报推广文案
function getAllPosterSlogan() {
    var urlStr = '/distrib/getAllPosterSlogan';
    var dataObj = {};
    dataObj = genReqData(urlStr,dataObj);

    $.showLoading();
    $.ajax({
        type: 'POST',
        data: dataObj,
        url: urlStr,
        dataType:'JSON',
        success: function(res){
            isAllPosterSloganBack = true;
            isAllBack();
            res = JSON.parse(res);
            if(res.code == 0){
                $.each(res.data,function (index,item) {
                    //posterSize都一样 取第一个即可
                    if(index == 0){
                        posterSize = item.posterSize;
                    }
                    contentList.push(item.content);
                })
            }
        },
    })
}
//获取已开通业务名称
function getServiceNames() {
    var serviceName = '';
    if(!isEmpty(serviceNameObj)){
        if(!isEmpty(serviceNameObj.busTicketTxt)){
            serviceName += serviceNameObj.busTicketTxt + '、';
        }
        if(!isEmpty(serviceNameObj.busTxt)){
            serviceName += serviceNameObj.busTxt + '、';
        }
        if(!isEmpty(serviceNameObj.commuteTxt)){
            serviceName += serviceNameObj.commuteTxt + '、';
        }
        if(!isEmpty(serviceNameObj.interCityTxt)){
            serviceName += serviceNameObj.interCityTxt + '、';
        }
        if(!isEmpty(serviceNameObj.isCharteredTxt)){
            serviceName += serviceNameObj.isCharteredTxt + '、';
        }
        if(!isEmpty(serviceNameObj.isInnerCityOnlineTxt)){
            serviceName += serviceNameObj.isInnerCityOnlineTxt + '、';
        }
        if(!isEmpty(serviceNameObj.isInterCityOnlineTxt)){
            serviceName += serviceNameObj.isInterCityOnlineTxt + '、';
        }
        if(!isEmpty(serviceNameObj.onlineTxt)){
            serviceName += serviceNameObj.onlineTxt + '、';
        }
        if(!isEmpty(serviceNameObj.travelTxt)){
            serviceName += serviceNameObj.travelTxt + '、';
        }

        if(serviceName.length > 1){
            serviceName = serviceName.substring(0, serviceName.length-1);
        }
    }
    return serviceName;
}
//设置分享到朋友圈信息
function initShareConfig(data) {
    // shareInfo.distribType 1-推广平台 2-推广线路 3-推广网约车
    if(shareInfo.distribType == 1){
        data.title = getServiceNames() + "，用手机购票约车，这一个就够了！";
        data.desc = userInfo.nickName + "请您来坐车！微信购票约车，随叫随到";
    }else if(shareInfo.distribType == 3){
        data.title = "嘿~我发现一个划算又方便的打车工具，你也来试试吧！";
        data.desc = userInfo.nickName + "请您来坐车！微信约车，随叫随到";
    }else if(shareInfo.distribType == 2){
        if(isEmpty(shareInfo.departAddress) || isEmpty(shareInfo.arriveAddress)){
            // 城际约车类:
            data.title = shareInfo.lineName + '城际约车只要'+ shareInfo.minLinePrice +'元，你还不知道？';
        }else{
            // 班线类
            data.title = shareInfo.departAddress + '到'+ shareInfo.arriveAddress +'坐车只要'+ shareInfo.minLinePrice +'元，你还不知道？'
        }
        data.desc = userInfo.nickName + "请您来坐车！微信约车，随叫随到";
    }

    if(isEmpty(data.logoUrl)){
        data.logoUrl = 'http://static.olakeji.com/9019862d93fb1f30cf4b207c55857edf.png';
        // data.logoUrl = window.location.protocol + '//' + window.location.host + '/res/images/distribution/v2.0/logo-default.png';
    }
    var shareObj = {
        title:data.title,
        desc:data.desc,
        url: data.url,
        imgUrl:data.logoUrl,
    };

    wxShare(shareObj);
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
            link: shareObj.url+"&channel=1&appId="+shareObj.appId, // 分享链接
            imgUrl: shareObj.imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // alert('分享成功啦！')  //可在此处加入分享成功后的逻辑

            },
            cancel: function () {
                // alert('分享取消！')
            }
        });

        wx.onMenuShareTimeline({  //分享朋友圈事件
            title: shareObj.title, // 分享标题
            link: shareObj.url+"&channel=2&appId="+shareObj.appId, // 分享链接
            imgUrl: shareObj.imgUrl, // 分享图标
            desc: shareObj.desc, // 分享描述
            success: function () {
                // alert('分享成功啦！')  //可在此处加入分享成功后的逻辑
            },
            cancel: function () {
                // alert('分享取消！')
            }
        });

        wx.onMenuShareQQ({ //分享QQ事件
            title:shareObj.title, // 分享标题
            desc:shareObj.desc, // 分享描述
            link:shareObj.url+"&channel=6&appId="+shareObj.appId, // 分享链接
            imgUrl: shareObj.imgUrl, // 分享图标
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
            link: shareObj.url+"&channel=4&appId="+shareObj.appId, // 分享链接
            imgUrl: shareObj.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        wx.onMenuShareQZone({//分享QQ空间
            title: shareObj.title, // 分享标题
            desc: shareObj.content, // 分享描述
            link: shareObj.url+"&channel=5&appId="+shareObj.appId, // 分享链接
            imgUrl: shareObj.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        // $.hideLoading();
    });
}

//获取推广二维码和链接
function getDistribUrlService() {
    var urlStr =  '/distrib/getDistribUrl';
    var dataObj = {
        lineId : shareInfo.lineId,
        lineName : shareInfo.lineName,
        departAddress:shareInfo.departAddress,
        arriveAddress:shareInfo.arriveAddress,
        distribType:shareInfo.distribType,
        businessType:shareInfo.businessType, //线路业务内容
        url:shareInfo.url,
        domain:shareInfo.domain,
    };
    dataObj = genReqData(urlStr, dataObj);
    $.showLoading();
    $.ajax({
        type: 'POST',
        data:dataObj,
        url:urlStr,
        dataType: 'json',
        success:function (res) {
            isGetDistribUrlBack = true;
            isAllBack();
            if(res.code == 0){
                $(".OR-box img").attr("src",res.data.qrcode) ;//推广二维码
                $("#hunterUrl").val(res.data.url);//推广链接
                if(!isEmpty(res.data.avatar)){
                    $("#avatar img").prop("src",res.data.avatar);
                }
               html2canvas(document.getElementById('poster')).then(function(canvas) {
                    $('#canvas-box').append(canvas);
                    createImage();
                });
                initShareConfig(res.data);
            }else {
                $.dialog({
                    text: '当前业务暂停推广，你可以试试其它！',
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
            $.dialog({
                text: '当前业务暂停推广，你可以试试其它！',
                buttons: [{
                    text: '确定',
                    onClick: function() {
                        location.href = '/distribution/bountyHunter';
                    }
                }]
            });
        }
    })
}

//显示poster div结构
function showPoster() {
    //发起人信息

    if(null == userInfo || undefined == userInfo){
        location.href = '/regOrLogin';
        return;
    }
    $("#userName").html(userInfo.nickName);
    if(isEmpty(userInfo.nickName)){
        $("#userName").html(userInfo.mobile);
    }
    $('.poster-content #avatar img').attr('src',userInfo.avatarUrl);

    createLines(shareInfo);
}

function createLines(data) {
    var _lineHtml = '';
    if(isEmpty(data.departAddress) || isEmpty(data.arriveAddress)){
        _lineHtml += '<div class="line-name">'+ data.lineName +'</div>'
    }else{
    	var departAddress = data.departAddress;
    	var arriveAddress = data.arriveAddress;
    	if (departAddress.length > 9){
    		departAddress = departAddress.substring(0,7)+'...';
    	}
    	if (arriveAddress.length > 9){
    		arriveAddress = arriveAddress.substring(0,7)+'...';
    	}
        _lineHtml += '<div class="station">' +
            '               <img src="/res/images/distribution/v2.0/icon-up.png"/>' +
            '               <div class="item" id="departStation">'+ departAddress +'</div>' +
            '               <div class="item" id="arriveStation">'+ arriveAddress +'</div>' +
            '               <img src="/res/images/distribution/v2.0/icon-down.png"/>' +
            '         </div>'
    }
    $('.poster-content .lines-box').prepend(_lineHtml);
    $('.price-container .price').html(data.minLinePrice);
}

/*更多方式*/
$('.more').on(clickEvent,function () {
    $('#more_popup').show();
});
/*海报切换*/
$('.switch .item').off(clickEvent).on(clickEvent,function () {
    $.showLoading();
    var _index = $(this).data('index');
    var _poster_bg = $('#poster_bg_lines');
    $(this).addClass('active');
    $(this).siblings().removeClass('active');
    if(_index == '1'){
        $(_poster_bg).attr('src','/res/images/distribution/v2.0/poster-bg-1-1.png');//海报背景切换
    }else if(_index == '2'){
        $(_poster_bg).attr('src','/res/images/distribution/v2.0/poster-bg-2-1.png');
    }else if(_index == '3'){
        $(_poster_bg).attr('src','/res/images/distribution/v2.0/poster-bg-3-1.png');
    }else if(_index == '4'){
        $(_poster_bg).attr('src','/res/images/distribution/v2.0/poster-bg-4-1.png');
    }else if(_index == '5'){
        $(_poster_bg).attr('src','/res/images/distribution/v2.0/poster-bg-5-1.png');
    }else if(_index == '6'){
        $(_poster_bg).attr('src','/res/images/distribution/v2.0/poster-bg-6-1.png');
    }else if(_index == '7'){
        $(_poster_bg).attr('src','/res/images/distribution/v2.0/poster-bg-7-1.png');
    }else if(_index == '8'){
        $(_poster_bg).attr('src','/res/images/distribution/v2.0/poster-bg-8-1.png');
    }
    changePosterTheme(_index);
    getContent(_index,contentList);
    $('#img-box').empty();
    $('#poster').css("display","block");
    $('#canvas-box').empty();
    // 生成对应的海报
    html2canvas(document.getElementById('poster')).then(function(canvas) {
        $('#canvas-box').append(canvas);
        createImage();
    });
    dateScroll.scrollToElement($(this)[0], 500, false, false, IScroll.utils.ease.circular);
});
/*收益须知*/
$('.notice .notice-btn').off(clickEvent).on(clickEvent,function () {
    $('#notice_popup').show();
});
/*关闭更多方式和收益须知*/
$('.close-btn').on(clickEvent,function () {
    $('.popup-container').hide();
});

//显示推广文案
function getContent(index,list) {
    if(!isEmpty(index)){
        index = parseInt(index)-1;
        if(list.length > 0){
            var c_index = index % list.length;
            var contentTxt = contentList[c_index];
            // $('.company-box .desc').html('h啊');
            if(shareInfo.shareType == 'platform' || shareInfo.shareType == 'hailing'){
                $('.platform-desc').html(contentTxt);
            }else if(shareInfo.shareType == 'line'){
                $('.company-box .desc').html(contentTxt);
            }
        }

        if(posterSize == '320'){
            $('.OR-content').css({'transform': 'scale(1.44)','-ms-transform': 'scale(1.44)','-o-transform': 'scale(1.44)','-moz-transform': 'scale(1.44)','-webkit-transform': 'scale(1.44)'});
            $('.OR-content p').css({'transform': 'scale(0.69)','-ms-transform': 'scale(0.69)','-o-transform': 'scale(0.69)','-moz-transform': 'scale(0.69)','-webkit-transform': 'scale(0.69)'});
        }
    }
}
//更换推广海报（主题）
function changePosterTheme(index) {
    var selector = $('.poster-container');
    var className = 'poster-container poster-' + index;
    $(selector).attr('class',className);
}

//从canvas中提取图片image
function convertCanvasToImage(canvas) {
    //新Image对象，可以理解为DOM
    var image = new Image();
    // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
    // 指定格式PNG
    image.src = canvas.toDataURL("image/png");
    return image;
}

/*复制链接*/
function copyUrl() {
    var clipboard = new ClipboardJS('.copy-btn', {
        target: function() {
            return document.querySelector('#hunterUrl');
        }
    });
    clipboard.on('success', function(e) {
        $.toastSuccess('复制成功')
        $('#hunterUrl').addClass('copy-s');
        // console.log(e);
    });
    clipboard.on('error', function(e) {
        $.toastSuccess('复制失败，请刷新页面重新复制')
        $('#hunterUrl').removeClass('copy-s')
        // console.log(e);
    });
}

function isAllBack() {
    if(isGetDistribUrlBack && isAllPosterSloganBack){
        // 默认选中第一个
        $('#wrapper ul li:first').trigger(clickEvent);
        $.hideLoading();
    }
}

function createImage() {
    //获取网页中的canvas对象
    var mycanvas1 = $('#canvas-box canvas')[0];
    //将转换后的img标签插入到html中
    var img = convertCanvasToImage(mycanvas1);
    $('#poster').css("display","none");
    $('#img-box').empty();
    $('#img-box').append(img);//imgDiv表示你要插入的容器id
    $.hideLoading();
}

/*$('.OR-box').on('click',function () {
   $('.OR-content').css({'transform': 'scale(1.44)','-ms-transform': 'scale(1.44)','-o-transform': 'scale(1.44)','-moz-transform': 'scale(1.44)','-webkit-transform': 'scale(1.44)'});
   $('.OR-content p').css({'transform': 'scale(0.69)','-ms-transform': 'scale(0.69)','-o-transform': 'scale(0.69)','-moz-transform': 'scale(0.69)','-webkit-transform': 'scale(0.69)'});
});*/
function initTitle(title) {
    $(document).attr('title',title);
    $('title').html(title);
}

$(function () {
    //推广二维码和链接
    getDistribUrlService();
    //推广文案
    getAllPosterSlogan();
    //两个请求都返回了，则显示海报信息
    showPoster();

    // loadUserInfo();
    /*复制链接*/
    copyUrl();
    dateScroll = new IScroll('#wrapper', {
        scrollX: true,
        scrollY: false,
        mouseWheel: true
    });
    setTimeout(function () {
        initTitle('长按保存图片');
    },800)
});