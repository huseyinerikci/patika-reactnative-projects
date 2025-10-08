import { getApp } from '@react-native-firebase/app';
import {
  getDatabase,
  ref,
  set,
  get,
  child,
} from '@react-native-firebase/database';

// Database bağlantısını oluştur
const app = getApp();
const db = getDatabase(app);

// High score kaydetme
export const saveHighScore = async score => {
  try {
    await set(ref(db, '/highScore'), score);
    console.log('High score kaydedildi:', score);
  } catch (error) {
    console.error('Kaydetme hatası:', error);
  }
};

// High score okuma
export const getHighScore = async () => {
  try {
    const snapshot = await get(child(ref(db), '/highScore'));
    return snapshot.exists() ? snapshot.val() : 0;
  } catch (error) {
    console.error('Okuma hatası:', error);
    return 0;
  }
};
