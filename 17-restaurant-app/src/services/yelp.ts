import axios from 'axios';
import {
  Restaurant,
  RestaurantDetailsResponse,
  SearchParams,
  YelpApiResponse,
} from '../types/restaurant';
import Config from 'react-native-config';

const YELP_API_KEY = Config.YELP_API_KEY;

const api = axios.create({
  baseURL: 'https://api.yelp.com/v3',
  headers: {
    Authorization: `Bearer ${YELP_API_KEY}`,
  },
});

class YelpService {
  // restoran arama
  async searchRestaurants(params: SearchParams): Promise<Restaurant[]> {
    try {
      const response = await api.get<YelpApiResponse>('/businesses/search', {
        params: {
          term: params.term || 'restaurants',
          location: params.location,
          latitude: params.latitude,
          longitude: params.longitude,
          radius: params.radius || 5000, // 5km varsayılan
          categories: params.categories || 'restaurants',
          price: params.price,
          open_now: params.open_now,
          sort_by: params.sort_by || 'best_match',
          limit: params.limit || 20,
        },
      });
      return response.data.businesses;
    } catch (error) {
      console.error('Restoran arama hatası:', error);
      throw new Error('Restoranlar yüklenirken bir hata oluştu');
    }
  }

  // restoran detay
  async getRestaurantDetails(id: string): Promise<RestaurantDetailsResponse> {
    try {
      const response = await api.get<RestaurantDetailsResponse>(
        `/businesses/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error('Restoran detay hatası:', error);
      throw new Error('Restoran detayı yüklenirken bir hata oluştu');
    }
  }

  // restoran yorumları
  async getRestaurantReviews(id: string) {
    try {
      const response = await api.get(`/businesses/${id}/reviews`);
      return response.data.reviews;
    } catch (error) {
      console.error('Yorum yükleme hatası', error);
      throw new Error('Yorumlar yüklenirken bir hata oluştu');
    }
  }

  // yakındaki restoranları getir
  async getNearbyRestaurants(
    latitude: number,
    longitude: number,
    radius: number = 5000,
  ): Promise<Restaurant[]> {
    return this.searchRestaurants({
      latitude,
      longitude,
      radius,
      sort_by: 'distance',
    });
  }
}

export default new YelpService();
