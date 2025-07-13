import React from 'react';
import { Text, View } from 'react-native';
import styles from './NotFound.styles';
const NotFound = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Not Found Song</Text>
    </View>
  );
};

export default NotFound;
