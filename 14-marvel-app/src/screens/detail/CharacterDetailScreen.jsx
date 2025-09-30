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
  const imageUrl = `${selectedCharacter.thumbnail.path}.${selectedCharacter.thumbnail.extension}`;

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', fontSize: 16, marginTop: 10 },
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
});

export default CharacterDetailScreen;
