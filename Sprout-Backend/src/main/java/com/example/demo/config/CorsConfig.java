package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                		.allowedOrigins("http://example.com")  // 특정 도메인만 허용
                        .allowedMethods("GET", "POST")  // GET과 POST만 허용
                        .allowedHeaders("Content-Type", "Authorization")  // 필요한 헤더만 허용
                        .allowCredentials(true);  // 인증 정보 허용 (예: 쿠키, HTTP 인증)
         
            }
        };
    }
}
