import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../config/sports';

interface PlayerMarkerProps {
  number: number;
  position: string;
  size?: number;
}

export const PlayerMarker: React.FC<PlayerMarkerProps> = ({ number, position, size = 50 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.circle}>
        <Text style={styles.number}>{number}</Text>
      </View>
      <Text style={styles.position} numberOfLines={1}>{position}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  number: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  position: {
    fontSize: 10,
    color: COLORS.text,
    marginTop: 2,
    textAlign: 'center'
  }
});
