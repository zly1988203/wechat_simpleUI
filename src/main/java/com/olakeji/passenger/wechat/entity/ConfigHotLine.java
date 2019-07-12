package com.olakeji.passenger.wechat.entity;

import java.util.Date;

import com.olakeji.tsp.common.QueryCondition;
import com.olakeji.tsp.common.SearchType;

public class ConfigHotLine {
    private Integer id;

    private String locCounty;
    @QueryCondition(searchType=SearchType.LIKE)
    private String locKey;

    private String startCounty;
    @QueryCondition(searchType=SearchType.LIKE)
    private String startKey;

    private String startCaption;

    private String arriveCounty;
    @QueryCondition(searchType=SearchType.LIKE)
    private String arriveKey;

    private String arriveCaption;

    private String desc;

    private Integer rank;

    private Byte hot;

    private Integer global;

    private Long createTime;

    private Long updateTime;

    private Byte status;

    private String operator;

    private Date firstDepartTime;

    private Date lastDepartTime;
    @QueryCondition
    private Integer providerId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLocCounty() {
        return locCounty;
    }

    public void setLocCounty(String locCounty) {
        this.locCounty = locCounty == null ? null : locCounty.trim();
    }

    public String getLocKey() {
        return locKey;
    }

    public void setLocKey(String locKey) {
        this.locKey = locKey == null ? null : locKey.trim();
    }

    public String getStartCounty() {
        return startCounty;
    }

    public void setStartCounty(String startCounty) {
        this.startCounty = startCounty == null ? null : startCounty.trim();
    }

    public String getStartKey() {
        return startKey;
    }

    public void setStartKey(String startKey) {
        this.startKey = startKey == null ? null : startKey.trim();
    }

    public String getStartCaption() {
        return startCaption;
    }

    public void setStartCaption(String startCaption) {
        this.startCaption = startCaption == null ? null : startCaption.trim();
    }

    public String getArriveCounty() {
        return arriveCounty;
    }

    public void setArriveCounty(String arriveCounty) {
        this.arriveCounty = arriveCounty == null ? null : arriveCounty.trim();
    }

    public String getArriveKey() {
        return arriveKey;
    }

    public void setArriveKey(String arriveKey) {
        this.arriveKey = arriveKey == null ? null : arriveKey.trim();
    }

    public String getArriveCaption() {
        return arriveCaption;
    }

    public void setArriveCaption(String arriveCaption) {
        this.arriveCaption = arriveCaption == null ? null : arriveCaption.trim();
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc == null ? null : desc.trim();
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public Byte getHot() {
        return hot;
    }

    public void setHot(Byte hot) {
        this.hot = hot;
    }

    public Integer getGlobal() {
        return global;
    }

    public void setGlobal(Integer global) {
        this.global = global;
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

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator == null ? null : operator.trim();
    }

    public Date getFirstDepartTime() {
        return firstDepartTime;
    }

    public void setFirstDepartTime(Date firstDepartTime) {
        this.firstDepartTime = firstDepartTime;
    }

    public Date getLastDepartTime() {
        return lastDepartTime;
    }

    public void setLastDepartTime(Date lastDepartTime) {
        this.lastDepartTime = lastDepartTime;
    }

    public Integer getProviderId() {
        return providerId;
    }

    public void setProviderId(Integer providerId) {
        this.providerId = providerId;
    }
}