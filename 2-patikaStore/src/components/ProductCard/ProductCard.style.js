import { Dimensions, StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#f3f4f6',
    width: '48%',
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  wrapper: {
    height: 400,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    height: 220,
    width: 170,
    borderRadius: 10,
    marginBottom: 8,
  },

  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  price: {
    marginTop: 3,
    fontSize: 16,
  },
  stock: {
    fontWeight: 'bold',
    color: 'red',
    fontSize: 18,
  },
});
