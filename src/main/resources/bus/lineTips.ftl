<div class="tags" id="lineTips" style="display:none">
        <p>地图显示的的行车路线仅供参考</p>
        <p>乘车请以站点为准</p>
        <i class="close"></i>
    </div>
    <script src="/js/zepto.min.js"></script>
    <script src="/js/zepto.cookie.js"></script>
<script>
	//仅供参考冒泡
    if($.cookie('lineTips')==undefined){
    	$.cookie('lineTips','1');
    	$('#lineTips').show();
    }
    //关闭线路提示
    $('.tags .close').on('click', function () {
       $('.tags').remove();
    });
</script>