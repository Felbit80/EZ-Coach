import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Image } from "react-native";
import { useTeam } from "../contexts/TeamContext";
import { useAuth } from "../contexts/AuthContext";
import { TeamCard } from "../components/TeamCard";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { SportCard } from "../components/SportCard";
import { COLORS, SPORTS, PLAN_LIMITS } from "../config/sports";
import { SportType, UserRole } from "../types";
import { SafeAreaView } from "react-native-safe-area-context";
import { EditMemberModal } from "../components/EditMemberModal";
import { TeamMember } from "../types/index";
import { TeamMemberWithUser } from "../contexts/TeamContext";
import * as Font from "expo-font";

const NOME_FONTE = "BeVietnamSemibold";

export const TeamsScreen = () => {
  const { user } = useAuth();
  const { teams, currentTeam, selectTeam, createTeam, updateTeam, deleteTeam, inviteMember, teamMembers } = useTeam();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [newTeamName, setNewTeamName] = useState("");
  const [editTeamName, setEditTeamName] = useState("");
  const [selectedSport, setSelectedSport] = useState<SportType>("volleyball");
  const [editSelectedSport, setEditSelectedSport] = useState<SportType>("volleyball");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("athlete");
  const [loading, setLoading] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMemberWithUser | null>(null);
  const { removeMember, updateMember } = useTeam();
  const [fontLoaded, setFontLoaded] = useState(false);

  const canCreateTeam = () => {
    if (!user) return false;
    const limit = PLAN_LIMITS[user.subscription_plan].teams;
    return teams.length < limit;
  };

  useEffect(() => {
    Font.loadAsync({ [NOME_FONTE]: require("../../assets/BeVietnamPro-SemiBold.ttf") }).then(() =>
      setFontLoaded(true)
    );
  }, []);

  if (!fontLoaded) return null;

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      Alert.alert("Erro", "Digite um nome para o time");
      return;
    }

    if (!canCreateTeam()) {
      Alert.alert("Limite atingido", "Você atingiu o limite de times do seu plano. Faça upgrade para criar mais times.");
      return;
    }

    try {
      setLoading(true);
      await createTeam({
        name: newTeamName.trim(),
        sport: selectedSport,
      });
      setShowCreateModal(false);
      setNewTeamName("");
      Alert.alert("Sucesso", "Time criado com sucesso!");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao criar time");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      Alert.alert("Erro", "Digite um email");
      return;
    }

    if (!currentTeam) {
      Alert.alert("Erro", "Selecione um time primeiro");
      return;
    }

    try {
      setLoading(true);
      await inviteMember(currentTeam.id, inviteEmail.trim(), inviteRole);
      setShowInviteModal(false);
      setInviteEmail("");
      Alert.alert("Sucesso", "Membro convidado com sucesso!");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao convidar membro");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTeam = async () => {
    if (!currentTeam) return;

    if (!editTeamName.trim()) {
      Alert.alert("Erro", "Digite um nome para o time");
      return;
    }

    try {
      setLoading(true);
      await updateTeam(currentTeam.id, {
        name: editTeamName.trim(),
        sport: editSelectedSport,
      });
      setShowEditTeamModal(false);
      Alert.alert("Sucesso", "Time atualizado com sucesso!");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao atualizar time");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!currentTeam) return;

    try {
      setLoading(true);
      await deleteTeam(currentTeam.id);
      setShowDeleteConfirm(false);
      Alert.alert("Sucesso", "Time excluído com sucesso!");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao excluir time");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    if (!currentTeam) return;
    setEditTeamName(currentTeam.name);
    setEditSelectedSport(currentTeam.sport);
    setShowEditTeamModal(true);
  };

  const openDeleteConfirm = () => {
    if (!currentTeam) return;
    setShowDeleteConfirm(true);
  };

  const handleEditMember = (member: TeamMemberWithUser) => {
    setSelectedMember(member);
    setShowEditMemberModal(true);
  };

  const handleSaveMember = async (memberId: string, updates: Partial<TeamMember>) => {
    await updateMember(memberId, updates);
  };

  const handleRemoveMember = async (memberId: string) => {
    await removeMember(memberId);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, styles.BeVietnamPro]}>Meus Times</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowCreateModal(true)}>
              <Text style={[styles.addButtonText, styles.BeVietnamPro]}>+ Novo Time</Text>
            </TouchableOpacity>
          </View>
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              selected={currentTeam?.id === team.id}
              onPress={() => selectTeam(team)}
              onEdit={openEditModal}
              onDelete={openDeleteConfirm}
              showActions={currentTeam?.id === team.id}
            />
          ))}
          {teams.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, styles.BeVietnamPro]}>Você ainda não tem times</Text>
              <Button title="Criar Primeiro Time" onPress={() => setShowCreateModal(true)} />
            </View>
          )}

          {currentTeam && (
            <>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, styles.BeVietnamPro]}>Membros</Text>
                  <TouchableOpacity onPress={() => setShowInviteModal(true)}>
                    <Text style={[styles.inviteButton, styles.BeVietnamPro]}>+ Convidar</Text>
                  </TouchableOpacity>
                </View>

                {teamMembers.map((member) => (
                  <TouchableOpacity key={member.id} style={styles.memberCard} onPress={() => handleEditMember(member)} activeOpacity={0.7}>
                    <View style={styles.memberInfo}>
                      <Text style={[styles.memberName, styles.BeVietnamPro]}>{member.user?.name || `Usuário ${member.user_id.slice(0, 8)}`}</Text>
                      <Text style={[styles.memberEmail, styles.BeVietnamPro]}>{member.user?.email || "Email não disponível"}</Text>
                      <View style={styles.memberDetails}>
                        <Text style={[styles.memberRole, styles.BeVietnamPro]}>
                          {member.role === "coach" && "👨‍🏫 Treinador"}
                          {member.role === "captain" && "👑 Capitão"}
                          {member.role === "athlete" && "🏃 Atleta"}
                        </Text>
                        {member.position && <Text style={[styles.memberPosition, styles.BeVietnamPro]}>• {member.position}</Text>}
                        {member.jersey_number && <Text style={[styles.jerseyNumber, styles.BeVietnamPro]}>• #{member.jersey_number}</Text>}
                      </View>
                    </View>

                    {/* Ícone de edição */}
                    <View style={styles.editIcon}>
                      <Text style={styles.editIconText}>✏️</Text>
                      <Text style={[styles.editHint, styles.BeVietnamPro]}>Editar</Text>
                    </View>
                  </TouchableOpacity>
                ))}

                {teamMembers.length === 0 && (
                  <View style={styles.emptyMembers}>
                    <Text style={[styles.emptyMembersText, styles.BeVietnamPro]}>Nenhum membro no time</Text>
                    <Text style={[styles.emptyMembersSubtext, styles.BeVietnamPro]}>Convide membros para participar</Text>
                  </View>
                )}
              </View>
            </>
          )}
        </ScrollView>

        {/* Create Team Modal */}
        <Modal visible={showCreateModal} animationType="slide" transparent onRequestClose={() => setShowCreateModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, styles.BeVietnamPro]}>Criar Novo Time</Text>

              <Input label="Nome do Time" value={newTeamName} onChangeText={setNewTeamName} placeholder="Ex: Equipe Campeã" />

              <Text style={[styles.label, styles.BeVietnamPro]}>Selecione o Esporte</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportsList}>
                {Object.values(SPORTS).map((sport) => (
                  <TouchableOpacity
                    key={sport.id}
                    style={[styles.sportOption, selectedSport === sport.id && styles.sportOptionSelected]}
                    onPress={() => setSelectedSport(sport.id)}
                  >
                    <Text style={styles.sportEmoji}>{sport.emoji}</Text>
                    <Text style={[styles.sportName, styles.BeVietnamPro]}>{sport.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setShowCreateModal(false)} variant="outline" fullWidth />
                <Button title="Criar" onPress={handleCreateTeam} loading={loading} fullWidth />
              </View>
            </View>
          </View>
        </Modal>

        {/* Invite Member Modal */}
        <Modal visible={showInviteModal} animationType="slide" transparent onRequestClose={() => setShowInviteModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, styles.BeVietnamPro]}>Convidar Membro</Text>

              <Input
                label="Email"
                value={inviteEmail}
                onChangeText={setInviteEmail}
                placeholder="email@exemplo.com"
                keyboardType="email-address"
              />

              <Text style={[styles.label, styles.BeVietnamPro]}>Função</Text>
              <View style={styles.roleOptions}>
                {(["athlete", "captain", "coach"] as UserRole[]).map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[styles.roleOption, inviteRole === role && styles.roleOptionSelected]}
                    onPress={() => setInviteRole(role)}
                  >
                    <Text style={[styles.roleText, styles.BeVietnamPro]}>
                      {role === "coach" && "👨‍🏫 Treinador"}
                      {role === "captain" && "👑 Capitão"}
                      {role === "athlete" && "🏃 Atleta"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setShowInviteModal(false)} variant="outline" fullWidth />
                <Button title="Convidar" onPress={handleInviteMember} loading={loading} fullWidth />
              </View>
            </View>
          </View>
        </Modal>

        {/* 🔥 MODAL DE CONFIRMAÇÃO DE EXCLUSÃO - NOVO */}
        <Modal visible={showDeleteConfirm} animationType="fade" transparent onRequestClose={() => setShowDeleteConfirm(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, styles.deleteModal]}>
              <Text style={[styles.deleteTitle, styles.BeVietnamPro]}>Excluir Time</Text>
              <Text style={[styles.deleteText, styles.BeVietnamPro]}>
                Tem certeza que deseja excluir o time "{currentTeam?.name}"? Esta ação não pode ser desfeita.
              </Text>

              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setShowDeleteConfirm(false)} variant="outline" fullWidth />
                <Button title="Excluir Time" onPress={handleDeleteTeam} loading={loading} fullWidth />
              </View>
            </View>
          </View>
        </Modal>

        {/* 🔥 MODAL DE EDIÇÃO DE TIME - NOVO */}
        <Modal visible={showEditTeamModal} animationType="slide" transparent onRequestClose={() => setShowEditTeamModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, styles.BeVietnamPro]}>Editar Time</Text>

              <Input label="Nome do Time" value={editTeamName} onChangeText={setEditTeamName} placeholder="Ex: Equipe Campeã" />

              <Text style={[styles.label, styles.BeVietnamPro]}>Esporte</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportsList}>
                {Object.values(SPORTS).map((sport) => (
                  <TouchableOpacity
                    key={sport.id}
                    style={[styles.sportOption, editSelectedSport === sport.id && styles.sportOptionSelected]}
                    onPress={() => setEditSelectedSport(sport.id)}
                  >
                    <Text style={styles.sportEmoji}>{sport.emoji}</Text>
                    <Text style={[styles.sportName, styles.BeVietnamPro]}>{sport.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setShowEditTeamModal(false)} variant="outline" fullWidth />
                <Button title="Salvar Alterações" onPress={handleEditTeam} loading={loading} fullWidth />
              </View>
            </View>
          </View>
        </Modal>

        <EditMemberModal
          visible={showEditMemberModal}
          member={selectedMember}
          teamSport={currentTeam?.sport || "volleyball"}
          onSave={handleSaveMember}
          onRemove={handleRemoveMember}
          onClose={() => {
            setShowEditMemberModal(false);
            setSelectedMember(null);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  inviteButton: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  memberCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  memberPosition: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  sportsList: {
    marginBottom: 24,
  },
  sportOption: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.border,
    minWidth: 80,
  },
  sportOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  sportEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  sportName: {
    fontSize: 12,
    color: COLORS.text,
  },
  roleOptions: {
    marginBottom: 24,
  },
  roleOption: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  roleOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  roleText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "column",
    gap: 12,
  },
  memberEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  emptyMembers: {
    padding: 20,
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginTop: 8,
  },
  emptyMembersText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  emptyMembersSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    opacity: 0.7,
  },
  deleteModal: {
    maxWidth: 400,
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.error,
    marginBottom: 16,
    textAlign: "center",
  },
  deleteText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  jerseyNumber: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: "600",
  },
  editIcon: {
    alignItems: "center",
    paddingLeft: 12,
  },
  editIconText: {
    fontSize: 20,
    marginBottom: 4,
  },
  editHint: {
    fontSize: 10,
    color: COLORS.textSecondary,
    opacity: 0.7,
  },
  memberDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  BeVietnamPro: {
    fontFamily: NOME_FONTE
  }
});
