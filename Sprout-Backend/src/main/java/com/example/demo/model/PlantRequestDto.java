package com.example.demo.model;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlantRequestDto {

    private Long id;

    private String name;

    // ⭐️⭐️ 수정: JSON 필드 이름을 명시적으로 매핑하여 400 오류 해결 ⭐️⭐️

    // ⭐️⭐️ 수정 필요: 클라이언트가 보낸 "imageUrl" 필드를 인식하도록 명시 ⭐️⭐️
    @JsonProperty("imageUrl") // 💡 imageUrl 필드도 카멜케이스로 명시적으로 매핑
    private String imageUrl;

    @JsonProperty("waterCycleDays") // 💡 수정: "waterCycleDays" 필드를 인식하도록 명시
    private int waterCycleDays;

    @JsonProperty("waterCycleCode") // 💡 수정: 이 필드도 카멜케이스로 명시
    private int waterCycleCode;

    @JsonProperty("lightExposureCode") // 💡 수정: 이 필드도 카멜케이스로 명시
    private int lightExposureCode;

    // ⭐️⭐️ Base64 이미지 전송 필드 (추가된 부분) ⭐️⭐️

    private String base64Image;

    private String fileName;

    private String fileType;
}