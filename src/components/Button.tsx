import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../config/sports';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'outline' && styles.outlineButton,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.primary : '#FFFFFF'} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant === 'primary' && styles.primaryText,
            variant === 'secondary' && styles.secondaryText,
            variant === 'outline' && styles.outlineText
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50
  },
  primaryButton: {
    backgroundColor: COLORS.primary
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary
  },
  fullWidth: {
    width: '100%'
  },
  disabled: {
    opacity: 0.5
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  primaryText: {
    color: '#FFFFFF'
  },
  secondaryText: {
    color: '#FFFFFF'
  },
  outlineText: {
    color: COLORS.primary
  }
});
