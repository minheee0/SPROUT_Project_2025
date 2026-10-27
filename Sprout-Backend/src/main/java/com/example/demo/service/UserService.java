package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // 로그인 메서드 (이메일을 사용)
    public boolean login(String email, String password) {
        // 이메일로 사용자 조회
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            System.out.println("⚠️ 로그인 실패: 사용자가 존재하지 않습니다.");
            return false;
        }

        User user = userOpt.get();
        // 비밀번호 비교
        if (user.getPassword() != null && passwordEncoder.matches(password, user.getPassword())) {
            return true;
        } else {
            System.out.println("⚠️ 로그인 실패: 비밀번호 불일치");
            return false;
        }
    }

    // 회원가입 메서드
    public String register(User user) {
        // 필수 정보 체크
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            return "Email cannot be empty!";
        }

        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            return "Username cannot be empty!";
        }

        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return "Password cannot be empty!";
        }

        // 이메일 중복 체크 (existsByEmail 사용)
        if (userRepository.existsByEmail(user.getEmail())) {
            return "Email already exists!";
        }

        // 사용자 이름 중복 체크 (existsByUsername 사용)
        if (userRepository.existsByUsername(user.getUsername())) {
            return "Username already exists!";
        }

        // 비밀번호 해시화 후 저장
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 사용자 저장
        userRepository.save(user);
        return "User registered successfully!";
    }

    // 비밀번호 변경 메서드
    public String changePassword(String email, String oldPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return "User not found!";
        }
        
        User user = userOpt.get();
        // 기존 비밀번호 확인
        if (user.getPassword() != null && passwordEncoder.matches(oldPassword, user.getPassword())) {
            // 새 비밀번호가 유효한지 확인
            if (newPassword == null || newPassword.isEmpty()) {
                return "New password cannot be empty!";
            }
            
            // 비밀번호 변경
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return "Password changed successfully!";
        } else {
            return "Old password does not match!";
        }
    }
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> userOpt = userRepository.findByEmail(email);
        User user = userOpt.orElseThrow(() -> 
            new UsernameNotFoundException("User not found with email: " + email));
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), new ArrayList<>());
    }

    // 이 메소드는 현재 사용되지 않으므로, userDetails를 업데이트하는 로직을 완성하거나 주석 처리합니다.
    // 여기서는 간단히 userDetails의 정보를 user에 반영하도록 수정합니다.
    public User updateUser(String email, User userDetails) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        // 업데이트할 정보 반영
        user.setUsername(userDetails.getUsername());
        // 비밀번호는 별도의 로직으로 변경하는 것이 안전하므로 여기서는 제외합니다.
        // user.setPassword(userDetails.getPassword());
        
        return userRepository.save(user);
    }
}
