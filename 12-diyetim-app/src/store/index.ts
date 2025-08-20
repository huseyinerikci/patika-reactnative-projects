import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

import mealReducer from './slices/mealSlice';
import reminderReducer from './slices/reminderSlice';
import reportReducer from './slices/reportSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['meals', 'reminders', 'reports'], // sadece persistlenecek slice'lar
};

const rootReducer = combineReducers({
  meals: mealReducer,
  reminders: reminderReducer,
  reports: reportReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // ← burada non-serializable uyarısını kapattık
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
