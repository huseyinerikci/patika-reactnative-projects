export const COLORS = {
  // Ana renkler
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#FFD93D',

  // Gradient renkler
  gradientStart: '#FF6B6B',
  gradientEnd: '#FF8E53',

  // Neutral renkler
  background: '#F8F9FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  // Text renkler
  text: '#2D3436',
  textSecondary: '#636E72',
  textLight: '#B2BEC3',

  // Status renkler
  success: '#00B894',
  warning: '#FDCB6E',
  error: '#D63031',
  info: '#74B9FF',

  // Dark mode (opsiyonel)
  darkBackground: '#1E272E',
  darkSurface: '#2D3436',
  darkText: '#DFE6E9',

  // Diğer
  border: '#E1E8ED',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  rating: '#FFC107',
};

export const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Font boyutları
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  body1: 16,
  body2: 14,
  caption: 12,

  // Radius
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 9999,

  // Icon boyutları
  iconSm: 16,
  iconMd: 24,
  iconLg: 32,
  iconXl: 48,

  // Border
  borderWidth: 1,
  borderWidthThick: 2,
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};
