<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>查看评价</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="/res/style/evaluate/evaluate-check.css?v=${version!}">
</head>

<body>
    <div class="evaluate-check">
        <div class="title">您的评价将帮助我们提升服务品质</div>
        <div class="content">
            <div class="item">
                <h2 class="caption">综合评价</h2>
                <div class="star" id="commentLevel" data-level="4"></div>
                <div class="tag" id="tag">
                    <#--  <span data-value="卫生很好">卫生很好</span>
                    <span data-value="行驶平稳">行驶平稳</span>
                    <span data-value="态度好">态度好</span>
                    <span data-value="准时到站">准时到站</span>
                    <span data-value="停靠准确">停靠准确</span>
                    <span data-value="行驶平稳">行驶平稳</span>
                    <input type="hidden" id="tag1">  -->
                </div>
            </div>
            <div class="message" id="message">
                <#--  <div class="thumb"><img src="https://gss0.bdstatic.com/7051cy89RcgCncy6lo7D0j9wexYrbOWh7c50/zhidaoribao/2017/0801/hou.jpg"></div>
                <div class="thumb"><img src="https://gss0.bdstatic.com/7051cy89RcgCncy6lo7D0j9wexYrbOWh7c50/zhidaoribao/2017/0801/hou.jpg"></div>
                <div class="thumb"><img src="https://gss0.bdstatic.com/7051cy89RcgCncy6lo7D0j9wexYrbOWh7c50/zhidaoribao/2017/0801/hou.jpg"></div>
                <div class="details">司机真帅，定位很准。服务态度也很好，准时到站，车内空气清晰。</div>  -->
            </div>
            <div class="reply">
                <div class="headline">客服回复</div>
                <div class="msg">
                    <p id="replyMsg"></p>
                </div>
            </div>
        </div>
    </div>
    <div class="foot-panel">
        <div id="goBack" class="back">返回</div>
    </div>
 
    <script src="/js/commonBus.js?v=${version!}"></script>
    <script src="/js/vectors.min.js?v=${version!}"></script>
    <script src="/js/commutingBus/serverApi.js"></script>
    <script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/shareConfig.js?v=${version!}"></script>
    <script>
        // 返回
        $('#goBack').on('click', function () {
            window.history.go(-1);
        })
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

            var getUrlRequest = getRequest();
            var pram = {
                orderNo: getUrlRequest.orderNo,
                busId: getUrlRequest.busId
            }
            $.showLoading("数据加载中...");
            request(commuteApi.toCommentDetailBus, pram, true).then(function (res) {
                $.hideLoading();
                if (res.code == 0) {
                    if (JSON.stringify(res.data) === '{}') {
                        alert("数据返回异常");
                        window.history.go(-1);
                    }else{
                        $("#commentLevel").data("level", res.data.comment.overallStar);
                        var tagHtml ="";
                        var labelText = res.data.labelText;
                        for(var i=0;i<labelText.length;i++){
                            if(labelText[i] != ""){
                                tagHtml+='<span data-value="'+labelText[i]+'">'+labelText[i]+'</span>';
                            }
                        }
                        $("#tag").html(tagHtml);
                        var messageHtml ="";
                        var imgUrl = res.data.imgUrl;
                        if(imgUrl !=undefined){
                            if(imgUrl.length>0){
                                for(var i=0;i<imgUrl.length;i++){
                                    messageHtml+='<div class="thumb"><img src="'+imgUrl[i]+'"></div>';
                                }
                            }
                        }
                        var remark = res.data.comment.remark;
                        if(remark !=""){
                            messageHtml+='<div class="details">'+remark+'</div>';
                        }
                        $("#message").html(messageHtml);
                        var replyMsg = res.data.comment.replyMsg;
                        if(replyMsg ==""){
                            $(".reply").hide();
                        }else{
                            $("#replyMsg").html(replyMsg);
                        }
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
                    }
                } else {
                    alert(res.message);
                }
            });

        });
    </script>
</body>
</html>