import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from "react-native";
import { useTeam } from "../contexts/TeamContext";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../config/supabase";
import { Event, EventType } from "../types";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { COLORS } from "../config/sports";
import { SafeAreaView } from "react-native-safe-area-context";
import { EditEventModal } from "../components/EditEventModal";
import * as Font from "expo-font";

const NOME_FONTE = "BeVietnamSemibold";

export const CalendarScreen = () => {
  const { currentTeam, updateEvent, deleteEvent } = useTeam();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<EventType>("training");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);

  const loadEvents = async () => {
    if (!currentTeam) {
      console.log("❌ loadEvents: Nenhum time selecionado");
      return;
    }

    console.log("🔄 loadEvents: Carregando eventos para o time:", currentTeam.id);

    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("team_id", currentTeam.id)
        .order("start_date", { ascending: true });

      if (error) {
        console.log("❌ loadEvents: Erro do Supabase:", error);
        throw error;
      }

      console.log("✅ loadEvents: Eventos carregados:", data?.length || 0);
      setEvents(data || []);
    } catch (error) {
      console.error("💥 loadEvents: Erro geral:", error);
    }
  };

  const handleCreateEvent = async () => {
    console.log("🎯 [1] Iniciando criação de evento");

    if (!title.trim() || !currentTeam) {
      console.log("❌ [2] Erro: Título ou time não preenchido");
      Alert.alert("Erro", "Preencha o título do evento");
      return;
    }

    if (!user) {
      console.log("❌ [3] Erro: Usuário não autenticado");
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    console.log("✅ [4] Dados válidos:", {
      title: title.trim(),
      teamId: currentTeam.id,
      userId: user.id,
      eventType,
    });

    try {
      setLoading(true);
      console.log("🔄 [5] Loading iniciado");

      const now = new Date();
      const endDate = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      console.log("📅 [6] Datas criadas:", {
        start: now.toISOString(),
        end: endDate.toISOString(),
      });

      const eventData = {
        team_id: currentTeam.id,
        title: title.trim(),
        description: description.trim() || null,
        type: eventType,
        location: location.trim() || null,
        start_date: now.toISOString(),
        end_date: endDate.toISOString(),
        created_by: user.id,
      };

      console.log("📤 [7] Dados do evento para inserção:", eventData);

      const { data, error } = await supabase.from("events").insert(eventData).select();

      console.log("📥 [8] Resposta do Supabase:", { data, error });

      if (error) {
        console.log("❌ [9] Erro do Supabase:", error);
        throw error;
      }

      console.log("✅ [10] Evento criado com sucesso:", data);

      setShowCreateModal(false);
      setTitle("");
      setDescription("");
      setLocation("");

      console.log("🔄 [11] Recarregando eventos...");
      await loadEvents();

      Alert.alert("Sucesso", "Evento criado com sucesso!");
      console.log("🎉 [12] Processo finalizado com sucesso");
    } catch (error: any) {
      console.log("💥 [13] Erro capturado no catch:", error);
      console.log("🔍 [14] Detalhes do erro:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      Alert.alert("Erro", error.message || "Erro ao criar evento");
    } finally {
      console.log("🏁 [15] Finally executado - loading desativado");
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔍 useEffect: currentTeam mudou:", currentTeam?.id);
    if (currentTeam) {
      loadEvents();
    } else {
      console.log("🔍 useEffect: Nenhum time selecionado");
      setEvents([]);
    }
  }, [currentTeam]);
  
  useEffect(() => {
    Font.loadAsync({ [NOME_FONTE]: require("../../assets/BeVietnamPro-SemiBold.ttf") }).then(() =>
      setFontLoaded(true)
    );
  }, []);

  if (!fontLoaded) return null;

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case "training":
        return "🏋️";
      case "friendly":
        return "🤝";
      case "championship":
        return "🏆";
      case "meeting":
        return "👥";
      default:
        return "📅";
    }
  };

  const getEventTypeName = (type: EventType) => {
    switch (type) {
      case "training":
        return "Treino";
      case "friendly":
        return "Amistoso";
      case "championship":
        return "Campeonato";
      case "meeting":
        return "Reunião";
      default:
        return "Evento";
    }
  };

  if (!currentTeam) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, styles.BeVietnamPro]}>Selecione um time para ver o calendário</Text>
      </View>
    );
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEditEventModal(true);
  };

  const handleUpdateEvent = async (eventId: string, updates: Partial<Event>) => {
    await updateEvent(eventId, updates);
    await loadEvents();
  };

  const handleDeleteEvent = async (eventId: string) => {
    await deleteEvent(eventId);
    await loadEvents();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, styles.BeVietnamPro]}>Calendário</Text>
          <TouchableOpacity style={styles.createButton} onPress={() => setShowCreateModal(true)}>
            <Text style={[styles.createButtonText, styles.BeVietnamPro]}>+ Novo Evento</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {events.length > 0 ? (
            events.map((event) => (
              <TouchableOpacity key={event.id} style={styles.eventCard} onPress={() => handleEditEvent(event)} activeOpacity={0.7}>
                <View style={styles.eventHeader}>
                  <Text style={[styles.eventIcon, styles.BeVietnamPro]}>{getEventIcon(event.type)}</Text>
                  <View style={styles.eventInfo}>
                    <Text style={[styles.eventTitle, styles.BeVietnamPro]}>{event.title}</Text>
                    <Text style={[styles.eventType, styles.BeVietnamPro]}>{getEventTypeName(event.type)}</Text>
                  </View>

                  {/* Botão de editar (ícone) */}
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditEvent(event)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.editButtonText}>✏️</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.eventDate}>
                  {new Date(event.start_date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>

                {event.location && <Text style={styles.eventLocation}>📍 {event.location}</Text>}
                {event.description && <Text style={[styles.eventDescription, styles.BeVietnamPro]}>{event.description}</Text>}

                <Text style={[styles.editHint, styles.BeVietnamPro]}>Toque para editar →</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, styles.BeVietnamPro]}>Nenhum evento agendado</Text>
              <Button title="Criar Primeiro Evento" onPress={() => setShowCreateModal(true)} />
            </View>
          )}
        </ScrollView>

        {/* Create Event Modal */}
        <Modal visible={showCreateModal} animationType="slide" transparent onRequestClose={() => setShowCreateModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, styles.BeVietnamPro]}>Novo Evento</Text>

              <Input label="Título" value={title} onChangeText={setTitle} placeholder="Nome do evento" />

              <Text style={[styles.label, styles.BeVietnamPro]}>Tipo de Evento</Text>
              <View style={styles.eventTypes}>
                {(["training", "friendly", "championship", "meeting"] as EventType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeOption, eventType === type && styles.typeOptionSelected]}
                    onPress={() => setEventType(type)}
                  >
                    <Text style={styles.typeEmoji}>{getEventIcon(type)}</Text>
                    <Text style={[styles.typeText, styles.BeVietnamPro]}>{getEventTypeName(type)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Input label="Local (opcional)" value={location} onChangeText={setLocation} placeholder="Local do evento" />

              <Input
                label="Descrição (opcional)"
                value={description}
                onChangeText={setDescription}
                placeholder="Detalhes do evento"
                multiline
              />

              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setShowCreateModal(false)} variant="outline" fullWidth />
                <Button title="Criar" onPress={handleCreateEvent} loading={loading} fullWidth />
              </View>
            </View>
          </View>
        </Modal>

        <EditEventModal
          visible={showEditEventModal}
          event={selectedEvent}
          onSave={handleUpdateEvent}
          onDelete={handleDeleteEvent}
          onClose={() => {
            setShowEditEventModal(false);
            setSelectedEvent(null);
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
  eventCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  eventIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  eventType: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  eventDate: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
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
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "90%",
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
  eventTypes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  typeOption: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  typeEmoji: {
    fontSize: 20,
  },
  typeText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "column",
    gap: 12,
    marginTop: 16,
  },
  editButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: `${COLORS.primary}15`,
  },
  editButtonText: {
    fontSize: 16,
  },
  editHint: {
    fontSize: 10,
    color: COLORS.textSecondary,
    opacity: 0.7,
    marginTop: 8,
    textAlign: "right",
  },
  BeVietnamPro: {
    fontFamily: NOME_FONTE
  }
});
