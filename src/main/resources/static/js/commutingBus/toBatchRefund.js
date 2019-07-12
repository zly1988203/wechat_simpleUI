var refundInfo = {
    orderNo:'',
    dateStr:'',
    tel:'',
    ticketList:[],
    ticketNo:[]
}
var clickEvent = isAndroid()?'tap':'click';

function toBatchRefund() {
    $.showLoading();
    var param = {
        orderNo:refundInfo.orderNo,
        token:serverUtil.token
    }
    //查询行程
    request(commuteApi.toBatchRefund,param,true).then(function(res){
        if (res.code == 0) {
            var arriveTitle = res.data.arriveTitle;
            var departTitle = res.data.departTitle;
            var departTime = res.data.departTime;
            refundInfo.dateStr = res.data.dateStr;
            refundInfo.tel = res.data.tel;
            $('#departTitle h4').html(departTitle);
            $('#arriveTitle h4').html(arriveTitle);
            $('#departTime time').html(departTime);
            var ticketList = res.data.ticketList;
            refundInfo.ticketList = ticketList;
            initDatePicker(ticketList);
        }
        $.hideLoading();
    })
}

function initDatePicker(ticketList){
    var ticket = null;
    var ticketData = createData(ticketList);

    $('.ticket-date').datePicker({
        dateBase: refundInfo.dateStr,
        weekend: true,
        multiple: true,
        before:true,
        after:ticketData.monthNum,
        gather: ticketData.resultArray,
        selectCallback: function (data) {
            //TODO
            refundInfo.ticketNo=[];//先清空

            var title = $('.head-title');
            var selectData = ticket = data.selectData;
            $.each(selectData,function (index,cell){
                var serialNo = getSerialNo(cell['date']);
                refundInfo.ticketNo.push(serialNo);
            });
            //计数
            title.find('em').text(selectData.length);

            //下一步样式
            if(selectData.length > 0) {
                $('#submit').removeClass('readonly').addClass('primary');
            } else {
                $('#submit').addClass('readonly').removeClass('primary');
            }
        }
    });
}

function getSerialNo(selectDate){
    var serialNo = '';
    for(var i=0; i<refundInfo.ticketList.length; i++){
        var date = getDate(refundInfo.ticketList[i]['departDateDesc']);
        var selectDate1 = selectDate.year+'-'+selectDate.month+'-'+selectDate.day;
        if(selectDate1==date){
            serialNo = refundInfo.ticketList[i]['ticketSerialNo'];
            break;
        }
    }
    return serialNo;
}

function createData(ticketList){
    var result = {};
    var resultArray = []
    var months = [];
    var monthNum = 0;
    $.each(ticketList,function (index,cell){
        var _result = {};

        _result['date'] = getDate(cell['departDateDesc']);
        _result['state'] = 'readonly';

        if(cell['status'] == 1){
            _result['comment'] = '待乘车';
            _result['state'] = 'select';
        }
        if(cell['status'] == 2){
            _result['comment'] = '已退票';
            _result['state'] = 'readonly';
        }
        if(cell['status'] == 4){
            _result['comment'] = '已验票';
            _result['state'] = 'readonly';
        }
        if(cell['status'] == 7){
            _result['comment'] = '待乘车';
            _result['state'] = 'readonly';
        }

        resultArray.push(_result);

        var months = getMonths(refundInfo.dateStr , cell['departDateDesc']);
        if(monthNum<months){
            monthNum = months;
        }

    });
    result.resultArray = resultArray;
    result.monthNum = monthNum;
    //console.log(JSON.stringify(result));
    return result;
}

function getDate(timestamp) {
    var d = new Date(timestamp);
    var month = d.getMonth() + 1;
    var date = d.getDate();
    return d.getFullYear() + '-' + month + '-' + date;
}

$('#back').on(clickEvent,function(){
    window.location.href='/bus/toCommuteOrderDetail?orderNo='+refundInfo.orderNo;
})


//下一步
$('#submit').on(clickEvent, function () {
    //TODO
    if(refundInfo.ticketNo.length<=0){
        return;
    }

    var checkParam = {
        serialNos:refundInfo.ticketNo.join(','),
        token:serverUtil.token
    }

    request(commuteApi.checkRefund,checkParam,true).then(function(res) {
        if (res.code == 0) {
            sessionStorage.setItem('serialNos',JSON.stringify(refundInfo.ticketNo.join(',')));
            window.location.href = "/commute/toRefundDetail";
        }else {
            $.dialog({
                title: '',
                text: data.message,
                buttons: [
                    {
                        text: '我知道了',
                        onClick: function () {
                        }
                    },
                    {
                        text: '拨打电话',
                        onClick: function () {
                            window.location.href = 'tel:'+refundInfo.tel;
                        }
                    }
                ]
            });
        }
    })

});

function getQueryString(key, strURL) {
    strURL = strURL || window.location.search;
    return new RegExp("(^|\\?|&)" + key + "=([^&]*)(\\s|&|$)", "i").test(strURL) ? decodeURIComponent(RegExp.$2.replace(/\+/g, " ")) : "";
}

$(function () {
    refundInfo.orderNo = getQueryString('orderNo');
    toBatchRefund();
})