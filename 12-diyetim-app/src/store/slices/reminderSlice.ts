import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reminder } from '../../utils/types';

interface ReminderState {
  items: Reminder[];
}

const initialState: ReminderState = {
  items: [],
};

const reminderSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    addReminder: (state, action: PayloadAction<Reminder>) => {
      state.items.push(action.payload);
    },
    removeReminder: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(r => r.id !== action.payload);
    },
    updateReminder: (state, action: PayloadAction<Reminder>) => {
      const idx = state.items.findIndex(r => r.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
    },
  },
});

export const { addReminder, removeReminder, updateReminder } =
  reminderSlice.actions;
export default reminderSlice.reducer;
