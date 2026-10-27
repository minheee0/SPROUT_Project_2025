import React, { useState, useEffect } from 'react';
import useIotStore from '../../store/iotStore';
import 'url-search-params-polyfill';
import { Modal, Platform, TextInput, View, Text, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import PagerView from 'react-native-pager-view';
import styles from '../../styles/IotStyles';

// --- 기본 설정 ---
const YOUR_EC2_PUBLIC_IP = "54.224.76.10"; // 본인의 EC2 공인 IP로 변경
const WEBSOCKET_URL = `ws://${YOUR_EC2_PUBLIC_IP}:9090/ws`; // 웹소켓 주소
const ESP32_LOCAL_IP = "192.168.4.1"; // ESP32 SoftAP 모드의 기본 IP
const DEVICE_ID = "living_room_pot_1"; // ✅ 기기 ID 추가 (Arduino 코드와 동일하게)

const sunLevels = [
  { id: 'a', level: 1, label: '1단계', off: require('../../assets/sun-a-off.png'), on: require('../../assets/sun-a-on.png') },
  { id: 'b', level: 2, label: '2단계', off: require('../../assets/sun-b-off.png'), on: require('../../assets/sun-b-on.png') },
  { id: 'c', level: 3, label: '3단계', off: require('../../assets/sun-c-off.png'), on: require('../../assets/sun-c-on.png') },
];

const IOTSettingsScreen = ({ navigation }) => {
  // --- 상태 변수 (State) ---
  const [modalVisible, setModalVisible] = useState(false);
  // zustand 스토어에서 실시간 데이터 가져오기
  const { soilMoisture, temperature, lightLevel } = useIotStore();
  const [ledStatus, setLedStatus] = useState(false);
  const [selectedSunLevel, setSelectedSunLevel] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');

  // AsyncStorage에서 이전 제어 상태 값 로드
  useEffect(() => {
    const loadStoredValues = async () => {
      const storedLed = await AsyncStorage.getItem('ledStatus');
      const storedSunLevel = await AsyncStorage.getItem('selectedSunLevel');
      if (storedLed !== null) setLedStatus(storedLed === 'true');
      if (storedSunLevel !== null) setSelectedSunLevel(JSON.parse(storedSunLevel));
    };
    loadStoredValues();
  }, []);

  // --- ✅ [추가] 명령 전송 헬퍼 함수 ---
  const sendCommandToDevice = async (command) => {
    try {
      // AsyncStorage에서 토큰을 가져옵니다.
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('오류', '로그인 정보가 없습니다. 다시 로그인해주세요.');
        // 로그인 화면으로 보내는 로직을 추가할 수 있습니다.
        // navigation.navigate('Login'); 
        return;
      }

      await axios.post(
        `http://${YOUR_EC2_PUBLIC_IP}:9090/api/command/${DEVICE_ID}`,
        { command: command }, // JSON 형식으로 데이터 전송
        {
          headers: {
            'Authorization': `Bearer ${token}` // 헤더에 토큰 추가
          }
        }
      );
    } catch (error) {
      // 서버에서 401(Unauthorized) 또는 403(Forbidden) 응답을 보냈을 때 처리
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        Alert.alert('권한 없음', '이 기기를 제어할 권한이 없습니다.');
      } else {
        Alert.alert('오류', '명령 전송에 실패했습니다.');
      }
      console.warn("명령 전송 실패:", error);
      throw error; // 에러를 다시 던져서 호출한 쪽에서 처리할 수 있게 함
    }
  };

  // --- 핸들러 함수 ---
  const handleBackPress = () => navigation.goBack();

  // --- ✅ [수정] 핸들러 함수 ---
  const handleLedLevelSelect = async (level) => {
    setSelectedSunLevel(level);
    await AsyncStorage.setItem('selectedSunLevel', JSON.stringify(level));

    if (ledStatus) {
      // led가 켜져있을 때 레벨을 바꾸면 바로 명령 전송
      await sendCommandToDevice(`on?level=${level.level}`);
    }
  };

  const toggleLedStatus = async () => {
    if (!ledStatus && !selectedSunLevel) {
      return Alert.alert('알림', '먼저 햇빛 단계를 선택해주세요.');
    }
    
    const newStatus = !ledStatus;
    const command = newStatus ? `on?level=${selectedSunLevel.level}` : 'off';

    try {
      await sendCommandToDevice(command); // ✅ 수정한 헬퍼 함수 사용
      setLedStatus(newStatus);
      await AsyncStorage.setItem('ledStatus', String(newStatus));
    } catch (error) {
      // sendCommandToDevice에서 이미 Alert를 띄우므로 여기서는 추가 작업 안함
    }
  };

  const handleWifiSubmit = async () => {
    if (!ssid.trim()) {
      return Alert.alert('알림', '와이파이 아이디(SSID)를 입력하세요.');
    }
    
    try {
      const params = new URLSearchParams();
      params.append('ssid', ssid);
      params.append('password', password);

      const response = await axios.post(`http://${ESP32_LOCAL_IP}:8090/wifi`, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 5000,
      });

      Alert.alert('성공', 'Wi-Fi 정보가 전송되었습니다. 기기가 네트워크에 연결됩니다.');
      console.log('Wi-Fi 정보 전송 성공:', response.data);
    } catch (error) {
      Alert.alert('전송 실패', 'Wi-Fi 정보 전송에 실패했습니다.\n스마트폰이 "ESP32_Setup" Wi-Fi에 연결되어 있는지 확인하세요.');
      console.error('Wi-Fi 정보 전송 실패:', error);
    }
  };


  return (
    // ✅ 2. View를 ScrollView로 변경합니다.
    <ScrollView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Image
            source={require('../../assets/back_icon2.png')}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>IoT 설정 페이지</Text>
      </View>

      {/* wifi연결 */}
      <View style={styles.wifiContainer}>
        <Text style={styles.wifiTitle}>네트워크 연결</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.wifiButton}>
          <Text style={styles.wifiButtonText}>Wi-Fi 설정</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <View style={styles.indicatorContainer}>
              {[0, 1, 2, 3].map(i => (
                <View
                  key={i}
                  style={[
                    styles.indicatorDot,
                    pageIndex === i && styles.activeIndicatorDot,
                  ]}
                />
              ))}
            </View>
            <PagerView
              style={styles.pagerView}
              initialPage={0}
              orientation="horizontal"
              onPageSelected={e => setPageIndex(e.nativeEvent.position)}
            >
              <View key="1" style={styles.page}>
                <Image
                  source={require('../../assets/wifi.png')}
                  style={{ width: 250, height: 250, top: 32 }}
                  resizeMode="contain"
                />
                <Text style={[styles.modalTitle, { marginTop: 40, textAlign: 'center', fontWeight: '700', fontSize: 17, color: '#58A72E', fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto' }]}>
                  휴대기기 와이파이 검색에서 {"\n"}
                  "SPROUT_wifi"를 찾아 연결하세요.{"\n"}
                  연결이 완료된 상태에서 다음 설정을 진행합니다.
                </Text>
              </View>
              <View key="2" style={styles.page}>
                <Image
                  source={require('../../assets/Antenna.png')}
                  style={{ width: 120, height: 120, top: 22 }}
                  resizeMode="contain"
                />
                <Text style={styles.modalTitle}></Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>와이파이 아이디(SSID)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="와이파이 아이디 입력"
                    value={ssid}
                    onChangeText={setSsid}
                  />
                  <Text style={styles.label}>비밀번호</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="비밀번호 입력"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity style={styles.sendButton} onPress={handleWifiSubmit}>
                    <Text style={styles.sendButtonText}>보내기</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.modalTitle, { marginTop: 10, textAlign: 'center', fontWeight: '700', color: '#58A72E', fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto' }]}>
                  사용 중인 와이파이의 이름과 비밀번호를 Sprout 기기에 전송합니다.{"\n"}
                  이를 통해 Sprout 기기가 해당 네트워크에{"\n"} 연결할 수 있습니다.
                </Text>
              </View>
              <View key="3" style={styles.page}>
                <Image
                  source={require('../../assets/wifi.png')}
                  style={{ width: 250, height: 250, top: 32 }}
                  resizeMode="contain"
                />
                <Text style={[styles.instructionText, { marginTop: 40, textAlign: 'center', fontWeight: '700', fontSize: 17, color: '#58A72E', fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto' }]}>
                  다시 휴대기기 와이파이 검색에서 {"\n"}
                  사용자의 기존 와이파이를 연결하세요.
                  Sprout 기기에 보낸 와이파이 정보와
                  일치해야합니다.{"\n"}
                </Text>
              </View>
              <View key="4" style={styles.page}>
                <Image
                  source={require('../../assets/Logo.png')}
                  style={{ width: 220, height: 220, top: 32 }}
                  resizeMode="contain"
                />
                <Text style={[styles.modalTitle, { fontSize: 16, lineHeight: 25, color: '#333', paddingHorizontal: 20, marginTop: 20, textAlign: 'center', fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto' }]}>
                  Wi-Fi 연결이 완료되었습니다. {"\n"}
                  이제 Sprout을 시작할 수 있습니다.
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>설정 완료</Text>
                </TouchableOpacity>
              </View>
            </PagerView>
          </View>
        </View>
      </Modal>

      <View style={styles.sensorDataContainer}>
        <Text style={styles.sensorTitle}>센서 데이터</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>토양 습도</Text>
          {/* ✅ [수정] soilMoisture가 null이 아닐 때만 반올림하여 표시 */}
          <Text style={styles.infoValue}>{soilMoisture !== null ? `${Math.round(soilMoisture)}%` : '--%'}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>대기 온도</Text>
          {/* ✅ [수정] temperature가 null이 아닐 때만 소수점 첫째 자리까지 표시 */}
          <Text style={styles.infoValue}>{temperature !== null ? `${temperature.toFixed(1)}°C` : '--°C'}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>조도</Text>
          <Text style={styles.infoValue}>{lightLevel !== null ? `${lightLevel} lux` : '-- lux'}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>LED</Text>
        </View>
        <View style={styles.sunButtonContainer}>
          {sunLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              onPress={() => handleLedLevelSelect(level)}
              style={styles.sunbutton}
            >
              <Image
                source={selectedSunLevel?.id === level.id ? level.on : level.off}
                style={styles.sunimage}
              />
              <Text style={selectedSunLevel?.id === level.id ? styles.labelSelected : styles.label}>
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.ledToggleContainer}>
          <TouchableOpacity
            style={[styles.ledButton, ledStatus ? styles.ledOn : styles.ledOff]}
            onPress={toggleLedStatus}
          >
            <Text style={styles.ledButtonText}>{ledStatus ? 'LED On' : 'LED Off'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView> // ✅ ScrollView로 닫아줍니다.
  );
};

export default IOTSettingsScreen;