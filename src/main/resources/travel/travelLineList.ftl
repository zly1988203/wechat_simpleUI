<#include "/_framework.ftl">
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<title><#if searchFlag?exists>
			<#if searchFlag==1>
				${departCityName!''} - ${arriveCityName!''}
				<#else>
					${lineName!""}
			</#if>
		</#if>
		</title>
		<meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
		<meta name="format-detection" content="telephone=no">
		<meta name="format-detection" content="email=no">
		<meta http-equiv="X-UA-Compatible" content="chrome=1" />
		<link href="/res/style/simpleui.min.css?v=${version!}" rel="stylesheet" type="text/css">
		<link href="/res/style/base/vectors.2.css?v=${version!}" rel="stylesheet" type="text/css">
		<link href="/res/style/base/fy-datepicker.css?v=${version!}" rel="stylesheet" type="text/css">
		<link href="/res/style/bus/line-list-2.css?v=${version!}" rel="stylesheet" type="text/css">
		<!-- start Dplus --><script src="/js/udplus.js"></script><!-- end Dplus -->
	</head>

	<body>
	<!-- <#include "foot.ftl"/> -->
	<header>
		<ul class="ola-date sui-border-b">
			<li class="ola-prev ola-disabled" id="preDay"><span>前一天</span></li>
			<li class="ola-current">
				<#if searchCondition.departDate?exists>
					<label for="startTime"><span><i>
            	${searchCondition.departDate?string('yyyy-MM-dd')}
            	</i><input type="text" id="startTime" data-date="${searchCondition.departDate?string('yyyy-MM-dd')}" readonly /></span></label>
					<#else>
						<label for="startTime"><span><i>
            	${departDate?string('yyyy-MM-dd')}
            	</i><input type="text" id="startTime" data-date="${departDate?string('yyyy-MM-dd')}" readonly /></span></label>
				</#if>
			</li>
			<li class="ola-next" id="nextDay"><span>后一天</span></li>
		</ul>
	</header>
	<!-- 选择日期 -->
	<div id="select-date" class="sui-popup-container" data-trigger="">
		<div class="sui-popup-mask"></div>
		<div class="sui-popup-modal">
			<div class="date"></div>
			<div class="btn-group">
				<div class="btn primary cancel">返回</div>
			</div>
		</div>
	</div>
	<#assign sizeFlag="1"/>
	<ul class="ola-list-box">
		<#if baseBusList?exists>
			<#list baseBusList as item>
				<#if item.buyFlag==1>
					<#assign sizeFlag="2"/>
					<li class="lineItem sui-border">
						<div class="travel" data-href="/travel/travelLineInfo?lineId=${item.lineId!''}&fromUrl=toLineList">
							<div class="thumb" style="background-image:url(${item.linePicUrl!''});"></div>
							<h4>${item.lineTitle!''}</h4>
						</div>
						<div class="ola-head sui-border-b">
							<#if item.activityTag?exists>
								<#if (item.activityTag?size > 0)>
									<div class="line-labels">
										<#list item.activityTag as activityTag>
											<#if  (activityTag_index == 0)>
												<#if item.isCooperateDealer?exists>
													<#if item.isCooperateDealer == 1>
														<span class="distribution">${activityTag!""}</span>
														<#else>
															<span class="discount-name">${activityTag!""}</span>
													</#if>
												</#if>
												<#else>
													<span class="discount-name">${activityTag!""}</span>
											</#if>
										</#list>
									</div>
								</#if>
							</#if>
							<!-- 分界线 -->
							<#if item.tagList?exists>
								<#if (item.tagList?size > 0)>
									<div class="ola-label">
										<#list item.tagList as tag>
											<span>${tag!""}</span>
										</#list>
									</div>
								</#if>
							</#if>
							<!-- 分界线 -->
						</div>
						<#assign count=0/>
						<ul class="sui-list-link ola-ticket">
							<#list item.sameStationBusList as sameStationItem>
								<#if sameStationItem.buyFlag==1>
									<#assign count=count+1/>
									<li class="ola-ticket-item sui-border-b sell"  busId="${sameStationItem.idStr!}">
										<div class="ola-ticket-info">
											<h4>
												<#if sameStationItem.departTime?exists>
													${sameStationItem.departTime?string('HH:mm')}
												</#if>
											</h4>
											<#if sameStationItem.specialState?exists>
												<#if sameStationItem.specialState==1>
													<span class="special-icon">特价</span>
												</#if>
												<#else>
													<#if (sameStationItem.ticketRemainNum!0) <= (remainShowNumber!999)>
													<#if (sameStationItem.ticketRemainNum>0)>
														<i>剩${sameStationItem.ticketRemainNum!""}张 </i>
														<#else>
															<i>已售罄</i>
													</#if>
											</#if>
								</#if>
								</div>
								<#if sameStationItem.specialState?exists>
									<#if sameStationItem.specialState == 1>
										<div class="ola-ticket-btn"><em class="original">${sameStationItem.sellPrice!"错误价格"}元</em>${sameStationItem.specialPrice!"错误价格"}元</div>
									</#if>
									<#if sameStationItem.specialState == 0>
										<div class="ola-ticket-btn">${sameStationItem.sellPrice!"错误价格"}元
											<#if (sameStationItem.lineType!'0')=='1'>
												<em>起</em>
											</#if>
										</div>
									</#if>
									<#if sameStationItem.specialState == -1>
										<div class="ola-ticket-btn">${sameStationItem.specialPrice!"错误价格"}元
										</div>
									</#if>
									<#else>
										<div class="ola-ticket-btn">${sameStationItem.sellPrice!"错误价格"}元
											<#if (sameStationItem.lineType!'0')=='1'>
												<em>起</em>
											</#if>
										</div>
								</#if>
								</li>
				</#if>
			</#list>
			<#list item.sameStationBusList as sameStationItem>
				<#if sameStationItem.buyFlag==2>
					<li class="ola-ticket-item sui-border-b sell-out">
						<div class="ola-ticket-info">
							<h4>
								<#if sameStationItem.departTime?exists>
									${sameStationItem.departTime?string('HH:mm')}
								</#if>
							</h4>
							<#if (sameStationItem.ticketRemainNum>0)>
								<i>已停售 </i>
								<#else>
									<i>已售罄</i>
							</#if>
						</div>
						<div class="ola-ticket-btn">${sameStationItem.sellPrice!"错误价格"}元
							<#if (sameStationItem.lineType!'0')=='1'>
								<em>起</em>
							</#if>
						</div>
					</li>
				</#if>
			</#list>
	</ul>
	<#if item.sameStationBusList?exists>
		<#if (item.sameStationBusList?size>3)>
			<div class="all show-all">显示全部</div>
		</#if>
	</#if>
	</li>
	</#if>
	</#list>

	<!-- 无可售 -->
	<#list baseBusList as item>
		<#if item.buyFlag==2>
			<#assign sizeFlag="2"/>
			<li class="lineItem no-stock">
				<div class="travel" data-href="/travel/travelLineInfo?lineId=${item.lineId!''}&fromUrl=toLineList">
					<div class="thumb" style="background-image:url(${item.linePicUrl!''});"></div>
					<h4>${item.lineTitle!''}</h4>
				</div>
				<div class="ola-head sui-border-b">
					<#if item.activityTag?exists>
						<#if (item.activityTag?size > 0)>
							<div class="line-labels">
								<#list item.activityTag as activityTag>
									<#if  (activityTag_index == 0)>
										<#if item.isCooperateDealer?exists>
											<#if item.isCooperateDealer == 1>
												<span class="distribution">${activityTag!""}</span>
												<#else>
													<span class="discount-name">${activityTag!""}</span>
											</#if>
										</#if>
										<#else>
											<span class="discount-name">${activityTag!""}</span>
									</#if>
								</#list>
							</div>
						</#if>
					</#if>
					<!-- 分界线 -->
					<#if item.tagList?exists>
						<#if (item.tagList?size > 0)>
							<div class="ola-label ola-label-gray">
								<#list item.tagList as tag>
									<span>${tag!""}</span>
								</#list>
							</div>
						</#if>
					</#if>
				</div>
				<#if item.sameStationBusList?exists>
					<ul class="sui-list-link ola-ticket">
						<#list item.sameStationBusList as sameStationItem>
							<li class="ola-ticket-item sui-border-b sell-out">
								<div class="ola-ticket-info">
									<h4>
										<#if sameStationItem.departTime?exists>
											${sameStationItem.departTime?string('HH:mm')}
										</#if>
									</h4>
									<#if sameStationItem.ticketRemainNum?exists>
										<#if (sameStationItem.ticketRemainNum>0)>
											<i>已停售 </i>
											<#else>
												<i>已售罄</i>
										</#if>
									</#if>

								</div>
								<div class="ola-ticket-btn">${sameStationItem.sellPrice!"错误价格"}元
									<#if (sameStationItem.lineType!'0')=='1'>
										<em>起</em>
									</#if>
								</div>
							</li>
						</#list>
					</ul>
					<#if (item.sameStationBusList?size>3)>
						<div class="all show-all">显示全部</div>
					</#if>
					<#else>
						<div class="no-stock-status">无可售班次 更换日期试试</div>
				</#if>
			</li>
		</#if>
	</#list>
	</#if>
	</ul>
	<#if sizeFlag=='1'>
		<div class="empty-page">
			<div class="empty-main">
				<i style="padding-top: 43.07%; background-image: url(/res/images/common/icon_defect_line.png);"></i>
				<p>暂时没有找到合适的线路<br>换个地点再试试吧</p>
				<div class="btn primary" id="backIndex">返回首页</div>
			</div>
		</div>
	</#if>
	<script src="/js/commonBus.js?v=${version!}"></script>
	<script src="/js/zepto.min.js?v=${version!}"></script>
	<script src="/js/simpleui.min.js?v=${version!}"></script>
	<script src="/js/vectors.min.js?v=${version!}"></script>
	<script src="/js/zepto.scrollTo.min.js?v=${version!}"></script>
	<script src="/js/coach/fy-datePicker.min.js?v=${version!}"></script>
	<script src="/js/date.js?v=${version!}"></script>
	<script>
        var providerDomin = document.domain.split('.')[0];
        dplus.track("浏览线路班次列表",{
            "车企":providerDomin,
            "业务":"定制班线",
            "页面名称":"线路班次列表",
            "页面URL":window.location.href
        });

        $(function() {
            var dateStr = '${searchCondition.departDate?string('yyyy-MM-dd')}';
            $('#backIndex').off().on('click',function(){
                window.location = "/busIndex?token="+$.cookie('token')+"&departLng=${searchCondition.departLng!''}&departLat=${searchCondition.departLat!''}&arriveLng=${searchCondition.arriveLng!''}&arriveLat=${searchCondition.arriveLat!''}&departDate=${searchCondition.departDate?string('yyyy-MM-dd')}&departCityName=${searchCondition.departCityName!''}&arriveCityName=${searchCondition.arriveCityName!''}&startAddr=${startAddr!''}&endAddr=${endAddr!''}";
            });
//    	backtoUrl("/busIndex?token="+$.cookie('token')+"&departLng=${searchCondition.departLng!''}&departLat=${searchCondition.departLat!''}&arriveLng=${searchCondition.arriveLng!''}&arriveLat=${searchCondition.arriveLat!''}&departDate=${searchCondition.departDate?string('yyyy-MM-dd')}&departCityName=${searchCondition.departCityName!''}&arriveCityName=${searchCondition.arriveCityName!''}&startAddr=${startAddr!''}&endAddr=${endAddr!''}");
            var searchFlag='${searchFlag!''}';
            var qrcId = '${qrcId!''}';
            //判断前一天后一天是否可点击
            var presellDay = '${presellDay!60}';
            var endDate = dateStrToDate('${currentDateStr!''}');
            var eY, eM, eD;
            eY = endDate.getFullYear();
            eM = endDate.getMonth() + 1;
            if(eM >= 12) {
                eY++;
                eM = 1;
            } else {
                eM++;
            }
            eD = maxDay(eM);
            var endDateStr = eY + '-' + eM + '-' + eD;
            endDate = new Date(eY,eM-1,eD);
            if(presellDay!='0'){
//        	endDate.setDate(new Date().getDate()+parseInt(presellDay)-1);//获取AddDayCount天后的日期
                endDate = new Date(dateStrToDate('${currentDateStr!''}').getTime()+(parseInt(presellDay)-1)*24*60*60*1000);
                endDateStr = endDate.getFullYear()+'-'+(endDate.getMonth()+1)+'-'+endDate.getDate();
                endDate = new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate());
            }

            var dateStrs = "${searchCondition.departDate?string('yyyy-MM-dd')}".split("-");
            var year = parseInt(dateStrs[0], 10);
            var month = parseInt(dateStrs[1], 10) - 1;
            var day = parseInt(dateStrs[2], 10);
            var searchDate = new Date(year, month, day);


            $('.ola-icon-back').bind('click', function(){
                var href = $(this).data('href');
                if(href && href != '#'){
                    location.href = href;
                }
            });
            $(".sell").click(function(){
                dplus.track("线路班次列表-选择线路班次",{
                    "车企":providerDomin,
                    "业务":"定制班线",
                    "页面名称":"线路班次列表",
                });
                var busId=$(this).attr('busId');
                $.ajax({
                    type: "GET",
                    url: "/busline/judegLineDetail",
                    data:{'token':$.cookie('token'),'busId':busId},
                    dataType: "json",
                    success: function(result){
                        if(result!=undefined&&result.code!=undefined&&parseInt(result.code)==0){
                            window.location='/busline/toLineDetail?busId='+busId +'&qrcId=' + qrcId;
                        }else{
                            $.alert(result.message||'该班次已停售',function(){
                                window.location.reload();
                                return false;
                            });

                        }
                    }
                });
            })

            $('.ola-foot-item').on('click', function () {
                var href = $(this).data('href');
                if (href && href != '#') {
                    location.href = href;
                }
            });

            selectDate();

            //获取当前月最大天数
            function maxDay(month){
                var d= new Date();
                return new Date(d.getFullYear(), month, 0).getDate();
            }

            $('#preDay').off('click').on('click',function(){
                searchDate.setDate(searchDate.getDate()-1);
                dateStr = searchDate.getFullYear()+'-'+(searchDate.getMonth()+1)+'-'+searchDate.getDate();
                locationTo();
            })

            $('#nextDay').off('click').on('click',function(){
                searchDate.setDate(searchDate.getDate()+1);
                dateStr = searchDate.getFullYear()+'-'+(searchDate.getMonth()+1)+'-'+searchDate.getDate();
                //跳转页面
                locationTo();
            })

            if(searchDate<=dateStrToDate('${currentDateStr!''}')){
                $('#preDay').addClass('ola-disabled');
                $('#preDay').unbind('click');
            }else{
                $('#preDay').removeClass('ola-disabled');
            }

            if(searchDate>=endDate){
                $('#nextDay').addClass('ola-disabled');
                $('#nextDay').unbind('click');
            }else{
                $('#nextDay').removeClass('ola-disabled');
            }

            //switch全部
            $('.show-all').on('click', function () {
                var el = $(this);
                if(el.html() == '显示全部'){
                    //show
                    dplus.track("线路班次列表-显示全部",{
                        "车企":providerDomin,
                        "业务":"定制班线",
                        "页面名称":"线路班次列表",
                    });
                    el.data('clock', true);
                    el.addClass('somersault');
                    el.siblings('.ola-ticket').addClass('slideToggle');
                    el.html('收起列表');
                }else if(el.html() == '收起列表'){
                    el.data('clock', false);
                    el.removeClass('somersault');
                    el.siblings('.ola-ticket').removeClass('slideToggle');
                    el.html('显示全部');
                }
                //选择日期
                selectDate();
            });


            //创建随机数据
            function createData() {
                var result = {};
                var resultArray = []
                var months = [];

                for(var i=0;i<presellDay;i++){
                    var dateStr1 = dateStrAddDay('${currentDateStr!''}',i);
                    var _result = {
                        date: dateStr1,
                        state: 'select',
                    };
                    resultArray.push(_result);

                    var m = getMonth(dateStr1);
                    if($.inArray(m, months)==-1){
                        months.push(m);
                    }
                }

                result.resultArray = resultArray;
                result.monthNum = months.length -1;
                return result;
            }
            /* 选择日期 */
            function selectDate() {
                var trigger = $('.ola-date .ola-current span i'),
                    parent = $('#select-date'),
                    cancel = parent.find('.cancel');
                var initDateStatus = false;

                var init = function () {
                    //只初始化一次
                    if(!initDateStatus) {
                        initDateStatus = true;
                        var timeData = createData();
                        parent.find('.date').datePicker({
                            dateBase: dateStrAddMonths('${searchCondition.departDate?string('yyyy-MM-dd')}'),
                            weekend: false,
                            multiple: false,
                            after:[-3,3],
                            gather: timeData.resultArray,
                            selectCallback: function (data) {
                            var d = data.selectData[0].date;
                            var val = d.year + '-' + d.month + '-' + d.day;

                            parent.setPopupData(val);
                            cancel.triggerHandler('click');
                            dateStr = val;
                            locationTo();
                        }
                    });
                    }
                };

                //弹出层
                trigger.on('click', function () {
                    var self = $(this);
                    parent.popup('modal', init, function (data) {
                        trigger.text(data).siblings('#startTime').val(data);
                    });
                })

                //返回
                $('#select-date .cancel').on('click', function () {
                    parent.closePopup();
                });
            };

            function locationTo(){
                //跳转页面
                if(searchFlag=='1'){
                    var departCityId = "${departCityId!''}";
                    var arriveCityId = "${arriveCityId!''}";
                    window.location="/busLine/searchBus?"+"token="+$.cookie("token")+"&departLng="+'${searchCondition.departLng!''}'+"&departLat="//
                    +'${searchCondition.departLat!''}'+"&arriveLng="+'${searchCondition.arriveLng!''}'//
                    +"&arriveLat="+'${searchCondition.arriveLat!''}'//
                    +"&departDate="+dateStr+"&departCityName="+'${searchCondition.departCityName!''}'//
                    +"&arriveCityName="+'${searchCondition.arriveCityName!''}'+"&startAddr="+'${startAddr!''}'+"&endAddr="+'${endAddr!''}'//
                    + '&departCityId=' + departCityId + '&arriveCityId=' + arriveCityId + "&lineType=" + ${travelLineType!'3'};
                }else if(searchFlag=='3'){
                    window.location="/qrcForLine/lineList?"+"token="+$.cookie("token")+"&departDate="+dateStr+"&qrcId=${qrcId!''}";
                }else if(searchFlag=='4'){
                    window.location="/bus/lineList?"+"token="+$.cookie("token")+"&departDate="+dateStr+"&busId=${busId!''}"+"&lineType=" + ${travelLineType!'3'};
                }else if(searchFlag == "5"){
                    window.location="/activityLine/activityLineList?"+"token="+$.cookie("token")+"&departDate="+dateStr+"&lineId=${lineId!''}" + "&lineType=${lineType!''}";
                }else{
                    var location="/lineList?"+"token="+$.cookie("token")+"&lineName=${lineName!''}&departDate="+dateStr+"&lineId=${lineId!''}"+ "&lineType=" + ${travelLineType!'3'};
                    var distrib = "${distrib!''}";
                    if(distrib != ''){
                        location = location +"&distrib=${distrib!''}"
                    }
                    window.location = location;
                }
            }
            $('.travel').off('click').on('click',function(){
                var fromUrl = window.location.href;
                localStorage.setItem("travelLineList",fromUrl);
            });
        });


	</script>
	</body>
	</html>