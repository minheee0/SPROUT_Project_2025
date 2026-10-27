import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

// props로 onRecommendPress를 받도록 수정합니다.
const RecommendTab = ({ activeTab, setActiveTab, onRecommendPress, setSText }) => {

  // '전체' 탭을 누를 때의 동작입니다.
  const handleAllPress = () => {
    setActiveTab('all');
    setSText(''); // 전체 탭으로 이동 시 검색어 초기화
  };

  return (
    <View style={styles.tabContainer}>
      {/* 전체 탭 */}
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'all' && styles.activeTabButton]}
        onPress={handleAllPress}
      >
        <Text style={[styles.tabButtonText, activeTab === 'all' && styles.activeTabButtonText]}>
          전체
        </Text>
      </TouchableOpacity>

      {/* 추천 탭 */}
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'recommend' && styles.activeTabButton]}
        // onPress 시 부모로부터 받은 onRecommendPress 함수를 직접 호출합니다.
        onPress={onRecommendPress}
      >
        <Text style={[styles.tabButtonText, activeTab === 'recommend' && styles.activeTabButtonText]}>
          추천
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// 스타일은 기존과 동일합니다.
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#344221',
    borderRadius: 50,
    padding: 6,
    marginVertical: -1,
    marginHorizontal: -2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: '#DBDEAF',
  },
  tabButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  activeTabButtonText: {
    color: '#344221',
  },
});

export default RecommendTab;