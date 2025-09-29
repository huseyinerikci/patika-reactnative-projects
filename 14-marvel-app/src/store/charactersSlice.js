import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { marvelApi } from '../services/marvelApi';

export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async ({ limit = 20, offset = 0, nameStartsWith }) => {
    const params = { limit, offset };
    if (nameStartsWith && nameStartsWith.trim() !== '') {
      params.nameStartsWith = nameStartsWith;
    }
    const response = await marvelApi.getCharacters(params);
    return response;
  },
);

//karakter detay
export const fetchCharacterDetails = createAsyncThunk(
  'characters/fetchCharacterDetails',
  async characterId => {
    const response = await marvelApi.getCharacterById(characterId);
    return response;
  },
);

const initialState = {
  characters: [],
  selectedCharacter: null,
  loading: false,
  error: null,
  hasMore: true,
  total: 0,
};

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    //seçili karakter temizle
    clearSelectedCharacter: state => {
      state.selectedCharacter = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCharacters.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false;
        const { results, total, offset } = action.payload.data;

        if (offset === 0) {
          //ilk sayfa- listeyi değiştir
          state.characters = results;
        } else {
          //sonraki sayfa -listeye ekle
          state.characters = [...state.characters, ...results];
        }
        state.total = total;
        state.hasMore = state.characters.length < total;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCharacterDetails.fulfilled, (state, action) => {
        state.selectedCharacter = action.payload.data.results[0];
      });
  },
});

export const { clearSelectedCharacter } = charactersSlice.actions;
export default charactersSlice.reducer;
