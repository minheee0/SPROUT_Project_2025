package com.example.demo.config;

import com.example.demo.handler.SensorWebSocketHandler;
import com.example.demo.interceptor.AuthHandshakeInterceptor;
import com.example.demo.repository.DeviceRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final ObjectMapper objectMapper;
    private final AuthHandshakeInterceptor authHandshakeInterceptor;
    private final DeviceRepository deviceRepository;

    public WebSocketConfig(ObjectMapper objectMapper, AuthHandshakeInterceptor authHandshakeInterceptor, DeviceRepository deviceRepository) {
        this.objectMapper = objectMapper;
        this.authHandshakeInterceptor = authHandshakeInterceptor;
        this.deviceRepository = deviceRepository;
    }

    @Bean
    public SensorWebSocketHandler sensorWebSocketHandler() {
        return new SensorWebSocketHandler(objectMapper, deviceRepository);
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(sensorWebSocketHandler(), "/ws")
                .addInterceptors(authHandshakeInterceptor)
                .setAllowedOrigins("*");
    }
}