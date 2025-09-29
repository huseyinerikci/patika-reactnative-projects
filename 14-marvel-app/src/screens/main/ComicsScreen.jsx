import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComics } from '../../store/comicsSlice';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');

const ComicsScreen = () => {
  const dispatch = useDispatch();
  const { comics, loading, hasMore } = useSelector(state => state.comics);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);

  const buildParams = (page, text) => {
    const params = {
      limit: 20,
      offset: page * 20,
    };
    if (text && text.length >= 2) {
      params.titleStartsWith = text;
    }
    return params;
  };

  useEffect(() => {
    dispatch(fetchComics(buildParams(0, '')));
  }, []);

  const handleSearch = text => {
    setSearchText(text);
    setPage(0);

    dispatch(fetchComics(buildParams(0, text)));
  };
  const loadMore = () => {
    if (!loading && hasMore) {
      const newPage = page + 1;
      setPage(newPage);
      dispatch(fetchComics(buildParams(newPage, searchText)));
    }
  };
  const renderComic = ({ item }) => {
    const imageUrl =
      `${item.thumbnail.path}.${item.thumbnail.extension}`.replace(
        'http://',
        'https://',
      );
    return (
      <TouchableOpacity style={styles.comicCard}>
        <FastImage
          source={{ uri: imageUrl }}
          style={styles.comicImage}
          resizeMode={FastImage.resizeMode.cover}
        />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.comicOverlay}
        >
          <Text style={styles.comicTitle} numberOfLines={2}>
            {item.title}
          </Text>
          {item.dates && item.dates.length > 0 && (
            <Text style={styles.comicDate}>
              {new Date(item.dates[0].date).getFullYear()}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marvel Comics</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={24}
          color="#8e8e93"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Çizgi roman ara..."
          placeholderTextColor="#8e8e93"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={comics}
        renderItem={renderComic}
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
  container: { flex: 1 },
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
    marginBottom: 20,
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
  comicCard: {
    width: (width - 60) / 2,
    height: 280,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  comicImage: {
    width: '100%',
    height: '100%',
  },
  comicOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  comicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  comicDate: {
    fontSize: 12,
    color: '#ccc',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default ComicsScreen;
