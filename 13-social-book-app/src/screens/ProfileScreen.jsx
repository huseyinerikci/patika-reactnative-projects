// ProfileScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

const BookCard = ({ book, onRemove }) => (
  <View style={styles.bookCard}>
    <View style={styles.bookIcon}>
      <Icon name="menu-book" size={24} color="#6366F1" />
    </View>
    <View style={styles.bookInfo}>
      <Text style={styles.bookTitle}>{book.title}</Text>
      <Text style={styles.bookAuthor}>Yazar: {book.author}</Text>
      <Text style={styles.bookGenre}>Tür: {book.genre}</Text>
    </View>
    {onRemove && (
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(book)}
      >
        <Icon name="close" size={20} color="#EF4444" />
      </TouchableOpacity>
    )}
  </View>
);

const ProfileScreen = ({ navigation }) => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('books');

  const { user, userData, signOut } = useAuth();

  const fetchFavoriteBooks = async () => {
    try {
      const userDoc = await firestore().collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        const data = userDoc.data();
        setFavoriteBooks(data.favoriteBooks || []);
      }
    } catch (error) {
      console.error('Favorite books fetch error:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('posts')
        .where('userId', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .get();

      const postsData = await Promise.all(
        querySnapshot.docs.map(async doc => {
          const data = doc.data();
          const likesSnapshot = await doc.ref.collection('likes').get();
          const likesCount = likesSnapshot.size;
          const likedByUser = likesSnapshot.docs.some(
            likeDoc => likeDoc.id === user.uid,
          );

          return {
            id: doc.id,
            ...data,
            likesCount,
            likedByUser,
          };
        }),
      );

      setUserPosts(postsData);
    } catch (error) {
      console.error('User posts fetch error:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchFavoriteBooks(), fetchUserPosts()]);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSignOut = () => {
    Alert.alert('Çıkış Yap', 'Çıkış yapmak istediğinizden emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        onPress: async () => {
          const result = await signOut();
          if (!result.success) Alert.alert('Hata', result.error);
        },
      },
    ]);
  };

  const removeFromFavorites = async bookToRemove => {
    Alert.alert(
      'Kitabı Kaldır',
      'Bu kitabı favori kitaplarınızdan kaldırmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kaldır',
          onPress: async () => {
            try {
              await firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                  favoriteBooks: firestore.FieldValue.arrayRemove(bookToRemove),
                });

              setFavoriteBooks(prev =>
                prev.filter(
                  book =>
                    !(
                      book.title === bookToRemove.title &&
                      book.author === bookToRemove.author
                    ),
                ),
              );
            } catch (error) {
              console.error('Remove book error:', error);
              Alert.alert('Hata', 'Kitap kaldırılırken bir hata oluştu.');
            }
          },
        },
      ],
    );
  };

  const handleLike = async (postId, currentlyLiked) => {
    if (!user) return;
    const postRef = firestore().collection('posts').doc(postId);
    const likeRef = postRef.collection('likes').doc(user.uid);

    try {
      const likeDoc = await likeRef.get();
      if (likeDoc.exists) {
        await likeRef.delete();
      } else {
        await likeRef.set({
          userId: user.uid,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      }

      setUserPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                likesCount: currentlyLiked
                  ? post.likesCount - 1
                  : post.likesCount + 1,
                likedByUser: !currentlyLiked,
              }
            : post,
        ),
      );
    } catch (error) {
      console.error('Like press error:', error);
    }
  };

  const PostItem = ({ post }) => (
    <View style={styles.postItem}>
      {post.bookTitle && (
        <View style={styles.postBookInfo}>
          <Text style={styles.postBookTitle}>{post.bookTitle}</Text>
          <Text style={styles.postBookAuthor}>Yazar: {post.bookAuthor}</Text>
        </View>
      )}
      <Text style={styles.postContent} numberOfLines={3}>
        {post.content}
      </Text>
      <View style={styles.postFooter}>
        <Text style={styles.postDate}>
          {post.createdAt?.toDate().toLocaleDateString('tr-TR')}
        </Text>
        <View style={styles.postStats}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => handleLike(post.id, post.likedByUser)}
          >
            <Icon
              name={post.likedByUser ? 'favorite' : 'favorite-border'}
              size={16}
              color={post.likedByUser ? '#EF4444' : '#6B7280'}
            />
            <Text style={styles.statText}>{post.likesCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#6366F1']}
        />
      }
    >
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Icon name="person" size={40} color="#6366F1" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData?.fullName}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleSignOut}
          >
            <Icon name="logout" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{favoriteBooks.length}</Text>
            <Text style={styles.statLabel}>Favori Kitap</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userPosts.length}</Text>
            <Text style={styles.statLabel}>Gönderi</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {userPosts.reduce((acc, post) => acc + (post.likesCount || 0), 0)}
            </Text>
            <Text style={styles.statLabel}>Toplam Beğeni</Text>
          </View>
        </View>
      </View>

      {/* Tab ve içerik */}
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
            Gönderilerim
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'books' ? (
          favoriteBooks.length > 0 ? (
            favoriteBooks.map((book, index) => (
              <BookCard
                key={`${book.title}-${book.author}-${index}`}
                book={book}
                onRemove={removeFromFavorites}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="library-books" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>Henüz favori kitabınız yok</Text>
              <Text style={styles.emptySubtitle}>
                Gönderi paylaşırken kitap ekleyerek favori listenizi oluşturun
              </Text>
            </View>
          )
        ) : userPosts.length > 0 ? (
          userPosts.map(post => <PostItem key={post.id} post={post} />)
        ) : (
          <View style={styles.emptyState}>
            <Icon name="article" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Henüz gönderiniz yok</Text>
            <Text style={styles.emptySubtitle}>
              İlk gönderinizi paylaşmaya ne dersiniz?
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Styles aynı
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
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
  userInfo: { flex: 1 },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: { fontSize: 14, color: '#6B7280' },
  settingsButton: { padding: 12, borderRadius: 12, backgroundColor: '#F9FAFB' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  statBox: { alignItems: 'center' },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 4,
  },
  statLabel: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  activeTab: { backgroundColor: '#EEF2FF' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#9CA3AF', marginLeft: 8 },
  activeTabText: { color: '#6366F1' },
  content: { padding: 16 },
  bookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  bookInfo: { flex: 1 },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  bookAuthor: { fontSize: 14, color: '#6B7280', marginBottom: 2 },
  bookGenre: { fontSize: 12, color: '#9CA3AF' },
  removeButton: { padding: 8, borderRadius: 8, backgroundColor: '#FEF2F2' },
  postItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  postBookAuthor: { fontSize: 12, color: '#6B7280' },
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
  postDate: { fontSize: 12, color: '#9CA3AF' },
  postStats: { flexDirection: 'row' },
  statItem: { flexDirection: 'row', alignItems: 'center', marginLeft: 16 },
  statText: { fontSize: 12, color: '#6B7280', marginLeft: 4 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
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

export default ProfileScreen;
