import {
  View,
  Text,
  StyleSheet,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { getHighScore } from '../config/firebase';
import { colors } from '../config/colors';
import ScoreCard from '../components/ScoreCard';
import Button from '../components/Button';

const HomeScreen = ({ navigation }) => {
  const [highScore, setHighScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    loadingHighScore();
    startAnimations();
  }, []);
  const loadingHighScore = async () => {
    try {
      const score = await getHighScore();
      setHighScore(score);
    } catch (error) {
      console.error('Error loading high score:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startQuickGame = () => {
    navigation.navigate('Game', {
      difficulty: 'medium',
      type: 'boolean',
      category: '',
      amount: 10,
    });
  };
  const goToSettings = () => {
    navigation.navigate('Settings');
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>🧠</Text>
          <Text style={styles.title}>Trivia Challenge</Text>
          <Text style={styles.subtitle}>Bilgi Yarışması</Text>
        </View>
        <ScoreCard title="En Yüksek Skor" score={highScore} icon="🏆" />
        <View style={styles.buttonContainer}>
          <Button
            title="Hızlı Oyun Başlat"
            onPress={startQuickGame}
            variant="primary"
            loading={loading}
          />
          <Button
            title="Ayarlar ve Başlat"
            onPress={goToSettings}
            variant="secondary"
            style={styles.secondaryButton}
            loading={loading}
          />
        </View>
        <Text style={styles.infoText}>
          Hızlı oyun: 10 soru, doğru/yanlış, orta zorluk
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 16,
    marginTop: 32,
  },
  secondaryButton: {
    marginTop: 8,
  },
  infoText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
    lineHeight: 20,
  },
});
export default HomeScreen;
