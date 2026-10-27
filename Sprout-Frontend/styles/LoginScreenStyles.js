import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
 background: {
    flex: 1,
    justifyContent: 'center', // 세로 중앙 정렬
    alignItems: 'center', // 가로 중앙 정렬

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
  container: {
    flex: 1,
    
    justifyContent: 'center', // 세로 중앙 정렬
    alignItems: 'center',     // 가로 중앙 정렬
    paddingHorizontal: 20,    // 양쪽 여백
  },
  logo: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
    marginBottom: 20,
    //marginTop: -32,
   //marginBottom: 35, // 로고와 입력칸 사이 간격
  },
  headerText: {

    color: '#405623',

    fontSize: 24,
    fontWeight: 'medium',
    bottom: 35,
    marginBottom: 5, // RegisterScreen과 똑같이 맞춤.
  },
  // 인풋 //
  inputContainer: {
    position: 'relative',
     width: 275,
     height: 65,
    marginBottom: 23,
    borderRadius: 60, // 둥근 모서리
    backgroundColor: '#fff', // 배경색 추가 (필수)
    elevation: 6, // ✅ 안드로이드 그림자 효과
    shadowColor: '#000', // ✅ iOS 그림자 색상
    shadowOffset: { width: 0, height: 4 }, // ✅ iOS 그림자 방향
    shadowOpacity: 0.2, // ✅ iOS 그림자 투명도
    shadowRadius: 6, // ✅ iOS 그림자 퍼짐 정도
  },
  placeholder: {
    position: 'absolute',
    left: 28,
    top: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ccc', // 원하는 색상
  },
  input: {
    width: 235,
    height: 65,
    left: 20,
    borderColor: '#ccc',
    borderRadius: 60,
    borderWidth: 0,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20, // 입력칸 간격
    
  },
  // 인풋 //

  textContainer: {
    alignSelf: 'center',  // ✅ 부모 기준으로 가운데 정렬
    marginTop: 20,        // ✅ 로그인 버튼 아래 여백 조절
    flexDirection: 'column',
    justifyContent: 'center',  
},
textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',  // ✅ 내부 요소 가운데 정렬
    
},
sideText: {
    color: '#12491E',
    fontWeight: 'bold',
  
},
  middleText: {
    color: '#12491E',
    fontWeight: 'bold',
  },
  button: {
    width: 167,
    height: 64,
    backgroundColor: '#405623',

    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    elevation: 6, // ✅ 안드로이드 그림자 효과
    shadowColor: '#000', // ✅ iOS 그림자 색상
    shadowOffset: { width: 0, height: 4 }, // ✅ iOS 그림자 방향
    shadowOpacity: 0.4, // ✅ iOS 그림자 투명도
    shadowRadius: 2, // ✅ iOS 그림자 퍼짐 정도
  },
  buttonText: {
    color: '#fff',
    fontSize: 17.8,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red', // 빨간색 텍스트
    fontSize: 16, // 텍스트 크기
    bottom: 20, // 위쪽 여백
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: '#ccc',
    fontSize: 14,
  }
});

export default styles;
