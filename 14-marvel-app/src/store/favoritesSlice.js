import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favoriteCharacters: [],
  favoriteComics: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Karakter favoriye ekle/çıkar (toggle)
    toggleFavoriteCharacter: (state, action) => {
      const characterId = action.payload.id;

      const existingIndex = state.favoriteCharacters.findIndex(
        char => char.id === characterId,
      );

      if (existingIndex >= 0) {
        state.favoriteCharacters.splice(existingIndex, 1);
      } else {
        state.favoriteCharacters.push(action.payload);
      }
    },
    // Comic favoriye ekle/çıkar (toggle)
    toggleFavoriteComic: (state, action) => {
      const comicId = action.payload.id;

      const existingIndex = state.favoriteComics.findIndex(
        comic => comic.id === comicId,
      );

      if (existingIndex >= 0) {
        state.favoriteComics.splice(existingIndex, 1);
      } else {
        state.favoriteComics.push(action.payload);
      }
    },
  },
});

export const { toggleFavoriteCharacter, toggleFavoriteComic } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
