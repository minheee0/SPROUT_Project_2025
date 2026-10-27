import React, { useState, useEffect, useRef } from 'react';
// ... (임포트는 기존과 동일)
import { View, Text, TextInput, FlatList, Image, ActivityIndicator, TouchableOpacity, Alert, UIManager, Platform, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionSheet from 'react-native-actionsheet';
import axios from 'axios';
import xml2js from 'xml2js';
import styles from '../../../styles/SearchScreenStyles';
import RecommendTab from '../SearchTab/RecommendTab';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const API_BASE_URL = "http://54.224.76.10:9090"; // 새 EC2 주소

const getAuthToken = async () => {
    return await AsyncStorage.getItem('authToken');
};

// ✅✅✅ 추가된 함수: 농사로 API에서 상세 정보를 가져오는 함수
const fetchPlantDetailsFromNongsaroAPI = async (cntntsNo) => {
    const apiKey = '20250228AE7XDRGIMGFOSM9SITT2OQ';
    const baseUrl = 'http://api.nongsaro.go.kr/service/garden/gardenDtl';
    const url = `${baseUrl}?cntntsNo=${cntntsNo}&apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);
        const parser = new xml2js.Parser({ explicitArray: false });
        const parsed = await parser.parseStringPromise(response.data);
        return parsed?.response?.body?.item || null;
    } catch (error) {
        console.error('농사로 상세 정보 API 호출 실패:', error);
        return null;
    }
};

const SearchScreen = ({ navigation, route }) => {
    // ... (상태 정의 및 기타 변수들은 기존과 동일)
    const [sText, setSText] = useState('');
    const [light, setLight] = useState('');
    const [grwhstle, setGrwhstle] = useState('');
    const [winterLowTemp, setWinterLowTemp] = useState('');
    const [waterSupply, setWaterSupply] = useState('');
    const [loading, setLoading] = useState(true);
    const [isRecommendLoading, setIsRecommendLoading] = useState(false);
    const [masterPlantList, setMasterPlantList] = useState([]);
    const [recommendedPlants, setRecommendedPlants] = useState([]);
    const [allResults, setAllResults] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const isInitialFilterEffect = useRef(true);
    const lightActionSheetRef = useRef();
    const grwhstleActionSheetRef = useRef();
    const winterLowTempActionSheetRef = useRef();
    const waterSupplyActionSheetRef = useRef();
    const lightOptions = [ { label: "선택하세요", value: "" }, { label: "낮은 광도", value: "055001" }, { label: "중간 광도", value: "055002" }, { label: "높은 광도", value: "055003" }, { label: "취소", value: "cancel" }];
    const grwhstleOptions = [ { label: "선택하세요", value: "" }, { label: "직립형", value: "054001" }, { label: "관목형", value: "054002" }, { label: "덩굴형", value: "054003" }, { label: "풀모양", value: "054004" }, { label: "로제트형", value: "054005" }, { label: "다육형", value: "054006" }, { label: "취소", value: "cancel" }];
    const winterLowTempOptions = [ { label: "선택하세요", value: "" }, { label: "0도 이하", value: "057001" }, { label: "5도", value: "057002" }, { label: "7도", value: "057003" }, { label: "10도", value: "057004" }, { label: "13도 이상", value: "057005" }, { label: "취소", value: "cancel" }];
    const waterSupplyOptions = [ { label: "선택하세요", value: "" }, { label: "항상 축축하게", value: "053001" }, { label: "물에 잠기지 않게", value: "053002" }, { label: "토양 표면이 말랐을 때 관수함", value: "053003" }, { label: "흙이 완전히 말랐을 때 관수함", value: "053004" }, { label: "취소", value: "cancel" }];


    // '전체' 탭 및 '수동 필터'를 위한 농사로 API 호출 함수 (역할 분리)
    const fetchPlantsFromNongsaroAPI = async ({ lightVal, grwhstleVal, waterVal, tempVal }) => {
        const apiKey = '20250228AE7XDRGIMGFOSM9SITT2OQ';
        const baseUrl = 'http://api.nongsaro.go.kr/service/garden/gardenList';
        const url = `${baseUrl}?sType=all&sText=&lightChkVal=${lightVal}&grwhstleChkVal=${grwhstleVal}&winterLwetChkVal=${tempVal}&waterCycleSel=${waterVal}&apiKey=${apiKey}&pageNo=1&numOfRows=300`;
        try {
            const response = await axios.get(url);
            const parser = new xml2js.Parser({ explicitArray: false });
            const parsed = await parser.parseStringPromise(response.data);
            let items = parsed?.response?.body?.items?.item || [];
            return Array.isArray(items) ? items : (items ? [items] : []);
        } catch (error) {
            console.error('농사로 API 호출 실패:', error);
            Alert.alert("API 오류", "농사로 API에서 데이터를 불러오는 데 실패했습니다.");
            return [];
        }
    };

    const fetchRecommendedPlantsFromBackend = async () => {
        const token = await getAuthToken();
        if (!token) {
            Alert.alert("로그인 필요", "추천 목록을 보려면 로그인이 필요합니다.");
            return null;
        }
        try {
            console.log("✅ 백엔드에 추천 식물 목록을 요청합니다...");
            const response = await axios.get(`${API_BASE_URL}/plants/recommendations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("✅ 백엔드로부터 추천 식물 목록을 받았습니다:", response.data);
            return response.data;
        } catch (error) {
            console.error('🔴 백엔드 추천 식물 API 호출 실패:', error.response || error);
            Alert.alert("오류", "추천 식물 목록을 불러오는 데 실패했습니다.");
            return null;
        }
    };

    // 화면 첫 로딩 시 '전체' 탭 목록만 불러오기
    useEffect(() => {
        const loadAllPlants = async () => {
            setLoading(true);
            const allPlants = await fetchPlantsFromNongsaroAPI({ lightVal: '', grwhstleVal: '', waterVal: '', tempVal: '' });
            setMasterPlantList(allPlants);
            setLoading(false);
        };
        loadAllPlants();
    }, []);

    // Initial01에서 이동해왔을 때 '추천' 탭 바로 실행
    useEffect(() => {
        if (route.params?.initialTab === 'recommend') {
            handleRecommendTabPress();
        }
    }, [route.params?.initialTab]);

    const handleRecommendTabPress = async () => {
        setIsRecommendLoading(true);
        const recommended = await fetchRecommendedPlantsFromBackend();
        if (recommended && Array.isArray(recommended)) {
            // 최신 3개만 보여주기 (가장 최근 추천이 배열 뒤쪽에 있다고 가정)
            setRecommendedPlants(recommended.slice(-3).reverse());
        } else {
            setRecommendedPlants([]);
        }
        setIsRecommendLoading(false);
        setActiveTab('recommend');
    };
    
    const getRecommendedImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/100';
        const imageUrls = url.split('|');
        return imageUrls[0];
    };

    // ✅✅✅ 수정된 함수: handleItemClick
    const handleItemClick = async (item) => {
        setLoading(true);
        let detailData;

        if (activeTab === 'recommend') {
            // 추천 식물일 경우 cntntsNo로 농사로 API 호출
            if (item.cntntsNo) {
                detailData = await fetchPlantDetailsFromNongsaroAPI(item.cntntsNo);
                if (detailData) {
                    // masterPlantList에서 동일 cntntsNo의 식물 찾기 (고화질 이미지용)
                    const masterPlant = masterPlantList.find(p => p.cntntsNo == item.cntntsNo);
                    // original에 rtnFileUrl 추가
                    const originalWithImage = masterPlant && masterPlant.rtnFileUrl
                        ? { ...item, rtnFileUrl: masterPlant.rtnFileUrl }
                        : item;
                    navigation.navigate('DetailScreen', { item: detailData, original: originalWithImage });
                } else {
                    Alert.alert("오류", "식물 상세 정보를 불러오는 데 실패했습니다.");
                }
            } else {
                Alert.alert("정보 없음", "이 식물은 상세 정보 번호가 없습니다.");
            }
        } else {
            // 전체 탭일 경우 기존 로직 유지
            navigation.navigate('DetailScreen', { item });
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isInitialFilterEffect.current) {
            isInitialFilterEffect.current = false;
            return;
        }
        const applyManualFilters = async () => {
            setLoading(true);
            const filteredPlants = await fetchPlantsFromNongsaroAPI({
                lightVal: light, grwhstleVal: grwhstle,
                waterVal: waterSupply, tempVal: winterLowTemp,
            });
            setMasterPlantList(filteredPlants);
            setActiveTab('all');
            setLoading(false);
        };
        applyManualFilters();
    }, [light, grwhstle, waterSupply, winterLowTemp]);

    useEffect(() => {
        const sourceList = activeTab === 'all' ? masterPlantList : recommendedPlants;
        const searchQuery = sText.trim().toLowerCase();
        if (!Array.isArray(sourceList)) {
            setAllResults([]);
            return;
        }
        if (searchQuery.length >= 2) {
            const filteredData = sourceList.filter(item => {
                // cntntsSj는 전체 탭의 식물에만 존재
                const plantName = activeTab === 'all' ? (item.cntntsSj || '').toLowerCase() : (item.name || '').toLowerCase();
                return plantName.includes(searchQuery);
            });
            setAllResults(filteredData);
        } else {
            setAllResults(sourceList);
        }
    }, [sText, activeTab, masterPlantList, recommendedPlants]);
    
    const applyFilters = () => { setShowFilters(false); };
    const handleActionSheet = (index, type) => {
        let options, setter;
        switch (type) {
          case 'light': [options, setter] = [lightOptions, setLight]; break;
          case 'grwhstle': [options, setter] = [grwhstleOptions, setGrwhstle]; break;
          case 'winterLowTemp': [options, setter] = [winterLowTempOptions, setWinterLowTemp]; break;
          case 'waterSupply': [options, setter] = [waterSupplyOptions, setWaterSupply]; break;
          default: return;
        }
        if (index === options.length - 1) return;
        setter(options[index].value);
    };
    const getSelectedLabel = (value, options) => options.find(o => o.value === value)?.label || "선택하세요";
    const getImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/100';
        const imageUrls = url.split('|');
        return imageUrls[0].startsWith('http') ? imageUrls[0] : `http://www.nongsaro.go.kr${imageUrls[0]}`;
    };
    const getItemTitleStyle = (title) => title && title.length > 5 ? [styles.itemTitle, { paddingLeft: 2 }] : styles.itemTitle;


    return (
        <View style={styles.container}>
            <View style={styles.contentBox}>
                <TouchableOpacity style={styles.aiCamButton} onPress={() => navigation.navigate('AI_Cam')}><Image source={require('../../../assets/AI.png')} style={styles.aiCamButtonIcon} /></TouchableOpacity>
                <Text style={styles.title}> 식물 검색</Text>
                <Text style={styles.sub1}>  조건에 맞는 식물을 찾아보세요</Text>
                <View style={styles.searchRow}>
                    <TextInput style={[styles.input, { paddingLeft: 20 }]} placeholder="식물명을 입력하세요" placeholderTextColor="#808080" value={sText} onChangeText={setSText}/>
                    <TouchableOpacity style={styles.conditionButton} onPress={() => setShowFilters(true)}><Image source={require('../../../assets/filter_button.png')} style={styles.conditionButtonImage} /></TouchableOpacity>
                </View>

                <RecommendTab
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onRecommendPress={handleRecommendTabPress}
                    setSText={setSText}
                    styles={styles}
                />

                <Modal visible={showFilters} animationType="slide" transparent={true} onRequestClose={() => setShowFilters(false)}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>조건 검색</Text>
                            <View style={styles.filterBox}><View style={styles.filterRow}><Text style={styles.filterLabel}>광도 요구</Text><TouchableOpacity onPress={() => lightActionSheetRef.current.show()}><Text style={styles.filterValue}>{getSelectedLabel(light, lightOptions)}</Text></TouchableOpacity></View></View>
                            <View style={styles.filterBox}><View style={styles.filterRow}><Text style={styles.filterLabel}>생육 형태</Text><TouchableOpacity onPress={() => grwhstleActionSheetRef.current.show()}><Text style={styles.filterValue}>{getSelectedLabel(grwhstle, grwhstleOptions)}</Text></TouchableOpacity></View></View>
                            <View style={styles.filterBox}><View style={styles.filterRow}><Text style={styles.filterLabel}>겨울 최저온도</Text><TouchableOpacity onPress={() => winterLowTempActionSheetRef.current.show()}><Text style={styles.filterValue}>{getSelectedLabel(winterLowTemp, winterLowTempOptions)}</Text></TouchableOpacity></View></View>
                            <View style={styles.filterBox}><View style={styles.filterRow}><Text style={styles.filterLabel}>물주기</Text><TouchableOpacity onPress={() => waterSupplyActionSheetRef.current.show()}><Text style={styles.filterValue}>{getSelectedLabel(waterSupply, waterSupplyOptions)}</Text></TouchableOpacity></View></View>
                            <TouchableOpacity style={styles.modalCloseButton} onPress={applyFilters}><Text style={styles.modalCloseButtonText}>적용하기</Text></TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                
                <ActionSheet ref={lightActionSheetRef} title={"광도 요구"} options={lightOptions.map(o => o.label)} cancelButtonIndex={4} onPress={(i) => handleActionSheet(i, 'light')} />
                <ActionSheet ref={grwhstleActionSheetRef} title={"생육 형태"} options={grwhstleOptions.map(o => o.label)} cancelButtonIndex={7} onPress={(i) => handleActionSheet(i, 'grwhstle')} />
                <ActionSheet ref={winterLowTempActionSheetRef} title={"겨울 최저온도"} options={winterLowTempOptions.map(o => o.label)} cancelButtonIndex={6} onPress={(i) => handleActionSheet(i, 'winterLowTemp')} />
                <ActionSheet ref={waterSupplyActionSheetRef} title={"물주기"} options={waterSupplyOptions.map(o => o.label)} cancelButtonIndex={5} onPress={(i) => handleActionSheet(i, 'waterSupply')} />

                <View style={styles.resultsBox}>
                    {loading || isRecommendLoading ? (
                        <ActivityIndicator size="large" color="#478C21" style={{ marginTop: 50 }} />
                    ) : (
                        <FlatList
                            data={allResults}
                            keyExtractor={(item, index) => item.id ? item.id.toString() : item.cntntsNo ? item.cntntsNo.toString() : index.toString()}
                            renderItem={({ item }) => {
                                if (activeTab === 'recommend') {
                                    return (
                                        <View style={styles.itemContainer}>
                                            <TouchableOpacity onPress={() => handleItemClick(item)} style={styles.item}> 
                                                <Image source={{ uri: getRecommendedImageUrl(item.imageUrl) }} style={styles.itemImage} />
                                                <Text style={getItemTitleStyle(item.name)}>{item.name}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                } else {
                                    return (
                                        <View style={styles.itemContainer}>
                                            <TouchableOpacity onPress={() => handleItemClick(item)} style={styles.item}>
                                                <Image source={{ uri: getImageUrl(item.rtnFileUrl) }} style={styles.itemImage} />
                                                <Text style={getItemTitleStyle(item.cntntsSj)}>{item.cntntsSj}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                }
                            }}
                            ListEmptyComponent={<Image source={require('../../../assets/Nonresult.png')} style={styles.noResultsImage} />}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};
export default SearchScreen;