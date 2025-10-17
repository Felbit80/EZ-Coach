import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Button } from '../components/Button';
import { COLORS } from '../config/sports';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: 'Bem-vindo ao EZ Coach',
      description: 'Gerencie seu time esportivo de forma profissional e intuitiva',
      emoji: '🏐'
    },
    {
      title: 'Quadro Tático Interativo',
      description: 'Crie e compartilhe estratégias com drag & drop intuitivo',
      emoji: '📋'
    },
    {
      title: 'Organize Treinos e Eventos',
      description: 'Mantenha sua equipe sincronizada com calendário completo',
      emoji: '📅'
    },
    {
      title: 'Chat em Tempo Real',
      description: 'Comunique-se com seu time de forma eficiente',
      emoji: '💬'
    }
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.emoji}>{pages[currentPage].emoji}</Text>
        <Text style={styles.title}>{pages[currentPage].title}</Text>
        <Text style={styles.description}>{pages[currentPage].description}</Text>

        <View style={styles.pagination}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentPage && styles.activeDot
              ]}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={currentPage === pages.length - 1 ? 'Começar' : 'Próximo'}
          onPress={handleNext}
          fullWidth
        />
        {currentPage < pages.length - 1 && (
          <Button
            title="Pular"
            onPress={onComplete}
            variant="outline"
            fullWidth
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  emoji: {
    fontSize: 100,
    marginBottom: 24
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 40
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 4
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 24
  },
  footer: {
    padding: 24,
    gap: 12
  }
});
