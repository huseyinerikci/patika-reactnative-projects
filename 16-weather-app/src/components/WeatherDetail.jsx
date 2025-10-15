import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import colors from '../constants/colors';

const WeatherDetail = ({ icon, label, value }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.card.border,
    padding: 16,
    margin: 8,
    minWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  value: {
    fontSize: 20,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
});

export default WeatherDetail;
