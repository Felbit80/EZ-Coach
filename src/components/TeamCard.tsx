import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Team } from "../types";
import { COLORS, SPORTS } from "../config/sports";

interface TeamCardProps {
  team: Team;
  selected?: boolean;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, selected = false, onPress, onEdit, onDelete, showActions = false }) => {
  const sport = SPORTS[team.sport];

  const handleDeletePress = () => {
    Alert.alert("Confirmar Exclusão", `Tem certeza que deseja excluir o time "${team.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  };

  return (
    <TouchableOpacity style={[styles.container, selected && styles.selectedContainer]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.teamInfo}>
            <Text style={styles.emoji}>{sport.emoji}</Text>
            <View style={styles.textContainer}>
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.sportName}>{sport.name}</Text>
            </View>
          </View>

          {showActions && (
            <View style={styles.actions}>
              <TouchableOpacity style={styles.editButton} onPress={onEdit} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.editButtonText}>✏️</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeletePress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.details}>
          <Text style={styles.detailText}>
            👥 {sport.playersCount} jogadores • {sport.positions.length} posições
          </Text>
          <Text style={styles.createdAt}>Criado em {new Date(team.created_at).toLocaleDateString("pt-BR")}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedContainer: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}08`,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  teamInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  sportName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: `${COLORS.primary}15`,
  },
  editButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: `${COLORS.error}15`,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  createdAt: {
    fontSize: 12,
    color: COLORS.textSecondary,
    opacity: 0.7,
  },
});
