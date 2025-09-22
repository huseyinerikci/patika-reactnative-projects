import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PostCard from '../components/PostCard';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

const BookDetailScreen = ({ route, navigation }) => {
  const { book, user: bookOwner } = route.params;
  const [loading, setLoading] = useState(false);
  if (loading && relatedPosts.length === 0 && allUsersWithBook.length === 0) {
    return <LoadingIndicator />;
  }
  const [isInMyFavorites, setIsInMyFavorites] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [allUsersWithBook, setAllUsersWithBook] = useState([]);

  const { user, userData, setUserData } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      fetchRelatedPosts();
      fetchUsersWithBook();
      checkIfInMyFavorites();
    }, [userData?.favoriteBooks]),
  );
  const handleRemoveFromFavorites = async () => {
    if (!isInMyFavorites) {
      Alert.alert('Bilgi', 'Bu kitap zaten favorilerinizde değil!');
      return;
    }

    Alert.alert(
      'Favorilerden Kaldır',
      `"${book.title}" kitabını favorilerinizden kaldırmak istediğinizden emin misiniz?`,
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Kaldır',
          onPress: async () => {
            setLoading(true);
            try {
              const bookToRemove = {
                title: book.title,
                author: book.author,
                genre: book.genre,
              };
              await firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                  favoriteBooks: firestore.FieldValue.arrayRemove(bookToRemove),
                });
              const userDoc = await firestore()
                .collection('users')
                .doc(user.uid)
                .get();
              if (userDoc.exists) {
                setUserData(userDoc.data());
              }
              setIsInMyFavorites(false);
              Alert.alert('Başarılı', 'Kitap favorilerinizden kaldırıldı!');
            } catch (error) {
              console.error('Remove from favorites error:', error);
              Alert.alert('Hata', 'Kitap kaldırılırken bir hata oluştu.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const checkIfInMyFavorites = () => {
    if (userData?.favoriteBooks) {
      const exists = userData.favoriteBooks.some(
        fav => fav.title === book.title && fav.author === book.author,
      );
      setIsInMyFavorites(exists);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('posts')
        .where('bookTitle', '==', book.title)
        .where('bookAuthor', '==', book.author)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();

      const posts = [];
      querySnapshot.forEach(doc => {
        posts.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setRelatedPosts(posts);
    } catch (error) {
      console.error('Related posts fetch error:', error);
    }
  };

  const fetchUsersWithBook = async () => {
    try {
      const querySnapshot = await firestore().collection('users').get();

      const usersWithBook = [];
      querySnapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.favoriteBooks) {
          const hasBook = userData.favoriteBooks.some(
            favBook =>
              favBook.title === book.title && favBook.author === book.author,
          );

          if (hasBook && userData.uid !== user.uid) {
            usersWithBook.push({
              id: doc.id,
              ...userData,
            });
          }
        }
      });

      setAllUsersWithBook(usersWithBook);
    } catch (error) {
      console.error('Users with book fetch error:', error);
    }
  };

  const handleAddToFavorites = async () => {
    if (isInMyFavorites) {
      Alert.alert('Bilgi', 'Bu kitap zaten favori listenizde!');
      return;
    }

    Alert.alert(
      'Favorilere Ekle',
      `"${book.title}" kitabını favori listenize eklemek istediğinizden emin misiniz?`,
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Ekle',
          onPress: async () => {
            setLoading(true);
            try {
              const bookToAdd = {
                title: book.title,
                author: book.author,
                genre: book.genre,
              };

              await firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                  favoriteBooks: firestore.FieldValue.arrayUnion(bookToAdd),
                });
              const userDoc = await firestore()
                .collection('users')
                .doc(user.uid)
                .get();
              if (userDoc.exists) {
                setUserData(userDoc.data());
              }

              setIsInMyFavorites(true);
              Alert.alert('Başarılı', 'Kitap favori listenize eklendi!');
            } catch (error) {
              console.error('Add to favorites error:', error);
              Alert.alert('Hata', 'Kitap eklenirken bir hata oluştu.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const UserCard = ({ userData }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() =>
        navigation.navigate('UserProfile', { userId: userData.uid })
      }
    >
      <View style={styles.userAvatar}>
        <Icon name="person" size={20} color="#6366F1" />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userData.fullName}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.bookHeader}>
        <View style={styles.bookIconLarge}>
          <Icon name="menu-book" size={60} color="#6366F1" />
        </View>
        <View style={styles.bookDetailsLarge}>
          <Text style={styles.bookTitleLarge}>{book.title}</Text>
          <Text style={styles.bookAuthorLarge}>Yazar: {book.author}</Text>
          <Text style={styles.bookGenreLarge}>Tür: {book.genre}</Text>
        </View>
      </View>

      <View style={styles.ownerSection}>
        <Text style={styles.sectionTitle}>Kitap Sahibi</Text>
        <TouchableOpacity
          style={styles.ownerCard}
          onPress={() =>
            navigation.navigate('UserProfile', { userId: bookOwner.uid })
          }
        >
          <View style={styles.userAvatar}>
            <Icon name="person" size={24} color="#6366F1" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.ownerName}>{bookOwner.fullName}</Text>
            <Text style={styles.ownerEmail}>{bookOwner.email}</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <View style={styles.actionSection}>
        {isInMyFavorites ? (
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              styles.favoriteButtonAdded,
              loading && styles.favoriteButtonDisabled,
            ]}
            onPress={handleRemoveFromFavorites}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Icon name="check" size={24} color="#FFFFFF" />
            )}
            <Text style={styles.favoriteButtonText}>Favorilerde (Kaldır)</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              loading && styles.favoriteButtonDisabled,
            ]}
            onPress={handleAddToFavorites}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Icon name="favorite-border" size={24} color="#FFFFFF" />
            )}
            <Text style={styles.favoriteButtonText}>Favorilere Ekle</Text>
          </TouchableOpacity>
        )}
      </View>

      {allUsersWithBook.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Bu Kitabı Favorilerine Ekleyen Kullanıcılar (
            {allUsersWithBook.length})
          </Text>
          {allUsersWithBook.slice(0, 5).map(userData => (
            <UserCard key={userData.id} userData={userData} />
          ))}
          {allUsersWithBook.length > 5 && (
            <Text style={styles.moreText}>
              ve {allUsersWithBook.length - 5} kişi daha...
            </Text>
          )}
        </View>
      )}

      {relatedPosts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Bu Kitap Hakkındaki Gönderiler ({relatedPosts.length})
          </Text>
          {relatedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  bookHeader: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  bookIconLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  bookDetailsLarge: {
    alignItems: 'center',
  },
  bookTitleLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  bookAuthorLarge: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 4,
  },
  bookGenreLarge: {
    fontSize: 16,
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ownerSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  ownerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
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
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  ownerEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  favoriteButton: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  favoriteButtonAdded: {
    backgroundColor: '#10B981',
  },
  favoriteButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  favoriteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
  },
  moreText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  postDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  postStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
});

export default BookDetailScreen;
