import { Sport, SportType, PlanLimits, SubscriptionPlan } from "../types";

export const SPORTS: Record<SportType, Sport> = {
  volleyball: {
    id: "volleyball",
    name: "Voleibol",
    image: require("../../assets/volleyballIcon.png"),
    playersCount: 6,
    positions: ["Ponteiro", "Oposto", "Levantador", "Central", "Líbero"],
    courtDimensions: { width: 300, height: 600 },
  },
  basketball: {
    id: "basketball",
    name: "Basquete",
    image: require("../../assets/basketballIcon.png"),
    playersCount: 5,
    positions: ["Armador", "Ala-armador", "Ala", "Ala-pivô", "Pivô"],
    courtDimensions: { width: 280, height: 500 },
  },
  handball: {
    id: "handball",
    name: "Handebol",
    image: require("../../assets/handballIcon.png"),
    playersCount: 7,
    positions: ["Goleiro", "Armador Central", "Meias", "Pontas", "Pivô"],
    courtDimensions: { width: 300, height: 500 },
  },
  futsal: {
    id: "futsal",
    name: "Futsal",
    image: require("../../assets/footballIcon.png"),
    playersCount: 5,
    positions: ["Goleiro", "Fixo", "Ala", "Pivô"],
    courtDimensions: { width: 300, height: 500 },
  },
  football: {
    id: "football",
    name: "Futebol",
    image: require("../../assets/footballIcon.png"),
    playersCount: 11,
    positions: ["Goleiro", "Lateral", "Zagueiro", "Volante", "Meia", "Atacante"],
    courtDimensions: { width: 350, height: 600 },
  },
};

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  free: {
    teams: 1,
    plays: 3,
    chats: 1,
  },
  premium: {
    teams: 3,
    plays: 20,
    chats: 5,
  },
  premium_pro: {
    teams: 999,
    plays: 999,
    chats: 999,
  },
};

export const PLAN_PRICES = {
  premium: "R$ 19,90",
  premium_pro: "R$ 59,90",
};

export const COLORS = {
  primary: "#2E8B57",
  secondary: "#1E40AF",
  background: "#F5F5F5",
  card: "#FFFFFF",
  text: "#1F2937",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  error: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
};
