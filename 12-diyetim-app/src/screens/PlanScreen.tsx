import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addMeal, removeMeal, updateMeal } from '../store/slices/mealSlice';
import { Meal } from '../utils/types';
import uuid from 'react-native-uuid';
import MealCard from '../components/MealCard';

const PlanScreen = () => {
  const dispatch = useDispatch();
  const meals = useSelector((state: RootState) => state.meals.items);

  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const handleAddOrUpdateMeal = () => {
    if (!name) return;
    if (editId) {
      dispatch(
        updateMeal({
          id: editId,
          name,
          calories: Number(calories) || 0,
          protein: Number(protein) || 0,
          carbs: Number(carbs) || 0,
          fat: Number(fat) || 0,
        }),
      );
      setEditId(null);
    } else {
      const newMeal: Meal = {
        id: uuid.v4().toString(),
        name,
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
      };
      dispatch(addMeal(newMeal));
    }
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
  };

  const handleEditMeal = (meal: Meal) => {
    setEditId(meal.id);
    setName(meal.name);
    setCalories(meal.calories.toString());
    setProtein(meal.protein.toString());
    setCarbs(meal.carbs.toString());
    setFat(meal.fat.toString());
  };

  const handleDeleteMeal = (id: string) => {
    dispatch(removeMeal(id));
    if (editId === id) {
      setEditId(null);
      setName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>Diyet Planı</Text>
      <TextInput
        placeholder="Öğün adı"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Kalori"
        style={styles.input}
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Protein (g)"
        style={styles.input}
        value={protein}
        onChangeText={setProtein}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Karbonhidrat (g)"
        style={styles.input}
        value={carbs}
        onChangeText={setCarbs}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Yağ (g)"
        style={styles.input}
        value={fat}
        onChangeText={setFat}
        keyboardType="numeric"
      />
      <Button
        title={editId ? 'Öğünü Güncelle' : 'Öğün Ekle'}
        onPress={handleAddOrUpdateMeal}
        color="#1a3c6e"
      />

      <FlatList
        style={{ marginTop: 20 }}
        data={meals}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MealCard
            {...item}
            onEdit={() => handleEditMeal(item)}
            onDelete={() => handleDeleteMeal(item.id)}
          />
        )}
      />
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
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default PlanScreen;
