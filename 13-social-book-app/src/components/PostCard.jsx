import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';

const PostCard = ({ post, onUserPress, currentUserId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!post?.id || !currentUserId) return;
    const unsubscribe = firestore()
      .collection('posts')
      .doc(post.id)
      .collection('likes')
      .onSnapshot(snapshot => {
        setLikeCount(snapshot.size);
        setLiked(snapshot.docs.some(doc => doc.id === currentUserId));
      });
    return unsubscribe;
  }, [post?.id, currentUserId]);

  const handleLike = async () => {
    if (!post?.id || !currentUserId || loading) return;
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
      //
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;
  return (
    <View style={styles.cardOuter}>
      <View style={styles.cardShadow} />
      <View style={styles.postCard}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={() => onUserPress && onUserPress(post.userId)}
          >
            {post.userPhotoURL ? (
              <Image
                source={{ uri: post.userPhotoURL }}
                style={styles.avatar}
              />
            ) : (
              <Icon
                name="person"
                size={36}
                color="#6366F1"
                style={styles.avatar}
              />
            )}
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.userName}>
              {post.userFullName || 'Kullanıcı'}
            </Text>
            <Text style={styles.date}>
              {post.createdAt
                ? post.createdAt.seconds
                  ? new Date(post.createdAt.seconds * 1000).toLocaleDateString(
                      'tr-TR',
                    )
                  : new Date(post.createdAt).toLocaleDateString('tr-TR')
                : ''}
            </Text>
          </View>
        </View>

        {post.imageUrl && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
          </View>
        )}

        <Text style={styles.content}>{post.content}</Text>

        {post.bookTitle && (
          <View style={styles.bookInfo}>
            <Icon name="menu-book" size={18} color="#6366F1" />
            <View style={styles.bookDetails}>
              <Text style={styles.bookTitle}>{post.bookTitle}</Text>
              {post.bookAuthor && (
                <Text style={styles.bookAuthor}>Yazar: {post.bookAuthor}</Text>
              )}
              {post.bookGenre && (
                <Text style={styles.bookGenre}>Tür: {post.bookGenre}</Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.postActions}>
          <TouchableOpacity
            style={[styles.actionButton, liked && styles.likedButton]}
            onPress={handleLike}
          >
            {loading ? (
              <Icon name="favorite" size={24} color="#EF4444" />
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
    </View>
  );
};

const styles = StyleSheet.create({
  cardOuter: {
    marginBottom: 24,
    position: 'relative',
  },
  cardShadow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 0,
    bottom: 0,
    backgroundColor: '#E5E7EB',
    borderRadius: 24,
    zIndex: 0,
    opacity: 0.5,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    minHeight: 56,
    paddingTop: 4,
  },
  avatarWrapper: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 16,
  },
  date: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    marginTop: 4,
  },
  postImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  content: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 10,
    marginTop: 2,
  },
  bookInfo: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
    alignItems: 'center',
  },
  bookDetails: { marginLeft: 12, flex: 1 },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  bookAuthor: { fontSize: 14, color: '#4B5563', marginBottom: 2 },
  bookGenre: { fontSize: 12, color: '#6B7280' },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 6,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  likedButton: { backgroundColor: '#FEF2F2' },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  likedText: { color: '#EF4444' },
});

export default PostCard;
