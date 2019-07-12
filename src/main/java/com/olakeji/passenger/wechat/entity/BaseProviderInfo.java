package com.olakeji.passenger.wechat.entity;

import java.io.Serializable;
import java.util.Date;

import com.olakeji.tsp.common.QueryCondition;
import com.olakeji.tsp.common.SearchType;

public class BaseProviderInfo implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 101147239966608042L;

	private Integer id;
    
    @QueryCondition(searchType=SearchType.EQ)
    private Integer providerId;

    @QueryCondition(searchType=SearchType.LIKE)
    private String providerName;

    private String logoUrl;

    private String address;

    private Integer cityId;

    private String cityName;

    private String telephone;

    private String email;

    private String masterName;

    private Date initiationDate;

    private String masterTel;

    private String customerTel;

    private String telForPassenger;

    private String emergencyTel;

    private String propertyName;

    private String certificateAthority;

    private Date expiryDateStart;

    private Date expiryDateEnd;

    private Date approveDate;

    private Integer licenceStatus;

    private String documentAddr;

    private String loginLogoUrl;

    private String wechatQrcodeUrl;

    private Byte status;

    private Long createTime;

    private Long updateTime;
    
    private Double platformServiceFee;
    
    /*定义日期转换类型*/
    private String expiryDateStarts;

    private String expiryDateEnds;

    private String approveDates;
    
    /**
     * 订单总金额
     */
    private Double orderTotalAmount; 
    
    @QueryCondition(searchType=SearchType.EQ)
    private Integer parentProviderId; 
    
    public Double getOrderTotalAmount() {
		return orderTotalAmount;
	}

	public void setOrderTotalAmount(Double orderTotalAmount) {
		this.orderTotalAmount = orderTotalAmount;
	}

	public String getExpiryDateStarts() {
		return expiryDateStarts;
	}

	public void setExpiryDateStarts(String expiryDateStarts) {
		this.expiryDateStarts = expiryDateStarts;
	}

	public String getExpiryDateEnds() {
		return expiryDateEnds;
	}

	public void setExpiryDateEnds(String expiryDateEnds) {
		this.expiryDateEnds = expiryDateEnds;
	}

	public String getApproveDates() {
		return approveDates;
	}

	public void setApproveDates(String approveDates) {
		this.approveDates = approveDates;
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

    public String getProviderName() {
        return providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName == null ? null : providerName.trim();
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl == null ? null : logoUrl.trim();
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address == null ? null : address.trim();
    }

    public Integer getCityId() {
        return cityId;
    }

    public void setCityId(Integer cityId) {
        this.cityId = cityId;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName == null ? null : cityName.trim();
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone == null ? null : telephone.trim();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email == null ? null : email.trim();
    }

    public String getMasterName() {
        return masterName;
    }

    public void setMasterName(String masterName) {
        this.masterName = masterName == null ? null : masterName.trim();
    }

    public Date getInitiationDate() {
        return initiationDate;
    }

    public void setInitiationDate(Date initiationDate) {
        this.initiationDate = initiationDate;
    }

    public String getMasterTel() {
        return masterTel;
    }

    public void setMasterTel(String masterTel) {
        this.masterTel = masterTel == null ? null : masterTel.trim();
    }

    public String getCustomerTel() {
        return customerTel;
    }

    public void setCustomerTel(String customerTel) {
        this.customerTel = customerTel == null ? null : customerTel.trim();
    }

    public String getTelForPassenger() {
        return telForPassenger;
    }

    public void setTelForPassenger(String telForPassenger) {
        this.telForPassenger = telForPassenger == null ? null : telForPassenger.trim();
    }

    public String getEmergencyTel() {
        return emergencyTel;
    }

    public void setEmergencyTel(String emergencyTel) {
        this.emergencyTel = emergencyTel == null ? null : emergencyTel.trim();
    }

    public String getpropertyName() {
        return propertyName;
    }

    public void setpropertyName(String propertyName) {
        this.propertyName = propertyName == null ? null : propertyName.trim();
    }

    public String getCertificateAthority() {
        return certificateAthority;
    }

    public void setCertificateAthority(String certificateAthority) {
        this.certificateAthority = certificateAthority == null ? null : certificateAthority.trim();
    }

    public Date getExpiryDateStart() {
        return expiryDateStart;
    }

    public void setExpiryDateStart(Date expiryDateStart) {
        this.expiryDateStart = expiryDateStart;
    }

    public Date getExpiryDateEnd() {
        return expiryDateEnd;
    }

    public void setExpiryDateEnd(Date expiryDateEnd) {
        this.expiryDateEnd = expiryDateEnd;
    }

    public Date getApproveDate() {
        return approveDate;
    }

    public void setApproveDate(Date approveDate) {
        this.approveDate = approveDate;
    }

    public Integer getLicenceStatus() {
        return licenceStatus;
    }

    public void setLicenceStatus(Integer licenceStatus) {
        this.licenceStatus = licenceStatus;
    }

    public String getDocumentAddr() {
        return documentAddr;
    }

    public void setDocumentAddr(String documentAddr) {
        this.documentAddr = documentAddr == null ? null : documentAddr.trim();
    }

    public String getLoginLogoUrl() {
        return loginLogoUrl;
    }

    public void setLoginLogoUrl(String loginLogoUrl) {
        this.loginLogoUrl = loginLogoUrl == null ? null : loginLogoUrl.trim();
    }

    public String getWechatQrcodeUrl() {
        return wechatQrcodeUrl;
    }

    public void setWechatQrcodeUrl(String wechatQrcodeUrl) {
        this.wechatQrcodeUrl = wechatQrcodeUrl == null ? null : wechatQrcodeUrl.trim();
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

	@Override
	public String toString() {
		return "[id=" + id + "<br>providerId=" + providerId + "<br> providerName=" + providerName
				+ "<br> logoUrl=" + logoUrl + "<br> address=" + address + "<br> cityId=" + cityId + "<br> cityName=" + cityName
				+ "<br> telephone=" + telephone + "<br> email=" + email + "<br> masterName=" + masterName + "<br> initiationDate="
				+ initiationDate + "<br> masterTel=" + masterTel + "<br> customerTel=" + customerTel + "<br> telForPassenger="
				+ telForPassenger + "<br> emergencyTel=" + emergencyTel + "<br> propertyName=" + propertyName
				+ "<br> certificateAthority=" + certificateAthority + "<br> expiryDateStart=" + expiryDateStart
				+ "<br> expiryDateEnd=" + expiryDateEnd + "<br> approveDate=" + approveDate + "<br> licenceStatus="
				+ licenceStatus + "<br> documentAddr=" + documentAddr + "<br> loginLogoUrl=" + loginLogoUrl
				+ "<br> wechatQrcodeUrl=" + wechatQrcodeUrl + "<br> status=" + status + "<br> createTime=" + createTime
				+ "<br> updateTime=" + updateTime + "<br> expiryDateStarts=" + expiryDateStarts + "<br> expiryDateEnds="
				+ expiryDateEnds + "<br> approveDates=" + approveDates + "]";
	}

	public Double getPlatformServiceFee() {
		return platformServiceFee;
	}

	public void setPlatformServiceFee(Double platformServiceFee) {
		this.platformServiceFee = platformServiceFee;
	}

	public Integer getParentProviderId() {
		return parentProviderId;
	}

	public void setParentProviderId(Integer parentProviderId) {
		this.parentProviderId = parentProviderId;
	}
    
}