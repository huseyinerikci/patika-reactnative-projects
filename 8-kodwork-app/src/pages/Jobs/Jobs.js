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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 20,
            backgroundColor: 'red',
            padding: 10,
            color: 'white',
            borderRadius: 5,
          }}
        >
          Error fetching jobs
        </Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList data={jobs} renderItem={renderCard} />
    </SafeAreaView>
  );
};

export default Jobs;
