import React from 'react';
import styles from './Detail.style.js';
import {
  Button,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Loader from '../../components/Loader';
import Error from '../../components/Error';
import useFetch from '../../hooks/useFetch/useFetch.js';
import Config from 'react-native-config';
const Detail = () => {
  const route = useRoute();
  const { mealId } = route.params;
  const { data, error, loading } = useFetch(
    `${Config.DETAIL_API_URL}${mealId}`,
  );
  const goLink = () => {
    const url = data.meals[0].strYoutube;
    if (url) {
      Linking.openURL(url);
    }
  };
  if (loading) return <Loader />;
  if (error) return <Error />;
  if (!data || !data.meals) {
    return (
      <View>
        <Text>Detay bulunamadı.</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Image
          style={styles.image}
          source={{ uri: data.meals[0].strMealThumb }}
        />
        <View style={styles.body_container}>
          <Text style={styles.title}>{data.meals[0].strMeal}</Text>
          <Text style={styles.area}>{data.meals[0].strArea}</Text>
          <View style={styles.line} />
          <Text style={styles.desc}>{data.meals[0].strInstructions}</Text>
          <TouchableOpacity style={styles.btn} onPress={() => goLink()}>
            <Text style={styles.btn_text}>Watch on Youtube</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Detail;
