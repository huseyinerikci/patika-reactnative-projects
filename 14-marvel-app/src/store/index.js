import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from './authSlice';
import charactersReducer from './charactersSlice';
import favoritesReducer from './favoritesSlice';
import comicsReducer from './comicsSlice';
import { configureStore } from '@reduxjs/toolkit';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'favorites'], //hangi state'ler saklanacak
};

// Auth state'ini kalıcı yap
const persistAuthReducer = persistReducer(persistConfig, authReducer);
const persistFavoritesReducer = persistReducer(persistConfig, favoritesReducer);

export const store = configureStore({
  reducer: {
    auth: persistAuthReducer,
    characters: charactersReducer,
    comics: comicsReducer,
    favorites: persistFavoritesReducer,
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
