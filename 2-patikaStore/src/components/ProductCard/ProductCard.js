import { Image, ScrollView, Text, View } from 'react-native';
import styles from './ProductCard.style';

const ProductCard = ({ products }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.wrapper}>
        <Image source={{ uri: products.imgURL }} style={styles.image} />
        <Text style={styles.title}>{products.title}</Text>
        <Text
          style={[styles.price, products.inStock == false && { marginTop: 8 }]}
        >
          {products.price}
        </Text>
        {products.inStock == false && (
          <Text style={styles.stock}>STOKTA YOK</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ProductCard;
