import React, { useEffect } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import styles from './Favorite.style';
import JobCard from '../../components/JobCard';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader';

const Favorite = () => {
  const dispatch = useDispatch();
  const { list, isLoading } = useSelector(state => state);

  useEffect(() => {
    const loadFavorites = async () => {
      dispatch({ type: 'LIST_LOADING' });

      try {
        const json = await AsyncStorage.getItem('@JOBS');
        const jobs = json != null ? JSON.parse(json) : [];
        dispatch({ type: 'LIST_SUCCESS', payload: jobs });
      } catch (error) {
        dispatch({ type: 'LIST_ERROR', payload: error });
      }
    };

    loadFavorites();
  }, []);
  const renderCard = ({ item }) => (
    <JobCard job={item} onSelect={() => {}} showRemoveButton={true} />
  );
  if (isLoading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      {Array.isArray(list) && list.length > 0 ? (
        <FlatList data={list} renderItem={renderCard} />
      ) : (
        <View style={styles.container}>
          <Text>Favori bir iş bulunmamaktadır.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Favorite;
