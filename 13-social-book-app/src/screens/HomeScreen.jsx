import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const PostCard = ({ post, onUserPress, currentUserId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Real-time like takibi
    const unsubscribe = firestore()
      .collection('posts')
      .doc(post.id)
      .collection('likes')
      .onSnapshot(snapshot => {
        setLikeCount(snapshot.size);
        setLiked(snapshot.docs.some(doc => doc.id === currentUserId));
      });

    return unsubscribe;
  }, [post.id, currentUserId]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    const likeRef = firestore()
      .collection('posts')
      .doc(post.id)
      .collection('likes')
      .doc(currentUserId);

    try {
      if (liked) {
        await likeRef.delete();
      } else {
        await likeRef.set({
          userId: currentUserId,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Like error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.postCard}>
      <TouchableOpacity
        style={styles.userInfo}
        onPress={() => onUserPress(post.userId)}
      >
        <View style={styles.avatar}>
          <Icon name="person" size={24} color="#6366F1" />
        </View>
        <View>
          <Text style={styles.userName}>{post.userFullName}</Text>
          <Text style={styles.postDate}>
            {post.createdAt?.toDate().toLocaleDateString('tr-TR')}
          </Text>
        </View>
      </TouchableOpacity>

      {post.bookTitle && (
        <View style={styles.bookInfo}>
          <Icon name="book" size={20} color="#6366F1" />
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{post.bookTitle}</Text>
            <Text style={styles.bookAuthor}>Yazar: {post.bookAuthor}</Text>
            {post.bookGenre && (
              <Text style={styles.bookGenre}>Tür: {post.bookGenre}</Text>
            )}
          </View>
        </View>
      )}

      <Text style={styles.postContent}>{post.content}</Text>
      {post.imageUrl && (
        <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
      )}

      <View style={styles.postActions}>
        <TouchableOpacity
          style={[styles.actionButton, liked && styles.likedButton]}
          onPress={handleLike}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color={liked ? '#EF4444' : '#666'}
            />
          ) : (
            <Icon
              name={liked ? 'favorite' : 'favorite-border'}
              size={24}
              color={liked ? '#EF4444' : '#666'}
            />
          )}
          <Text style={[styles.actionText, liked && styles.likedText]}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="chat-bubble-outline" size={24} color="#666" />
          <Text style={styles.actionText}>Yorum</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="share" size={24} color="#666" />
          <Text style={styles.actionText}>Paylaş</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();

      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    } catch (err) {
      console.error('Posts fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.uid) fetchPosts();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleUserPress = userId => {
    if (userId !== user.uid) navigation.navigate('UserProfile', { userId });
    else navigation.navigate('Profil');
  };

  if (loading && !refreshing)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Gönderiler yükleniyor...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onUserPress={handleUserPress}
            currentUserId={user.uid}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6366F1']}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="library-books" size={80} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Henüz gönderi yok</Text>
            <Text style={styles.emptySubtitle}>
              İlk gönderini paylaşmaya ne dersin?
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  listContainer: { padding: 16 },
  postCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  postDate: { fontSize: 12, color: '#6B7280' },
  bookInfo: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  bookDetails: { marginLeft: 12, flex: 1 },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  bookAuthor: { fontSize: 14, color: '#4B5563', marginBottom: 2 },
  bookGenre: { fontSize: 12, color: '#6B7280' },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#F3F4F6',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  likedButton: { backgroundColor: '#FEF2F2' },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  likedText: { color: '#EF4444' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default HomeScreen;
