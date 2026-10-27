import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // 화면 하단 전체를 덮는 투명 '액자'. 탭바를 수평 중앙 정렬시킴.
  tabBarOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center', 
  },
  // 실제 보이는 탭바
  tabBarContainer: {
    flexDirection: 'row',
    height: 77,
    borderRadius: 38,
    backgroundColor: '#405623',
    alignItems: 'center',
    
    // ⛔️ 문제의 원인이었던 고정 padding 값 제거
    // paddingHorizontal: 60, 
    
    // 그림자 효과
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  // 개별 탭 버튼
  tabItem: {
    // ✅ flex: 1 이 동적 간격의 핵심! 
    // 각 아이템이 컨테이너의 공간을 1/n로 똑같이 나눠 갖게 합니다.
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  // 탭 아이콘 이미지
  tabIcon: {
    width: 38,
    height: 38,
  },
  // AI_chatbot 탭 아이콘만 별도 스타일
  chatbotTabIcon: {
    width: 51,
    height: 51,
    // 필요시 추가 스타일 지정
  },
  // 활성화되었을 때 아이콘 뒤에 생기는 동그란 배경
  activeTabBox: {
    backgroundColor: '#DBDEAF',
    borderRadius: 30,
    width: 60,
    height: 60,
    // ✅ 아이콘 뒤에 위치하도록 설정
    position: 'absolute',
  },
});

export default styles;