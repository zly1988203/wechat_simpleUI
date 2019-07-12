<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>删除乘车人</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/common.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/passenger.css?v=${version!}" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
</head>
<body>
	<#include "../foot.ftl"/>
	<div id="delPassenger" class="">
        <div class="sui-popup-mask"></div>
        <div class="">

            <div class="passenger-list-wrapper">
                <ul class="passenger-list sui-list sui-list-cover">
                    <!--
                        data-select：是否选中
                        data-name：  姓名
                        data-phone： 手机号码
                        data-code：  身份证号码
                    -->
                    <#list frePassList as PassengerInfo>
                    <li class="sui-border-b" data-select="false">
                        <div class="name">
                            <input type="checkbox" class="frm-checkbox" name="people" value="${PassengerInfo.id}"/>
                        </div>
                        <div class="info">
                            <h4>${PassengerInfo.passengerName!''}</h4>
                            <p><em>手机号</em>${PassengerInfo.mobile!''}</p>
                            <p><em>身份证</em>${PassengerInfo.idCardNo!''}</p>
                        </div>
                    </li>
                    </#list>
                </ul>
            </div>

            <div class="btn-group">
                <button class="btn primary" id="delete">删除</button>
            </div>

        </div>
    </div>
	
	
<script>
	backtoUrl("/bus/passengerContactInfo/toList");

	$('#cancel').on('click',function(){
		location.href="/bus/passengerContactInfo/toList";
	})
	
	// 选择
    var bindSelected = function() {
        $('#delPassenger input').off('tap').on('tap', function(e) {
            e.stopPropagation();
        });
        $('#delPassenger li').off('tap').on('tap', function() {
            var checkbox = $(this).find('input');
            var checked = checkbox.is(':checked');
            checkbox.prop('checked', !checked);
        });
    }
	
	bindSelected();
    $('#delete').on('click', function() {
    	
    	var idArray = [];
    	var hasSelected = false;
    	$("input[name=people]").each(function(){
		    if(this.checked){
//		    	idArray = idArray + $(this).val().replace(/,/g,'') + ",";
				idArray.push($(this).val());
		    	hasSelected = true;
		    }
		}); 
    	
    	if(!hasSelected){
    		$.toast("请选中需要删除的乘车人！");
    		return;
    	}
    	var idArrays = idArray.join(',');
		//api url
    	var urlStr = '/bus/passengerContactInfo/delete';
    	//current page param
    	var dataObj = {
				idArray: idArrays,
				token:$.cookie('token')
    		};
    	 $.ajax({
             type: 'POST',
             url:urlStr,
             data:dataObj,
             dataType:  "json",
             success: function(result){
            	 if(result&&result.code==0){
            		 $.alert('删除成功', function() {
                 		window.location.href="/bus/passengerContactInfo/toList";
                     });            		
            	 }else{
            		$.alert((result&&result.message) || "未知错误");
            	 }
            	 
             },
       });
	
	});    
</script>
</body>
</html>