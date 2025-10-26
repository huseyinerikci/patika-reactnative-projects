import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Platform } from 'react-native';
import { Restaurant } from '../types/restaurant';
import Geolocation from '@react-native-community/geolocation';
import YelpService from '../services/yelp';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import MapMarker from '../components/MapMarker';
import SearchBar from '../components/SearchBar';
import Icon from 'react-native-vector-icons/Ionicons';
import MapCallout from '../components/MapCallout';
import { MapScreenNavigationProp } from '../types/navigation';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ErrorBoundary from '../components/ErrorBoundary';

const MapScreen: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const route = useRoute<
    RouteProp<
      {
        MapMain:
          | { restaurants?: Restaurant[]; searchQuery?: string }
          | undefined;
      },
      'MapMain'
    >
  >();
  const mapRef = useRef<MapView>(null);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    loadStoredSearchResults();
  }, []);

  const loadStoredSearchResults = async () => {
    try {
      // AsyncStorage'dan son arama sonuçlarını oku
      const storedResults = await AsyncStorage.getItem('lastSearchResults');
      const storedQuery = await AsyncStorage.getItem('lastSearchQuery');

      if (storedResults) {
        const restaurants = JSON.parse(storedResults);
        if (restaurants.length > 0) {
          setRestaurants(restaurants);
          setLoading(false);

          // İlk restoranın konumuna odaklan
          const firstRestaurant = restaurants[0];
          if (firstRestaurant.coordinates) {
            // Stored query'ye göre zoom seviyesini ayarla
            const isStoredCitySearch =
              storedQuery &&
              /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(storedQuery.trim()) &&
              !storedQuery.toLowerCase().includes('restaurant') &&
              !storedQuery.toLowerCase().includes('cafe') &&
              !storedQuery.toLowerCase().includes('bar');

            const delta = isStoredCitySearch ? 0.1 : 0.05; // Şehir araması için daha geniş

            setRegion({
              latitude: firstRestaurant.coordinates.latitude,
              longitude: firstRestaurant.coordinates.longitude,
              latitudeDelta: delta,
              longitudeDelta: delta,
            });
          }
          return; // Stored results bulundu, normal location loading yapma
        }
      }

      // Stored results yoksa normal konum alma işlemini yap
      getCurrentLocation();
    } catch (error) {
      console.error('AsyncStorage okuma hatası:', error);
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    // Eğer getCurrentPosition uzun sürerse (izin bekleniyor vb.) fallback yapması için
    // bir JS timeout ekliyoruz. Ayrıca native timeout parametresi veriyoruz.
    let didRespond = false;
    const fallbackTimeout = setTimeout(() => {
      if (!didRespond) {
        console.warn('Konum zaman aşımı. Varsayılan bölge kullanılacak.');
        loadRestaurantsInRegion(region.latitude, region.longitude);
      }
    }, 8000); // 8s

    Geolocation.getCurrentPosition(
      position => {
        didRespond = true;
        clearTimeout(fallbackTimeout);
        const { latitude, longitude } = position.coords;
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setRegion(newRegion);
        loadRestaurantsInRegion(latitude, longitude);
      },
      error => {
        didRespond = true;
        clearTimeout(fallbackTimeout);
        console.error('Konum hatası:', error);
        loadRestaurantsInRegion(region.latitude, region.longitude);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };
  const loadRestaurantsInRegion = async (
    latitude: number,
    longitude: number,
    searchQuery?: string,
  ) => {
    try {
      setLoading(true);
      let results: Restaurant[];

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
            limit: 50,
          });

          // Şehir araması yapıldığında haritayı ilk restoranın konumuna odakla
          if (results.length > 0 && results[0].coordinates) {
            const firstRestaurant = results[0];
            const newRegion = {
              latitude: firstRestaurant.coordinates.latitude,
              longitude: firstRestaurant.coordinates.longitude,
              latitudeDelta: 0.1, // Şehir görünümü için daha geniş
              longitudeDelta: 0.1,
            };
            setRegion(newRegion);

            // Haritayı yeni konuma animasyonla taşı
            setTimeout(() => {
              mapRef.current?.animateToRegion(newRegion, 1000);
            }, 100);
          }
        } else {
          // Restoran adı ise mevcut konum ile arama yap
          results = await YelpService.searchRestaurants({
            latitude,
            longitude,
            term: searchQuery,
            radius: 5000,
            limit: 50,
          });
        }
      } else {
        // Arama yoksa getNearbyRestaurants kullan (mesafeye göre sıralı)
        results = await YelpService.getNearbyRestaurants(
          latitude,
          longitude,
          5000,
        );
      }

      setRestaurants(results);
    } catch (error) {
      console.error('Restoran yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const handleMarkerPress = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);

    // Haritayı marker'a odakla
    mapRef.current?.animateToRegion({
      latitude: restaurant.coordinates.latitude,
      longitude: restaurant.coordinates.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
  };

  const handleSearch = (query: string) => {
    loadRestaurantsInRegion(region.latitude, region.longitude, query);
  };

  const handleMyLocation = () => {
    getCurrentLocation();
  };

  const handleCalloutClose = () => {
    setSelectedRestaurant(null);
  };

  const handleViewDetails = () => {
    if (selectedRestaurant) {
      navigation.navigate('RestaurantDetail', {
        restaurant: selectedRestaurant,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Harita yükleniyor...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* harita */}
      <ErrorBoundary>
        <MapView
          ref={mapRef}
          // Sadece Android'de PROVIDER_GOOGLE; iOS için default kullanmak
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={handleRegionChangeComplete}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {restaurants.map(restaurant => (
            <MapMarker
              key={restaurant.id}
              restaurant={restaurant}
              onPress={() => handleMarkerPress(restaurant)}
              isSelected={selectedRestaurant?.id === restaurant.id}
            />
          ))}
        </MapView>
      </ErrorBoundary>
      {/* Arama çubuğu */}
      <View style={styles.searchContainer}>
        <SearchBar onSearch={handleSearch} />
      </View>

      {/* Konumum butonu */}
      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={handleMyLocation}
      >
        <Icon name="locate" size={SIZES.iconMd} color={COLORS.primary} />
      </TouchableOpacity>

      {/* Restoran sayısı badge */}
      <View style={styles.countBadge}>
        <Icon
          name="restaurant"
          size={SIZES.iconSm}
          color={COLORS.surface}
          style={{ marginRight: 4 }}
        />
        <Text style={styles.countText}>{restaurants.length}</Text>
      </View>

      {/* Seçili restoran callout */}
      {selectedRestaurant && (
        <MapCallout
          restaurant={selectedRestaurant}
          onClose={handleCalloutClose}
          onViewDetails={handleViewDetails}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: SIZES.xxl,
    left: 0,
    right: 0,
  },
  myLocationButton: {
    position: 'absolute',
    bottom: SIZES.xl + 100,
    right: SIZES.md,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  countBadge: {
    position: 'absolute',
    top: SIZES.xl + 90,
    right: SIZES.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusFull,
    ...SHADOWS.small,
  },
  countText: {
    color: COLORS.surface,
    fontSize: SIZES.body2,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SIZES.md,
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
  },
});

export default MapScreen;
