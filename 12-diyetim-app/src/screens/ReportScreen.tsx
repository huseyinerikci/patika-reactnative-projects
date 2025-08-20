import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  calculateTotalNutrition,
  calculateAverageNutrition,
} from '../utils/nutrition';

function getMostFrequentMeals(meals: { name: string }[]) {
  if (!meals.length) return [];
  const freq: Record<string, number> = {};
  meals.forEach(m => {
    freq[m.name] = (freq[m.name] || 0) + 1;
  });
  const max = Math.max(...Object.values(freq));
  return Object.entries(freq)
    .filter(([_, count]) => count === max)
    .map(([name, count]) => ({ name, count }));
}

const ReportScreen = () => {
  const meals = useSelector((state: RootState) => state.meals.items);

  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [averages, setAverages] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [mostFrequent, setMostFrequent] = useState<
    { name: string; count: number }[]
  >([]);

  useEffect(() => {
    setTotals(calculateTotalNutrition(meals));
    setAverages(calculateAverageNutrition(meals));
    setMostFrequent(getMostFrequentMeals(meals));
  }, [meals]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Diyet Raporu</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Toplam Besin Değerleri</Text>
          <Text>Kalori: {totals.calories.toFixed(1)} kcal</Text>
          <Text>Protein: {totals.protein.toFixed(1)} g</Text>
          <Text>Karbonhidrat: {totals.carbs.toFixed(1)} g</Text>
          <Text>Yağ: {totals.fat.toFixed(1)} g</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ortalama Besin Değerleri</Text>
          <Text>Kalori: {averages.calories.toFixed(1)} kcal</Text>
          <Text>Protein: {averages.protein.toFixed(1)} g</Text>
          <Text>Karbonhidrat: {averages.carbs.toFixed(1)} g</Text>
          <Text>Yağ: {averages.fat.toFixed(1)} g</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>En Çok Tercih Edilen Öğün(ler)</Text>
          {mostFrequent.length === 0 ? (
            <Text>Henüz veri yok.</Text>
          ) : (
            mostFrequent.map(m => (
              <Text key={m.name}>
                {m.name} ({m.count} kez)
              </Text>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8f9fa' },
  container: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a3c6e',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
    color: '#1a3c6e',
  },
});

export default ReportScreen;
