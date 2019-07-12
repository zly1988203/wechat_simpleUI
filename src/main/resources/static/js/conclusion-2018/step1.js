var annualData = JSON.parse(sessionStorage.getItem('annualData'));
var userData = JSON.parse(sessionStorage.getItem('userData'));
var avatar = $('#userAvatar').val();
var providerQRCode = $('#providerQRCodeUrl').val();
$('.next-step').on('click',function () {
    window.location.href = '/conclusion2018/step2';
})

function getPageData() {
    if(isEmpty(annualData) || isEmpty(userData)){
        $.toast('请登录后再查看吧')
    }else{
        $('#avatar').attr('src', avatar);
        $('#nickName').html(userData.nickName);
        $('title').html('2018，你的专属出行记忆-'+annualData.providerName);
        if(null != annualData ){
            annualData.nickName = userData.nickName;
            $('#providerCount').html(annualData.providerCount);
            $('#providerName').html(annualData.providerName);
            $('#pName').html(annualData.providerName);
            $('#milage').html(annualData.milage);
            var str = '北京五环';
            var start = '北京';
            if(annualData.milage < 25 ){
                start = '北京天安门'
                str = '北京五环';
            }else if(annualData.milage >= 25 && annualData.milage < 50){
                str = '八达岭长城';
            }else if(annualData.milage >= 50 && annualData.milage < 100){
                str = '天津';
            }else if(annualData.milage >= 100 && annualData.milage < 300){
                str = '山海关';
            }else if(annualData.milage >= 300 && annualData.milage < 500){
                str = '呼伦贝尔大草原';
            }else if(annualData.milage >= 500 && annualData.milage < 1000){
                str = '西安';
            }else if(annualData.milage >= 1000){
                str = '平流层';
            }
            $('#milageStr').html(str);
            $('#str3Start').html(start);
            $('#providerQRCode').attr('src', providerQRCode);
        }

        $.hideLoading();
        initReveal();

        $.post('/conclusion2018/annual/saveRecord',{token:$.cookie('token'),pageNum:1},function (res) {

        })
    }
}

function initReveal() {
    $('#str1').fadeIn(2000,function () {
        $('#str2').fadeIn(2000,function () {
            $('#str3').fadeIn(2000,function () {
                $('#str4').fadeIn(2000,function () {
                    $('#str5').fadeIn(2000,function () {
                    })
                })
            });
        });
    })
}

function touchEnd(event) {
    //100是给定触上下方向摸起始的坐标差
    if (endY >100) {
       window.location.href = '/conclusion2018/step2';
    }
    // if(endY<-100){
    //     window.location.href = '/conclusion-2018/step2.html';
    // }
    //如果不重置，会出现问题
    endY = 0;

}

$(function () {
    $.showLoading('记忆生成中...');
    getPageData();
    document.body.addEventListener("touchend", touchEnd, false);
})