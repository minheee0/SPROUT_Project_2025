import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F7F7', // 배경색을 좀 더 밝은 색으로 변경
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40, // 헤더와 센서 데이터 간격을 좀 더 좁힘
  },
  backButton: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700', // 헤더 텍스트 크기와 두께를 강화
    color: '#333',
  },
  sensorDataContainer: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5, // 그림자 효과를 좀 더 자연스럽게
    marginBottom: 30,
  },
  wifiContainer: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5, // 그림자 효과를 좀 더 자연스럽게
    marginBottom: 30,
  },
  sensorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#32720F',
    marginBottom: 25,
  },
  wifiTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#32720F',
    marginBottom: 25,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#32720F',
  },
  sunButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  sunbutton: {
    alignItems: 'center',
  },
  sunimage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  ledToggleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  ledButton: {
    height: 50,
    width: 200,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  ledOn: {
    backgroundColor: '#32720F',
  },
  ledOff: {
    backgroundColor: '#ccc',
  },
  ledButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  /*   logo: {
      position: 'absolute',
      width: 100,
      height: 70,
      bottom: 40,
      alignSelf: 'center',
    }, */
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: 330,
    height: 620,
    backgroundColor: 'white',
    borderRadius: 30,
    overflow: 'hidden',
  },
  modalTitle: { fontSize: 15, marginBottom: 16 },
  closeButton: { marginTop: 30, padding: 12, backgroundColor: '#58A72E', borderRadius: 30 },
  closeButtonText: { color: '#ffff', fontSize: 18, fontWeight: 'bold' },
  wifiButton: {
    marginTop: 10,
    padding: 15,
    width: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',

  },

  // 모달 인디케이터
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },

  // 모달 2번 입력력
  label: {
    alignSelf: 'flex-start',
    marginBottom: 4,
    fontSize: 16,
    color: '#333',

  },
  inputContainer: {
    marginHorizontal: 20,   // 좌우 바깥 여백
    marginVertical: 10,
    borderRadius: 30,
    backgroundColor: '#EBEAEA', // 
    padding: 15, // 내부 여백 넣으면 보기 좋음

  },

  input: {
    width: 250,
    height: 44,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },


  // 모달 2번 입력


  indicatorDot: {
    width: 55,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#D8D6D6',
    marginHorizontal: 8,
  },

  activeIndicatorDot: {
    backgroundColor: '#77CB4A',
  },
  wifiButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pagerView: {
    flex: 1,
  },

  page: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // 모달 3번
  instructionText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 29,
    color: '#333', // 원하시는 색상
    paddingHorizontal: 20, // 좌우 여백으로 텍스트가 짤리지 않게
    marginTop: 10,
  },

});

export default styles;