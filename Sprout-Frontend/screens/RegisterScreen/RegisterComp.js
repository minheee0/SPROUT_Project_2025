import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import styles from '../../styles/RegisterCompStyles';
import { Audio } from 'expo-av';

export default function RegisterComp({ navigation }) {
  const soundRef = useRef();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/pop.mp3'), // 소리 파일 경로 (예시)
        { shouldPlay: true }              // 자동 재생
      );
      soundRef.current = sound;
    }, 920); // 1초 후 실행

    return () => {
      clearTimeout(timer);
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/back_icon2.png')} style={styles.backIcon} />
      </TouchableOpacity>

      {/* 기존 로고 이미지 대신 Lottie 애니메이션 사용 */}
      <LottieView
        source={require('../../assets/Logo_5.json')}
        autoPlay
        loop={false} // 한 번만 재생 (루프 비활성화)
        style={styles.logo}
      />

      <Text style={styles.title}>가입완료!</Text>

      {/* 버튼을 누르면 Initial01.js로 이동 */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Initial01')}>
        <Image source={require('../../assets/Button01.png')} style={styles.buttonImage} />
      </TouchableOpacity>

      <Text style={styles.footer}>©sprout.company</Text>
    </View>
  );
}


