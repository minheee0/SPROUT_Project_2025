import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/LoginScreenStyles";
import { API_BASE_URL } from "../../constants/auth"; // ✅ 중앙 관리 주소 가져오기


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkTokenSession = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        checkSessionWithToken(token);
      } else {
        setIsLoading(false);
      }
    };

    checkTokenSession();
  }, []);

  // ✅ JWT 토큰으로 사용자 정보 확인
  const checkSessionWithToken = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/session`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        console.log("✅ 자동 로그인 성공:", response.data.username);
        await AsyncStorage.setItem("userSession", JSON.stringify(response.data));
        navigation.reset({
          index: 0,
          routes: [{ name: "Initial01" }],
        });
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log("🚨 자동 로그인 실패:", error.response?.data || error.message);
      setIsLoading(false);
    }
  };

  // ✅ 로그인 처리
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("⚠️ 오류", "이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email, password
      });

      if (response.status === 200 && response.data.token) {
        const { username, token } = response.data;
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("userSession", JSON.stringify({ username, email }));

        Alert.alert("✅ 로그인 성공!", `${username} 님 환영합니다!`);

        navigation.reset({
          index: 0,
          routes: [{ name: "Initial01" }],
        });
      } else {
        Alert.alert("⚠️ 로그인 실패", response.data.message || "이메일 또는 비밀번호가 잘못되었습니다.");
      }
    } catch (error) {
      console.log("🚨 로그인 오류:", error.response?.data || error.message);
      Alert.alert("⚠️ 서버 오류", "로그인 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#32720F" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled={true}>
          <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("Start")}> 
              <Image source={require('../../assets/Logo.png')} style={styles.logo} />
            </TouchableOpacity>

            <Text style={styles.headerText}>환영해요!</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="이메일 ~@.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="비밀번호"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>

            <View style={styles.textContainer}>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={[styles.sideText, { textDecorationLine: "underline" }]}>아이디/비번찾기</Text>
              </TouchableOpacity>
              <Text> & </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={[styles.middleText, { textDecorationLine: "underline" }]}>회원가입하기</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>©sprout.company</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}