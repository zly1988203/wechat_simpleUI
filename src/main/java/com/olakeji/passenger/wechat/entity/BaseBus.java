package com.olakeji.passenger.wechat.entity;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.QueryCondition;

public class BaseBus {
	@QueryCondition
    private Long id;

    private String busNum;

    private Integer departProvinceId;

    private String departProvinceName;

    private Integer departCityId;

    private String departCityName;

    private Integer departDistrictId;

    private String departDistrictName;
    
    private String departStation;
    @QueryCondition
    
    private Integer departStationId;
    
    
    private String departStationCode;

    
    /**
     * 出发纬度
     */
    private Double departLng;

    /**
     * 出发经度
     */
    private Double departLat;
    @QueryCondition
    private Date departDate;

    private Date departTime;
    
    
    private String scheduleCode;
    
    private byte isCooperate;
    
    private byte isCooperateDealer;
    
    private String lineTitle;
    private String linePicUrl;


    private Integer ticketPriceType = (int) Constant.SAME_PRICE;

    public Integer getTicketPriceType() {
        return ticketPriceType;
    }

    public void setTicketPriceType(Integer ticketPriceType) {
        this.ticketPriceType = ticketPriceType;
    }
    public String getScheduleCode() {
		return scheduleCode;
	}

	public void setScheduleCode(String scheduleCode) {
		this.scheduleCode = scheduleCode;
	}

	private String departTimeSim;
    
    public String getDepartTimeSim() {
		return departTimeSim;
	}

	public void setDepartTimeSim(String departTimeSim) {
		this.departTimeSim = departTimeSim;
	}

	/**
     * 到达时间
     */
    private Date arriveTime;

    /**
     * 出发站点是否为第一个站点
     */
    private Integer firstStationFlag=0;
    
    /**
     * 班次信息列表
     */
    private Integer scheduleInfoStatus;
    
    private Integer ifQuickCheck;//是否需要快速验票
    
    private Byte busType;
    
    private Integer busStatus;
    
    /**
     * 活动标签
     */
    private List<String> activityTag;
    
    private Integer specialState;//是否特价  0否 1是
    private Integer departAreaId;
    private Integer arriveAreaId;
    private List<StationVo> stationVoList;
    public Integer getDepartAreaId() {
        return departAreaId;
    }

    public void setDepartAreaId(Integer departAreaId) {
        this.departAreaId = departAreaId;
    }

    public Integer getArriveAreaId() {
        return arriveAreaId;
    }

    public void setArriveAreaId(Integer arriveAreaId) {
        this.arriveAreaId = arriveAreaId;
    }

    public Integer getIfQuickCheck() {
		return ifQuickCheck;
	}

	public void setIfQuickCheck(Integer ifQuickCheck) {
		this.ifQuickCheck = ifQuickCheck;
	}

	public Byte getBusType() {
		return busType;
	}

	public void setBusType(Byte busType) {
		this.busType = busType;
	}

	public Integer getScheduleInfoStatus() {
		return scheduleInfoStatus;
	}

	public void setScheduleInfoStatus(Integer scheduleInfoStatus) {
		this.scheduleInfoStatus = scheduleInfoStatus;
	}

	public Integer getFirstStationFlag() {
		return firstStationFlag;
	}

	public void setFirstStationFlag(Integer firstStationFlag) {
		this.firstStationFlag = firstStationFlag;
	}

	public Date getArriveTime() {
		return arriveTime;
	}

	public void setArriveTime(Date arriveTime) {
		this.arriveTime = arriveTime;
	}

	private String departDesc;

    private Integer arriveProvinceId;

    private String arriveProvinceName;
    
    private Integer arriveCityId;
    
    private String arriveCityName;

    private Integer arriveDistrictId;

    private String arriveDistrictName;

    private String arriveStation;
    
    /**
     * 到达纬度
     */
    @QueryCondition
    private Integer arriveStationId;

    private String arriveStationCode;

    private Double arriveLng;

    /**
     * 到达经度
     */
    private Double arriveLat;

    private String consumeTime;

    private String arriveDesc;

    private Double distance;

    private String vehicleType;

    private String vehicleCard;

    private Byte vehicleSeatType;

    private Double sellPrice;

    private Integer seatRemain;

    private Integer actualPerson;

    private Integer providerId;

    private String providerCode;

    private String providerName;

    private String channelOrderParam;

    private String channelOrderParamCode;

    private String operator;

    private String fetchTicketAddress;

    private String fetchTicketType;

    private Long createTime;

    private Long updateTime;

    private Byte status;
    @QueryCondition
    private Integer scheduleId;
    @QueryCondition
    private Integer scheduleInfoId;
    
