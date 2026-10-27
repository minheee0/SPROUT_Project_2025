import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F1F1F1',
    paddingTop: 70,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationsContainer: {
    paddingTop: 10,
    paddingBottom: 20, // ScrollView 끝에서 여백 추가
  },
  notificationCard: {
    backgroundColor: '#F1F1F1',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'visible', // 이 스타일로 그림자가 잘리지 않게 설정
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#32720F',
  },
  notificationContent: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
  },
  notificationActions: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  readButton: {
    backgroundColor: '#32720F',
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: '#a8a8a8',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
});

