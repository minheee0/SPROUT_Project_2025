package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import com.example.demo.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, UserRepository userRepository,
                          BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
    
    @GetMapping("/session")
    public ResponseEntity<?> getSessionInfo() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof User user) {
            return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "email", user.getEmail()
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(Map.of("message", "세션이 유효하지 않습니다."));
        }
    }



    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            User user = userOpt.get(); // Optional에서 User 객체를 가져옵니다.
            String jwt = jwtUtil.generateToken(user.getEmail());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful!");
            response.put("username", user.getUsername());
            response.put("token", jwt);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }
    }

    @PostMapping("/delete-account")
    public ResponseEntity<Map<String, String>> deleteAccount(@RequestBody Map<String, String> request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String inputPassword = request.get("password");

        if (user.getPassword() == null || !passwordEncoder.matches(inputPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "비밀번호가 일치하지 않습니다."));
        }

        try {
            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("message", "계정이 성공적으로 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "계정 삭제 중 오류 발생: " + e.getMessage()));
        }
    }

    @PutMapping("/update-user")
    public ResponseEntity<Map<String, String>> updateUser(@RequestBody Map<String, String> request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String newUsername = request.get("username");
        String newEmail = request.get("email");
        String newPassword = request.get("password");
        boolean updated = false;

        if (newUsername != null && !newUsername.trim().isEmpty() && !newUsername.equals(user.getUsername())) {
            if (userRepository.existsByUsername(newUsername)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "이미 사용 중인 사용자 이름입니다."));
            }
            user.setUsername(newUsername);
            updated = true;
        }

        if (newEmail != null && !newEmail.trim().isEmpty() && !newEmail.equals(user.getEmail())) {
            if (userRepository.existsByEmail(newEmail)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "이미 사용 중인 이메일입니다."));
            }
            user.setEmail(newEmail);
            updated = true;
        }

        if (newPassword != null && !newPassword.trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(newPassword));
            updated = true;
        }

        if (!updated) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "변경할 정보가 없습니다."));
        }

        try {
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "회원 정보가 성공적으로 수정되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "회원 정보 수정 중 오류 발생: " + e.getMessage()));
        }
    }

    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsername(@RequestParam String username) {
        boolean exists = userRepository.existsByUsername(username);
        return ResponseEntity.ok(Map.of("available", !exists));
    }

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = userRepository.existsByEmail(email);
        return ResponseEntity.ok(Map.of("available", !exists));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "비밀번호가 입력되지 않았습니다."));
        }

        // 이메일 중복 체크
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "이메일이 이미 존재합니다."));
        }

        // 사용자 이름 중복 체크
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "사용자 이름이 이미 존재합니다."));
        }

        String result = userService.register(user);

        // 회원가입 실패 시 처리
        if (!result.equals("User registered successfully!")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result));
        }

        // DB에 저장된 사용자 정보 가져오기
        Optional<User> savedUserOpt = userRepository.findByEmail(user.getEmail());
        if (savedUserOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("message", "회원가입 후 데이터베이스 저장 오류"));
        }
        User savedUser = savedUserOpt.get(); // Optional에서 User 객체를 가져옵니다.

        // 토큰 발급
        String token = jwtUtil.generateToken(savedUser.getEmail());

        return ResponseEntity.ok(Map.of(
            "message", "회원가입 성공",
            "username", savedUser.getUsername(),
            "email", savedUser.getEmail(),
            "token", token
        ));
    }

    @Transactional(readOnly = true)
    @GetMapping("/find-email/{username}")
    public ResponseEntity<String> findEmail(@PathVariable String username) {
        Optional<User> userOpt = userRepository.findByUsername(username.trim());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
        }
        User user = userOpt.get();
        return ResponseEntity.ok(user.getEmail());
    }

    @Transactional
    @PostMapping("/find-password")
    public ResponseEntity<String> findPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            // 비밀번호 재설정 로직 또는 임시 비밀번호 발급
            return ResponseEntity.ok("새 비밀번호가 이메일로 전송되었습니다.");
        } else {
            return ResponseEntity.status(404).body("이메일에 해당하는 사용자가 없습니다.");
        }
    }
}
