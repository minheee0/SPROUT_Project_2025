
# 🌱 SPROUT
<img width="1090" height="613" alt="Image" src="https://github.com/user-attachments/assets/2e6e697f-ca2f-491a-b826-13af98c1adee" />
> 프로젝트 기간: 2025.3.1 ~ 2025.11.11 ✅
<br/>
<br/>

# 0. 시작하기 ✅
```bash
$ yarn start
```

<br/>

# 01. 프로젝트 소개

- Sprout는 IoT 기반 센서를 활용하여 실내 식물을 키우는 사용자가 **환경을 실시간 모니터링하고 직접 제어**할 수 있도록 돕는 스마트 식물 관리 앱입니다.
- 조도, 온·습도, 토양 수분 등 식물 생육에 필요한 환경 정보를 스마트폰 앱을 통해 실시간 확인할 수 있습니다.
- 앱에서 직접 LED 조명 제어와 같은 환경 조절도 가능합니다.
- 사용자가 자신이 키우는 식물을 앱에 등록하고, 식물의 상태와 관리 기록을 손쉽게 관리할 수 있습니다.

<br/>

## 팀원 구성

| **민도현** | **정현오** | **박민희** |  **최진솔**  |
| :------------: | :------------: | :------------: | :------------: |
| <img src="https://github.com/user-attachments/assets/7d5b65b3-3751-4c6a-b4bc-69b742cc3053" width=180> | <img src="https://github.com/user-attachments/assets/f5e6a094-960f-4bfc-9c41-1bfe87e68372" width=180> | <img src="https://github.com/user-attachments/assets/9f18cc61-6401-423b-aaed-29f02b2622a2" width=180> | <img src="https://github.com/user-attachments/assets/80a22590-80ba-47a0-9098-089839a38ebd" width=180> | 
| **github**: [mindo0118](https://github.com/mindo0118)| **github**: [hyeon-oo](https://github.com/hyeon-oo) |  **github**: [minheee0](https://github.com/minheee0) | **github**: [choelsol](https://github.com/choelsol) |
| ![FrontEnd](https://img.shields.io/badge/FrontEnd-3f97fb)</br> ![Team%20Leader](https://img.shields.io/badge/-Team%20leader-yellow) </br> | ![FrontEnd](https://img.shields.io/badge/FrontEnd-3f97fb) |  ![BackEnd](https://img.shields.io/badge/BackEnd-ff6f61)</br>| ![BackEnd](https://img.shields.io/badge/BackEnd-ff6f61) |

| **김다연**  |   **김민정**  |  
| :------------: | :------------: |
| <img src="https://github.com/user-attachments/assets/47ec901d-ee5e-4259-8d4b-064f10562f17" width=170> | <img src="https://github.com/user-attachments/assets/a2effb4f-3521-48f4-8d66-512d270aeead" width=160> |  
| **github**: [double2-22](https://github.com/double2-22) | **github**: [gnujnim475](https://github.com/gnujnim475) |  
| ![IoT](https://img.shields.io/badge/IoT-00c853) | ![IoT](https://img.shields.io/badge/IoT-00c853) |  

<br/>
<br/>

# ✅02. 프로젝트 주요 기능
1. **회원가입 및 로그인**  
   - 이메일/비밀번호 기반 인증  
   - JWT 토큰으로 세션 관리  

2. **초기 사용자 맞춤 식물 추천**  
   - 3가지 질문에 따라 적합한 3종의 식물 추천
   - 추천 식물 3종 표시
   
3. **식물 등록 및 성장 일지**
   - 반려식물 정보를 등록하고 관리하는 기능
   - 캘린더에서 메모 작성 및 날짜별 식물 스티커 표시

4. **실시간 환경 모니터링 기능**
   - 등록된 식물은 IoT 기기와 연동되어 조도, 온도, 습도, 토양 수분을 실시간 모니터링

<br/>
<br/>

# 03. 프로젝트 기술 스택

## 🛠 Tech Stack

### 📱 Frontend & ⚙️ Backend
| 기술 | Frontend | Backend | 
| :--- | :--- |:--- | 
| **Language** | ![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black) | ![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white) |
| **Framework** | ![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) |  ![Spring Boot](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white) |
| **Tool** | ![Expo](https://img.shields.io/badge/expo-000020?style=for-the-badge&logo=expo&logoColor=white) ![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) |  ![Gradle](https://img.shields.io/badge/Gradle-02303A.svg?style=for-the-badge&logo=Gradle&logoColor=white) |

### 🗄️ Database & Infrastructure
| 분류 | 배지 |
| :--- | :--- |
| **Database** | ![MySQL](https://img.shields.io/badge/mysql-%23005C84.svg?style=for-the-badge&logo=mysql&logoColor=white) |
| **Cloud** | ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white) ![Amazon EC2](https://img.shields.io/badge/Amazon_EC2-FF9900?style=for-the-badge&logo=amazon-ec2&logoColor=white) ![Amazon RDS](https://img.shields.io/badge/Amazon_RDS-527FFF?style=for-the-badge&logo=amazon-rds&logoColor=white) |

### 🔌 IoT (Hardware)
| 장치 | 배지 |
| :--- | :--- |
| **Controller** | ![Arduino](https://img.shields.io/badge/-Arduino-00979D?style=for-the-badge&logo=Arduino&logoColor=white) ![ESP32](https://img.shields.io/badge/ESP32-E7352C?style=for-the-badge&logo=espressif&logoColor=white) |

# 04. 프로젝트 구조


<br/>
<br/>

# 05. ✅ 역할 분담
| 팀 | 팀원 | 담당 기능 |
|----|------|-----------|
| ![FrontEnd](https://img.shields.io/badge/FrontEnd-3f97fb) | 민도현 | 식물 등록/성장 일지 페이지 UI, IoT 디바이스 제어 UI |
| ![FrontEnd](https://img.shields.io/badge/FrontEnd-3f97fb) | 정현오 | 메인/시작/검색 페이지 UI, 알림 페이지 및 IoT 페이지 UI |
| ![BackEnd](https://img.shields.io/badge/BackEnd-ff6f61) | 박민희 | 회원가입/로그인 등 인증 기능, 맞춤 식물 추천 기능, 회원 DB 설계 |
| ![BackEnd](https://img.shields.io/badge/BackEnd-ff6f61) | 최진솔 | 식물 등록/성장 일지 기능, 관련 DB 설계 |
| ![IoT](https://img.shields.io/badge/IoT-00c853) | 김다연 | AWS 인프라 구축 및 연동, 센서 연결 및 디바이스 외형 제작 |
| ![IoT](https://img.shields.io/badge/IoT-00c853) | 김민정 | AWS 인프라 구축 및 연동, IoT 센서 장착 및 데이터 수집 |

<br/>
<br/>

# 06. 참고 자료
- [농사로 API 문서](https://www.nongsaro.go.kr) - 식물 정보 및 추천 기능 활용
