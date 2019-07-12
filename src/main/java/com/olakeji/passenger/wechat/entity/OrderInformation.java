package com.olakeji.passenger.wechat.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.olakeji.tsp.common.QueryCondition;
import com.olakeji.tsp.common.SearchType;

public class OrderInformation implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -5341345048470514497L;
	private Integer id;
	/**
	 * 
	 */
	@QueryCondition(searchType = SearchType.EQ)
	private String orderNo;
	@QueryCondition(searchType = SearchType.EQ)
	private Integer groupOrderId;

	private Integer tripId;

	private String tripNo;

	private Integer departProvinceid;

	private String departProvince;

	private Integer departCityId;

	private String departCity;

	private Integer departAreaId;

	private String departArea;

	private String departAddress;

	private BigDecimal departLat;

	private BigDecimal departLng;

	private String departTitle;

	private Integer arriveProvinceid;

	private String arriveProvince;

	private Integer arriveCityid;

	private String arriveCity;

	private Integer arriveAreaid;

	private String arriveArea;

	private String arriveAddress;

	private String arriveTitle;
	
	private String logoURL;

	private BigDecimal arriveLat;

	private BigDecimal arriveLng;

	private Integer duration;

	private Integer distance;

	private BigDecimal price;

	private Integer numbers;
	
	private Integer days;

	private BigDecimal payPrice;

	private BigDecimal punishPrice;

	private Long startDateToLong;

	private Long endDateToLong;

	private Integer driverId;

	@QueryCondition(searchType = SearchType.EQ)
	private String driverMobile;

	@QueryCondition
	private Integer userId;

	@QueryCondition(searchType = SearchType.EQ)
	private String userMobile;

	@QueryCondition
	private Integer departType;

	private Integer carTypeId;

	@QueryCondition(searchType = SearchType.EQ)
	private Byte orderType;

	@QueryCondition(searchType = SearchType.EQ)
	private Byte status;

	private Byte userRescueStatus;

	private Byte driverRescueStatus;

	private Byte punishStatus;

	private Byte driverCommentStatus;

	private Byte userCommentStatus;

	private Byte tripStatus;

	private Long departTime;

	private Long arriveDepartTime;

	private Long arriveTime;

	private Long payTime;

	private Long pickerPsgTime;

	private String transactionId;

	@QueryCondition(searchType = SearchType.EQ)
	private Byte payType;

	private Byte cancelType;

	private Long cancelTime;

	private Byte channelId;
	@QueryCondition(searchType = SearchType.EQ)
	private Integer providerId;

	private BigDecimal highSpeedFee;

	private BigDecimal tollsFee;

	private BigDecimal parkingFee;

	private BigDecimal otherFee;

	private BigDecimal startFee;
	
	private BigDecimal insuranceFee;//保险总价
	private BigDecimal insurancePrice;//保险单价

	private String priceParam;
	@QueryCondition(searchType=SearchType.LT)
	private Long createTime ;

	private Long updateTime = new Date().getTime();

	private Byte isRefundFlag;
	
	private Integer qrcodeId;
	private Integer qrcodeType;
	
	private Integer priceAdjustType;
	private BigDecimal priceAdjustValue;
	
	private BigDecimal realPrice;
	
	private String innerCityName;

	/**
	 * 下单时指定的 订单联系人手机号
	 */
	private String orderContactMobile;

	public String getOrderContactMobile() {
		return orderContactMobile;
	}

	public void setOrderContactMobile(String orderContactMobile) {
		this.orderContactMobile = orderContactMobile;
	}

	public Integer getQrcodeId() {
		return qrcodeId;
	}

	public void setQrcodeId(Integer qrcodeId) {
		this.qrcodeId = qrcodeId;
	}

	public Integer getQrcodeType() {
		return qrcodeType;
	}

	public void setQrcodeType(Integer qrcodeType) {
		this.qrcodeType = qrcodeType;
	}

	/**
	 * 0原支付标识
	 */
	private Integer zeroPayFlag;
	
	public Integer getZeroPayFlag() {
		return zeroPayFlag;
	}

	public void setZeroPayFlag(Integer zeroPayFlag) {
		this.zeroPayFlag = zeroPayFlag;
	}

	public Double getTicketPrice() {
		return ticketPrice;
	}

	public void setTicketPrice(Double ticketPrice) {
		this.ticketPrice = ticketPrice;
	}

	@QueryCondition(searchType = SearchType.LIKE)
	private String providerName;

	private BigDecimal coupon;
	
	private Integer couponId;

	private BigDecimal refundPrice;
	
	/**
	 * 票价
	 */
	private Double ticketPrice;

	private String impProviderName;

	private Integer impProviderId;

	private String carNo;
	
	private String vehicleCard;

	private String brand;

	private Long refundTime;

	private String model;

	private Long depatStartDateToLong;

	private Long depatEndDateToLong;

	private Long payStartDateToLong;

	private Long payEndDateToLong;

	private Long latitude;

	private String tipsMessage;

	private Long longitude;
	
	private Byte paidMod; //付费模式： 1-预付费 2-后付费
	
	private Byte settleFlag; //结算标志

	private Integer shutDownTime;
	private BaseComment comment;
	private String canPayMethods;
	private String color;
	private String className;
	private String driverName;
	private String driverAvatar; //司机头像    数据库取出后转为base64串
	private String names;//品牌名称
	private Character firstChar;
	private String modelName;
	private String brandName;
	private String carBelongsCompany;
	private BigDecimal couponPrice;
	private double star;// 平均评级星数量
	private Long configHasTime ; // config表中设置多少时间有责 用来初始化倒计时
	private Long callDriverTime ; //config表中设置多少时间后不能打电话给司机
	
	private Double carDistance ;    //距离司机多少m
	private Double durationArrive ;     //离司机到达还要多少分钟
	private String nickName; //用户的昵称 
	
	private List<Integer> reservationStatusList;
	
	private List<Integer> isRefundFlagList;
	
	private List<CouponReceiveRecord> couponReceiveRecordList;//用户优惠券list
	
	private String contactName;
	
	private String contactMobile;
	
	private String verifyCode;
	
	private String ghName;
	
	/**
	 * 查询开始时间
	 */
	private Long searchStartTime;
	
	/**
	 * 查询结束时间
	 */
	private Long searchEndTime;
	
	/**
	 * 车企id列表
	 */
	private List<Integer>providerIdList;
	
	/**
	 * 订单总金额
	 */
	private Double orderTotalAmount;
	
	private List<Integer> statusList;
	
	@QueryCondition(searchType = SearchType.EQ)
	private Byte reservationType;
	
	@QueryCondition(searchType = SearchType.EQ)
	private Byte reservationStatus;// bus线路预订状态
	
	private Integer buyCount;//预订购票数
	
	private Long reservationTime;//预订时间
	
	private Date busDepartTime;//巴士发车时间  
	
	private Date busDepartDate;//大巴车发车日期
	
	private String createTimeStr;
	
	private Integer scheduleId;//班次的排班id
	
	private String statusDesc;
	
	private String[] statusArray;
	
	private String[] refundStatusArray;
	
	private String payTypeDesc;
	
	private String departArrive;
	
	private String payTimeDesc;
	
	private String departTimeDesc;
	
	private String refundStatusDes;
	
	private String operAccount;
	
	private Integer ifQuickCheck;//是否需要快速验票
    
    public Integer getIfQuickCheck() {
		return ifQuickCheck;
	}

	public void setIfQuickCheck(Integer ifQuickCheck) {
		this.ifQuickCheck = ifQuickCheck;
	}

	
	public Double getRealPay() {
		return realPay;
	}

	public void setRealPay(Double realPay) {
		this.realPay = realPay;
	}

	private Integer isOpenWechatPayFlag;
	
	private List<Integer> refundStatusList;
	
	private String carCompany;
	private Integer orderGroupStatus;
	private String content;
	
	private Integer cityLineId;
	
	private String insuranceNo;

	
	/**
	 * 真实需要支付的
	 */
	private Double realPay;
	
    private String passengerContactIds;
	private Integer departCarType;
	/**
	 * 计价方式 0 一口价 1打表计价
	 */
	private Byte calculateType;

	public Byte getCalculateType() {
		return calculateType;
	}

	public void setCalculateType(Byte calculateType) {
		this.calculateType = calculateType;
	}

	public Integer getDepartCarType() {
		return departCarType;
	}

	public void setDepartCarType(Integer departCarType) {
		this.departCarType = departCarType;
	}

	public String getContent() {
		return content;
	}

	public String getPassengerContactIds() {
		return passengerContactIds;
	}

	public void setPassengerContactIds(String passengerContactIds) {
		this.passengerContactIds = passengerContactIds;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public String getRefundStatusDes() {
		return refundStatusDes;
	}

	public void setRefundStatusDes(String refundStatusDes) {
		this.refundStatusDes = refundStatusDes;
	}

	public String[] getStatusArray() {
		return statusArray;
	}

	public void setStatusArray(String[] statusArray) {
		this.statusArray = statusArray;
	}

	public String[] getRefundStatusArray() {
		return refundStatusArray;
	}

	public void setRefundStatusArray(String[] refundStatusArray) {
		this.refundStatusArray = refundStatusArray;
	}

	public Integer getScheduleId() {
		return scheduleId;
	}

	public void setScheduleId(Integer scheduleId) {
		this.scheduleId = scheduleId;
	}

	public Date getBusDepartDate() {
		return busDepartDate;
	}

	public void setBusDepartDate(Date busDepartDate) {
		this.busDepartDate = busDepartDate;
	}

	private String lineCode;//线路编号
	
	private String lineName;//线路名称
	
	private Long startDepartTime;//页面时间转long
	
	private Long endDepartTime;
	
	private String departStation;
	
	private String arriveStation;
	
	private String departBusDate;
	
	private String departBusTime;
	
	private Date startDepartDate;//页面时间转date
	
	private Date endDepartDate;//页面时间转date
	
	private BigDecimal faceValue;
	
	private Long busId;
	
	private String passengerMobile;
	
	private BaseBus baseBus;
	
	private String reservationStatusStr;
	
	private String statusStr;
	
	protected Integer limitStart;

	private String busIdStr;
	
	private Integer payMode;
	
	private BigDecimal specialPrice;
	
	private String specialPriceActivityName;
	
    public BigDecimal getSpecialPrice() {
		return specialPrice;
	}

	public void setSpecialPrice(BigDecimal specialPrice) {
		this.specialPrice = specialPrice;
	}

	public String getSpecialPriceActivityName() {
		return specialPriceActivityName;
	}

	public void setSpecialPriceActivityName(String specialPriceActivityName) {
		this.specialPriceActivityName = specialPriceActivityName;
	}

	public String getBusIdStr() {
		return busIdStr;
	}

	public void setBusIdStr(String busIdStr) {
		this.busIdStr = busIdStr;
	}

	public List<OrderBusTicketInfo> getTicketInfoList() {
		return ticketInfoList;
	}

	public void setTicketInfoList(List<OrderBusTicketInfo> ticketInfoList) {
		this.ticketInfoList = ticketInfoList;
	}

	protected Integer limitLength;
    
    private String remark;
    
    private Integer insuranceId=-1;
    
	private String fleet;//车队id
    
    private String fleetName;//车队名称
    
    
	private List<OrderBusTicketInfo>ticketInfoList=new ArrayList<OrderBusTicketInfo>();
	
	
    
	public BaseBus getBaseBus() {
		return baseBus;
	}

	public void setBaseBus(BaseBus baseBus) {
		this.baseBus = baseBus;
	}

	public Double getOrderTotalAmount() {
		return orderTotalAmount;
	}

	public void setOrderTotalAmount(Double orderTotalAmount) {
		this.orderTotalAmount = orderTotalAmount;
	}

	public List<Integer> getProviderIdList() {
		return providerIdList;
	}

	public void setProviderIdList(List<Integer> providerIdList) {
		this.providerIdList = providerIdList;
	}

	public Byte getPaidMod()
    {
        return paidMod;
    }

    public Long getSearchStartTime() {
		return searchStartTime;
	}

	public void setSearchStartTime(Long searchStartTime) {
		this.searchStartTime = searchStartTime;
	}

	public Long getSearchEndTime() {
		return searchEndTime;
	}

	public void setSearchEndTime(Long searchEndTime) {
		this.searchEndTime = searchEndTime;
	}

	public Long getConfigHasTime() {
		return configHasTime;
	}

	public void setConfigHasTime(Long configHasTime) {
		this.configHasTime = configHasTime;
	}

	public void setPaidMod(Byte paidMod)
    {
        this.paidMod = paidMod;
    }

    public double getStar() {
		return star;
	}

	public void setStar(double star) {
		this.star = star;
	}

	public String getNickName() {
		return nickName;
	}

	public void setNickName(String nickName) {
		this.nickName = nickName;
	}

	public String getCarBelongsCompany() {
		return carBelongsCompany;
	}

	public void setCarBelongsCompany(String carBelongsCompany) {
		this.carBelongsCompany = carBelongsCompany;
	}

	public BigDecimal getCouponPrice() {
		return couponPrice;
	}

	public void setCouponPrice(BigDecimal couponPrice) {
		this.couponPrice = couponPrice;
	}

	public String getModelName() {
		return modelName;
	}

	public void setModelName(String modelName) {
		this.modelName = modelName;
	}

	public String getBrandName() {
		return brandName;
	}

	public void setBrandName(String brandName) {
		this.brandName = brandName;
	}

	public String getNames() {
		return names;
	}

	public void setNames(String names) {
		this.names = names;
	}

	public Character getFirstChar() {
		return firstChar;
	}

	public void setFirstChar(Character firstChar) {
		this.firstChar = firstChar;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

	public String getDriverName() {
		return driverName;
	}

	public void setDriverName(String driverName) {
		this.driverName = driverName;
	}

	public String getDriverAvatar() {
		return driverAvatar;
	}

	public void setDriverAvatar(String driverAvatar) {
		this.driverAvatar = driverAvatar;
	}

	public BaseComment getComment() {
		return comment;
	}

	public void setComment(BaseComment comment) {
		this.comment = comment;
	}

	public String getCanPayMethods() {
		return canPayMethods;
	}

	public void setCanPayMethods(String canPayMethods) {
		this.canPayMethods = canPayMethods;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}

	public Integer getTripId() {
		return tripId;
	}

	public void setTripId(Integer tripId) {
		this.tripId = tripId;
	}

	public String getTripNo() {
		return tripNo;
	}

	public void setTripNo(String tripNo) {
		this.tripNo = tripNo == null ? null : tripNo.trim();
	}

	public Integer getDepartProvinceid() {
		return departProvinceid;
	}

	public void setDepartProvinceid(Integer departProvinceid) {
		this.departProvinceid = departProvinceid;
	}

	public String getDepartProvince() {
		return departProvince;
	}

	public String getLogoURL() {
		return logoURL;
	}

	public Integer getCouponId() {
		return couponId;
	}

	public void setCouponId(Integer couponId) {
		this.couponId = couponId;
	}

	public void setLogoURL(String logoURL) {
		this.logoURL = logoURL;
	}

	public void setDepartProvince(String departProvince) {
		this.departProvince = departProvince == null ? null : departProvince.trim();
	}

	public Integer getDepartCityId() {
		return departCityId;
	}

	public void setDepartCityId(Integer departCityId) {
		this.departCityId = departCityId;
	}

	public String getDepartCity() {
		return departCity;
	}

	public void setDepartCity(String departCity) {
		this.departCity = departCity == null ? null : departCity.trim();
	}

	public Integer getDepartAreaId() {
		return departAreaId;
	}

	public void setDepartAreaId(Integer departAreaId) {
		this.departAreaId = departAreaId;
	}

	public String getDepartArea() {
		return departArea;
	}

	public void setDepartArea(String departArea) {
		this.departArea = departArea == null ? null : departArea.trim();
	}

	public String getDepartAddress() {
		return departAddress;
	}

	public void setDepartAddress(String departAddress) {
		this.departAddress = departAddress == null ? null : departAddress.trim();
	}

	public BigDecimal getDepartLat() {
		return departLat;
	}

	public BigDecimal getInsuranceFee() {
		return insuranceFee;
	}

	public void setInsuranceFee(BigDecimal insuranceFee) {
		this.insuranceFee = insuranceFee;
	}

	public void setDepartLat(BigDecimal departLat) {
		this.departLat = departLat;
	}

	public BigDecimal getDepartLng() {
		return departLng;
	}

	public void setDepartLng(BigDecimal departLng) {
		this.departLng = departLng;
	}

	public String getDepartTitle() {
		return departTitle;
	}

	public void setDepartTitle(String departTitle) {
		this.departTitle = departTitle == null ? null : departTitle.trim();
	}

	public Integer getArriveProvinceid() {
		return arriveProvinceid;
	}

	public void setArriveProvinceid(Integer arriveProvinceid) {
		this.arriveProvinceid = arriveProvinceid;
	}

	public String getArriveProvince() {
		return arriveProvince;
	}

	public void setArriveProvince(String arriveProvince) {
		this.arriveProvince = arriveProvince == null ? null : arriveProvince.trim();
	}

	public Integer getArriveCityid() {
		return arriveCityid;
	}

	public void setArriveCityid(Integer arriveCityid) {
		this.arriveCityid = arriveCityid;
	}

	public String getArriveCity() {
		return arriveCity;
	}

	public void setArriveCity(String arriveCity) {
		this.arriveCity = arriveCity == null ? null : arriveCity.trim();
	}

	public Integer getArriveAreaid() {
		return arriveAreaid;
	}

	public void setArriveAreaid(Integer arriveAreaid) {
		this.arriveAreaid = arriveAreaid;
	}

	public String getArriveArea() {
		return arriveArea;
	}

	public void setArriveArea(String arriveArea) {
		this.arriveArea = arriveArea == null ? null : arriveArea.trim();
	}

	public String getArriveAddress() {
		return arriveAddress;
	}

	public Integer getGroupOrderId() {
		return groupOrderId;
	}

	public void setGroupOrderId(Integer groupOrderId) {
		this.groupOrderId = groupOrderId;
	}

	public void setArriveAddress(String arriveAddress) {
		this.arriveAddress = arriveAddress == null ? null : arriveAddress.trim();
	}

	public String getArriveTitle() {
		return arriveTitle;
	}

	public void setArriveTitle(String arriveTitle) {
		this.arriveTitle = arriveTitle == null ? null : arriveTitle.trim();
	}

	public BigDecimal getArriveLat() {
		return arriveLat;
	}

	public void setArriveLat(BigDecimal arriveLat) {
		this.arriveLat = arriveLat;
	}

	public BigDecimal getArriveLng() {
		return arriveLng;
	}

	public void setArriveLng(BigDecimal arriveLng) {
		this.arriveLng = arriveLng;
	}

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}

	public Integer getDistance() {
		return distance;
	}

	public void setDistance(Integer distance) {
		this.distance = distance;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public Integer getNumbers() {
		return numbers;
	}

	public void setNumbers(Integer numbers) {
		this.numbers = numbers;
	}

	public BigDecimal getPayPrice() {
		return payPrice;
	}

	public void setPayPrice(BigDecimal payPrice) {
		this.payPrice = payPrice;
	}

	public BigDecimal getPunishPrice() {
		return punishPrice;
	}

	public void setPunishPrice(BigDecimal punishPrice) {
		this.punishPrice = punishPrice;
	}

	public Integer getDriverId() {
		return driverId;
	}

	public void setDriverId(Integer driverId) {
		this.driverId = driverId;
	}

	public String getDriverMobile() {
		return driverMobile;
	}

	public void setDriverMobile(String driverMobile) {
		this.driverMobile = driverMobile == null ? null : driverMobile.trim();
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getUserMobile() {
		return userMobile;
	}

	public void setUserMobile(String userMobile) {
		this.userMobile = userMobile == null ? null : userMobile.trim();
	}

	public Integer getDepartType() {
		return departType;
	}

	public void setDepartType(Integer departType) {
		this.departType = departType;
	}

	public Integer getCarTypeId() {
		return carTypeId;
	}

	public void setCarTypeId(Integer carTypeId) {
		this.carTypeId = carTypeId;
	}

	public Byte getOrderType() {
		return orderType;
	}

	public void setOrderType(Byte orderType) {
		this.orderType = orderType;
	}

	public Byte getStatus() {
		return status;
	}

	public void setStatus(Byte status) {
		this.status = status;
	}

	public Byte getUserRescueStatus() {
		return userRescueStatus;
	}

	public void setUserRescueStatus(Byte userRescueStatus) {
		this.userRescueStatus = userRescueStatus;
	}

	public Byte getDriverRescueStatus() {
		return driverRescueStatus;
	}

	public void setDriverRescueStatus(Byte driverRescueStatus) {
		this.driverRescueStatus = driverRescueStatus;
	}

	public Byte getPunishStatus() {
		return punishStatus;
	}

	public void setPunishStatus(Byte punishStatus) {
		this.punishStatus = punishStatus;
	}

	public Byte getDriverCommentStatus() {
		return driverCommentStatus;
	}

	public void setDriverCommentStatus(Byte driverCommentStatus) {
		this.driverCommentStatus = driverCommentStatus;
	}

	public Byte getUserCommentStatus() {
		return userCommentStatus;
	}

	public void setUserCommentStatus(Byte userCommentStatus) {
		this.userCommentStatus = userCommentStatus;
	}

	public Byte getTripStatus() {
		return tripStatus;
	}

	public void setTripStatus(Byte tripStatus) {
		this.tripStatus = tripStatus;
	}

	public Long getDepartTime() {
		return departTime;
	}

	public void setDepartTime(Long departTime) {
		this.departTime = departTime;
	}

	public Long getArriveDepartTime() {
		return arriveDepartTime;
	}

	public void setArriveDepartTime(Long arriveDepartTime) {
		this.arriveDepartTime = arriveDepartTime;
	}

	public Long getArriveTime() {
		return arriveTime;
	}

	public void setArriveTime(Long arriveTime) {
		this.arriveTime = arriveTime;
	}

	public Long getPayTime() {
		return payTime;
	}

	public void setPayTime(Long payTime) {
		this.payTime = payTime;
	}

	public Long getPickerPsgTime() {
		return pickerPsgTime;
	}

	public void setPickerPsgTime(Long pickerPsgTime) {
		this.pickerPsgTime = pickerPsgTime;
	}

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId == null ? null : transactionId.trim();
	}

	public Byte getPayType() {
		return payType;
	}

	public void setPayType(Byte payType) {
		this.payType = payType;
	}

	public Byte getCancelType() {
		return cancelType;
	}

	public void setCancelType(Byte cancelType) {
		this.cancelType = cancelType;
	}

	public Long getCancelTime() {
		return cancelTime;
	}

	public void setCancelTime(Long cancelTime) {
		this.cancelTime = cancelTime;
	}

	public Byte getChannelId() {
		return channelId;
	}

	public void setChannelId(Byte channelId) {
		this.channelId = channelId;
	}

	public Integer getProviderId() {
		return providerId;
	}

	public void setProviderId(Integer providerId) {
		this.providerId = providerId;
	}

	public BigDecimal getHighSpeedFee() {
		return highSpeedFee;
	}

	public void setHighSpeedFee(BigDecimal highSpeedFee) {
		this.highSpeedFee = highSpeedFee;
	}

	public BigDecimal getTollsFee() {
		return tollsFee;
	}

	public void setTollsFee(BigDecimal tollsFee) {
		this.tollsFee = tollsFee;
	}

	public BigDecimal getParkingFee() {
		return parkingFee;
	}

	public void setParkingFee(BigDecimal parkingFee) {
		this.parkingFee = parkingFee;
	}

	public BigDecimal getOtherFee() {
		return otherFee;
	}

	public void setOtherFee(BigDecimal otherFee) {
		this.otherFee = otherFee;
	}

	public BigDecimal getStartFee() {
		return startFee;
	}

	public void setStartFee(BigDecimal startFee) {
		this.startFee = startFee;
	}

	public String getPriceParam() {
		return priceParam;
	}

	public void setPriceParam(String priceParam) {
		this.priceParam = priceParam == null ? null : priceParam.trim();
	}

	public Long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}

	public Long getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}

	public Byte getIsRefundFlag() {
		return isRefundFlag;
	}

	public void setIsRefundFlag(Byte isRefundFlag) {
		this.isRefundFlag = isRefundFlag;
	}

	public String getProviderName() {
		return providerName;
	}

	public void setProviderName(String providerName) {
		this.providerName = providerName;
	}

	public Long getStartDateToLong() {
		return startDateToLong;
	}

	public void setStartDateToLong(Long startDateToLong) {
		this.startDateToLong = startDateToLong;
	}

	public Long getEndDateToLong() {
		return endDateToLong;
	}

	public void setEndDateToLong(Long endDateToLong) {
		this.endDateToLong = endDateToLong;
	}

	public BigDecimal getCoupon() {
		return coupon;
	}

	public void setCoupon(BigDecimal coupon) {
		this.coupon = coupon;
	}

	public BigDecimal getRefundPrice() {
		return refundPrice;
	}

	public void setRefundPrice(BigDecimal refundPrice) {
		this.refundPrice = refundPrice;
	}

	public String getCarNo() {
		return carNo;
	}

	public void setCarNo(String carNo) {
		this.carNo = carNo;
	}

	public String getVehicleCard() {
		return vehicleCard;
	}

	public void setVehicleCard(String vehicleCard) {
		this.vehicleCard = vehicleCard;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public Long getRefundTime() {
		return refundTime;
	}

	public void setRefundTime(Long refundTime) {
		this.refundTime = refundTime;
	}

	public Long getDepatStartDateToLong() {
		return depatStartDateToLong;
	}

	public void setDepatStartDateToLong(Long depatStartDateToLong) {
		this.depatStartDateToLong = depatStartDateToLong;
	}

	public Long getDepatEndDateToLong() {
		return depatEndDateToLong;
	}

	public void setDepatEndDateToLong(Long depatEndDateToLong) {
		this.depatEndDateToLong = depatEndDateToLong;
	}

	public Long getPayStartDateToLong() {
		return payStartDateToLong;
	}

	public void setPayStartDateToLong(Long payStartDateToLong) {
		this.payStartDateToLong = payStartDateToLong;
	}

	public Long getPayEndDateToLong() {
		return payEndDateToLong;
	}

	public void setPayEndDateToLong(Long payEndDateToLong) {
		this.payEndDateToLong = payEndDateToLong;
	}

	public String getImpProviderName() {
		return impProviderName;
	}

	public void setImpProviderName(String impProviderName) {
		this.impProviderName = impProviderName;
	}

	public Integer getImpProviderId() {
		return impProviderId;
	}

	public void setImpProviderId(Integer impProviderId) {
		this.impProviderId = impProviderId;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public Long getLatitude() {
		return latitude;
	}

	public void setLatitude(Long latitude) {
		this.latitude = latitude;
	}

	public Long getLongitude() {
		return longitude;
	}

	public void setLongitude(Long longitude) {
		this.longitude = longitude;
	}

	public Integer getShutDownTime() {
		return shutDownTime;
	}

	public void setShutDownTime(Integer shutDownTime) {
		this.shutDownTime = shutDownTime;
	}

	public String getTipsMessage() {
		return tipsMessage;
	}

	public void setTipsMessage(String tipsMessage) {
		this.tipsMessage = tipsMessage;
	}

	public Double getCarDistance() {
		return carDistance;
	}

	public void setCarDistance(Double carDistance) {
		this.carDistance = carDistance;
	}

	public Double getDurationArrive() {
		return durationArrive;
	}

	public void setDurationArrive(Double durationArrive) {
		this.durationArrive = durationArrive;
	}

	public Long getCallDriverTime() {
		return callDriverTime;
	}

	public void setCallDriverTime(Long callDriverTime) {
		this.callDriverTime = callDriverTime;
	}

	public Byte getSettleFlag() {
		return settleFlag;
	}

	public void setSettleFlag(Byte settleFlag) {
		this.settleFlag = settleFlag;
	}

	public List<Integer> getStatusList() {
		return statusList;
	}

	public void setStatusList(List<Integer> statusList) {
		this.statusList = statusList;
	}

	public Byte getReservationStatus() {
		return reservationStatus;
	}

	public void setReservationStatus(Byte reservationStatus) {
		this.reservationStatus = reservationStatus;
	}

	public Integer getBuyCount() {
		return buyCount;
	}

	public void setBuyCount(Integer buyCount) {
		this.buyCount = buyCount;
	}

	public Long getReservationTime() {
		return reservationTime;
	}

	public void setReservationTime(Long reservationTime) {
		this.reservationTime = reservationTime;
	}

	public Date getBusDepartTime() {
		return busDepartTime;
	}

	public void setBusDepartTime(Date busDepartTime) {
		this.busDepartTime = busDepartTime;
	}

	public String getLineCode() {
		return lineCode;
	}

	public void setLineCode(String lineCode) {
		this.lineCode = lineCode;
	}

	public String getLineName() {
		return lineName;
	}

	public void setLineName(String lineName) {
		this.lineName = lineName;
	}

	public Long getStartDepartTime() {
		return startDepartTime;
	}

	public void setStartDepartTime(Long startDepartTime) {
		this.startDepartTime = startDepartTime;
	}

	public Long getEndDepartTime() {
		return endDepartTime;
	}

	public void setEndDepartTime(Long endDepartTime) {
		this.endDepartTime = endDepartTime;
	}

	public String getDepartStation() {
		return departStation;
	}

	public void setDepartStation(String departStation) {
		this.departStation = departStation;
	}

	public String getArriveStation() {
		return arriveStation;
	}

	public void setArriveStation(String arriveStation) {
		this.arriveStation = arriveStation;
	}

	public String getDepartBusDate() {
		return departBusDate;
	}

	public void setDepartBusDate(String departBusDate) {
		this.departBusDate = departBusDate;
	}

	public String getDepartBusTime() {
		return departBusTime;
	}

	public void setDepartBusTime(String departBusTime) {
		this.departBusTime = departBusTime;
	}

	public Date getStartDepartDate() {
		return startDepartDate;
	}

	public void setStartDepartDate(Date startDepartDate) {
		this.startDepartDate = startDepartDate;
	}

	public Date getEndDepartDate() {
		return endDepartDate;
	}

	public void setEndDepartDate(Date endDepartDate) {
		this.endDepartDate = endDepartDate;
	}

	public Byte getReservationType() {
		return reservationType;
	}

	public void setReservationType(Byte reservationType) {
		this.reservationType = reservationType;
	}

	public BigDecimal getFaceValue() {
		return faceValue;
	}

	public void setFaceValue(BigDecimal faceValue) {
		this.faceValue = faceValue;
	}	

	public Long getBusId() {
		return busId;
	}

	public void setBusId(Long busId) {
		this.busId = busId;
	}

	public List<Integer> getReservationStatusList() {
		return reservationStatusList;
	}

	public void setReservationStatusList(List<Integer> reservationStatusList) {
		this.reservationStatusList = reservationStatusList;
	}

	public String getPassengerMobile() {
		return passengerMobile;
	}

	public void setPassengerMobile(String passengerMobile) {
		this.passengerMobile = passengerMobile;
	}

	public List<Integer> getIsRefundFlagList() {
		return isRefundFlagList;
	}

	public void setIsRefundFlagList(List<Integer> isRefundFlagList) {
		this.isRefundFlagList = isRefundFlagList;
	}

	public String getReservationStatusStr() {
		return reservationStatusStr;
	}

	public void setReservationStatusStr(String reservationStatusStr) {
		this.reservationStatusStr = reservationStatusStr;
	}

	public String getStatusStr() {
		return statusStr;
	}

	public void setStatusStr(String statusStr) {
		this.statusStr = statusStr;
	}

	@Override
	public String toString() {
		return "OrderInformation [id=" + id + ", orderNo=" + orderNo + ", tripId=" + tripId + ", tripNo=" + tripNo
				+ ", departProvinceid=" + departProvinceid + ", departProvince=" + departProvince + ", departCityId="
				+ departCityId + ", departCity=" + departCity + ", departAreaId=" + departAreaId + ", departArea="
				+ departArea + ", departAddress=" + departAddress + ", departLat=" + departLat + ", departLng="
				+ departLng + ", departTitle=" + departTitle + ", arriveProvinceid=" + arriveProvinceid
				+ ", arriveProvince=" + arriveProvince + ", arriveCityid=" + arriveCityid + ", arriveCity=" + arriveCity
				+ ", arriveAreaid=" + arriveAreaid + ", arriveArea=" + arriveArea + ", arriveAddress=" + arriveAddress
				+ ", arriveTitle=" + arriveTitle + ", logoURL=" + logoURL + ", arriveLat=" + arriveLat + ", arriveLng="
				+ arriveLng + ", duration=" + duration + ", distance=" + distance + ", price=" + price + ", numbers="
				+ numbers + ", payPrice=" + payPrice + ", punishPrice=" + punishPrice + ", startDateToLong="
				+ startDateToLong + ", endDateToLong=" + endDateToLong + ", driverId=" + driverId + ", driverMobile="
				+ driverMobile + ", userId=" + userId + ", userMobile=" + userMobile + ", departType=" + departType
				+ ", carTypeId=" + carTypeId + ", orderType=" + orderType + ", status=" + status + ", userRescueStatus="
				+ userRescueStatus + ", driverRescueStatus=" + driverRescueStatus + ", punishStatus=" + punishStatus
				+ ", driverCommentStatus=" + driverCommentStatus + ", userCommentStatus=" + userCommentStatus
				+ ", tripStatus=" + tripStatus + ", departTime=" + departTime + ", arriveDepartTime=" + arriveDepartTime
				+ ", arriveTime=" + arriveTime + ", payTime=" + payTime + ", pickerPsgTime=" + pickerPsgTime
				+ ", transactionId=" + transactionId + ", payType=" + payType + ", cancelType=" + cancelType
				+ ", cancelTime=" + cancelTime + ", channelId=" + channelId + ", providerId=" + providerId
				+ ", highSpeedFee=" + highSpeedFee + ", tollsFee=" + tollsFee + ", parkingFee=" + parkingFee
				+ ", otherFee=" + otherFee + ", startFee=" + startFee + ", insuranceFee=" + insuranceFee
				+ ", priceParam=" + priceParam + ", createTime=" + createTime + ", updateTime=" + updateTime
				+ ", isRefundFlag=" + isRefundFlag + ", providerName=" + providerName + ", coupon=" + coupon
				+ ", couponId=" + couponId + ", refundPrice=" + refundPrice + ", impProviderName=" + impProviderName
				+ ", impProviderId=" + impProviderId + ", carNo=" + carNo + ", brand=" + brand + ", refundTime="
				+ refundTime + ", model=" + model + ", depatStartDateToLong=" + depatStartDateToLong
				+ ", depatEndDateToLong=" + depatEndDateToLong + ", payStartDateToLong=" + payStartDateToLong
				+ ", payEndDateToLong=" + payEndDateToLong + ", latitude=" + latitude + ", tipsMessage=" + tipsMessage
				+ ", longitude=" + longitude + ", paidMod=" + paidMod + ", settleFlag=" + settleFlag + ", shutDownTime="
				+ shutDownTime + ", comment=" + comment + ", canPayMethods=" + canPayMethods + ", color=" + color
				+ ", className=" + className + ", driverName=" + driverName + ", driverAvatar=" + driverAvatar
				+ ", names=" + names + ", firstChar=" + firstChar + ", modelName=" + modelName + ", brandName="
				+ brandName + ", carBelongsCompany=" + carBelongsCompany + ", couponPrice=" + couponPrice + ", star="
				+ star + ", configHasTime=" + configHasTime + ", callDriverTime=" + callDriverTime + ", carDistance="
				+ carDistance + ", durationArrive=" + durationArrive + ", nickName=" + nickName
				+ ", reservationStatusList=" + reservationStatusList + ", searchStartTime=" + searchStartTime
				+ ", searchEndTime=" + searchEndTime + ", providerIdList=" + providerIdList + ", orderTotalAmount="
				+ orderTotalAmount + ", statusList=" + statusList + ", reservationType=" + reservationType
				+ ", reservationStatus=" + reservationStatus + ", buyCount=" + buyCount + ", reservationTime="
				+ reservationTime + ", busDepartTime=" + busDepartTime + ", lineCode=" + lineCode + ", lineName="
				+ lineName + ", startDepartTime=" + startDepartTime + ", endDepartTime=" + endDepartTime
				+ ", departStation=" + departStation + ", arriveStation=" + arriveStation + ", departBusDate="
				+ departBusDate + ", departBusTime=" + departBusTime + ", startDepartDate=" + startDepartDate
				+ ", endDepartDate=" + endDepartDate + ", faceValue=" + faceValue +"qrcodeId=" + qrcodeId +", busId=" + busId + "]";
	}

	public List<CouponReceiveRecord> getCouponReceiveRecordList() {
		return couponReceiveRecordList;
	}

	public void setCouponReceiveRecordList(List<CouponReceiveRecord> couponReceiveRecordList) {
		this.couponReceiveRecordList = couponReceiveRecordList;
	}

	public String getCreateTimeStr() {
		return createTimeStr;
	}

	public void setCreateTimeStr(String createTimeStr) {
		this.createTimeStr = createTimeStr;
	}

	public String getStatusDesc() {
		return statusDesc;
	}

	public void setStatusDesc(String statusDesc) {
		this.statusDesc = statusDesc;
	}

	public String getPayTypeDesc() {
		return payTypeDesc;
	}

	public void setPayTypeDesc(String payTypeDesc) {
		this.payTypeDesc = payTypeDesc;
	}

	public String getDepartArrive() {
		return departArrive;
	}

	public void setDepartArrive(String departArrive) {
		this.departArrive = departArrive;
	}

	public Integer getLimitStart() {
		return limitStart;
	}

	public void setLimitStart(Integer limitStart) {
		this.limitStart = limitStart;
	}

	public Integer getLimitLength() {
		return limitLength;
	}

	public void setLimitLength(Integer limitLength) {
		this.limitLength = limitLength;
	}

	public String getPayTimeDesc() {
		return payTimeDesc;
	}

	public void setPayTimeDesc(String payTimeDesc) {
		this.payTimeDesc = payTimeDesc;
	}

	public String getDepartTimeDesc() {
		return departTimeDesc;
	}

	public void setDepartTimeDesc(String departTimeDesc) {
		this.departTimeDesc = departTimeDesc;
	}

	public String getContactName() {
		return contactName;
	}

	public void setContactName(String contactName) {
		this.contactName = contactName;
	}

	public String getContactMobile() {
		return contactMobile;
	}

	public void setContactMobile(String contactMobile) {
		this.contactMobile = contactMobile;
	}

	public String getVerifyCode() {
		return verifyCode;
	}

	public void setVerifyCode(String verifyCode) {
		this.verifyCode = verifyCode;
	}

	public String getGhName() {
		return ghName;
	}

	public void setGhName(String ghName) {
		this.ghName = ghName;
	}

	public Integer getIsOpenWechatPayFlag() {
		return isOpenWechatPayFlag;
	}

	public void setIsOpenWechatPayFlag(Integer isOpenWechatPayFlag) {
		this.isOpenWechatPayFlag = isOpenWechatPayFlag;
	}

	public List<Integer> getRefundStatusList() {
		return refundStatusList;
	}

	public void setRefundStatusList(List<Integer> refundStatusList) {
		this.refundStatusList = refundStatusList;
	}

	public String getCarCompany() {
		return carCompany;
	}

	public void setCarCompany(String carCompany) {
		this.carCompany = carCompany;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Integer getOrderGroupStatus() {
		return orderGroupStatus;
	}

	public void setOrderGroupStatus(Integer orderGroupStatus) {
		this.orderGroupStatus = orderGroupStatus;
	}

	public Integer getCityLineId() {
		return cityLineId;
	}

	public void setCityLineId(Integer cityLineId) {
		this.cityLineId = cityLineId;
	}

    public String getOperAccount() {
		return operAccount;
	}

	public void setOperAccount(String operAccount) {
		this.operAccount = operAccount;
	}
	public Integer getInsuranceId() {
		return insuranceId;
	}

	public void setInsuranceId(Integer insuranceId) {
		this.insuranceId = insuranceId;
	}	public String getFleet() {
		return fleet;
	}

	public void setFleet(String fleet) {
		this.fleet = fleet;
	}

	public String getFleetName() {
		return fleetName;
	}

	public void setFleetName(String fleetName) {
		this.fleetName = fleetName;
	}

	public String getInsuranceNo() {
		return insuranceNo;
	}

	public void setInsuranceNo(String insuranceNo) {
		this.insuranceNo = insuranceNo;
	}

	public Integer getDays() {
		return days;
	}

	public void setDays(Integer days) {
		this.days = days;
	}

	public Integer getPayMode() {
		return payMode;
	}

	public void setPayMode(Integer payMode) {
		this.payMode = payMode;
	}

	public Integer getPriceAdjustType() {
		return priceAdjustType;
	}

	public void setPriceAdjustType(Integer priceAdjustType) {
		this.priceAdjustType = priceAdjustType;
	}

	public BigDecimal getPriceAdjustValue() {
		return priceAdjustValue;
	}

	public void setPriceAdjustValue(BigDecimal priceAdjustValue) {
		this.priceAdjustValue = priceAdjustValue;
	}

	public BigDecimal getRealPrice() {
		return realPrice;
	}

	public void setRealPrice(BigDecimal realPrice) {
		this.realPrice = realPrice;
	}

	public String getInnerCityName() {
		return innerCityName;
	}

	public void setInnerCityName(String innerCityName) {
		this.innerCityName = innerCityName;
	}

	public BigDecimal getInsurancePrice() {
		return insurancePrice;
	}

	public void setInsurancePrice(BigDecimal insurancePrice) {
		this.insurancePrice = insurancePrice;
	}
	
}