import React from 'react';
import { TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import styles from './Input.style';

const Input = ({ placeholder, value, onType, iconName, isSecure }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        onChangeText={onType}
        value={value}
        secureTextEntry={isSecure}
      />
      <Icon name={iconName} size={20} color="gray" />
    </View>
  );
};

export default Input;
