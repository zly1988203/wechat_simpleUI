$(function () {
    loadeUserInfo();
    /*复制链接*/
    copyUrl();
});

/*海报切换*/
$('.switch .item').on('click',function () {
    $.showLoading();
    var _index = $(this).data('index');
    var _poster_bg = $('#poster_bg');
    $(this).addClass('active');
    $(this).siblings().removeClass('active');
    if(_index == '1'){
        $(_poster_bg).attr('src','/res/images/distribution/poster-bg-1.png');//海报背景切换
        $('#lines_bg').attr('src','/res/images/distribution/lines-bg-1.png');//线路背景切换
        $('.company-box p').css({'color':'#fff'});
        $('.poster-box .tips').css({'color':'#fff'});
    }else if(_index == '2'){
        $(_poster_bg).attr('src','/res/images/distribution/poster-bg-2.png');
        $('#lines_bg').attr('src','/res/images/distribution/lines-bg-2.png');
        $('.company-box p').css({'color':'#fff'});
        $('.poster-box .tips').css({'color':'#fff'});
    }else if(_index == '3'){
        $(_poster_bg).attr('src','/res/images/distribution/poster-bg-3.png');
        $('#lines_bg').attr('src','/res/images/distribution/lines-bg-3.png');
        $('.company-box p').css({'color':'#fff'});
        $('.poster-box .tips').css({'color':'#fff'});
    }else if(_index == '4'){
        $(_poster_bg).attr('src','/res/images/distribution/poster-bg-4.png');
        $('#lines_bg').attr('src','/res/images/distribution/lines-bg-4.png');
        $('.company-box p').css({'color':'#fff'});
        $('.poster-box .tips').css({'color':'#fff'});
    }else if(_index == '5'){
        $(_poster_bg).attr('src','/res/images/distribution/poster-bg-5.png');
        $('#lines_bg').attr('src','/res/images/distribution/lines-bg-5.png');
        $('.company-box p').css({'color':'#fff'});
        $('.poster-box .tips').css({'color':'#fff'});
    }
    $('#img-box').empty();
    $('#poster').css("display","block");
    $('#canvas-box').empty();
    //TODO 生成对应的海报
    html2canvas(document.getElementById('poster')).then(function(canvas) {
        $('#canvas-box').append(canvas);
        createImage();
    });
});

/*更多方式*/
$('.more').on('click',function () {
    $('#more_popup').show();
});

/*收益须知*/
$('.notice .notice-btn').on('click',function () {
    $('#notice_popup').show();
});
/*关闭更多方式和收益须知*/
$('.close-btn').on('click',function () {
    $('.popup-container').hide();
});

var descTip = "";
function loadeUserInfo() {
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if(null == userInfo || undefined == userInfo){
        location.href = '/regOrLogin';
        return;
    }

    $("#userName").html(userInfo.nickName);
    if(isEmpty(userInfo.nickName)){
        $("#userName").html(userInfo.mobile);
    }
    $("#proName").html("进入"+userInfo.providerName);
    descTip = userInfo.nickName + "请你来坐车！";
    // $("#providerName").html("当前车企："+userInfo.providerName);
    // $("#providerId").val(userInfo.providerId);
    initQrcode();
}

