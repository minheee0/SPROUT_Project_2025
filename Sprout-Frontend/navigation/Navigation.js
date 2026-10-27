import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StartScreen from '../screens/StartScreen/StartScreen';
// import HomeScreen from '../screens/HomeScreen/HomeScreen'; // 더이상 사용하지 않음
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';
import RegisterMake from '../screens/RegisterScreen/RegisterMake'; // 추가
import RegisterComp from '../screens/RegisterScreen/RegisterComp'; // 추가
import Initial01 from '../screens/InitialSettingsScreen/Initial01'; // 추가
import DiaryScreen from '../screens/AppHomeScreen/DiaryScreen';
import AppHomeScreen from "../screens/AppHomeScreen/AppHomeScreen";
import MyPage from "../screens/AppHomeScreen/MyPage"; // 마이페이지- 김다연
import Iot from "../screens/AppHomeScreen/Iot"; // Iot- 김다연
import AI_Cam from "../screens/AppHomeScreen/AI_Cam"; // 김다연
import AI_chatbot from "../screens/AppHomeScreen/AI_chatbot"; // 김다연
import SearchScreen from '../screens/AppHomeScreen/SearchTab/SearchScreen';  // 추가
import DetailScreen from '../screens/AppHomeScreen/SearchTab/DetailScreen'; // 추가

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const [initialRoute, setInitialRoute] = useState('Start');
  const [loading, setLoading] = useState(false); // StartScreen은 항상 먼저 보여주므로 loading X

  // StartScreen에서 navigation.navigate('Login') 또는 자동로그인 분기
  // LoginScreen에서 로그인 성공 시 navigation.replace('Initial01')
  // Initial01에서 완료 시 navigation.replace('AppHomeScreen')

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Start" component={StartScreen} />
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RegisterMake" component={RegisterMake} />
        <Stack.Screen name="RegisterComp" component={RegisterComp} />
        <Stack.Screen name="Initial01" component={Initial01} />
        <Stack.Screen name="AppHomeScreen" component={AppHomeScreen} />
        <Stack.Screen name="Diary" component={DiaryScreen} />
        <Stack.Screen name="MyPage" component={MyPage} /> 
        <Stack.Screen name="Iot" component={Iot} /> 
        <Stack.Screen name="AI_Cam" component={AI_Cam} /> 
        <Stack.Screen name="AI_chatbot" component={AI_chatbot} /> 
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="DetailScreen" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
