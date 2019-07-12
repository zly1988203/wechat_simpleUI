package com.olakeji.passenger.wechat.entity;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.olakeji.tsp.common.QueryCondition;
import com.olakeji.tsp.common.SearchType;

public class CouponReceiveRecord {
	@QueryCondition(searchType=SearchType.EQ)
    private Long id;

    @QueryCondition(searchType=SearchType.EQ)
    private Integer couponId;

    @QueryCondition(searchType=SearchType.EQ)
    private Long userId;

    @QueryCondition(searchType=SearchType.EQ)
    private Integer status;

    private Long receiveTime;

    private Long useTime;
    
    @QueryCondition(searchType=SearchType.EQ)
    private String orderNo;
    
    private Long createTime;
    
    private Long updateTime;
    
    @QueryCondition(searchType=SearchType.EQ)
    private Long campaignId;
    @QueryCondition(searchType=SearchType.LIKE)
    private String couponName;
    
    private byte couponType;
    
    private BigDecimal faceValue;
    
    private byte limitBusiness;
    
    private Integer usedNum;
    
    private Integer receiveNum;
    
    @QueryCondition(searchType=SearchType.EQ)
    private String userMobile;
    
    private Byte userType;
    
    @QueryCondition(searchType=SearchType.EQ)
    private Integer providerId;
    
    private Long expiryStartDate;
    
    private Long expiryEndDate;
    
    private BigDecimal minLimitAmount;
    
    private Integer inviterMemberId;
    
    private Double orderPrice;//订单金额
    
    private Long relateId;//coupon_relate_campaign主键id
    
    private List<Integer> list;
    
    private byte couponDateType;
    
   	private Integer limitNum;
   	
   	private Long grantId;
   	
   	private Integer lineId;
   	
   	private String limitLine;
	private Byte extraLimit;//额外限制条件 0--可以与促销价格共用，1--仅原价购买时可用
	private Date limitStartTime;//限制时间段的开始时间
	private Date limitEndTime;//限制时间段的结束时间
	private Byte limitTimeType;//返回字段 0 不限制时间段  1限制时间段
	private String limitStartTimeStr;//限制优惠券使用时间段的开始时间
	private String limitEndTimeStr;//限制优惠券使用时间段的结束时间
	private String remark;//备注信息
	private Byte isDiscount;//0--固定金额  1--折扣
	private BigDecimal limitDiscountMoney;
	private Integer limitLineType;
	private Integer limitCityType;
	private String LimitCity;
	private String LimitLine;

	public Byte getExtraLimit() {
		return extraLimit;
	}

	public void setExtraLimit(Byte extraLimit) {
		this.extraLimit = extraLimit;
	}

	public Date getLimitStartTime() {
		return limitStartTime;
	}

	public void setLimitStartTime(Date limitStartTime) {
		this.limitStartTime = limitStartTime;
	}

	public Date getLimitEndTime() {
		return limitEndTime;
	}

	public void setLimitEndTime(Date limitEndTime) {
		this.limitEndTime = limitEndTime;
	}

	public Byte getLimitTimeType() {
		return limitTimeType;
	}

	public void setLimitTimeType(Byte limitTimeType) {
		this.limitTimeType = limitTimeType;
	}

	public String getLimitStartTimeStr() {
		return limitStartTimeStr;
	}

	public void setLimitStartTimeStr(String limitStartTimeStr) {
		this.limitStartTimeStr = limitStartTimeStr;
	}

	public String getLimitEndTimeStr() {
		return limitEndTimeStr;
	}

