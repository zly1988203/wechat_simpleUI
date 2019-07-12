var orderNo=getQueryString("orderNo");
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 匹配目标参数
    var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
    if (result != null) {
        return decodeURIComponent(result[2]);
    } else {
        return null;
    }
}
// 时间戳转换时间并加星期
function timedat(res){
    var time = new Date(res);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var dataTime = y+'-'+m+'-'+d;
    var timedat = new Date(dataTime.replace(/-/g,'/'));
    var week;
    if(timedat.getDay() == 0) week = "周日";
    if(timedat.getDay() == 1) week = "周一";
    if(timedat.getDay() == 2) week = "周二";
    if(timedat.getDay() == 3) week = "周三";
    if(timedat.getDay() == 4) week = "周四";
    if(timedat.getDay() == 5) week = "周五";
    if(timedat.getDay() == 6) week = "周六";
    return dataTime+'('+week+')';  
};

// 获取订单详情
function getCarOrderDetail(orderNo){
    var urlStr = SERVER_URL_PREFIX+'/spot/getOrderDetail';
    var dataObj = {
        orderNo: orderNo,
        token:$.cookie('token')
    };
    $.ajax({
        type: 'POST',
        url: urlStr,
        data: dataObj,
        dataType:  'json',
        success: function(res){
            if(res.code == 0){
                var contactInfo = res.data.contactInfo
                    ,passengerList = res.data.passengerList
                    ,subOrderList = res.data.subOrderList
                    ,isRefundFlag = res.data.isRefundFlag
                    ,touristList = []
                    ,ticketList = []
                    ,touristHtml = ''
                    ,ticketHtml = ''
                    ,departTime = timedat(subOrderList[0].departTime);
                    sessionStorage.setItem('subOrderList', JSON.stringify(subOrderList));
                $("#storeCode").val(res.data.storeCode);
                $("#storeName").val(res.data.storeName);
                $("#goodsName").html(res.data.goodsName);
                $("#qrcodeName").html(res.data.goodsName);
                $("#orderNo").html(res.data.orderNo);
                $("#totalPrice").html(res.data.totalPrice);
                $("#totalPayPrice").html(res.data.totalPrice);
                $("#explainBox").html(res.data.useIntro);
                $("#fetchTicketAddr").html(res.data.fetchTicketAddr);
                $("#refundIntro").html(res.data.refundIntro);
                $("#contactName").html(contactInfo.contactName);
                $("#contactMobile").html(contactInfo.contactMobile);
                $("#contactCard").html(contactInfo.contactCard);
                $("#contacts").html("联系人："+ contactInfo.contactName +"  " + contactInfo.contactCard );
                $("#createTime").html(formatTime(subOrderList[0].createTime));
                $("#productCode").val(subOrderList[0].goodsNo);
                $("#useTime").html(departTime);

                // 获取购票张数
                var ticketDecList =[];
                var ticketDecHtml = '';
                var orderGoodsIdArr = passengerList.map(function (item) {
                    return item.orderGoodsId;
                });
                for(let i = 0;i < orderGoodsIdArr.length;i++){
                    for(let j=0;j<subOrderList.length;j++){
                        if(orderGoodsIdArr[i] == subOrderList[j].id){
                            ticketDecList.push(subOrderList[j].skuName);
                        }
                    }
                }
                var ticketDec = {};
                var packtype="";
                for (var k = 0; k < ticketDecList.length; k++) {
                    var index = ticketDecList[k];
                    if(!ticketDec[index]){
                        ticketDec[index] = 1;
                    }else{
                        ticketDec[index]++;
                    }
                }
                for(var key in ticketDec){
                    ticketDecHtml += key + "-"+ ticketDec[key] +"张";
                }
                $("#ticketDec").html(ticketDecHtml);

                var subOrderStatus = subOrderList[0].subOrderStatus;
                if(subOrderStatus == 0){
                    $("#payStatus").html("未支付");
                    $("#payStatusYes").hide();
                    $("#payStatusNo").show();
                }else if(subOrderStatus == 4 || subOrderStatus == 6){
                    $("#payStatusYes").show();
                    $("#payStatusNo").hide();
                    if(isRefundFlag == 0){
                        if(subOrderStatus == 4){
                            $("#payStatus").html("已支付");
                        }else if(subOrderStatus == 6){
                            $("#payStatus").html("已完成");
                        }
                        passengerList.forEach(function (item,index) {
                            if(item.idCardNo != ""){
                                touristHtml += '<li class="sui-border-b"><div class="line-item"><div class="name">'+ item.passengerName +' <span>'+ item.passengerMobile +'</span></div></div><div class="line-item flex jcs"><div class="name">身份证 <span>'+ item.idCardNo +'</span></div><div class="status wait-check to-check active" onclick="checkTicket(1,\''+ index +'\''+ ')">验票</div></div></li>';
                                touristList.push(item);
                            }else{
                                ticketHtml += '<li class="sui-border-b"><div class="line-item"><div class="name">票号</div></div><div class="line-item flex jcs"><div class="name">'+ item.ticketSerialNo +'</div><div class="status wait-check to-check active" onclick="checkTicket(1,\''+ index +'\''+ ')">验票</div></div></li>'
                                ticketList.push(item);
                            }
                        })
                    }else if(isRefundFlag == 1){
                        $("#payStatus").html("退款中");
                        $("#refundTicket").hide();
                    }else if(isRefundFlag == 2){
                        $("#payStatus").html("部分退款");
                        $("#refundTicket").hide();
                    }else if(isRefundFlag == 3){
                        $("#payStatus").html("全额退款");
                        $("#refundTicket").hide();
                    }else if(isRefundFlag == -1){
                        $("#payStatus").html("不可退");
                        $("#refundTicket").hide();
                    }
                }else if(subOrderStatus == 7 || subOrderStatus == 8){
                    $("#payStatusYes").show();
                    $("#payStatusNo").hide();
                    $("#refundTicket").hide();
                    if(subOrderStatus == 7){
                        $("#payStatus").html("已取消");
                    }else if(subOrderStatus == 8){
                        $("#payStatus").html("已关闭");
                    }
                }

                $("#tourist").append(touristHtml);
                $("#ticket").append(ticketHtml);
                if(touristList.length <= 0){
                    $("#touristBox").css('display','none');
                }
                if(ticketList.length <= 0){
                    $("#ticketBox").css('display','none');
                }
            }else{
                alert(res.message);
            }

        }
    });
}
getCarOrderDetail(orderNo);

