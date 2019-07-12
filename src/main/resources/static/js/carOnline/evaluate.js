$(function() {
    window.localStorage.removeItem("selectedCoupon");
    var orderNo=getQueryString("orderNo");
    backtoUrl('/bus/toOnlineCarOrderDetail?orderNo=' + orderNo + '&token=' + $.cookie('token'));

    /*评价星星*/
    $('.star').each(function (index) {
        var $el = $(this);

        for(var i = 0; i < 5; i++) {
            $el.append('<span></span>');
        }

        if($el.data('size') == "max") {
            $el.addClass('max');
        }

        //绑定事件
        $el.children('span').on('click', function () {
            var $child = $(this);

            $child.nextAll('span').removeClass('active');
            $child.prevAll('span').addClass('active');
            $child.addClass('active');

            //存储
            $child.siblings('input').val($el.children('span.active').length);

            var star = $('#star1').val();
            var params = {
                'star' : star,
                'token' : $.cookie('token')
            }

            $.post("/onlineComment/queryCommentTag",params,function(data){
                if(data.code!='0'){//异常
                    $.alert(data.msg)
                }

                //数据请求成功
                var tagdata=data.data;
                var tagstr=tagdata.text;
                if(tagstr!=""){
                    var tags=tagstr.split("@");
                    var _html="";
                    for(var i=0;i<tags.length;i++){
                        if(i==0){
                            _html+='<span data-value='+tags[i]+' class="active">'+tags[i]+'</span>'
                        }else{
                            _html+='<span data-value='+tags[i]+'>'+tags[i]+'</span>'
                        }
                    }
                }

                $(".tag").html(_html);

                //隐藏目的地车票价格等信息
                $('.journey-info').hide();
                //修改文案评价
                var _starTips = {
                    '1': '很不满意',
                    '2': '不满意',
                    '3': '一般',
                    '4': '满意',
                    '5': '非常满意，无可挑剔'
                };
                $('.evaluate-container').addClass('evaluation');//样式改变
                $('.evaluate-box').show();//显示文字评论区
                $('.star-info').html(_starTips[star]);//评论星级对应的文字
                $('#confirmData').show();//提交评论按钮显示

                bindTag();

            },'json');


        });


    });
    /*
       * tag
       * */

    function  bindTag(){
        $('.tag span').off('click').on('click', function () {
            var $el = $(this),
                $input = $el.siblings('input');
            var _value = $el.data('value'),
                _VAL = $input.val();

            //选中 或 取消
            if(!$el.data('lock')) {
                $el.data('lock', true);
                $el.addClass('active');

                //add
                if($.trim(_VAL) == "") {
                    $input.val(_value);
                } else if($input.val().indexOf(_value) < 0) {
                    $input.val(_VAL + "," + _value);
                }
            } else {
                $el.data('lock', false);
                $el.removeClass('active');

                //remove
                var _index = $input.val().indexOf(_value);
                if(_index >= 0) {
                    var reg = "";
                    if(_index == 0) {
                        reg = new RegExp(_value + ",?", "gi");
                    } else {
                        reg = new RegExp(",?" + _value, "gi");
                    }

                    _VAL = _VAL.replace(reg, "");
                    $input.val(_VAL);
                }
            }
        });

    }


    //字数统计
    $('#message-1').on('input', function() {
        var length = $(this).val().length;
        var _MAX = $(this).data('max');
        utf16toEntities($(this).val());
        if(length <= _MAX) {
            $(this).next('div').attr('class', 'message-length').text(length + '/' + _MAX);
        } else {
            /*$(this).next('div').attr('class', 'sui-red').text('字数太多了');*/
        }
    });

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 匹配目标参数
        var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
        if (result != null) {
            return decodeURIComponent(result[2]);
        } else {
            return null;
        }
    }



    $("#confirmData").off('click').on('click', function () {

        if(orderNo==null||orderNo==""){
            $.toast("订单编号不能为空")
            return;
        }

        var star=$("#star1").val();
        var content=$("#message-1").val();

        var tagSpans=$(".tag span.active");
        var tagIds ="";
        for(var i=0;i<tagSpans.length;i++){
            tagIds+=($(tagSpans[0]).attr("data-value")+"@");
        }
        if(tagSpans.length>0){
            tagIds=tagIds.substring(0,tagIds.length-1)
        }
        var params = {
            'orderNo' : orderNo,
            'star' : star,
            'content' : content,
            'tagIds' : tagIds,
            'token' : $.cookie('token')
        }
        $.post("/onlineComment/submitComment",params,function(data){
            if(data.code!='0'){
                $.alert(data.msg);
                return;
            }
            //成功后跳转到已评价页面
            window.location.href = "evaluated?orderNo="+orderNo+"&token="+$.cookie('token');
        },"json");
    });
});

// 表情转换为字符串
function utf16toEntities(str) {
    var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
    str = str.replace(patt, function(char){
        var H, L, code;
        if (char.length===2) {
            H = char.charCodeAt(0); // 取出高位
            L = char.charCodeAt(1); // 取出低位
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
            return "&#" + code + ";";
        } else {
            return char;
        }
    });
    return str;
}