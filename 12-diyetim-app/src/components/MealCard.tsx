import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type MealCardProps = {
  id?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  onDelete?: () => void;
  onEdit?: () => void;
};

const MealCard: React.FC<MealCardProps> = ({
  name,
  calories,
  protein,
  carbs,
  fat,
  onDelete,
  onEdit,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.nutritionRow}>
        <Text style={styles.nutritionText}>🔥 {calories} kcal</Text>
        <Text style={styles.nutritionText}>💪 {protein}g</Text>
        <Text style={styles.nutritionText}>🍞 {carbs}g</Text>
        <Text style={styles.nutritionText}>🧈 {fat}g</Text>
      </View>
      {(onDelete || onEdit) && (
        <View style={styles.buttonRow}>
          {onEdit && (
            <Text style={styles.editBtn} onPress={onEdit}>
              Düzenle
            </Text>
          )}
          {onDelete && (
            <Text style={styles.deleteBtn} onPress={onDelete}>
              Sil
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
    color: '#1a3c6e',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionText: {
    fontSize: 14,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 12,
  },
  deleteBtn: {
    color: '#ff3b30',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  editBtn: {
    color: '#1a3c6e',
    fontWeight: 'bold',
  },
});

export default MealCard;
