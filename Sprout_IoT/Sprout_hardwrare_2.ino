#include <HTTPClient.h>
#include <Wire.h>
#include <DHT.h>
#include <WebServer.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>
#include "frames.h" // 모든 프레임 헤더를 한 번에 포함

// --- 기본 설정 ---
const char* AP_SSID = "ESP32_Setup";
const char* EC2_SERVER_URL = "http://98.90.112.208:9090/api/sensor";
const char* DEVICE_ID = "living_room_pot_1";
const char* API_KEY = "esp32-project-secret-key-123";

// --- 핀 설정 ---
#define SOIL_PIN    34
#define DHTPIN      15
#define DHTTYPE     DHT22
#define LIGHT_PIN   35
#define LED_PIN     16
#define NUM_PIXELS  12
#define TFT_CS      5
#define TFT_DC      2
#define TFT_RST     4

// --- 객체 선언 ---
DHT dht(DHTPIN, DHTTYPE);
Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CS, TFT_DC, TFT_RST);
Adafruit_NeoPixel strip(NUM_PIXELS, LED_PIN, NEO_GRB + NEO_KHZ800);
WebServer server(8090);

// --- 전역 변수 ---
float temp, hum;
int soil, light;
String inputSSID = "";
String inputPassword = "";

// --- 함수 선언 ---
void handleRoot();
void handleWiFiConfig();
void connectToWiFi(const char* ssid, const char* password);
void handleSensorRequest();
void clearStrip();
void printPublicIP();
void checkServerForCommand(); // 서버에 명령을 확인하는 함수 선언
void drawHappyFace();
void drawSadFace();
void playGifAnimation(); // GIF 애니메이션 함수 추가

// 프레임 배열 선언
const uint16_t* frames[60] = {
  frame01, frame02, frame03, frame04, frame05, frame06, frame07, frame08, frame09, frame10,
  frame11, frame12, frame13, frame14, frame15, frame16, frame17, frame18, frame19, frame20,
  frame21, frame22, frame23, frame24, frame25, frame26, frame27, frame28, frame29, frame30,
  frame31, frame32, frame33, frame34, frame35, frame36, frame37, frame38, frame39, frame40,
  frame41, frame42, frame43, frame44, frame45, frame46, frame47, frame48, frame49, frame50,
  frame51, frame52, frame53, frame54, frame55, frame56, frame57, frame58, frame59, frame60
};

// --- setup 및 loop 함수 ---
void setup() {
  Serial.begin(115200);
  dht.begin();
  strip.begin(); 
  strip.show();
  tft.initR(INITR_GREENTAB);          // <-- 이 부분을 GREENTAB으로 변경
  tft.setRotation(3);
  tft.fillScreen(ST77XX_BLACK); // 이 줄의 맨 앞 '//' 제거

  WiFi.softAP(AP_SSID);
  IPAddress IP = WiFi.softAPIP();
  Serial.print("🔧 SoftAP 시작됨, IP 주소: ");
  Serial.println(IP);

  server.on("/", HTTP_GET, handleRoot);
  server.on("/wifi", HTTP_POST, handleWiFiConfig);
  server.on("/api/sensor", handleSensorRequest);
  server.begin();
}

