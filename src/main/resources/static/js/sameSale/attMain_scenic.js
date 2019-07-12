//选中的数据对象
var chooseObj = {
    // busTickObj:{},//汽车票信息
    // scenicTicketList:[],//景区门票信息
    // departDate:'',
};
// 绑定滚动条
var _myIScroll;
var click_event = isAndroid() ? 'tap' : 'click';
//景点门票列表
var attList = [];
var sessionAttData = [];
var currentEditPassengerId;
var attBaseInfo = {
    storeName:'西递风景区门票',
    totalPrice:0,
    storeCode:'SC10001'
}

//存放要添加人员信息的父元素
var $personContent ;

var bindScroll = function(el) {
    if(_myIScroll) {
        _myIScroll.destroy();
    }
    setTimeout(function() {
        _myIScroll = new IScroll(el + ' .listWrapper');
    }, 300);
}

function formatDepartDate(dateLong) {
    var temp = new Date(dateLong);
    var year = temp.getFullYear();
    var month = temp.getMonth()+1;
    var date = temp.getDate();

    if(month < 9){
        month = '0' + month;
    }
    if(date < 9){
        date = '0'+ date;
    }

    return (year + '-' + month  + '-' + date);
}

$('#btn-date').on(click_event, function() {
    var productCode = $(this).data('product-code');
    var queryDate = formatDepartDate(new Date().getTime());
    var param = {
        productCode:productCode,
        queryDate :queryDate
    }
    getAttDatePopupResult(param,function (dayList) {
        if(dayList.length > 0){
            var dayArr = [];
            dayList.forEach(function (dayItem,index) {
                var day = {
                    date: dayItem.orderDate,
                    comment: dayItem.skuInfoList[0].priceSell,
                    state: 'select',
                    expireDate:undefined!=dayItem.expireDate?dayItem.expireDate:dayItem.orderDate
                };
                dayArr.push(day);
            })
            initAttDatepicker(dayArr);

            $('#selectAttTicketDate').popup('plate', function () {

            }, function (data) {

            });
        }
    })
})

$('#attOrderInfo .att-readme').off(click_event).on(click_event,function (e) {
    e.stopPropagation();
    var productCode = $('#attOrderInfo #productCode').val();
    $('#attReadInfo .btn-toBuy').data('product-code',productCode);
    var orderIntroHtml = '';
    attList.forEach(function (item,index) {
        if(item.productCode == productCode){
            orderIntroHtml = item.orderIntro;
        }
    })
    $('#attReadInfo .content').html('').html(orderIntroHtml);
    $('#attOrderInfo').closePopup();
    $('#attReadInfo').popup();
})

$('.introClose').on(click_event,function () {
    $('#attIntroduce').closePopup();
})

$('.readInfoClose').on(click_event,function () {
    $('#attReadInfo').closePopup();
})

$('#closeSpotTicke').off(click_event).on(click_event,function () {
    $('#attOrderInfo').closePopup();
})

$('#btnTicketCancle').on(click_event,function () {
    $('#ticketPersonList').closePopup();
})

$('#btnTicketPerson').on(click_event, function() {
    var tempPersonList = [];
    $('#ticketPersonList .passenger-list li').each(function () {
        var el = $(this);
        if(el.data('select')) {
            var personInf = {
                id:el.data('id'),
                code:el.data('code'),
                name:el.data('name'),
                phone:el.data('phone')
            }
            tempPersonList.push(personInf);
        }
    });

    $('#ticketPersonList').setPopupData(tempPersonList);
    $('#ticketPersonList').closePopup();
});

//计算当前的景区门票总价
function calAttTotalAmount() {
    var orderCert = $('#attOrderInfo #orderCert').val();
    var totalAmount = 0;
    if(orderCert == 1){
        $('#personTickets .person-type').forEach(function (el,index) {
            var itemId = $(el).data('item-id');
            var itemIds = $(el).data('item-ids');
            var skuCode = $(el).data('sku-code');
            var itemCode = $(el).data('item-code');
            var priceSell = $(el).data('price-sell');
            var ticketName = $(el).data('ticketName');
            var totalNum = $(el).find('.item').length;
            totalAmount += parseFloat(priceSell) * (totalNum);
        })

    }else {
        $('#personNumber .person-item').forEach(function (el) {
            var itemCode = $(el).data('item-code');
            var itemCodeNum = itemCode+'_number';
            var itemCodeNumber = parseInt($('#'+itemCodeNum).val());
            var itemId = $(el).data('item-id');
            var itemIds = $(el).data('item-ids');
            var skuCode = $(el).data('sku-code');
            var priceSell = $(el).data('price-sell');
            var ticketName = $(el).data('ticketName');
            totalAmount += parseFloat(priceSell) * (itemCodeNumber);
        })
    }
    return totalAmount;
}

