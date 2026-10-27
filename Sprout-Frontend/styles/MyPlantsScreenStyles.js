import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;
const iconSize = screenWidth * 0.132;

const circleSize = screenWidth * 0.66;
const imageSize = circleSize * 0.75;
const imageTopMargin = circleSize * (55 / 310);

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBEA", // 배경 기본 색상
    alignItems: "center",
    justifyContent: "center",
  },
  plantContainer: {
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  circleContainer: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: "#E9EAC7",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    position: "absolute",
    top: imageTopMargin,
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    overflow: "hidden",
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  nonimage: {
    width: '85%',
    height: '72%',
    resizeMode: 'cover',
  },
  outerCircle: {
    width: 48,
    height: 48,
    borderRadius: 30,
    backgroundColor: '#E9EAC7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E9EAC7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#405623',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  labelContainer: {
    position: "absolute",
    top: 15,
    backgroundColor: "#405623",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 30,
  },
  label: {
    color: "#ffffffff",
    fontWeight: "bold",
  },
  chartWrapper: {
    zIndex: 0,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
    backgroundColor: "#405623",
    borderRadius: 250,
    padding: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  chartContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  sideMenuBar: {
    position: "absolute",
    backgroundColor: "#405623",
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2.3,
    paddingHorizontal: 4,
    
  },
  menuButton: {
    width: screenWidth * 0.154,
    height: screenWidth * 0.145,
    borderRadius: screenWidth * 0.06,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  menuIcon: {
    width: iconSize,
    height: iconSize,
    resizeMode: "contain",
  },
  menuIcon2: {
    width: iconSize*1.2,
    height: iconSize*1.2,
    resizeMode: "contain",
  },
  // 커스텀 Modal 스타일
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // 배경 반투명 처리
    alignItems: 'center',
    justifyContent: 'center',
  },
  // iOS Alert 스타일에 맞춰 추가된/변경된 부분
  alertBox: {
    width: '65%',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // 안드로이드
  },
  alertContent: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  alertMessage: {
    marginBottom: 5,
    fontSize: 13,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 17,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#868588',
  },
  buttonRow: {
    flexDirection: 'row',
    height: 44,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#868588',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 17,
    // fontWeight: 'medium', // fontWeight는 문자열 값만 지원합니다.
  },
  actionButtonText2: {
    fontSize: 17,
    fontWeight: '500',
  },
  leftButton: {
    borderBottomLeftRadius: 12,
  },
  rightButton: {
    borderBottomRightRadius: 12,
  },
});

