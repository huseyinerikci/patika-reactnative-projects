import React from 'react';
import { Image, Text, View } from 'react-native';
import styles from './Detail.style';
import useFetch from '../../hooks/useFetch';
import Config from 'react-native-config';
import Error from '../../components/Error';
import Loader from '../../components/Loader';

const Detail = ({ route }) => {
  const { id } = route.params;

  const { loading, error, data } = useFetch(Config.API_URL + '/products/' + id);
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <Error />;
  }
  return (
    <View style={styles.container}>
      <Image source={{ uri: data.image }} style={styles.image} />
      <View style={styles.body_container}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.desc}>{data.description}</Text>
        <Text style={styles.price}>{data.price} ₺</Text>
      </View>
    </View>
  );
};

export default Detail;
