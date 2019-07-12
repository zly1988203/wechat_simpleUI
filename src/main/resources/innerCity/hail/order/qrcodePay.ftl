<#include "/_framework.ftl">
 <!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>中交出行</title>
    <meta name="viewport"
          content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1"/>
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/innerCity/order-payment.css?v=${version!}" rel="stylesheet" type="text/css">
</head>

<body>
<input type="hidden" id="hail" value="${hail!''}">
    <#setting datetime_format="MM月dd日   HH:mm"/>
<div class="payment">
    <div class="payment-top">
        <p>您正在进行扫码支付操作，请确认订单信息。</p>
    </div>

    <div class="payment-list">
        <div class="title">订单信息</div>
        <div class="head">
            <div class="date">${orderInformation.departTime?number_to_datetime}出发</div>
            <div class="code">${orderInformation.numbers}人</div>
        </div>
        <div class="main">
            <div class="info">
                <div class="info-item start">${orderInformation.departTitle}</div>
                <div class="info-item end">${orderInformation.arriveTitle}</div>
            </div>
        </div>
             <#if (orderInformation.tipsMessage!'')!=''>
        		<div class="tips">${orderInformation.tipsMessage!""}</div>
             </#if>
    </div>

    <div class="payment-info">
        <div class="title">费用详情</div>
        <div class="price-container">
            共 <span>${orderInformation.realPay!""}</span> 元
        </div>
        <div class="detail-info">
            <div class="detail">
                <dl>
                    <dt>${orderInformation.innerCityName!'城际约租车'}</dt>
                    <dd>${orderInformation.price!""}元</dd>
                </dl>
                     <#if (orderInformation.priceAdjustValue!0) !=0>
	                <dl>
                        <dt>司机调整金额</dt>
                        <dd>
	                    	<#if (orderInformation.priceAdjustType!0) == 0>
                                -${orderInformation.priceAdjustValue!0}元
                            <#else>
							+${orderInformation.priceAdjustValue!0}元
                            </#if>
                        </dd>
                    </dl>
                     </#if>
                       <#if (orderInformation.statusDesc!0) !='0' && ((orderInformation.specialPrice!0)>0)>
		                <dl>
                            <dt>${orderInformation.specialPriceActivityName!""}</dt>
                            <dd>
		                    	<#if (orderInformation.statusDesc!"") == '1'>
                                    -${orderInformation.specialPrice!0}元
                                </#if>
                            </dd>
                        </dl>
                       </#if>
	                <#if ((orderInformation.couponPrice!0)>0)>
		                <dl>
                            <dt>优惠劵</dt>
                            <dd>
		                    <#if (orderInformation.couponPrice>0)>
                                -${orderInformation.couponPrice!""}元
                            </#if>
                            </dd>
                        </dl>
                    </#if>
            </div>
            <div class="title-bar">查看明细</div>
        </div>
    </div>

    <!-- 刚下单支付样式 -->
    <div class="pay-method newly">
        <div class="title">支付方式</div>
        <label class="wechat" for="wechatPay">
            <span>微信支付</span>
            <input type="radio" id="wechatPay" checked/>
        </label>
        <!--  <label class="later" for="laterPay">
             <span>稍后支付</span>
             <input type="radio" id="laterPay" />
         </label> -->
    </div>
    <!-- 后续支付样式 -->
    <div class="pay-method recently">
        <div class="title">支付方式</div>
        <label class="wechat" for="wechatPay">
            <span>微信支付</span>
            <input type="radio" id="wechatPay"/>
        </label>
    </div>

    <div class="pay-foot">
        <div class="btn-group">
            <!-- <div class="btn default">取消订单</div> -->
            <div class="btn primary" id="orderPay">确定支付</div>
        </div>
        <div class="link">
            <span class="inter-rule">约车规则</span>
            |
            <span id="contact">联系客服</span>
        </div>
    </div>
</div>

<!--城际约租车规则-->

<div id="interRule" class="sui-popup-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <div class="listWrapper">
            <div class="content rule-content">
                <article class="sui-article">
                    <h1>约车规则</h1>
                    <div class="sui-border-t content rule-bar">
                    ${orderInformation.content!""}
                    </div>
                </article>
                <div class="close-popup close" data-target="interRule"></div>
            </div>
        </div>
        <div class="btn-group">
            <div class="btn primary close-popup" data-target="interRule">返回</div>
        </div>
    </div>
</div>