$('#spotTicketConfirm').off(click_event).on(click_event,function () {
    var attInfo = {
        productCode:$('#attOrderInfo #productCode').val(),
        productName:$('#attOrderInfo #productName').val(),
        orderDate:$('#attOrderInfo #orderDate').val(),
        expireDate:$('#attOrderInfo #expireDate').val(),
        orderCert:$('#attOrderInfo #orderCert').val(),
        totalAmount:0,
        InfoList:[]
    }

    var totalAmount = 0;
    var proId = attInfo.productCode+'_panle';
    var productId = attInfo.productCode+'_att';
    var $itemTicketInfo= $('<div class="item-person-info" data-product-code="'+attInfo.productCode+'"></div>') ;
    var tempTicketPersonHtml = '';
    if(attInfo.orderCert == 1){
        var personTypeNumber = $('#personTickets .person-type').find('.item').length;
        if(personTypeNumber > 0){
            $('#personTickets .person-type').forEach(function (el,index) {
                var itemId = $(el).data('item-id');
                var itemIds = $(el).data('item-ids');
                var skuCode = $(el).data('sku-code');
                var itemCode = $(el).data('item-code');
                var priceSell = $(el).data('price-sell');
                var ticketName = $(el).data('ticketName');
                var totalNum = $(el).find('.item').length;
                totalAmount += parseFloat(priceSell) * (totalNum);
                var item = {
                    itemId:itemId,
                    itemIds:itemIds,
                    ticketName:ticketName,
                    itemCode:itemCode,
                    skuCode:skuCode,
                    priceSell:priceSell,
                    totalNum:totalNum,
                    passengerList:[]
                }
                
                if(parseInt(totalNum) > 0){
                    tempTicketPersonHtml += '<div class="person-info">' +
                        '                <span class="person">'+ticketName+'</span><span class="person-price">¥'+priceSell+'</span>  x '+totalNum+' 张' +
                        '            </div>' ;

                    $(el).find('.item').forEach(function (child,i) {
                        var personInfo = {
                            id:$(child).data('id'),
                            code:$(child).data('code'),
                            name:$(child).data('name'),
                            phone:$(child).data('phone')
                        }
                        item.passengerList.push(personInfo);
                    })
                    attInfo.InfoList.push(item);
                }
            })

            attInfo.totalAmount = parseFloat(totalAmount).toFixed(2);
            $itemTicketInfo.append(tempTicketPersonHtml);
            var btnEditHtml = '            <div class="person-btn">' +
                '                <div class="btn-edit"  data-product-code="'+attInfo.productCode+'" data-order-date="'+attInfo.orderDate+'" ' +
                '               data-expire-date="'+attInfo.expireDate+'">修改</div>' +
                '            </div>' ;

            $("#"+proId).html('').append($itemTicketInfo).append(btnEditHtml);
            $("#"+productId +' .item-instructions').html('').html(attInfo.orderDate+'入园，截止至'+attInfo.expireDate+'有效');
            $("#"+productId).find('.active').show();
            $("#"+productId+' .btn-buy').hide();
            btnEdit_clickEvent();
            sessionAttData.forEach(function (item,index) {
                if(item.productCode === attInfo.productCode){
                    sessionAttData.splice(index,1);
                }
            })
            sessionAttData.push(attInfo);
        }else{
            $("#"+productId+' .btn-buy').show();
            $("#"+productId).find('.active').hide();
            $("#"+proId).html('');
            sessionAttData.forEach(function (item,index) {
                if(item.productCode === attInfo.productCode){
                    sessionAttData.splice(index,1);
                }
            })
        }
    }
    else{
        var totalAttAmount = parseFloat($('#totalAttAmount').val());
        if(totalAttAmount > 0){
            $('#personNumber .person-item').forEach(function (el) {
                var itemCode = $(el).data('item-code');
                var itemCodeNum = itemCode+'_number';
                var itemCodeNumber = parseInt($('#'+itemCodeNum).val());
                var itemId = $(el).data('item-id');
                var itemIds = $(el).data('item-ids');
                var skuCode = $(el).data('sku-code');
                var priceSell = $(el).data('price-sell');
                var ticketName = $(el).data('ticketName');
                totalAmount += parseFloat(priceSell) * (itemCodeNumber);
                var item = {
                    itemId:itemId,
                    itemIds:itemIds,
                    ticketName:ticketName,
                    itemCode:itemCode,
                    skuCode:skuCode,
                    priceSell:priceSell,
                    totalNum:itemCodeNumber,
                    passengerList:[]
                }

                if(parseInt(itemCodeNumber) > 0){
                    attInfo.InfoList.push(item);
                    tempTicketPersonHtml += '<div class="person-info">' +
                    '                <span class="person">'+ticketName+'</span><span class="person-price">¥'+priceSell+'</span>  x '+itemCodeNumber+' 张' +
                    '            </div>' ;
                }
            })
            attInfo.totalAmount = parseFloat(totalAmount).toFixed(2);
            $itemTicketInfo.append(tempTicketPersonHtml);
            var btnEditHtml = '            <div class="person-btn">' +
                '                <div class="btn-edit" data-product-code="'+attInfo.productCode+'" data-order-date="'+attInfo.orderDate+'"'+
                '                        data-expire-date="'+attInfo.expireDate+'">修改</div>' +
                '            </div>' ;

            $("#"+proId).html('').append($itemTicketInfo).append(btnEditHtml);
            $("#"+productId +' .item-instructions').html('').html(attInfo.orderDate+'入园，截止至'+attInfo.expireDate+'有效');
            $("#"+productId).find('.active').show();
            $("#"+productId+' .btn-buy').hide();
            btnEdit_clickEvent();
            sessionAttData.forEach(function (item,index) {
                if(item.productCode === attInfo.productCode){
                    sessionAttData.splice(index,1);
                }
            })
            sessionAttData.push(attInfo);
        }else{
            $("#"+productId+' .btn-buy').show();
            $("#"+productId).find('.active').hide();
            $("#"+proId).html('');
            sessionAttData.forEach(function (item,index) {
                if(item.productCode === attInfo.productCode){
                    sessionAttData.splice(index,1);
                }
            })
        }
    }
    $('#attOrderInfo .total-val').html(parseFloat(totalAmount).toFixed(2)+'元');
    $('#attOrderInfo #totalAttAmount').val(parseFloat(totalAmount).toFixed(2));
    showTotalAmount();
    $('#attOrderInfo').closePopup();
})

