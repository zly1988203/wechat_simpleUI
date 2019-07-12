package com.olakeji.passenger.wechat.innercity.param;

import java.math.BigDecimal;

public class StationParam extends BaseParam {
	/**
	 * 
	 */
	private static final long serialVersionUID = -2385898884413475234L;

	private BigDecimal departLat;
	private BigDecimal departLng;
	private BigDecimal arriveLng;
	private BigDecimal arriveLat;
	private Integer departAreaCode;
	private Integer departCityId;
	private Integer arriveAreaCode;
	private Integer arriveCityId;
	private String departTitle;
	private String arriveTitle;
	private Integer number;
	private Integer carType;
	private String departDate;
	private String remark;
	private String ospTraceId;
	private String passengerIds;
	//查询标志 0 查询出发地 1 查询目的地 2 已知出发地 3 已知目的地
	private Integer searchFlag;
	
	public Integer getSearchFlag() {
		return searchFlag;
	}
	public void setSearchFlag(Integer searchFlag) {
		this.searchFlag = searchFlag;
	}
	public BigDecimal getDepartLat() {
		return departLat;
	}
	public void setDepartLat(BigDecimal departLat) {
		this.departLat = departLat;
	}
	public BigDecimal getDepartLng() {
		return departLng;
	}
	public void setDepartLng(BigDecimal departLng) {
		this.departLng = departLng;
	}
	public BigDecimal getArriveLng() {
		return arriveLng;
	}
	public void setArriveLng(BigDecimal arriveLng) {
		this.arriveLng = arriveLng;
	}
	public BigDecimal getArriveLat() {
		return arriveLat;
	}
	public void setArriveLat(BigDecimal arriveLat) {
		this.arriveLat = arriveLat;
	}
	public Integer getDepartAreaCode() {
		return departAreaCode;
	}
	public void setDepartAreaCode(Integer departAreaCode) {
		this.departAreaCode = departAreaCode;
	}
	public Integer getArriveAreaCode() {
		return arriveAreaCode;
	}
	public void setArriveAreaCode(Integer arriveAreaCode) {
		this.arriveAreaCode = arriveAreaCode;
	}
	public Integer getDepartCityId() {
		return departCityId;
	}
	public void setDepartCityId(Integer departCityId) {
		this.departCityId = departCityId;
	}
	public Integer getArriveCityId() {
		return arriveCityId;
	}
	public void setArriveCityId(Integer arriveCityId) {
		this.arriveCityId = arriveCityId;
	}
	public String getDepartTitle() {
		return departTitle;
	}
	public void setDepartTitle(String departTitle) {
		this.departTitle = departTitle;
	}
	public String getArriveTitle() {
		return arriveTitle;
	}
	public void setArriveTitle(String arriveTitle) {
		this.arriveTitle = arriveTitle;
	}
	public Integer getNumber() {
		return number;
	}
	public void setNumber(Integer number) {
		this.number = number;
	}
	public Integer getCarType() {
		return carType;
	}
	public void setCarType(Integer carType) {
		this.carType = carType;
	}
	public String getDepartDate() {
		return departDate;
	}
	public void setDepartDate(String departDate) {
		this.departDate = departDate;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getOspTraceId() {
		return ospTraceId;
	}
	public void setOspTraceId(String ospTraceId) {
		this.ospTraceId = ospTraceId;
	}
	public String getPassengerIds() {
		return passengerIds;
	}
	public void setPassengerIds(String passengerIds) {
		this.passengerIds = passengerIds;
	}
	
	/**
	 * 检查参数是否错误
	 */
	public boolean checkDepartParam() {
		return (this.getDepartAreaCode()!=null && this.getDepartLat()!=null &&
				this.getDepartLat()!=null && this.getDepartTitle()!=null);
	}
	/**
	 * 检查参数是否错误
	 */
	public boolean checkArriveParam() {
		return (this.getArriveAreaCode()!=null && this.getArriveLat()!=null &&
				this.getArriveLat()!=null && this.getArriveTitle()!=null);
	}
	/**
	 * 检查所有参数
	 */
	public boolean checkAllParam() {
		return checkDepartParam()&&checkArriveParam()&&
				(this.getDepartDate()!=null&&this.getCarType()!=null);
	}
	/**
	 * 检查查询标志参数
	 */
	public boolean checkSearchFlag() {
		return this.searchFlag!=null && 
				(this.searchFlag==0|| this.searchFlag==1||
				this.searchFlag==2||this.searchFlag==3);
	}
}
