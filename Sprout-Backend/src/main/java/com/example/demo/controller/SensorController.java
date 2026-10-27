package com.example.demo.controller;

import com.example.demo.model.SensorData;
import com.example.demo.service.SensorDataService;
import com.example.demo.service.WebSocketService;
import com.fasterxml.jackson.databind.ObjectMapper; // ✅ 추가
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sensor")
public class SensorController {

    private final SensorDataService sensorDataService;
    private final WebSocketService webSocketService;
    private final ObjectMapper objectMapper; // ✅ 추가

    // ✅ 생성자 수정
    public SensorController(SensorDataService sensorDataService, WebSocketService webSocketService, ObjectMapper objectMapper) {
        this.sensorDataService = sensorDataService;
        this.webSocketService = webSocketService;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public ResponseEntity<SensorData> receiveSensorData(@RequestBody SensorData sensorData) {
        SensorData savedData = sensorDataService.saveSensorData(sensorData);
        try {
            // ✅ 객체를 JSON 문자열로 변환
            String jsonData = objectMapper.writeValueAsString(savedData);
            // ✅ 변환된 문자열을 전송
            webSocketService.sendSensorData(jsonData);
        } catch (Exception e) {
            System.err.println("센서 데이터 직렬화 또는 전송 오류: " + e.getMessage());
        }
        return ResponseEntity.ok(savedData);
    }
}