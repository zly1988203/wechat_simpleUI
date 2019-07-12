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

var queryHasCoupons = function(param,callback){
    var url = SERVER_URL_PREFIX + '/Coupon/queryValidConponByBusiness';

    var data = {
        businessType:businessParam[param.businessType],
    }
    if (businessParam[param.businessType] == 17 || businessParam[param.businessType] == 18){
    	url = SERVER_URL_PREFIX + '/Coupon/queryValidConponByBusinessHail';
    	if (businessParam[param.businessType] == 18){
    		data.cityId = param.cityId;
    		data.price = param.price;
            data.specialFlag = param.specialFlag;
    	}
    	if (businessParam[param.businessType] == 17){
    		data.lineId = param.lineId;
    		data.price = param.price;
            data.specialFlag = param.specialFlag;
    	}
    }
    if(businessParam[param.businessType] == 10 || businessParam[param.businessType] == 2 || businessParam[param.businessType] == 17 || businessParam[param.businessType] == 18){
        data.orderNo = param.orderNo;
    }else if(businessParam[param.businessType] == 3 || businessParam[param.businessType] == 4 || businessParam[param.businessType] == 7
        || businessParam[param.businessType] == 6 || businessParam[param.businessType] == 9){
        data.busId = param.busId;
        data.price = param.price;
        data.specialFlag = param.specialFlag;
        url = SERVER_URL_PREFIX + '/Coupon/queryBusValidConponByBusiness';
    }
    data = genReqData(url, data);
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        dataType:  'json',
        success: function(data){
            if(undefined != data && data.code == 0){
                //"isDiscount":0,  0--固定金额  1--折扣
                //discountMaxLimitAmount 最高抵扣金额 与 折扣共用
                var coupons = data.data;
                if(coupons.list.length > 0){
                    var couponsList = coupons.list;
                    $.each(couponsList,function(key,item){
                        if(key == 0){
                            if(item.isValid == 1){
                                var data = {
                                    userId:0,
                                    isValid:1,
                                    recordId:couponsList[0].recordId,
                                    amount:couponsList[0].amount,
                                    isDiscount:couponsList[0].isDiscount,
                                    discountMaxLimitAmount:couponsList[0].discountMaxLimitAmount
                                }
                                var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
                                data.userId=userInfo.id;
                                localStorage.setItem("selectedCoupon",JSON.stringify(data));

                                if(callback){
                                    callback({
                                        isValid:1,
                                        recordId:couponsList[0].recordId,
                                        amount:couponsList[0].amount,
                                        isDiscount:couponsList[0].isDiscount,
                                        discountMaxLimitAmount:couponsList[0].discountMaxLimitAmount
                                    })
                                }
                            }else{

                                var data = {
                                    userId:0,
                                    isValid:0,
                                    recordId:'null',
                                    amount:0
                                }
                                if(callback){
                                    callback({
                                        isValid:0,
                                        recordId:'null',
                                        amount:0,
                                    })
                                }
                            }
                        }
                    });
                }else{
                    var data = {
                        userId:0,
                        isValid:0,
                        recordId:'null',
                        amount:''
                    }
                    if(callback){
                        callback({
                            isValid:0,
                            recordId:'null',
                            amount:'',
                        })
                    }

                }
            }
        }
    })
}


//时间戳转换为yyyy/mm/dd/HH：mm
function formatTime(fmt,time) {
    if(time){
        time = parseInt(time);
        var date = new Date(time);
        var o = {
            'Y+' : date.getFullYear(),
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }else{
        return '';
    }
}
