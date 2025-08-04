import { StyleSheet } from 'react-native';
import colors from '../../../styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.text_color,
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
  user: { color: 'gray', fontSize: 13 },
  date: { color: 'gray', fontStyle: 'italic' },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
