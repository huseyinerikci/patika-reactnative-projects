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
      if (!YELP_API_KEY) {
        // Eğer API anahtarı yoksa 400/401 sonuçları yerine boş liste döndürüyoruz
        console.warn(
          'YELP_API_KEY is not set. Returning empty results to avoid failed network calls.',
        );
        return [];
      }
      // build request params only with defined values to avoid sending `undefined`
      const reqParams: any = {
        term: params.term || 'restaurants',
        categories: params.categories || 'restaurants',
        limit: params.limit || 20,
      };

      if (params.latitude != null && params.longitude != null) {
        reqParams.latitude = params.latitude;
        reqParams.longitude = params.longitude;
      } else if (params.location) {
        reqParams.location = params.location;
      }

      if (params.radius) reqParams.radius = params.radius;
      if (params.price) reqParams.price = params.price;
      if (params.open_now != null) reqParams.open_now = params.open_now;
      if (params.sort_by) reqParams.sort_by = params.sort_by;

      // Log gönderilen parametreler (debug için)
      // eslint-disable-next-line no-console
      console.debug('Yelp search params:', reqParams);

      const response = await api.get<YelpApiResponse>('/businesses/search', {
        params: reqParams,
      });
      return response.data.businesses;
    } catch (error: unknown) {
      const err: any = error;
      console.error(
        'Restoran arama hatası:',
        err.response?.data || err.message || err,
      );
      // Eğer API bir hata döndürürse uygulamanın çökmesini önlemek için boş liste döndür
      return [];
    }
  }

  // restoran detay
  async getRestaurantDetails(id: string): Promise<RestaurantDetailsResponse> {
    try {
      const response = await api.get<RestaurantDetailsResponse>(
        `/businesses/${id}`,
      );
      return response.data;
    } catch (error: any) {
      console.error('Restoran detay hatası:', error);
      throw new Error(
        error.response?.data?.error?.description ||
          'Restoran detayı yüklenirken bir hata oluştu',
      );
    }
  }

  // restoran yorumları
  async getRestaurantReviews(id: string) {
    try {
      const response = await api.get(`/businesses/${id}/reviews`);
      return response.data.reviews;
    } catch (error: any) {
      if (error.response?.status === 404 || error.response?.status === 403) {
        console.warn(
          "Yorum endpoint'ine erişim yok - ücretsiz.  plan kısıtlaması",
        );
        return [];
      }
      console.error('Yorum yükleme hatası', error);
      return [];
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
