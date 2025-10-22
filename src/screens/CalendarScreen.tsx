import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { useTeam } from '../contexts/TeamContext';
import { supabase } from '../config/supabase';
import { Event, EventType } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { COLORS } from '../config/sports';
import { SafeAreaView } from 'react-native-safe-area-context';

export const CalendarScreen = () => {
  const { currentTeam } = useTeam();
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>('training');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentTeam) {
      loadEvents();
    }
  }, [currentTeam]);

  const loadEvents = async () => {
    if (!currentTeam) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('team_id', currentTeam.id)
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleCreateEvent = async () => {
    if (!title.trim() || !currentTeam) {
      Alert.alert('Erro', 'Preencha o título do evento');
      return;
    }

    try {
      setLoading(true);
      const now = new Date();
      const endDate = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

      const { error } = await supabase
        .from('events')
        .insert({
          team_id: currentTeam.id,
          title: title.trim(),
          description: description.trim() || null,
          type: eventType,
          location: location.trim() || null,
          start_date: now.toISOString(),
          end_date: endDate.toISOString()
        });

      if (error) throw error;

      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      setLocation('');
      await loadEvents();
      Alert.alert('Sucesso', 'Evento criado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao criar evento');
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'training':
        return '🏋️';
      case 'friendly':
        return '🤝';
      case 'championship':
        return '🏆';
      case 'meeting':
        return '👥';
      default:
        return '📅';
    }
  };

  const getEventTypeName = (type: EventType) => {
    switch (type) {
      case 'training':
        return 'Treino';
      case 'friendly':
        return 'Amistoso';
      case 'championship':
        return 'Campeonato';
      case 'meeting':
        return 'Reunião';
      default:
        return 'Evento';
    }
  };

  if (!currentTeam) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Selecione um time para ver o calendário</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendário </Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.createButtonText}>+ Novo Evento</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {events.length > 0 ? (
          events.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventIcon}>{getEventIcon(event.type)}</Text>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventType}>{getEventTypeName(event.type)}</Text>
                </View>
              </View>
              
              <Text style={styles.eventDate}>
                {new Date(event.start_date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
              
              {event.location && (
                <Text style={styles.eventLocation}>📍 {event.location}</Text>
              )}
              
              {event.description && (
                <Text style={styles.eventDescription}>{event.description}</Text>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum evento agendado</Text>
            <Button
              title="Criar Primeiro Evento"
              onPress={() => setShowCreateModal(true)}
            />
          </View>
        )}
      </ScrollView>

      {/* Create Event Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Evento</Text>
            
            <Input
              label="Título"
              value={title}
              onChangeText={setTitle}
              placeholder="Nome do evento"
            />

            <Text style={styles.label}>Tipo de Evento</Text>
            <View style={styles.eventTypes}>
              {(['training', 'friendly', 'championship', 'meeting'] as EventType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeOption,
                    eventType === type && styles.typeOptionSelected
                  ]}
                  onPress={() => setEventType(type)}
                >
                  <Text style={styles.typeEmoji}>{getEventIcon(type)}</Text>
                  <Text style={styles.typeText}>{getEventTypeName(type)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Local (opcional)"
              value={location}
              onChangeText={setLocation}
              placeholder="Local do evento"
            />

            <Input
              label="Descrição (opcional)"
              value={description}
              onChangeText={setDescription}
              placeholder="Detalhes do evento"
              multiline
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setShowCreateModal(false)}
                variant="outline"
                fullWidth
              />
              <Button
                title="Criar"
                onPress={handleCreateEvent}
                loading={loading}
                fullWidth
              />
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
  eventCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  eventIcon: {
    fontSize: 32,
    marginRight: 12
  },
  eventInfo: {
    flex: 1
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2
  },
  eventType: {
    fontSize: 14,
    color: COLORS.textSecondary
  },
  eventDate: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4
  },
  eventLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4
  },
  eventDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8
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
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%'
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
  eventTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16
  },
  typeOption: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  typeOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`
  },
  typeEmoji: {
    fontSize: 20
  },
  typeText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600'
  },
  modalButtons: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 16
  }
});
