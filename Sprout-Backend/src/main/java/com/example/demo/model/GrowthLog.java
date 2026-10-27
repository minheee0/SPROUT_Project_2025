package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore; // ✅ import 추가
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "growth_logs")
public class GrowthLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // ✅ JSON으로 변환할 때 이 필드를 무시하도록 설정
    private User user;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String memo;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public GrowthLog() {}

    public GrowthLog(User user, String memo, LocalDate logDate) {
        this.user = user;
        this.memo = memo;
        this.logDate = logDate;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public String getMemo() {
        return memo;
    }
    public void setMemo(String memo) {
        this.memo = memo;
    }

    public LocalDate getLogDate() {
        return logDate;
    }
    public void setLogDate(LocalDate logDate) {
        this.logDate = logDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}