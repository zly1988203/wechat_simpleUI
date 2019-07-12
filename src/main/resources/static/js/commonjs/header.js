function getBusinessTypes(pageName){
		
		//兼容安卓
        function iAndroid(){
            if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
            if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
            if (/Silk/i.test(navigator.userAgent)) return false;
            if (/Android/i.test(navigator.userAgent)) {
                var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
                return parseFloat(s[0]+s[3]) < 44 ? false : true
            }
        }
		
    		$.ajax({
       	        type: 'POST',
       	        url: '/getBusinessTypes',
       	        data: {},
       	        dataType:  'json',
       	        success: function(data){
					if(data.code == 0){
						sessionStorage.setItem("businessTypes",JSON.stringify(data.data));
						var headerTitleHtml = '<div class="content">'
												+'<i class="icon"></i>'
												+'<ul class="list">'
												+ '<li id="interCityOnline" class="" data-icon="car" data-href="/hail/interCityIndex" style="display:none">'+data.data.isInterCityOnlineTxt+'</li>'
												+ '<li id="innerCityOnline" class="" data-icon="car" data-href="/hail/onlineIndex" style="display:none">'+data.data.isInnerCityOnlineTxt+'</li>'
												/*+'<li id="busline" class="" data-icon="bus" data-href="/busIndex" style="display:none">'+data.data.busTxt+'</li>'*/
												+'<li id="busCity" class="" data-icon="bus" data-href="/busIndex" style="display:none">'+data.data.busTxt+'</li>'
												+'<li id="travel" class="" data-icon="bus" data-href="/travelIndex" style="display:none">'+data.data.travelTxt+'</li>'
												+ '<li id="commute" class="" data-icon="bus" data-href="/commuteIndex" style="display:none">'+data.data.commuteTxt+'</li>'
												+ '<li id="busTicket" class="" data-icon="bus"  data-href="/busTicketIndex" style="display:none">'+data.data.busTicketTxt+'</li>'
												+ '<li id="onlineCar" class="" data-icon="car"  data-href="/onlineIndex" style="display:none">'+data.data.onlineTxt+'</li>'
												+ '<li id="innerCity" class="" data-icon="car" data-href="/interCityIndex" style="display:none">'+data.data.interCityTxt+'</li>'
												+ '<li id="chartered" class="" data-icon="car" data-href="/charteredCarIndex" style="display:none">'+data.data.isCharteredTxt+'</li>'
												+ '<li id="taxi" class="" data-icon="bus" data-href="/index?type=1" style="display:none">出租车</li>';
											+'</ul>'
											+'</div>';
						$('#headerList').html(headerTitleHtml);
						
						var data_href_event = iAndroid() ? 'tap' : 'click';
						
						//tab切换
						$('[data-href]').on(data_href_event, function () {
							var self = $(this);
							//绑定点击链接事件
							window.location.href = self.data('href');
						});
						var urlList = [];
						var activityFlag = false;
						var serviceNameObj = {};//业务名称
						if(data.data.hasBus ==1){
							if(data.data.busTxt==undefined){
								// $('#busline').html('定制大巴');
								$('#busCity').html('定制大巴');
							}
							// $('#busline').show();
							$('#busCity').show(); // 优化
							// urlList.push('busline');
							urlList.push('busCity');
							serviceNameObj.busTxt = data.data.busTxt!=undefined?data.data.busTxt:'定制大巴';
						}
						if(data.data.hasTravel ==1){
							if(data.data.travelTxt==undefined){
								$('#travel').html('旅游班线');
							}
							$('#travel').show()
							urlList.push('travel');
							serviceNameObj.travelTxt = data.data.travelTxt!=undefined?data.data.travelTxt:'旅游班线';
						}
						if(data.data.hasCommute ==1){
							if(data.data.commuteTxt==undefined){
								$('#commute').html('通勤大巴');
							}
							$('#commute').show()    
							urlList.push('commute');
							serviceNameObj.commuteTxt = data.data.commuteTxt!=undefined?data.data.commuteTxt:'通勤大巴';
						}
						if(data.data.hasOnline ==1){
							if(data.data.onlineTxt==undefined){
								$('#onlineCar').html('网约车');
							}
							$('#onlineCar').show()    
							urlList.push('onlineCar');
							serviceNameObj.onlineTxt = data.data.onlineTxt!=undefined?data.data.onlineTxt:'网约车';
						}
						if(data.data.hasInterCity ==1){
							if(data.data.interCityTxt==undefined){
								$('#innerCity').html('城际约车');
							}
							$('#innerCity').show();
							urlList.push('innerCity');
							serviceNameObj.interCityTxt = data.data.interCityTxt!=undefined?data.data.interCityTxt:'城际约车';
						}
						if(data.data.hasTaxi ==1){
							$('#taxi').show()
							urlList.push('taxi');
						}
						if(data.data.hasBusTicket ==1){
							if(data.data.busTicketTxt==undefined){
								$('#busTicket').html('汽车票');
							}
							$('#busTicket').show()  
							urlList.push('busTicket');
							serviceNameObj.busTicketTxt = data.data.busTicketTxt!=undefined?data.data.busTicketTxt:'汽车票';
						}
						
						if(data.data.isChartered ==1){
							if(data.data.isCharteredTxt==undefined){
								$('#chartered').html('预约包车');
							}
							$('#chartered').show()
							urlList.push('chartered');
							serviceNameObj.isCharteredTxt = data.data.isCharteredTxt!=undefined?data.data.isCharteredTxt:'预约包车';
						}

						if(data.data.hasInterCityOnline==1){
							if(data.data.isInterCityOnlineTxt==undefined){
								$('#interCityOnline').html('城际网约车');
							}
							$('#interCityOnline').show()
							urlList.push('interCityOnline');
							serviceNameObj.isInterCityOnlineTxt = data.data.isInterCityOnlineTxt!=undefined?data.data.isInterCityOnlineTxt:'城际网约车';
						}

						if(data.data.hasInnerCityOnline==1){
							if(data.data.isInnerCityOnlineTxt==undefined){
								$('#innerCityOnline').html('同城网约车');
							}
							$('#innerCityOnline').show()
							urlList.push('innerCityOnline');
							serviceNameObj.isInnerCityOnlineTxt = data.data.isInnerCityOnlineTxt!=undefined?data.data.isInnerCityOnlineTxt:'同城网约车';
						}

						localStorage.setItem('serviceNameObj',JSON.stringify(serviceNameObj));
						if(data.data.num<=1){
							$('.active').removeClass('active');
						}
						for (var i = 0; i < urlList.length; i++){
							if(pageName == urlList[i]){
								activityFlag = true;
								break;
							}
						}					
						if(activityFlag){
							var self = $('#' + pageName);
							self.attr('class','active');
						}else{
						var self = $('#' + urlList[0]);
						//绑定点击链接事件
							window.location.href = self.data('href');
						}
						$.headerInit();
					}else{
						$.alert("业务获取失败，请重试");
					}
                    initTitle(pageName,serviceNameObj);
       	        }

       		});
}

