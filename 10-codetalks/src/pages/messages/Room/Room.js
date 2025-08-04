import { View, Text, SafeAreaView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './Room.style';
import FloatingButton from '../../../components/FloatingButton';
import RoomCard from '../../../components/card/RoomCard';
import ContentInputModal from '../../../components/modal/ContentInput/ContentInputModal';
import parseContentData from '../../../utils/parseContentData';
import { getDatabase } from '@react-native-firebase/database';

const Room = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    getDatabase()
      .ref('rooms/')
      .on('value', snapshot => {
        const roomsData = snapshot.val();

        const parsedData = parseContentData(roomsData || {});
        setRoomList(parsedData);
      });
  }, []);
  const handleSendRoom = room => {
    handleToggle();
    sendRoom(room);
  };
  function sendRoom(room) {
    const roomObject = {
      title: room,
      date: new Date().toISOString(),
    };
    getDatabase().ref('rooms/').push(roomObject);
  }
  function handleToggle() {
    setModalVisible(!modalVisible);
  }
  function handleRoom(room) {
    navigation.navigate('MessageScreen', {
      roomId: room.id,
      title: room.title,
    });
  }

  const renderRoom = ({ item }) => (
    <RoomCard rooms={item} onPress={() => handleRoom(item)} />
  );
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={roomList}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          gap: 2,
          padding: 5,
        }}
        renderItem={renderRoom}
      />

      <FloatingButton icon="plus" onPress={handleToggle} />
      <ContentInputModal
        visible={modalVisible}
        onClose={handleToggle}
        onSend={handleSendRoom}
        placeholder="Oda giriniz..."
        titleBtn={'Oluştur'}
      />
    </SafeAreaView>
  );
};

export default Room;
