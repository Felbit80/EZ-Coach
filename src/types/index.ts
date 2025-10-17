export type SportType = 'volleyball' | 'basketball' | 'handball' | 'futsal' | 'football';

export interface Sport {
  id: SportType;
  name: string;
  emoji: string;
  playersCount: number;
  positions: string[];
  courtDimensions: {
    width: number;
    height: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  subscription_plan: SubscriptionPlan;
}

export type SubscriptionPlan = 'free' | 'premium' | 'premium_pro';

export interface PlanLimits {
  teams: number;
  plays: number;
  chats: number;
}

export type UserRole = 'coach' | 'captain' | 'athlete';

export interface Team {
  id: string;
  name: string;
  sport: SportType;
  avatar_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: UserRole;
  position?: string;
  jersey_number?: number;
  joined_at: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  jersey_number: number;
  x: number;
  y: number;
}

export interface Formation {
  id: string;
  team_id: string;
  name: string;
  sport: SportType;
  players: Player[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Chat {
  id: string;
  team_id: string;
  name: string;
  type: 'general' | 'strategy' | 'training';
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    name: string;
    avatar_url?: string;
  };
}

export type EventType = 'training' | 'friendly' | 'championship' | 'meeting';

export interface Event {
  id: string;
  team_id: string;
  title: string;
  description?: string;
  type: EventType;
  start_date: string;
  end_date: string;
  location?: string;
  created_by: string;
  created_at: string;
}

export interface Exercise {
  id: string;
  sport: SportType;
  category: string;
  name: string;
  description: string;
  video_url?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}
