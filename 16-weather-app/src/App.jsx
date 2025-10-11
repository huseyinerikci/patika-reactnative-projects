import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  StatusBar,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from './constants/colors';
import { getWeatherCondition } from './constants/weatherConditions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import WeatherIcon from './components/WeatherIcon';
import { getCurrentLocation } from './services/locationService';
import {
  getRandomCityWeather,
  getReverseGeocoding,
  getWeatherByCoordinates,
} from './services/weatherService';

const { height } = Dimensions.get('window');

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationInfo, setLocationInfo] = useState(null);

  useEffect(() => {
    // İlk yüklemede kullanıcının konumundaki hava durumunu çek
    fetchCurrentLocationWeather();
  }, []);

  const fetchCurrentLocationWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      //kullanıcı konumu alınıyor
      const location = await getCurrentLocation();

      //hava durumunu çek
      const weatherResult = await getWeatherByCoordinates(
        location.latitude,
        location.longitude,
      );
      if (!weatherResult.success) {
        throw new Error(weatherResult.error);
      }
      //il-ilçe bilgisi çek
      const geoResult = await getReverseGeocoding(
        location.latitude,
        location.longitude,
      );
      //state güncelle
      setWeatherData(weatherResult.data);
      setLocationInfo(geoResult.data);
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradientColors = () => {
    if (!weatherData) {
      return [colors.weather.default.start, colors.weather.default.end];
    }
    //kodu al
    const iconCode = weatherData.weather[0].icon;
    //code göre bilgileri al
    const condition = getWeatherCondition(iconCode);
    //renkler
    const gradient = colors.weather[condition.gradient];

    return [gradient.start, gradient.end];
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);
      // rastgele hava durumu çek
      const weatherResult = await getRandomCityWeather();
      if (!weatherResult.success) {
        throw new Error(weatherResult.error);
      }
      //şehir konum bilgisi
      const geoResult = await getReverseGeocoding(
        weatherResult.data.coord.lat,
        weatherResult.data.coord.lon,
      );

      setWeatherData(weatherResult.data);
      setLocationInfo(geoResult.data);
    } catch (error) {
      setError(error.message);
      console.error('Yenileme hatası:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[colors.weather.default.start, colors.weather.default.end]}
        style={styles.container}
      >
        <View style={styles.wrapper}>
          <StatusBar barStyle="light-content" />

          <ActivityIndicator size="large" color={colors.text.primary} />
          <Text style={styles.loadingText}>Hava durumu yükleniyor...</Text>
        </View>
      </LinearGradient>
    );
  }
  if (error && !weatherData) {
    return (
      <LinearGradient
        colors={[colors.weather.default.start, colors.weather.default.end]}
        style={styles.container}
      >
        <View style={styles.wrapper}>
          <StatusBar barStyle="light-content" />

          <Text style={styles.errorText}>❌ {error}</Text>
          <Text style={styles.errorSubtext}>
            Lütfen konum izinlerini kontol edin
          </Text>
        </View>
      </LinearGradient>
    );
  }
  return (
    <LinearGradient colors={getGradientColors()} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.text.primary}
              title="Yeni konum yükleniyor..."
              titleColor={colors.text.primary}
            />
          }
        >
          {/* Konum */}
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>
              {locationInfo?.city || 'Konum Belirlenemedi'}
            </Text>
            {locationInfo?.district && (
              <Text style={styles.districtText}>{locationInfo.district}</Text>
            )}
          </View>
          {/* Tarih */}
          <Text style={styles.dataText}>
            {format(new Date(), 'dd MMMM yy, EEEE', { locale: tr })}
          </Text>
          {/* Icon */}
          <WeatherIcon iconCode={weatherData?.weather[0].icon} />

          {/* Hava durumu açıklması */}
          <Text style={styles.weatherDescription}>
            {weatherData?.weather[0].description.toUpperCase()}
          </Text>
          {/* Sıcaklık */}
          <View style={styles.tempContainer}>
            <Text style={styles.temp}>
              {Math.round(weatherData?.main.temp)}°
            </Text>
            <Text style={styles.tempUnit}>C</Text>
          </View>

          <Text style={styles.feelTemp}>
            Hissedilen {Math.round(weatherData?.main.feels_like)}°
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: height,
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.text.primary,
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  errorText: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  errorSubtext: {
    color: colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },

  locationContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  locationIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
  },
  districtText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 4,
  },
  dataText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
    textTransform: 'capitalize',
  },
  weatherDescription: {
    fontSize: 20,
    color: colors.text.primary,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 10,
    letterSpacing: 2,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 20,
  },
  temp: {
    fontSize: 96,
    fontWeight: '200',
    color: colors.text.primary,
    lineHight: 96,
  },
  tempUnit: {
    fontSize: 48,
    fontWeight: '300',
    color: colors.text.primary,
    marginTop: 8,
  },
  feelTemp: {
    fontSize: 18,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
export default App;
