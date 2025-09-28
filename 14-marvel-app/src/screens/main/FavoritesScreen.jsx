import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FavoritesScreen = () => {
  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorilerim</Text>
      </View>

      <View style={styles.emptyContainer}>
        <Icon name="favorite-border" size={80} color="#8e8e93" />
        <Text style={styles.emptyTitle}>Henüz favori eklememişsin</Text>
        <Text style={styles.emptySubtitle}>
          Karakterleri ve çizgi romanları keşfet!
        </Text>
      </View>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
  },
});
export default FavoritesScreen;
