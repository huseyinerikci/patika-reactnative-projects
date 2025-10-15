import axios from 'axios';
import Config from 'react-native-config';

const API_KEY = Config.WEATHER_API_KEY;
const BASE_URL = Config.WEATHER_API_URL;
//  Koordinatlara göre hava durumu çek

export const getWeatherByCoordinates = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: API_KEY,
        units: 'metric',
        lang: 'tr',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Hava durumu çekme hatası:', error);
    return { success: false, error: error.message };
  }
};

// Rastgele şehir hava durumunu çek
export const getRandomCityWeather = async () => {
  const cities = [
    { name: 'İstanbul', lat: 41.0082, lon: 28.9784 },
    { name: 'Ankara', lat: 39.9334, lon: 32.8597 },
    { name: 'İzmir', lat: 38.4237, lon: 27.1428 },
    { name: 'Antalya', lat: 36.8969, lon: 30.7133 },
    { name: 'Bursa', lat: 40.1826, lon: 29.0665 },
    { name: 'Adana', lat: 37.0, lon: 35.3213 },
    { name: 'Gaziantep', lat: 37.0662, lon: 37.3833 },
    { name: 'Konya', lat: 37.8667, lon: 32.4833 },
    { name: 'Trabzon', lat: 41.0015, lon: 39.7178 },
    { name: 'Bodrum', lat: 37.0344, lon: 27.4305 },
    { name: 'Niğde', lat: 37.9694, lon: 34.6794 },
  ];

  const randomIndex = Math.floor(Math.random() * cities.length);
  const randomCity = cities[randomIndex];

  return getWeatherByCoordinates(randomCity.lat, randomCity.lon);
};

// Koordinatları il-ilçe bilgisine çevir (Reverse Geocoding)
export const getReverseGeocoding = async (latitude, longitude) => {
  console.log('Geocoding parametreleri:', latitude, longitude);

  try {
    const response = await axios.get(
      'https://api.bigdatacloud.net/data/reverse-geocode-client',
      {
        params: {
          latitude,
          longitude,
          localityLanguage: 'tr',
        },
      },
    );
    return {
      success: true,
      data: {
        city: response.data.city || response.data.locality || 'Bilinmiyor',
        district: response.data.principalSubdivision || '',
        country: response.data.countryName || '',
      },
    };
  } catch (error) {
    console.error('Goecoding hatası:', error);
    return {
      success: false,
      error: error.message,
      data: { city: 'Konum Belirlenemedi', district: '', country: '' },
    };
  }
};