function initTitle(pageName,serviceNameObj) {
    var userInfo = JSON.parse(USERINFO);
    var providerInfo = userInfo.provider;
	if(pageName == 'interCityOnline'){
        $('title').html(serviceNameObj.isInterCityOnlineTxt+'-'+providerInfo.providerName);
	}else if(pageName == 'innerCityOnline'){
        $('title').html(serviceNameObj.isInnerCityOnlineTxt+'-'+providerInfo.providerName);
	}else if(pageName == 'busCity'){
        $('title').html(serviceNameObj.busTxt+'-'+providerInfo.providerName);
	}else if(pageName == 'travel'){
        $('title').html(serviceNameObj.travelTxt+'-'+providerInfo.providerName);
	}else if(pageName == 'commute'){
        $('title').html(serviceNameObj.commuteTxt+'-'+providerInfo.providerName);
    }else if(pageName == 'busTicket'){
        $('title').html(serviceNameObj.busTicketTxt+'-'+providerInfo.providerName);
    }else if(pageName == 'onlineCar'){
        $('title').html(serviceNameObj.onlineTxt+'-'+providerInfo.providerName);
    }else if(pageName == 'innerCity'){
        $('title').html(serviceNameObj.interCityTxt+'-'+providerInfo.providerName);
    }else if(pageName == 'chartered'){
        $('title').html(serviceNameObj.isCharteredTxt+'-'+providerInfo.providerName);
    }else if(pageName == 'taxi'){

    }else {
        $('title').html(providerInfo.providerName);
	}
}

function queryIfHasActivity(){
	$.ajax({
        type: 'POST',
        url: '/activityRecom/queryIfHasActivity',
        data: {},
        dataType:  'json',
        success: function(data){
        	if(data.code ==0){
        		$('#activity').addClass('badge-hot');
        	}
        }
	});
}
 
 function queryIfHasUnfinishedOrder(){
	$.ajax({
        type: 'POST',
        url: '/innerCity/order/queryIfHasUnfinishedOrder',
        data: {},
        dataType:  'json',
        success: function(data){
        	if(data.code ==0){
        		$('#reddot').addClass('reddot');
        	}
        }
	});
	
}
