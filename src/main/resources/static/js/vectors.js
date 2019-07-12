(function (_) {
    /*
    * 兼容localStorage
    * */
    if (!_.localStorage) {
        Object.defineProperty(_, "localStorage", new (function () {
            var aKeys = [], oStorage = {};
            Object.defineProperty(oStorage, "getItem", {
                value: function (sKey) { return sKey ? this[sKey] : null; },
                writable: false,
                configurable: false,
                enumerable: false
            });
            Object.defineProperty(oStorage, "key", {
                value: function (nKeyId) { return aKeys[nKeyId]; },
                writable: false,
                configurable: false,
                enumerable: false
            });
            Object.defineProperty(oStorage, "setItem", {
                value: function (sKey, sValue) {
                    if(!sKey) { return; }
                    document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
                },
                writable: false,
                configurable: false,
                enumerable: false
            });
            Object.defineProperty(oStorage, "length", {
                get: function () { return aKeys.length; },
                configurable: false,
                enumerable: false
            });
            Object.defineProperty(oStorage, "removeItem", {
                value: function (sKey) {
                    if(!sKey) { return; }
                    document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                },
                writable: false,
                configurable: false,
                enumerable: false
            });
            this.get = function () {
                var iThisIndx;
                for (var sKey in oStorage) {
                    iThisIndx = aKeys.indexOf(sKey);
                    if (iThisIndx === -1) { oStorage.setItem(sKey, oStorage[sKey]); }
                    else { aKeys.splice(iThisIndx, 1); }
                    delete oStorage[sKey];
                }
                for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) { oStorage.removeItem(aKeys[0]); }
                for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
                    aCouple = aCouples[nIdx].split(/\s*=\s*/);
                    if (aCouple.length > 1) {
                        oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
                        aKeys.push(iKey);
                    }
                }
                return oStorage;
            };
            this.configurable = false;
            this.enumerable = true;
        })());
    }

    /*
    * 是否安卓
    * */
    _.isAndroid = function() {
        if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
        if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
        if (/Silk/i.test(navigator.userAgent)) return false;
        if (/Android/i.test(navigator.userAgent)) {
            var s = navigator.userAgent.substr(navigator.userAgent.indexOf('Android') + 8, 3);
            return parseFloat(s[0] + s[3]) < 44 ? false : true;
        }
        //return true;
    }

    /*
    * ie浏览器的版本
    * */
    _.ieVersion = function() {
        var userAgent = navigator.userAgent;    //取得浏览器的userAgent字符串
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;  //判断是否IE<11浏览器
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE;   //判断是否IE的Edge浏览器
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;

        if(isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);

            if(fIEVersion == 7) {
                return 7;
            } else if(fIEVersion == 8) {
                return 8;
            } else if(fIEVersion == 9) {
                return 9;
            } else if(fIEVersion == 10) {
                return 10;
            } else {
                return 6;   //IE版本<=7
            }
        } else if(isEdge) {
            return 'edge';  //edge
        } else if(isIE11) {
            return 11;  //IE11
        } else {
            return -1;  //不是ie浏览器
        }
    }

    /*
    * 是否为手机号码
    * */
    _.isPoneAvailable = function (pone) {
        var reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        return reg.test(pone);
    }

    /*
    * 是否为电话号码
    * */
    _.isTelAvailable = function (tel) {
        var reg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
        return reg.test(tel);
    }

    /*
    * 是否为身份证
    * */
    _.isCardNo = function (card) {
        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return reg.test(card);
    }


}(window));

(function (win) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var ratio = window.devicePixelRatio || 1
    var tid;

    //初始化
    function init() {
        //设置root字体尺寸
        var size = 12

        switch (ratio) {
            case 3:
                size = docEl.clientWidth / (750 / 98)
                break
            default:
                size = docEl.clientWidth / (750 / 100)
        }

        docEl.style.fontSize = size + 'px';
    }

    //非16:9的分辨率 - 调用初始化
    var w = win.screen.width,
        h = win.screen.height;

    if(parseFloat(h / w).toFixed(2) !== parseFloat(16 / 9).toFixed(2) || ratio !== 2) {
        init();
    }

    //屏幕尺寸变化
    win.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(init, 300);
    }, false);
}(window));