// --- 메인 루프 ---
void loop() {
  server.handleClient();

  // --- 비동기 타이머 설정 (두 가지 작업을 독립적으로 처리) ---
  static unsigned long lastSensorSendTime = 0;
  static unsigned long lastCommandCheckTime = 0;

  // Wi-Fi가 연결된 경우에만 서버와 통신
  if (WiFi.status() == WL_CONNECTED) {

    // 1초마다 서버에 새 명령이 있는지 확인
    if (millis() - lastCommandCheckTime > 1000) {
      lastCommandCheckTime = millis();
      checkServerForCommand();
    }

    // 10초마다 센서 데이터 읽고 서버로 전송
    if (millis() - lastSensorSendTime > 10000) {
      lastSensorSendTime = millis();
      
      temp = dht.readTemperature();
      hum  = dht.readHumidity();

      if (isnan(temp) || isnan(hum)) {
        Serial.println("❌ DHT 센서 읽기 실패!");
        // 실패 시 이번 루프는 여기서 종료
      } else {
        soil  = analogRead(SOIL_PIN);
        light = analogRead(LIGHT_PIN);

        // 센서 값 출력
        Serial.printf("Temp: %.1f C, Hum: %.1f %%, Soil: %d, Light: %d\n", temp, hum, soil, light);

        // TFT 디스플레이에 상태 표시
        bool healthy = (temp > 18 && temp < 30) && (hum > 30 && hum < 70) && (soil > 300 && soil < 3000); // 이 줄의 맨 앞 '//' 제거
        if (healthy) drawHappyFace();    // 이 줄의 맨 앞 '//' 제거
        else       drawSadFace();        // 이 줄의 맨 앞 '//' 제거

        // EC2 서버로 데이터 전송 로직
        HTTPClient http;
        http.begin(EC2_SERVER_URL);
        http.addHeader("Content-Type", "application/json");
        http.addHeader("X-API-Key", API_KEY);

        //  JSON 페이로드 생성
        StaticJsonDocument<256> doc;
        doc["deviceId"] = DEVICE_ID;
        doc["temperature"] = temp;
        doc["humidity"] = hum;
        
        // 예: 4095(완전 건조) -> 0%, 1000(완전 습함) -> 100%
        int mappedSoil = map(soil, 4095, 1000, 0, 100);
        mappedSoil = constrain(mappedSoil, 0, 100); // 0~100 범위를 벗어나지 않도록 함

        // JSON에 추가
        doc["soilMoisture"] = mappedSoil;
        doc["lightLevel"] = light;

        // JSON 직렬화
        String jsonPayload;
        serializeJson(doc, jsonPayload);

        // 서버로 데이터 전송
        Serial.println("서버로 데이터 전송 시도...");
        int httpCode = http.POST(jsonPayload);

        // 응답 처리
        if (httpCode > 0) {
          String response = http.getString();
          Serial.printf("HTTP 응답 코드: %d\n", httpCode);
          Serial.println("응답 내용: " + response);
        } else {
          Serial.printf("HTTP 요청 실패, 오류: %s\n", http.errorToString(httpCode).c_str());
        }
        http.end();
      }
    }
  }
}

// --- 이하 함수 정의 ---

const char* htmlPage = R"rawliteral(
<!DOCTYPE html><html><body><h1>ESP32 WiFi 설정</h1><form action="/wifi" method="post">SSID: <input type="text" name="ssid"><br>Password: <input type="password" name="password"><br><input type="submit" value="Submit"></form></body></html>
)rawliteral";

// 서버에 새 명령이 있는지 확인하고 실행하는 함수
void checkServerForCommand() {
  HTTPClient http;
  String commandUrl = String(EC2_SERVER_URL).substring(0, String(EC2_SERVER_URL).lastIndexOf('/')) + "/command/" + String(DEVICE_ID);
  http.begin(commandUrl);
  
  int httpCode = http.GET();
  
  if (httpCode == HTTP_CODE_OK) { // HTTP 200 OK: 새 명령이 있음!
    String payload = http.getString();
    Serial.println("새 명령 수신: " + payload);

    if (payload.startsWith("on")) {
      int level = 0;
      int eqIndex = payload.indexOf("=");
      if (eqIndex != -1) {
        level = payload.substring(eqIndex + 1).toInt();
      }
      
      clearStrip();
      int ledsToTurnOn = 0;
      if (level == 1) ledsToTurnOn = 4;
      else if (level == 2) ledsToTurnOn = 8;
      else if (level == 3) ledsToTurnOn = 12;
      
      ledsToTurnOn = min(ledsToTurnOn, NUM_PIXELS); 
      for (int i = 0; i < ledsToTurnOn; i++) {
        strip.setPixelColor(i, strip.Color(100, 12, 20)); // 밝기를 약 40%로 줄여 전력 소모 감소
      }
      strip.show();
    } else if (payload.equals("off")) {
      clearStrip();
      strip.show();
    }
  }
  http.end();
}

void handleRoot() {
  server.send(200, "text/html", htmlPage);
}

void handleWiFiConfig() {
  if (server.hasArg("ssid") && server.hasArg("password")) {
    inputSSID = server.arg("ssid");
    inputPassword = server.arg("password");
    server.send(200, "text/plain", "WiFi 정보 수신 완료. 연결 시도 중...");
    Serial.println("🔐 받은 SSID: " + inputSSID);
    Serial.println("🔐 받은 PW  : " + inputPassword);
    connectToWiFi(inputSSID.c_str(), inputPassword.c_str());
  } else {
    server.send(400, "text/plain", "요청 오류");
  }
}

