import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { calculateTotalNutrition } from '../utils/nutrition';

const HomeScreen = () => {
  const meals = useSelector((state: RootState) => state.meals.items);
  const totals = calculateTotalNutrition(meals);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Hoşgeldin!</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Bugün eklenen öğünler: {meals.length}
          </Text>
          <Text style={styles.cardText}>
            Toplam Kalori: {totals.calories.toFixed(1)} kcal
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8f9fa' },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a3c6e',
  },
  card: {
    backgroundColor: '#d0e7ff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    marginVertical: 4,
    color: '#333',
  },
});

export default HomeScreen;
