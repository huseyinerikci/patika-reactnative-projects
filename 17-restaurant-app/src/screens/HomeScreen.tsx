import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Restaurant } from '../types/restaurant';
import Geolocation from '@react-native-community/geolocation';
import YelpService from '../services/yelp';
import { COLORS, SIZES } from '../constants/theme';
import LinearGradient from 'react-native-linear-gradient';
import SearchBar from '../components/SearchBar';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [restaurants, setRetaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    // loadRestaurants(41.0082, 28.9784);
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
      const results = await YelpService.searchRestaurants({
        latitude: latitude || userLocation?.latitude,
        longitude: longitude || userLocation?.longitude,
        term: searchQuery,
        limit: 30,
      });
      setRetaurants(results);
    } catch (error) {
      setError('restoranlar yüklenirken bir hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      loadRestaurants(userLocation?.latitude, userLocation?.longitude, query);
    } else {
      loadRestaurants(userLocation?.latitude, userLocation?.longitude);
    }
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
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>🍽️ Worldwide Restaurants</Text>
        <Text style={styles.headerSubtitle}>
          {restaurants.length} restoran bulundu
        </Text>
      </LinearGradient>
      <SearchBar onSearch={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: SIZES.xl + 20,
    paddingBottom: SIZES.md,
    paddingHorizontal: SIZES.md,
    minHeight: 180, //silinecek
  },
  headerTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: SIZES.xs,
  },
  headerSubtitle: {
    fontSize: SIZES.body2,
    color: COLORS.surface,
    opacity: 0.9,
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
});

export default HomeScreen;
