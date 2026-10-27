package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import java.time.Duration;

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        // HTTP 요청을 만들기 위한 팩토리 객체 생성
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();

        // 1. 연결 시간 초과 (Connection Timeout) 설정: 5초
        //    - 외부 서버와 연결을 시도하는 최대 시간입니다.
        factory.setConnectTimeout(5000); // 5000ms = 5초

        // 2. 읽기 시간 초과 (Read Timeout) 설정: 5초
        //    - 연결이 성공한 후, 서버로부터 응답 데이터를 기다리는 최대 시간입니다.
        factory.setReadTimeout(5000); // 5000ms = 5초

        // 타임아웃 설정이 적용된 RestTemplate 객체를 생성하여 반환
        return new RestTemplate(factory);
    }
}