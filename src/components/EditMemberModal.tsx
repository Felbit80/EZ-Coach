import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Button } from "./Button";
import { Input } from "./Input";
import { COLORS, SPORTS } from "../config/sports";
import { UserRole, TeamMember } from "../types";

interface User {
  name: string;
  email: string;
}

interface TeamMemberWithUser extends TeamMember {
  user?: User;
}

interface EditMemberModalProps {
  visible: boolean;
  member: TeamMemberWithUser | null;
  teamSport: string;
  onSave: (memberId: string, updates: Partial<TeamMember>) => Promise<void>;
  onRemove: (memberId: string) => Promise<void>;
  onClose: () => void;
}

const SPORT_POSITIONS: Record<string, string[]> = {
  volleyball: ["Ponteiro", "Oposto", "Levantador", "Central", "Líbero"],
  basketball: ["Armador", "Ala-armador", "Ala", "Ala-pivô", "Pivô"],
  handball: ["Goleiro", "Armador Central", "Meias", "Pontas", "Pivô"],
  futsal: ["Goleiro", "Fixo", "Ala", "Pivô"],
  football: ["Goleiro", "Lateral", "Zagueiro", "Volante", "Meia", "Atacante"],
};

export const EditMemberModal: React.FC<EditMemberModalProps> = ({ visible, member, teamSport, onSave, onRemove, onClose }) => {
  const [role, setRole] = useState<UserRole>("athlete");
  const [position, setPosition] = useState("");
  const [jerseyNumber, setJerseyNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setRole(member.role);
      setPosition(member.position || "");
      setJerseyNumber(member.jersey_number?.toString() || "");
    }
  }, [member]);

  const handleSave = async () => {
    if (!member) return;

    try {
      setLoading(true);
      const updates: Partial<TeamMember> = {
        role,
        position: position || undefined,
        jersey_number: jerseyNumber ? parseInt(jerseyNumber) : undefined,
      };

      await onSave(member.id, updates);
      onClose();
      Alert.alert("Sucesso", "Membro atualizado com sucesso!");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao atualizar membro");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!member) return;

    Alert.alert("Remover Membro", `Tem certeza que deseja remover ${member.user?.name} do time?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await onRemove(member.id);
            onClose();
            Alert.alert("Sucesso", "Membro removido do time!");
          } catch (error: any) {
            Alert.alert("Erro", error.message || "Erro ao remover membro");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const positions = SPORT_POSITIONS[teamSport] || [];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Membro</Text>

          {member?.user && (
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.user.name}</Text>
            </View>
          )}

          <Text style={styles.label}>Função no Time</Text>
          <View style={styles.roleOptions}>
            {(["coach", "captain", "athlete"] as UserRole[]).map((r) => (
              <TouchableOpacity key={r} style={[styles.roleOption, role === r && styles.roleOptionSelected]} onPress={() => setRole(r)}>
                <Text style={styles.roleText}>
                  {r === "coach" && "👨‍🏫 Treinador"}
                  {r === "captain" && "👑 Capitão"}
                  {r === "athlete" && "🏃 Atleta"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Posição</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.positionsList}>
            {positions.map((pos) => (
              <TouchableOpacity
                key={pos}
                style={[styles.positionOption, position === pos && styles.positionOptionSelected]}
                onPress={() => setPosition(pos)}
              >
                <Text style={styles.positionText}>{pos}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Input label="Número da Camisa" value={jerseyNumber} onChangeText={setJerseyNumber} placeholder="Ex: 10" keyboardType="numeric" />

          <View style={styles.modalButtons}>
            <View style={styles.actionButtons}>
              <Button title="Remover do Time" onPress={handleRemove} loading={loading} fullWidth />
            </View>

            <View style={styles.confirmButtons}>
              <Button title="Cancelar" onPress={onClose} variant="outline" fullWidth />
              <Button title="Salvar" onPress={handleSave} loading={loading} fullWidth />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 20,
    textAlign: "center",
  },
  memberInfo: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  memberEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  roleOptions: {
    marginBottom: 20,
  },
  roleOption: {
    backgroundColor: COLORS.background,
    padding: 8,
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
  positionsList: {
    marginBottom: 20,
  },
  positionOption: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  positionOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  positionText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  modalButtons: {
    gap: 12,
    flexDirection: "column",
  },
  actionButtons: {
    marginBottom: 8,
  },
  confirmButtons: {
    flexDirection: "column",
    gap: 12,
  },
});
