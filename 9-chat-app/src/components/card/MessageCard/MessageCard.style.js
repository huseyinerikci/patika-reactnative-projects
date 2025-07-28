import { StyleSheet } from 'react-native';
import colors from '../../../styles/color';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.drakgreen,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  inner_container: { flexDirection: 'row', justifyContent: 'space-between' },
  user: { color: 'white', fontSize: 13 },
  date: { color: 'white' },
  title: {
    color: 'white',
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 14,
  },
  dislike_count_container: {
    backgroundColor: colors.drakgreen,
    padding: 3,
    borderRadius: 20,
  },
  dislike_container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  dislike_text: {
    color: colors.drakgreen,
    fontWeight: 'bold',
  },
  dislike_count_text: {
    color: 'white',
    fontWeight: 'bold',
    borderRadius: 50,
  },
  footer: {
    justifyContent: 'flex-end',
  },
});
