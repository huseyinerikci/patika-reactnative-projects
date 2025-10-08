import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { colors } from '../config/colors';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text
          style={
            (styles.buttonText, variant === 'secondary' && styles.secondaryText)
          }
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    elevation: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.buttonSecondary,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.textMuted,
    opacity: 0.5,
  },
  buttonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryText: {
    color: colors.primary,
  },
});
export default Button;
