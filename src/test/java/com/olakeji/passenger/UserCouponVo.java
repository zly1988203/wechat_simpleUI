package com.olakeji.passenger;

import java.math.BigDecimal;
import java.util.List;

public class UserCouponVo {
    
    private String couponType;
    
    private String name;

    /**
     * 优惠券金额
     */
    private BigDecimal amount;

    private String remark;

    private Long startTime;
    
    private Long endTime;

    private Integer tripType;

    private Integer minLimitAmount;

    private BigDecimal discountMaxLimitAmount;

    private BigDecimal discount;
    /**
     * 车类型
     */
    private String carType;
    
    private String limitLine;
    
    private Integer couponId;
    
    private byte couponDateType;
    
    /**
     * 城市
     */
    private String citys;
    
    private List<Integer> cityIds;
    
    /**
     * 是否可用
     */
    private Integer isValid;
    /**
     * 主键(领取记录ID)
     */
    private Long recordId;
    
    public byte getCouponDateType() {
		return couponDateType;
	}
	public void setCouponDateType(byte couponDateType) {
		this.couponDateType = couponDateType;
	}
	public Long getStartTime() {
		return startTime;
	}
	public void setStartTime(Long startTime) {
		this.startTime = startTime;
	}
	public String getCouponType()
    {
        return couponType;
    }
    public void setCouponType(String couponType)
    {
        this.couponType = couponType;
    }
    public String getName()
    {
        return name;
    }
    public void setName(String name)
    {
        this.name = name;
    }
    public BigDecimal getAmount()
    {
        return amount;
    }
    public void setAmount(BigDecimal amount)
    {
        this.amount = amount;
    }
    public String getRemark()
    {
        return remark;
    }
    public void setRemark(String remark)
    {
        this.remark = remark;
    }
    public Long getEndTime()
    {
        return endTime;
    }
    public void setEndTime(Long endTime)
    {
        this.endTime = endTime;
    }
    public Integer getTripType()
    {
        return tripType;
    }
    public void setTripType(Integer tripType)
    {
        this.tripType = tripType;
    }
    public Integer getMinLimitAmount()
    {
        return minLimitAmount;
    }
    public void setMinLimitAmount(Integer minLimitAmount)
    {
        this.minLimitAmount = minLimitAmount;
    }
   
    public BigDecimal getDiscountMaxLimitAmount()
    {
        return discountMaxLimitAmount;
    }
    public void setDiscountMaxLimitAmount(BigDecimal discountMaxLimitAmount)
    {
        this.discountMaxLimitAmount = discountMaxLimitAmount;
    }
    public BigDecimal getDiscount()
    {
        return discount;
    }
    public void setDiscount(BigDecimal discount)
    {
        this.discount = discount;
    }
    public String getCarType()
    {
        return carType;
    }
    public void setCarType(String carType)
    {
        this.carType = carType;
    }
	public String getLimitLine() {
		return limitLine;
	}
	public void setLimitLine(String limitLine) {
		this.limitLine = limitLine;
	}
	public Integer getCouponId() {
		return couponId;
	}
	public void setCouponId(Integer couponId) {
		this.couponId = couponId;
	}
	public String getCitys() {
		return citys;
	}
	public void setCitys(String citys) {
		this.citys = citys;
	}
	public List<Integer> getCityIds() {
		return cityIds;
	}
	public void setCityIds(List<Integer> cityIds) {
		this.cityIds = cityIds;
	}
	public Integer getIsValid() {
		return isValid;
	}
	public void setIsValid(Integer isValid) {
		this.isValid = isValid;
	}
	public Long getRecordId() {
		return recordId;
	}
	public void setRecordId(Long recordId) {
		this.recordId = recordId;
	}
		
}