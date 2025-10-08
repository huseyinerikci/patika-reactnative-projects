import { View, Text, Animated, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { colors } from '../config/colors';

const ProgressBar = ({
  currentQuestion,
  totalQuestions,
  timeLeft,
  maxTime,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const animatedTime = useRef(new Animated.Value(maxTime)).current;

  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progressPercentage,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestion]);

  useEffect(() => {
    Animated.timing(animatedTime, {
      toValue: timeLeft,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [timeLeft]);

  const timePercentage = (timeLeft / maxTime) * 100;

  const getTimeColor = () => {
    if (timePercentage > 50) return colors.correct;
    if (timePercentage > 25) return colors.warning;
    return colors.incorrect;
  };
  return (
    <View style={styles.container}>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          Soru {currentQuestion} / {totalQuestions}
        </Text>
        <Text style={[styles.timeText, { color: getTimeColor() }]}>
          {' '}
          ⏱️ {timeLeft}s
        </Text>
      </View>
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <View style={styles.timeBarContainer}>
        <Animated.View
          style={[
            styles.timeBar,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, maxTime],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: getTimeColor(),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.cardBg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: colors.buttonSecondary,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  timeBarContainer: {
    height: 6,
    backgroundColor: colors.buttonSecondary,
    borderRadius: 6,
    overflow: 'hidden',
  },
  timeBar: {
    height: '100%',
    borderRadius: 6,
  },
});
export default ProgressBar;
