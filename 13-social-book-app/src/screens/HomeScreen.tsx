import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Platform,
} from 'react-native';
import {
  Card,
  Text as PaperText,
  Avatar,
  Button,
  Chip,
  Surface,
  IconButton,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { loadPosts, likePost, addComment } from '../store/slices/postsSlice';
import { AppDispatch, RootState } from '../store';
import { Post } from '../types';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Props {
  navigation: any;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading } = useSelector((state: RootState) => state.posts);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    loadPostsData();
  }, []);

  const loadPostsData = async () => {
    try {
      await dispatch(loadPosts()).unwrap();
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPostsData();
    setRefreshing(false);
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    try {
      await dispatch(likePost({ postId, userId: user.uid }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatDate = (value: any) => {
    if (value instanceof Date) {
      return value.toLocaleDateString('tr-TR');
    }
    return '';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color={theme.colors.warning}
      />
    ));
  };

  const renderPost = ({ item }: { item: Post }) => {
    const isLiked = user ? item.likes.includes(user.uid) : false;

    return (
      <Card style={styles.postCard}>
        <Card.Content>
          {/* Header */}
          <View style={styles.postHeader}>
            <TouchableOpacity
              style={styles.userInfo}
              onPress={() =>
                navigation.navigate('UserProfile', { userId: item.userId })
              }
            >
              <Avatar.Image
                size={40}
                source={{
                  uri: item.userAvatar || 'https://picsum.photos/200',
                }}
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{item.userName}</Text>
                <Text style={styles.postTime}>
                  {formatDate(item.createdAt)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Book Info */}
          <Surface style={styles.bookInfo}>
            <View style={styles.bookContent}>
              {item.bookCover && (
                <Image
                  source={{ uri: item.bookCover }}
                  style={styles.bookCover}
                />
              )}
              <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>{item.bookTitle}</Text>
                <PaperText style={styles.bookAuthor}>
                  {item.bookAuthor}
                </PaperText>
                <Chip style={styles.genreChip} textStyle={styles.genreText}>
                  {item.bookGenre}
                </Chip>
                <View style={styles.ratingContainer}>
                  {renderStars(item.rating)}
                  <Text style={styles.ratingText}>({item.rating}/5)</Text>
                </View>
              </View>
            </View>
          </Surface>

          {/* Post Content */}
          <PaperText style={styles.postContent}>{item.content}</PaperText>

          {/* Post Images */}
          {item.images.length > 0 && (
            <View style={styles.imagesContainer}>
              <FlatList
                data={item.images}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item: imageUrl }) => (
                  <Image source={{ uri: imageUrl }} style={styles.postImage} />
                )}
                keyExtractor={(imageUrl, index) => `${item.id}-${index}`}
              />
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, isLiked && styles.likedButton]}
              onPress={() => handleLike(item.id)}
            >
              <Icon
                name={isLiked ? 'heart' : 'heart-outline'}
                size={24}
                color={isLiked ? theme.colors.accent : theme.colors.placeholder}
              />
              <Text style={[styles.actionText, isLiked && styles.likedText]}>
                {item.likes.length}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate('PostDetail', { postId: item.id })
              }
            >
              <Icon
                name="comment-outline"
                size={24}
                color={theme.colors.placeholder}
              />
              <Text style={styles.actionText}>{item.comments.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon
                name="share-outline"
                size={24}
                color={theme.colors.placeholder}
              />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    );
  };

  // DÜZELTME: renderHeader fonksiyonu SafeAreaView olmadan
  const renderHeader = () => (
    <LinearGradient colors={theme.colors.gradient.accent} style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.greetingContainer}>
          <PaperText style={styles.greeting}>
            Merhaba, {user?.displayName?.split(' ')[0] || 'Okuyucu'}! 📚
          </PaperText>
          <PaperText style={styles.headerSubtitle}>
            Bugün hangi kitapları keşfedeceksin?
          </PaperText>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('AddPost')}>
          <View style={styles.addButton}>
            <Icon name="plus" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  if (posts.length === 0 && !loading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {renderHeader()}
        <View style={styles.emptyContainer}>
          <Icon
            name="book-open-page-variant"
            size={80}
            color={theme.colors.placeholder}
          />
          <PaperText style={styles.emptyTitle}>Henüz gönderi yok</PaperText>
          <PaperText style={styles.emptyText}>
            İlk sen paylaş ve topluluğu canlandır!
          </PaperText>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('AddPost')}
            style={styles.firstPostButton}
          >
            İlk Gönderini Oluştur
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 20 : 30,
    paddingBottom: theme.spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.lg,
    minHeight: 100,
  },
  greetingContainer: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  greeting: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: theme.spacing.xs,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postCard: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.roundness * 1.5,
    ...theme.shadows.small,
  },
  postHeader: {
    marginBottom: theme.spacing.md,
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  bookInfo: {
    padding: theme.spacing.md,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.md,
    elevation: 1,
  },
  bookContent: {
    flexDirection: 'row',
  },
  bookCover: {
    width: 60,
    height: 90,
    borderRadius: theme.roundness,
    marginRight: theme.spacing.md,
  },
  bookDetails: {
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
    marginBottom: theme.spacing.sm,
  },
  genreText: {
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.placeholder,
    fontSize: 12,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  imagesContainer: {
    marginBottom: theme.spacing.md,
  },
  postImage: {
    width: width * 0.7,
    height: 200,
    borderRadius: theme.roundness,
    marginRight: theme.spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.roundness,
  },
  likedButton: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
  },
  actionText: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.placeholder,
    fontWeight: '500',
  },
  likedText: {
    color: theme.colors.accent,
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
    marginBottom: theme.spacing.xl,
  },
  firstPostButton: {
    paddingHorizontal: theme.spacing.lg,
  },
});

export default HomeScreen;
