var businessParam = {
    // businessType int -1 是 业务类型 1-同城 2-城际 3-出租车 4-大巴线路 5-大巴包车 6-汽车票 7上下班 8 扫码支付 9 旅游线路 10网约车 17-城际网约车 18-同城网约车
    onlineCar : 10,
    busline : 4,
    travel : 9,
    commute : 7,
    busTicket : 6,
    innerCity : 2,
    chartered : 5,
    taxi : 3,
    interCityOnline : 17,
    innerCityOnline : 18
}

var queryUserCoupons = function(recordId, callback){
    var url = SERVER_URL_PREFIX + '/baseOnlineCar/queryUserValidCoupons';
    var data = {
        businessType:businessParam.onlineCar,
        orderNo:$('#orderNo').val(),
        token: $('#token').val()        
    }
    data = genReqData(url, data);
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        dataType:  'json',
        success: function(data){
            if(undefined != data && data.code == 0){
                var couponsArr = data.data;
                if(couponsArr.length > 0){
                    $('#search-coupons .header').show();
                    $('#search-coupons .content').show();
                    $('#noCoupons').hide();
                    var validNum = 0;//有效优惠券数量
                    $.each(couponsArr,function(key,item){
                       var $coupon = null;
                        if(item.isValid == 1){
                            $coupon = $('<li class="coupon color-green" data-recordid="'+item.recordId+'" data-amount="'+item.amount+'" data-type="'+ data.isDiscount +'" data-max="'+ data.discountMaxLimitAmount +'">');
                            validNum++;
                        }else{
                            $coupon = $('<li class="valid-coupon coupon" data-recordid="'+item.recordId+'" data-amount="'+item.amount+'" data-type="'+ data.isDiscount +'" data-max="'+ data.discountMaxLimitAmount +'">');
                        }

                       var  $right = $('<div class="coupon-righ">');
                       var  $left = $('<div  class="coupon-left">');
                        $coupon.append($right);
                        $coupon.append($left);
                        if(item.isValid == 1){
                            $('#search-coupons .content .enable-coupons').append($coupon);
                            var $sale = $('<div class="coupon-sale"><i>￥</i>'+item.amount+'</div>');
                        }else{
                            $('#search-coupons .content .disable-coupons').append($coupon);
                            var $sale = $('<div class="valid-sale"><i>￥</i>'+item.amount+'</div>');
                        }

                        var $title = $('<div class="coupon-title">'+item.name+'</div>');
                        var $limitTime = $('<div class="coupon-time">有效期至'+formatDate(item.endTime)+'</div>');
                        var $mark = '';//$('<div class="coupon-mark">'+item.citys+'</div>');
                        if( typeof item.limitLine != 'undefined' && item.limitLine != undefined){
                            $mark = $('<div class="coupon-mark">'+'仅用于线路：'+item.limitLine+'</div>');
                        }else{
                            $mark = $('<div class="coupon-mark">'+(undefined!=item.citys?('仅用于城市：'+item.citys):"")+'</div>');
                        }

                        clickEvent();
                        resetStringLength($mark);
                        $right.append($title).append($limitTime).append($mark);
                        var $sale = $('<div class="coupon-sale"><i>￥</i>'+item.amount+'</div>');
                        var $des = $('<div class="coupon-des">满'+item.minLimitAmount+'元可使用</div>');
                        $left.append($sale).append($des);

                        //有传优惠券id，判断id是否有效，有效则返回传的id，否则返回第一个且有效的优惠券，否则返回无优惠券,id为0表示不使用优惠券
                        if(recordId == '0'){
                            if(callback){
                                callback({
                                    isValid:0,
                                    recordId:'0'
                                })
                            }
                        }else if(recordId == item.recordId){
                            if(item.isValid == 1){
                                var $choose = $('<div id="chooseItem" class="choose" style="background: url(/res/images/coupons/choose.png) center no-repeat;background-size: 100% 100%"></div>');
                                $coupon.append($choose);
                                if(callback){
                                    callback({
                                        isValid:1,
                                        recordId: item.recordId,
                                        amount: item.amount
                                    })
                                }
                            }else{
                                if(callback){
                                    callback({
                                        isValid:0
                                    })
                                }
                            }
                        } else{
                            if(key == 0){
                                if(item.isValid == 1){
                                    var $choose = $('<div id="chooseItem" class="choose" style="background: url(/res/images/coupons/choose.png) center no-repeat;background-size: 100% 100%"></div>');
                                    $coupon.append($choose);
                                    if(callback){
                                        callback({
                                            isValid:1,
                                            recordId:couponsArr[0].recordId,
                                            amount:couponsArr[0].amount
                                        })
                                    }
                                }else{
                                    if(callback){
                                        callback({
                                            isValid:0
                                        })
                                    }
                                }
                            }
                        }

                    });
                    if(validNum == 0){
                        //全都是不可用优惠券
                        $('#enline').hide();
                        $('#disline').show();
                    }else if(validNum == couponsArr.length){
                        //全都是可用优惠券
                        $('#disline').hide();
                        $('#enline').show();
                    }else{
                        //二者皆有
                        $('#disline').show();
                        $('#enline').show();
                    }
                }else{
                    $('#search-coupons .header').hide();
                    $('#search-coupons .content').hide();
                    $('#btnNotUse').hide();
                    //无优惠券
                    $('#disline').hide();
                    $('#enline').hide();
                    if(callback){
                        callback({
                            isValid:0
                        })
                    }
                    $('#noCoupons').show();
                }
            }
        }
    })
}

