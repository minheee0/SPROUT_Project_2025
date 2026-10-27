package com.example.demo.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        // JavaTimeModule를 등록하여 LocalDateTime 등 Java 8 날짜/시간 타입을 지원합니다.
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper;
    }
}
