import React from 'react';
import styles from './Meal.style.js';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import useFetch from '../../hooks/useFetch/useFetch.js';
import Config from 'react-native-config';
import Loader from '../../components/Loader/Loader.js';
import Error from '../../components/Error/Error.js';
import MealCard from '../../components/MealCard/MealCard.js';
const Meal = ({ navigation }) => {
  const route = useRoute();
  const { categoryName } = route.params;
  const { data, error, loading } = useFetch(
    `${Config.MEAL_API_URL}${categoryName}`,
  );

  const handleCard = mealId => {
    navigation.navigate('DetailPage', { mealId });
  };

  if (loading) return <Loader />;
  if (error) return <Error />;
  if (!data.meals) {
    return (
      <View>
        <Text>Öğün bulunamadı.</Text>
      </View>
    );
  }
  const renderMeal = ({ item }) => (
    <MealCard meal={item} onSelect={() => handleCard(item.idMeal)} />
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList data={data.meals} renderItem={renderMeal} />
    </SafeAreaView>
  );
};

export default Meal;
