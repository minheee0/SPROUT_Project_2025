import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions, SafeAreaView, Alert } from "react-native";
import LottieView from "lottie-react-native";
import PagerView from "react-native-pager-view";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/Initial01Styles";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("window");

const API_BASE_URL = "http://54.224.76.10:9090"; // EC2 서버 주소
const getAuthToken = async () => {
    try {
        return await AsyncStorage.getItem('authToken');
    } catch (e) {
        console.error("AsyncStorage에서 토큰을 가져오는 데 실패했습니다.", e);
        return null;
    }
};

const Initial01 = () => {
    const navigation = useNavigation();
    const [pageIndex, setPageIndex] = useState(0);
    const pagerRef = useRef(null);
    const lottieRef = useRef(null);
    const [surveyData, setSurveyData] = useState({
        lightChkVal: null,
        waterCycleSel: null,
        grwhstleChkVal: null,
    });

    const handleSelection = (fieldName, value, nextPageIndex) => {
        setSurveyData(prevData => ({ ...prevData, [fieldName]: value }));
        const targetPage = fieldName === 'grwhstleChkVal' ? 3 : nextPageIndex;
        if (pagerRef.current) {
            pagerRef.current.setPage(targetPage);
        }
        setPageIndex(targetPage);
    };

    useEffect(() => {
        if (pageIndex !== 3) return;

        lottieRef.current?.play();

        const submitSurveyAndNavigate = async () => {
            const token = await getAuthToken();

            if (!token) {
                Alert.alert(
                    "로그인 필요",
                    "추천 결과를 계정에 저장하려면 로그인이 필요합니다. 로그인하시겠습니까?",
                    [
                        { text: "나중에 할래요", style: 'cancel', onPress: () => navigation.navigate("AppHomeScreen") },
                        { text: "로그인", onPress: () => navigation.navigate("Login") }
                    ]
                );
                return;
            }

            try {
                console.log("🚀 백엔드로 보내는 추천 기준 데이터:", surveyData);
                // ✅ 알려주신 대로, 엔드포인트 주소를 다시 recommendations로 수정했습니다.
                await axios.post(`${API_BASE_URL}/plants/recommendations`, surveyData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log("✅ 추천 기준 저장 성공!");

            } catch (error) {
                console.error("🔴 추천 기준 저장 실패:", error.response ? error.response.data : error.message);
                Alert.alert("오류", "추천 정보를 저장하는 중 오류가 발생했습니다.");
            } finally {
                // 최초설정 완료 플래그 저장
                await AsyncStorage.setItem('initialSurvey', 'done');
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'AppHomeScreen' }],
                });
            }
        };

        const timer = setTimeout(submitSurveyAndNavigate, 2000);
        return () => clearTimeout(timer);

    }, [pageIndex]);

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("Start")} style={styles.homeButton}>
                <Image source={require("../../assets/back_icon2.png")} style={styles.homeIcon} />
            </TouchableOpacity>

            <PagerView
                ref={pagerRef}
                style={styles.pagerView}
                initialPage={0}
                onPageSelected={(e) => setPageIndex(e.nativeEvent.position)}
                scrollEnabled={false}
            >
                {/* 1번째 페이지: 광도 선택 */}
                <View key="1" style={styles.page}>
                    <Text style={styles.pageText}>식물을 어디에</Text>
                    <Text style={styles.pageText2}>두고 싶으세요?</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button1} onPress={() => handleSelection('lightChkVal', '055001', 1)}>
                            <Image source={require("../../assets/indoorBt.png")} style={styles.buttonImage} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button2} onPress={() => handleSelection('lightChkVal', '055002', 1)}>
                            <Image source={require("../../assets/verandaBt.png")} style={styles.buttonImage} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button3} onPress={() => handleSelection('lightChkVal', '055003', 1)}>
                            <Image source={require("../../assets/outdoorBt.png")} style={styles.buttonImage} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 2번째 페이지: 물주기 주기 선택 */}
                <View key="2" style={styles.page}>
                    <Text style={styles.pageText}>식물에 물을 얼마나</Text>
                    <Text style={styles.pageText2}>자주 줄 수 있나요?</Text>
                    <View style={styles.columnContainer}>
                        <TouchableOpacity style={styles.cardButton2} onPress={() => handleSelection('waterCycleSel', '053001', 2)}><Image source={require('../../assets/icon_water1.png')} style={styles.cardIcon2} /><View style={styles.textContainer2}><Text style={styles.cardText2}>매일 물주기</Text><Text style={styles.cardSubText2}>(항상 흙이 젖어있도록)</Text></View></TouchableOpacity>
                        <TouchableOpacity style={styles.cardButton2} onPress={() => handleSelection('waterCycleSel', '053002', 2)}><Image source={require('../../assets/icon_water2.png')} style={styles.cardIcon2} /><View style={styles.textContainer2}><Text style={styles.cardText2}>2~3일에 한 번</Text><Text style={styles.cardSubText2}>(흙을 촉촉하게 유지)</Text></View></TouchableOpacity>
                        <TouchableOpacity style={styles.cardButton2} onPress={() => handleSelection('waterCycleSel', '053003', 2)}><Image source={require('../../assets/icon_water3.png')} style={styles.cardIcon2} /><View style={styles.textContainer2}><Text style={styles.cardText2}>3~5일에 한 번</Text><Text style={styles.cardSubText2}>(흙 표면이 말랐을 때)</Text></View></TouchableOpacity>
                        <TouchableOpacity style={styles.cardButton2} onPress={() => handleSelection('waterCycleSel', '053004', 2)}><Image source={require('../../assets/icon_water4.png')} style={styles.cardIcon2} /><View style={styles.textContainer2}><Text style={styles.cardText2}>5~7일에 한 번</Text><Text style={styles.cardSubText2}>(흙 대부분이 말랐을 때)</Text></View></TouchableOpacity>
                    </View>
                </View>

                {/* 3번째 페이지: 식물 형태 선택 */}
                <View key="3" style={styles.page}>
                    <Text style={styles.pageText}>어떤 모양의 식물을</Text>
                    <Text style={styles.pageText2}>키우고 싶으세요?</Text>
                    <View style={styles.gridContainer}>
                        <View style={styles.gridCell}><TouchableOpacity style={styles.cardButton} onPress={() => handleSelection('grwhstleChkVal', '054001', 3)}><Image source={require("../../assets/icon_upright.png")} style={styles.cardIcon} /><Text style={styles.cardText}>직립형</Text></TouchableOpacity></View>
                        <View style={styles.gridCell}><TouchableOpacity style={styles.cardButton} onPress={() => handleSelection('grwhstleChkVal', '054002', 3)}><Image source={require("../../assets/icon_shrub.png")} style={styles.cardIcon} /><Text style={styles.cardText}>관목형</Text></TouchableOpacity></View>
                        <View style={styles.gridCell}><TouchableOpacity style={styles.cardButton} onPress={() => handleSelection('grwhstleChkVal', '054003', 3)}><Image source={require("../../assets/icon_vine.png")} style={styles.cardIcon} /><Text style={styles.cardText}>덩굴성</Text></TouchableOpacity></View>
                        <View style={styles.gridCell}><TouchableOpacity style={styles.cardButton} onPress={() => handleSelection('grwhstleChkVal', '054004', 3)}><Image source={require("../../assets/icon_grass.png")} style={styles.cardIcon} /><Text style={styles.cardText}>풀모양</Text></TouchableOpacity></View>
                        <View style={styles.gridCell}><TouchableOpacity style={styles.cardButton} onPress={() => handleSelection('grwhstleChkVal', '054005', 3)}><Image source={require("../../assets/icon_rosette.png")} style={styles.cardIcon} /><Text style={styles.cardText}>로제트형</Text></TouchableOpacity></View>
                        <View style={styles.gridCell}><TouchableOpacity style={styles.cardButton} onPress={() => handleSelection('grwhstleChkVal', '054006', 3)}><Image source={require("../../assets/icon_succulent.png")} style={styles.cardIcon} /><Text style={styles.cardText}>다육형</Text></TouchableOpacity></View>
                    </View>
                </View>

                {/* 4번째 페이지: 로딩 애니메이션 */}
                <View key="4" style={styles.page}>
                    <LottieView
                        ref={lottieRef}
                        source={require("../../assets/Logo_5.json")}
                        autoPlay={false}
                        loop={false}
                        style={styles.logo}
                    />
                </View>
            </PagerView>

            {/* 인디케이터 */}
            <View style={styles.pagination}>
                {[0, 1, 2, 3].map((index) => (
                    <View
                        key={index}
                        style={[styles.dot, { backgroundColor: pageIndex === index ? "#405623" : "#EEF3EB" }]}
                    />
                ))}
            </View>

            {/* 하단 텍스트 */}
            {pageIndex < 3 && (
                <View style={styles.textContainer}>
                    <Text style={styles.hahaText1}>답변을 주신 내용을 분석하여</Text>
                    <Text style={styles.hahaText2}>식물을 추천드릴게요</Text>
                </View>
            )}

            {/* 푸터 */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>©sprout.company</Text>
            </View>
        </SafeAreaView>
    );
};

export default Initial01;