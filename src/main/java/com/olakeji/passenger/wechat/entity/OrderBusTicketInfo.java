package com.olakeji.passenger.wechat.entity;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.olakeji.tsp.common.QueryCondition;
import com.olakeji.tsp.common.SearchType;
import lombok.Data;

@Data
public class OrderBusTicketInfo {
    private Integer id;

    @QueryCondition
    private String orderNo;

    @QueryCondition
    private String busId;

    private String departStation;

    private Integer departStationId;

    private String arriveStation;

    private Integer arriveStationId;
    
    @QueryCondition
    private Date departDate;

    private Date departTime;

    private Integer providerId;

    private String providerName;

    private String channelOrderParam;

    private Long createTime;

    private Long updateTime;
    
    private String passengerName;

    /**
     * 查询开始时间
     */
    private Long createStartTime;	
    
    /**
     * 查询结束时间
     */
    private Long createEndTime;
    
    /**
     * 状态列表
     */
    @QueryCondition(searchType=SearchType.IN,relateInField="Status")
    private List<Integer>statusList;
    
    /**
     * 查询的身份证列表
     */
    @QueryCondition(searchType=SearchType.IN,relateInField="IdCardNo")
    private List<String>idCardNoList;
    
    @QueryCondition
    private String verifyCode;
    
    private String passengerMobile;
    
    private BigDecimal serviceFee;//服务费
    
    public String getVerifyCode()
    {
        return verifyCode;
    }

    public void setVerifyCode(String verifyCode)
    {
        this.verifyCode = verifyCode;
    }


    public List<String> getIdCardNoList() {
		return idCardNoList;
	}

	public void setIdCardNoList(List<String> idCardNoList) {
		this.idCardNoList = idCardNoList;
	}

	public List<Integer> getStatusList() {
		return statusList;
	}

	public void setStatusList(List<Integer> statusList) {
		this.statusList = statusList;
	}

	public Long getCreateStartTime() {
		return createStartTime;
	}

	public void setCreateStartTime(Long createStartTime) {
		this.createStartTime = createStartTime;
	}

	public Long getCreateEndTime() {
		return createEndTime;
	}

	public void setCreateEndTime(Long createEndTime) {
		this.createEndTime = createEndTime;
	}

	/**
     * 哪个用户购买的 
     */
	@QueryCondition
    private Integer userId;
    
    /**
     * 状态
     */
    @QueryCondition
    private Integer status;
    
    /**
     * 票价
     */
    private Double ticketPrice;
    
    /**
     * 证件号
     */
    private String idCardNo;
    
    /**
     * 证件类型
     */
    private Integer idCardType;
    
    /**
     * 票号
     */
    @QueryCondition
    private String ticketSerialNo;
    
    /**
     * 保险金额
     */
    private Double insurancePrice;

    private String insuranceNo; // 保单号

    private Integer insuranceStatus; //保险状态
    /**
     *  票种规则名称
     */
    private String itemName;

    public String getInsuranceNo() {
        return insuranceNo;
    }

    public void setInsuranceNo(String insuranceNo) {
        this.insuranceNo = insuranceNo;
    }

    public Integer getInsuranceStatus() {
        return insuranceStatus;
    }

    public void setInsuranceStatus(Integer insuranceStatus) {
        this.insuranceStatus = insuranceStatus;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getIdCardNo() {
		return idCardNo;
	}

	public void setIdCardNo(String idCardNo) {
		this.idCardNo = idCardNo;
	}

	public Integer getIdCardType() {
		return idCardType;
	}

	public void setIdCardType(Integer idCardType) {
		this.idCardType = idCardType;
	}

	public String getTicketSerialNo() {
		return ticketSerialNo;
	}

	public void setTicketSerialNo(String ticketSerialNo) {
		this.ticketSerialNo = ticketSerialNo;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Double getTicketPrice() {
		return ticketPrice;
	}

	public void setTicketPrice(Double ticketPrice) {
		this.ticketPrice = ticketPrice;
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
        this.orderNo = orderNo == null ? null : orderNo.trim();
    }

    public String getBusId() {
        return busId;
    }

    public void setBusId(String busId) {
        this.busId = busId == null ? null : busId.trim();
    }

    public String getDepartStation() {
        return departStation;
    }

    public void setDepartStation(String departStation) {
        this.departStation = departStation == null ? null : departStation.trim();
    }

    public Integer getDepartStationId() {
        return departStationId;
    }

    public void setDepartStationId(Integer departStationId) {
        this.departStationId = departStationId;
    }

    public String getArriveStation() {
        return arriveStation;
    }

    public void setArriveStation(String arriveStation) {
        this.arriveStation = arriveStation == null ? null : arriveStation.trim();
    }

    public Integer getArriveStationId() {
        return arriveStationId;
    }

    public void setArriveStationId(Integer arriveStationId) {
        this.arriveStationId = arriveStationId;
    }

    public Date getDepartDate() {
        return departDate;
    }

    public void setDepartDate(Date departDate) {
        this.departDate = departDate;
    }

    public Date getDepartTime() {
        return departTime;
    }

    public void setDepartTime(Date departTime) {
        this.departTime = departTime;
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

    public String getChannelOrderParam() {
        return channelOrderParam;
    }

    public void setChannelOrderParam(String channelOrderParam) {
        this.channelOrderParam = channelOrderParam == null ? null : channelOrderParam.trim();
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

	public Double getInsurancePrice() {
		return insurancePrice;
	}

	public void setInsurancePrice(Double insurancePrice) {
		this.insurancePrice = insurancePrice;
	}
	public String getPassengerName() {
		return passengerName;
	}

	public void setPassengerName(String passengerName) {
		this.passengerName = passengerName;
	}
	
	public String getPassengerMobile() {
		return passengerMobile;
	}

	public void setPassengerMobile(String passengerMobile) {
		this.passengerMobile = passengerMobile;
	}

	public BigDecimal getServiceFee() {
		return serviceFee;
	}

	public void setServiceFee(BigDecimal serviceFee) {
		this.serviceFee = serviceFee;
	}

	@Override
	public String toString() {
		return "OrderBusTicketInfo [id=" + id + ", orderNo=" + orderNo + ", busId=" + busId + ", departStation="
				+ departStation + ", departStationId=" + departStationId + ", arriveStation=" + arriveStation
				+ ", arriveStationId=" + arriveStationId + ", departDate=" + departDate + ", departTime=" + departTime
				+ ", providerId=" + providerId + ", providerName=" + providerName + ", channelOrderParam="
				+ channelOrderParam + ", createTime=" + createTime + ", updateTime=" + updateTime + ", passengerName="
				+ passengerName + ", userId=" + userId + ", status=" + status + ", ticketPrice=" + ticketPrice
				+ ", idCardNo=" + idCardNo + ", idCardType=" + idCardType + ", ticketSerialNo=" + ticketSerialNo
				+ ", insurancePrice=" + insurancePrice + "]";
	}
	
}