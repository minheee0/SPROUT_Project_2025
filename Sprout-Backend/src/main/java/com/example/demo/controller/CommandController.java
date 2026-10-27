package com.example.demo.controller;

import com.example.demo.model.CommandPayload;
import com.example.demo.model.Device;
import com.example.demo.model.User;
import com.example.demo.repository.DeviceRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CommandService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class CommandController {

    private final CommandService commandService;
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;

    public CommandController(CommandService commandService, DeviceRepository deviceRepository, UserRepository userRepository) {
        this.commandService = commandService;
        this.deviceRepository = deviceRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/command/{deviceId}")
    public ResponseEntity<?> postCommand(@PathVariable String deviceId, @RequestBody CommandPayload payload, Authentication authentication) {
        // 1. 현재 로그인한 사용자 정보 가져오기 (JWT 필터에서 이미 검증됨)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Object principal = auth.getPrincipal();

        if (!(principal instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 정보가 올바르지 않습니다.");
        }
        Long currentUserId = currentUser.getId();

        // 2. 요청된 deviceId로 디바이스 정보 조회
        Optional<Device> deviceOpt = deviceRepository.findByDeviceId(deviceId);

        // 3. 디바이스 존재 여부 및 소유권 확인
        if (deviceOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Device not found");
        }

        if (!deviceOpt.get().getUser().getId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not own this device");
        }

        // 4. 페이로드에서 실제 명령어 추출 및 실행
        String command = payload.getCommand();
        if (command == null || command.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("'command' 필드가 비어있거나 누락되었습니다.");
        }

        commandService.setCommand(deviceId, command);
        return ResponseEntity.ok("명령이 성공적으로 전송되었습니다.");
    }

    @GetMapping("/command/{deviceId}")
    public ResponseEntity<String> getCommand(@PathVariable String deviceId) {
        String command = commandService.getCommand(deviceId);
        if (command != null) {
            return ResponseEntity.ok(command);
        } else {
            return ResponseEntity.noContent().build();
        }
    }
}