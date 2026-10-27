import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Image, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/StartScreenStyles';

export default function StartScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          // 자동로그인: AppHomeScreen으로 이동
          navigation.reset({ index: 0, routes: [{ name: 'AppHomeScreen' }] });
        } else {
          // 로그인 필요: LoginScreen으로 이동
          navigation.replace('Login');
        }
      } catch (e) {
        navigation.replace('Login');
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/Logo.png')} style={styles.logo} />
      <Text style={styles.footerText}>©sprout.company</Text>
      <StatusBar style="auto" />
    </View>
  );
}