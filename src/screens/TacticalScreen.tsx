import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { useTeam } from '../contexts/TeamContext';
import { supabase } from '../config/supabase';
import { Formation, Player } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PlayerMarker } from '../components/PlayerMarker';
import { COLORS, SPORTS } from '../config/sports';

export const TacticalScreen = () => {
  const { currentTeam } = useTeam();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [currentFormation, setCurrentFormation] = useState<Formation | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [formationName, setFormationName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentTeam) {
      loadFormations();
    }
  }, [currentTeam]);

  const loadFormations = async () => {
    if (!currentTeam) return;

    try {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .eq('team_id', currentTeam.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFormations(data || []);
    } catch (error) {
      console.error('Error loading formations:', error);
    }
  };

  const createDefaultFormation = () => {
    if (!currentTeam) return;

    const sport = SPORTS[currentTeam.sport];
    const players: Player[] = [];

    for (let i = 0; i < sport.playersCount; i++) {
      players.push({
        id: `player-${i}`,
        name: `Jogador ${i + 1}`,
        position: sport.positions[i % sport.positions.length],
        jersey_number: i + 1,
        x: 50 + (i % 3) * 30,
        y: 100 + Math.floor(i / 3) * 100
      });
    }

    setCurrentFormation({
      id: 'new',
      team_id: currentTeam.id,
      name: 'Nova Formação',
      sport: currentTeam.sport,
      players,
      created_by: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  };

  const handleSaveFormation = async () => {
    if (!currentFormation || !currentTeam) return;

    if (!formationName.trim()) {
      Alert.alert('Erro', 'Digite um nome para a formação');
      return;
    }

    try {
      setLoading(true);
      
      if (currentFormation.id === 'new') {
        const { error } = await supabase
          .from('formations')
          .insert({
            team_id: currentTeam.id,
            name: formationName.trim(),
            sport: currentTeam.sport,
            players: currentFormation.players
          });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('formations')
          .update({
            name: formationName.trim(),
            players: currentFormation.players
          })
          .eq('id', currentFormation.id);

        if (error) throw error;
      }

      setShowSaveModal(false);
      setFormationName('');
      await loadFormations();
      Alert.alert('Sucesso', 'Formação salva com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao salvar formação');
    } finally {
      setLoading(false);
    }
  };

  if (!currentTeam) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Selecione um time para acessar o quadro tático</Text>
      </View>
    );
  }

  const sport = SPORTS[currentTeam.sport];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quadro Tático</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={createDefaultFormation}
        >
          <Text style={styles.createButtonText}>+ Nova Formação</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {currentFormation ? (
          <View style={styles.courtContainer}>
            <View style={styles.courtHeader}>
              <Text style={styles.courtTitle}>{sport.name} - {currentFormation.name}</Text>
              <Button
                title="Salvar"
                onPress={() => {
                  setFormationName(currentFormation.name);
                  setShowSaveModal(true);
                }}
              />
            </View>

            <View style={[styles.court, {
              width: sport.courtDimensions.width,
              height: sport.courtDimensions.height
            }]}>
              {/* Court background based on sport */}
              {currentTeam.sport === 'volleyball' && (
                <View style={styles.volleyballNet} />
              )}

              {/* Players */}
              {currentFormation.players.map((player) => (
                <View
                  key={player.id}
                  style={[
                    styles.playerContainer,
                    { left: player.x, top: player.y }
                  ]}
                >
                  <PlayerMarker
                    number={player.jersey_number}
                    position={player.position}
                  />
                </View>
              ))}
            </View>

            <View style={styles.instructions}>
              <Text style={styles.instructionsText}>
                💡 Dica: Em breve você poderá arrastar os jogadores para posicioná-los
              </Text>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Formações Salvas</Text>
            {formations.map((formation) => (
              <TouchableOpacity
                key={formation.id}
                style={styles.formationCard}
                onPress={() => setCurrentFormation(formation)}
              >
                <Text style={styles.formationName}>{formation.name}</Text>
                <Text style={styles.formationInfo}>
                  {formation.players.length} jogadores
                </Text>
              </TouchableOpacity>
            ))}

            {formations.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Nenhuma formação salva</Text>
                <Button
                  title="Criar Primeira Formação"
                  onPress={createDefaultFormation}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Save Formation Modal */}
      <Modal
        visible={showSaveModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Salvar Formação</Text>
            
            <Input
              label="Nome da Formação"
              value={formationName}
              onChangeText={setFormationName}
              placeholder="Ex: Formação 4-2"
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setShowSaveModal(false)}
                variant="outline"
                fullWidth
              />
              <Button
                title="Salvar"
                onPress={handleSaveFormation}
                loading={loading}
                fullWidth
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  content: {
    flex: 1,
    padding: 16
  },
  courtContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center'
  },
  courtHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16
  },
  courtTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text
  },
  court: {
    backgroundColor: '#8B4513',
    borderRadius: 8,
    position: 'relative',
    borderWidth: 4,
    borderColor: '#FFFFFF'
  },
  volleyballNet: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#FFFFFF',
    zIndex: 0
  },
  playerContainer: {
    position: 'absolute',
    zIndex: 1
  },
  instructions: {
    marginTop: 16,
    padding: 12,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 8,
    width: '100%'
  },
  instructionsText: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12
  },
  formationCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8
  },
  formationName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4
  },
  formationInfo: {
    fontSize: 14,
    color: COLORS.textSecondary
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  emptyState: {
    padding: 40,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 24
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12
  }
});
