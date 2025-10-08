import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../config/colors';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import Button from '../components/Button';

const GameScreen = ({ route, navigation }) => {
  const { difficulty, type, category, amount } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswered, setSelectedAnswered] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);

  const timerRef = useRef(null);

  useEffect(() => {
    fetchQuestions();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (!loading && !isAnswered) {
      startTimer();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestionIndex, isAnswered, loading]);

  const fetchQuestions = async () => {
    try {
      let url = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=${type}`;
      if (category) {
        url += `&category=${category}`;
      }
      const response = await fetch(url);
      const data = await response.json();

      if (data.response_code === 0) {
        setQuestions(data.results);
        prepareAnswers(data.results[0]);
        setLoading(false);
      } else {
        throw new Error('Sorular Yüklenemedi');
      }
    } catch (error) {
      Alert.alert('Hata', 'Sorular yüklenirken bir hata oluştu', [
        { text: 'Geri Dön', onPress: () => navigation.goBack() },
      ]);
    }
  };
  const prepareAnswers = question => {
    const allAnswers = [...question.incorrect_answers, question.correct_answer];
    const shuffled = allAnswers.sort(() => Math.random() - 0.5);
    setAnswers(shuffled);
  };
  const startTimer = () => {
    setTimeLeft(12);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsAnswered(true);

    setTimeout(() => {
      goToNextQuestion();
    }, 2000);
  };

  const handleAnswerPress = answer => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswered(answer);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const currentQuestions = questions[currentQuestionIndex];
    if (answer === currentQuestions.correct_answer) {
      setScore(score + 10);
    }
    setTimeout(() => {
      goToNextQuestion();
    }, 1500);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      prepareAnswers(questions[nextIndex]);
      setIsAnswered(false);
      setSelectedAnswered(null);
      setTimeLeft(12);
    } else {
      endGame();
    }
  };
  const endGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const correctAnswers = Math.floor(score / 10);
    const wrongAnswers = questions.length - correctAnswers;

    navigation.replace('Result', {
      score,
      correctAnswers,
      wrongAnswers,
      totalQuestions: questions.length,
      difficulty,
      type,
      category,
      amount,
    });
  };
  const goToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Sorular Hazırlanıyor...</Text>
        </View>
      </SafeAreaView>
    );
  }
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Skor</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() =>
            Alert.alert(
              'Oyundan çıkmak istiyor musunuz?',
              'İlerlemeniz kaydedilmeyecek.',
              [
                { text: 'Vazgeç', style: 'cancel' },
                { text: 'Evet', onPress: goToHome },
              ],
            )
          }
        >
          <Text style={styles.closeText}>❌</Text>
        </TouchableOpacity>
      </View>
      <ProgressBar
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        timeLeft={timeLeft}
        maxTime={12}
      />

      <QuestionCard
        question={currentQuestion.question}
        answers={answers}
        onAnswerPress={handleAnswerPress}
        selectedAnswered={selectedAnswered}
        isAnswered={isAnswered}
        correctAnswers={currentQuestion.correct_answer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 18,
    marginTop: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreLabel: { color: colors.textSecondary, fontSize: 18, fontWeight: '600' },
  scoreValue: { color: colors.primary, fontSize: 28, fontWeight: '800' },
  closeButton: {
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  closeText: {
    fontSize: 24,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'red',
    padding: 5,
  },
});

export default GameScreen;
