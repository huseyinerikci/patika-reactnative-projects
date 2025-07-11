import { Image, ScrollView, Text, View } from 'react-native';
import styles from './ProductCard.style';

const ProductCard = ({ products }) => {
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={styles.container}>
        <Image source={{ uri: products.imgURL }} style={styles.image} />
        <Text style={styles.title}>{products.title}</Text>
        <Text style={styles.price}>{products.price}</Text>
        {products.inStock == false && (
          <Text style={styles.stock}>STOKTA YOK</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ProductCard;
