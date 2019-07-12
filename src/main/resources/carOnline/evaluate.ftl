<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>用户评价</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/onlineCar/wait.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/onlineCar/evaluate.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>

<div id="wait-instant">
    <header>
        <!--评论-->
        <div class="evaluate-container">
            <div class="star-box">
                <div class="star-info">匿名评价司机</div>
                <div class="star" data-size="max">
                    <input type="hidden" id="star1"/>
                </div>
                <div class="star-info">完成匿名评价，我们将提供更好的服务</div>
            </div>
            <div class="evaluate-box" style="display: none">
             <div class="tag-tips">请选择标签</div>
                <div class="tag">
                   
                  
                </div>
                <div class="others">
                    <label class="message-area" for="message-1">
                        <textarea id="message-1" data-max="200" placeholder="其他意见和建议（内容匿名，可放心填写）" maxlength="200"></textarea>
                        <div class="message-length">0/200</div>
                    </label>
                </div>
            </div>
        </div>
    </header>

    <!--提交评论-->
    <div id="confirmData" style="display: none">提交评论</div>

</div>
<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/communicate.min.js?v=${version!}"></script>
<script src="/js/carOnline/evaluate.js?v=${version!}"></script>

</body>
</html>