void connectToWiFi(const char* ssid, const char* password) {
  WiFi.softAPdisconnect(true);
  delay(1000);
  WiFi.begin(ssid, password);
  Serial.println("📡 WiFi 연결 시도 중...");
  int maxAttempts = 20;
  while (WiFi.status() != WL_CONNECTED && maxAttempts-- > 0) {
    delay(500);
    Serial.print(".");
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ 연결 성공!");
    Serial.print("IP 주소 (사설): ");
    Serial.println(WiFi.localIP());
    printPublicIP();
    playGifAnimation(); // GIF 애니메이션 한 번 실행
  } else {
    Serial.println("\n❌ 연결 실패. 설정 모드로 돌아갑니다.");
    WiFi.disconnect(true);
    WiFi.softAP(AP_SSID);
    IPAddress IP = WiFi.softAPIP();
    Serial.print("🔧 SoftAP 재시작됨, IP 주소: ");
    Serial.println(IP);
  }
}

void handleSensorRequest() {
  StaticJsonDocument<200> doc;
  doc["temp"] = temp;
  doc["hum"] = hum;
  doc["soil"] = soil;
  doc["light"] = light;
  String json;
  serializeJson(doc, json);
  server.send(200, "application/json", json);
}

void clearStrip() {
  for (int i = 0; i < NUM_PIXELS; i++) {
    strip.setPixelColor(i, strip.Color(0, 0, 0));
  }
}

void printPublicIP() {
  HTTPClient http;
  http.begin("http://api.ipify.org"); 
  int httpCode = http.GET();
  if (httpCode == HTTP_CODE_OK) {
    String publicIp = http.getString();
    Serial.print("🌐 나의 공인 IP 주소: ");
    Serial.println(publicIp);
  } else {
    Serial.printf("❌ 공인 IP 조회 실패, 오류 코드: %d\n", httpCode);
  }
  http.end();
}

void drawHappyFace() {
  tft.fillScreen(ST77XX_BLACK);
  // 눈
  tft.fillCircle(40, 40, 10, ST77XX_WHITE);
  tft.fillCircle(120, 40, 10, ST77XX_WHITE);
  // 입
  tft.drawPixel(60, 80, ST77XX_WHITE);
  tft.drawPixel(61, 81, ST77XX_WHITE);
  tft.drawPixel(62, 82, ST77XX_WHITE);
  tft.drawPixel(63, 83, ST77XX_WHITE);
  for (int i = 64; i < 96; i++) {
    tft.drawPixel(i, 84, ST77XX_WHITE);
  }
  tft.drawPixel(96, 83, ST77XX_WHITE);
  tft.drawPixel(97, 82, ST77XX_WHITE);
  tft.drawPixel(98, 81, ST77XX_WHITE);
  tft.drawPixel(99, 80, ST77XX_WHITE);
}

void drawSadFace() {
  tft.fillScreen(ST77XX_BLACK);
  // 눈
  tft.fillCircle(40, 40, 10, ST77XX_WHITE);
  tft.fillCircle(120, 40, 10, ST77XX_WHITE);
  // 입
  tft.drawPixel(60, 84, ST77XX_WHITE);
  tft.drawPixel(61, 83, ST77XX_WHITE);
  tft.drawPixel(62, 82, ST77XX_WHITE);
  tft.drawPixel(63, 81, ST77XX_WHITE);
  for (int i = 64; i < 96; i++) {
    tft.drawPixel(i, 80, ST77XX_WHITE);
  }
  tft.drawPixel(96, 81, ST77XX_WHITE);
  tft.drawPixel(97, 82, ST77XX_WHITE);
  tft.drawPixel(98, 83, ST77XX_WHITE);
  tft.drawPixel(99, 84, ST77XX_WHITE);
}

// GIF 애니메이션 함수
void playGifAnimation() {
  for (int i = 0; i < 60; i++) {
    tft.pushColors((uint16_t*)frames[i], 128 * 160);
    delay(50); // 프레임 간 딜레이(ms), 필요에 따라 조절
  }
}