package com.example.demo.handler;

import com.example.demo.model.Device;
import com.example.demo.model.User;
import com.example.demo.repository.DeviceRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class SensorWebSocketHandler extends TextWebSocketHandler {

    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final ObjectMapper objectMapper;
    private final DeviceRepository deviceRepository;

    public SensorWebSocketHandler(ObjectMapper objectMapper, DeviceRepository deviceRepository) {
        this.objectMapper = objectMapper;
        this.deviceRepository = deviceRepository;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        User user = (User) session.getAttributes().get("user");
        System.out.println("[WebSocketHandler] 연결 성공, 세션: " + session.getId() + ", 사용자: " + (user != null ? user.getEmail() : "Unknown"));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        // 클라이언트로부터 메시지를 받는 경우는 없으므로 비워둡니다.
    }

    public void sendMessageToOwner(String payload) throws IOException {
        System.out.println("[WebSocketHandler] 소유자에게 메시지 전송 시도: " + payload);
        try {
            JsonNode jsonNode = objectMapper.readTree(payload);
            String deviceId = jsonNode.get("deviceId").asText();

            Optional<Device> deviceOpt = deviceRepository.findByDeviceId(deviceId);
            if (deviceOpt.isEmpty()) {
                System.out.println("[WebSocketHandler] 등록되지 않은 디바이스 ID: " + deviceId);
                return;
            }

            User owner = deviceOpt.get().getUser();
            if (owner == null) {
                System.out.println("[WebSocketHandler] 디바이스에 소유자가 할당되지 않음: " + deviceId);
                return;
            }
            Long ownerId = owner.getId();
            System.out.println("[WebSocketHandler] 디바이스 '" + deviceId + "'의 소유자 ID: " + ownerId);

            for (WebSocketSession webSocketSession : sessions) {
                if (webSocketSession.isOpen()) {
                    User sessionUser = (User) webSocketSession.getAttributes().get("user");
                    if (sessionUser != null && sessionUser.getId().equals(ownerId)) {
                        System.out.println("[WebSocketHandler] 소유자에게 메시지 전송 -> 세션: " + webSocketSession.getId() + ", 사용자: " + sessionUser.getEmail());
                        webSocketSession.sendMessage(new TextMessage(payload));
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("[WebSocketHandler] 메시지 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("[WebSocketHandler] 연결 종료, 세션: " + session.getId());
    }
}