/*
 *
 * 优惠券信息显示更多：
 *   获取两行文本可显示的长度，然后截取
 *
 * */
function resetStringLength(obj) {
    //只计算一次
    if(!obj.data('resetStringLength')) {
        //上锁
        obj.data('resetStringLength', true);

        //元素是否显示
        if(obj.css('display') != 'none' && !obj.is(':hidden') && obj.is(':visible')) {
            //存储旧数据
            var objData = {
                width: obj.width(),
                fontSize:  parseFloat(obj.css('font-size').replace('px', '')),
                text: obj.text()
            };

            //获取新长度，并重新填充数据
            var newLength = objData.width / objData.fontSize * 2 - 6;

            //少于两行的长度，则不裁剪
            if(newLength > objData.text.length) {
                return false;
            }

            var __more = $('<span>更多></span>');
            obj.text(objData.text.slice(0, newLength) + '...');
            obj.append(__more);

            //阻止冒泡
            obj.on('click', function (e) {
                e.stopPropagation();
            });

            //查看更多
            __more.on('click', function (e) {
                //阻止冒泡
                e.stopPropagation();

                $.dialog({
                    title: '',
                    text: '',
                    html: '<p style="font-size: 16px; max-height: 300px; overflow-y: auto;">' + objData.text + '</p>',
                    autoClose: false,
                    buttons: [{
                        text: '知道了',
                        onClick: function() {
                            $('.sui-mask').css('z-index', 1000);
                            $.closeDialog();
                        }
                    }]
                });

                $('.sui-mask').css('z-index', 8001);
            });

            return objData;
        } else {
            //解锁
            obj.data('resetStringLength', false);

            setTimeout(function () {
                resetStringLength(obj);
            }, 10);
        }
    }
}


function clickEvent(){
    var href_event = isAndroid()? "tap" : "click";
    $('#couponList  li ').off(href_event).on(href_event,function () {
        $('#couponList').find('#chooseItem').remove();
        var obj = $(this);
        var $choose = $('<div id="chooseItem" class="choose" style="background: url(/res/images/coupons/choose.png) no-repeat;;"></div>');
        $(this).append($choose);

        $('#search-coupons').setPopupData({
            isValid:1,
            recordId : obj.data('recordid'),
            amount : obj.data('amount'),
            isDiscount: obj.data('is-discount'),
            discountMaxLimitAmount: obj.data('max-limit-amount')
        });
        $('#search-coupons').closePopup();
    })

}

//取消添加
$('#btnNotUse').off('click').on('click', function () {
    $('#couponList').find('#chooseItem').remove();
    $('#search-coupons').setPopupData({
        isValid:0,
        recordId:'0'
    });
    $('#search-coupons').closePopup();
});

/***
 * 格式化时间显示
 * @param str 时间毫秒数
 * @returns {string} yyyy-mm-dd
 */
function  formatDate(str) {
    var millisecond = parseFloat(str);
    var date = new Date(millisecond);
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
}