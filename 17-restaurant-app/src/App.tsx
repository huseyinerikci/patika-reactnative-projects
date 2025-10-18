import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import MapView from 'react-native-maps';

const App = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider="google"
        initialRegion={{
          latitude: 41.015137, // Örnek: İstanbul
          longitude: 28.97953,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: { ...StyleSheet.absoluteFillObject },
});

export default App;
