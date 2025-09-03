import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Share,
  TouchableOpacity,
} from 'react-native';
import {
  Text as PaperText,
  Button,
  Chip,
  Surface,
  Divider,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { theme } from '../theme';
import { RootState, Book, Post } from '../types';
import {
  addToFavorites,
  removeFromFavorites,
  loadFavoriteBooks,
} from '../store/slices/booksSlice';

interface Props {
  navigation: any;
  route: { params: { book: Book } };
}

const BookDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { book } = route.params;
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((s: RootState) => s.auth);
  const { favoriteBooks } = useSelector((s: RootState) => s.books);
  const { posts } = useSelector((s: RootState) => s.posts);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (user) {
      // ensure favorites are loaded
      dispatch(loadFavoriteBooks(user.uid) as any);
    }
  }, [dispatch, user]);

  const relatedPosts = useMemo(() => {
    const normalizedTitle = (book.title || '').trim().toLowerCase();
    return posts.filter(
      (p: Post) => p.bookTitle.trim().toLowerCase() === normalizedTitle,
    );
  }, [posts, book.title]);

  const averageRating = useMemo(() => {
    if (relatedPosts.length === 0) return undefined;
    const sum = relatedPosts.reduce((acc, p) => acc + (p.rating || 0), 0);
    return Math.round((sum / relatedPosts.length) * 10) / 10;
  }, [relatedPosts]);

  const isFavorite = useMemo(
    () => favoriteBooks.some(b => b.id === book.id),
    [favoriteBooks, book.id],
  );

  const handleToggleFavorite = async () => {
    if (!user) return;
    setToggling(true);
    try {
      if (isFavorite) {
        await (dispatch(
          removeFromFavorites({ bookId: book.id, userId: user.uid }) as any,
        ) as any);
      } else {
        await (dispatch(
          addToFavorites({ book, userId: user.uid }) as any,
        ) as any);
      }
    } finally {
      setToggling(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${book.title} - ${book.author}\n${book.genre || ''}`.trim(),
      });
    } catch {}
  };

  const renderStars = (value: number) => (
    <View style={styles.starsRow}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon
          key={i}
          name={i < Math.round(value) ? 'star' : 'star-outline'}
          size={18}
          color={theme.colors.warning}
        />
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={theme.colors.gradient.primary}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <View style={styles.coverWrap}>
            {book.coverImage ? (
              <Image source={{ uri: book.coverImage }} style={styles.cover} />
            ) : (
              <View style={[styles.cover, styles.coverPlaceholder]}>
                <Icon name="book" size={42} color="#fff" />
              </View>
            )}
          </View>
          <View style={styles.heroText}>
            <PaperText style={styles.title}>{book.title}</PaperText>
            <PaperText style={styles.author}>{book.author}</PaperText>
            {book.genre ? (
              <Chip style={styles.genreChip} textStyle={styles.genreText}>
                {book.genre}
              </Chip>
            ) : null}
            {typeof averageRating === 'number' ? (
              <View style={styles.avgRow}>
                {renderStars(averageRating)}
                <PaperText style={styles.avgText}>
                  {averageRating}/5 · {relatedPosts.length} değerlendirme
                </PaperText>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.heroActions}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('AddPost')}
            icon="plus"
          >
            Bu kitapla paylaş
          </Button>
          <View style={styles.iconActions}>
            <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
              <Icon name="share-outline" size={22} color="#fff" />
            </TouchableOpacity>
            {isAuthenticated ? (
              <TouchableOpacity
                onPress={handleToggleFavorite}
                disabled={toggling}
                style={styles.iconBtn}
              >
                <Icon
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isFavorite ? theme.colors.accent : '#fff'}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </LinearGradient>

      {book.description ? (
        <Surface style={styles.section}>
          <PaperText style={styles.sectionTitle}>Hakkında</PaperText>
          <PaperText style={styles.description}>{book.description}</PaperText>
        </Surface>
      ) : null}

      <Surface style={styles.section}>
        <View style={styles.sectionHeader}>
          <PaperText style={styles.sectionTitle}>Gönderiler</PaperText>
          <PaperText style={styles.sectionSubtitle}>
            {relatedPosts.length} sonuç
          </PaperText>
        </View>
        <Divider />
        {relatedPosts.map(post => (
          <TouchableOpacity
            key={post.id}
            style={styles.postRow}
            onPress={() =>
              navigation.navigate('PostDetail', { postId: post.id })
            }
          >
            <View style={styles.postText}>
              <PaperText numberOfLines={1} style={styles.postTitle}>
                {post.userName}
              </PaperText>
              <PaperText numberOfLines={2} style={styles.postExcerpt}>
                {post.content}
              </PaperText>
              <View style={styles.postMeta}>{renderStars(post.rating)}</View>
            </View>
            {post.images?.[0] ? (
              <Image
                source={{ uri: post.images[0] }}
                style={styles.postThumb}
              />
            ) : null}
          </TouchableOpacity>
        ))}
        {relatedPosts.length === 0 ? (
          <PaperText style={styles.emptyPosts}>
            Bu kitapla ilgili gönderi yok.
          </PaperText>
        ) : null}
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: theme.spacing.xxl,
  },
  hero: {
    padding: theme.spacing.lg,
  },
  heroContent: {
    flexDirection: 'row',
  },
  coverWrap: {
    marginRight: theme.spacing.lg,
  },
  cover: {
    width: 110,
    height: 160,
    borderRadius: theme.roundness,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  coverPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  author: {
    color: 'rgba(255,255,255,0.9)',
    marginBottom: theme.spacing.sm,
  },
  genreChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginBottom: theme.spacing.sm,
  },
  genreText: {
    color: '#fff',
  },
  avgRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avgText: {
    color: 'rgba(255,255,255,0.9)',
    marginLeft: theme.spacing.xs,
  },
  starsRow: {
    flexDirection: 'row',
  },
  heroActions: {
    marginTop: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconActions: {
    flexDirection: 'row',
  },
  iconBtn: {
    marginLeft: theme.spacing.md,
  },
  section: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    color: theme.colors.placeholder,
  },
  description: {
    lineHeight: 22,
  },
  postRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  postText: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  postTitle: {
    fontSize: 15,
    marginBottom: 2,
  },
  postExcerpt: {
    color: theme.colors.text,
  },
  postMeta: {
    marginTop: theme.spacing.xs,
  },
  postThumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  emptyPosts: {
    textAlign: 'center',
    color: theme.colors.placeholder,
    paddingVertical: theme.spacing.md,
  },
});

export default BookDetailScreen;
