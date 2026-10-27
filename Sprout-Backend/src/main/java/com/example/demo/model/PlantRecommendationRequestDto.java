package com.example.demo.model;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlantRecommendationRequestDto {
    private String lightChkVal;
    // ✅ grwhstleChkVal 필드 추가
    private String grwhstleChkVal;
    private String waterCycleSel;
}