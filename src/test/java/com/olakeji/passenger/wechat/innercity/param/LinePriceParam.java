package com.olakeji.passenger.wechat.innercity.param;

public class LinePriceParam extends BaseParam {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8143761649612029853L;
	
	private Integer lineId;
	
	private Integer number;
	
	private Integer carType;
	
	private String departDate;
	
	public Integer getLineId() {
		return lineId;
	}

	public void setLineId(Integer lineId) {
		this.lineId = lineId;
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
}
