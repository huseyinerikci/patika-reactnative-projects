import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Card,
  Text as PaperText,
  Avatar,
  Button,
  Surface,
  Divider,
  IconButton,
  TextInput,
  Modal,
  Portal,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { logoutUser, updateProfile } from '../store/slices/authSlice';
import { loadUserPosts } from '../store/slices/postsSlice';
import { loadFavoriteBooks } from '../store/slices/booksSlice';
import { AppDispatch, RootState } from '../store';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

interface Props {
  navigation: any;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { userPosts } = useSelector((state: RootState) => state.posts);
  const { favoriteBooks } = useSelector((state: RootState) => state.books);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      await Promise.all([
        dispatch(loadUserPosts(user.uid)),
        dispatch(loadFavoriteBooks(user.uid)),
      ]);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: () => dispatch(logoutUser()),
        },
      ],
    );
  };

  const handleEditProfile = () => {
    setEditName(user?.displayName || '');
    setEditBio(user?.bio || '');
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!user || !editName.trim()) return;

    setLoading(true);
    try {
      await dispatch(
        updateProfile({
          displayName: editName.trim(),
          bio: editBio.trim(),
        }),
      );
      setEditModalVisible(false);
    } catch (error) {
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAvatar = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 400,
        maxHeight: 400,
      },
      response => {
        if (response.assets && response.assets[0]) {
          console.log('New avatar selected:', response.assets[0]);
        }
      },
    );
  };

  const formatDate = (value: any) => {
    if (value instanceof Date) {
      return value.toLocaleDateString('tr-TR');
    }
    return '';
  };

  const renderStats = () => (
    <Surface style={styles.statsContainer}>
      <View style={styles.statItem}>
        <PaperText style={styles.statNumber}>{userPosts.length}</PaperText>
        <PaperText style={styles.statLabel}>Gönderi</PaperText>
      </View>
      <Divider style={styles.statDivider} />
      <View style={styles.statItem}>
        <PaperText style={styles.statNumber}>{favoriteBooks.length}</PaperText>
        <PaperText style={styles.statLabel}>Favori Kitap</PaperText>
      </View>
      <Divider style={styles.statDivider} />
      <View style={styles.statItem}>
        <PaperText style={styles.statNumber}>
          {user?.followersCount || 0}
        </PaperText>
        <PaperText style={styles.statLabel}>Takipçi</PaperText>
      </View>
    </Surface>
  );

  const renderFavoriteBooks = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <PaperText style={styles.sectionTitle}>Favori Kitaplarım</PaperText>
          <IconButton
            icon="plus"
            size={20}
            onPress={() => navigation.navigate('Search')}
          />
        </View>

        {favoriteBooks.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {favoriteBooks.slice(0, 10).map((book, index) => (
              <TouchableOpacity
                key={book.id}
                style={styles.favoriteBook}
                onPress={() => navigation.navigate('BookDetail', { book })}
              >
                {book.coverImage ? (
                  <Image
                    source={{ uri: book.coverImage }}
                    style={styles.bookCover}
                  />
                ) : (
                  <View style={styles.placeholderCover}>
                    <Icon
                      name="book"
                      size={20}
                      color={theme.colors.placeholder}
                    />
                  </View>
                )}
                <PaperText style={styles.bookTitle} numberOfLines={2}>
                  {book.title}
                </PaperText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyBooks}>
            <Icon
              name="heart-plus"
              size={40}
              color={theme.colors.placeholder}
            />
            <PaperText style={styles.emptyText}>
              Henüz favori kitabın yok
            </PaperText>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Search')}
              style={styles.addBooksButton}
            >
              Kitap Ekle
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderRecentPosts = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <PaperText style={styles.sectionTitle}>Son Gönderilerim</PaperText>
          <IconButton
            icon="eye"
            size={20}
            onPress={() => {
              /* Navigate to full posts */
            }}
          />
        </View>

        {userPosts.length > 0 ? (
          <View>
            {userPosts.slice(0, 3).map((post, index) => (
              <TouchableOpacity
                key={post.id}
                style={styles.postItem}
                onPress={() =>
                  navigation.navigate('PostDetail', { postId: post.id })
                }
              >
                <View style={styles.postContent}>
                  <PaperText style={styles.postTitle}>
                    {post.bookTitle}
                  </PaperText>
                  <PaperText numberOfLines={2}>{post.content}</PaperText>
                  <View style={styles.postMeta}>
                    <PaperText style={styles.postDate}>
                      {formatDate(post.createdAt)}
                    </PaperText>
                    <View style={styles.postStats}>
                      <Icon
                        name="heart"
                        size={16}
                        color={theme.colors.accent}
                      />
                      <PaperText style={styles.postStatText}>
                        {post.likes.length}
                      </PaperText>
                      <Icon
                        name="comment"
                        size={16}
                        color={theme.colors.primary}
                      />
                      <PaperText style={styles.postStatText}>
                        {post.comments.length}
                      </PaperText>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyPosts}>
            <Icon name="post" size={40} color={theme.colors.placeholder} />
            <PaperText style={styles.emptyText}>Henüz gönderin yok</PaperText>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('AddPost')}
              style={styles.addPostButton}
            >
              İlk Gönderiyi Oluştur
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  if (!user) {
    return <View style={styles.container} />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={theme.colors.gradient.primary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={handleChangeAvatar}
            style={styles.avatarContainer}
          >
            <Avatar.Image
              size={100}
              source={{
                uri: user.photoURL || 'https://picsum.photos/200',
              }}
            />
            <View style={styles.avatarOverlay}>
              <Icon name="camera" size={18} color="white" />
            </View>
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <PaperText style={styles.userName}>{user.displayName}</PaperText>
            {user.bio && (
              <PaperText style={styles.userBio}>{user.bio}</PaperText>
            )}
            <View style={styles.profileActions}>
              <Button
                mode="outlined"
                onPress={handleEditProfile}
                style={styles.editButton}
                labelStyle={styles.editButtonText}
              >
                Profili Düzenle
              </Button>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Stats */}
      {renderStats()}

      {/* Content */}
      <View style={styles.content}>
        {renderFavoriteBooks()}
        {renderRecentPosts()}

        {/* Settings */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <PaperText style={styles.sectionTitle}>Ayarlar</PaperText>
            <TouchableOpacity style={styles.settingItem}>
              <Icon name="shield-account" size={24} color={theme.colors.text} />
              <PaperText style={styles.settingText}>Gizlilik</PaperText>
              <Icon
                name="chevron-right"
                size={24}
                color={theme.colors.placeholder}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Icon name="bell" size={24} color={theme.colors.text} />
              <PaperText style={styles.settingText}>Bildirimler</PaperText>
              <Icon
                name="chevron-right"
                size={24}
                color={theme.colors.placeholder}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
              <Icon name="logout" size={24} color={theme.colors.notification} />
              <PaperText
                style={[
                  styles.settingText,
                  { color: theme.colors.notification },
                ]}
              >
                Çıkış Yap
              </PaperText>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </View>

      {/* Edit Profile Modal */}
      <Portal>
        <Modal
          visible={editModalVisible}
          onDismiss={() => setEditModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Content>
              <PaperText style={styles.modalTitle}>Profili Düzenle</PaperText>

              <TextInput
                label="Ad Soyad"
                value={editName}
                onChangeText={setEditName}
                mode="outlined"
                style={styles.modalInput}
              />

              <TextInput
                label="Hakkında"
                value={editBio}
                onChangeText={setEditBio}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.modalInput}
              />

              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={() => setEditModalVisible(false)}
                  style={styles.cancelButton}
                >
                  İptal
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSaveProfile}
                  loading={loading}
                  style={styles.saveButton}
                >
                  Kaydet
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 20 : 30,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 200,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: theme.spacing.lg,
  },
  userName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  userBio: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: theme.spacing.md,
  },
  profileActions: {
    flexDirection: 'row',
  },
  editButton: {
    borderColor: 'white',
  },
  editButtonText: {
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.lg,
    marginTop: -theme.spacing.lg,
    borderRadius: theme.roundness * 1.5,
    paddingVertical: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    color: theme.colors.placeholder,
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: '60%',
    alignSelf: 'center',
  },
  content: {
    padding: theme.spacing.lg,
  },
  sectionCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.roundness * 1.5,
    ...theme.shadows.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  favoriteBook: {
    width: 80,
    marginRight: theme.spacing.md,
    alignItems: 'center',
  },
  bookCover: {
    width: 60,
    height: 90,
    borderRadius: theme.roundness,
    marginBottom: theme.spacing.sm,
  },
  placeholderCover: {
    width: 60,
    height: 90,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.disabled,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  bookTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  emptyBooks: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  emptyPosts: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  emptyText: {
    color: theme.colors.placeholder,
    marginVertical: theme.spacing.sm,
    textAlign: 'center',
  },
  addBooksButton: {
    marginTop: theme.spacing.sm,
  },
  addPostButton: {
    marginTop: theme.spacing.sm,
  },
  postItem: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  postContent: {
    flex: 1,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  postDate: {
    color: theme.colors.placeholder,
    fontSize: 12,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postStatText: {
    marginLeft: theme.spacing.xs,
    marginRight: theme.spacing.sm,
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  settingText: {
    flex: 1,
    marginLeft: theme.spacing.md,
    fontSize: 16,
  },
  modalContainer: {
    margin: theme.spacing.lg,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalInput: {
    marginBottom: theme.spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
  },
  cancelButton: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  saveButton: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
});

export default ProfileScreen;
