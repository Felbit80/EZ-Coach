import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useTeam } from "../contexts/TeamContext";
import { SportType } from "../types";
import { COLORS, SPORTS } from "../config/sports";
import * as Font from "expo-font";

interface CreateTeamScreenProps {
  sport: SportType;
  onComplete: () => void;
}

const NOME_FONTE = "BeVietnamSemibold";

export const CreateTeamScreen: React.FC<CreateTeamScreenProps> = ({ sport, onComplete }) => {
  const { createTeam } = useTeam();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({ [NOME_FONTE]: require("../../assets/BeVietnamPro-SemiBold.ttf") }).then(() =>
      setFontLoaded(true)
    );
  }, []);

  if (!fontLoaded) return null;

  const selectedSport = SPORTS[sport];

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Nome do time é obrigatório");
      return;
    }

    try {
      setLoading(true);
      await createTeam({
        name: name.trim(),
        sport,
      });
      Alert.alert("Sucesso", "Time criado com sucesso!");
      onComplete();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao criar time");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.emoji, styles.BeVietnamPro]}>{selectedSport.emoji}</Text>
          <Text style={[styles.title, styles.BeVietnamPro]}>Criar Time de {selectedSport.name}</Text>
          <Text style={[styles.subtitle, styles.BeVietnamPro]}>Configure os detalhes básicos do seu time</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nome do Time"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError("");
            }}
            placeholder="Ex: Equipe Campeã"
            error={error}
          />

          <View style={styles.info}>
            <Text style={[styles.infoTitle, styles.BeVietnamPro]}>Informações do Esporte</Text>
            <Text style={[styles.infoText, styles.BeVietnamPro]}>• {selectedSport.playersCount} jogadores em quadra</Text>
            <Text style={[styles.infoText, styles.BeVietnamPro]}>• Posições: {selectedSport.positions.join(", ")}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Criar Time" onPress={handleCreate} loading={loading} fullWidth />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  form: {
    marginBottom: 24,
  },
  info: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  footer: {
    padding: 24,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  BeVietnamPro: {
    fontFamily: NOME_FONTE
  }
});
