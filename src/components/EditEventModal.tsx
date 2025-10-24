import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Button } from "./Button";
import { Input } from "./Input";
import { COLORS } from "../config/sports";
import { Event, EventType } from "../types";

interface EditEventModalProps {
  visible: boolean;
  event: Event | null;
  onSave: (eventId: string, updates: Partial<Event>) => Promise<void>;
  onDelete: (eventId: string) => Promise<void>;
  onClose: () => void;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({ visible, event, onSave, onDelete, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<EventType>("training");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      setEventType(event.type);
      setLocation(event.location || "");
    }
  }, [event]);

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

  const handleSave = async () => {
    if (!event) return;

    if (!title.trim()) {
      Alert.alert("Erro", "Preencha o título do evento");
      return;
    }

    try {
      setLoading(true);
      const updates: Partial<Event> = {
        title: title.trim(),
        description: description.trim() || undefined,
        type: eventType,
        location: location.trim() || undefined,
      };

      await onSave(event.id, updates);
      onClose();
      Alert.alert("Sucesso", "Evento atualizado com sucesso!");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao atualizar evento");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    Alert.alert("Excluir Evento", `Tem certeza que deseja excluir o evento "${event.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await onDelete(event.id);
            onClose();
            Alert.alert("Sucesso", "Evento excluído!");
          } catch (error: any) {
            Alert.alert("Erro", error.message || "Erro ao excluir evento");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Evento</Text>

          <Input label="Título" value={title} onChangeText={setTitle} placeholder="Nome do evento" />

          <Text style={styles.label}>Tipo de Evento</Text>
          <View style={styles.eventTypes}>
            {(["training", "friendly", "championship", "meeting"] as EventType[]).map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.typeOption, eventType === type && styles.typeOptionSelected]}
                onPress={() => setEventType(type)}
              >
                <Text style={styles.typeEmoji}>{getEventIcon(type)}</Text>
                <Text style={styles.typeText}>{getEventTypeName(type)}</Text>
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
            <View style={styles.actionButtons}>
              <Button title="Excluir Evento" onPress={handleDelete} loading={loading} fullWidth />
            </View>

            <View style={styles.confirmButtons}>
              <Button title="Cancelar" onPress={onClose} variant="outline" fullWidth />
              <Button title="Salvar Alterações" onPress={handleSave} loading={loading} fullWidth />
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
    gap: 12,
    marginTop: 16,
  },
  actionButtons: {
    marginBottom: 8,
  },
  confirmButtons: {
    flexDirection: "row",
    gap: 12,
  },
});
