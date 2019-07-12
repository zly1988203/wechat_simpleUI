package com.olakeji.passenger.wechat.controller.hail.innercity.param;

public class LinePriceParam extends BaseParam {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8143761649612029853L;
	
	private Integer lineId;
	
	private Integer number;
	
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

	public String getDepartDate() {
		return departDate;
	}

	public void setDepartDate(String departDate) {
		this.departDate = departDate;
	}
	
	public boolean checkLineParam() {
		return (this.getLineId()!=null && 
				this.getDepartDate()!=null && 
				this.getNumber()!=null);
	}
}
