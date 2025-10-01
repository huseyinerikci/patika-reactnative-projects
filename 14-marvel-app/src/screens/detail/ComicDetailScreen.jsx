import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComicsDetails } from '../../store/comicsSlice';
import { toggleFavoriteComic } from '../../store/favoritesSlice';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');
const ComicDetailScreen = ({ route, navigation }) => {
  const { comicId } = route.params;
  const dispatch = useDispatch();
  const { selectedComics } = useSelector(state => state.comics);
  const { favoriteComics } = useSelector(state => state.favorites);
  const isFavorite = favoriteComics.some(comic => comic.id === comicId);

  useEffect(() => {
    dispatch(fetchComicsDetails(comicId));
  }, [comicId]);

  const handleToggleFavorite = () => {
    if (selectedComics) {
      dispatch(toggleFavoriteComic(selectedComics));
    }
  };
  if (!selectedComics) {
    return (
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Çizgi roman yükleniyor...</Text>
      </LinearGradient>
    );
  }
  const imageUrl =
    `${selectedComics.thumbnail.path}.${selectedComics.thumbnail.extension}`.replace(
      'http://',
      'https://',
    );

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <FastImage
            source={{ uri: imageUrl }}
            style={styles.comicImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          <LinearGradient
            colors={['transparent', 'rgba(26, 26, 46, 0.8)']}
            style={styles.imageOverlay}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <Icon
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={24}
              color={isFavorite ? '#e74c3c' : '#fff'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          {selectedComics.title ? (
            <Text style={styles.comicTitle}>{selectedComics.title}</Text>
          ) : null}

          {selectedComics.description ? (
            <Text style={styles.comicDescription}>
              {selectedComics.description}
            </Text>
          ) : (
            <Text style={styles.comicDescription}>
              Bu çizgi roman hakkında açıklama bulunmuyor.
            </Text>
          )}

          {/* Bilgiler */}
          <View style={styles.infoContainer}>
            {selectedComics.dates &&
              selectedComics.dates.length > 0 &&
              selectedComics.dates[0].date && (
                <View style={styles.infoItem}>
                  <Icon name="calendar-today" size={20} color="#e74c3c" />
                  <Text style={styles.infoText}>
                    {new Date(selectedComics.dates[0].date).toLocaleDateString(
                      'tr-TR',
                    )}
                  </Text>
                </View>
              )}

            {selectedComics.pageCount ? (
              <View style={styles.infoItem}>
                <Icon name="book" size={20} color="#e74c3c" />
                <Text style={styles.infoText}>
                  {selectedComics.pageCount} sayfa
                </Text>
              </View>
            ) : null}

            {selectedComics.prices &&
            selectedComics.prices.length > 0 &&
            selectedComics.prices[0].price !== undefined ? (
              <View style={styles.infoItem}>
                <Icon name="attach-money" size={20} color="#e74c3c" />
                <Text style={styles.infoText}>
                  ${selectedComics.prices[0].price}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Yaratıcılar */}
          {selectedComics.creators &&
            selectedComics.creators.items &&
            selectedComics.creators.items.length > 0 && (
              <View style={styles.creatorsSection}>
                <Text style={styles.sectionTitle}>Yaratıcılar</Text>
                {selectedComics.creators.items
                  .slice(0, 5)
                  .map((creator, index) => {
                    // Her creator için güvenli kontrol
                    if (!creator || !creator.name) return null;

                    return (
                      <View key={index} style={styles.creatorItem}>
                        <Text style={styles.creatorName}>{creator.name}</Text>
                        {creator.role ? (
                          <Text style={styles.creatorRole}>
                            ({creator.role})
                          </Text>
                        ) : null}
                      </View>
                    );
                  })}
              </View>
            )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  imageContainer: {
    height: height * 0.5,
    position: 'relative',
  },
  comicImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  comicTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    lineHeight: 30,
  },
  comicDescription: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
    marginBottom: 25,
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  creatorsSection: {
    marginBottom: 30,
  },
  creatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  creatorName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  creatorRole: {
    color: '#8e8e93',
    fontSize: 14,
    marginLeft: 8,
  },
});
export default ComicDetailScreen;
