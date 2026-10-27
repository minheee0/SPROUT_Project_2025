import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    Modal,
    TextInput,
    Pressable,
    ScrollView,
    Button,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import * as FileSystem from 'expo-file-system/legacy'; // Base64 인코딩을 위해 필요
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import styles from '../../styles/DiaryScreenStyles';

// 백엔드 API 주소
const API_BASE_URL = "http://54.224.76.10:9090";

// 로그인된 사용자의 인증 토큰을 가져오는 함수
const getAuthToken = async () => {
    return await AsyncStorage.getItem('authToken');
};

// 상수 정의
const waterLevels = [
    { id: 'a', label: '적어요', off: require('../../assets/water-a-off.png'), on: require('../../assets/water-a-on.png') },
    { id: 'b', label: '보통이에요', off: require('../../assets/water-b-off.png'), on: require('../../assets/water-b-on.png') },
    { id: 'c', label: '많아요', off: require('../../assets/water-c-off.png'), on: require('../../assets/water-c-on.png') },
];
const sunLevels = [
    { id: 'a', label: '적어요', off: require('../../assets/sun-a-off.png'), on: require('../../assets/sun-a-on.png') },
    { id: 'b', label: '보통이에요', off: require('../../assets/sun-b-off.png'), on: require('../../assets/sun-b-on.png') },
    { id: 'c', label: '많아요', off: require('../../assets/sun-c-off.png'), on: require('../../assets/sun-c-on.png') },
];
const INITIAL_FORM_STATE = {
    id: null, name: '', image: null, water: 'a', sun: 'a', wateringInterval: null, isIotConnected: false,
};

// API 데이터 형식 <-> 앱 내부 상태 형식 변환 헬퍼
const codeMapping = { a: 0, b: 1, c: 2 };
const reverseCodeMapping = { 0: 'a', 1: 'b', 2: 'c' };
const waterIdToCode = (id) => codeMapping[id] ?? 0;
const sunIdToCode = (id) => codeMapping[id] ?? 0;
const waterCodeToId = (code) => reverseCodeMapping[code] ?? 'a';
const sunCodeToId = (code) => reverseCodeMapping[code] ?? 'a';

