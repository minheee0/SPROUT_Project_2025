import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import styles from '../../styles/TemperatureChartStyles';
import useIotStore from '../../store/iotStore';

// --- 기본 설정 ---
const YOUR_EC2_PUBLIC_IP = "54.224.76.10"; // 본인의 EC2 공인 IP로 변경
const WEBSOCKET_URL = `ws://${YOUR_EC2_PUBLIC_IP}:9090/ws`; // 웹소켓 주소 (/ws 경로 추가)

const TemperatureChart = () => {
  const { temperature } = useIotStore();
  // --- 원형 차트 계산 로직 ---
  const radius = 70;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;
  const currentTemp = temperature === null ? 0 : temperature;
  const clamped = Math.min(Math.max(currentTemp, 0), 70); 
  const strokeDashoffset = circumference * (1 - clamped / 70);

  return (
    <View style={styles.chartContainer}>
      <Svg width={200} height={200} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* 배경 원 */}
        <Circle
          stroke="#344221"
          strokeWidth={strokeWidth}
          fill="#344221"
          cx="100"
          cy="100"
          r={radius}
        />
        {/* 진행률 원 */}
        <Circle
          stroke="#ffffffff"
          strokeWidth={strokeWidth}
          fill="transparent"
          cx="100"
          cy="100"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.chartCenter}>
        {/* 온도가 null일 때는 로딩 표시('--') */}
        <Text style={styles.chartText}>
            {temperature === null ? '--' : `${temperature.toFixed(1)}`} ℃
        </Text>
      </View>

      <View style={styles.tempBox}>
        <Text style={styles.tempText}>Temperature</Text>
      </View>
    </View>
  );
};

export default TemperatureChart;