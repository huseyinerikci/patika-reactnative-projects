import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { marvelApi } from '../services/marvelApi';

export const fetchComics = createAsyncThunk(
  'comics/fetchComics',
  async ({ limit = 20, offset = 0, titleStartsWith }) => {
    const params = { limit, offset };
    if (titleStartsWith && titleStartsWith.trim() !== '') {
      params.titleStartsWith = titleStartsWith;
    }
    const response = await marvelApi.getComics(params);
    return response;
  },
);

// Comic detayı getir
export const fetchComicsDetails = createAsyncThunk(
  'comics/fetchComicsDetails',
  async comicId => {
    const response = await marvelApi.getComicsById(comicId);
    return response;
  },
);

const initialState = {
  comics: [],
  selectedComics: null,
  loading: false,
  error: null,
  hasMore: true,
  total: 0,
};

const comicsSlice = createSlice({
  name: 'comics',
  initialState,
  reducers: {
    clearSelectedComic: state => {
      state.selectedComics = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchComics.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComics.fulfilled, (state, action) => {
        state.loading = false;
        const { results, total, offset } = action.payload.data;

        if (offset === 0) {
          state.comics = results;
        } else {
          state.comics = [...state.comics, ...results];
        }
        state.total = total;
        state.hasMore = state.comics.length < total;
      })
      .addCase(fetchComics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchComicsDetails.fulfilled, (state, action) => {
        state.selectedComics = action.payload.data.results[0];
      });
  },
});

export const { clearSelectedComic } = comicsSlice.actions;
export default comicsSlice.reducer;
