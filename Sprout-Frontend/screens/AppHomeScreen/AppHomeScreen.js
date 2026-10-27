import React, { useState, useEffect } from 'react';
import { View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigationState } from '@react-navigation/native';

import MyPlantsScreen from './MyPlantsScreen';
import SearchScreen from './SearchTab/SearchScreen';
import DiaryScreen from './DiaryScreen';
import AI_chatbotScreen from './AI_chatbot';
import { connect } from '../../store/iotStore'; // ✅ 웹소켓 연결 함수 import

import styles from '../../styles/AppHomeScreenStyles';

const Tab = createBottomTabNavigator();

// 커스텀 탭바 컴포넌트 (수정 없음)
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;
  const tabBarWidth = screenWidth * 0.85;

  return (
    <View style={[styles.tabBarOverlay, { paddingBottom: insets.bottom > 0 ? insets.bottom : 15 }]}>
      <View style={[styles.tabBarContainer, { width: tabBarWidth }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          // AI_chatbot 탭에만 별도 스타일 적용
          const isChatbotTab = route.name === 'AI_chatbot';
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabItem}
            >
              {isFocused && <View style={styles.activeTabBox} />}
              <Image
                source={options.tabBarIconSource}
                style={[
                  styles.tabIcon,
                  isChatbotTab && styles.chatbotTabIcon,
                  { tintColor: isFocused ? '#212915ff' : '#FFFFFF' }
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const AppHomeScreen = ({ route, navigation }) => {
  console.log("📮 AppHomeScreen이 받은 데이터:", route.params?.surveyData);
  const { surveyData } = route.params || {};

  // ✅ 앱의 메인 화면이 렌더링될 때 웹소켓 연결 시작
  useEffect(() => {
    connect(); // zustand 스토어의 connect 함수 호출
  }, []);

  // 탭바 표시 여부 상태
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  // tabBarVisible param이 바뀔 때마다 상태 변경
  useEffect(() => {
    const tabBarVisible = route.params?.tabBarVisible;
    if (typeof tabBarVisible === 'boolean') {
      setIsTabBarVisible(tabBarVisible);
    } else {
      setIsTabBarVisible(true);
    }
  }, [route.params?.tabBarVisible]);

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={isTabBarVisible ? (props) => <CustomTabBar {...props} /> : () => null}
    >
      <Tab.Screen
        name="MyPlants"
        options={{ tabBarIconSource: require('../../assets/home.png') }}
      >
        {(props) => <MyPlantsScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name="Search"
        options={{ tabBarIconSource: require('../../assets/search.png') }}
      >
        {(props) => <SearchScreen {...props} surveyData={surveyData} />}
      </Tab.Screen>
      <Tab.Screen
        name="Diary"
        options={{ tabBarIconSource: require('../../assets/diary.png') }}
      >
        {(props) => <DiaryScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name="AI_chatbot"
        options={{ tabBarIconSource: require('../../assets/chatbot.png') }}
      >
        {(props) => <AI_chatbotScreen {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default AppHomeScreen;