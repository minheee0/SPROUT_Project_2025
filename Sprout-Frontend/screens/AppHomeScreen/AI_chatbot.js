import React, { useState, useRef, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { GestureDetector, Gesture, Directions } from 'react-native-gesture-handler';

const SERVER_URL = "http://54.224.76.10:5000/chat";

export default function AI_chatbotScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log('[AI_chatbot] 마운트됨');
    return () => console.log('[AI_chatbot] 언마운트됨');
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setParams({ tabBarVisible: false });
      return () => navigation.getParent()?.setParams({ tabBarVisible: true });
    }, [navigation])
  );

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '안녕하세요! 저는 식물 키우기를 도와주는 Sprout AI입니다 🌱\n어떤 식물이 궁금하신가요?',
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const flatListRef = useRef();

  const flingUp = Gesture.Fling()
    .direction(Directions.UP)
    .onEnd(() => navigation.getParent()?.setParams({ tabBarVisible: true }));

  const menuOptions = [
    { id: '1', label: '🌿 관엽식물' },
    { id: '2', label: '🌸 꽃식물' },
    { id: '3', label: '🌵 다육식물' },
    { id: '4', label: '🍀 기타 식물' },
  ];

  const handleSend = async (text) => {
    if (!text.trim()) return;
    const newMessage = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput('');

    try {
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: '서버와 연결할 수 없습니다 😢' },
      ]);
    }
  };

  const handleMenuSelect = (label) => handleSend(label);

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    const isFirstBotMessage = item.id === 1;

    return (
      <View style={{ marginBottom: 20 }}>
        <View
          style={[
            styles.messageRow,
            { justifyContent: isUser ? 'flex-end' : 'flex-start' },
          ]}
        >
          {/* 챗봇 동그라미 + AI 텍스트 */}
          {!isUser && (
            <View style={[styles.circle, styles.botCircle]}>
              <Text style={styles.aiText}>AI</Text>
            </View>
          )}

          {/* 말풍선 */}
          <View style={[
            styles.bubble,
            isUser ? styles.userBubbleCustom : styles.botBubble,
          ]}>
            <Text
              style={{
                color: isUser ? '#000' : '#fff',
                fontSize: 14,
                fontWeight: isUser ? '400' : '500',
                lineHeight: 22,
              }}
            >
              {item.text}
            </Text>
          </View>
        </View>

        {/* 🌿 첫 챗봇 메시지 아래 버튼 */}
        {!isUser && isFirstBotMessage && (
          <View style={styles.menuWrapperVertical}>
            {menuOptions.map((menu) => (
              <TouchableOpacity
                key={menu.id}
                style={styles.menuButtonBubble}
                onPress={() => handleMenuSelect(menu.label)}
              >
                <Text style={styles.menuTextRect}>{menu.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

const dynamicHeaderStyle = {
  paddingTop: 5, // 적당한 상단 여백
  height: 57,     // 전체 헤더 높이
};

  return (
    <GestureDetector gesture={flingUp}>
      <SafeAreaView style={styles.container}>
        {/* 상단바 */}
        <View style={[styles.header, dynamicHeaderStyle]}>
          <TouchableOpacity onPress={() => navigation && navigation.goBack()} style={styles.backButton}>
            <Image source={require('../../assets/back_icon2.png')} style={styles.backButtonImage} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontWeight: 'bold' }]}>Sprout AI</Text>
        </View>

        {/* 채팅 영역 */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatArea}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* 입력창 */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.inputContainer}>
            <TextInput
              value={userInput}
              onChangeText={setUserInput}
              placeholder="메시지를 입력하세요..."
              placeholderTextColor="#ccc"
              style={styles.input}
            />
            <TouchableOpacity onPress={() => handleSend(userInput)} style={styles.sendButton}>
              <Text style={styles.sendText}>전송</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(90, 116, 68, 0.8)',
    height: 65,
    paddingHorizontal: 15,
    justifyContent: 'center', // 제목 가운데 정렬
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 8,
  },
  backButton: { position: 'absolute', left: 15 },
  backButtonImage: { width: 36, height: 36, resizeMode: 'contain', tintColor: '#f3f3f3' },
  headerTitle: { fontSize: 20, fontWeight: '500', color: '#fff' },

  chatArea: { padding: 16, flexGrow: 1 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end' },

  circle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  botCircle: { backgroundColor: 'rgba(90, 116, 68, 0.8)', marginRight: 8 },
  aiText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  bubble: {
    maxWidth: '70%',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 8,
  },
  botBubble: { backgroundColor: 'rgba(90, 116, 68, 0.8)', marginLeft: 4 },
  // 기존 사용자 말풍선 색상 유지, botBubble 스타일 그대로 적용
  userBubbleCustom: {
    backgroundColor: '#E4F0D7', // 색상만 다름
    marginLeft: 4, // botBubble과 동일하게
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    maxWidth: '70%',
    shadowColor: '#bbb', // 더 연한 그림자
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4, // 더 연하게
    shadowRadius: 2,
    elevation: 8,
  },

  menuWrapperVertical: {
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  // 버튼도 botBubble 스타일 그대로, 색상만 투명하게
  menuButtonBubble: {
    backgroundColor: 'rgba(255,255,255,0.7)', // 훨씬 더 진하게
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 22,
    width: 150,
    // 버튼 배경에만 그림자 훨씬 더 진하게
    shadowColor: '#111',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 10,
  },
    menuTextRect: {
      color: '#000',
      fontWeight: '500',
      fontSize: 14,
      lineHeight: 22,
      // 챗봇 인삿말과 동일하게
    },

  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#F7F9F4',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 18,
    borderTopWidth: 0.5,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: 'rgba(90, 116, 68, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  sendText: { color: '#fff', fontWeight: '400', fontSize: 15 },
});
