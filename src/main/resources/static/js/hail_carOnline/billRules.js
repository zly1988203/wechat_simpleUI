    $(function () {
    	function getQueryString(name) {
    		  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 匹配目标参数
    		  var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
    		  if (result != null) {
    		    return decodeURIComponent(result[2]);
    		  } else {
    		    return null;
    		  }
    	}
    	 var type=getQueryString("type");
    	 var globeCityId=getQueryString("cityId");
    	 var orderNo=getQueryString("orderNo");
    	 
    	 backtoUrl('/hail/bus/toOnlineCarOrderDetail?orderNo=' + orderNo + '&token=' + $.cookie('token'));
    	 var cityId;
    	 var params = {
				'token' : $.cookie('token')
				}
    	//查询开通城市
    	 $.post("/hail/baseOnlineCar/openCity",params,function(data){
    		 if(data.code!='0'){
    			 return;
    		 }
    		 var citydiv=$(".cities");
    		 citydiv.html("");
    		 var citys=data.data;
    		 var hasCity=false;
    		 for(var i=0;i<citys.length;i++){
    			 if(citys[i].cityId==globeCityId){
    				 hasCity=true;
    				 cityId=citys[i].id;
    				 citydiv.append("<li data-id="+citys[i].id+"  class='active'>"+citys[i].cityName+"</li>");
    			 }else{
    				 citydiv.append("<li data-id="+citys[i].id+">"+citys[i].cityName+"</li>");
    			 }
    		 }
    		 
    		 if(!hasCity){
    			 $.toast("没有开通相应的城市！！")
    		 }
    		 
    		  $('.rules-table-container').empty();
    	        $.showLoading();
   	            $.hideLoading();
   	            //重新加载计费规则数据
   	            getBillRules(cityId,type);
    	        
    	       
    		 
    		  /*计费规则导航栏城市选择*/
    	        $('.popup-header .cities li').on('click',function () {
    	            var _self = this;
    	           	cityId = this.getAttribute("data-id");
    	            $(_self).addClass('active').siblings().removeClass('active');
    	            //重新选择城市时，默认选择第一个孩子节点
    	            $('.bill-rules-content .sub-nav .nav-item:first-child').addClass('nav-active').siblings().removeClass('nav-active');

    	            $('.rules-table-container').empty();
    	            $.showLoading();
   	                $.hideLoading();
   	                //重新加载计费规则数据
   	                getBillRules(cityId,type);
    	        });
    		  
    		  
    	        /*二级导航栏点击重新加载计费规则数据*/
    	        $('.bill-rules-content .sub-nav .nav-item').off("click").on('click',function () {
    	            var _self = this;
    	            $(_self).addClass('nav-active').siblings().removeClass('nav-active');
    	            $('.rules-table-container').empty();
    	            $.showLoading();
    	            $.hideLoading();
    	             //重新加载计费规则数据
    	             getBillRules(cityId,type);
    	        });
    		 
		},'json');
    	
    	 $('.rules-table-container').empty();
      
    	 if(type=='1'){
    		 var navitemdivs=$('.bill-rules-content .sub-nav .nav-item');
    		 $(navitemdivs[0]).addClass('nav-active').siblings().removeClass('nav-active');
	      }else{
	    	  var navitemdivs=$('.bill-rules-content .sub-nav .nav-item');
	   		  $(navitemdivs[1]).addClass('nav-active').siblings().removeClass('nav-active');
	      }

      
    });

    /* 动态生成定价规则表*/
    function getBillRules(cityId,type){
    	if(cityId==null||cityId==''){
    		return;
    	}
    	if(type==null||type==''){
    		return;
    	}
    	var params = {
 			'token' : $.cookie('token'),
 			'cityId' : cityId,
 			'type' : type
 		}
	   	$.post("/hail/baseOnlineCar/queryPriceRule",params,function(data){
	   		if(data.code!='0'||data.data==null){
	   			return;
	   		}
	   		
	   	var rule=data.data;
	   	var nightBasePrice = rule.nightBasePrice ? rule.nightBasePrice : 0;
	   	var nightServerBeginTime=rule.nightServerBegin;
	   	var nightServerEndTime=rule.nightServerEnd;
	   	var nightServerBeginTimeStr=new Date(nightServerBeginTime).format("hh:mm");
	 	var nightServerEndTimeStr=new Date(nightServerEndTime).format("hh:mm");
	 	if(nightServerBeginTime>nightServerEndTime){
	 		nightServerEndTimeStr="次日"+nightServerEndTimeStr;
	 	}
	 	
	 	var morningBusiTimeBegin=new Date(rule.morningBusiTimeBegin).format("hh:mm");
	 	var morningBusiTimeEnd=new Date(rule.morningBusiTimeEnd).format("hh:mm");
	 	var nightBusiTimeBegin=new Date(rule.nightBusiTimeBegin).format("hh:mm");
	 	var nightBusiTimeEnd=new Date(rule.nightBusiTimeEnd).format("hh:mm");
	 	
	   	 var _html =
	            "<table>" +
	            "<tr>" +
	            "<td style='width: 50%'>" + "基础价格" +"</td>" +
	            "<td>" +rule.basePrice+"元"+"</td>" +
	            "</tr>" +
				 "<tr>" +
				 "<tr>" +
				 "<td style='width: 50%'>" + "夜间基础价格" +"</td>" +
				 "<td>" + nightBasePrice +"元"+"</td>" +
				 "</tr>" +
	            "<tr>" +
	            "<td>" +"公里数（含）"+"</td>" +
	            "<td>" +rule.baseKm+"公里"+"</td>" +
	            "</tr>" +
	            "<tr>" +
	            "<td>" +"基础时长（含）"+"</td>" +
	            "<td>" +rule.baseTime+"分钟"+"</td>" +
	            "</tr>" +
	            "<tr>" +
	            "<td>" +"超里程费（元／公里）"+"</td>" +
	            "<td>" +rule.moreKmPrice+"</td>" +
	            "</tr>" +
	            "<tr>" +
	            "<td>" +"超时长费（元／分钟）"+"</td>" +
	            "<td>" +"<div>" +"平峰"+rule.moreTimePrice1+"</div>" +"<div>" +"高峰"+rule.moreTimePrice2+"</div>" +"</td>" +
	            "</tr>" +
	            "<tr>" +
	            "<td>" +"等候费（元／分钟）"+"</td>" +
	            "<td>" +rule.waitPrice+"</td>" +
	            "</tr>" +
	            "<tr>" +
	            "<td>" +"回空里程（元/公里）"+"</td>" +
	            "<td>" +rule.backKm+"</td>" +
	            "</tr>" +
	            
	            "<tr>" +
	            "<td>" +"回空里程单价（元/公里）"+"</td>" +
	            "<td>" +rule.backPriceKm+"</td>" +
	            "</tr>" +
	            
	            

	            "<tr>" +
	            "<td>" +"夜间服务里程附加费（元／公里）"+"</td>" +
	            "<td>" +rule.nightKmExPrice+"</td>" +
	            "</tr>" +
	            
	            "<tr>" +
	            "<td>" +"夜间服务时长附加费（元／分钟）"+"</td>" +
	            "<td>" +rule.nightTimeExPrice+"</td>" +
	            "</tr>" +


	            "<tr>" +
	            "<td>" +"夜间服务时段"+"</td>" +
	            "<td>" +"<div>" +nightServerBeginTimeStr+"到"+nightServerEndTimeStr+"</div></td>" +
	            "</tr>" +
	            "<tr>" +
	            "<td>" +"高峰服务时段"+"</td>" +
	            "<td>" +
	            "<div>" +"<span>" +"工作日"+"</span>" +"<span>" + morningBusiTimeBegin + " - " + morningBusiTimeEnd + "<br/>" + nightBusiTimeBegin + " - " + nightBusiTimeEnd + "</span>" +"</div>" +
	            "<div>" +"国家法定节假日高峰期服务时段以实际为准"+"</div>" +
	            "</td>" +
	            "</tr>" +
	            "</table>";
	        $('.rules-table-container').html(_html);
	   		
	   	},'json');
        //动态生成价格表
    }
