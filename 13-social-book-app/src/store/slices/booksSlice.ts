// store/slices/booksSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firestore, COLLECTIONS } from '../../config/firebase';
import { Book, BooksState, BookApiResponse } from '../../types';

const initialState: BooksState = {
  favoriteBooks: [],
  searchResults: [],
  loading: false,
  error: null,
};

export const searchBooks = createAsyncThunk(
  'books/searchBooks',
  async (query: string) => {
    // Open Library API kullanıyoruz
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(
        query,
      )}&limit=20`,
    );
    const data: BookApiResponse = await response.json();

    return data.docs.map((book, idx) => ({
      id:
        book.isbn?.[0] ||
        `${book.title}-${book.author_name?.[0] || 'Unknown'}-${
          book.cover_i || idx
        }`,
      title: book.title,
      author: book.author_name?.join(', ') || 'Bilinmeyen Yazar',
      genre: book.subject?.slice(0, 3).join(', ') || 'Genel',
      coverImage: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : undefined,
      isbn: book.isbn?.[0],
      publishedYear: book.first_publish_year,
      addedAt: new Date(),
    })) as Book[];
  },
);

export const addToFavorites = createAsyncThunk(
  'books/addToFavorites',
  async ({ book, userId }: { book: Book; userId: string }) => {
    const userRef = firestore().collection(COLLECTIONS.USERS).doc(userId);

    await userRef.update({
      favoriteBooks: firestore.FieldValue.arrayUnion(book),
    });

    return book;
  },
);

export const removeFromFavorites = createAsyncThunk(
  'books/removeFromFavorites',
  async ({ bookId, userId }: { bookId: string; userId: string }) => {
    const userDoc = await firestore()
      .collection(COLLECTIONS.USERS)
      .doc(userId)
      .get();
    const userData = userDoc.data();

    if (userData?.favoriteBooks) {
      const updatedBooks = userData.favoriteBooks.filter(
        (book: Book) => book.id !== bookId,
      );
      await firestore().collection(COLLECTIONS.USERS).doc(userId).update({
        favoriteBooks: updatedBooks,
      });
    }

    return bookId;
  },
);

export const loadFavoriteBooks = createAsyncThunk(
  'books/loadFavoriteBooks',
  async (userId: string) => {
    const userDoc = await firestore()
      .collection(COLLECTIONS.USERS)
      .doc(userId)
      .get();
    const userData = userDoc.data();

    return userData?.favoriteBooks || [];
  },
);

export const searchInFavorites = createAsyncThunk(
  'books/searchInFavorites',
  async (
    { query, genre }: { query?: string; genre?: string },
    { getState },
  ) => {
    const { books } = getState() as { books: BooksState };
    let results = [...books.favoriteBooks];

    if (query) {
      const lowercaseQuery = query.toLowerCase();
      results = results.filter(
        book =>
          book.title.toLowerCase().includes(lowercaseQuery) ||
          book.author.toLowerCase().includes(lowercaseQuery),
      );
    }

    if (genre) {
      results = results.filter(book =>
        book.genre.toLowerCase().includes(genre.toLowerCase()),
      );
    }

    return results;
  },
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearSearchResults: state => {
      state.searchResults = [];
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchBooks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Arama başarısız';
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.favoriteBooks.push(action.payload);
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.favoriteBooks = state.favoriteBooks.filter(
          book => book.id !== action.payload,
        );
      })
      .addCase(loadFavoriteBooks.fulfilled, (state, action) => {
        state.favoriteBooks = action.payload;
      })
      .addCase(searchInFavorites.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  },
});

export const { clearSearchResults, clearError } = booksSlice.actions;
export default booksSlice.reducer;
