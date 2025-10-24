import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';
import { Restaurant } from '../types/restaurant';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - SIZES.md * 2;

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onPress,
}) => {
  // kategori
  const categories = restaurant.categories
    .map(cat => cat.title)
    .slice(0, 2)
    .join(' • ');
  // mesafe
  const formatDistance = (distance?: number) => {
    if (!distance) return null;
    const km = (distance / 1000).toFixed(1);
    return `${km} km`;
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: restaurant.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
      </View>
      {/* restoran durumu */}
      {restaurant.is_closed && (
        <View style={styles.closedBadge}>
          <Text style={styles.closedText}>Kapalı</Text>
        </View>
      )}
      {/* rating */}
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>⭐ {restaurant.rating}</Text>
      </View>
      {/* içerik */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {restaurant.name}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.categories} numberOfLines={1}>
            {categories}
          </Text>

          {restaurant.price && (
            <Text style={styles.price}>{restaurant.price}</Text>
          )}
        </View>

        <View style={styles.locationRow}>
          <Text style={styles.location} numberOfLines={1}>
            📍 {restaurant.location.city}
          </Text>
          {formatDistance(restaurant.distance) && (
            <Text style={styles.distance}>
              {formatDistance(restaurant.distance)}
            </Text>
          )}
        </View>

        <Text style={styles.reviewCount}>
          💬 {restaurant.review_count} yorum
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.sm,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  closedBadge: {
    position: 'absolute',
    top: SIZES.sm,
    left: SIZES.sm,
    backgroundColor: COLORS.error,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusSm,
  },
  closedText: {
    color: COLORS.surface,
    fontSize: SIZES.caption,
    fontWeight: 'bold',
  },
  ratingBadge: {
    position: 'absolute',
    top: SIZES.sm,
    right: SIZES.sm,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusFull,
    ...SHADOWS.small,
  },
  ratingText: {
    color: COLORS.text,
    fontSize: SIZES.caption,
    fontWeight: 'bold',
  },
  content: {
    padding: SIZES.md,
  },
  name: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  categories: {
    flex: 1,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginRight: SIZES.sm,
  },
  price: {
    fontSize: SIZES.body2,
    color: COLORS.success,
    fontWeight: 'bold',
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  location: {
    flex: 1,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginRight: SIZES.sm,
  },
  distance: {
    fontSize: SIZES.body2,
    color: COLORS.primary,
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: SIZES.caption,
    color: COLORS.textLight,
  },
});

export default RestaurantCard;
