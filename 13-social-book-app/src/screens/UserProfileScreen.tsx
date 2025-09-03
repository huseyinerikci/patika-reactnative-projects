import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Text as PaperText,
  Button,
  Chip,
  Surface,
  Avatar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { theme } from '../theme';
import { RootState } from '../types';
import { loadUserPosts } from '../store/slices/postsSlice';
import { loadFavoriteBooks } from '../store/slices/booksSlice';

interface Props {
  navigation: any;
  route: { params: { userId: string } };
}

const UserProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId } = route.params;
  const dispatch = useDispatch();
  const { user } = useSelector((s: RootState) => s.auth);
  const { userPosts, loading } = useSelector((s: RootState) => s.posts);
  const { favoriteBooks } = useSelector((s: RootState) => s.books);
  const isSelf = user?.uid === userId;
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(loadUserPosts(userId) as any);
    dispatch(loadFavoriteBooks(userId) as any);
  }, [dispatch, userId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(loadUserPosts(userId) as any),
      dispatch(loadFavoriteBooks(userId) as any),
    ]);
    setRefreshing(false);
  };

  const header = (
    <View style={styles.header}>
      <View style={styles.profileRow}>
        <Avatar.Image
          size={72}
          source={{ uri: user?.photoURL || 'https://via.placeholder.com/72' }}
        />
        <View style={styles.profileText}>
          <PaperText style={styles.displayName}>
            {user?.displayName || 'Kullanıcı'}
          </PaperText>
          <PaperText style={styles.bio} numberOfLines={2}>
            {user?.bio || 'Merhaba! Kitaplarla dolu bir dünyadayım.'}
          </PaperText>
          <View style={styles.statsRow}>
            <Chip icon="book" style={styles.statChip}>
              {favoriteBooks.length} Favori
            </Chip>
            <Chip icon="post" style={styles.statChip}>
              {userPosts.length} Gönderi
            </Chip>
          </View>
        </View>
      </View>
      {isSelf ? (
        <Button
          mode="contained"
          style={styles.editBtn}
          onPress={() => navigation.navigate('Profile')}
        >
          Profili Düzenle
        </Button>
      ) : null}

      <Surface style={styles.favsSection}>
        <View style={styles.sectionHeader}>
          <PaperText style={styles.sectionTitle}>Favori Kitaplar</PaperText>
          <PaperText style={styles.sectionSubtitle}>
            {favoriteBooks.length}
          </PaperText>
        </View>
        <View style={styles.favsRow}>
          {favoriteBooks.slice(0, 10).map(book => (
            <TouchableOpacity
              key={book.id}
              onPress={() => navigation.navigate('BookDetail', { book })}
            >
              {book.coverImage ? (
                <Image
                  source={{ uri: book.coverImage }}
                  style={styles.favCover}
                />
              ) : (
                <View style={[styles.favCover, styles.favPlaceholder]}>
                  <Icon
                    name="book"
                    size={18}
                    color={theme.colors.placeholder}
                  />
                </View>
              )}
            </TouchableOpacity>
          ))}
          {favoriteBooks.length === 0 ? (
            <PaperText style={styles.emptyFavs}>Henüz favori yok.</PaperText>
          ) : null}
        </View>
      </Surface>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={userPosts}
        keyExtractor={item => item.id}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <Surface style={styles.postCard}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('PostDetail', { postId: item.id })
              }
            >
              <View style={styles.postRow}>
                <View style={styles.postCol}>
                  <PaperText style={styles.postTitle}>
                    {item.bookTitle}
                  </PaperText>
                  <PaperText style={styles.postAuthor}>
                    {item.bookAuthor}
                  </PaperText>
                  <PaperText numberOfLines={2} style={styles.postContent}>
                    {item.content}
                  </PaperText>
                </View>
                {item.images?.[0] ? (
                  <Image
                    source={{ uri: item.images[0] }}
                    style={styles.postThumb}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
          </Surface>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    padding: theme.spacing.lg,
  },
  profileRow: {
    flexDirection: 'row',
  },
  profileText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  displayName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  bio: {
    color: theme.colors.placeholder,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
  },
  statChip: {
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  editBtn: {
    marginTop: theme.spacing.md,
  },
  favsSection: {
    marginTop: theme.spacing.lg,
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
  favsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  favCover: {
    width: 56,
    height: 84,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  favPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyFavs: {
    color: theme.colors.placeholder,
    paddingVertical: theme.spacing.sm,
  },
  postCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.small,
  },
  postRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postCol: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  postTitle: {
    fontWeight: '600',
  },
  postAuthor: {
    color: theme.colors.placeholder,
    marginBottom: theme.spacing.xs,
  },
  postContent: {
    lineHeight: 20,
  },
  postThumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
});

export default UserProfileScreen;
