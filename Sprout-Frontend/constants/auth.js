import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ 백엔드 주소 설정 (이곳에서만 관리합니다!)
const API_BASE_URL = "http://54.224.76.10:9090"; // ✅ NEW EC2 백엔드 API 주소로 통일

// ✅ Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ 요청 전에 토큰 자동 추가
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; // Axios 인스턴스를 내보냅니다.
export { API_BASE_URL }; // API 주소 자체도 필요할 수 있으니 내보냅니다.

//
// ✅ 각 API 함수 정의
//

// 로그인 요청
export const validateLogin = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    const { token } = response.data;

    if (token) {
      await AsyncStorage.setItem("authToken", token); // 🔐 토큰 저장
    }

    return response.data;
  } catch (error) {
    console.error("⚠️ 로그인 요청 실패!", error.response?.data || error.message);
    return { error: error.response?.data?.message || "서버 오류" };
  }
};

// 회원가입 요청
export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post("/auth/register", { username, email, password });
    const { token } = response.data;

    if (token) {
      await AsyncStorage.setItem("authToken", token); // 🔐 토큰 저장
    }

    return response.data;
  } catch (error) {
    console.error("⚠️ 회원가입 실패:", error.response?.data || error.message);
    return { error: error.response?.data?.message || "서버 오류" };
  }
};

// 로그아웃 요청
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem("authToken"); // 🔐 토큰 삭제
    return { message: "Logged out successfully" };
  } catch (error) {
    console.error("⚠️ 로그아웃 실패:", error.message);
    return { error: "로그아웃 실패" };
  }
};

// 유저네임 중복 체크
export const checkUsernameAvailability = async (username) => {
  try {
    const response = await api.get("/auth/check-username", {
      params: { username },
    });
    return response.data.available;
  } catch (error) {
    console.error("⚠️ 유저네임 중복 체크 오류:", error);
    return false;
  }
};

// 이메일 중복 체크
export const checkEmailAvailability = async (email) => {
  try {
    const response = await api.get("/auth/check-email", {
      params: { email },
    });
    return response.data.available;
  } catch (error) {
    console.error("⚠️ 이메일 중복 체크 오류:", error);
    return false;
  }
};

// 이메일 찾기 (유저네임 → 이메일)
export const findEmail = async (username) => {
  try {
    const response = await api.get(`/auth/find-email/${username}`);
    return response.data;
  } catch (error) {
    return "⚠️ 해당 유저명을 찾을 수 없습니다.";
  }
};

// 비밀번호 찾기 (이메일)
export const findPassword = async (email) => {
  try {
    const response = await api.post(`/auth/find-password`, { email });
    return response.data;
  } catch (error) {
    return "⚠️ 해당 이메일을 찾을 수 없습니다.";
  }
};
