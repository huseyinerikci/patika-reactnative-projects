import React from 'react';
import { Text, FlatList, View, SafeAreaView } from 'react-native';
import Config from 'react-native-config';
import useFetch from '../../hooks/useFetch';

import ProductCard from '../../components/ProductCard';
import Error from '../../components/Error';
import Loader from '../../components/Loader';
import { useSelector } from 'react-redux';

const Products = ({ navigation }) => {
  const user = useSelector(state => state.user);
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
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6fc' }}>
      <FlatList
        data={data}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <View
            style={{
              margin: 16,
              marginBottom: 8,
              borderRadius: 16,
              backgroundColor: '#2196f3',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4,
              padding: 20,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 8,
                letterSpacing: 1,
              }}
            >
              {user ? `${user.username} Hoşgeldin 👋` : 'Hoşgeldiniz'}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#e3f2fd',
                fontWeight: '600',
                letterSpacing: 0.5,
              }}
            >
              Ürünler
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Products;
