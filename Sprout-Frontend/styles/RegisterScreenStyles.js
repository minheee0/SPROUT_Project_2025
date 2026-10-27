import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // 전체 항목을 수직 중앙 정렬
    alignItems: 'center',     // 수평 중앙 정렬
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  headerText: {
    color: '#438E1A',
    fontSize: 24,
    fontWeight: 'medium',
    bottom: 35,
    marginBottom: -15,
  },
  imageButton: {
    marginVertical: 4,
    marginTop: -30,
  },
  buttonImage: {
    top: 40,
    width: 320,
    height: 110,
    resizeMode: 'contain',
  },
  infoText: {
    color: '#868585',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  registerButton: {
    width: 300,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#438E1A',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 60,
    marginBottom: 20,
    marginTop: -10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 22,
    zIndex: 1,
  },
  backIcon: {
    width: 27,
    height: 27,
    resizeMode: 'contain',
  },
  buttonText: {
    alignItems: 'center',
    color: '#fff',
    fontSize: 19,
    fontWeight: '600',
  },
  footer: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    padding: 25,
    bottom: -5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#868585',
    fontSize: 14,
    textAlign: 'center',
  },

  // 모달 관련 스타일
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modalResultText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#438E1A',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default styles;
