package com.olakeji.passenger.wechat.service.provider;

import com.olakeji.tsp.vo.BaseProvider;

public interface BaseProviderService {
    BaseProvider getCache(Integer providerId);

    /**
     * 通过domainCode获取车企信息
     * @param domainCode
     * @return
     */
    BaseProvider getCacheByDomain(String domainCode);

    /**
     * 获取车企的一级域名
     * @param providerId
     * @return
     */
    String getWechatSuffixUrl(Integer providerId);
    String getWechatDomain(Integer providerId);
    String getWechatUrl(Integer providerId);
    String getOspDomain(Integer providerId);
    String getOspUrl(Integer providerId);
}
