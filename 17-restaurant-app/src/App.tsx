import 'react-native-gesture-handler';
import { StatusBar, Platform, PermissionsAndroid } from 'react-native';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { COLORS } from './constants/theme';
import Geolocation from '@react-native-community/geolocation';

const App: React.FC = () => {
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Konum İzni',
            message: 'Yakınındaki restoranları görmek için konum izni gerekli',
            buttonNeutral: 'Daha Sonra',
            buttonNegative: 'İptal',
            buttonPositive: 'Tamam',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Konum izni verildi');
        } else {
          console.log('Konum izni reddedildi');
        }
      } catch (error) {
        console.warn(error);
      }
    } else if (Platform.OS === 'ios') {
      // iOS için callback ile çağır
      Geolocation.requestAuthorization(() => {
        console.log('iOS: Konum izni istendi');
      });
    }
  };

  return (
    <NavigationContainer>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor={COLORS.primary}
      />
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