$('#toPayBtn').off(click_event).on(click_event,function () {
    if(attBaseInfo && attBaseInfo.totalPrice <= 0){
        $.toast('请选择需要购买的车票或者景区票');
        return;
    }
    sessionStorage.setItem('sessionAttData',JSON.stringify(sessionAttData));
    sessionStorage.setItem('busTicketData',JSON.stringify(busTicketObj));
    sessionStorage.setItem('attBaseInfo',JSON.stringify(attBaseInfo));
    window.location = '/sameSale/toPay';
});

$('#passengerList .passenger-list li .info').on(click_event, function () {
    triggerCheckbox($(this));
});

$('.listWrapper').each(function () {
    $(this).css('height', ($(window).height() - 74) + 'px');
});

//点击内容区，自动选中或取消
function triggerCheckbox($el) {
    var $input = $el.prev('.name').find('input[type=checkbox]');

    if($input.prop('checked')) {
        $input.prop('checked', false);
    } else {
        $input.prop('checked', true);
    }

    changeSelect($input);
}

function editPassenger(){
    var urlStr = '/bus/passengerContactInfo/update';
    var _editName = $('#editPassengerName').val(),
        _phoneName = $('#editPassengerPhone').val(),
        _codeName = $('#editPassengerCode').val();
    //current page param
    var dataObj = {
        id: currentEditPassengerId,
        passengerName: _editName,
        mobile: _phoneName,
        idCardNo: _codeName,
        token:$.cookie('token')
    };
    $.ajax({
        type: 'POST',
        url:urlStr,
        data:dataObj,
        dataType:  "json",
        success: function(result){
            if(result&&result.code==0){
                var targetZindex = $('#editPassenger').data('trigger'),
                    _target = $('.passenger-list li').eq(targetZindex);
                var _editName = $('#editPassengerName').val(),
                    _phoneName = $('#editPassengerPhone').val(),
                    _codeName = result.data.idCardNo;

                //更新 - 存储数据
                _target.data('name', _editName)
                    .data('phone', _phoneName)
                    .data('code', result.data.idCardNo);

                //更新 - 展示数据
                _target.find('.info h4').text(_editName);
                _target.find('.info p:first').html('</h4><p><em>手机号</em>' + _phoneName);
                _target.find('.info p:last').html('</h4><p><em>身份证</em>' + _codeName);
            }else{
                $.alert((result&&result.message) || "未知错误");
            }
        }
    });
}

//获取乘客端详细信息
function getPassengerDetailInfo(id,$parent){
    $.ajax({
        type: "GET",
        url: "/bus/passengerContactInfo/getPassengerDetailInfo",//添加订单
        data:{'id':id},
        dataType: "json",
        success: function(result){

            if(result!=undefined&&result.code!=undefined&&parseInt(result.code)==0){
                var data=result.data.passenger;
                $('#editPassenger').popup('push', function() {
                    $('#editPassengerName').val(data.passengerName);
                    $('#editPassengerPhone').val(data.mobile);
                    $('#editPassengerCode').val(data.showIdCardNo);

                    //设置触发的元素
                    $('#editPassenger').data('trigger', $parent.index());
                });
            }else{
            }
        }
    });
}

/*
* 编辑乘客
* */
//编辑操作
function editHandle(el) {
    var $parent = el.parents('li');
    var _name  = $parent.data('name'),
        _phone = $parent.data('phone'),
        _code  = $parent.data('code');
    var _id    = $parent.data('id');
    currentEditPassengerId=_id;
    getPassengerDetailInfo(_id,$parent);
}
/*
* 更新select状态
* */
function changeSelect(el) {
    el.parents('li').data('select', el.prop('checked'));
}


function initAttDatepicker(dayArr) {
    //填充日历
    var departDate = formatDepartDate(new Date().getTime());
    $('#selectAttTicketDate .datepicker-wrapper').datePicker({
        dateBase: departDate,
        multiple:false,
        before:false,
        weekend:true,
        after:1,
        gather: dayArr,
        selectCallback: function (data) {
            var selectData = data.selectData[0];
            // var orderDate = selectData.date;
            // var dateStr = orderDate.year+'-'+orderDate.month+'-'+orderDate.day;
            $('#attOrderInfo .date-val').html("").html(selectData.expireDate);
            $('#attOrderInfo #orderDate').val(selectData.expireDate);
            $('#attOrderInfo #expireDate').val(selectData.expireDate);
            $('#selectAttTicketDate').closePopup();
            updateDatePrice(selectData.expireDate);
        },
        switchMonth:switchAttMonth
    });
}
//跟新新选日期的价格
function updateDatePrice(dateStr){
    var skuInfos = [];
    DatePopupRes.forEach(function (item,index) {
        if(item.expireDate == dateStr){
            skuInfos = item.skuInfoList;
        }
    })

    var orderCert = $('#orderCert').val();
    if(orderCert == 1){
        $('#personTickets .person-type').forEach(function (el,index) {
            // skuInfos[index].priceSell = '0.1';
            $(el).data('price-sell',skuInfos[index].priceSell);
            $(el).find('.priceSell').html(skuInfos[index].priceSell+'元/人');
            $(el).find('.icon-person-plus').data('price-sell',skuInfos[index].priceSell);
        })
    }else {
        $('#personNumber .person-item').forEach(function (el,index) {
            $(el).data('price-sell',skuInfos[index].priceSell);
            $(el).find('.price-person').html(skuInfos[index].priceSell+'元/人');
            $(el).find('.reduce-number').data('price-sell',skuInfos[index].priceSell);
            $(el).find('.add-number').data('price-sell',skuInfos[index].priceSell);
        })
    }
    var totalAmount = calAttTotalAmount();
    $('#attOrderInfo .total-val').html(totalAmount+'元');
    $('#attOrderInfo #totalAttAmount').val(totalAmount);
}

