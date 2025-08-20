import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Meal } from '../../utils/types';

interface MealState {
  items: Meal[];
}

const initialState: MealState = {
  items: [],
};

const mealSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    addMeal: (state, action: PayloadAction<Meal>) => {
      state.items.push(action.payload);
    },
    removeMeal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(m => m.id !== action.payload);
    },
    updateMeal: (state, action: PayloadAction<Meal>) => {
      const idx = state.items.findIndex(m => m.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
    },
  },
});

export const { addMeal, removeMeal, updateMeal } = mealSlice.actions;
export default mealSlice.reducer;
