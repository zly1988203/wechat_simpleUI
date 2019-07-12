<#include "/_framework.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>添加乘车人</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/base/common.css?v=${version!}" rel="stylesheet" type="text/css">
    <link href="/res/style/bus/passenger.css?v=${version!}" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="/js/commonJs.js?v=${version!}"></script>
    <script src="/js/commonjs/idCard.js?v=${version!}"></script>
</head>

<body>
	<#include "../foot.ftl"/>
	<div id="addPassenger" class="">
        <div class="sui-popup-mask"></div>
        <div class="">

            <div class="add-passenger-wrapper">
                <ul class="form sui-list sui-list-cover">
                    <li class="sui-border-b">
                        <label>姓名</label>
                        <input type="text" id="passengerName" placeholder="请输入姓名" maxlength="10"/>
                    </li>
                    <li class="sui-border-b">
                        <label>手机号</label>
                        <input type="text" id="mobile" placeholder="请输入手机号" maxlength="11"/>
                    </li>
                    <#if (isNeedIdCardNum!'1')== '1' >
                    <li class="sui-border-b">
                        <label>身份证</label>
                        <input type="text" id="idCardNo" placeholder="请输入身份证" maxlength="18"/>
                    </li>
                    </#if>
                </ul>
            </div>

            <div class="btn-group">
                <button class="btn default" id="cancel">取消</button>
                <button class="btn primary" id="add">确定</button>
            </div>

        </div>
    </div>
	

<script>
	backtoUrl("/bus/passengerContactInfo/toList");
	
	$('#cancel').on('click',function(){
		location.href="/bus/passengerContactInfo/toList";
	})
	$('#add').on('click', function() {
	
		var passengerName = $('#passengerName').val();
		var mobile = $('#mobile').val();
		var idCardNo = '';
		if(passengerName==''){
			$.toast('姓名不能为空', function() {
	               console.log('ok');
	           });
			return false;
		}
		if(mobile==''){
			$.toast('手机号码不能为空', function() {
	               console.log('ok');
	           });
			return false;
		}
		if(!/^[\u4E00-\u9FA5]{0,10}$/.test(passengerName)){
			$.toast('请输入10位以内中文姓名', function() {
	               console.log('ok');
	           });
            return false;
        }
		if(!/^1\d{10}$/.test(mobile)){
			$.toast('请填写正确手机号', function() {
	               console.log('ok');
	           });
            return false;
        }
		/* if(!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(idCardNo) && 
				!/^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/.test(idCardNo)){
			$.toast('请填写正确身份证', function() {
	               console.log('ok');
	           });
            return false;
        } */
        var isNeedIdCardNum = '${isNeedIdCardNum!'1'}'
        if(isNeedIdCardNum == '1'){
	        idCardNo = $.trim($('#idCardNo').val());
			//判断身份证是否合法
	     	var flag = new clsIDCard(idCardNo);
	         if(!flag.Valid){
	        	 $.toast('请填写正确身份证');
	             return false;
	   		}
        }
		//api url
    	var urlStr = '/bus/passengerContactInfo/addContact';
    	//current page param
    	var dataObj = {
    			passengerName: passengerName,
				mobile: mobile,
				idCardNo: idCardNo,
				token:$.cookie('token')
    		};
    	//merge page param and common param,generate request param
//		dataObj = genReqData(urlStr, dataObj);
    	 $.ajax({
             type: 'POST',
             url:urlStr,
             data:dataObj,
             dataType:  "json",
             success: function(result){
            	 if(result&&result.code==0){
            		 $.alert('添加成功', function() {
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