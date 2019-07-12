package com.olakeji.passenger.wechat.entity;

public class PassengerTicketListVo {
	
    private String departStation;
    
    private String arriveStation;
    
    private String startTime;
    
    private long ticketDate;
    
    private String verifyCode;
	
    private Integer id;
    
    private byte status;

    private String carNo;
    
    private long createTime;
    
    private String ticketSerialNo;
    
    
    public String getCarNo()
    {
        return carNo;
    }

    public void setCarNo(String carNo)
    {
        this.carNo = carNo;
    }

    public long getCreateTime()
    {
        return createTime;
    }

    public void setCreateTime(long createTime)
    {
        this.createTime = createTime;
    }

    public String getTicketSerialNo()
    {
        return ticketSerialNo;
    }

    public void setTicketSerialNo(String ticketSerialNo)
    {
        this.ticketSerialNo = ticketSerialNo;
    }

    public String getDepartStation()
    {
        return departStation;
    }

    public void setDepartStation(String departStation)
    {
        this.departStation = departStation;
    }

    public String getArriveStation()
    {
        return arriveStation;
    }

    public void setArriveStation(String arriveStation)
    {
        this.arriveStation = arriveStation;
    }

    public String getStartTime()
    {
        return startTime;
    }

    public void setStartTime(String startTime)
    {
        this.startTime = startTime;
    }

    public long getTicketDate()
    {
        return ticketDate;
    }

    public void setTicketDate(long ticketDate)
    {
        this.ticketDate = ticketDate;
    }

    public String getVerifyCode()
    {
        return verifyCode;
    }

    public void setVerifyCode(String verifyCode)
    {
        this.verifyCode = verifyCode;
    }

    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    public byte getStatus()
    {
        return status;
    }

    public void setStatus(byte status)
    {
        this.status = status;
    }
    
    
    
}
