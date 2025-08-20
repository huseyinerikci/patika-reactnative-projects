import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Meal } from '../../utils/types';

interface ReportState {
  totalCalories: number;
  avgProtein: number;
  avgCarb: number;
  avgFat: number;
}

const initialState: ReportState = {
  totalCalories: 0,
  avgProtein: 0,
  avgCarb: 0,
  avgFat: 0,
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    calculateReport: (state, action: PayloadAction<Meal[]>) => {
      const meals = action.payload;
      if (meals.length === 0) return;

      state.totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
      state.avgProtein =
        meals.reduce((sum, m) => sum + m.protein, 0) / meals.length;
      state.avgCarb = meals.reduce((sum, m) => sum + m.carbs, 0) / meals.length;
      state.avgFat = meals.reduce((sum, m) => sum + m.fat, 0) / meals.length;
    },
  },
});

export const { calculateReport } = reportSlice.actions;
export const selectReport = (state: RootState) => state.reports;
export default reportSlice.reducer;
