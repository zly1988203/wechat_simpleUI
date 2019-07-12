var commentstatus = 1;
var order_status = '-1';
var tripStatus = '-1'
var recordId=getQueryString("recordId");
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 匹配目标参数
    var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
    if (result != null) {
        return decodeURIComponent(result[2]);
    } else {
        return null;
    }
}

var driverInfo = {
    contactPhone:$('#contactPhone').val(),
    orderNo:$('#orderNo').val(),
    settleType:$('#settleType').val()
}


 /*
     * 参数说明：
     * s：要格式化的数字
     * n：保留几位小数
     * */
function formatMoney(s, n) {
 
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}


$(function() {
    backtoUrl('/passenger/onlineCarOrderList.html');
    
    var params = {
	        'orderNo' : driverInfo.orderNo,
	        'token' : $.cookie('token')
	   }
    $.showLoading();
	$.post("/onlinecarOrder/queryOrderdetail",params,function(data){
        if(data.code!='0'){//请求不成功的页面
            $.alert(data.msg);
            return;
        }
        var detailData=data.data;
        //处理是是否跳转支付中心
        var providerId = detailData.providerId;
        var sellProviderId = detailData.sellProviderId == null ? providerId : detailData.sellProviderId;
        var settleType = $('#settleType').val();
        if(providerId != sellProviderId){
            settleType = 0;
        }

        var departLng = detailData.departLng;//起点经度
        var departLat = detailData.departLat;//起点纬度

        var arriveLng = detailData.arriveLng;//抵达经度
        var arriveLat = detailData.arriveLat;//抵达纬度
        
        AMapUI.loadUI(['overlay/SimpleMarker'], function (SimpleMarker) {
            initMap(SimpleMarker)
        });
        
        function initMap(SimpleMarker) {
            var map = new AMap.Map('allmap', {
                resizeEnable: true,
                zoom: 15,
                center: [departLng,departLat]
            });

            var startmarker = new AMap.Marker({
                icon: new AMap.Icon({
                    size: new AMap.Size(25, 36),
                    imageSize: new AMap.Size(25, 36),
                    image: '/res/images/rent/icon_marker.png'
                }),
                position: [departLng, departLat]
            });
            startmarker.setMap(map);

            var endmarker = new AMap.Marker({
                icon: new AMap.Icon({
                    size: new AMap.Size(25, 36),
                    imageSize: new AMap.Size(25, 36),
                    image: '/res/images/rent/icon_marker_end.png'
                }),
                position: [arriveLng, arriveLat]
            });

            endmarker.setMap(map);
        }
        
        var calAdjustPrice = function(detailData){
        	var tempPrice = 0;
        	if (detailData.priceAdjustType == 0){
        		tempPrice = detailData.price;
/*        		if (tempPrice > 0){
        			return tempPrice;
        		}*/
        	}
        	else{
        		tempPrice = detailData.priceAdjustValue;;
        	}
        	return tempPrice;
        }
      
        var timeStr=new Date(detailData.departTime).format("yyyy-MM-dd hh:mm");
        var payTime = new Date(detailData.payTime).format("yyyy-MM-dd hh:mm");

        var   station_html =  '<div class="time">'+timeStr+'</div>' +
            '<span class="start">'+detailData.departTitle+'</span>'+
            '<span class="end">'+detailData.arriveTitle+'</span>'+
            '<div class="oldprice">';
        if (detailData.calculateType == 1){
        	station_html += '<div>金额</div>';
        }
        else{
        	station_html += '<div>一口价</div>';
        }
        
        station_html += '<div class="order-price">'+calAdjustPrice(detailData)+'元</div> </div>'+
            '<div id="couponTxt" class="saleprice"><input id="recordId" type="hidden" value="">' +
            '<input id="amount" type="hidden" value=""><input id="oldPrice" type="hidden" value="">'+
            '<div>优惠券</div><div id="amountTxt" class="sale-price" data-clickable="true"><label></label> &nbsp;&gt; </div></div>';
        $(".station").html(station_html);
        $('#oldPrice').val(calAdjustPrice(detailData));
        couponClickEvent();

        //status` tinyint(4) unsigned NOT NULL DEFAULT '1' COMMENT ' 1-待执行 2-后付费业务进行中（后付费业务有此状态：同城出行、出租车) 3-待支付（预付费业务：城际约车，跳过“2-进行中”直接到此状态）4-已支付 5-预付费业务进行中（预付费业务完成“4-已支付”后有此状态：城际约车)6-已完成7-已取消 8-已关闭',
        var paystatus=detailData.status;
        //`driver_comment_status` tinyint(2) unsigned NOT NULL DEFAULT '1' COMMENT '评价状态 1 待评价 2 已评价',
        commentstatus=detailData.userCommentStatus;
        // `trip_status` tinyint(4) unsigned DEFAULT '1' COMMENT '行程状态 1-发起行程  2-等待接单  3-待执行 4-去接乘客 5-到达出发地 6-接到乘客，去往目的地  7-到达目的地 8-已完成 9-已取消  10:发起收款',
        tripStatus=detailData.tripStatus;
        // `cancel_type` tinyint(4) unsigned DEFAULT '1' COMMENT '1 未取消 2 乘客取消 3 司机取消 4 车企取消 5 超时取消 6 未支付取消',
        var cancelType=detailData.cancelType;
        /* 动态生成订单详情 */  //3
        order_status = '-1';
        if(paystatus=='3' || paystatus=='2'||paystatus=='1'){//0-未支付
            order_status='0'
        }else if((paystatus=='4'||paystatus=='6')&&commentstatus=='1'){
            order_status='1'
        }else if((paystatus=='4'||paystatus=='6')&&commentstatus=='2'){
            order_status='2'
        }else if((paystatus=='7' || paystatus=='8')&&cancelType=='2'){
            order_status='3'
        }else if((paystatus=='7' || paystatus=='8') &&cancelType=='3'){
            order_status='4'
        }else if((paystatus=='7' || paystatus=='8') &&cancelType=='4'){
            order_status='5'
        }else if((paystatus=='7' || paystatus=='8') && (cancelType=='5'||cancelType=='6')){
            order_status='6'
        }

        // var order_status = '1';//订单状态 0-未支付，1-已支付未评价，2-已支付已评价，3-乘客取消订单，4-司机取消订单
        var _html = '';
        var totalPrice = 0;
        if(order_status == 0){       	
        	totalPrice = formatMoney(calAdjustPrice(detailData),2);
        	$('#oldPrice').val(totalPrice);
            _html += '<div class="pay-wait">待支付&emsp;<label>'+totalPrice+'</label>元</div>' +
                '<div class="btn primary pay-btn">微信支付</div>' +
                '<div class="tips">请及时支付以免影响下次行程</div>';
            $('.payment-content').html(_html);
            var selectedCoupon = JSON.parse(window.localStorage.getItem('selectedCoupon'));
            //检查优惠券用户是否为当前用户，如果不是当前用，则需要重置
            if(undefined != selectedCoupon){
                var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
            	if (selectedCoupon.userId!=userInfo.id) {
            		selectedCoupon = undefined;
                    window.localStorage.removeItem("selectedCoupon");
            	}
            }
            if(undefined != selectedCoupon){
                if(selectedCoupon.isValid == 1){
                    $('#recordId').val(selectedCoupon.recordId);
                    var oldPrice = $('#oldPrice').val();

                    // 0--固定金额  1--折扣
                    var isDiscount = selectedCoupon.isDiscount;
                    if(isDiscount == '0'){
                        $('#amount').val(selectedCoupon.amount);
                        var result = parseFloat(oldPrice) - parseFloat(selectedCoupon.amount);
                        if(result >= 0){
                            $('#amountTxt label').html('-'+selectedCoupon.amount+'元');
                            var newPrice = parseFloat(oldPrice) - parseFloat(selectedCoupon.amount);
                            newPrice = formatMoney(newPrice,2);
                            $('.pay-wait label').html(newPrice);
                        }else {
                            $('#amountTxt label').html('-'+oldPrice+'元');
                            $('.pay-wait label').html(0);
                        }
                    }else if(isDiscount == '1'){
                        var discountMaxLimitAmount = selectedCoupon.discountMaxLimitAmount;//最大抵扣金额
                        var newPrice = parseFloat(oldPrice)*100*selectedCoupon.amount*10/10000;//折扣后支付金额
                        newPrice = formatMoney(newPrice);
                        var discountVal = parseFloat(oldPrice) - parseFloat(newPrice);//折扣券抵扣金额
                        if(discountVal >= discountMaxLimitAmount){
                            newPrice = parseFloat(oldPrice) - parseFloat(discountMaxLimitAmount);
                            discountVal = discountMaxLimitAmount;
                        }
                        $('#amountTxt label').html('-'+formatMoney(discountVal,2)+'元')
                        $('.pay-wait label').html(formatMoney(newPrice,2));
                    }
                }else {
                    if(selectedCoupon.recordId == 0){//不使用优惠券
                        $('#recordId').val(0);
                        $('#amount').val('');
                        $('#amountTxt').html('不使用券&nbsp;&gt;');
                        $('#newPrice b').html($('#oldPrice').val());

                        //行程中支付不使用优惠券
                        if(tripStatus<7){
                            $('#couponTxt').css('display','none');
                            $('#amountTxt').data('clickable',false);
                            $('#couponTxt').removeClass('saleprice').addClass('saleprice2');
                            payConfirm(providerId,sellProviderId);
                        }
                    }else{
                        if(tripStatus<7){
                            $('#couponTxt').css('display','none');
                            payConfirm(providerId,sellProviderId);
                        }

                        $('#couponTxt').removeClass('saleprice').addClass('saleprice2');
                        $('#recordId').val('');
                        $('#amount').val('');
                        $('#amountTxt').html('无可用券')
                    }
                }
            }else{
                var param = {
                    businessType:'onlineCar',
                    orderNo:driverInfo.orderNo
                }
                queryHasCoupons(param,function (data) {
                    if(data.isValid == 1){
                        $('#recordId').val(data.recordId);
                        $('#amount').val(data.amount);
                        var oldPrice = $('#oldPrice').val();
                        //0--固定金额  1--折扣
                        var isDiscount = data.isDiscount;
                        if(isDiscount == '0'){
                            var result = parseFloat(oldPrice) - parseFloat(data.amount);
                            if( result>= 0){
                                $('#amountTxt label').html('-'+data.amount+'元')
                                var newPrice = parseFloat(oldPrice) - parseFloat(data.amount);
                                newPrice = formatMoney(newPrice,2);
                                $('.pay-wait label').html(newPrice);
                            }else {
                                $('#amountTxt label').html('-'+oldPrice+'元')
                                $('.pay-wait label').html(0);
                            }
                        }else if(isDiscount=='1'){
                            var discountMaxLimitAmount = data.discountMaxLimitAmount;//最大抵扣金额
                            var newPrice = parseFloat(oldPrice)*100*data.amount*10/10000;//折扣后金额
                            newPrice = formatMoney(newPrice);
                            var discountVal = parseFloat(oldPrice) - parseFloat(newPrice);//折扣券抵扣金额
                            if(discountVal >= discountMaxLimitAmount){
                                newPrice = parseFloat(oldPrice) - parseFloat(discountMaxLimitAmount);
                                discountVal = discountMaxLimitAmount;
                            }
                            $('#amountTxt label').html('-'+formatMoney(discountVal,2)+'元')
                            $('.pay-wait label').html(formatMoney(newPrice,2));
                        }


                        //行程中支付
                        // if(tripStatus<7){
                        //     if(null!=recordId && recordId!='' && data.recordId == recordId){
                        //         $('#amountTxt').data('clickable',false);
                        //         $('#couponTxt').removeClass('saleprice').addClass('saleprice2');
                        //         payConfirm(providerId,sellProviderId);
                        //     }else{
                        //         $('#amountTxt').data('clickable',true);
                        //     }
                        // }

                    }else {
                        if(data.recordId == '0'){//不使用优惠券
                            $('#recordId').val(0);
                            $('#amount').val('');
                            $('#amountTxt').html('不使用券&nbsp;&gt;');
                            $('#newPrice b').html($('#oldPrice').val());

                            //行程中支付不使用优惠券
                            // if(tripStatus<7){
                            //     $('#couponTxt').css('display','none');
                            //     $('#amountTxt').data('clickable',false);
                            //     $('#couponTxt').removeClass('saleprice').addClass('saleprice2');
                            //     payConfirm(providerId,sellProviderId);
                            // }

                        }else{
                            // if(tripStatus<7){
                            //     $('#couponTxt').css('display','none');
                            //     payConfirm(providerId,sellProviderId);
                            // }

                            $('#couponTxt').removeClass('saleprice').addClass('saleprice2');
                            $('#recordId').val('');
                            $('#amount').val('');
                            $('#amountTxt').html('无可用券')
                        }
                    }
                });
            }
        }
        else if(order_status == 1){
            window.localStorage.removeItem("selectedCoupon");
            $('.oldprice').hide();
            $('#couponTxt').hide();
            var couponMoney = detailData.couponMoney;
            var oldPrice = $('#oldPrice').val();
            if(parseFloat(couponMoney) > parseFloat(oldPrice)){
                couponMoney = oldPrice;
            }
            _html += '<div class="time">'+payTime+'</div>' +
                '<div class="price">已支付&emsp;'+detailData.payPrice+'元</div>' +
                '<div class="oldprice2">';
            if (detailData.calculateType == 1){
            	_html += '<div style="width: 50%">金额</div>';
            }
            else{
            	_html += '<div style="width: 50%">一口价</div>';
            }               
            _html += '<div style="width: 50%">'+calAdjustPrice(detailData)+'元</div> </div>'+
                '<div class="saleprice2">' +
                '<div style="width: 50%">优惠券</div>' +
                '<div style="width: 50%">-'+couponMoney+'元 </div></div>'+
                '<div class="evaluate-btn evaluate-wait">去评价</div>';
            $('.payment-content').html(_html);
        }
        else if(order_status == 2){
            window.localStorage.removeItem("selectedCoupon");
            $('.oldprice').hide();
            $('#couponTxt').hide();
            var couponMoney = detailData.couponMoney;
            var oldPrice = $('#oldPrice').val();
            if(parseFloat(couponMoney) > parseFloat(oldPrice)){
                couponMoney = oldPrice;
            }
            _html += '<div class="time">'+payTime+'</div>' +
                '<div class="price">已支付&emsp;'+detailData.payPrice+'元</div>' +
                '<div class="oldprice2" style="width: 100%">';
            if (detailData.calculateType == 1){
            	_html += '<div style="width: 50%">金额</div>';
            }
            else{
            	_html += '<div style="width: 50%">一口价</div>';
            }               
            _html += '<div style="width: 50%">'+calAdjustPrice(detailData)+'元</div></div>'+
                '<div class="saleprice2">' +
                '<div style="width: 50%">优惠券</div>' +
                '<div style="width: 50%">-'+couponMoney+'元 </div></div>'+
                '<div class="evaluate-btn evaluated">查看评论</div>';
            $('.payment-content').html(_html);
        } else if(order_status == 3){
            window.localStorage.removeItem("selectedCoupon");
            _html += '<div class="time">'+detailData.cancelTimeStr+'</div>' +
                '<div class="cancel">已被您取消该次行程</div>'
            $('.payment-content').html(_html);
        } else if(order_status == 4){
            window.localStorage.removeItem("selectedCoupon");
            _html += '<div class="time">'+detailData.cancelTimeStr+'</div>' +
                '<div class="cancel">已被司机取消该次行程</div>'
            $('.payment-content').html(_html);
        } else if(order_status == 5){
            window.localStorage.removeItem("selectedCoupon");
            _html += '<div class="time">'+detailData.cancelTimeStr+'</div>' +
                '<div class="cancel">已被客服取消该次行程</div>'
            $('.payment-content').html(_html);
        } else if(order_status == 6){
            window.localStorage.removeItem("selectedCoupon");
            _html += '<div class="time">'+detailData.cancelTimeStr+'</div>' +
                '<div class="cancel">行程超时取消</div>'
            $('.payment-content').html(_html);
        } else{
            window.localStorage.removeItem("selectedCoupon");
            _html += '<div class="time">'+timeStr+'</div>' +
                '<div class="cancel">状态未知</div>'
            $('.payment-content').html(_html);
        }

        //如果优惠金额为0 表示没有优惠券 不显示优惠券信息
        if(detailData.couponMoney == 0){
            $('.saleprice2').css('display','none');
        }

        $('.pay-btn').off('click').on('click',function(){
            var userCouponId = 0;
            var selectedCoupon = JSON.parse(localStorage.getItem('selectedCoupon'));
            if (undefined != selectedCoupon &&  selectedCoupon != null){
                userCouponId = selectedCoupon.recordId == 'null'?0:selectedCoupon.recordId;
            }
            var settleType = $('#settleType').val();
            var b = new Base64();
            var url = b.encode('/bus/toOnlineCarOrderDetail?orderNo='+driverInfo.orderNo);
            window.location.href='/order/payunit?orderNo='+driverInfo.orderNo+'&settleType='+driverInfo.settleType+'&userCouponId='+userCouponId+'&url='+url;
        });
        $('.evaluate-btn.evaluate-wait').off('click').on('click',function(){
            window.location = '/onlineComment/evaluate?orderNo=' + driverInfo.orderNo + "&token=" + $.cookie('token');
        });
        $('.evaluate-btn.evaluated').off('click').on('click',function(){
            window.location = '/onlineComment/evaluated?orderNo=' + driverInfo.orderNo + "&token=" + $.cookie('token');
        });
    },"json");
	$.hideLoading();
    
    //------------------------------------选择优惠券---------------------------------------------
    var couponClickEvent = function () {
        $('#amountTxt').off('click').on('click',function(){
            if($(this).data('clickable')){
                window.location = '/coupon/select?orderNo='+driverInfo.orderNo+'&businessType='+businessParam.onlineCar;
            }else{
                return;
            }
        })
    }       
    //到达目的地页面也需要web socket
    wssInit();
});

