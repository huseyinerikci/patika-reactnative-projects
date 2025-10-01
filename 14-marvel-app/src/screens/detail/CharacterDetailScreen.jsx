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
import { fetchCharacterDetails } from '../../store/charactersSlice';
import { toggleFavoriteCharacter } from '../../store/favoritesSlice';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');
const CharacterDetailScreen = ({ route, navigation }) => {
  const { characterId } = route.params;
  const dispatch = useDispatch();
  const { selectedCharacter } = useSelector(state => state.characters);
  const { favoriteCharacters } = useSelector(state => state.favorites);

  const isFavorite = favoriteCharacters.some(char => char.id === characterId);

  useEffect(() => {
    dispatch(fetchCharacterDetails(characterId));
  }, [characterId]);
  const handleToggleFavorite = () => {
    if (selectedCharacter) {
      dispatch(toggleFavoriteCharacter(selectedCharacter));
    }
  };

  if (!selectedCharacter) {
    return (
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Karakter Yükleniyor...</Text>
      </LinearGradient>
    );
  }

  const imageUrl =
    `${selectedCharacter.thumbnail.path}.${selectedCharacter.thumbnail.extension}`.replace(
      'http://',
      'https://',
    );

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <FastImage
            source={{ uri: imageUrl }}
            style={styles.characterImage}
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
        {/* içerik */}
        <View style={styles.contentContainer}>
          <Text style={styles.characterName}>{selectedCharacter.name}</Text>
          <Text style={styles.characterDescription}>
            {selectedCharacter.description ||
              'Bu karakter hakkında açıklama bulunmuyor'}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon name="book" size={24} color="#e74c3c" />
              <Text style={styles.statNumber}>
                {selectedCharacter.comics.available}
              </Text>
              <Text style={styles.statLabel}>Comics</Text>
            </View>

            <View style={styles.statItem}>
              <Icon name="auto-stories" size={24} color="#e74c3c" />
              <Text style={styles.statNumber}>
                {selectedCharacter.series.available}
              </Text>
              <Text style={styles.statLabel}>Comics</Text>
            </View>

            <View style={styles.statItem}>
              <Icon name="article" size={24} color="#e74c3c" />
              <Text style={styles.statNumber}>
                {selectedCharacter.stories.available}
              </Text>
              <Text style={styles.statLabel}>Comics</Text>
            </View>
          </View>

          {/* linkler */}
          {selectedCharacter.urls && selectedCharacter.urls.length > 0 && (
            <View style={styles.linksContainer}>
              <Text style={styles.sectionTitle}>Bağlantılar</Text>
              {selectedCharacter.urls.map((url, index) => (
                <TouchableOpacity key={index} style={styles.linkItem}>
                  <Icon name="link" size={20} color="#e74c3c" />
                  <Text style={styles.linkText}>{url.type}</Text>
                </TouchableOpacity>
              ))}
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
  characterImage: {
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
  characterName: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  characterDescription: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
    marginBottom: 25,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#8e8e93',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  linksContainer: {
    marginBottom: 30,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    textTransform: 'capitalize',
  },
});

export default CharacterDetailScreen;
