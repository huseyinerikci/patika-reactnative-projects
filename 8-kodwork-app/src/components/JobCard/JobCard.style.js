import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  body_container: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  loc: {
    backgroundColor: 'red',
    alignSelf: 'flex-start',
    color: 'white',
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 20,
    marginVertical: 4,
    fontWeight: 'bold',
  },
  pos: {
    textAlign: 'right',
    color: 'red',
    fontWeight: 600,
    letterSpacing: 1.1,
    fontSize: 12,
  },
  rmv_btn: {
    marginTop: 10,
  },
});
