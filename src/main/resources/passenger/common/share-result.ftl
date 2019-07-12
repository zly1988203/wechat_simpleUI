<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>查看行程</title>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <link href="/res/commonStyle/simpleui.min.css" rel="stylesheet" type="text/css">
    <link href="/res/commonStyle/common.css" rel="stylesheet" type="text/css">
    <link href="/res/style/share/share-result.css" rel="stylesheet" type="text/css">
    
</head>

<body>
	<#include "../foot.ftl"/>
	<input type="hidden" id="orderNo" value="${orderNo}">
	<input type="hidden" id="hail" value="${hail!''}">
	<header>
        <div class="sui-border-b">
            <div class="logo"></div>
            <!--<button data-href="#">下载APP</button>-->
	    </div>
	</header>
	
	<div id="mapContainer"></div>
	
	<div class="route-wrap">
	    <div class="route-container sui-border">
	        <h1 id='nickName' class="sui-border-b"></h1>
	        <ul>
	            <li class="start">
	                <div class="address"></div>
	                <div class="datetime"></div>
	            </li>
	            <li class="end">
	                <div class="address"></div>
	                <div class="datetime"></div>
	            </li>
	        </ul>
	        <div class="driver-info">
	            <div class="avatar"></div>
	            <div class="info">
	                <div class="name-star">
	                    <span class="name"></span>
	                    <div class="star">
	                    	<span>4.5</span>
	                    </div>
	                </div>
	                <div class="attribute">
	                    
	                </div>
	            </div>
	        </div>
	    </div>
	</div>
	
	<script type="text/javascript" src="/js/commonJs.js"></script>
	<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.3&key=378c8e571ebb3a992687b061f729857a"></script>
	<script>
		var hail = $('#hail').val();
    	var orderNo = $('#orderNo').val();
    	//api url
		var urlStr = SERVER_URL_PREFIX+hail+"/order/queryRoute";
		//current page param
		var dataObj = {
			orderNo:orderNo,
		};
		//merge page param and common param,generate request param
		dataObj = genReqData(urlStr, dataObj);

        $.post(urlStr,dataObj,function(result){
        	var code= result.code;
        	if(!(result&&code==0)){
        		window.location=CURRENT_SERVER+'/passenger/common/share-result-expiry.html';
        		return;
        	}else{
        		var lineArr =[];
        		var data = result.data
        		var lbsArray = data.lbsList;
        		var center = [];
        		var order_depart = [data.order.departLng,data.order.departLat];
        		var order_arrive = [data.order.arriveLng,data.order.arriveLat];
        		
        		//center = [lbsArray[lbsArray.length-1].lng,lbsArray[lbsArray.length-1].lat];
        		center = [data.order.departLng,data.order.departLat];
        		var map = new AMap.Map('mapContainer', {
        	        resizeEnable: true,
        	        zoom: 17,
        	        center: center,
        	      });
        	      
        	    var marker = new AMap.Marker({
        	        icon: new AMap.Icon({
        	            size: new AMap.Size(19, 27),
        	            image: '/res/images/solo/map_user.png',
        	            imageSize: new AMap.Size(14, 18)
        	        }),
        	        position : center,
        	        offset : new AMap.Pixel(-7,-9),
        	        label: {
        	            offset: new AMap.Pixel(-18, 30),
        	            content: "用户位置"
        	        },
        	        map : map
        	    });
        	      
        	    if(lbsArray != undefined){
        	    	var marker = new AMap.Marker({
	        	        icon: new AMap.Icon({
	        	            size: new AMap.Size(19, 27),
	        	            image: '/res/images/solo/map_start.png',
	        	            imageSize: new AMap.Size(14, 18)
	        	        }),
	        	        position : [lbsArray[0].lng,lbsArray[0].lat],
	        	        offset : new AMap.Pixel(-7,-9),
	        	        label: {
	        	            offset: new AMap.Pixel(-18, 30),
	        	            content: "司机出发位置"
	        	        },
	        	        map : map
	        	    });
        	    }
        		
        		/*
        		if(data.order.departLat!=0){
        			new AMap.Marker({
        	            icon: new AMap.Icon({
        	                size: new AMap.Size(14, 30),
        	                image: '/res/images/solo/map_start.png',
        	                imageSize: new AMap.Size(14, 30)
        	            }),
        	            position : [data.order.departLng,data.order.departLat],
        	            //position : [lbsArray[0].lng,lbsArray[0].lat],
        	            offset : new AMap.Pixel(-7,-15),
        	            label: {
        	                offset: new AMap.Pixel(-15, -25),
        	                content: "出发地"
        	            },
        	            map : map
        	        });
        		}*/
        		
        		if(data.order.arriveLat != 0){
        			new AMap.Marker({
        	            icon: new AMap.Icon({
        	                size: new AMap.Size(14, 30),
        	                image: '/res/images/solo/map_end.png',
        	                imageSize: new AMap.Size(14, 30)
        	            }),
        	            //position : [data.order.arriveLng,data.order.arriveLat],
        	            position : order_arrive,
        	            offset : new AMap.Pixel(-7,-15),
        	            label: {
        	                offset: new AMap.Pixel(-15, 35),
        	                content: "目的地"
        	            },
        	            map : map
        	        });
        		}
        		if(lbsArray != undefined){
	        		for(var i=0;i<lbsArray.length;i++){
	        			lineArr.push([lbsArray[i].lng, lbsArray[i].lat]);
	        		}
        		}
        		
       		    // 绘制轨迹
       		    var polyline = new AMap.Polyline({
       		        map: map,
       		        path: lineArr,
       		        strokeColor: "#00A",  //线颜色
       		        strokeOpacity: 0.5,     //线透明度
       		        strokeWeight: 3,      //线宽
       		        strokeStyle: "solid"  //线样式
       		    });
       		    //有就显示昵称，没有就显示手机号码,不管url传过来什么，统一由后台查表获取
       		    var nickName = data.user.nickName;
       		    if(nickName == null || nickName ==''){
       		    	$('#nickName').html(data.user.mobile);
       		    }else{
       		    	$('#nickName').html(nickName);
       		    }
       		    $('.logo').html(data.providerName);
       		    $('.start .address').html(data.order.departTitle);
       		    $('.end .address').html(data.order.arriveTitle);
       		    var getOnCarTime='';
       		    var getOffCarTime='';
       		    if(data.order.pickerPsgTime!=0){
       		    	getOnCarTime = getLocalTime4(data.order.pickerPsgTime);
       		    }
       		 	if(data.order.arriveTime!=0){
       		 		getOffCarTime = getLocalTime4(data.order.arriveTime);
    		    }
    		    
       		 	$('.start .datetime').html(getOnCarTime+"上车");
       		 	$('.end .datetime').html(getOffCarTime+"下车");
       		 	$('.name').html(data.driver.name);
       		 	//城际约车
       		 	if(data.order.orderType==2){
       		 		$('.attribute').html(data.innerCityOrder.color+" · "+data.innerCityOrder.names+""+data.innerCityOrder.modelName+" 	"+data.innerCityOrder.carNo);
       		 	}else{
       		 		$('.attribute').html(data.driverInfo.belongCompany);
       		 	}
       		 	
       		 	if(!isEmpty(data.avatar)){
       		 		$('.avatar').attr('style','background-image: url('+data.avatar+')');
       		 	}
       		 	$('.star span').html(data.star.toPrecision(2));
       		 	
        	}
        	
        	
        },'json');
 
    </script>
</body>
</html>