(function ($) {
    $(function() {
        // 自动加链接
        var href_event = isAndroid() ? 'tap' : 'click';
        $('[data-href]').on(href_event, function() {
            location.href = $(this).data('href');
        });
    });

    $.fn.prevAll = function(selector){
        var prevEls = [];
        var el = this[0];
        if(!el) return $([]);
        while (el.previousElementSibling) {
            var prev = el.previousElementSibling;
            if (selector) {
                if($(prev).is(selector)) prevEls.push(prev);
            }
            else prevEls.push(prev);
            el = prev;
        }
        return $(prevEls);
    };

    $.fn.nextAll = function (selector) {
        var nextEls = [];
        var el = this[0];
        if (!el) return $([]);
        while (el.nextElementSibling) {
            var next = el.nextElementSibling;
            if (selector) {
                if($(next).is(selector)) nextEls.push(next);
            }
            else nextEls.push(next);
            el = next;
        }
        return $(nextEls);
    };

}(Zepto));

(function ($) {
    //header初始化
    $.headerInit = function() {
        /*
        * header的icon初始化动画效果
        * */
        (function iconInit() {
            //滚动插件
            var dateScroll = new IScroll('.list-bar', {
                scrollX: true,
                scrollY: false,
                mouseWheel: true
            });

            //header-icon 位置初始化-启用缓存
            if($('.header .nav li.active').length != 1) {
                $('.header .nav li').eq(0).addClass('active').siblings().removeClass('active');
            }
            var active_li = $('.header .nav li.active');

            var active_icon = active_li.parent().siblings('i.icon');

            var left = 0;
            if(localStorage.getItem('header-icon-left')) {
                left = parseFloat(localStorage.getItem('header-icon-left'));
            }

            //初设
            active_icon.css({
                display: 'block',
                left: $.unit(left, 'rem')
            });

            //重置left
            var icon_type = active_li.data('icon');
            var self_left = parseFloat(active_li.position().left),
                self_width = parseFloat(active_li.width());
            left = self_left + self_width / 2 - 4;
            /*active_icon.css({
                display: 'block',
                left: $.unit(left, 'rem')
            });*/

            //第一项
            if(active_li.index() == 0) {
                var first_left = self_left;
                var icon_w = parseFloat(active_icon.width());

                if(icon_w > self_width) {
                    //图标宽度大于菜单宽度
                    first_left -= (icon_w - self_width) / 2;
                } else if(icon_w < self_width) {
                    //图标宽度小于菜单宽度
                    first_left += (self_width - icon_w) / 2;
                }

                left = first_left;
            }

            var host = window.location.host;
            //后台或者线上环境
            var img_src = '/res/images/common/header/icon-' + icon_type + '.png';
            if(host.search(new RegExp('localhost', 'gi')) != -1 || host.search(new RegExp('127.0.0.1', 'gi')) != -1) {
                //本地开发环境
                img_src = '../../dist/images/common/header/icon-' + icon_type + '.png';
            }

            var img = new Image();

            if(img.complete) {
                //已加载过，读取缓存时
                imgLoadCallback();
            } else {
                img.addEventListener('load', function() {
                    imgLoadCallback();
                }, false);
            }

            img.src = img_src;

            //图片加载回调
            function imgLoadCallback() {
                active_icon.attr('class', 'icon icon-' + icon_type).css({
                    left: $.unit(left, 'rem')
                });

                dateScroll.scrollToElement(active_li[0], 500, true, true, IScroll.utils.ease.circular);

                //设置缓存
                localStorage.setItem('header-icon-left', left);
            }

            //重置header的list尺寸
            var list = $('.header .list'),
                list_w = list.width();

            //如果预设宽度超过总长度，则重置
            if(getChildWidth(list) > list_w) {
                list.children().css({
                    'padding-left': 0,
                    'padding-right': 0,
                });

                setTimeout(function () {
                    var pd = (list_w - getChildWidth(list)) / (list.children().length + 1) / 2 / parseFloat($('html').css('font-size')) + 'rem';

                    list.children().css({
                        'padding-left': pd,
                        'padding-right': pd
                    });
                }, 10);
            }

            //获取子元素总宽度
            function getChildWidth(obj) {
                var w = 0;

                obj.children().each(function () {
                    var self = $(this);
                    w += parseFloat(self.width()) + parseFloat(self.css('margin-left')) + parseFloat(self.css('margin-right'));
                });

                return w;
            }
        }());

        // 菜单跳转 (菜单动画消失后再跳转)
        $('#sideMenu [data-url]').on('click', function() {
            var url = $(this).data('url');
            $('#sideMenu').closePopup(function() {
                location.href = url;
            });
        });

        // 展开侧边栏菜单
        $('#menuArmrest').on('click', function() {
            $('#sideMenu').popup('menu');
            menuAdjust();
        });

        /*
        * 调整侧边栏菜单
        *   如果内容高度大于屏幕高度，则可以滚动
        *   小于，则完整显示
        * */
        function menuAdjust() {
            var h = $(window).height();
            var $parent = $('#sideMenu'),
                $list = $parent.find('.sui-list');
            var list_margin = parseFloat($list.css('margin-top')) + parseFloat($list.css('margin-bottom'));
            var head_foot = $parent.find('.head').height() + $parent.find('.foot').height()
            var parentW = head_foot + $list.height() + list_margin;

            if(h < parentW) {
                //计算新尺寸
                var MAX_H = h - head_foot
                    - list_margin;
                $list.css('max-height', MAX_H / parseFloat($('html').css('font-size')) + 'rem');

                //处理滑动事件
                var BODY_Overflow_Y = $('body').css('overflow-y'),
                    BODY_MAX_H = $('body').css('max-height');
                $list.on('touchstart', function (e) {
                    e.stopPropagation();
                }).on('touchmove', function (e) {
                    e.stopPropagation();
                    $('body').css({
                        'overflow-y': 'hidden',
                        'max-height': h + 'px'
                    });
                }).on('touchend', function () {
                    $('body').css({
                        'overflow-y': BODY_Overflow_Y,
                        'max-height': BODY_MAX_H
                    });
                });
            }
        }

    }

    /*******
     * param{
     * url, data, success, cache, alone, async, type, dataType, error
     * }
     * ********/
    $.ajaxService = function(param) {
        var type = param.type || 'post';//请求类型
        var dataType = param.dataType || 'json';//接收数据类型
        var async = param.async || true;//异步请求
        var alone = param.alone || false;//独立提交（一次有效的提交）
        var cache = param.cache || false;//浏览器历史缓存
        var ajaxStatus = param.ajaxStatus || true;
        var success = param.success || function (data) {
            $.hideLoading();
            if(data.status){//服务器处理成功
                setTimeout(function () {
                    if(data.url){
                        location.replace(data.url);
                    }else{
                        location.reload(true);
                    }
                },1500);
            }else{//服务器处理失败
                if(alone){//改变ajax提交状态
                    ajaxStatus = true;
                }
            }
        };
        var error = param.error || function (data) {
            /*data.status;//错误状态吗*/
            $.hideLoading();
            setTimeout(function () {
                if(data.status == 404){
                    $.alert('请求失败，请求未找到['+data.status+']');
                }else if(data.status == 400){
                    $.alert('请求失败，服务器内部错误['+data.status+']');
                }else if(data.status == 503){
                    $.alert('请求失败，服务器内部错误['+data.status+']');
                }else if(data.status == 500){
                    $.alert('请求失败，服务器异常['+data.status+']');
                }else {
                    $.alert('请求失败,网络连接超时['+data.status+']');
                }
                ajaxStatus = true;
            },500);
        };
        /*判断是否可以发送请求*/
        if(!ajaxStatus){
            return false;
        }
        ajaxStatus = false;//禁用ajax请求
        /*正常情况下1秒后可以再次多个异步请求，为true时只可以有一次有效请求（例如添加数据）*/
        if(!alone){
            setTimeout(function () {
                ajaxStatus = true;
            },1000);
        }
        $.ajax({
            'url': param.url,
            'data': param.data,
            'type': type,
            'dataType': dataType,
            'async': async,
            'success': success,
            'error': error,
            'jsonpCallback': 'jsonp' + (new Date()).valueOf().toString().substr(-4),
            'beforeSend': function () {
                // $.showLoading('加载中');
            },
        });
    }
}(Zepto));

