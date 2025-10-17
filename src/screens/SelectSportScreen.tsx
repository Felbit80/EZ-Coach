import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SportCard } from '../components/SportCard';
import { Button } from '../components/Button';
import { SPORTS } from '../config/sports';
import { SportType } from '../types';
import { COLORS } from '../config/sports';

interface SelectSportScreenProps {
  onSelect: (sport: SportType) => void;
}

export const SelectSportScreen: React.FC<SelectSportScreenProps> = ({ onSelect }) => {
  const [selectedSport, setSelectedSport] = useState<SportType>('volleyball');

  const handleContinue = () => {
    onSelect(selectedSport);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Escolha seu Esporte</Text>
          <Text style={styles.subtitle}>
            Selecione o esporte principal do seu time
          </Text>
        </View>

        <View style={styles.sports}>
          {Object.values(SPORTS).map((sport) => (
            <SportCard
              key={sport.id}
              sport={sport}
              selected={selectedSport === sport.id}
              onPress={() => setSelectedSport(sport.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continuar"
          onPress={handleContinue}
          fullWidth
        />
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
    padding: 24
  },
  header: {
    marginBottom: 24
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary
  },
  sports: {
    marginBottom: 24
  },
  footer: {
    padding: 24,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border
  }
});
