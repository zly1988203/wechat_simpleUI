package com.olakeji.passenger.wechat.entity;

import java.math.BigDecimal;
import java.util.Date;

import com.olakeji.tsp.common.QueryCondition;

public class LbsDriverGpsLocation {
	
	
    private Integer id;

    private BigDecimal lng;

    private BigDecimal lat;

    private BigDecimal course;

    private BigDecimal height;
    
    @QueryCondition
    private Integer driverId;

    private String orderNo;

    private Long millisecond;

    private Long createTime;
    
    private Long updateTime=new Date().getTime();
    
    private Long getMillisecond;
    
    public Long getGetMillisecond()
    {
        return getMillisecond;
    }

    public void setGetMillisecond(Long getMillisecond)
    {
        this.getMillisecond = getMillisecond;
    }

    public Long getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}

	private Integer providerId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public BigDecimal getLng() {
        return lng;
    }

    public void setLng(BigDecimal lng) {
        this.lng = lng;
    }

    public BigDecimal getLat() {
        return lat;
    }

    public void setLat(BigDecimal lat) {
        this.lat = lat;
    }

    public BigDecimal getCourse() {
        return course;
    }

    public void setCourse(BigDecimal course) {
        this.course = course;
    }

    public BigDecimal getHeight() {
        return height;
    }

    public void setHeight(BigDecimal height) {
        this.height = height;
    }

    public Integer getDriverId() {
        return driverId;
    }

    public void setDriverId(Integer driverId) {
        this.driverId = driverId;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo == null ? null : orderNo.trim();
    }

    public Long getMillisecond() {
        return millisecond;
    }

    public void setMillisecond(Long millisecond) {
        this.millisecond = millisecond;
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
}