import React from 'react';
import { FlatList } from 'react-native';
import Config from 'react-native-config';
import useFetch from '../../hooks/useFetch';

import ProductCard from '../../components/ProductCard';
import Error from '../../components/Error';
import Loader from '../../components/Loader';

const Products = ({ navigation }) => {
  const { loading, error, data } = useFetch(Config.API_URL + '/products/');
  const handleCard = id => {
    navigation.navigate('DetailPage', { id });
  };

  const renderProduct = ({ item }) => (
    <ProductCard product={item} onSelect={() => handleCard(item.id)} />
  );

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <Error />;
  }
  return <FlatList data={data} renderItem={renderProduct} />;
};

export default Products;
