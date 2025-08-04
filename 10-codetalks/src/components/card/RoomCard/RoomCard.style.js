import { Dimensions, StyleSheet } from 'react-native';
import colors from '../../../styles/colors';

const roomCardData = Dimensions.get('window').width / 2 - 20;

export default StyleSheet.create({
  container: {
    width: roomCardData,
    backgroundColor: colors.text_color,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  title: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: 400,
  },
});