(function ($) {
    //获取元素高度
    $.getHeight = function (el, callbackType) {
        var result = 0;
        var clone = el.clone(true);

        clone.css({
            'display': 'block',
            'position': 'absolute',
            'z-index': -9999
        });

        el.after(clone);
        result = clone.height();

        //盒子类型
        if(clone.css('box-sizing') == 'border-box') {
            var padding_top = parseFloat(clone.css('padding-top')),
                padding_bottom = parseFloat(clone.css('padding-bottom'));

            result -= padding_top + padding_bottom;
        }

        clone.remove();

        //返回类型
        result = $.unit(result, callbackType);

        return result;
    }

    //rem | px
    $.unit = function(value, type) {
        var result = value;

        if(type == 'rem') {
            result = result / parseFloat($('html').css('font-size')) + 'rem';
        } else {
            result += 'px';
        }

        return result;
    }
}(Zepto));

(function ($, _) {
    //default
    var DEFAULT = {
        cancel: '.cancel',
        event: 'click'
    }

    //存储
    var stateArr = [];

    //手机返回键控制
    $.fn.backtrack = function (config) {
        if(typeof config == 'object') {
            config = $.extend({}, DEFAULT, config);
        } else {
            config = $.extend({}, DEFAULT);
        }

        return this.each(function () {
            /*
            * config type is object
            *
            *   param
            *       cancel：关闭元素名称，event：触发事件
            *       config = { cancel: "el", event: "click" }
            *
            * */
            if (_.history && _.history.pushState && _.history.replaceState) {
                var self = $(this);
                var H = _.history,
                    L = _.location;

                //打开
                self.on(config.event + '.backtrack', function () {
                    //close backtrack
                    $('body').data('backtrack', false);

                    //add state
                    var zid = self[0]._zid;
                    H.pushState({page: zid}, 'page ' + zid, L.href);

                    //bind cancel
                    $(config.cancel).one(config.event + '.backtrack', function () {
                        //remove current state
                        for(var i = 0; i < stateArr.length; i++) {
                            if(stateArr[i].cancel == config.cancel && stateArr[i].event == config.event) {
                                stateArr.splice(i, 1);
                                H.replaceState(null, 'page ' + zid, L.href);

                                if(stateArr.length == 0) {
                                    //open backtrack
                                    $('body').data('backtrack', true);
                                }
                            }
                        }
                    });

                    //重复不添加
                    for(var i = 0; i < stateArr.length; i++) {
                        if(stateArr[i].cancel == config.cancel && stateArr[i].event == config.event) {
                            return;
                        }
                    }

                    stateArr.push({cancel: config.cancel, event: config.event});
                });

                return this;
            } else {
                throw "该浏览器不支持此功能，请更新浏览器。"
            }
        });
    };

    //点击浏览器的返回键
    $(window).on('popstate', function () {
        if(!$('body').data('backtrack')) {
            var len = stateArr.length;
            if(len > 0) {
                //关闭
                var last = stateArr[len - 1];
                $(last.cancel).triggerHandler(last.event);

                stateArr.length = len - 1;
            }
        } else {
            _.history.go(-1);
        }
    });
}(Zepto, window));

