import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import styles from './RoomCard.style';

const RoomCard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>card</Text>
    </SafeAreaView>
  );
};

export default RoomCard;
