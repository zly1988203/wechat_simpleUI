package com.olakeji.passenger.wechat.service.innercity;

public interface CommonInnerCityOrderService {
    public void changeStatus(String tripNo, String orderNo, byte tripStatus, byte orderStatus);
}
