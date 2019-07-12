package com.olakeji.passenger.wechat.entity;

import java.math.BigDecimal;

public class InnerCityOrderInfoVo {
	
	private String orderNo;
	
	private String departTitle;
	
	private String arriveTitle;
	
	private String departTime;
	
	private String carType;
	
	private String message;
	//司机名称
	private String driverName;
	//司机头像
	private String driverAvatar;
	//司机手机号码
	private String driverMobile;
	//车辆号牌
	private String carNo;
	//车辆颜色
	private String color;
	//车辆级别
	private String className;
	//车企名称
	private String carBelongsCompany;
	//品牌首字母，fid=0时为品牌，大于0为型号
	private Character firstChar;
	//品牌名称/型号名称，取决于fid
	private String names;
	//车企名称
	private String providerName;
	//供应商Logo路径
	private String logoURL;
	//车企名称
	private String impProviderName;
	//
	private Integer driverId;
	//行程号
	private String tripNo;
	// 平均评级星数量
	private double star; 
	//昵称
	private String nickName;
	//捎话
	private String tipsMessage;
	//出行人数
	private Integer numbers;
	//出行类型
	private String departType;
	//客服电话
	private String contactMobile;
	
	private BigDecimal arriveLat;
	
	private BigDecimal arriveLng;
	
	private String content;
	
	private Integer isRefundFlag;
	/**
	 * 0没有  1 有红包分享图标
	 */
	private Integer isHavaShareRedBags;

	public Integer getIsHavaShareRedBags() {
		return isHavaShareRedBags;
	}

	public void setIsHavaShareRedBags(Integer isHavaShareRedBags) {
		this.isHavaShareRedBags = isHavaShareRedBags;
	}
	
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getOrderNo() {
		return orderNo;
	}
	
	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}

	public String getDepartTitle() {
		return departTitle;
	}

	public void setDepartTitle(String departTitle) {
		this.departTitle = departTitle;
	}

	public String getArriveTitle() {
		return arriveTitle;
	}

	public void setArriveTitle(String arriveTitle) {
		this.arriveTitle = arriveTitle;
	}

	public String getDepartTime() {
		return departTime;
	}

	public void setDepartTime(String departTime) {
		this.departTime = departTime;
	}

	public String getCarType() {
		return carType;
	}

	public void setCarType(String carType) {
		this.carType = carType;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
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

	public String getDriverMobile() {
		return driverMobile;
	}

	public void setDriverMobile(String driverMobile) {
		this.driverMobile = driverMobile;
	}

	public String getCarNo() {
		return carNo;
	}

	public void setCarNo(String carNo) {
		this.carNo = carNo;
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

	public String getCarBelongsCompany() {
		return carBelongsCompany;
	}

	public void setCarBelongsCompany(String carBelongsCompany) {
		this.carBelongsCompany = carBelongsCompany;
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

	public String getProviderName() {
		return providerName;
	}

	public void setProviderName(String providerName) {
		this.providerName = providerName;
	}

	public String getLogoURL() {
		return logoURL;
	}

	public void setLogoURL(String logoURL) {
		this.logoURL = logoURL;
	}

	public String getImpProviderName() {
		return impProviderName;
	}

	public void setImpProviderName(String impProviderName) {
		this.impProviderName = impProviderName;
	}

	public Integer getDriverId() {
		return driverId;
	}

	public void setDriverId(Integer driverId) {
		this.driverId = driverId;
	}

	public String getTripNo() {
		return tripNo;
	}

	public void setTripNo(String tripNo) {
		this.tripNo = tripNo;
	}

	public String getTipsMessage() {
		return tipsMessage;
	}

	public void setTipsMessage(String tipsMessage) {
		this.tipsMessage = tipsMessage;
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

	public Integer getNumbers() {
		return numbers;
	}

	public void setNumbers(Integer numbers) {
		this.numbers = numbers;
	}

	public String getDepartType() {
		return departType;
	}

	public void setDepartType(String departType) {
		this.departType = departType;
	}

	public String getContactMobile() {
		return contactMobile;
	}

	public void setContactMobile(String contactMobile) {
		this.contactMobile = contactMobile;
	}

	public BigDecimal getArriveLat() {
		return arriveLat;
	}

	public void setArriveLat(BigDecimal bigDecimal) {
		this.arriveLat = bigDecimal;
	}

	public BigDecimal getArriveLng() {
		return arriveLng;
	}

	public void setArriveLng(BigDecimal bigDecimal) {
		this.arriveLng = bigDecimal;
	}

	public Integer getIsRefundFlag() {
		return isRefundFlag;
	}

	public void setIsRefundFlag(Integer isRefundFlag) {
		this.isRefundFlag = isRefundFlag;
	}
	
}
