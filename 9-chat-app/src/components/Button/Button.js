import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import styles from './Button.style';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const Button = ({ text, onPress, loading, icon, theme = 'primary' }) => {
  return (
    <TouchableOpacity
      style={styles[theme].container}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <View style={styles[theme].button_container}>
          <FontAwesome6 name={icon} color={'white'} size={18} />
          <Text style={styles[theme].title}>{text}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
