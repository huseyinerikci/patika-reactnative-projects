import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import { Restaurant } from '../types/restaurant';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import { Icon } from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const CALLOUT_WIDTH = width * 0.85;

interface MapCalloutProps {
  restaurant: Restaurant;
  onClose: () => void;
  onViewDetails: () => void;
}

const MapCallout: React.FC<MapCalloutProps> = ({
  restaurant,
  onClose,
  onViewDetails,
}) => {
  const categories = restaurant.categories
    .map(cat => cat.title)
    .slice(0, 2)
    .join(' • ');
  return (
    <View style={styles.container}>
      {/* kapat butonu */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="close" size={SIZES.iconMd} color={COLORS.text} />
      </TouchableOpacity>

      {/* resim */}
      <Image
        source={{ uri: restaurant.image_url }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* içerik */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <View style={styles.ratingBadge}>
            <Icon name="star" size={SIZES.iconSm} color={COLORS.rating} />
            <Text style={styles.rating}>{restaurant.rating}</Text>
          </View>
        </View>

        {/* kategori */}
        <Text style={styles.categories} numberOfLines={1}>
          {categories}
        </Text>

        {/* konum ve fiyat */}
        <View style={styles.infoRow}>
          <View style={styles.locationContainer}>
            <Icon name="location" size={SIZES.iconSm} color={COLORS.primary} />
            <Text style={styles.location} numberOfLines={1}>
              {restaurant.location.city}
            </Text>
          </View>
          {restaurant.price && (
            <Text style={styles.price}>{restaurant.price}</Text>
          )}
        </View>

        {/* durum ve yorum sayısı */}
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statusBadge,
              restaurant.is_closed ? styles.closedBadge : styles.openBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                restaurant.is_closed ? styles.closedText : styles.openText,
              ]}
            >
              {restaurant.is_closed ? '🔴 Kapalı' : '🟢 Açık'}
            </Text>
          </View>
          <Text style={styles.reviews}>💬 {restaurant.review_count}</Text>
        </View>

        {/* detay butonu */}
        <TouchableOpacity style={styles.detailButton} onPress={onViewDetails}>
          <Text style={styles.detailButtonText}>Detayları Gör</Text>
          <Icon
            name="arrow-forward"
            size={SIZES.iconSm}
            color={COLORS.surface}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: SIZES.xl,
    left: (width - CALLOUT_WIDTH) / 2,
    width: CALLOUT_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  closeButton: {
    position: 'absolute',
    top: SIZES.sm,
    right: SIZES.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...SHADOWS.small,
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: SIZES.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.xs,
  },
  name: {
    flex: 1,
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: SIZES.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusSm,
  },
  rating: {
    fontSize: SIZES.body2,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 4,
  },
  categories: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginBottom: SIZES.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  price: {
    fontSize: SIZES.body2,
    color: COLORS.success,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  statusBadge: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusSm,
  },
  openBadge: {
    backgroundColor: '#E8F5E9',
  },
  closedBadge: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: SIZES.caption,
    fontWeight: '600',
  },
  openText: {
    color: COLORS.success,
  },
  closedText: {
    color: COLORS.error,
  },
  reviews: {
    fontSize: SIZES.caption,
    color: COLORS.textLight,
  },
  detailButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusMd,
  },
  detailButtonText: {
    fontSize: SIZES.body1,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginRight: SIZES.xs,
  },
});
export default MapCallout;
