import { StyleSheet } from 'react-native';


// 스타일 동일 + 추가 스타일 유지
const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#FBFBEA'
  },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 21, backgroundColor: '#405623', borderRadius: 60, margin: 77,
    marginBottom: 20, width: '90%', alignSelf: 'center',
    // ✅ rgba를 사용해 배경색에 80%의 불투명도(20% 투명)를 적용합니다.
    backgroundColor: 'rgba(90, 116, 68, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 30,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    // 그림자 효과
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 8,
  },

  // 내 식물 관리 
  titleContainer: {
    marginLeft: 13,

  },

  subtitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '100',
    marginTop: 5,
    opacity: 0.9,
  },

  title: {
    fontSize: 23, 
    fontWeight: 'bold', 
    color: 'white'
  },

  card: {
    
    backgroundColor: 'white', 
    borderRadius: 50, 
    padding: 20,
    marginVertical: 12, 
    width: '97%', 
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },

  infoContainer: {
    alignItems: 'center',
    flexDirection: 'row', 
    alignItems: 'center'
  },

  imagePlaceholder: {
    width: 70, 
    height: 70, 
    borderRadius: 100, 
    backgroundColor: '#CCC',
    marginRight: 20, 
    resizeMode: 'cover'
  },

  name: {
    fontSize: 16, 
    fontWeight: 'bold'
  },
  
  iconsContainer: {
    flexDirection: 'row', 
    marginLeft: 'auto'
  },

  icon: {
    width: 30, 
    height: 30, 
    resizeMode: 'contain', 
    marginLeft: 10
  },

  // 등록: 모달을 감싸는 배경 스타일
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // 투명도를 낮춰 뒷 배경이 은은하게 보이도록 조정 굿굿!!
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
  },

  modalContent: {
    width: 350, // 너비를 적당히 조절
    marginTop: '20%', // 모달의 위쪽 여백 추가
    padding: 20, // 패딩을 넉넉하게 설정
    // 앱의 메인 색상인 녹색 계열의 연한 톤으로 변경
    backgroundColor: '#ffffff',
    borderRadius: 40, // 둥근 모서리로 부드러운 느낌
    // ✅ 모서리에만 깊이감을 주는 세련된 그림자 스타일 (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 }, // 수평/수직으로 살짝 이동
    shadowOpacity: 0.15, // 투명도를 낮춰 은은하게
    shadowRadius: 5, // 번짐을 줄여 날카로운 느낌으로
    // ✅ 안드로이드용 그림자 스타일
    elevation: 8,
  },

  modalTitle: {
    fontSize: 70, fontWeight: 'bold', marginBottom: 10
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },

  closeButton: {
    position: 'absolute',
    top: 20,
    left: 310,
    zIndex: 1, // 다른 요소 위에 보이도록 
  },

  modalButtons: {
    // 버튼이 하나만 남으므로 중앙에 정렬
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },

  // 등록: 추가 버튼 스타일
  addButton: {
    width: '100%', // 너비를 적당히 설정
    backgroundColor: 'rgba(90, 116, 68, 0.8)',
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 8,

    padding: 20,
    borderRadius: 60,
    alignItems: 'center',
    marginLeft: 0,
    marginTop: -3,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '200'
  },

  imageTouchable: {
    width: '100%', 
    alignItems: 'center', 
    marginBottom: 20
  },

  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 80,
    resizeMode: 'cover',
    alignSelf: 'center',

    // ✅ 그림자 효과 (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,

    // ✅ 그림자 효과 (Android)
    elevation: 8,
},

  imageButton: {
    backgroundColor: 'rgba(90, 116, 68, 0.8)',

    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 60,

    // 그림자 효과
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 8,
    width: 110, // 너비를 고정된 값으로 설정
    height: 110, // 높이를 너비와 동일하게 설정
    borderRadius: 75, // 너비/높이의 절반인 75로 설정하여 원형으로 만듦
    alignItems: 'center',
    justifyContent: 'center', // 텍스트를 수직 중앙으로 정렬하기 위해 추가
    alignSelf: 'center', // 부모 컨테이너 내에서 중앙 정렬
  },

  imageButtonText: {
    marginTop: 6, 
    fontSize: 16, 
    color: 'white', 
    fontWeight: '200'
  },
  
  label: {
    fontSize: 16, 
    fontWeight: '500',
    marginBottom: 5,
    alignSelf: 'flex-start', 
    marginLeft: 5
  },
  row: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    
  },
  iconSelectable: {
    width: 35,
     height: 35, 
     marginBottom: 18, 
     resizeMode: 'contain'
  },
  iotContainer: {
    alignItems: 'center', marginVertical: 10
  },
  iotIcon: {
    width: 60, height: 60, resizeMode: 'contain'
  },
  iotText: {
    marginTop: 5, fontSize: 16, fontWeight: 'bold', color: '#333'
  },
  detailImage: {
    width: 160, height: 160, borderRadius: 100, marginBottom: 10
  },
  detailName: {
    fontSize: 20, fontWeight: 'bold', marginTop: 10
  },
  detailDesc: {
    fontSize: 14, color: '#999', marginBottom: 20
  },
  detailText: {
    fontSize: 16, marginBottom: 10
  },
  badge: {
    backgroundColor: '#E9EAC7', paddingHorizontal: 12,
    paddingVertical: 5, borderRadius: 15, color: 'white', marginBottom: 10
  },
  selectButton: {
    // ✅ 흰색 배경
    backgroundColor: '#FFFFFF',
    // ✅ 둥근 모서리
    borderRadius: 15,
    // ✅ 그림자 효과 (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // ✅ 그림자 효과 (Android)
    elevation: 3,
    // ✅ 텍스트와 테두리 사이의 패딩
    paddingHorizontal: 15,
    paddingVertical: 12,
    // 기존 테두리는 제거
    borderWidth: 0,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20, // 인풋 스타일과 간격 통일
  },
  selectButtonText: {
    color: '#white', fontWeight: '300'
  },
  dayScroll: {
    marginBottom: 5
  },
  dayButton: {
    backgroundColor: '#68876A', 
    borderRadius: 15, 
    padding: 8, 
    marginRight: 5,
  },
  
  dayText: {
    color: 'white', 
    fontWeight: '200'
  },

  // 달력누를 때 스타일
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },

  //등록: 모달 스타일
  modalTitle: {
    color: '344221',
    fontSize: 23,
    fontWeight: '500',
    marginBottom: 14,
  },

  //식물 이름 칸
  input: {
    height: 40,
    // ✅ 흰색 배경
    backgroundColor: '#FFFFFF',
    // ✅ 둥근 모서리 (borderRadius)
    borderRadius: 15,
    // ✅ 그림자 효과 (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // ✅ 그림자 효과 (Android)
    elevation: 3,
    // ✅ 텍스트와 테두리 사이의 패딩
    paddingHorizontal: 15,
    paddingVertical: 10,
    // 기존 테두리는 제거
    borderWidth: 0,
    marginTop: 5,
    marginBottom: 20,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  buttonWrapper: {
    marginLeft: 10,
  },

  calendarContainer: {
    backgroundColor: '#ffffff',     // 다른 카드들과 동일하게 흰색 배경
    borderRadius: 50,               // ✅ 앱의 다른 요소처럼 매우 둥글게
    borderTopRightRadius: 0,   // 오른쪽 위 모서리를 더 둥글게
    borderTopLeftRadius: 0, // 왼쪽 아래 모서리를 더 둥글게
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30, // 오른쪽 아래 모서리는 각지게
    marginHorizontal: 21,
    paddingVertical: 18,            // ✅ 상하 여백을 paddingVertical로 조정
    paddingHorizontal: 10,           // ✅ 좌우 여백을 paddingHorizontal로 조정
    marginBottom: 10,               // 아래 식물 리스트와의 간격
    marginTop: -24,
    // 그림자 효과 (Android)
    elevation: 3,

    // 그림자 효과 (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },

  todayContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,         // 네모 모양을 더 부드럽게 만들기 위해 20 -> 8로 수정
    backgroundColor: '#EEF3EB', // 기존 '#68876A'보다 연한 색상으로 수정
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayText: {
    fontSize: 16,
    fontWeight: 'bold',     // 오늘 날짜는 굵게
    color: '#344221',      // 앱의 메인 녹색 컬러로 강조
  },
  plantListContainer: {
    flex: 1,
    width: '100%',
    // paddingHorizontal: ,           // 또는 '100%'로 해도 됨
    alignSelf: 'center',    // 중앙 정렬로 좌우 여백 동일하게
    paddingRight: 15,
    paddingLeft: 15,
    paddingBottom: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyListText: {
    // ✅ 폰트 크기를 키워 더 잘 보이도록 수정
    fontSize: 17,
    textAlign: 'center',
    marginTop: 70,
    color: '#888',
    fontWeight: '300',
  },
  optionsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },

  optionsMenu: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  optionItem: {
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },

  // DiaryScreenStyles.js에 추가할 스타일
  dateInfoContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    margin: 10,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  dateInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },

  dateInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  plantInfoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
  },

  plantCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  plantCardImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },

  plantCardImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  plantCardInfo: {
    flex: 1,
  },

  plantCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },

  plantCardDetail: {
    fontSize: 14,
    color: '#666',
  },

  observationSection: {
    marginBottom: 15,
  },

  observationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },

  observationText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#405623',
  },

  plantCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#405623',
  },

  editButtonText: {
    marginLeft: 5,
    color: '#405623',
    fontWeight: '500',
  },

  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe8e8',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },

  deleteButtonText: {
    marginLeft: 5,
    color: '#ffffffff',
    fontWeight: '500',
  },

  noDataCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },

  noDataText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },

  noDataSubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },

  inputWithLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  inputLabel: {
    width: 100,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  inputUnit: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },

  // ✅ 아래 calendarInfoText 스타일 추가
