import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Vibration,
  Animated,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import styles from '../../styles/RegisterMakeStyles';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL= "http://54.224.76.10:9090"; // // ✅ NEW EC2 백엔드 API 주소 설정


export default function RegisterMake({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [messages, setMessages] = useState({ username: '', email: '', password: '' });

  const [shakeUsername] = useState(new Animated.Value(0));
  const [shakeEmail] = useState(new Animated.Value(0));
  const [shakePassword] = useState(new Animated.Value(0));

  const [isUsernameChecked, setIsUsernameChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const startShakeAnimation = (shakeAnimation) => {
    Vibration.vibrate(500);
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handlePasswordConfirmation = () => {
    if (password !== passwordConfirmation) {
      setMessages((prev) => ({
        ...prev,
        password: "❌ 비밀번호가 일치하지 않습니다.",
      }));
      startShakeAnimation(shakePassword);
      setIsPasswordChecked(false);
    } else {
      setMessages((prev) => ({
        ...prev,
        password: "✅ 비밀번호가 일치합니다.",
      }));
      setIsPasswordChecked(true);
    }
  };

  // ✅ 중복 체크 API 요청 (세션 유지)
  const handleCheckAvailability = async (type, value, shakeAnimation) => {
    console.log(`🔍 중복 확인 요청 - type: ${type}, value: '${value}'`);

    if (!value.trim()) {
      setMessages((prev) => ({
        ...prev,
        [type]: `⚠️ ${type === "username" ? "유저 이름" : "이메일"}을 입력해주세요.`,
      }));
      startShakeAnimation(shakeAnimation);
      type === "username" ? setIsUsernameChecked(false) : setIsEmailChecked(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/check-${type}`, {
        params: { [type]: value },
        withCredentials: true, // ✅ 세션 유지
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
      });

      console.log(`🟢 서버 응답 데이터:`, response.data);

      if (response.data?.available !== undefined) {
        if (response.data.available) {
          setMessages((prev) => ({
            ...prev,
            [type]: `✅ 사용 가능한 ${type === "username" ? "유저 이름" : "이메일"}입니다.`,
          }));
          type === "username" ? setIsUsernameChecked(true) : setIsEmailChecked(true);
        } else {
          setMessages((prev) => ({
            ...prev,
            [type]: `❌ 이미 있는 ${type === "username" ? "유저 이름" : "이메일"}입니다.`,
          }));
          startShakeAnimation(shakeAnimation);
          type === "username" ? setIsUsernameChecked(false) : setIsEmailChecked(false);
        }
      } else {
        console.error("⚠️ 서버 응답 형식 오류:", response.data);
        setMessages((prev) => ({ ...prev, [type]: "⚠️ 서버 응답 오류 발생" }));
      }
    } catch (error) {
      console.error(`⚠️ ${type} 중복 확인 오류:`, error.response?.data || error.message);
      setMessages((prev) => ({ ...prev, [type]: "⚠️ 서버 오류 발생" }));
    }
  };

  // ✅ 회원가입 API 요청 (세션 유지)
  const handleRegister = async () => {
    console.log("🟢 회원가입 요청 데이터:", { username, email, password });

    if (!username.trim() || !email.trim() || !password.trim() || !passwordConfirmation.trim()) {
        Alert.alert("⚠️ 모든 정보를 채워주세요.");
        return;
    }

    if (!isUsernameChecked || !isEmailChecked) {
        Alert.alert("⚠️ 유저이름과 이메일 중복 확인을 완료하세요.");
        return;
    }

    if (password !== passwordConfirmation) {
        Alert.alert("⚠️ 비밀번호가 일치하지 않습니다.");
        return;
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, {
            username,
            email,
            password,
        }, {
          withCredentials: true, // ✅ 세션 쿠키 유지
            headers: { "Content-Type": "application/json" },
        });

        console.log("🟢 서버 응답 상태 코드:", response.status);
        console.log("🟢 서버 응답 데이터:", response.data);

        if (response.status === 200 && response.data.message === "회원가입 성공") {
          await AsyncStorage.setItem('authToken', response.data.token);  
          
          Alert.alert("✅ 회원가입 완료", "회원가입이 성공적으로 완료되었습니다!");
            navigation.reset({
                index: 0,
                routes: [{ name: "Home", params: { username } }],
            });
        } else {
            Alert.alert("❌ 회원가입 실패", response.data.message || "알 수 없는 오류 발생");
        }
    } catch (error) {
        console.error("⚠️ 서버 오류:", error.response?.data || error.message);
        Alert.alert("⚠️ 서버 오류 발생", error.response?.data?.message || "다시 시도해주세요.");
    }
};



  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -1}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingVertical: 80 }]}
        scrollEnabled={isKeyboardVisible}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: -30, bottom: -30, left: -30, right: -30 }}
        >
          <Image source={require('../../assets/back_icon2.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Image source={require('../../assets/Logo.png')} style={styles.logo} />
        <Text style={styles.headerText}>환영해요!</Text>

        <View style={styles.inputContainer}>

          <TextInput
            style={styles.nameInput}
            placeholder="유저 이름"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setIsUsernameChecked(false);
            }}
          />

          <TouchableOpacity
            style={styles.checkButtonInside}
            onPress={() => handleCheckAvailability('username', username, shakeUsername)}
          >
            <Text style={styles.checkButtonText}>check</Text>
          </TouchableOpacity>
        </View>

        <Animated.Text style={[styles.messageText, { transform: [{ translateX: shakeUsername }] }]}>

          {messages.username}
        </Animated.Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.emailInput}
            placeholder="이메일"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setIsEmailChecked(false);
            }}
          />
          <TouchableOpacity
            style={styles.checkButtonInside}
            onPress={() => handleCheckAvailability('email', email, shakeEmail)}
          >
            <Text style={styles.checkButtonText}>check</Text>
          </TouchableOpacity>
        </View>
        <Animated.Text style={[styles.messageText, { transform: [{ translateX: shakeEmail }] }]}>
          {messages.email}
        </Animated.Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="비밀번호"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setIsPasswordChecked(false);
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.passwordConfirmationInput}
            placeholder="비밀번호 확인"
            secureTextEntry
            value={passwordConfirmation}
            onChangeText={(text) => {
              setPasswordConfirmation(text);
              setIsPasswordChecked(false);
            }}
          />

          <TouchableOpacity style={styles.checkButtonInside} onPress={handlePasswordConfirmation}>
            <Text style={styles.checkButtonText}>check</Text>
          </TouchableOpacity>
        </View>

        <Animated.Text style={[styles.messageText, { transform: [{ translateX: shakePassword }] }]}>
          {messages.password}
        </Animated.Text>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>회원 가입!</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>©sprout.company</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

