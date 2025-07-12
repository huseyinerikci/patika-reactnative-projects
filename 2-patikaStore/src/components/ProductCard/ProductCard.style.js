import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wrapper: {
    backgroundColor: '#f3f4f6',
    width: 180,
    height: 355,
    margin: 5,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    flex: 1,
  },
  image: {
    height: '210',
    width: '100%',
    objectFit: 'fill',
    borderRadius: 10,
  },

  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  price: {
    fontSize: 16,
  },
  stock: {
    fontWeight: 'bold',
    color: 'red',
    fontSize: 18,
  },
});