(function (_, $) {
    /*
    * 规则：弹窗和绑定事件
    * */
    $.ruleInit = function () {
        // 绑定滚动条
        var _ruleIScroll;

        _.ruleScroll = function(rule) {
            if(_ruleIScroll) {
                _ruleIScroll.destroy();
            }

            setTimeout(function() {
                /*
                * 设置bar的最大高度
                * */
                var bar = $(rule).find('.rule-bar'),
                    close = bar.siblings('.close-popup');

                bar.css({
                    'max-height': $(window).height() - parseFloat(close.height()) - parseFloat(bar.siblings('h1').height()),
                    'overflow': 'hidden'
                });

                _ruleIScroll = new IScroll(rule + ' .rule-bar', {
                    click: isAndroid(),
                    scrollX: false,
                    scrollY: true,
                    mouseWheel: true
                });
            }, 300);
        };

        //规则
        var rule_event = isAndroid() ? 'tap' : 'click';

        $('[data-trigger-rule]').on(rule_event, function(e) {
            e.stopPropagation();

            var self = $(this),
                dataRule = self.data('trigger-rule'),
                triggerRule = $(dataRule),
                cancel = triggerRule.find('.cancel');

            //打开
            triggerRule.popup('modal', function () {
                ruleScroll(dataRule);
            });

            //关闭
            cancel.on(rule_event, function () {
                triggerRule.closePopup();
            });
        }).backtrack();
    }

}(window, Zepto));

(function(){
    if(typeof WeixinJSBridge=="object"&& typeof WeixinJSBridge.invoke == "function"){
        handleFontSize();
    }else{
        if(document.addEventListener){
            document.addEventListener("WeixinJSBridgeReady",handleFontSize,false);
        }else if(document.attachEvent){
            document.attachEvent("WeixinJSBridgeReady",handleFontSize);
            document.attachEvent("onWeixinJSBridgeReady",handleFontSize);
        }
    };
    function handleFontSize(){
        WeixinJSBridge.invoke("setFontSizeCallback",{
            "fontSize":0
        });
        WeixinJSBridge.on("menu:setfont",function(){
            WeixinJSBridge.invoke("setFontSizeCallback",{
                "fontSize":0
            });
        });
    };

})();