function initQrcode() {
    $.showLoading();
    var shareInfo = JSON.parse(sessionStorage.getItem("shareInfo"));
    // var shareInfo = JSON.parse(localStorage.getItem("shareInfo"));
    var urlStr =  '/distrib/getDistribUrl';
    //current page param
    var dataObj = {
        lineId : shareInfo.lineId,
        // departAddress:shareInfo.departAddress,
        // arriveAddress:shareInfo.arriveAddress,
        distribType:shareInfo.distribType,
        // businessType:shareInfo.businessType, //线路业务内容
        url:shareInfo.url,
        domain:shareInfo.domain,
    };

    if(shareInfo.distribType == 2){
        //业务类型 城际约租车=2   定制班线=4  汽车票=6  通勤班线=7    旅游班线=9   网约车=10
        if(shareInfo.businessType == 2){
            $("#lineInfo .station").empty()
            $("#lineInfo .station").html("<span style='line-height: 1.1rem;'>"+shareInfo.lineName+"</span>");
            $("#lines_bg").prop("src","/res/images/distribution/lines-bg-4.png");
            // cont = "微信约车，上门接送";
        }else {
            $("#lineInfo .station").html('<span class="start">'+shareInfo.departAddress+'</span>'+'<span class="end">'+shareInfo.arriveAddress+'</span>');
            if(shareInfo.departAddress.length > 4 || shareInfo.arriveAddress.length > 4){
                $("#lineInfo .station").css('line-height','normal')
            }

            if(shareInfo.businessType == 4){
                $("#lines_bg").prop("src","/res/images/distribution/lines-bg-5.png");
                // cont = "微信买车票，实惠不排队";
            }else if(shareInfo.businessType == 6){
                $("#lines_bg").prop("src","/res/images/distribution/lines-bg-5.png");
                // cont = "微信买车票，实惠不排队";
            }else if(shareInfo.businessType == 7){
                $("#lines_bg").prop("src","/res/images/distribution/lines-bg-3.png");
                // cont = "一人一座上下班";
            }else if(shareInfo.businessType == 9){
                $("#lines_bg").prop("src","/res/images/distribution/lines-bg-1.png");
                // cont = "特价出游，直达景区";
            }else if(shareInfo.businessType == 10){
                $("#lines_bg").prop("src","/res/images/distribution/lines-bg-2.png");
                // cont = "微信约车，随叫随到";
            }
        }
    }

    dataObj = genReqData(urlStr, dataObj);
    $.ajax({
        type: 'POST',
        data:dataObj,
        url:urlStr,
        dataType: 'json',
        success:function (res) {
            if(res.code == 0){
                $(".OR-box img").attr("src",res.data.qrcode) ;
                $("#hunterUrl").val(res.data.url);
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
    });
    clipboard.on('error', function(e) {
        $.toastSuccess('复制失败，请刷新页面重新复制')
        $('#hunterUrl').removeClass('copy-s')
    });
}

function initShareConfig(data) {
    // var shareInfo = JSON.parse(localStorage.getItem("shareInfo"));
    var shareInfo = JSON.parse(sessionStorage.getItem("shareInfo"));
    if(shareInfo.distribType == 1){
        data.title = "平台推荐";
        data.desc = descTip + "这里可以买车票";
    }else if(shareInfo.distribType == 3){
        data.title = "网约车推荐";
        data.desc = descTip + "微信约车，随叫随到";
    }else if(shareInfo.distribType == 2){
        data.title = "线路推荐";
        var cont = "";
        //业务类型 城际约租车=2   定制班线=4  汽车票=6  通勤班线=7    旅游班线=9   网约车=10
        if(shareInfo.businessType == 2){
            cont = "微信约车，上门接送";
        }else if(shareInfo.businessType == 4){
            cont = "微信买车票，实惠不排队";
        }else if(shareInfo.businessType == 6){
            cont = "微信买车票，实惠不排队";
        }else if(shareInfo.businessType == 7){
            cont = "一人一座上下班";
        }else if(shareInfo.businessType == 9){
            cont = "特价出游，直达景区";
        }else if(shareInfo.businessType == 10){
            cont = "微信约车，随叫随到";
        }
        data.desc = descTip + cont;
    }

    var shareObj = {
        title:data.title,
        desc:data.desc,
        url: data.url,
        imgUrl:"",
    }

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
            $.hideLoading();
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
            link: shareObj.url+"&shareType=1&appId="+shareObj.appId, // 分享链接
            imgUrl: shareObj.logo, // 分享图标
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
            link: shareObj.url+"&shareType=2&appId="+shareObj.appId, // 分享链接
            imgUrl: shareObj.logo, // 分享图标
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
            link:shareObj.url+"&shareType=6&appId="+shareObj.appId, // 分享链接
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
            link: shareObj.url+"&shareType=4&appId="+shareObj.appId, // 分享链接
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
            link: shareObj.url+"&shareType=5&appId="+shareObj.appId, // 分享链接
            imgUrl: shareObj.logo, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        $.hideLoading();
    });
}