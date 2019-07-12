function getBusinessTypes(pageName) {

    //兼容安卓
    function iAndroid() {
        if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
        if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
        if (/Silk/i.test(navigator.userAgent)) return false;
        if (/Android/i.test(navigator.userAgent)) {
            var s = navigator.userAgent.substr(navigator.userAgent.indexOf('Android') + 8, 3);
            return parseFloat(s[0] + s[3]) < 44 ? false : true
        }
    }

    $.ajax({
        type: 'POST',
        url: '/getBusinessTypes',
        data: {},
        dataType: 'json',
        success: function (data) {
            var orderTitleHtml = '<div class="tab-bar">'
                + '<div class="content">'
                + '<ul>'
                + '<li id="busline" class="" data-tab="1" data-href="/passenger/order-list.html" style="display:none">' + data.data.busTxt + '</li>'
                + '<li id="travel" class="" data-tab="5" data-href="/passenger/travel-order-list.html" style="display:none">' + data.data.travelTxt + '</li>'
                + '<li id="commute" class="" data-tab="6" data-href="/passenger/commute-order-list.html" style="display:none">' + data.data.commuteTxt + '</li>'
                + '<li id="busTicket" class="" data-tab="4"  data-href="/passenger/busTicketOrder.html" style="display:none">' + data.data.busTicketTxt + '</li>'
                + '<li id="isSpot" class="" data-tab="11"  data-href="/passenger/spotOrderList.html" style="display:none">' + data.data.isSpotTxt + '</li>'
                + '<li id="innerCity" class="" data-tab="2" data-href="/passenger/innerCityOrder.html" style="display:none">' + data.data.interCityTxt + '</li>'
                + '<li id="onlineCar" class="" data-tab="1" data-href="/passenger/onlineCarOrderList.html" style="display:none">' + data.data.onlineTxt + '</li>'
                + '<li id="interCityOnline" class="" data-tab="17" data-href="/passenger/interCityOnlineOrderList.html" style="display:none">' + data.data.isInterCityOnlineTxt + '</li>'
                + '<li id="innerCityOnline" class="" data-tab="18" data-href="/passenger/innerCityOnlineOrderList.html" style="display:none">' + data.data.isInnerCityOnlineTxt + '</li>';
            +'</ul>'
            + '</div>'
            + '</div>';
            $('#tabList').html(orderTitleHtml);
            init();

            var data_href_event = iAndroid() ? 'tap' : 'click';

            //tab切换
            $('[data-href]').on(data_href_event, function () {
                var self = $(this);
                //绑定点击链接事件
                window.location.href = self.data('href');
            });

            var urlList = [];
            var activityFlag = false;
            if (data.data.hasBus == 1) {
                if (data.data.busTxt == undefined) {
                    $('#busline').html('定制班线');
                }
                $('#busline').show()
                urlList.push('busline');
            }

            if (data.data.isSpot == 1) {
                if (data.data.isSpotTxt == undefined) {
                    $('#isSpot').html('景区门票');
                }
                $('#isSpot').show()
                urlList.push('isSpot');
            }

            if (data.data.hasTravel == 1) {
                if (data.data.travelTxt == undefined) {
                    $('#travel').html('旅游专线');
                }
                $('#travel').show()
                urlList.push('travel');
            }

            if (data.data.hasCommute == 1) {
                if (data.data.commuteTxt == undefined) {
                    $('#commute').html('上下班');
                }
                $('#commute').show()
                urlList.push('commute');
            }


            if (data.data.hasInterCity == 1) {
                if (data.data.interCityTxt == undefined) {
                    $('#innerCity').html('城际约租车');
                }
                $('#innerCity').show();
                urlList.push('innerCity');
            }
            if (data.data.hasTaxi == 1) {
                $('#taxi').show()
                urlList.push('taxi');
            }
            if (data.data.hasBusTicket == 1) {
                if (data.data.busTicketTxt == undefined) {
                    $('#busTicket').html('汽车票');
                }
                $('#busTicket').show()
                urlList.push('busTicket');
            }
            if (data.data.hasOnline == 1) {
                if (data.data.onlineTxt == undefined) {
                    $('#onlineCar').html('网约车');
                }
                $('#onlineCar').show()
                urlList.push('onlineCar');
            }
            if (data.data.hasInterCityOnline == 1) {
                if (data.data.isInterCityOnlineTxt == undefined) {
                    $('#interCityOnline').html('城际网约车');
                }
                $('#interCityOnline').show()
                urlList.push('interCityOnline');
            }
            if (data.data.hasInnerCityOnline == 1) {
                if (data.data.isInnerCityOnlineTxt == undefined) {
                    $('#innerCityOnline').html('同城网约车');
                }
                $('#innerCityOnline').show()
                urlList.push('innerCityOnline');
            }

            if (data.data.num <= 1) {
                $('.active').removeClass('active');
            }
            for (var i = 0; i < urlList.length; i++) {
                if (pageName == urlList[i]) {
                    activityFlag = true;
                    break;
                }
            }
            if (activityFlag) {
                var self = $('#' + pageName);
                self.attr('class', 'active');
                under(self);
            } else {
                var self = $('#' + urlList[0]);
                //绑定点击链接事件
                window.location.href = self.data('href');
            }
        }
    });
}

//under
function under(self) {
    var under = $('.tab .under');
    var auto = setInterval(function () {
        if (self.width() > 0) {
            clearInterval(auto);
            //滚动插件
            var dateScroll = new IScroll('.tab-bar', {
                scrollX: true,
                scrollY: false,
                mouseWheel: true
            });
            self.addClass('active').siblings().removeClass('active');
            dateScroll.scrollToElement(self[0], 500, true, true, IScroll.utils.ease.circular);

            //取缓存 - 宽度
            if (localStorage.getItem('under-width')) {
                under.width(under_w);
            } else {
                under.width(under_w);
            }

            //设置尺寸
            var w = self.width(),
                fsize = parseFloat($('html').css('font-size'));
            var under_w = w / fsize * 0.9 + 'rem';
            under.width(under_w);

            //设置缓存 - 宽度
            localStorage.setItem('under-width', under_w);

            //取缓存 - 定位
            if (localStorage.getItem('under-left')) {
                under.css('left', localStorage.getItem('under-left'));
            } else {
                under.css('left', 0);
            }
            //定位
            var surplus = w * 0.1 / fsize / 2;
            surplus += self.position().left / fsize;
            surplus += 'rem';

            under.css('left', surplus);

            //设置缓存 - 宽度
            localStorage.setItem('under-left', surplus);
        }
    }, 600);
}

function init() {
    var $tab = $('.tab');

    //under
    $tab.find('.tab-bar .content').append('<div class="under"></div>');

    //tab的active
    $tab.find('ul li.active').click();
}
