import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Button } from "../components/Button";
import { COLORS } from "../config/sports";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Font from "expo-font";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const NOME_FONTE = "BeVietnamSemibold";

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [fontLoaded, setFontLoaded] = useState(false);

  const pages = [
    {
      title: "Bem-vindo ao EZ Coach",
      description: "Gerencie seu time esportivo de forma profissional e intuitiva",
      image: require("../../assets/volleyballIcon.png"),
    },
    {
      title: "Quadro Tático Interativo",
      description: "Crie e compartilhe estratégias com drag & drop intuitivo",
      image: require("../../assets/tacticalFrameIcon.png"),
    },
    {
      title: "Organize Treinos e Eventos",
      description: "Mantenha sua equipe sincronizada com calendário completo",
      image: require("../../assets/calendarIcon.png"),
    },
    {
      title: "Chat em Tempo Real",
      description: "Comunique-se com seu time de forma eficiente",
      image: require("../../assets/chatIcon.png"),
    },
  ];

  useEffect(() => {
    Font.loadAsync({ [NOME_FONTE]: require("../../assets/BeVietnamPro-SemiBold.ttf") }).then(() =>
      setFontLoaded(true)
    );
  }, []);

  if (!fontLoaded) return null;

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Image style={[styles.image]} source={pages[currentPage].image}></Image>
          <Text style={[styles.title, styles.BeVietnamPro]}>{pages[currentPage].title}</Text>
          <Text style={[styles.description, styles.BeVietnamPro]}>{pages[currentPage].description}</Text>

          <View style={styles.pagination}>
            {pages.map((_, index) => (
              <View key={index} style={[styles.dot, index === currentPage && styles.activeDot]} />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button title={currentPage === pages.length - 1 ? "Começar" : "Próximo"} onPress={handleNext} fullWidth />
          {currentPage < pages.length - 1 && <Button title="Pular" onPress={onComplete} variant="outline" fullWidth />}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 30
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  pagination: {
    flexDirection: "row",
    marginTop: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  footer: {
    padding: 24,
    gap: 12,
  },
  BeVietnamPro: {
    fontFamily: NOME_FONTE
  }
});
