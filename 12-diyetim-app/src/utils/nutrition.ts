import { Meal } from './types';

export const calculateTotalNutrition = (meals: Meal[]) => {
  return meals.reduce(
    (acc, meal) => {
      acc.calories += meal.calories;
      acc.protein += meal.protein;
      acc.carbs += meal.carbs;
      acc.fat += meal.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
};

export const calculateAverageNutrition = (meals: Meal[]) => {
  if (meals.length === 0) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const totals = calculateTotalNutrition(meals);
  return {
    calories: totals.calories / meals.length,
    protein: totals.protein / meals.length,
    carbs: totals.carbs / meals.length,
    fat: totals.fat / meals.length,
  };
};
