package com.olakeji.passenger.wechat.entity;

import com.olakeji.tsp.common.QueryCondition;
import com.olakeji.tsp.common.SearchType;

public class BusLineTag {
    private Integer id;
    @QueryCondition(searchType=SearchType.LIKE)
    private String tagName;

    private Integer ifShow;
    @QueryCondition(searchType=SearchType.EQ)
    private Integer status;
    @QueryCondition(searchType=SearchType.EQ)
    private Integer providerId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName == null ? null : tagName.trim();
    }

    public Integer getIfShow() {
        return ifShow;
    }

    public void setIfShow(Integer ifShow) {
        this.ifShow = ifShow;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getProviderId() {
        return providerId;
    }

    public void setProviderId(Integer providerId) {
        this.providerId = providerId;
    }
}