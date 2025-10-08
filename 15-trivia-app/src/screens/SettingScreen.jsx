import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { colors } from '../config/colors';
import Button from '../components/Button';

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
  const startGame = () => {
    navigation.navigate('Game', {
      difficulty,
      type,
      category,
      amount: 10,
    });
  };
  const OptionButton = ({ item, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.optionButton, isSelected && styles.selectedOption]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.optionEmoji}>{item.emoji}</Text>
      <Text
        style={[styles.optionText, isSelected && styles.selectedOptionText]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>⚙️ Oyun Ayarları</Text>
          <Text style={styles.subtitle}>Oyununu Özelleştir</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zorluk Seviyesi</Text>
          <View style={styles.optionsGrid}>
            {difficulties.map(item => (
              <OptionButton
                key={item.value}
                item={item}
                isSelected={difficulty === item.value}
                onPress={() => setDifficulty(item.value)}
              />
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soru Tipi</Text>
          <View style={styles.optionsGrid}>
            {types.map(item => (
              <OptionButton
                key={item.value}
                item={item}
                isSelected={type === item.value}
                onPress={() => setType(item.value)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategori</Text>
          <View style={styles.categoriesGrid}>
            {categories.map(item => (
              <OptionButton
                key={item.value}
                item={item}
                isSelected={category === item.value}
                onPress={() => setCategory(item.value)}
              />
            ))}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Oyunu Başlat (10 Soru)"
            onPress={startGame}
            variant="primary"
          />
          <Button
            title="Geri Dön"
            onPress={() => navigation.goBack()}
            variant="secondary"
            style={styles.backButton}
          />
        </View>
      </ScrollView>
      <Text>SettingScreen</Text>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  optionButton: {
    flex: 1,
    backgroundColor: colors.buttonSecondary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary + '30',
    minHeight: 90,
    minWidth: 100,
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: colors.primary + '30',
    borderColor: colors.primary,
    borderWidth: 3,
    transform: [{ scale: 1.02 }],
  },
  optionEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  optionText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: colors.text,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 19,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  backButton: {
    marginTop: 8,
  },
});
export default SettingScreen;
