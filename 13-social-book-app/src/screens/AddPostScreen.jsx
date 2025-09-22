import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

const AddPostScreen = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookGenre, setBookGenre] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user, userData } = useAuth();

  if (!user) {
    Alert.alert('Hata', 'Lütfen giriş yapın.');
    return;
  }
  console.log(user);

  const genres = [
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

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchImageLibrary(options, response => {
      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  const uploadImage = async imageUri => {
    try {
      const filename = `posts/${user.uid}_${Date.now()}.jpg`;
      const reference = storage().ref(filename);
      await reference.putFile(imageUri);
      const downloadURL = await reference.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert('Hata', 'Lütfen gönderi içeriğini yazınız.');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage.uri);
      }

      const postData = {
        content: content.trim(),
        userId: user.uid,
        userFullName: userData?.fullName || 'Anonim Kullanıcı',
        createdAt: firestore.FieldValue.serverTimestamp(),
        likes: 0,
        comments: 0,
      };

      if (bookTitle.trim()) {
        postData.bookTitle = bookTitle.trim();
        postData.bookAuthor = bookAuthor.trim();
        postData.bookGenre = bookGenre;
      }

      if (imageUrl) {
        postData.imageUrl = imageUrl;
      }

      await firestore().collection('posts').add(postData);

      if (bookTitle.trim() && bookAuthor.trim()) {
        Alert.alert(
          'Gönderi Paylaşıldı',
          'Bu kitabı favori kitaplarınıza eklemek ister misiniz?',
          [
            {
              text: 'Hayır',
              onPress: () => {
                setContent('');
                setBookTitle('');
                setBookAuthor('');
                setBookGenre('');
                setSelectedImage(null);
                navigation.navigate('Ana Sayfa');
              },
            },
            {
              text: 'Evet',
              onPress: async () => {
                try {
                  await firestore()
                    .collection('users')
                    .doc(user.uid)
                    .update({
                      favoriteBooks: firestore.FieldValue.arrayUnion({
                        title: bookTitle.trim(),
                        author: bookAuthor.trim(),
                        genre: bookGenre,
                        addedAt: new Date(),
                      }),
                    });

                  setContent('');
                  setBookTitle('');
                  setBookAuthor('');
                  setBookGenre('');
                  setSelectedImage(null);
                  navigation.navigate('Ana Sayfa');
                } catch (error) {
                  console.error('Favorite book add error:', error);
                }
              },
            },
          ],
        );
      } else {
        Alert.alert('Başarılı', 'Gönderiniz paylaşıldı!');
        setContent('');
        setBookTitle('');
        setBookAuthor('');
        setBookGenre('');
        setSelectedImage(null);
        navigation.navigate('Ana Sayfa');
      }
    } catch (error) {
      console.error('Post creation error:', error);
      Alert.alert('Hata', 'Gönderi paylaşılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Icon name="create" size={32} color="#6366F1" />
          <Text style={styles.headerTitle}>Yeni Gönderi</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gönderi İçeriği</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Kitap hakkındaki düşüncelerinizi paylaşın..."
              placeholderTextColor="#9CA3AF"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Kitap Bilgileri (İsteğe Bağlı)
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Kitap Adı"
              placeholderTextColor="#9CA3AF"
              value={bookTitle}
              onChangeText={setBookTitle}
            />

            <TextInput
              style={styles.input}
              placeholder="Yazar Adı"
              placeholderTextColor="#9CA3AF"
              value={bookAuthor}
              onChangeText={setBookAuthor}
            />

            <TouchableOpacity style={styles.genreSelector}>
              <Text
                style={[styles.genreText, !bookGenre && styles.placeholderText]}
              >
                {bookGenre || 'Kitap Türü Seçin'}
              </Text>
              <Icon name="keyboard-arrow-down" size={24} color="#6B7280" />
            </TouchableOpacity>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.genreContainer}
            >
              {genres.map(genre => (
                <TouchableOpacity
                  key={genre}
                  style={[
                    styles.genreChip,
                    bookGenre === genre && styles.selectedGenre,
                  ]}
                  onPress={() => setBookGenre(genre)}
                >
                  <Text
                    style={[
                      styles.genreChipText,
                      bookGenre === genre && styles.selectedGenreText,
                    ]}
                  >
                    {genre}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Fotoğraf Ekle (İsteğe Bağlı)
            </Text>

            {selectedImage ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={styles.selectedImage}
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <Icon name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imageSelector}
                onPress={selectImage}
              >
                <Icon name="add-a-photo" size={32} color="#6366F1" />
                <Text style={styles.imageSelectorText}>Fotoğraf Seç</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.postButton, loading && styles.postButtonDisabled]}
            onPress={handlePost}
            disabled={loading}
          >
            <Icon name="send" size={24} color="#FFFFFF" />
            <Text style={styles.postButtonText}>
              {loading ? 'Paylaşılıyor...' : 'Paylaş'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  form: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  contentInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    textAlignVertical: 'top',
    height: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#374151',
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
  genreSelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  genreText: {
    fontSize: 16,
    color: '#374151',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  genreContainer: {
    marginTop: 8,
  },
  genreChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedGenre: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  genreChipText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  selectedGenreText: {
    color: '#FFFFFF',
  },
  imageSelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  imageSelectorText: {
    marginTop: 8,
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '500',
  },
  imageContainer: {
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 16,
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  postButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default AddPostScreen;
