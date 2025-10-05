import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');

const FavoritesScreen = ({ navigation }) => {
  const { favoriteCharacters, favoriteComics } = useSelector(
    state => state.favorites,
  );
  const [activeTab, setActiveTab] = useState('characters');

  const renderCharacter = ({ item }) => {
    const imageUrl =
      `${item.thumbnail.path}.${item.thumbnail.extension}`.replace(
        'http://',
        'https://',
      );
    return (
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() =>
          navigation.navigate('CharacterDetail', {
            characterId: item.id,
          })
        }
      >
        <FastImage
          source={{ uri: imageUrl }}
          style={styles.itemImage}
          resizeMode={FastImage.resizeMode.cover}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.itemOverlay}
        >
          <Text style={styles.itemName} numberOfLines={2} ellipsizeMode="tail">
            {item.name}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderComic = ({ item }) => {
    const imageUrl =
      `${item.thumbnail.path}.${item.thumbnail.extension}`.replace(
        'http://',
        'https://',
      );
    return (
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() => navigation.navigate('ComicDetail', { comicId: item.id })}
      >
        <FastImage
          source={{ uri: imageUrl }}
          style={styles.itemImage}
          resizeMode={FastImage.resizeMode.cover}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.itemOverlay}
        >
          <Text style={styles.itemName} numberOfLines={2} ellipsizeMode="tail">
            {item.title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="favorite-border" size={80} color="#8e8e93" />
      <Text style={styles.emptyTitle}>Henüz favori eklememişsin</Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'characters'
          ? 'Karakterleri keşfet ve favorilerine ekle'
          : 'Çizgi romanları keşfet ve favorilerine ekle'}
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorilerim</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'characters' && styles.activeTab]}
            onPress={() => setActiveTab('characters')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'characters' && styles.activeTabText,
              ]}
            >
              Karakterler ({favoriteCharacters.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'comics' && styles.activeTab]}
            onPress={() => setActiveTab('comics')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'comics' && styles.activeTabText,
              ]}
            >
              Çizgi Romanlar ({favoriteComics.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={activeTab === 'characters' ? favoriteCharacters : favoriteComics}
        renderItem={activeTab === 'characters' ? renderCharacter : renderComic}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={[
          styles.list,
          (activeTab === 'characters' ? favoriteCharacters : favoriteComics)
            .length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyComponent}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#e74c3c',
  },
  tabText: {
    color: '#8e8e93',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  itemCard: {
    width: (width - 60) / 2,
    height: 250,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    height: 100,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    lineHeight: 24,
  },
});
export default FavoritesScreen;
