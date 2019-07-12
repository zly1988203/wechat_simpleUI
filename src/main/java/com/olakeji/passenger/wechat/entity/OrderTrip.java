package com.olakeji.passenger.wechat.entity;

import java.math.BigDecimal;
import com.olakeji.tsp.common.QueryCondition;
import com.olakeji.tsp.common.SearchType;
import com.olakeji.tsp.utils.DateUtils;
public class OrderTrip {
	private Integer id;
	
	@QueryCondition(searchType = SearchType.EQ)
	private String tripNo;
	
	private String departProvinceId;

	private String departProvince;

	private String departCityid;

	private String departCity;
	@QueryCondition(searchType = SearchType.EQ)
	private String departAreaId;

	private String departArea;

	private String departAddress;

	private BigDecimal departLat;

	private BigDecimal departLng;

	private String departTitle;

	private String arriveProvinceid;

	private String arriveProvince;

	private String arriveCityid;

	private String arriveCity;
	@QueryCondition(searchType = SearchType.EQ)
	private String arriveAreaid;

	private String arriveArea;

	private String arriveAddress;

	private String arriveTitle;

	private BigDecimal arriveLat;

	private BigDecimal arriveLng;
	@QueryCondition(searchType = SearchType.EQ)
	private Integer distance;
	@QueryCondition(searchType = SearchType.EQ)
	private Integer duration;
	
	private Integer tripStatus;

	private BigDecimal price;

	private Integer orderId;
	@QueryCondition(searchType = SearchType.EQ)
	private String orderNo;
	private String driverMobile;

	private Integer driverId;

	private Long pickerOrderTime;
	@QueryCondition(searchType=SearchType.EQ)
	private Long departTime;

	private Integer callOutSecond;
	
	private Byte pushStatus;

	private Long callOutTime;

	private Integer userId;

	private String userMobile;

	private Byte channelId;

	private Byte status;

	private Byte groupStatus;

	private String groupTripNo;

	private String groupOrderNo;

	private Byte tripType;
	@QueryCondition(searchType = SearchType.EQ)
	private Byte departType;
	@QueryCondition(searchType = SearchType.EQ)
	private Byte carTypeId;
	@QueryCondition(searchType = SearchType.EQ)
	private Integer numbers;

	private Long createTime;
	@QueryCondition(searchType = SearchType.EQ)
	private Integer providerId;

	private Byte useStatus;

	private Long updateTime=DateUtils.dateToUnixTimestamp();
	
	private Byte type;
	
	private String tipsMessage;
	
	private Byte orderStatus;   //外连接的订单状态，不查的时候数据为空
    
	public Byte getType() {
		return type;
	}

