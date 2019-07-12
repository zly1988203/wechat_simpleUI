<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>评价成功</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="/res/style/evaluate/evaluate-success.css?v=${version!}">
</head>

<body>
    <div class="evaluate-success">
        <div class="thumb"></div>
        <div class="state">评价成功！</div>
        <div class="content">
            <h4 class="caption">综合评价</h4>
            <div class="star" id="commentLevel" data-level="4"></div>
            <div class="message" id="commentText">较满意，但仍可改善，给您4星，再接再厉!</div>
        </div>
        <div class="btn-group">
            <div class="btn primary" id="goBackTripList">返回车票列表</div>
        </div>
    </div>
   	
    <script src="/js/commonBus.js?v=${version!}"></script>
    <script src="/js/vectors.min.js?v=${version!}"></script>
    <script src="/js/commutingBus/serverApi.js"></script>
    <script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/shareConfig.js?v=${version!}"></script>
    <script>
        var shareObj = { url : window.location.href }
   		wxInitConfig(shareObj);
        $(function () {
            // 获取url的参数
            function getRequest() {
                var url = location.search; //获取url中"?"符后的字串  
                var theRequest = new Object();
                if (url.indexOf("?") != -1) {
                    var str = url.substr(1);
                    strs = str.split("&");
                    for (var i = 0; i < strs.length; i++) {
                        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                    }
                }
                return theRequest;
            }
            var ticketId = null;
            var getUrlRequest = getRequest();
            if("ticketId" in getUrlRequest){
                ticketId = Number(getUrlRequest.ticketId);
            }
            var pram = {
                token: serverUtil.token,
                ticketId: ticketId,
            }
            $.showLoading("加载中...");
            request(commuteApi.toCommentSuccess, pram, true).then(function (res) {
                $.hideLoading();
                if (res.code == 0) {
                    $("#commentLevel").data("level", res.data.star);
                    $("#commentText").html(res.data.text);
                    $('.star').each(function (index) {
                        var _level = Number($("#commentLevel").data('level'));
                        if (isNaN(_level)) {
                            throw '星级错误'
                        }
                        var _html = '';
                        for (var i = 0; i < 5; i++) {
                            if (i < _level) {
                                _html = '<span class="active"></span>'
                            } else {
                                _html = '<span></span>'
                            }
                            $("#commentLevel").append(_html);
                        }
                    });
                } else {
                    alert(res.message);
                }
            });

            // 返回车票列表
            $('#goBackTripList').on('click', function () {
                window.location = '/cityBus/myTripList';
            })
        });
    </script>
</body>
</html>