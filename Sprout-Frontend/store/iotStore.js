import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- 기본 설정 ---
const YOUR_EC2_PUBLIC_IP = "54.224.76.10"; // 본인의 EC2 공인 IP
const BASE_WEBSOCKET_URL = `ws://${YOUR_EC2_PUBLIC_IP}:9090/ws`;

const useIotStore = create((set, get) => ({
  // --- 상태 변수들 ---
  temperature: null,
  soilMoisture: null,
  lightLevel: null,
  isConnected: false,
  ws: null,

  // --- 웹소켓 연결 함수 ---
  connect: async () => {
    // 이미 연결되어 있거나 연결 중이면 중복 실행 방지
    if (get().ws) return;

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.log('[Zustand] 토큰이 없어 웹소켓에 연결할 수 없습니다.');
        return;
      }

      // URL에 토큰을 쿼리 파라미터로 추가
      const WEBSOCKET_URL_WITH_TOKEN = `${BASE_WEBSOCKET_URL}?token=${token}`;
      console.log('🔄 [Zustand] 웹소켓 연결 시도...');

      const ws = new WebSocket(WEBSOCKET_URL_WITH_TOKEN);

      ws.onopen = () => {
        console.log("✅ [Zustand] 웹소켓 연결 성공");
        set({ isConnected: true, ws: ws });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📊 [Zustand] 파싱된 데이터:', data);
          
          // 상태 업데이트: 각 값이 null이나 undefined가 아닐 경우에만 업데이트
          if (data.temperature !== undefined && data.temperature !== null) {
            set({ temperature: data.temperature });
          }
          if (data.soilMoisture !== undefined && data.soilMoisture !== null) {
            set({ soilMoisture: data.soilMoisture });
          }
          if (data.lightLevel !== undefined && data.lightLevel !== null) {
            set({ lightLevel: data.lightLevel });
          }

        } catch (e) {
          console.error("❌ [Zustand] 데이터 처리 오류:", e);
        }
      };

      ws.onerror = (e) => {
        console.error("❌ [Zustand] 웹소켓 에러", e.message);
      };

      ws.onclose = () => {
        console.log("❌ [Zustand] 웹소켓 연결 종료");
        set({ isConnected: false, ws: null });

        // 3초 후에 재연결을 시도한다.
        setTimeout(() => {
          console.log("🔄 [Zustand] 웹소켓 재연결 시도...");
          get().connect();
        }, 3000);
      };

    } catch (error) {
      console.error("❌ [Zustand] 토큰 처리 중 오류 발생:", error);
    }
  },

  // --- 웹소켓 연결 해제 함수 ---
  disconnect: () => {
    const ws = get().ws;
    if (ws) {
      ws.close();
    }
  },
}));

// 앱 어디에서든 웹소켓 연결을 시작할 수 있도록 connect 함수를 export 합니다.
export const { connect } = useIotStore.getState();

export default useIotStore;