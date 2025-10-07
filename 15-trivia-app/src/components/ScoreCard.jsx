import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '../config/colors';

const ScoreCard = ({ title, score, icon }) => {
  return (
    <View style={styles.container}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.scoreLabel}>puan</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBg,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 16,
    borderWidth: 2,
    borderColor: colors.primary + '30',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  score: {
    color: colors.primary,
    fontSize: 56,
    fontWeight: '800',
    marginRight: 8,
  },
  scoreLabel: {
    color: colors.textMuted,
    fontSize: 18,
    fontWeight: '600',
  },
});
export default ScoreCard;
