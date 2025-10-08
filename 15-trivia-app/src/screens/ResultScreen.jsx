import { View, Text, Animated, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import React, { useEffect, useState } from 'react';
import { getHighScore, saveHighScore } from '../config/firebase';
import Button from '../components/Button';
import { colors } from '../config/colors';

const ResultScreen = ({ route, navigation }) => {
  const { score, correctAnswers, wrongAnswers, totalQuestions } = route.params;
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [previousHighScore, setPreviousNewHighScore] = useState(0);

  const fadeAnim = new Animated.Value(1);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    checkAndSaveHighScore();
    startAnimations();
  }, []);

  const checkAndSaveHighScore = async () => {
    try {
      const currentHighScore = await getHighScore();
      setPreviousNewHighScore(currentHighScore);
      if (score > currentHighScore) {
        setIsNewHighScore(true);
        await saveHighScore(score);
      }
    } catch (error) {
      console.error('Error checking high score:', error);
    }
  };
  const startAnimations = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };
  const goToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };
  const playAgain = () => {
    navigation.replace('Game', {
      difficulty: route.params.difficulty || 'medium',
      type: route.params.type || 'boolean',
      category: route.params.category || '',
      amount: route.params.amount || 10,
    });
  };
  const successRate = Math.round((correctAnswers / totalQuestions) * 100);
  const getPerformanceMessage = () => {
    if (successRate >= 90)
      return { text: 'Mükemmel! 🎉', color: colors.correct };
    if (successRate >= 70) return { text: 'Harika! 🌟', color: colors.accent };
    if (successRate >= 50) return { text: 'İyi! 👍', color: colors.primary };
    return { text: 'Daha iyisini yapabilirsin! 💪', color: colors.incorrect };
  };

  const performance = getPerformanceMessage();
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
          <Text style={styles.emoji}>
            {isNewHighScore ? '🏆' : successRate >= 70 ? '🎯' : '📊'}
          </Text>
          <Text style={styles.title}>
            {isNewHighScore ? 'Yeni Rekor' : 'Oyun Bitti'}
          </Text>
          {isNewHighScore && (
            <Text style={styles.newRecordText}>
              Önceki rekor: {previousHighScore}
            </Text>
          )}
        </View>

        <View style={styles.mainScoreCard}>
          <Text style={styles.scoreLabel}>Toplam Skor</Text>
          <Text style={styles.mainScore}>{score}</Text>
          <View
            style={[
              styles.performanceBadge,
              { backgroundColor: performance.color + '30' },
            ]}
          >
            <Text
              style={[styles.performanceText, { color: performance.color }]}
            >
              {performance.text}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={styles.statValue}>{correctAnswers}</Text>
            <Text style={styles.statLabel}>Doğru</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>❌</Text>
            <Text style={styles.statValue}>{wrongAnswers}</Text>
            <Text style={styles.statLabel}>Yanlış</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📊</Text>
            <Text style={styles.statValue}>{successRate}</Text>
            <Text style={styles.statLabel}>Başarı</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Ana Sayfa" onPress={goToHome} variant="primary" />
          <Button title="Tekrar Oyna" onPress={playAgain} variant="secondary" />
        </View>
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
    marginBottom: 32,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  newRecordText: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
  },
  mainScoreCard: {
    backgroundColor: colors.cardBg,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: colors.primary + '50',
    elevation: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  scoreLabel: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  mainScore: {
    color: colors.primary,
    fontSize: 72,
    fontWeight: '800',
    marginBottom: 16,
  },
  performanceBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  performanceText: {
    fontSize: 18,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.buttonSecondary,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 12,
  },
  secondaryButton: {
    marginTop: 8,
  },
});
export default ResultScreen;
