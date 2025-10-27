import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from "react-native";
import { useTeam } from "../contexts/TeamContext";
import { supabase } from "../config/supabase";
import { Formation, Player } from "../types";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { PlayerMarker } from "../components/PlayerMarker";
import { COLORS, SPORTS } from "../config/sports";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { DraggablePlayer } from "../components/DraggablePlayer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Font from "expo-font";

const NOME_FONTE = "BeVietnamSemibold";

export const TacticalScreen = () => {
  const { currentTeam } = useTeam();
  const { user } = useAuth();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [currentFormation, setCurrentFormation] = useState<Formation | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [formationName, setFormationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formationToDelete, setFormationToDelete] = useState<Formation | null>(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  const loadFormations = async () => {
    if (!currentTeam) return;

    try {
      const { data, error } = await supabase
        .from("formations")
        .select("*")
        .eq("team_id", currentTeam.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFormations(data || []);
    } catch (error) {
      console.error("Error loading formations:", error);
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
        y: 100 + Math.floor(i / 3) * 100,
      });
    }

    setCurrentFormation({
      id: "new",
      team_id: currentTeam.id,
      name: "Nova Formação",
      sport: currentTeam.sport,
      players,
      created_by: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  };

  const handleSaveFormation = async () => {
    if (!currentFormation || !currentTeam || !user) return;

    if (!formationName.trim()) {
      Alert.alert("Erro", "Digite um nome para a formação");
      return;
    }

    try {
      setLoading(true);

      if (currentFormation.id === "new") {
        const { data, error } = await supabase
          .from("formations")
          .insert({
            team_id: currentTeam.id,
            name: formationName.trim(),
            sport: currentTeam.sport,
            players: currentFormation.players,
            created_by: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        setCurrentFormation(data);
      } else {
        const { error } = await supabase
          .from("formations")
          .update({
            name: formationName.trim(),
            players: currentFormation.players,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentFormation.id);

        if (error) throw error;
      }

      setShowSaveModal(false);
      setFormationName("");
      await loadFormations();

      Alert.alert("Sucesso", "Formação salva com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            setCurrentFormation(null);
          },
        },
      ]);
    } catch (error: any) {
      console.error("Erro ao salvar formação:", error);
      Alert.alert("Erro", error.message || "Erro ao salvar formação");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFormation = async () => {
    if (!formationToDelete) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("formations").delete().eq("id", formationToDelete.id);

      if (error) throw error;

      setShowDeleteConfirm(false);
      setFormationToDelete(null);

      if (currentFormation?.id === formationToDelete.id) {
        setCurrentFormation(null);
      }

      await loadFormations();
      Alert.alert("Sucesso", "Formação excluída com sucesso!");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao excluir formação");
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicateFormation = async (formation: Formation) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("formations")
        .insert({
          team_id: formation.team_id,
          name: `${formation.name} (Cópia)`,
          sport: formation.sport,
          players: formation.players,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      await loadFormations();
      Alert.alert("Sucesso", "Formação duplicada com sucesso!");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao duplicar formação");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentTeam) {
      loadFormations();
    }
  }, [currentTeam]);

  useEffect(() => {
    Font.loadAsync({ [NOME_FONTE]: require("../../assets/BeVietnamPro-SemiBold.ttf") }).then(() => setFontLoaded(true));
  }, []);

  if (!fontLoaded) return null;

  const openDeleteConfirm = (formation: Formation) => {
    setFormationToDelete(formation);
    setShowDeleteConfirm(true);
  };

  const handlePlayerDrag = (playerId: string, x: number, y: number) => {
    if (!currentFormation) return;

    const updatedPlayers = currentFormation.players.map((player) => (player.id === playerId ? { ...player, x, y } : player));

    setCurrentFormation({
      ...currentFormation,
      players: updatedPlayers,
    });
  };

  if (!currentTeam) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, styles.BeVietnamPro]}>Selecione um time para acessar o quadro tático</Text>
      </View>
    );
  }

  const sport = SPORTS[currentTeam.sport];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, styles.BeVietnamPro]}>Quadro Tático </Text>
          <TouchableOpacity style={styles.createButton} onPress={createDefaultFormation}>
            <Text style={[styles.createButtonText, styles.BeVietnamPro]}>+ Nova Formação</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {currentFormation ? (
            <View style={styles.courtContainer}>
              <View style={styles.courtHeader}>
                <View style={styles.courtTitleContainer}>
                  <Text style={[styles.courtTitle, styles.BeVietnamPro]}>
                    {sport.name} - {currentFormation.name}
                  </Text>
                  <Text style={[styles.courtSubtitle, styles.BeVietnamPro]}>{currentFormation.players.length} jogadores</Text>
                </View>

                <View style={styles.courtActions}>
                  <TouchableOpacity style={styles.backButton} onPress={() => setCurrentFormation(null)}>
                    <Text style={[styles.backButtonText, styles.BeVietnamPro]}>← Voltar</Text>
                  </TouchableOpacity>

                  <Button
                    title="Salvar"
                    onPress={() => {
                      setFormationName(currentFormation.name);
                      setShowSaveModal(true);
                    }}
                  />
                </View>
              </View>

              <View
                style={[
                  styles.court,
                  {
                    width: sport.courtDimensions.width,
                    height: sport.courtDimensions.height,
                  },
                ]}
              >
                {/* Court background based on sport */}
                {currentTeam.sport === "volleyball" && <View style={styles.volleyballNet} />}

                {/* Players - AGORA ARRASTÁVEIS */}
                {currentFormation.players.map((player) => (
                  <DraggablePlayer
                    key={player.id}
                    player={player}
                    onDrag={handlePlayerDrag}
                    courtWidth={sport.courtDimensions.width}
                    courtHeight={sport.courtDimensions.height}
                  />
                ))}
              </View>

              <View style={styles.instructions}>
                <Text style={[styles.instructionsText, styles.BeVietnamPro]}>
                  💡 Dica: Em breve você poderá arrastar os jogadores para posicioná-los
                </Text>
              </View>
            </View>
          ) : (
            <>
              <Text style={[styles.sectionTitle, styles.BeVietnamPro]}>Formações Salvas</Text>
              {formations.map((formation) => (
                <View key={formation.id} style={styles.formationCard}>
                  <TouchableOpacity style={styles.formationContent} onPress={() => setCurrentFormation(formation)}>
                    <Text style={[styles.formationName, styles.BeVietnamPro]}>{formation.name}</Text>
                    <Text style={[styles.formationInfo, styles.BeVietnamPro]}>
                      {formation.players.length} jogadores • {formation.sport}
                    </Text>
                    <Text style={[styles.formationDate, styles.BeVietnamPro]}>
                      Criada em {new Date(formation.created_at).toLocaleDateString("pt-BR")}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.formationActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setCurrentFormation(formation);
                        setFormationName(formation.name);
                        setShowSaveModal(true);
                      }}
                    >
                      <Text style={styles.actionButtonText}>✏️</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={() => handleDuplicateFormation(formation)}>
                      <Text style={styles.actionButtonText}>📋</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, styles.deleteAction]} onPress={() => openDeleteConfirm(formation)}>
                      <Text style={styles.actionButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {formations.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={[styles.emptyText, styles.BeVietnamPro]}>Nenhuma formação salva</Text>
                  <Button title="Criar Primeira Formação" onPress={createDefaultFormation} />
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Save Formation Modal */}
        <Modal visible={showSaveModal} animationType="slide" transparent onRequestClose={() => setShowSaveModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, styles.BeVietnamPro]}>Salvar Formação</Text>

              <Input label="Nome da Formação" value={formationName} onChangeText={setFormationName} placeholder="Ex: Formação 4-2" />

              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setShowSaveModal(false)} variant="outline" fullWidth />
                <Button title="Salvar" onPress={handleSaveFormation} loading={loading} fullWidth />
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={showDeleteConfirm} animationType="fade" transparent onRequestClose={() => setShowDeleteConfirm(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, styles.deleteModal]}>
              <Text style={[styles.deleteTitle, styles.BeVietnamPro]}>Excluir Formação</Text>
              <Text style={[styles.deleteText, styles.BeVietnamPro]}>
                Tem certeza que deseja excluir a formação "{formationToDelete?.name}"? Esta ação não pode ser desfeita.
              </Text>

              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setShowDeleteConfirm(false)} variant="outline" fullWidth />
                <Button title="Excluir Formação" onPress={handleDeleteFormation} loading={loading} fullWidth />
              </View>
            </View>
          </View>
        </Modal>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  courtContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 30,
  },
  courtHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  courtTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  court: {
    backgroundColor: "#8B4513",
    borderRadius: 8,
    position: "relative",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  volleyballNet: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "#FFFFFF",
    zIndex: 0,
  },
  playerContainer: {
    position: "absolute",
    zIndex: 1,
  },
  instructions: {
    marginTop: 16,
    padding: 12,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 8,
    width: "100%",
  },
  instructionsText: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  formationName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  formationInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
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
  modalButtons: {
    flexDirection: "column",
    gap: 12,
  },
  formationDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    opacity: 0.7,
  },
  formationActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: `${COLORS.primary}15`,
  },
  deleteAction: {
    backgroundColor: `${COLORS.error}15`,
  },
  actionButtonText: {
    fontSize: 16,
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
  courtTitleContainer: {
    flex: 1,
  },
  courtSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  courtActions: {
    alignItems: "flex-end",
    gap: 8,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backButtonText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  formationCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formationContent: {
    flex: 1,
  },
  BeVietnamPro: {
    fontFamily: NOME_FONTE,
  },
});
