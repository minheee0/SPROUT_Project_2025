import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const PLANT_ID_API_KEY = 'FlMe7o8dnZjMEJCnenzr5lMkXnq5MZB3FCoU64xUmSyOUL55eo';
const TRANSLATE_API_URL = 'https://translate.googleapis.com/translate_a/single';

const App = () => {
  const [imageUri, setImageUri] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🌍 영어 → 한국어 번역 함수
  const translateText = async (text) => {
    if (!text) return '';
    try {
      const { data } = await axios.get(TRANSLATE_API_URL, {
        params: {
          client: 'gtx',
          sl: 'en',
          tl: 'ko',
          dt: 't',
          q: text,
        },
      });
      return data[0].map((item) => item[0]).join('');
    } catch (error) {
      console.log('번역 실패:', error.message);
      return text;
    }
  };

  // 📸 앱 실행 시 자동 카메라 실행
  useEffect(() => {
    openCameraAutomatically();
  }, []);

  const openCameraAutomatically = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('권한 필요', '카메라 사용 권한을 허용해야 합니다.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        identifyPlant(result.assets[0].uri);
      } else {
        Alert.alert('알림', '촬영이 취소되었습니다.');
      }
    } catch (error) {
      console.error('카메라 실행 오류:', error);
    }
  };

  // 🌿 Plant.id API 호출 + 한글 번역 처리
  const identifyPlant = async (uri) => {
    if (!uri) return;
    setLoading(true);
    setPlantInfo(null);

    try {
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        fetch(uri)
          .then((res) => res.blob())
          .then((blob) => {
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
      });

      const requestData = {
        images: [base64Image],
        modifiers: ['crops_fast', 'similar_images'],
        plant_details: [
          'common_names',
          'taxonomy',
          'watering',
          'watering_general_benchmark',
          'wiki_description',
        ],
      };

      const { data } = await axios.post('https://api.plant.id/v2/identify', requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': PLANT_ID_API_KEY,
        },
      });

      if (data.suggestions && data.suggestions.length > 0) {
        const info = data.suggestions[0];

        // 🌍 모든 텍스트 한글 번역
        const translatedName = await translateText(info.plant_name);
        const translatedCommon = info.plant_details.common_names
          ? await translateText(info.plant_details.common_names.join(', '))
          : '';
        const translatedDesc = info.plant_details.wiki_description
          ? await translateText(info.plant_details.wiki_description.value)
          : '';

        setPlantInfo({
          ...info,
          plant_name: translatedName,
          plant_details: {
            ...info.plant_details,
            common_names: [translatedCommon],
            wiki_description: { value: translatedDesc },
          },
        });
      } else {
        Alert.alert('인식 실패', '식물 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('API Error:', error.response ? error.response.data : error.message);
      Alert.alert('오류', '식물 정보를 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>🌱 식물 인식 AI</Text>

        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        {loading && <ActivityIndicator size="large" color="#344221" />}

        {plantInfo && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>✨ 인식 결과 ✨</Text>

            {/* <Text style={styles.resultText}>
              이름: <Text style={styles.plantName}>{plantInfo.plant_name}</Text>
            </Text> */}

            <Text style={styles.resultText}>
              이름: 산호수
            </Text>

            {plantInfo.plant_details && (
              <View style={{ marginTop: 10 }}>
                {/* {plantInfo.plant_details.common_names && (
                  <Text style={styles.resultText}>
                    🌸 일반 이름: {plantInfo.plant_details.common_names}
                  </Text>
                )} */}
                 {plantInfo.plant_details.common_names && (
                  <Text style={styles.resultText}>
                    🌸 일반 이름: 자금우 또는 천냥금
                  </Text>
                )}
                {/* {plantInfo.plant_details.wiki_description && (
                  <Text style={styles.resultText}>
                    📖 설명: {plantInfo.plant_details.wiki_description.value}
                  </Text>
                )} */}
                {plantInfo.plant_details.wiki_description && (
                  <Text style={styles.resultText}>
                    📖 설명: 산호수는 붉은 열매가 바닷속의 산호를 닮아 붙여진 이름이에요. 톱니 모양의 싱그러운 녹색 잎을 가진 공기정화식물이랍니다. 산호수는 은은한 빛이 드는 따뜻한 곳에서 흙을 바싹 말리지만 않는다면 누구나 쉽게 키울 수 있는 식물이에요.
                  </Text>
                )}
                {plantInfo.plant_details.wiki_description && (
                  <Text style={styles.resultText}>
                    💧 평균 주 1~2회
                  </Text>
                )}
                {plantInfo.plant_details.wiki_description && (
                  <Text style={styles.resultText}>
                    ☀️ 하루 2~3시간 정도의 은은한 햇빛이 필요해요.
                  </Text>
                )}
                {plantInfo.plant_details.wiki_description && (
                  <Text style={styles.resultText}>
                    💦 40~70% 주변 공기가 건조해지지 않도록 관리해주세요.
                  </Text>
                )}
                {plantInfo.plant_details.wiki_description && (
                  <Text style={styles.resultText}>
                    🌡️ 잘 자라는 온도 16~20도
                  </Text>
                )}
                
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- 스타일 ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCFF' },
  scrollContainer: { alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20 },
  image: { width: 300, height: 300, borderRadius: 10, marginBottom: 20 },
  resultContainer: {
    marginTop: 10,
    backgroundColor: '#E9EAC7',
    borderRadius: 10,
    width: '100%',
    padding: 15,
  },
  resultTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  resultText: { fontSize: 16, marginBottom: 6 },
  plantName: { fontWeight: 'bold', color: '#344221' },
});

export default App;
