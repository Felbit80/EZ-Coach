import React from "react";
import { View, TextInput, StyleSheet, TextInputProps } from "react-native";
import { COLORS } from "../config/sports";
import { Text } from "./Text";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  variant?: 'semibold';
}

export const Input = React.forwardRef<TextInput, InputProps>(({
  label,
  variant = "regular",
  error,
  style,
  ...props
}, ref) => {
  const getFontFamily = () => {
    return 'BeVietnamSemibold';
  };

  return (
    <View style={styles.container}>
      <Text variant="semibold" style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        style={[
          styles.input,
          { fontFamily: getFontFamily() },
          error && styles.inputError,
          props.multiline && styles.multiline,
          style
        ]}
        placeholderTextColor={COLORS.textSecondary}
        {...props}
      />
      {error && <Text variant="regular" style={styles.errorText}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
});