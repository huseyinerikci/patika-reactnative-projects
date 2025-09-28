import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from './authSlice';
import charactersReducer from './charactersSlice';
import { configureStore } from '@reduxjs/toolkit';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], //hangi state'ler saklanacak
};

// Auth state'ini kalıcı yap
const persistAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistAuthReducer,
    characters: charactersReducer,
  },

  // Persist için gerekli middleware ayarları
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
