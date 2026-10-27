import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 22,
    zIndex: 1,
  },
  backIcon: {
    width: 27,
    height: 27,
    resizeMode: 'contain',
  },
  logo: {
    width: 1000,
    height: 200,
    marginBottom: 8,
  },
  title: {
    color: '#438E1A',
    fontSize: 22,
    fontWeight: 'medium',
    marginBottom: 50,
  },
  button: {
    marginBottom: 140,
  },
  buttonImage: {
    width: 208.33,
    height: 66.67,
  },
  footer: {
    fontSize: 13,
    color: '#868585',
    position: 'absolute',
    bottom: 22,
  },
});