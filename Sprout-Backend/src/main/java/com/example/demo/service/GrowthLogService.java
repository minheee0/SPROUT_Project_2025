package com.example.demo.service;

import com.example.demo.model.GrowthLogRequestDto;
import com.example.demo.model.GrowthLog;
import com.example.demo.model.User;
import com.example.demo.repository.GrowthLogRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class GrowthLogService {

    private final GrowthLogRepository growthLogRepository;

    public GrowthLogService(GrowthLogRepository growthLogRepository) {
        this.growthLogRepository = growthLogRepository;
    }

    // ✅ 메모를 저장하거나 업데이트하는 메서드 (삭제 로직 제거)
    public void saveLog(GrowthLogRequestDto dto, User user) {
        Optional<GrowthLog> optionalLog = growthLogRepository.findByUserAndLogDate(user, dto.getLogDate());

        if (optionalLog.isPresent()) {
            GrowthLog existingLog = optionalLog.get();
            // 메모 내용을 업데이트하고 저장
            existingLog.setMemo(dto.getMemo());
            growthLogRepository.save(existingLog);
        } else {
            // 메모 내용이 있을 경우에만 새로운 로그를 생성
            if (dto.getMemo() != null && !dto.getMemo().trim().isEmpty()) {
                GrowthLog newLog = new GrowthLog(user, dto.getMemo(), dto.getLogDate());
                growthLogRepository.save(newLog);
            }
        }
    }

    // 특정 날짜의 메모를 조회하는 메서드
    public Optional<GrowthLog> getLogByUserAndDate(User user, LocalDate logDate) {
        return growthLogRepository.findByUserAndLogDate(user, logDate);
    }

    // ✅ 특정 날짜의 메모를 삭제하는 메서드
    @Transactional
    public void deleteLogByUserAndDate(User user, LocalDate date) {
        Optional<GrowthLog> optionalLog = growthLogRepository.findByUserAndLogDate(user, date);
        optionalLog.ifPresent(growthLogRepository::delete);
    }

    // 사용자의 모든 일지 목록을 가져오는 메서드
    public List<GrowthLog> getAllGrowthLogsByUser(User user) {
        return growthLogRepository.findByUser(user);
    }
}