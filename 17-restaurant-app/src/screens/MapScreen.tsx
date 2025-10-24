import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Restaurant } from '../types/restaurant';
import Geolocation from '@react-native-community/geolocation';
import YelpService from '../services/yelp';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import MapMarker from '../components/MapMarker';
import SearchBar from '../components/SearchBar';
import { Icon } from 'react-native-vector-icons/Ionicons';
import MapCallout from '../components/MapCallout';
import { MapScreenNavigationProp } from '../types/navigation';

const MapScreen: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
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
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
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
        console.error('Konum hatası:', error);
        loadRestaurantsInRegion(region.latitude, region.longitude);
      },
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
        // Arama varsa searchRestaurants kullan
        results = await YelpService.searchRestaurants({
          latitude,
          longitude,
          term: searchQuery,
          radius: 5000,
          limit: 50,
        });
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
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
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
    top: SIZES.xl,
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
    top: SIZES.xl + 70,
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
