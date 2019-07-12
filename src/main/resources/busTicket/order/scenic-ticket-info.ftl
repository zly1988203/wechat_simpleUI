<#include "/_framework.ftl">
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>景区门票</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <meta name="referrer" content="no-referrer">
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/scenic-ticket-info.css?v=${version!}" rel="stylesheet" type="text/css">
</head>
<body>

<div class="main-container">
<#--<div class="lump ticket-name-content">-->
<#--<div class="info">黄风景区门票</div>-->
<#--<div class="info">2019/10/10（周四）入园</div>-->
<#--</div>-->

<#--<div class="lump ticket-info-content">-->
<#--<ul>-->
<#--<li>-->
<#--<div class="left">门票价总额</div>-->
<#--<div class="right price">20元</div>-->
<#--</li>-->
<#--<li>-->
<#--<div class="left">购票数</div>-->
<#--<div class="right">共2张</div>-->
<#--</li>-->
<#--<li>-->
<#--<div class="left">成人票</div>-->
<#--<div class="right">1张</div>-->
<#--</li>-->
<#--<li>-->
<#--<div class="left">儿童票</div>-->
<#--<div class="right">1张</div>-->
<#--</li>-->

<#--</ul>-->
<#--</div>-->

<#--<div class="lump ticket-info-content">-->
<#--<ul>-->
<#--<li>-->
<#--<div class="left">时间区间</div>-->
<#--<div class="right">2019-10-11至2019-10-12</div>-->
<#--</li>-->
<#--<li>-->
<#--<div class="left">使用方法</div>-->
<#--<div class="right">通过凭二代身份证或平台发送的二维码验票进入园区，无需取票</div>-->
<#--</li>-->
<#--<li>-->
<#--<div class="left">取票地址</div>-->
<#--<div class="right">北京市朝阳区广顺大街与来广西路交汇处</div>-->
<#--</li>-->
<#--<li>-->
<#--<div class="left">使用地址</div>-->
<#--<div class="right">北京市朝阳区广顺大街与来广西路交汇处</div>-->
<#--</li>-->
<#--<li>-->
<#--<div class="left">退改说明</div>-->
<#--<div class="right">门票未使用可退票</div>-->
<#--</li>-->
<#--</ul>-->
<#--</div>-->

<#--<div class="lump role-info-content">-->
<#--<div class="role-name sui-border-b">联系人信息</div>-->
<#--<ul>-->
<#--<li>-->
<#--<div class="line-item">-->
<#--<div class="name">王小瑞</div><div class="value">16888888888</div>-->
<#--</div>-->
<#--<div class="line-item">-->
<#--<div class="name">身份证</div><div class="value">362************027</div>-->
<#--</div>-->
<#--</li>-->
<#--</ul>-->
<#--</div>-->

<#--<div class="lump role-info-content">-->
<#--<div class="role-name sui-border-b">游客信息</div>-->
<#--<ul>-->
<#--<li class="sui-border-b">-->
<#--<div class="line-item">-->
<#--<div class="name">王小瑞</div>-->
<#--</div>-->
<#--<div class="line-item">-->
<#--<div class="name">身份证</div><div class="value">362************027</div>-->
<#--</div>-->
<#--<div class="line-item">-->
<#--<div class="status wait-check">未验票</div>-->
<#--</div>-->
<#--</li>-->
<#--<li class="sui-border-b">-->
<#--<div class="line-item">-->
<#--<div class="name">王小瑞</div>-->
<#--</div>-->
<#--<div class="line-item">-->
<#--<div class="name">身份证</div>-->
<#--<div class="value">362************027</div>-->
<#--</div>-->
<#--<div class="line-item">-->
<#--<div class="status refunding">退票中</div>-->
<#--</div>-->
<#--</li>-->
<#--<li class="sui-border-b">-->
<#--<div class="line-item">-->
<#--<div class="name">王小瑞</div>-->
<#--</div>-->
<#--<div class="line-item">-->
<#--<div class="name">身份证</div>-->
<#--<div class="value">362************027</div>-->
<#--</div>-->
<#--<div class="line-item">-->
<#--<div class="status refunded">已退票</div>-->
<#--</div>-->
<#--</li>-->
<#--<li class="sui-border-b">-->
<#--<div class="line-item">-->
<#--<div class="name">王小瑞</div>-->
<#--</div>-->
<#--<div class="line-item">-->
<#--<div class="name">身份证</div>-->
<#--<div class="value">362************027</div>-->
<#--</div>-->
<#--<div class="line-item">-->
<#--<div class="status checked">已验票</div>-->
<#--</div>-->
<#--</li>-->
<#--</ul>-->
<#--</div>-->
</div>


<div class="btn-bar">
    <div class="button back">返回</div>
    <div class="button refund" style="display: none">退票</div>
    <div class="button to-check active" style="display: none">验票</div>
</div>

<!--检票弹窗-->
<div class="popup-container-detail" id="qrCodePropup" style="display: none">
    <div class="check-content">
        <div><i class="icon-close"></i></div>
        <div class="order-info">
            <div class="name"></div>
            <div class="time"></div>

        </div>
        <div class="order-check">
            <div class="prompt">向验票员/扫码机展示二维码验票</div>
            <div class="qr-code" id="qrcode">

            </div>
            <div class="person-info sui-border-b"></div>
            <div class="check-info">
                <div class="info-header">票种/票价/张数</div>
                <div class="info-data"></div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
<script type="text/javascript" src="/js/vectors.min.js?v=${version!}"></script>
<script type="text/javascript" src="/js/commonjs/qrcode.min.js?v=${version!}"></script>
<script type="text/javascript" src="/js/busTicket/order/scenic-ticket-info.js?v=${version!}"></script>
</body>
</html>