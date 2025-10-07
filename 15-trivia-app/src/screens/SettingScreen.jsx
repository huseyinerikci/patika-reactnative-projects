import { View, Text } from 'react-native';
import React, { useState } from 'react';

const SettingScreen = ({ navigation }) => {
  const [difficulty, setDifficulty] = useState('medium');
  const [type, setType] = useState('boolean');
  const [category, setCategory] = useState('');

  const difficulties = [
    { value: 'easy', label: 'Kolay', emoji: '😊' },
    { value: 'medium', label: 'Orta', emoji: '🤔' },
    { value: 'hard', label: 'Zor', emoji: '🔥' },
  ];
  const types = [
    { value: 'boolean', label: 'Doğru/Yanlış', emoji: '✓✗' },
    { value: 'multiple', label: 'Çoktan Seçmeli', emoji: 'ABCD' },
  ];
  const categories = [
    { value: '', label: 'Karışık', emoji: '🎲' },
    { value: '9', label: 'Genel Kültür', emoji: '🌍' },
    { value: '21', label: 'Spor', emoji: '⚽' },
    { value: '22', label: 'Coğrafya', emoji: '🗺️' },
    { value: '23', label: 'Tarih', emoji: '📜' },
    { value: '17', label: 'Bilim', emoji: '🔬' },
    { value: '18', label: 'Bilgisayar', emoji: '💻' },
    { value: '11', label: 'Film', emoji: '🎬' },
    { value: '12', label: 'Müzik', emoji: '🎵' },
  ];
  return (
    <View>
      <Text>SettingScreen</Text>
    </View>
  );
};

export default SettingScreen;