    private Integer businessType;

    private List<Integer>departStationIdList;
    
    /**
     * 线路id
     */
    private Integer lineId;
    
   /**
    * 隔出发站点和目的站点的总距离
    */
    private Double stationDistance;
    
    private List<BaseBus>sameStationBusList=new ArrayList<BaseBus>();
    
    /**
     * 剩余票数
     */
    private Integer ticketRemainNum;
    
    /**
     * 站点排序顺序
     */
    private Integer stationSortNo;
    
    private String idStr;
    
    /**
     * 出发距离
     */
    private Double departDistance;
    
    /**
     * 到达距离
     */
    private Double arriveDistance;
    
    private String lineCode;//线路编号
    
    private String lineName;//线路名称
    
    private String departDateStr;
    
	private String departTimeStr;
    
    private Long scheduleDate;
    
    private Date scheduleTime;
    	
    
    /**
     * 线路id列表
     */
    private List<Integer>lineIdList;
    
    /**
     * 班次站点列表
     */
    private List<BusLineStation>busLineStationList;
    
    /**
     * 到达站点列表
     */
    private List<BusLineStation>arriveLineStationList;
    //标签列表
    private List<String> tagList;
    //是否分段票价
    private String lineType;
    //同一班次票价数
    private Integer priceCount;
    //两个站点所使用时间
    private Integer useTime;
    //mobile of driver
    private String driverMobile;
    //car no
    private String carNo;
    
    private String statusDesc;//状态描述
    
    private Double specialPrice;//特价
    /**
     * 购买的标识
     */
    private Integer buyFlag=1;
    public Integer getBuyFlag() {
		return buyFlag;
	}

	public void setBuyFlag(Integer buyFlag) {
		this.buyFlag = buyFlag;
	}

	public List<BusLineStation> getArriveLineStationList() {
		return arriveLineStationList;
	}

	public void setArriveLineStationList(List<BusLineStation> arriveLineStationList) {
		this.arriveLineStationList = arriveLineStationList;
	}

	public List<BusLineStation> getBusLineStationList() {
		return busLineStationList;
	}

	public void setBusLineStationList(List<BusLineStation> busLineStationList) {
		this.busLineStationList = busLineStationList;
	}
	
    public Long getScheduleDate() {
		return scheduleDate;
	}

	public void setScheduleDate(Long scheduleDate) {
		this.scheduleDate = scheduleDate;
	}

	public Date getScheduleTime() {
		return scheduleTime;
	}

	public void setScheduleTime(Date scheduleTime) {
		this.scheduleTime = scheduleTime;
	}
	
	public List<Integer> getLineIdList() {
		return lineIdList;
	}

	public void setLineIdList(List<Integer> lineIdList) {
		this.lineIdList = lineIdList;
	}

	public Double getDepartDistance() {
		return departDistance;
	}

	public void setDepartDistance(Double departDistance) {
		this.departDistance = departDistance;
	}

	public Integer getBusinessType() {
		return businessType;
	}

	public void setBusinessType(Integer businessType) {
		this.businessType = businessType;
	}

	public Double getArriveDistance() {
		return arriveDistance;
	}

	public void setArriveDistance(Double arriveDistance) {
		this.arriveDistance = arriveDistance;
	}

	public String getIdStr() {
		return idStr;
	}

	public void setIdStr(String idStr) {
		this.idStr = idStr;
	}

	public Integer getStationSortNo() {
		return stationSortNo;
	}

	public void setStationSortNo(Integer stationSortNo) {
		this.stationSortNo = stationSortNo;
	}

	public Integer getTicketRemainNum() {
		return ticketRemainNum;
	}

	public void setTicketRemainNum(Integer ticketRemainNum) {
		this.ticketRemainNum = ticketRemainNum;
	}

	public List<BaseBus> getSameStationBusList() {
		return sameStationBusList;
	}

	public void setSameStationBusList(List<BaseBus> sameStationBusList) {
		this.sameStationBusList = sameStationBusList;
	}

	public Double getStationDistance() {
		return stationDistance;
	}

	public void setStationDistance(Double stationDistance) {
		this.stationDistance = stationDistance;
	}

    public Integer getLineId() {
		return lineId;
	}

	public void setLineId(Integer lineId) {
		this.lineId = lineId;
	}

	private List<Integer>arriveStationIdList;
    
    public List<Integer> getDepartStationIdList() {
		return departStationIdList;
	}

	public void setDepartStationIdList(List<Integer> departStationIdList) {
		this.departStationIdList = departStationIdList;
	}

