import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RestaurantDetailsResponse } from '../types/restaurant';
import YelpService from '../services/yelp';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { RestaurantDetailRouteProp } from '../types/navigation';

const { width, height } = Dimensions.get('window');

const DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

const RestaurantDetailScreen: React.FC = () => {
  const route = useRoute<RestaurantDetailRouteProp>();
  const navigation = useNavigation();
  const { restaurant } = route.params;
  console.log(restaurant);
  const [details, setDetails] = useState<RestaurantDetailsResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images =
    details?.photos && details.photos.length > 0
      ? details.photos
      : [restaurant.image_url].filter(Boolean);
  const hours = details?.hours?.[0];

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    try {
      const detailData = await YelpService.getRestaurantDetails(restaurant.id);
      const reviews = await YelpService.getRestaurantReviews(restaurant.id);

      setDetails({ ...detailData, reviews });
    } catch (error: any) {
      console.error('Detay yükleme hatası:', error);
      // Hata olsa bile mevcut restaurant bilgilerini göster
      setDetails({
        ...restaurant,
        photos: restaurant.image_url ? [restaurant.image_url] : [],
        hours: [],
        reviews: [],
      } as RestaurantDetailsResponse);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (restaurant.phone) {
      Linking.openURL(`tel:${restaurant.phone}`);
    }
  };
  const handleDirection = () => {
    const { latitude, longitude } = restaurant.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };
  const handleWebsite = () => {
    if (restaurant.url) {
      Linking.openURL(restaurant.url);
    }
  };

  const formatTime = (time: string) => {
    const hour = parseInt(time.substring(0, 2));
    const minute = time.substring(2);
    return `${hour}:${minute}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* resim galerisi */}
        <View style={styles.imageGallery}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={event => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width,
              );
              setSelectedImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {images.map((imageUrl, index) =>
              imageUrl ? (
                <Image
                  key={index}
                  source={{ uri: imageUrl }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              ) : (
                <View
                  key={index}
                  style={[styles.galleryImage, styles.placeholder]}
                >
                  <Text style={styles.placeholderText}>Resim yok</Text>
                </View>
              ),
            )}
          </ScrollView>

          {/* Gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageGradient}
          />

          {/* Resim göstergesi */}
          <View style={styles.imageIndicator}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicatorDot,
                  index === selectedImageIndex && styles.indicatorDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* içerik */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <View style={styles.ratingRow}>
              <View style={styles.ratingBadge}>
                <Icon name="star" size={SIZES.iconMd} color={COLORS.rating} />
                <Text style={styles.ratingText}>{restaurant.rating}</Text>
              </View>
              <Text style={styles.reviewCount}>
                ({restaurant.review_count} yorum)
              </Text>
            </View>
          </View>

          {/* kategori */}
          <View style={styles.categorySection}>
            {restaurant.categories.map((cat, index) => (
              <View key={index} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{cat.title}</Text>
              </View>
            ))}
          </View>

          {/* restoran durum */}
          <View
            style={[
              styles.statusCard,
              restaurant.is_closed ? styles.closedCard : styles.openCard,
            ]}
          >
            <Icon
              name={restaurant.is_closed ? 'close-circle' : 'checkmark-circle'}
              size={SIZES.iconMd}
              color={restaurant.is_closed ? COLORS.error : COLORS.success}
            />
            <Text
              style={[
                styles.statusText,
                restaurant.is_closed ? styles.closedText : styles.openText,
              ]}
            >
              {restaurant.is_closed ? 'Şu anda Kapalı' : 'Şu anda Açık'}
            </Text>
          </View>

          {/* aksiyon */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <Icon name="call" size={SIZES.iconMd} color={COLORS.primary} />
              <Text style={styles.actionText}>Ara</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDirection}
            >
              <Icon
                name="navigate"
                size={SIZES.iconMd}
                color={COLORS.primary}
              />
              <Text style={styles.actionText}>Yol Tarifi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleWebsite}
            >
              <Icon name="globe" size={SIZES.iconMd} color={COLORS.primary} />
              <Text style={styles.actionText}>Website</Text>
            </TouchableOpacity>
          </View>

          {/* konum */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon
                name="location"
                size={SIZES.iconMd}
                color={COLORS.primary}
              />
              <Text style={styles.sectionTitle}>Adres</Text>
            </View>
            <Text style={styles.address}>
              {restaurant.location.display_address.join(', ')}
            </Text>
            {restaurant.display_phone && (
              <Text style={styles.phone}>📞 {restaurant.display_phone}</Text>
            )}
          </View>

          {/* çalışma saatleri */}
          {hours && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="time" size={SIZES.iconMd} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Çalışma Saatleri</Text>
              </View>
              {hours.open.map((schedule, index) => (
                <View key={index} style={styles.scheduleRow}>
                  <Text style={styles.dayText}>{DAYS[schedule.day]}</Text>
                  <Text style={styles.timeText}>
                    {formatTime(schedule.start)} - {formatTime(schedule.end)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* yorumlar */}
          {details?.reviews && details.reviews.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon
                  name="chatbubbles"
                  size={SIZES.iconMd}
                  color={COLORS.primary}
                />
                <Text style={styles.sectionTitle}>Yorumlar</Text>
              </View>
              {details.reviews.map(review => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Image
                      source={{ uri: review.user.image_url }}
                      style={styles.reviewAvatar}
                    />
                    <View style={styles.reviewUserInfo}>
                      <Text style={styles.reviewUserName}>
                        {review.user.name}
                      </Text>
                      <View style={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            name={i < review.rating ? 'star' : 'star-outline'}
                            size={SIZES.iconSm}
                            color={COLORS.rating}
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{review.text}</Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.time_created).toLocaleDateString('tr-TR')}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon
                  name="chatbubbles"
                  size={SIZES.iconMd}
                  color={COLORS.primary}
                />
                <Text style={styles.sectionTitle}>Yorumlar</Text>
              </View>
              <View style={styles.noReviewsCard}>
                <Icon
                  name="chatbubbles-outline"
                  size={SIZES.iconXl}
                  color={COLORS.textLight}
                />
                <Text style={styles.noReviewsText}>Henüz yorum yüklenmedi</Text>
                <Text style={styles.noReviewsSubtext}>
                  Daha fazla bilgi için Yelp'te görüntüleyin
                </Text>
                <TouchableOpacity
                  style={styles.yelpButton}
                  onPress={handleWebsite}
                >
                  <Text style={styles.yelpButtonText}>Yelp'te Gör</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* rezervasyon bilgisi */}
          {restaurant.transactions.includes('restaurant_reservation') && (
            <View style={styles.reservationCard}>
              <Icon
                name="calendar"
                size={SIZES.iconLg}
                color={COLORS.primary}
              />
              <View style={styles.reservationContent}>
                <Text style={styles.reservationTitle}>
                  Rezervasyon Yapılabilir
                </Text>
                <Text style={styles.reservationText}>
                  Bu restoranda online rezervasyon yapabilirsiniz
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
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
  imageGallery: {
    height: height * 0.4,
    position: 'relative',
  },
  galleryImage: {
    width: width,
    height: height * 0.4,
  },
  placeholder: {
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.body2,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: SIZES.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surface,
    opacity: 0.5,
    marginHorizontal: 4,
  },
  indicatorDotActive: {
    opacity: 1,
    width: 24,
  },
  content: {
    padding: SIZES.md,
  },
  titleSection: {
    marginBottom: SIZES.md,
  },
  name: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusSm,
    marginRight: SIZES.sm,
  },
  ratingText: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
  },
  categorySection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.md,
  },
  categoryBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusFull,
    marginRight: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  categoryText: {
    fontSize: SIZES.body2,
    color: COLORS.surface,
    fontWeight: '600',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: SIZES.radiusMd,
    marginBottom: SIZES.md,
  },
  openCard: {
    backgroundColor: '#E8F5E9',
  },
  closedCard: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    marginLeft: SIZES.sm,
  },
  openText: {
    color: COLORS.success,
  },
  closedText: {
    color: COLORS.error,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SIZES.lg,
  },
  actionButton: {
    alignItems: 'center',
    padding: SIZES.sm,
  },
  actionText: {
    fontSize: SIZES.body2,
    color: COLORS.text,
    marginTop: SIZES.xs,
    fontWeight: '600',
  },
  section: {
    marginBottom: SIZES.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: SIZES.sm,
  },
  address: {
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SIZES.sm,
  },
  phone: {
    fontSize: SIZES.body1,
    color: COLORS.primary,
    fontWeight: '600',
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dayText: {
    fontSize: SIZES.body1,
    color: COLORS.text,
    fontWeight: '600',
  },
  timeText: {
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
  },
  reviewCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.md,
    borderRadius: SIZES.radiusMd,
    marginBottom: SIZES.md,
    ...SHADOWS.small,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: SIZES.sm,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.sm,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: SIZES.body1,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SIZES.sm,
  },
  reviewDate: {
    fontSize: SIZES.caption,
    color: COLORS.textLight,
  },
  noReviewsCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.xl,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  noReviewsText: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: SIZES.md,
    marginBottom: SIZES.xs,
  },
  noReviewsSubtext: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SIZES.md,
  },
  yelpButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusMd,
  },
  yelpButtonText: {
    fontSize: SIZES.body1,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  reservationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: SIZES.md,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  reservationContent: {
    flex: 1,
    marginLeft: SIZES.md,
  },
  reservationTitle: {
    fontSize: SIZES.body1,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 4,
  },
  reservationText: {
    fontSize: SIZES.body2,
    color: COLORS.surface,
    opacity: 0.9,
  },
});

export default RestaurantDetailScreen;
