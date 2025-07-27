import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import Button from '../../Button';
import ReactNativeModal from 'react-native-modal';
import styles from './ContentInputModal.style';

const ContentInputModal = ({ visible, onClose, onSend }) => {
  const [text, setText] = useState(null);
  function handleSend() {
    if (!text) return;

    onSend(text);
    setText(null);
  }
  return (
    <ReactNativeModal
      style={styles.modal}
      isVisible={visible}
      swipeDirection="down"
      onSwipeComplete={onClose}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
    >
      <View style={styles.container}>
        <View style={styles.input_container}>
          <TextInput
            style={styles.input}
            placeholder="Mesajı giriniz..."
            onChangeText={setText}
            multiline
          />
        </View>
        <Button text="Gönder" onPress={handleSend} />
      </View>
    </ReactNativeModal>
  );
};

export default ContentInputModal;
