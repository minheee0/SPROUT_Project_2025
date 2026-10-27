package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
    boolean existsByUsername(String username);  // 사용자 이름 존재 여부 체크
    boolean existsByEmail(String email);        // 이메일 존재 여부 체크
    Optional<User> findByUsername(String username);       // 사용자 이름으로 사용자 조회
    Optional<User> findByEmail(String email);

    // ✅ Native Query 추가 (JPA의 findByUsername이 동작하지 않을 경우 해결)
    @Query(value = "SELECT * FROM users WHERE username = :username LIMIT 1", nativeQuery = true)
    User findUserByUsernameNative(@Param("username") String username);

    @Query(value = "SELECT * FROM users WHERE email = :email LIMIT 1", nativeQuery = true)
    User findUserByEmailNative(@Param("email") String email);

    // ✅ 비밀번호 변경 기능 (옵션)
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.password = :newPassword WHERE u.email = :email")
    int updatePassword(@Param("email") String email, @Param("newPassword") String newPassword);
}