	public List<Integer> getArriveStationIdList() {
		return arriveStationIdList;
	}

	public void setArriveStationIdList(List<Integer> arriveStationIdList) {
		this.arriveStationIdList = arriveStationIdList;
	}

	public Long getId() {
		idStr = id +"";
        return id;
    }

    public void setId(Long id) {
    	idStr = id +"";
        this.id = id;
    }

    public String getBusNum() {
        return busNum;
    }

    public void setBusNum(String busNum) {
        this.busNum = busNum == null ? null : busNum.trim();
    }

    public Integer getDepartProvinceId() {
        return departProvinceId;
    }

    public void setDepartProvinceId(Integer departProvinceId) {
        this.departProvinceId = departProvinceId;
    }

    public String getDepartProvinceName() {
        return departProvinceName;
    }

    public void setDepartProvinceName(String departProvinceName) {
        this.departProvinceName = departProvinceName == null ? null : departProvinceName.trim();
    }

    public Integer getDepartCityId() {
        return departCityId;
    }

    public void setDepartCityId(Integer departCityId) {
        this.departCityId = departCityId;
    }

    public String getDepartCityName() {
        return departCityName;
    }

    public void setDepartCityName(String departCityName) {
        this.departCityName = departCityName == null ? null : departCityName.trim();
    }

    public Integer getDepartDistrictId() {
        return departDistrictId;
    }

    public void setDepartDistrictId(Integer departDistrictId) {
        this.departDistrictId = departDistrictId;
    }

    public String getDepartDistrictName() {
        return departDistrictName;
    }

