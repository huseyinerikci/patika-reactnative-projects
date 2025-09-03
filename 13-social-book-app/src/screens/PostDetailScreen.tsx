import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import {
  Card,
  Text as PaperText,
  Avatar,
  Button,
  TextInput,
  Surface,
  Chip,
  Divider,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { likePost, addComment } from '../store/slices/postsSlice';
import { AppDispatch, RootState } from '../store';
import { Post, Comment } from '../types';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

interface Props {
  navigation: any;
  route: {
    params: {
      postId: string;
    };
  };
}

const PostDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { postId } = route.params;
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading } = useSelector((state: RootState) => state.posts);
  const { user } = useSelector((state: RootState) => state.auth);

  const post = posts.find(p => p.id === postId);

  useEffect(() => {
    if (post) {
      navigation.setOptions({
        title: `${post.userName}'ın Gönderisi`,
      });
    }
  }, [post, navigation]);

  const handleLike = async () => {
    if (!user || !post) return;

    try {
      await dispatch(likePost({ postId: post.id, userId: user.uid }));
    } catch (error) {
      Alert.alert('Hata', 'Beğeni işlemi başarısız');
    }
  };

  const handleAddComment = async () => {
    if (!user || !post || !commentText.trim()) return;

    try {
      await dispatch(
        addComment({
          postId: post.id,
          userId: user.uid,
          userName: user.displayName,
          userAvatar: user.photoURL,
          content: commentText.trim(),
        }),
      );
      setCommentText('');
    } catch (error) {
      Alert.alert('Hata', 'Yorum eklenemedi');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: 5 }, (_, index) => (
          <Icon
            key={index}
            name={index < rating ? 'star' : 'star-outline'}
            size={18}
            color={theme.colors.warning}
          />
        ))}
        <PaperText style={styles.ratingText}>({rating}/5)</PaperText>
      </View>
    );
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <TouchableOpacity
        onPress={() => {
          if (item.userId !== user?.uid) {
            navigation.navigate('UserProfile', { userId: item.userId });
          }
        }}
      >
        <Avatar.Image
          size={36}
          source={{ uri: item.userAvatar || 'https://via.placeholder.com/36' }}
        />
      </TouchableOpacity>

      <View style={styles.commentContent}>
        <View style={styles.commentBubble}>
          <PaperText style={styles.commentUserName}>{item.userName}</PaperText>
          <PaperText style={styles.commentText}>{item.content}</PaperText>
        </View>
        <PaperText style={styles.commentTime}>
          {new Date(item.createdAt).toLocaleDateString('tr-TR')} •{' '}
          {new Date(item.createdAt).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </PaperText>
      </View>
    </View>
  );

  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={64} color={theme.colors.placeholder} />
        <PaperText style={styles.errorTitle}>Gönderi bulunamadı</PaperText>
        <PaperText style={styles.errorText}>
          Bu gönderi silinmiş olabilir veya erişim iznine sahip
          olmayabilirsiniz.
        </PaperText>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Geri Dön
        </Button>
      </View>
    );
  }

  const isLiked = user ? post.likes.includes(user.uid) : false;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Post Header */}
        <Card style={styles.postCard}>
          <Card.Content>
            <TouchableOpacity
              style={styles.userInfo}
              onPress={() => {
                if (post.userId !== user?.uid) {
                  navigation.navigate('UserProfile', { userId: post.userId });
                }
              }}
            >
              <Avatar.Image
                size={48}
                source={{
                  uri: post.userAvatar || 'https://via.placeholder.com/48',
                }}
              />
              <View style={styles.userDetails}>
                <PaperText style={styles.userName}>{post.userName}</PaperText>
                <PaperText style={styles.postTime}>
                  {new Date(post.createdAt).toLocaleDateString('tr-TR')} •{' '}
                  {new Date(post.createdAt).toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </PaperText>
              </View>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {/* Book Info */}
        <Surface style={styles.bookInfo}>
          <View style={styles.bookContent}>
            {post.bookCover && (
              <Image
                source={{ uri: post.bookCover }}
                style={styles.bookCover}
              />
            )}
            <View style={styles.bookDetails}>
              <PaperText style={styles.bookTitle}>{post.bookTitle}</PaperText>
              <PaperText style={styles.bookAuthor}>{post.bookAuthor}</PaperText>
              <Chip style={styles.genreChip} textStyle={styles.genreText}>
                {post.bookGenre}
              </Chip>
              {renderStars(post.rating)}
            </View>
          </View>
        </Surface>

        {/* Post Content */}
        <Card style={styles.contentCard}>
          <Card.Content>
            <PaperText style={styles.postContent}>{post.content}</PaperText>
          </Card.Content>
        </Card>

        {/* Post Images */}
        {post.images.length > 0 && (
          <Card style={styles.imagesCard}>
            <Card.Content>
              <FlatList
                data={post.images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item: imageUrl }) => (
                  <Image source={{ uri: imageUrl }} style={styles.postImage} />
                )}
                keyExtractor={(imageUrl, index) => `${post.id}-${index}`}
              />
            </Card.Content>
          </Card>
        )}

        {/* Actions */}
        <Surface style={styles.actionsContainer}>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, isLiked && styles.likedButton]}
              onPress={handleLike}
            >
              <Icon
                name={isLiked ? 'heart' : 'heart-outline'}
                size={28}
                color={isLiked ? theme.colors.accent : theme.colors.text}
              />
              <PaperText
                style={[styles.actionText, isLiked && styles.likedText]}
              >
                {post.likes.length} Beğeni
              </PaperText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowComments(!showComments)}
            >
              <Icon
                name="comment-outline"
                size={28}
                color={theme.colors.text}
              />
              <PaperText style={styles.actionText}>
                {post.comments.length} Yorum
              </PaperText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon name="share-outline" size={28} color={theme.colors.text} />
              <PaperText style={styles.actionText}>Paylaş</PaperText>
            </TouchableOpacity>
          </View>
        </Surface>

        {/* Comments Section */}
        {showComments && (
          <Card style={styles.commentsCard}>
            <Card.Content>
              <PaperText style={styles.commentsTitle}>
                Yorumlar ({post.comments.length})
              </PaperText>

              {post.comments.length > 0 ? (
                <View style={styles.commentsList}>
                  {post.comments.map(comment => (
                    <View key={comment.id}>
                      {renderComment({ item: comment })}
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.noCommentsContainer}>
                  <Icon
                    name="comment-plus"
                    size={48}
                    color={theme.colors.placeholder}
                  />
                  <PaperText style={styles.noCommentsText}>
                    Henüz yorum yapılmamış. İlk sen yorum yap!
                  </PaperText>
                </View>
              )}
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Comment Input */}
      {showComments && (
        <Surface style={styles.commentInputContainer}>
          <Avatar.Image
            size={36}
            source={{ uri: user?.photoURL || 'https://via.placeholder.com/36' }}
            style={styles.commentAvatar}
          />
          <TextInput
            placeholder="Yorum yazın..."
            value={commentText}
            onChangeText={setCommentText}
            mode="outlined"
            style={styles.commentInput}
            multiline
            maxLength={500}
            right={
              <TextInput.Icon
                icon={({ size, color }) => (
                  <Icon
                    name="send"
                    size={size}
                    color={
                      commentText.trim()
                        ? theme.colors.primary
                        : theme.colors.disabled
                    }
                  />
                )}
                onPress={handleAddComment}
                disabled={!commentText.trim() || loading}
              />
            }
          />
        </Surface>
      )}
    </KeyboardAvoidingView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorTitle: {
    marginVertical: theme.spacing.lg,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: theme.colors.placeholder,
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    paddingHorizontal: theme.spacing.lg,
  },
  postCard: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.roundness * 1.5,
    ...theme.shadows.small,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  postTime: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  bookInfo: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.lg,
    borderRadius: theme.roundness * 1.5,
    elevation: 2,
  },
  bookContent: {
    flexDirection: 'row',
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: theme.roundness,
    marginRight: theme.spacing.lg,
  },
  bookDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  bookAuthor: {
    color: theme.colors.placeholder,
    fontSize: 16,
    marginBottom: theme.spacing.sm,
  },
  genreChip: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  genreText: {
    fontSize: 14,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.placeholder,
    fontSize: 14,
  },
  contentCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.roundness * 1.5,
    ...theme.shadows.small,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 26,
  },
  imagesCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.roundness * 1.5,
    ...theme.shadows.small,
  },
  postImage: {
    width: width - theme.spacing.lg * 2,
    height: 300,
    borderRadius: theme.roundness,
  },
  actionsContainer: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.roundness * 1.5,
    elevation: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.roundness * 2,
  },
  likedButton: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
  },
  actionText: {
    marginLeft: theme.spacing.sm,
    fontSize: 14,
    fontWeight: '500',
  },
  likedText: {
    color: theme.colors.accent,
  },
  commentsCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.roundness * 1.5,
    ...theme.shadows.small,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
  },
  commentsList: {
    marginTop: theme.spacing.sm,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    alignItems: 'flex-start',
  },
  commentContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  commentBubble: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness * 1.5,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentTime: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.md,
  },
  noCommentsContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  noCommentsText: {
    color: theme.colors.placeholder,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  commentAvatar: {
    marginRight: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  commentInput: {
    flex: 1,
    maxHeight: 100,
  },
});

export default PostDetailScreen;
