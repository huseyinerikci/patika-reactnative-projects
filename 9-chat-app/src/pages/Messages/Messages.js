import { View, Text, SafeAreaView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './Messages.style';
import FloatingButton from '../../components/FloatingButton';
import ContentInputModal from '../../components/modal/ContentInput';
import { getAuth } from '@react-native-firebase/auth';
import { getDatabase } from '@react-native-firebase/database';
import parseContentData from '../../utils/parseContentData';
import MessageCard from '../../components/card/MessageCard';

const Messages = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [contentList, setContentList] = useState([]);

  useEffect(() => {
    getDatabase()
      .ref('messages/')
      .on('value', snapshot => {
        const contentData = snapshot.val();

        const parsedData = parseContentData(contentData || {});
        setContentList(parsedData);
      });
  }, []);

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
      dislike: 0,
    };
    getDatabase().ref('messages/').push(contentObject);
  }
  const handleChat = item => {
    getDatabase()
      .ref(`messages/${item.id}`)
      .update({ dislike: item.dislike + 1 });
  };

  const renderContent = ({ item }) => (
    <MessageCard message={item} onChat={() => handleChat(item)} />
  );
  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={contentList} renderItem={renderContent} />
      <FloatingButton icon="plus" onPress={handleToggle} />

      <ContentInputModal
        visible={modalVisible}
        onClose={handleToggle}
        onSend={handleSendContent}
      />
    </SafeAreaView>
  );
};

export default Messages;
