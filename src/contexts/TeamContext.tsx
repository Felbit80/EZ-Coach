import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { Team, TeamMember } from '../types';
import { useAuth } from './AuthContext';

interface TeamContextData {
  teams: Team[];
  currentTeam: Team | null;
  teamMembers: TeamMember[];
  loading: boolean;
  selectTeam: (team: Team) => void;
  createTeam: (team: Omit<Team, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => Promise<Team>;
  updateTeam: (id: string, updates: Partial<Team>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  loadTeams: () => Promise<void>;
  inviteMember: (teamId: string, email: string, role: TeamMember['role']) => Promise<void>;
}

const TeamContext = createContext<TeamContextData>({} as TeamContextData);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTeams();
    }
  }, [user]);

  useEffect(() => {
    if (currentTeam) {
      loadTeamMembers(currentTeam.id);
    }
  }, [currentTeam]);

  const loadTeams = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .or(`created_by.eq.${user.id},id.in.(select team_id from team_members where user_id = ${user.id})`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeams(data || []);
      
      if (data && data.length > 0 && !currentTeam) {
        setCurrentTeam(data[0]);
      }
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamMembers = async (teamId: string) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId);

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const selectTeam = (team: Team) => {
    setCurrentTeam(team);
  };

  const createTeam = async (teamData: Omit<Team, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('teams')
      .insert({
        ...teamData,
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw error;

    // Add creator as coach
    await supabase.from('team_members').insert({
      team_id: data.id,
      user_id: user.id,
      role: 'coach'
    });

    await loadTeams();
    return data;
  };

  const updateTeam = async (id: string, updates: Partial<Team>) => {
    const { error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await loadTeams();
  };

  const deleteTeam = async (id: string) => {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await loadTeams();
  };

  const inviteMember = async (teamId: string, email: string, role: TeamMember['role']) => {
    // In a real app, this would send an email invitation
    // For now, we'll just add the member if they exist
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !userData) throw new Error('User not found');

    const { error } = await supabase
      .from('team_members')
      .insert({
        team_id: teamId,
        user_id: userData.id,
        role
      });

    if (error) throw error;
    await loadTeamMembers(teamId);
  };

  return (
    <TeamContext.Provider value={{
      teams,
      currentTeam,
      teamMembers,
      loading,
      selectTeam,
      createTeam,
      updateTeam,
      deleteTeam,
      loadTeams,
      inviteMember
    }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);
