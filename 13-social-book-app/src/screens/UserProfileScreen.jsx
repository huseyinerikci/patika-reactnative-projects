import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../context/AuthContext';

const BookCard = ({ book, onAddToFavorites, isAlreadyFavorite }) => (
  <View style={styles.bookCard}>
    <View style={styles.bookIcon}>
      <Icon name="menu-book" size={24} color="#6366F1" />
    </View>
    <View style={styles.bookInfo}>
      <Text style={styles.bookTitle}>{book.title}</Text>
      <Text style={styles.bookAuthor}>Yazar: {book.author}</Text>
      <Text style={styles.bookGenre}>Tür: {book.genre}</Text>
    </View>
    <TouchableOpacity
      style={[
        styles.favoriteButton,
        isAlreadyFavorite && styles.favoriteButtonAdded,
      ]}
      onPress={() => onAddToFavorites(book)}
      disabled={isAlreadyFavorite}
    >
      <Icon
        name={isAlreadyFavorite ? 'check' : 'favorite-border'}
        size={20}
        color={isAlreadyFavorite ? '#10B981' : '#6366F1'}
      />
    </TouchableOpacity>
  </View>
);

const PostCard = ({ post }) => {
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  useEffect(() => {
    // Gerçek zamanlı beğeni sayısını dinle
    const unsubscribe = firestore()
      .collection('posts')
      .doc(post.id)
      .onSnapshot(doc => {
        if (doc.exists) {
          const data = doc.data();
          setLikeCount(data.likes || 0);
        }
      });

    return unsubscribe;
  }, [post.id]);

  return (
    <View style={styles.postCard}>
      {post.bookTitle && (
        <View style={styles.postBookInfo}>
          <Text style={styles.postBookTitle}>{post.bookTitle}</Text>
          <Text style={styles.postBookAuthor}>Yazar: {post.bookAuthor}</Text>
        </View>
      )}
      <Text style={styles.postContent}>{post.content}</Text>
      <View style={styles.postFooter}>
        <Text style={styles.postDate}>
          {post.createdAt?.toDate().toLocaleDateString('tr-TR')}
        </Text>
        <View style={styles.postStats}>
          <View style={styles.statItem}>
            <Icon name="favorite" size={16} color="#EF4444" />
            <Text style={styles.statText}>{likeCount}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const UserProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [myFavoriteBooks, setMyFavoriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('books');
  const [totalLikes, setTotalLikes] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
    fetchMyFavoriteBooks();
  }, [userId]);

  useEffect(() => {
    // Toplam beğeni sayısını hesapla
    const calculateTotalLikes = () => {
      const total = userPosts.reduce((acc, post) => {
        return acc + Math.max(0, post.likes || 0);
      }, 0);
      setTotalLikes(total);
    };

    calculateTotalLikes();
  }, [userPosts]);

  const fetchUserProfile = async () => {
    try {
      const userDoc = await firestore().collection('users').doc(userId).get();
      if (userDoc.exists) {
        setUserProfile({
          id: userDoc.id,
          ...userDoc.data(),
        });
      }
    } catch (error) {
      console.error('User profile fetch error:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('posts')
        .where('userId', '==', userId)
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

      setUserPosts(posts);

      // Gerçek zamanlı güncellemeler için listener ekle
      const unsubscribe = firestore()
        .collection('posts')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .onSnapshot(snapshot => {
          const updatedPosts = [];
          snapshot.forEach(doc => {
            updatedPosts.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setUserPosts(updatedPosts);
        });

      // Cleanup function
      return unsubscribe;
    } catch (error) {
      console.error('User posts fetch error:', error);
    }
  };

  const fetchMyFavoriteBooks = async () => {
    try {
      const myDoc = await firestore().collection('users').doc(user.uid).get();
      if (myDoc.exists) {
        const data = myDoc.data();
        setMyFavoriteBooks(data.favoriteBooks || []);
      }
    } catch (error) {
      console.error('My favorite books fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isBookInMyFavorites = book => {
    return myFavoriteBooks.some(
      fav => fav.title === book.title && fav.author === book.author,
    );
  };

  const addToMyFavorites = async book => {
    if (isBookInMyFavorites(book)) {
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
            try {
              const bookToAdd = {
                title: book.title,
                author: book.author,
                genre: book.genre,
                addedAt: firestore.FieldValue.serverTimestamp(),
              };

              await firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                  favoriteBooks: firestore.FieldValue.arrayUnion(bookToAdd),
                });

              setMyFavoriteBooks(prev => [...prev, bookToAdd]);
              Alert.alert('Başarılı', 'Kitap favori listenize eklendi!');
            } catch (error) {
              console.error('Add to favorites error:', error);
              Alert.alert('Hata', 'Kitap eklenirken bir hata oluştu.');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Profil yükleniyor...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={64} color="#EF4444" />
        <Text style={styles.errorText}>Kullanıcı profili bulunamadı</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Icon name="person" size={40} color="#6366F1" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userProfile.fullName}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {userProfile.favoriteBooks?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Favori Kitap</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userPosts.length}</Text>
            <Text style={styles.statLabel}>Gönderi</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalLikes}</Text>
            <Text style={styles.statLabel}>Toplam Beğeni</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'books' && styles.activeTab]}
          onPress={() => setActiveTab('books')}
        >
          <Icon
            name="library-books"
            size={24}
            color={activeTab === 'books' ? '#6366F1' : '#9CA3AF'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'books' && styles.activeTabText,
            ]}
          >
            Favori Kitaplar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Icon
            name="article"
            size={24}
            color={activeTab === 'posts' ? '#6366F1' : '#9CA3AF'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'posts' && styles.activeTabText,
            ]}
          >
            Gönderileri
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'books' ? (
          userProfile.favoriteBooks && userProfile.favoriteBooks.length > 0 ? (
            userProfile.favoriteBooks.map((book, index) => (
              <BookCard
                key={`${book.title}-${book.author}-${index}`}
                book={book}
                onAddToFavorites={addToMyFavorites}
                isAlreadyFavorite={isBookInMyFavorites(book)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="library-books" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>Henüz favori kitap yok</Text>
              <Text style={styles.emptySubtitle}>
                Bu kullanıcının henüz favori kitabı bulunmuyor
              </Text>
            </View>
          )
        ) : userPosts.length > 0 ? (
          userPosts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <View style={styles.emptyState}>
            <Icon name="article" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Henüz gönderi yok</Text>
            <Text style={styles.emptySubtitle}>
              Bu kullanıcının henüz gönderisi bulunmuyor
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#EF4444',
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
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
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#6366F1',
  },
  content: {
    padding: 16,
  },
  bookCard: {
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
  bookIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bookInfo: {
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
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonAdded: {
    backgroundColor: '#ECFDF5',
  },
  postCard: {
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
  postBookInfo: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#6366F1',
  },
  postBookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  postBookAuthor: {
    fontSize: 12,
    color: '#6B7280',
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  postStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
});

export default UserProfileScreen;
