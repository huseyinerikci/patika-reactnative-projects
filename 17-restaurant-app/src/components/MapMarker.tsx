import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Restaurant } from '../types/restaurant';
import { Marker } from 'react-native-maps';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';

interface MapMarkerProps {
  restaurant: Restaurant;
  onPress: () => void;
  isSelected?: boolean;
}

const MapMarker: React.FC<MapMarkerProps> = ({
  restaurant,
  onPress,
  isSelected = false,
}) => {
  return (
    <Marker
      coordinate={{
        latitude: restaurant.coordinates.latitude,
        longitude: restaurant.coordinates.longitude,
      }}
      onPress={onPress}
    >
      <View
        style={[styles.markerContainer, isSelected && styles.selectedMarker]}
      >
        {/* Rating badge */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐</Text>
          <Text style={styles.ratingValue}>{restaurant.rating}</Text>
        </View>

        {/* Marker pointer */}
        <View style={styles.pointer} />
      </View>
    </Marker>
  );
};
const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusFull,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  selectedMarker: {
    transform: [{ scale: 1.2 }],
  },
  ratingText: {
    fontSize: SIZES.caption,
    marginRight: 2,
  },
  ratingValue: {
    fontSize: SIZES.caption,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  pointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.primary,
    marginTop: -2,
  },
});
export default MapMarker;
