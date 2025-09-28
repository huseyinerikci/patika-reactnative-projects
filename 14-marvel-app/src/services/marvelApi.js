import Config from 'react-native-config';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const BASE_URL = 'https://gateway.marvel.com/v1/public';
const PUBLIC_KEY = Config.MARVEL_API_PUBLIC_KEY;
const PRIVATE_KEY = Config.MARVEL_API_PRIVATE_KEY;

const createAuthParams = () => {
  const ts = Date.now().toString();

  const hashString = ts + PRIVATE_KEY + PUBLIC_KEY;
  const hash = CryptoJS.MD5(hashString).toString();

  return {
    ts: ts,
    apikey: PUBLIC_KEY,
    hash: hash,
  };
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(config => {
  const authParams = createAuthParams();
  config.params = {
    ...config.params,
    ...authParams,
  };
  console.log('Marvel API Request:', config.url, config.params);
  return config;
});

// Response interceptor (hataları yakalamak için)
api.interceptors.response.use(
  response => response,
  error => {
    console.error(
      'Marvel API Error:',
      error.response?.status,
      error.response?.data,
    );
    return Promise.reject(error);
  },
);

export const marvelApi = {
  // Karakterleri getir
  getCharacters: async (params = {}) => {
    try {
      const response = await api.get('/characters', { params });
      return response.data;
    } catch (error) {
      console.error('Characters API Error:', error);
      throw error;
    }
  },
  // Tek karakter getir
  getCharacterById: async id => {
    try {
      const response = await api.get(`/characters/${id}`);
      return response.data;
    } catch (error) {
      console.error('Character Detail API Error:', error);
      throw error;
    }
  },
  // Çizgi romanları getir
  getComics: async (params = {}) => {
    try {
      const response = await api.get('/comics', { params });
      return response.data;
    } catch (error) {
      console.error('Comics API Error:', error);
      throw error;
    }
  },
  // Tek çizgi roman getir
  getComicsById: async id => {
    try {
      const response = await api.get(`/comics/${id}`);
      return response.data;
    } catch (error) {
      console.error('Comics Detail API Error:', error);
      throw error;
    }
  },
};
