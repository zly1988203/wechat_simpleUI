package com.olakeji.passenger.wechat.entity;

import java.math.BigDecimal;
import java.util.List;

import com.olakeji.tsp.common.QueryCondition;
import com.olakeji.tsp.common.SearchType;

public class BusLineStation {
	@QueryCondition(searchType=SearchType.EQ)
    private Integer id;
	@QueryCondition(searchType=SearchType.EQ)
    private Integer lineId;
	@QueryCondition(searchType=SearchType.EQ)
    private Integer stationId;
	@QueryCondition(searchType=SearchType.EQ)
    private Integer type;

    private Integer useTime;

    private Integer orderNo;
    
    private String stationName;
    
    private String city;
    
    private  List<Integer>lineIdList;
    
    
    private BigDecimal latitude;

    private BigDecimal longitude;
    
    private String departTime;
    
    /**
     * 这条线路的第一个站点的id
     */
    private Integer firstStationId;
    
    /**
     * 这条线路最后一个站点的id
     */
    private Integer lastStationId;
    
    
    private Integer leaveFlag;//离开标识
    
    public Integer getLeaveFlag() {
		return leaveFlag;
	}

	public void setLeaveFlag(Integer leaveFlag) {
		this.leaveFlag = leaveFlag;
	}

	public Integer getFirstStationId() {
		return firstStationId;
	}

	public void setFirstStationId(Integer firstStationId) {
		this.firstStationId = firstStationId;
	}

	public Integer getLastStationId() {
		return lastStationId;
	}

	public void setLastStationId(Integer lastStationId) {
		this.lastStationId = lastStationId;
	}

	public String getDepartTime() {
		return departTime;
	}

	public void setDepartTime(String departTime) {
		this.departTime = departTime;
	}

	public BigDecimal getLatitude() {
		return latitude;
	}

	public void setLatitude(BigDecimal latitude) {
		this.latitude = latitude;
	}

	public BigDecimal getLongitude() {
		return longitude;
	}

	public void setLongitude(BigDecimal longitude) {
		this.longitude = longitude;
	}

	public List<Integer> getLineIdList() {
		return lineIdList;
	}

	public void setLineIdList(List<Integer> lineIdList) {
		this.lineIdList = lineIdList;
	}

	public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getLineId() {
        return lineId;
    }

    public void setLineId(Integer lineId) {
        this.lineId = lineId;
    }

    public Integer getStationId() {
        return stationId;
    }

    public void setStationId(Integer stationId) {
        this.stationId = stationId;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getUseTime() {
        return useTime;
    }

    public void setUseTime(Integer useTime) {
        this.useTime = useTime;
    }

    public Integer getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(Integer orderNo) {
        this.orderNo = orderNo;
    }

	public String getStationName() {
		return stationName;
	}

	public void setStationName(String stationName) {
		this.stationName = stationName;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}
	
	
    
}