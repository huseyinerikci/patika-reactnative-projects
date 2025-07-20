import { Dimensions, StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#64b5f6' },
  logo_container: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height / 3,
    resizeMode: 'contain',
  },
  body_container: {
    flex: 1,
    margin: 10,
    marginVertical: 60,
    marginTop: -40,
  },
});
