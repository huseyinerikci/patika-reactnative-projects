import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6366F1',
    accent: '#EC4899',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#1E293B',
    placeholder: '#64748B',
    disabled: '#CBD5E1',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
    gradient: {
      primary: ['#6366F1', '#8B5CF6'],
      secondary: ['#EC4899', '#F59E0B'],
      accent: ['#06B6D4', '#3B82F6'],
    },
    card: '#FFFFFF',
    border: '#E2E8F0',
  },
  roundness: 12,
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100' as const,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 10,
    },
  },
};

export const gradientColors = {
  primary: ['#6366F1', '#8B5CF6'],
  secondary: ['#EC4899', '#F59E0B'],
  accent: ['#06B6D4', '#3B82F6'],
  success: ['#10B981', '#34D399'],
  warning: ['#F59E0B', '#FBBF24'],
  danger: ['#EF4444', '#F87171'],
};
