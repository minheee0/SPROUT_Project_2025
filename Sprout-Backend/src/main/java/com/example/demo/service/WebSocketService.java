package com.example.demo.service;

import com.example.demo.handler.SensorWebSocketHandler;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class WebSocketService {

    private final SensorWebSocketHandler handler;

    public WebSocketService(SensorWebSocketHandler handler) {
        this.handler = handler;
    }

    // ✅ 메소드 이름을 명확하게 변경하고, 파라미터 타입을 String으로 변경합니다.
    public void sendSensorData(String jsonData) {
        try {
            // ✅ 새로 만든 메소드를 호출합니다.
            handler.sendMessageToOwner(jsonData);
        } catch (IOException e) {
            System.err.println("실시간 데이터 전송 오류: " + e.getMessage());
        }
    }
}