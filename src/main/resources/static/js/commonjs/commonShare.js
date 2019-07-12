var shareObj = {
    url : window.location.href,
    reqURL:  window.location.href,
    title : '定制班线',
    desc : '这就是我一直找的靠谱线上出行平台',
    imgUrl:'',
    appId: '',
    logo:''
};

function initCommonShareConfig(param,gpsLocationCallBack) {
    //请求分享行程接口，返回初始化参数
    var urlList = SERVER_URL_PREFIX + '/provider/info';
    var dataList = {
        shareType: param.shareType,
    };
    dataList = genReqData(urlList, dataList);
    // $.showLoading();
    $.ajax({
        type: 'POST',
        url: urlList,
        data: dataList,
        dataType:  "json",
        success: function(data){
            //查询请求失败，则返回所有错误
            if (data.code !=0 ) {
                wx.hideAllNonBaseMenuItem({
                    success:function () {
                        console.log('已隐藏所有非基础按钮接口');
                    }
                });
            }
            if (data.code == 0) {
                var content = data.data;
                if (undefined != content && content != null){
                    if (param.shareType == 1){
                        shareObj.title = '【'+content.providerName+'】'+content.introduce;
                    }
                    else if(param.shareType){
                        shareObj.title = '【'+content.providerName+'】'+param.businessName;
                    }
                    if (undefined != content.describe){
                        shareObj.desc = content.describe;
                    }
                    shareObj.url = param.url;
                    shareObj.imgUrl = content.logoUrl;
                    shareObj.logo = content.logoUrl;
                    shareObj.providerName = content.providerName;
                    wxShare(shareObj,gpsLocationCallBack);
                    wx.showAllNonBaseMenuItem({
                        success:function () {
                            console.log('已显示所有非基础按钮接口');
                        }
                    });
                }
            }
        },
    });
}

function shareCommon(param,gpsLocationCallBack){
    var data = {
        shareType: 1, // 1.index页面 2.业务首页页面 3.定制班线搜索结果页面分享
    }
    var url = param.url;
    if(param.shareType){
        data.shareType = param.shareType;
    }else {
        if (url.indexOf('/index') >= 0){
            data.shareType = 1;
        }
        else if(url.indexOf('Index')>=0){
            data.shareType = 2;
        }
        else{
            data.shareType = 3;
        }
    }

    var param = $.extend(param, data);
    initCommonShareConfig(param,gpsLocationCallBack);
}