export default function DiaryScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    // 상태 정의
    const [plantData, setPlantData] = useState([]);
    const [memos, setMemos] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [form, setForm] = useState(INITIAL_FORM_STATE);
    const [wateringDayVisible, setWateringDayVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [memoText, setMemoText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    // ✅ 아래 2줄 추가
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [isCalendarExpanded, setIsCalendarExpanded] = useState(true); // 캘린더 확장/축소 상태
    const [lastCalendarTap, setLastCalendarTap] = useState(0); // 더블 탭 감지를 위한 마지막 탭 시간

    const [lastTappedDate, setLastTappedDate] = useState(null);
    const [lastTappedTime, setLastTappedTime] = useState(0);

    // API로부터 식물 데이터를 로드하는 함수
    const loadPlantData = async () => {
        try {
            const token = await getAuthToken();
            if (!token) {
                console.log("로그인이 필요하여 식물 목록을 불러오지 않습니다.");
                setPlantData([]);
                return;
            }
            const response = await fetch(`${API_BASE_URL}/plants`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch plants.');
            const plantsFromApi = await response.json();
            const formattedPlants = plantsFromApi.map(plant => ({
                id: plant.id.toString(), name: plant.name, image: plant.imageUrl,
                wateringInterval: plant.waterCycleDays, water: waterCodeToId(plant.waterCycleCode),
                sun: sunCodeToId(plant.lightExposureCode), isIotConnected: false,
            }));
            setPlantData(formattedPlants);
        } catch (e) {
            console.error('Failed to load plant data from server.', e);
            Alert.alert('오류', '식물 데이터를 불러오는 데 실패했습니다.');
        }
    };

    // 모든 메모를 한 번에 불러오는 함수
    const loadAllMemos = async () => {
        const token = await getAuthToken();
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/growth-logs/all`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) throw new Error('Failed to fetch all memos.');

            const allMemosFromApi = await response.json();

            const memosObject = {};
            allMemosFromApi.forEach(memo => {
                if (memo.logDate) {
                    const [year, month, day] = memo.logDate;
                    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    memosObject[formattedDate] = memo.memo || '';
                }
            });

            setMemos(memosObject);
        } catch (e) {
            console.error('Failed to load all memos from server.', e);
        }
    };

    // 메모 삭제 함수
    const deleteMemo = async () => {
        const token = await getAuthToken();
        if (!token) {
            Alert.alert("인증 오류", "로그인이 필요합니다.");
            return;
        }
        if (!selectedDate) return;

        try {
            const response = await fetch(`${API_BASE_URL}/growth-logs?date=${selectedDate}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) throw new Error('메모 삭제에 실패했습니다.');

            setMemos(prev => {
                const newMemos = { ...prev };
                delete newMemos[selectedDate];
                return newMemos;
            });

            setShowModal(false);
            setMemoText('');
            // 메모 삭제 성공 알림 추가
            Alert.alert('성공', '메모가 삭제되었습니다.');
        } catch (e) {
            console.error('Failed to delete memo.', e);
            Alert.alert('오류', '메모 삭제 중 오류가 발생했습니다.');
        }
    };

    // ✅ 식물 등록: handlePlantSubmit 함수 (Base64 방식으로 수정됨)
    const handlePlantSubmit = useCallback(async () => {

        const token = await getAuthToken();
        if (!token) {
            Alert.alert("인증 오류", "로그인이 필요합니다.");
            return;
        }

        // 1. 유효성 검사 (이미지 포함 필수)
        if (!form.name || !form.water || !form.sun || !form.image) {
            Alert.alert('알림', '모든 정보를 입력해주세요! (사진 포함)');
            return;
        }

        let base64Image = null;
        let filename = null;
        let fileType = null;

        // 2. 이미지가 로컬 파일인 경우 Base64로 인코딩
        if (form.image && form.image.startsWith('file://')) {
            try {
                // 💡 FileSystem을 사용하여 이미지 URI를 Base64 문자열로 변환합니다.
                base64Image = await FileSystem.readAsStringAsync(form.image, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                // 파일명과 타입 추출 (백엔드에서 사용될 수 있음)
                filename = form.image.split('/').pop();
                // 파일 확장자에 따라 동적으로 type을 설정할 수 있지만, 여기서는 안전하게 jpeg로 가정
                fileType = 'image/jpeg';
            } catch (e) {
                console.error("Base64 인코딩 실패:", e);
                Alert.alert("오류", "이미지를 처리하는 데 실패했습니다.");
                return;
            }
        }

        // 3. JSON DTO 객체 생성 (Base64 데이터 포함)
        // 이 객체가 fetch의 body로 JSON 형태로 전송됩니다.
        const plantDto = {
            id: form.id,
            name: form.name,
            waterCycleDays: form.wateringInterval || 0,
            waterCycleCode: waterIdToCode(form.water),
            lightExposureCode: sunIdToCode(form.sun),
            // 수정 시 기존 URL은 imageUrl에 유지 (새 파일 등록 시에는 null)
            imageUrl: (form.image && !form.image.startsWith('file://')) ? form.image : null,

            // 💡💡 Base64 전송을 위한 3가지 필드 추가 💡💡
            base64Image: base64Image,
            fileName: filename,
            fileType: fileType
        };

        try {
            // 4. fetch를 사용하여 JSON Body로 전송합니다.
            const response = await fetch(`${API_BASE_URL}/plants`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // 💡 Content-Type을 'application/json'으로 명시합니다.
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(plantDto), // 💡 DTO 전체를 JSON 문자열로 전송
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`서버 응답 오류 (HTTP ${response.status}):`, errorText);

                Alert.alert("요청 실패", `등록 중 오류가 발생했습니다: HTTP ${response.status}. 서버 로그를 확인하세요.`);
                throw new Error(`서버 응답 오류 (HTTP ${response.status})`);
            }

            // 응답 본문 처리
            try { await response.json(); } catch (e) { /* 본문이 없을 수 있음 */ }

            Alert.alert('성공', `식물 정보가 성공적으로 ${form.id ? '수정' : '등록'}되었습니다.`);

            setModalVisible(false);
            resetForm();
            await loadPlantData();

        } catch (e) {
            console.error(`식물 등록/수정 실패:`, e);
            Alert.alert("요청 실패", `등록 중 오류가 발생했습니다: ${e.message}`);
        }
    }, [form]);

    // 앱 시작 및 화면 포커스 시 데이터 로딩
    useEffect(() => {
        const loadAllData = () => {
            loadPlantData();
            loadAllMemos();
        };

        const unsubscribe = navigation.addListener('focus', loadAllData);

        loadAllData();

        (async () => {
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            await Notifications.requestPermissionsAsync();
        })();

        return unsubscribe;
    }, [navigation]);

    // 날짜 선택 핸들러
    const onDayPress = async (day) => {
        const dateStr = day.dateString;

        setSelectedDate(dateStr);

        const token = await getAuthToken();
        if (!token) {
            Alert.alert("인증 오류", "로그인이 필요합니다.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/growth-logs?date=${dateStr}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setMemoText(data.memo || '');
            } else {
                setMemoText('');
            }
        } catch (e) {
            setMemoText('');
        } finally {
            setShowModal(true);
        }
    };

    // 날짜별 식물 메모 등록
    const handleMemoSave = async () => {
        const token = await getAuthToken();
        if (!token) {
            Alert.alert("인증 오류", "로그인이 필요합니다.");
            return;
        }
        if (!selectedDate) return;
        try {
            const response = await fetch(`${API_BASE_URL}/growth-logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ memo: memoText, logDate: selectedDate }),
            });
            if (!response.ok) throw new Error('메모 저장에 실패했습니다.');

            // 메모가 삭제되는 경우 (memoText가 비어있을 때) 상태를 업데이트
            if (!memoText) {
                setMemos(prev => {
                    const newMemos = { ...prev };
                    delete newMemos[selectedDate];
                    return newMemos;
                });
            } else {
                setMemos(prev => ({
                    ...prev,
                    [selectedDate]: memoText
                }));
            }

            setShowModal(false);
            // 메모 저장 성공 알림 추가
            Alert.alert('성공', '메모가 저장되었습니다.');
        } catch (e) {
            Alert.alert('오류', '메모 저장 중 오류가 발생했습니다.');
        }
    };

    // 캘린더 날짜 컴포넌트
    const renderDayComponent = ({ date, state }) => {
        const dateStr = date.dateString;
        const hasMemo = memos[dateStr] !== undefined && memos[dateStr].trim() !== '';

        // ✅ 'hasMemo' 조건에 따라 글자 색상을 결정하는 로직 추가
        const textColor = hasMemo ? 'white' : (state === 'disabled' ? '#d9e1e8' : '#2d4150');

        return (
            <TouchableOpacity onPress={() => onDayPress(date)}>
                <View style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
                    {/* 오늘 날짜이든 아니든 메모가 있을 경우 이모티콘을 표시 */}
                    {hasMemo && (
                        <Image
                            source={require('../../assets/sprout.png')}
                            style={{
                                position: 'absolute',
                                width: 30,
                                height: 30,
                                opacity: 0.8,
                                zIndex: 2, // ✅ 이모티콘을 가장 앞으로 가져옵니다.
                            }}
                        />
                    )}
                    {/* ✅ 수정: 오늘 날짜 스타일과 일반 날짜 스타일을 분리해서 적용 */}
                    {state === 'today' ? (
                        <View style={{ ...styles.todayContainer, zIndex: 1 }}>
                            {/* ✅ 메모가 있을 경우 오늘 날짜도 흰색으로 변경 */}
                            <Text style={[styles.todayText, hasMemo && { color: 'white' }]}>
                                {date.day}
                            </Text>
                        </View>
                    ) : (
                        <Text style={{
                            color: textColor, // ✅ 위에서 계산된 textColor 변수 적용
                            fontWeight: 'normal',
                            // ✅ zIndex 추가: sprout 이미지 위에 숫자가 보이도록 함
                            zIndex: 3,
                        }}>
                            {date.day}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    };
    // 헬퍼 함수들
    const resetForm = () => {
        setForm(INITIAL_FORM_STATE);
        setIsEditing(false);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });
        if (!result.canceled) {
            setForm(prev => ({ ...prev, image: result.assets[0].uri }));
        }
    };

    const openAddModal = () => {
        resetForm();
        setModalVisible(true);
    };

    const openEditModal = (plant) => {
        setIsEditing(true);
        setForm(plant);
        setDetailVisible(false);
        setShowOptions(false);
        setModalVisible(true);
    };

    const openDetailModal = useCallback((plant) => {
        setSelectedPlant(plant);
        setDetailVisible(true);
    }, []);

    // 식물 삭제 함수
    const deletePlant = (plantId) => {
        // 삭제 확인 알림 추가
        Alert.alert("삭제 확인", "정말로 이 식물을 삭제하시겠습니까?", [
            { text: "취소", style: "cancel" },
            {
                text: "삭제",
                onPress: async () => {
                    const token = await getAuthToken();
                    if (!token) {
                        Alert.alert("인증 오류", "로그인이 필요합니다.");
                        return;
                    }
                    try {
                        const response = await fetch(`${API_BASE_URL}/plants/delete?id=${plantId}`, {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` },
                        });
                        if (!response.ok) throw new Error('삭제에 실패했습니다.');

                        Alert.alert('성공', '식물이 삭제되었습니다.');
                        setDetailVisible(false);
                        setShowOptions(false);
                        await loadPlantData();
                    } catch (e) {
                        Alert.alert('오류', '삭제 중 오류가 발생했습니다.');
                    }
                },
                style: "destructive"
            }
        ]);
    };

    // ✅ 아래 함수 전체 추가
    const handleCalendarDoubleTap = () => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300; // 300ms 안에 두 번 탭하면 더블 탭으로 인식

        if (now - lastCalendarTap < DOUBLE_TAP_DELAY) {
            setIsCalendarExpanded(prevState => !prevState); // 상태를 반전 (접기/펼치기)
        }
        setLastCalendarTap(now);
    };

    const renderItem = useCallback(({ item }) => {
        // ⭐️⭐️ 수정: DB 경로와 API_BASE_URL을 결합하여 전체 URL 생성 ⭐️⭐️
        const imageUrlPath = item.image; 
        
        // 💡 캐시 무효화를 위해 현재 시간을 쿼리 파라미터로 추가
        const cacheBuster = Date.now();
        
        // 쿼리 파라미터가 추가된 완전한 URL 생성
        const fullImageUrl = imageUrlPath 
            ? `${API_BASE_URL}${imageUrlPath}?v=${cacheBuster}` 
            : null; 


        return (
            <TouchableOpacity onPress={() => openDetailModal(item)} style={styles.card}>
                <View style={styles.infoContainer}>
                    <Image source={{ uri: fullImageUrl }} style={styles.imagePlaceholder} />
                    <Text style={styles.name}>{item.name}</Text>
                </View>
                <View style={styles.iconsContainer}>
                    <Image source={waterLevels.find(w => w.id === item.water)?.on} style={styles.icon} />
                    <Image source={sunLevels.find(s => s.id === item.sun)?.on} style={styles.icon} />
                </View>
            </TouchableOpacity>
        );
    }, [openDetailModal]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>내 식물 관리</Text>
                    <Text style={styles.subtitle}>새 식물을 등록하고 성장 이야기를 기록해요</Text>
                </View>
                <TouchableOpacity onPress={openAddModal}>
                    <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
            </View>


            {/* Calendar */}
            {/* ✅ TouchableWithoutFeedback으로 전체를 감싸서 탭 이벤트를 감지합니다. */}
            <TouchableWithoutFeedback onPress={handleCalendarDoubleTap}>
                <View style={styles.calendarContainer}>
                    {isCalendarExpanded ? (
                        // 💡 텍스트와 캘린더를 함께 묶기 위한 View 추가
                        <View>
                            {/* 💡 안내 문구 Text 추가 */}
                            <Text style={styles.calendarInfoText}>
                                * 두번 터치하여 접기
                            </Text>
                            <Calendar
                                monthFormat={'yyyy년 MM월'} // ✅ 이 prop을 추가하세요.
                                onDayPress={onDayPress}
                                theme={{
                                    monthTextColor: '#344221',
                                    arrowColor: '#68876A',
                                    textSectionTitleColor: '#344221',
                                    todayTextColor: '#FFA726',
                                    selectedDayBackgroundColor: '#405623',
                                    selectedDayTextColor: '#ffffff',
                                    dayTextColor: '#2d4150',
                                    textMonthFontWeight: 'bold',
                                    textDayFontSize: 16,
                                }}
                                dayComponent={({ date, state }) => {
                                    const dateKey = date.dateString;
                                    const hasMemo = memos[dateKey] !== undefined && memos[dateKey].trim() !== '';

                                    return (
                                        <TouchableOpacity onPress={() => onDayPress(date)}>
                                            <View style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
                                                {hasMemo && (
                                                    <Image
                                                        source={require('../../assets/sprout.png')}
                                                        style={{
                                                            position: 'absolute',
                                                            width: 30,
                                                            height: 30,
                                                            opacity: 0.8,
                                                            zIndex: 2,
                                                        }}
                                                    />
                                                )}
                                                {state === 'today' ? (
                                                    <View style={{ ...styles.todayContainer, zIndex: 1 }}>
                                                        <Text style={styles.todayText}>{date.day}</Text>
                                                    </View>
                                                ) : (
                                                    <Text style={{
                                                        color: state === 'disabled' ? '#d9e1e8' : '#2d4150',
                                                        fontWeight: 'normal',
                                                    }}>
                                                        {date.day}
                                                    </Text>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>
                    ) : (
                        // ✅ isCalendarExpanded가 false일 때, 새로 만든 축소된 뷰를 보여줍니다.
                        <View style={styles.collapsedCalendar}>
                            {/* diary.png 이미지 추가 */}
                            <Image
                                source={require('../../assets/diary.png')} // assets 폴더 내 경로에 맞게 수정해주세요
                                style={styles.collapsedCalendarIcon} // 아이콘 스타일 적용
                            />
                            <View style={styles.textContainer}>
                                <Text style={styles.collapsedCalendarText}>
                                    {format(new Date(), 'yyyy년 MM월 dd일')}
                                </Text>
                                <Text style={styles.calendarInfoText}>
                                    * 두번 터치하여 열기
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>

            {/* Memo Modal */}
            <Modal visible={showModal} transparent={true} animationType="slide" onRequestClose={() => setShowModal(false)}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalBackdrop}>
                        <View style={styles.modalView}>
                            {selectedDate && <Text style={styles.modalTitle}>{format(new Date(selectedDate), 'yyyy년 MM월 dd일')} 메모</Text>}
                            <TextInput
                                multiline
                                style={styles.input}
                                value={memoText}
                                onChangeText={setMemoText}
                                placeholder="오늘의 식물 상태를 기록해보세요."
                            />
                            <View style={styles.buttonRow}>
                                <Button title="저장" color="#405623" onPress={handleMemoSave} />
                                <Button title="취소" color="#6d9140ff" onPress={() => setShowModal(false)} />
                                {memos[selectedDate] && (
                                    <Button title="삭제" color="orange" onPress={() => deleteMemo()} />
                                )}
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Plant List */}
            <View style={styles.plantListContainer}>
                <FlatList
                    data={plantData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={<Text style={styles.emptyListText}>+ 버튼을 눌러 첫 식물을 등록해 보세요!</Text>}
                />
            </View>

            {/* Plant Add/Edit Modal */}
            <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => { setModalVisible(false); resetForm(); }}>
                <View style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => { setModalVisible(false); resetForm(); }}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>{isEditing ? '식물 정보 수정' : '새 식물 등록'}</Text>
                        <TouchableOpacity onPress={pickImage} style={styles.imageTouchable}>
                            {form.image ?
                                // ⭐️⭐️ 수정된 부분: 서버 URL일 때 캐시 무효화 쿼리 추가 ⭐️⭐️
                                <Image 
                                    source={{ 
                                        // form.image가 http://로 시작하지 않고 /images/... 경로일 때 API_BASE_URL을 붙여야 함
                                        uri: form.image.startsWith('file://') || form.image.startsWith('data:') 
                                            ? form.image 
                                            : `${API_BASE_URL}${form.image}?v=${Date.now()}` // 💡 서버 URL에 캐시 무효화 적용
                                    }} 
                                    style={styles.imagePreview} 
                                /> :
                                <View style={styles.imageButton}>
                                    <Ionicons name="image" size={24} color="white" />
                                    <Text style={styles.imageButtonText}>식물 사진</Text>
                                </View>
                            }
                        </TouchableOpacity>
                        <Text style={styles.label}>식물 이름</Text>
                        <TextInput
                            style={styles.input}
                            value={form.name}
                            onChangeText={(text) => setForm(p => ({ ...p, name: text }))}
                        />
                        <Text style={styles.label}>물 주기 간격</Text>
                        <TouchableOpacity onPress={() => setWateringDayVisible(!wateringDayVisible)} style={styles.selectButton}>
                            <Text style={styles.selectButtonText}>
                                {form.wateringInterval ? `${form.wateringInterval}일 간격` : '선택하기'}
                            </Text>
                        </TouchableOpacity>
                        {wateringDayVisible && (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {[1, 2, 3, 4, 5, 6, 7, 10, 14].map(day => (
                                    <TouchableOpacity
                                        key={day}
                                        onPress={() => {
                                            setForm(p => ({ ...p, wateringInterval: day }));
                                            setWateringDayVisible(false);
                                        }}
                                        style={styles.dayButton}
                                    >
                                        <Text style={styles.dayText}>{day}일</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                        <Text style={styles.label}>급수량</Text>
                        <View style={styles.row}>
                            {waterLevels.map(item => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => setForm(p => ({ ...p, water: item.id }))}
                                >
                                    <Image
                                        source={form.water === item.id ? item.on : item.off}
                                        style={styles.iconSelectable}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.label}>일조량</Text>
                        <View style={styles.row}>
                            {sunLevels.map(item => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => setForm(p => ({ ...p, sun: item.id }))}
                                >
                                    <Image
                                        source={form.sun === item.id ? item.on : item.off}
                                        style={styles.iconSelectable}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={handlePlantSubmit}
                            >
                                <Text style={styles.buttonText}>{isEditing ? '수정하기' : '등록하기'}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* Detail Modal */}
            <Modal visible={detailVisible} transparent animationType="fade" onRequestClose={() => setDetailVisible(false)}>
                <Pressable style={styles.modalContainer} onPress={() => setDetailVisible(false)}>
                    <Pressable style={[styles.modalContent, { alignItems: 'center' }]} onPress={(e) => e.stopPropagation()}>
                        <TouchableOpacity style={styles.optionsButton} onPress={() => setShowOptions(p => !p)}>
                            <Ionicons name="ellipsis-vertical" size={24} color="black" />
                        </TouchableOpacity>
                        {showOptions && (
                            <View style={styles.optionsMenu}>
                                <TouchableOpacity onPress={() => openEditModal(selectedPlant)}>
                                    <Text style={styles.optionItem}>✏️ 수정</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deletePlant(selectedPlant.id)}>
                                    <Text style={styles.optionItem}>🗑️ 삭제</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* ⭐️⭐️ 수정된 부분: selectedPlant?.image URL 완성 및 캐시 무효화 ⭐️⭐️ */}
                        <Image
                            source={{ 
                                uri: selectedPlant?.image 
                                    ? `${API_BASE_URL}${selectedPlant.image}?v=${Date.now()}` // 💡 여기도 수정!
                                    : undefined 
                            }} 
                            style={styles.detailImage}
                        />

                        <Text style={styles.detailName}>{selectedPlant?.name}</Text>
                        <Text style={styles.label}>물 주는 주기</Text>
                        <Text style={styles.badge}>
                            {selectedPlant?.wateringInterval ? `${selectedPlant.wateringInterval}일` : '설정 안 됨'}
                        </Text>
                        <Text style={styles.label}></Text>
                        <Image
                            source={waterLevels.find(w => w.id === selectedPlant?.water)?.on}
                            style={styles.iconSelectable}
                        />
                        <Text style={styles.label}>일조량</Text>
                        <Image
                            source={sunLevels.find(s => s.id === selectedPlant?.sun)?.on}
                            style={styles.iconSelectable}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}