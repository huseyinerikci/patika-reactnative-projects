import { Dimensions, StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: {
    width: '100%',
    height: Dimensions.get('window').height / 3,
    resizeMode: 'cover',
  },
  body_container: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#A5292A',
    marginBottom: 2,
  },
  area: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    fontWeight: '600',
    color: '#A5292A',
  },
  line: {
    borderWidth: 0.5,
    borderColor: 'gray',
    marginVertical: 8,
    width: '100%',
  },
  desc: {
    fontSize: 14,
    color: '#222',
    lineHeight: 22,
    marginBottom: 16,
  },
  btn: {
    margin: 20,
    backgroundColor: '#FF0000',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  btn_text: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
