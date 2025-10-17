import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { useTeam } from '../contexts/TeamContext';
import { useAuth } from '../contexts/AuthContext';
import { TeamCard } from '../components/TeamCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { SportCard } from '../components/SportCard';
import { COLORS, SPORTS, PLAN_LIMITS } from '../config/sports';
import { SportType, UserRole } from '../types';

export const TeamsScreen = () => {
  const { user } = useAuth();
  const { teams, currentTeam, selectTeam, createTeam, inviteMember, teamMembers } = useTeam();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedSport, setSelectedSport] = useState<SportType>('volleyball');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('athlete');
  const [loading, setLoading] = useState(false);

  const canCreateTeam = () => {
    if (!user) return false;
    const limit = PLAN_LIMITS[user.subscription_plan].teams;
    return teams.length < limit;
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      Alert.alert('Erro', 'Digite um nome para o time');
      return;
    }

    if (!canCreateTeam()) {
      Alert.alert(
        'Limite atingido',
        'Você atingiu o limite de times do seu plano. Faça upgrade para criar mais times.'
      );
      return;
    }

    try {
      setLoading(true);
      await createTeam({
        name: newTeamName.trim(),
        sport: selectedSport
      });
      setShowCreateModal(false);
      setNewTeamName('');
      Alert.alert('Sucesso', 'Time criado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao criar time');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      Alert.alert('Erro', 'Digite um email');
      return;
    }

    if (!currentTeam) {
      Alert.alert('Erro', 'Selecione um time primeiro');
      return;
    }

    try {
      setLoading(true);
      await inviteMember(currentTeam.id, inviteEmail.trim(), inviteRole);
      setShowInviteModal(false);
      setInviteEmail('');
      Alert.alert('Sucesso', 'Membro convidado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao convidar membro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Meus Times</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Text style={styles.addButtonText}>+ Novo Time</Text>
          </TouchableOpacity>
        </View>

        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            selected={currentTeam?.id === team.id}
            onPress={() => selectTeam(team)}
          />
        ))}

        {teams.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Você ainda não tem times</Text>
            <Button
              title="Criar Primeiro Time"
              onPress={() => setShowCreateModal(true)}
            />
          </View>
        )}

        {currentTeam && (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Membros</Text>
                <TouchableOpacity onPress={() => setShowInviteModal(true)}>
                  <Text style={styles.inviteButton}>+ Convidar</Text>
                </TouchableOpacity>
              </View>

              {teamMembers.map((member) => (
                <View key={member.id} style={styles.memberCard}>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>Membro {member.user_id.slice(0, 8)}</Text>
                    <Text style={styles.memberRole}>
                      {member.role === 'coach' && '👨‍🏫 Treinador'}
                      {member.role === 'captain' && '👑 Capitão'}
                      {member.role === 'athlete' && '🏃 Atleta'}
                    </Text>
                  </View>
                  {member.position && (
                    <Text style={styles.memberPosition}>{member.position}</Text>
                  )}
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Create Team Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Criar Novo Time</Text>
            
            <Input
              label="Nome do Time"
              value={newTeamName}
              onChangeText={setNewTeamName}
              placeholder="Ex: Equipe Campeã"
            />

            <Text style={styles.label}>Selecione o Esporte</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportsList}>
              {Object.values(SPORTS).map((sport) => (
                <TouchableOpacity
                  key={sport.id}
                  style={[
                    styles.sportOption,
                    selectedSport === sport.id && styles.sportOptionSelected
                  ]}
                  onPress={() => setSelectedSport(sport.id)}
                >
                  <Text style={styles.sportEmoji}>{sport.emoji}</Text>
                  <Text style={styles.sportName}>{sport.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setShowCreateModal(false)}
                variant="outline"
                fullWidth
              />
              <Button
                title="Criar"
                onPress={handleCreateTeam}
                loading={loading}
                fullWidth
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Invite Member Modal */}
      <Modal
        visible={showInviteModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowInviteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Convidar Membro</Text>
            
            <Input
              label="Email"
              value={inviteEmail}
              onChangeText={setInviteEmail}
              placeholder="email@exemplo.com"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Função</Text>
            <View style={styles.roleOptions}>
              {(['athlete', 'captain', 'coach'] as UserRole[]).map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleOption,
                    inviteRole === role && styles.roleOptionSelected
                  ]}
                  onPress={() => setInviteRole(role)}
                >
                  <Text style={styles.roleText}>
                    {role === 'coach' && '👨‍🏫 Treinador'}
                    {role === 'captain' && '👑 Capitão'}
                    {role === 'athlete' && '🏃 Atleta'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setShowInviteModal(false)}
                variant="outline"
                fullWidth
              />
              <Button
                title="Convidar"
                onPress={handleInviteMember}
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
  content: {
    flex: 1,
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  section: {
    marginTop: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text
  },
  inviteButton: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 16
  },
  memberCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  memberInfo: {
    flex: 1
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4
  },
  memberRole: {
    fontSize: 14,
    color: COLORS.textSecondary
  },
  memberPosition: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600'
  },
  emptyState: {
    padding: 40,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8
  },
  sportsList: {
    marginBottom: 24
  },
  sportOption: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    minWidth: 80
  },
  sportOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`
  },
  sportEmoji: {
    fontSize: 32,
    marginBottom: 4
  },
  sportName: {
    fontSize: 12,
    color: COLORS.text
  },
  roleOptions: {
    marginBottom: 24
  },
  roleOption: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: COLORS.border
  },
  roleOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`
  },
  roleText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center'
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12
  }
});
