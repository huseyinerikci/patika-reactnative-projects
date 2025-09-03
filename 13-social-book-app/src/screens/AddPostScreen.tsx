// screens/AddPostScreen.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Text,
  Surface,
  Chip,
  IconButton,
  Appbar,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { createPost } from '../store/slices/postsSlice';
import { searchBooks } from '../store/slices/booksSlice';
import { AppDispatch, RootState } from '../store';
import { Book } from '../types';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

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

const AddPostScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [showBookSearch, setShowBookSearch] = useState(false);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [manualBook, setManualBook] = useState({
    title: '',
    author: '',
    genre: '',
  });
  const [useManualEntry, setUseManualEntry] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { searchResults, loading: booksLoading } = useSelector(
    (state: RootState) => state.books,
  );
  const { loading: postsLoading } = useSelector(
    (state: RootState) => state.posts,
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const handleBookSearch = async () => {
    if (!bookSearchQuery.trim()) return;
    await dispatch(searchBooks(bookSearchQuery));
    setShowBookSearch(true);
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setShowBookSearch(false);
    setBookSearchQuery('');
  };

  const handlePickImages = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 5,
      },
      response => {
        if (response.assets) {
          const newImages = response.assets.map(asset => asset.uri!);
          setSelectedImages(prev => [...prev, ...newImages].slice(0, 5));
        }
      },
    );
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const renderStars = (currentRating: number) => {
    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: 5 }, (_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setRating(index + 1)}
            style={styles.starButton}
          >
            <Icon
              name={index < currentRating ? 'star' : 'star-outline'}
              size={28}
              color={theme.colors.warning}
            />
          </TouchableOpacity>
        ))}
        <Text style={styles.ratingText}>({currentRating}/5)</Text>
      </View>
    );
  };

  const handleCreatePost = async () => {
    if (!user) return;

    const bookData = useManualEntry ? manualBook : selectedBook;

    if (
      !bookData?.title ||
      !bookData?.author ||
      !content.trim() ||
      rating === 0
    ) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun ve puan verin');
      return;
    }

    try {
      await dispatch(
        createPost({
          userId: user.uid,
          userName: user.displayName,
          userAvatar: user.photoURL,
          bookTitle: bookData.title,
          bookAuthor: bookData.author,
          bookGenre: bookData.genre || 'Genel',
          bookCover: selectedBook?.coverImage,
          content: content.trim(),
          rating,
          imageUris: selectedImages,
        }),
      );

      // reset form before leaving
      setSelectedBook(null);
      setBookSearchQuery('');
      setShowBookSearch(false);
      setContent('');
      setRating(0);
      setSelectedImages([]);
      setManualBook({ title: '', author: '', genre: '' });
      setUseManualEntry(false);

      Alert.alert('Başarılı', 'Gönderiniz paylaşıldı!', [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Gönderi paylaşılırken bir hata oluştu');
    }
  };

  const renderBookSearch = () => (
    <Card style={styles.searchCard}>
      <Card.Content>
        <View style={styles.searchHeader}>
          <TextInput
            label="Kitap ara"
            value={bookSearchQuery}
            onChangeText={setBookSearchQuery}
            mode="outlined"
            style={styles.searchInput}
            right={
              <TextInput.Icon
                icon="magnify"
                onPress={handleBookSearch}
                disabled={booksLoading}
              />
            }
          />
          <Button
            mode="text"
            onPress={() => setUseManualEntry(!useManualEntry)}
            style={styles.manualButton}
          >
            {useManualEntry ? 'Kitap Ara' : 'Manuel Gir'}
          </Button>
        </View>

        {showBookSearch && searchResults.length > 0 && (
          <View style={styles.searchResults}>
            <FlatList
              data={searchResults.slice(0, 5)}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.bookItem}
                  onPress={() => handleSelectBook(item)}
                >
                  <View style={styles.bookItemContent}>
                    {item.coverImage ? (
                      <Image
                        source={{ uri: item.coverImage }}
                        style={styles.smallBookCover}
                      />
                    ) : (
                      <View style={styles.smallPlaceholderCover}>
                        <Icon
                          name="book"
                          size={20}
                          color={theme.colors.placeholder}
                        />
                      </View>
                    )}
                    <View style={styles.bookItemInfo}>
                      <Text style={styles.bookItemTitle}>{item.title}</Text>
                      <Text style={styles.bookItemAuthor}>{item.author}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderManualEntry = () => (
    <Card style={styles.manualCard}>
      <Card.Content>
        <Text style={styles.manualTitle}>Kitap Bilgilerini Girin</Text>

        <TextInput
          label="Kitap Adı *"
          value={manualBook.title}
          onChangeText={text =>
            setManualBook(prev => ({ ...prev, title: text }))
          }
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Yazar *"
          value={manualBook.author}
          onChangeText={text =>
            setManualBook(prev => ({ ...prev, author: text }))
          }
          mode="outlined"
          style={styles.input}
        />

        <View style={styles.genreContainer}>
          <Text style={styles.genreLabel}>Tür</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {GENRES.map(genre => (
              <Chip
                key={genre}
                selected={manualBook.genre === genre}
                onPress={() =>
                  setManualBook(prev => ({
                    ...prev,
                    genre: prev.genre === genre ? '' : genre,
                  }))
                }
                style={styles.genreChip}
              >
                {genre}
              </Chip>
            ))}
          </ScrollView>
        </View>
      </Card.Content>
    </Card>
  );

  const renderSelectedBook = () => (
    <Surface style={styles.selectedBookContainer}>
      <View style={styles.selectedBookContent}>
        {selectedBook?.coverImage ? (
          <Image
            source={{ uri: selectedBook.coverImage }}
            style={styles.selectedBookCover}
          />
        ) : (
          <View style={styles.selectedPlaceholderCover}>
            <Icon name="book" size={30} color={theme.colors.placeholder} />
          </View>
        )}
        <View style={styles.selectedBookInfo}>
          <Text style={styles.selectedBookTitle}>
            {useManualEntry ? manualBook.title : selectedBook?.title}
          </Text>
          <Text style={styles.selectedBookAuthor}>
            {useManualEntry ? manualBook.author : selectedBook?.author}
          </Text>
          <Chip style={styles.selectedBookGenre}>
            {useManualEntry ? manualBook.genre : selectedBook?.genre}
          </Chip>
        </View>
        <IconButton
          icon="close"
          size={20}
          onPress={() => {
            setSelectedBook(null);
            setManualBook({ title: '', author: '', genre: '' });
          }}
        />
      </View>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Yeni Gönderi" />
        <Appbar.Action
          icon="check"
          onPress={handleCreatePost}
          disabled={postsLoading}
        />
      </Appbar.Header>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Book Selection */}
        {!selectedBook && !useManualEntry && renderBookSearch()}
        {useManualEntry && !selectedBook && renderManualEntry()}
        {(selectedBook || (useManualEntry && manualBook.title)) &&
          renderSelectedBook()}

        {/* Rating */}
        {(selectedBook || (useManualEntry && manualBook.title)) && (
          <Card style={styles.ratingCard}>
            <Card.Content>
              <Text style={styles.ratingTitle}>Puanınız</Text>
              {renderStars(rating)}
            </Card.Content>
          </Card>
        )}

        {/* Content */}
        <Card style={styles.contentCard}>
          <Card.Content>
            <TextInput
              label="Düşüncelerinizi paylaşın *"
              value={content}
              onChangeText={setContent}
              mode="outlined"
              multiline
              numberOfLines={6}
              placeholder="Bu kitap hakkında ne düşünüyorsunuz? Deneyimlerinizi paylaşın..."
              style={styles.contentInput}
            />
          </Card.Content>
        </Card>

        {/* Images */}
        <Card style={styles.imagesCard}>
          <Card.Content>
            <View style={styles.imagesHeader}>
              <Text variant="titleSmall" style={styles.imagesTitle}>
                Fotoğraflar
              </Text>
              <Button
                mode="outlined"
                onPress={handlePickImages}
                icon="camera"
                style={styles.addImageButton}
              >
                Fotoğraf Ekle
              </Button>
            </View>

            {selectedImages.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {selectedImages.map((uri, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri }} style={styles.selectedImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Icon
                        name="close-circle"
                        size={20}
                        color={theme.colors.notification}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </Card.Content>
        </Card>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleCreatePost}
          loading={postsLoading}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
        >
          Paylaş
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: theme.spacing.sm,
  },
  searchCard: {
    margin: theme.spacing.md,
    borderRadius: theme.roundness * 1.5,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInput: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  manualButton: {
    marginLeft: theme.spacing.sm,
  },
  searchResults: {
    marginTop: theme.spacing.md,
    maxHeight: 200,
  },
  bookItem: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  bookItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallBookCover: {
    width: 40,
    height: 60,
    borderRadius: theme.roundness,
    marginRight: theme.spacing.md,
  },
  smallPlaceholderCover: {
    width: 40,
    height: 60,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.disabled,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  bookItemInfo: {
    flex: 1,
  },
  bookItemTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  bookItemAuthor: {
    color: theme.colors.placeholder,
  },
  manualCard: {
    margin: theme.spacing.md,
    borderRadius: theme.roundness * 1.5,
  },
  manualTitle: {
    marginBottom: theme.spacing.md,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  genreContainer: {
    marginTop: theme.spacing.md,
  },
  genreLabel: {
    marginBottom: theme.spacing.sm,
    fontWeight: 'bold',
  },
  genreChip: {
    marginRight: theme.spacing.sm,
  },
  selectedBookContainer: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.roundness * 1.5,
    elevation: 2,
  },
  selectedBookContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedBookCover: {
    width: 60,
    height: 90,
    borderRadius: theme.roundness,
    marginRight: theme.spacing.md,
  },
  selectedPlaceholderCover: {
    width: 60,
    height: 90,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.disabled,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  selectedBookInfo: {
    flex: 1,
  },
  selectedBookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  selectedBookAuthor: {
    color: theme.colors.placeholder,
    marginBottom: theme.spacing.sm,
  },
  selectedBookGenre: {
    alignSelf: 'flex-start',
  },
  ratingCard: {
    margin: theme.spacing.md,
    borderRadius: theme.roundness * 1.5,
  },
  ratingTitle: {
    marginBottom: theme.spacing.md,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    padding: theme.spacing.xs,
  },
  ratingText: {
    marginLeft: theme.spacing.md,
    color: theme.colors.placeholder,
  },
  contentCard: {
    margin: theme.spacing.md,
    borderRadius: theme.roundness * 1.5,
  },
  contentInput: {
    minHeight: 120,
  },
  imagesCard: {
    margin: theme.spacing.md,
    borderRadius: theme.roundness * 1.5,
  },
  imagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  imagesTitle: {
    flex: 1,
  },
  addImageButton: {
    marginLeft: theme.spacing.md,
  },
  imageContainer: {
    position: 'relative',
    marginRight: theme.spacing.md,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: theme.roundness,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  submitButton: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  submitButtonContent: {
    paddingVertical: theme.spacing.md,
  },
});

export default AddPostScreen;
