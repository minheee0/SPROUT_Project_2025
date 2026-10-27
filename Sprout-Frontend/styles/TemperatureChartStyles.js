import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  chartContainer: {
    position: "absolute",
    left: 130,
    top: 8,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#',
  },
  chartCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#ffffffff',
  },
  tempBox: {
    position: 'absolute',
    left: -93, // 원의 왼편에 위치
    top: 76, // 원과 수평 맞추기
    backgroundColor: '#344221', // 배경색
    paddingHorizontal: 7.5,
    paddingVertical: 4.5,
    borderRadius: 60,
    borderColor: '#32720F',
  },
  tempText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffffff',
  },
});

export default styles;
