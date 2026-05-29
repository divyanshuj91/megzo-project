import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Matches web CSS design tokens
export const COLORS = {
  // Gradient background colors (from homepage.css / product_listing.css)
  gradientBg: ['#90cde1', '#2F80ED', '#e84242', '#e97d3f'],

  // Login/Signup gradient (from login.html)
  authGradient: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#ff6b6b'],

  // Glass morphism
  glassWhite: 'rgba(255, 255, 255, 0.6)',
  glassWhiteStrong: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.4)',
  glassBorderLight: 'rgba(255, 255, 255, 0.2)',

  // Button colors
  btnYellow: '#f3cf66',
  btnYellowHover: '#e6c35a',
  btnBlue: '#2563eb',
  btnBlueHover: '#1d4ed8',

  // Auth accent
  authPurple: '#667eea',
  authPurpleDark: '#764ba2',

  // Text
  textDark: '#1a202c',
  textPrimary: '#2d3748',
  textSecondary: '#718096',
  textWhite: '#ffffff',

  // Utility
  red500: '#ef4444',
  green600: '#16a34a',
  blue600: '#2563eb',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  white: '#ffffff',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const FONTS = {
  regular: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semiBold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
  extraBold: { fontWeight: '800' },
};

export const SIZES = {
  // Font sizes
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  title: 28,
  hero: 32,
  display: 40,

  // Spacing
  padding: 16,
  paddingLg: 24,
  margin: 16,
  radius: 12,
  radiusLg: 20,
  radiusXl: 24,

  // Screen
  width,
  height,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  authCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 12,
  },
  button: {
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 6,
  },
};

// Glass card style preset
export const GLASS_CARD = {
  backgroundColor: COLORS.glassWhite,
  borderWidth: 1,
  borderColor: COLORS.glassBorder,
  borderRadius: SIZES.radiusLg,
  ...SHADOWS.medium,
};

// Glass header style preset
export const GLASS_HEADER = {
  backgroundColor: COLORS.glassWhite,
  borderBottomWidth: 1,
  borderBottomColor: COLORS.glassBorderLight,
};
