package com.olakeji.passenger.wechat.entity;

import com.olakeji.tsp.common.QueryCondition;
import com.olakeji.tsp.common.SearchType;

public class BaseUser {
	@QueryCondition(searchType=SearchType.EQ)
	private Integer id;
	@QueryCondition(searchType=SearchType.EQ)
	private Integer providerId;

	private String authName;
	@QueryCondition(searchType=SearchType.LIKE)
	private String mobile;

	private String wechatOpenId;
	private String password;

	private String salt;

	private String nickName;

	private Integer age;

	private Byte gender;

	private String createIp;

	private String avatar;

	private Byte status;

	private Long createTime;

	private Long updateTime;
	private Long startDateToLong;
	private Long endDateToLong;
	
	
	/**
	 * 是否有大巴业务
	 */
	private Integer hasBus;
	
	/**
	 * 是否有出租车业务
	 */
	private Integer hasTaxi;
	
	/**
	 * 是否有同城
	 */
	private Integer hasSameCity;
	
	/**
	 * 是否有城际
	 */
	private Integer hasInterCity;
	public Integer getHasSameCity() {
		return hasSameCity;
	}

	public void setHasSameCity(Integer hasSameCity) {
		this.hasSameCity = hasSameCity;
	}

	public Integer getHasInterCity() {
		return hasInterCity;
	}

	public void setHasInterCity(Integer hasInterCity) {
		this.hasInterCity = hasInterCity;
	}

	public Integer getHasBus() {
		return hasBus;
	}

	public void setHasBus(Integer hasBus) {
		this.hasBus = hasBus;
	}

	public Integer getHasTaxi() {
		return hasTaxi;
	}

	public void setHasTaxi(Integer hasTaxi) {
		this.hasTaxi = hasTaxi;
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

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getProviderId() {
		return providerId;
	}

	public void setProviderId(Integer providerId) {
		this.providerId = providerId;
	}

	public String getAuthName() {
		return authName;
	}

	public void setAuthName(String authName) {
		this.authName = authName == null ? null : authName.trim();
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile == null ? null : mobile.trim();
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password == null ? null : password.trim();
	}

	public String getSalt() {
		return salt;
	}

	public void setSalt(String salt) {
		this.salt = salt == null ? null : salt.trim();
	}

	public String getNickName() {
		return nickName;
	}

	public void setNickName(String nickName) {
		this.nickName = nickName == null ? null : nickName.trim();
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public Byte getGender() {
		return gender;
	}

	public void setGender(Byte gender) {
		this.gender = gender;
	}

	public String getCreateIp() {
		return createIp;
	}

	public void setCreateIp(String createIp) {
		this.createIp = createIp == null ? null : createIp.trim();
	}

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar == null ? null : avatar.trim();
	}

	public Byte getStatus() {
		return status;
	}

	public void setStatus(Byte status) {
		this.status = status;
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

	public String getWechatOpenId() {
		return wechatOpenId;
	}

	public void setWechatOpenId(String wechatOpenId) {
		this.wechatOpenId = wechatOpenId;
	}
	
}