import React, { useState, useRef } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { View, Text, Image, SafeAreaView, TouchableOpacity, Dimensions, Pressable, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import TemperatureChart from './TemperatureChart';
import SoilMoistureChart from './SoilMoistureChart';
// 분리된 스타일 파일을 import 합니다.
import styles from '../../styles/MyPlantsScreenStyles';

const { width, height } = Dimensions.get("window");

export default function MyPlantsScreen({ navigation }) {
  // 레이아웃 계산을 위한 변수들은 컴포넌트 내에 유지합니다.
  const sideMenuBarTop = width * 0.22;
  const sideMenuBarRight = height * 0.02;
  const leftMargin = width * -0.1;
  const topMargin = height * -0.25;
  const topMargin2 = (395 / 1000) * height;
  const chartSize = (335 / 362) * width;

  const [image, setImage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const lastTapRef = useRef(0);

  const handleBackgroundPress = () => {
    setTapCount(prev => prev + 1);
    if (tapCount === 1) {
      setShowOptionModal(false);
      setTapCount(0);
    }
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('이미지 라이브러리 접근 권한이 필요합니다!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: ['Images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleImageTap = () => {
    if (!image) return;
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTapRef.current && now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
      setShowOptionModal(true);
    } else {
      lastTapRef.current = now;
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = () => {
    setImage(null);
    setShowDeleteModal(false);
  };
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.plantContainer, { position: 'relative', left: leftMargin, top: topMargin }]}>
        <View style={styles.circleContainer}>
          <Pressable
            style={[
              styles.imageContainer,
              { borderColor: image ? "#E9EAC7" : "#E9EAC7" }
            ]}E9EAC7
            onPress={handleImageTap}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Image source={require('../../assets/Logo_3.png')} style={styles.nonimage} />
            )}
          </Pressable>
          <View style={[styles.outerCircle, { position: 'absolute', top: 4, right: 16 }]}>
            <TouchableOpacity onPress={selectImage} style={styles.button}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>나의 식물</Text>
        </View>
      </View>

      <View style={[styles.chartWrapper, { position: 'absolute', top: topMargin2, width: chartSize, height: chartSize }]}>
        <View style={[styles.chartContainer, { width: chartSize, height: chartSize }]}>
          <TemperatureChart />
          <SoilMoistureChart />
        </View>

      </View>

      <View style={[styles.sideMenuBar, { top: sideMenuBarTop, right: sideMenuBarRight }]}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('MyPage')}
        >
          <Image source={require("../../assets/User.png")} style={styles.menuIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('AI_Cam')}
        >
          <Image source={require("../../assets/AI.png")} style={styles.menuIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('Iot')}
        >
          <Image source={require("../../assets/IOT.png")} style={styles.menuIcon2} />
        </TouchableOpacity>
      </View>

      {/* 옵션 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showOptionModal}
        onRequestClose={() => setShowOptionModal(false)}
      >
        <TouchableWithoutFeedback onPress={handleBackgroundPress}>
          <View style={styles.modalContainer}>
            <View style={styles.alertBox}>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>Edit & Delete</Text>
                <Text style={styles.alertMessage}>원하는 작업을 선택하세요.</Text>
              </View>
              <View style={styles.dividerLine} />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.leftButton]}
                  onPress={() => {
                    selectImage();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.actionButtonText, { color: '#007AFF' }]}>Edit</Text>
                </TouchableOpacity>
                <View style={styles.verticalDivider} />
                <TouchableOpacity
                  style={[styles.actionButton, styles.rightButton]}
                  onPress={() => {
                    setShowOptionModal(false);
                    setShowDeleteModal(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.actionButtonText2, { color: '#FF3B30' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    
      {/* 삭제 확인 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.alertBox}>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Delete image</Text>
              <Text style={styles.alertMessage}>이 이미지를 삭제하면 {'\n'}되돌릴 수 없습니다.</Text>
            </View>
            <View style={styles.dividerLine} />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.leftButton]}
                onPress={handleCancelDelete}
                activeOpacity={0.7}
              >
                <Text style={[styles.actionButtonText, { color: '#007AFF' }]}>Cancel</Text>
              </TouchableOpacity>
              <View style={styles.verticalDivider} />
              <TouchableOpacity
                style={[styles.actionButton, styles.rightButton]}
                onPress={handleConfirmDelete}
                activeOpacity={0.7}
              >
                <Text style={[styles.actionButtonText2, { color: '#FF3B30' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}