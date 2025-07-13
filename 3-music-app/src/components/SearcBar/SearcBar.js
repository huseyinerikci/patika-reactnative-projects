import React from 'react';
import { TextInput, View } from 'react-native';
import styles from './SearcBar.styles';
const SearcBar = ({ handleSearch }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ara..."
        onChangeText={handleSearch}
      />
    </View>
  );
};

export default SearcBar;
