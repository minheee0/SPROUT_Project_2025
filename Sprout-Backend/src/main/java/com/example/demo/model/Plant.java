package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "plants")
public class Plant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    // Plant.java
    @Column(name = "image_url", columnDefinition = "TEXT", nullable = false) // ✅ columnDefinition 추가
    private String imageUrl;

    @Column(name = "water_cycle_days", nullable = false)
    private int waterCycleDays;

    @Column(name = "water_cycle_code", nullable = false)
    private int waterCycleCode;

    @Column(name = "light_exposure_code", nullable = false)
    private int lightExposureCode;

    // ✅✅ 수정된 부분: cntntsNo 필드 추가
    private String cntntsNo;

    public Plant() {}

    // ✅✅ 수정된 부분: cntntsNo를 포함하는 생성자 추가
    public Plant(User user, String name, String imageUrl, int waterCycleDays, int waterCycleCode, int lightExposureCode) {
        this.user = user;
        this.name = name;
        this.imageUrl = imageUrl;
        this.waterCycleDays = waterCycleDays;
        this.waterCycleCode = waterCycleCode;
        this.lightExposureCode = lightExposureCode;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getName() {
        return name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public int getWaterCycleDays() {
        return waterCycleDays;
    }

    public int getWaterCycleCode() {
        return waterCycleCode;
    }

    public int getLightExposureCode() {
        return lightExposureCode;
    }

    // ✅✅ 수정된 부분: cntntsNo의 Getter 메서드 추가
    public String getCntntsNo() {
        return cntntsNo;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setWaterCycleDays(int waterCycleDays) {
        this.waterCycleDays = waterCycleDays;
    }

    public void setWaterCycleCode(int waterCycleCode) {
        this.waterCycleCode = waterCycleCode;
    }

    public void setLightExposureCode(int lightExposureCode) {
        this.lightExposureCode = lightExposureCode;
    }

    // ✅✅ 수정된 부분: cntntsNo의 Setter 메서드 추가
    public void setCntntsNo(String cntntsNo) {
        this.cntntsNo = cntntsNo;
    }
}