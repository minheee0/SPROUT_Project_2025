package com.example.demo.controller;

import com.example.demo.model.Plant;
import com.example.demo.model.PlantRequestDto;
import com.example.demo.model.PlantRecommendationRequestDto;
import com.example.demo.model.RecommendedPlant;
import com.example.demo.model.User;
import com.example.demo.service.PlantService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/plants")
public class PlantController {

    private final PlantService plantService;

    public PlantController(PlantService plantService) {
        this.plantService = plantService;
    }

    // ✅ 이미지 업로드 기능을 포함한 식물 등록/수정 API (Base64 JSON 대응)
    @PostMapping // ⭐️⭐️ 수정: consumes = { MediaType.MULTIPART_FORM_DATA_VALUE } 제거 ⭐️⭐️
    public Plant registerOrUpdatePlant(
            // ⭐️⭐️ 수정: JSON Body를 받도록 @RequestBody로 변경 ⭐️⭐️
            @RequestBody PlantRequestDto dto,
            // ❌ MultipartFile 파라미터와 String dtoJson 파라미터 제거
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        // ⭐️⭐️ 수정: savePlant 호출 시 dtoJson과 MultipartFile 대신 DTO 객체만 전달 ⭐️⭐️
        Plant savedPlant = plantService.savePlant(dto, user);

        // ⭐️⭐️ 디버깅 로깅: 서비스 처리 후 응답 직전 확인 ⭐️⭐️
        System.out.println("✅ [Controller] 서비스 처리 완료. 응답 반환 준비.");

        return savedPlant;
    }

    // 사용자 등록 식물 목록 조회 API
    @GetMapping
    public List<Plant> getUserPlants(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return plantService.getPlantsByUser(user);
    }

    // 개별 식물 상세 조회 API
    @GetMapping("/{id}")
    public Plant getPlantById(@PathVariable Long id) {
        return plantService.getPlantById(id);
    }

    // 삭제 API
    @PostMapping("/delete")
    public ResponseEntity<String> deletePlant(@RequestParam("id") Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        boolean deleted = plantService.deletePlantById(id, user);
        if (deleted) {
            return ResponseEntity.ok("Plant deleted (id: " + id + ")");
        } else {
            return ResponseEntity.badRequest().body("Plant not found or not authorized to delete (id: " + id + ")");
        }
    }

    // 추천 식물 저장 API
    @PostMapping("/recommendations")
    public ResponseEntity<List<RecommendedPlant>> saveRecommendedPlants(@RequestBody PlantRecommendationRequestDto dto,
                                                                        Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Plant> recommendedPlants = plantService.recommendPlants(dto);
        List<RecommendedPlant> savedPlants = plantService.saveRecommendedPlants(recommendedPlants, user);
        return ResponseEntity.ok(savedPlants);
    }

    // 저장된 추천 식물 목록을 조회하는 API
    @GetMapping("/recommendations")
    public List<RecommendedPlant> getSavedRecommendedPlants(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return plantService.getSavedRecommendedPlants(user);
    }
}