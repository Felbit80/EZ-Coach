import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { useTeam } from "../contexts/TeamContext";
import { supabase } from "../config/supabase";
import { Event } from "../types";
import { COLORS, SPORTS } from "../config/sports";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Text } from "../components/Text"

type RootStackParamList = {
  Chat: undefined;
  Tactical: undefined;
  Calendar: undefined;
  Teams: undefined;
};

export const HomeScreen = () => {
  const { user } = useAuth();
  const { currentTeam } = useTeam();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    console.log("🏠 HomeScreen: currentTeam mudou:", currentTeam?.id);
    if (currentTeam) {
      loadUpcomingEvents();
    } else {
      setUpcomingEvents([]);
    }
  }, [currentTeam]);

  const loadUpcomingEvents = async () => {
    if (!currentTeam) {
      console.log("❌ HomeScreen: Nenhum time selecionado");
      return;
    }

    console.log("🔄 HomeScreen: Carregando eventos para o time:", currentTeam.id);

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      console.log("📅 HomeScreen: Buscando eventos a partir de:", today.toISOString());

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("team_id", currentTeam.id)
        .gte("start_date", today.toISOString())
        .order("start_date", { ascending: true })
        .limit(3);

      if (error) {
        console.log("❌ HomeScreen: Erro ao carregar eventos:", error);
        throw error;
      }

      console.log("✅ HomeScreen: Eventos carregados:", data);
      console.log("🔢 HomeScreen: Quantidade de eventos:", data?.length || 0);

      if (data && data.length > 0) {
        data.forEach((event, index) => {
          console.log(`📋 Evento ${index + 1}:`, {
            id: event.id,
            title: event.title,
            type: event.type,
            start_date: event.start_date,
            formatted_date: new Date(event.start_date).toLocaleString("pt-BR"),
          });
        });
      }

      setUpcomingEvents(data || []);
    } catch (error) {
      console.error("💥 HomeScreen: Erro geral:", error);
    }
  };

  const getSportImage = (sport: string) => {
  switch (sport) {
    case 'volleyball':
      return require('../../assets/volleyballIcon.png');
    case 'basketball':
      return require('../../assets/basketballIcon.png');
    case 'football':
    case 'futsal':
      return require('../../assets/footballIcon.png');
    case 'handball':
      return require('../../assets/handballIcon.png');
  }
};

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const handleTacticalPress = () => {
    console.log("📋 Navegando para Tático");
    navigation.navigate("Tactical");
  };

  const handleChatPress = () => {
    console.log("💬 Navegando para Chat");
    navigation.navigate("Chat");
  };

  const handleCalendarPress = () => {
    console.log("📅 Navegando para Calendário");
    navigation.navigate("Calendar");
  };

  const handleTeamsPress = () => {
    console.log("👥 Navegando para Times");
    navigation.navigate("Teams");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text variant="semibold" style={styles.greeting}>{getGreeting()},</Text>
          <Text variant="semibold" style={styles.userName}>{user?.name}</Text>
        </View>

        {currentTeam ? (
          <>
            <View style={styles.teamCard}>
              <Image source={getSportImage(currentTeam.sport)} style={styles.teamEmoji} />
              <View style={styles.teamInfo}>
                <Text variant="semibold" style={styles.teamName}>{currentTeam.name}</Text>
                <Text variant="semibold" style={styles.sportName}>{SPORTS[currentTeam.sport]?.name || "Voleibol"}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text variant="semibold" style={styles.sectionTitle}>Próximos Eventos</Text>
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <View key={event.id} style={styles.eventCard}>
                    <Text variant="semibold" style={styles.eventType}>
                      {event.type === "training" && "🏋️ Treino"}
                      {event.type === "friendly" && "🤝 Amistoso"}
                      {event.type === "championship" && "🏆 Campeonato"}
                      {event.type === "meeting" && "👥 Reunião"}
                    </Text>
                    <Text variant="semibold" style={styles.eventTitle}>{event.title}</Text>
                    <Text variant="semibold" style={styles.eventDate}>
                      {new Date(event.start_date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text variant="semibold" style={styles.emptyText}>Nenhum evento agendado</Text>
                  <TouchableOpacity onPress={handleCalendarPress}>
                    <Text variant="semibold" style={styles.linkText}>Criar primeiro evento</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text variant="semibold" style={styles.sectionTitle}>Ações Rápidas</Text>
              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.actionCard} onPress={handleTacticalPress}>
                  <Text variant="semibold" style={styles.actionEmoji}>📋</Text>
                  <Text variant="semibold" style={styles.actionText}>Quadro Tático</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionCard} onPress={handleChatPress}>
                  <Text variant="semibold" style={styles.actionEmoji}>💬</Text>
                  <Text variant="semibold" style={styles.actionText}>Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionCard} onPress={handleCalendarPress}>
                  <Text variant="semibold" style={styles.actionEmoji}>📅</Text>
                  <Text variant="semibold" style={styles.actionText}>Eventos</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.actionCard} onPress={handleTeamsPress}>
                  <Text variant="semibold" style={styles.actionEmoji}>👥</Text>
                  <Text variant="semibold" style={styles.actionText}>Times</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionCard}>
                  <Text variant="semibold" style={styles.actionEmoji}>📊</Text>
                  <Text variant="semibold" style={styles.actionText}>Estatísticas</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionCard}>
                  <Text variant="semibold" style={styles.actionEmoji}>🏋️</Text>
                  <Text variant="semibold" style={styles.actionText}>Treinos</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text variant="semibold" style={styles.emptyTitle}>Nenhum time selecionado</Text>
            <Text variant="semibold" style={styles.emptyText}>Crie ou selecione um time para começar</Text>
            <TouchableOpacity onPress={handleTeamsPress}>
              <Text variant="semibold" style={styles.linkText}>Ir para Times</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 24,
    backgroundColor: COLORS.primary,
    paddingTop: 24,
  },
  greeting: {
    fontSize: 18,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  teamCard: {
    backgroundColor: COLORS.card,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamEmoji: {
    width: 40,
    height: 40,
    marginRight: 20
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  sportName: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  eventCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  eventType: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  linkText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
