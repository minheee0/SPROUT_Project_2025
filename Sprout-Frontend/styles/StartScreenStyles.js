import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center', // 세로 중앙 배치
    alignItems: 'center', // 가로 중앙 배치
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: -50, // 로고 위치 조정
  },
  footerText: {
    position: 'absolute',
    bottom: 20,
    fontSize: 13,
    color: '#D3D3D3',
  },
});

export default styles;
