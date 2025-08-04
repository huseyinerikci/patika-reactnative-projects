import React, { useEffect, useState } from 'react';
import styles from './Message.style';
import MessageCard from '../../../components/card/MessageCard';
import { FlatList, SafeAreaView, Text } from 'react-native';
import FloatingButton from '../../../components/FloatingButton';
import ContentInputModal from '../../../components/modal/ContentInput';
import parseContentData from '../../../utils/parseContentData';
import { getAuth } from '@react-native-firebase/auth';
import { getDatabase } from '@react-native-firebase/database';

const Message = ({ route }) => {
  const { roomId, title } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [contentList, setContentList] = useState([]);

  useEffect(() => {
    const ref = getDatabase().ref(`messages/${roomId}/`);
    const onValueChange = snapshot => {
      const contentData = snapshot.val();
      const parsedData = parseContentData(contentData || {});
      setContentList(parsedData);
    };
    ref.on('value', onValueChange);

    return () => ref.off('value', onValueChange);
  }, [roomId]);

  function handleToggle() {
    setModalVisible(!modalVisible);
  }

  function handleSendContent(content) {
    handleToggle();
    sendContent(content);
  }
  function sendContent(content) {
    const userMail = getAuth().currentUser.email;

    const contentObject = {
      text: content,
      username: userMail.split('@')[0],
      date: new Date().toISOString(),
    };
    getDatabase().ref(`messages/${roomId}/`).push(contentObject);
  }

  const renderContent = ({ item }) => <MessageCard message={item} />;
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{title} odası kuruldu!</Text>
      <FlatList data={contentList} renderItem={renderContent} />
      <FloatingButton icon="plus" onPress={handleToggle} />

      <ContentInputModal
        visible={modalVisible}
        onClose={handleToggle}
        onSend={handleSendContent}
        placeholder={'mesaj giriniz...'}
        titleBtn={'Gönder'}
      />
    </SafeAreaView>
  );
};

export default Message;
