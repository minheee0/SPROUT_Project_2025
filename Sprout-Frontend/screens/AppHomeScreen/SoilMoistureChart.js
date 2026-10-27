import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import styles from '../../styles/SoilMoistureChartStyles';
import useIotStore from '../../store/iotStore';

// --- 기본 설정 ---
const YOUR_EC2_PUBLIC_IP = "54.224.76.10"; // 본인의 EC2 공인 IP로 변경
const WEBSOCKET_URL = `ws://${YOUR_EC2_PUBLIC_IP}:9090/ws`; // 웹소켓 주소 (/ws 경로 추가)

const SoilMoistureChart = () => {
  const { soilMoisture } = useIotStore();
  // ✅ [수정] 서버에서 받은 값(백분율)을 그대로 사용합니다.
  const moisture = soilMoisture === null ? null : Math.round(soilMoisture);

  // --- 원형 차트 계산 로직 ---
  const radius = 70;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;
  const currentMoisture = moisture === null ? 0 : moisture;
  const progress = (currentMoisture / 100) * circumference;

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <Svg width={200} height={200} style={{ transform: [{ rotate: '-90deg' }] }}>
          {/* 배경 원 */}
          <Circle
            stroke="#E9EAC7"
            strokeWidth={strokeWidth}
            fill="#E9EAC7"
            cx="100"
            cy="100"
            r={radius}
          />
          {/* 진행 원 */}
          <Circle
            cx="100" cy="100" r={radius}
            stroke="#344221"
            strokeWidth={strokeWidth}
            fill="transparent" // 배경을 투명하게 하여 겹치지 않게 함
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
          />
        </Svg>
        {/* 가운데에 습도 값 표시 */}
        <Text style={styles.label}>
          {moisture === null ? '--' : `${moisture}`} %
        </Text>
      </View>

      <View style={styles.tempBox}>
        <Text style={styles.tempText}>Soil moisture</Text>
      </View>
    </View>
  );
};

export default SoilMoistureChart;