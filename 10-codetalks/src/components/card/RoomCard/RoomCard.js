import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import styles from './RoomCard.style';

const RoomCard = ({ rooms, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{rooms.title}</Text>
    </TouchableOpacity>
  );
};

export default RoomCard;
