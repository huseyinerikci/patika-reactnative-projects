import React from 'react';
import styles from './CategoryCard.style.js';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
const CategoryCard = ({ category, onSelect }) => {
  return (
    <TouchableWithoutFeedback onPress={onSelect}>
      <View style={styles.container}>
        <View style={styles.body_container}>
          <Image
            style={styles.image}
            source={{ uri: category.strCategoryThumb }}
          />
          <Text style={styles.title}>{category.strCategory}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CategoryCard;
