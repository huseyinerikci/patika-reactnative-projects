import { View, Text, SafeAreaView, FlatList } from 'react-native';
import React from 'react';
import styles from './Room.style';
import FloatingButton from '../../../components/FloatingButton';
import RoomCard from '../../../components/card/RoomCard';

const Room = () => {
  const handleRoom = () => {};
  function handleToggle() {
    // setModalVisible(!modalVisible);
  }

  const renderRoom = ({ item }) => (
    <RoomCard rooms={item} onRoom={() => handleRoom(item)} />
  );
  return (
    <SafeAreaView>
      <FlatList data={null} renderItem={renderRoom} />
      <FloatingButton icon="plus" onPress={handleToggle} />
    </SafeAreaView>
  );
};

export default Room;
