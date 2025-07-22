import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import styles from './Jobs.style';
import JobCard from '../../components/JobCard';
import axios from 'axios';

const Jobs = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const handleCard = (id, name) => {
    navigation.navigate('DetailPage', { id, name });
  };

  const dataFetch = async () => {
    try {
      const res = await axios.get(
        'https://www.themuse.com/api/public/jobs?page=1',
      );
      console.log('API RESPONSE:', res.data.results);
      setJobs(res.data.results);
    } catch (error) {
      console.log('API ERROR:', error);
    }
  };
  useEffect(() => {
    dataFetch();
  }, []);
  const renderCard = ({ item }) => (
    <JobCard job={item} onSelect={() => handleCard(item.id, item.name)} />
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList data={jobs} renderItem={renderCard} />
    </SafeAreaView>
  );
};

export default Jobs;
