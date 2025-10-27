import React, { useState } from "react";
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  Image, 
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { useAuth } from "../contexts/AuthContext";
import { useFonts } from "../hooks/useFonts";
import { useKeyboard } from "../hooks/useKeyboard";
import { COLORS } from "../config/sports";

interface LoginScreenProps {
  onNavigateToSignUp: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToSignUp }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const fontsLoaded = useFonts();
  const keyboardHeight = useKeyboard();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter no mínimo 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!fontsLoaded) return null;

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={[
            styles.content,
            { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 24 } // 👈 Ajuste dinâmico
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Image source={require("../../assets/volleyballIcon.png")} style={styles.image} />
            <Text variant="semibold" style={styles.title}>EZ Coach</Text>
            <Text variant="semibold" style={styles.subtitle}>Gerencie seu time com facilidade</Text>
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

            <Button title="Entrar" onPress={handleLogin} loading={loading} fullWidth />
            <Button title="Criar conta" onPress={onNavigateToSignUp} variant="outline" fullWidth />
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 24,
    paddingTop: 24, // 👈 Garante padding consistente
    justifyContent: "center",
    minHeight: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 30
  },
  title: {
    fontSize: 32,
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  form: {
    gap: 16,
  },
});