package com.olakeji.passenger.wechat.entity.annual;



import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

public class AnnualStatisticsVo implements Serializable {
    /**
     * 统计id
     */
    private Integer id;
    /**
     * 车企id
     */
    private Integer providerId;
    /**
     * 用户id
     */
    private Integer userId;
    /**
     * 乘坐了 xxx 车企 的次数
     */
    private Integer providerCount;
    /**
     * 里程数,单位公里
     */
    private BigDecimal milage;
    /**
     * 常坐线路
     */
    private String commonLine;
    /**
     * 常坐线路的次数
     */
    private Integer commonLineCount;

    /**
     * 常坐线路度过 的时间, 单位: 小时
     */
    private BigDecimal commonLineHour;
    /**
     * 最早上车时间
     */
    private Date commonLineStart;
    /**
     * 最晚的下车时间
     */
    private Date commonLineEnd;
    /**
     * 使用优惠券的次数
     */
    private Integer couponCount;
    /**
     * 优惠券总金额
     */
    private BigDecimal couponAmount;
    /**
     * 班次总数
     */
    private Integer orderCount;
    /**
     * 班次出售票数
     */
    private Integer orderTotal;
    /**
     * 同行的人和车次
     */
    private String together;
    /**
     * 省下来车费相当于
     * 一杯咖啡”（N<=50时）
     * “一顿麻辣烫”（50<N<=200）
     * “一顿法式大餐”（200<N<=500）
     * ”一次旅行”（500<N）
     */
    /**
     * 车费相当于文案
     */
    private String saveEqualStr;
    /**
     * 车企二维码
     */
    private String providerQRCode;
    /**
     * 车企名称
     */
    private String providerName;

    /**
     * 车企链接
     */
    private String provideLlink;

    public String getProvideLlink() {
        return provideLlink;
    }

    public void setProvideLlink(String provideLlink) {
        this.provideLlink = provideLlink;
    }
    public String getProviderName() {
        return providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public String getProviderQRCode() {
        return providerQRCode;
    }

    public void setProviderQRCode(String providerQRCode) {
        this.providerQRCode = providerQRCode;
    }

    public String getSaveEqualStr() {
        return saveEqualStr;
    }

    public void setSaveEqualStr(String saveEqualStr) {
        this.saveEqualStr = saveEqualStr;
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

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getProviderCount() {
        return providerCount;
    }

    public void setProviderCount(Integer providerCount) {
        this.providerCount = providerCount;
    }

    public BigDecimal getMilage() {
        return milage;
    }

    public void setMilage(BigDecimal milage) {
        this.milage = milage;
    }

    public String getCommonLine() {
        return commonLine;
    }

    public void setCommonLine(String commonLine) {
        this.commonLine = commonLine;
    }

    public Integer getCommonLineCount() {
        return commonLineCount;
    }

    public void setCommonLineCount(Integer commonLineCount) {
        this.commonLineCount = commonLineCount;
    }

    public BigDecimal getCommonLineHour() {
        return commonLineHour;
    }

    public void setCommonLineHour(BigDecimal commonLineHour) {
        this.commonLineHour = commonLineHour;
    }

    public Date getCommonLineStart() {
        return commonLineStart;
    }

    public void setCommonLineStart(Date commonLineStart) {
        this.commonLineStart = commonLineStart;
    }

    public Date getCommonLineEnd() {
        return commonLineEnd;
    }

    public void setCommonLineEnd(Date commonLineEnd) {
        this.commonLineEnd = commonLineEnd;
    }

    public Integer getCouponCount() {
        return couponCount;
    }

    public void setCouponCount(Integer couponCount) {
        this.couponCount = couponCount;
    }

    public BigDecimal getCouponAmount() {
        return couponAmount;
    }

    public void setCouponAmount(BigDecimal couponAmount) {
        this.couponAmount = couponAmount;
    }

    public Integer getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(Integer orderCount) {
        this.orderCount = orderCount;
    }

    public Integer getOrderTotal() {
        return orderTotal;
    }

    public void setOrderTotal(Integer orderTotal) {
        this.orderTotal = orderTotal;
    }

    public String getTogether() {
        return together;
    }

    public void setTogether(String together) {
        this.together = together;
    }

}
