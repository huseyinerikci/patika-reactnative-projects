import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { backgroundColor: 'orange' },
  body_container: {
    margin: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    backgroundColor: '#eceff1',
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 50,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 20,
  },
});
