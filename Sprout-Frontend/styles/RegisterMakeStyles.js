import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        bottom: 1.5,
    },////뒤로가기버튼//////
    backButton: {
        position: 'absolute',
        top: 48,
        left: 22,
        zIndex: 1, // 다른 요소 위에 표시되도록
    },
    backIcon: {
        width: 27,
        height: 27,
        resizeMode: 'contain',
    },////////////////////    
    logo: {
        width: 150,
        height: 105,
        marginTop: 30,
        marginBottom: 10,
    },
    headerText: {
        color: '#405623',
        fontSize: 22,
        fontWeight: 'medium',
        marginBottom: 20,
    },
    inputContainer: {
        width: '85%',
        marginBottom: 10,
        position: 'relative',
    },
    nameInput: {
        width: '100%',
        height: 50,
        paddingLeft: 20,
        paddingRight: 60, // check 버튼 공간 확보
        borderRadius: 60,

        backgroundColor: '#fff', // 배경색 추가 (필수)
        elevation: 11.5, // ✅ 안드로이드 그림자 효과
        shadowColor: '#000', // ✅ iOS 그림자 색상
        shadowOffset: { width: 0, height: 4 }, // ✅ iOS 그림자 방향
        shadowOpacity: 0.15, // ✅ iOS 그림자 투명도
        shadowRadius: 6, // ✅ iOS 그림자 퍼짐 정도
    },
    nameInputBackground: {
        width: 100,
        height: 100,
    },
    emailInput: {
        width: '100%',
        height: 50,
        paddingLeft: 20,
        paddingRight: 60, // check 버튼 공간 확보
        borderRadius: 60,
        backgroundColor: '#fff', // 배경색 추가 (필수)
        elevation: 11.5, // ✅ 안드로이드 그림자 효과
        shadowColor: '#000', // ✅ iOS 그림자 색상
        shadowOffset: { width: 0, height: 4 }, // ✅ iOS 그림자 방향
        shadowOpacity: 0.15, // ✅ iOS 그림자 투명도
        shadowRadius: 6, // ✅ iOS 그림자 퍼짐 정도
    },
    passwordInput: {
        width: '100%',
        height: 50,
        paddingLeft: 20,
        borderRadius: 60,
        backgroundColor: '#fff', // 배경색 추가 (필수)
        elevation: 11.5, // ✅ 안드로이드 그림자 효과
        shadowColor: '#000', // ✅ iOS 그림자 색상
        shadowOffset: { width: 0, height: 4 }, // ✅ iOS 그림자 방향
        shadowOpacity: 0.15, // ✅ iOS 그림자 투명도
        shadowRadius: 6, // ✅ iOS 그림자 퍼짐 정도
    },
    passwordConfirmationInput: {
        width: '100%',
        height: 50,
        paddingLeft: 20,
        paddingRight: 60, // check 버튼 공간 확보
        borderRadius: 60,
        backgroundColor: '#fff', // 배경색 추가 (필수)
        elevation: 11.5, // ✅ 안드로이드 그림자 효과
        shadowColor: '#000', // ✅ iOS 그림자 색상
        shadowOffset: { width: 0, height: 4 }, // ✅ iOS 그림자 방향
        shadowOpacity: 0.15, // ✅ iOS 그림자 투명도
        shadowRadius: 6, // ✅ iOS 그림자 퍼짐 정도
    },
    checkButtonInside: {
        position: 'absolute',
        right: 10,
        top: 10,
        width: 50,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#68876A', // 배경색 추가 (필수)
        elevation: 11.5, // ✅ 안드로이드 그림자 효과
        shadowColor: '#000', // ✅ iOS 그림자 색상
        shadowOffset: { width: 0, height: 4 }, // ✅ iOS 그림자 방향
        shadowOpacity: 0.15, // ✅ iOS 그림자 투명도
        shadowRadius: 6, // ✅ iOS 그림자 퍼짐 정도
    },
    checkButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        
    },
    verifyButtonInside: {
        position: 'absolute',
        right: 10,
        top: 10,
        width: 50,
        height: 30,
        backgroundColor: '#405623',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 11.5, // ✅ 안드로이드 그림자 효과
        shadowColor: '#000', // ✅ iOS 그림자 색상
        shadowOffset: { width: 0, height: 4 }, // ✅ iOS 그림자 방향
        shadowOpacity: 0.2, // ✅ iOS 그림자 투명도
        shadowRadius: 6, // ✅ iOS 그림자 퍼짐 정도
        
    },
    verifyButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    messageText: {
        fontSize: 14,
        marginTop: 5,
        color: '#d32f2f',
    },
    button: {
        width: 200,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
      backgroundColor: '#405623',
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 60,
      marginBottom: 20,
      marginTop: 14,
      elevation: 3, // ✅ 안드로이드 그림자 효과
      shadowColor: '#000', // ✅ iOS 그림자 색상
      shadowOffset: { width: 0, height: 4 }, // ✅ iOS 그림자 방향
      shadowOpacity: 0.1, // ✅ iOS 그림자 투명도
      shadowRadius: 4, // ✅ iOS 그림자 퍼짐 정도
    },
    buttonText: {
        alignItems: 'center',
        color: '#fff',
        fontSize: 19,
        fontWeight: '600',
      },
    footer: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        padding: 25,
        bottom: -5,
        justifyContent: 'center', // 세로 중앙 정렬
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#868585',
    },
});
