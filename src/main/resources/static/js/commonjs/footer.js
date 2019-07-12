$(function(){
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    $('footer .provider-name').text(userInfo.providerName);
    $('footer .provider-tips').text(isEmpty(userInfo.provider.introduce)?'安全便捷的线上出行平台':userInfo.provider.introduce);
    
    /*setTimeout(function () {
        var body = $('body').height();
        var screen = $(window).height();
        var trip = $('.trip-container').outerHeight(true);
        var line = $('.main-content').outerHeight(true);

        if (trip >= 0){
            if (trip >= (screen-56)){
                $('footer').css({'position':'relative','margin-top': '.75rem'});
            }
        }
        else if(line >= 0){
            if (line >= (screen-56)){
                $('footer').css({'position':'relative','margin-top': '.75rem'});
            }else{
                $('.main-content').css('min-height',screen-56)
            }
        }
        else{
            if (body >= (screen-56)){
                $('footer').css({'position':'relative','margin-top': '.75rem'});
            }
        }
        // footer高度112
    },0)*/
})