package com.olakeji.passenger.wechat.service.provider.impl;

import com.alibaba.fastjson.JSON;
import com.olakeji.cache.RedisUtil;
import com.olakeji.passenger.wechat.AppUrlConfig;
import com.olakeji.passenger.wechat.service.provider.BaseProviderService;
import com.olakeji.passenger.wechat.utils.HttpUtil;
import com.olakeji.tsp.cache.CacheKey;
import com.olakeji.tsp.cache.CacheKeyEnums;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.ResultEntity;
import com.olakeji.tsp.utils.GsonUtil;
import com.olakeji.tsp.vo.BaseProvider;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class BaseProviderServiceImpl implements BaseProviderService {
    @Autowired
    private RedisUtil redisUtil;
    @Value("${passenger.api.url}")
    private String apiUrl;
    @Override
    public BaseProvider getCache(Integer providerId) {
        String key = CacheKeyEnums.BASE_PROVIDER.getBasicCacheKey(""+providerId);
        String str =  (String) redisUtil.get(key);
        if (StringUtils.isEmpty(str)) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("providerId", providerId);
            String jsonString = HttpUtil.doPostRequest(apiUrl + AppUrlConfig.PROVIDERWEHCHATURL, map);
            if(!StringUtils.isEmpty(jsonString)){
                ResultEntity result = GsonUtil.GsonToBean(jsonString, ResultEntity.class);
                if(result.getCode().equals(Constant.SUCCESS) && StringUtils.isNotEmpty( (String) result.getData())){
                    str = (String) result.getData();
                }
            }else{
                return null;
            }
        }
        return JSON.toJavaObject(JSON.parseObject(str), BaseProvider.class);
    }

    @Override
    public BaseProvider getCacheByDomain(String domainCode) {
        if (redisUtil.exists(CacheKey.PROVIDER_DOMAIN + domainCode)) {
            String providerId = redisUtil.getString(CacheKey.PROVIDER_DOMAIN + domainCode);
           return getCache(Integer.parseInt(providerId));
        }
        return null;
    }

    @Override
    public String getWechatSuffixUrl(Integer providerId){
        if(providerId==null ||providerId==0){
            return "";
        }
        BaseProvider baseProvider = getCache(providerId);
        return baseProvider!=null?baseProvider.getSuffixDomain():"";
    }
    @Override
    public String getWechatDomain(Integer providerId){
        if(providerId==null ||providerId==0){
            return "";
        }
        BaseProvider baseProvider = getCache(providerId);
        return baseProvider!=null?baseProvider.getDomainCode():"";
    }

    @Override
    public String getWechatUrl(Integer providerId) {
        if(providerId==null ||providerId==0){
            return "";
        }
        BaseProvider baseProvider = getCache(providerId);
        return baseProvider!=null?baseProvider.getProtocol()+"://"+baseProvider.getDomainCode()+baseProvider.getSuffixDomain():"";
    }

    @Override
    public String getOspUrl(Integer providerId) {
        if(providerId==null ||providerId==0){
            return "";
        }
        BaseProvider baseProvider = getCache(providerId);
        return baseProvider!=null?baseProvider.getProtocol()+"://"+baseProvider.getOspDomain():"";
    }

    @Override
    public String getOspDomain(Integer providerId) {
        if(providerId==null ||providerId==0){
            return "";
        }
        BaseProvider baseProvider = getCache(providerId);
        return baseProvider!=null?baseProvider.getOspDomain():"";
    }
}
