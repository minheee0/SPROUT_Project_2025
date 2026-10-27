import { StyleSheet } from 'react-native';


// ✅ TemperatureChart와 동일한 스타일 적용
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 130,
    bottom: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,

  },
  chartWrapper: {
    position: "relative",
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    position: "absolute",
    fontSize: 35, // 글씨 크기 조정
    fontWeight: "bold",
    color: "#344221",
  },
  tempBox: {
    position: 'absolute',
    right: -97, // 원의 왼편에 위치
    bottom: 90, // 원과 수평 맞추기
    backgroundColor: '#E9EAC7', // 배경색
    paddingHorizontal: 7.5,
    paddingVertical: 4.5,
    borderRadius: 60,
    borderColor: '#32720F',
  },
  tempText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#344221',
  },
});

export default styles;
