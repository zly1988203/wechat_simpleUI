package com.olakeji.passenger.wechat.entity;

import java.util.List;

public class BusLineInfo {
    private Integer id;

    private Integer lineId;

    private String picUrl;

    private String lineTittle;

    private String lineIntro;

    private String lineTripIntro;

    private String linePriceIntro;

    private String lineBuyGuide;

    private Byte status;

    private Byte type;

    private Long createTime;

    private Long updateTime;
    
    List<BusLineTag> busLineTagList;

    public List<BusLineTag> getBusLineTagList() {
		return busLineTagList;
	}

	public void setBusLineTagList(List<BusLineTag> busLineTagList) {
		this.busLineTagList = busLineTagList;
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

    public String getPicUrl() {
        return picUrl;
    }

    public void setPicUrl(String picUrl) {
        this.picUrl = picUrl;
    }

    public String getLineTittle() {
        return lineTittle;
    }

    public void setLineTittle(String lineTittle) {
        this.lineTittle = lineTittle;
    }

    public String getLineIntro() {
        return lineIntro;
    }

    public void setLineIntro(String lineIntro) {
        this.lineIntro = lineIntro;
    }

    public String getLineTripIntro() {
        return lineTripIntro;
    }

    public void setLineTripIntro(String lineTripIntro) {
        this.lineTripIntro = lineTripIntro;
    }

    public String getLinePriceIntro() {
        return linePriceIntro;
    }

    public void setLinePriceIntro(String linePriceIntro) {
        this.linePriceIntro = linePriceIntro;
    }

    public String getLineBuyGuide() {
        return lineBuyGuide;
    }

    public void setLineBuyGuide(String lineBuyGuide) {
        this.lineBuyGuide = lineBuyGuide;
    }

    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }

    public Byte getType() {
        return type;
    }

    public void setType(Byte type) {
        this.type = type;
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
}