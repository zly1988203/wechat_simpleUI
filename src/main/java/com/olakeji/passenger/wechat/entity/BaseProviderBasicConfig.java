package com.olakeji.passenger.wechat.entity;

import com.olakeji.tsp.common.QueryCondition;

public class BaseProviderBasicConfig {
    private Integer id;
    @QueryCondition
    private Integer providerId;

    private Byte isInterCity;

    private Byte isSameCity;

    private Byte isTaxi;

    private Byte hasBus;

    private Byte hasBusCar;

    private Byte hasBusTicket;

    private String customerServiceMobile;
    
    private Byte isAdvance;
    
    private Byte settleModel;

    private Long createTime;

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

    public Byte getIsInterCity() {
        return isInterCity;
    }

    public void setIsInterCity(Byte isInterCity) {
        this.isInterCity = isInterCity;
    }

    public Byte getIsSameCity() {
        return isSameCity;
    }

    public void setIsSameCity(Byte isSameCity) {
        this.isSameCity = isSameCity;
    }

    public Byte getIsTaxi() {
        return isTaxi;
    }

    public void setIsTaxi(Byte isTaxi) {
        this.isTaxi = isTaxi;
    }

    public Byte getHasBus() {
        return hasBus;
    }

    public void setHasBus(Byte hasBus) {
        this.hasBus = hasBus;
    }

    public Byte getHasBusCar() {
        return hasBusCar;
    }

    public void setHasBusCar(Byte hasBusCar) {
        this.hasBusCar = hasBusCar;
    }

    public Byte getHasBusTicket() {
        return hasBusTicket;
    }

    public void setHasBusTicket(Byte hasBusTicket) {
        this.hasBusTicket = hasBusTicket;
    }

    public String getCustomerServiceMobile() {
        return customerServiceMobile;
    }

    public void setCustomerServiceMobile(String customerServiceMobile) {
        this.customerServiceMobile = customerServiceMobile == null ? null : customerServiceMobile.trim();
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

	public Byte getIsAdvance() {
		return isAdvance;
	}

	public void setIsAdvance(Byte isAdvance) {
		this.isAdvance = isAdvance;
	}

	public Byte getSettleModel() {
		return settleModel;
	}

	public void setSettleModel(Byte settleModel) {
		this.settleModel = settleModel;
	}
}