-- EZ Coach Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  subscription_plan TEXT NOT NULL DEFAULT 'free' CHECK (subscription_plan IN ('free', 'premium', 'premium_pro')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  sport TEXT NOT NULL CHECK (sport IN ('volleyball', 'basketball', 'handball', 'futsal', 'football')),
  avatar_url TEXT,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('coach', 'captain', 'athlete')),
  position TEXT,
  jersey_number INTEGER,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Formations table
CREATE TABLE IF NOT EXISTS public.formations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  players JSONB NOT NULL DEFAULT '[]',
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chats table
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('general', 'strategy', 'training')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('training', 'friendly', 'championship', 'meeting')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercises table
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sport TEXT NOT NULL,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for teams
CREATE POLICY "Users can view teams they're members of" ON public.teams
  FOR SELECT USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = teams.id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create teams" ON public.teams
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Team creators can update their teams" ON public.teams
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Team creators can delete their teams" ON public.teams
  FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for team_members
CREATE POLICY "Users can view members of their teams" ON public.team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = team_members.team_id
      AND (teams.created_by = auth.uid() OR 
           EXISTS (SELECT 1 FROM public.team_members tm WHERE tm.team_id = teams.id AND tm.user_id = auth.uid()))
    )
  );

CREATE POLICY "Team coaches can add members" ON public.team_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = team_id
      AND team_members.user_id = auth.uid()
      AND team_members.role = 'coach'
    )
  );

-- RLS Policies for formations
CREATE POLICY "Users can view formations of their teams" ON public.formations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = formations.team_id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create formations for their teams" ON public.formations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = team_id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update formations they created" ON public.formations
  FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for chats
CREATE POLICY "Users can view chats of their teams" ON public.chats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = chats.team_id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chats for their teams" ON public.chats
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = team_id
      AND team_members.user_id = auth.uid()
    )
  );

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their team chats" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chats
      JOIN public.team_members ON team_members.team_id = chats.team_id
      WHERE chats.id = messages.chat_id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their team chats" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chats
      JOIN public.team_members ON team_members.team_id = chats.team_id
      WHERE chats.id = chat_id
      AND team_members.user_id = auth.uid()
    ) AND auth.uid() = user_id
  );

-- RLS Policies for events
CREATE POLICY "Users can view events of their teams" ON public.events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = events.team_id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create events for their teams" ON public.events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = team_id
      AND team_members.user_id = auth.uid()
    ) AND auth.uid() = created_by
  );

-- RLS Policies for exercises (public read)
CREATE POLICY "Anyone can view exercises" ON public.exercises
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_teams_created_by ON public.teams(created_by);
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_formations_team_id ON public.formations(team_id);
CREATE INDEX idx_chats_team_id ON public.chats(team_id);
CREATE INDEX idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX idx_events_team_id ON public.events(team_id);
CREATE INDEX idx_events_start_date ON public.events(start_date);

-- Enable Realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Insert sample volleyball exercises
INSERT INTO public.exercises (sport, category, name, description, difficulty) VALUES
  ('volleyball', 'Saque', 'Saque por Baixo', 'Técnica básica de saque com movimento de baixo para cima', 'beginner'),
  ('volleyball', 'Saque', 'Saque Viagem', 'Saque com movimento circular do braço, enviando a bola com efeito', 'intermediate'),
  ('volleyball', 'Recepção', 'Manchete', 'Posição de recepção com braços estendidos e unidos', 'beginner'),
  ('volleyball', 'Levantamento', 'Toque', 'Técnica de toque com as mãos acima da cabeça', 'beginner'),
  ('volleyball', 'Ataque', 'Cortada', 'Movimento de ataque com salto e batida na bola', 'intermediate'),
  ('volleyball', 'Bloqueio', 'Bloqueio Simples', 'Salto vertical com braços estendidos para bloquear', 'intermediate'),
  ('volleyball', 'Defesa', 'Mergulho', 'Técnica de defesa com mergulho para alcançar bolas baixas', 'advanced');
