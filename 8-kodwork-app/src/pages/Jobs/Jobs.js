import React from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import styles from './Jobs.style';
import JobCard from '../../components/JobCard';

import Loader from '../../components/Loader';
import Config from 'react-native-config';
import useFetch from '../../hooks/useFetch';

const Jobs = ({ navigation }) => {
  const { data, loading, error } = useFetch(Config.API_URL + '?page=1');
  const jobs = data.results;

  const handleCard = (id, name) => {
    navigation.navigate('DetailPage', { id, name });
  };

  const renderCard = ({ item }) => (
    <JobCard job={item} onSelect={() => handleCard(item.id, item.name)} />
  );

  if (loading) return <Loader />;
  if (error) {
    return (
      <View style={styles.err_container}>
        <Text style={styles.err_text}>Error fetching jobs</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={jobs} renderItem={renderCard} />
    </SafeAreaView>
  );
};

export default Jobs;