function switchAttMonth(data,picker) {
    var productCode = $('#attOrderInfo #productCode').val();
    var queryDate = data;
    var param = {
        productCode:productCode,
        queryDate :queryDate
    }

    getAttDatePopupResult(param,function (dayList) {
        if(dayList.length > 0){
            var dayArr = [];
            dayList.forEach(function (dayItem,index) {
                var day = {
                    date: dayItem.orderDate,
                    comment: dayItem.skuInfoList[0].priceSell,
                    state: 'select',
                    expireDate:undefined!=dayItem.expireDate?dayItem.expireDate:dayItem.orderDate
                };
                dayArr.push(day);
            })
            if (picker!=null) {
                picker.reset({
                    gather: dayArr,
                    after:1,
                });
                picker.full(param.queryDate);
            }
        }
    })
}
var DatePopupRes ;
function getAttDatePopupResult(param,callback) {
    $.showLoading();
    var succ_event = function (res) {
        $.hideLoading();
        var data = res.data;
        if(res.code == 1){
            $.alert(res.msg);
            return;
        }

        if(callback && "" != data){
            DatePopupRes = data;
            callback(data)
        }else {
            $.toast('未查询到数据');
            return;
        }

    }

    var err_event = function (e) {
        if(callback){
            callback({code:1})
        }
        $.hideLoading();
        $.alert(e.message);
    }

    var url = SERVER_URL_PREFIX + '/spot/getGoodsSku';
    var param = {
        "token": $.cookie('token'),
        "productCode":param.productCode,
        "queryDate":param.queryDate,
    }
    $.ajaxService({
        url:url,
        data:param,
        success:succ_event,
        error:err_event,
    })
}

var btnEdit_clickEvent = function () {
    $('.btn-edit').off(click_event).on(click_event,function () {
        var productCode = $(this).data('product-code');
        var orderDate = $(this).data('order-date');
        var param = {
            productCode:productCode,
            queryDate:orderDate
        }
        loadGoodsDetail(param,function (res) {
            var data = res;
            drawGoodDetail(data,function () {
                sessionAttData.forEach(function (item,i) {
                    if(item.productCode === productCode){
                        $('#attOrderInfo .date-val').html('').html(item.orderDate);
                        $('#attOrderInfo #orderDate').val(item.orderDate);
                        $('#attOrderInfo #expireDate').val(item.expireDate);
                        $('#attOrderInfo .total-val').html(item.totalAmount+'元');
                        $('#attOrderInfo #totalAttAmount').val(item.totalAmount);
                        //实名制添加人员
                        if(item.orderCert == 1){
                            var skuItemList = item.InfoList;
                            skuItemList.forEach(function (skuItem,index) {
                                var personHtml = loadAttPersonList(skuItem.passengerList,skuItem.itemCode);
                                var personTypeId = skuItem.itemCode+'_type';
                                $("#"+personTypeId).find('.content').html(personHtml);
                            })
                            removeAttPerson();
                        }else {
                            //非实名制添加对应的数量
                            var skuItemList = item.InfoList;
                            skuItemList.forEach(function (skuItem,index) {
                                var itemCodeNumId = skuItem.itemCode+'_number';
                                $('#'+itemCodeNumId).val(skuItem.totalNum);
                                var itemCodeId = skuItem.itemCode+'_item';
                                $('#'+itemCodeId).find('.number-val span').html(skuItem.totalNum);
                            })
                        }
                    }
                })
                $('#attOrderInfo').popup();
            })
        })
    })
}

function removeAttPerson() {
    $("#attOrderInfo .handle-minus").click(function(e){
        e.stopPropagation();
        var itemCode = $(this).data('item-code');
        var personTypeId = itemCode+'_type';
        $(this).parent().remove();
        var priceSell = $("#"+personTypeId).data('priceSell');
        var tempAmount = parseFloat($('#totalAttAmount').val());
        $('#attOrderInfo .total-val').html(parseFloat(tempAmount-priceSell).toFixed(2)+'元');
        $('#attOrderInfo #totalAttAmount').val(parseFloat(tempAmount-priceSell).toFixed(2));
    })
}

function attClick_event() {
    $('.item-banner').on(click_event,function (e) {
        e.stopPropagation();
        var storeCode = $(this).data('store-code');
        var productCode = $(this).data('product-code');
        $('#attIntroduce .btn-toBuy').data('product-code',productCode);
        initAttInfo(storeCode,function (data) {
            if(data.code == 0){
                $('#attIntroduce').popup();
            }else{
                $.toast('获取景点信息失败');
            }

        })

    })

    $('.item-readme').on(click_event,function (e) {
        e.stopPropagation();
        var productCode = $(this).data('product-code');
        var orderIntroHtml = '';
        attList.forEach(function (item,index) {
            if(item.productCode == productCode){
                orderIntroHtml = item.orderIntro;
            }
        })
        $('#attReadInfo .btn-toBuy').data('product-code',productCode);
        $('#attReadInfo .content').html('').html(orderIntroHtml);
        $('#attReadInfo').popup();
    })

    $('.btn-buy').on(click_event,function () {
        var productCode = $(this).data('product-code');
        var orderDate = $(this).data('order-date');
        var expireDate = $(this).data('expire-date');
        $('#attOrderInfo #orderDate').val(orderDate);
        $('#attOrderInfo #expireDate').val(expireDate);
        $('#attOrderInfo .date-val').html('').html(orderDate);
        var param = {
            productCode:productCode,
            queryDate:orderDate
        }
        loadGoodsDetail(param,function (data) {
            drawGoodDetail(data,function () {
                if(data.orderCert == 0){
                    let price = parseFloat(data.skuInfos[0].priceSell) * 100;
                    $('#attOrderInfo .total-val').html(parseFloat(price/100).toFixed(2) +'元');
                    $('#attOrderInfo #totalAttAmount').val(parseFloat(price/100).toFixed(2));
                }

                $('#attOrderInfo').popup();
            });
        })
    })
}

