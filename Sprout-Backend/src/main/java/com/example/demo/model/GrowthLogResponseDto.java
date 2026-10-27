package com.example.demo.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class GrowthLogResponseDto {

    private Long id; // 성장일지 ID
    private String memo; // 메모 내용
    private LocalDate logDate; // 저장된 날짜
    private LocalDateTime createdAt; // 작성 시각

    public GrowthLogResponseDto() {}

    public GrowthLogResponseDto(Long id, String memo, LocalDate logDate, LocalDateTime createdAt) {
        this.id = id;
        this.memo = memo;
        this.logDate = logDate;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getMemo() { return memo; }
    public LocalDate getLogDate() { return logDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
