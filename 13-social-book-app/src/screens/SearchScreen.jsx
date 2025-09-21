import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

const UserCard = ({ user, onPress }) => (
  <TouchableOpacity style={styles.userCard} onPress={() => onPress(user)}>
    <View style={styles.avatar}>
      <Icon name="person" size={24} color="#6366F1" />
    </View>
    <View style={styles.userInfo}>
      <Text style={styles.userName}>{user.fullName}</Text>
      <Text style={styles.userEmail}>{user.email}</Text>
      <Text style={styles.bookCount}>
        {user.favoriteBooks?.length || 0} favori kitap
      </Text>
    </View>
    <Icon name="chevron-right" size={24} color="#9CA3AF" />
  </TouchableOpacity>
);

const BookCard = ({ book, user: bookUser, onUserPress, onBookPress }) => (
  <View style={styles.bookCard}>
    <TouchableOpacity
      style={styles.bookHeader}
      onPress={() => onUserPress(bookUser)}
    >
      <View style={styles.smallAvatar}>
        <Icon name="person" size={16} color="#6366F1" />
      </View>
      <Text style={styles.bookOwner}>{bookUser.fullName}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.bookContent}
      onPress={() => onBookPress(book, bookUser)}
    >
      <View style={styles.bookIcon}>
        <Icon name="menu-book" size={20} color="#6366F1" />
      </View>
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookAuthor}>Yazar: {book.author}</Text>
        <Text style={styles.bookGenre}>Tür: {book.genre}</Text>
      </View>
    </TouchableOpacity>
  </View>
);

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchType, setSearchType] = useState('books'); // 'books' or 'users'
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const { user } = useAuth();

  const genres = [
    'Tümü',
    'Roman',
    'Bilim Kurgu',
    'Fantastik',
    'Polisiye',
    'Tarih',
    'Biyografi',
    'Şiir',
    'Deneme',
    'Felsefe',
    'Psikoloji',
    'Kişisel Gelişim',
    'Çocuk Kitapları',
  ];

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() || selectedGenre) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedGenre, searchType]);

  const fetchAllUsers = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('users')
        .where('uid', '!=', user.uid)
        .get();

      const users = [];
      querySnapshot.forEach(doc => {
        users.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setAllUsers(users);
    } catch (error) {
      console.error('Users fetch error:', error);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim() && !selectedGenre) return;

    setLoading(true);
    try {
      if (searchType === 'users') {
        searchUsers();
      } else {
        searchBooks();
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = () => {
    const filtered = allUsers.filter(
      userData =>
        userData.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userData.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setSearchResults(filtered);
  };

  const searchBooks = () => {
    const results = [];
    const query = searchQuery.toLowerCase();
    const genreFilter =
      selectedGenre && selectedGenre !== 'Tümü' ? selectedGenre : null;

    allUsers.forEach(userData => {
      if (userData.favoriteBooks && userData.favoriteBooks.length > 0) {
        userData.favoriteBooks.forEach(book => {
          const matchesQuery =
            !query ||
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query);

          const matchesGenre = !genreFilter || book.genre === genreFilter;

          if (matchesQuery && matchesGenre) {
            results.push({
              ...book,
              user: userData,
              id: `${userData.id}-${book.title}-${book.author}`,
            });
          }
        });
      }
    });

    setSearchResults(results);
  };

  const handleUserPress = userData => {
    navigation.navigate('UserProfile', { userId: userData.uid });
  };

  const handleBookPress = (book, bookUser) => {
    navigation.navigate('BookDetail', { book, user: bookUser });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSearchResults([]);
  };

  const renderSearchResult = ({ item }) => {
    if (searchType === 'users') {
      return <UserCard user={item} onPress={handleUserPress} />;
    } else {
      return (
        <BookCard
          book={item}
          user={item.user}
          onUserPress={handleUserPress}
          onBookPress={handleBookPress}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={24}
            color="#9CA3AF"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={
              searchType === 'users'
                ? 'Kullanıcı ara...'
                : 'Kitap veya yazar ara...'
            }
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Icon name="close" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.searchTypeContainer}>
          <TouchableOpacity
            style={[
              styles.searchTypeButton,
              searchType === 'books' && styles.activeSearchType,
            ]}
            onPress={() => setSearchType('books')}
          >
            <Icon
              name="library-books"
              size={20}
              color={searchType === 'books' ? '#FFFFFF' : '#6B7280'}
            />
            <Text
              style={[
                styles.searchTypeText,
                searchType === 'books' && styles.activeSearchTypeText,
              ]}
            >
              Kitaplar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.searchTypeButton,
              searchType === 'users' && styles.activeSearchType,
            ]}
            onPress={() => setSearchType('users')}
          >
            <Icon
              name="people"
              size={20}
              color={searchType === 'users' ? '#FFFFFF' : '#6B7280'}
            />
            <Text
              style={[
                styles.searchTypeText,
                searchType === 'users' && styles.activeSearchTypeText,
              ]}
            >
              Kullanıcılar
            </Text>
          </TouchableOpacity>
        </View>

        {searchType === 'books' && (
          <View style={styles.genreContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {genres.map(genre => (
                <TouchableOpacity
                  key={genre}
                  style={[
                    styles.genreChip,
                    selectedGenre === genre && styles.selectedGenreChip,
                  ]}
                  onPress={() =>
                    setSelectedGenre(selectedGenre === genre ? '' : genre)
                  }
                >
                  <Text
                    style={[
                      styles.genreChipText,
                      selectedGenre === genre && styles.selectedGenreChipText,
                    ]}
                  >
                    {genre}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>Aranıyor...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={item => item.id}
            renderItem={renderSearchResult}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : searchQuery.trim() || selectedGenre ? (
          <View style={styles.emptyContainer}>
            <Icon name="search-off" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Sonuç bulunamadı</Text>
            <Text style={styles.emptySubtitle}>
              Arama kriterlerinizi değiştirip tekrar deneyin
            </Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="search" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Arama yapın</Text>
            <Text style={styles.emptySubtitle}>
              {searchType === 'users'
                ? 'Kullanıcı adı veya e-posta ile arama yapabilirsiniz'
                : 'Kitap adı, yazar adı veya türe göre arama yapabilirsiniz'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#374151',
  },
  clearButton: {
    padding: 4,
  },
  searchTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  searchTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeSearchType: {
    backgroundColor: '#6366F1',
  },
  searchTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 8,
  },
  activeSearchTypeText: {
    color: '#FFFFFF',
  },
  genreContainer: {
    marginBottom: 8,
  },
  genreChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedGenreChip: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  genreChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedGenreChipText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  bookCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  bookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  smallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  bookOwner: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  bookContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  bookGenre: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SearchScreen;
