import { StyleSheet } from 'react-native';
import colors from '../../../styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: colors.text_color,
    fontWeight: 400,
    marginBottom: 120,
  },
  body_container: {
    width: '100%',
  },
});
