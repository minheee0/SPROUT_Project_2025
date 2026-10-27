// import 'react-native-gesture-handler';
// import React, { useEffect } from 'react'; // ✅ useEffect 추가
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { enableScreens } from 'react-native-screens';
// import Navigation from './navigation/Navigation';
// import { validateLogin, registerUser } from './constants/auth';
// import { connect as connectIot } from './store/iotStore'; // ✅ iotStore의 connect 함수 import

// // setImmediate 폴리필 추가
// if (typeof global.setImmediate === 'undefined') {
//   global.setImmediate = (fn) => setTimeout(fn, 0);
// }

// enableScreens(); // 네이티브 스크린 최적화 활성화

// export default function App() {
//   // ✅ 앱이 시작될 때 웹소켓 연결을 실행합니다.
//   useEffect(() => {
//     connectIot();
//   }, []);

//   return (
//     // ✅ 2. Navigation 컴포넌트를 GestureHandlerRootView로 감싸줍니다.
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Navigation />
//     </GestureHandlerRootView>
//   );
// }

import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import Navigation from './navigation/Navigation';
import { validateLogin, registerUser } from './constants/auth';
import { connect as connectIot } from './store/iotStore';
// ✅ 1. react-native-calendars에서 LocaleConfig를 import 합니다.
import { LocaleConfig } from 'react-native-calendars';

// setImmediate 폴리필 추가
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (fn) => setTimeout(fn, 0);
}

enableScreens(); // 네이티브 스크린 최적화 활성화

// ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
// ✅ 2. 이 캘린더 한글 설정 코드를 여기에 추가합니다.
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  monthNamesShort: ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.', '11.', '12.'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: "오늘"
};

LocaleConfig.defaultLocale = 'ko';
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲


export default function App() {
  // 앱이 시작될 때 웹소켓 연결을 실행합니다.
  useEffect(() => {
    connectIot();
  }, []);

  return (
    // Navigation 컴포넌트를 GestureHandlerRootView로 감싸줍니다.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Navigation />
    </GestureHandlerRootView>
  );
}