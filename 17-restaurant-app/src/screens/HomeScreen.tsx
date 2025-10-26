import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Restaurant } from '../types/restaurant';
import Geolocation from '@react-native-community/geolocation';
import YelpService from '../services/yelp';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import LinearGradient from 'react-native-linear-gradient';
import SearchBar from '../components/SearchBar';
import RestaurantCard from '../components/RestaurantCard';
import { HomeScreenNavigationProp } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    //kullanıcı konum al
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        loadRestaurants(latitude, longitude);
      },
      error => {
        console.error('Konum hatası:', error);
        loadRestaurants(41.0082, 28.9784); // varsayılan konum (İstanbul)
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };

  // restoranları yükle
  const loadRestaurants = async (
    latitude?: number,
    longitude?: number,
    searchQuery?: string,
  ) => {
    try {
      setLoading(true);
      setError(null);
      let results: Restaurant[];
      // Belirli bir latitude/longitude yoksa kullanıcı konumu veya varsayılan (İstanbul) kullan
      const defaultLat = 41.0082;
      const defaultLon = 28.9784;
      const useLat = latitude ?? userLocation?.latitude ?? defaultLat;
      const useLon = longitude ?? userLocation?.longitude ?? defaultLon;

      if (searchQuery && searchQuery.trim()) {
        // Şehir adı mı yoksa restoran adı mı kontrol et
        const isCitySearch =
          /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(searchQuery.trim()) &&
          !searchQuery.toLowerCase().includes('restaurant') &&
          !searchQuery.toLowerCase().includes('cafe') &&
          !searchQuery.toLowerCase().includes('bar');

        if (isCitySearch) {
          // Şehir adı ise location parametresi kullan
          results = await YelpService.searchRestaurants({
            location: searchQuery.trim(),
            term: 'restaurants',
            limit: 30,
          });
        } else {
          // Restoran adı ise mevcut konum ile arama yap
          results = await YelpService.searchRestaurants({
            latitude: useLat,
            longitude: useLon,
            term: searchQuery,
            limit: 30,
          });
        }
      } else {
        // Konum bilgisi ile yakındaki restoranları getir
        results = await YelpService.getNearbyRestaurants(useLat, useLon, 10000);
      }

      setRestaurants(results);

      // Arama sonuçlarını AsyncStorage'a kaydet
      try {
        await AsyncStorage.setItem(
          'lastSearchResults',
          JSON.stringify(results),
        );
        if (searchQuery) {
          await AsyncStorage.setItem('lastSearchQuery', searchQuery);
        } else {
          await AsyncStorage.removeItem('lastSearchQuery');
        }
      } catch (storageError) {
        console.error('AsyncStorage kaydetme hatası:', storageError);
      }
    } catch (error) {
      setError('Restoranlar yüklenirken bir hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // arama fonksiyonu
  const handleSearch = (query: string) => {
    if (query.trim()) {
      loadRestaurants(userLocation?.latitude, userLocation?.longitude, query);
    } else {
      loadRestaurants(userLocation?.latitude, userLocation?.longitude);
    }
  };

  // restoran detay
  const handleRestaurantPress = (restaurant: Restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurant });
  };

  // yenileme
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRestaurants(userLocation?.latitude, userLocation?.longitude);
    setRefreshing(false);
  };

  //loading
  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Restoranlar yükleniyor...</Text>
      </View>
    );
  }
  // Hata durumu
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}> {error}</Text>
        <Text style={styles.errorSubtext}>Lütfen tekrar deneyin</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconContainer}>
                <Text style={styles.headerIcon}>🍽️</Text>
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Worldwide Restaurants</Text>
                <Text style={styles.headerSubtitle}>
                  Yakınındaki en iyi restoranları keşfet
                </Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <View style={styles.restaurantCount}>
                <Text style={styles.countNumber}>{restaurants.length}</Text>
                <Text style={styles.countLabel}>restoran</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* //arama çubuğu */}
      <SearchBar onSearch={handleSearch} />

      {/* restoran listesi */}
      <FlatList
        data={restaurants}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            onPress={() => handleRestaurantPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>🔍 Restoran bulunamadı</Text>
            <Text style={styles.emptySubtext}>
              Farklı bir arama terimi deneyin
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: SIZES.xl + 30,
    paddingBottom: SIZES.xs,
    minHeight: 180,
    position: 'relative',
    overflow: 'hidden',
  },
  headerGradient: {
    paddingHorizontal: SIZES.md,
    paddingBottom: SIZES.md,
    minHeight: 180,
    justifyContent: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
    ...SHADOWS.medium,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: SIZES.h3,
    fontWeight: '800',
    color: COLORS.surface,
    marginBottom: SIZES.xs,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: SIZES.body2,
    color: COLORS.surface,
    opacity: 0.85,
    fontWeight: '400',
  },
  headerRight: {
    alignItems: 'flex-end',
    marginRight: SIZES.lg,
  },
  restaurantCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SIZES.radiusLg,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    alignItems: 'center',
    minWidth: 80,
    ...SHADOWS.small,
  },
  countNumber: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.surface,
    lineHeight: SIZES.h4,
  },
  countLabel: {
    fontSize: SIZES.caption,
    color: COLORS.surface,
    opacity: 0.8,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SIZES.md,
  },
  loadingText: {
    marginTop: SIZES.md,
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: SIZES.h4,
    color: COLORS.error,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.sm,
  },
  errorSubtext: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: SIZES.xl,
  },
  emptyContainer: {
    paddingVertical: SIZES.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: SIZES.h4,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: SIZES.xs,
  },
  emptySubtext: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
  },
});

export default HomeScreen;
