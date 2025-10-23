import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Restaurant, RestaurantDetailsResponse } from '../types/restaurant';
import YelpService from '../services/yelp';
import { COLORS, SIZES } from '../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

const RestaurantDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { restaurant } = route.params as { restaurant: Restaurant };
  const [details, setDetails] = useState<RestaurantDetailsResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    try {
      const [detailData, reviews] = await Promise.all([
        YelpService.getRestaurantDetails(restaurant.id),
        YelpService.getRestaurantReviews(restaurant.id),
      ]);
      setDetails({ ...detailData, reviews });
    } catch (error) {
      console.error('Detay yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  const images = details?.photos || [restaurant.image_url];
  const hours = details?.hours?.[0];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={SIZES.iconMd} color={COLORS.surface} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Icon
            name="share-outline"
            size={SIZES.iconMd}
            color={COLORS.surface}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SIZES.xl,
    paddingHorizontal: SIZES.md,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RestaurantDetailScreen;
