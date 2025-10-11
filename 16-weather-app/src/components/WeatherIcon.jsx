import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';

const WeatherIcon = ({ iconCode, size = 120 }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: iconUrl }}
        style={[styles.icon, { width: size, height: size }]}
        resizeMode="contain"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  icon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});
export default WeatherIcon;
