package com.example.demo.service;

import com.example.demo.model.Plant;
import com.example.demo.model.PlantRecommendationRequestDto;
import com.example.demo.model.PlantRequestDto;
import com.example.demo.model.RecommendedPlant;
import com.example.demo.model.User;
import com.example.demo.repository.PlantRepository;
import com.example.demo.repository.RecommendedPlantRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.fasterxml.jackson.databind.ObjectMapper;

// 💡 Base64 디코딩에 필요한 import 추가
import java.util.Base64;
import java.io.ByteArrayInputStream;
import java.io.InputStream;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PlantService {

    private final PlantRepository plantRepository;
    private final RestTemplate restTemplate;
    private final UserRepository userRepository;
    private final RecommendedPlantRepository recommendedPlantRepository;
    private final ObjectMapper objectMapper; // 💡 추가

    public PlantService(PlantRepository plantRepository, RestTemplate restTemplate, UserRepository userRepository,
                        RecommendedPlantRepository recommendedPlantRepository) {
        this.plantRepository = plantRepository;
        this.restTemplate = restTemplate;
        this.userRepository = userRepository;
        this.recommendedPlantRepository = recommendedPlantRepository;
        this.objectMapper = new ObjectMapper(); // 💡 초기화
    }

    // ⭐️⭐️ 수정: Base64 JSON Body를 받기 위해 파라미터를 DTO 객체만 받도록 변경 ⭐️⭐️
    public Plant savePlant(PlantRequestDto dto, User user) {

        // ❌ 이전의 String 수동 파싱 로직은 Controller에서 DTO를 받으므로 여기서 제거합니다.
        // ❌ (Controller에서 @RequestBody PlantRequestDto dto 로 받도록 수정했으므로)

        // ⭐️ 디버깅 로깅: 서비스 진입 및 DTO 내용 확인 ⭐️
        System.out.println("✅ [Service] savePlant 진입. DTO Name: " + dto.getName());
        System.out.println("   Base64 Status: " + (dto.getBase64Image() != null ? "Image Present" : "No New Image"));
        // ----------------------------------------------------

        String imageUrl = null;

        // 💡 Base64 이미지가 전송되었는지 확인 (새 이미지 등록 또는 수정 시)
        if (dto.getBase64Image() != null && !dto.getBase64Image().isEmpty()) {

            try {
                // Base64 문자열을 디코딩
                byte[] imageBytes = Base64.getDecoder().decode(dto.getBase64Image());

                // ⭐️ Base64 바이트 배열을 파일로 저장하도록 saveImageFile 호출 ⭐️
                imageUrl = saveImageFile(imageBytes, dto.getFileName());

            } catch (IllegalArgumentException e) {
                System.err.println("❌ Base64 디코딩 실패: " + e.getMessage());
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Base64 이미지 데이터 형식이 올바르지 않습니다.", e);
            } catch (IOException e) {
                // ⭐️ 핵심 수정: 파일 저장 실패 시 HTTP 500 응답 강제 및 로그 출력 ⭐️
                System.err.println("❌ 파일 저장 실패 (권한 문제 예상): " + e.getMessage());
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "식물 이미지 저장에 실패했습니다. 서버 파일 권한을 확인하세요.",
                        e
                );
            }
        } else {
            // 이미지 파일이 없는 경우 DTO의 URL을 사용 (수정 시)
            imageUrl = dto.getImageUrl();
        }

        // ID가 있으면 수정, 없으면 등록 로직
        if (dto.getId() != null) {
            Optional<Plant> optionalPlant = plantRepository.findById(dto.getId());

            if (optionalPlant.isPresent()) {
                Plant existingPlant = optionalPlant.get();
                // 권한 확인
                if (!existingPlant.getUser().getId().equals(user.getId())) {
                    throw new SecurityException("User not authorized to update this plant.");
                }

                if (imageUrl != null) {
                    existingPlant.setImageUrl(imageUrl);
                }
                existingPlant.setName(dto.getName());
                existingPlant.setWaterCycleDays(dto.getWaterCycleDays());
                existingPlant.setWaterCycleCode(dto.getWaterCycleCode());
                existingPlant.setLightExposureCode(dto.getLightExposureCode());
                return plantRepository.save(existingPlant);
            }
        }

        // 새로 등록 로직 (ID가 없거나 기존 식물을 찾지 못했을 경우)
        Plant newPlant = new Plant(
                user,
                dto.getName(),
                imageUrl,
                dto.getWaterCycleDays(),
                dto.getWaterCycleCode(),
                dto.getLightExposureCode()
        );
        return plantRepository.save(newPlant);
    }

    private String saveImageFile(byte[] imageBytes, String originalFilename) throws IOException {
        // 💡 AWS 환경에 맞춰 절대 경로를 사용합니다.
        String uploadDir = "/home/ubuntu/plant_images/";
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            // 이 코드가 실행되기 전에 서버에서 폴더와 권한을 수동 설정하는 것이 더 안전합니다.
            Files.createDirectories(uploadPath);
        }

        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        Path filePath = uploadPath.resolve(uniqueFilename);

        // 바이트 배열을 파일 시스템에 직접 복사
        Files.write(filePath, imageBytes);

        // 💡 URL 반환은 /images/ 로 유지 (SecurityConfig와 매핑)
        return "/images/" + uniqueFilename;
    }

    public List<Plant> getPlantsByUser(User user) {
        return plantRepository.findByUserId(user.getId());
    }

    public Plant getPlantById(Long id) {
        return plantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Plant not found with id: " + id));
    }

    public boolean deletePlantById(Long id, User user) {
        Optional<Plant> plantOpt = plantRepository.findByIdAndUser(id, user);
        if (plantOpt.isPresent()) {
            plantRepository.delete(plantOpt.get());
            return true;
        }
        return false;
    }

    public List<RecommendedPlant> saveRecommendedPlants(List<Plant> recommendedPlants, User user) {
        if (user.getId() == null) {
            throw new IllegalArgumentException("User ID is null. Cannot save recommended plants.");
        }

        Optional<User> managedUserOpt = userRepository.findById(user.getId());
        if (managedUserOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found with id: " + user.getId());
        }
        User managedUser = managedUserOpt.get();

        List<RecommendedPlant> savedPlants = new ArrayList<>();

        for (Plant tempPlant : recommendedPlants) {
            // ✅✅ 수정된 부분: RecommendedPlant에 cntntsNo를 저장하도록 변경
            RecommendedPlant newPlant = new RecommendedPlant(
                    managedUser,
                    tempPlant.getName(),
                    tempPlant.getImageUrl(),
                    tempPlant.getCntntsNo() // 새로운 필드 추가
            );
            savedPlants.add(recommendedPlantRepository.save(newPlant));
        }
        return savedPlants;
    }

    public List<RecommendedPlant> getSavedRecommendedPlants(User user) {
        return recommendedPlantRepository.findByUserId(user.getId());
    }

    public List<Plant> recommendPlants(PlantRecommendationRequestDto dto) {
        String light = dto.getLightChkVal();
        String growthStyle = dto.getGrwhstleChkVal();
        String water = dto.getWaterCycleSel();

        String apiUrl = "http://api.nongsaro.go.kr/service/garden/gardenList"
                + "?apiKey=" + "20250228AE7XDRGIMGFOSM9SITT2OQ"
                + "&lightChkVal=" + light
                + "&grwhstleChkVal=" + growthStyle
                + "&waterCycleSel=" + water;

        String xmlResponse = restTemplate.getForObject(apiUrl, String.class);

        // ✅✅ 수정된 부분: cntntsNo를 파싱하도록 변경
        List<Plant> recommendedPlants = parseXmlResponse(xmlResponse);

        List<Plant> finalRecommendations = new ArrayList<>();
        if (recommendedPlants.size() > 3) {
            for (int i = 0; i < 3; i++) {
                finalRecommendations.add(recommendedPlants.get(i));
            }
        } else {
            finalRecommendations = recommendedPlants;
        }

        return finalRecommendations;
    }

    // ✅✅ 수정된 메서드: cntntsNo를 파싱하는 로직 추가
    private List<Plant> parseXmlResponse(String xmlString) {
        List<Plant> plants = new ArrayList<>();
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(new ByteArrayInputStream(xmlString.getBytes("UTF-8")));
            doc.getDocumentElement().normalize();

            NodeList nList = doc.getElementsByTagName("item");

            for (int temp = 0; temp < nList.getLength(); temp++) {
                Node nNode = nList.item(temp);
                if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element eElement = (Element) nNode;
                    String name = getTagValue("cntntsSj", eElement);
                    String imageUrl = getTagValue("rtnThumbFileUrl", eElement);
                    String cntntsNo = getTagValue("cntntsNo", eElement);

                    Plant plant = new Plant();
                    plant.setName(name);
                    plant.setImageUrl(imageUrl);
                    plant.setCntntsNo(cntntsNo); // 이제 오류 없이 cntntsNo를 설정할 수 있습니다.
                    plants.add(plant);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return plants;
    }

    private String getTagValue(String tag, Element element) {
        NodeList nodeList = element.getElementsByTagName(tag).item(0).getChildNodes();
        if (nodeList == null || nodeList.item(0) == null) {
            return "";
        }
        Node node = nodeList.item(0);
        return node.getNodeValue();
    }
}