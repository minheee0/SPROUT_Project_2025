import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import styles from '../../styles/MyPageStyles';

const API_BASE_URL = "http://54.224.76.10:9090";

const MyPage = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotificationOn, setIsNotificationOn] = useState(false);
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState("");


  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.get(`${API_BASE_URL}/auth/session`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setUserData(response.data);
        await AsyncStorage.setItem("userSession", JSON.stringify(response.data));
        setIsLoading(false);
      } else {
        handleSessionExpired();
      }
    } catch (error) {
      handleSessionExpired();
    }
  };

  const handleSessionExpired = async () => {
    await AsyncStorage.removeItem("userSession");
    await AsyncStorage.removeItem("authToken");
    Alert.alert("세션 만료", "로그인이 필요합니다.");
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    setIsLoading(false);
  };

  const handleUpdateUserInfo = async (field, value) => {
    if (!value.trim()) {
      Alert.alert("⚠️ 오류", `${field}을(를) 입력해주세요.`);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.put(
        `${API_BASE_URL}/auth/update-user`,
        { [field]: value },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("✅ 수정 완료!", `${field}이(가) 변경되었습니다.`);
        fetchUserData();
      } else {
        Alert.alert("⚠️ 수정 실패", response.data.message || "변경할 수 없습니다.");
      }
    } catch (error) {
      console.log("🚨 수정 오류:", error.response?.data || error);
      Alert.alert("⚠️ 서버 오류", error.response?.data?.message || "수정 중 오류가 발생했습니다.");
    }
  };

  const handleLogout = async () => {
    try {
      console.log("🔴 로그아웃 눌림");
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userSession");
      Alert.alert("로그아웃 완료", "다시 로그인해주세요.");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert("⚠️ 로그아웃 실패", "서버 오류가 발생했습니다.");
    }
  };

  const handleDeleteAccount = async () => {
    Alert.prompt(
      "⚠️ 계정 삭제",
      "비밀번호를 입력해주세요:",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          onPress: async (inputPassword) => {
            if (!inputPassword.trim()) {
              Alert.alert("⚠️ 오류", "비밀번호를 입력해주세요.");
              return;
            }

            try {
              const token = await AsyncStorage.getItem("authToken");

              const response = await axios.delete(`${API_BASE_URL}/auth/delete-account`, {
                data: { password: inputPassword },
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });

              if (response.status === 200) {
                Alert.alert("✅ 계정 삭제 완료", "계정이 삭제되었습니다.");
                await AsyncStorage.removeItem("authToken");
                await AsyncStorage.removeItem("userSession");
                navigation.reset({ index: 0, routes: [{ name: "Login" }] });
              }
            } catch (error) {
              console.log("🚨 계정 삭제 오류:", error.response?.data || error);
              Alert.alert("⚠️ 오류", error.response?.data?.message || "계정 삭제 중 오류가 발생했습니다.");
            }
          },
        },
      ],
      "secure-text"
    );
  };

  const handleBackPress = () => {
    navigation.navigate("AppHomeScreen");
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#32720F" />
      </View>
    );
  }

  return (
    // ✅ 이 부분이 수정되었습니다.
    <ScrollView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Image
            source={require('../../assets/back_icon2.png')}
            style={styles.backButton}
          />
        </TouchableOpacity>

        <Text style={styles.headerText}>설정</Text>
      </View>

      {/* 로그인된 사용자 username 표시 (둥근 흰색 박스) */}
      <View style={styles.welcomeBox}>
        <Image source={require('../../assets/Logo.png')} style={styles.welcomeCircle} />
        <Text style={styles.welcomeText}>{userData?.username}님 환영합니다!</Text>
      </View>

      {/* 사용자 정보 수정 */}
      <View style={styles.infoBox}>
        <Text style={styles.infoHeader}>정보 수정</Text>

        {/* 유저이름 */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>이름</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} value={userData?.username}
              onChangeText={(text) => setUserData({ ...userData, username: text })} />
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleUpdateUserInfo("username", userData.username)}
            >
              <Text style={styles.buttonText}>수정</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 이메일 */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>이메일</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} value={userData?.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })} />
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleUpdateUserInfo("email", userData.email)}
            >
              <Text style={styles.buttonText}>수정</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 비밀번호 */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>비밀번호</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newPassword}
              secureTextEntry
              placeholder="새 비밀번호 입력"
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleUpdateUserInfo("password", newPassword)}
            >
              <Text style={styles.buttonText}>수정</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 로그아웃 & 탈퇴 */}
      <View style={styles.logoutDeleteContainer}>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutDeleteText}>로그아웃</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>|</Text>
        <TouchableOpacity onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>탈퇴하기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default MyPage;