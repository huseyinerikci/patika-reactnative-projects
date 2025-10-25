import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

interface State {
  hasError: boolean;
  error?: Error | null;
}

export default class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Loglama yapılabilir (ör. Sentry)
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Bir hata oluştu</Text>
          <Text style={styles.message}>
            Harita gösterilirken bir hata oluştu. Lütfen uygulamayı yeniden
            başlatın veya ana sayfaya dönün.
          </Text>
        </View>
      );
    }
    // @ts-ignore
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.md,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: SIZES.sm,
  },
  message: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