function initAttInfo(storeCode,callback) {
    $.showLoading();
    var url = SERVER_URL_PREFIX + '/spot/getSpotInfo' ;
    var param = {
        'storeCode':storeCode
    }

    function succ_event(res) {
        $.hideLoading();
        if(res.code == 0){
            if(callback){
                callback({code:0});
            }
            var data = res.data;
            $('#attIntroduce .content').html('').html(data.storeIntro);
        }else{
            $.alert(res.message);
            return;
        }
    }

    function err_event(e) {
        if(callback){
            callback({code:1});
        }
        $.hideLoading();
        $.alert(e);
    }

    $.ajaxService({
        url:url,
        data:param,
        success:succ_event,
        error:err_event,
    })

}

function loadGoodsDetail(param,callback) {
    $.showLoading();
    var succ_event = function (res) {
        $.hideLoading();
        if(res.code == 1){
            $.alert(res.msg);
            return;
        }
        var data = res.data;
        if(callback && "" != data){
            if(undefined != data.skuItems && undefined != data.skuInfos){
                if(data.skuInfos.length > 0){
                    var flag = false;
                    data.skuInfos.forEach(function (item,index) {
                        if(item.stockRemain > 0){
                            flag = true;
                        }
                    })
                    if(flag){
                        callback(data)
                    }else {
                        $.toast('暂不支持购买');
                        return;
                    }

                }else {
                    $.toast('暂不支持购买');
                    return;
                }

            }else {
                $.toast('暂不支持购买');
                return;
            }
        }else {
            $.toast('暂不支持购买');
            return;
        }
    }

    var err_event = function (e) {
        $.hideLoading();
        var res = JSON.parse(e.response);
        $.alert(res.message);
    }

    var url = SERVER_URL_PREFIX + '/spot/getGoodsDetail';
    var param = {
        "token": $.cookie('token'),
        "productCode":param.productCode,
        "queryDate":param.queryDate
    }
    $.ajaxService({
        url:url,
        data:param,
        success:succ_event,
        error:err_event,
    })
}

function loadAttPersonList(selectPersonList,itemCode) {
    var personHtml = '';
    selectPersonList.forEach(function (person,index) {
        personHtml += '<div class="item" data-name="'+person.name+'" data-id="'+person.id+'"' +
            ' data-code="'+person.code+'"  data-phone="'+person.phone+'">' +
            '<div class="handle-minus" data-item-code="'+itemCode+'"></div>' +
            // '<div class="name">' + person.name + '</div>' +
            '<div class="info">' +
            '<p><span class="label">'+person.name+'</span></p>' +
            '<p><span class="label">身份证</span>' + person.code + '</p>' +
            '</div>' +
            '</div>';
    })
    return personHtml;
}

function drawGoodDetail(data,callback) {
    // let price = data.skuInfos[0].priceSell * 100;
    $('#attOrderInfo .att-name').html('').html(data.productName);
    $('#attOrderInfo #btn-date').data('product-code',data.productCode);
    $('#attOrderInfo #productCode').val(data.productCode);
    $('#attOrderInfo #productName').val(data.productName);
    $('#attOrderInfo #orderCert').val(data.orderCert);
    var skuItems = data.skuItems;
    if(skuItems.length <= 0 ){
        $('#personTickets .person-body').html('');
        $('#personNumber .content').html('');
        return;
    }
    var skuInfors = data.skuInfos;
    //是否需要实名认证
    if(data.orderCert == 1){
        $('#personNumber').hide();
        $('#personTickets').show();
        skuItems.forEach(function (item,index) {
            if(item.itemType == 1){
                var childList = item.itemAttrs;
                if(childList.length > 0){
                    var tickeTypeHtml = '';
                    childList.forEach(function (child,num) {
                        tickeTypeHtml += '    <div id="'+child.itemCode+'_type" class="person-type" data-item-id="'+child.itemId+'" data-item-ids="'+skuInfors[num].itemIds+'"  ' +
                            '               data-price-sell="'+skuInfors[num].priceSell+'" data-sku-code="'+skuInfors[num].skuCode+'" ' +
                            '               data-item-code="'+child.itemCode+'" data-ticket-name="'+child.ticketName+'">' +
                            '                <div class="head">' +
                            '                    <h4>'+child.ticketName+'</h4>' +
                            '                            <div class="personPrice">' +
                            '                                <span class="priceTitle">单价：</span>' +
                            '                                <span class="priceSell">'+skuInfors[num].priceSell+'元/人</span>' +
                            '                            </div>'+
                            '                    <div class="handle-plus">' +
                            '                        <i class="icon-person-plus"  data-item-id="'+child.itemId+'" ' +
                            '                       data-price-sell="'+skuInfors[num].priceSell+'" data-item-code="'+child.itemCode+'"></i>' +
                            '                    </div>' +
                            '                </div>' +
                            '                <div id="'+child.itemCode+'_content" class="content" data-item-code="'+child.itemCode+'" data-price-sell="'+skuInfors[num].priceSell+'">' +
                            '                </div>' +
                            '            </div>'
                    })
                    $('#personTickets .person-body').html('').append(tickeTypeHtml);
                    addPersonClick_evnet();
                }
                else{
                    $.toast('暂不支持购买');
                    return;
                }
            }
        })
    }
    else{
        $('#personTickets').hide();
        $('#personNumber').show();
        skuItems.forEach(function (item,index) {
            if(item.itemType == 1){
                var childList = item.itemAttrs;
                if(childList.length > 0){
                    var tickeTypeHtml = '';
                    childList.forEach(function (child,num) {
                        let numOne = null;
                        if(num == 0){
                            numOne = 1;
                        }else{
                            numOne = 0;
                        }
                        tickeTypeHtml += ' <div id="'+child.itemCode+'_item" class="person-item" data-item-id="'+child.itemId+'" data-item-ids="'+skuInfors[num].itemIds+'" ' +
                            '               data-price-sell="'+skuInfors[num].priceSell+'" data-sku-code="'+skuInfors[num].skuCode+'" ' +
                            '               data-item-code="'+child.itemCode+'" data-ticket-name="'+child.ticketName+'">' +
                            '                    <div class="item-type">'+child.ticketName+'<span class="price-str">单价：<span class="price-person">'+skuInfors[num].priceSell+'元/人</span></span> </div>' +
                            '                    <div class="item-number">' +
                            '                        <div class="reduce-number" ' +
                            '                              data-price-sell="'+skuInfors[num].priceSell+'" ' +
                            '                           data-item-code="'+child.itemCode+'"></div>' +
                            '                        <div class="number-str">' +
                            '                            <div class="number-val">' +
                            '                                <span>'+numOne+'</span><input id="'+child.itemCode+'_number" type="hidden" value="'+numOne+'">' +
                            '                               </div></div>' +
                            '                        <div class="add-number" ' +
                            '                               data-price-sell="'+skuInfors[num].priceSell+'" ' +
                            '                           data-item-code="'+child.itemCode+'"></div>' +
                            '                    </div></div>';

                    })
                    $('#personNumber .content').html('').append(tickeTypeHtml);
                    numberClick_evnet();
                }
                else{
                    $.toast('暂不支持购买');
                    return;
                }
            }
        })
    }
    callback(data)
}

