import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import xml2js from 'xml2js';
import styles from '../../../styles/DetailScreenStyles';

const DetailScreen = ({ route, navigation }) => {
    const { item, original } = route.params;
    const [plantDetails, setPlantDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    // 전체탭: item.rtnFileUrl → plantDetails.rtnFileUrl → 썸네일, 추천탭: original.rtnFileUrl → ...
    const getImageUrl = () => {
        if (original?.rtnFileUrl) {
            const urls = original.rtnFileUrl.split('|');
            if (urls[0]) return urls[0].startsWith('http') ? urls[0] : `http://nongsaro.go.kr${urls[0]}`;
        }
        if (item?.rtnFileUrl) {
            const urls = item.rtnFileUrl.split('|');
            if (urls[0]) return urls[0].startsWith('http') ? urls[0] : `http://nongsaro.go.kr${urls[0]}`;
        }
        if (plantDetails?.rtnFileUrl) {
            const urls = plantDetails.rtnFileUrl.split('|');
            if (urls[0]) return urls[0].startsWith('http') ? urls[0] : `http://nongsaro.go.kr${urls[0]}`;
        }
        if (plantDetails?.rtnThumbFileUrl) {
            const urls = plantDetails.rtnThumbFileUrl.split('|');
            if (urls[0]) return urls[0].startsWith('http') ? urls[0] : `http://nongsaro.go.kr${urls[0]}`;
        }
        return 'https://via.placeholder.com/100';
    };

    // ✅✅✅ 수정된 함수: 상세 정보를 가져오는 로직 통합
    const fetchPlantDetails = async (cntntsNo) => {
        const apiKey = '20250228AE7XDRGIMGFOSM9SITT2OQ';
        const url = `http://api.nongsaro.go.kr/service/garden/gardenDtl?cntntsNo=${cntntsNo}&apiKey=${apiKey}`;
    
        try {
            const response = await axios.get(url);
            console.log('[DetailScreen] 추천탭 API XML 원본:', response.data); // XML 전체 출력
            const parser = new xml2js.Parser({ explicitArray: false });
            const result = await parser.parseStringPromise(response.data);
            
            const details = result?.response?.body?.item;
            return details;
        } catch (error) {
            console.error('API 호출 또는 파싱 실패:', error);
            Alert.alert("API 호출 오류", `상세 정보 로딩에 실패했습니다.`);
            return null;
        }
    };

    // ✅✅✅ 수정된 useEffect: 두 가지 데이터 구조를 모두 처리
    useEffect(() => {
        const loadDetails = async () => {
            setLoading(true);
            if (item.cntntsNo) {
                // SearchScreen의 '추천' 탭에서 온 데이터
                const details = await fetchPlantDetails(item.cntntsNo);
                if (details) {
                    console.log('[DetailScreen] 추천탭 API 상세 응답:', details);
                    setPlantDetails(details);
                } else {
                    Alert.alert("정보 없음", "해당 식물에 대한 상세 정보가 없습니다.");
                    navigation.goBack();
                }
            } else {
                // SearchScreen의 '전체' 탭에서 온 데이터
                // 이미 상세 정보가 포함되어 있으므로 API 호출 없이 바로 사용
                setPlantDetails(item);
            }
            setLoading(false);
        };

        loadDetails();
    }, [item]);


    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#478C21" style={{ marginTop: 50 }} />
            </View>
        );
    }

    if (!plantDetails) {
        return (
            <View style={styles.container}>
                <Text>상세 정보를 불러오는 데 실패했습니다.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* 뒤로가기 버튼 */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image source={require('../../../assets/back_icon2.png')} style={styles.backButtonImage} />
            </TouchableOpacity>
    
            {/* 이미지 감싸는 View 추가 */}
            <View style={styles.imageContainer}>
                {/* 추천탭/전체탭 모두에서 이미지가 잘 보이도록 우선순위 보완 */}
                <Image 
                    source={{ uri: getImageUrl() }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
    
            {/* 🔽 이미지 아래로 제목 이동 */}
            <View style={styles.titleContainer}>
                {/* 추천탭/전체탭 모두에서 식물명이 잘 보이도록 우선순위 보완 */}
                <Text style={styles.title}>{plantDetails.cntntsSj || plantDetails.plntbneNm || original?.name || '정보 없음'}</Text>
            </View>
    
            <View style={styles.detailContainer}>
                {/* 각 항목을 감싸는 박스 */}
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>식물명: {item.cntntsSj || plantDetails.cntntsSj || original?.name || plantDetails.plntbneNm || '정보 없음'}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>식물학명: {plantDetails.plntbneNm || '정보 없음'}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>식물영명: {plantDetails.plntzrNm || '정보 없음'}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>생육온도: {plantDetails.grwhTpCodeNm || '정보 없음'}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>겨울최저온도: {plantDetails.winterLwetTpCodeNm || '정보 없음'}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>습도: {plantDetails.hdCodeNm || '정보 없음'}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>토양정보: {plantDetails.soilInfo || '정보 없음'}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>과명: {plantDetails.fmlCodeNm || '정보 없음'}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>원산지: {plantDetails.orgplceInfo || '정보 없음'}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>성장 높이: {plantDetails.growthHgInfo || '정보 없음'}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>성장 넓이: {plantDetails.growthAraInfo || '정보 없음'}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>물주기(봄): {plantDetails.watercycleSprngCodeNm || '정보 없음'}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>물주기(여름): {plantDetails.watercycleSummerCodeNm || '정보 없음'}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>물주기(가을): {plantDetails.watercycleAutumnCodeNm || '정보 없음'}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>물주기(겨울): {plantDetails.watercycleWinterCodeNm || '정보 없음'}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default DetailScreen;