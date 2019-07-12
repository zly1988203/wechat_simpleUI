package com.olakeji.passenger.wechat.entity;

import java.math.BigDecimal;

public class InsuranceInformation {
    private Integer insuranceId;

    private String insuranceCode;

    private Integer providerId;

    private String productCode;

    private BigDecimal price;

    private String name;

    private Integer minDurationInsurance;

    private Integer maxDurationInsurance;

    private Byte unit;

    private Integer minInsurantNumber;

    private Integer maxInsurantNumber;

    private Integer minAge;
    

	private Integer insuranceCompanyId;

    private Integer assuredMinAge;

    private Integer assuredMaxAge;

    private Long addTime;

    private Long updateTime;

    /**
     * 保险简易描述
     */
    private String insuranceSimpleDesc;
    
    /**
     * 保险描述
     */
    private String insuranceDesc;
    
    /**
     * 保险介绍
     */



    private String insuranceIntroduce;

    public Integer getInsuranceId() {
        return insuranceId;
    }

    public void setInsuranceId(Integer insuranceId) {
        this.insuranceId = insuranceId;
    }

    public String getInsuranceCode() {
        return insuranceCode;
    }

    public void setInsuranceCode(String insuranceCode) {
        this.insuranceCode = insuranceCode == null ? null : insuranceCode.trim();
    }

    public Integer getProviderId() {
        return providerId;
    }

    public void setProviderId(Integer providerId) {
        this.providerId = providerId;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode == null ? null : productCode.trim();
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public Integer getMinDurationInsurance() {
        return minDurationInsurance;
    }

    public void setMinDurationInsurance(Integer minDurationInsurance) {
        this.minDurationInsurance = minDurationInsurance;
    }

    public Integer getMaxDurationInsurance() {
        return maxDurationInsurance;
    }

    public void setMaxDurationInsurance(Integer maxDurationInsurance) {
        this.maxDurationInsurance = maxDurationInsurance;
    }

    public Byte getUnit() {
        return unit;
    }

    public void setUnit(Byte unit) {
        this.unit = unit;
    }

    public Integer getMinInsurantNumber() {
        return minInsurantNumber;
    }

    public void setMinInsurantNumber(Integer minInsurantNumber) {
        this.minInsurantNumber = minInsurantNumber;
    }

    public Integer getMaxInsurantNumber() {
        return maxInsurantNumber;
    }

    public void setMaxInsurantNumber(Integer maxInsurantNumber) {
        this.maxInsurantNumber = maxInsurantNumber;
    }

    public Integer getMinAge() {
        return minAge;
    }

    public void setMinAge(Integer minAge) {
        this.minAge = minAge;
    }

    public Integer getAssuredMinAge() {
        return assuredMinAge;
    }

    public void setAssuredMinAge(Integer assuredMinAge) {
        this.assuredMinAge = assuredMinAge;
    }

    public Integer getAssuredMaxAge() {
        return assuredMaxAge;
    }

    public void setAssuredMaxAge(Integer assuredMaxAge) {
        this.assuredMaxAge = assuredMaxAge;
    }

    public Long getAddTime() {
        return addTime;
    }

    public void setAddTime(Long addTime) {
        this.addTime = addTime;
    }

    public Long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }

    public String getInsuranceSimpleDesc() {
        return insuranceSimpleDesc;
    }

    public void setInsuranceSimpleDesc(String insuranceSimpleDesc) {
        this.insuranceSimpleDesc = insuranceSimpleDesc == null ? null : insuranceSimpleDesc.trim();
    }

    public String getInsuranceDesc() {
        return insuranceDesc;
    }

    public void setInsuranceDesc(String insuranceDesc) {
        this.insuranceDesc = insuranceDesc == null ? null : insuranceDesc.trim();
    }

    public Integer getInsuranceCompanyId() {
        return insuranceCompanyId;
    }

    public void setInsuranceCompanyId(Integer insuranceCompanyId) {
        this.insuranceCompanyId = insuranceCompanyId;
    }

    public String getInsuranceIntroduce() {
        return insuranceIntroduce;
    }

    public void setInsuranceIntroduce(String insuranceIntroduce) {
        this.insuranceIntroduce = insuranceIntroduce == null ? null : insuranceIntroduce.trim();
    }
}