var numberClick_evnet = function () {
    $('.person-item .item-number .reduce-number').off('click').on('click',function (e) {
        e.stopPropagation();
        var itemCode = $(this).data('item-code');
        var itemCodeNum = itemCode+'_number';
        var personNumber = parseFloat($('#'+itemCodeNum).val());
        if(personNumber == 0) return;
        personNumber = personNumber - 1;
        $('#'+itemCodeNum).val(personNumber);
        var itemCodeId = itemCode+'_item';
        $('#'+itemCodeId).find('.number-val span').html(personNumber);
        var priceSell = parseFloat($(this).data('price-sell')) * 100;
        var tempAmount = parseFloat($('#totalAttAmount').val());
        var totalAmount = tempAmount - ((1 * priceSell)/100);
        $('#attOrderInfo .total-val').html(parseFloat(totalAmount).toFixed(2)+'元');
        $('#totalAttAmount').val(parseFloat(totalAmount).toFixed(2));
    })

    $('.person-item .item-number .add-number').off('click').on('click',function (e) {
        e.stopPropagation();
        var orderLimit = parseInt($("#orderLimit").val());
        var itemCode = $(this).data('item-code');
        var itemCodeNum = itemCode+'_number';
        var personNumber = parseInt($('#'+itemCodeNum).val());
        if(orderLimit > personNumber){
            personNumber = personNumber + 1;
            $('#'+itemCodeNum).val(personNumber);
            var itemCodeId = itemCode+'_item';
            $('#'+itemCodeId).find('.number-val span').html(personNumber);
            var priceSell = parseFloat($(this).data('price-sell')) * 100;
            var tempAmount = parseFloat($('#totalAttAmount').val());
            var totalAmount = ((1 * priceSell)/100) + tempAmount;
            $('#attOrderInfo .total-val').html(parseFloat(totalAmount).toFixed(2)+'元');
            $('#totalAttAmount').val(parseFloat(totalAmount).toFixed(2));
        }else{
            $.toast("购买数量不能超过" + orderLimit + "张");
        }

    })
}

