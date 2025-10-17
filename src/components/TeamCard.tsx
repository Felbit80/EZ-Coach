import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Team } from '../types';
import { COLORS, SPORTS } from '../config/sports';

interface TeamCardProps {
  team: Team;
  onPress: () => void;
  selected?: boolean;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onPress, selected }) => {
  const sport = SPORTS[team.sport];

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.emoji}>{sport.emoji}</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{team.name}</Text>
          <Text style={styles.sport}>{sport.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.border
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  emoji: {
    fontSize: 36,
    marginRight: 12
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2
  },
  sport: {
    fontSize: 14,
    color: COLORS.textSecondary
  }
});
