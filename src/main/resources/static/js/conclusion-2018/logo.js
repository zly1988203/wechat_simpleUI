var annualData = JSON.parse(sessionStorage.getItem('annualData'));
var targetType = isAndroid() ? 'tap' : 'click';
$('#oldUser').on(targetType,function () {
    $('.login-content-popup').show();
    $(this).addClass('active');
    $(this).siblings().removeClass('active');
})

$('.login-content-popup .close').on(targetType,function () {
    $('.login-content-popup').hide();
})

$('#getVerificationCode').on(targetType,function(){
    var _this = $(this);
    var mobile = $.trim($('#phoneNo').val());

    if(mobile.length<=0) {
        $.toast("请输入手机号");
        return;
    }

    if(!(/^1[3456789]\d{9}$/.test(mobile))) {
        $.toast("请输入正确的手机号");
        return;
    }

    //api url
    var urlStr = SERVER_URL_PREFIX+"/Account/getVerifyCode";
    //current page param
    var dataObj = {
        mobile: mobile,
    };
    //merge page param and common param,generate request param
    dataObj = genReqData(urlStr, dataObj);

    _this.prop('disabled', true);//禁用发送验证码按钮
    $.post(urlStr, dataObj, function(result){
        if(result && result.code == 0){
            $('#btnlogo').css('background','#F34032');
            $('#btnlogo').data('clickable',true);
            sandVerifycode(_this);
        }else{
            _this.prop('disabled', false);
            $.alert((result&&result.message) || '发送失败');
        }
    }, 'json');
})

$('#btnlogo').on(targetType,function () {
    var submitBtn = $(this);
    if(submitBtn.data('clickable') == false){
        return;
    }
    var mobile = $.trim($('#phoneNo').val());

    if(mobile.length<=0) {
        $.toast("请输入手机号");
        return;
    }

    if(!(/^1[3456789]\d{9}$/.test(mobile))) {
        $.toast("请输入正确的手机号");
        return;
    }

    var verificationCode = $.trim($('#verificationCode').val());
    if(verificationCode.length<=0) {
        $.toast("验证码不能为空");
        return;
    }

    if(!(/^\d{4}$/.test(verificationCode))) {
        $.toast("验证码错误或已失效");
        return;
    }

    //api url
    var urlStr = SERVER_URL_PREFIX + '/Account/regOrLogin';
    //current page param
    var dataObj = {
        mobile: mobile,
        verifyCode: verificationCode,
    };
    //merge page param and common param,generate request param
    dataObj = genReqData(urlStr, dataObj);
    $.showLoading();
    $.post(urlStr, dataObj, function(result){
        $.hideLoading();
        submitBtn.prop('disabled', false);
        if(result && result.code == 0){
            if (undefined != result.data.token
                && null != result.data.token
                && '' != result.data.token) {
                $.cookie("token", result.data.token, {expires: 30, path: '/' });
                window.location = '/conclusion2018';
            }
            else {
                $.alert("登录失败");
            }
        }else{
            $.alert((result&&result.message) || "未知错误");
        }
    }, 'json');

})

// 发送验证码 - 倒计时
function sandVerifycode(element) {
    var btnText = element.text();
    element.prop('disabled', true);
    var duration = 60;
    element.text(duration + 's后重发');
    var timer = setInterval(function() {
        duration--;
        if(duration <= 0) {
            element.prop('disabled', false).text(btnText);
            clearInterval(timer);
            element.prop('disabled', false);
            return;
        }
        element.text((duration < 10 ? '0' + duration : duration) + 's后重发');
    }, 1000);
}

$(function () {
    $('#providerQRCode').attr('src', $('#providerQRCodeUrl').val());
    annualData = JSON.parse(sessionStorage.getItem('annualData'));
    if(isEmpty(annualData)|| isEmpty(annualData.provideLink)){
        $('#providerbtn').hide();
    }else {
        $('#providerName').html(annualData.providerName);
        setTimeout(function () {
            $('title').html('2018，你的专属出行记忆-'+annualData.providerName);
        },500);
        $('#providerbtn').show();
        $('#providerbtn').on(targetType,function () {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            window.location.href = annualData.provideLink;
        });
    }

    $.post('/conclusion2018/annual/saveRecord',{token:$.cookie('token'),pageNum:6},function (res) {
    })
})