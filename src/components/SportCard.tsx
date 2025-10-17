import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Sport } from '../types';
import { COLORS } from '../config/sports';

interface SportCardProps {
  sport: Sport;
  onPress: () => void;
  selected?: boolean;
}

export const SportCard: React.FC<SportCardProps> = ({ sport, onPress, selected }) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={onPress}
    >
      <Text style={styles.emoji}>{sport.emoji}</Text>
      <Text style={styles.name}>{sport.name}</Text>
      <View style={styles.info}>
        <Text style={styles.infoText}>{sport.playersCount} jogadores</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 12
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4
  },
  info: {
    marginTop: 4
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary
  }
});
