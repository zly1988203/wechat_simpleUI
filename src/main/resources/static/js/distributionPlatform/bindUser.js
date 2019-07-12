$(function () {
    $.showLoading();
})
setTimeout(function () {
    bindUser();
},500)

function GetRequest(url) {
// var url = location.search; //获取url中"?"符后的字串
    var theRequest = {};
    if (url.indexOf("?") != -1) {
        var strs = url.substring(url.indexOf("?")+1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=strs[i].split("=")[1];
        }
    }
    return theRequest;
}

function bindUser() {

    var param = GetRequest(window.location.href);
    var linkParam = {
        // userId : param.userId,
        // providerId : param.providerId,
        // redirectUrl : param.redirectUrl,
        distribId : param.distribId,
        // distribType : param.distribType,
        channel : param.channel
        //code:param.userId+"_"+param.providerId+"_"+param.distribId
    }
    // var urlStr =  '/distrib/bindUser';
    //current page param
    var dataObj = {
        // state :linkParam.userId+"_"+linkParam.providerId+"_"+linkParam.redirectUrl+"_"+linkParam.distribId+"_"+linkParam.distribType
        state :linkParam.distribId+"_"+linkParam.channel
    };

    //window.location='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ WX_APP_ID + '&redirect_uri=' + CURRENT_SERVER + '/distrib/bindUser&connect_redirect=1&response_type=code&scope=snsapi_base&state='+(dataObj.state)+'#wechat_redirect';
    window.location = getWechatAuthUrl(WX_APP_ID, CURRENT_SERVER + '/distrib/bindUser', dataObj.state);
}

