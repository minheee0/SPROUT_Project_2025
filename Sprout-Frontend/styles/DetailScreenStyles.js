import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        flexGrow: 1,
        backgroundColor: '#405623',
    },
    backButton: {
        position: 'absolute',
        marginTop: 25, // 버튼 위치 조정
        left: -5,
        zIndex: 1, 
    },
    backButtonImage: {
        width: 45,
        height: 45,
        tintColor: '#252925ff', // 진한 색상 적용
    },
    imageContainer: {
        alignItems: 'center', 
        marginTop: 45,
        marginBottom: 10,  // 🔽 이미지 아래 간격을 줄임

    },
    image: {
        width: wp('75%'),
        height: wp('75%'),
        borderRadius: 45,
    },
    titleContainer: {
        borderTopLeftRadius: 45, 
        borderTopRightRadius: 45, 
        borderBottomLeftRadius: 45, 
        borderBottomRightRadius: 45, 
        backgroundColor: '#344221',  // 배경색 추가
        padding: 10,
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFFFFF',
    },
    detailContainer: {
        borderRadius: 45,
        backgroundColor: '#E9EAC7',  // 배경색 추가
        padding: 15,
    },
    detailBox: {
        backgroundColor: '#FBFBEA',  // 박스 배경색
        borderRadius: 40,  // 각 박스의 radius
        padding: 10,
        marginBottom: 10,
        shadowColor: "#000",  // 그림자 추가
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,  // 안드로이드에서 그림자 적용
    },
    detailText: {
        color: '#344221',
        fontWeight: '500', 
        marginBottom: 10,
        fontSize: 20,
        textAlign: 'center',
    },
});

export default styles;
