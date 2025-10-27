import React, { useState, useRef } from "react";
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  Image, 
  TouchableWithoutFeedback, 
  Keyboard
} from "react-native";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { useAuth } from "../contexts/AuthContext";
import { COLORS } from "../config/sports";
import { useFonts } from "../hooks/useFonts";
import { useKeyboard } from "../hooks/useKeyboard";

interface SignUpScreenProps {
  onNavigateToLogin: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onNavigateToLogin }) => {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const scrollViewRef = useRef<ScrollView>(null);
  const fontsLoaded = useFonts();
  const keyboardHeight = useKeyboard();

  if (!fontsLoaded) return null;

  const validate = () => {
    const newErrors: any = {};

    if (!name) {
      newErrors.name = "Nome é obrigatório";
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirme sua senha";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await signUp(email, password, name);
      Alert.alert("Sucesso", "Conta criada com sucesso!");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Função simples para fazer scroll quando o input é focado
  const handleInputFocus = (offsetY: number = 100) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: offsetY, animated: true });
    }, 100);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.container} 
        contentContainerStyle={[
          styles.content,
          { 
            paddingBottom: keyboardHeight > 0 ? keyboardHeight + 200 : 24
          }
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image source={require("../../assets/volleyballIcon.png")} style={styles.image} />
          <Text variant="bold" style={styles.title}>Criar Conta</Text>
          <Text variant="medium" style={styles.subtitle}>Comece a gerenciar seu time</Text>
        </View>

        <View style={styles.form}>
          <Input 
            label="Nome Completo" 
            value={name} 
            onChangeText={setName} 
            placeholder="Seu nome" 
            error={errors.name}
            onFocus={() => handleInputFocus(0)}
          />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            error={errors.email}
            onFocus={() => handleInputFocus(0)}
          />
          <Input 
            label="Senha" 
            value={password} 
            onChangeText={setPassword} 
            placeholder="••••••••" 
            secureTextEntry 
            error={errors.password}
            onFocus={() => handleInputFocus(100)}
          />
          <Input
            label="Confirmar Senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            secureTextEntry
            error={errors.confirmPassword}
            onFocus={() => handleInputFocus(200)}
          />

          <Button title="Criar Conta" onPress={handleSignUp} loading={loading} fullWidth />
          <Button title="Já tenho conta" onPress={onNavigateToLogin} variant="outline" fullWidth />
        </View>
      </ScrollView>
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
    paddingTop: 24,
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
    marginBottom: 30,
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