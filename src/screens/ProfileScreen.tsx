import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/Button";
import { COLORS, PLAN_LIMITS, PLAN_PRICES } from "../config/sports";
import { SubscriptionPlan } from "../types";

export const ProfileScreen = () => {
  const { user, signOut, updateSubscription } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("premium");

  const handleSignOut = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert("Erro", error.message || "Erro ao sair");
          }
        },
      },
    ]);
  };

  const handleUpgrade = async () => {
    try {
      await updateSubscription(selectedPlan);
      setShowUpgradeModal(false);
      Alert.alert("Sucesso", "Plano atualizado com sucesso!");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao atualizar plano");
    }
  };

  if (!user) return null;

  const currentLimits = PLAN_LIMITS[user.subscription_plan];

  const getPlanName = (plan: SubscriptionPlan) => {
    switch (plan) {
      case "free":
        return "Free";
      case "premium":
        return "Premium";
      case "premium_pro":
        return "Premium Pro";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plano Atual</Text>
        <View style={styles.planCard}>
          <Text style={styles.planName}>{getPlanName(user.subscription_plan)}</Text>
          <View style={styles.limitsContainer}>
            <View style={styles.limitItem}>
              <Text style={styles.limitLabel}>Times</Text>
              <Text style={styles.limitValue}>{currentLimits.teams === 999 ? "Ilimitado" : currentLimits.teams}</Text>
            </View>
            <View style={styles.limitItem}>
              <Text style={styles.limitLabel}>Jogadas</Text>
              <Text style={styles.limitValue}>{currentLimits.plays === 999 ? "Ilimitado" : currentLimits.plays}</Text>
            </View>
            <View style={styles.limitItem}>
              <Text style={styles.limitLabel}>Chats</Text>
              <Text style={styles.limitValue}>{currentLimits.chats === 999 ? "Ilimitado" : currentLimits.chats}</Text>
            </View>
          </View>

          {user.subscription_plan === "free" && <Button title="Fazer Upgrade" onPress={() => setShowUpgradeModal(true)} fullWidth />}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Editar Perfil</Text>
          <Text style={styles.menuItemIcon}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Notificações</Text>
          <Text style={styles.menuItemIcon}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Privacidade</Text>
          <Text style={styles.menuItemIcon}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Ajuda e Suporte</Text>
          <Text style={styles.menuItemIcon}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Button title="Sair" onPress={handleSignOut} variant="outline" fullWidth />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>EZ Coach v1.0.0</Text>
      </View>

      {/* Upgrade Modal */}
      <Modal visible={showUpgradeModal} animationType="slide" transparent onRequestClose={() => setShowUpgradeModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha seu Plano</Text>

            <TouchableOpacity
              style={[styles.planOption, selectedPlan === "premium" && styles.planOptionSelected]}
              onPress={() => setSelectedPlan("premium")}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planOptionName}>Premium</Text>
                <Text style={styles.planPrice}>{PLAN_PRICES.premium}/mês</Text>
              </View>
              <Text style={styles.planFeature}>✓ 3 times</Text>
              <Text style={styles.planFeature}>✓ 20 jogadas</Text>
              <Text style={styles.planFeature}>✓ 5 chats</Text>
              <Text style={styles.planFeature}>✓ Suporte prioritário</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.planOption, selectedPlan === "premium_pro" && styles.planOptionSelected]}
              onPress={() => setSelectedPlan("premium_pro")}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planOptionName}>Premium Pro</Text>
                <Text style={styles.planPrice}>{PLAN_PRICES.premium_pro}/mês</Text>
              </View>
              <Text style={styles.planFeature}>✓ Times ilimitados</Text>
              <Text style={styles.planFeature}>✓ Jogadas ilimitadas</Text>
              <Text style={styles.planFeature}>✓ Chats ilimitados</Text>
              <Text style={styles.planFeature}>✓ Suporte VIP</Text>
              <Text style={styles.planFeature}>✓ Recursos exclusivos</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setShowUpgradeModal(false)} variant="outline" fullWidth />
              <Button title="Assinar" onPress={handleUpgrade} fullWidth />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 24,
    alignItems: "center",
    paddingTop: 60,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  section: {
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  planCard: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  planName: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 16,
  },
  limitsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  limitItem: {
    alignItems: "center",
  },
  limitLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  limitValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  menuItem: {
    backgroundColor: COLORS.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  menuItemIcon: {
    fontSize: 24,
    color: COLORS.textSecondary,
  },
  footer: {
    padding: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
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
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 24,
    textAlign: "center",
  },
  planOption: {
    backgroundColor: COLORS.background,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  planOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  planOptionName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
  },
  planFeature: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  modalButtons: {
    flexDirection: "column",
    gap: 12,
    marginTop: 8,
  },
});