calendarInfoText: {
  fontSize: 13,
  color: '#aaa',        // 연한 회색
  textAlign: 'right',   // 텍스트를 중앙 정렬
  marginRight: 15,    // 캘린더 우측 끝과의 간격
  marginBottom: -2,      // 캘린더와의 간격
},

  // ✅ 아래 스타일 2개 추가
collapsedCalendarIcon: {
  width: 55, // 크기를 텍스트와 어울리게 조절
  height: 55,
  marginRight: 30, // 텍스트와의 가로 간격을 위해 marginRight 사용
  resizeMode: 'contain',
  tintColor: '#475c2aff', // 아이콘 색상을 앱 메인 색상과 통일
},
collapsedCalendar: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center', // ⬅️ 중앙 정렬로 변경
  // paddingVertical: 2,
  paddingHorizontal: 10,
  paddingLeft: 10,
  paddingRight: 50,
  backgroundColor: '#ffffff', // 다른 카드들과 동일하게 흰색 배경
  borderRadius: 30,  
  marginHorizontal: 20,
  marginBottom: 2,           // 아래 식물 리스트와의 간격
},
collapsedCalendarText: {
  fontSize: 20,
  fontWeight: '550',
  color: '#344221', // 앱의 메인 색상과 통일
},
// ✅ 아래 새로운 스타일 추가

// ✅ 아래 textContainer 스타일 추가
textContainer: {
  alignItems: 'center', // 텍스트들을 중앙 정렬
},
});

export default styles;