    public void setDepartDistrictName(String departDistrictName) {
        this.departDistrictName = departDistrictName == null ? null : departDistrictName.trim();
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

    public String getDepartStationCode() {
        return departStationCode;
    }

    public void setDepartStationCode(String departStationCode) {
        this.departStationCode = departStationCode == null ? null : departStationCode.trim();
    }

    public Double getDepartLng() {
        return departLng;
    }

    public void setDepartLng(Double departLng) {
        this.departLng = departLng;
    }

    public Double getDepartLat() {
        return departLat;
    }

    public void setDepartLat(Double departLat) {
        this.departLat = departLat;
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
     	SimpleDateFormat format = new SimpleDateFormat("HH:mm:ss");
    		departTimeSim= format.format(departTime);
        this.departTime = departTime;
    }

    public String getDepartDesc() {
        return departDesc;
    }

    public void setDepartDesc(String departDesc) {
        this.departDesc = departDesc == null ? null : departDesc.trim();
    }

    public Integer getArriveProvinceId() {
        return arriveProvinceId;
    }

    public void setArriveProvinceId(Integer arriveProvinceId) {
        this.arriveProvinceId = arriveProvinceId;
    }

    public String getArriveProvinceName() {
        return arriveProvinceName;
    }

    public void setArriveProvinceName(String arriveProvinceName) {
        this.arriveProvinceName = arriveProvinceName == null ? null : arriveProvinceName.trim();
    }

    public Integer getArriveCityId() {
        return arriveCityId;
    }

    public void setArriveCityId(Integer arriveCityId) {
        this.arriveCityId = arriveCityId;
    }

    public String getArriveCityName() {
        return arriveCityName;
    }

    public void setArriveCityName(String arriveCityName) {
        this.arriveCityName = arriveCityName == null ? null : arriveCityName.trim();
    }

    public Integer getArriveDistrictId() {
        return arriveDistrictId;
    }

    public void setArriveDistrictId(Integer arriveDistrictId) {
        this.arriveDistrictId = arriveDistrictId;
    }

    public String getArriveDistrictName() {
        return arriveDistrictName;
    }

    public void setArriveDistrictName(String arriveDistrictName) {
        this.arriveDistrictName = arriveDistrictName == null ? null : arriveDistrictName.trim();
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

    public String getArriveStationCode() {
        return arriveStationCode;
    }

    public void setArriveStationCode(String arriveStationCode) {
        this.arriveStationCode = arriveStationCode == null ? null : arriveStationCode.trim();
    }

    public Double getArriveLng() {
        return arriveLng;
    }

    public void setArriveLng(Double arriveLng) {
        this.arriveLng = arriveLng;
    }

    public Double getArriveLat() {
        return arriveLat;
    }

    public void setArriveLat(Double arriveLat) {
        this.arriveLat = arriveLat;
    }

    public String getConsumeTime() {
        return consumeTime;
    }

    public void setConsumeTime(String consumeTime) {
        this.consumeTime = consumeTime == null ? null : consumeTime.trim();
    }

    public String getArriveDesc() {
        return arriveDesc;
    }

    public void setArriveDesc(String arriveDesc) {
        this.arriveDesc = arriveDesc == null ? null : arriveDesc.trim();
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType == null ? null : vehicleType.trim();
    }

    public String getVehicleCard() {
        return vehicleCard;
    }

    public void setVehicleCard(String vehicleCard) {
        this.vehicleCard = vehicleCard == null ? null : vehicleCard.trim();
    }

    public Byte getVehicleSeatType() {
        return vehicleSeatType;
    }

    public void setVehicleSeatType(Byte vehicleSeatType) {
        this.vehicleSeatType = vehicleSeatType;
    }

    public Double getSellPrice() {
        return sellPrice;
    }

    public void setSellPrice(Double sellPrice) {
        this.sellPrice = sellPrice;
    }

    public Integer getSeatRemain() {
        return seatRemain;
    }

    public void setSeatRemain(Integer seatRemain) {
        this.seatRemain = seatRemain;
    }

    public Integer getActualPerson() {
        return actualPerson;
    }

    public void setActualPerson(Integer actualPerson) {
        this.actualPerson = actualPerson;
    }

    public Integer getProviderId() {
        return providerId;
    }

    public void setProviderId(Integer providerId) {
        this.providerId = providerId;
    }

    public String getProviderCode() {
        return providerCode;
    }

    public void setProviderCode(String providerCode) {
        this.providerCode = providerCode == null ? null : providerCode.trim();
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

    public String getChannelOrderParamCode() {
        return channelOrderParamCode;
    }

    public void setChannelOrderParamCode(String channelOrderParamCode) {
        this.channelOrderParamCode = channelOrderParamCode == null ? null : channelOrderParamCode.trim();
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator == null ? null : operator.trim();
    }

    public String getFetchTicketAddress() {
        return fetchTicketAddress;
    }

    public void setFetchTicketAddress(String fetchTicketAddress) {
        this.fetchTicketAddress = fetchTicketAddress == null ? null : fetchTicketAddress.trim();
    }

    public String getFetchTicketType() {
        return fetchTicketType;
    }

    public void setFetchTicketType(String fetchTicketType) {
        this.fetchTicketType = fetchTicketType == null ? null : fetchTicketType.trim();
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

    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }

    public Integer getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
    }

    public Integer getScheduleInfoId() {
        return scheduleInfoId;
    }

    public void setScheduleInfoId(Integer scheduleInfoId) {
        this.scheduleInfoId = scheduleInfoId;
    }

	public String getLineCode() {
		return lineCode;
	}

	public void setLineCode(String lineCode) {
		this.lineCode = lineCode;
	}

	public String getLineName() {
		return lineName;
	}

	public void setLineName(String lineName) {
		this.lineName = lineName;
	}

	public String getDepartDateStr() {
		return departDateStr;
	}

	public void setDepartDateStr(String departDateStr) {
		this.departDateStr = departDateStr;
	}

	public String getDepartTimeStr() {
		return departTimeStr;
	}

	public void setDepartTimeStr(String departTimeStr) {
		this.departTimeStr = departTimeStr;
	}

	public List<String> getTagList() {
		return tagList;
	}

	public void setTagList(List<String> tagList) {
		this.tagList = tagList;
	}

    public String getLineType()
    {
        return lineType;
    }

    public void setLineType(String lineType)
    {
        this.lineType = lineType;
    }

    public Integer getPriceCount()
    {
        return priceCount;
    }

    public void setPriceCount(Integer priceCount)
    {
        this.priceCount = priceCount;
    }

	public Integer getUseTime() {
		return useTime;
	}

	public void setUseTime(Integer useTime) {
		this.useTime = useTime;
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

	public Integer getBusStatus() {
		return busStatus;
	}

	public void setBusStatus(Integer busStatus) {
		this.busStatus = busStatus;
	}

	public List<String> getActivityTag() {
		return activityTag;
	}

	public void setActivityTag(List<String> activityTag) {
		this.activityTag = activityTag;
	}

	public String getStatusDesc() {
		return statusDesc;
	}

	public void setStatusDesc(String statusDesc) {
		this.statusDesc = statusDesc;
	}

	public Double getSpecialPrice() {
		return specialPrice;
	}

	public void setSpecialPrice(Double specialPrice) {
		this.specialPrice = specialPrice;
	}

	public Integer getSpecialState() {
		return specialState;
	}

	public void setSpecialState(Integer specialState) {
		this.specialState = specialState;
	}

	public byte getIsCooperate() {
		return isCooperate;
	}

	public void setIsCooperate(byte isCooperate) {
		this.isCooperate = isCooperate;
	}

	public byte getIsCooperateDealer() {
		return isCooperateDealer;
	}

	public void setIsCooperateDealer(byte isCooperateDealer) {
		this.isCooperateDealer = isCooperateDealer;
	}

	public String getLineTitle() {
		return lineTitle;
	}

	public void setLineTitle(String lineTitle) {
		this.lineTitle = lineTitle;
	}

	public String getLinePicUrl() {
		return linePicUrl;
	}

	public void setLinePicUrl(String linePicUrl) {
		this.linePicUrl = linePicUrl;
	}

	@Override
	public String toString() {
		return "BaseBus [id=" + id + ", busNum=" + busNum + ", departProvinceId=" + departProvinceId
				+ ", departProvinceName=" + departProvinceName + ", departCityId=" + departCityId + ", departCityName="
				+ departCityName + ", departDistrictId=" + departDistrictId + ", departDistrictName="
				+ departDistrictName + ", departStation=" + departStation + ", departStationId=" + departStationId
				+ ", departStationCode=" + departStationCode + ", departLng=" + departLng + ", departLat=" + departLat
				+ ", departDate=" + departDate + ", departTime=" + departTime + ", scheduleCode=" + scheduleCode
				+ ", isCooperate=" + isCooperate + ", isCooperateDealer=" + isCooperateDealer + ", lineTitle="
				+ lineTitle + ", linePicUrl=" + linePicUrl + ", departTimeSim=" + departTimeSim + ", arriveTime="
				+ arriveTime + ", firstStationFlag=" + firstStationFlag + ", scheduleInfoStatus=" + scheduleInfoStatus
				+ ", ifQuickCheck=" + ifQuickCheck + ", busType=" + busType + ", busStatus=" + busStatus
				+ ", activityTag=" + activityTag + ", specialState=" + specialState + ", departDesc=" + departDesc
				+ ", arriveProvinceId=" + arriveProvinceId + ", arriveProvinceName=" + arriveProvinceName
				+ ", arriveCityId=" + arriveCityId + ", arriveCityName=" + arriveCityName + ", arriveDistrictId="
				+ arriveDistrictId + ", arriveDistrictName=" + arriveDistrictName + ", arriveStation=" + arriveStation
				+ ", arriveStationId=" + arriveStationId + ", arriveStationCode=" + arriveStationCode + ", arriveLng="
				+ arriveLng + ", arriveLat=" + arriveLat + ", consumeTime=" + consumeTime + ", arriveDesc=" + arriveDesc
				+ ", distance=" + distance + ", vehicleType=" + vehicleType + ", vehicleCard=" + vehicleCard
				+ ", vehicleSeatType=" + vehicleSeatType + ", sellPrice=" + sellPrice + ", seatRemain=" + seatRemain
				+ ", actualPerson=" + actualPerson + ", providerId=" + providerId + ", providerCode=" + providerCode
				+ ", providerName=" + providerName + ", channelOrderParam=" + channelOrderParam
				+ ", channelOrderParamCode=" + channelOrderParamCode + ", operator=" + operator
				+ ", fetchTicketAddress=" + fetchTicketAddress + ", fetchTicketType=" + fetchTicketType
				+ ", createTime=" + createTime + ", updateTime=" + updateTime + ", status=" + status + ", scheduleId="
				+ scheduleId + ", scheduleInfoId=" + scheduleInfoId + ", businessType=" + businessType
				+ ", departStationIdList=" + departStationIdList + ", lineId=" + lineId + ", stationDistance="
				+ stationDistance + ", sameStationBusList=" + sameStationBusList + ", ticketRemainNum="
				+ ticketRemainNum + ", stationSortNo=" + stationSortNo + ", idStr=" + idStr + ", departDistance="
				+ departDistance + ", arriveDistance=" + arriveDistance + ", lineCode=" + lineCode + ", lineName="
				+ lineName + ", departDateStr=" + departDateStr + ", departTimeStr=" + departTimeStr + ", scheduleDate="
				+ scheduleDate + ", scheduleTime=" + scheduleTime + ", lineIdList=" + lineIdList
				+ ", busLineStationList=" + busLineStationList + ", arriveLineStationList=" + arriveLineStationList
				+ ", tagList=" + tagList + ", lineType=" + lineType + ", priceCount=" + priceCount + ", useTime="
				+ useTime + ", driverMobile=" + driverMobile + ", carNo=" + carNo + ", statusDesc=" + statusDesc
				+ ", specialPrice=" + specialPrice + ", buyFlag=" + buyFlag + ", arriveStationIdList="
				+ arriveStationIdList + "]";
	}
	
	
	
	
}