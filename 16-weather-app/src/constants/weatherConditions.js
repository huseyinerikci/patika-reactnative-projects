export const weatherConditions = {
  // d = day (gündüz), n = night (gece)
  // '01d' = Gündüz güneşli
  '01d': { name: 'Güneşli', gradient: 'clear', icon: '☀️' },
  '01n': { name: 'Açık Gece', gradient: 'clear', icon: '🌙' },
  // Az bulutlu
  '02d': { name: 'Az Bulutlu', gradient: 'clear', icon: '🌤️' },
  '02n': { name: 'Az Bulutlu Gece', gradient: 'clouds', icon: '🌤️' },

  // Parçalı bulutlu
  '03d': { name: 'Parçalı Bulutlu', gradient: 'clouds', icon: '☁️' },
  '03n': { name: 'Parçalı Bulutlu', gradient: 'clouds', icon: '☁️' },

  // Çok bulutlu
  '04d': { name: 'Çok Bulutlu', gradient: 'clouds', icon: '☁️' },
  '04n': { name: 'Çok Bulutlu', gradient: 'clouds', icon: '☁️' },

  // Sağanak yağmur
  '09d': { name: 'Sağanak Yağmur', gradient: 'rain', icon: '🌧️' },
  '09n': { name: 'Sağanak Yağmur', gradient: 'rain', icon: '🌧️' },

  // Yağmurlu
  '10d': { name: 'Yağmurlu', gradient: 'rain', icon: '🌦️' },
  '10n': { name: 'Yağmurlu', gradient: 'rain', icon: '🌧️' },

  // Fırtına
  '11d': {
    name: 'Gök Gürültülü Fırtına',
    gradient: 'thunderstorm',
    icon: '⛈️',
  },
  '11n': {
    name: 'Gök Gürültülü Fırtına',
    gradient: 'thunderstorm',
    icon: '⛈️',
  },

  // Kar
  '13d': { name: 'Karlı', gradient: 'snow', icon: '❄️' },
  '13n': { name: 'Karlı', gradient: 'snow', icon: '❄️' },

  // Sis
  '50d': { name: 'Sisli', gradient: 'mist', icon: '🌫️' },
  '50n': { name: 'Sisli', gradient: 'mist', icon: '🌫️' },
};

export const getWeatherCondition = code => {
  return (
    weatherConditions[code] || {
      name: 'Bilinmiyor',
      gradient: 'default',
      icon: '🌡️',
    }
  );
};
