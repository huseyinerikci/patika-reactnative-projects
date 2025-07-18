import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { backgroundColor: 'orange' },
  body_container: {
    position: 'relative',

    height: 200,
    margin: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  back_title: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    padding: 5,
  },
  title: {
    color: 'white',
    fontSize: 30,

    textAlign: 'right',
    fontWeight: 'bold',
  },
});
