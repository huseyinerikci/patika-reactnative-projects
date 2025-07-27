import { StyleSheet } from 'react-native';
import colors from '../../styles/color';

const base_style = StyleSheet.create({
  container: {
    margin: 10,
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  button_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
export default {
  primary: StyleSheet.create({
    ...base_style,
    container: {
      ...base_style.container,
      backgroundColor: colors.drakgreen,
    },
    title: {
      ...base_style.title,
      color: 'white',
    },
  }),

  secondary: StyleSheet.create({
    ...base_style,
    container: {
      ...base_style.container,
      backgroundColor: 'white',
      borderColor: colors.drakgreen,
      borderWidth: 1,
    },
    title: {
      ...base_style.title,
      color: colors.drakgreen,
    },
  }),
};