// 验票弹框
function checkTicket(isShow,subOrderIndex){
    let subOrderList = JSON.parse(sessionStorage.getItem('subOrderList'));
    if(isShow == 0){
        // 隐藏弹框
        $("#qrCodePropup").hide();
    }else if(isShow == 1){
        let productCode = subOrderList[subOrderIndex].goodsNo
            ,ticketType = subOrderList[subOrderIndex].skuName + "/¥"+ subOrderList[subOrderIndex].price +"/"+ subOrderList[subOrderIndex].totalNum +"张"
            ,departTime = timedat(subOrderList[subOrderIndex].departTime);
        // 显示弹框
        $("#qrCodePropup").show();
        $("#departTime").html(departTime + " 入园");
        $("#ticketType").html(ticketType);
        getQrcode(orderNo,productCode);
    }
}

// 获取验票码
function getQrcode(orderNo,productCode){
    var url = SERVER_URL_PREFIX + '/spot/getQrcode';
    var dataObj = {
        productCode,productCode,
        orderNo:orderNo,
        token:$.cookie('token')
    };
    dataObj = genReqData(url, dataObj);
    $.ajax({
        url:url,
        data:dataObj,
        type: 'POST',
        dataType: 'JSON',
        success: function (res) {
            let data = JSON.parse(res);
            let qrcodeImg = '<img src="'+ data.data +'">';
            $("#qrcode").html(qrcodeImg);
        }
    });
}



// 发起支付
$("#payConfirm").on('click',function(){
    var orderNo = $("#orderNo").html();
    var b = new Base64();
    var providerId = JSON.parse(localStorage.getItem('userInfo')).providerId;
    var settleType = null;

    var urlStr = SERVER_URL_PREFIX+'/pay/getSettleMode/ByProvider';
    $.ajax({
        url:urlStr,
        data:{providerId:providerId},
        type: 'POST',
        dataType: 'JSON',
        success: function (res) {
            settleType = JSON.parse(res).settleMode;
            var url = b.encode("/sameSale/toDeatilPage?orderNo="+orderNo+'&autoShow=1');
            setTimeout(function() {
                window.location.href='/order/payunit?orderNo='+orderNo+'&settleType='+settleType+'&userCouponId='+0+'&url='+url;
            }, 10);
        }
    })

})

// 取消订单
$('#orderCancel').on('click', function() {
    $.confirm('确定取消订单吗?', '提示',['暂不取消', '确定取消'], function() {
        var urlStr = SERVER_URL_PREFIX+'/spot/cancelAdmissionTicket';
        var orderNo = $("#orderNo").html();

        $.ajax({
            url:urlStr,
            data:{orderNo:orderNo},
            type: 'POST',
            dataType: 'JSON',
            success: function (res) {
                let data =  JSON.parse(res);
                if(data.code == 0){
                    window.location.reload();
                }else{
    	            $.alert(data.message);
                }
            }
        })
    });
});

// 退票
$("#refundTicket").on('click',function(){
    var orderNo = $("#orderNo").html();
    var productCode = $("#productCode").val();
    window.location = '/sameSale/toRefundPage?orderNo=' + orderNo +'&productCode='+ productCode;
})

// 再次购买
$("#buyAgain").on('click',function(){
    let storeCode = $("#storeCode").val();
    let storeName = $("#storeName").val();
    setTimeout(function() {
        window.location.href='/sameSale/toAttMainPage1?storeCode='+ storeCode +'&storeName=' + storeName;
    }, 10);
})


