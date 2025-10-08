import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../config/colors';

const QuestionCard = ({
  question,
  answers,
  onAnswerPress,
  selectedAnswer,
  isAnswered,
  correctAnswer,
}) => {
  const decodeHTML = html => {
    return html
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  };

  const getAnswerStyle = answer => {
    if (!isAnswered) return styles.answer;
    if (answer === correctAnswer) {
      return [styles.answer, styles.correctAnswer];
    }
    if (answer === selectedAnswer && answer !== correctAnswer) {
      return [styles.answer, styles.wrongAnswer];
    }
    return [styles.answer, styles.disabledAnswer];
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{decodeHTML(question)}</Text>
      </View>
      <View style={styles.answersContainer}>
        {answers.map((answer, index) => (
          <TouchableOpacity
            key={index}
            style={getAnswerStyle(answer)}
            onPress={() => onAnswerPress(answer)}
            disabled={isAnswered}
            activeOpacity={0.7}
          >
            <Text style={styles.answerText}>{decodeHTML(answer)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  questionContainer: {
    backgroundColor: colors.cardBg,
    padding: 28,
    borderRadius: 20,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: colors.primary + '40',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  questionText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 32,
    textAlign: 'center',
  },
  answersContainer: {
    gap: 16,
  },
  answer: {
    backgroundColor: colors.buttonSecondary,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary + '50',
    elevation: 4,
  },
  correctAnswer: {
    backgroundColor: colors.correct + '30',
    borderColor: colors.correct,
    borderWidth: 3,
  },
  wrongAnswer: {
    backgroundColor: colors.incorrect + '30',
    borderColor: colors.incorrect,
    borderWidth: 3,
  },
  disabledAnswer: {
    opacity: 0.5,
  },
  answerText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default QuestionCard;
