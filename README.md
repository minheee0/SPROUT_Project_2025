# 🌱 SPROUT — Backend API

<img width="1090" height="613" alt="Sprout 대표 이미지" src="https://github.com/user-attachments/assets/2e6e697f-ca2f-491a-b826-13af98c1adee" />

> **IoT 기반 스마트 식물 관리 앱 Sprout의 백엔드 서버**
>
> - **기간**: 2025.03.01 ~ 2025.11.11
> - **팀 구성**: 6명 (Frontend 2 · Backend 2 · IoT/Infra 2)
> - **담당**: Backend — 회원 인증/인가(JWT), 맞춤 식물 추천, 농사로 Open API 연동, 회원 DB 설계
> - **성과**: 교내 소프트웨어 경진대회 장려상

> 📌 팀 프로젝트 중 **제가 담당한 백엔드 기능**을 중심으로 정리한 포트폴리오용 저장소입니다.
> 전체 프로젝트 소개는 [팀 원본 저장소](https://github.com/<팀-org>/<repo>)에서 볼 수 있습니다.

<br/>

## 📌 목차

1. [프로젝트 소개](#-프로젝트-소개)
2. [담당 역할 및 구현 내용](#-담당-역할-및-구현-내용)
3. [기술 스택](#-기술-스택)
4. [시스템 구조 & ERD](#-시스템-구조--erd)
5. [API 명세](#-api-명세-담당-파트)
6. [트러블슈팅](#-트러블슈팅)
7. [팀 구성](#-팀-구성)
8. [실행 방법](#-실행-방법)
9. [회고](#-회고)

<br/>

## 🌿 프로젝트 소개

**Sprout**는 IoT 센서를 활용해 실내 식물을 키우는 사용자가 **환경을 실시간으로 모니터링하고 직접 제어**할 수 있도록 돕는 스마트 식물 관리 앱입니다.

| 기능 | 설명 |
| :--- | :--- |
| 🔐 회원가입 / 로그인 | 이메일·비밀번호 기반 인증, JWT 토큰으로 세션 관리 |
| 🌱 맞춤 식물 추천 | 3가지 설문 응답을 바탕으로 사용자에게 맞는 식물 3종 추천 |
| 📒 식물 등록 / 성장 일지 | 반려식물 등록, 캘린더 메모 및 날짜별 스티커 |
| 📡 실시간 환경 모니터링 | 조도·온도·습도·토양 수분 실시간 확인, LED 조명 제어 |

> 이 중 **🔐 회원가입/로그인**과 **🌱 맞춤 식물 추천**의 백엔드를 제가 담당했습니다.

<br/>

## 👩‍💻 담당 역할 및 구현 내용

### 1. JWT 기반 회원 인증/인가

- 이메일·비밀번호 기반 **회원가입 / 로그인 API** 구현
- **Spring Security + JJWT(0.11.5)** 를 이용한 무상태(Stateless) 인증 — 서버 세션 없이 토큰으로 사용자 식별
- Security 설정으로 인증이 필요한 API와 공개 API(회원가입·로그인)를 구분
- **Spring Validation**으로 회원가입 요청값(이메일 형식, 필수값 등) 검증
- 비밀번호는 `BCryptPasswordEncoder`로 해시하여 저장

<!-- TODO: 실제 구현한 것만 남기세요
- [ ] Refresh Token을 구현했다면 → 저장 위치(Redis/DB)와 재발급 흐름 추가
- [ ] 토큰 만료·위조 시 예외 응답 처리 방식
-->

```
[Client] ── 로그인 요청 ──▶ [AuthController] ──▶ [AuthService] ── 회원 검증 ──▶ [MySQL]
   ▲                                                   │
   └──────────── Access Token 발급 ◀───────────────────┘

[Client] ── API 요청 + Authorization: Bearer {token} ──▶ [JWT Filter] ── 검증 통과 ──▶ [Controller]
```

### 2. 농사로 Open API 연동

- 농촌진흥청 **농사로 Open API**에서 실내 식물 데이터를 받아 추천 기능에 활용
- 농사로 API는 **XML로 응답**하기 때문에 `jackson-dataformat-xml`로 응답을 Java 객체(DTO)로 변환
- <!-- TODO: 호출 방식 확인 후 하나만 남기기 → WebClient(WebFlux) / HttpClient5 / RestTemplate -->로 외부 API 호출

<!-- TODO: 받아온 데이터를 매번 호출했는지, DB에 저장해 두고 썼는지 적어주세요. 면접 단골 질문입니다. -->

### 3. 사용자 맞춤 식물 추천

- 사용자의 **3가지 설문 응답**을 조건으로 식물 데이터를 필터링해 **적합한 식물 3종**을 추천

| 설문 항목 | 매칭 기준 (농사로 데이터) |
| :--- | :--- |
| <!-- TODO: 예) 집의 햇빛 정도 --> | <!-- TODO: 예) 광요구도 --> |
| <!-- TODO --> | <!-- TODO: 예) 관리 난이도 --> |
| <!-- TODO --> | <!-- TODO --> |

<!-- TODO: 추천 로직을 한두 줄로 구체화하면 좋습니다.
예) "조건을 모두 만족하는 식물을 우선 추천하고, 3종이 안 되면 일치 조건 수가 많은 순으로 채움"
-->

### 4. 회원 도메인 DB 설계

- **MySQL** 기반 회원 테이블 및 설문/추천 관련 테이블 설계
- **Spring Data JPA**로 엔티티 매핑 및 Repository 구현, Lombok으로 보일러플레이트 코드 감소

<br/>

## 🛠 기술 스택

| 분류 | 기술 |
| :--- | :--- |
| **Language** | ![Java 21](https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white) |
| **Framework** | ![Spring Boot 3.2.5](https://img.shields.io/badge/Spring_Boot_3.2.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white) ![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white) |
| **Auth** | ![JWT](https://img.shields.io/badge/JJWT_0.11.5-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) |
| **Database** | ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white) ![Spring Data JPA](https://img.shields.io/badge/Spring_Data_JPA-6DB33F?style=for-the-badge&logo=spring&logoColor=white) |
| **Build** | ![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white) |
| **Infra** | ![Amazon EC2](https://img.shields.io/badge/Amazon_EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white) ![Amazon RDS](https://img.shields.io/badge/Amazon_RDS-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white) |
| **External** | 농사로 Open API (XML) · Jackson XML |
| **Etc** | Lombok, Spring Validation |

<!-- TODO: build.gradle에 Redis, WebSocket 의존성이 있습니다.
본인이 직접 사용했다면 위 표에 추가하고, 팀원 파트(예: IoT 실시간 데이터)라면 그대로 두세요. -->

<details>
<summary>전체 서비스 기술 스택 (팀)</summary>

| 파트 | 기술 |
| :--- | :--- |
| Frontend | React Native (Expo), JavaScript |
| Backend | Java 21, Spring Boot 3.2.5, MySQL |
| Infra | AWS EC2, RDS |
| IoT | ESP32, Arduino (조도·온습도·토양수분 센서) |

</details>

<br/>

## 🏗 시스템 구조 & ERD

### 시스템 아키텍처

<!-- TODO: 아키텍처 다이어그램 이미지 첨부 -->

```
[React Native App] ⇄ [Spring Boot API (EC2)] ⇄ [MySQL (RDS)]
                              │
                              └──▶ [농사로 Open API (XML)]
[ESP32 센서] ──▶ [Spring Boot API]
```

### ERD (담당 도메인)

<!-- TODO: 회원/설문/추천 테이블 ERD 이미지 첨부 (dbdiagram.io, ERDCloud 등) -->

<br/>

## 📄 API 명세 (담당 파트)

| Method | URI | 설명 | 인증 |
| :---: | :--- | :--- | :---: |
| `POST` | `/api/auth/signup` | 회원가입 | ❌ |
| `POST` | `/api/auth/login` | 로그인 (JWT 발급) | ❌ |
| `POST` | `/api/recommend` | 설문 응답 기반 식물 3종 추천 | ✅ |

<!-- TODO: 실제 Controller의 엔드포인트로 교체 -->

<br/>

## 🔥 트러블슈팅

<!-- 면접에서 가장 많이 물어보는 섹션입니다. 실제 겪은 문제 1~2개만 써도 충분합니다. -->

### 1. 농사로 API XML 응답 파싱

- **문제**: <!-- 예) 농사로 API가 JSON이 아닌 XML로 응답해 기존 방식으로 매핑되지 않음 -->
- **원인**: <!-- 예) XML 구조가 중첩(response > body > items > item)되어 있고, 값이 없는 필드가 섞여 있음 -->
- **해결**: <!-- 예) jackson-dataformat-xml의 XmlMapper로 DTO 매핑, @JacksonXmlElementWrapper 등으로 리스트 처리 -->
- **배운 점**:

### 2. 라이브러리 의존성 충돌

- **문제**: <!-- build.gradle에 httpclient(4.x)를 exclude하고 httpclient5를 쓴 흔적이 있습니다. 직접 해결했다면 작성하세요. -->
- **원인**:
- **해결**: `configurations.all`에서 `org.apache.httpcomponents:httpclient`를 제외하고 `httpclient5`로 통일
- **배운 점**:

<br/>

## 👥 팀 구성

| 이름 | 파트 | 담당 |
| :---: | :---: | :--- |
| 민도현 ([@mindo0118](https://github.com/mindo0118)) | ![FrontEnd](https://img.shields.io/badge/FrontEnd-3f97fb) ![Leader](https://img.shields.io/badge/Team_Leader-yellow) | 식물 등록/성장 일지 UI, IoT 디바이스 제어 UI |
| 정현오 ([@hyeon-oo](https://github.com/hyeon-oo)) | ![FrontEnd](https://img.shields.io/badge/FrontEnd-3f97fb) | 메인/시작/검색 UI, 알림 및 IoT 페이지 UI |
| **박민희 ([@minheee0](https://github.com/minheee0))** | ![BackEnd](https://img.shields.io/badge/BackEnd-ff6f61) | **회원 인증(JWT), 맞춤 식물 추천, 농사로 API 연동, 회원 DB 설계** |
| 최진솔 ([@choelsol](https://github.com/choelsol)) | ![BackEnd](https://img.shields.io/badge/BackEnd-ff6f61) | 식물 등록/성장 일지 기능, 관련 DB 설계 |
| 김다연 ([@double2-22](https://github.com/double2-22)) | ![IoT](https://img.shields.io/badge/IoT-00c853) | AWS 인프라 구축, 센서 연결 및 디바이스 외형 제작 |
| 김민정 ([@gnujnim475](https://github.com/gnujnim475)) | ![IoT](https://img.shields.io/badge/IoT-00c853) | AWS 인프라 구축, IoT 센서 장착 및 데이터 수집 |

<br/>

## 🚀 실행 방법

**요구 사항**: JDK 21, MySQL 8.x <!-- Redis를 쓴다면: , Redis -->

```bash
# 1. 클론
git clone https://github.com/minheee0/plant-app.git
cd plant-app

# 2. 환경 변수 설정 (.env — Git에 올라가지 않습니다)
#    DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET, NONGSARO_API_KEY

# 3. 빌드 및 실행
./gradlew clean build
./gradlew bootRun
```

<br/>

## 💭 회고

<!-- TODO: 3~5줄 정도. 예시 -->
- 처음으로 인증 기능을 직접 구현하며 **세션 방식과 토큰 방식의 차이**를 이해하게 되었습니다.
- XML로 응답하는 공공 API를 서비스 데이터로 가공하며 <!-- 느낀 점 -->
- 아쉬운 점 / 개선하고 싶은 점: <!-- 예) Refresh Token 도입, 테스트 코드 작성, 사용하지 않는 의존성 정리 -->

<br/>

## 📚 참고 자료

- [농사로 Open API](https://www.nongsaro.go.kr) — 식물 정보 및 추천 기능 데이터
