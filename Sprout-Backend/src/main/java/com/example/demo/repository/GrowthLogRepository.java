package com.example.demo.repository;

import com.example.demo.model.GrowthLog;
import com.example.demo.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface GrowthLogRepository extends JpaRepository<GrowthLog, Long> {
    Optional<GrowthLog> findByUserAndLogDate(User user, LocalDate logDate);

    // ✅ 사용자의 모든 성장 일지를 조회하는 메서드 추가
    List<GrowthLog> findByUser(User user);

    // ✅ 사용자와 날짜를 기준으로 메모를 삭제하는 메서드 (새로 추가)
    @Transactional
    void deleteByUserAndLogDate(User user, LocalDate logDate);
}