	public void setLimitEndTimeStr(String limitEndTimeStr) {
		this.limitEndTimeStr = limitEndTimeStr;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Byte getIsDiscount() {
		return isDiscount;
	}

	public void setIsDiscount(Byte isDiscount) {
		this.isDiscount = isDiscount;
	}

	public BigDecimal getLimitDiscountMoney() {
		return limitDiscountMoney;
	}

	public void setLimitDiscountMoney(BigDecimal limitDiscountMoney) {
		this.limitDiscountMoney = limitDiscountMoney;
	}

	public Integer getLimitLineType() {
		return limitLineType;
	}

	public void setLimitLineType(Integer limitLineType) {
		this.limitLineType = limitLineType;
	}

	public Integer getLimitCityType() {
		return limitCityType;
	}

	public void setLimitCityType(Integer limitCityType) {
		this.limitCityType = limitCityType;
	}

	public String getLimitCity() {
		return LimitCity;
	}

	public void setLimitCity(String limitCity) {
		LimitCity = limitCity;
	}

	public Byte getUserType() {
		return userType;
	}

	public void setUserType(Byte userType) {
		this.userType = userType;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

	public BigDecimal getMinLimitAmount() {
		return minLimitAmount;
	}

	public void setMinLimitAmount(BigDecimal minLimitAmount) {
		this.minLimitAmount = minLimitAmount;
	}

	public Long getExpiryStartDate() {
		return expiryStartDate;
	}

	public void setExpiryStartDate(Long expiryStartDate) {
		this.expiryStartDate = expiryStartDate;
	}

	public Long getExpiryEndDate() {
		return expiryEndDate;
	}

	public void setExpiryEndDate(Long expiryEndDate) {
		this.expiryEndDate = expiryEndDate;
	}

	public Integer getCouponId() {
        return couponId;
    }

    public void setCouponId(Integer couponId) {
        this.couponId = couponId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Long getReceiveTime() {
        return receiveTime;
    }

    public void setReceiveTime(Long receiveTime) {
        this.receiveTime = receiveTime;
    }

    public Long getUseTime() {
        return useTime;
    }

    public void setUseTime(Long useTime) {
        this.useTime = useTime;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo == null ? null : orderNo.trim();
    }

	public Long getCampaignId() {
		return campaignId;
	}

	public void setCampaignId(Long campaignId) {
		this.campaignId = campaignId;
	}

	public String getCouponName() {
		return couponName;
	}

	public void setCouponName(String couponName) {
		this.couponName = couponName;
	}

	public BigDecimal getFaceValue() {
		return faceValue;
	}

	public void setFaceValue(BigDecimal faceValue) {
		this.faceValue = faceValue;
	}

	public byte getLimitBusiness() {
		return limitBusiness;
	}

	public void setLimitBusiness(byte limitBusiness) {
		this.limitBusiness = limitBusiness;
	}

	public Integer getUsedNum() {
		return usedNum;
	}

	public void setUsedNum(Integer usedNum) {
		this.usedNum = usedNum;
	}

	public Integer getReceiveNum() {
		return receiveNum;
	}

	public void setReceiveNum(Integer receiveNum) {
		this.receiveNum = receiveNum;
	}

	public Integer getProviderId() {
		return providerId;
	}

	public void setProviderId(Integer providerId) {
		this.providerId = providerId;
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

	public byte getCouponType() {
		return couponType;
	}

	public void setCouponType(byte couponType) {
		this.couponType = couponType;
	}

	public String getUserMobile() {
		return userMobile;
	}

	public void setUserMobile(String userMobile) {
		this.userMobile = userMobile;
	}

	public Integer getInviterMemberId() {
		return inviterMemberId;
	}

	public void setInviterMemberId(Integer inviterMemberId) {
		this.inviterMemberId = inviterMemberId;
	}

	public Double getOrderPrice() {
		return orderPrice;
	}

	public void setOrderPrice(Double orderPrice) {
		this.orderPrice = orderPrice;
	}

	public Long getRelateId() {
		return relateId;
	}

	public void setRelateId(Long relateId) {
		this.relateId = relateId;
	}

	public List<Integer> getList() {
		return list;
	}

	public void setList(List<Integer> list) {
		this.list = list;
	}

	public byte getCouponDateType() {
		return couponDateType;
	}

	public void setCouponDateType(byte couponDateType) {
		this.couponDateType = couponDateType;
	}

	public Integer getLimitNum() {
		return limitNum;
	}

	public void setLimitNum(Integer limitNum) {
		this.limitNum = limitNum;
	}

	public Long getGrantId() {
		return grantId;
	}

	public void setGrantId(Long grantId) {
		this.grantId = grantId;
	}

	public Integer getLineId() {
		return lineId;
	}

	public void setLineId(Integer lineId) {
		this.lineId = lineId;
	}

	public String getLimitLine() {
		return limitLine;
	}

	public void setLimitLine(String limitLine) {
		this.limitLine = limitLine;
	}
    
}