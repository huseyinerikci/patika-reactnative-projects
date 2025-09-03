import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Searchbar,
  Card,
  Text as PaperText,
  Chip,
  Button,
  Surface,
  SegmentedButtons,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  searchBooks,
  searchInFavorites,
  addToFavorites,
  clearSearchResults,
} from '../store/slices/booksSlice';
import { AppDispatch, RootState } from '../store';
import { Book } from '../types';
import { theme } from '../theme';

interface Props {
  navigation: any;
}

const GENRES = [
  'Roman',
  'Bilim Kurgu',
  'Fantastik',
  'Tarih',
  'Biyografi',
  'Psikoloji',
  'Felsefe',
  'Şiir',
  'Çocuk',
  'Gençlik',
];

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchMode, setSearchMode] = useState('api');

  const dispatch = useDispatch<AppDispatch>();
  const { searchResults, favoriteBooks, loading } = useSelector(
    (state: RootState) => state.books,
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearSearchResults());
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    if (searchMode === 'api') {
      await dispatch(searchBooks(searchQuery));
    } else {
      await dispatch(
        searchInFavorites({
          query: searchQuery,
          genre: selectedGenre,
        }),
      );
    }
  };

  const handleGenreFilter = async (genre: string) => {
    setSelectedGenre(genre === selectedGenre ? '' : genre);

    if (searchMode === 'favorites') {
      await dispatch(
        searchInFavorites({
          query: searchQuery,
          genre: genre === selectedGenre ? '' : genre,
        }),
      );
    }
  };

  const handleAddToFavorites = async (book: Book) => {
    if (!user) return;

    try {
      await dispatch(addToFavorites({ book, userId: user.uid }));
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const isBookInFavorites = (bookId: string) => {
    return favoriteBooks.some(book => book.id === bookId);
  };

  const renderBook = ({ item }: { item: Book }) => (
    <Card style={styles.bookCard}>
      <Card.Content>
        <View style={styles.bookContent}>
          {item.coverImage ? (
            <Image source={{ uri: item.coverImage }} style={styles.bookCover} />
          ) : (
            <View style={styles.placeholderCover}>
              <Icon name="book" size={40} color={theme.colors.placeholder} />
            </View>
          )}

          <View style={styles.bookInfo}>
            <PaperText style={styles.bookTitle}>{item.title}</PaperText>
            <PaperText style={styles.bookAuthor}>{item.author}</PaperText>
            <Chip style={styles.genreChip} textStyle={styles.genreText}>
              {item.genre}
            </Chip>
            {item.publishedYear && (
              <PaperText style={styles.publishYear}>
                {item.publishedYear}
              </PaperText>
            )}
          </View>
        </View>

        <View style={styles.bookActions}>
          {searchMode === 'api' && !isBookInFavorites(item.id) && (
            <Button
              mode="contained"
              onPress={() => handleAddToFavorites(item)}
              style={styles.addButton}
              icon="heart-plus"
            >
              Favorilere Ekle
            </Button>
          )}

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('BookDetail', { book: item })}
            style={styles.detailButton}
          >
            Detaylar
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderGenreChip = (genre: string) => (
    <Chip
      key={genre}
      selected={selectedGenre === genre}
      onPress={() => handleGenreFilter(genre)}
      style={[
        styles.filterChip,
        selectedGenre === genre && styles.selectedFilterChip,
      ]}
      textStyle={[
        styles.filterChipText,
        selectedGenre === genre && styles.selectedFilterChipText,
      ]}
    >
      {genre}
    </Chip>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name={searchMode === 'api' ? 'book-search' : 'heart-outline'}
        size={80}
        color={theme.colors.placeholder}
      />
      <PaperText style={styles.emptyTitle}>
        {searchQuery ? 'Sonuç bulunamadı' : 'Arama yapın'}
      </PaperText>
      <PaperText style={styles.emptyText}>
        {searchQuery
          ? `"${searchQuery}" için sonuç bulunamadı. Farklı anahtar kelimeler deneyin.`
          : searchMode === 'api'
          ? 'Kitap aramak için yukarıdaki arama kutusunu kullanın.'
          : 'Favorilerinizdeki kitaplar arasında arama yapın.'}
      </PaperText>
    </View>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.searchHeader}>
        <Searchbar
          placeholder={
            searchMode === 'api' ? 'Kitap ara...' : 'Favorilerinde ara...'
          }
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchbar}
          icon="magnify"
          clearIcon="close"
        />

        <SegmentedButtons
          value={searchMode}
          onValueChange={setSearchMode}
          buttons={[
            {
              value: 'api',
              label: 'Kitap Ara',
              icon: 'web',
            },
            {
              value: 'favorites',
              label: 'Favorilerimde',
              icon: 'heart',
            },
          ]}
          style={styles.segmentedButtons}
        />

        {searchMode === 'favorites' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.genreFilter}
            contentContainerStyle={styles.genreFilterContent}
          >
            {GENRES.map(renderGenreChip)}
          </ScrollView>
        )}

        <Button
          mode="contained"
          onPress={handleSearch}
          loading={loading}
          style={styles.searchButton}
          disabled={!searchQuery.trim()}
        >
          Ara
        </Button>
      </Surface>

      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderBook}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchHeader: {
    padding: theme.spacing.md,
    elevation: 2,
  },
  searchbar: {
    marginBottom: theme.spacing.md,
  },
  segmentedButtons: {
    marginBottom: theme.spacing.md,
  },
  genreFilter: {
    marginBottom: theme.spacing.md,
  },
  genreFilterContent: {
    paddingHorizontal: theme.spacing.xs,
  },
  filterChip: {
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  selectedFilterChip: {
    backgroundColor: theme.colors.primary,
  },
  filterChipText: {
    color: theme.colors.text,
  },
  selectedFilterChipText: {
    color: 'white',
  },
  searchButton: {
    marginTop: theme.spacing.sm,
  },
  resultsList: {
    padding: theme.spacing.md,
  },
  bookCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.roundness * 1.5,
    ...theme.shadows.small,
  },
  bookContent: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: theme.roundness,
    marginRight: theme.spacing.md,
  },
  placeholderCover: {
    width: 80,
    height: 120,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.disabled,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  bookAuthor: {
    color: theme.colors.placeholder,
    marginBottom: theme.spacing.sm,
  },
  genreChip: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  genreText: {
    fontSize: 12,
  },
  publishYear: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  bookActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  detailButton: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.placeholder,
    lineHeight: 24,
  },
});

export default SearchScreen;
