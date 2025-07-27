import { View, Text, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import styles from './Messages.style';
import FloatingButton from '../../components/FloatingButton';
import ContentInputModal from '../../components/modal/ContentInput';

const Messages = () => {
  const [modalVisible, setModalVisible] = useState(false);
  function handleToggle() {
    setModalVisible(!modalVisible);
  }

  function handleSendContent(content) {
    handleToggle();
    console.log(content);
  }
  return (
    <SafeAreaView style={styles.container}>
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
