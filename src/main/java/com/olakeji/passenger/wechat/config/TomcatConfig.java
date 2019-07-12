package com.olakeji.passenger.wechat.config;

import org.apache.catalina.connector.Connector;
import org.apache.catalina.valves.RemoteIpValve;
import org.springframework.boot.context.embedded.EmbeddedServletContainerFactory;
import org.springframework.boot.context.embedded.tomcat.TomcatConnectorCustomizer;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.charset.Charset;

/**
 * @program: TSP_parent
 * @description: ${description}
 * @author: piggy.huang
 * @create: 2019-03-15 20:06
 **/
@Configuration
public class TomcatConfig {
    @Bean
    public EmbeddedServletContainerFactory servletContainer() {
        TomcatEmbeddedServletContainerFactory tomcat = new TomcatEmbeddedServletContainerFactory();
        tomcat.setUriEncoding(Charset.forName("UTF-8"));
        /**
         * nginx 与 tomcat 协议同步问题
         */
        RemoteIpValve valve = new RemoteIpValve();
        valve.setRemoteIpHeader("x-forwarded-for");
        valve.setProxiesHeader("x-forwarded-by");
        valve.setProtocolHeader("x-forwarded-proto");
        tomcat.addContextValves(valve);
        //tomcat.addConnectorCustomizers(new MyTomcatConnectorCustomizer());
        return tomcat;
    }

    class MyTomcatConnectorCustomizer implements TomcatConnectorCustomizer
    {
        @Override
        public void customize(Connector connector)
        {
            connector.setRedirectPort(443);
            connector.setProxyPort(443);
        }
    }
}
