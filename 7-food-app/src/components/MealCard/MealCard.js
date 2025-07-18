import React from 'react';
import styles from './MealCard.style.js';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
const MealCard = ({ meal, onSelect }) => {
  return (
    <TouchableWithoutFeedback onPress={onSelect}>
      <View style={styles.container}>
        <View style={styles.body_container}>
          <Image style={styles.image} source={{ uri: meal.strMealThumb }} />
          <View style={styles.back_title}>
            <Text style={styles.title} numberOfLines={1}>
              {meal.strMeal}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MealCard;
