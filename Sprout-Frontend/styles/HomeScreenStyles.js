import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',  
    height: '100%', 
  },
  imageStyle: {
    transform: [
      { scale: 1.02 },
      { translateX: 3 }, // 이미지를 X축으로 10만큼 이동
      { translateY: 2 } // 이미지를 Y축으로 -20만큼 이동
    ],
  },

  // 임시 베타 테스트 버튼
  betaButtonContainer: {
    paddingHorizontal: 30, // 좌우 여백
    paddingVertical: 10,   // 상하 여백
    borderWidth: 4,        // 테두리 두께
    borderColor: 'white',  // 테두리 색상
    borderRadius: 30,       // 테두리 둥글기
    backgroundColor: '#438E1A',
  },
  betaButtonText: {
    color: 'white',        // 글자 색상
    fontWeight: 'bold',    // 글자 굵기
    fontSize: 22,          // 글자 크기
  },
  ///////////////////////
  
  button: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    
  },
  buttonImage: {
    width: 370,    
    height: 210,   
    resizeMode: 'contain',
  },
  textContainer: {
    position: 'absolute',
    bottom: 93,
    flexDirection: 'column',
    alignItems: 'center',    
    justifyContent: 'center', 
  },
  textRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  sideText: {
    color: '#405623',
    fontSize: 16,
  },
  middleText: {
    marginLeft: 5,
    color: '#405623',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: '#405623',
    fontSize: 14,
  },
});

export default styles;
