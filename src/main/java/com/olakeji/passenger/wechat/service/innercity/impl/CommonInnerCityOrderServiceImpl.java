package com.olakeji.passenger.wechat.service.innercity.impl;

import com.olakeji.cache.RedisUtil;
import com.olakeji.passenger.wechat.entity.OrderInformation;
import com.olakeji.passenger.wechat.entity.OrderTrip;
import com.olakeji.passenger.wechat.service.innercity.CommonInnerCityOrderService;
import com.olakeji.tsp.cache.CacheKey;
import com.olakeji.tsp.utils.GsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommonInnerCityOrderServiceImpl implements CommonInnerCityOrderService {

    @Autowired
    private RedisUtil redisUtil;
    @Override
    public void changeStatus(String tripNo, String orderNo, byte tripStatus, byte orderStatus) {
        if(redisUtil.exists(CacheKey.TRIP_STATUS_KEY + tripNo)){
            Object orderTripObject = redisUtil.get(CacheKey.TRIP_STATUS_KEY + tripNo);
            if(orderTripObject !=null){
                OrderTrip orderTrip =  GsonUtil.GsonToBean((String)orderTripObject, OrderTrip.class);
                orderTrip.setStatus(tripStatus);
                redisUtil.set(CacheKey.TRIP_STATUS_KEY + tripNo, GsonUtil.GsonString(orderTrip), CacheKey.CACHE_TIME);
            }
        }
        if(redisUtil.exists(CacheKey.ORDER_STATUS_KEY + orderNo)){
            Object orderObject = redisUtil.get(CacheKey.ORDER_STATUS_KEY + orderNo);
            if(orderObject !=null){
                OrderInformation redisStatus =  GsonUtil.GsonToBean((String)orderObject, OrderInformation.class);
                redisStatus.setStatus(orderStatus);
                redisUtil.set(CacheKey.ORDER_STATUS_KEY + orderNo, GsonUtil.GsonString(redisStatus), CacheKey.CACHE_TIME);
            }
        }
    }
}