	public void setType(Byte type) {
		this.type = type;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getTripNo() {
		return tripNo;
	}

	public void setTripNo(String tripNo) {
		this.tripNo = tripNo == null ? null : tripNo.trim();
	}

	public String getDepartProvinceId() {
		return departProvinceId;
	}

	public void setDepartProvinceId(String departProvinceId) {
		this.departProvinceId = departProvinceId == null ? null : departProvinceId.trim();
	}

	public String getDepartProvince() {
		return departProvince;
	}

	public void setDepartProvince(String departProvince) {
		this.departProvince = departProvince == null ? null : departProvince.trim();
	}

	public String getDepartCityid() {
		return departCityid;
	}

	public void setDepartCityid(String departCityid) {
		this.departCityid = departCityid == null ? null : departCityid.trim();
	}

	public String getDepartCity() {
		return departCity;
	}

	public void setDepartCity(String departCity) {
		this.departCity = departCity == null ? null : departCity.trim();
	}

	public String getDepartAreaId() {
		return departAreaId;
	}

	public void setDepartAreaId(String departAreaId) {
		this.departAreaId = departAreaId == null ? null : departAreaId.trim();
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

	public String getArriveProvinceid() {
		return arriveProvinceid;
	}

	public void setArriveProvinceid(String arriveProvinceid) {
		this.arriveProvinceid = arriveProvinceid == null ? null : arriveProvinceid.trim();
	}

	public String getArriveProvince() {
		return arriveProvince;
	}

	public void setArriveProvince(String arriveProvince) {
		this.arriveProvince = arriveProvince == null ? null : arriveProvince.trim();
	}

	public String getArriveCityid() {
		return arriveCityid;
	}

	public void setArriveCityid(String arriveCityid) {
		this.arriveCityid = arriveCityid == null ? null : arriveCityid.trim();
	}
	
	public Byte getPushStatus() {
		return pushStatus;
	}

	public void setPushStatus(Byte pushStatus) {
		this.pushStatus = pushStatus;
	}

	public String getArriveCity() {
		return arriveCity;
	}

	public void setArriveCity(String arriveCity) {
		this.arriveCity = arriveCity == null ? null : arriveCity.trim();
	}

	public String getArriveAreaid() {
		return arriveAreaid;
	}

	public void setArriveAreaid(String arriveAreaid) {
		this.arriveAreaid = arriveAreaid == null ? null : arriveAreaid.trim();
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

	public Integer getDistance() {
		return distance;
	}

	public void setDistance(Integer distance) {
		this.distance = distance;
	}

	public Integer getDuration() {
		return duration;
	}

	public Integer getTripStatus() {
		return tripStatus;
	}

	public void setTripStatus(Integer tripStatus) {
		this.tripStatus = tripStatus;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public Integer getOrderId() {
		return orderId;
	}

	public void setOrderId(Integer orderId) {
		this.orderId = orderId;
	}

	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo == null ? null : orderNo.trim();
	}

	public String getDriverMobile() {
		return driverMobile;
	}

	public void setDriverMobile(String driverMobile) {
		this.driverMobile = driverMobile == null ? null : driverMobile.trim();
	}

	public Integer getDriverId() {
		return driverId;
	}

	public void setDriverId(Integer driverId) {
		this.driverId = driverId;
	}

	public Long getPickerOrderTime() {
		return pickerOrderTime;
	}

	public void setPickerOrderTime(Long pickerOrderTime) {
		this.pickerOrderTime = pickerOrderTime;
	}

	

	public Long getDepartTime() {
		return departTime;
	}

	public void setDepartTime(Long departTime) {
		this.departTime = departTime;
	}

	public Integer getCallOutSecond() {
		return callOutSecond;
	}

	public void setCallOutSecond(Integer callOutSecond) {
		this.callOutSecond = callOutSecond;
	}

	public Long getCallOutTime() {
		return callOutTime;
	}

	public void setCallOutTime(Long callOutTime) {
		this.callOutTime = callOutTime;
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

	public Byte getChannelId() {
		return channelId;
	}

	public void setChannelId(Byte channelId) {
		this.channelId = channelId;
	}

	public Byte getStatus() {
		return status;
	}

	public void setStatus(Byte status) {
		this.status = status;
	}

	public Byte getGroupStatus() {
		return groupStatus;
	}

	public void setGroupStatus(Byte groupStatus) {
		this.groupStatus = groupStatus;
	}

	public String getGroupTripNo() {
		return groupTripNo;
	}

	public void setGroupTripNo(String groupTripNo) {
		this.groupTripNo = groupTripNo == null ? null : groupTripNo.trim();
	}

	public String getGroupOrderNo() {
		return groupOrderNo;
	}

	public void setGroupOrderNo(String groupOrderNo) {
		this.groupOrderNo = groupOrderNo == null ? null : groupOrderNo.trim();
	}

	public Byte getTripType() {
		return tripType;
	}

	public void setTripType(Byte tripType) {
		this.tripType = tripType;
	}

	public Byte getDepartType() {
		return departType;
	}

	public void setDepartType(Byte departType) {
		this.departType = departType;
	}

	public Byte getCarTypeId() {
		return carTypeId;
	}

	public void setCarTypeId(Byte carTypeId) {
		this.carTypeId = carTypeId;
	}

	public Integer getNumbers() {
		return numbers;
	}

	public void setNumbers(Integer numbers) {
		this.numbers = numbers;
	}

	public Long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}

	public Integer getProviderId() {
		return providerId;
	}

	public void setProviderId(Integer providerId) {
		this.providerId = providerId;
	}

	public Byte getUseStatus() {
		return useStatus;
	}

	public void setUseStatus(Byte useStatus) {
		this.useStatus = useStatus;
	}

	public Long getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}

	public String getTipsMessage() {
		return tipsMessage;
	}

	public void setTipsMessage(String tipsMessage) {
		this.tipsMessage = tipsMessage;
	}

	public Byte getOrderStatus() {
		return orderStatus;
	}

	public void setOrderStatus(Byte orderStatus) {
		this.orderStatus = orderStatus;
	}
	
	
}