function wssInit() {
    var wss = new communicate({
        url: WEBSOCKET_SERVER+'?token=' + $.cookie('token'),
        errorCallback: function (event) {
            if(event == '正在重连') {
                console.warn(event)
            } else {
                console.error(event)
            }
        },
        openCallback: function(event) {
            //获取司机距离和到达时间
            this.send({
                distance: true,
                time: true
            })
        },
        messageCallback: function(event) {
            var temptType = event.data.data.type;
            if(driverInfo.orderNo != event.data.data.orderNo){
                return false;
            }

            var serviceId=event.data.serviceId;

            //type:1:去接乘客 2:司机抵达出发地 3:司机接到乘客 4:司机抵达目的地 5:司机取消订单 6:乘客取消订单 7:抢单成功
            // temptType：9 ：现金收款
            if(serviceId == '1005'){
                var longitude = event.data.data.longitude;//经度
                var latitude = event.data.data.latitude;//纬度
                if(longitude == null || latitude ==null){
                    var driverPosition = origin; //司机位置
                }else{
                    var driverPosition = new AMap.LngLat(longitude+"", latitude+"") //司机位置
                }
                planRoute(origin, driverPosition);
            }
            var data = event.data.data;

            if((temptType == 4 || temptType==8 || temptType==9) && serviceId == '1006'){
                //TODO 跳转订单页面
                if (data.orderNo) {
                    //立即支付
                    window.location = '/bus/toOnlineCarOrderDetail?orderNo=' + driverInfo.orderNo + '&token=' + $.cookie('token') + '&toPay=1&recordId=' + $('#recordId').val();
                }
            }
        }
    })
    wss.init();
}
