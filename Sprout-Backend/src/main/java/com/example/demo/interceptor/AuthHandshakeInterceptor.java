package com.example.demo.interceptor;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;
import java.util.Optional;

@Component
public class AuthHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AuthHandshakeInterceptor(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        System.out.println("[AuthHandshakeInterceptor] 웹소켓 핸드셰이크 시작...");

        String query = request.getURI().getQuery();
        if (query != null && query.contains("token=")) {
            // "token=" 다음의 실제 토큰 값만 추출
            String token = query.substring(query.indexOf("token=") + 6);
            System.out.println("[AuthHandshakeInterceptor] 쿼리에서 토큰 발견.");

            try {
                String email = jwtUtil.extractEmail(token);
                if (email != null) {
                    Optional<User> userOpt = userRepository.findByEmail(email);
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        // 웹소켓 세션 속성에 'user' 라는 키로 사용자 정보 저장
                        attributes.put("user", user);
                        System.out.println("[AuthHandshakeInterceptor] 사용자 인증 성공: " + user.getEmail());
                        return true; // 핸드셰이크 허용
                    } else {
                        System.out.println("[AuthHandshakeInterceptor] 토큰은 유효하나 사용자를 찾을 수 없음: " + email);
                    }
                }
            } catch (Exception e) {
                System.out.println("[AuthHandshakeInterceptor] 유효하지 않은 토큰: " + e.getMessage());
            }
        } else {
            System.out.println("[AuthHandshakeInterceptor] 쿼리에서 토큰을 찾을 수 없음.");
        }

        System.out.println("[AuthHandshakeInterceptor] 핸드셰이크 거부.");
        return false; // 핸드셰이크 거부
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
        // 핸드셰이크 완료 후 로직 (필요 시 구현)
    }
}