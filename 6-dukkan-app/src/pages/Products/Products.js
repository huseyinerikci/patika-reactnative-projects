import React from 'react';
import { Button, FlatList, View } from 'react-native';
import Config from 'react-native-config';
import useFetch from '../../hooks/useFetch';

import ProductCard from '../../components/ProductCard';
import Error from '../../components/Error';
import Loader from '../../components/Loader';
import { useDispatch } from 'react-redux';

const Products = ({ navigation }) => {
  const { loading, error, data } = useFetch(Config.API_URL + '/products/');
  const dispatch = useDispatch();

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
  return (
    <View>
      <Button
        title="LogOut"
        onPress={() => dispatch({ type: 'SET_USER', payload: { user: null } })}
      />
      <FlatList data={data} renderItem={renderProduct} />
    </View>
  );
};

export default Products;
