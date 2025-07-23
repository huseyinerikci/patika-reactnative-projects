import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  inner_container: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  text_container: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  text: {
    color: 'red',
    fontSize: 12,
    fontWeight: '500',
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  det: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
  },
  body_container: {
    backgroundColor: 'white',
    padding: 5,
  },
  butn_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    margin: 10,
  },
});
