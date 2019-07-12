
    //去乘车
    $('#back').on('click',function(){
        window.location.href = '/trip/toTripListPage';
    });

    //查看订单详情
    $('#toOrderDetail').on('click',function(){
        var urlStr = SERVER_URL_PREFIX+'/busline/busOrder/orderDetail';
        var dataObj = {
            orderNo:$('#orderNo').val()
        };
        dataObj = genReqData(urlStr, dataObj);
        window.location.href="/bus/toBusOrderDetail?token="+dataObj.token+"&orderNo="+dataObj.orderNo+"&sign="+dataObj.sign;
    });

    //查看活动详情
    $('#toActivityDetail').on('click',function(){
        var urlStr = SERVER_URL_PREFIX+'/buyActivity/activityDetail';
        var dataObj = {
            activityId:$('#activityId').val(),
            orderNo:$('#orderNo').val()
        };
        dataObj = genReqData(urlStr, dataObj);
        window.location.href="/buyActivity/activityDetail?token="+dataObj.token+"&activityId="+dataObj.activityId+"&sign="+dataObj.sign+"&orderNo="+dataObj.orderNo;
    });

    /*
    * 进度条
    * */
    function progress() {
        $('.progress').each(function (index, item) {
            var $el = $(this),
                $bar = $el.find('.progress-bar'),
                $value = $el.parent().find('.progress-value');
            var amount = $el.data('amount'),
                count = $el.data('count');

            if(amount == 0) {
                //总数为0
                percent = 100;
            } else {
                percent = count / amount * 100;
            }

            $bar.css('width', percent + '%');

            $value.text(count + '/' + amount + '元');
        });
    }

    $('.popup-container .close').on('click',function () {
        $('.popup-container').hide();
    });

    function showPopup() {
        // 0-未关注,1-已经关注
    	var focusOn = $('#focusOn').val();
        if(focusOn == '0'){
            $('.popup-container').show();         
        }else{
            $('.popup-container').hide();
        }
    }

    function showProvideName() {
        var userInfo = JSON.parse(localStorage.getItem('userInfo'));
        var providerName = userInfo.providerName;
        $('#providerName').html(providerName);
    }

    $(function(){
        backtoUrl('/bus/toBusOrderDetail?orderNo='+$('#orderNo').val());
        progress();
        showPopup();
        showProvideName();
    });
