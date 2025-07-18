import React from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import Config from 'react-native-config';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import Loader from '../../components/Loader/Loader.js';
import Error from '../../components/Error/Error.js';
import useFetch from '../../hooks/useFetch/useFetch.js';
const Category = ({ navigation }) => {
  const { loading, error, data } = useFetch(Config.CATEGORY_API_URL);

  const handleCard = categoryName => {
    navigation.navigate('MealPage', { categoryName });
  };
  const renderCategory = ({ item }) => (
    <CategoryCard
      category={item}
      onSelect={() => handleCard(item.strCategory)}
    />
  );

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <Error />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList data={data.categories} renderItem={renderCategory} />
    </SafeAreaView>
  );
};

export default Category;
