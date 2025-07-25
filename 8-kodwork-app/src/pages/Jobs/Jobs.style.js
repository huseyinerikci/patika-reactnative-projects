import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1 },
  err_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  err_text: {
    fontSize: 20,
    backgroundColor: 'red',
    padding: 10,
    color: 'white',
    borderRadius: 5,
  },
});
