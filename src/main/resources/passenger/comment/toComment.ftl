<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>评价</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="/res/style/evaluate/evaluate.css?v=${version!}">
    <!-- start Dplus --><script src="/js/udplus.js"></script><!-- end Dplus -->
</head>

<body>
    <input type="file" class="" id="file" style="display:none;" onChange="change(this);" />
    <div class="evaluate">
        <div class="title">您的评价将帮助我们提升服务品质</div>

        <div class="content">
            <div class="item" style="display: block;">
                <h2>综合评价</h2>
                <div class="star" data-size="max" id="overAllStar"><input type="hidden" id="start1"></div>
            </div>
            <div class="item" id="comment1">
                <h4 class="caption">司机服务</h4>
                <div class="star"><input type="hidden" id="start2"></div>
                <div class="tag" id="tag1">
                    <span data-value="卫生很好">卫生很好</span>
                    <span data-value="行驶平稳">行驶平稳</span>
                    <span data-value="态度好">态度好</span>
                    <span data-value="准时到站">准时到站</span>
                </div>
            </div>
            <div class="item" id="comment2">
                <h4 class="caption">车辆体验</h4>
                <div class="star"><input type="hidden" id="start3"></div>
                <div class="tag" id="tag2">
                    <span data-value="卫生很好">卫生很好</span>
                    <span data-value="行驶平稳">行驶平稳</span>
                    <span data-value="态度好">态度好</span>
                    <span data-value="准时到站">准时到站</span>
                </div>
            </div>
            <div class="item" id="comment3">
                <h4 class="caption">准点情况</h4>
                <div class="star"><input type="hidden" id="start4"></div>
                <div class="tag" id="tag3">
                    <span data-value="卫生很好">卫生很好</span>
                    <span data-value="行驶平稳">行驶平稳</span>
                    <span data-value="态度好">态度好</span>
                    <span data-value="准时到站">准时到站</span>
                </div>
            </div>
        </div>

        <div class="custom">
            <div class="item">
                <h4 class="caption">其他意见</h4>
                <label class="message-area" for="message-1">
                    <textarea id="message-1" data-max="200" placeholder="其他意见和建议（内容匿名，可放心填写）"
                        maxlength="200"></textarea>
                    <div class="message-length">0/200</div>
                </label>
            </div>
            <div class="item">
                <h4 class="caption">上传照片</h4>
                <div class="upload-img">

                    <div class="choose"></div>
                </div>
            </div>
        </div>

        <div class="btn-group">
            <div class="btn primary" id="submit">提交评价</div>
        </div>
    </div>
	
    <script src="/js/commonBus.js?v=${version!}"></script>
    <script src="/js/vectors.min.js?v=${version!}"></script>
    <script src="/js/commutingBus/serverApi.js"></script>
    <script src="/js/commonjs/jweixin-1.2.0.js?v=${version!}"></script>
    <script type="text/javascript" src="/js/shareConfig.js?v=${version!}"></script>
	<script>
        var shareObj = { url : window.location.href }
   		wxInitConfig(shareObj);
        // 获取url的参数
        function getRequest() {
            var url = location.search; //获取url中"?"符后的字串  
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }
        var getUrlRequest = getRequest();
        //准备评价
        var isComment1;
        var isComment2;
        var isComment3;
        var tagList1 = '';
        var tagList2 = '';
        var tagList3 = '';
        var lineType = "";
		var ticketId = "";
        if ("lineType" in getUrlRequest) {
            lineType = getUrlRequest.lineType;
        }
        var pram = {
            token: serverUtil.token,
            orderNo: getUrlRequest.orderNo,
            busId: getUrlRequest.busId,
            lineType: lineType
        }
        $.showLoading("加载中...");
        request(commuteApi.toCommentBusBefore, pram,true).then(function (res) {
            $.hideLoading();
            if (res.code == 0) {
				ticketId = res.data.ticketId;
                isComment1 = res.data.isComment1;
                isComment2 = res.data.isComment2;
                isComment3 = res.data.isComment3;
                //初始化标签列表
                tagList1= res.data.tag1list;
                tagList2= res.data.tag2list;
                tagList3= res.data.tag3list;
                if(res.data.commentTitle1 !=undefined){
                    $("#comment1 .caption").html(res.data.commentTitle1);
                }
                if(res.data.commentTitle2 !=undefined){
                    $("#comment2 .caption").html(res.data.commentTitle2);
                }
                if(res.data.commentTitle3 !=undefined){
                    $("#comment3 .caption").html(res.data.commentTitle3);
                }
            }else if(res.code == 1006){
                window.location = '/comment/toCommentDetailBus?busId=' + getUrlRequest.busId+'&orderNo='+getUrlRequest.orderNo;
			} else {
                alert(res.message);
                window.history.go(-1);
            }
        });
        var providerDomin = document.domain.split('.')[0];
        $(function () {
            /*
            * star
            * */
            $('.star').each(function (index) {
                var $el = $(this);

                for (var i = 0; i < 5; i++) {
                    $el.append('<span data-num=' + (i + 1) + '></span>');
                }

                if ($el.data('size') == "max") {
                    $el.addClass('max');
                }

                //绑定事件
                $el.children('span').on('click', function () {
                    var $child = $(this);
                    $child.nextAll('span').removeClass('active');
                    $child.prevAll('span').addClass('active');
                    $child.addClass('active');

                    var num = $(this).data('num');
                    //根据num星级查询标签
                    queryTags(num, $(this).parent().next('.tag'));
                    $(this).parent().next('.tag').show();
                    //存储
                    //                   $child.siblings('input').val($el.children('span.active').length);
                });
                //第一次点击综合评价
                if (index == 0) {
                    $el.children('span').one('click.action', function () {
                        $(this).parents('.item').nextAll().show();
                        if (isComment1 == 0) {
                            $("#comment1").hide();
                        }
                        if (isComment2 == 0) {
                            $("#comment2").hide();
                        }
                        if (isComment3 == 0) {
                            $("#comment3").hide();
                        }
                        $('.custom').show();
                        $('.btn-group').show();
                    });
                }

                //开启标签
                //                $el.children('span').on('click', function () {
                //                	var num = $(this).data('num');
                //根据num星级查询标签
                //                	queryTags(num,$(this).parent().next('.tag'));
                //                   $(this).parent().next('.tag').show();
                //                });
            });

            function queryTags(num, _this) {
                var id = _this.attr('id');
                if (id == 'tag1') {
                    strHtml = getTags(num, tagList1, _this);
                } else if (id == 'tag2') {
                    strHtml = getTags(num, tagList2, _this);
                } else if (id == 'tag3') {
                    strHtml = getTags(num, tagList3, _this);
                }
            }

            function getTags(num, tagList, _this) {
                var strHtml = '';
                for (var i = 0; i < tagList.length; i++) {
                    if (tagList[i].star == num) {
                        var content = tagList[i].text;
                        if (content != '') {
                            var contentArray = content.split('@');
                            for (var j = 0; j < contentArray.length; j++) {
                                strHtml += '<span data-value=' + contentArray[j] + '>' + contentArray[j] + '</span>';
                            }
                        }
                    }
                }
                _this.empty();
                _this.append(strHtml);
                $('.tag span').off('click').on('click', function () {
                    var $el = $(this);
                    var _value = $el.data('value');

                    //选中 或 取消
                    if (!$el.data('lock')) {
                        $el.data('lock', true);
                        $el.addClass('active');

                    } else {
                        $el.data('lock', false);
                        $el.removeClass('active');

                    }
                });
            }


            //字数统计
            $('#message-1').on('input', function () {
                var param = $(this).val();
                var regRule = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
                if (regRule.test(param)) {
                    param = param.replace(regRule, "");
                    $("#message-1").val(param);
                }
                var length = param.length;
                var _MAX = $(this).data('max');
                if (length <= _MAX) {
                    $(this).next('div').attr('class', 'message-length').text(length + '/' + _MAX);
                } else {
                }
            });

            /*
            * 上传图片
            * */
            $('.preview .close').on('click', function () {
                //删除图片
                $(this).parent().remove();
            });

            $('#submit').on('click', function () {
                dplus.track("评价详情-提交评价", {
                    "车企": providerDomin,
                    "业务": "定制班线/通勤班线",
                    "页面名称": "评价详情",
            	});
                //获取总星级
                var overallStar = $('#overAllStar .active').length;
                //获取各tag星级评分
                var comment1 = $('#comment1 .star .active').length;
                var comment2 = $('#comment2 .star .active').length;
                var comment3 = $('#comment3 .star .active').length;
                //获取各tag内容
                var comment1Txt = getTagList($('#tag1 .active'));
                var comment2Txt = getTagList($('#tag2 .active'));
                var comment3Txt = getTagList($('#tag3 .active'));
                //获取意见内容
                var remark = $('#message-1').val();
                //图片
                var imgRes = getImgs();
                if (overallStar <= 0 || overallStar > 5) {
                    $.toast('请给综合评价');
                    return;
                }
                var length = $('#message-1').val().length;
                var _MAX = $('#message-1').data('max');
                if (length > _MAX) {
                    $.toast('其他意见栏目字数太多');
                    return;
                }
                var data = {
                        token: serverUtil.token,
                        overallStar: overallStar,
                        comment1: comment1,
                        comment2: comment2,
                        comment3: comment3,
                        comment1Txt: comment1Txt,
                        comment2Txt: comment2Txt,
                        comment3Txt: comment3Txt,
                        remark: remark,
                        orderNo: getUrlRequest.orderNo,
						busId:getUrlRequest.busId,
                        imgRes: imgRes,
						lineType: lineType
                    }
                $.showLoading("加载中...");
                request(commuteApi.addCommentBus, data,true).then(function (res) {
                    $.hideLoading();
                    if (res.code == 0) {
		   	        	$.alert('添加成功');
		   	        	window.location='/comment/toCommentSuccess?ticketId='+ticketId;
                    } else {
                        $.alert(res.message);
                    }
                });
            })

            function getTagList(_this) {
                var tagIdValues = [];
                _this.each(function () {
                    tagIdValues.push($(this).html())
                });
                return tagIdValues.join('@');
            }

            function getImgs() {
                var img = [];
                $('.upload-img .preview img').each(function () {
                    img.push($(this).attr('src'));
                });
                return img.join(',');
            }


            $('.choose').on('click', function () {
                if (is_weixn()) {
                    upImageWx();
                } else {
                    $('#file').click();
                }
            })
            var uploadNum;
            var hasUploadNum;
            function upImageWx() {
                wx.chooseImage({
                    count: 3 - $('.upload-img .preview').length, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        $.showLoading('上传中');
                        localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        uploadNum = localIds.length;
                        hasUploadNum = 0;
                        syncUpload(localIds);
                    }
                });
            }

            var syncUpload = function (localIds) {
                var localId = localIds.pop();
                wx.uploadImage({
                    localId: localId,
                    isShowProgressTips: 0,
                    success: function (res) {
                        var serverId = res.serverId; // 返回图片的服务器端ID
                        downloadWxPicAndUploadQiNiu(serverId);
                        //其他对serverId做处理的代码
                        if (localIds.length > 0) {
                            syncUpload(localIds);
                        }
                    }
                });
            };


            function downloadWxPicAndUploadQiNiu(serverId) {
                //api url
                var urlStr = "/comment/downloadWxPicAndUploadQiNiu";
                var dataObj = {
                    serverId: serverId,
                };

                $.ajax({
                    type: 'POST',
                    url: urlStr,
                    data: dataObj,
                    dataType: 'json',
                    success: function (result) {
                        if (result && result.code == 0) {
                            var html = '<div class="preview">' +
                                '<span class="close"></span>' +
                                '<img src="' + result.data + '">' +
                                '</div>';
                            //判断此时的数目
                            var length = $('.upload-img .preview').length;
                            if (length >= 2) {
                                $('.choose').hide();
                            }
                            $('.choose').before(html);

                            deleteClickEvent();
                            previewEvent();
                            hasUploadNum++;
                            if (hasUploadNum >= uploadNum) {
                                $.hideLoading();
                            }
                        } else {
                            $.alert((result && result.message) || "未知错误");
                            hasUploadNum++;
                            if (hasUploadNum >= uploadNum) {
                                $.hideLoading();
                            }
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        hasUploadNum++;
                        if (hasUploadNum >= uploadNum) {
                            $.hideLoading();
                        }
                    }
                });
            }

        });
        function change(obj) {
            readFile(obj);
        }

        function readFile(obj) {
            if (obj.files.length < 1) {
                return false;
            }
            var file = obj.files[0];
            var reader = new FileReader();
            var fileName = file.name;

            //判断类型是不是图片  
            if (!/image\/\w+/.test(file.type)) {
                $.toast("请确保文件为图像类型");
                return false;
            }

            reader.readAsDataURL(file);
            reader.onload = function (e) {
                //console.log(this.result);
                upload(this.result, fileName);
            }

        }
        function upload(content, fileName) {
            $.showLoading('照片上传中');
            //api url
            var urlStr = "/comment/uploadImg";
            //current page param
            var dataObj = {
                baseContent: content,
                fileName: fileName,
            };
            $.post(urlStr, dataObj, function (result) {
                if (result && result.code == 0) {
                    var html = '<div class="preview">' +
                        '<span class="close"></span>' +
                        '<img src="' + result.data + '">' +
                        '</div>';
                    //判断此时的数目
                    var length = $('.upload-img .preview').length;
                    if (length >= 2) {
                        $('.choose').hide();
                    }
                    $('.choose').before(html);

                    deleteClickEvent();
                    previewEvent();
                    $.hideLoading();
                } else {
                    $.alert((result && result.message) || "未知错误");
                    $.hideLoading();
                }
            }, 'json');
        }

        function deleteClickEvent() {
            /*
               * 上传图片
               * */
            $('.preview .close').off('click').on('click', function () {
                //删除图片
                $(this).parent().remove();
                //判断此时的数目
                var length = $('.upload-img .preview').length;
                if (length <= 2) {
                    $('.choose').show();
                }
            });
        }

        function previewEvent() {
            $('.preview img').off('click').on('click', function () {
                var url = $(this).attr('src');
                wx.previewImage({
                    current: url, // 当前显示图片的http链接
                    urls: getImg() // 需要预览的图片http链接列表
                });

            })
        }

        function getImg() {
            var img = [];
            $('.upload-img .preview img').each(function () {
                img.push($(this).attr('src'));
            });
            return img;
        }
        //judge open use browser of weixin or not
        function is_weixn() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        } 
    </script>
</body>
</html>