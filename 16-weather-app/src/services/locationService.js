import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      //android izin isteme lokasyon
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Konum İzni',
          message: 'Hava durumu uygulamsı konumunuza erişmek istiyor',
          buttonNeutral: 'Daha Sonra Sor',
          buttonNegative: 'İptal',
          buttonPositive: 'Tamam',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.warn('Konum izni hatasıı:', error);
      return false;
    }
  }
  return true;
};

export const getCurrentLocation = () => {
  return new Promise(async (resolve, reject) => {
    const hasPermission = await requestLocationPermission();
    //izin kontrolü
    if (!hasPermission) {
      reject(new Error('Konum izni verilmedi'));
      return;
    }
    //konum al
    Geolocation.getCurrentPosition(
      position => {
        //konum bilgisi döndür
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.error('Konum alma hatası:', error);
        reject(error);
      },
      //   opsiyonlar
      {
        enableHighAccuracy: true, //yüksek hassasiyet
        timeout: 15000, //zaman aşımı
        maximumAge: 10000, //önbelleğe alınan konum max eski süresi
      },
    );
  });
};
