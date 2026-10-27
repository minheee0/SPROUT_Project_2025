package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ControllerAdvice // 전역 예외 처리
public class GlobalExceptionHandler {

    // Logger 객체 정의
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(AccessDeniedException.class) // 403 오류 처리
    public ResponseEntity<String> handleAccessDenied(AccessDeniedException ex) {
        // 403 오류 발생 시 로그 출력
        log.error("Access Denied: " + ex.getMessage());  // 오류 메시지 로깅
        return new ResponseEntity<>("Access Denied", HttpStatus.FORBIDDEN);
    }
}
