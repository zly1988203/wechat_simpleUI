package com.olakeji.passenger.wechat.entity;

import java.io.Serializable;

public class StationVo implements Serializable {
    private transient Integer id;
    private Integer stationId;
    private Integer orderNo;
    /**
     * 1 上车点  2 下车点
     */
    private Integer type;
    public StationVo(){};
    public StationVo(Integer id, Integer stationId, Integer orderNo, Integer type) {
        this.id = id;
        this.stationId = stationId;
        this.orderNo = orderNo;
        this.type = type;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getStationId() {
        return stationId;
    }

    public void setStationId(Integer stationId) {
        this.stationId = stationId;
    }

    public Integer getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(Integer orderNo) {
        this.orderNo = orderNo;
    }
}
