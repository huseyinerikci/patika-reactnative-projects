import LinearGradient from 'react-native-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCharacters } from '../../store/charactersSlice';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');

const CharactersScreen = () => {
  const dispatch = useDispatch();
  const { characters, loading, hasMore, error } = useSelector(
    state => state.characters,
  );
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);

  // Tek yerde parametreleri kur
  const buildParams = (page, text) => {
    const params = {
      limit: 20,
      offset: page * 20,
    };
    if (text && text.length >= 2) {
      params.nameStartsWith = text;
    }
    return params;
  };

  useEffect(() => {
    loadInitialCharacters();
  }, []);

  // İlk karakterleri yükle
  const loadInitialCharacters = () => {
    dispatch(fetchCharacters(buildParams(0, '')));
    setPage(0);
  };

  // Arama fonksiyonu
  const handleSearch = text => {
    setSearchText(text);
    setPage(0);
    dispatch(fetchCharacters(buildParams(0, text)));
  };

  // Daha fazla karakter yükle (pagination)
  const loadMore = () => {
    if (!loading && hasMore) {
      const newPage = page + 1;
      setPage(newPage);
      dispatch(fetchCharacters(buildParams(newPage, searchText)));
    }
  };

  // Karakter render fonksiyonu
  const renderCharacter = ({ item }) => {
    const imageUrl =
      `${item.thumbnail.path}.${item.thumbnail.extension}`.replace(
        'http://',
        'https://',
      );
    return (
      <TouchableOpacity style={styles.characterCard}>
        <FastImage
          source={{ uri: imageUrl }}
          style={styles.characterImage}
          resizeMode={FastImage.resizeMode.cover}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.characterOverlay}
        >
          <Text style={styles.characterName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.characterDescription} numberOfLines={2}>
            {item.description || 'No description available'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // loading footer
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
  };

  if (error) {
    return (
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="error" size={80} color="#e74c3c" />
          <Text style={styles.errorText}>Bir hata oluştu!</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadInitialCharacters}
          >
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marvel Characters</Text>

        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={24}
            color="#8e8e93"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Karakter ara..."
            placeholderTextColor="#8e8e93"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <FlatList
        data={characters}
        renderItem={renderCharacter}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  characterCard: {
    width: (width - 60) / 2,
    height: 250,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
  characterOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  characterDescription: {
    fontSize: 12,
    color: '#ccc',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CharactersScreen;
