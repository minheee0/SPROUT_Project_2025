import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: '#FBFBEA' },
  contentBox: {
    flex: 1,
    justifyContent: 'center',
    marginTop: hp('12%'),
    marginBottom: hp('2%'),
    bottom: hp('6.2%'),
    marginHorizontal: wp('-3%'),
    marginVertical: hp('1.5%'),
    borderRadius: wp('8%'),
    padding: wp('4%'),
    maxHeight: hp('76%'),
    
    // ✅ header와 동일한 반투명 배경색으로 변경
    backgroundColor: 'rgba(90, 116, 68, 0.8)',
    
    // ✅ header와 동일한 그림자 스타일로 변경
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 8,
  },
  noResultsImage: {
    top: hp('10%'),
    width: wp('62%'),
    height: wp('46%'),
    alignSelf: 'center',
    marginTop: 20,
  },
  resultsBox: {
    flex: 2,
    justifyContent: 'center',
    backgroundColor: '#DBDEAF',
    borderRadius: wp('7%'),
    padding: wp('3%'),
    marginTop: hp('1%'),
    marginBottom: hp('0%'),
    maxHeight: hp('100%'),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  title: { color: '#ffffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 4, marginTop: 2, marginLeft: 4, textAlign: 'left' },
  sub1: { color: '#ccceccff', fontSize: 14, fontWeight: '100', marginLeft: 3, marginBottom: 8 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  input: {
    height: 40,
    backgroundColor: '#FBFBEA',
    borderRadius: 20,
    paddingLeft: 8,
    flex: 1,
    marginRight: 4
  },
  searchButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#344221',
    borderRadius: 30,
    marginRight: 5
  },
  searchButtonText: { color: '#fff', fontSize: 14 },
  conditionButton: {
  padding: 4, // 텍스트 대신 아이콘이므로 패딩을 조정하여 보기 좋게 만듭니다.
  backgroundColor: 'transparent', // 배경을 투명하게 설정
  borderRadius: 60,
  alignItems: 'center',
  justifyContent: 'center'
},

// ✅ 아래 스타일을 새로 추가합니다.
conditionButtonImage: {
  width: 40,  // 아이콘 너비
  height: 40, // 아이콘 높이
},
  
item: {
  marginBottom: 17,
  backgroundColor: '#FBFBEA',
  padding: 2.5,
  borderRadius: 35,
  flexDirection: 'row',
  alignItems: 'center',

  // ✅ 그림자 효과 (iOS)
  shadowColor: '#000',                  // 그림자 색상
  shadowOffset: { width: 0, height: 2 }, // 그림자 방향
  shadowOpacity: 0.1,                   // 그림자 불투명도
  shadowRadius: 4,                      // 그림자 번짐 정도

  // ✅ 그림자 효과 (Android)
  elevation: 3,                         // 안드로이드용 그림자 깊이
},
  itemImage: {
    width: 100, height: 100, marginRight: 30, borderRadius: 60, shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5
  },
  itemTitle: { color: '#344221', fontSize: 16, fontWeight: 'bold', flex: 1 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: {
    backgroundColor: '#dee0c1ff',
    padding: 20,
    width: wp('80%'),
    borderRadius: 10,
    maxHeight: hp('50%')
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15,textDecorationColor: '#405623', textAlign: 'center' },
  modalCloseButton: { marginTop: 20, alignItems: 'center', backgroundColor: '#405623', borderRadius: 5, padding: 10 },
  modalCloseButtonText: { color: '#ffff', fontSize: 16 },

  filterBox: {
    borderRadius: 60,
    paddingHorizontal: 20,
    paddingVertical: 7,
    marginVertical: 5,
    backgroundColor: '#E7E7E7'
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7,
  },
  filterLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  filterValue: {
    flex: 1,
    fontSize: 16,
    color: '#555',
    textAlign: 'right',
  },
  // ✅ 버튼을 고정하는 핵심 스타일
  aiCamButton: {
    position: 'absolute', // 1. 절대 위치 사용
    top: 15,              // 2. 부모(contentBox)의 상단에서 20만큼 아래로
    right: 20,            // 3. 부모(contentBox)의 오른쪽에서 25만큼 안으로
    zIndex: 1,            // (선택사항) 다른 요소들보다 위에 보이게 함
  },

  aiCamButtonIcon: {
    width: 45, // 아이콘 이미지의 너비
    height: 45,// 아이콘 이미지의 높이
  },
});

export default styles;