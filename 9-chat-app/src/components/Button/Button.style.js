import { StyleSheet } from 'react-native';

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
      backgroundColor: '#00897b',
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
      borderColor: '#00897b',
      borderWidth: 1,
    },
    title: {
      ...base_style.title,
      color: '#00897b',
    },
  }),
};
