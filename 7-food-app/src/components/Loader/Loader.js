import LottieView from 'lottie-react-native';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Loader = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/loading.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 500,
    height: 500,
  },
});

export default Loader;