var addPersonClick_evnet = function () {
    $('.icon-person-plus').on(click_event,function () {
        //获取最近的父元素
        var itemCode = $(this).data('item-code');
        var itemCodeId = itemCode+'_content';
        $personContent = $("#"+itemCodeId);
        getPassengerList(function (list) {
            $("#ticketPersonList .passenger-list").html("");
            drawPassengerList(list,$('#ticketPersonList .passenger-list'));
            $('#ticketPersonList').popup('modal', function() {
                bindScroll('#ticketPersonList');  //加载滚动条
            },function (data) {
                var tempPersonList = data;
                let orderLimit = parseInt($("#orderLimit").val());
                if(orderLimit>=tempPersonList.length){
                    //更新选中的需要购票的人员
                    var itemCode = $($personContent).data('item-code');
                    var psersonHtml = loadAttPersonList(tempPersonList,itemCode);
                    $($personContent).html('').append(psersonHtml);
                    var totalAmount = 0;
                    $('#personTickets .person-type').forEach(function (el,index) {
                        var totalNum = $(el).find('.item').length;
                        var priceSell = parseFloat($(el).data('price-sell'))*100;
                        totalAmount += parseFloat(priceSell) * parseInt(totalNum);
                    })
                    $('#attOrderInfo .total-val').html(parseFloat(totalAmount/100).toFixed(2)+'元');
                    $('#totalAttAmount').val(parseFloat(totalAmount/100).toFixed(2));
                    removeAttPerson();
                }else{
                    $.toast("乘车人数不能超过" + orderLimit + "人");
                }
            });
            //选择乘客 - 更新select状态
            $('.passenger-list input[type=checkbox]').on('change', function () {
                changeSelect($(this));
            });

            $('#ticketPersonList .addPassengerButton').off('tap').on('tap', function() {
                $('#ticketPersonList').closePopup();
                $('#addPassenger').popup('push', function() {
                    $('#addPassengerName').val('');
                    $('#addPassengerPhone').val('');
                    $('#addPassengerCode').val('');
                })
            });

            $('#ticketPersonList .editPassengerButton').on('tap', function () {
                $('#ticketPersonList').closePopup();
                editHandle($(this));
            });
        })
    })

}
//查询人员列表
function getPassengerList(callback) {
    $.post('/bus/passengerContactInfo/passengerList',{},function(res){
        if(res.code==0){
            var list = res.data;
            if(callback){
                callback(list);
            }
        }
    },'json');
}
//渲染人员页面
function drawPassengerList(list,$el) {
    $.each(list,function(index,item){
        if('undefined' == typeof (item.mobile) || undefined == item.mobile){
            item.mobile ='';
        }
        var template='<li class="sui-border-b classDataId" data-select="false" data-showidcard="showIdCardNo" data-id="passengerId" data-name="passengerName" data-phone="passengerMobile" data-code="passengerCode">' +
            '<div class="name"><input type="checkbox" class="frm-checkbox checkBoxClassId" /></div>' +
            '<div class="info"><h4>passengerName</h4><p><em>手机号</em>passengerMobile</p><p><em>身份证</em>passengerCode</p></div>' +
            '<div class="handle"><i class="icon-edit editPassengerButton"></i></div></li>';
        template=template.replace("classDataId", "classData"+item.id);
        template=template.replace("showIdCardNo", item.showIdCardNo);
        template=template.replace("checkBoxClassId", "checkBoxClass"+item.id);
        template=template.replace(/\passengerId/g, item.id);
        template=template.replace(/\passengerName/g, item.passengerName);
        template=template.replace(/\passengerMobile/g, item.mobile);
        template=template.replace(/\passengerCode/g, item.idCardNo);
        $el.append(template);
    })
}

function initAttList() {
    $.showLoading();
    var succ_event = function (res) {
        $.hideLoading();
        if(res.code == 0){
            if("" != res.data){
                attList = res.data;
                if(attList.length > 0 ){
                    var att_item = '';
                    attList.forEach(function (item,index) {
                        var refundType = item.refundType;
                        var refundHtml = null;
                        if(refundType == 1){
                            refundHtml = "可退";
                        }else if(refundType == 2){
                            refundHtml = "不可退";
                        }else if(refundType == 3){
                            refundHtml = "部分可退";
                        }
                        $("#orderLimit").val(item.orderLimit);
                        $("#refundHtml").html(refundHtml);
                        att_item += '      <div class="att-panle">  <div id="'+item.productCode+'_att" class="att-item">' +
                            '            <div class="active" style="display: none"></div>' +
                            '            <div class="item-banner" data-store-code="'+item.storeCode+'" data-product-code="'+item.productCode+'">' +
                            '                <img src="'+item.thumb+'">' +
                            '            </div>' +
                            '            <div class="item-content">' +
                            '                <div class="item-name-price">' +
                            '                    <div class="item-name">'+item.productName+'</div>' +
                            '                    <div class="item-sell-price">' +
                            '                        ¥<em>'+item.minPrice+'</em>起' +
                            '                    </div>' +
                            '                </div>' +
                            '                <div class="item-instructions">'+item.orderDate+'入园，截止至'+item.expireDate+'有效</div>' +
                            '                <div class="item-others">' +
                            '                    <div class="item-others-left">' +
                            '                        <div class="item-tag">'+ refundHtml +'</div>' +
                            '                        <div class="item-readme" data-product-code="'+item.productCode+'">' +
                            '                            <span></span> 购票须知' +
                            '                        </div>' +
                            '                    </div>' +
                            '                    <div class="item-others-right">' +
                            '                        <div class="btn-buy"  data-product-code="'+item.productCode+'" ' +
                            '                           data-order-date="'+item.orderDate+'" data-expire-date="'+item.expireDate+'" >预定</div>' +
                            '                    </div>' +
                            '                </div>' +
                            '            </div></div>' +
                            '<div id="'+item.productCode+'_panle" class="item-person-panle" data-product-code="'+item.productCode+'"></div></div>' ;
                    })
                    $('.att-body').append(att_item);
                    $('#attractionsList').show();
                    attClick_event();
                }else {
                    $('#attractionsList').hide();
                }
            }else {
                // $.alert('未查询到数据');
                return;
            }
        }

    }
    var err_event = function (e) {
        $.hideLoading();
        $.alert(e.message);
    }
    var url = SERVER_URL_PREFIX + '/spot/getGoodsListByStoreCode';
    var departDate = formatDepartDate(new Date().getTime());
    var param = {
        storeCode: attBaseInfo.storeCode,
        "queryDate": departDate
    }

    $.ajaxService({
        url:url,
        data:param,
        success:succ_event,
        error:err_event,
    })
}

function swNewsImg(){
    /** 轮播图*/
    var sw = new Swiper('.swiper-container', {
        spaceBetween: 10,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        // slidesPerView: false,
        // centeredSlides: true,
        // paginationClickable: true,
        autoplay: true,//可选选项，自动滑动
    });
}

function showTotalAmount() {
    var totalAmount = 0;
    sessionAttData.forEach(function (item,index) {
        totalAmount += parseFloat(item.totalAmount)
    })
    totalAmount = parseFloat(totalAmount + parseFloat(busTicketObj.totalPriceBus)).toFixed(2);
    $('#allTotalPrice').val(totalAmount);
    $('.all-total-price span').html(totalAmount+'元');
    attBaseInfo.totalPrice = totalAmount;

    if(attBaseInfo.totalPrice > 0){
        $('#toPayBtn').removeClass('bg_gray');
    }else{
        $('#toPayBtn').addClass('bg_gray');
    }
}

