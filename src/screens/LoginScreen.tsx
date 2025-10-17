import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../config/sports';

interface LoginScreenProps {
  onNavigateToSignUp: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToSignUp }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🏐</Text>
        <Text style={styles.title}>EZ Coach</Text>
        <Text style={styles.subtitle}>Gerencie seu time com facilidade</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          keyboardType="email-address"
          error={errors.email}
        />
        <Input
          label="Senha"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          error={errors.password}
        />

        <Button
          title="Entrar"
          onPress={handleLogin}
          loading={loading}
          fullWidth
        />

        <Button
          title="Criar conta"
          onPress={onNavigateToSignUp}
          variant="outline"
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  content: {
    padding: 24,
    justifyContent: 'center',
    minHeight: '100%'
  },
  header: {
    alignItems: 'center',
    marginBottom: 40
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary
  },
  form: {
    gap: 16
  }
});
