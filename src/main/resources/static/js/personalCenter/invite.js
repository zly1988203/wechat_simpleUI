$(function() {
    loadInviteGift();
});


function createImage() {
    //获取网页中的canvas对象
    var mycanvas1 = $('#canvas-box canvas')[0];
    //将转换后的img标签插入到html中
    var img = convertCanvasToImage(mycanvas1);
    $('#img-box').empty();
    $('#img-box').append(img);//imgDiv表示你要插入的容器id
    $('#imgTemp').hide();
    $.hideLoading();
    // $('#showImg').show();
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

function loadInviteGift() {
    //api url
    var urlStr = SERVER_URL_PREFIX+"/coupon/inviteGift";
    var dataObj = {
    };
    dataObj = genReqData(urlStr, dataObj);
    var succ_event = function (result) {
        if (result.code == 0) { //请求成功
            var resContent = result.data;
            var couponContent = resContent.couponContent;
            var qrUrl = resContent.qrUrl;
            var isStaff = resContent.isStaff;
            var recommendNum = resContent.recommendNum;
            var inviteAmount = resContent.inviteAmount;
            if (inviteAmount > 0) { //有邀请者奖券，则进行增强显示
                var contentArray = couponContent.split('-');
                $('.tip').html(contentArray[0]);
                $('.award').html(contentArray[1]);
            } else {
                $('.tip').html(couponContent);
            }
            if(undefined != resContent.avatarUrl && resContent.avatarUrl !=''){
                $('#imgTemp .head img').prop('src',resContent.avatarUrl);
            }

            var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
            if(undefined != userInfo && undefined != userInfo.identifyId){
                $('#imgTemp .title-name').html(userInfo.providerName);
                if(undefined != userInfo.nickName &&  userInfo.nickName != ""){
                    $('#imgTemp .user-name').html(userInfo.nickName);
                }else {
                    $('#imgTemp .user-name').html(userInfo.mobile);
                }
            }

            $('#imgTemp .qrcode-img img').prop('src',qrUrl);

            $('.qrcode img').attr('src', qrUrl);
            var target = $('#recommend').html();
            target = target.replace('0', recommendNum);

            $('#recommend').html('');
            $('#recommend').append(target);

            var couponContent = $('#coupon').html();
            if (isStaff == 1) { //是员工，显示员工排行榜
                couponContent = '员工排行榜';
                $('#coupon').on('click', function() {
                    //location.href = '/passenger/staff-ranklist.html';
                    location.href = 'http://'+adDomain+'/wechat/employee_credit/index?providerId='+resContent.providerId+'&token='+$.cookie('token');
                });
            } else { //非员工，显示获得的优惠券张数
                couponContent = couponContent.replace('0', resContent.couponCount);
            }

            $('#coupon').html('');
            $('#coupon').append(couponContent);
            var title = resContent.providerIntroduce ? resContent.providerIntroduce :'安全便捷的线上出行平台';
            $('.title-explain').html(title);
            var val = resContent.secondPageLabel.value ? resContent.secondPageLabel.value
                : '我出行一直用'+userInfo.providerName+'，经济又实惠，邀你免费来体验。';
            var explain = val+resContent.secondPageLabel.desc;
            // var temp_expalin = "";
            // if(explain.length > 30){
            //     temp_expalin = explain.slice(0,30)+'...';
            // }else{
            //     temp_expalin = explain;
            // }
            $('#imgTemp .invite-explain').html(explain);
            var limit_date = fun_date(7);
            var limitStr = limit_date.month+'月'+limit_date.day+'日';
            $('.use-condition').html('<p>该二维码7天内('+limitStr+'前)有效</p>');
        } else {
            $.toastError(data.msg);
        }
    }
    $.ajax({
        type: 'POST',
        url:urlStr,
        data:dataObj,
        dataType:"json",
        success:succ_event
    })
}

function fun_date(num_days){
    var date1 = new Date(),
        time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
    var date2 = new Date(date1);
    date2.setDate(date1.getDate()+num_days);
    // var time2 = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
    return {month:(date2.getMonth()+1),day:date2.getDate()}
}


$('#recommend').on('click', function() {
    location.href = '/passenger/invite-list.html';
});

$('.invite-foot button').on('click', function() {
    $.showLoading();
    $('#fade').show();
    $('#imgTemp').show();
    var windWidth = window.innerWidth;
    if(windWidth >= 320){
        var temp_width = windWidth - 320;
        $('#imgTemp').css('left',(temp_width/2)+'px');
    }
    html2canvas(document.getElementById('imgTemp')).then(function(canvas) {
        $('#canvas-box').empty();
        $('#canvas-box').append(canvas);
        createImage();
        $('#showImg').show();
        var windWidth = window.innerWidth;
        if(windWidth > 320){
            var temp_width = windWidth - 320;
            $('#showImg').css('left',(temp_width/2)+'px');
        }
    });

});
$('.invite-tip-close').on('click', function() {
    $('#showImg').hide();
    $('#fade').hide();
    $('#canvas-box').empty();
})