/*
* 乘客 - 操作
* */
function passengerHandle() {
    /*
       * 添加乘客
     * */
    // 打开添加界面
    $('#passengerList .addPassengerButton').off('tap').on('tap', function() {
        $('#passengerList').closePopup();
        $('#addPassenger').popup('push', function() {
            $('#addPassengerName').val('');
            $('#addPassengerPhone').val('');
            $('#addPassengerCode').val('');
        })
    });

    $('#passengerList .passenger-list li .info').on(click_event, function () {
        triggerCheckbox($(this));
    });

    //取消添加
    $('#cancelAddButton').off(click_event).on(click_event, function () {
        $('#addPassenger').closePopup();
    });

    //提交添加
    $('#submitAddButton').on(click_event, function() {
        //TODO: 提交添加
        var name = $('#addPassengerName').val();
        var phone = $('#addPassengerPhone').val();
        var code = $('#addPassengerCode').val();


        if(name == ''||phone==''||code==''){
            $.toast('乘车人信息不完整请补充');
            lock =false;
            return;
        }
        if(!(/^1\d{10}$/.test(phone))){
            $.toast('请填写正确的手机号');
            lock =false;
            return;
        }
        //判断身份证是否合法
        code = $.trim(code);
        var flag = new clsIDCard(code);
        if(!flag.Valid){
            $.toast('请填写正确的身份证');
            lock =false;
            return false;
        }
        $.post("/bus/passengerContactInfo/addContact",{passengerName:name,mobile:phone,idCardNo:code,token:$.cookie("token")},function(result){
            if(result.code == 0){
                //创建标签
                var $strLi = $('<li class="sui-border-b classData'+result.data.id+'" data-id="'+result.data.id+'" data-showidcard="'+code+'" data-select="false" data-name="' + name + '" data-phone="' + phone + '" data-code="' + result.data.idCardNo + '"></li>'),
                    $strName = $('<div class="name"><input type="checkbox" class="frm-checkbox checkBoxClass'+result.data.id+'" /></div>'),
                    $strInfo = $('<div class="info"><h4>' + name + '</h4><p><em>手机号</em>' + phone + '</p><p><em>身份证</em>' + result.data.idCardNo + '</p></div>'),
                    $strHandle = $('<div class="handle"><i class="icon-edit editPassengerButton"></i></div>');
                //合并标签
                $strLi.append($strName).append($strInfo).append($strHandle);

                //添加到父元素里
                $('#passengerList .passenger-list').append($strLi);
                // $('#ticketPersonList .passenger-list').append($strLi);
                //绑定 - 更新乘客选择
                $strName.find('input[type=checkbox]').on('change', function () {
                    changeSelect($(this));
                });

                //绑定 - 编辑乘客
                $strHandle.find('.editPassengerButton').on(click_event, function () {
                    editHandle($(this));
                });

                //绑定 - 点击内容区，自动选中或取消
                $strInfo.on(click_event, function () {
                    triggerCheckbox($(this));
                });

                if(_myIScroll) {
                    _myIScroll.refresh();   // 刷新滚动条
                }

                $('#addPassenger').closePopup();
            }else{
                $.toast(result.message);
            }
            lock =false;
        },'json');

    });

    //关闭编辑
    $('#submitEditButton').on(click_event, function () {
        $('#editPassenger').closePopup(function () {
            editPassenger();
        });
    });

    //乘客人数运算
    $('.operation .icon-minus').on(click_event, function () {
        //减
        var el = $(this);

        if(!el.data('clock')) {
            el.data('clock', true);

            var _v = parseInt(el.next().text());

            if(_v == 5) {
                el.siblings('.icon-plus').removeClass('out');
            }

            if(_v == 1) {
                //TODO
//                    $.toast('人数至少为1');
            } else {
                el.next().text(_v - 1);

                if(el.next().text() == 1) {
                    el.addClass('out');
                }
            }

            el.data('clock', false);
        }
    });

    $('.operation .icon-plus').on(click_event, function () {
        //加
        var el = $(this);

        if(!el.data('clock')) {
            el.data('clock', true);

            var _v = parseInt(el.prev().text());

            if(_v == 1) {
                el.siblings('.icon-minus').removeClass('out');
            }

            if(_v == 5) {
                //TODO
//                    $.toast('人数最多5位');
            } else {
                el.prev().text(_v + 1);

                if(el.prev().text() == 5) {
                    el.addClass('out');
                }
            }

            el.data('clock', false);
        }
    });
}

function getQueryString(key, strURL) {
    strURL = strURL || window.location.search;
    return new RegExp("(^|\\?|&)" + key + "=([^&]*)(\\s|&|$)", "i").test(strURL) ? decodeURIComponent(RegExp.$2.replace(/\+/g, " ")) : "";
}

function  shareWX() {
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(userInfo.providerId == 778 || userInfo.providerId == 564 || userInfo.providerId == 194){
        var shareObj = {
            reqURL : window.location.href,
            'title': '黄山全域旅游e网通',
            'desc' : '汽车票、门票官方购票渠道，一站式旅游服务',
            'logo' : 'http://img.static.olakeji.com/6b4/829/880/28b/6b482988028b6d0c0c1dfae5cf8af280.jpg',
        }
        wxActivityConfig(shareObj);
    }

}

$(function () {
    attBaseInfo.storeCode = getQueryString("storeCode");
    attBaseInfo.storeName = getQueryString("storeName");
    swNewsImg();
    initAttList();
    passengerHandle();
    shareWX();
    $.ruleInit();
})