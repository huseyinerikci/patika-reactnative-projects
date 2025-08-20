import React from 'react';
import { SafeAreaView, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import MealCard from '../components/MealCard';

const HistoryScreen = () => {
  const meals = useSelector((state: RootState) => state.meals.items);

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>Geçmiş Öğünler</Text>
      {meals.length === 0 ? (
        <Text style={styles.emptyText}>Henüz öğün eklenmemiş.</Text>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MealCard {...item} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a3c6e',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default HistoryScreen;
