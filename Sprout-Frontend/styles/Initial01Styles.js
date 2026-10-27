import { StyleSheet, Dimensions, Platform } from "react-native";

// 화면 크기 가져오기
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    homeButton: {
        position: "absolute",
        top: height * 0.06, // 화면 높이에 비례한 위치
        left: width * 0.05, // 화면 너비에 비례한 위치
        zIndex: 1,
    },
    homeIcon: {
        width: 27,
        height: 27,
        resizeMode: "contain",
    },
    pagerView: {
        width: width - 1,
        height: height * 0.65,
        marginTop: height * 0.08,
        alignSelf: "center",
    },
    page: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 0,
        marginTop: Platform.OS === 'ios' ? height * 0.01 : height * 0.02,
        bottom: 10,
        height: height * 0.8,
    },
    pageText: {
        color: '#405623',
        fontSize: 35,
        fontWeight: "medium",
        position: "absolute",
        top: Platform.OS === 'ios' ? height * -0.014 : height * 0.002,
        left: width * 0.07,
        zIndex: 2,
    },
    pageText2: {
        color: '#405623',
        fontSize: 35,
        fontWeight: "medium",
        position: "absolute",
        top: Platform.OS === 'ios' ? height * 0.04 : height * 0.053,
        left: width * 0.07,
        zIndex: 2,
    },
    pageText3: {
        color: '#405623',
        fontSize: 20,
        fontWeight: "medium",
        position: "absolute",
        top: height * 0.107,
        left: width * 0.07,
        zIndex: 2,
    },

    /*---------------------------------------------------------*/

    // ✅ 2페이지 관련 코든 컨테이너 스타일 (새로 추가)
    columnContainer: {
        width: '90%',
        marginTop: height * -0.05, // 2페이지의 제목과의 전체적인 상단 간격
        alignItems: 'center', // 내부 항목들을 중앙 정렬
    },

    // 각 칸 스타일 
    columnCell: {
        width: '98%', // 부모 컨테이너(90%)의 전체 너비를 사용
        marginBottom: 14, // 각 버튼 사이의 수직 간격
    },

    cardButton2: {
        width: '100%',
        height: height * 0.106, 
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#F0F0F0', // ✅✅ 노란색에서 회색으로 수정
        alignItems: 'center',
        flexDirection: 'row', 
        paddingHorizontal: 40, // ✅✅ 아이콘 좌우 여백을 위해 수정
        // iOS 그림자
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        // Android 그림자
        elevation: 5,
    },
    // ✅✅ 텍스트를 감싸는 컨테이너 스타일 (새로 추가)
    textContainer2: {
        flexDirection: 'column',
        marginLeft: 50, // 아이콘과 텍스트 그룹 사이의 간격
    },
    // ✅✅ 메인 텍스트 스타일 수정
    cardText2: {
        fontSize: 18,
        fontWeight: '600',
        color: '#405623',
    },
    // ✅✅ 서브 텍스트 스타일 (새로 추가)
    cardSubText2: {
        fontSize: 14,
        fontWeight: '400',
        color: '#869375', // 연한 녹색/회색
        marginTop: 4, // 메인 텍스트와의 간격
    },
    // 아이콘 스타일 (기존과 동일)
    cardIcon2: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },

    /*---------------------------------------------------------*/

    // ✅ 2,3페이지 관련 코드들 (그리드 컨테이너)
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        width: '95%',
        marginTop: height * -0.04,// ✅ 이 값을 줄여서 제목과 버튼 그룹 사이의 간격을 좁혔습니다.
    },

    gridContainer2: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        width: '95%',
        marginTop: height * -0.04,// ✅ 이 값을 줄여서 제목과 버튼 그룹 사이의 간격을 좁혔습니다.
    },

    // ✅ 카드 버튼 스타일 수정: 가로 정렬 추가
    cardButton: {
        width: '100%',
        height: height * 0.12,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        alignItems: 'center',
        flexDirection: 'row', // ✅ 아이콘과 텍스트를 가로로 배치
        paddingHorizontal: -1.0, // ✅ 내용물 좌우 여백 추가
        // iOS 그림자
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        // Android 그림자
        elevation: 5,
    },


    // 그리드 각 칸의 스타일
    gridCell: {
        width: '47%',
        marginBottom: 25,
    },

    // ✅ 카드 버튼 안의 텍스트 스타일 수정: 아이콘과의 간격 확보
    cardText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#405623',
        marginLeft: -0.5, // ✅ 아이콘과 텍스트 사이의 간격
    },

    // ✅ 카드 버튼 안의 아이콘 스타일 수정
    cardIcon: {
        width: 100,  // ✅ 아이콘 너비 고정
        height: 100, // ✅ 아이콘 높이 고정
        resizeMode: 'contain',
    },

    

    /*---------------------------------------------------------*/

    button1: {
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        marginBottom: height * 0.05,
        width: width * 0.97,
        height: height * 0.19,
        top: Platform.OS === 'ios' ? height * -0.25 : height * -0.17,
    },
    button2: {
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        width: width * 0.97,
        height: height * 0.19,
        bottom: Platform.OS === 'ios' ? height * -0.08 : height * -0.16,
    },
    button3: {
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        width: width * 0.97,
        height: height * 0.19,
        bottom: Platform.OS === 'ios' ? height * -0.22 : height * -0.30,
    },

    buttonContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

        marginTop: Platform.OS === 'ios' ? height * -0.05 : height * -0.2,
        
    },
   

    buttonImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: height * 0.003,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    // 컨테이너 스타일 수정
    bottomButtonContainer: {
        flexDirection: "row",
        justifyContent: "flex-start", // 버튼을 왼쪽에 정렬
        alignItems: "center", // 수직 중앙 정렬
        marginTop: 1, // 필요 시 위쪽 여백 조정
    },
    skipButton: {
        alignSelf: "center",
        marginTop: height * 0.0000001,
        height: 100,
        paddingHorizontal: 30,
        paddingVertical: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    skipIcon: {
        width: width * 0.4,
        height: height * 0.23,
        resizeMode: "contain",
    },

    // agreeButton 스타일
    agreeButton: {
        alignSelf: "center",
        left: 60,
        marginTop: height * 0.0000001,
        marginLeft: -51.5,
        height: 100,
        paddingHorizontal: 30,
        paddingVertical: 12,
        justifyContent: "center",
        alignItems: "center",

    },
    agreeIcon: {
        width: width * 0.4,
        height: height * 0.23,
        resizeMode: "contain",
    },

    ///////안내 문구////////
    textContainer: {
        position: "absolute",
        bottom: 100, // 인디케이터 위쪽 여백 조절
        alignSelf: "center",
        alignItems: "center", // 가운데 정렬
    },
    hahaText1: {
        fontSize: 18,
        color: "#405623",
    },
    hahaText2: {
        fontSize: 18,
        color: "#405623",
    },
    ////////////////////////

    ImageAlarm: {
        width: Platform.OS === 'ios' ? 250 : 310,
        height: Platform.OS === 'ios' ? 500 : 600,
        top: Platform.OS === 'ios' ? -19 : 17,
        left: Platform.OS === 'ios' ? -2 : 0,
        bottom: Platform.OS === 'ios' ? 0 : 0,
        justifyContent: "center",
        alignItems: "center",
        resizeMode: "contain",
    },
    logo: {
        position: "absolute",
        width: 1500,
        height: 300,
        top: Platform.OS === 'ios' ? -5 : 90,
    },

    footer: {
        position: "absolute",
        bottom: height * 0.02,
        left: 0,
        right: 0,
        alignItems: "center",
    },
    footerText: {
        fontSize: 13,
        color: "#CCCCCC",
    },
});

export default styles;