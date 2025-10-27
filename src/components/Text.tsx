import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

interface TextProps extends RNTextProps {
  variant?: 'regular' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({ 
  variant = 'regular', 
  style, 
  children, 
  ...props 
}) => {
  const getFontFamily = () => {
    switch (variant) {
      case 'medium':
        return 'BeVietnamMedium';
      case 'semibold':
        return 'BeVietnamSemibold';
      case 'bold':
        return 'BeVietnamBold';
      default:
        return 'BeVietnamRegular';
    }
  };

  return (
    <RNText 
      style={[styles.text, { fontFamily: getFontFamily() }, style]} 
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#000',
  },
});