<script src="/js/commonJs.js?v=${version!}"></script>
<script src="/js/vectors.min.js?v=${version!}"></script>
<script src="/js/backtrack.min.js?v=${version!}"></script>
<script>
    var hail = $('#hail').val();

    function onBridgeReady(data) {
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
            "appId": data.appId, //公众号名称，由商户传入
            "timeStamp": data.timeStamp, //时间戳，自1970年以来的秒数
            "nonceStr": data.nonceStr, //随机串
            "package": "prepay_id=" + data.prepayId,
            "signType": data.signType, //微信签名方式：
            "paySign": data.paySign //微信签名
        }, function (res) {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                window.location = hail + '/innerCity/qrcode/toPaySuccess?orderNo=${orderInformation.orderNo}';
            }
        });
    }

    //联系客服
    $('#contact').on('click', function () {
        var urlDetail = SERVER_URL_PREFIX + hail + '/Config/commonConfig';
        var dataDetail = {};
        dataDetail = genReqData(urlDetail, dataDetail);
        $.ajax({
            type: 'POST',
            url: urlDetail,
            data: dataDetail,
            dataType: 'json',
            success: function (data) {
                if (data && data.code == 0) {
                    window.location.href = 'tel:' + data.data.customerTel;
                }
            }
        });
    });

    var getPrepayInfoCallback = function (data) {
        if (typeof WeixinJSBridge == "undefined") {
            $(document).on('WeixinJSBridgeReady', function () {
                onBridgeReady(data);
            });
        } else {
            onBridgeReady(data);
        }
    }

    function getPrepayInfo(dataParam, callback) {
        $.ajax({
            type: "GET",
            url: hail + "/bus/getInnerCityQrcodeOrderPrepayInfo",//添加订单
            data: dataParam,
            dataType: "json",
            success: function (result) {

                if (result != undefined && result.code != undefined && parseInt(result.code) == 0) {
                    callback(result.data);
                } else if (result != undefined && result.code != undefined && parseInt(result.code) != 0) {
                    if (parseInt(result.code) == 8888) {
                        window.location = hail + '/innerCity/qrcode/toPaySuccess?orderNo=${orderInformation.orderNo}';
                    } else {
                        window.location = hail + '/innerCity/qrcode/toPayFail?providerId=${orderInformation.providerId}';
                    }
                }
            }
        });
    }

    $(function () {

        $("#orderPay").click(function () {//获取预支付信息
            var orderNo = '${orderInformation.orderNo}';
            var dataParam = {};
            dataParam['orderNo'] = orderNo;
            dataParam['uuid'] = '${uuid}';
            dataParam['providerId'] = '${orderInformation.providerId}';
            getPrepayInfo(dataParam, getPrepayInfoCallback);
        })

        //查看明细
        $('.detail-info .title-bar').on('click', function () {
            var $el = $(this);

            if ($el.hasClass('active')) {
                $el.removeClass('active');
                $el.prev().hide();
            } else {
                $el.addClass('active');
                $el.prev().show();
            }
        });

        //城际约租车规则
        $('.inter-rule').on('click', function () {
            $('#interRule').popup('popup', function () {
                var $el = $('#interRule');
                if ($el.data('isInitsc')) return;
                $el.data('isInitsc', true);

                setTimeout(function () {
                    $el.find('.listWrapper').css('height', $(window).height() - $el.find('.btn.primary').height() - 15);
                    new IScroll('#interRule .listWrapper');
                    $el.data('isInitsc', false);
                }, 300);
            });
        });

        //返回键控制
        backtrack(function () {
            var self = this;

            //弹窗层，返回0
            $('.inter-rule').on('click.back', function () {
                self.setState(0);
            });

            //关闭弹窗层，返回-1
            $('[data-target="interRule"]').on('click.back', function () {
                self.setState(-1);
            });
        }, function (data) {
            this.go();
        });

        //支付方式样式选择 0-刚下单时，1或其他-稍后支付
        checkPayMethod(0);

        //根据状态flag选择支付方式样式：0-刚刚下单样式；1或者其他-稍后支付样式
        function checkPayMethod(flag) {
            if (flag == 0) {
                $('.newly').show();
                $('.recently').hide();
            } else {
                $('.newly').hide();
                $('.recently').show();
            }
            initPayMethod(flag);
        }

        //初始化默认选中的支付方式 0-刚刚下单；1或者其他-稍后支付
        function initPayMethod(flag) {
            if (0 == flag) {
                $('.newly label #wechatPay').prop('checked', true);
            } else {
                $('.recently label #wechatPay').prop('checked', true);
            }
            payMethodCheckBG(flag);//选中支付方式的背景
        }

        // 刚下单时 支付选择方式
        $('.newly label').on('click', function () {
            var _this = $(this);
            _this.children('input').prop('checked', true);
            _this.siblings('label').children('input').prop('checked', false);
            payMethodCheckBG(0);
        });

        //选中支付方式的背景设置 0-刚刚下单；1或者其他-稍后支付
        function payMethodCheckBG(flag) {
            if (flag == 0) {
                var _methods = $('.newly label');
                setBGImg(_methods);
            }
            else {
                var _methods = $('.recently label');
                setBGImg(_methods);
            }
        }

        //遍历input 如果checked为ture，则背景图片为蓝色，否则为灰色
        function setBGImg(_methods) {
            for (var i = 0; i < _methods.length; i++) {
                var _el = $(_methods[i]).children('input');
                if (_el.prop('checked')) {
                    _el.css('background_image', 'url(/res/images/icon_choice.png)');
                } else {
                    _el.css('background_image', 'url(/res/images/icon_unchoice_3x.png)');
                }
            }
        }

    });
</script>
</body>
</html>