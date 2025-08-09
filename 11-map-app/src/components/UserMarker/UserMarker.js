import { Image } from 'react-native';
import React from 'react';
import { Marker } from 'react-native-maps';
import styles from './UserMarker.style';

const UserMarker = ({ coordinate, userImageURL, onPress }) => {
  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <Image style={styles.image} source={{ uri: userImageURL }} />
    </Marker>
  );
};

export default UserMarker;
